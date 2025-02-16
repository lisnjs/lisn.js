"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DOMWatcher = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _dom = require("../utils/dom.cjs");
var _domAlter = require("../utils/dom-alter.cjs");
var _domEvents = require("../utils/dom-events.cjs");
var _log = require("../utils/log.cjs");
var _misc = require("../utils/misc.cjs");
var _text = require("../utils/text.cjs");
var _validation = require("../utils/validation.cjs");
var _callback = require("../modules/callback.cjs");
var _xMap = require("../modules/x-map.cjs");
var _debug = _interopRequireDefault(require("../debug/debug.cjs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Watchers/DOMWatcher
 */
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
class DOMWatcher {
  /**
   * Creates a new instance of DOMWatcher with the given
   * {@link DOMWatcherConfig}. It does not save it for future reuse.
   */
  static create(config = {}) {
    return new DOMWatcher(getConfig(config), CONSTRUCTOR_KEY);
  }

  /**
   * Returns an existing instance of DOMWatcher with the given
   * {@link DOMWatcherConfig}, or creates a new one.
   *
   * **NOTE:** It saves it for future reuse, so don't use this for temporary
   * short-lived watchers.
   */
  static reuse(config = {}) {
    var _instances$get;
    const myConfig = getConfig(config);
    const configStrKey = (0, _text.objToStrKey)((0, _misc.omitKeys)(myConfig, {
      _root: null
    }));
    const root = myConfig._root === MH.getBody() ? null : myConfig._root;
    let instance = (_instances$get = instances.get(root)) === null || _instances$get === void 0 ? void 0 : _instances$get.get(configStrKey);
    if (!instance) {
      instance = new DOMWatcher(myConfig, CONSTRUCTOR_KEY);
      instances.sGet(root).set(configStrKey, instance);
    }
    return instance;
  }
  constructor(config, key) {
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
    _defineProperty(this, "onMutation", void 0);
    /**
     * Removes a previously added handler.
     */
    _defineProperty(this, "offMutation", void 0);
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
    _defineProperty(this, "ignoreMove", void 0);
    if (key !== CONSTRUCTOR_KEY) {
      throw MH.illegalConstructorError("DOMWatcher.create");
    }
    const logger = _debug.default ? new _debug.default.Logger({
      name: "DOMWatcher",
      logAtCreation: config
    }) : null;
    const buffer = (0, _xMap.newXMap)(t => ({
      _target: t,
      _categoryBitmask: 0,
      _attributes: MH.newSet(),
      _addedTo: null,
      _removedFrom: null
    }));
    const allCallbacks = MH.newMap();

    // ----------

    let timer = null;
    const mutationHandler = records => {
      debug: logger === null || logger === void 0 || logger.debug9(`Got ${records.length} new records`, records);
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
          debug: logger === null || logger === void 0 || logger.debug9(`Processing ${buffer.size} operations`);
          for (const operation of buffer.values()) {
            if (shouldSkipOperation(operation)) {
              debug: logger === null || logger === void 0 || logger.debug10("Skipping operation", operation);
            } else {
              processOperation(operation);
            }
          }
          buffer.clear();
          timer = null;
        }, 0);
      }
    };
    const observers = {
      [MC.S_CHILD_LIST]: {
        _observer: MH.newMutationObserver(mutationHandler),
        _isActive: false
      },
      [MC.S_ATTRIBUTES]: {
        _observer: MH.newMutationObserver(mutationHandler),
        _isActive: false
      }
    };

    // ----------

    const createCallback = (handler, options) => {
      var _allCallbacks$get;
      MH.remove((_allCallbacks$get = allCallbacks.get(handler)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get._callback);
      debug: logger === null || logger === void 0 || logger.debug5("Adding/updating handler", options);
      const callback = (0, _callback.wrapCallback)(handler);
      callback.onRemove(() => deleteHandler(handler));
      allCallbacks.set(handler, {
        _callback: callback,
        _options: options
      });
      return callback;
    };

    // ----------

    const setupOnMutation = async (handler, userOptions) => {
      const options = getOptions(userOptions || {});
      const callback = createCallback(handler, options);
      let root = config._root || MH.getBody();
      if (!root) {
        root = await (0, _domEvents.waitForElement)(MH.getBody);
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
      if (userOptions !== null && userOptions !== void 0 && userOptions.skipInitial || !options._selector || !(options._categoryBitmask & ADDED_BIT)) {
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
      for (const element of [...MH.querySelectorAll(root, options._selector), ...(root.matches(options._selector) ? [root] : [])]) {
        const initOperation = {
          _target: element,
          _categoryBitmask: ADDED_BIT,
          _attributes: MH.newSet(),
          _addedTo: MH.parentOf(element),
          _removedFrom: null
        };
        const bufferedOperation = buffer.get(element);
        const diffOperation = getDiffOperation(initOperation, bufferedOperation);
        if (diffOperation) {
          if (shouldSkipOperation(diffOperation)) {
            debug: logger === null || logger === void 0 || logger.debug10("Skipping operation", diffOperation);
          } else {
            debug: logger === null || logger === void 0 || logger.debug5("Calling initially with", diffOperation);
            await invokeCallback(callback, diffOperation);
          }
        }
      }
    };

    // ----------

    const deleteHandler = handler => {
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

    const processOperation = operation => {
      debug: logger === null || logger === void 0 || logger.debug10("Processing operation", operation);
      for (const entry of allCallbacks.values()) {
        const categoryBitmask = entry._options._categoryBitmask;
        const target = entry._options._target;
        const selector = entry._options._selector;
        if (!(operation._categoryBitmask & categoryBitmask)) {
          debug: logger === null || logger === void 0 || logger.debug10(`Category does not match: ${categoryBitmask}`);
          continue;
        }
        const currentTargets = [];
        if (target) {
          if (!operation._target.contains(target)) {
            debug: logger === null || logger === void 0 || logger.debug10("Target does not match", target);
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
            debug: logger === null || logger === void 0 || logger.debug10(`Selector does not match: ${selector}`);
            continue;
          }
          currentTargets.push(...matches);
        }
        invokeCallback(entry._callback, operation, currentTargets);
      }
    };

    // ----------

    const activateObserver = (root, mutationType) => {
      if (!observers[mutationType]._isActive) {
        debug: logger === null || logger === void 0 || logger.debug3(`Activating mutation observer for '${mutationType}'`);
        observers[mutationType]._observer.observe(root, {
          [mutationType]: true,
          subtree: config._subtree
        });
        observers[mutationType]._isActive = true;
      }
    };

    // ----------

    const deactivateObserver = mutationType => {
      if (observers[mutationType]._isActive) {
        debug: logger === null || logger === void 0 || logger.debug3(`Disconnecting mutation observer for '${mutationType}'`);
        observers[mutationType]._observer.disconnect();
        observers[mutationType]._isActive = false;
      }
    };

    // ----------

    const shouldSkipOperation = operation => {
      const target = operation._target;
      const requestToSkip = (0, _domAlter.getIgnoreMove)(target);
      if (!requestToSkip) {
        return false;
      }
      const removedFrom = operation._removedFrom;
      const addedTo = MH.parentOf(target);
      const requestFrom = requestToSkip.from;
      const requestTo = requestToSkip.to;
      const root = config._root || MH.getBody();
      // If "from" is currently outside our root, we may not have seen a
      // removal operation.
      if ((removedFrom === requestFrom || !root.contains(requestFrom)) && addedTo === requestTo) {
        (0, _domAlter.clearIgnoreMove)(target);
        return true;
      }
      return false;
    };

    // ----------

    this.ignoreMove = _domAlter.ignoreMove;

    // ----------

    this.onMutation = setupOnMutation;

    // ----------

    this.offMutation = handler => {
      var _allCallbacks$get2;
      debug: logger === null || logger === void 0 || logger.debug5("Removing handler");
      MH.remove((_allCallbacks$get2 = allCallbacks.get(handler)) === null || _allCallbacks$get2 === void 0 ? void 0 : _allCallbacks$get2._callback);
    };
  }
}

/**
 * @interface
 */

/**
 * @interface
 */

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

// ----------------------------------------
exports.DOMWatcher = DOMWatcher;
const CONSTRUCTOR_KEY = MC.SYMBOL();
const instances = (0, _xMap.newXMap)(() => MH.newMap());
const getConfig = config => {
  var _config$subtree;
  return {
    _root: config.root || null,
    _subtree: (_config$subtree = config.subtree) !== null && _config$subtree !== void 0 ? _config$subtree : true
  };
};
const CATEGORIES_BITS = _dom.DOM_CATEGORIES_SPACE.bit;
const ADDED_BIT = CATEGORIES_BITS[MC.S_ADDED];
const REMOVED_BIT = CATEGORIES_BITS[MC.S_REMOVED];
const ATTRIBUTE_BIT = CATEGORIES_BITS[MC.S_ATTRIBUTE];

// ----------------------------------------

const getOptions = options => {
  let categoryBitmask = 0;
  const categories = (0, _validation.validateStrList)("categories", options.categories, _dom.DOM_CATEGORIES_SPACE.has);
  if (categories) {
    for (const cat of categories) {
      categoryBitmask |= CATEGORIES_BITS[cat];
    }
  } else {
    categoryBitmask = _dom.DOM_CATEGORIES_SPACE.bitmask; // default: all
  }
  const selector = options.selector || "";
  if (!MH.isString(selector)) {
    throw MH.usageError("'selector' must be a string");
  }
  return {
    _categoryBitmask: categoryBitmask,
    _target: options.target || null,
    _selector: options.selector || ""
  };
};
const getDiffOperation = (operationA, operationB) => {
  if (!operationB || operationA._target !== operationB._target) {
    return operationA;
  }
  const attributes = MH.newSet();
  for (const attr of operationA._attributes) {
    if (!operationB._attributes.has(attr)) {
      attributes.add(attr);
    }
  }
  const categoryBitmask = operationA._categoryBitmask ^ operationB._categoryBitmask;
  const addedTo = operationA._addedTo === operationB._addedTo ? null : operationA._addedTo;
  const removedFrom = operationA._removedFrom === operationB._removedFrom ? null : operationA._removedFrom;
  if (!MH.sizeOf(attributes) && !categoryBitmask && !addedTo && !removedFrom) {
    return null;
  }
  return {
    _target: operationA._target,
    _categoryBitmask: categoryBitmask,
    _attributes: attributes,
    _addedTo: addedTo,
    _removedFrom: removedFrom
  };
};
const invokeCallback = (callback, operation, currentTargets = []) => {
  if (!MH.lengthOf(currentTargets)) {
    currentTargets = [operation._target];
  }
  for (const currentTarget of currentTargets) {
    callback.invoke({
      target: operation._target,
      currentTarget,
      attributes: operation._attributes,
      addedTo: operation._addedTo,
      removedFrom: operation._removedFrom
    }).catch(_log.logError);
  }
};
//# sourceMappingURL=dom-watcher.cjs.map