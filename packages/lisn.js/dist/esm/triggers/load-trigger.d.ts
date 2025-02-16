/**
 * @module Triggers
 *
 * @categoryDescription Load
 * {@link LoadTrigger} allows you to run actions once when the page is loaded.
 */
import { Action } from "../actions/action.js";
import { Trigger, TriggerConfig } from "../triggers/trigger.js";
/**
 * {@link LoadTrigger} allows you to run actions one when the page is loaded.
 *
 * -------
 *
 * To use with auto-widgets (HTML API), see {@link registerTrigger} for the
 * specification.
 *
 * - Arguments: none
 * - Additional trigger options: none
 *
 * @example
 * Scroll to the given element when the page is loaded:
 *
 * ```html
 * <div data-lisn-on-load=":scroll-to"></div>
 * ```
 *
 * @example
 * Scroll to 100px above the given element 500ms after the page is loaded:
 *
 * ```html
 * <div data-lisn-on-load="@scroll-to=0,-100 +delay=500"></div>
 * ```
 *
 * @example
 * Scroll to 100px above the given element 500ms after the page is loaded, and
 * play animations defined on it 500ms later (1000ms after it's loaded):
 *
 * ```html
 * <div data-lisn-on-load="@scroll-to=0,-100 +delay=500 ;
 *                         @animate +delay=1000"
 * ></div>
 * ```
 *
 * @category Load
 */
export declare class LoadTrigger extends Trigger {
    readonly getConfig: () => TriggerConfig;
    static register(): void;
    /**
     * If no actions are supplied, nothing is done.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the config is invalid.
     */
    constructor(element: Element, actions: Action[], config: TriggerConfig);
}
//# sourceMappingURL=load-trigger.d.ts.map