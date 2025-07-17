/**
 * @module Widgets
 */
import { XYDirection, Position } from "../globals/types.cjs";
import { Widget, WidgetHandler, WidgetConfigValidator } from "../widgets/widget.cjs";
export type OpenableCreateFn<Config extends Record<string, unknown>> = (element: HTMLElement, config?: Config) => Openable;
/**
 * Enables automatic setting up of an {@link Openable} widget from an
 * elements matching its content element selector (`[data-lisn-<name>]` or
 * `.lisn-<name>`).
 *
 * The name you specify here should generally be the same name you pass in
 * {@link OpenableProperties.name | options.name} to the
 * {@link Openable.constructor} but it does not need to be the same.
 *
 * @param {} name        The name of the openable. Should be in kebab-case.
 * @param {} newOpenable Called for every element matching the selector.
 * @param {} configValidator
 *                        A validator object, or a function that returns such
 *                        an object, for all options supported by the widget.
 *
 * @see {@link registerWidget}
 */
export declare const registerOpenable: <Config extends Record<string, unknown>>(name: string, newOpenable: OpenableCreateFn<Config>, configValidator?: null | WidgetConfigValidator<Config>) => void;
/**
 * {@link Openable} is an abstract base class. You should not directly
 * instantiate it but can inherit it to create your own custom openable widget.
 *
 * **IMPORTANT:** You should not instantiate more than one {@link Openable}
 * widget, regardless of type, on a given element. Use {@link Openable.get} to
 * get an existing instance if any. If there is already an {@link Openable}
 * widget of any type on this element, it will be destroyed!
 *
 * @see {@link registerOpenable}
 */
export declare abstract class Openable extends Widget {
    /**
     * Opens the widget unless it is disabled.
     */
    readonly open: () => Promise<void>;
    /**
     * Closes the widget.
     */
    readonly close: () => Promise<void>;
    /**
     * Closes the widget if it is open, or opens it if it is closed (unless
     * it is disabled).
     */
    readonly toggle: () => Promise<void>;
    /**
     * The given handler will be called when the widget is open.
     *
     * If it returns a promise, it will be awaited upon.
     */
    readonly onOpen: (handler: WidgetHandler) => void;
    /**
     * The given handler will be called when the widget is closed.
     *
     * If it returns a promise, it will be awaited upon.
     */
    readonly onClose: (handler: WidgetHandler) => void;
    /**
     * Returns true if the widget is currently open.
     */
    readonly isOpen: () => boolean;
    /**
     * Returns the root element created by us that wraps the original content
     * element passed to the constructor. It is located in the content element's
     * original place.
     */
    readonly getRoot: () => HTMLElement;
    /**
     * Returns the element that was found to be the container. It is the closest
     * ancestor that has a `lisn-collapsible-container` class, or if no such
     * ancestor then the immediate parent of the content element.
     */
    readonly getContainer: () => HTMLElement | null;
    /**
     * Returns the trigger elements, if any. Note that these may be wrappers
     * around the original triggers passed.
     */
    readonly getTriggers: () => Element[];
    /**
     * Returns the trigger elements along with their configuration.
     */
    readonly getTriggerConfigs: () => Map<Element, OpenableTriggerConfig>;
    /**
     * Retrieve an existing widget by its content element or any of its triggers.
     *
     * If the element is already part of a configured {@link Openable} widget,
     * the widget instance is returned. Otherwise `null`.
     *
     * Note that trigger elements are not guaranteed to be unique among openable
     * widgets as the same element can be a trigger for multiple such widgets. If
     * the element you pass is a trigger, then the last openable widget that was
     * created for it will be returned.
     */
    static get(element: Element): Openable | null;
    constructor(element: HTMLElement, properties: OpenableProperties);
}
/**
 * Per-trigger based configuration. Can either be given as an object as the
 * value of the {@link OpenableProperties.triggers} map, or it can be set as a
 * string configuration in the `data-lisn-<name>-trigger` data attribute. See
 * {@link getWidgetConfig} for the syntax.
 *
 * @example
 * ```html
 * <div data-lisn-collapsible-trigger="auto-close
 *                                     | icon=right
 *                                     | icon-closed=arrow-down
 *                                     | icon-open=x"
 * ></div>
 * ```
 *
 * @interface
 */
export type OpenableTriggerConfig = {
    /**
     * The DOM ID to set on the trigger. Will result in the trigger element, which
     * could be a wrapper around the original element (as in the case of {@link
     * Collapsible} you passed, getting this ID.
     *
     * **IMPORTANT:** If the trigger element already has an ID and is not being
     * wrapped, then this will override the ID and it _won't_ be restored on destroy.
     *
     * @defaultValue undefined
     */
    id?: string;
    /**
     * Class name(s) for the trigger. Will result in the trigger element, which
     * could be a wrapper around the original element you passed, getting these
     * classes.
     *
     * @defaultValue undefined
     */
    className?: string[] | string;
    /**
     * Override the widget's {@link OpenableProperties.autoClose} for this trigger.
     *
     * @defaultValue undefined // Widget default
     */
    autoClose?: boolean;
    /**
     * Open the openable when this trigger is hovered.
     *
     * If the device is touch and {@link OpenableProperties.autoClose} is enabled,
     * the widget will be closed shortly after the pointer leaves both the
     * trigger and the root element.
     *
     * @defaultValue false
     */
    hover?: boolean;
    /**
     * Whether to prevent default click action.
     *
     * @defaultValue true
     */
    preventDefault?: boolean;
    /**
     * Override the widget's {@link CollapsibleConfig.icon} for this trigger.
     *
     * Currently only relevant for {@link Collapsible}s.
     *
     * @defaultValue undefined // Widget default
     */
    icon?: false | Position;
    /**
     * Override the widget's {@link CollapsibleConfig.iconClosed} for this
     * trigger.
     *
     * Currently only relevant for {@link Collapsible}s.
     *
     * @defaultValue undefined // Widget default
     */
    iconClosed?: "plus" | `arrow-${XYDirection}`;
    /**
     * Override the widget's {@link CollapsibleConfig.iconOpen} for this
     * trigger.
     *
     * Currently only relevant for {@link Collapsible}s.
     *
     * @defaultValue undefined // Widget default
     */
    iconOpen?: "minus" | "x" | `arrow-${XYDirection}`;
};
/**
 * @interface
 */
export type OpenableProperties = {
    /**
     * The name of the _type_ of the openable. Will set the class prefix to
     * `lisn-<name>`.
     */
    name: string;
    /**
     * The DOM ID to set on the openable. Will result in the top-level root
     * element that's created by us getting this ID.
     *
     * @defaultValue undefined
     */
    id?: string;
    /**
     * Class name(s) or a list of class names to set on the openable. Will result
     * in the top-level root element that's created by us getting these classes.
     *
     * @defaultValue undefined
     */
    className?: string[] | string;
    /**
     * Whether to auto-close the widget on clicking outside the content element
     * or on pressing Escape key. Furthermore, if any trigger opens the widget on
     * {@link OpenableTriggerConfig.hover}, the widget will be closed when the
     * pointer leaves both the trigger and the root.
     *
     * This is true by default for {@link Popup}, {@link Modal} and {@link Offcanvas}.
     */
    autoClose: boolean;
    /**
     * If true, then while the widget is open, the `document.body` will be set to
     * `overflow: hidden`.
     *
     * This is true for {@link Modal}.
     */
    isModal: boolean;
    /**
     * If true, then the content element is assumed to be possibly scrollable and
     * will be scrolled back to its top after the widget is closed.
     *
     * This is true for {@link Modal} and {@link Offcanvas}.
     */
    isOffcanvas: boolean;
    /**
     * Add a close button at the top right.
     *
     * This is true by default for {@link Modal} and {@link Offcanvas}.
     */
    closeButton: boolean;
    /**
     * The elements that open the widget when clicked on. You can also pass a map
     * whose keys are the elements and values are {@link OpenableTriggerConfig}
     * objects.
     *
     * If not given, then the elements that will be used as triggers are
     * discovered in the following way (`<name>` is what is given as
     * {@link name}):
     * 1. If the content element has a `data-lisn-<name>-content-id` attribute,
     *    then it must be a unique (for the current page) ID. In this case, the
     *    trigger elements will be any element in the document that has a
     *    `lisn-<name>-trigger` class or `data-lisn-<name>-trigger` attribute
     *    and the same `data-lisn-<name>-content-id` attribute.
     * 2. Otherwise, the closest ancestor that has a `lisn-<name>-container`
     *    class, or if no such ancestor then the immediate parent of the content
     *    element, is searched for any elements that have a `lisn-<name>-trigger`
     *    class or `data-lisn-<name>-trigger` attribute and that do _not_ have a
     *    `data-lisn-<name>-content-id` attribute, and that are _not_ children of
     *    the content element.
     *
     * @defaultValue undefined
     */
    triggers?: Element[] | Map<Element, OpenableTriggerConfig | null>;
    /**
     * Whether to wrap each trigger in a new element.
     *
     * @defaultValue false
     */
    wrapTriggers?: boolean;
    /**
     * Hook to run once the widget is fully setup (which happens asynchronously).
     *
     * It is called during "mutate time". See {@link waitForMutateTime}.
     *
     * @defaultValue undefined
     */
    onSetup?: () => void;
};
/**
 * Configures the given element as a {@link Collapsible} widget.
 *
 * The Collapsible widget sets up the given element to be collapsed and
 * expanded upon activation. Activation can be done manually by calling
 * {@link open} or when clicking on any of the given
 * {@link CollapsibleConfig.triggers | triggers}.
 *
 * **NOTE:** The Collapsible widget always wraps each trigger element in
 * another element in order to allow positioning the icon, if any.
 *
 * **IMPORTANT:** You should not instantiate more than one {@link Openable}
 * widget, regardless of type, on a given element. Use {@link Openable.get} to
 * get an existing instance if any. If there is already an {@link Openable}
 * widget of any type on this element, it will be destroyed!
 *
 * -----
 *
 * You can use the following dynamic attributes or CSS properties in your
 * stylesheet:
 *
 * The following dynamic attributes are set on the root element that is created
 * by LISN and has a class `lisn-collapsible__root`:
 * - `data-lisn-is-open`: `"true"` or `"false"`
 * - `data-lisn-reverse`: `"true"` or `"false"`
 * - `data-lisn-orientation`: `"horizontal"` or `"vertical"`
 *
 * The following dynamic attributes are set on each trigger:
 * - `data-lisn-opens-on-hover: `"true"` or `"false"`
 *
 * -----
 *
 * To use with auto-widgets (HTML API) (see
 * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
 * CSS classes or data attributes are recognized:
 * - `lisn-collapsible` class or `data-lisn-collapsible` attribute set on the
 *   element that holds the content of the collapsible
 * - `lisn-collapsible-trigger` class or `data-lisn-collapsible-trigger`
 *   attribute set on elements that should act as the triggers.
 *   If using a data attribute, you can configure the trigger via the value
 *   with a similar syntax to the configuration of the openable widget. For
 *   example:
 *   - Set the attribute to `"hover"` in order to have this trigger open the
 *     collapsible on hover _in addition to click_.
 *   - Set the attribute to `"hover|auto-close"` in order to have this trigger
 *     open the collapsible on hover but and override
 *     {@link CollapsibleConfig.autoClose} with true.
 *
 * When using auto-widgets, the elements that will be used as triggers are
 * discovered in the following way:
 * 1. If the content element has a `data-lisn-collapsible-content-id` attribute,
 *    then it must be a unique (for the current page) ID. In this case, the
 *    trigger elements will be any element in the document that has a
 *    `lisn-collapsible-trigger` class or `data-lisn-collapsible-trigger`
 *    attribute and the same `data-lisn-collapsible-content-id` attribute.
 * 2. Otherwise, the closest ancestor that has a `lisn-collapsible-container`
 *    class, or if no such ancestor then the immediate parent of the content
 *    element, is searched for any elements that have a
 *    `lisn-collapsible-trigger` class or `data-lisn-collapsible-trigger`
 *    attribute and that do _not_ have a `data-lisn-collapsible-content-id`
 *    attribute, and that are _not_ children of the content element.
 *
 * See below examples for what values you can use set for the data attributes
 * in order to modify the configuration of the automatically created widget.
 *
 * @example
 * This defines a simple collapsible with one trigger.
 *
 * ```html
 * <div>
 *   <div class="lisn-collapsible-trigger">Expand</div>
 *   <div class="lisn-collapsible">
 *     Some long content here...
 *   </div>
 * </div>
 * ```
 *
 * @example
 * This defines a collapsible that is partially visible when collapsed, and
 * where the trigger is in a different parent to the content.
 *
 * ```html
 * <div>
 *   <div data-lisn-collapsible-content-id="readmore"
 *        data-lisn-collapsible="peek">
 *     <p>
 *       Lorem ipsum odor amet, consectetuer adipiscing elit. Etiam duis
 *       viverra faucibus facilisis luctus. Nunc tellus turpis facilisi dapibus
 *       aliquet turpis. Diam potenti egestas dolor auctor nostra vestibulum.
 *       Tempus auctor quis turpis; pulvinar ante ultrices. Netus morbi
 *       imperdiet volutpat litora tellus turpis a. Sociosqu interdum sodales
 *       sapien nulla aptent pellentesque praesent. Senectus magnis
 *       pellentesque; dis porta justo habitant.
 *     </p>
 *
 *     <p>
 *       Imperdiet placerat habitant tristique turpis habitasse ligula pretium
 *       vehicula. Mauris molestie lectus leo aliquam condimentum elit fermentum
 *       tempus nisi. Eget mi vestibulum quisque enim himenaeos. Odio nascetur
 *       vel congue vivamus eleifend ut nascetur. Ultrices quisque non dictumst
 *       risus libero varius tincidunt vel. Suscipit netus maecenas imperdiet
 *       elementum donec maximus suspendisse luctus. Eu velit semper urna sem
 *       ullamcorper nisl turpis hendrerit. Gravida commodo nisl malesuada nibh
 *       ultricies scelerisque hendrerit tempus vehicula. Risus eleifend eros
 *       aliquam turpis elit ridiculus est class.
 *     </p>
 *   </div>
 * </div>
 *
 * <div>
 *   <div data-lisn-collapsible-content-id="readmore"
 *        class="lisn-collapsible-trigger">
 *     Read more
 *   </div>
 * </div>
 * ```
 *
 * @example
 * As above, but with all other possible configuration settings set explicitly.
 *
 * ```html
 * <div>
 *   <div data-lisn-collapsible-content-id="readmore"
 *        data-lisn-collapsible="peek=50px
 *                               | horizontal=false
 *                               | reverse=false
 *                               | auto-close
 *                               | icon=right
 *                               | icon-closed=arrow-up"
 *                               | icon-open=arrow-down">
 *     <p>
 *       Lorem ipsum odor amet, consectetuer adipiscing elit. Etiam duis
 *       viverra faucibus facilisis luctus. Nunc tellus turpis facilisi dapibus
 *       aliquet turpis. Diam potenti egestas dolor auctor nostra vestibulum.
 *       Tempus auctor quis turpis; pulvinar ante ultrices. Netus morbi
 *       imperdiet volutpat litora tellus turpis a. Sociosqu interdum sodales
 *       sapien nulla aptent pellentesque praesent. Senectus magnis
 *       pellentesque; dis porta justo habitant.
 *     </p>
 *
 *     <p>
 *       Imperdiet placerat habitant tristique turpis habitasse ligula pretium
 *       vehicula. Mauris molestie lectus leo aliquam condimentum elit fermentum
 *       tempus nisi. Eget mi vestibulum quisque enim himenaeos. Odio nascetur
 *       vel congue vivamus eleifend ut nascetur. Ultrices quisque non dictumst
 *       risus libero varius tincidunt vel. Suscipit netus maecenas imperdiet
 *       elementum donec maximus suspendisse luctus. Eu velit semper urna sem
 *       ullamcorper nisl turpis hendrerit. Gravida commodo nisl malesuada nibh
 *       ultricies scelerisque hendrerit tempus vehicula. Risus eleifend eros
 *       aliquam turpis elit ridiculus est class.
 *     </p>
 *   </div>
 * </div>
 *
 * <div>
 *   <div data-lisn-collapsible-content-id="readmore"
 *        class="lisn-collapsible-trigger">
 *     Read more
 *   </div>
 * </div>
 * ```
 */
export declare class Collapsible extends Openable {
    static register(): void;
    constructor(element: HTMLElement, config?: CollapsibleConfig);
}
/**
 * @interface
 */
export type CollapsibleConfig = {
    /**
     * The DOM ID to set on the collapsible. Will result in the top-level root
     * element that's created by us getting this ID.
     *
     * Note, this does not replace or affect the
     * `data-lisn-collapsible-content-id` attribute used to link triggers to the
     * collapsible.
     *
     * @defaultValue undefined
     */
    id?: string;
    /**
     * Class name(s) or a list of class names to set on the collapsible. Will
     * result in the top-level root element that's created by us getting these
     * classes.
     *
     * @defaultValue undefined
     */
    className?: string[] | string;
    /**
     * The elements that open the widget when clicked on. You can also pass a map
     * whose keys are the elements and values are {@link OpenableTriggerConfig}
     * objects.
     *
     * If not given, then the elements that will be used as triggers are
     * discovered in the following way:
     * 1. If the content element has a `data-lisn-collapsible-content-id`
     *    attribute, then it must be a unique (for the current page) ID. In this
     *    case, the trigger elements will be any element in the document that
     *    has a `lisn-collapsible-trigger` class or
     *    `data-lisn-collapsible-trigger` attribute and the same
     *    `data-lisn-collapsible-content-id` attribute.
     * 2. Otherwise, the closest ancestor that has a `lisn-collapsible-container`
     *    class, or if no such ancestor then the immediate parent of the content
     *    element, is searched for any elements that have a
     *    `lisn-collapsible-trigger` class or `data-lisn-collapsible-trigger`
     *    attribute and that do _not_ have a `data-lisn-collapsible-content-id`
     *    attribute, and that are _not_ children of the content element.
     *
     * @defaultValue undefined
     */
    triggers?: Element[] | Map<Element, OpenableTriggerConfig | null>;
    /**
     * Open sideways (to the right) instead of downwards (default).
     *
     * **IMPORTANT:** In horizontal mode the width of the content element should
     * not be set (or be `auto`), but you can use `min-width` or `max-width` in
     * your CSS if needed.
     *
     * @defaultValue false
     */
    horizontal?: boolean;
    /**
     * Open to the left if horizontal or upwards if vertical.
     *
     * @defaultValue false
     */
    reverse?: boolean;
    /**
     * If not false, part of the content will be visible when the collapsible is
     * closed. The value can be any valid CSS width specification.
     *
     * If you set this to `true`, then the size of the peek window will be
     * dictated by CSS. By default the size is 100px, but you can change this by
     * setting `--lisn-peek-size` CSS property on the content element or any of
     * its ancestors.
     *
     * Otherwise, if the value is a string, it must be a CSS length including units.
     *
     * @defaultValue false
     */
    peek?: boolean | string;
    /**
     * Automatically close the collapsible when clicking outside it or pressing
     * Escape. Furthermore, if any trigger opens the widget on
     * {@link OpenableTriggerConfig.hover}, the widget will be closed when the
     * pointer leaves both the trigger and the root.
     *
     * @defaultValue false
     */
    autoClose?: boolean;
    /**
     * Add an icon to each trigger.
     *
     * If set to something other than `false`, then by default the icon in the
     * closed state is a plus (+) and in the open state it's a minus (-), but
     * this can be configured with {@link iconClosed} and {@link iconOpen}.
     *
     * @defaultValue false
     */
    icon?: false | Position;
    /**
     * Set the type of icon used on the trigger(s) in the closed state.
     *
     * Note that {@link icon} must be set to something other than `false`.
     *
     * @defaultValue "plus"
     */
    iconClosed?: "plus" | `arrow-${XYDirection}`;
    /**
     * Set the type of icon used on the trigger(s) in the open state.
     *
     * Note that {@link icon} must be set to something other than `false`.
     *
     * @defaultValue "minus";
     */
    iconOpen?: "minus" | "x" | `arrow-${XYDirection}`;
};
/**
 * Configures the given element as a {@link Popup} widget.
 *
 * The Popup widget sets up the given element to be hidden and open in a
 * floating popup upon activation. Activation can be done manually by calling
 * {@link open} or when clicking on any of the given
 * {@link PopupConfig.triggers | triggers}.
 *
 * **IMPORTANT:** The popup is positioned absolutely in its container and the
 * position is relative to the container. The container gets `width:
 * fit-content` by default but you can override this in your CSS. The popup
 * also gets a configurable `min-width` set.
 *
 * **IMPORTANT:** You should not instantiate more than one {@link Openable}
 * widget, regardless of type, on a given element. Use {@link Openable.get} to
 * get an existing instance if any. If there is already an {@link Openable}
 * widget of any type on this element, it will be destroyed!
 *
 * -----
 *
 * You can use the following dynamic attributes or CSS properties in your
 * stylesheet:
 *
 * The following dynamic attributes are set on the root element that is created
 * by LISN and has a class `lisn-popup__root`:
 * - `data-lisn-is-open`: `"true"` or `"false"`
 * - `data-lisn-place`: the actual position (top, bottom, left, top-left, etc)
 *
 * The following dynamic attributes are set on each trigger:
 * - `data-lisn-opens-on-hover: `"true"` or `"false"`
 *
 * -----
 *
 * To use with auto-widgets (HTML API) (see
 * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
 * CSS classes or data attributes are recognized:
 * - `lisn-popup` class or `data-lisn-popup` attribute set on the element that
 *   holds the content of the popup
 * - `lisn-popup-trigger` class or `data-lisn-popup-trigger`
 *   attribute set on elements that should act as the triggers.
 *   If using a data attribute, you can configure the trigger via the value
 *   with a similar syntax to the configuration of the openable widget. For
 *   example:
 *   - Set the attribute to `"hover"` in order to have this trigger open the
 *     popup on hover _in addition to click_.
 *   - Set the attribute to `"hover|auto-close=false"` in order to have this
 *     trigger open the popup on hover but and override
 *     {@link PopupConfig.autoClose} with true.
 *
 * When using auto-widgets, the elements that will be used as triggers are
 * discovered in the following way:
 * 1. If the content element has a `data-lisn-popup-content-id` attribute, then
 *    it must be a unique (for the current page) ID. In this case, the trigger
 *    elements will be any element in the document that has a
 *    `lisn-popup-trigger` class or `data-lisn-popup-trigger` attribute and the
 *    same `data-lisn-popup-content-id` attribute.
 * 2. Otherwise, the closest ancestor that has a `lisn-popup-container` class,
 *    or if no such ancestor then the immediate parent of the content element,
 *    is searched for any elements that have a `lisn-popup-trigger` class or
 *    `data-lisn-popup-trigger` attribute and that do _not_ have a
 *    `data-lisn-popup-content-id` attribute, and that are _not_ children of
 *    the content element.
 *
 * See below examples for what values you can use set for the data attributes
 * in order to modify the configuration of the automatically created widget.
 *
 * @example
 * This defines a simple popup with one trigger.
 *
 * ```html
 * <div>
 *   <div class="lisn-popup-trigger">Open</div>
 *   <div class="lisn-popup">
 *     Some content here...
 *   </div>
 * </div>
 * ```
 *
 * @example
 * This defines a popup that has a close button, and where the trigger is in a
 * different parent to the content.
 *
 * ```html
 * <div>
 *   <div data-lisn-popup-content-id="popup"
 *        data-lisn-popup="close-button">
 *     Lorem ipsum odor amet, consectetuer adipiscing elit. Etiam duis viverra
 *     faucibus facilisis luctus. Nunc tellus turpis facilisi dapibus aliquet
 *     turpis. Diam potenti egestas dolor auctor nostra vestibulum. Tempus
 *     auctor quis turpis; pulvinar ante ultrices. Netus morbi imperdiet
 *     volutpat litora tellus turpis a. Sociosqu interdum sodales sapien nulla
 *     aptent pellentesque praesent. Senectus magnis pellentesque; dis porta
 *     justo habitant.
 *   </div>
 * </div>
 *
 * <div>
 *   <div data-lisn-popup-content-id="popup" class="lisn-popup-trigger">
 *     Open
 *   </div>
 * </div>
 * ```
 *
 * @example
 * As above, but with all possible configuration settings set explicitly.
 *
 * ```html
 * <div>
 *   <div data-lisn-popup-content-id="popup" class="lisn-popup-trigger">
 *     Open
 *   </div>
 * </div>
 *
 * <div>
 *   <div data-lisn-popup-content-id="popup"
 *        data-lisn-popup="close-button | position=bottom | auto-close=false">
 *     Lorem ipsum odor amet, consectetuer adipiscing elit. Etiam duis viverra
 *     faucibus facilisis luctus. Nunc tellus turpis facilisi dapibus aliquet
 *     turpis. Diam potenti egestas dolor auctor nostra vestibulum. Tempus
 *     auctor quis turpis; pulvinar ante ultrices. Netus morbi imperdiet
 *     volutpat litora tellus turpis a. Sociosqu interdum sodales sapien nulla
 *     aptent pellentesque praesent. Senectus magnis pellentesque; dis porta
 *     justo habitant.
 *   </div>
 * </div>
 * ```
 */
export declare class Popup extends Openable {
    static register(): void;
    constructor(element: HTMLElement, config?: PopupConfig);
}
/**
 * @interface
 */
export type PopupConfig = {
    /**
     * The DOM ID to set on the popup. Will result in the top-level root element
     * that's created by us getting this ID.
     *
     * Note, this does not replace or affect the `data-lisn-popup-content-id`
     * attribute used to link triggers to the popup.
     *
     * @defaultValue undefined
     */
    id?: string;
    /**
     * Class name(s) or a list of class names to set on the popup. Will result in
     * the top-level root element that's created by us getting these classes.
     *
     * @defaultValue undefined
     */
    className?: string[] | string;
    /**
     * The elements that open the widget when clicked on. You can also pass a map
     * whose keys are the elements and values are {@link OpenableTriggerConfig}
     * objects.
     *
     * If not given, then the elements that will be used as triggers are
     * discovered in the following way:
     * 1. If the content element has a `data-lisn-popup-content-id` attribute,
     *    then it must be a unique (for the current page) ID. In this case, the
     *    trigger elements will be any element in the document that has a
     *    `lisn-popup-trigger` class or `data-lisn-popup-trigger` attribute and
     *    the same `data-lisn-popup-content-id` attribute.
     * 2. Otherwise, the closest ancestor that has a `lisn-popup-container` class,
     *    or if no such ancestor then the immediate parent of the content
     *    element, is searched for any elements that have a `lisn-popup-trigger`
     *    class or `data-lisn-popup-trigger` attribute and that do _not_ have a
     *    `data-lisn-popup-content-id` attribute, and that are _not_ children of
     *    the content element.
     *
     * @defaultValue undefined
     */
    triggers?: Element[] | Map<Element, OpenableTriggerConfig | null>;
    /**
     * Add a close button at the top right.
     *
     * @defaultValue false
     */
    closeButton?: boolean;
    /**
     * Specify the popup position _relative to its container_. Supported
     * positions include `"top"`, `"bottom"`, `"left"`, `"right" `(which result
     * on the popup being placed on top, bottom, etc, but center-aligned), or
     * `"top-left"`, `"left-top"`, etc, as well as `"auto"`. If set to `"auto"`,
     * then popup position will be based on the container position within the
     * viewport at the time it's open.
     *
     * @defaultValue "auto"
     */
    position?: Position | `${Position}-${Position}` | "auto";
    /**
     * Automatically close the popup when clicking outside it or pressing Escape.
     * Furthermore, if any trigger opens the widget on
     * {@link OpenableTriggerConfig.hover}, the widget will be closed when the
     * pointer leaves both the trigger and the root.
     *
     * @defaultValue true
     */
    autoClose?: boolean;
};
/**
 * Configures the given element as a {@link Modal} widget.
 *
 * The Modal widget sets up the given element to be hidden and open in a fixed
 * full-screen modal popup upon activation. Activation can be done manually by
 * calling {@link open} or when clicking on any of the given
 * {@link ModalConfig.triggers | triggers}.
 *
 * **IMPORTANT:** You should not instantiate more than one {@link Openable}
 * widget, regardless of type, on a given element. Use {@link Openable.get} to
 * get an existing instance if any. If there is already an {@link Openable}
 * widget of any type on this element, it will be destroyed!
 *
 * -----
 *
 * You can use the following dynamic attributes or CSS properties in your
 * stylesheet:
 *
 * The following dynamic attributes are set on the root element that is created
 * by LISN and has a class `lisn-modal__root`:
 * - `data-lisn-is-open`: `"true"` or `"false"`
 *
 * The following dynamic attributes are set on each trigger:
 * - `data-lisn-opens-on-hover: `"true"` or `"false"`
 *
 * -----
 *
 * To use with auto-widgets (HTML API) (see
 * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
 * CSS classes or data attributes are recognized:
 * - `lisn-modal` class or `data-lisn-modal` attribute set on the element that
 *   holds the content of the modal
 * - `lisn-modal-trigger` class or `data-lisn-modal-trigger`
 *   attribute set on elements that should act as the triggers.
 *   If using a data attribute, you can configure the trigger via the value
 *   with a similar syntax to the configuration of the openable widget. For
 *   example:
 *   - Set the attribute to `"hover"` in order to have this trigger open the
 *     modal on hover _in addition to click_.
 *   - Set the attribute to `"hover|auto-close=false"` in order to have this
 *     trigger open the modal on hover but and override
 *     {@link ModalConfig.autoClose} with true.
 *
 * When using auto-widgets, the elements that will be used as triggers are
 * discovered in the following way:
 * 1. If the content element has a `data-lisn-modal-content-id` attribute, then
 *    it must be a unique (for the current page) ID. In this case, the trigger
 *    elements will be any element in the document that has a
 *    `lisn-modal-trigger` class or `data-lisn-modal-trigger` attribute and the
 *    same `data-lisn-modal-content-id` attribute.
 * 2. Otherwise, the closest ancestor that has a `lisn-modal-container` class,
 *    or if no such ancestor then the immediate parent of the content element,
 *    is searched for any elements that have a `lisn-modal-trigger` class or
 *    `data-lisn-modal-trigger` attribute and that do _not_ have a
 *    `data-lisn-modal-content-id` attribute, and that are _not_ children of
 *    the content element.
 *
 * See below examples for what values you can use set for the data attributes
 * in order to modify the configuration of the automatically created widget.
 *
 * @example
 * This defines a simple modal with one trigger.
 *
 * ```html
 * <div>
 *   <div class="lisn-modal-trigger">Open</div>
 *   <div class="lisn-modal">
 *     Some content here...
 *   </div>
 * </div>
 * ```
 *
 * @example
 * This defines a modal that doesn't automatically close on click outside or
 * Escape and, and that has several triggers in a different parent to the
 * content.
 *
 * ```html
 * <div>
 *   <div data-lisn-modal-content-id="modal"
 *        data-lisn-modal="auto-close=false">
 *     Lorem ipsum odor amet, consectetuer adipiscing elit. Etiam duis viverra
 *     faucibus facilisis luctus. Nunc tellus turpis facilisi dapibus aliquet
 *     turpis. Diam potenti egestas dolor auctor nostra vestibulum. Tempus
 *     auctor quis turpis; pulvinar ante ultrices. Netus morbi imperdiet
 *     volutpat litora tellus turpis a. Sociosqu interdum sodales sapien nulla
 *     aptent pellentesque praesent. Senectus magnis pellentesque; dis porta
 *     justo habitant.
 *   </div>
 * </div>
 *
 * <div>
 *   <div data-lisn-modal-content-id="modal" class="lisn-modal-trigger">
 *     Open
 *   </div>
 * </div>
 *
 * <div>
 *   <div data-lisn-modal-content-id="modal" class="lisn-modal-trigger">
 *     Another trigger
 *   </div>
 * </div>
 * ```
 *
 * @example
 * As above, but with all possible configuration settings set explicitly.
 *
 * ```html
 * <div>
 *   <div data-lisn-modal-content-id="modal"
 *        data-lisn-modal="auto-close=false | close-button=true">
 *     Lorem ipsum odor amet, consectetuer adipiscing elit. Etiam duis viverra
 *     faucibus facilisis luctus. Nunc tellus turpis facilisi dapibus aliquet
 *     turpis. Diam potenti egestas dolor auctor nostra vestibulum. Tempus
 *     auctor quis turpis; pulvinar ante ultrices. Netus morbi imperdiet
 *     volutpat litora tellus turpis a. Sociosqu interdum sodales sapien nulla
 *     aptent pellentesque praesent. Senectus magnis pellentesque; dis porta
 *     justo habitant.
 *   </div>
 * </div>
 *
 * <div>
 *   <div data-lisn-modal-content-id="modal" class="lisn-modal-trigger">
 *     Open
 *   </div>
 * </div>
 *
 * <div>
 *   <div data-lisn-modal-content-id="modal" class="lisn-modal-trigger">
 *     Another trigger
 *   </div>
 * </div>
 * ```
 */
export declare class Modal extends Openable {
    static register(): void;
    constructor(element: HTMLElement, config?: ModalConfig);
}
/**
 * @interface
 */
export type ModalConfig = {
    /**
     * The DOM ID to set on the modal. Will result in the top-level root element
     * that's created by us getting this ID.
     *
     * Note, this does not replace or affect the `data-lisn-modal-content-id`
     * attribute used to link triggers to the modal.
     *
     * @defaultValue undefined
     */
    id?: string;
    /**
     * Class name(s) or a list of class names to set on the modal. Will result in
     * the top-level root element that's created by us getting these classes.
     *
     * @defaultValue undefined
     */
    className?: string[] | string;
    /**
     * The elements that open the widget when clicked on. You can also pass a map
     * whose keys are the elements and values are {@link OpenableTriggerConfig}
     * objects.
     *
     * If not given, then the elements that will be used as triggers are
     * discovered in the following way:
     * 1. If the content element has a `data-lisn-modal-content-id` attribute,
     *    then it must be a unique (for the current page) ID. In this case, the
     *    trigger elements will be any element in the document that has a
     *    `lisn-modal-trigger` class or `data-lisn-modal-trigger` attribute and
     *    the same `data-lisn-modal-content-id` attribute.
     * 2. Otherwise, the closest ancestor that has a `lisn-modal-container` class,
     *    or if no such ancestor then the immediate parent of the content
     *    element, is searched for any elements that have a `lisn-modal-trigger`
     *    class or `data-lisn-modal-trigger` attribute and that do _not_ have a
     *    `data-lisn-modal-content-id` attribute, and that are _not_ children of
     *    the content element.
     *
     * @defaultValue undefined
     */
    triggers?: Element[] | Map<Element, OpenableTriggerConfig | null>;
    /**
     * Add a close button at the top right.
     *
     * @defaultValue true
     */
    closeButton?: boolean;
    /**
     * Automatically close the modal when clicking outside it or pressing Escape.
     * Furthermore, if any trigger opens the widget on
     * {@link OpenableTriggerConfig.hover}, the widget will be closed when the
     * pointer leaves both the trigger and the root.
     *
     * If you set this to false, then you should ensure {@link closeButton} is
     * enabled.
     *
     * @defaultValue true
     */
    autoClose?: boolean;
};
/**
 * Configures the given element as a {@link Offcanvas} widget.
 *
 * The Offcanvas widget sets up the given element to be hidden and open in a
 * fixed overlay (non full-screen) upon activation. Activation can be done
 * manually by calling {@link open} or when clicking on any of the given
 * {@link OffcanvasConfig.triggers | triggers}.
 *
 * **IMPORTANT:** You should not instantiate more than one {@link Openable}
 * widget, regardless of type, on a given element. Use {@link Openable.get} to
 * get an existing instance if any. If there is already an {@link Openable}
 * widget of any type on this element, it will be destroyed!
 *
 * -----
 *
 * You can use the following dynamic attributes or CSS properties in your
 * stylesheet:
 *
 * The following dynamic attributes are set on the root element that is created
 * by LISN and has a class `lisn-offcanvas__root`:
 * - `data-lisn-is-open`: `"true"` or `"false"`
 * - `data-lisn-place`: the actual position `"top"`, `"bottom"`, `"left"` or
 *   `"right"`
 *
 * The following dynamic attributes are set on each trigger:
 * - `data-lisn-opens-on-hover: `"true"` or `"false"`
 *
 * -----
 *
 * To use with auto-widgets (HTML API) (see
 * {@link Settings.settings.autoWidgets | settings.autoWidgets}), the following
 * CSS classes or data attributes are recognized:
 * - `lisn-offcanvas` class or `data-lisn-offcanvas` attribute set on the
 *   element that holds the content of the offcanvas
 * - `lisn-offcanvas-trigger` class or `data-lisn-offcanvas-trigger`
 *   attribute set on elements that should act as the triggers.
 *   If using a data attribute, you can configure the trigger via the value
 *   with a similar syntax to the configuration of the openable widget. For
 *   example:
 *   - Set the attribute to `"hover"` in order to have this trigger open the
 *     offcanvas on hover _in addition to click_.
 *   - Set the attribute to `"hover|auto-close=false"` in order to have this
 *     trigger open the offcanvas on hover but and override
 *     {@link OffcanvasConfig.autoClose} with true.
 *
 * When using auto-widgets, the elements that will be used as triggers are
 * discovered in the following way:
 * 1. If the content element has a `data-lisn-offcanvas-content-id` attribute,
 *    then it must be a unique (for the current page) ID. In this case, the
 *    trigger elements will be any element in the document that has a
 *    `lisn-offcanvas-trigger` class or `data-lisn-offcanvas-trigger` attribute
 *    and the same `data-lisn-offcanvas-content-id` attribute.
 * 2. Otherwise, the closest ancestor that has a `lisn-offcanvas-container`
 *    class, or if no such ancestor then the immediate parent of the content
 *    element, is searched for any elements that have a
 *    `lisn-offcanvas-trigger` class or `data-lisn-offcanvas-trigger` attribute
 *    and that do _not_ have a `data-lisn-offcanvas-content-id`
 *    attribute, and that are _not_ children of the content element.
 *
 * See below examples for what values you can use set for the data attributes
 * in order to modify the configuration of the automatically created widget.
 *
 * @example
 * This defines a simple offcanvas with one trigger.
 *
 * ```html
 * <div>
 *   <div class="lisn-offcanvas-trigger">Open</div>
 *   <div class="lisn-offcanvas">
 *     Some content here...
 *   </div>
 * </div>
 * ```
 *
 * @example
 * This defines a offcanvas that doesn't automatically close on click outside
 * or Escape and, and that has several triggers in a different parent to the
 * content.
 *
 * ```html
 * <div>
 *   <div data-lisn-offcanvas-content-id="offcanvas"
 *        data-lisn-offcanvas="auto-close=false">
 *     Lorem ipsum odor amet, consectetuer adipiscing elit. Etiam duis viverra
 *     faucibus facilisis luctus. Nunc tellus turpis facilisi dapibus aliquet
 *     turpis. Diam potenti egestas dolor auctor nostra vestibulum. Tempus
 *     auctor quis turpis; pulvinar ante ultrices. Netus morbi imperdiet
 *     volutpat litora tellus turpis a. Sociosqu interdum sodales sapien nulla
 *     aptent pellentesque praesent. Senectus magnis pellentesque; dis porta
 *     justo habitant.
 *   </div>
 * </div>
 *
 * <div>
 *   <div data-lisn-offcanvas-content-id="offcanvas" class="lisn-offcanvas-trigger">
 *     Open
 *   </div>
 * </div>
 *
 * <div>
 *   <div data-lisn-offcanvas-content-id="offcanvas" class="lisn-offcanvas-trigger">
 *     Another trigger
 *   </div>
 * </div>
 * ```
 *
 * @example
 * As above, but with all possible configuration settings set explicitly.
 *
 * ```html
 * <div>
 *   <div data-lisn-offcanvas-content-id="offcanvas"
 *        data-lisn-offcanvas="position=top | auto-close=false | close-button=true">
 *     Lorem ipsum odor amet, consectetuer adipiscing elit. Etiam duis viverra
 *     faucibus facilisis luctus. Nunc tellus turpis facilisi dapibus aliquet
 *     turpis. Diam potenti egestas dolor auctor nostra vestibulum. Tempus
 *     auctor quis turpis; pulvinar ante ultrices. Netus morbi imperdiet
 *     volutpat litora tellus turpis a. Sociosqu interdum sodales sapien nulla
 *     aptent pellentesque praesent. Senectus magnis pellentesque; dis porta
 *     justo habitant.
 *   </div>
 * </div>
 *
 * <div>
 *   <div data-lisn-offcanvas-content-id="offcanvas" class="lisn-offcanvas-trigger">
 *     Open
 *   </div>
 * </div>
 *
 * <div>
 *   <div data-lisn-offcanvas-content-id="offcanvas" class="lisn-offcanvas-trigger">
 *     Another trigger
 *   </div>
 * </div>
 * ```
 */
export declare class Offcanvas extends Openable {
    static register(): void;
    constructor(element: HTMLElement, config?: OffcanvasConfig);
}
/**
 * @interface
 */
export type OffcanvasConfig = {
    /**
     * The DOM ID to set on the offcanvas. Will result in the top-level root
     * element that's created by us getting this ID.
     *
     * Note, this does not replace or affect the `data-lisn-offcanvas-content-id`
     * attribute used to link triggers to the offcanvas.
     *
     * @defaultValue undefined
     */
    id?: string;
    /**
     * Class name(s) or a list of class names to set on the offcanvas. Will result
     * in the top-level root element that's created by us getting these classes.
     *
     * @defaultValue undefined
     */
    className?: string[] | string;
    /**
     * The elements that open the widget when clicked on. You can also pass a map
     * whose keys are the elements and values are {@link OpenableTriggerConfig}
     * objects.
     *
     * If not given, then the elements that will be used as triggers are
     * discovered in the following way:
     * 1. If the content element has a `data-lisn-offcanvas-content-id` attribute,
     *    then it must be a unique (for the current page) ID. In this case, the
     *    trigger elements will be any element in the document that has a
     *    `lisn-offcanvas-trigger` class or `data-lisn-offcanvas-trigger`
     *    attribute and the same `data-lisn-offcanvas-content-id` attribute.
     * 2. Otherwise, the closest ancestor that has a `lisn-offcanvas-container`
     *    class, or if no such ancestor then the immediate parent of the content
     *    element, is searched for any elements that have a
     *    `lisn-offcanvas-trigger` class or `data-lisn-offcanvas-trigger`
     *    attribute and that do _not_ have a `data-lisn-offcanvas-content-id`
     *    attribute, and that are _not_ children of the content element.
     *
     * @defaultValue undefined
     */
    triggers?: Element[] | Map<Element, OpenableTriggerConfig | null>;
    /**
     * Specify the offcanvas position. Supported positions are top, bottom, left,
     * right.
     *
     * @defaultValue "right"
     */
    position?: Position;
    /**
     * Add a close button at the top right.
     *
     * @defaultValue true
     */
    closeButton?: boolean;
    /**
     * Automatically close the offcanvas when clicking outside it or pressing
     * Escape. Furthermore, if any trigger opens the widget on
     * {@link OpenableTriggerConfig.hover}, the widget will be closed when the
     * pointer leaves both the trigger and the root.
     *
     * @defaultValue true
     */
    autoClose?: boolean;
};
//# sourceMappingURL=openable.d.ts.map