/**
 * @module Watchers/DOMWatcher
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import {
  MutationCategory,
  CommaSeparatedStr,
  AtLeastOne,
} from "@lisn/globals/types";

import { DOM_CATEGORIES_SPACE } from "@lisn/utils/dom";
import {
  getIgnoreMove,
  clearIgnoreMove,
  ignoreMove,
} from "@lisn/utils/dom-alter";
import { waitForElement } from "@lisn/utils/dom-events";
import { logError } from "@lisn/utils/log";
import { omitKeys } from "@lisn/utils/misc";
import { objToStrKey } from "@lisn/utils/text";
import { validateStrList } from "@lisn/utils/validation";

import {
  CallbackHandler,
  Callback,
  wrapCallback,
} from "@lisn/modules/callback";
import { newXMap } from "@lisn/modules/x-map";

import debug from "@lisn/debug/debug";

/**
 * {@link DOMWatcher} listens for changes do the DOM tree. It's built on top of
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver | MutationObserver}.
 *
 * It manages registered callbacks globally and reuses MutationObservers for
 * more efficient performance.
 *
 * Each instance of DOMWatcher manages up to two MutationObservers: one
 * for `childList` changes and one for attribute changes, and it disconnects
 * them when there are no active callbacks for the relevant type.
 *
 * `characterData` and changes to base
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Node | Node}s
 * (non-{@link https://developer.mozilla.org/en-US/docs/Web/API/Element | Element})
 * are not supported.
 */
export class DOMWatcher {
  /**
   * Call the given handler whenever there's a matching mutation within this
   * DOMWatcher's {@link DOMWatcherConfig.root | root}.
   *
   * If {@link OnMutationOptions.skipInitial | options.skipInitial} is `false`
   * (default), _and_ {@link OnMutationOptions.selector | options.selector} is
   * given, _and_ {@link OnMutationOptions.categories | options.categories}
   * includes "added", the handler is also called (almost) immediately with all
   * existing elements matching the selector under this DOMWatcher's
   * {@link DOMWatcherConfig.root | root}.
   *
   * **IMPORTANT:** The same handler can _not_ be added multiple times, even if
   * the options differ. If the handler has already been added, it is removed
   * and re-added with the current options.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the options are not valid.
   */
  readonly onMutation: (
    handler: OnMutationHandler,
    options?: OnMutationOptions,
  ) => Promise<void>;

  /**
   * Removes a previously added handler.
   */
  readonly offMutation: (handler: OnMutationHandler) => void;

  /**
   * Ignore an upcoming moving/adding/removing of an element.
   *
   * The operation must complete within the next cycle, by the time
   * MutationObserver calls us.
   *
   * Use this to prevent this instance of DOMWatcher from calling any callbacks
   * that listen for relevant changes as a result of this operation, to prevent
   * loops for example.
   *
   * **IMPORTANT:**
   *
   * Ignoring moving of an element from a parent _inside_ this DOMWatcher's
   * root to another parent that's _outside_ the root, will work as expected,
   * even though the "adding to the new parent" mutation will not be observed.
   * This is because the element's current parent at the time of the mutation
   * callback can be examined.
   *
   * However if you want to ignore moving of an element _from a parent outside
   * this DOMWatcher's root_ you need to specify from: null since the "removal
   * from the old parent" mutation would not be observed and there's no way to
   * examine it's previous parent at the time the "adding to the new parent"
   * mutation is observed.
   *
   * For this reason, setting `options.from` to be an element that's not under
   * the root is internally treated the same as `options.from: null`.
   */
  readonly ignoreMove: (target: Element, options: MoveOptions) => void;

  /**
   * Creates a new instance of DOMWatcher with the given
   * {@link DOMWatcherConfig}. It does not save it for future reuse.
   */
  static create(config?: DOMWatcherConfig) {
    return new DOMWatcher(getConfig(config), CONSTRUCTOR_KEY);
  }

  /**
   * Returns an existing instance of DOMWatcher with the given
   * {@link DOMWatcherConfig}, or creates a new one.
   *
   * **NOTE:** It saves it for future reuse, so don't use this for temporary
   * short-lived watchers.
   */
  static reuse(config?: DOMWatcherConfig) {
    const myConfig = getConfig(config);
    const configStrKey = objToStrKey(omitKeys(myConfig, { _root: null }));

    const root = myConfig._root === MH.getBody() ? null : myConfig._root;
    let instance = instances.get(root)?.get(configStrKey);
    if (!instance) {
      instance = new DOMWatcher(myConfig, CONSTRUCTOR_KEY);
      instances.sGet(root).set(configStrKey, instance);
    }

    return instance;
  }

  private constructor(
    config: DOMWatcherConfigInternal,
    key: typeof CONSTRUCTOR_KEY,
  ) {
    if (key !== CONSTRUCTOR_KEY) {
      throw MH.illegalConstructorError("DOMWatcher.create");
    }

    const logger = debug
      ? new debug.Logger({ name: "DOMWatcher", logAtCreation: config })
      : null;

    const buffer = newXMap<Element, MutationOperationInternal>((t) => ({
      _target: t,
      _categoryBitmask: 0,
      _attributes: MH.newSet(),
      _addedTo: null,
      _removedFrom: null,
    }));

    const allCallbacks = MH.newMap<
      OnMutationHandler,
      {
        _callback: OnMutationCallback;
        _options: OnMutationOptionsInternal;
      }
    >();

    // ----------

    let timer: ReturnType<typeof setTimeout> | null = null;
    const mutationHandler = (records: MutationRecord[]) => {
      debug: logger?.debug9(`Got ${records.length} new records`, records);

      for (const record of records) {
        const target = MH.targetOf(record);
        const recType = record.type;

        /* istanbul ignore next */
        if (!MH.isElement(target)) {
          continue;
        }

        if (recType === MC.S_CHILD_LIST) {
          for (const child of record.addedNodes) {
            if (MH.isElement(child)) {
              const operation = buffer.sGet(child);
              operation._addedTo = target;
              operation._categoryBitmask |= ADDED_BIT;
            }
          }

          for (const child of record.removedNodes) {
            if (MH.isElement(child)) {
              const operation = buffer.sGet(child);
              operation._removedFrom = target;
              operation._categoryBitmask |= REMOVED_BIT;
            }
          }

          //
        } else if (recType === MC.S_ATTRIBUTES && record.attributeName) {
          const operation = buffer.sGet(target);
          operation._attributes.add(record.attributeName);
          operation._categoryBitmask |= ATTRIBUTE_BIT;
        }
      }

      // Schedule flushing of the buffer asynchronously so that we can combine
      // the records from the two MutationObservers.
      if (!timer && MH.sizeOf(buffer)) {
        timer = MH.setTimer(() => {
          debug: logger?.debug9(`Processing ${buffer.size} operations`);
          for (const operation of buffer.values()) {
            if (shouldSkipOperation(operation)) {
              debug: logger?.debug10("Skipping operation", operation);
            } else {
              processOperation(operation);
            }
          }

          buffer.clear();
          timer = null;
        }, 0);
      }
    };

    const observers: Record<MutationType, MyObserver> = {
      [MC.S_CHILD_LIST]: {
        _observer: MH.newMutationObserver(mutationHandler),
        _isActive: false,
      },
      [MC.S_ATTRIBUTES]: {
        _observer: MH.newMutationObserver(mutationHandler),
        _isActive: false,
      },
    };

    // ----------

    const createCallback = (
      handler: OnMutationHandler,
      options: OnMutationOptionsInternal,
    ): OnMutationCallback => {
      MH.remove(allCallbacks.get(handler)?._callback);

      debug: logger?.debug5("Adding/updating handler", options);
      const callback = wrapCallback(handler);
      callback.onRemove(() => deleteHandler(handler));

      allCallbacks.set(handler, { _callback: callback, _options: options });
      return callback;
    };

    // ----------

    const setupOnMutation = async (
      handler: OnMutationHandler,
      userOptions: OnMutationOptions | undefined,
    ) => {
      const options = getOptions(userOptions ?? {});
      const callback = createCallback(handler, options);

      let root = config._root ?? MH.getBody();
      if (!root) {
        root = await waitForElement(MH.getBody);
      } else {
        // So that the call is always async
        await null;
      }

      if (callback.isRemoved()) {
        return;
      }

      if (options._categoryBitmask & (ADDED_BIT | REMOVED_BIT)) {
        activateObserver(root, MC.S_CHILD_LIST);
      }

      if (options._categoryBitmask & ATTRIBUTE_BIT) {
        activateObserver(root, MC.S_ATTRIBUTES);
      }

      if (
        userOptions?.skipInitial ||
        !options._selector ||
        !(options._categoryBitmask & ADDED_BIT)
      ) {
        return;
      }

      // As some of the matching elements that currently exist in the root may
      // have just been added and therefore in the MutationObserver's queue, to
      // avoid calling the handler with those entries twice, we empty its queue
      // now and process it (which would also invoke the newly added callback).
      // Then we skip any elements returned in querySelectorAll that were in
      // the queue.

      const childQueue = observers[MC.S_CHILD_LIST]._observer.takeRecords();
      mutationHandler(childQueue);

      for (const element of [
        ...MH.querySelectorAll(root, options._selector),
        ...(root.matches(options._selector) ? [root] : []),
      ]) {
        const initOperation: MutationOperationInternal = {
          _target: element,
          _categoryBitmask: ADDED_BIT,
          _attributes: MH.newSet(),
          _addedTo: MH.parentOf(element),
          _removedFrom: null,
        };

        const bufferedOperation = buffer.get(element);
        const diffOperation = getDiffOperation(
          initOperation,
          bufferedOperation,
        );

        if (diffOperation) {
          if (shouldSkipOperation(diffOperation)) {
            debug: logger?.debug10("Skipping operation", diffOperation);
          } else {
            debug: logger?.debug5("Calling initially with", diffOperation);
            await invokeCallback(callback, diffOperation);
          }
        }
      }
    };

    // ----------

    const deleteHandler = (handler: OnMutationHandler) => {
      MH.deleteKey(allCallbacks, handler);

      let activeCategories = 0;
      for (const entry of allCallbacks.values()) {
        activeCategories |= entry._options._categoryBitmask;
      }

      if (!(activeCategories & (ADDED_BIT | REMOVED_BIT))) {
        deactivateObserver(MC.S_CHILD_LIST);
      }

      if (!(activeCategories & ATTRIBUTE_BIT)) {
        deactivateObserver(MC.S_ATTRIBUTES);
      }
    };

    // ----------

    const processOperation = (operation: MutationOperationInternal) => {
      debug: logger?.debug10("Processing operation", operation);

      for (const entry of allCallbacks.values()) {
        const categoryBitmask = entry._options._categoryBitmask;
        const target = entry._options._target;
        const selector = entry._options._selector;

        if (!(operation._categoryBitmask & categoryBitmask)) {
          debug: logger?.debug10(`Category does not match: ${categoryBitmask}`);
          continue;
        }

        const currentTargets = [];
        if (target) {
          if (!operation._target.contains(target)) {
            debug: logger?.debug10("Target does not match", target);
            continue;
          }

          currentTargets.push(target);
        }

        if (selector) {
          const matches = [...MH.querySelectorAll(operation._target, selector)];

          if (operation._target.matches(selector)) {
            matches.push(operation._target);
          }

          if (!MH.lengthOf(matches)) {
            debug: logger?.debug10(`Selector does not match: ${selector}`);
            continue;
          }

          currentTargets.push(...matches);
        }

        invokeCallback(entry._callback, operation, currentTargets);
      }
    };

    // ----------

    const activateObserver = (root: Element, mutationType: MutationType) => {
      if (!observers[mutationType]._isActive) {
        debug: logger?.debug3(
          `Activating mutation observer for '${mutationType}'`,
        );
        observers[mutationType]._observer.observe(root, {
          [mutationType]: true,
          subtree: config._subtree,
        });
        observers[mutationType]._isActive = true;
      }
    };

    // ----------

    const deactivateObserver = (mutationType: MutationType) => {
      if (observers[mutationType]._isActive) {
        debug: logger?.debug3(
          `Disconnecting mutation observer for '${mutationType}'`,
        );
        observers[mutationType]._observer.disconnect();
        observers[mutationType]._isActive = false;
      }
    };

    // ----------

    const shouldSkipOperation = (
      operation: MutationOperationInternal,
    ): boolean => {
      const target = operation._target;
      const requestToSkip = getIgnoreMove(target);
      if (!requestToSkip) {
        return false;
      }

      const removedFrom = operation._removedFrom;
      const addedTo = MH.parentOf(target);
      const requestFrom = requestToSkip.from;
      const requestTo = requestToSkip.to;

      const root = config._root ?? MH.getBody();
      // If "from" is currently outside our root, we may not have seen a
      // removal operation.
      if (
        (removedFrom === requestFrom || !root.contains(requestFrom)) &&
        addedTo === requestTo
      ) {
        clearIgnoreMove(target);
        return true;
      }

      return false;
    };

    // ----------

    this.ignoreMove = ignoreMove;

    // ----------

    this.onMutation = setupOnMutation;

    // ----------

    this.offMutation = (handler) => {
      debug: logger?.debug5("Removing handler");
      MH.remove(allCallbacks.get(handler)?._callback);
    };
  }
}

/**
 * @interface
 */
export type DOMWatcherConfig = {
  /**
   * The root element to observe for changes.
   *
   * It cannot be overridden on a per-callback basis.
   *
   * @defaultValue document.body
   */
  root?: Element | null;

  /**
   * Whether to observe root's subtree for changes or just direct descendants.
   *
   * It cannot be overridden on a per-callback basis.
   *
   * @defaultValue true
   */
  subtree?: boolean;
};

/**
 * @interface
 */
export type OnMutationOptions = {
  /**
   * If this is given, then the handler would only be called for operations
   * where the target is _either_ the given element or an ancestor of it, i.e.
   * it {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/contains | Node:contains} it.
   *
   * @defaultValue undefined
   */
  target?: Element;

  /**
   * If this is given, then the handler would only be called for operations
   * where the target matches the given selector _or contains an element
   * matching the given selector_.
   *
   * @defaultValue undefined
   */
  selector?: string;

  /**
   * Specifies a list of {@link MutationCategory}s to target for.
   *
   * If not given, then the handler is called for any of the supported
   * mutations.
   *
   * It can be a comma-separated list of category names or an array of such
   * names.
   *
   * @defaultValue undefined
   */
  categories?: CommaSeparatedStr<MutationCategory> | MutationCategory[];

  /**
   * Do not call the handler until there's a future matching mutation.
   *
   * By default, if `selector` is given, and `categories` includes `added`, we
   * call the handler (almost) immediately with all elements matching selector
   * relative to this DOMWatcher's root.
   *
   * The initial operation will contain just the element and
   * `addedTo: <current parent>`.
   *
   * @defaultValue false
   */
  skipInitial?: boolean;
};

export type MoveOptions = AtLeastOne<{
  /**
   * If to is missing or null, it's a removal operation.
   */
  to: Element | null;

  /**
   * If from is missing or null, it's an insertion operation.
   */
  from: Element | null;
}>;

export type MutationOperation = {
  /**
   * The target that was changed.
   */
  target: Element;

  /**
   * The target that the callback was interested in.
   *
   * If `selector` is given as part of {@link OnMutationOptions}, then
   * `currentTarget` will point to the target that matched the selector
   * starting at the operation's `target` as the root. If the operation's
   * `target` contains more than one element matching selector, the callback
   * will be called once for _each_ matching child.
   *
   * If `target` is given as part of {@link OnMutationOptions}, then
   * `currentTarget` will be that element.
   */
  currentTarget: Element;

  /**
   * The list of attributes that were changed in this round.
   */
  attributes: Set<string>;

  /**
   * The element that the target was added to, i.e. it's new parent. It is null
   * if the target was not moved to a new element _during this round_. It does
   * not mean that this is its current parent.
   */
  addedTo: Element | null;

  /**
   * The element that the target was removed from, i.e. it's old parent. It is
   * null if the target was not removed from a previous element _during this
   * round_. It does not mean it did not previously have a parent, but that its
   * removal was not observed.
   */
  removedFrom: Element | null;
};

/**
 * The handler is invoked with one argument:
 *
 * - a {@link MutationOperation} for a set of mutations related to a particular
 *   element
 *
 * The handler could be invoked multiple times in each "round" (cycle of event
 * loop) if there are mutation operations for more than one element that match
 * the supplied {@link OnMutationOptions}.
 */
export type OnMutationHandlerArgs = [MutationOperation];
export type OnMutationCallback = Callback<OnMutationHandlerArgs>;
export type OnMutationHandler =
  | CallbackHandler<OnMutationHandlerArgs>
  | OnMutationCallback;

// ----------------------------------------

type DOMWatcherConfigInternal = {
  _root: Element | null;
  _subtree: boolean;
};

type OnMutationOptionsInternal = {
  _target: Element | null;
  _selector: string;
  _categoryBitmask: number;
};

type MyObserver = {
  _observer: MutationObserver;
  _isActive: boolean;
};

type MutationType = "childList" | "attributes";

type MutationOperationInternal = {
  _target: Element;
  _attributes: Set<string>;
  _addedTo: Element | null;
  _removedFrom: Element | null;
  _categoryBitmask: number;
};

const CONSTRUCTOR_KEY: unique symbol = MC.SYMBOL() as typeof CONSTRUCTOR_KEY;
const instances = newXMap<Element | null, Map<string, DOMWatcher>>(() =>
  MH.newMap(),
);

const getConfig = (
  config: DOMWatcherConfig | undefined,
): DOMWatcherConfigInternal => {
  return {
    _root: config?.root ?? null,
    _subtree: config?.subtree ?? true,
  };
};

const CATEGORIES_BITS = DOM_CATEGORIES_SPACE.bit;
const ADDED_BIT = CATEGORIES_BITS[MC.S_ADDED];
const REMOVED_BIT = CATEGORIES_BITS[MC.S_REMOVED];
const ATTRIBUTE_BIT = CATEGORIES_BITS[MC.S_ATTRIBUTE];

// ----------------------------------------

const getOptions = (options: OnMutationOptions): OnMutationOptionsInternal => {
  let categoryBitmask = 0;
  const categories = validateStrList(
    "categories",
    options.categories,
    DOM_CATEGORIES_SPACE.has,
  );

  if (categories) {
    for (const cat of categories) {
      categoryBitmask |= CATEGORIES_BITS[cat];
    }
  } else {
    categoryBitmask = DOM_CATEGORIES_SPACE.bitmask; // default: all
  }

  const selector = options.selector ?? "";
  if (!MH.isString(selector)) {
    throw MH.usageError("'selector' must be a string");
  }

  return {
    _categoryBitmask: categoryBitmask,
    _target: options.target ?? null,
    _selector: selector,
  };
};

const getDiffOperation = (
  operationA: MutationOperationInternal,
  operationB: MutationOperationInternal | undefined,
): MutationOperationInternal | null => {
  if (!operationB || operationA._target !== operationB._target) {
    return operationA;
  }

  const attributes = MH.newSet<string>();
  for (const attr of operationA._attributes) {
    if (!operationB._attributes.has(attr)) {
      attributes.add(attr);
    }
  }

  const categoryBitmask =
    operationA._categoryBitmask ^ operationB._categoryBitmask;

  const addedTo =
    operationA._addedTo === operationB._addedTo ? null : operationA._addedTo;

  const removedFrom =
    operationA._removedFrom === operationB._removedFrom
      ? null
      : operationA._removedFrom;

  if (!MH.sizeOf(attributes) && !categoryBitmask && !addedTo && !removedFrom) {
    return null;
  }

  return {
    _target: operationA._target,
    _categoryBitmask: categoryBitmask,
    _attributes: attributes,
    _addedTo: addedTo,
    _removedFrom: removedFrom,
  };
};

const invokeCallback = (
  callback: OnMutationCallback,
  operation: MutationOperationInternal,
  currentTargets: Element[] = [],
) => {
  if (!MH.lengthOf(currentTargets)) {
    currentTargets = [operation._target];
  }

  for (const currentTarget of currentTargets) {
    callback
      .invoke({
        target: operation._target,
        currentTarget,
        attributes: operation._attributes,
        addedTo: operation._addedTo,
        removedFrom: operation._removedFrom,
      })
      .catch(logError);
  }
};
