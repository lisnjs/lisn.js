/**
 * @module Widgets
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { settings } from "@lisn/globals/settings";

import { XYDirection, Position } from "@lisn/globals/types";

import {
  disableInitialTransition,
  hasClass,
  addClasses,
  addClassesNow,
  removeClasses,
  removeClassesNow,
  getData,
  getBooleanData,
  setData,
  setDataNow,
  setBooleanData,
  setBooleanDataNow,
  unsetBooleanData,
  unsetBooleanDataNow,
  delData,
  delDataNow,
  setHasModal,
  delHasModal,
  getStyleProp,
  setStyleProp,
  delStyleProp,
  getComputedStyleProp,
  getMaxTransitionDuration,
} from "@lisn/utils/css-alter";
import {
  wrapElement,
  wrapElementNow,
  moveElement,
  moveElementNow,
  replaceElementNow,
  getOrAssignID,
} from "@lisn/utils/dom-alter";
import { waitForInteractive } from "@lisn/utils/dom-events";
import {
  waitForMeasureTime,
  waitForMutateTime,
} from "@lisn/utils/dom-optimize";
import { isInlineTag } from "@lisn/utils/dom-query";
import { addEventListenerTo, removeEventListenerFrom } from "@lisn/utils/event";
import { logError } from "@lisn/utils/log";
import { keyWithMaxVal } from "@lisn/utils/math";
import { toBoolean, toArrayIfSingle } from "@lisn/utils/misc";
import { waitForDelay } from "@lisn/utils/tasks";
import { isValidPosition, isValidTwoFoldPosition } from "@lisn/utils/position";
import { fetchViewportSize } from "@lisn/utils/size";
import {
  validateStrList,
  validateBoolean,
  validateBooleanOrString,
  validateString,
} from "@lisn/utils/validation";

import { wrapCallback } from "@lisn/modules/callback";

import { SizeWatcher, SizeData } from "@lisn/watchers/size-watcher";
import { ViewWatcher, ViewData } from "@lisn/watchers/view-watcher";

import {
  Widget,
  WidgetHandler,
  WidgetCallback,
  WidgetConfigValidator,
  WidgetConfigValidatorObject,
  registerWidget,
  getWidgetConfig,
  getDefaultWidgetSelector,
} from "@lisn/widgets/widget";

/* ********************
 * Base Openable
 * ********************/

export type OpenableCreateFn<Config extends Record<string, unknown>> = (
  element: HTMLElement,
  config?: Config,
) => Openable;

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
export const registerOpenable = <Config extends Record<string, unknown>>(
  name: string,
  newOpenable: OpenableCreateFn<Config>,
  configValidator?: null | WidgetConfigValidator<Config>,
) => {
  registerWidget(
    name,
    (element, config) => {
      if (MH.isHTMLElement(element)) {
        if (!Openable.get(element)) {
          return newOpenable(element, config);
        }
      } else {
        logError(MH.usageError("Openable widget supports only HTMLElement"));
      }

      return null;
    },
    configValidator,
  );
};

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
export abstract class Openable extends Widget {
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
  static get(element: Element): Openable | null {
    // We manage the instances here since we also map associated elements and
    // not just the main content element that created the widget.
    return instances.get(element) || null;
  }

  constructor(element: HTMLElement, properties: OpenableProperties) {
    super(element);

    const { isModal, isOffcanvas } = properties;

    const openCallbacks = MH.newSet<WidgetCallback>();
    const closeCallbacks = MH.newSet<WidgetCallback>();

    let isOpen = false;

    // ----------

    const open = async () => {
      if (this.isDisabled() || isOpen) {
        return;
      }

      isOpen = true;

      for (const callback of openCallbacks) {
        await callback.invoke(this);
      }

      if (isModal) {
        setHasModal();
      }

      await setBooleanData(root, PREFIX_IS_OPEN);
    };

    // ----------

    const close = async () => {
      if (this.isDisabled() || !isOpen) {
        return;
      }

      isOpen = false;

      for (const callback of closeCallbacks) {
        await callback.invoke(this);
      }

      if (isModal) {
        delHasModal();
      }

      if (isOffcanvas) {
        scrollWrapperToTop(); // no need to await
      }

      await unsetBooleanData(root, PREFIX_IS_OPEN);
    };

    // ----------

    const scrollWrapperToTop = async () => {
      // Wait a bit before scrolling since the hiding of the element is animated.
      // Assume no more than 1s animation time.
      await waitForDelay(1000);
      await waitForMeasureTime();
      MH.elScrollTo(outerWrapper, {
        top: 0,
        left: 0,
      });
    };

    // --------------------

    this.open = open;
    this.close = close;
    this[MC.S_TOGGLE] = () => (isOpen ? close() : open());
    this.onOpen = (handler) => openCallbacks.add(wrapCallback(handler));
    this.onClose = (handler) => closeCallbacks.add(wrapCallback(handler));
    this.isOpen = () => isOpen;
    this.getRoot = () => root;
    this.getContainer = () => container;
    this.getTriggers = () => [...triggers.keys()];
    this.getTriggerConfigs = () => MH.newMap([...triggers.entries()]);

    this.onDestroy(() => {
      openCallbacks.clear();
      closeCallbacks.clear();
    });

    const { root, container, triggers, outerWrapper } = setupElements(
      this,
      element,
      properties,
    );
  }
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
   * The DOM ID of the trigger. Will result in the trigger element, which could
   * be a wrapper around the original element (as in the case of
   * {@link Collapsible} you passed, getting this ID.
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
   * The DOM ID of the openable. Will result in the top-level root element
   * that's created by us getting this ID.
   *
   * @defaultValue undefined
   */
  id?: string;

  /**
   * Class name(s) or a list of class names of the openable. Will result in the
   * top-level root element that's created by us getting these classes.
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

/* ********************
 * Collapsible
 * ********************/

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
export class Collapsible extends Openable {
  static register() {
    registerOpenable(
      WIDGET_NAME_COLLAPSIBLE,
      (el, config) => new Collapsible(el, config),
      collapsibleConfigValidator,
    );
  }

  constructor(element: HTMLElement, config?: CollapsibleConfig) {
    const isHorizontal = config?.horizontal;
    const orientation = isHorizontal ? MC.S_HORIZONTAL : MC.S_VERTICAL;

    const onSetup = () => {
      // The triggers here are wrappers around the original which will be
      // replaced by the original on destroy, so no need to clean up this.
      for (const [
        trigger,
        triggerConfig,
      ] of this.getTriggerConfigs().entries()) {
        insertCollapsibleIcon(trigger, triggerConfig, this, config);
        setDataNow(trigger, MC.PREFIX_ORIENTATION, orientation);
      }
    };

    super(element, {
      name: WIDGET_NAME_COLLAPSIBLE,
      id: config?.id,
      className: config?.className,
      autoClose: config?.autoClose ?? false,
      isModal: false,
      isOffcanvas: false,
      closeButton: false,
      triggers: config?.triggers,
      wrapTriggers: true,
      onSetup,
    });

    const root = this.getRoot();
    const wrapper = MH.childrenOf(root)[0];

    setData(root, MC.PREFIX_ORIENTATION, orientation);
    setBooleanData(root, PREFIX_REVERSE, config?.reverse ?? false);

    // -------------------- Transitions
    disableInitialTransition(element, 100);
    disableInitialTransition(root, 100);
    disableInitialTransition(wrapper, 100);

    let disableTransitionTimer: ReturnType<typeof setTimeout> | null = null;
    const tempEnableTransition = async () => {
      await removeClasses(root, MC.PREFIX_TRANSITION_DISABLE);
      await removeClasses(wrapper, MC.PREFIX_TRANSITION_DISABLE);

      if (disableTransitionTimer) {
        MH.clearTimer(disableTransitionTimer);
      }

      const transitionDuration = await getMaxTransitionDuration(root);
      disableTransitionTimer = MH.setTimer(() => {
        if (this.isOpen()) {
          addClasses(root, MC.PREFIX_TRANSITION_DISABLE);
          addClasses(wrapper, MC.PREFIX_TRANSITION_DISABLE);
          disableTransitionTimer = null;
        }
      }, transitionDuration);
    };

    // Disable transitions except during open/close, so that resizing the
    // window for example doesn't result in lagging width/height transition.
    this.onOpen(tempEnableTransition);
    this.onClose(tempEnableTransition);

    // -------------------- Peek
    const peek = config?.peek;
    if (peek) {
      (async () => {
        let peekSize: string | null = null;
        if (MH.isString(peek)) {
          peekSize = peek;
        } else {
          peekSize = await getStyleProp(element, VAR_PEEK_SIZE);
        }

        addClasses(root, PREFIX_PEEK);
        if (peekSize) {
          setStyleProp(root, VAR_PEEK_SIZE, peekSize);
        }
      })();
    }

    // -------------------- Width in horizontal mode
    if (isHorizontal) {
      const updateWidth = async () => {
        const width = await getComputedStyleProp(root, MC.S_WIDTH);
        await setStyleProp(element, VAR_JS_COLLAPSIBLE_WIDTH, width);
      };

      MH.setTimer(updateWidth);

      // Save its current width so that if it contains text, it does not
      // "collapse" and end up super tall.
      this.onClose(updateWidth);

      this.onOpen(async () => {
        // Update the content width before opening.
        await updateWidth();

        // Delete the fixed width property soon after opening to allow it to
        // resize again while it's open.
        waitForDelay(2000).then(() => {
          if (this.isOpen()) {
            delStyleProp(element, VAR_JS_COLLAPSIBLE_WIDTH);
          }
        });
      });
    }
  }
}

/**
 * @interface
 */
export type CollapsibleConfig = {
  /**
   * The DOM ID of the collapsible. Will result in the top-level root element
   * that's created by us getting this ID.
   *
   * Note, this does not replace or affect the
   * `data-lisn-collapsible-content-id` attribute used to link triggers to the
   * collapsible.
   *
   * @defaultValue undefined
   */
  id?: string;

  /**
   * Class name(s) or a list of class names of the collapsible. Will result in
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

/* ********************
 * Popup
 * ********************/

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
export class Popup extends Openable {
  static register() {
    registerOpenable(
      WIDGET_NAME_POPUP,
      (el, config) => new Popup(el, config),
      popupConfigValidator,
    );
  }

  constructor(element: HTMLElement, config?: PopupConfig) {
    super(element, {
      name: WIDGET_NAME_POPUP,
      id: config?.id,
      className: config?.className,
      autoClose: config?.autoClose ?? true,
      isModal: false,
      isOffcanvas: false,
      closeButton: config?.closeButton ?? false,
      triggers: config?.triggers,
    });

    const root = this.getRoot();
    const container = this.getContainer();

    const position = config?.position ?? S_AUTO;
    if (position !== S_AUTO) {
      setData(root, MC.PREFIX_PLACE, position);
    }

    if (container && position === S_AUTO) {
      // Automatic position
      this.onOpen(async () => {
        const [contentSize, containerView] = await MH.promiseAll([
          SizeWatcher.reuse().fetchCurrentSize(element),
          ViewWatcher.reuse().fetchCurrentView(container),
        ]);

        const placement = await fetchPopupPlacement(contentSize, containerView);
        if (placement) {
          await setData(root, MC.PREFIX_PLACE, placement);
        }
      });
    }
  }
}

/**
 * @interface
 */
export type PopupConfig = {
  /**
   * The DOM ID of the popup. Will result in the top-level root element that's
   * created by us getting this ID.
   *
   * Note, this does not replace or affect the `data-lisn-popup-content-id`
   * attribute used to link triggers to the popup.
   *
   * @defaultValue undefined
   */
  id?: string;

  /**
   * Class name(s) or a list of class names of the popup. Will result in the
   * top-level root element that's created by us getting these classes.
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

/* ********************
 * Modal
 * ********************/

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
export class Modal extends Openable {
  static register() {
    registerOpenable(
      WIDGET_NAME_MODAL,
      (el, config) => new Modal(el, config),
      modalConfigValidator,
    );
  }

  constructor(element: HTMLElement, config?: ModalConfig) {
    super(element, {
      name: WIDGET_NAME_MODAL,
      id: config?.id,
      className: config?.className,
      autoClose: config?.autoClose ?? true,
      isModal: true,
      isOffcanvas: true,
      closeButton: config?.closeButton ?? true,
      triggers: config?.triggers,
    });
  }
}

/**
 * @interface
 */
export type ModalConfig = {
  /**
   * The DOM ID of the modal. Will result in the top-level root element that's
   * created by us getting this ID.
   *
   * Note, this does not replace or affect the `data-lisn-modal-content-id`
   * attribute used to link triggers to the modal.
   *
   * @defaultValue undefined
   */
  id?: string;

  /**
   * Class name(s) or a list of class names of the modal. Will result in the
   * top-level root element that's created by us getting these classes.
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

/* ********************
 * Offcanvas
 * ********************/

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
export class Offcanvas extends Openable {
  static register() {
    registerOpenable(
      WIDGET_NAME_OFFCANVAS,
      (el, config) => new Offcanvas(el, config),
      offcanvasConfigValidator,
    );
  }

  constructor(element: HTMLElement, config?: OffcanvasConfig) {
    super(element, {
      name: WIDGET_NAME_OFFCANVAS,
      id: config?.id,
      className: config?.className,
      autoClose: config?.autoClose ?? true,
      isModal: false,
      isOffcanvas: true,
      closeButton: config?.closeButton ?? true,
      triggers: config?.triggers,
    });

    const position = config?.position || MC.S_RIGHT;
    setData(this.getRoot(), MC.PREFIX_PLACE, position);
  }
}

/**
 * @interface
 */
export type OffcanvasConfig = {
  /**
   * The DOM ID of the offcanvas. Will result in the top-level root element
   * that's created by us getting this ID.
   *
   * Note, this does not replace or affect the `data-lisn-offcanvas-content-id`
   * attribute used to link triggers to the offcanvas.
   *
   * @defaultValue undefined
   */
  id?: string;

  /**
   * Class name(s) or a list of class names of the offcanvas. Will result in
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

// ------------------------------

type ElementsCollection = {
  content: HTMLElement;
  root: HTMLElement;
  container: HTMLElement | null;
  outerWrapper: HTMLElement;
  triggers: Map<Element, OpenableTriggerConfig>;
};

const instances = MH.newWeakMap<Element, Openable>();

const WIDGET_NAME_COLLAPSIBLE = "collapsible";
const WIDGET_NAME_POPUP = "popup";
const WIDGET_NAME_MODAL = "modal";
const WIDGET_NAME_OFFCANVAS = "offcanvas";

const PREFIX_CLOSE_BTN = MH.prefixName("close-button");
const PREFIX_IS_OPEN = MH.prefixName("is-open");
const PREFIX_REVERSE = MH.prefixName(MC.S_REVERSE);
const PREFIX_PEEK = MH.prefixName("peek");
const PREFIX_OPENS_ON_HOVER = MH.prefixName("opens-on-hover");
const PREFIX_LINE = MH.prefixName("line");
const PREFIX_ICON_POSITION = MH.prefixName("icon-position");
const PREFIX_TRIGGER_ICON = MH.prefixName("trigger-icon");
const PREFIX_ICON_WRAPPER = MH.prefixName("icon-wrapper");
const S_AUTO = "auto";
const S_ARIA_EXPANDED = MC.ARIA_PREFIX + "expanded";
const S_ARIA_MODAL = MC.ARIA_PREFIX + "modal";
const VAR_PEEK_SIZE = MH.prefixCssVar("peek-size");
const VAR_JS_COLLAPSIBLE_WIDTH = MH.prefixCssJsVar("collapsible-width");
const MIN_CLICK_TIME_AFTER_HOVER_OPEN = 1000;
const S_ARROW_UP =
  `${MC.S_ARROW}-${MC.S_UP}` as `${typeof MC.S_ARROW}-${typeof MC.S_UP}`;
const S_ARROW_DOWN =
  `${MC.S_ARROW}-${MC.S_DOWN}` as `${typeof MC.S_ARROW}-${typeof MC.S_DOWN}`;
const S_ARROW_LEFT =
  `${MC.S_ARROW}-${MC.S_LEFT}` as `${typeof MC.S_ARROW}-${typeof MC.S_LEFT}`;
const S_ARROW_RIGHT =
  `${MC.S_ARROW}-${MC.S_RIGHT}` as `${typeof MC.S_ARROW}-${typeof MC.S_RIGHT}`;

const ARROW_TYPES = [
  S_ARROW_UP,
  S_ARROW_DOWN,
  S_ARROW_LEFT,
  S_ARROW_RIGHT,
] as const;

const ICON_CLOSED_TYPES = ["plus", ...ARROW_TYPES] as const;
const ICON_OPEN_TYPES = ["minus", "x", ...ARROW_TYPES] as const;
type IconCloseType = (typeof ICON_CLOSED_TYPES)[number];
type IconOpenType = (typeof ICON_OPEN_TYPES)[number];

const isValidIconClosed = (value: string): value is IconCloseType =>
  MH.includes(ICON_CLOSED_TYPES, value);

const isValidIconOpen = (value: string): value is IconOpenType =>
  MH.includes(ICON_OPEN_TYPES, value);

const triggerConfigValidator: WidgetConfigValidatorObject<OpenableTriggerConfig> =
  {
    id: validateString,
    className: (key, value) => validateStrList(key, toArrayIfSingle(value)),
    autoClose: validateBoolean,
    icon: (key, value) =>
      value && toBoolean(value) === false
        ? false
        : validateString(key, value, isValidPosition),
    iconClosed: (key, value) => validateString(key, value, isValidIconClosed),
    iconOpen: (key, value) => validateString(key, value, isValidIconOpen),
    hover: validateBoolean,
  };

const collapsibleConfigValidator: WidgetConfigValidatorObject<CollapsibleConfig> =
  {
    id: validateString,
    className: (key, value) => validateStrList(key, toArrayIfSingle(value)),
    horizontal: validateBoolean,
    reverse: validateBoolean,
    peek: validateBooleanOrString,
    autoClose: validateBoolean,
    icon: (key, value) =>
      toBoolean(value) === false
        ? false
        : validateString(key, value, isValidPosition),
    iconClosed: (key, value) => validateString(key, value, isValidIconClosed),
    iconOpen: (key, value) => validateString(key, value, isValidIconOpen),
  };

const popupConfigValidator: WidgetConfigValidatorObject<PopupConfig> = {
  id: validateString,
  className: (key, value) => validateStrList(key, toArrayIfSingle(value)),
  closeButton: validateBoolean,
  position: (key, value) =>
    validateString(
      key,
      value,
      (v) => v === S_AUTO || isValidPosition(v) || isValidTwoFoldPosition(v),
    ),
  autoClose: validateBoolean,
};

const modalConfigValidator: WidgetConfigValidatorObject<ModalConfig> = {
  id: validateString,
  className: (key, value) => validateStrList(key, toArrayIfSingle(value)),
  closeButton: validateBoolean,
  autoClose: validateBoolean,
};

const offcanvasConfigValidator: WidgetConfigValidatorObject<OffcanvasConfig> = {
  id: validateString,
  className: (key, value) => validateStrList(key, toArrayIfSingle(value)),
  closeButton: validateBoolean,
  position: (key, value) => validateString(key, value, isValidPosition),
  autoClose: validateBoolean,
};

const getPrefixedNames = (name: string) => {
  const pref = MH.prefixName(name);
  return {
    _root: `${pref}__root`,
    _overlay: `${pref}__overlay`, // only used for modal/offcanvas
    _innerWrapper: `${pref}__inner-wrapper`,
    _outerWrapper: `${pref}__outer-wrapper`,
    _content: `${pref}__content`,
    _container: `${pref}__container`,
    _trigger: `${pref}__trigger`,
    // Use different classes for styling to the ones used for auto-discovering
    // elements, so that re-creating existing widgets can correctly find the
    // elements to be used by the new widget synchronously before the current
    // one is destroyed.
    _containerForSelect: `${pref}-container`,
    _triggerForSelect: `${pref}-trigger`,
    _contentId: `${pref}-content-id`,
  };
};

const findContainer = (content: Element, cls: string) => {
  const currWidget = instances.get(content);
  // If there's an existing widget that we're about to destroy, the content
  // element will be wrapped in several elements and won't be restored until
  // the next mutate time. In that case, to correctly determine the container
  // element, use the current widget's root element, which is located in the
  // content element's original place.
  let childRef = currWidget?.getRoot() || content;
  if (!MH.parentOf(childRef)) {
    // The current widget is not yet initialized (i.e. we are re-creating it
    // immediately after it was constructed)
    childRef = content;
  }

  // Find the content container
  let container: HTMLElement | null = childRef.closest(`.${cls}`);
  if (!container) {
    container = MH.parentOf(childRef);
  }

  return container;
};

const findTriggers = (
  content: Element,
  prefixedNames: ReturnType<typeof getPrefixedNames>,
) => {
  const container = findContainer(content, prefixedNames._containerForSelect);
  // jsdom does not like the below selector when suffixed by [data-*] or :not()...
  // const triggerSelector = `:is(.${prefixedNames._triggerForSelect},[data-${prefixedNames._triggerForSelect}])`;
  // So use this:
  const getTriggerSelector = (suffix: string) =>
    `.${prefixedNames._triggerForSelect}${suffix},` +
    `[data-${prefixedNames._triggerForSelect}]${suffix}`;

  const contentId = getData(content, prefixedNames._contentId);
  let triggers: Element[] = [];

  if (contentId) {
    triggers = [
      ...MH.docQuerySelectorAll(
        getTriggerSelector(`[data-${prefixedNames._contentId}="${contentId}"]`),
      ),
    ];
  } else if (container) {
    triggers = [
      ...MH.arrayFrom(
        MH.querySelectorAll(
          container,
          getTriggerSelector(`:not([data-${prefixedNames._contentId}])`),
        ),
      ).filter((t) => !content.contains(t)),
    ];
  }

  return triggers;
};

const getTriggersFrom = (
  content: Element,
  inputTriggers:
    | Element[]
    | Map<Element, OpenableTriggerConfig | null>
    | undefined,
  wrapTriggers: boolean,
  prefixedNames: ReturnType<typeof getPrefixedNames>,
) => {
  const triggerMap = MH.newMap<Element, OpenableTriggerConfig>();

  inputTriggers = inputTriggers || findTriggers(content, prefixedNames);

  const addTrigger = (
    trigger: Element,
    triggerConfig: OpenableTriggerConfig,
  ) => {
    if (wrapTriggers) {
      const wrapper = MH.createElement(
        isInlineTag(MH.tagName(trigger)) ? "span" : "div",
      );
      wrapElement(trigger, { wrapper, ignoreMove: true }); // no need to await
      trigger = wrapper;
    }

    triggerMap.set(trigger, triggerConfig);
  };

  if (MH.isArray(inputTriggers)) {
    for (const trigger of inputTriggers) {
      addTrigger(
        trigger,
        getWidgetConfig(
          getData(trigger, prefixedNames._triggerForSelect),
          triggerConfigValidator,
        ),
      );
    }
  } else if (MH.isInstanceOf(inputTriggers, Map)) {
    for (const [trigger, triggerConfig] of inputTriggers.entries()) {
      addTrigger(
        trigger,
        getWidgetConfig(triggerConfig, triggerConfigValidator),
      );
    }
  }

  return triggerMap;
};

const setupElements = (
  widget: Openable,
  content: HTMLElement,
  properties: OpenableProperties,
): ElementsCollection => {
  const prefixedNames = getPrefixedNames(properties.name);
  const container = findContainer(content, prefixedNames._containerForSelect);

  const wrapTriggers = properties.wrapTriggers ?? false;
  const triggers = getTriggersFrom(
    content,
    properties.triggers,
    wrapTriggers,
    prefixedNames,
  );

  // Create two wrappers
  const innerWrapper = MH.createElement("div");
  addClasses(innerWrapper, prefixedNames._innerWrapper);

  const outerWrapper = wrapElementNow(innerWrapper);

  // Setup the root element.
  // For off-canvas types we need another wrapper to serve as the root and we
  // need a placeholder element to save the content's original position so it
  // can be restored on destroy.
  // Otherwise use outerWrapper for root and insert the root where the content
  // was.
  let root: HTMLElement;
  let placeholder: HTMLElement;
  if (properties.isOffcanvas) {
    addClasses(outerWrapper, prefixedNames._outerWrapper);
    root = wrapElementNow(outerWrapper);
    placeholder = MH.createElement("div");

    const overlay = MH.createElement("div");
    addClasses(overlay, prefixedNames._overlay);
    moveElement(overlay, { to: root });
  } else {
    // Otherwise use the outer wrapper as the root
    root = placeholder = outerWrapper;
  }

  if (properties.id) {
    root.id = properties.id;
  }

  if (properties.className) {
    addClassesNow(root, ...toArrayIfSingle(properties.className));
  }

  unsetBooleanData(root, PREFIX_IS_OPEN);
  const domID = getOrAssignID(root, properties.name);

  if (properties.isModal) {
    MH.setAttr(root, MC.S_ROLE, "dialog");
    MH.setAttr(root, S_ARIA_MODAL);
  }

  addClasses(root, prefixedNames._root);
  disableInitialTransition(root);

  // Add a close button?
  if (properties.closeButton) {
    const closeBtn = MH.createButton("Close");
    addClasses(closeBtn, PREFIX_CLOSE_BTN);

    // If autoClose is true, it will be closed on click anyway, because the
    // close button is outside the content.
    addEventListenerTo(closeBtn, MC.S_CLICK, () => {
      widget.close();
    });

    moveElement(closeBtn, { to: properties.isOffcanvas ? root : innerWrapper });
  }

  // Transfer the relevant classes/data attrs from content to root element, so
  // that our CSS can work without :has.
  // This won't cause forced layout since the root is not yet attached to the
  // DOM.
  for (const cls of [
    settings.lightThemeClassName,
    settings.darkThemeClassName,
  ]) {
    if (hasClass(content, cls)) {
      addClasses(root, cls);
    }
  }

  const elements = {
    content,
    root,
    container,
    outerWrapper,
    triggers,
  };

  // -------------------- Close / destroy hooks
  widget.onClose(async () => {
    for (const trigger of triggers.keys()) {
      delData(trigger, PREFIX_OPENS_ON_HOVER);
      MH.unsetAttr(trigger, S_ARIA_EXPANDED);
      await unsetBooleanData(trigger, PREFIX_IS_OPEN);
    }
  });

  widget.onDestroy(async () => {
    await waitForMutateTime();

    replaceElementNow(placeholder, content, { ignoreMove: true });
    moveElementNow(root); // remove
    removeClassesNow(content, prefixedNames._content);

    if (container) {
      removeClassesNow(container, prefixedNames._container);
    }

    for (const [trigger, triggerConfig] of triggers.entries()) {
      MH.delAttr(trigger, MC.S_ARIA_CONTROLS);
      MH.delAttr(trigger, S_ARIA_EXPANDED);

      delDataNow(trigger, PREFIX_OPENS_ON_HOVER);
      delDataNow(trigger, PREFIX_IS_OPEN);

      removeClassesNow(
        trigger,
        prefixedNames._trigger,
        ...(triggerConfig?.className || []),
      );

      if (trigger.id === triggerConfig?.id) {
        trigger.id = "";
      }

      if (wrapTriggers) {
        replaceElementNow(trigger, MH.childrenOf(trigger)[0], {
          ignoreMove: true,
        });
      }
    }

    triggers.clear();

    for (const el of [content, ...triggers.keys()]) {
      if (instances.get(el) === widget) {
        MH.deleteKey(instances, el);
      }
    }
  });

  // -------------------- SETUP
  // Save the elements so we can lookup the instance
  const currWidget = instances.get(content);
  for (const el of [content, ...triggers.keys()]) {
    instances.set(el, widget);
  }

  // Wait for the DOMWatcher to be active, which may not be before interactive.
  waitForInteractive()
    .then(currWidget?.destroy)
    .then(waitForMutateTime)
    .then(() => {
      if (widget.isDestroyed()) {
        return;
      }

      addClassesNow(content, prefixedNames._content);

      if (container) {
        addClassesNow(container, prefixedNames._container);
      }

      if (properties.isOffcanvas) {
        moveElementNow(root, {
          to: MH.getBody(),
          ignoreMove: true,
        });
      }

      // Move the placeholder element to before the content and then move
      // content into inner wrapper.
      moveElementNow(placeholder, {
        // for not-offcanvas it's also the root
        to: content,
        position: "before",
        ignoreMove: true,
      });

      moveElementNow(content, { to: innerWrapper, ignoreMove: true });

      // Setup the triggers
      for (const [trigger, triggerConfig] of triggers.entries()) {
        MH.setAttr(trigger, MC.S_ARIA_CONTROLS, domID);
        MH.unsetAttr(trigger, S_ARIA_EXPANDED);

        setBooleanDataNow(
          trigger,
          PREFIX_OPENS_ON_HOVER,
          triggerConfig[MC.S_HOVER],
        );
        unsetBooleanDataNow(trigger, PREFIX_IS_OPEN);

        addClassesNow(
          trigger,
          prefixedNames._trigger,
          ...(triggerConfig?.className || []),
        );

        if (triggerConfig?.id) {
          trigger.id = triggerConfig.id;
        }
      }

      setupListeners(widget, elements, properties, prefixedNames);

      if (properties.onSetup) {
        properties.onSetup();
      }
    });

  return elements;
};

const setupListeners = (
  widget: Openable,
  elements: ElementsCollection,
  properties: OpenableProperties,
  prefixedNames: ReturnType<typeof getPrefixedNames>,
) => {
  const { content, root, triggers } = elements;
  const doc = MH.getDoc();

  let hoverTimeOpened = 0;
  let isPointerOver = false;
  let activeTrigger: Element | null = null;

  // ----------

  const isTrigger = (element: Element) =>
    MH.includes(
      MH.arrayFrom(triggers.keys()),
      element.closest(getDefaultWidgetSelector(prefixedNames._trigger)),
    );

  const shouldPreventDefault = (trigger: Element) =>
    triggers.get(trigger)?.preventDefault ?? true;

  const usesHover = (trigger: Element) => triggers.get(trigger)?.hover;

  const usesAutoClose = (trigger: Element | null) =>
    (trigger ? triggers.get(trigger)?.autoClose : null) ?? properties.autoClose;

  // ----------

  const toggleTrigger = (event: Event, openIt?: boolean) => {
    const trigger = MH.currentTargetOf(event);
    if (MH.isElement(trigger)) {
      if (shouldPreventDefault(trigger)) {
        MH.preventDefault(event);
      }

      // If a click was fired shortly after opening on hover, ignore
      if (
        openIt !== false && // not explicitly asked to close
        widget.isOpen() &&
        MH.timeSince(hoverTimeOpened) < MIN_CLICK_TIME_AFTER_HOVER_OPEN
      ) {
        return;
      }

      if (openIt ?? !widget.isOpen()) {
        // open it
        activeTrigger = trigger;
        MH.setAttr(trigger, S_ARIA_EXPANDED); // will be unset on close
        setBooleanData(trigger, PREFIX_IS_OPEN); // will be unset on close

        widget.open(); // no need to await

        if (usesAutoClose(trigger)) {
          if (usesHover(trigger)) {
            addEventListenerTo(root, MC.S_POINTERENTER, setIsPointerOver);
            addEventListenerTo(root, MC.S_POINTERLEAVE, pointerLeft);
          }

          // auto-close listeners setup by the onOpen handler below
        }
      } else {
        widget.close(); // out onClose handler below will remove listeners
      }
    }
  };

  // ----------

  const setIsPointerOver = () => {
    isPointerOver = true;
  };

  // ----------

  const unsetIsPointerOver = (event: Event) => {
    // Keep it set to true if this is a touch pointer type; otherwise unset
    isPointerOver = isPointerOver && MH.isTouchPointerEvent(event);
  };

  // ----------

  const pointerEntered = (event: Event) => {
    setIsPointerOver();
    if (!widget.isOpen()) {
      hoverTimeOpened = MH.timeNow();
      toggleTrigger(event, true);
    }
  };

  // ----------

  const pointerLeft = (event: Event) => {
    unsetIsPointerOver(event);
    const trigger = MH.currentTargetOf(event);
    if (MH.isElement(trigger) && usesAutoClose(trigger)) {
      MH.setTimer(
        () => {
          if (!isPointerOver) {
            widget.close();
          }
        },
        // use a delay that allows the mouse to move from trigger to content
        // without closing it
        // TODO make this user-configurable
        properties.isOffcanvas ? 300 : 50,
      );
    }
  };

  // ----------

  const closeIfEscape = (event: Event) => {
    if ((event as KeyboardEvent).key === "Escape") {
      widget.close(); // no need to await
    }
  };

  // ----------

  const closeIfClickOutside = (event: Event) => {
    const target = MH.targetOf(event);
    if (
      target === doc ||
      (MH.isElement(target) &&
        !content.contains(target) && // outside content
        !isTrigger(target)) // handled by pointer watcher
    ) {
      widget.close();
    }
  };

  // ----------

  const maybeSetupAutoCloseListeners = (
    trigger: Element | null,
    remove: boolean,
  ) => {
    if (usesAutoClose(trigger)) {
      const addOrRemove = remove ? removeEventListenerFrom : addEventListenerTo;

      addOrRemove(doc, "keyup", closeIfEscape);

      // Add a short delay so that we don't catch the bubbling of the click event
      // that opened the widget.
      MH.setTimer(() => addOrRemove(doc, MC.S_CLICK, closeIfClickOutside), 100);

      if (trigger && usesHover(trigger)) {
        addOrRemove(trigger, MC.S_POINTERLEAVE, pointerLeft);
      }
    }
  };

  // ----------

  const setupOrCleanup = (remove: boolean) => {
    const addOrRemove = remove ? removeEventListenerFrom : addEventListenerTo;

    for (const [trigger, triggerConfig] of triggers.entries()) {
      // Always setup click listeners
      addOrRemove(trigger, MC.S_CLICK, toggleTrigger);

      if (triggerConfig[MC.S_HOVER]) {
        addOrRemove(trigger, MC.S_POINTERENTER, pointerEntered);
      }
    }
  };

  // ----------

  setupOrCleanup(false);

  widget.onOpen(() => {
    maybeSetupAutoCloseListeners(activeTrigger, false); // setup listeners if relevant
  });

  widget.onClose(() => {
    hoverTimeOpened = 0;
    isPointerOver = false;

    removeEventListenerFrom(root, MC.S_POINTERENTER, setIsPointerOver);
    removeEventListenerFrom(root, MC.S_POINTERLEAVE, pointerLeft);

    maybeSetupAutoCloseListeners(activeTrigger, true); // remove listeners if any
    activeTrigger = null;
  });

  widget.onDestroy(() => {
    setupOrCleanup(true); // remove
  });
};

// COLLAPSIBLE ------------------------------

const insertCollapsibleIcon = (
  trigger: Element,
  triggerConfig: OpenableTriggerConfig,
  widget: Collapsible,
  widgetConfig: CollapsibleConfig | undefined,
) => {
  const iconPosition = triggerConfig.icon ?? widgetConfig?.icon;
  const iconClosed =
    triggerConfig.iconClosed ?? widgetConfig?.iconClosed ?? "plus";
  const iconOpen = triggerConfig.iconOpen ?? widgetConfig?.iconOpen ?? "minus";

  if (iconPosition) {
    addClasses(trigger, PREFIX_ICON_WRAPPER);
    setData(trigger, PREFIX_ICON_POSITION, iconPosition);

    const icon = MH.createElement("span");
    setDataNow(icon, PREFIX_TRIGGER_ICON, iconClosed);

    for (let l = 0; l < 2; l++) {
      const line = MH.createElement("span");
      addClassesNow(line, PREFIX_LINE);
      moveElementNow(line, { to: icon });
    }

    moveElement(icon, { to: trigger, ignoreMove: true });

    widget.onOpen(() => {
      if (getBooleanData(trigger, PREFIX_IS_OPEN)) {
        setData(icon, PREFIX_TRIGGER_ICON, iconOpen);
      }
    });

    widget.onClose(() => {
      setData(icon, PREFIX_TRIGGER_ICON, iconClosed);
    });
  }
};

// POPUP ------------------------------

const fetchPopupPlacement = async (
  contentSize: SizeData,
  containerView: ViewData,
) => {
  const containerPosition = containerView.relative;
  const containerTop = containerPosition[MC.S_TOP];
  const containerBottom = containerPosition[MC.S_BOTTOM];
  const containerLeft = containerPosition[MC.S_LEFT];
  const containerRight = containerPosition[MC.S_RIGHT];
  const containerHMiddle = containerPosition.hMiddle;
  const containerVMiddle = containerPosition.vMiddle;
  const vpSize = await fetchViewportSize();
  const popupWidth = contentSize.border[MC.S_WIDTH] / vpSize[MC.S_WIDTH];
  const popupHeight = contentSize.border[MC.S_HEIGHT] / vpSize[MC.S_HEIGHT];

  // - Find the maximum of these quantities:
  //   - containerTop - popupHeight:
  //     the space on top if placed on top-(left|right|)
  //   - 1 - (containerBottom + popupHeight):
  //     the space on bottom be if placed on bottom-(left|right|)
  //   - containerLeft - popupWidth:
  //     the space on left if placed on left-(top|bottom|)
  //   - 1 - (containerRight + popupWidth):
  //     the space on right if placed on right-(top|bottom|)
  //
  // This determines the main placement: top|bottom|left|right

  // Then to determine secondary alignment:
  // - For top/bottom placement, determine horizontal alignment:
  //   - Find the maximum of these quantities:
  //     - 1 - (containerLeft + popupWidth):
  //       the space on right if left-aligned
  //     - containerRight - popupWidth:
  //       the space on left if right-aligned
  //     - min(
  //           containerHMiddle - popupWidth / 2,
  //           1 - (containerHMiddle + popupWidth / 2),
  //       ):
  //       the minimum of the space on either left or right if center-aligned
  //
  // - For left/right placement, determine vertical alignment:
  //   - Find the maximum of these quantities:
  //     - 1 - (containerTop + popupHeight):
  //       the space on bottom if top-aligned
  //     - containerBottom - popupHeight:
  //       the space on top if bottom-aligned
  //     - min(
  //           containerVMiddle - popupHeight / 2,
  //           1 - (containerVMiddle + popupHeight / 2),
  //       ):
  //       the minimum of the space on either top or bottom if center-aligned

  const placementVars = {
    top: containerTop - popupHeight,
    bottom: 1 - (containerBottom + popupHeight),
    left: containerLeft - popupWidth,
    right: 1 - (containerRight + popupWidth),
  };

  const placement = keyWithMaxVal(placementVars);
  if (placement === undefined) {
    // container must be out-view and so left/right are NaN
    return;
  }
  let finalPlacement = placement;

  let alignmentVars;
  switch (placement) {
    case MC.S_TOP:
    case MC.S_BOTTOM:
      alignmentVars = {
        left: 1 - (containerLeft + popupWidth),
        right: containerRight - popupWidth,
        middle: MH.min(
          containerHMiddle - popupWidth / 2,
          1 - (containerHMiddle + popupWidth / 2),
        ),
      };
      break;

    case MC.S_LEFT:
    case MC.S_RIGHT:
      alignmentVars = {
        top: 1 - (containerTop + popupHeight),
        bottom: containerBottom - popupHeight,
        middle: MH.min(
          containerVMiddle - popupHeight / 2,
          1 - (containerVMiddle + popupHeight / 2),
        ),
      };
      break;

    default:
      return;
  }

  const alignment = keyWithMaxVal(alignmentVars);
  if (alignment !== "middle") {
    finalPlacement += "-" + alignment;
  }

  return finalPlacement;
};
