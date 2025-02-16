/**
 * @module Watchers/DOMWatcher
 */
import { MutationCategory, CommaSeparatedStr, AtLeastOne } from "../globals/types.js";
import { CallbackHandler, Callback } from "../modules/callback.js";
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
export declare class DOMWatcher {
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
    readonly onMutation: (handler: OnMutationHandler, options?: OnMutationOptions) => Promise<void>;
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
    static create(config?: DOMWatcherConfig): DOMWatcher;
    /**
     * Returns an existing instance of DOMWatcher with the given
     * {@link DOMWatcherConfig}, or creates a new one.
     *
     * **NOTE:** It saves it for future reuse, so don't use this for temporary
     * short-lived watchers.
     */
    static reuse(config?: DOMWatcherConfig): DOMWatcher;
    private constructor();
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
export type OnMutationHandler = CallbackHandler<OnMutationHandlerArgs> | OnMutationCallback;
//# sourceMappingURL=dom-watcher.d.ts.map