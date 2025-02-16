/**
 * @module Watchers/PointerWatcher
 */
import { PointerAction, CommaSeparatedStr } from "../globals/types.js";
import { CallbackHandler, Callback } from "../modules/callback.js";
/**
 * {@link PointerWatcher} listens for simple pointer actions like clicks, press
 * and hold or hover.
 */
export declare class PointerWatcher {
    /**
     * Call the `startHandler` whenever the pointer action begins.
     * Call the `endHandler` whenever the pointer action ends. If `endHandler` is
     * not given, it defaults to `startHandler`.
     *
     * For an explanation of what "begins" and "ends" means for each supported
     * action, see {@link OnPointerOptions.actions}.
     *
     * **IMPORTANT:** The same handlers can _not_ be added multiple times for the
     * same event target, even if the options differ. If the handler has already
     * been added for this target, then it will be removed and re-added with the
     * current options.
     */
    readonly onPointer: (target: EventTarget, startHandler: OnPointerHandler, endHandler?: OnPointerHandler, options?: OnPointerOptions) => Promise<void>;
    /**
     * Removes previously added handlers.
     */
    readonly offPointer: (target: EventTarget, startHandler: OnPointerHandler, endHandler?: OnPointerHandler) => void;
    /**
     * Creates a new instance of PointerWatcher with the given
     * {@link PointerWatcherConfig}. It does not save it for future reuse.
     */
    static create(config?: PointerWatcherConfig): PointerWatcher;
    /**
     * Returns an existing instance of PointerWatcher with the given
     * {@link PointerWatcherConfig}, or creates a new one.
     *
     * **NOTE:** It saves it for future reuse, so don't use this for temporary
     * short-lived watchers.
     */
    static reuse(config?: PointerWatcherConfig): PointerWatcher;
    private constructor();
}
/**
 * @interface
 */
export type PointerWatcherConfig = {
    /**
     * The default value for
     * {@link OnPointerOptions.preventDefault | preventDefault} in calls to
     * {@link PointerWatcher.onPointer}.
     *
     * @defaultValue false
     */
    preventDefault?: boolean;
    /**
     * The default value for
     * {@link OnPointerOptions.preventSelect | preventSelect} in calls to
     * {@link PointerWatcher.onPointer}.
     *
     * @defaultValue true
     */
    preventSelect?: boolean;
};
/**
 * @interface
 */
export type OnPointerOptions = {
    /**
     * One or more of of "click", "hover" or "press". If not specified, then all
     * actions are enabled.
     *
     * It can be a comma-separated list of {@link PointerAction}s or an array of
     * such actions.
     *
     * For click actions, the start handler is called for every odd number of
     * clicks (1st, 3rd, 5th, etc), and the end handler is called for every other
     * click. It functions like a toggle.
     *
     * For hover and press actions, the start handler is called when the pointer
     * enters or presses down on the target respectively, and the end handler is
     * called when the pointer leaves or comes off the target respectively.
     *
     * Note that on touch screens, hover and press actions behave identically.
     *
     * @defaultValue undefined
     */
    actions?: CommaSeparatedStr<PointerAction> | PointerAction[];
    /**
     * If true, the events of the pointer actions, e.g. click, will have their
     * default action prevented.
     *
     * @defaultValue {@link PointerWatcherConfig.preventDefault}
     */
    preventDefault?: boolean;
    /**
     * If true (default), then for press actions (and hover actions on touch
     * screens) it will prevent starting a text selection.
     *
     * @defaultValue {@link PointerWatcherConfig.preventSelect}
     */
    preventSelect?: boolean;
};
/**
 * The handler is invoked with two arguments:
 *
 * - the event target that was passed to the {@link PointerWatcher.onPointer}
 *   call (equivalent to
 *   {@link https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget | Event:currentTarget}).
 * - the {@link PointerActionData} describing the state of the action.
 */
export type OnPointerHandlerArgs = [EventTarget, PointerActionData, Event];
export type OnPointerCallback = Callback<OnPointerHandlerArgs>;
export type OnPointerHandler = CallbackHandler<OnPointerHandlerArgs> | OnPointerCallback;
export type PointerActionData = {
    action: PointerAction;
    state: "ON" | "OFF";
};
//# sourceMappingURL=pointer-watcher.d.ts.map