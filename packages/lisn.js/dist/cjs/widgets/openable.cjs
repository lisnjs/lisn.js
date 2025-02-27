"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerOpenable = exports.Popup = exports.Openable = exports.Offcanvas = exports.Modal = exports.Collapsible = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _settings = require("../globals/settings.cjs");
var _cssAlter = require("../utils/css-alter.cjs");
var _domAlter = require("../utils/dom-alter.cjs");
var _domEvents = require("../utils/dom-events.cjs");
var _domOptimize = require("../utils/dom-optimize.cjs");
var _domQuery = require("../utils/dom-query.cjs");
var _event = require("../utils/event.cjs");
var _log = require("../utils/log.cjs");
var _math = require("../utils/math.cjs");
var _misc = require("../utils/misc.cjs");
var _tasks = require("../utils/tasks.cjs");
var _position = require("../utils/position.cjs");
var _size = require("../utils/size.cjs");
var _validation = require("../utils/validation.cjs");
var _callback = require("../modules/callback.cjs");
var _sizeWatcher = require("../watchers/size-watcher.cjs");
var _viewWatcher = require("../watchers/view-watcher.cjs");
var _widget = require("./widget.cjs");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Widgets
 */
/* ********************
 * Base Openable
 * ********************/

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
const registerOpenable = (name, newOpenable, configValidator) => {
  (0, _widget.registerWidget)(name, (element, config) => {
    if (MH.isHTMLElement(element)) {
      if (!Openable.get(element)) {
        return newOpenable(element, config);
      }
    } else {
      (0, _log.logError)(MH.usageError("Openable widget supports only HTMLElement"));
    }
    return null;
  }, configValidator);
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
exports.registerOpenable = registerOpenable;
class Openable extends _widget.Widget {
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
  static get(element) {
    // We manage the instances here since we also map associated elements and
    // not just the main content element that created the widget.
    return instances.get(element) || null;
  }
  constructor(element, properties) {
    super(element);
    /**
     * Opens the widget unless it is disabled.
     */
    _defineProperty(this, "open", void 0);
    /**
     * Closes the widget.
     */
    _defineProperty(this, "close", void 0);
    /**
     * Closes the widget if it is open, or opens it if it is closed (unless
     * it is disabled).
     */
    _defineProperty(this, "toggle", void 0);
    /**
     * The given handler will be called when the widget is open.
     *
     * If it returns a promise, it will be awaited upon.
     */
    _defineProperty(this, "onOpen", void 0);
    /**
     * The given handler will be called when the widget is closed.
     *
     * If it returns a promise, it will be awaited upon.
     */
    _defineProperty(this, "onClose", void 0);
    /**
     * Returns true if the widget is currently open.
     */
    _defineProperty(this, "isOpen", void 0);
    /**
     * Returns the root element created by us that wraps the original content
     * element passed to the constructor. It is located in the content element's
     * original place.
     */
    _defineProperty(this, "getRoot", void 0);
    /**
     * Returns the element that was found to be the container. It is the closest
     * ancestor that has a `lisn-collapsible-container` class, or if no such
     * ancestor then the immediate parent of the content element.
     */
    _defineProperty(this, "getContainer", void 0);
    /**
     * Returns the trigger elements, if any. Note that these may be wrappers
     * around the original triggers passed.
     */
    _defineProperty(this, "getTriggers", void 0);
    /**
     * Returns the trigger elements along with their configuration.
     */
    _defineProperty(this, "getTriggerConfigs", void 0);
    const {
      isModal,
      isOffcanvas
    } = properties;
    const openCallbacks = MH.newSet();
    const closeCallbacks = MH.newSet();
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
        (0, _cssAlter.setHasModal)();
      }
      await (0, _cssAlter.setBooleanData)(root, PREFIX_IS_OPEN);
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
        (0, _cssAlter.delHasModal)();
      }
      if (isOffcanvas) {
        scrollWrapperToTop(); // no need to await
      }
      await (0, _cssAlter.unsetBooleanData)(root, PREFIX_IS_OPEN);
    };

    // ----------

    const scrollWrapperToTop = async () => {
      // Wait a bit before scrolling since the hiding of the element is animated.
      // Assume no more than 1s animation time.
      await (0, _tasks.waitForDelay)(1000);
      await (0, _domOptimize.waitForMeasureTime)();
      MH.elScrollTo(outerWrapper, {
        top: 0,
        left: 0
      });
    };

    // --------------------

    this.open = open;
    this.close = close;
    this[MC.S_TOGGLE] = () => isOpen ? close() : open();
    this.onOpen = handler => openCallbacks.add((0, _callback.wrapCallback)(handler));
    this.onClose = handler => closeCallbacks.add((0, _callback.wrapCallback)(handler));
    this.isOpen = () => isOpen;
    this.getRoot = () => root;
    this.getContainer = () => container;
    this.getTriggers = () => [...triggers.keys()];
    this.getTriggerConfigs = () => MH.newMap([...triggers.entries()]);
    this.onDestroy(() => {
      openCallbacks.clear();
      closeCallbacks.clear();
    });
    const {
      root,
      container,
      triggers,
      outerWrapper
    } = setupElements(this, element, properties);
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

/**
 * @interface
 */
exports.Openable = Openable;
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
class Collapsible extends Openable {
  static register() {
    registerOpenable(WIDGET_NAME_COLLAPSIBLE, (el, config) => new Collapsible(el, config), collapsibleConfigValidator);
  }
  constructor(element, config) {
    var _config$autoClose, _config$reverse;
    const isHorizontal = config === null || config === void 0 ? void 0 : config.horizontal;
    const orientation = isHorizontal ? MC.S_HORIZONTAL : MC.S_VERTICAL;
    const onSetup = () => {
      // The triggers here are wrappers around the original which will be
      // replaced by the original on destroy, so no need to clean up this.
      for (const [trigger, triggerConfig] of this.getTriggerConfigs().entries()) {
        insertCollapsibleIcon(trigger, triggerConfig, this, config);
        (0, _cssAlter.setDataNow)(trigger, MC.PREFIX_ORIENTATION, orientation);
      }
    };
    super(element, {
      name: WIDGET_NAME_COLLAPSIBLE,
      id: config === null || config === void 0 ? void 0 : config.id,
      className: config === null || config === void 0 ? void 0 : config.className,
      autoClose: (_config$autoClose = config === null || config === void 0 ? void 0 : config.autoClose) !== null && _config$autoClose !== void 0 ? _config$autoClose : false,
      isModal: false,
      isOffcanvas: false,
      closeButton: false,
      triggers: config === null || config === void 0 ? void 0 : config.triggers,
      wrapTriggers: true,
      onSetup
    });
    const root = this.getRoot();
    const wrapper = MH.childrenOf(root)[0];
    (0, _cssAlter.setData)(root, MC.PREFIX_ORIENTATION, orientation);
    (0, _cssAlter.setBooleanData)(root, PREFIX_REVERSE, (_config$reverse = config === null || config === void 0 ? void 0 : config.reverse) !== null && _config$reverse !== void 0 ? _config$reverse : false);

    // -------------------- Transitions
    (0, _cssAlter.disableInitialTransition)(element, 100);
    (0, _cssAlter.disableInitialTransition)(root, 100);
    (0, _cssAlter.disableInitialTransition)(wrapper, 100);
    let disableTransitionTimer = null;
    const tempEnableTransition = async () => {
      await (0, _cssAlter.removeClasses)(root, MC.PREFIX_TRANSITION_DISABLE);
      await (0, _cssAlter.removeClasses)(wrapper, MC.PREFIX_TRANSITION_DISABLE);
      if (disableTransitionTimer) {
        MH.clearTimer(disableTransitionTimer);
      }
      const transitionDuration = await (0, _cssAlter.getMaxTransitionDuration)(root);
      disableTransitionTimer = MH.setTimer(() => {
        if (this.isOpen()) {
          (0, _cssAlter.addClasses)(root, MC.PREFIX_TRANSITION_DISABLE);
          (0, _cssAlter.addClasses)(wrapper, MC.PREFIX_TRANSITION_DISABLE);
          disableTransitionTimer = null;
        }
      }, transitionDuration);
    };

    // Disable transitions except during open/close, so that resizing the
    // window for example doesn't result in lagging width/height transition.
    this.onOpen(tempEnableTransition);
    this.onClose(tempEnableTransition);

    // -------------------- Peek
    const peek = config === null || config === void 0 ? void 0 : config.peek;
    if (peek) {
      (async () => {
        let peekSize = null;
        if (MH.isString(peek)) {
          peekSize = peek;
        } else {
          peekSize = await (0, _cssAlter.getStyleProp)(element, VAR_PEEK_SIZE);
        }
        (0, _cssAlter.addClasses)(root, PREFIX_PEEK);
        if (peekSize) {
          (0, _cssAlter.setStyleProp)(root, VAR_PEEK_SIZE, peekSize);
        }
      })();
    }

    // -------------------- Width in horizontal mode
    if (isHorizontal) {
      const updateWidth = async () => {
        const width = await (0, _cssAlter.getComputedStyleProp)(root, MC.S_WIDTH);
        await (0, _cssAlter.setStyleProp)(element, VAR_JS_COLLAPSIBLE_WIDTH, width);
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
        (0, _tasks.waitForDelay)(2000).then(() => {
          if (this.isOpen()) {
            (0, _cssAlter.delStyleProp)(element, VAR_JS_COLLAPSIBLE_WIDTH);
          }
        });
      });
    }
  }
}

/**
 * @interface
 */
exports.Collapsible = Collapsible;
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
class Popup extends Openable {
  static register() {
    registerOpenable(WIDGET_NAME_POPUP, (el, config) => new Popup(el, config), popupConfigValidator);
  }
  constructor(element, config) {
    var _config$autoClose2, _config$closeButton, _config$position;
    super(element, {
      name: WIDGET_NAME_POPUP,
      id: config === null || config === void 0 ? void 0 : config.id,
      className: config === null || config === void 0 ? void 0 : config.className,
      autoClose: (_config$autoClose2 = config === null || config === void 0 ? void 0 : config.autoClose) !== null && _config$autoClose2 !== void 0 ? _config$autoClose2 : true,
      isModal: false,
      isOffcanvas: false,
      closeButton: (_config$closeButton = config === null || config === void 0 ? void 0 : config.closeButton) !== null && _config$closeButton !== void 0 ? _config$closeButton : false,
      triggers: config === null || config === void 0 ? void 0 : config.triggers
    });
    const root = this.getRoot();
    const container = this.getContainer();
    const position = (_config$position = config === null || config === void 0 ? void 0 : config.position) !== null && _config$position !== void 0 ? _config$position : S_AUTO;
    if (position !== S_AUTO) {
      (0, _cssAlter.setData)(root, MC.PREFIX_PLACE, position);
    }
    if (container && position === S_AUTO) {
      // Automatic position
      this.onOpen(async () => {
        const [contentSize, containerView] = await MH.promiseAll([_sizeWatcher.SizeWatcher.reuse().fetchCurrentSize(element), _viewWatcher.ViewWatcher.reuse().fetchCurrentView(container)]);
        const placement = await fetchPopupPlacement(contentSize, containerView);
        if (placement) {
          await (0, _cssAlter.setData)(root, MC.PREFIX_PLACE, placement);
        }
      });
    }
  }
}

/**
 * @interface
 */
exports.Popup = Popup;
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
class Modal extends Openable {
  static register() {
    registerOpenable(WIDGET_NAME_MODAL, (el, config) => new Modal(el, config), modalConfigValidator);
  }
  constructor(element, config) {
    var _config$autoClose3, _config$closeButton2;
    super(element, {
      name: WIDGET_NAME_MODAL,
      id: config === null || config === void 0 ? void 0 : config.id,
      className: config === null || config === void 0 ? void 0 : config.className,
      autoClose: (_config$autoClose3 = config === null || config === void 0 ? void 0 : config.autoClose) !== null && _config$autoClose3 !== void 0 ? _config$autoClose3 : true,
      isModal: true,
      isOffcanvas: true,
      closeButton: (_config$closeButton2 = config === null || config === void 0 ? void 0 : config.closeButton) !== null && _config$closeButton2 !== void 0 ? _config$closeButton2 : true,
      triggers: config === null || config === void 0 ? void 0 : config.triggers
    });
  }
}

/**
 * @interface
 */
exports.Modal = Modal;
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
class Offcanvas extends Openable {
  static register() {
    registerOpenable(WIDGET_NAME_OFFCANVAS, (el, config) => new Offcanvas(el, config), offcanvasConfigValidator);
  }
  constructor(element, config) {
    var _config$autoClose4, _config$closeButton3;
    super(element, {
      name: WIDGET_NAME_OFFCANVAS,
      id: config === null || config === void 0 ? void 0 : config.id,
      className: config === null || config === void 0 ? void 0 : config.className,
      autoClose: (_config$autoClose4 = config === null || config === void 0 ? void 0 : config.autoClose) !== null && _config$autoClose4 !== void 0 ? _config$autoClose4 : true,
      isModal: false,
      isOffcanvas: true,
      closeButton: (_config$closeButton3 = config === null || config === void 0 ? void 0 : config.closeButton) !== null && _config$closeButton3 !== void 0 ? _config$closeButton3 : true,
      triggers: config === null || config === void 0 ? void 0 : config.triggers
    });
    const position = (config === null || config === void 0 ? void 0 : config.position) || MC.S_RIGHT;
    (0, _cssAlter.setData)(this.getRoot(), MC.PREFIX_PLACE, position);
  }
}

/**
 * @interface
 */

// ------------------------------
exports.Offcanvas = Offcanvas;
const instances = MH.newWeakMap();
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
const S_ARROW_UP = `${MC.S_ARROW}-${MC.S_UP}`;
const S_ARROW_DOWN = `${MC.S_ARROW}-${MC.S_DOWN}`;
const S_ARROW_LEFT = `${MC.S_ARROW}-${MC.S_LEFT}`;
const S_ARROW_RIGHT = `${MC.S_ARROW}-${MC.S_RIGHT}`;
const ARROW_TYPES = [S_ARROW_UP, S_ARROW_DOWN, S_ARROW_LEFT, S_ARROW_RIGHT];
const ICON_CLOSED_TYPES = ["plus", ...ARROW_TYPES];
const ICON_OPEN_TYPES = ["minus", "x", ...ARROW_TYPES];
const isValidIconClosed = value => MH.includes(ICON_CLOSED_TYPES, value);
const isValidIconOpen = value => MH.includes(ICON_OPEN_TYPES, value);
const triggerConfigValidator = {
  id: _validation.validateString,
  className: (key, value) => (0, _validation.validateStrList)(key, (0, _misc.toArrayIfSingle)(value)),
  autoClose: _validation.validateBoolean,
  icon: (key, value) => value && (0, _misc.toBoolean)(value) === false ? false : (0, _validation.validateString)(key, value, _position.isValidPosition),
  iconClosed: (key, value) => (0, _validation.validateString)(key, value, isValidIconClosed),
  iconOpen: (key, value) => (0, _validation.validateString)(key, value, isValidIconOpen),
  hover: _validation.validateBoolean
};
const collapsibleConfigValidator = {
  id: _validation.validateString,
  className: (key, value) => (0, _validation.validateStrList)(key, (0, _misc.toArrayIfSingle)(value)),
  horizontal: _validation.validateBoolean,
  reverse: _validation.validateBoolean,
  peek: _validation.validateBooleanOrString,
  autoClose: _validation.validateBoolean,
  icon: (key, value) => (0, _misc.toBoolean)(value) === false ? false : (0, _validation.validateString)(key, value, _position.isValidPosition),
  iconClosed: (key, value) => (0, _validation.validateString)(key, value, isValidIconClosed),
  iconOpen: (key, value) => (0, _validation.validateString)(key, value, isValidIconOpen)
};
const popupConfigValidator = {
  id: _validation.validateString,
  className: (key, value) => (0, _validation.validateStrList)(key, (0, _misc.toArrayIfSingle)(value)),
  closeButton: _validation.validateBoolean,
  position: (key, value) => (0, _validation.validateString)(key, value, v => v === S_AUTO || (0, _position.isValidPosition)(v) || (0, _position.isValidTwoFoldPosition)(v)),
  autoClose: _validation.validateBoolean
};
const modalConfigValidator = {
  id: _validation.validateString,
  className: (key, value) => (0, _validation.validateStrList)(key, (0, _misc.toArrayIfSingle)(value)),
  closeButton: _validation.validateBoolean,
  autoClose: _validation.validateBoolean
};
const offcanvasConfigValidator = {
  id: _validation.validateString,
  className: (key, value) => (0, _validation.validateStrList)(key, (0, _misc.toArrayIfSingle)(value)),
  closeButton: _validation.validateBoolean,
  position: (key, value) => (0, _validation.validateString)(key, value, _position.isValidPosition),
  autoClose: _validation.validateBoolean
};
const getPrefixedNames = name => {
  const pref = MH.prefixName(name);
  return {
    _root: `${pref}__root`,
    _overlay: `${pref}__overlay`,
    // only used for modal/offcanvas
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
    _contentId: `${pref}-content-id`
  };
};
const findContainer = (content, cls) => {
  const currWidget = instances.get(content);
  // If there's an existing widget that we're about to destroy, the content
  // element will be wrapped in several elements and won't be restored until
  // the next mutate time. In that case, to correctly determine the container
  // element, use the current widget's root element, which is located in the
  // content element's original place.
  let childRef = (currWidget === null || currWidget === void 0 ? void 0 : currWidget.getRoot()) || content;
  if (!MH.parentOf(childRef)) {
    // The current widget is not yet initialized (i.e. we are re-creating it
    // immediately after it was constructed)
    childRef = content;
  }

  // Find the content container
  let container = childRef.closest(`.${cls}`);
  if (!container) {
    container = MH.parentOf(childRef);
  }
  return container;
};
const findTriggers = (content, prefixedNames) => {
  const container = findContainer(content, prefixedNames._containerForSelect);
  // jsdom does not like the below selector when suffixed by [data-*] or :not()...
  // const triggerSelector = `:is(.${prefixedNames._triggerForSelect},[data-${prefixedNames._triggerForSelect}])`;
  // So use this:
  const getTriggerSelector = suffix => `.${prefixedNames._triggerForSelect}${suffix},` + `[data-${prefixedNames._triggerForSelect}]${suffix}`;
  const contentId = (0, _cssAlter.getData)(content, prefixedNames._contentId);
  let triggers = [];
  if (contentId) {
    triggers = [...MH.docQuerySelectorAll(getTriggerSelector(`[data-${prefixedNames._contentId}="${contentId}"]`))];
  } else if (container) {
    triggers = [...MH.arrayFrom(MH.querySelectorAll(container, getTriggerSelector(`:not([data-${prefixedNames._contentId}])`))).filter(t => !content.contains(t))];
  }
  return triggers;
};
const getTriggersFrom = (content, inputTriggers, wrapTriggers, prefixedNames) => {
  const triggerMap = MH.newMap();
  inputTriggers = inputTriggers || findTriggers(content, prefixedNames);
  const addTrigger = (trigger, triggerConfig) => {
    if (wrapTriggers) {
      const wrapper = MH.createElement((0, _domQuery.isInlineTag)(MH.tagName(trigger)) ? "span" : "div");
      (0, _domAlter.wrapElement)(trigger, {
        wrapper,
        ignoreMove: true
      }); // no need to await
      trigger = wrapper;
    }
    triggerMap.set(trigger, triggerConfig);
  };
  if (MH.isArray(inputTriggers)) {
    for (const trigger of inputTriggers) {
      addTrigger(trigger, (0, _widget.getWidgetConfig)((0, _cssAlter.getData)(trigger, prefixedNames._triggerForSelect), triggerConfigValidator));
    }
  } else if (MH.isInstanceOf(inputTriggers, Map)) {
    for (const [trigger, triggerConfig] of inputTriggers.entries()) {
      addTrigger(trigger, (0, _widget.getWidgetConfig)(triggerConfig, triggerConfigValidator));
    }
  }
  return triggerMap;
};
const setupElements = (widget, content, properties) => {
  var _properties$wrapTrigg;
  const prefixedNames = getPrefixedNames(properties.name);
  const container = findContainer(content, prefixedNames._containerForSelect);
  const wrapTriggers = (_properties$wrapTrigg = properties.wrapTriggers) !== null && _properties$wrapTrigg !== void 0 ? _properties$wrapTrigg : false;
  const triggers = getTriggersFrom(content, properties.triggers, wrapTriggers, prefixedNames);

  // Create two wrappers
  const innerWrapper = MH.createElement("div");
  (0, _cssAlter.addClasses)(innerWrapper, prefixedNames._innerWrapper);
  const outerWrapper = (0, _domAlter.wrapElementNow)(innerWrapper);

  // Setup the root element.
  // For off-canvas types we need another wrapper to serve as the root and we
  // need a placeholder element to save the content's original position so it
  // can be restored on destroy.
  // Otherwise use outerWrapper for root and insert the root where the content
  // was.
  let root;
  let placeholder;
  if (properties.isOffcanvas) {
    (0, _cssAlter.addClasses)(outerWrapper, prefixedNames._outerWrapper);
    root = (0, _domAlter.wrapElementNow)(outerWrapper);
    placeholder = MH.createElement("div");
    const overlay = MH.createElement("div");
    (0, _cssAlter.addClasses)(overlay, prefixedNames._overlay);
    (0, _domAlter.moveElement)(overlay, {
      to: root
    });
  } else {
    // Otherwise use the outer wrapper as the root
    root = placeholder = outerWrapper;
  }
  if (properties.id) {
    root.id = properties.id;
  }
  if (properties.className) {
    (0, _cssAlter.addClassesNow)(root, ...(0, _misc.toArrayIfSingle)(properties.className));
  }
  (0, _cssAlter.unsetBooleanData)(root, PREFIX_IS_OPEN);
  const domID = (0, _domAlter.getOrAssignID)(root, properties.name);
  if (properties.isModal) {
    MH.setAttr(root, MC.S_ROLE, "dialog");
    MH.setAttr(root, S_ARIA_MODAL);
  }
  (0, _cssAlter.addClasses)(root, prefixedNames._root);
  (0, _cssAlter.disableInitialTransition)(root);

  // Add a close button?
  if (properties.closeButton) {
    const closeBtn = MH.createButton("Close");
    (0, _cssAlter.addClasses)(closeBtn, PREFIX_CLOSE_BTN);

    // If autoClose is true, it will be closed on click anyway, because the
    // close button is outside the content.
    (0, _event.addEventListenerTo)(closeBtn, MC.S_CLICK, () => {
      widget.close();
    });
    (0, _domAlter.moveElement)(closeBtn, {
      to: properties.isOffcanvas ? root : innerWrapper
    });
  }

  // Transfer the relevant classes/data attrs from content to root element, so
  // that our CSS can work without :has.
  // This won't cause forced layout since the root is not yet attached to the
  // DOM.
  for (const cls of [_settings.settings.lightThemeClassName, _settings.settings.darkThemeClassName]) {
    if ((0, _cssAlter.hasClass)(content, cls)) {
      (0, _cssAlter.addClasses)(root, cls);
    }
  }
  const elements = {
    content,
    root,
    container,
    outerWrapper,
    triggers
  };

  // -------------------- Close / destroy hooks
  widget.onClose(async () => {
    for (const trigger of triggers.keys()) {
      (0, _cssAlter.delData)(trigger, PREFIX_OPENS_ON_HOVER);
      MH.unsetAttr(trigger, S_ARIA_EXPANDED);
      await (0, _cssAlter.unsetBooleanData)(trigger, PREFIX_IS_OPEN);
    }
  });
  widget.onDestroy(async () => {
    await (0, _domOptimize.waitForMutateTime)();
    (0, _domAlter.replaceElementNow)(placeholder, content, {
      ignoreMove: true
    });
    (0, _domAlter.moveElementNow)(root); // remove
    (0, _cssAlter.removeClassesNow)(content, prefixedNames._content);
    if (container) {
      (0, _cssAlter.removeClassesNow)(container, prefixedNames._container);
    }
    for (const [trigger, triggerConfig] of triggers.entries()) {
      MH.delAttr(trigger, MC.S_ARIA_CONTROLS);
      MH.delAttr(trigger, S_ARIA_EXPANDED);
      (0, _cssAlter.delDataNow)(trigger, PREFIX_OPENS_ON_HOVER);
      (0, _cssAlter.delDataNow)(trigger, PREFIX_IS_OPEN);
      (0, _cssAlter.removeClassesNow)(trigger, prefixedNames._trigger, ...((triggerConfig === null || triggerConfig === void 0 ? void 0 : triggerConfig.className) || []));
      if (trigger.id === (triggerConfig === null || triggerConfig === void 0 ? void 0 : triggerConfig.id)) {
        trigger.id = "";
      }
      if (wrapTriggers) {
        (0, _domAlter.replaceElementNow)(trigger, MH.childrenOf(trigger)[0], {
          ignoreMove: true
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
  (0, _domEvents.waitForInteractive)().then(currWidget === null || currWidget === void 0 ? void 0 : currWidget.destroy).then(_domOptimize.waitForMutateTime).then(() => {
    if (widget.isDestroyed()) {
      return;
    }
    (0, _cssAlter.addClassesNow)(content, prefixedNames._content);
    if (container) {
      (0, _cssAlter.addClassesNow)(container, prefixedNames._container);
    }
    if (properties.isOffcanvas) {
      (0, _domAlter.moveElementNow)(root, {
        to: MH.getBody(),
        ignoreMove: true
      });
    }

    // Move the placeholder element to before the content and then move
    // content into inner wrapper.
    (0, _domAlter.moveElementNow)(placeholder, {
      // for not-offcanvas it's also the root
      to: content,
      position: "before",
      ignoreMove: true
    });
    (0, _domAlter.moveElementNow)(content, {
      to: innerWrapper,
      ignoreMove: true
    });

    // Setup the triggers
    for (const [trigger, triggerConfig] of triggers.entries()) {
      MH.setAttr(trigger, MC.S_ARIA_CONTROLS, domID);
      MH.unsetAttr(trigger, S_ARIA_EXPANDED);
      (0, _cssAlter.setBooleanDataNow)(trigger, PREFIX_OPENS_ON_HOVER, triggerConfig[MC.S_HOVER]);
      (0, _cssAlter.unsetBooleanDataNow)(trigger, PREFIX_IS_OPEN);
      (0, _cssAlter.addClassesNow)(trigger, prefixedNames._trigger, ...((triggerConfig === null || triggerConfig === void 0 ? void 0 : triggerConfig.className) || []));
      if (triggerConfig !== null && triggerConfig !== void 0 && triggerConfig.id) {
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
const setupListeners = (widget, elements, properties, prefixedNames) => {
  const {
    content,
    root,
    triggers
  } = elements;
  const doc = MH.getDoc();
  let hoverTimeOpened = 0;
  let isPointerOver = false;
  let activeTrigger = null;

  // ----------

  const isTrigger = element => MH.includes(MH.arrayFrom(triggers.keys()), element.closest((0, _widget.getDefaultWidgetSelector)(prefixedNames._trigger)));
  const shouldPreventDefault = trigger => {
    var _triggers$get$prevent, _triggers$get;
    return (_triggers$get$prevent = (_triggers$get = triggers.get(trigger)) === null || _triggers$get === void 0 ? void 0 : _triggers$get.preventDefault) !== null && _triggers$get$prevent !== void 0 ? _triggers$get$prevent : true;
  };
  const usesHover = trigger => {
    var _triggers$get2;
    return (_triggers$get2 = triggers.get(trigger)) === null || _triggers$get2 === void 0 ? void 0 : _triggers$get2.hover;
  };
  const usesAutoClose = trigger => {
    var _ref, _triggers$get3;
    return (_ref = trigger ? (_triggers$get3 = triggers.get(trigger)) === null || _triggers$get3 === void 0 ? void 0 : _triggers$get3.autoClose : null) !== null && _ref !== void 0 ? _ref : properties.autoClose;
  };

  // ----------

  const toggleTrigger = (event, openIt) => {
    const trigger = MH.currentTargetOf(event);
    if (MH.isElement(trigger)) {
      if (shouldPreventDefault(trigger)) {
        MH.preventDefault(event);
      }

      // If a click was fired shortly after opening on hover, ignore
      if (openIt !== false &&
      // not explicitly asked to close
      widget.isOpen() && MH.timeSince(hoverTimeOpened) < MIN_CLICK_TIME_AFTER_HOVER_OPEN) {
        return;
      }
      if (openIt !== null && openIt !== void 0 ? openIt : !widget.isOpen()) {
        // open it
        activeTrigger = trigger;
        MH.setAttr(trigger, S_ARIA_EXPANDED); // will be unset on close
        (0, _cssAlter.setBooleanData)(trigger, PREFIX_IS_OPEN); // will be unset on close

        widget.open(); // no need to await

        if (usesAutoClose(trigger)) {
          if (usesHover(trigger)) {
            (0, _event.addEventListenerTo)(root, MC.S_POINTERENTER, setIsPointerOver);
            (0, _event.addEventListenerTo)(root, MC.S_POINTERLEAVE, pointerLeft);
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

  const unsetIsPointerOver = event => {
    // Keep it set to true if this is a touch pointer type; otherwise unset
    isPointerOver = isPointerOver && MH.isTouchPointerEvent(event);
  };

  // ----------

  const pointerEntered = event => {
    setIsPointerOver();
    if (!widget.isOpen()) {
      hoverTimeOpened = MH.timeNow();
      toggleTrigger(event, true);
    }
  };

  // ----------

  const pointerLeft = event => {
    unsetIsPointerOver(event);
    const trigger = MH.currentTargetOf(event);
    if (MH.isElement(trigger) && usesAutoClose(trigger)) {
      MH.setTimer(() => {
        if (!isPointerOver) {
          widget.close();
        }
      },
      // use a delay that allows the mouse to move from trigger to content
      // without closing it
      // TODO make this user-configurable
      properties.isOffcanvas ? 300 : 50);
    }
  };

  // ----------

  const closeIfEscape = event => {
    if (event.key === "Escape") {
      widget.close(); // no need to await
    }
  };

  // ----------

  const closeIfClickOutside = event => {
    const target = MH.targetOf(event);
    if (target === doc || MH.isElement(target) && !content.contains(target) &&
    // outside content
    !isTrigger(target) // handled by pointer watcher
    ) {
      widget.close();
    }
  };

  // ----------

  const maybeSetupAutoCloseListeners = (trigger, remove) => {
    if (usesAutoClose(trigger)) {
      const addOrRemove = remove ? _event.removeEventListenerFrom : _event.addEventListenerTo;
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

  const setupOrCleanup = remove => {
    const addOrRemove = remove ? _event.removeEventListenerFrom : _event.addEventListenerTo;
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
    (0, _event.removeEventListenerFrom)(root, MC.S_POINTERENTER, setIsPointerOver);
    (0, _event.removeEventListenerFrom)(root, MC.S_POINTERLEAVE, pointerLeft);
    maybeSetupAutoCloseListeners(activeTrigger, true); // remove listeners if any
    activeTrigger = null;
  });
  widget.onDestroy(() => {
    setupOrCleanup(true); // remove
  });
};

// COLLAPSIBLE ------------------------------

const insertCollapsibleIcon = (trigger, triggerConfig, widget, widgetConfig) => {
  var _triggerConfig$icon, _ref2, _triggerConfig$iconCl, _ref3, _triggerConfig$iconOp;
  const iconPosition = (_triggerConfig$icon = triggerConfig.icon) !== null && _triggerConfig$icon !== void 0 ? _triggerConfig$icon : widgetConfig === null || widgetConfig === void 0 ? void 0 : widgetConfig.icon;
  const iconClosed = (_ref2 = (_triggerConfig$iconCl = triggerConfig.iconClosed) !== null && _triggerConfig$iconCl !== void 0 ? _triggerConfig$iconCl : widgetConfig === null || widgetConfig === void 0 ? void 0 : widgetConfig.iconClosed) !== null && _ref2 !== void 0 ? _ref2 : "plus";
  const iconOpen = (_ref3 = (_triggerConfig$iconOp = triggerConfig.iconOpen) !== null && _triggerConfig$iconOp !== void 0 ? _triggerConfig$iconOp : widgetConfig === null || widgetConfig === void 0 ? void 0 : widgetConfig.iconOpen) !== null && _ref3 !== void 0 ? _ref3 : "minus";
  if (iconPosition) {
    (0, _cssAlter.addClasses)(trigger, PREFIX_ICON_WRAPPER);
    (0, _cssAlter.setData)(trigger, PREFIX_ICON_POSITION, iconPosition);
    const icon = MH.createElement("span");
    (0, _cssAlter.setDataNow)(icon, PREFIX_TRIGGER_ICON, iconClosed);
    for (let l = 0; l < 2; l++) {
      const line = MH.createElement("span");
      (0, _cssAlter.addClassesNow)(line, PREFIX_LINE);
      (0, _domAlter.moveElementNow)(line, {
        to: icon
      });
    }
    (0, _domAlter.moveElement)(icon, {
      to: trigger,
      ignoreMove: true
    });
    widget.onOpen(() => {
      if ((0, _cssAlter.getBooleanData)(trigger, PREFIX_IS_OPEN)) {
        (0, _cssAlter.setData)(icon, PREFIX_TRIGGER_ICON, iconOpen);
      }
    });
    widget.onClose(() => {
      (0, _cssAlter.setData)(icon, PREFIX_TRIGGER_ICON, iconClosed);
    });
  }
};

// POPUP ------------------------------

const fetchPopupPlacement = async (contentSize, containerView) => {
  const containerPosition = containerView.relative;
  const containerTop = containerPosition[MC.S_TOP];
  const containerBottom = containerPosition[MC.S_BOTTOM];
  const containerLeft = containerPosition[MC.S_LEFT];
  const containerRight = containerPosition[MC.S_RIGHT];
  const containerHMiddle = containerPosition.hMiddle;
  const containerVMiddle = containerPosition.vMiddle;
  const vpSize = await (0, _size.fetchViewportSize)();
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
    right: 1 - (containerRight + popupWidth)
  };
  const placement = (0, _math.keyWithMaxVal)(placementVars);
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
        middle: MH.min(containerHMiddle - popupWidth / 2, 1 - (containerHMiddle + popupWidth / 2))
      };
      break;
    case MC.S_LEFT:
    case MC.S_RIGHT:
      alignmentVars = {
        top: 1 - (containerTop + popupHeight),
        bottom: containerBottom - popupHeight,
        middle: MH.min(containerVMiddle - popupHeight / 2, 1 - (containerVMiddle + popupHeight / 2))
      };
      break;
    default:
      return;
  }
  const alignment = (0, _math.keyWithMaxVal)(alignmentVars);
  if (alignment !== "middle") {
    finalPlacement += "-" + alignment;
  }
  return finalPlacement;
};
//# sourceMappingURL=openable.cjs.map