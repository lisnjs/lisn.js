/**
 * @module Settings
 */

import * as MH from "@lisn/globals/minification-helpers";

/**
 * LISN's settings.
 * @readonly
 *
 * If you wish to modify them, then you need to do so immediately after loading
 * LISN before you instantiate any watchers, etc. For example:
 *
 * ```html
 * <!doctype html>
 * <html>
 *   <head>
 *     <meta charset="UTF-8" />
 *     <meta name="viewport" content="width=device-width" />
 *     <script src="lisn.js" charset="utf-8"></script>
 *     <script charset="utf-8">
 *       // modify LISN settings, for example:
 *       LISN.settings.deviceBreakpoints.desktop = 1024;
 *     </script>
 *   </head>
 *   <body>
 *   </body>
 * </html>
 * ```
 */
export const settings = MH.preventExtensions({
  /**
   * A unique selector (preferably `#some-id`) for the element that holds the
   * main page content, if other than `document.body`.
   *
   * E.g. if your main content is inside a custom scrollable container, rather
   * than directly in `document.body`, then pass a selector for it here.
   *
   * The element must be scrollable, i.e. have a fixed size and `overflow: scroll`.
   *
   * **IMPORTANT:** You must set this before initializing any watchers, widgets,
   * etc. If you are using the HTML API, then you must set this before the
   * document `readyState` becomes interactive.
   *
   * @defaultValue null // document.scrollingElement
   * @category Generic
   */
  mainScrollableElementSelector: null as string | null,

  /**
   * This setting allows us to automatically wrap certain elements or groups of
   * elements into a single `div` or `span` element to allow for more reliable
   * or efficient working of certain features. In particular:
   *
   * 1. View tracking using relative offsets and a scrolling root **requires wrapping**
   *
   * When using view position tracking with a percentage offset specification
   * (e.g. `top: 50%`) _and_ a custom root element that is scrollable_ (and
   * obviously has a size smaller than the content), you **MUST** enable
   * content wrapping, otherwise the trigger offset elements cannot be
   * positioned relative to the scrolling _content size_.
   *
   * 2. Scroll tracking
   *
   * When using scroll tracking, including scrollbars, on a scrolling element
   * (that obviously has a size smaller than the content), it's recommended for
   * the content of the scrollable element to be wrapped in a single `div`
   * container, to allow for more efficient and reliable detection of changes
   * in the _scrollable content_ size.
   *
   * If content wrapping is disabled, when scroll tracking is used on a given
   * element (other than the root of the document), each of the immediate
   * children of the scrollable element have their sizes tracked, which could
   * lead to more resource usage.
   *
   * 3. Scrollbars on custom elements
   *
   * When you setup a {@link Widgets.Scrollbar} widget for a custom
   * scrollable element that may not be the main scrollable (and therefore
   * won't take up the full viewport all the time), then to be able to position
   * to scrollbar relative to the scrollable element, its content needs to be
   * wrapped.
   *
   * If this setting is OFF, then the scrollbars on custom elements have to
   * rely on position sticky which doesn't have as wide browser support as the
   * default option.
   *
   * 4. Animating on viewport enter/leave
   *
   * For elements that have transforms applied as part of an animation or
   * transition, if you wish to run or reverse the animation when the element
   * enters or leaves the viewport, then the transform can interfere with the
   * viewport tracking. For example, if undoing the animation as soon as the
   * element leaves the viewport makes it enter it again (because it's moved),
   * then this will result in a glitch.
   *
   * If content wrapping is disabled, then to get around such issues, a dummy
   * element is positioned on top of the actual element and is the one tracked
   * across the viewport instead. Either approach could cause issues depending
   * on your CSS, so it's your choice which one is applied.
   *
   * ----------
   *
   * If you can, it's recommended to leave this setting ON. You can still
   * disable wrapping on a per-element basis by setting `data-lisn-no-wrap`
   * attribute on it.
   *
   * **IMPORTANT:** Certain widgets always require wrapping of elements or their
   * children. This setting only applies in cases where wrapping is optional.
   *
   * @defaultValue true
   * @category Generic
   */
  contentWrappingAllowed: true,

  /**
   * The timeout in milliseconds for waiting for the `document.readyState` to
   * become `complete`. The timer begins _once the `readyState` becomes
   * `interactive`_.
   *
   * The page will be considered "ready" either when the `readyState` becomes
   * `complete` or this many milliseconds after it becomes `interactive`,
   * whichever is first.
   *
   * Set to 0 or a negative number to disable timeout.
   *
   * @defaultValue 2000 // i.e. 2s
   * @category Generic
   */
  pageLoadTimeout: 2000,

  /**
   * This enables LISN's HTML API. Then the page will be parsed (and watched
   * for dynamically added elements at any time) for any elements matching a
   * widget selector. Any element that has a matching CSS class or data
   * attribute will be setup according to the relevant widget, which may wrap,
   * clone or add attributes to the element.
   *
   * This is enabled by default for bundles, and disabled otherwise.
   *
   * **IMPORTANT:** You must set this before the document `readyState` becomes
   * interactive.
   *
   * @defaultValue `false` in general, but `true` in browser bundles
   * @category Widgets
   */
  autoWidgets: false,

  /**
   * Default setting for
   * {@link Widgets.ScrollbarConfig.hideNative | ScrollbarConfig.hideNative}.
   *
   * @defaultValue true
   * @category Widgets/Scrollbar
   */
  scrollbarHideNative: true,

  /**
   * Default setting for
   * {@link Widgets.ScrollbarConfig.onMobile | ScrollbarConfig.onMobile}.
   *
   * @defaultValue false
   * @category Widgets/Scrollbar
   */
  scrollbarOnMobile: false,

  /**
   * Default setting for
   * {@link Widgets.ScrollbarConfig.positionH | ScrollbarConfig.positionH}.
   *
   * @defaultValue "bottom"
   * @category Widgets/Scrollbar
   */
  scrollbarPositionH: "bottom",

  /**
   * Default setting for
   * {@link Widgets.ScrollbarConfig.positionV | ScrollbarConfig.positionV}.
   *
   * @defaultValue "right"
   * @category Widgets/Scrollbar
   */
  scrollbarPositionV: "right",

  /**
   * Default setting for
   * {@link Widgets.ScrollbarConfig.autoHide | ScrollbarConfig.autoHide}.
   *
   * @defaultValue -1
   * @category Widgets/Scrollbar
   */
  scrollbarAutoHide: -1,

  /**
   * Default setting for
   * {@link Widgets.ScrollbarConfig.clickScroll | ScrollbarConfig.clickScroll}.
   *
   * @defaultValue true
   * @category Widgets/Scrollbar
   */
  scrollbarClickScroll: true,

  /**
   * Default setting for
   * {@link Widgets.ScrollbarConfig.dragScroll | ScrollbarConfig.dragScroll}.
   *
   * @defaultValue true
   * @category Widgets/Scrollbar
   */
  scrollbarDragScroll: true,

  /**
   * Default setting for
   * {@link Widgets.ScrollbarConfig.useHandle | ScrollbarConfig.useHandle}.
   *
   * @defaultValue false
   * @category Widgets/Scrollbar
   */
  scrollbarUseHandle: false,

  /**
   * Default setting for
   * {@link Widgets.SameHeightConfig.diffTolerance | SameHeightConfig.diffTolerance}.
   *
   * @defaultValue 15
   * @category Widgets/SameHeight
   */
  sameHeightDiffTolerance: 15,

  /**
   * Default setting for
   * {@link Widgets.SameHeightConfig.resizeThreshold | SameHeightConfig.resizeThreshold}.
   *
   * @defaultValue 5
   * @category Widgets/SameHeight
   */
  sameHeightResizeThreshold: 5,

  /**
   * Default setting for
   * {@link Widgets.SameHeightConfig.debounceWindow | SameHeightConfig.debounceWindow}.
   *
   * @defaultValue 100
   * @category Widgets/SameHeight
   */
  sameHeightDebounceWindow: 100,

  /**
   * Default setting for
   * {@link Widgets.SameHeightConfig.minGap | SameHeightConfig.minGap}.
   *
   * @defaultValue 30
   * @category Widgets/SameHeight
   */
  sameHeightMinGap: 30,

  /**
   * Default setting for
   * {@link Widgets.SameHeightConfig.maxFreeR | SameHeightConfig.maxFreeR}.
   *
   * @defaultValue 0.4
   * @category Widgets/SameHeight
   */
  sameHeightMaxFreeR: 0.4,

  /**
   * Default setting for
   * {@link Widgets.SameHeightConfig.maxWidthR | SameHeightConfig.maxWidthR}.
   *
   * @defaultValue 1.7
   * @category Widgets/SameHeight
   */
  sameHeightMaxWidthR: 1.7,

  /**
   * Set custom device breakpoints as width in pixels.
   *
   * The value of each sets its lower limit, i.e. it specifies a device whose
   * width is larger than the given value (and up to the next larger one).
   *
   * If you specify only some of the below devices, then the other ones will
   * keep their default breakpoint values.
   *
   * Adding device types, other than the ones listed below is not supported.
   *
   * @category Device layouts
   */
  deviceBreakpoints: {
    /**
     * This should be left as 0 as it's the catch-all for anything narrower
     * than "mobile-wide".
     *
     * @defaultValue 0
     */
    mobile: 0,

    /**
     * Anything wider than the given value is "mobile-wide", up to the value of
     * "tablet".
     *
     * @defaultValue 576
     */
    "mobile-wide": 576,

    /**
     * Anything wider than the given value is "tablet", up to the value of
     * "desktop".
     *
     * @defaultValue 768
     */
    tablet: 768, // tablet is anything above this (up to desktop)

    /**
     * Anything wider than the given value is "desktop".
     *
     * @defaultValue 992
     */
    desktop: 992, // desktop is anything above this
  },

  /**
   * Set custom aspect ratio breakpoints (as ratio of width to height).
   *
   * The value of each sets its lower limit, i.e. it specifies an aspect ratio
   * that is wider than the given value (and up to the next wider one).
   *
   * If you specify only some of the below aspect ratios, then the other ones
   * will keep their default breakpoint values.
   *
   * Adding aspect ratio types, other than the ones listed below is not
   * supported.
   *
   * @category Device layouts
   */
  aspectRatioBreakpoints: {
    /**
     * This should be left as 0 as it's the catch-all for anything with
     * a narrower aspect ratio than "tall".
     *
     * @defaultValue 0
     */
    "very-tall": 0, // very tall is up to 9:16

    /**
     * Anything with a wider aspect ratio than the given value is "tall", up to
     * the value of "square".
     *
     * @defaultValue 9 / 16
     */
    tall: 9 / 16, // tall is between 9:16 and 3:4

    /**
     * Anything with a wider aspect ratio than the given value is "square", up
     * to the value of "wide".
     *
     * @defaultValue 3 / 4
     */
    square: 3 / 4, // square is between 3:4 and 4:3

    /**
     * Anything with a wider aspect ratio than the given value is "wide", up to
     * the value of "very-wide".
     *
     * @defaultValue 4 / 3
     */
    wide: 4 / 3, // wide is between 4:3 and 16:9

    /**
     * Anything with a wider aspect ratio than the given value is "very-wide".
     *
     * @defaultValue 16 / 9
     */
    "very-wide": 16 / 9, // very wide is above 16:9
  },

  /**
   * The CSS class that enables light theme.
   *
   * **IMPORTANT:** If you change this, you should also change the
   * `$light-theme-cls` variable in the SCSS configuration, or otherwise add the
   * following to your CSS:
   *
   * :root,
   * .custom-light-theme-cls {
   *   --lisn-color-fg: some-dark-color;
   *   --lisn-color-fg-t: some-dark-color-with-transparency;
   *   --lisn-color-bg: some-light-color;
   *   --lisn-color-bg-t: some-light-color-with-transparency;
   * }
   */
  lightThemeClassName: "light-theme",

  /**
   * The CSS class that enables dark theme.
   *
   * **IMPORTANT:** If you change this, you should also change the
   * `$dark-theme-cls` variable in the SCSS configuration, or otherwise add the
   * following to your CSS:
   *
   * .custom-dark-theme-cls {
   *   --lisn-color-fg: some-light-color;
   *   --lisn-color-fg-t: some-light-color-with-transparency;
   *   --lisn-color-bg: some-dark-color;
   *   --lisn-color-bg-t: some-dark-color-with-transparency;
   * }
   */
  darkThemeClassName: "dark-theme",

  /**
   * Used to determine the effective delta in pixels for gestures triggered by
   * some key (arrows) and wheel events (where the browser reports the delta
   * mode to be LINE).
   *
   * Value is in pixels.
   *
   * @defaultValue 40
   * @category Gestures
   */
  deltaLineHeight: 40,

  /**
   * Used to determine the effective delta in pixels for gestures triggered by
   * some wheel events (where the browser reports the delta mode to be PAGE).
   *
   * Value is in pixels.
   *
   * @defaultValue 1600
   * @category Gestures
   */
  deltaPageWidth: 1600,

  /**
   * Used to determine the effective delta in pixels for gestures triggered by
   * some key (PageUp/PageDown/Space) and wheel events (where the browser
   * reports the delta mode to be PAGE).
   *
   * Value is in pixels.
   *
   * @defaultValue 800
   * @category Gestures
   */
  deltaPageHeight: 800,

  /**
   * Controls the debugging verbosity level. Values from 0 (none) to 10 (insane)
   * are recognized.
   *
   * **Note:** Logging is not available in bundles except in the "debug" bundle.
   *
   * @defaultValue `0` except in the "debug" bundle where it defaults to 10
   * @category Logging
   */
  verbosityLevel: 0,

  /**
   * The URL of the remote logger to connect to. LISN uses
   * {@link https://socket.io/docs/v4/client-api/ | socket.io-client}
   * to talk to the client and emits messages on the following namespaces:
   *
   * - `console.debug`
   * - `console.log`
   * - `console.info`
   * - `console.warn`
   * - `console.error`
   *
   * There is a simple logging server that ships with LISN, see the source
   * code repository.
   *
   * You can always explicitly disable remote logging on a given page by
   * setting `disableRemoteLog=1` query parameter in the URL.
   *
   * **Note:** Logging is not available in bundles (except in the `debug` bundle).
   *
   * @defaultValue null
   * @category Logging
   */
  remoteLoggerURL: null as string | null,

  /**
   * Enable remote logging only on mobile devices.
   *
   * You can always disable remote logging for any page by setting
   * `disableRemoteLog=1` URL query parameter.
   *
   * **Note:** Logging is not available in bundles (except in the `debug` bundle).
   *
   * @defaultValue false
   * @category Logging
   */
  remoteLoggerOnMobileOnly: false,
});

// --------------------
