/**
 * @module Widgets
 */
import { Widget } from "../widgets/widget.cjs";
/**
 * Configures the given element as a {@link PageLoader} widget.
 *
 * The page loader is a full-page spinner. You would almost certainly use this
 * only once, to hide the page before it's loaded.
 *
 * **IMPORTANT:** You should not instantiate more than one {@link PageLoader}
 * widget on a given element. Use {@link PageLoader.get} to get an existing
 * instance if any. If there is already a widget instance, it will be destroyed!
 *
 * -----
 *
 * To use with auto-widgets (HTML API) (see
 * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
 * CSS classes or data attributes are recognized:
 * - `lisn-page-loader` class or `data-lisn-page-loader` attribute set on
 *   the element that constitutes the widget. The element should be empty.
 *
 * See below examples for what values you can use set for the data attributes
 * in order to modify the configuration of the automatically created widget.
 *
 * @example
 * This will create a page loader using the JavaScript API.
 *
 * This will work even if
 * {@link Settings.settings.autoWidgets | settings.autoWidgets}) is false
 *
 * ```html
 * <!-- LISN should be loaded beforehand -->
 * <script>
 *   LISN.widgets.PageLoader.enableMain();
 * </script>
 * ```
 *
 * @example
 * This will create a page loader using an existing element with default
 * {@link PageLoaderConfig}.
 *
 * ```html
 * <div class="lisn-page-loader"></div>
 * ```
 *
 * @example
 * As above but with custom settings.
 *
 * ```html
 * <div data-lisn-page-loader="auto-remove=false"></div>
 * ```
 */
export declare class PageLoader extends Widget {
    /**
     * If element is omitted, returns the instance created by {@link enableMain}
     * if any.
     */
    static get(element?: Element): PageLoader | null;
    static register(): void;
    /**
     * Creates a new element, inserts it into the document body and configures it
     * as a {@link PageLoader}.
     */
    static enableMain(config?: PageLoaderConfig): PageLoader;
    constructor(element: Element, config?: PageLoaderConfig);
}
/**
 * @interface
 */
export type PageLoaderConfig = {
    /**
     * Whether to automatically hide and remove the loader when the page is
     * ready (see {@link waitForPageReady}.
     *
     * @defaultValue true
     */
    autoRemove?: boolean;
};
//# sourceMappingURL=page-loader.d.ts.map