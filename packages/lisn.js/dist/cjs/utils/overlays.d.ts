/**
 * @module Utils
 */
/**
 * @category Overlays
 * @interface
 */
export type OverlayOptions = {
    /**
     * The parent element to insert the overlay into.
     *
     * If not given, then:
     * - if the overlay is to have a `position: fixed`, then `document.body` is used
     * - otherwise,
     *   {@link Watchers/ScrollWatcher.ScrollWatcher.fetchMainContentElement | ScrollWatcher.fetchMainContentElement} is
     *   used
     */
    parent?: HTMLElement;
    /**
     * If set, then it will be assigned as the DOM element ID for the new
     * overlay.
     *
     * Furthermore, the new overlay will be created and will not be saved for
     * future reuse.
     *
     * By default, if `id` is not given, the overlay will be saved, and if
     * {@link createOverlay} is called again with the same `style`, `data` and
     * parent, the previous overlay is returned.
     */
    id?: string;
    /**
     * Every entry in this object will be set on the `style` of the new overlay.
     *
     * **IMPORTANT:** By default overlays are positioned absolutely, so if you need
     * another positioning, override this here by setting a `position` key in
     * `style`. If position is either "absolute" (by default or explicitly set) or
     * "fixed", and none of `top` or `bottom` is given, `top: 0` is set; and
     * similarly, if none of `left` or `right` is given, `left: 0` is set.
     */
    style?: Record<string, string>;
    /**
     * Every entry in this object will be set as a data attribute on the new
     * overlay.
     *
     * Keys can be either kebab-case or camelCase (they will be converted if
     * needed). Do _not_ include the "data-" prefix which will be added
     * automatically. E.g. both "foo-bar" and "fooBar" will result in
     * "data-foo-bar" being set.
     */
    data?: Record<string, string>;
};
/**
 * Returns an existing overlay for this specification. If the overlay was just
 * created it may not yet be attached to the DOM.
 *
 * @category Overlays
 */
export declare const getOverlay: (userOptions?: OverlayOptions) => HTMLElement | null;
/**
 * Creates a new overlay, and inserts it into the DOM as soon as
 * {@link waitForMutateTime} resolves, or returns an already existing matching
 * overlay.
 *
 * **Note** that if {@link OverlayOptions.id} is set, a new overlay will
 * _always_ be created.
 *
 * @category Overlays
 */
export declare const createOverlay: (userOptions?: OverlayOptions) => Promise<HTMLElement>;
//# sourceMappingURL=overlays.d.ts.map