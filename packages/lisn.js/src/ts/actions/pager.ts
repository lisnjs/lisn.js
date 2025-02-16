/**
 * @module Actions
 *
 * @categoryDescription Controlling pagers
 * {@link NextPage} and {@link PrevPage} advance or reverse the {@link Pager}
 * widget setup for the given element.
 *
 * {@link GoToPage} sets the {@link Pager} to the given page or toggles to the
 * last saved one.
 *
 * {@link EnablePage} and {@link DisablePage} enable or disable the given page
 * of the {@link Pager} widget setup for the given element.
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { toInt } from "@lisn/utils/math";

import { Pager } from "@lisn/widgets/pager";
import { fetchUniqueWidget } from "@lisn/widgets/widget";

import { Action, registerAction } from "@lisn/actions/action";

/**
 * Advances or reverses the {@link Pager} widget setup for the given element.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "next-page".
 * - Accepted string arguments: none
 * - Accepted options: none
 *
 * @example
 * ```html
 * <div class="lisn-pager" data-lisn-on-click="@next-page +target=#myNextButton"></div>
 * <button id="myNextButton"></button>
 * ```
 *
 * @category Controlling pagers
 */
export class NextPage implements Action {
  /**
   * Advances the pager by one page.
   */
  readonly do: () => Promise<void>;

  /**
   * Reverses the pager by one page.
   */
  readonly undo: () => Promise<void>;

  /**
   * Undoes the last action: reverses the pager if {@link do} was last called
   * or advances it otherwise.
   */
  readonly toggle: () => Promise<void>;

  static register() {
    registerAction("next-page", (element) => new NextPage(element));
  }

  constructor(element: Element) {
    let toggleState = false;
    const { _nextPage, _prevPage } = getMethods(element);

    this.do = () => {
      toggleState = true;
      return _nextPage();
    };

    this.undo = () => {
      toggleState = false;
      return _prevPage();
    };

    this[MC.S_TOGGLE] = () => {
      const method = toggleState ? _prevPage : _nextPage;
      toggleState = !toggleState;
      return method();
    };
  }
}

/**
 * Reverses or advances the {@link Pager} widget setup for the given element.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "prev-page".
 * - Accepted string arguments: none
 * - Accepted options: none
 *
 * @example
 * ```html
 * <div class="lisn-pager" data-lisn-on-click="@prev-page +target=#myPrevButton"></div>
 * <button id="myPrevButton"></button>
 * ```
 *
 * @category Controlling pagers
 */
export class PrevPage implements Action {
  /**
   * Reverses the pager by one page.
   */
  readonly do: () => Promise<void>;

  /**
   * Advances the pager by one page.
   */
  readonly undo: () => Promise<void>;

  /**
   * Undoes the last action: advances the pager if {@link do} was last called
   * or reverses it otherwise.
   */
  readonly toggle: () => Promise<void>;

  static register() {
    registerAction("prev-page", (element) => new PrevPage(element));
  }

  constructor(element: Element) {
    let toggleState = false;
    const { _nextPage, _prevPage } = getMethods(element);

    this.do = () => {
      toggleState = true;
      return _prevPage();
    };

    this.undo = () => {
      toggleState = false;
      return _nextPage();
    };

    this[MC.S_TOGGLE] = () => {
      const method = toggleState ? _nextPage : _prevPage;
      toggleState = !toggleState;
      return method();
    };
  }
}

/**
 * Goes to a given page, or to the last one beforehand, of the {@link Pager}
 * widget setup for the given element.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "go-to-page".
 * - Accepted string arguments: the number of the target page
 * - Accepted options: none
 *
 * @example
 * ```html
 * <div class="lisn-pager" data-lisn-on-click="@go-to-page:2 +target=#myGoToButton"></div>
 * <button id="myGoToButton"></button>
 * ```
 *
 * @category Controlling pagers
 */
export class GoToPage implements Action {
  /**
   * Goes to the page number given to the constructor. Numbers start at 1.
   */
  readonly do: () => Promise<void>;

  /**
   * Goes to the last saved page number before the action was {@link do}ne. If
   * the action had never been done, does nothing.
   */
  readonly undo: () => Promise<void>;

  /**
   * Goes to the page number given to the constructor, or if already at this
   * number, goes to the last saved page if any. Numbers start at 1.
   */
  readonly toggle: () => Promise<void>;

  static register() {
    registerAction(
      "go-to-page",
      (element, args) => new GoToPage(element, toInt(args[0])),
    );
  }

  constructor(element: Element, pageNum: number) {
    if (!pageNum) {
      throw MH.usageError("Target page is required");
    }

    const { _goToPage } = getMethods(element);

    this.do = () => _goToPage(pageNum);
    this.undo = () => _goToPage(-1);
    this[MC.S_TOGGLE] = () => _goToPage(pageNum, -1);
  }
}

/**
 * Enables or disables the given page of the {@link Pager} widget setup for the
 * given element.
 *
 * **IMPORTANT:** When constructed, it disables the given page as a form of
 * initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "enable-page".
 * - Accepted string arguments: the number of the target page
 * - Accepted options: none
 *
 * @example
 * ```html
 * <div class="lisn-pager" data-lisn-on-click="@enable-page:2 +target=#myEnableButton"></div>
 * <button id="myEnableButton"></button>
 * ```
 *
 * @category Controlling pagers
 */
export class EnablePage implements Action {
  /**
   * Enables the page number given to the constructor. Numbers start at 1.
   */
  readonly do: () => Promise<void>;

  /**
   * Disables the page number given to the constructor. Numbers start at 1.
   */
  readonly undo: () => Promise<void>;

  /**
   * Enables the page number given to the constructor, if it is disabled,
   * otherwise disables it. Numbers start at 1.
   */
  readonly toggle: () => Promise<void>;

  static register() {
    registerAction(
      "enable-page",
      (element, args) => new EnablePage(element, toInt(args[0])),
    );
  }

  constructor(element: Element, pageNum: number) {
    if (!pageNum) {
      throw MH.usageError("Target page number is required");
    }

    const { _enablePage, _disablePage, _togglePage } = getMethods(element);
    _disablePage(pageNum); // initial state

    this.do = () => _enablePage(pageNum);
    this.undo = () => _disablePage(pageNum);
    this[MC.S_TOGGLE] = () => _togglePage(pageNum);
  }
}

/**
 * Disables or enables the given page of the {@link Pager} widget setup for the
 * given element.
 *
 * **IMPORTANT:** When constructed, it enables the given page as a form of
 * initialization.
 *
 * -------
 *
 * To use with auto-widgets (HTML API) as part of a trigger specification:
 * - Action name: "disable-page".
 * - Accepted string arguments: the number of the target page
 * - Accepted options: none
 *
 * @example
 * ```html
 * <button id="myDisableButton"></button>
 * <div class="lisn-pager" data-lisn-on-click="@disable-page:2 +target=#myDisableButton"></div>
 * ```
 *
 * @category Controlling pagers
 */
export class DisablePage implements Action {
  /**
   * Disables the page number given to the constructor. Numbers start at 1.
   */
  readonly do: () => Promise<void>;

  /**
   * Enables the page number given to the constructor. Numbers start at 1.
   */
  readonly undo: () => Promise<void>;

  /**
   * Disables the page number given to the constructor, if it is enabled,
   * otherwise enables it. Numbers start at 1.
   */
  readonly toggle: () => Promise<void>;

  static register() {
    registerAction(
      "disable-page",
      (element, args) => new DisablePage(element, toInt(args[0])),
    );
  }

  constructor(element: Element, pageNum: number) {
    if (!pageNum) {
      throw MH.usageError("Target page number is required");
    }

    const { _enablePage, _disablePage, _togglePage } = getMethods(element);
    _enablePage(pageNum); // initial state

    this.do = () => _disablePage(pageNum);
    this.undo = () => _enablePage(pageNum);
    this[MC.S_TOGGLE] = () => _togglePage(pageNum);
  }
}

// --------------------

const getMethods = (element: Element) => {
  let lastPageNum: number | null | undefined = null;

  const nextPage = (widget: Pager | null) => widget?.nextPage();
  const prevPage = (widget: Pager | null) => widget?.prevPage();

  const goToPage = async (
    widget: Pager | null,
    pageNum: number,
    altPageNum: number | null,
  ) => {
    const currentNum = widget?.getCurrentPageNum();
    let targetNum: number | null | undefined =
      currentNum === pageNum ? altPageNum : pageNum;
    if (targetNum === -1) {
      targetNum = lastPageNum;
    }

    if (targetNum) {
      if (pageNum !== -1) {
        // save the current number unless this is "undo"
        lastPageNum = currentNum;
      }

      await widget?.goToPage(targetNum);
    }
  };

  const enablePage = (widget: Pager | null, pageNum: number) =>
    widget?.enablePage(pageNum);
  const disablePage = (widget: Pager | null, pageNum: number) =>
    widget?.disablePage(pageNum);
  const togglePage = (widget: Pager | null, pageNum: number) =>
    widget?.togglePage(pageNum);

  const widgetPromise = fetchUniqueWidget("pager", element, Pager);

  return {
    _nextPage: () => widgetPromise.then(nextPage),
    _prevPage: () => widgetPromise.then(prevPage),

    _goToPage: (pageNum: number, altPageNum: number | null = null) =>
      widgetPromise.then((w) => goToPage(w, pageNum, altPageNum)),

    _enablePage: (pageNum: number) =>
      widgetPromise.then((w) => enablePage(w, pageNum)),
    _disablePage: (pageNum: number) =>
      widgetPromise.then((w) => disablePage(w, pageNum)),
    _togglePage: (pageNum: number) =>
      widgetPromise.then((w) => togglePage(w, pageNum)),
  };
};
