/*!
 * LISN.js v1.0.0
 * (c) 2025 @AaylaSecura
 * Released under the MIT License.
 */
const PREFIX = "lisn";
const LOG_PREFIX = "[LISN.js]";
const OBJECT = Object;
const SYMBOL = Symbol;
const ARRAY = Array;
const STRING = String;
const FUNCTION = Function;
const MATH = Math;
const NUMBER = Number;
const PROMISE = Promise;
const PI = MATH.PI;
const INFINITY = Infinity;
const S_ABSOLUTE = "absolute";
const S_FIXED = "fixed";
const S_STICKY = "sticky";
const S_WIDTH = "width";
const S_HEIGHT = "height";
const S_TOP = "top";
const S_BOTTOM = "bottom";
const S_UP = "up";
const S_DOWN = "down";
const S_LEFT = "left";
const S_RIGHT = "right";
const S_AT = "at";
const S_ABOVE = "above";
const S_BELOW = "below";
const S_IN = "in";
const S_OUT = "out";
const S_NONE = "none";
const S_AMBIGUOUS = "ambiguous";
const S_ADDED = "added";
const S_REMOVED = "removed";
const S_ATTRIBUTE = "attribute";
const S_KEY = "key";
const S_MOUSE = "mouse";
const S_POINTER = "pointer";
const S_TOUCH = "touch";
const S_WHEEL = "wheel";
const S_CLICK = "click";
const S_HOVER = "hover";
const S_PRESS = "press";
const S_SCROLL = "scroll";
const S_ZOOM = "zoom";
const S_DRAG = "drag";
const S_UNKNOWN = "unknown";
const S_SCROLL_TOP = `${S_SCROLL}Top`;
const S_SCROLL_LEFT = `${S_SCROLL}Left`;
const S_SCROLL_WIDTH = `${S_SCROLL}Width`;
const S_SCROLL_HEIGHT = `${S_SCROLL}Height`;
const S_CLIENT_WIDTH = "clientWidth";
const S_CLIENT_HEIGHT = "clientHeight";
const S_SCROLL_TOP_FRACTION = `${S_SCROLL}TopFraction`;
const S_SCROLL_LEFT_FRACTION = `${S_SCROLL}LeftFraction`;
const S_HORIZONTAL = "horizontal";
const S_VERTICAL = "vertical";
const S_SKIP_INITIAL = "skipInitial";
const S_DEBOUNCE_WINDOW = "debounceWindow";
const S_TOGGLE = "toggle";
const S_CANCEL = "cancel";
const S_KEYDOWN = S_KEY + S_DOWN;
const S_MOUSEUP = S_MOUSE + S_UP;
const S_MOUSEDOWN = S_MOUSE + S_DOWN;
const S_POINTERUP = S_POINTER + S_UP;
const S_POINTERDOWN = S_POINTER + S_DOWN;
const S_POINTERENTER = `${S_POINTER}enter`;
const S_POINTERLEAVE = `${S_POINTER}leave`;
const S_POINTERMOVE = `${S_POINTER}move`;
const S_POINTERCANCEL = S_POINTER + S_CANCEL;
const S_TOUCHSTART = `${S_TOUCH}start`;
const S_TOUCHEND = `${S_TOUCH}end`;
const S_TOUCHMOVE = `${S_TOUCH}move`;
const S_TOUCHCANCEL = S_TOUCH + S_CANCEL;
const S_DRAGSTART = `${S_DRAG}start`;
const S_DRAGEND = `${S_DRAG}end`;
const S_DRAGENTER = `${S_DRAG}enter`;
const S_DRAGOVER = `${S_DRAG}over`;
const S_DROP = "drop";
const S_SELECTSTART = "selectstart";
const S_ATTRIBUTES = "attributes";
const S_CHILD_LIST = "childList";
const S_REVERSE = "reverse";
const S_DRAGGABLE = "draggable";
const S_DISABLED = "disabled";
const S_ARROW = "arrow";
const S_ROLE = "role";
const ARIA_PREFIX = "aria-";
const S_ARIA_CONTROLS = ARIA_PREFIX + "controls";
const PREFIX_WRAPPER$1 = `${PREFIX}-wrapper`;
const PREFIX_INLINE_WRAPPER = `${PREFIX_WRAPPER$1}-inline`;
const PREFIX_TRANSITION = `${PREFIX}-transition`;
const PREFIX_TRANSITION_DISABLE = `${PREFIX_TRANSITION}__disable`;
const PREFIX_HIDE = `${PREFIX}-hide`;
const PREFIX_SHOW = `${PREFIX}-show`;
const PREFIX_DISPLAY = `${PREFIX}-display`;
const PREFIX_UNDISPLAY = `${PREFIX}-undisplay`;
const PREFIX_PLACE = `${PREFIX}-place`;
const PREFIX_ORIENTATION = `${PREFIX}-orientation`;
const PREFIX_POSITION = `${PREFIX}-position`;
const PREFIX_GHOST = `${PREFIX}-ghost`;
const PREFIX_NO_SELECT = `${PREFIX}-no-select`;
const PREFIX_NO_TOUCH_ACTION = `${PREFIX}-no-touch-action`;
const PREFIX_NO_WRAP = `${PREFIX}-no-wrap`;
const S_ANIMATE = "animate";
const ANIMATE_PREFIX = `${PREFIX}-${S_ANIMATE}__`;
const PREFIX_ANIMATE_DISABLE = `${ANIMATE_PREFIX}disable`;
const PREFIX_ANIMATE_PAUSE = `${ANIMATE_PREFIX}pause`;
const PREFIX_ANIMATE_REVERSE = `${ANIMATE_PREFIX}${S_REVERSE}`;
const USER_AGENT = typeof navigator === "undefined" ? "" : navigator.userAgent;
const IS_MOBILE = USER_AGENT.match(/Mobile|Android|Silk\/|Kindle|BlackBerry|Opera Mini|Opera Mobi/) !== null;

class LisnError extends Error {}
class LisnUsageError extends LisnError {
  constructor(message = "") {
    super(`${LOG_PREFIX} Incorrect usage: ${message}`);
    this.name = "LisnUsageError";
  }
}
class LisnBugError extends LisnError {
  constructor(message = "") {
    super(`${LOG_PREFIX} Please report a bug: ${message}`);
    this.name = "LisnBugError";
  }
}

const root = typeof self === "object" && self.self === self && self || typeof global == "object" && global.global === global && global || Function("return this")() || {};
const kebabToCamelCase$1 = str => str.replace(/-./g, m => toUpperCase(m.charAt(1)));
const camelToKebabCase$1 = str => str.replace(/[A-Z][a-z]/g, m => "-" + toLowerCase(m)).replace(/[A-Z]+/, m => "-" + toLowerCase(m));
const prefixName = name => `${PREFIX}-${name}`;
const prefixCssVar = name => "--" + prefixName(name);
const prefixCssJsVar = name => prefixCssVar("js--" + name);
const prefixData = name => `data-${camelToKebabCase$1(name)}`;
const toLowerCase = s => s.toLowerCase();
const toUpperCase = s => s.toUpperCase();
const timeNow = Date.now.bind(Date);
const timeSince = startTime => timeNow() - startTime;
const hasDOM = () => typeof document !== "undefined";
const getWindow = () => window;
const getDoc = () => document;
const getDocElement = () => getDoc().documentElement;
const getDocScrollingElement = () => getDoc().scrollingElement;
const getBody = () => getDoc().body;
const getReadyState = () => getDoc().readyState;
const getPointerType = event => isPointerEvent(event) ? event.pointerType : isMouseEvent(event) ? "mouse" : null;
const onAnimationFrame = hasDOM() ? root.requestAnimationFrame.bind(root) : () => {};
const createElement = (tagName, options) => getDoc().createElement(tagName, options);
const createButton = (label = "", tag = "button") => {
  const btn = createElement(tag);
  setTabIndex(btn);
  setAttr(btn, S_ROLE, "button");
  setAttr(btn, ARIA_PREFIX + "label", label);
  return btn;
};
const isNullish = v => v === undefined || v === null;
const isEmpty = v => isNullish(v) || v === "";
const isIterableObject = v => isNonPrimitive(v) && SYMBOL.iterator in v;
const isArray = v => isInstanceOf(v, ARRAY);
const isObject = v => isInstanceOf(v, OBJECT);
const isNonPrimitive = v => v !== null && typeOf(v) === "object";
const isNumber = v => typeOf(v) === "number";
const isString = v => typeOf(v) === "string" || isInstanceOf(v, STRING);
const isLiteralString = v => typeOf(v) === "string";
const isBoolean = v => typeOf(v) === "boolean";
const isFunction = v => typeOf(v) === "function" || isInstanceOf(v, FUNCTION);
const isDoc = target => target === getDoc();
const isMouseEvent = event => isInstanceOf(event, MouseEvent);
const isPointerEvent = event => isInstanceOf(event, PointerEvent);
const isTouchPointerEvent = event => isPointerEvent(event) && getPointerType(event) === S_TOUCH;
const isWheelEvent = event => isInstanceOf(event, WheelEvent);
const isKeyboardEvent = event => isInstanceOf(event, KeyboardEvent);
const isTouchEvent = event => isInstanceOf(event, TouchEvent);
const isElement = target => isInstanceOf(target, Element);
const isHTMLElement = target => isInstanceOf(target, HTMLElement);
const isNodeBAfterA = (nodeA, nodeB) => (nodeA.compareDocumentPosition(nodeB) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
const strReplace = (s, match, replacement) => s.replace(match, replacement);
const setTimer = root.setTimeout.bind(root);
const clearTimer = root.clearTimeout.bind(root);
const getBoundingClientRect = el => el.getBoundingClientRect();
const copyBoundingRectProps = rect => {
  return {
    x: rect.x,
    left: rect.left,
    right: rect.right,
    [S_WIDTH]: rect[S_WIDTH],
    y: rect.y,
    top: rect.top,
    bottom: rect.bottom,
    [S_HEIGHT]: rect[S_HEIGHT]
  };
};
const querySelector = (root, selector) => root.querySelector(selector);
const querySelectorAll = (root, selector) => root.querySelectorAll(selector);
const docQuerySelector = selector => querySelector(getDoc(), selector);
const docQuerySelectorAll = selector => querySelectorAll(getDoc(), selector);
const getElementById = id => getDoc().getElementById(id);
const getAttr = (el, name) => el.getAttribute(name);
const setAttr = (el, name, value = "true") => el.setAttribute(name, value);
const unsetAttr = (el, name) => el.setAttribute(name, "false");
const delAttr = (el, name) => el.removeAttribute(name);
const includes = (arr, v, startAt) => arr.indexOf(v, startAt) >= 0;
const filter = (array, filterFn) => array.filter(filterFn);
const filterBlank = array => {
  const result = array ? filter(array, v => !isEmpty(v)) : undefined;
  return lengthOf(result) ? result : undefined;
};
const sizeOf = obj => {
  var _obj$size;
  return (_obj$size = obj === null || obj === void 0 ? void 0 : obj.size) !== null && _obj$size !== void 0 ? _obj$size : 0;
};
const lengthOf = obj => {
  var _obj$length;
  return (_obj$length = obj === null || obj === void 0 ? void 0 : obj.length) !== null && _obj$length !== void 0 ? _obj$length : 0;
};
const tagName = el => el.tagName;
const preventDefault = event => event.preventDefault();
const arrayFrom = ARRAY.from.bind(ARRAY);
const keysOf = obj => OBJECT.keys(obj);
const defineProperty = OBJECT.defineProperty.bind(OBJECT);
const merge = (...a) => {
  return OBJECT.assign({}, ...a);
};
const copyObject = obj => merge(obj);
const promiseResolve = PROMISE.resolve.bind(PROMISE);
const promiseAll = PROMISE.all.bind(PROMISE);
const assign = OBJECT.assign.bind(OBJECT);
OBJECT.freeze.bind(OBJECT);
const hasOwnProp = (o, prop) => OBJECT.prototype.hasOwnProperty.call(o, prop);
const preventExtensions = OBJECT.preventExtensions.bind(OBJECT);
const stringify = JSON.stringify.bind(JSON);
const floor = MATH.floor.bind(MATH);
const ceil = MATH.ceil.bind(MATH);
const log2 = MATH.log2.bind(MATH);
const sqrt = MATH.sqrt.bind(MATH);
const max = MATH.max.bind(MATH);
const min = MATH.min.bind(MATH);
const abs = MATH.abs.bind(MATH);
const round = MATH.round.bind(MATH);
const pow = MATH.pow.bind(MATH);
const parseFloat = NUMBER.parseFloat.bind(NUMBER);
const isNaN = NUMBER.isNaN.bind(NUMBER);
const isInstanceOf = (value, Class) => value instanceof Class;
const constructorOf = obj => obj.constructor;
const typeOf = obj => typeof obj;
const typeOrClassOf = obj => {
  var _constructorOf;
  return isObject(obj) ? (_constructorOf = constructorOf(obj)) === null || _constructorOf === void 0 ? void 0 : _constructorOf.name : typeOf(obj);
};
const parentOf = element => (element === null || element === void 0 ? void 0 : element.parentElement) || null;
const childrenOf = element => (element === null || element === void 0 ? void 0 : element.children) || [];
const targetOf = obj => obj === null || obj === void 0 ? void 0 : obj.target;
const currentTargetOf = obj => obj === null || obj === void 0 ? void 0 : obj.currentTarget;
const classList = el => el === null || el === void 0 ? void 0 : el.classList;
const S_TABINDEX = "tabindex";
const getTabIndex = el => getAttr(el, S_TABINDEX);
const setTabIndex = (el, index = "0") => setAttr(el, S_TABINDEX, index);
const unsetTabIndex = el => delAttr(el, S_TABINDEX);
const remove = obj => obj === null || obj === void 0 ? void 0 : obj.remove();
const deleteObjKey = (obj, key) => delete obj[key];
const deleteKey = (map, key) => map === null || map === void 0 ? void 0 : map.delete(key);
const elScrollTo = (el, coords, behavior = "instant") => el.scrollTo(merge({
  behavior
}, coords));
const newPromise = executor => new Promise(executor);
const newMap = entries => new Map(entries);
const newWeakMap = entries => new WeakMap(entries);
const newSet = values => new Set(values);
const newWeakSet = values => new WeakSet(values);
const newIntersectionObserver = (callback, options) => new IntersectionObserver(callback, options);
const newResizeObserver = callback => typeof ResizeObserver === "undefined" ? null : new ResizeObserver(callback);
const newMutationObserver = callback => new MutationObserver(callback);
const usageError = msg => new LisnUsageError(msg);
const bugError = msg => new LisnBugError(msg);
const illegalConstructorError = useWhat => usageError(`Illegal constructor. Use ${useWhat}.`);
const CONSOLE = console;
CONSOLE.debug.bind(CONSOLE);
CONSOLE.log.bind(CONSOLE);
CONSOLE.info.bind(CONSOLE);
const consoleWarn = CONSOLE.warn.bind(CONSOLE);
const consoleError = CONSOLE.error.bind(CONSOLE);

const settings = preventExtensions({
  mainScrollableElementSelector: null,
  contentWrappingAllowed: true,
  pageLoadTimeout: 2000,
  autoWidgets: false,
  scrollbarHideNative: true,
  scrollbarOnMobile: false,
  scrollbarPositionH: "bottom",
  scrollbarPositionV: "right",
  scrollbarAutoHide: -1,
  scrollbarClickScroll: true,
  scrollbarDragScroll: true,
  scrollbarUseHandle: false,
  sameHeightDiffTolerance: 15,
  sameHeightResizeThreshold: 5,
  sameHeightDebounceWindow: 100,
  sameHeightMinGap: 30,
  sameHeightMaxFreeR: 0.4,
  sameHeightMaxWidthR: 1.7,
  deviceBreakpoints: {
    mobile: 0,
    "mobile-wide": 576,
    tablet: 768,
    desktop: 992
  },
  aspectRatioBreakpoints: {
    "very-tall": 0,
    tall: 9 / 16,
    square: 3 / 4,
    wide: 4 / 3,
    "very-wide": 16 / 9
  },
  lightThemeClassName: "light-theme",
  darkThemeClassName: "dark-theme",
  deltaLineHeight: 40,
  deltaPageWidth: 1600,
  deltaPageHeight: 800,
  verbosityLevel: 0,
  remoteLoggerURL: null,
  remoteLoggerOnMobileOnly: false
});

const roundNumTo = (value, numDecimal = 0) => {
  const multiplicationFactor = pow(10, numDecimal);
  return round(value * multiplicationFactor) / multiplicationFactor;
};
const isValidNum = value => isNumber(value) && NUMBER.isFinite(value);
const toNum = (value, defaultValue = 0) => {
  const numValue = isLiteralString(value) ? parseFloat(value) : value;
  return isValidNum(numValue) && numValue == value ? numValue : defaultValue;
};
const toInt = (value, defaultValue = 0) => {
  let numValue = toNum(value, null);
  numValue = numValue === null ? numValue : floor(numValue);
  return isValidNum(numValue) && numValue == value ? numValue : defaultValue;
};
const toNonNegNum = (value, defaultValue = 0) => {
  const numValue = toNum(value, null);
  return numValue !== null && numValue >= 0 ? numValue : defaultValue;
};
const toPosNum = (value, defaultValue = 0) => {
  const numValue = toNum(value, null);
  return numValue !== null && numValue > 0 ? numValue : defaultValue;
};
const toNumWithBounds = (value, limits, defaultValue) => {
  var _limits$min, _limits$max;
  const isDefaultGiven = defaultValue !== undefined;
  const numValue = toNum(value, null);
  const min = (_limits$min = limits === null || limits === void 0 ? void 0 : limits.min) !== null && _limits$min !== void 0 ? _limits$min : null;
  const max = (_limits$max = limits === null || limits === void 0 ? void 0 : limits.max) !== null && _limits$max !== void 0 ? _limits$max : null;
  let result;
  if (!isValidNum(numValue)) {
    var _ref;
    result = isDefaultGiven ? defaultValue : (_ref = min !== null && min !== void 0 ? min : max) !== null && _ref !== void 0 ? _ref : 0;
  } else if (min !== null && numValue < min) {
    result = isDefaultGiven ? defaultValue : min;
  } else if (max !== null && numValue > max) {
    result = isDefaultGiven ? defaultValue : max;
  } else {
    result = numValue;
  }
  return result;
};
const maxAbs = (...values) => max(...values.map(v => abs(v)));
const havingMaxAbs = (...values) => lengthOf(values) ? values.sort((a, b) => abs(b) - abs(a))[0] : -INFINITY;
const hAngle = (x, y) => normalizeAngle(MATH.atan2(y, x));
const normalizeAngle = a => {
  while (a < 0 || a > PI * 2) {
    a += (a < 0 ? 1 : -1) * PI * 2;
  }
  return a > PI ? a - PI * 2 : a;
};
const degToRad = a => a * PI / 180;
const areParallel = (vA, vB, angleDiffThreshold = 0) => {
  const angleA = hAngle(vA[0], vA[1]);
  const angleB = hAngle(vB[0], vB[1]);
  angleDiffThreshold = min(89.99, abs(angleDiffThreshold));
  return abs(normalizeAngle(angleA - angleB)) <= degToRad(angleDiffThreshold);
};
const areAntiParallel = (vA, vB, angleDiffThreshold = 0) => areParallel(vA, [-vB[0], -vB[1]], angleDiffThreshold);
const distanceBetween = (ptA, ptB) => sqrt(pow(ptA[0] - ptB[0], 2) + pow(ptA[1] - ptB[1], 2));
const quadraticRoots = (a, b, c) => {
  const z = sqrt(b * b - 4 * a * c);
  return [(-b + z) / (2 * a), (-b - z) / (2 * a)];
};
const easeInOutQuad = x => x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;
const sortedKeysByVal = (obj, descending = false) => {
  if (descending) {
    return keysOf(obj).sort((x, y) => obj[y] - obj[x]);
  }
  return keysOf(obj).sort((x, y) => obj[x] - obj[y]);
};
const keyWithMaxVal = obj => {
  return sortedKeysByVal(obj).slice(-1)[0];
};
const getBitmask = (start, end) => start > end ? getBitmask(end, start) : -1 >>> 32 - end - 1 + start << start;

const copyExistingKeys = (fromObj, toObj) => {
  for (const key in toObj) {
    if (!hasOwnProp(toObj, key)) {
      continue;
    }
    if (key in fromObj) {
      if (isNonPrimitive(fromObj[key]) && isNonPrimitive(toObj[key])) {
        copyExistingKeys(fromObj[key], toObj[key]);
      } else {
        toObj[key] = fromObj[key];
      }
    }
  }
};
const omitKeys = (obj, keysToRm) => {
  const res = {};
  let key;
  for (key in obj) {
    if (!(key in keysToRm)) {
      res[key] = obj[key];
    }
  }
  return res;
};
const compareValuesIn = (objA, objB, roundTo = 3) => {
  for (const key in objA) {
    if (!hasOwnProp(objA, key)) {
      continue;
    }
    const valA = objA[key];
    const valB = objB[key];
    if (isNonPrimitive(valA) && isNonPrimitive(valB)) {
      if (!compareValuesIn(valA, valB)) {
        return false;
      }
    } else if (isNumber(valA) && isNumber(valB)) {
      if (roundNumTo(valA, roundTo) !== roundNumTo(valB, roundTo)) {
        return false;
      }
    } else if (valA !== valB) {
      return false;
    }
  }
  return true;
};
const toArrayIfSingle = value => isArray(value) ? value : !isNullish(value) ? [value] : [];
const toBool = value => value === true || value === "true" || value === "" ? true : isNullish(value) || value === false || value === "false" ? false : null;

const formatAsString = (value, maxLen) => {
  const result = maybeConvertToString(value, false);
  return result;
};
const joinAsString = (separator, ...args) => args.map(a => formatAsString(a)).join(separator);
const splitOn = (input, separator, trim, limit) => {
  if (!input.trim()) {
    return [];
  }
  limit = limit !== null && limit !== void 0 ? limit : -1;
  const output = [];
  const addEntry = s => output.push(trim ? s.trim() : s);
  while (limit--) {
    let matchIndex = -1,
      matchLength = 0;
    if (isLiteralString(separator)) {
      matchIndex = input.indexOf(separator);
      matchLength = lengthOf(separator);
    } else {
      var _match$index;
      const match = separator.exec(input);
      matchIndex = (_match$index = match === null || match === void 0 ? void 0 : match.index) !== null && _match$index !== void 0 ? _match$index : -1;
      matchLength = match ? lengthOf(match[0]) : 0;
    }
    if (matchIndex < 0) {
      break;
    }
    addEntry(input.slice(0, matchIndex));
    input = input.slice(matchIndex + matchLength);
  }
  addEntry(input);
  return output;
};
const kebabToCamelCase = kebabToCamelCase$1;
const camelToKebabCase = camelToKebabCase$1;
const randId = (nChars = 8) => {
  const segment = () => floor(100000 + MATH.random() * 900000).toString(36);
  let s = "";
  while (lengthOf(s) < nChars) {
    s += segment();
  }
  return s.slice(0, nChars);
};
const toMargins = (value, absoluteSize) => {
  var _parts$, _parts$2, _ref, _parts$3;
  const toPxValue = (strValue, index) => {
    let margin = parseFloat(strValue || "") || 0;
    if (strValue === margin + "%") {
      margin *= index % 2 ? absoluteSize[S_HEIGHT] : absoluteSize[S_WIDTH];
    }
    return margin;
  };
  const parts = splitOn(value, " ", true);
  const margins = [toPxValue(parts[0], 0), toPxValue((_parts$ = parts[1]) !== null && _parts$ !== void 0 ? _parts$ : parts[0], 1), toPxValue((_parts$2 = parts[2]) !== null && _parts$2 !== void 0 ? _parts$2 : parts[0], 2), toPxValue((_ref = (_parts$3 = parts[3]) !== null && _parts$3 !== void 0 ? _parts$3 : parts[1]) !== null && _ref !== void 0 ? _ref : parts[0], 3)];
  return margins;
};
const objToStrKey = obj => stringify(flattenForSorting(obj));
const flattenForSorting = obj => {
  const array = isArray(obj) ? obj : keysOf(obj).sort().map(k => obj[k]);
  return array.map(value => {
    if (isArray(value) || isNonPrimitive(value) && constructorOf(value) === OBJECT) {
      return flattenForSorting(value);
    }
    return value;
  });
};
const stringifyReplacer = (key, value) => key ? maybeConvertToString(value, true) : value;
const maybeConvertToString = (value, nested) => {
  let result = "";
  if (isElement(value)) {
    const classStr = classList(value).toString().trim();
    result = value.id ? "#" + value.id : `<${tagName(value)}${classStr ? ' class="' + classStr + '"' : ""}>`;
  } else if (isInstanceOf(value, Error)) {
    if ("stack" in value && isString(value.stack)) {
      result = value.stack;
    } else {
      result = `Error: ${value.message}`;
    }
  } else if (isArray(value)) {
    result = "[" + value.map(v => isString(v) ? stringify(v) : maybeConvertToString(v, false)).join(",") + "]";
  } else if (isIterableObject(value)) {
    result = typeOrClassOf(value) + "(" + maybeConvertToString(arrayFrom(value), false) + ")";
  } else if (isNonPrimitive(value)) {
    result = nested ? value : stringify(value, stringifyReplacer);
  } else {
    result = nested ? value : STRING(value);
  }
  return result;
};

const validateStrList = (key, value, checkFn) => {
  var _toArray;
  return filterBlank((_toArray = toArray(value)) === null || _toArray === void 0 ? void 0 : _toArray.map(v => _validateString(key, v, checkFn, "a string or a string array")));
};
const validateNumList = (key, value) => {
  var _toArray2;
  return filterBlank((_toArray2 = toArray(value)) === null || _toArray2 === void 0 ? void 0 : _toArray2.map(v => _validateNumber(key, v, "a number or a number array")));
};
const validateNumber = (key, value) => _validateNumber(key, value);
const validateBoolean = (key, value) => _validateBoolean(key, value);
const validateString = (key, value, checkFn) => _validateString(key, value, checkFn);
const validateStringRequired = (key, value, checkFn) => {
  const result = _validateString(key, value, checkFn);
  if (isEmpty(result)) {
    throw usageError(`'${key}' is required`);
  }
  return result;
};
const validateBooleanOrString = (key, value, stringCheckFn) => _validateBooleanOrString(key, value, stringCheckFn);
const toArray = value => {
  let result;
  if (isArray(value)) {
    result = value;
  } else if (isIterableObject(value)) {
    result = arrayFrom(value);
  } else if (isLiteralString(value)) {
    result = splitOn(value, ",");
  } else if (!isNullish(value)) {
    result = [value];
  } else {
    result = null;
  }
  return result ? filterBlank(result.map(v => isLiteralString(v) ? v.trim() : v)) : undefined;
};
const _validateNumber = (key, value, typeDescription) => {
  if (isNullish(value)) {
    return;
  }
  const numVal = toNum(value, null);
  if (numVal === null) {
    throw usageError(`'${key}' must be ${typeDescription !== null && typeDescription !== void 0 ? typeDescription : "a number"}`);
  }
  return numVal;
};
const _validateBoolean = (key, value, typeDescription) => {
  if (isNullish(value)) {
    return;
  }
  const boolVal = toBool(value);
  if (boolVal === null) {
    throw usageError(`'${key}' must be ${'"true" or "false"'}`);
  }
  return boolVal;
};
const _validateString = (key, value, checkFn, typeDescription) => {
  if (isNullish(value)) {
    return;
  }
  if (!isLiteralString(value)) {
    throw usageError(`'${key}' must be ${typeDescription !== null && typeDescription !== void 0 ? typeDescription : "a string"}`);
  } else if (checkFn && !checkFn(value)) {
    throw usageError(`Invalid value for '${key}'`);
  }
  return value;
};
const _validateBooleanOrString = (key, value, stringCheckFn, typeDescription) => {
  if (isNullish(value)) {
    return;
  }
  const boolVal = toBool(value);
  if (boolVal !== null) {
    return boolVal;
  }
  if (!isLiteralString(value)) {
    throw usageError(`'${key}' must be ${"a boolean or string"}`);
  }
  return _validateString(key, value, stringCheckFn);
};

class BitSpaces {
  constructor() {
    const counter = newCounter();
    this.create = (...propNames) => newBitSpace(counter, propNames);
    defineProperty(this, "nBits", {
      get: () => counter._nBits
    });
    defineProperty(this, "bitmask", {
      get: () => counter._bitmask
    });
  }
}
const newBitSpaces = () => new BitSpaces();
const createBitSpace = (spaces, ...propNames) => spaces.create(...propNames);
const newCounter = () => ({
  _nBits: 0,
  _bitmask: 0
});
const newBitSpace = (counter, propNames) => {
  const start = counter._nBits;
  const end = start + lengthOf(propNames) - 1;
  if (end >= 31) {
    throw usageError("BitSpaces overflow");
  }
  const bitmask = getBitmask(start, end);
  const space = {
    bit: {},
    start,
    end,
    bitmask,
    has: p => isString(p) && p in space.bit && isNumber(space.bit[p]),
    bitmaskFor: (pStart, pEnd) => {
      if (!isEmpty(pStart) && !space.has(pStart) || !isEmpty(pEnd) && !space.has(pEnd)) {
        return 0;
      }
      const thisStart = !isEmpty(pStart) ? log2(space.bit[pStart]) : start;
      const thisEnd = !isEmpty(pEnd) ? log2(space.bit[pEnd]) : end;
      return getBitmask(thisStart, thisEnd);
    },
    nameOf: val => {
      var _propNames;
      return (_propNames = propNames[log2(val) - start]) !== null && _propNames !== void 0 ? _propNames : null;
    }
  };
  for (const name of propNames) {
    defineProperty(space.bit, name, {
      value: 1 << counter._nBits++,
      enumerable: true
    });
  }
  counter._bitmask |= bitmask;
  return space;
};

const DOM_CATEGORIES_SPACE = createBitSpace(newBitSpaces(), S_ADDED, S_REMOVED, S_ATTRIBUTE);

function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

const scheduleHighPriorityTask = task => {
  if (typeof scheduler !== "undefined") {
    scheduler.postTask(task, {
      priority: "user-blocking"
    });
  } else {
    const channel = new MessageChannel();
    channel.port1.onmessage = () => {
      channel.port1.close();
      task();
    };
    channel.port2.postMessage("");
  }
};
const getDebouncedHandler = (debounceWindow, handler) => {
  if (!debounceWindow) {
    return handler;
  }
  let timer = null;
  let lastArgs;
  return (...args) => {
    lastArgs = args;
    if (timer === null) {
      timer = setTimer(async () => {
        await handler(...lastArgs);
        timer = null;
      }, debounceWindow);
    }
  };
};
const waitForDelay = delay => newPromise(resolve => {
  setTimer(resolve, delay);
});

const wrapCallback = (handlerOrCallback, debounceWindow = 0) => {
  const isFunction$1 = isFunction(handlerOrCallback);
  let isRemoved = () => false;
  if (isFunction$1) {
    const callback = callablesMap.get(handlerOrCallback);
    if (callback) {
      return wrapCallback(callback);
    }
  } else {
    isRemoved = handlerOrCallback.isRemoved;
  }
  const handler = isFunction$1 ? handlerOrCallback : (...args) => handlerOrCallback.invoke(...args);
  const wrapper = new Callback(getDebouncedHandler(debounceWindow, (...args) => {
    if (!isRemoved()) {
      return handler(...args);
    }
  }));
  if (!isFunction$1) {
    handlerOrCallback.onRemove(wrapper.remove);
  }
  return wrapper;
};
class Callback {
  constructor(handler) {
    let isRemoved = false;
    const id = SYMBOL();
    const onRemove = newSet();
    this.isRemoved = () => isRemoved;
    this.remove = () => {
      if (!isRemoved) {
        isRemoved = true;
        for (const rmFn of onRemove) {
          rmFn();
        }
        CallbackScheduler._clear(id);
      }
    };
    this.onRemove = fn => onRemove.add(fn);
    this.invoke = (...args) => newPromise((resolve, reject) => {
      if (isRemoved) {
        reject(usageError("Callback has been removed"));
        return;
      }
      CallbackScheduler._push(id, async () => {
        let result;
        try {
          result = await handler(...args);
        } catch (err) {
          reject(err);
        }
        if (result === Callback.REMOVE) {
          this.remove();
        }
        resolve();
      }, reject);
    });
    callablesMap.set(this.invoke, this);
  }
}
_defineProperty(Callback, "KEEP", SYMBOL("KEEP"));
_defineProperty(Callback, "REMOVE", SYMBOL("REMOVE"));
_defineProperty(Callback, "wrap", wrapCallback);
const callablesMap = newWeakMap();
const CallbackScheduler = (() => {
  const queues = newMap();
  const flush = async queue => {
    await null;
    while (lengthOf(queue)) {
      queue[0]._running = true;
      await queue[0]._task();
      queue.shift();
    }
  };
  return {
    _clear: id => {
      const queue = queues.get(id);
      if (queue) {
        let item;
        while (item = queue.shift()) {
          if (!item._running) {
            item._onRemove(Callback.REMOVE);
          }
        }
        deleteKey(queues, id);
      }
    },
    _push: (id, task, onRemove) => {
      let queue = queues.get(id);
      if (!queue) {
        queue = [];
        queues.set(id, queue);
      }
      queue.push({
        _task: task,
        _onRemove: onRemove,
        _running: false
      });
      if (lengthOf(queue) === 1) {
        flush(queue);
      }
    }
  };
})();

const logWarn = (...args) => {
  if (!isMessageSeen(args)) {
    consoleWarn(LOG_PREFIX, ...args);
  }
};
const logError = (...args) => {
  if ((lengthOf(args) > 1 || args[0] !== Callback.REMOVE) && !isMessageSeen(args)) {
    consoleError(LOG_PREFIX, ...args);
  }
};
const discardMessages = newSet();
const isMessageSeen = args => {
  const msg = joinAsString(" ", ...args);
  const isSeen = discardMessages.has(msg);
  discardMessages.add(msg);
  return isSeen;
};

const waitForMutateTime = () => newPromise(resolve => {
  scheduleDOMTask(scheduledDOMMutations, resolve);
});
const waitForMeasureTime = () => newPromise(resolve => {
  scheduleDOMTask(scheduledDOMMeasurements, resolve);
});
const waitForSubsequentMutateTime = () => waitForMutateTime().then(waitForMeasureTime).then(waitForMutateTime);
const waitForSubsequentMeasureTime = () => waitForMeasureTime().then(waitForMutateTime).then(waitForMeasureTime);
const scheduledDOMMeasurements = [];
const scheduledDOMMutations = [];
let hasScheduledDOMTasks = false;
const scheduleDOMTask = (queue, resolve) => {
  queue.push(resolve);
  if (!hasScheduledDOMTasks) {
    hasScheduledDOMTasks = true;
    onAnimationFrame(runAllDOMTasks);
  }
};
const runAllDOMTasks = async () => {
  while (lengthOf(scheduledDOMMutations)) {
    runDOMTaskQueue(scheduledDOMMutations);
    await null;
  }
  scheduleHighPriorityTask(async () => {
    while (lengthOf(scheduledDOMMeasurements)) {
      runDOMTaskQueue(scheduledDOMMeasurements);
      await null;
    }
    if (lengthOf(scheduledDOMMutations)) {
      onAnimationFrame(runAllDOMTasks);
    } else {
      hasScheduledDOMTasks = false;
    }
  });
};
const runDOMTaskQueue = queue => {
  let resolve;
  while (resolve = queue.shift()) {
    try {
      resolve();
    } catch (err) {
      logError(err);
    }
  }
};

const getVisibleContentChildren = el => filter([...childrenOf(el)], e => isVisibleContentTag(tagName(e)));
const isVisibleContentTag = tagName => !includes(["script", "style"], toLowerCase(tagName));
const isInlineTag = tagName => inlineTags.has(tagName.toLowerCase());
const isDOMElement = target => isHTMLElement(target) || isInstanceOf(target, SVGElement) || typeof MathMLElement !== "undefined" && isInstanceOf(target, MathMLElement);
const inlineTags = newSet(["a", "abbr", "acronym", "b", "bdi", "bdo", "big", "button", "cite", "code", "data", "dfn", "em", "i", "img", "input", "kbd", "label", "mark", "map", "object", "output", "q", "rp", "rt", "ruby", "s", "samp", "script", "select", "small", "span", "strong", "sub", "sup", "textarea", "time", "tt", "u", "var"]);

const transitionElementNow = (element, fromCls, toCls) => {
  cancelCSSTransitions(element, fromCls, toCls);
  let didChange = false;
  if (hasClass(element, fromCls)) {
    didChange = true;
    removeClassesNow(element, fromCls);
  }
  if (!hasClass(element, toCls)) {
    addClassesNow(element, toCls);
    didChange = true;
  }
  return didChange;
};
const transitionElement = async (element, fromCls, toCls, delay = 0) => {
  const thisTransition = scheduleCSSTransition(element, toCls);
  if (delay) {
    await waitForDelay(delay);
  }
  await waitForMutateTime();
  if (thisTransition._isCancelled()) {
    return false;
  }
  const didChange = transitionElementNow(element, fromCls, toCls);
  thisTransition._finish();
  if (!didChange) {
    return false;
  }
  const transitionDuration = await getMaxTransitionDuration(element);
  if (transitionDuration) {
    await waitForDelay(transitionDuration);
  }
  return true;
};
const displayElementNow = element => transitionElementNow(element, PREFIX_UNDISPLAY, PREFIX_DISPLAY);
const displayElement = (element, delay = 0) => transitionElement(element, PREFIX_UNDISPLAY, PREFIX_DISPLAY, delay);
const undisplayElementNow = element => transitionElementNow(element, PREFIX_DISPLAY, PREFIX_UNDISPLAY);
const undisplayElement = (element, delay = 0) => transitionElement(element, PREFIX_DISPLAY, PREFIX_UNDISPLAY, delay);
const showElement = (element, delay = 0) => transitionElement(element, PREFIX_HIDE, PREFIX_SHOW, delay);
const hideElement = (element, delay = 0) => transitionElement(element, PREFIX_SHOW, PREFIX_HIDE, delay);
const toggleDisplayElement = (element, delay = 0) => isElementUndisplayed(element) ? displayElement(element, delay) : undisplayElement(element, delay);
const toggleShowElement = (element, delay = 0) => isElementHidden(element) ? showElement(element, delay) : hideElement(element, delay);
const isElementHidden = element => hasClass(element, PREFIX_HIDE);
const isElementUndisplayed = element => hasClass(element, PREFIX_UNDISPLAY);
const hasClass = (el, className) => classList(el).contains(className);
const addClassesNow = (el, ...classNames) => classList(el).add(...classNames);
const addClasses = (el, ...classNames) => waitForMutateTime().then(() => addClassesNow(el, ...classNames));
const removeClassesNow = (el, ...classNames) => classList(el).remove(...classNames);
const removeClasses = (el, ...classNames) => waitForMutateTime().then(() => removeClassesNow(el, ...classNames));
const toggleClassNow = (el, className, force) => classList(el).toggle(className, force);
const toggleClass = (el, className, force) => waitForMutateTime().then(() => toggleClassNow(el, className, force));
const getData = (el, name) => getAttr(el, prefixData(name));
const getBoolData = (el, name) => {
  const value = getData(el, name);
  return value !== null && value !== "false";
};
const setDataNow = (el, name, value) => setAttr(el, prefixData(name), value);
const setData = (el, name, value) => waitForMutateTime().then(() => setDataNow(el, name, value));
const setBoolDataNow = (el, name, value = true) => setAttr(el, prefixData(name), value + "");
const setBoolData = (el, name, value = true) => waitForMutateTime().then(() => setBoolDataNow(el, name, value));
const unsetBoolDataNow = (el, name) => unsetAttr(el, prefixData(name));
const unsetBoolData = (el, name) => waitForMutateTime().then(() => unsetBoolDataNow(el, name));
const delDataNow = (el, name) => delAttr(el, prefixData(name));
const delData = (el, name) => waitForMutateTime().then(() => delDataNow(el, name));
const getComputedStylePropNow = (element, prop) => getComputedStyle(element).getPropertyValue(prop);
const getComputedStyleProp = (element, prop) => waitForMeasureTime().then(() => getComputedStylePropNow(element, prop));
const getStylePropNow = (element, prop) => {
  var _style;
  return (_style = element.style) === null || _style === void 0 ? void 0 : _style.getPropertyValue(prop);
};
const getStyleProp = (element, prop) => waitForMeasureTime().then(() => getStylePropNow(element, prop));
const setStylePropNow = (element, prop, value) => {
  var _style2;
  return (_style2 = element.style) === null || _style2 === void 0 ? void 0 : _style2.setProperty(prop, value);
};
const setStyleProp = (element, prop, value) => waitForMutateTime().then(() => setStylePropNow(element, prop, value));
const delStylePropNow = (element, prop) => {
  var _style3;
  return (_style3 = element.style) === null || _style3 === void 0 ? void 0 : _style3.removeProperty(prop);
};
const delStyleProp = (element, prop) => waitForMutateTime().then(() => delStylePropNow(element, prop));
const getMaxTransitionDuration = async element => {
  const propVal = await getComputedStyleProp(element, "transition-duration");
  return max(...splitOn(propVal, ",", true).map(strValue => {
    let duration = parseFloat(strValue) || 0;
    if (strValue === duration + "s") {
      duration *= 1000;
    }
    return duration;
  }));
};
const disableInitialTransition = async (element, delay = 0) => {
  await addClasses(element, PREFIX_TRANSITION_DISABLE);
  if (delay) {
    await waitForDelay(delay);
  }
  await waitForSubsequentMutateTime();
  removeClassesNow(element, PREFIX_TRANSITION_DISABLE);
};
const setHasModal = () => setBoolData(getBody(), PREFIX_HAS_MODAL);
const delHasModal = () => delData(getBody(), PREFIX_HAS_MODAL);
const copyStyle = async (fromElement, toElement, includeComputedProps) => {
  if (!isDOMElement(fromElement) || !isDOMElement(toElement)) {
    return;
  }
  await waitForMeasureTime();
  const props = {};
  if (includeComputedProps) {
    for (const prop of includeComputedProps) {
      props[prop] = getComputedStylePropNow(fromElement, prop);
    }
  }
  const style = fromElement.style;
  for (const prop in style) {
    const value = style.getPropertyValue(prop);
    if (value) {
      props[prop] = value;
    }
  }
  for (const prop in props) {
    setStyleProp(toElement, prop, props[prop]);
  }
  addClasses(toElement, ...classList(fromElement));
};
const setNumericStyleProps = async (element, props, options = {}) => {
  if (!isDOMElement(element)) {
    return;
  }
  const transformFn = options._transformFn;
  const varPrefix = prefixCssJsVar((options === null || options === void 0 ? void 0 : options._prefix) || "");
  for (const prop in props) {
    const cssPropSuffix = camelToKebabCase(prop);
    const varName = `${varPrefix}${cssPropSuffix}`;
    let value;
    if (!isValidNum(props[prop])) {
      value = null;
    } else {
      var _options$_numDecimal;
      value = props[prop];
      const thisNumDecimal = (_options$_numDecimal = options === null || options === void 0 ? void 0 : options._numDecimal) !== null && _options$_numDecimal !== void 0 ? _options$_numDecimal : value > 0 && value < 1 ? 2 : 0;
      if (transformFn) {
        const currValue = parseFloat(await getStyleProp(element, varName));
        value = transformFn(prop, currValue || 0, value);
      }
      value = roundNumTo(value, thisNumDecimal);
    }
    if (value === null) {
      delStyleProp(element, varName);
    } else {
      setStyleProp(element, varName, value + ((options === null || options === void 0 ? void 0 : options._units) || ""));
    }
  }
};
const PREFIX_HAS_MODAL = prefixName("has-modal");
const scheduledCSSTransitions = newWeakMap();
const cancelCSSTransitions = (element, ...toClasses) => {
  const scheduledTransitions = scheduledCSSTransitions.get(element);
  if (!scheduledTransitions) {
    return;
  }
  for (const toCls of toClasses) {
    const scheduledTransition = scheduledTransitions[toCls];
    if (scheduledTransition) {
      scheduledTransition._cancel();
    }
  }
};
const scheduleCSSTransition = (element, toCls) => {
  let scheduledTransitions = scheduledCSSTransitions.get(element);
  if (!scheduledTransitions) {
    scheduledTransitions = {};
    scheduledCSSTransitions.set(element, scheduledTransitions);
  }
  let isCancelled = false;
  scheduledTransitions[toCls] = {
    _cancel: () => {
      isCancelled = true;
      deleteObjKey(scheduledTransitions, toCls);
    },
    _finish: () => {
      deleteObjKey(scheduledTransitions, toCls);
    },
    _isCancelled: () => {
      return isCancelled;
    }
  };
  return scheduledTransitions[toCls];
};

const wrapElementNow = (element, options) => {
  const wrapper = createWrapperFor(element, options === null || options === void 0 ? void 0 : options.wrapper);
  if ((options === null || options === void 0 ? void 0 : options.ignoreMove) === true) {
    ignoreMove(element, {
      from: parentOf(element),
      to: wrapper
    });
    ignoreMove(wrapper, {
      to: parentOf(element)
    });
  }
  element.replaceWith(wrapper);
  wrapper.append(element);
  return wrapper;
};
const wrapElement = async (element, options) => waitForMutateTime().then(() => wrapElementNow(element, options));
const wrapChildrenNow = (element, options) => {
  const wrapper = createWrapperFor(element, options === null || options === void 0 ? void 0 : options.wrapper);
  moveChildrenNow(element, wrapper, {
    ignoreMove: true
  });
  moveElementNow(wrapper, {
    to: element,
    ignoreMove: true
  });
  return wrapper;
};
const wrapChildren = async (element, options) => waitForMutateTime().then(() => wrapChildrenNow(element, options));
const replaceElementNow = (element, newElement, options) => {
  if ((options === null || options === void 0 ? void 0 : options.ignoreMove) === true) {
    ignoreMove(element, {
      from: parentOf(element)
    });
    ignoreMove(newElement, {
      from: parentOf(newElement),
      to: parentOf(element)
    });
  }
  element.replaceWith(newElement);
};
const swapElementsNow = (elementA, elementB, options) => {
  const temp = createElement("div");
  replaceElementNow(elementA, temp, options);
  replaceElementNow(elementB, elementA, options);
  replaceElementNow(temp, elementB, options);
};
const swapElements = async (elementA, elementB, options) => waitForMutateTime().then(() => swapElementsNow(elementA, elementB, options));
const moveChildrenNow = (oldParent, newParent, options) => {
  if ((options === null || options === void 0 ? void 0 : options.ignoreMove) === true) {
    for (const child of childrenOf(oldParent)) {
      ignoreMove(child, {
        from: oldParent,
        to: newParent
      });
    }
  }
  newParent.append(...childrenOf(oldParent));
};
const moveElementNow = (element, options) => {
  let parentEl = (options === null || options === void 0 ? void 0 : options.to) || null;
  const position = (options === null || options === void 0 ? void 0 : options.position) || "append";
  if (position === "before" || position === "after") {
    parentEl = parentOf(options === null || options === void 0 ? void 0 : options.to);
  }
  if ((options === null || options === void 0 ? void 0 : options.ignoreMove) === true) {
    ignoreMove(element, {
      from: parentOf(element),
      to: parentEl
    });
  }
  if (options !== null && options !== void 0 && options.to) {
    options.to[position](element);
  } else {
    remove(element);
  }
};
const moveElement = async (element, options) => waitForMutateTime().then(() => moveElementNow(element, options));
const hideAndRemoveElement = async (element, delay = 0, options) => {
  await hideElement(element, delay);
  moveElementNow(element, options);
};
const getOrAssignID = (element, prefix = "") => {
  let domID = element.id;
  if (!domID) {
    domID = `${prefix}-${randId()}`;
    element.id = domID;
  }
  return domID;
};
const wrapScrollingContent = async element => {
  await waitForMutateTime();
  let wrapper;
  const firstChild = childrenOf(element)[0];
  if (lengthOf(childrenOf(element)) === 1 && isHTMLElement(firstChild) && hasClass(firstChild, PREFIX_CONTENT_WRAPPER)) {
    wrapper = firstChild;
  } else {
    wrapper = wrapChildrenNow(element, {
      });
    addClassesNow(wrapper, PREFIX_CONTENT_WRAPPER);
  }
  return wrapper;
};
const cloneElement = element => {
  const clone = element.cloneNode(true);
  setBoolData(clone, prefixName("clone"));
  return clone;
};
const insertGhostCloneNow = (element, insertBefore = null) => {
  const clone = cloneElement(element);
  clone.id = "";
  addClassesNow(clone, PREFIX_GHOST, PREFIX_TRANSITION_DISABLE, PREFIX_ANIMATE_DISABLE);
  const wrapper = wrapElementNow(clone);
  addClassesNow(wrapper, PREFIX_WRAPPER$1);
  moveElementNow(wrapper, {
    to: insertBefore || element,
    position: "before",
    ignoreMove: true
  });
  return {
    _wrapper: wrapper,
    _clone: clone
  };
};
const insertGhostClone = (element, insertBefore = null) => waitForMutateTime().then(() => insertGhostCloneNow(element, insertBefore));
const ignoreMove = (target, options) => recordsToSkipOnce.set(target, {
  from: options.from || null,
  to: options.to || null
});
const getIgnoreMove = target => recordsToSkipOnce.get(target) || null;
const clearIgnoreMove = target => {
  setTimer(() => {
    deleteKey(recordsToSkipOnce, target);
  }, 100);
};
const insertArrow = (target, direction, position = "append", tag = "span") => {
  const arrow = createElement(tag);
  addClassesNow(arrow, prefixName(S_ARROW));
  setDataNow(arrow, prefixName("direction"), direction);
  moveElement(arrow, {
    to: target,
    position,
    ignoreMove: true
  });
  return arrow;
};
const PREFIX_CONTENT_WRAPPER = prefixName("content-wrapper");
const recordsToSkipOnce = newMap();
const createWrapperFor = (element, wrapper) => {
  if (isElement(wrapper)) {
    return wrapper;
  }
  let tag = wrapper;
  if (!tag) {
    if (isInlineTag(tagName(element))) {
      tag = "span";
    } else {
      tag = "div";
    }
  }
  return createElement(tag);
};

const waitForElement = (checkFn, timeout) => newPromise(resolve => {
  const callFn = () => {
    const result = checkFn();
    if (!isNullish(result)) {
      resolve(result);
      return true;
    }
    return false;
  };
  if (callFn()) {
    return;
  }
  if (!isNullish(timeout)) {
    setTimer(() => {
      resolve(null);
      observer.disconnect();
    }, timeout);
  }
  const observer = newMutationObserver(() => {
    if (callFn()) {
      observer.disconnect();
    }
  });
  observer.observe(getDocElement(), {
    childList: true,
    subtree: true
  });
});
const waitForElementOrInteractive = checkFn => newPromise(resolve => {
  let isInteractive = false;
  waitForElement(() => isInteractive || checkFn()).then(res => {
    if (!isInteractive) {
      resolve(res);
    }
  });
  waitForInteractive().then(() => {
    isInteractive = true;
    resolve(null);
  });
});
const waitForInteractive = () => newPromise(resolve => {
  const readyState = getReadyState();
  if (readyState === INTERACTIVE || readyState === COMPLETE) {
    resolve();
    return;
  }
  getDoc().addEventListener("DOMContentLoaded", () => resolve());
});
const waitForComplete = () => newPromise(resolve => {
  if (getReadyState() === COMPLETE) {
    resolve();
    return;
  }
  getDoc().addEventListener("readystatechange", () => {
    if (getReadyState() === COMPLETE) {
      resolve();
    }
  });
});
const waitForPageReady = () => newPromise(resolve => {
  if (pageIsReady) {
    resolve();
    return;
  }
  return waitForInteractive().then(() => {
    let timer = null;
    const dispatchReady = () => {
      pageIsReady = true;
      if (timer) {
        clearTimer(timer);
        timer = null;
      }
      resolve();
    };
    if (settings.pageLoadTimeout > 0) {
      timer = setTimer(() => {
        dispatchReady();
      }, settings.pageLoadTimeout);
    }
    waitForComplete().then(dispatchReady);
  });
});
const isPageReady = () => pageIsReady;
const COMPLETE = "complete";
const INTERACTIVE = "interactive";
let pageIsReady = false;
if (!hasDOM()) {
  pageIsReady = true;
} else {
  waitForPageReady();
}

const newXMap = getDefaultV => new XMap(getDefaultV);
const newXMapGetter = getDefaultV => () => newXMap(getDefaultV);
const newXWeakMap = getDefaultV => new XWeakMap(getDefaultV);
const newXWeakMapGetter = getDefaultV => () => newXWeakMap(getDefaultV);
class XMapBase {
  constructor(root, getDefaultV) {
    this.get = key => root.get(key);
    this.set = (key, value) => root.set(key, value);
    this.delete = key => deleteKey(root, key);
    this.has = key => root.has(key);
    this.sGet = key => {
      let result = root.get(key);
      if (result === undefined) {
        result = getDefaultV(key);
        root.set(key, result);
      }
      return result;
    };
    this.prune = (sk, ...rest) => {
      const value = root.get(sk);
      if (value instanceof XMapBase && lengthOf(rest)) {
        value.prune(rest[0], ...rest.slice(1));
      }
      if (value === undefined || isIterableObject(value) && !("size" in value && value.size || "length" in value && value.length)) {
        deleteKey(root, sk);
      }
    };
  }
}
class XMap extends XMapBase {
  constructor(getDefaultV) {
    const root = newMap();
    super(root, getDefaultV);
    defineProperty(this, "size", {
      get: () => root.size
    });
    this.clear = () => root.clear();
    this.entries = () => root.entries();
    this.keys = () => root.keys();
    this.values = () => root.values();
    this[SYMBOL.iterator] = () => root[SYMBOL.iterator]();
  }
}
_defineProperty(XMap, "newXMapGetter", newXMapGetter);
class XWeakMap extends XMapBase {
  constructor(getDefaultV) {
    const root = newWeakMap();
    super(root, getDefaultV);
  }
}
_defineProperty(XWeakMap, "newXWeakMapGetter", newXWeakMapGetter);

class DOMWatcher {
  static create(config = {}) {
    return new DOMWatcher(getConfig$6(config), CONSTRUCTOR_KEY$6);
  }
  static reuse(config = {}) {
    var _instances$get;
    const myConfig = getConfig$6(config);
    const configStrKey = objToStrKey(omitKeys(myConfig, {
      _root: null
    }));
    const root = myConfig._root === getBody() ? null : myConfig._root;
    let instance = (_instances$get = instances$8.get(root)) === null || _instances$get === void 0 ? void 0 : _instances$get.get(configStrKey);
    if (!instance) {
      instance = new DOMWatcher(myConfig, CONSTRUCTOR_KEY$6);
      instances$8.sGet(root).set(configStrKey, instance);
    }
    return instance;
  }
  constructor(config, key) {
    if (key !== CONSTRUCTOR_KEY$6) {
      throw illegalConstructorError("DOMWatcher.create");
    }
    const buffer = newXMap(t => ({
      _target: t,
      _categoryBitmask: 0,
      _attributes: newSet(),
      _addedTo: null,
      _removedFrom: null
    }));
    const allCallbacks = newMap();
    let timer = null;
    const mutationHandler = records => {
      for (const record of records) {
        const target = targetOf(record);
        const recType = record.type;
        if (!isElement(target)) {
          continue;
        }
        if (recType === S_CHILD_LIST) {
          for (const child of record.addedNodes) {
            if (isElement(child)) {
              const operation = buffer.sGet(child);
              operation._addedTo = target;
              operation._categoryBitmask |= ADDED_BIT;
            }
          }
          for (const child of record.removedNodes) {
            if (isElement(child)) {
              const operation = buffer.sGet(child);
              operation._removedFrom = target;
              operation._categoryBitmask |= REMOVED_BIT;
            }
          }
        } else if (recType === S_ATTRIBUTES && record.attributeName) {
          const operation = buffer.sGet(target);
          operation._attributes.add(record.attributeName);
          operation._categoryBitmask |= ATTRIBUTE_BIT;
        }
      }
      if (!timer && sizeOf(buffer)) {
        timer = setTimer(() => {
          for (const operation of buffer.values()) {
            if (shouldSkipOperation(operation)) ; else {
              processOperation(operation);
            }
          }
          buffer.clear();
          timer = null;
        }, 0);
      }
    };
    const observers = {
      [S_CHILD_LIST]: {
        _observer: newMutationObserver(mutationHandler),
        _isActive: false
      },
      [S_ATTRIBUTES]: {
        _observer: newMutationObserver(mutationHandler),
        _isActive: false
      }
    };
    const createCallback = (handler, options) => {
      var _allCallbacks$get;
      remove((_allCallbacks$get = allCallbacks.get(handler)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get._callback);
      const callback = wrapCallback(handler);
      callback.onRemove(() => deleteHandler(handler));
      allCallbacks.set(handler, {
        _callback: callback,
        _options: options
      });
      return callback;
    };
    const setupOnMutation = async (handler, userOptions) => {
      const options = getOptions$3(userOptions || {});
      const callback = createCallback(handler, options);
      let root = config._root || getBody();
      if (!root) {
        root = await waitForElement(getBody);
      } else {
        await null;
      }
      if (callback.isRemoved()) {
        return;
      }
      if (options._categoryBitmask & (ADDED_BIT | REMOVED_BIT)) {
        activateObserver(root, S_CHILD_LIST);
      }
      if (options._categoryBitmask & ATTRIBUTE_BIT) {
        activateObserver(root, S_ATTRIBUTES);
      }
      if (userOptions !== null && userOptions !== void 0 && userOptions.skipInitial || !options._selector || !(options._categoryBitmask & ADDED_BIT)) {
        return;
      }
      const childQueue = observers[S_CHILD_LIST]._observer.takeRecords();
      mutationHandler(childQueue);
      for (const element of [...querySelectorAll(root, options._selector), ...(root.matches(options._selector) ? [root] : [])]) {
        const initOperation = {
          _target: element,
          _categoryBitmask: ADDED_BIT,
          _attributes: newSet(),
          _addedTo: parentOf(element),
          _removedFrom: null
        };
        const bufferedOperation = buffer.get(element);
        const diffOperation = getDiffOperation(initOperation, bufferedOperation);
        if (diffOperation) {
          if (shouldSkipOperation(diffOperation)) ; else {
            await invokeCallback$5(callback, diffOperation);
          }
        }
      }
    };
    const deleteHandler = handler => {
      deleteKey(allCallbacks, handler);
      let activeCategories = 0;
      for (const entry of allCallbacks.values()) {
        activeCategories |= entry._options._categoryBitmask;
      }
      if (!(activeCategories & (ADDED_BIT | REMOVED_BIT))) {
        deactivateObserver(S_CHILD_LIST);
      }
      if (!(activeCategories & ATTRIBUTE_BIT)) {
        deactivateObserver(S_ATTRIBUTES);
      }
    };
    const processOperation = operation => {
      for (const entry of allCallbacks.values()) {
        const categoryBitmask = entry._options._categoryBitmask;
        const target = entry._options._target;
        const selector = entry._options._selector;
        if (!(operation._categoryBitmask & categoryBitmask)) {
          continue;
        }
        const currentTargets = [];
        if (target) {
          if (!operation._target.contains(target)) {
            continue;
          }
          currentTargets.push(target);
        }
        if (selector) {
          const matches = [...querySelectorAll(operation._target, selector)];
          if (operation._target.matches(selector)) {
            matches.push(operation._target);
          }
          if (!lengthOf(matches)) {
            continue;
          }
          currentTargets.push(...matches);
        }
        invokeCallback$5(entry._callback, operation, currentTargets);
      }
    };
    const activateObserver = (root, mutationType) => {
      if (!observers[mutationType]._isActive) {
        observers[mutationType]._observer.observe(root, {
          [mutationType]: true,
          subtree: config._subtree
        });
        observers[mutationType]._isActive = true;
      }
    };
    const deactivateObserver = mutationType => {
      if (observers[mutationType]._isActive) {
        observers[mutationType]._observer.disconnect();
        observers[mutationType]._isActive = false;
      }
    };
    const shouldSkipOperation = operation => {
      const target = operation._target;
      const requestToSkip = getIgnoreMove(target);
      if (!requestToSkip) {
        return false;
      }
      const removedFrom = operation._removedFrom;
      const addedTo = parentOf(target);
      const requestFrom = requestToSkip.from;
      const requestTo = requestToSkip.to;
      const root = config._root || getBody();
      if ((removedFrom === requestFrom || !root.contains(requestFrom)) && addedTo === requestTo) {
        clearIgnoreMove(target);
        return true;
      }
      return false;
    };
    this.ignoreMove = ignoreMove;
    this.onMutation = setupOnMutation;
    this.offMutation = handler => {
      var _allCallbacks$get2;
      remove((_allCallbacks$get2 = allCallbacks.get(handler)) === null || _allCallbacks$get2 === void 0 ? void 0 : _allCallbacks$get2._callback);
    };
  }
}
const CONSTRUCTOR_KEY$6 = SYMBOL();
const instances$8 = newXMap(() => newMap());
const getConfig$6 = config => {
  var _config$subtree;
  return {
    _root: config.root || null,
    _subtree: (_config$subtree = config.subtree) !== null && _config$subtree !== void 0 ? _config$subtree : true
  };
};
const CATEGORIES_BITS = DOM_CATEGORIES_SPACE.bit;
const ADDED_BIT = CATEGORIES_BITS[S_ADDED];
const REMOVED_BIT = CATEGORIES_BITS[S_REMOVED];
const ATTRIBUTE_BIT = CATEGORIES_BITS[S_ATTRIBUTE];
const getOptions$3 = options => {
  let categoryBitmask = 0;
  const categories = validateStrList("categories", options.categories, DOM_CATEGORIES_SPACE.has);
  if (categories) {
    for (const cat of categories) {
      categoryBitmask |= CATEGORIES_BITS[cat];
    }
  } else {
    categoryBitmask = DOM_CATEGORIES_SPACE.bitmask;
  }
  const selector = options.selector || "";
  if (!isString(selector)) {
    throw usageError("'selector' must be a string");
  }
  return {
    _categoryBitmask: categoryBitmask,
    _target: options.target || null,
    _selector: options.selector || ""
  };
};
const getDiffOperation = (operationA, operationB) => {
  if (!operationB || operationA._target !== operationB._target) {
    return operationA;
  }
  const attributes = newSet();
  for (const attr of operationA._attributes) {
    if (!operationB._attributes.has(attr)) {
      attributes.add(attr);
    }
  }
  const categoryBitmask = operationA._categoryBitmask ^ operationB._categoryBitmask;
  const addedTo = operationA._addedTo === operationB._addedTo ? null : operationA._addedTo;
  const removedFrom = operationA._removedFrom === operationB._removedFrom ? null : operationA._removedFrom;
  if (!sizeOf(attributes) && !categoryBitmask && !addedTo && !removedFrom) {
    return null;
  }
  return {
    _target: operationA._target,
    _categoryBitmask: categoryBitmask,
    _attributes: attributes,
    _addedTo: addedTo,
    _removedFrom: removedFrom
  };
};
const invokeCallback$5 = (callback, operation, currentTargets = []) => {
  if (!lengthOf(currentTargets)) {
    currentTargets = [operation._target];
  }
  for (const currentTarget of currentTargets) {
    callback.invoke({
      target: operation._target,
      currentTarget,
      attributes: operation._attributes,
      addedTo: operation._addedTo,
      removedFrom: operation._removedFrom
    }).catch(logError);
  }
};

const getMaxDeltaDirection = (deltaX, deltaY) => {
  if (!abs(deltaX) && !abs(deltaY)) {
    return S_NONE;
  }
  if (abs(deltaX) === abs(deltaY)) {
    return S_AMBIGUOUS;
  }
  if (abs(deltaX) > abs(deltaY)) {
    return deltaX < 0 ? S_LEFT : S_RIGHT;
  }
  return deltaY < 0 ? S_UP : S_DOWN;
};
const getVectorDirection = (vector, angleDiffThreshold = 0) => {
  angleDiffThreshold = min(44.99, abs(angleDiffThreshold));
  if (!maxAbs(...vector)) {
    return S_NONE;
  } else if (areParallel(vector, [1, 0], angleDiffThreshold)) {
    return S_RIGHT;
  } else if (areParallel(vector, [0, 1], angleDiffThreshold)) {
    return S_DOWN;
  } else if (areParallel(vector, [-1, 0], angleDiffThreshold)) {
    return S_LEFT;
  } else if (areParallel(vector, [0, -1], angleDiffThreshold)) {
    return S_UP;
  }
  return S_AMBIGUOUS;
};
const getOppositeDirection = direction => {
  if (!(direction in OPPOSITE_DIRECTIONS)) {
    throw usageError("Invalid 'direction'");
  }
  return OPPOSITE_DIRECTIONS[direction];
};
const getOppositeXYDirections = directions => {
  const directionList = validateStrList("directions", directions, isValidXYDirection);
  if (!directionList) {
    throw usageError("'directions' is required");
  }
  const opposites = [];
  for (const direction of directionList) {
    const opposite = getOppositeDirection(direction);
    if (opposite && isValidXYDirection(opposite) && !includes(directionList, opposite)) {
      opposites.push(opposite);
    }
  }
  if (!lengthOf(opposites)) {
    for (const direction of XY_DIRECTIONS) {
      if (!includes(directionList, direction)) {
        opposites.push(direction);
      }
    }
  }
  return opposites;
};
const isValidXYDirection = direction => includes(XY_DIRECTIONS, direction);
const isValidDirection = direction => includes(DIRECTIONS, direction);
const XY_DIRECTIONS = [S_UP, S_DOWN, S_LEFT, S_RIGHT];
const Z_DIRECTIONS = [S_IN, S_OUT];
const SCROLL_DIRECTIONS = [...XY_DIRECTIONS, S_NONE, S_AMBIGUOUS];
const DIRECTIONS = [...XY_DIRECTIONS, ...Z_DIRECTIONS, S_NONE, S_AMBIGUOUS];
const OPPOSITE_DIRECTIONS = {
  [S_UP]: S_DOWN,
  [S_DOWN]: S_UP,
  [S_LEFT]: S_RIGHT,
  [S_RIGHT]: S_LEFT,
  [S_IN]: S_OUT,
  [S_OUT]: S_IN,
  [S_NONE]: null,
  [S_AMBIGUOUS]: null
};

const callEventListener = (handler, event) => {
  if (isFunction(handler)) {
    handler.call(event.currentTarget || self, event);
  } else {
    handler.handleEvent.call(event.currentTarget || self, event);
  }
};
const addEventListenerTo = (target, eventType, handler, options = {}) => {
  eventType = transformEventType(eventType);
  if (getEventHandlerData(target, eventType, handler, options)) {
    return false;
  }
  let thirdArg = options;
  let wrappedHandler = handler;
  const supports = getBrowserSupport();
  if (isNonPrimitive(options)) {
    if (!supports._optionsArg) {
      var _options$capture;
      thirdArg = (_options$capture = options.capture) !== null && _options$capture !== void 0 ? _options$capture : false;
    }
    if (options.once && !supports._options.once) {
      wrappedHandler = event => {
        removeEventListenerFrom(target, eventType, handler, options);
        callEventListener(handler, event);
      };
    }
  }
  setEventHandlerData(target, eventType, handler, options, {
    _wrappedHandler: wrappedHandler,
    _thirdArg: thirdArg
  });
  target.addEventListener(eventType, wrappedHandler, thirdArg);
  return true;
};
const removeEventListenerFrom = (target, eventType, handler, options = {}) => {
  eventType = transformEventType(eventType);
  const data = getEventHandlerData(target, eventType, handler, options);
  if (!data) {
    return false;
  }
  target.removeEventListener(eventType, data._wrappedHandler, data._thirdArg);
  deleteEventHandlerData(target, eventType, handler, options);
  return true;
};
const preventSelect = target => {
  addEventListenerTo(target, S_SELECTSTART, preventDefault);
  if (isElement(target)) {
    addClasses(target, PREFIX_NO_SELECT);
  }
};
const undoPreventSelect = target => {
  removeEventListenerFrom(target, S_SELECTSTART, preventDefault);
  if (isElement(target)) {
    removeClasses(target, PREFIX_NO_SELECT);
  }
};
const getBrowserSupport = () => {
  if (browserEventSupport) {
    return browserEventSupport;
  }
  const supports = {
    _pointer: false,
    _optionsArg: false,
    _options: {
      capture: false,
      passive: false,
      once: false,
      signal: false
    }
  };
  const optTest = {};
  let opt;
  for (opt in supports._options) {
    const thisOpt = opt;
    defineProperty(optTest, thisOpt, {
      get: () => {
        supports._options[thisOpt] = true;
        if (thisOpt === "signal") {
          return new AbortController().signal;
        }
        return false;
      }
    });
  }
  const dummyHandler = () => {};
  const dummyElement = createElement("div");
  try {
    dummyElement.addEventListener("testOptionSupport", dummyHandler, optTest);
    dummyElement.removeEventListener("testOptionSupport", dummyHandler, optTest);
    supports._optionsArg = true;
  } catch (e__ignored) {}
  supports._pointer = "onpointerup" in dummyElement;
  browserEventSupport = supports;
  return supports;
};
let browserEventSupport;
const registeredEventHandlerData = newXWeakMap(newXMapGetter(newXMapGetter(() => newMap())));
const getEventOptionsStr = options => {
  const finalOptions = {
    capture: false,
    passive: false,
    once: false
  };
  if (options === false || options === true) {
    finalOptions.capture = options;
  } else if (isObject(options)) {
    copyExistingKeys(options, finalOptions);
  }
  return stringify(finalOptions);
};
const getEventHandlerData = (target, eventType, handler, options) => {
  var _registeredEventHandl;
  const optionsStr = getEventOptionsStr(options);
  return (_registeredEventHandl = registeredEventHandlerData.get(target)) === null || _registeredEventHandl === void 0 || (_registeredEventHandl = _registeredEventHandl.get(eventType)) === null || _registeredEventHandl === void 0 || (_registeredEventHandl = _registeredEventHandl.get(handler)) === null || _registeredEventHandl === void 0 ? void 0 : _registeredEventHandl.get(optionsStr);
};
const deleteEventHandlerData = (target, eventType, handler, options) => {
  var _registeredEventHandl2;
  const optionsStr = getEventOptionsStr(options);
  deleteKey((_registeredEventHandl2 = registeredEventHandlerData.get(target)) === null || _registeredEventHandl2 === void 0 || (_registeredEventHandl2 = _registeredEventHandl2.get(eventType)) === null || _registeredEventHandl2 === void 0 ? void 0 : _registeredEventHandl2.get(handler), optionsStr);
  registeredEventHandlerData.prune(target, eventType, handler);
};
const setEventHandlerData = (target, eventType, handler, options, data) => {
  const optionsStr = getEventOptionsStr(options);
  registeredEventHandlerData.sGet(target).sGet(eventType).sGet(handler).set(optionsStr, data);
};
const transformEventType = eventType => {
  const supports = getBrowserSupport();
  if (eventType.startsWith(S_POINTER) && !supports._pointer) {
    return strReplace(eventType, S_POINTER, S_MOUSE);
  }
  return eventType;
};

const isValidInputDevice = device => includes(DEVICES, device);
const isValidIntent = intent => includes(INTENTS, intent);
const addDeltaZ = (current, increment) => max(MIN_DELTA_Z, current * increment);
const DEVICES = [S_KEY, S_POINTER, S_TOUCH, S_WHEEL];
const INTENTS = [S_SCROLL, S_ZOOM, S_DRAG, S_UNKNOWN];
const MIN_DELTA_Z = 0.1;

const getKeyGestureFragment = (events, options) => {
  var _options$scrollHeight;
  if (!isIterableObject(events)) {
    events = [events];
  }
  const LINE = settings.deltaLineHeight;
  const PAGE = settings.deltaPageHeight;
  const CONTENT = (_options$scrollHeight = options === null || options === void 0 ? void 0 : options.scrollHeight) !== null && _options$scrollHeight !== void 0 ? _options$scrollHeight : PAGE;
  const deltasUp = amount => [0, -amount, 1];
  const deltasDown = amount => [0, amount, 1];
  const deltasLeft = amount => [-amount, 0, 1];
  const deltasRight = amount => [amount, 0, 1];
  const deltasIn = [0, 0, 1.15];
  const deltasOut = [0, 0, 1 / 1.15];
  let direction = S_NONE;
  let intent = null;
  let deltaX = 0,
    deltaY = 0,
    deltaZ = 1;
  for (const event of events) {
    if (!isKeyboardEvent(event) || event.type !== S_KEYDOWN) {
      continue;
    }
    const deltasForKey = {
      [SK_UP]: deltasUp(LINE),
      [SK_ARROWUP]: deltasUp(LINE),
      [SK_PAGEUP]: deltasUp(PAGE),
      Home: deltasUp(CONTENT),
      [SK_DOWN]: deltasDown(LINE),
      [SK_ARROWDOWN]: deltasDown(LINE),
      [SK_PAGEDOWN]: deltasDown(PAGE),
      End: deltasDown(CONTENT),
      [SK_LEFT]: deltasLeft(LINE),
      [SK_ARROWLEFT]: deltasLeft(LINE),
      [SK_RIGHT]: deltasRight(LINE),
      [SK_ARROWRIGHT]: deltasRight(LINE),
      " ": (event.shiftKey ? deltasUp : deltasDown)(PAGE),
      "+": deltasIn,
      "=": event.ctrlKey ? deltasIn : null,
      "-": deltasOut
    };
    const theseDeltas = deltasForKey[event.key] || null;
    if (!theseDeltas) {
      continue;
    }
    const [thisDeltaX, thisDeltaY, thisDeltaZ] = theseDeltas;
    const thisIntent = thisDeltaZ !== 1 ? S_ZOOM : S_SCROLL;
    deltaX += thisDeltaX;
    deltaY += thisDeltaY;
    deltaZ = addDeltaZ(deltaZ, thisDeltaZ);
    if (!intent) {
      intent = thisIntent;
    } else if (intent !== thisIntent) {
      intent = S_UNKNOWN;
    }
  }
  if (!intent) {
    return false;
  } else if (intent === S_UNKNOWN) {
    direction = S_AMBIGUOUS;
  } else if (intent === S_ZOOM) {
    direction = deltaZ > 1 ? S_IN : deltaZ < 1 ? S_OUT : S_NONE;
  } else {
    direction = getVectorDirection([deltaX, deltaY], options === null || options === void 0 ? void 0 : options.angleDiffThreshold);
  }
  return direction === S_NONE ? false : {
    device: S_KEY,
    direction,
    intent,
    deltaX,
    deltaY,
    deltaZ
  };
};
const SK_UP = "Up";
const SK_DOWN = "Down";
const SK_LEFT = "Left";
const SK_RIGHT = "Right";
const SK_PAGE = "Page";
const SK_ARROW = "Arrow";
const SK_PAGEUP = SK_PAGE + SK_UP;
const SK_PAGEDOWN = SK_PAGE + SK_DOWN;
const SK_ARROWUP = SK_ARROW + SK_UP;
const SK_ARROWDOWN = SK_ARROW + SK_DOWN;
const SK_ARROWLEFT = SK_ARROW + SK_LEFT;
const SK_ARROWRIGHT = SK_ARROW + SK_RIGHT;

const getPointerGestureFragment = (events, options) => {
  if (!isIterableObject(events)) {
    events = [events];
  }
  let isCancelled = false;
  const supports = getBrowserSupport();
  const pointerEventClass = supports._pointer ? PointerEvent : MouseEvent;
  const pointerUpType = supports._pointer ? S_POINTERUP : S_MOUSEUP;
  const filteredEvents = filter(events, event => {
    const eType = event.type;
    isCancelled = isCancelled || eType === S_POINTERCANCEL;
    if (eType !== S_CLICK && isInstanceOf(event, pointerEventClass)) {
      isCancelled = isCancelled || eType === pointerUpType && event.buttons !== 0 || eType !== pointerUpType && event.buttons !== 1;
      return !isTouchPointerEvent(event);
    }
    return false;
  });
  const numEvents = lengthOf(filteredEvents);
  if (numEvents < 2) {
    return false;
  }
  if (isCancelled) {
    return null;
  }
  const firstEvent = filteredEvents[0];
  const lastEvent = filteredEvents[numEvents - 1];
  if (getPointerType(firstEvent) !== getPointerType(lastEvent)) {
    return null;
  }
  const deltaX = lastEvent.clientX - firstEvent.clientX;
  const deltaY = lastEvent.clientY - firstEvent.clientY;
  const direction = getVectorDirection([deltaX, deltaY], options === null || options === void 0 ? void 0 : options.angleDiffThreshold);
  return direction === S_NONE ? false : {
    device: S_POINTER,
    direction,
    intent: S_DRAG,
    deltaX,
    deltaY,
    deltaZ: 1
  };
};

const getTouchGestureFragment = (events, options) => {
  var _options$dragHoldTime, _options$dragNumFinge;
  if (!isIterableObject(events)) {
    events = [events];
  }
  let moves = getTouchDiff(events, options === null || options === void 0 ? void 0 : options.deltaThreshold);
  if (!moves) {
    return null;
  }
  let numMoves = lengthOf(moves);
  const holdTime = getHoldTime(events);
  const canBeDrag = holdTime >= ((_options$dragHoldTime = options === null || options === void 0 ? void 0 : options.dragHoldTime) !== null && _options$dragHoldTime !== void 0 ? _options$dragHoldTime : 500) && numMoves === ((_options$dragNumFinge = options === null || options === void 0 ? void 0 : options.dragNumFingers) !== null && _options$dragNumFinge !== void 0 ? _options$dragNumFinge : 1);
  const angleDiffThreshold = options === null || options === void 0 ? void 0 : options.angleDiffThreshold;
  let deltaX = havingMaxAbs(...moves.map(m => m.deltaX));
  let deltaY = havingMaxAbs(...moves.map(m => m.deltaY));
  let deltaZ = 1;
  if (numMoves > 2) {
    moves = filter(moves, d => d.isSignificant);
    numMoves = lengthOf(moves);
  }
  let direction = S_NONE;
  let intent = S_UNKNOWN;
  if (numMoves === 2) {
    const vectorA = [moves[0].deltaX, moves[0].deltaY];
    const vectorB = [moves[1].deltaX, moves[1].deltaY];
    if (!havingMaxAbs(...vectorA) || !havingMaxAbs(...vectorB) || areAntiParallel(vectorA, vectorB, angleDiffThreshold)) {
      const startDistance = distanceBetween([moves[0].startX, moves[0].startY], [moves[1].startX, moves[1].startY]);
      const endDistance = distanceBetween([moves[0].endX, moves[0].endY], [moves[1].endX, moves[1].endY]);
      direction = startDistance < endDistance ? S_IN : S_OUT;
      deltaZ = endDistance / startDistance;
      deltaX = deltaY = 0;
      intent = S_ZOOM;
    }
  }
  const deltaSign = canBeDrag || options !== null && options !== void 0 && options.reverseScroll ? 1 : -1;
  deltaX = deltaSign * deltaX + 0;
  deltaY = deltaSign * deltaY + 0;
  if (direction === S_NONE) {
    let isFirst = true;
    for (const m of moves) {
      intent = canBeDrag ? S_DRAG : S_SCROLL;
      const thisDirection = getVectorDirection([deltaSign * m.deltaX, deltaSign * m.deltaY], angleDiffThreshold);
      if (thisDirection === S_NONE) {
        continue;
      }
      if (isFirst) {
        direction = thisDirection;
      } else if (direction !== thisDirection) {
        direction = S_AMBIGUOUS;
        break;
      }
      isFirst = false;
    }
  }
  if (direction === S_NONE) {
    const lastTouchEvent = events.filter(isTouchEvent).slice(-1)[0];
    return lengthOf(lastTouchEvent === null || lastTouchEvent === void 0 ? void 0 : lastTouchEvent.touches) ? false : null;
  }
  return {
    device: S_TOUCH,
    direction,
    intent,
    deltaX,
    deltaY,
    deltaZ
  };
};
const getTouchDiff = (events, deltaThreshold = 0) => {
  const groupedTouches = newXMap(() => []);
  for (const event of events) {
    if (!isTouchEvent(event)) {
      continue;
    }
    if (event.type === S_TOUCHCANCEL) {
      return null;
    }
    for (const touch of event.touches) {
      groupedTouches.sGet(touch.identifier).push(touch);
    }
  }
  const moves = [];
  for (const touchList of groupedTouches.values()) {
    const nTouches = lengthOf(touchList);
    if (nTouches < 2) {
      continue;
    }
    const firstTouch = touchList[0];
    const lastTouch = touchList[nTouches - 1];
    const startX = firstTouch.clientX;
    const startY = firstTouch.clientY;
    const endX = lastTouch.clientX;
    const endY = lastTouch.clientY;
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const isSignificant = maxAbs(deltaX, deltaY) >= deltaThreshold;
    moves.push({
      startX,
      startY,
      endX,
      endY,
      deltaX,
      deltaY,
      isSignificant
    });
  }
  return moves;
};
const getHoldTime = events => {
  const firstStart = events.findIndex(e => e.type === S_TOUCHSTART);
  const firstMove = events.findIndex(e => e.type === S_TOUCHMOVE);
  if (firstStart < 0 || firstMove < 1) {
    return 0;
  }
  return events[firstMove].timeStamp - events[firstStart].timeStamp;
};

const normalizeWheel = event => {
  let spinX = 0,
    spinY = 0,
    pixelX = event.deltaX,
    pixelY = event.deltaY;
  const LINE = settings.deltaLineHeight;
  if (event.detail !== undefined) {
    spinY = event.detail;
  }
  if (event.wheelDelta !== undefined) {
    spinY = -event.wheelDelta / 120;
  }
  if (event.wheelDeltaY !== undefined) {
    spinY = -event.wheelDeltaY / 120;
  }
  if (event.wheelDeltaX !== undefined) {
    spinX = -event.wheelDeltaX / 120;
  }
  if ((pixelX || pixelY) && event.deltaMode) {
    if (event.deltaMode === 1) {
      pixelX *= LINE;
      pixelY *= LINE;
    } else {
      pixelX *= settings.deltaPageWidth;
      pixelY *= settings.deltaPageHeight;
    }
  }
  if (pixelX && !spinX) {
    spinX = pixelX < 1 ? -1 : 1;
  }
  if (pixelY && !spinY) {
    spinY = pixelY < 1 ? -1 : 1;
  }
  return {
    spinX,
    spinY,
    pixelX,
    pixelY
  };
};

const getWheelGestureFragment = (events, options) => {
  if (!isIterableObject(events)) {
    events = [events];
  }
  let direction = S_NONE;
  let intent = null;
  let deltaX = 0,
    deltaY = 0,
    deltaZ = 1;
  for (const event of events) {
    if (!isWheelEvent(event) || event.type !== S_WHEEL) {
      continue;
    }
    const data = normalizeWheel(event);
    let thisIntent = S_SCROLL;
    let thisDeltaX = data.pixelX;
    let thisDeltaY = data.pixelY;
    let thisDeltaZ = 1;
    const maxDelta = havingMaxAbs(thisDeltaX, thisDeltaY);
    if (event.ctrlKey && !thisDeltaX) {
      let percentage = -maxDelta;
      if (abs(percentage) >= 50) {
        percentage /= 10;
      }
      thisDeltaZ = 1 + percentage / 100;
      thisDeltaX = thisDeltaY = 0;
      thisIntent = S_ZOOM;
    } else if (event.shiftKey && !thisDeltaX) {
      thisDeltaX = thisDeltaY;
      thisDeltaY = 0;
    }
    deltaX += thisDeltaX;
    deltaY += thisDeltaY;
    deltaZ = addDeltaZ(deltaZ, thisDeltaZ);
    if (!thisIntent) ; else if (!intent) {
      intent = thisIntent;
    } else if (intent !== thisIntent) {
      intent = S_UNKNOWN;
    }
  }
  if (!intent) {
    return false;
  } else if (intent === S_UNKNOWN) {
    direction = S_AMBIGUOUS;
  } else if (intent === S_ZOOM) {
    direction = deltaZ > 1 ? S_IN : deltaZ < 1 ? S_OUT : S_NONE;
  } else {
    direction = getVectorDirection([deltaX, deltaY], options === null || options === void 0 ? void 0 : options.angleDiffThreshold);
  }
  return direction === S_NONE ? false : {
    device: S_WHEEL,
    direction,
    intent,
    deltaX,
    deltaY,
    deltaZ
  };
};

class GestureWatcher {
  static create(config = {}) {
    return new GestureWatcher(getConfig$5(config), CONSTRUCTOR_KEY$5);
  }
  static reuse(config = {}) {
    const myConfig = getConfig$5(config);
    const configStrKey = objToStrKey(myConfig);
    let instance = instances$7.get(configStrKey);
    if (!instance) {
      instance = new GestureWatcher(myConfig, CONSTRUCTOR_KEY$5);
      instances$7.set(configStrKey, instance);
    }
    return instance;
  }
  constructor(config, key) {
    if (key !== CONSTRUCTOR_KEY$5) {
      throw illegalConstructorError("GestureWatcher.create");
    }
    const allCallbacks = newXWeakMap(() => newMap());
    const allListeners = newXWeakMap(() => newMap());
    const createCallback = (target, handler, options) => {
      var _allCallbacks$get;
      remove((_allCallbacks$get = allCallbacks.get(target)) === null || _allCallbacks$get === void 0 || (_allCallbacks$get = _allCallbacks$get.get(handler)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get._callback);
      const {
        _callback,
        _wrapper
      } = getCallbackAndWrapper(handler, options);
      _callback.onRemove(() => deleteHandler(target, handler, options));
      allCallbacks.sGet(target).set(handler, {
        _callback,
        _wrapper,
        _options: options
      });
      return _callback;
    };
    const setupOnGesture = async (target, handler, userOptions) => {
      const options = getOptions$2(config, userOptions || {});
      createCallback(target, handler, options);
      for (const device of options._devices || DEVICES) {
        var _allListeners$get;
        let listeners = (_allListeners$get = allListeners.get(target)) === null || _allListeners$get === void 0 ? void 0 : _allListeners$get.get(device);
        if (listeners) ; else {
          listeners = setupListeners(target, device, options);
          allListeners.sGet(target).set(device, listeners);
        }
        listeners._nCallbacks++;
        if (options._preventDefault) {
          listeners._nPreventDefault++;
        }
      }
    };
    const deleteHandler = (target, handler, options) => {
      deleteKey(allCallbacks.get(target), handler);
      allCallbacks.prune(target);
      for (const device of options._devices || DEVICES) {
        var _allListeners$get2;
        const listeners = (_allListeners$get2 = allListeners.get(target)) === null || _allListeners$get2 === void 0 ? void 0 : _allListeners$get2.get(device);
        if (listeners) {
          listeners._nCallbacks--;
          if (options._preventDefault) {
            listeners._nPreventDefault--;
          }
          if (!listeners._nCallbacks) {
            deleteKey(allListeners.get(target), device);
            listeners._remove();
          }
        }
      }
    };
    const invokeCallbacks = (target, device, event) => {
      var _allListeners$get3;
      const preventDefault = (((_allListeners$get3 = allListeners.get(target)) === null || _allListeners$get3 === void 0 || (_allListeners$get3 = _allListeners$get3.get(device)) === null || _allListeners$get3 === void 0 ? void 0 : _allListeners$get3._nPreventDefault) || 0) > 0;
      let isTerminated = false;
      for (const {
        _wrapper
      } of ((_allCallbacks$get2 = allCallbacks.get(target)) === null || _allCallbacks$get2 === void 0 ? void 0 : _allCallbacks$get2.values()) || []) {
        var _allCallbacks$get2;
        isTerminated = _wrapper(target, device, event, preventDefault) || isTerminated;
      }
      return isTerminated;
    };
    const setupListeners = (target, device, options) => {
      const intents = options._intents;
      let hasAddedTabIndex = false;
      let hasPreventedSelect = false;
      if (device === S_KEY && isElement(target) && !getTabIndex(target)) {
        hasAddedTabIndex = true;
        setTabIndex(target);
      } else if (isElement(target) && device === S_TOUCH) {
        if (options._preventDefault) {
          addClasses(target, PREFIX_NO_TOUCH_ACTION);
        }
        if (!intents || includes(intents, S_DRAG)) {
          hasPreventedSelect = true;
          preventSelect(target);
        }
      }
      const addOrRemoveListeners = (action, listener, eventTypes) => {
        const method = action === "add" ? addEventListenerTo : removeEventListenerFrom;
        for (const eventType of eventTypes) {
          method(target, eventType, listener, {
            passive: false,
            capture: true
          });
        }
      };
      const addInitialListener = () => addOrRemoveListeners("add", initialListener, initiatingEvents[device]);
      const removeInitialListener = () => addOrRemoveListeners("remove", initialListener, initiatingEvents[device]);
      const addOngoingListener = () => addOrRemoveListeners("add", processEvent, ongoingEvents[device]);
      const removeOngoingListener = () => addOrRemoveListeners("remove", processEvent, ongoingEvents[device]);
      const initialListener = event => {
        processEvent(event);
        removeInitialListener();
        addOngoingListener();
      };
      const processEvent = event => {
        const isTerminated = invokeCallbacks(target, device, event);
        if (isTerminated) {
          removeOngoingListener();
          addInitialListener();
        }
      };
      addInitialListener();
      return {
        _nCallbacks: 0,
        _nPreventDefault: 0,
        _remove: () => {
          if (isElement(target)) {
            if (hasAddedTabIndex) {
              unsetTabIndex(target);
            }
            removeClasses(target, PREFIX_NO_TOUCH_ACTION);
            if (hasPreventedSelect) {
              undoPreventSelect(target);
            }
          }
          removeOngoingListener();
          removeInitialListener();
        }
      };
    };
    this.trackGesture = (element, handler, options) => {
      if (!handler) {
        handler = setGestureCssProps;
        for (const intent of INTENTS) {
          setGestureCssProps(element, {
            intent,
            totalDeltaX: 0,
            totalDeltaY: 0,
            totalDeltaZ: 1
          });
        }
      }
      return setupOnGesture(element, handler, options);
    };
    this.noTrackGesture = (element, handler) => {
      if (!handler) {
        handler = setGestureCssProps;
        for (const intent of INTENTS) {
          setGestureCssProps(element, {
            intent
          });
        }
      }
      this.offGesture(element, handler);
    };
    this.onGesture = setupOnGesture;
    this.offGesture = (target, handler) => {
      var _allCallbacks$get3;
      remove((_allCallbacks$get3 = allCallbacks.get(target)) === null || _allCallbacks$get3 === void 0 || (_allCallbacks$get3 = _allCallbacks$get3.get(handler)) === null || _allCallbacks$get3 === void 0 ? void 0 : _allCallbacks$get3._callback);
    };
  }
}
const CONSTRUCTOR_KEY$5 = SYMBOL();
const instances$7 = newMap();
const getConfig$5 = config => {
  var _config$preventDefaul, _config$naturalTouchS, _config$touchDragHold, _config$touchDragNumF;
  return {
    _preventDefault: (_config$preventDefaul = config.preventDefault) !== null && _config$preventDefaul !== void 0 ? _config$preventDefaul : true,
    _debounceWindow: toNonNegNum(config[S_DEBOUNCE_WINDOW], 150),
    _deltaThreshold: toNonNegNum(config.deltaThreshold, 5),
    _angleDiffThreshold: toPosNum(config.angleDiffThreshold, 35),
    _naturalTouchScroll: (_config$naturalTouchS = config.naturalTouchScroll) !== null && _config$naturalTouchS !== void 0 ? _config$naturalTouchS : true,
    _touchDragHoldTime: (_config$touchDragHold = config.touchDragHoldTime) !== null && _config$touchDragHold !== void 0 ? _config$touchDragHold : 500,
    _touchDragNumFingers: (_config$touchDragNumF = config.touchDragNumFingers) !== null && _config$touchDragNumF !== void 0 ? _config$touchDragNumF : 1
  };
};
const initiatingEvents = {
  key: [S_KEYDOWN],
  pointer: [S_POINTERDOWN, S_CLICK],
  touch: [S_TOUCHSTART],
  wheel: [S_WHEEL]
};
const ongoingEvents = {
  key: [S_KEYDOWN],
  pointer: [S_POINTERDOWN, S_POINTERUP, S_POINTERMOVE, S_POINTERCANCEL, S_CLICK],
  touch: [S_TOUCHSTART, S_TOUCHEND, S_TOUCHMOVE, S_TOUCHCANCEL],
  wheel: [S_WHEEL]
};
const fragmentGetters = {
  [S_KEY]: getKeyGestureFragment,
  [S_POINTER]: getPointerGestureFragment,
  [S_TOUCH]: getTouchGestureFragment,
  [S_WHEEL]: getWheelGestureFragment
};
const getOptions$2 = (config, options) => {
  var _options$minTotalDelt, _options$maxTotalDelt, _options$minTotalDelt2, _options$maxTotalDelt2, _options$minTotalDelt3, _options$maxTotalDelt3, _options$preventDefau, _options$naturalTouch, _options$touchDragHol, _options$touchDragNum;
  const debounceWindow = toNonNegNum(options[S_DEBOUNCE_WINDOW], config._debounceWindow);
  const deltaThreshold = toNonNegNum(options.deltaThreshold, config._deltaThreshold);
  return {
    _devices: validateStrList("devices", options.devices, isValidInputDevice) || null,
    _directions: validateStrList("directions", options.directions, isValidDirection) || null,
    _intents: validateStrList("intents", options.intents, isValidIntent) || null,
    _minTotalDeltaX: (_options$minTotalDelt = options.minTotalDeltaX) !== null && _options$minTotalDelt !== void 0 ? _options$minTotalDelt : null,
    _maxTotalDeltaX: (_options$maxTotalDelt = options.maxTotalDeltaX) !== null && _options$maxTotalDelt !== void 0 ? _options$maxTotalDelt : null,
    _minTotalDeltaY: (_options$minTotalDelt2 = options.minTotalDeltaY) !== null && _options$minTotalDelt2 !== void 0 ? _options$minTotalDelt2 : null,
    _maxTotalDeltaY: (_options$maxTotalDelt2 = options.maxTotalDeltaY) !== null && _options$maxTotalDelt2 !== void 0 ? _options$maxTotalDelt2 : null,
    _minTotalDeltaZ: (_options$minTotalDelt3 = options.minTotalDeltaZ) !== null && _options$minTotalDelt3 !== void 0 ? _options$minTotalDelt3 : null,
    _maxTotalDeltaZ: (_options$maxTotalDelt3 = options.maxTotalDeltaZ) !== null && _options$maxTotalDelt3 !== void 0 ? _options$maxTotalDelt3 : null,
    _preventDefault: (_options$preventDefau = options.preventDefault) !== null && _options$preventDefau !== void 0 ? _options$preventDefau : config._preventDefault,
    _debounceWindow: debounceWindow,
    _deltaThreshold: deltaThreshold,
    _angleDiffThreshold: toNonNegNum(options.angleDiffThreshold, config._angleDiffThreshold),
    _naturalTouchScroll: (_options$naturalTouch = options.naturalTouchScroll) !== null && _options$naturalTouch !== void 0 ? _options$naturalTouch : config._naturalTouchScroll,
    _touchDragHoldTime: (_options$touchDragHol = options.touchDragHoldTime) !== null && _options$touchDragHol !== void 0 ? _options$touchDragHol : config._touchDragHoldTime,
    _touchDragNumFingers: (_options$touchDragNum = options.touchDragNumFingers) !== null && _options$touchDragNum !== void 0 ? _options$touchDragNum : config._touchDragNumFingers
  };
};
const getCallbackAndWrapper = (handler, options, logger) => {
  let totalDeltaX = 0,
    totalDeltaY = 0,
    totalDeltaZ = 1;
  let preventNextClick = false;
  const directions = options._directions;
  const intents = options._intents;
  const minTotalDeltaX = options._minTotalDeltaX;
  const maxTotalDeltaX = options._maxTotalDeltaX;
  const minTotalDeltaY = options._minTotalDeltaY;
  const maxTotalDeltaY = options._maxTotalDeltaY;
  const minTotalDeltaZ = options._minTotalDeltaZ;
  const maxTotalDeltaZ = options._maxTotalDeltaZ;
  const deltaThreshold = options._deltaThreshold;
  const angleDiffThreshold = options._angleDiffThreshold;
  const reverseScroll = !options._naturalTouchScroll;
  const dragHoldTime = options._touchDragHoldTime;
  const dragNumFingers = options._touchDragNumFingers;
  const eventQueue = [];
  randId();
  const callback = wrapCallback(handler);
  const debouncedWrapper = getDebouncedHandler(options._debounceWindow, (target, fragment, eventQueueCopy) => {
    var _eventQueueCopy, _eventQueueCopy$;
    if (callback.isRemoved()) {
      return;
    }
    const deltaX = fragment.deltaX;
    const deltaY = fragment.deltaY;
    const deltaZ = fragment.deltaZ;
    const device = fragment.device;
    if (round(maxAbs(deltaX, deltaY, (1 - deltaZ) * 100)) < deltaThreshold) {
      return;
    }
    clearEventQueue(device, eventQueue);
    const newTotalDeltaX = toNumWithBounds(totalDeltaX + deltaX, {
      min: minTotalDeltaX,
      max: maxTotalDeltaX
    });
    const newTotalDeltaY = toNumWithBounds(totalDeltaY + deltaY, {
      min: minTotalDeltaY,
      max: maxTotalDeltaY
    });
    const newTotalDeltaZ = toNumWithBounds(addDeltaZ(totalDeltaZ, deltaZ), {
      min: minTotalDeltaZ,
      max: maxTotalDeltaZ
    });
    if (newTotalDeltaX === totalDeltaX && newTotalDeltaY === totalDeltaY && newTotalDeltaZ === totalDeltaZ) {
      return;
    }
    totalDeltaX = newTotalDeltaX;
    totalDeltaY = newTotalDeltaY;
    totalDeltaZ = newTotalDeltaZ;
    const direction = fragment.direction;
    const intent = fragment.intent;
    const time = ((_eventQueueCopy = eventQueueCopy[lengthOf(eventQueueCopy) - 1]) === null || _eventQueueCopy === void 0 ? void 0 : _eventQueueCopy.timeStamp) - ((_eventQueueCopy$ = eventQueueCopy[0]) === null || _eventQueueCopy$ === void 0 ? void 0 : _eventQueueCopy$.timeStamp) || 0;
    const data = {
      device,
      direction,
      intent,
      deltaX,
      deltaY,
      deltaZ,
      time,
      totalDeltaX,
      totalDeltaY,
      totalDeltaZ
    };
    if (direction !== S_NONE && (!directions || includes(directions, direction)) && (!intents || includes(intents, intent))) {
      callback.invoke(target, data, eventQueueCopy).catch(logError);
    }
  });
  const wrapper = (target, device, event, preventDefault) => {
    eventQueue.push(event);
    const fragment = fragmentGetters[device](eventQueue, {
      angleDiffThreshold,
      deltaThreshold,
      reverseScroll,
      dragHoldTime,
      dragNumFingers
    });
    if (preventDefault) {
      preventDefaultActionFor(event, !!fragment || event.type === S_CLICK && preventNextClick);
    }
    if (fragment === false) {
      return false;
    } else if (fragment === null) {
      clearEventQueue(device, eventQueue);
      return true;
    }
    if (device === S_POINTER) {
      preventNextClick = true;
      setTimer(() => {
        preventNextClick = false;
      }, 10);
    }
    debouncedWrapper(target, fragment, [...eventQueue]);
    return false;
  };
  return {
    _callback: callback,
    _wrapper: wrapper
  };
};
const clearEventQueue = (device, queue) => {
  const keepLastEvent = device === S_POINTER || device === S_TOUCH;
  queue.splice(0, lengthOf(queue) - (keepLastEvent ? 1 : 0));
};
const preventDefaultActionFor = (event, isActualGesture) => {
  const target = event.currentTarget;
  const eventType = event.type;
  const isPointerDown = eventType === S_POINTERDOWN || eventType === S_MOUSEDOWN;
  if (eventType === S_TOUCHMOVE || eventType === S_WHEEL || (eventType === S_CLICK || eventType === S_KEYDOWN) && isActualGesture || isPointerDown && event.buttons === 1) {
    preventDefault(event);
    if (isPointerDown && isHTMLElement(target)) {
      target.focus({
        preventScroll: true
      });
    }
  }
};
const setGestureCssProps = (target, data) => {
  const intent = data.intent;
  if (!isElement(target) || !intent || intent === S_UNKNOWN) {
    return;
  }
  const prefix = `${intent}-`;
  if (intent === S_ZOOM) {
    setNumericStyleProps(target, {
      deltaZ: data.totalDeltaZ
    }, {
      _prefix: prefix,
      _numDecimal: 2
    });
  } else {
    setNumericStyleProps(target, {
      deltaX: data.totalDeltaX,
      deltaY: data.totalDeltaY
    }, {
      _prefix: prefix
    });
  }
};

const isValidDeviceList = device => isValidForType(S_DEVICES, device, ORDERED_DEVICES);
const isValidAspectRatioList = aspectR => isValidForType(S_ASPECTRS_CAMEL, aspectR, ORDERED_ASPECTR);
const getOtherDevices = device => getOtherLayouts(S_DEVICES, device, ORDERED_DEVICES);
const getOtherAspectRatios = aspectR => getOtherLayouts(S_ASPECTRS_CAMEL, aspectR, ORDERED_ASPECTR);
const getLayoutBitmask = options => {
  let layoutBitmask = getBitmaskFromSpec(S_DEVICES, options === null || options === void 0 ? void 0 : options.devices, ORDERED_DEVICES) | getBitmaskFromSpec(S_ASPECTRS_CAMEL, options === null || options === void 0 ? void 0 : options.aspectRatios, ORDERED_ASPECTR);
  if (!layoutBitmask) {
    layoutBitmask = ORDERED_DEVICES.bitmask | ORDERED_ASPECTR.bitmask;
  }
  return layoutBitmask;
};
const ORDERED_DEVICE_NAMES = sortedKeysByVal(settings.deviceBreakpoints);
const ORDERED_ASPECTR_NAMES = sortedKeysByVal(settings.aspectRatioBreakpoints);
const bitSpaces = newBitSpaces();
const ORDERED_DEVICES = createBitSpace(bitSpaces, ...ORDERED_DEVICE_NAMES);
const ORDERED_ASPECTR = createBitSpace(bitSpaces, ...ORDERED_ASPECTR_NAMES);
const NUM_LAYOUTS = lengthOf(ORDERED_DEVICE_NAMES) + lengthOf(ORDERED_ASPECTR_NAMES);
const S_DEVICES = "devices";
const S_ASPECTRS_CAMEL = "aspectRatios";
const LAYOUT_RANGE_REGEX = RegExp("^ *(" + "(?<layoutA>[a-z-]+) +to +(?<layoutB>[a-z-]+)|" + "min +(?<minLayout>[a-z-]+)|" + "max +(?<maxLayout>[a-z-]+)" + ") *$");
const getLayoutsFromBitmask = (keyName, bitmask, bitSpace) => {
  const layouts = [];
  for (let bit = bitSpace.start; bit <= bitSpace.end; bit++) {
    const value = 1 << bit;
    if (bitmask & value) {
      const name = bitSpace.nameOf(value);
      if (name) {
        layouts.push(name);
      }
    }
  }
  return layouts;
};
const getOtherLayouts = (keyName, spec, bitSpace) => {
  const bitmask = getBitmaskFromSpec(keyName, spec, bitSpace);
  if (!bitmask) {
    return [];
  }
  const oppositeBitmask = bitSpace.bitmask & ~bitmask;
  return getLayoutsFromBitmask(keyName, oppositeBitmask, bitSpace);
};
const isValidForType = (keyName, spec, bitSpace) => {
  try {
    const bitmask = getBitmaskFromSpec(keyName, spec, bitSpace);
    return bitmask !== 0;
  } catch (err) {
    if (isInstanceOf(err, LisnUsageError)) {
      return false;
    }
    throw err;
  }
};
const getBitmaskFromSpec = (keyName, spec, bitSpace) => {
  if (isEmpty(spec)) {
    return 0;
  }
  const singleKeyName = keyName.slice(0, -1);
  if (isString(spec)) {
    const rangeMatch = spec.match(LAYOUT_RANGE_REGEX);
    if (rangeMatch) {
      if (!rangeMatch.groups) {
        throw bugError("Layout regex has no named groups");
      }
      const minLayout = rangeMatch.groups.layoutA || rangeMatch.groups.minLayout;
      const maxLayout = rangeMatch.groups.layoutB || rangeMatch.groups.maxLayout;
      if (minLayout !== undefined && !bitSpace.has(minLayout)) {
        throw usageError(`Unknown ${singleKeyName} '${minLayout}'`);
      }
      if (maxLayout !== undefined && !bitSpace.has(maxLayout)) {
        throw usageError(`Unknown ${singleKeyName} '${maxLayout}'`);
      }
      return bitSpace.bitmaskFor(minLayout, maxLayout);
    }
  }
  let bitmask = 0;
  const layouts = validateStrList(keyName, spec, bitSpace.has);
  if (layouts) {
    for (const lt of layouts) {
      bitmask |= bitSpace.bit[lt];
    }
  }
  return bitmask;
};

const isScrollable = (element, options) => {
  const {
    axis,
    active,
    noCache
  } = options || {};
  if (!axis) {
    return isScrollable(element, {
      axis: "y",
      active,
      noCache
    }) || isScrollable(element, {
      axis: "x",
      active,
      noCache
    });
  }
  if (!noCache) {
    var _isScrollableCache$ge;
    const cachedResult = (_isScrollableCache$ge = isScrollableCache.get(element)) === null || _isScrollableCache$ge === void 0 ? void 0 : _isScrollableCache$ge.get(axis);
    if (!isNullish(cachedResult)) {
      return cachedResult;
    }
  }
  const offset = axis === "x" ? "Left" : "Top";
  let result = false;
  let doCache = !noCache;
  if (element[`scroll${offset}`]) {
    result = true;
  } else if (active) {
    elScrollTo(element, {
      [toLowerCase(offset)]: 1
    });
    const canScroll = element[`scroll${offset}`] > 0;
    elScrollTo(element, {
      [toLowerCase(offset)]: 0
    });
    result = canScroll;
  } else {
    const dimension = axis === "x" ? "Width" : "Height";
    result = element[`scroll${dimension}`] > element[`client${dimension}`];
    doCache = false;
  }
  if (doCache) {
    isScrollableCache.sGet(element).set(axis, result);
    setTimer(() => {
      deleteKey(isScrollableCache.get(element), axis);
      isScrollableCache.prune(element);
    }, IS_SCROLLABLE_CACHE_TIMEOUT);
  }
  return result;
};
const getClosestScrollable = (element, options) => {
  let ancestor = element;
  while (ancestor = parentOf(ancestor)) {
    if (isScrollable(ancestor, options)) {
      return ancestor;
    }
  }
  return null;
};
const getCurrentScrollAction = scrollable => {
  scrollable = toScrollableOrDefault(scrollable);
  const action = currentScrollAction.get(scrollable);
  if (action) {
    return copyObject(action);
  }
  return null;
};
const scrollTo = (to, userOptions) => {
  const options = getOptions$1(to, userOptions);
  const scrollable = options._scrollable;
  const currentScroll = currentScrollAction.get(scrollable);
  if (currentScroll) {
    if (!currentScroll.cancel()) {
      return null;
    }
  }
  let isCancelled = false;
  const cancelFn = options._weCanInterrupt ? () => isCancelled = true : () => false;
  const scrollEvents = ["touchmove", "wheel"];
  let preventScrollHandler = null;
  if (options._userCanInterrupt) {
    for (const eventType of scrollEvents) {
      addEventListenerTo(scrollable, eventType, () => {
        isCancelled = true;
      }, {
        once: true
      });
    }
  } else {
    preventScrollHandler = preventDefault;
    for (const eventType of scrollEvents) {
      addEventListenerTo(scrollable, eventType, preventScrollHandler, {
        passive: false
      });
    }
  }
  const promise = initiateScroll(options, () => isCancelled);
  const thisScrollAction = {
    waitFor: () => promise,
    cancel: cancelFn
  };
  const cleanup = () => {
    if (currentScrollAction.get(scrollable) === thisScrollAction) {
      deleteKey(currentScrollAction, scrollable);
    }
    if (preventScrollHandler) {
      for (const eventType of scrollEvents) {
        removeEventListenerFrom(scrollable, eventType, preventScrollHandler, {
          passive: false
        });
      }
    }
  };
  thisScrollAction.waitFor().then(cleanup).catch(cleanup);
  currentScrollAction.set(scrollable, thisScrollAction);
  return thisScrollAction;
};
const isValidScrollDirection = direction => includes(SCROLL_DIRECTIONS, direction);
const mapScrollable = (original, actualScrollable) => mappedScrollables.set(original, actualScrollable);
const unmapScrollable = original => deleteKey(mappedScrollables, original);
const getClientWidthNow = element => isScrollableBodyInQuirks(element) ? element.offsetWidth - getBorderWidth(element, S_LEFT) - getBorderWidth(element, S_RIGHT) : element[S_CLIENT_WIDTH];
const getClientHeightNow = element => isScrollableBodyInQuirks(element) ? element.offsetHeight - getBorderWidth(element, S_TOP) - getBorderWidth(element, S_BOTTOM) : element[S_CLIENT_HEIGHT];
const fetchMainContentElement = async () => {
  await init$5();
  return mainContentElement;
};
const tryGetMainScrollableElement = () => mainScrollableElement !== null && mainScrollableElement !== void 0 ? mainScrollableElement : null;
const fetchMainScrollableElement = async () => {
  await init$5();
  return mainScrollableElement;
};
const getDefaultScrollingElement = () => {
  const body = getBody();
  return isScrollable(body) ? body : getDocScrollingElement() || body;
};
const fetchScrollableElement = async target => toScrollableOrMain(target, fetchMainScrollableElement);
const IS_SCROLLABLE_CACHE_TIMEOUT = 1000;
const isScrollableCache = newXMap(() => newMap());
const mappedScrollables = newMap();
const currentScrollAction = newMap();
const DIFF_THRESHOLD = 5;
const arePositionsDifferent = (start, end) => maxAbs(start.top - end.top, start.left - end.left) >= DIFF_THRESHOLD;
const toScrollableOrMain = (target, getMain) => {
  if (isElement(target)) {
    return mappedScrollables.get(target) || target;
  }
  if (!target || target === getWindow() || target === getDoc()) {
    return getMain();
  }
  throw usageError("Unsupported scroll target");
};
const toScrollableOrDefault = scrollable => scrollable !== null && scrollable !== void 0 ? scrollable : getDefaultScrollingElement();
const getOptions$1 = (to, options) => {
  var _options$weCanInterru, _options$userCanInter;
  const scrollable = toScrollableOrDefault(options === null || options === void 0 ? void 0 : options.scrollable);
  const target = getTargetCoordinates(scrollable, to);
  const altTarget = options !== null && options !== void 0 && options.altTarget ? getTargetCoordinates(scrollable, options === null || options === void 0 ? void 0 : options.altTarget) : null;
  return {
    _target: target,
    _offset: (options === null || options === void 0 ? void 0 : options.offset) || null,
    _altTarget: altTarget,
    _altOffset: (options === null || options === void 0 ? void 0 : options.altOffset) || null,
    _scrollable: scrollable,
    _duration: (options === null || options === void 0 ? void 0 : options.duration) || 0,
    _weCanInterrupt: (_options$weCanInterru = options === null || options === void 0 ? void 0 : options.weCanInterrupt) !== null && _options$weCanInterru !== void 0 ? _options$weCanInterru : false,
    _userCanInterrupt: (_options$userCanInter = options === null || options === void 0 ? void 0 : options.userCanInterrupt) !== null && _options$userCanInter !== void 0 ? _options$userCanInter : false
  };
};
const getTargetCoordinates = (scrollable, target) => {
  const docScrollingElement = getDocScrollingElement();
  if (isElement(target)) {
    if (scrollable === target || !scrollable.contains(target)) {
      throw usageError("Target must be a descendant of the scrollable one");
    }
    return {
      top: () => scrollable[S_SCROLL_TOP] + getBoundingClientRect(target).top - (scrollable === docScrollingElement ? 0 : getBoundingClientRect(scrollable).top),
      left: () => scrollable[S_SCROLL_LEFT] + getBoundingClientRect(target).left - (scrollable === docScrollingElement ? 0 : getBoundingClientRect(scrollable).left)
    };
  }
  if (isString(target)) {
    const targetEl = docQuerySelector(target);
    if (!targetEl) {
      throw usageError(`No match for '${target}'`);
    }
    return getTargetCoordinates(scrollable, targetEl);
  }
  if (!isObject(target) || !("top" in target || "left" in target)) {
    throw usageError("Invalid coordinates");
  }
  return target;
};
const getStartEndPosition = async options => {
  await waitForMeasureTime();
  const applyOffset = (position, offset) => {
    position.top += (offset === null || offset === void 0 ? void 0 : offset.top) || 0;
    position.left += (offset === null || offset === void 0 ? void 0 : offset.left) || 0;
  };
  const scrollable = options._scrollable;
  const start = {
    top: scrollable[S_SCROLL_TOP],
    left: scrollable[S_SCROLL_LEFT]
  };
  let end = getEndPosition(scrollable, start, options._target);
  applyOffset(end, options._offset);
  if (!arePositionsDifferent(start, end) && options._altTarget) {
    end = getEndPosition(scrollable, start, options._altTarget);
    applyOffset(end, options._altOffset);
  }
  return {
    start,
    end
  };
};
const getEndPosition = (scrollable, startPosition, targetCoordinates) => {
  const endPosition = copyObject(startPosition);
  if (!isNullish(targetCoordinates === null || targetCoordinates === void 0 ? void 0 : targetCoordinates.top)) {
    if (isFunction(targetCoordinates.top)) {
      endPosition.top = targetCoordinates.top(scrollable);
    } else {
      endPosition.top = targetCoordinates.top;
    }
  }
  if (!isNullish(targetCoordinates === null || targetCoordinates === void 0 ? void 0 : targetCoordinates.left)) {
    if (isFunction(targetCoordinates.left)) {
      endPosition.left = targetCoordinates.left(scrollable);
    } else {
      endPosition.left = targetCoordinates.left;
    }
  }
  const scrollH = scrollable[S_SCROLL_HEIGHT];
  const scrollW = scrollable[S_SCROLL_WIDTH];
  const clientH = getClientHeightNow(scrollable);
  const clientW = getClientWidthNow(scrollable);
  endPosition.top = min(scrollH - clientH, endPosition.top);
  endPosition.top = max(0, endPosition.top);
  endPosition.left = min(scrollW - clientW, endPosition.left);
  endPosition.left = max(0, endPosition.left);
  return endPosition;
};
const initiateScroll = async (options, isCancelled) => {
  const position = await getStartEndPosition(options);
  const duration = options._duration;
  const scrollable = options._scrollable;
  let startTime, previousTimeStamp;
  let currentPosition = position.start;
  const step = async () => {
    await waitForMutateTime();
    await waitForMeasureTime();
    const timeStamp = timeNow();
    if (isCancelled()) {
      throw currentPosition;
    }
    if (!startTime) {
      if (duration === 0 || !arePositionsDifferent(currentPosition, position.end)) {
        elScrollTo(scrollable, position.end);
        return position.end;
      }
      startTime = timeStamp;
    }
    if (startTime !== timeStamp && previousTimeStamp !== timeStamp) {
      const elapsed = timeStamp - startTime;
      const progress = easeInOutQuad(min(1, elapsed / duration));
      currentPosition = {
        top: position.start.top + (position.end.top - position.start.top) * progress,
        left: position.start.left + (position.end.left - position.start.left) * progress
      };
      elScrollTo(scrollable, currentPosition);
      if (progress === 1) {
        return currentPosition;
      }
    }
    previousTimeStamp = timeStamp;
    return step();
  };
  return step();
};
const isScrollableBodyInQuirks = element => element === getBody() && getDocScrollingElement() === null;
const getBorderWidth = (element, side) => ceil(parseFloat(getComputedStylePropNow(element, `border-${side}`)));
let mainContentElement;
let mainScrollableElement;
let initPromise$1 = null;
const init$5 = () => {
  if (!initPromise$1) {
    initPromise$1 = (async () => {
      const mainScrollableElementSelector = settings.mainScrollableElementSelector;
      const contentElement = await waitForElementOrInteractive(() => {
        return mainScrollableElementSelector ? docQuerySelector(mainScrollableElementSelector) : getBody();
      });
      mainScrollableElement = getDefaultScrollingElement();
      mainContentElement = getBody();
      if (!contentElement) {
        logError(usageError(`No match for '${mainScrollableElementSelector}'. ` + "Scroll tracking/capturing may not work as intended."));
      } else if (!isHTMLElement(contentElement)) {
        logWarn("mainScrollableElementSelector should point to an HTMLElement");
      } else if (contentElement !== mainContentElement) {
        mainScrollableElement = mainContentElement = contentElement;
      }
    })();
  }
  return initPromise$1;
};
if (hasDOM()) {
  waitForInteractive().then(init$5);
}

const createOverlay = async userOptions => {
  const options = await fetchOverlayOptions(userOptions);
  const canReuse = !options._id;
  if (canReuse) {
    var _overlays$get2;
    const existingOverlay = (_overlays$get2 = overlays.get(options._parent)) === null || _overlays$get2 === void 0 ? void 0 : _overlays$get2.get(options._overlayKey);
    if (existingOverlay) {
      if (!parentOf(existingOverlay)) {
        await waitForMutateTime();
      }
      return existingOverlay;
    }
  }
  const overlay = createOnlyOverlay(options);
  if (canReuse) {
    overlays.sGet(options._parent).set(options._overlayKey, overlay);
  } else {
    overlay.id = options._id;
  }
  const isPercentageHOffset = includes((options._style.left || "") + (options._style.right || ""), "%");
  const isPercentageVOffset = includes((options._style.top || "") + (options._style.bottom || ""), "%");
  let needsContentWrapping = false;
  let parentEl = options._parent;
  if (isPercentageHOffset || isPercentageVOffset) {
    needsContentWrapping = isPercentageHOffset && isScrollable(parentEl, {
      axis: "x"
    }) || isPercentageVOffset && isScrollable(parentEl, {
      axis: "y"
    });
  }
  if (needsContentWrapping) {
    if (settings.contentWrappingAllowed) {
      parentEl = await wrapScrollingContent(parentEl);
    } else {
      logWarn("Percentage offset view trigger with scrolling root requires contentWrappingAllowed");
    }
  }
  if (options._style.position === S_ABSOLUTE) {
    addClasses(parentEl, prefixName("overlay-container"));
  }
  await moveElement(overlay, {
    to: parentEl
  });
  return overlay;
};
const overlays = newXWeakMap(() => newMap());
const fetchOverlayOptions = async userOptions => {
  var _userOptions$data2, _userOptions$id2;
  const style = getCssProperties(userOptions === null || userOptions === void 0 ? void 0 : userOptions.style);
  const data = (_userOptions$data2 = userOptions === null || userOptions === void 0 ? void 0 : userOptions.data) !== null && _userOptions$data2 !== void 0 ? _userOptions$data2 : {};
  const parentEl = await fetchParent(userOptions === null || userOptions === void 0 ? void 0 : userOptions.parent, style.position);
  return {
    _parent: parentEl,
    _id: (_userOptions$id2 = userOptions === null || userOptions === void 0 ? void 0 : userOptions.id) !== null && _userOptions$id2 !== void 0 ? _userOptions$id2 : "",
    _style: style,
    _data: data,
    _overlayKey: getOverlayKey(style, data)
  };
};
const getOverlayKey = (style, data) => objToStrKey(style) + "|" + objToStrKey(data);
const getCssProperties = style => {
  const finalCssProperties = merge({
    position: S_ABSOLUTE
  }, style);
  if (finalCssProperties.position === S_ABSOLUTE || finalCssProperties.position === S_FIXED) {
    if (isEmpty(finalCssProperties.top) && isEmpty(finalCssProperties.bottom)) {
      finalCssProperties.top = "0px";
    }
    if (isEmpty(finalCssProperties.left) && isEmpty(finalCssProperties.right)) {
      finalCssProperties.left = "0px";
    }
  }
  return finalCssProperties;
};
const fetchParent = async (userSuppliedParent, position) => userSuppliedParent !== null && userSuppliedParent !== void 0 ? userSuppliedParent : position === S_FIXED ? await waitForElement(getBody) : await fetchMainContentElement();
const createOnlyOverlay = options => {
  const overlay = createElement("div");
  addClassesNow(overlay, prefixName("overlay"));
  const data = options._data;
  for (const attr of keysOf(data)) {
    setDataNow(overlay, camelToKebabCase(attr), data[attr]);
  }
  const style = options._style;
  for (const prop of keysOf(style)) {
    setStylePropNow(overlay, prop, style[prop]);
  }
  return overlay;
};

const getEntryContentBox = entry => {
  const size = entry.contentBoxSize;
  if (size) {
    return getSizeFromInlineBlock(size);
  }
  const rect = entry.contentRect;
  return {
    [S_WIDTH]: rect[S_WIDTH],
    [S_HEIGHT]: rect[S_HEIGHT]
  };
};
const getEntryBorderBox = (entry, fallbackToContent = false) => {
  const size = entry.borderBoxSize;
  if (size) {
    return getSizeFromInlineBlock(size);
  } else if (fallbackToContent) {
    return getEntryContentBox(entry);
  }
  return {
    [S_WIDTH]: NaN,
    [S_HEIGHT]: NaN
  };
};
const isValidBox = box => includes(ALL_BOXES, box);
const isValidDimension = dimension => includes(ALL_DIMENSIONS, dimension);
const tryGetViewportOverlay = () => viewportOverlay !== null && viewportOverlay !== void 0 ? viewportOverlay : null;
const fetchViewportOverlay = async () => {
  await init$4();
  return viewportOverlay;
};
const fetchViewportSize = async (realtime = false) => {
  var _MH$getDocScrollingEl;
  if (!realtime) {
    await waitForMeasureTime();
  }
  const root = hasDOM() ? (_MH$getDocScrollingEl = getDocScrollingElement()) !== null && _MH$getDocScrollingEl !== void 0 ? _MH$getDocScrollingEl : getBody() : null;
  return {
    [S_WIDTH]: (root === null || root === void 0 ? void 0 : root.clientWidth) || 0,
    [S_HEIGHT]: (root === null || root === void 0 ? void 0 : root.clientHeight) || 0
  };
};
const S_INLINE_SIZE = "inlineSize";
const S_BLOCK_SIZE = "blockSize";
const ALL_BOXES = ["content", "border"];
const ALL_DIMENSIONS = [S_WIDTH, S_HEIGHT];
const getSizeFromInlineBlock = size => {
  if (isIterableObject(size)) {
    return {
      [S_WIDTH]: size[0][S_INLINE_SIZE],
      [S_HEIGHT]: size[0][S_BLOCK_SIZE]
    };
  }
  return {
    [S_WIDTH]: size[S_INLINE_SIZE],
    [S_HEIGHT]: size[S_BLOCK_SIZE]
  };
};
let viewportOverlay;
let initPromise = null;
const init$4 = () => {
  if (!initPromise) {
    initPromise = (async () => {
      viewportOverlay = await createOverlay({
        id: prefixName("vp-ovrl"),
        style: {
          position: "fixed",
          [S_WIDTH]: "100vw",
          [S_HEIGHT]: "100vh"
        }
      });
    })();
  }
  return initPromise;
};

class XResizeObserver {
  constructor(callback, debounceWindow) {
    const buffer = newMap();
    const targetsToSkip = newWeakMap();
    let observedTargets = newWeakSet();
    debounceWindow = debounceWindow || 0;
    let timer = null;
    const resizeHandler = entries => {
      for (const entry of entries) {
        const target = targetOf(entry);
        const skipNum = targetsToSkip.get(target);
        if (skipNum !== undefined) {
          if (skipNum === 2) {
            targetsToSkip.set(target, 1);
          } else {
            if (skipNum !== 1) {
              logError(bugError(`# targetsToSkip is ${skipNum}`));
            }
            deleteKey(targetsToSkip, target);
          }
          continue;
        }
        buffer.set(target, entry);
      }
      if (!timer && sizeOf(buffer)) {
        timer = setTimer(() => {
          if (sizeOf(buffer)) {
            callback(arrayFrom(buffer.values()), this);
            buffer.clear();
          }
          timer = null;
        }, debounceWindow);
      }
    };
    const borderObserver = newResizeObserver(resizeHandler);
    const contentObserver = newResizeObserver(resizeHandler);
    if (!borderObserver || !contentObserver) {
      logWarn("This browser does not support ResizeObserver. Some features won't work.");
    }
    const observeTarget = target => {
      observedTargets.add(target);
      borderObserver === null || borderObserver === void 0 || borderObserver.observe(target, {
        box: "border-box"
      });
      contentObserver === null || contentObserver === void 0 || contentObserver.observe(target);
    };
    this.observe = (...targets) => {
      for (const target of targets) {
        observeTarget(target);
      }
    };
    this.observeLater = (...targets) => {
      for (const target of targets) {
        if (observedTargets.has(target)) {
          continue;
        }
        targetsToSkip.set(target, 2);
        observeTarget(target);
      }
    };
    this.unobserve = (...targets) => {
      for (const target of targets) {
        deleteKey(observedTargets, target);
        borderObserver === null || borderObserver === void 0 || borderObserver.unobserve(target);
        contentObserver === null || contentObserver === void 0 || contentObserver.unobserve(target);
      }
    };
    this.disconnect = () => {
      observedTargets = newWeakSet();
      borderObserver === null || borderObserver === void 0 || borderObserver.disconnect();
      contentObserver === null || contentObserver === void 0 || contentObserver.disconnect();
    };
  }
}

class SizeWatcher {
  static create(config = {}) {
    return new SizeWatcher(getConfig$4(config), CONSTRUCTOR_KEY$4);
  }
  static reuse(config = {}) {
    const myConfig = getConfig$4(config);
    const configStrKey = objToStrKey(myConfig);
    let instance = instances$6.get(configStrKey);
    if (!instance) {
      instance = new SizeWatcher(myConfig, CONSTRUCTOR_KEY$4);
      instances$6.set(configStrKey, instance);
    }
    return instance;
  }
  constructor(config, key) {
    if (key !== CONSTRUCTOR_KEY$4) {
      throw illegalConstructorError("SizeWatcher.create");
    }
    const allSizeData = newWeakMap();
    const allCallbacks = newXWeakMap(() => newMap());
    const resizeHandler = entries => {
      for (const entry of entries) {
        processEntry(entry);
      }
    };
    const xObserver = new XResizeObserver(resizeHandler);
    const fetchCurrentSize = async target => {
      const element = await fetchElement$1(target);
      const sizeData = allSizeData.get(element);
      if (sizeData) {
        return copyObject(sizeData);
      }
      return newPromise(resolve => {
        const observer = newResizeObserver(entries => {
          const sizeData = getSizeData(entries[0]);
          observer === null || observer === void 0 || observer.disconnect();
          resolve(sizeData);
        });
        if (observer) {
          observer.observe(element);
        } else {
          resolve({
            border: {
              [S_WIDTH]: 0,
              [S_HEIGHT]: 0
            },
            content: {
              [S_WIDTH]: 0,
              [S_HEIGHT]: 0
            }
          });
        }
      });
    };
    const fetchOptions = async options => {
      var _options$box, _options$dimension, _options$MC$S_DEBOUNC;
      const box = (_options$box = options.box) !== null && _options$box !== void 0 ? _options$box : null;
      if (box && !isValidBox(box)) {
        throw usageError(`Unknown box type: '${box}'`);
      }
      const dimension = (_options$dimension = options.dimension) !== null && _options$dimension !== void 0 ? _options$dimension : null;
      if (dimension && !isValidDimension(dimension)) {
        throw usageError(`Unknown dimension: '${dimension}'`);
      }
      return {
        _element: await fetchElement$1(targetOf(options)),
        _box: box,
        _dimension: dimension,
        _threshold: toNonNegNum(options.threshold, config._resizeThreshold) || 1,
        _debounceWindow: (_options$MC$S_DEBOUNC = options[S_DEBOUNCE_WINDOW]) !== null && _options$MC$S_DEBOUNC !== void 0 ? _options$MC$S_DEBOUNC : config._debounceWindow
      };
    };
    const createCallback = (handler, options) => {
      var _allCallbacks$get;
      const element = options._element;
      remove((_allCallbacks$get = allCallbacks.get(element)) === null || _allCallbacks$get === void 0 || (_allCallbacks$get = _allCallbacks$get.get(handler)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get._callback);
      const callback = wrapCallback(handler, options._debounceWindow);
      callback.onRemove(() => {
        deleteHandler(handler, options);
      });
      const entry = {
        _callback: callback,
        _options: options
      };
      allCallbacks.sGet(element).set(handler, entry);
      return entry;
    };
    const setupOnResize = async (handler, userOptions) => {
      const options = await fetchOptions(userOptions || {});
      const element = options._element;
      const entry = createCallback(handler, options);
      const callback = entry._callback;
      const sizeData = await fetchCurrentSize(element);
      if (callback.isRemoved()) {
        return;
      }
      entry._data = sizeData;
      allSizeData.set(element, sizeData);
      xObserver.observeLater(element);
      if (!(userOptions !== null && userOptions !== void 0 && userOptions.skipInitial)) {
        await invokeCallback$4(wrapCallback(handler), element, sizeData);
      }
    };
    const removeOnResize = async (handler, target) => {
      var _allCallbacks$get2;
      const options = await fetchOptions({
        target
      });
      const element = options._element;
      const currEntry = (_allCallbacks$get2 = allCallbacks.get(element)) === null || _allCallbacks$get2 === void 0 ? void 0 : _allCallbacks$get2.get(handler);
      if (currEntry) {
        remove(currEntry._callback);
        if (handler === setSizeCssProps) {
          setSizeCssProps(element, null);
        }
      }
    };
    const deleteHandler = (handler, options) => {
      const element = options._element;
      deleteKey(allCallbacks.get(element), handler);
      allCallbacks.prune(element);
      if (!allCallbacks.has(element)) {
        xObserver.unobserve(element);
        deleteKey(allSizeData, element);
      }
    };
    const processEntry = entry => {
      const element = targetOf(entry);
      const latestData = getSizeData(entry);
      allSizeData.set(element, latestData);
      for (const entry of ((_allCallbacks$get3 = allCallbacks.get(element)) === null || _allCallbacks$get3 === void 0 ? void 0 : _allCallbacks$get3.values()) || []) {
        var _allCallbacks$get3;
        const thresholdsExceeded = hasExceededThreshold$1(entry._options, latestData, entry._data);
        if (!thresholdsExceeded) {
          continue;
        }
        entry._data = latestData;
        invokeCallback$4(entry._callback, element, latestData);
      }
    };
    this.fetchCurrentSize = fetchCurrentSize;
    this.trackSize = async (handler, options) => {
      if (!handler) {
        handler = setSizeCssProps;
      }
      return setupOnResize(handler, options);
    };
    this.noTrackSize = (handler, target) => {
      if (!handler) {
        handler = setSizeCssProps;
      }
      removeOnResize(handler, target);
    };
    this.onResize = setupOnResize;
    this.offResize = (handler, target) => {
      removeOnResize(handler, target);
    };
  }
}
const CONSTRUCTOR_KEY$4 = SYMBOL();
const instances$6 = newMap();
const getConfig$4 = config => {
  return {
    _debounceWindow: toNonNegNum(config[S_DEBOUNCE_WINDOW], 75),
    _resizeThreshold: toNonNegNum(config.resizeThreshold, 50) || 1
  };
};
const hasExceededThreshold$1 = (options, latestData, lastThresholdData) => {
  if (!lastThresholdData) {
    return false;
  }
  let box, dim;
  for (box in latestData) {
    if (options._box && options._box !== box) {
      continue;
    }
    for (dim in latestData[box]) {
      if (options._dimension && options._dimension !== dim) {
        continue;
      }
      const diff = abs(latestData[box][dim] - lastThresholdData[box][dim]);
      if (diff >= options._threshold) {
        return true;
      }
    }
  }
  return false;
};
const getSizeData = entry => {
  const borderBox = getEntryBorderBox(entry, true);
  const contentBox = getEntryContentBox(entry);
  return {
    border: borderBox,
    content: contentBox
  };
};
const setSizeCssProps = (element, sizeData) => {
  let prefix = "";
  if (element === tryGetViewportOverlay()) {
    element = getDocElement();
    prefix = "window-";
  }
  const props = {
    borderWidth: sizeData === null || sizeData === void 0 ? void 0 : sizeData.border[S_WIDTH],
    borderHeight: sizeData === null || sizeData === void 0 ? void 0 : sizeData.border[S_HEIGHT],
    contentWidth: sizeData === null || sizeData === void 0 ? void 0 : sizeData.content[S_WIDTH],
    contentHeight: sizeData === null || sizeData === void 0 ? void 0 : sizeData.content[S_HEIGHT]
  };
  setNumericStyleProps(element, props, {
    _prefix: prefix
  });
};
const fetchElement$1 = async target => {
  if (isElement(target)) {
    return target;
  }
  if (!target || target === getWindow()) {
    return fetchViewportOverlay();
  }
  if (target === getDoc()) {
    return getDocElement();
  }
  throw usageError("Unsupported resize target");
};
const invokeCallback$4 = (callback, element, sizeData) => callback.invoke(element, copyObject(sizeData)).catch(logError);

class LayoutWatcher {
  static create(config = {}) {
    return new LayoutWatcher(getConfig$3(config), CONSTRUCTOR_KEY$3);
  }
  static reuse(config = {}) {
    var _instances$get;
    const myConfig = getConfig$3(config);
    const configStrKey = objToStrKey(omitKeys(myConfig, {
      _root: null
    }));
    let instance = (_instances$get = instances$5.get(myConfig._root)) === null || _instances$get === void 0 ? void 0 : _instances$get.get(configStrKey);
    if (!instance) {
      instance = new LayoutWatcher(myConfig, CONSTRUCTOR_KEY$3);
      instances$5.sGet(myConfig._root).set(configStrKey, instance);
    }
    return instance;
  }
  constructor(config, key) {
    if (key !== CONSTRUCTOR_KEY$3) {
      throw illegalConstructorError("LayoutWatcher.create");
    }
    let nonIntersectingBitmask = 0;
    let currentLayoutData = {
      device: null,
      aspectRatio: null
    };
    const allCallbacks = newMap();
    const fetchCurrentLayout = async () => {
      await readyPromise;
      return copyObject(currentLayoutData);
    };
    const setupOverlays = async () => {
      const {
        root,
        overlays
      } = await createOverlays(config._root, config._deviceBreakpoints, config._aspectRatioBreakpoints);
      return newPromise(resolve => {
        let isReady = false;
        const intersectionHandler = entries => {
          const numEntries = lengthOf(entries);
          if (!isReady) {
            if (numEntries < NUM_LAYOUTS) {
              logWarn(bugError(`Got IntersectionObserver ${numEntries}, ` + `expected >= ${NUM_LAYOUTS}`));
            }
          }
          for (const entry of entries) {
            nonIntersectingBitmask = getNonIntersecting(nonIntersectingBitmask, entry);
          }
          processLayoutChange(!isReady);
          isReady = true;
          resolve();
        };
        const observeOptions = {
          root,
          rootMargin: "5px 0% 5px -100%"
        };
        const observer = newIntersectionObserver(intersectionHandler, observeOptions);
        for (const triggerOverlay of overlays) {
          observer.observe(triggerOverlay);
        }
      });
    };
    const createCallback = (handler, layoutBitmask) => {
      var _allCallbacks$get;
      remove((_allCallbacks$get = allCallbacks.get(handler)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get._callback);
      const callback = wrapCallback(handler);
      callback.onRemove(() => {
        deleteHandler(handler);
      });
      allCallbacks.set(handler, {
        _callback: callback,
        _layoutBitmask: layoutBitmask
      });
      return callback;
    };
    const setupOnLayout = async (handler, options) => {
      const layoutBitmask = getLayoutBitmask(options);
      const callback = createCallback(handler, layoutBitmask);
      if (options !== null && options !== void 0 && options.skipInitial) {
        return;
      }
      const layoutData = await fetchCurrentLayout();
      if (!callback.isRemoved() && changeMatches(layoutBitmask, layoutData, null)) {
        await invokeCallback$3(callback, layoutData);
      }
    };
    const deleteHandler = handler => {
      deleteKey(allCallbacks, handler);
    };
    const processLayoutChange = skipCallbacks => {
      const deviceBit = floor(log2(nonIntersectingBitmask & ORDERED_DEVICES.bitmask));
      const aspectRatioBit = floor(log2(nonIntersectingBitmask & ORDERED_ASPECTR.bitmask));
      const layoutData = {
        device: null,
        aspectRatio: null
      };
      if (deviceBit !== -INFINITY) {
        layoutData.device = ORDERED_DEVICES.nameOf(1 << deviceBit);
      }
      if (aspectRatioBit !== -INFINITY) {
        layoutData.aspectRatio = ORDERED_ASPECTR.nameOf(1 << aspectRatioBit);
      }
      if (!skipCallbacks) {
        for (const entry of allCallbacks.values()) {
          const layoutBitmask = entry._layoutBitmask;
          if (!changeMatches(layoutBitmask, layoutData, currentLayoutData)) {
            continue;
          }
          invokeCallback$3(entry._callback, layoutData);
        }
      }
      currentLayoutData = layoutData;
    };
    const readyPromise = setupOverlays();
    this.fetchCurrentLayout = fetchCurrentLayout;
    this.onLayout = setupOnLayout;
    this.offLayout = handler => {
      var _allCallbacks$get2;
      remove((_allCallbacks$get2 = allCallbacks.get(handler)) === null || _allCallbacks$get2 === void 0 ? void 0 : _allCallbacks$get2._callback);
    };
  }
}
const CONSTRUCTOR_KEY$3 = SYMBOL();
const instances$5 = newXMap(() => newMap());
const VAR_BORDER_HEIGHT = prefixCssJsVar("border-height");
const PREFIX_DEVICE = prefixName("device");
const PREFIX_ASPECTR = prefixName("aspect-ratio");
const getConfig$3 = config => {
  const deviceBreakpoints = copyObject(settings.deviceBreakpoints);
  if (config !== null && config !== void 0 && config.deviceBreakpoints) {
    copyExistingKeys(config.deviceBreakpoints, deviceBreakpoints);
  }
  const aspectRatioBreakpoints = copyObject(settings.aspectRatioBreakpoints);
  if (config !== null && config !== void 0 && config.aspectRatioBreakpoints) {
    copyExistingKeys(config.aspectRatioBreakpoints, aspectRatioBreakpoints);
  }
  return {
    _root: (config === null || config === void 0 ? void 0 : config.root) || null,
    _deviceBreakpoints: deviceBreakpoints,
    _aspectRatioBreakpoints: aspectRatioBreakpoints
  };
};
const createOverlays = async (root, deviceBreakpoints, aspectRatioBreakpoints) => {
  const overlayPromises = [];
  let overlayParent;
  if (root) {
    overlayParent = root;
  } else {
    overlayParent = await createOverlay({
      style: {
        position: "fixed",
        [S_WIDTH]: "100vw"
      }
    });
  }
  let device;
  for (device in deviceBreakpoints) {
    overlayPromises.push(createOverlay({
      parent: overlayParent,
      style: {
        position: "absolute",
        [S_WIDTH]: deviceBreakpoints[device] + "px"
      },
      data: {
        [PREFIX_DEVICE]: device
      }
    }));
  }
  const parentHeightCss = root ? `var(${VAR_BORDER_HEIGHT}, 0) * 1px` : "100vh";
  if (root) {
    SizeWatcher.reuse().trackSize(null, {
      target: root
    });
  }
  let aspectRatio;
  for (aspectRatio in aspectRatioBreakpoints) {
    overlayPromises.push(createOverlay({
      parent: overlayParent,
      style: {
        position: "absolute",
        [S_WIDTH]: `calc(${aspectRatioBreakpoints[aspectRatio]} ` + `* ${parentHeightCss})`
      },
      data: {
        [PREFIX_ASPECTR]: aspectRatio
      }
    }));
  }
  const overlays = await promiseAll(overlayPromises);
  return {
    root: overlayParent,
    overlays
  };
};
const getOverlayLayout = overlay => {
  const layout = getData(overlay, PREFIX_DEVICE) || getData(overlay, PREFIX_ASPECTR);
  if (layout && (ORDERED_DEVICES.has(layout) || ORDERED_ASPECTR.has(layout))) {
    return layout;
  } else {
    logError(bugError("No device or aspectRatio data attribute"));
    return null;
  }
};
const changeMatches = (layoutBitmask, thisLayoutData, prevLayoutData) => {
  if ((prevLayoutData === null || prevLayoutData === void 0 ? void 0 : prevLayoutData.device) !== thisLayoutData.device && (!thisLayoutData.device || ORDERED_DEVICES.bit[thisLayoutData.device] & layoutBitmask)) {
    return true;
  }
  if ((prevLayoutData === null || prevLayoutData === void 0 ? void 0 : prevLayoutData.aspectRatio) !== thisLayoutData.aspectRatio && (!thisLayoutData.aspectRatio || ORDERED_ASPECTR.bit[thisLayoutData.aspectRatio] & layoutBitmask)) {
    return true;
  }
  return false;
};
const getNonIntersecting = (nonIntersectingBitmask, entry) => {
  const target = targetOf(entry);
  if (!isHTMLElement(target)) {
    logError(bugError(`IntersectionObserver called us with '${typeOrClassOf(target)}'`));
    return nonIntersectingBitmask;
  }
  const layout = getOverlayLayout(target);
  let bit = 0;
  if (!layout) ; else if (ORDERED_DEVICES.has(layout)) {
    bit = ORDERED_DEVICES.bit[layout];
  } else if (ORDERED_ASPECTR.has(layout)) {
    bit = ORDERED_ASPECTR.bit[layout];
  } else {
    logError(bugError(`Unknown device or aspectRatio data attribute: ${layout}`));
  }
  if (entry.isIntersecting) {
    nonIntersectingBitmask &= ~bit;
  } else {
    nonIntersectingBitmask |= bit;
  }
  return nonIntersectingBitmask;
};
const invokeCallback$3 = (callback, layoutData) => callback.invoke(copyObject(layoutData)).catch(logError);

const isValidPointerAction = action => includes(POINTER_ACTIONS, action);
const POINTER_ACTIONS = [S_CLICK, S_HOVER, S_PRESS];

class PointerWatcher {
  static create(config = {}) {
    return new PointerWatcher(getConfig$2(config), CONSTRUCTOR_KEY$2);
  }
  static reuse(config = {}) {
    const myConfig = getConfig$2(config);
    const configStrKey = objToStrKey(myConfig);
    let instance = instances$4.get(configStrKey);
    if (!instance) {
      instance = new PointerWatcher(myConfig, CONSTRUCTOR_KEY$2);
      instances$4.set(configStrKey, instance);
    }
    return instance;
  }
  constructor(config, key) {
    if (key !== CONSTRUCTOR_KEY$2) {
      throw illegalConstructorError("PointerWatcher.create");
    }
    const allCallbacks = newXWeakMap(() => newMap());
    const createCallback = (target, handler) => {
      var _allCallbacks$get;
      remove((_allCallbacks$get = allCallbacks.get(target)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get.get(handler));
      const callback = wrapCallback(handler);
      callback.onRemove(() => {
        deleteKey(allCallbacks.get(target), handler);
      });
      allCallbacks.sGet(target).set(handler, callback);
      return callback;
    };
    const setupOnPointer = async (target, startHandler, endHandler, userOptions) => {
      const options = getOptions(config, userOptions);
      const startCallback = createCallback(target, startHandler);
      const endCallback = endHandler && endHandler !== startHandler ? createCallback(target, endHandler) : startCallback;
      for (const action of options._actions) {
        listenerSetupFn[action](target, startCallback, endCallback, options);
      }
    };
    this.onPointer = setupOnPointer;
    this.offPointer = (target, startHandler, endHandler) => {
      const entry = allCallbacks.get(target);
      remove(entry === null || entry === void 0 ? void 0 : entry.get(startHandler));
      if (endHandler) {
        remove(entry === null || entry === void 0 ? void 0 : entry.get(endHandler));
      }
    };
  }
}
const CONSTRUCTOR_KEY$2 = SYMBOL();
const instances$4 = newMap();
const getConfig$2 = config => {
  var _config$preventDefaul, _config$preventSelect;
  return {
    _preventDefault: (_config$preventDefaul = config === null || config === void 0 ? void 0 : config.preventDefault) !== null && _config$preventDefaul !== void 0 ? _config$preventDefaul : false,
    _preventSelect: (_config$preventSelect = config === null || config === void 0 ? void 0 : config.preventSelect) !== null && _config$preventSelect !== void 0 ? _config$preventSelect : true
  };
};
const getOptions = (config, options) => {
  var _options$preventDefau, _options$preventSelec;
  return {
    _actions: validateStrList("actions", options === null || options === void 0 ? void 0 : options.actions, isValidPointerAction) || POINTER_ACTIONS,
    _preventDefault: (_options$preventDefau = options === null || options === void 0 ? void 0 : options.preventDefault) !== null && _options$preventDefau !== void 0 ? _options$preventDefau : config._preventDefault,
    _preventSelect: (_options$preventSelec = options === null || options === void 0 ? void 0 : options.preventSelect) !== null && _options$preventSelec !== void 0 ? _options$preventSelec : config._preventSelect
  };
};
const setupClickListener = (target, startCallback, endCallback, options) => {
  let toggleState = false;
  const wrapper = event => {
    if (options._preventDefault) {
      preventDefault(event);
    }
    toggleState = !toggleState;
    const data = {
      action: S_CLICK,
      state: toggleState ? "ON" : "OFF"
    };
    invokeCallback$2(toggleState ? startCallback : endCallback, target, data, event);
  };
  addEventListenerTo(target, S_CLICK, wrapper);
  const remove = () => removeEventListenerFrom(target, S_CLICK, wrapper);
  startCallback.onRemove(remove);
  endCallback.onRemove(remove);
};
const setupPointerListeners = (action, target, startCallback, endCallback, options) => {
  const startEventSuff = action === S_HOVER ? "enter" : "down";
  const endEventSuff = action === S_HOVER ? "leave" : "up";
  const startEvent = S_POINTER + startEventSuff;
  const endEvent = S_POINTER + endEventSuff;
  const wrapper = (event, callback) => {
    if (options._preventDefault) {
      preventDefault(event);
    }
    const data = {
      action,
      state: strReplace(event.type, /pointer|mouse/, "") === startEventSuff ? "ON" : "OFF"
    };
    invokeCallback$2(callback, target, data, event);
  };
  const startListener = event => wrapper(event, startCallback);
  const endListener = event => wrapper(event, endCallback);
  addEventListenerTo(target, startEvent, startListener);
  addEventListenerTo(target, endEvent, endListener);
  if (options._preventSelect) {
    preventSelect(target);
  }
  startCallback.onRemove(() => {
    undoPreventSelect(target);
    removeEventListenerFrom(target, startEvent, startListener);
  });
  endCallback.onRemove(() => {
    undoPreventSelect(target);
    removeEventListenerFrom(target, endEvent, endListener);
  });
};
const listenerSetupFn = {
  click: setupClickListener,
  hover: (...args) => setupPointerListeners(S_HOVER, ...args),
  press: (...args) => setupPointerListeners(S_PRESS, ...args)
};
const invokeCallback$2 = (callback, target, actionData, event) => callback.invoke(target, copyObject(actionData), event).catch(logError);

class ScrollWatcher {
  static fetchMainContentElement() {
    return fetchMainContentElement();
  }
  static fetchMainScrollableElement() {
    return fetchMainScrollableElement();
  }
  static create(config = {}) {
    return new ScrollWatcher(getConfig$1(config), CONSTRUCTOR_KEY$1);
  }
  static reuse(config = {}) {
    const myConfig = getConfig$1(config);
    const configStrKey = objToStrKey(myConfig);
    let instance = instances$3.get(configStrKey);
    if (!instance) {
      instance = new ScrollWatcher(myConfig, CONSTRUCTOR_KEY$1);
      instances$3.set(configStrKey, instance);
    }
    return instance;
  }
  constructor(config, key) {
    if (key !== CONSTRUCTOR_KEY$1) {
      throw illegalConstructorError("ScrollWatcher.create");
    }
    const allScrollData = newWeakMap();
    const activeListeners = newWeakMap();
    const allCallbacks = newXWeakMap(() => newMap());
    const fetchCurrentScroll = async (element, realtime = false, isScrollEvent = false) => {
      const previousEventData = allScrollData.get(element);
      const latestData = await fetchScrollData(element, previousEventData, realtime);
      if (!isScrollEvent && previousEventData) {
        latestData.direction = previousEventData.direction;
      }
      return latestData;
    };
    const createCallback = (handler, options, trackType) => {
      var _allCallbacks$get;
      const element = options._element;
      remove((_allCallbacks$get = allCallbacks.get(element)) === null || _allCallbacks$get === void 0 || (_allCallbacks$get = _allCallbacks$get.get(handler)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get._callback);
      const callback = wrapCallback(handler, options._debounceWindow);
      callback.onRemove(() => {
        deleteHandler(handler, options);
      });
      const entry = {
        _callback: callback,
        _trackType: trackType,
        _options: options
      };
      allCallbacks.sGet(element).set(handler, entry);
      return entry;
    };
    const setupOnScroll = async (handler, userOptions, trackType) => {
      const options = await fetchOnScrollOptions(config, userOptions || {});
      const element = options._element;
      const entry = createCallback(handler, options, trackType);
      const callback = entry._callback;
      const eventTarget = options._eventTarget;
      const scrollData = await fetchCurrentScroll(element, options._debounceWindow === 0);
      if (callback.isRemoved()) {
        return;
      }
      entry._data = scrollData;
      allScrollData.set(element, scrollData);
      if (trackType === TRACK_FULL$1) {
        await setupSizeTrack(entry);
      }
      let listenerOptions = activeListeners.get(eventTarget);
      if (!listenerOptions) {
        listenerOptions = {
          _nRealtime: 0
        };
        activeListeners.set(eventTarget, listenerOptions);
        addEventListenerTo(eventTarget, S_SCROLL, scrollHandler);
      }
      if (options._debounceWindow === 0) {
        listenerOptions._nRealtime++;
      }
      const directions = options._directions;
      if (!callback.isRemoved() && !(userOptions !== null && userOptions !== void 0 && userOptions.skipInitial) && directionMatches(directions, scrollData.direction)) {
        await invokeCallback$1(wrapCallback(handler), element, scrollData);
      }
    };
    const removeOnScroll = async (handler, scrollable, trackType) => {
      var _allCallbacks$get2;
      const options = await fetchOnScrollOptions(config, {
        scrollable
      });
      const element = options._element;
      const currEntry = (_allCallbacks$get2 = allCallbacks.get(element)) === null || _allCallbacks$get2 === void 0 ? void 0 : _allCallbacks$get2.get(handler);
      if ((currEntry === null || currEntry === void 0 ? void 0 : currEntry._trackType) === trackType) {
        remove(currEntry._callback);
        if (handler === setScrollCssProps) {
          setScrollCssProps(element, null);
        }
      }
    };
    const deleteHandler = (handler, options) => {
      const element = options._element;
      const eventTarget = options._eventTarget;
      deleteKey(allCallbacks.get(element), handler);
      allCallbacks.prune(element);
      const listenerOptions = activeListeners.get(eventTarget);
      if (listenerOptions && options._debounceWindow === 0) {
        listenerOptions._nRealtime--;
      }
      if (!allCallbacks.has(element)) {
        deleteKey(allScrollData, element);
        removeEventListenerFrom(eventTarget, S_SCROLL, scrollHandler);
        deleteKey(activeListeners, eventTarget);
      }
    };
    const setupSizeTrack = async entry => {
      const options = entry._options;
      const element = options._element;
      const scrollCallback = entry._callback;
      const doc = getDoc();
      const docScrollingElement = getDocScrollingElement();
      const resizeCallback = wrapCallback(async () => {
        const latestData = await fetchCurrentScroll(element);
        const thresholdsExceeded = hasExceededThreshold(options, latestData, entry._data);
        if (!thresholdsExceeded) ; else if (!scrollCallback.isRemoved()) {
          await invokeCallback$1(scrollCallback, element, latestData);
        }
      });
      scrollCallback.onRemove(resizeCallback.remove);
      const sizeWatcher = SizeWatcher.reuse();
      const setupOnResize = target => sizeWatcher.onResize(resizeCallback, {
        target,
        [S_DEBOUNCE_WINDOW]: options._debounceWindow,
        threshold: options._threshold
      });
      if (element === docScrollingElement) {
        setupOnResize();
        setupOnResize(doc);
        return;
      }
      const observedElements = newSet([element]);
      setupOnResize(element);
      const allowedToWrap = settings.contentWrappingAllowed === true && element !== docScrollingElement && getData(element, PREFIX_NO_WRAP) === null;
      let wrapper;
      if (allowedToWrap) {
        wrapper = await wrapScrollingContent(element);
        setupOnResize(wrapper);
        observedElements.add(wrapper);
      } else {
        for (const child of childrenOf(element)) {
          setupOnResize(child);
          observedElements.add(child);
        }
      }
      const domWatcher = DOMWatcher.create({
        root: element,
        subtree: false
      });
      const onAddedCallback = wrapCallback(operation => {
        const child = currentTargetOf(operation);
        if (child !== wrapper) {
          if (allowedToWrap) {
            moveElement(child, {
              to: wrapper,
              ignoreMove: true
            });
          } else {
            setupOnResize(child);
            observedElements.add(child);
          }
        }
      });
      domWatcher.onMutation(onAddedCallback, {
        categories: [S_ADDED]
      });
      resizeCallback.onRemove(onAddedCallback.remove);
    };
    const scrollHandler = async event => {
      var _activeListeners$get;
      const scrollable = targetOf(event);
      if (!scrollable || !(isElement(scrollable) || isDoc(scrollable))) {
        return;
      }
      const element = await fetchScrollableElement(scrollable);
      const realtime = (((_activeListeners$get = activeListeners.get(scrollable)) === null || _activeListeners$get === void 0 ? void 0 : _activeListeners$get._nRealtime) || 0) > 0;
      const latestData = await fetchCurrentScroll(element, realtime, true);
      allScrollData.set(element, latestData);
      for (const entry of ((_allCallbacks$get3 = allCallbacks.get(element)) === null || _allCallbacks$get3 === void 0 ? void 0 : _allCallbacks$get3.values()) || []) {
        var _allCallbacks$get3;
        const options = entry._options;
        const thresholdsExceeded = hasExceededThreshold(options, latestData, entry._data);
        if (!thresholdsExceeded) {
          continue;
        }
        entry._data = latestData;
        if (!directionMatches(options._directions, latestData.direction)) {
          continue;
        }
        invokeCallback$1(entry._callback, element, latestData);
      }
    };
    this.fetchCurrentScroll = (scrollable, realtime) => fetchScrollableElement(scrollable).then(element => fetchCurrentScroll(element, realtime));
    this.scroll = (direction, options = {}) => {
      var _options$amount;
      if (!isValidScrollDirection(direction)) {
        throw usageError(`Unknown scroll direction: '${direction}'`);
      }
      const isVertical = direction === S_UP || direction === S_DOWN;
      const sign = direction === S_UP || direction === S_LEFT ? -1 : 1;
      let targetCoordinate;
      const amount = (_options$amount = options.amount) !== null && _options$amount !== void 0 ? _options$amount : 100;
      const asFractionOf = options.asFractionOf;
      if (asFractionOf === "visible") {
        targetCoordinate = isVertical ? el => el[S_SCROLL_TOP] + sign * amount * getClientHeightNow(el) / 100 : el => el[S_SCROLL_LEFT] + sign * amount * getClientWidthNow(el) / 100;
      } else if (asFractionOf === "content") {
        targetCoordinate = isVertical ? el => el[S_SCROLL_TOP] + sign * amount * el[S_SCROLL_HEIGHT] / 100 : el => el[S_SCROLL_LEFT] + sign * amount * el[S_SCROLL_WIDTH] / 100;
      } else if (asFractionOf !== undefined && asFractionOf !== "pixel") {
        throw usageError(`Unknown 'asFractionOf' keyword: '${asFractionOf}'`);
      } else {
        targetCoordinate = isVertical ? el => el[S_SCROLL_TOP] + sign * amount : el => el[S_SCROLL_LEFT] + sign * amount;
      }
      const target = isVertical ? {
        top: targetCoordinate
      } : {
        left: targetCoordinate
      };
      return this.scrollTo(target, options);
    };
    this.scrollTo = async (to, options = {}) => scrollTo(to, merge({
      duration: config._scrollDuration
    }, options, {
      scrollable: await fetchScrollableElement(options.scrollable)
    }));
    this.fetchCurrentScrollAction = scrollable => fetchScrollableElement(scrollable).then(element => getCurrentScrollAction(element));
    this.stopUserScrolling = async (options = {}) => {
      const element = await fetchScrollableElement(options.scrollable);
      const stopScroll = () => elScrollTo(element, {
        top: element[S_SCROLL_TOP],
        left: element[S_SCROLL_LEFT]
      });
      if (options.immediate) {
        stopScroll();
      } else {
        waitForMeasureTime().then(stopScroll);
      }
    };
    this.trackScroll = (handler, options) => {
      if (!handler) {
        handler = setScrollCssProps;
      }
      return setupOnScroll(handler, options, TRACK_FULL$1);
    };
    this.noTrackScroll = (handler, scrollable) => {
      if (!handler) {
        handler = setScrollCssProps;
      }
      removeOnScroll(handler, scrollable, TRACK_FULL$1);
    };
    this.onScroll = (handler, options) => setupOnScroll(handler, options, TRACK_REGULAR$1);
    this.offScroll = (handler, scrollable) => {
      removeOnScroll(handler, scrollable, TRACK_REGULAR$1);
    };
  }
}
const CONSTRUCTOR_KEY$1 = SYMBOL();
const instances$3 = newMap();
const getConfig$1 = config => {
  return {
    _debounceWindow: toNonNegNum(config[S_DEBOUNCE_WINDOW], 75),
    _scrollThreshold: toNonNegNum(config.scrollThreshold, 50) || 1,
    _scrollDuration: toNonNegNum(config.scrollDuration, 1000)
  };
};
const TRACK_REGULAR$1 = 1;
const TRACK_FULL$1 = 2;
const fetchOnScrollOptions = async (config, options) => {
  var _options$MC$S_DEBOUNC;
  const directions = validateStrList("directions", options.directions, isValidScrollDirection) || null;
  const element = await fetchScrollableElement(options.scrollable);
  return {
    _element: element,
    _eventTarget: getEventTarget(element),
    _directions: directions,
    _threshold: toNonNegNum(options.threshold, config._scrollThreshold) || 1,
    _debounceWindow: (_options$MC$S_DEBOUNC = options[S_DEBOUNCE_WINDOW]) !== null && _options$MC$S_DEBOUNC !== void 0 ? _options$MC$S_DEBOUNC : config._debounceWindow
  };
};
const directionMatches = (userDirections, latestDirection) => !userDirections || includes(userDirections, latestDirection);
const hasExceededThreshold = (options, latestData, lastThresholdData) => {
  const directions = options._directions;
  const threshold = options._threshold;
  if (!lastThresholdData) {
    return false;
  }
  const topDiff = maxAbs(latestData[S_SCROLL_TOP] - lastThresholdData[S_SCROLL_TOP], latestData[S_SCROLL_HEIGHT] - lastThresholdData[S_SCROLL_HEIGHT], latestData[S_CLIENT_HEIGHT] - lastThresholdData[S_CLIENT_HEIGHT]);
  const leftDiff = maxAbs(latestData[S_SCROLL_LEFT] - lastThresholdData[S_SCROLL_LEFT], latestData[S_SCROLL_WIDTH] - lastThresholdData[S_SCROLL_WIDTH], latestData[S_CLIENT_WIDTH] - lastThresholdData[S_CLIENT_WIDTH]);
  let checkTop = false,
    checkLeft = false;
  if (!directions || includes(directions, S_NONE) || includes(directions, S_AMBIGUOUS)) {
    checkTop = checkLeft = true;
  } else {
    if (includes(directions, S_UP) || includes(directions, S_DOWN)) {
      checkTop = true;
    }
    if (includes(directions, S_LEFT) || includes(directions, S_RIGHT)) {
      checkLeft = true;
    }
  }
  return checkTop && topDiff >= threshold || checkLeft && leftDiff >= threshold;
};
const fetchScrollData = async (element, previousEventData, realtime) => {
  if (!realtime) {
    await waitForMeasureTime();
  }
  const scrollTop = ceil(element[S_SCROLL_TOP]);
  const scrollLeft = ceil(element[S_SCROLL_LEFT]);
  const scrollWidth = element[S_SCROLL_WIDTH];
  const scrollHeight = element[S_SCROLL_HEIGHT];
  const clientWidth = getClientWidthNow(element);
  const clientHeight = getClientHeightNow(element);
  const scrollTopFraction = round(scrollTop) / (scrollHeight - clientHeight || INFINITY);
  const scrollLeftFraction = round(scrollLeft) / (scrollWidth - clientWidth || INFINITY);
  const prevScrollTop = (previousEventData === null || previousEventData === void 0 ? void 0 : previousEventData.scrollTop) || 0;
  const prevScrollLeft = (previousEventData === null || previousEventData === void 0 ? void 0 : previousEventData.scrollLeft) || 0;
  const direction = getMaxDeltaDirection(scrollLeft - prevScrollLeft, scrollTop - prevScrollTop);
  return {
    direction,
    [S_SCROLL_TOP]: scrollTop,
    [S_SCROLL_TOP_FRACTION]: scrollTopFraction,
    [S_SCROLL_LEFT]: scrollLeft,
    [S_SCROLL_LEFT_FRACTION]: scrollLeftFraction,
    [S_SCROLL_WIDTH]: scrollWidth,
    [S_SCROLL_HEIGHT]: scrollHeight,
    [S_CLIENT_WIDTH]: clientWidth,
    [S_CLIENT_HEIGHT]: clientHeight
  };
};
const setScrollCssProps = (element, scrollData) => {
  let prefix = "";
  if (element === tryGetMainScrollableElement()) {
    element = getDocElement();
    prefix = "page-";
  }
  scrollData = scrollData || {};
  const props = {
    [S_SCROLL_TOP]: scrollData[S_SCROLL_TOP],
    [S_SCROLL_TOP_FRACTION]: scrollData[S_SCROLL_TOP_FRACTION],
    [S_SCROLL_LEFT]: scrollData[S_SCROLL_LEFT],
    [S_SCROLL_LEFT_FRACTION]: scrollData[S_SCROLL_LEFT_FRACTION],
    [S_SCROLL_WIDTH]: scrollData[S_SCROLL_WIDTH],
    [S_SCROLL_HEIGHT]: scrollData[S_SCROLL_HEIGHT]
  };
  setNumericStyleProps(element, props, {
    _prefix: prefix
  });
};
const getEventTarget = element => {
  if (element === getDocScrollingElement()) {
    return getDoc();
  }
  return element;
};
const invokeCallback$1 = (callback, element, scrollData) => callback.invoke(element, copyObject(scrollData)).catch(logError);

const isValidScrollOffset = offset => offset.match(OFFSET_REGEX) !== null;
const isValidView = view => includes(VIEWS, view);
const getOppositeViews = views => {
  const bitmask = getViewsBitmask(views);
  let oppositeBitmask = VIEWS_SPACE.bitmask & ~bitmask;
  if (bitmask !== VIEWS_SPACE.bit.at) {
    if (!(bitmask & VIEWS_SPACE.bit.above)) {
      oppositeBitmask &= ~VIEWS_SPACE.bit.below;
    }
    if (!(bitmask & VIEWS_SPACE.bit.below)) {
      oppositeBitmask &= ~VIEWS_SPACE.bit.above;
    }
    if (!(bitmask & VIEWS_SPACE.bit.left)) {
      oppositeBitmask &= ~VIEWS_SPACE.bit.right;
    }
    if (!(bitmask & VIEWS_SPACE.bit.right)) {
      oppositeBitmask &= ~VIEWS_SPACE.bit.left;
    }
  }
  return getViewsFromBitmask(oppositeBitmask);
};
const getViewsBitmask = viewsStr => {
  let viewsBitmask = 0;
  const views = validateStrList("views", viewsStr, isValidView);
  if (views) {
    for (const v of views) {
      if (!isValidView(v)) {
        throw usageError(`Unknown view '${v}'`);
      }
      viewsBitmask |= VIEWS_SPACE.bit[v];
    }
  } else {
    viewsBitmask = VIEWS_SPACE.bitmask;
  }
  return viewsBitmask;
};
const parseScrollOffset = input => {
  var _match$groups, _match$groups2;
  const match = input.match(OFFSET_REGEX);
  if (!match) {
    throw usageError(`Invalid offset: '${input}'`);
  }
  const reference = (_match$groups = match.groups) === null || _match$groups === void 0 ? void 0 : _match$groups.ref;
  const value = (_match$groups2 = match.groups) === null || _match$groups2 === void 0 ? void 0 : _match$groups2.value;
  if (!reference || !value) {
    throw bugError("Offset regex: blank named groups");
  }
  return {
    reference,
    value
  };
};
const VIEWS = [S_AT, S_ABOVE, S_BELOW, S_LEFT, S_RIGHT];
const VIEWS_SPACE = createBitSpace(newBitSpaces(), ...VIEWS);
const OFFSET_REGEX = RegExp("(?<ref>top|bottom|left|right): *(?<value>[^ ].+)");
const getViewsFromBitmask = bitmask => {
  const views = [];
  for (let bit = VIEWS_SPACE.start; bit <= VIEWS_SPACE.end; bit++) {
    const value = 1 << bit;
    if (bitmask & value) {
      const name = VIEWS_SPACE.nameOf(value);
      if (name) {
        views.push(name);
      }
    }
  }
  return views;
};

class XIntersectionObserver {
  constructor(callback, observeOptions) {
    let observedTargets = newWeakSet();
    const targetsToSkip = newWeakSet();
    const intersectionHandler = entries => {
      const selectedEntries = [];
      for (const entry of entries) {
        if (targetsToSkip.has(targetOf(entry))) {
          deleteKey(targetsToSkip, targetOf(entry));
          continue;
        }
        selectedEntries.push(entry);
      }
      if (lengthOf(selectedEntries)) {
        callback(selectedEntries, this);
      }
    };
    const observer = newIntersectionObserver(intersectionHandler, observeOptions);
    defineProperty(this, "root", {
      get: () => observer.root
    });
    defineProperty(this, "rootMargin", {
      get: () => observer.rootMargin
    });
    defineProperty(this, "thresholds", {
      get: () => observer.thresholds
    });
    this.observe = (...targets) => {
      for (const target of targets) {
        observedTargets.add(target);
        observer.observe(target);
      }
    };
    this.observeLater = (...targets) => {
      for (const target of targets) {
        if (observedTargets.has(target)) {
          continue;
        }
        targetsToSkip.add(target);
        this.observe(target);
      }
    };
    this.unobserve = (...targets) => {
      for (const target of targets) {
        deleteKey(observedTargets, target);
        observer.unobserve(target);
      }
    };
    this.disconnect = () => {
      observedTargets = newWeakSet();
      observer.disconnect();
    };
    this.takeRecords = () => observer.takeRecords();
  }
}

class ViewWatcher {
  static create(config = {}) {
    return new ViewWatcher(getConfig(config), CONSTRUCTOR_KEY);
  }
  static reuse(config = {}) {
    var _instances$get;
    const myConfig = getConfig(config);
    const configStrKey = objToStrKey(omitKeys(myConfig, {
      _root: null
    }));
    let instance = (_instances$get = instances$2.get(myConfig._root)) === null || _instances$get === void 0 ? void 0 : _instances$get.get(configStrKey);
    if (!instance) {
      instance = new ViewWatcher(myConfig, CONSTRUCTOR_KEY);
      instances$2.sGet(myConfig._root).set(configStrKey, instance);
    }
    return instance;
  }
  constructor(config, key) {
    if (key !== CONSTRUCTOR_KEY) {
      throw illegalConstructorError("ViewWatcher.create");
    }
    const allViewData = newWeakMap();
    const allCallbacks = newXWeakMap(() => newMap());
    const intersectionHandler = entries => {
      for (const entry of entries) {
        processEntry(entry);
      }
    };
    const observeOptions = {
      root: config._root,
      threshold: config._threshold,
      rootMargin: config._rootMargin
    };
    const xObserver = new XIntersectionObserver(intersectionHandler, observeOptions);
    const fetchCurrentView = (element, realtime = false) => {
      const fetchData = async entryOrElement => {
        const intersection = await fetchIntersectionData(config, entryOrElement, realtime);
        const data = await fetchViewData(intersection, realtime);
        return data;
      };
      if (realtime) {
        return fetchData(element);
      }
      return newPromise(resolve => {
        const observer = newIntersectionObserver(entries => {
          const promise = fetchData(entries[0]);
          observer.disconnect();
          promise.then(resolve);
        }, observeOptions);
        observer.observe(element);
      });
    };
    const createCallback = (handler, options, trackType) => {
      var _allCallbacks$get;
      const element = options._element;
      remove((_allCallbacks$get = allCallbacks.get(element)) === null || _allCallbacks$get === void 0 || (_allCallbacks$get = _allCallbacks$get.get(handler)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get._callback);
      const callback = wrapCallback(handler);
      callback.onRemove(() => {
        deleteHandler(handler, options);
      });
      allCallbacks.sGet(element).set(handler, {
        _callback: callback,
        _trackType: trackType,
        _options: options
      });
      return callback;
    };
    const setupOnView = async (target, handler, userOptions, trackType) => {
      const options = await fetchOptions(config._root, target, userOptions);
      const element = options._element;
      const callback = createCallback(handler, options, trackType);
      await waitForInteractive();
      let viewData = await fetchCurrentView(element);
      if (viewData.rootBounds[S_WIDTH] === 0 && viewData.rootBounds[S_HEIGHT] === 0) {
        await waitForSubsequentMeasureTime();
        viewData = await fetchCurrentView(element);
      }
      if (trackType === TRACK_FULL) {
        await setupInviewTrack(options, callback, viewData);
      }
      if (callback.isRemoved()) {
        return;
      }
      xObserver.observeLater(element);
      if (!(userOptions !== null && userOptions !== void 0 && userOptions.skipInitial)) {
        if (viewsToBitmask(viewData.views) & options._viewsBitmask) {
          await invokeCallback(callback, element, viewData);
        }
      }
    };
    const removeOnView = async (target, handler, trackType) => {
      var _allCallbacks$get2;
      const options = await fetchOptions(config._root, target, {});
      const element = options._element;
      const currEntry = (_allCallbacks$get2 = allCallbacks.get(element)) === null || _allCallbacks$get2 === void 0 ? void 0 : _allCallbacks$get2.get(handler);
      if ((currEntry === null || currEntry === void 0 ? void 0 : currEntry._trackType) === trackType) {
        remove(currEntry._callback);
        if (handler === setViewCssProps) {
          setViewCssProps(element, null);
        }
      }
    };
    const deleteHandler = (handler, options) => {
      const element = options._element;
      deleteKey(allCallbacks.get(element), handler);
      allCallbacks.prune(element);
      if (!allCallbacks.has(element)) {
        xObserver.unobserve(element);
        deleteKey(allViewData, element);
      }
    };
    const processEntry = async entry => {
      const element = targetOf(entry);
      const intersection = await fetchIntersectionData(config, entry);
      const latestData = await fetchViewData(intersection);
      const viewsBitmask = viewsToBitmask(latestData.views);
      for (const entry of ((_allCallbacks$get3 = allCallbacks.get(element)) === null || _allCallbacks$get3 === void 0 ? void 0 : _allCallbacks$get3.values()) || []) {
        var _allCallbacks$get3;
        if (viewsBitmask & entry._options._viewsBitmask) {
          invokeCallback(entry._callback, element, latestData);
        }
      }
    };
    const setupInviewTrack = async (options, viewCallback, viewData) => {
      const element = options._element;
      const sizeWatcher = SizeWatcher.reuse();
      const scrollWatcher = ScrollWatcher.reuse();
      const realtime = options._debounceWindow === 0;
      const domWatcher = DOMWatcher.create({
        root: element,
        subtree: false
      });
      let isInview = false;
      let removeTrackCallback = null;
      const scrollableAncestors = await fetchScrollableAncestors(element, realtime);
      if (viewCallback.isRemoved()) {
        return;
      }
      const addTrackCallback = () => {
        var _config$_root;
        const trackCallback = wrapCallback(async () => {
          const prevData = allViewData.get(element);
          const latestData = await fetchCurrentView(element, realtime);
          const changed = viewChanged(latestData, prevData);
          if (changed) {
            allViewData.set(element, latestData);
            if (isInview && !viewCallback.isRemoved()) {
              await invokeCallback(viewCallback, element, latestData);
            }
          }
        });
        viewCallback.onRemove(trackCallback.remove);
        removeTrackCallback = trackCallback.remove;
        domWatcher.onMutation(trackCallback, {
          categories: [S_ATTRIBUTE],
          [S_SKIP_INITIAL]: true
        });
        sizeWatcher.onResize(trackCallback, {
          target: element,
          [S_DEBOUNCE_WINDOW]: options._debounceWindow,
          threshold: options._resizeThreshold,
          [S_SKIP_INITIAL]: true
        });
        sizeWatcher.onResize(trackCallback, {
          target: (_config$_root = config._root) !== null && _config$_root !== void 0 ? _config$_root : getWindow(),
          [S_DEBOUNCE_WINDOW]: options._debounceWindow,
          threshold: options._resizeThreshold,
          [S_SKIP_INITIAL]: true
        });
        for (const ancestor of scrollableAncestors) {
          scrollWatcher.onScroll(trackCallback, {
            scrollable: ancestor,
            [S_DEBOUNCE_WINDOW]: options._debounceWindow,
            threshold: options._scrollThreshold,
            [S_SKIP_INITIAL]: true
          });
        }
      };
      const enterOrLeaveCallback = createCallback((target__ignored, viewData) => {
        if (viewData.views[0] === S_AT) {
          if (!isInview) {
            isInview = true;
            addTrackCallback();
          }
        } else if (removeTrackCallback) {
          isInview = false;
          removeTrackCallback();
          removeTrackCallback = null;
        }
      }, assign(options, {
        _viewsBitmask: VIEWS_SPACE.bitmask
      }), TRACK_REGULAR);
      viewCallback.onRemove(enterOrLeaveCallback.remove);
      allViewData.set(element, viewData);
      if (!enterOrLeaveCallback.isRemoved()) {
        invokeCallback(enterOrLeaveCallback, element, viewData);
      }
    };
    this.fetchCurrentView = (target, realtime = false) => fetchElement(config._root, target).then(element => fetchCurrentView(element, realtime));
    this.trackView = (element, handler, options) => {
      if (!handler) {
        handler = setViewCssProps;
      }
      return setupOnView(element, handler, options, TRACK_FULL);
    };
    this.noTrackView = (element, handler) => {
      if (!handler) {
        handler = setViewCssProps;
      }
      removeOnView(element, handler, TRACK_FULL);
    };
    this.onView = (target, handler, options) => setupOnView(target, handler, options, TRACK_REGULAR);
    this.offView = (target, handler) => removeOnView(target, handler, TRACK_REGULAR);
  }
}
const CONSTRUCTOR_KEY = SYMBOL();
const instances$2 = newXMap(() => newMap());
const getConfig = config => {
  var _config$rootMargin;
  return {
    _root: (config === null || config === void 0 ? void 0 : config.root) || null,
    _rootMargin: (_config$rootMargin = config === null || config === void 0 ? void 0 : config.rootMargin) !== null && _config$rootMargin !== void 0 ? _config$rootMargin : "0px 0px 0px 0px",
    _threshold: (config === null || config === void 0 ? void 0 : config.threshold) || 0
  };
};
const TRACK_REGULAR = 1;
const TRACK_FULL = 2;
const fetchOptions = async (root, target, options) => {
  return {
    _element: await fetchElement(root, target),
    _viewsBitmask: getViewsBitmask(options === null || options === void 0 ? void 0 : options.views),
    _debounceWindow: options === null || options === void 0 ? void 0 : options.debounceWindow,
    _resizeThreshold: options === null || options === void 0 ? void 0 : options.resizeThreshold,
    _scrollThreshold: options === null || options === void 0 ? void 0 : options.scrollThreshold
  };
};
const fetchScrollableAncestors = async (element, realtime) => {
  if (!realtime) {
    await waitForMeasureTime();
  }
  const scrollableAncestors = [];
  let ancestor = element;
  while (ancestor = getClosestScrollable(ancestor, {
    active: true
  })) {
    scrollableAncestors.push(ancestor);
  }
  return scrollableAncestors;
};
const viewChanged = (latestData, prevData) => !prevData || viewsToBitmask(prevData.views) !== viewsToBitmask(latestData.views) || !compareValuesIn(copyBoundingRectProps(prevData.targetBounds), copyBoundingRectProps(latestData.targetBounds)) || !compareValuesIn(prevData.rootBounds, latestData.rootBounds) || !compareValuesIn(prevData.relative, latestData.relative);
const viewsToBitmask = views => VIEWS_SPACE.bit[views[0]] | (views[1] ? VIEWS_SPACE.bit[views[1]] : 0);
const fetchIntersectionData = async (config, entryOrTarget, realtime = false) => {
  const root = config._root;
  const vpSize = await fetchViewportSize(realtime);
  const rootMargins = toMargins(config._rootMargin, vpSize);
  let target;
  let targetBounds;
  let rootBounds = null;
  let isIntersecting = null;
  let isCrossOrigin = null;
  if (isInstanceOf(entryOrTarget, IntersectionObserverEntry)) {
    target = entryOrTarget.target;
    targetBounds = entryOrTarget.boundingClientRect;
    rootBounds = entryOrTarget.rootBounds;
    isIntersecting = entryOrTarget.isIntersecting;
    isCrossOrigin = !entryOrTarget.rootBounds;
  } else {
    target = entryOrTarget;
    targetBounds = await fetchBounds(target, realtime);
  }
  if (!rootBounds) {
    rootBounds = await fetchBounds(root, realtime, rootMargins);
  }
  return {
    _target: target,
    _targetBounds: targetBounds,
    _root: root,
    _rootMargins: rootMargins,
    _rootBounds: rootBounds,
    _isIntersecting: isIntersecting,
    _isCrossOrigin: isCrossOrigin
  };
};
const fetchBounds = async (root, realtime, rootMargins) => {
  let rect;
  if (root) {
    if (!realtime) {
      await waitForMeasureTime();
    }
    rect = copyBoundingRectProps(getBoundingClientRect(root));
  } else {
    const {
      width,
      height
    } = await fetchViewportSize(realtime);
    rect = {
      x: 0,
      left: 0,
      right: width,
      width,
      y: 0,
      top: 0,
      bottom: height,
      height
    };
  }
  if (rootMargins) {
    rect.x = rect[S_LEFT] -= rootMargins[3];
    rect[S_RIGHT] += rootMargins[1];
    rect[S_WIDTH] += rootMargins[1] + rootMargins[3];
    rect.y = rect[S_TOP] -= rootMargins[0];
    rect[S_BOTTOM] += rootMargins[2];
    rect[S_HEIGHT] += rootMargins[0] + rootMargins[2];
  }
  return rect;
};
const fetchViewData = async (intersection, realtime = false) => {
  var _intersection$_isInte;
  const vpSize = await fetchViewportSize(realtime);
  const vpHeight = vpSize[S_HEIGHT];
  const vpWidth = vpSize[S_WIDTH];
  const views = await fetchViews(intersection, realtime);
  const relative = merge({
    hMiddle: NaN,
    vMiddle: NaN
  }, copyBoundingRectProps(intersection._targetBounds));
  relative.y /= vpHeight;
  relative[S_TOP] /= vpHeight;
  relative[S_BOTTOM] /= vpHeight;
  relative[S_HEIGHT] /= vpHeight;
  relative.x /= vpWidth;
  relative[S_LEFT] /= vpWidth;
  relative[S_RIGHT] /= vpWidth;
  relative[S_WIDTH] /= vpWidth;
  relative.hMiddle = (relative[S_LEFT] + relative[S_RIGHT]) / 2;
  relative.vMiddle = (relative[S_TOP] + relative[S_BOTTOM]) / 2;
  const viewData = {
    isIntersecting: (_intersection$_isInte = intersection._isIntersecting) !== null && _intersection$_isInte !== void 0 ? _intersection$_isInte : views[0] === S_AT,
    targetBounds: intersection._targetBounds,
    rootBounds: intersection._rootBounds,
    views,
    relative
  };
  return viewData;
};
const fetchViews = async (intersection, realtime, useScrollingAncestor) => {
  if (intersection._isIntersecting) {
    return [S_AT];
  }
  let rootBounds;
  if (useScrollingAncestor) {
    rootBounds = await fetchBounds(useScrollingAncestor, realtime, intersection._rootMargins);
  } else {
    rootBounds = intersection._rootBounds;
  }
  const targetBounds = intersection._targetBounds;
  const delta = {
    _left: rootBounds[S_LEFT] - targetBounds[S_LEFT],
    _right: targetBounds[S_RIGHT] - rootBounds[S_RIGHT],
    _top: rootBounds[S_TOP] - targetBounds[S_TOP],
    _bottom: targetBounds[S_BOTTOM] - rootBounds[S_BOTTOM]
  };
  let xView = null;
  let yView = null;
  if (delta._left > 0 && delta._right > 0) {
    xView = delta._left > delta._right ? S_RIGHT : S_LEFT;
  } else if (delta._left > 0) {
    xView = S_RIGHT;
  } else if (delta._right > 0) {
    xView = S_LEFT;
  }
  if (delta._top > 0 && delta._bottom > 0) {
    yView = delta._top > delta._bottom ? S_BELOW : S_ABOVE;
  } else if (delta._top > 0) {
    yView = S_BELOW;
  } else if (delta._bottom > 0) {
    yView = S_ABOVE;
  }
  if (xView && yView) {
    return [xView, yView];
  } else if (xView) {
    return [xView];
  } else if (yView) {
    return [yView];
  }
  if (!intersection._isCrossOrigin) {
    const scrollingAncestor = getClosestScrollable(useScrollingAncestor !== null && useScrollingAncestor !== void 0 ? useScrollingAncestor : intersection._target);
    if (scrollingAncestor) {
      return fetchViews(intersection, realtime, scrollingAncestor);
    }
  }
  return [S_AT];
};
const setViewCssProps = (element, viewData) => {
  const relative = (viewData === null || viewData === void 0 ? void 0 : viewData.relative) || {};
  const props = {
    top: relative.top,
    bottom: relative.bottom,
    left: relative.left,
    right: relative.right,
    [S_WIDTH]: relative[S_WIDTH],
    [S_HEIGHT]: relative[S_HEIGHT],
    hMiddle: relative.hMiddle,
    vMiddle: relative.vMiddle
  };
  setNumericStyleProps(element, props, {
    _prefix: "r-",
    _numDecimal: 4
  });
};
const fetchElement = async (root, target) => {
  if (isElement(target)) {
    return target;
  } else if (!isString(target)) {
    throw usageError("'target' must be an offset string or an HTMLElement | SVGElement | MathMLElement");
  }
  const overlayOptions = getOverlayOptions(root, target);
  return await createOverlay(overlayOptions);
};
const getOverlayOptions = (root, target) => {
  const {
    reference,
    value
  } = parseScrollOffset(target);
  let ovrDimension;
  if (reference === S_TOP || reference === S_BOTTOM) {
    ovrDimension = S_WIDTH;
  } else if (reference === S_LEFT || reference === S_RIGHT) {
    ovrDimension = S_HEIGHT;
  } else {
    throw usageError(`Invalid offset reference: '${reference}'`);
  }
  return {
    parent: isHTMLElement(root) ? root : undefined,
    style: {
      [reference]: value,
      [ovrDimension]: "100%"
    }
  };
};
const invokeCallback = (callback, element, viewData) => callback.invoke(element, copyObject(viewData)).catch(logError);

var index$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  DOMWatcher: DOMWatcher,
  GestureWatcher: GestureWatcher,
  LayoutWatcher: LayoutWatcher,
  PointerWatcher: PointerWatcher,
  ScrollWatcher: ScrollWatcher,
  SizeWatcher: SizeWatcher,
  ViewWatcher: ViewWatcher
});

settings.autoWidgets = true;

class Widget {
  static get(element, id) {
    var _instances$get;
    return ((_instances$get = instances$1.get(element)) === null || _instances$get === void 0 ? void 0 : _instances$get.get(id)) || null;
  }
  constructor(element, config) {
    const id = config === null || config === void 0 ? void 0 : config.id;
    if (id) {
      var _instances$get2;
      (_instances$get2 = instances$1.get(element)) === null || _instances$get2 === void 0 || (_instances$get2 = _instances$get2.get(id)) === null || _instances$get2 === void 0 || _instances$get2.destroy();
      instances$1.sGet(element).set(id, this);
    }
    let isDisabled = false;
    let isDestroyed = false;
    let destroyPromise;
    const enableCallbacks = newSet();
    const disableCallbacks = newSet();
    const destroyCallbacks = newSet();
    this.disable = async () => {
      if (!isDisabled) {
        isDisabled = true;
        for (const callback of disableCallbacks) {
          await callback.invoke(this);
        }
      }
    };
    this.enable = async () => {
      if (!isDestroyed && isDisabled) {
        isDisabled = false;
        for (const callback of enableCallbacks) {
          await callback.invoke(this);
        }
      }
    };
    this.toggleEnable = async () => {
      if (!isDestroyed) {
        await (isDisabled ? this.enable : this.disable)();
      }
    };
    this.onDisable = handler => disableCallbacks.add(wrapCallback(handler));
    this.onEnable = handler => enableCallbacks.add(wrapCallback(handler));
    this.isDisabled = () => isDisabled;
    this.destroy = () => {
      if (!destroyPromise) {
        destroyPromise = (async () => {
          isDestroyed = true;
          await this.disable();
          for (const callback of destroyCallbacks) {
            await callback.invoke(this);
          }
          enableCallbacks.clear();
          disableCallbacks.clear();
          destroyCallbacks.clear();
          if (id) {
            const elInstances = instances$1.get(element);
            if ((elInstances === null || elInstances === void 0 ? void 0 : elInstances.get(id)) === this) {
              deleteKey(elInstances, id);
              instances$1.prune(element);
            }
          }
        })();
      }
      return destroyPromise;
    };
    this.onDestroy = handler => destroyCallbacks.add(wrapCallback(handler));
    this.isDestroyed = () => isDestroyed;
    this.getElement = () => element;
  }
}
const registerWidget = async (name, newWidget, configValidator, options) => {
  var _options$selector;
  if (registeredWidgets.has(name)) {
    return;
  }
  registeredWidgets.add(name);
  await waitForInteractive();
  const prefixedName = prefixName(name);
  const selector = (_options$selector = options === null || options === void 0 ? void 0 : options.selector) !== null && _options$selector !== void 0 ? _options$selector : getDefaultWidgetSelector(prefixedName);
  if (settings.autoWidgets) {
    const domWatcher = DOMWatcher.reuse();
    domWatcher.onMutation(async operation => {
      const element = currentTargetOf(operation);
      const thisConfigValidator = isFunction(configValidator) ? await configValidator(element) : configValidator;
      const widgets = [];
      const configSpecs = [];
      const dataAttr = getData(element, prefixedName);
      if (options !== null && options !== void 0 && options.supportsMultiple) {
        if (hasClass(element, prefixedName)) {
          configSpecs.push("");
        }
        if (dataAttr !== null) {
          configSpecs.push(...(dataAttr ? splitOn(dataAttr, ";", true) : [""]));
        }
      } else {
        configSpecs.push(dataAttr !== null && dataAttr !== void 0 ? dataAttr : "");
      }
      for (const spec of configSpecs) {
        const config = thisConfigValidator ? await fetchWidgetConfig(spec, thisConfigValidator) : undefined;
        const theseWidgets = await newWidget(element, config);
        if (theseWidgets) {
          widgets.push(...toArrayIfSingle(theseWidgets));
        }
      }
      if (lengthOf(widgets)) {
        domWatcher.onMutation(() => {
          for (const w of widgets) {
            w.destroy();
          }
        }, {
          target: element,
          categories: [S_REMOVED]
        });
      }
    }, {
      selector,
      categories: [S_ADDED]
    });
  }
};
const getWidgetConfig = (input, validator, separator = "|") => {
  const config = {};
  if (!(input instanceof Object)) {
    input = toOptionsObject(input, separator);
  }
  for (const key in validator) {
    config[key] = validator[key](key, input[key]);
  }
  return config;
};
const fetchWidgetConfig = async (input, validator, separator = "|") => {
  const config = {};
  const configPromises = getWidgetConfig(input, validator, separator);
  for (const key in configPromises) {
    config[key] = await configPromises[key];
  }
  return config;
};
const getDefaultWidgetSelector = prefix => `.${prefix},[data-${prefix}]`;
const fetchUniqueWidget = async (name, element, Type) => {
  let widget = Type.get(element);
  if (!widget) {
    await waitForDelay(0);
    widget = Type.get(element);
    if (!widget) {
      logWarn(`No ${name} widget for element ${formatAsString(element)}`);
      return null;
    }
  }
  return widget;
};
const instances$1 = newXWeakMap(() => newMap());
const registeredWidgets = newSet();
const toOptionsObject = (input, separator) => {
  const options = {};
  for (const entry of filter(splitOn(input !== null && input !== void 0 ? input : "", separator, true), v => !isEmpty(v))) {
    const [key, value] = splitOn(entry, /\s*=\s*/, true, 1);
    options[kebabToCamelCase(key)] = value !== null && value !== void 0 ? value : "";
  }
  return options;
};

const registerAction = (name, newAction, configValidator) => {
  if (registeredActions.has(name)) {
    return;
  }
  const newActionFromSpec = async (element, argsAndOptions) => {
    const thisConfigValidator = isFunction(configValidator) ? await configValidator(element) : configValidator;
    const args = [];
    const config = thisConfigValidator ? await fetchWidgetConfig(argsAndOptions, thisConfigValidator, ",") : undefined;
    for (const entry of splitOn(argsAndOptions, ",", true)) {
      if (entry) {
        if (!includes(entry, "=")) {
          args.push(entry);
        }
      }
    }
    return newAction(element, args, config);
  };
  registeredActions.set(name, newActionFromSpec);
};
const fetchAction = async (element, name, argsAndOptions) => {
  const newActionFromSpec = registeredActions.get(name);
  if (!newActionFromSpec) {
    throw usageError(`Unknown action '${name}'`);
  }
  return await newActionFromSpec(element, argsAndOptions || "");
};
const registeredActions = newMap();

class AddClass {
  static register() {
    registerAction("add-class", (element, classNames) => new AddClass(element, ...classNames));
  }
  constructor(element, ...classNames) {
    const {
      _add,
      _remove,
      _toggle
    } = getMethods$7(element, classNames);
    _remove();
    this.do = _add;
    this.undo = _remove;
    this[S_TOGGLE] = _toggle;
  }
}
class RemoveClass {
  static register() {
    registerAction("remove-class", (element, classNames) => new RemoveClass(element, ...classNames));
  }
  constructor(element, ...classNames) {
    const {
      _add,
      _remove,
      _toggle
    } = getMethods$7(element, classNames);
    _add();
    this.do = _remove;
    this.undo = _add;
    this[S_TOGGLE] = _toggle;
  }
}
const getMethods$7 = (element, classNames) => {
  return {
    _add: () => addClasses(element, ...classNames),
    _remove: () => removeClasses(element, ...classNames),
    _toggle: async () => {
      for (const cls of classNames) {
        await toggleClass(element, cls);
      }
    }
  };
};

const iterateAnimations = async (element, webAnimationCallback, legacyCallback, realtime = false) => {
  if ("getAnimations" in element && getData(element, prefixName("test-legacy")) === null) {
    if (!realtime) {
      await waitForMeasureTime();
    }
    for (const animation of element.getAnimations()) {
      webAnimationCallback(animation);
    }
  } else {
    if (!realtime) {
      await waitForMutateTime();
    }
    legacyCallback(element);
  }
};
const resetCssAnimationsNow = element => {
  addClassesNow(element, PREFIX_ANIMATE_DISABLE);
  element[S_CLIENT_WIDTH];
  removeClassesNow(element, PREFIX_ANIMATE_DISABLE);
};

class Animate {
  static register() {
    registerAction("animate", element => new Animate(element));
  }
  constructor(element) {
    const logger = null;
    animate$1(element, GO_FORWARD, logger, true);
    let isFirst = true;
    this.do = () => animate$1(element, GO_FORWARD, logger);
    this.undo = () => animate$1(element, GO_BACKWARD, logger);
    this[S_TOGGLE] = () => {
      const res = animate$1(element, isFirst ? GO_FORWARD : GO_TOGGLE, logger);
      isFirst = false;
      return res;
    };
  }
}
const GO_FORWARD = 0;
const GO_BACKWARD = 1;
const GO_TOGGLE = 2;
const animate$1 = (element, direction, logger, isInitial = false) => {
  return iterateAnimations(element, animation => setupAnimation(animation, direction, logger, isInitial), element => setupAnimationLegacy(element, direction, logger, isInitial), isInitial);
};
const setupAnimation = (animation, direction, logger, isInitial) => {
  const pauseTillReady = !isPageReady();
  const isBackward = animation.playbackRate === -1;
  if (direction === GO_TOGGLE || direction === GO_FORWARD && isBackward || direction === GO_BACKWARD && !isBackward) {
    animation.reverse();
  } else if (animation.playState === "paused") {
    animation.play();
  } else ;
  if (isInitial || pauseTillReady) {
    animation.pause();
    if (!isInitial) {
      waitForPageReady().then(() => {
        animation.play();
      });
    }
  }
  if (isInstanceOf(animation, CSSAnimation)) {
    const cancelHandler = event => onAnimationCancel(event, animation, direction, logger, isInitial);
    animation.addEventListener(S_CANCEL, cancelHandler);
    animation.addEventListener("finish", () => animation.removeEventListener(S_CANCEL, cancelHandler));
  }
};
const onAnimationCancel = (event, animation, direction, logger, isInitial) => {
  const target = targetOf(event);
  if (!isInstanceOf(target, Animation)) {
    return;
  }
  const effect = target.effect;
  if (!isInstanceOf(effect, KeyframeEffect)) {
    return;
  }
  for (const newAnimation of ((_MH$targetOf = targetOf(effect)) === null || _MH$targetOf === void 0 ? void 0 : _MH$targetOf.getAnimations()) || []) {
    var _MH$targetOf;
    if (isInstanceOf(newAnimation, CSSAnimation) && newAnimation.animationName === animation.animationName) {
      setupAnimation(newAnimation, direction, logger, isInitial);
      break;
    }
  }
};
const setupAnimationLegacy = (element, direction, logger, isInitial) => {
  const isBackward = hasClass(element, PREFIX_ANIMATE_REVERSE);
  const isPaused = hasClass(element, PREFIX_ANIMATE_PAUSE);
  const pauseTillReady = !isPageReady();
  const goBackwards = direction === GO_BACKWARD || direction === GO_TOGGLE && !isBackward;
  const doPause = isInitial || pauseTillReady;
  if (goBackwards === isBackward && doPause === isPaused) {
    return;
  }
  resetCssAnimationsNow(element);
  removeClassesNow(element, PREFIX_ANIMATE_PAUSE, PREFIX_ANIMATE_REVERSE);
  addClassesNow(element, ...(goBackwards ? [PREFIX_ANIMATE_REVERSE] : []), ...(doPause ? [PREFIX_ANIMATE_PAUSE] : []));
  if (!isInitial && pauseTillReady) {
    waitForPageReady().then(() => removeClasses(element, PREFIX_ANIMATE_PAUSE));
  }
};

class AnimatePlay {
  static register() {
    registerAction("animate-play", element => new AnimatePlay(element));
  }
  constructor(element) {
    const {
      _play,
      _pause,
      _toggle
    } = getMethods$6(element);
    animate(element, PAUSE, true);
    this.do = _play;
    this.undo = _pause;
    this[S_TOGGLE] = _toggle;
  }
}
class AnimatePause {
  static register() {
    registerAction("animate-pause", element => new AnimatePause(element));
  }
  constructor(element) {
    const {
      _play,
      _pause,
      _toggle
    } = getMethods$6(element);
    _play();
    this.do = _pause;
    this.undo = _play;
    this[S_TOGGLE] = _toggle;
  }
}
const PLAY = 0;
const PAUSE = 1;
const TOGGLE = 2;
const getMethods$6 = element => {
  return {
    _play: () => animate(element, PLAY),
    _pause: () => animate(element, PAUSE),
    _toggle: () => animate(element, TOGGLE)
  };
};
const animate = (element, action, isInitial = false) => {
  return iterateAnimations(element, animation => {
    const isPaused = animation.playState === "paused";
    if (action === PLAY || isPaused && action === TOGGLE) {
      animation.play();
    } else {
      animation.pause();
    }
  }, element => {
    if (isInitial) {
      resetCssAnimationsNow(element);
    }
    const isPaused = hasClass(element, PREFIX_ANIMATE_PAUSE);
    if (action === PLAY || isPaused && action === TOGGLE) {
      removeClassesNow(element, PREFIX_ANIMATE_PAUSE);
    } else {
      addClassesNow(element, PREFIX_ANIMATE_PAUSE);
    }
  }, isInitial);
};

class Display {
  static register() {
    registerAction("display", element => new Display(element));
  }
  constructor(element) {
    undisplayElementNow(element);
    const {
      _display,
      _undisplay,
      _toggle
    } = getMethods$5(element);
    this.do = _display;
    this.undo = _undisplay;
    this[S_TOGGLE] = _toggle;
  }
}
class Undisplay {
  static register() {
    registerAction("undisplay", element => new Undisplay(element));
  }
  constructor(element) {
    displayElementNow(element);
    const {
      _display,
      _undisplay,
      _toggle
    } = getMethods$5(element);
    this.do = _undisplay;
    this.undo = _display;
    this[S_TOGGLE] = _toggle;
  }
}
const getMethods$5 = element => {
  return {
    _display: async () => {
      await displayElement(element);
    },
    _undisplay: async () => {
      await undisplayElement(element);
    },
    _toggle: async () => {
      await toggleDisplayElement(element);
    }
  };
};

const getReferenceElement = (spec, thisElement) => {
  if (!spec) {
    return thisElement;
  }
  if (spec[0] === "#") {
    const referenceElement = getElementById(spec.slice(1));
    if (!referenceElement) {
      return null;
    }
    return referenceElement;
  }
  const relation = ["next", "prev", "this", "first", "last"].find(p => spec.startsWith(`${p}.`) || spec.startsWith(`${p}-`) || spec === p);
  if (!relation) {
    throw usageError(`Invalid search specification '${spec}'`);
  }
  const rest = spec.slice(lengthOf(relation));
  const matchOp = rest.slice(0, 1);
  let refOrCls = rest.slice(1);
  let selector;
  if (matchOp === ".") {
    selector = matchOp + refOrCls;
  } else {
    if (!refOrCls) {
      refOrCls = getData(thisElement, PREFIX_REF) || "";
    }
    if (!refOrCls) {
      throw usageError(`No reference name in '${spec}'`);
    }
    selector = `[${DATA_REF}="${refOrCls}"]`;
  }
  let referenceElement;
  if (relation === "first") {
    referenceElement = getFirstReferenceElement(selector);
  } else if (relation === "last") {
    referenceElement = getLastReferenceElement(selector);
  } else {
    if (relation === "this") {
      referenceElement = getThisReferenceElement(selector, thisElement);
    } else if (relation === "next") {
      referenceElement = getNextReferenceElement(selector, thisElement);
    } else if (relation === "prev") {
      referenceElement = getPrevReferenceElement(selector, thisElement);
    } else {
      {
        logError(bugError(`Unhandled relation case ${relation}`));
        return null;
      }
    }
  }
  if (!referenceElement) {
    return null;
  }
  return referenceElement;
};
const waitForReferenceElement = (spec, thisElement, timeout = 200) => waitForElement(() => getReferenceElement(spec, thisElement), timeout);
const PREFIX_REF = prefixName("ref");
const DATA_REF = prefixData(PREFIX_REF);
const getAllReferenceElements = selector => docQuerySelectorAll(selector);
const getFirstReferenceElement = selector => docQuerySelector(selector);
const getLastReferenceElement = selector => {
  const allRefs = getAllReferenceElements(selector);
  return allRefs && allRefs[lengthOf(allRefs) - 1] || null;
};
const getThisReferenceElement = (selector, thisElement) => thisElement.closest(selector);
const getNextReferenceElement = (selector, thisElement) => getNextOrPrevReferenceElement(selector, thisElement, false);
const getPrevReferenceElement = (selector, thisElement) => getNextOrPrevReferenceElement(selector, thisElement, true);
const getNextOrPrevReferenceElement = (selector, thisElement, goBackward) => {
  thisElement = getThisReferenceElement(selector, thisElement) || thisElement;
  if (!getDoc().contains(thisElement)) {
    return null;
  }
  const allRefs = getAllReferenceElements(selector);
  if (!allRefs) {
    return null;
  }
  const numRefs = lengthOf(allRefs);
  let refIndex = goBackward ? numRefs - 1 : -1;
  for (let i = 0; i < numRefs; i++) {
    const currentIsAfter = isNodeBAfterA(thisElement, allRefs[i]);
    if (allRefs[i] === thisElement || currentIsAfter) {
      refIndex = i + (goBackward ? -1 : currentIsAfter ? 0 : 1);
      break;
    }
  }
  return allRefs[refIndex] || null;
};

class Trigger extends Widget {
  static get(element, id) {
    const instance = super.get(element, id);
    if (isInstanceOf(instance, Trigger)) {
      return instance;
    }
    return null;
  }
  static register() {
    registerTrigger("run", (element, a, actions, config) => new Trigger(element, actions, config), {});
  }
  constructor(element, actions, config) {
    var _config$once, _config$oneWay, _config$doDelay, _config$undoDelay;
    super(element, config);
    const once = (_config$once = config === null || config === void 0 ? void 0 : config.once) !== null && _config$once !== void 0 ? _config$once : false;
    const oneWay = (_config$oneWay = config === null || config === void 0 ? void 0 : config.oneWay) !== null && _config$oneWay !== void 0 ? _config$oneWay : false;
    const delay = (config === null || config === void 0 ? void 0 : config.delay) || 0;
    const doDelay = (_config$doDelay = config === null || config === void 0 ? void 0 : config.doDelay) !== null && _config$doDelay !== void 0 ? _config$doDelay : delay;
    const undoDelay = (_config$undoDelay = config === null || config === void 0 ? void 0 : config.undoDelay) !== null && _config$undoDelay !== void 0 ? _config$undoDelay : delay;
    let lastCallId;
    let toggleState = false;
    const callActions = async (delay, callFn, newToggleState) => {
      if (this.isDisabled()) {
        return;
      }
      const myCallId = randId();
      lastCallId = myCallId;
      if (delay) {
        await waitForDelay(delay);
        if (lastCallId !== myCallId) {
          return;
        }
      }
      for (const action of actions) {
        callFn(action);
      }
      toggleState = newToggleState;
      if (toggleState && once) {
        remove(run);
        remove(reverse);
        remove(toggle);
      }
    };
    const run = wrapCallback(() => {
      callActions(doDelay, action => {
        action.do();
      }, true);
    });
    const reverse = wrapCallback(() => {
      if (!oneWay) {
        callActions(undoDelay, action => {
          action.undo();
        }, false);
      }
    });
    const toggle = wrapCallback(() => {
      callActions(toggleState ? undoDelay : doDelay, action => {
        action[S_TOGGLE]();
      }, !toggleState);
    });
    this.run = run.invoke;
    this.reverse = reverse.invoke;
    this[S_TOGGLE] = oneWay ? run.invoke : toggle.invoke;
    this.getActions = () => [...actions];
    this.getConfig = () => copyObject(config || {});
  }
}
const registerTrigger = (name, newTrigger, configValidator) => {
  const clsPref = prefixName(`on-${name}`);
  const newWidget = async element => {
    var _getData;
    const widgets = [];
    const baseConfigValidator = newBaseConfigValidator(element);
    const thisConfigValidator = isFunction(configValidator) ? await configValidator(element) : configValidator;
    const allSpecs = splitOn((_getData = getData(element, prefixName(`on-${name}`))) !== null && _getData !== void 0 ? _getData : "", TRIGGER_SEP, true);
    for (const cls of classList(element)) {
      if (cls.startsWith(`${clsPref}--`)) {
        allSpecs.push(cls.slice(lengthOf(clsPref) + 2));
      }
    }
    for (const spec of allSpecs) {
      var _config$actOn;
      const [tmp, configSpec] = splitOn(spec, OPTION_PREF_CHAR, true, 1);
      const [argSpec, allActionSpecs] = splitOn(tmp, ACTION_PREF_CHAR, true, 1);
      const args = filterBlank(splitOn(argSpec, ",", true)) || [];
      const config = await fetchWidgetConfig(configSpec, assign(baseConfigValidator, thisConfigValidator), OPTION_PREF_CHAR);
      const actionTarget = (_config$actOn = config.actOn) !== null && _config$actOn !== void 0 ? _config$actOn : element;
      const actions = [];
      for (const actionSpec of splitOn(allActionSpecs || "", ACTION_PREF_CHAR, true)) {
        const [name, actionArgsAndOptions] = splitOn(actionSpec, ACTION_ARGS_PREF_CHAR, true, 1);
        try {
          actions.push(await fetchAction(actionTarget, name, actionArgsAndOptions || ""));
        } catch (err) {
          if (isInstanceOf(err, LisnUsageError)) {
            continue;
          }
          throw err;
        }
      }
      widgets.push(await newTrigger(element, args, actions, config));
    }
    return widgets;
  };
  registerWidget(name, newWidget, null, {
    selector: `[class^="${clsPref}--"],[class*=" ${clsPref}--"],[data-${clsPref}]`
  });
};
const TRIGGER_SEP = ";";
const OPTION_PREF_CHAR = "+";
const ACTION_PREF_CHAR = "@";
const ACTION_ARGS_PREF_CHAR = ":";
const newBaseConfigValidator = element => {
  return {
    id: validateString,
    once: validateBoolean,
    oneWay: validateBoolean,
    delay: validateNumber,
    doDelay: validateNumber,
    undoDelay: validateNumber,
    actOn: (key, value) => {
      var _ref;
      return (_ref = isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref !== void 0 ? _ref : undefined;
    }
  };
};

class Enable {
  static register() {
    registerAction("enable", (element, ids) => new Enable(element, ...ids));
  }
  constructor(element, ...ids) {
    const {
      _enable,
      _disable,
      _toggleEnable
    } = getMethods$4(element, ids);
    _disable();
    this.do = _enable;
    this.undo = _disable;
    this[S_TOGGLE] = _toggleEnable;
  }
}
class Disable {
  static register() {
    registerAction("disable", (element, ids) => new Disable(element, ...ids));
  }
  constructor(element, ...ids) {
    const {
      _enable,
      _disable,
      _toggleEnable
    } = getMethods$4(element, ids);
    _enable();
    this.do = _disable;
    this.undo = _enable;
    this[S_TOGGLE] = _toggleEnable;
  }
}
class Run {
  static register() {
    registerAction("run", (element, ids) => new Run(element, ...ids));
  }
  constructor(element, ...ids) {
    const {
      _run,
      _reverse,
      _toggle
    } = getMethods$4(element, ids);
    this.do = _run;
    this.undo = _reverse;
    this[S_TOGGLE] = _toggle;
  }
}
const getMethods$4 = (element, ids) => {
  const triggerPromises = getTriggers(element, ids);
  const call = async method => {
    const triggers = await triggerPromises;
    for (const trigger of triggers) {
      trigger[method]();
    }
  };
  return {
    _enable: () => call("enable"),
    _disable: () => call("disable"),
    _toggleEnable: () => call("toggleEnable"),
    _run: () => call("run"),
    _reverse: () => call("reverse"),
    _toggle: () => call(S_TOGGLE)
  };
};
const getTriggers = async (element, ids) => {
  const triggers = [];
  if (!lengthOf(ids)) {
    logWarn("At least 1 ID is required for enable action");
    return triggers;
  }
  for (const id of ids) {
    let trigger = Trigger.get(element, id);
    if (!trigger) {
      await waitForDelay(0);
      trigger = Trigger.get(element, id);
      if (!trigger) {
        logWarn(`No trigger with ID ${id} for element ${formatAsString(element)}`);
        continue;
      }
    }
    triggers.push(trigger);
  }
  return triggers;
};

class ScrollTo {
  static register() {
    registerAction("scroll-to", (element, args, config) => {
      const offset = config ? {
        left: config.offsetX,
        top: config.offsetY
      } : undefined;
      return new ScrollTo(element, {
        scrollable: config === null || config === void 0 ? void 0 : config.scrollable,
        offset
      });
    }, newConfigValidator$6);
  }
  constructor(element, config) {
    const offset = config === null || config === void 0 ? void 0 : config.offset;
    const scrollable = config === null || config === void 0 ? void 0 : config.scrollable;
    const watcher = ScrollWatcher.reuse();
    let prevScrollTop = -1,
      prevScrollLeft = -1;
    this.do = async () => {
      const current = await watcher.fetchCurrentScroll();
      prevScrollTop = current[S_SCROLL_TOP];
      prevScrollLeft = current[S_SCROLL_LEFT];
      const action = await watcher.scrollTo(element, {
        offset,
        scrollable
      });
      await (action === null || action === void 0 ? void 0 : action.waitFor());
    };
    this.undo = async () => {
      if (prevScrollTop !== -1) {
        const action = await watcher.scrollTo({
          top: prevScrollTop,
          left: prevScrollLeft
        });
        await (action === null || action === void 0 ? void 0 : action.waitFor());
      }
    };
    this[S_TOGGLE] = async () => {
      const start = await watcher.fetchCurrentScroll();
      const canReverse = prevScrollTop !== -1;
      let hasReversed = false;
      const altTarget = {
        top: () => {
          hasReversed = true;
          return prevScrollTop;
        },
        left: prevScrollLeft
      };
      const action = await watcher.scrollTo(element, canReverse ? {
        altTarget,
        offset
      } : {
        offset
      });
      await (action === null || action === void 0 ? void 0 : action.waitFor());
      if (!hasReversed) {
        prevScrollTop = start[S_SCROLL_TOP];
        prevScrollLeft = start[S_SCROLL_LEFT];
      }
    };
  }
}
const newConfigValidator$6 = element => {
  return {
    offsetX: (key, value) => {
      var _validateNumber;
      return (_validateNumber = validateNumber(key, value)) !== null && _validateNumber !== void 0 ? _validateNumber : 0;
    },
    offsetY: (key, value) => {
      var _validateNumber2;
      return (_validateNumber2 = validateNumber(key, value)) !== null && _validateNumber2 !== void 0 ? _validateNumber2 : 0;
    },
    scrollable: (key, value) => {
      var _ref;
      return (_ref = isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref !== void 0 ? _ref : undefined;
    }
  };
};

class SetAttribute {
  static register() {
    registerAction("set-attribute", (element, args, config) => {
      return new SetAttribute(element, {
        [args[0]]: config || {}
      });
    }, configValidator$8);
  }
  constructor(element, attributes) {
    if (!attributes) {
      throw usageError("Attributes are required");
    }
    let isOn = false;
    const setAttrs = async on => {
      isOn = on;
      await waitForMutateTime();
      for (const attr in attributes) {
        const value = attributes[attr][on ? "on" : "off"];
        const attrName = camelToKebabCase(attr);
        if (isNullish(value)) {
          delAttr(element, attrName);
        } else {
          setAttr(element, attrName, value);
        }
      }
    };
    this.do = () => setAttrs(true);
    this.undo = () => setAttrs(false);
    this[S_TOGGLE] = () => setAttrs(!isOn);
    this.undo();
  }
}
const configValidator$8 = {
  on: validateString,
  off: validateString
};

class Show {
  static register() {
    registerAction("show", element => new Show(element));
  }
  constructor(element) {
    disableInitialTransition(element);
    hideElement(element);
    const {
      _show,
      _hide,
      _toggle
    } = getMethods$3(element);
    this.do = _show;
    this.undo = _hide;
    this[S_TOGGLE] = _toggle;
  }
}
class Hide {
  static register() {
    registerAction("hide", element => new Hide(element));
  }
  constructor(element) {
    disableInitialTransition(element);
    showElement(element);
    const {
      _show,
      _hide,
      _toggle
    } = getMethods$3(element);
    this.do = _hide;
    this.undo = _show;
    this[S_TOGGLE] = _toggle;
  }
}
const getMethods$3 = element => {
  return {
    _show: async () => {
      await showElement(element);
    },
    _hide: async () => {
      await hideElement(element);
    },
    _toggle: async () => {
      await toggleShowElement(element);
    }
  };
};

const isValidPosition = position => includes(POSITIONS, position);
const isValidTwoFoldPosition = position => position.match(TWO_FOLD_POSITION_REGEX) !== null;
const POSITIONS = [S_TOP, S_BOTTOM, S_LEFT, S_RIGHT];
const POSITIONS_OPTIONS_STR = "(" + POSITIONS.join("|") + ")";
const TWO_FOLD_POSITION_REGEX = RegExp(`^${POSITIONS_OPTIONS_STR}-${POSITIONS_OPTIONS_STR}$`);

const registerOpenable = (name, newOpenable, configValidator) => {
  registerWidget(name, (element, config) => {
    if (isHTMLElement(element)) {
      if (!Openable.get(element)) {
        return newOpenable(element, config);
      }
    } else {
      logError(usageError("Openable widget supports only HTMLElement"));
    }
    return null;
  }, configValidator);
};
class Openable extends Widget {
  static get(element) {
    return instances.get(element) || null;
  }
  constructor(element, properties) {
    super(element);
    const {
      isModal,
      isOffcanvas
    } = properties;
    const openCallbacks = newSet();
    const closeCallbacks = newSet();
    let isOpen = false;
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
      await setBoolData(root, PREFIX_IS_OPEN);
    };
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
        scrollWrapperToTop();
      }
      await unsetBoolData(root, PREFIX_IS_OPEN);
    };
    const scrollWrapperToTop = async () => {
      await waitForDelay(1000);
      await waitForMeasureTime();
      elScrollTo(outerWrapper, {
        top: 0,
        left: 0
      });
    };
    this.open = open;
    this.close = close;
    this[S_TOGGLE] = () => isOpen ? close() : open();
    this.onOpen = handler => openCallbacks.add(wrapCallback(handler));
    this.onClose = handler => closeCallbacks.add(wrapCallback(handler));
    this.isOpen = () => isOpen;
    this.getRoot = () => root;
    this.getContainer = () => container;
    this.getTriggers = () => [...triggers.keys()];
    this.getTriggerConfigs = () => newMap([...triggers.entries()]);
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
class Collapsible extends Openable {
  static register() {
    registerOpenable(WIDGET_NAME_COLLAPSIBLE, (el, config) => new Collapsible(el, config), collapsibleConfigValidator);
  }
  constructor(element, config) {
    var _config$autoClose, _config$reverse;
    const isHorizontal = config === null || config === void 0 ? void 0 : config.horizontal;
    const orientation = isHorizontal ? S_HORIZONTAL : S_VERTICAL;
    const onSetup = () => {
      for (const [trigger, triggerConfig] of this.getTriggerConfigs().entries()) {
        insertCollapsibleIcon(trigger, triggerConfig, this, config);
        setDataNow(trigger, PREFIX_ORIENTATION, orientation);
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
    const wrapper = childrenOf(root)[0];
    setData(root, PREFIX_ORIENTATION, orientation);
    setBoolData(root, PREFIX_REVERSE, (_config$reverse = config === null || config === void 0 ? void 0 : config.reverse) !== null && _config$reverse !== void 0 ? _config$reverse : false);
    disableInitialTransition(element, 100);
    disableInitialTransition(root, 100);
    disableInitialTransition(wrapper, 100);
    let disableTransitionTimer = null;
    const tempEnableTransition = async () => {
      await removeClasses(root, PREFIX_TRANSITION_DISABLE);
      await removeClasses(wrapper, PREFIX_TRANSITION_DISABLE);
      if (disableTransitionTimer) {
        clearTimer(disableTransitionTimer);
      }
      const transitionDuration = await getMaxTransitionDuration(root);
      disableTransitionTimer = setTimer(() => {
        if (this.isOpen()) {
          addClasses(root, PREFIX_TRANSITION_DISABLE);
          addClasses(wrapper, PREFIX_TRANSITION_DISABLE);
          disableTransitionTimer = null;
        }
      }, transitionDuration);
    };
    this.onOpen(tempEnableTransition);
    this.onClose(tempEnableTransition);
    const peek = config === null || config === void 0 ? void 0 : config.peek;
    if (peek) {
      (async () => {
        let peekSize = null;
        if (isString(peek)) {
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
    if (isHorizontal) {
      const updateWidth = async () => {
        const width = await getComputedStyleProp(root, S_WIDTH);
        await setStyleProp(element, VAR_JS_COLLAPSIBLE_WIDTH, width);
      };
      setTimer(updateWidth);
      this.onClose(updateWidth);
      this.onOpen(async () => {
        await updateWidth();
        waitForDelay(2000).then(() => {
          if (this.isOpen()) {
            delStyleProp(element, VAR_JS_COLLAPSIBLE_WIDTH);
          }
        });
      });
    }
  }
}
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
      setData(root, PREFIX_PLACE, position);
    }
    if (container && position === S_AUTO) {
      this.onOpen(async () => {
        const [contentSize, containerView] = await promiseAll([SizeWatcher.reuse().fetchCurrentSize(element), ViewWatcher.reuse().fetchCurrentView(container)]);
        const placement = await fetchPopupPlacement(contentSize, containerView);
        if (placement) {
          await setData(root, PREFIX_PLACE, placement);
        }
      });
    }
  }
}
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
    const position = (config === null || config === void 0 ? void 0 : config.position) || S_RIGHT;
    setData(this.getRoot(), PREFIX_PLACE, position);
  }
}
const instances = newWeakMap();
const WIDGET_NAME_COLLAPSIBLE = "collapsible";
const WIDGET_NAME_POPUP = "popup";
const WIDGET_NAME_MODAL = "modal";
const WIDGET_NAME_OFFCANVAS = "offcanvas";
const PREFIX_CLOSE_BTN = prefixName("close-button");
const PREFIX_IS_OPEN = prefixName("is-open");
const PREFIX_REVERSE = prefixName(S_REVERSE);
const PREFIX_PEEK = prefixName("peek");
const PREFIX_OPENS_ON_HOVER = prefixName("opens-on-hover");
const PREFIX_LINE = prefixName("line");
const PREFIX_ICON_POSITION = prefixName("icon-position");
const PREFIX_TRIGGER_ICON = prefixName("trigger-icon");
const PREFIX_ICON_WRAPPER = prefixName("icon-wrapper");
const S_AUTO = "auto";
const S_ARIA_EXPANDED = ARIA_PREFIX + "expanded";
const S_ARIA_MODAL = ARIA_PREFIX + "modal";
const VAR_PEEK_SIZE = prefixCssVar("peek-size");
const VAR_JS_COLLAPSIBLE_WIDTH = prefixCssJsVar("collapsible-width");
const MIN_CLICK_TIME_AFTER_HOVER_OPEN = 1000;
const S_ARROW_UP = `${S_ARROW}-${S_UP}`;
const S_ARROW_DOWN = `${S_ARROW}-${S_DOWN}`;
const S_ARROW_LEFT = `${S_ARROW}-${S_LEFT}`;
const S_ARROW_RIGHT = `${S_ARROW}-${S_RIGHT}`;
const ARROW_TYPES = [S_ARROW_UP, S_ARROW_DOWN, S_ARROW_LEFT, S_ARROW_RIGHT];
const ICON_CLOSED_TYPES = ["plus", ...ARROW_TYPES];
const ICON_OPEN_TYPES = ["minus", "x", ...ARROW_TYPES];
const isValidIconClosed = value => includes(ICON_CLOSED_TYPES, value);
const isValidIconOpen = value => includes(ICON_OPEN_TYPES, value);
const triggerConfigValidator = {
  id: validateString,
  className: (key, value) => validateStrList(key, toArrayIfSingle(value)),
  autoClose: validateBoolean,
  icon: (key, value) => value && toBool(value) === false ? false : validateString(key, value, isValidPosition),
  iconClosed: (key, value) => validateString(key, value, isValidIconClosed),
  iconOpen: (key, value) => validateString(key, value, isValidIconOpen),
  hover: validateBoolean
};
const collapsibleConfigValidator = {
  id: validateString,
  className: (key, value) => validateStrList(key, toArrayIfSingle(value)),
  horizontal: validateBoolean,
  reverse: validateBoolean,
  peek: validateBooleanOrString,
  autoClose: validateBoolean,
  icon: (key, value) => toBool(value) === false ? false : validateString(key, value, isValidPosition),
  iconClosed: (key, value) => validateString(key, value, isValidIconClosed),
  iconOpen: (key, value) => validateString(key, value, isValidIconOpen)
};
const popupConfigValidator = {
  id: validateString,
  className: (key, value) => validateStrList(key, toArrayIfSingle(value)),
  closeButton: validateBoolean,
  position: (key, value) => validateString(key, value, v => v === S_AUTO || isValidPosition(v) || isValidTwoFoldPosition(v)),
  autoClose: validateBoolean
};
const modalConfigValidator = {
  id: validateString,
  className: (key, value) => validateStrList(key, toArrayIfSingle(value)),
  closeButton: validateBoolean,
  autoClose: validateBoolean
};
const offcanvasConfigValidator = {
  id: validateString,
  className: (key, value) => validateStrList(key, toArrayIfSingle(value)),
  closeButton: validateBoolean,
  position: (key, value) => validateString(key, value, isValidPosition),
  autoClose: validateBoolean
};
const getPrefixedNames = name => {
  const pref = prefixName(name);
  return {
    _root: `${pref}__root`,
    _overlay: `${pref}__overlay`,
    _innerWrapper: `${pref}__inner-wrapper`,
    _outerWrapper: `${pref}__outer-wrapper`,
    _content: `${pref}__content`,
    _container: `${pref}__container`,
    _trigger: `${pref}__trigger`,
    _containerForSelect: `${pref}-container`,
    _triggerForSelect: `${pref}-trigger`,
    _contentId: `${pref}-content-id`
  };
};
const findContainer = (content, cls) => {
  const currWidget = instances.get(content);
  let childRef = (currWidget === null || currWidget === void 0 ? void 0 : currWidget.getRoot()) || content;
  if (!parentOf(childRef)) {
    childRef = content;
  }
  let container = childRef.closest(`.${cls}`);
  if (!container) {
    container = parentOf(childRef);
  }
  return container;
};
const findTriggers = (content, prefixedNames) => {
  const container = findContainer(content, prefixedNames._containerForSelect);
  const getTriggerSelector = suffix => `.${prefixedNames._triggerForSelect}${suffix},` + `[data-${prefixedNames._triggerForSelect}]${suffix}`;
  const contentId = getData(content, prefixedNames._contentId);
  let triggers = [];
  if (contentId) {
    triggers = [...docQuerySelectorAll(getTriggerSelector(`[data-${prefixedNames._contentId}="${contentId}"]`))];
  } else if (container) {
    triggers = [...arrayFrom(querySelectorAll(container, getTriggerSelector(`:not([data-${prefixedNames._contentId}])`))).filter(t => !content.contains(t))];
  }
  return triggers;
};
const getTriggersFrom = (content, inputTriggers, wrapTriggers, prefixedNames) => {
  const triggerMap = newMap();
  inputTriggers = inputTriggers || findTriggers(content, prefixedNames);
  const addTrigger = (trigger, triggerConfig) => {
    if (wrapTriggers) {
      const wrapper = createElement(isInlineTag(tagName(trigger)) ? "span" : "div");
      wrapElement(trigger, {
        wrapper,
        ignoreMove: true
      });
      trigger = wrapper;
    }
    triggerMap.set(trigger, triggerConfig);
  };
  if (isArray(inputTriggers)) {
    for (const trigger of inputTriggers) {
      addTrigger(trigger, getWidgetConfig(getData(trigger, prefixedNames._triggerForSelect), triggerConfigValidator));
    }
  } else if (isInstanceOf(inputTriggers, Map)) {
    for (const [trigger, triggerConfig] of inputTriggers.entries()) {
      addTrigger(trigger, getWidgetConfig(triggerConfig, triggerConfigValidator));
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
  const innerWrapper = createElement("div");
  addClasses(innerWrapper, prefixedNames._innerWrapper);
  const outerWrapper = wrapElementNow(innerWrapper);
  let root;
  let placeholder;
  if (properties.isOffcanvas) {
    addClasses(outerWrapper, prefixedNames._outerWrapper);
    root = wrapElementNow(outerWrapper);
    placeholder = createElement("div");
    const overlay = createElement("div");
    addClasses(overlay, prefixedNames._overlay);
    moveElement(overlay, {
      to: root
    });
  } else {
    root = placeholder = outerWrapper;
  }
  if (properties.id) {
    root.id = properties.id;
  }
  if (properties.className) {
    addClassesNow(root, ...toArrayIfSingle(properties.className));
  }
  unsetBoolData(root, PREFIX_IS_OPEN);
  const domID = getOrAssignID(root, properties.name);
  if (properties.isModal) {
    setAttr(root, S_ROLE, "dialog");
    setAttr(root, S_ARIA_MODAL);
  }
  addClasses(root, prefixedNames._root);
  disableInitialTransition(root);
  if (properties.closeButton) {
    const closeBtn = createButton("Close");
    addClasses(closeBtn, PREFIX_CLOSE_BTN);
    addEventListenerTo(closeBtn, S_CLICK, () => {
      widget.close();
    });
    moveElement(closeBtn, {
      to: properties.isOffcanvas ? root : innerWrapper
    });
  }
  for (const cls of [settings.lightThemeClassName, settings.darkThemeClassName]) {
    if (hasClass(content, cls)) {
      addClasses(root, cls);
    }
  }
  const elements = {
    content,
    root,
    container,
    outerWrapper,
    triggers
  };
  widget.onClose(async () => {
    for (const trigger of triggers.keys()) {
      delData(trigger, PREFIX_OPENS_ON_HOVER);
      unsetAttr(trigger, S_ARIA_EXPANDED);
      await unsetBoolData(trigger, PREFIX_IS_OPEN);
    }
  });
  widget.onDestroy(async () => {
    await waitForMutateTime();
    replaceElementNow(placeholder, content, {
      ignoreMove: true
    });
    moveElementNow(root);
    removeClassesNow(content, prefixedNames._content);
    if (container) {
      removeClassesNow(container, prefixedNames._container);
    }
    for (const [trigger, triggerConfig] of triggers.entries()) {
      delAttr(trigger, S_ARIA_CONTROLS);
      delAttr(trigger, S_ARIA_EXPANDED);
      delDataNow(trigger, PREFIX_OPENS_ON_HOVER);
      delDataNow(trigger, PREFIX_IS_OPEN);
      removeClassesNow(trigger, prefixedNames._trigger, ...((triggerConfig === null || triggerConfig === void 0 ? void 0 : triggerConfig.className) || []));
      if (trigger.id === (triggerConfig === null || triggerConfig === void 0 ? void 0 : triggerConfig.id)) {
        trigger.id = "";
      }
      if (wrapTriggers) {
        replaceElementNow(trigger, childrenOf(trigger)[0], {
          ignoreMove: true
        });
      }
    }
    triggers.clear();
    for (const el of [content, ...triggers.keys()]) {
      if (instances.get(el) === widget) {
        deleteKey(instances, el);
      }
    }
  });
  const currWidget = instances.get(content);
  for (const el of [content, ...triggers.keys()]) {
    instances.set(el, widget);
  }
  waitForInteractive().then(currWidget === null || currWidget === void 0 ? void 0 : currWidget.destroy).then(waitForMutateTime).then(() => {
    if (widget.isDestroyed()) {
      return;
    }
    addClassesNow(content, prefixedNames._content);
    if (container) {
      addClassesNow(container, prefixedNames._container);
    }
    if (properties.isOffcanvas) {
      moveElementNow(root, {
        to: getBody(),
        ignoreMove: true
      });
    }
    moveElementNow(placeholder, {
      to: content,
      position: "before",
      ignoreMove: true
    });
    moveElementNow(content, {
      to: innerWrapper,
      ignoreMove: true
    });
    for (const [trigger, triggerConfig] of triggers.entries()) {
      setAttr(trigger, S_ARIA_CONTROLS, domID);
      unsetAttr(trigger, S_ARIA_EXPANDED);
      setBoolDataNow(trigger, PREFIX_OPENS_ON_HOVER, triggerConfig[S_HOVER]);
      unsetBoolDataNow(trigger, PREFIX_IS_OPEN);
      addClassesNow(trigger, prefixedNames._trigger, ...((triggerConfig === null || triggerConfig === void 0 ? void 0 : triggerConfig.className) || []));
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
  const doc = getDoc();
  let hoverTimeOpened = 0;
  let isPointerOver = false;
  let activeTrigger = null;
  const isTrigger = element => includes(arrayFrom(triggers.keys()), element.closest(getDefaultWidgetSelector(prefixedNames._trigger)));
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
  const toggleTrigger = (event, openIt) => {
    const trigger = currentTargetOf(event);
    if (isElement(trigger)) {
      if (shouldPreventDefault(trigger)) {
        preventDefault(event);
      }
      if (openIt !== false && widget.isOpen() && timeSince(hoverTimeOpened) < MIN_CLICK_TIME_AFTER_HOVER_OPEN) {
        return;
      }
      if (openIt !== null && openIt !== void 0 ? openIt : !widget.isOpen()) {
        activeTrigger = trigger;
        setAttr(trigger, S_ARIA_EXPANDED);
        setBoolData(trigger, PREFIX_IS_OPEN);
        widget.open();
        if (usesAutoClose(trigger)) {
          if (usesHover(trigger)) {
            addEventListenerTo(root, S_POINTERENTER, setIsPointerOver);
            addEventListenerTo(root, S_POINTERLEAVE, pointerLeft);
          }
        }
      } else {
        widget.close();
      }
    }
  };
  const setIsPointerOver = () => {
    isPointerOver = true;
  };
  const unsetIsPointerOver = event => {
    isPointerOver = isPointerOver && isTouchPointerEvent(event);
  };
  const pointerEntered = event => {
    setIsPointerOver();
    if (!widget.isOpen()) {
      hoverTimeOpened = timeNow();
      toggleTrigger(event, true);
    }
  };
  const pointerLeft = event => {
    unsetIsPointerOver(event);
    const trigger = currentTargetOf(event);
    if (isElement(trigger) && usesAutoClose(trigger)) {
      setTimer(() => {
        if (!isPointerOver) {
          widget.close();
        }
      }, properties.isOffcanvas ? 300 : 50);
    }
  };
  const closeIfEscape = event => {
    if (event.key === "Escape") {
      widget.close();
    }
  };
  const closeIfClickOutside = event => {
    const target = targetOf(event);
    if (target === doc || isElement(target) && !content.contains(target) && !isTrigger(target)) {
      widget.close();
    }
  };
  const maybeSetupAutoCloseListeners = (trigger, remove) => {
    if (usesAutoClose(trigger)) {
      const addOrRemove = remove ? removeEventListenerFrom : addEventListenerTo;
      addOrRemove(doc, "keyup", closeIfEscape);
      setTimer(() => addOrRemove(doc, S_CLICK, closeIfClickOutside), 100);
      if (trigger && usesHover(trigger)) {
        addOrRemove(trigger, S_POINTERLEAVE, pointerLeft);
      }
    }
  };
  const setupOrCleanup = remove => {
    const addOrRemove = remove ? removeEventListenerFrom : addEventListenerTo;
    for (const [trigger, triggerConfig] of triggers.entries()) {
      addOrRemove(trigger, S_CLICK, toggleTrigger);
      if (triggerConfig[S_HOVER]) {
        addOrRemove(trigger, S_POINTERENTER, pointerEntered);
      }
    }
  };
  setupOrCleanup(false);
  widget.onOpen(() => {
    maybeSetupAutoCloseListeners(activeTrigger, false);
  });
  widget.onClose(() => {
    hoverTimeOpened = 0;
    isPointerOver = false;
    removeEventListenerFrom(root, S_POINTERENTER, setIsPointerOver);
    removeEventListenerFrom(root, S_POINTERLEAVE, pointerLeft);
    maybeSetupAutoCloseListeners(activeTrigger, true);
    activeTrigger = null;
  });
  widget.onDestroy(() => {
    setupOrCleanup(true);
  });
};
const insertCollapsibleIcon = (trigger, triggerConfig, widget, widgetConfig) => {
  var _triggerConfig$icon, _ref2, _triggerConfig$iconCl, _ref3, _triggerConfig$iconOp;
  const iconPosition = (_triggerConfig$icon = triggerConfig.icon) !== null && _triggerConfig$icon !== void 0 ? _triggerConfig$icon : widgetConfig === null || widgetConfig === void 0 ? void 0 : widgetConfig.icon;
  const iconClosed = (_ref2 = (_triggerConfig$iconCl = triggerConfig.iconClosed) !== null && _triggerConfig$iconCl !== void 0 ? _triggerConfig$iconCl : widgetConfig === null || widgetConfig === void 0 ? void 0 : widgetConfig.iconClosed) !== null && _ref2 !== void 0 ? _ref2 : "plus";
  const iconOpen = (_ref3 = (_triggerConfig$iconOp = triggerConfig.iconOpen) !== null && _triggerConfig$iconOp !== void 0 ? _triggerConfig$iconOp : widgetConfig === null || widgetConfig === void 0 ? void 0 : widgetConfig.iconOpen) !== null && _ref3 !== void 0 ? _ref3 : "minus";
  if (iconPosition) {
    addClasses(trigger, PREFIX_ICON_WRAPPER);
    setData(trigger, PREFIX_ICON_POSITION, iconPosition);
    const icon = createElement("span");
    setDataNow(icon, PREFIX_TRIGGER_ICON, iconClosed);
    for (let l = 0; l < 2; l++) {
      const line = createElement("span");
      addClassesNow(line, PREFIX_LINE);
      moveElementNow(line, {
        to: icon
      });
    }
    moveElement(icon, {
      to: trigger,
      ignoreMove: true
    });
    widget.onOpen(() => {
      if (getBoolData(trigger, PREFIX_IS_OPEN)) {
        setData(icon, PREFIX_TRIGGER_ICON, iconOpen);
      }
    });
    widget.onClose(() => {
      setData(icon, PREFIX_TRIGGER_ICON, iconClosed);
    });
  }
};
const fetchPopupPlacement = async (contentSize, containerView) => {
  const containerPosition = containerView.relative;
  const containerTop = containerPosition[S_TOP];
  const containerBottom = containerPosition[S_BOTTOM];
  const containerLeft = containerPosition[S_LEFT];
  const containerRight = containerPosition[S_RIGHT];
  const containerHMiddle = containerPosition.hMiddle;
  const containerVMiddle = containerPosition.vMiddle;
  const vpSize = await fetchViewportSize();
  const popupWidth = contentSize.border[S_WIDTH] / vpSize[S_WIDTH];
  const popupHeight = contentSize.border[S_HEIGHT] / vpSize[S_HEIGHT];
  const placementVars = {
    top: containerTop - popupHeight,
    bottom: 1 - (containerBottom + popupHeight),
    left: containerLeft - popupWidth,
    right: 1 - (containerRight + popupWidth)
  };
  const placement = keyWithMaxVal(placementVars);
  if (placement === undefined) {
    return;
  }
  let finalPlacement = placement;
  let alignmentVars;
  switch (placement) {
    case S_TOP:
    case S_BOTTOM:
      alignmentVars = {
        left: 1 - (containerLeft + popupWidth),
        right: containerRight - popupWidth,
        middle: min(containerHMiddle - popupWidth / 2, 1 - (containerHMiddle + popupWidth / 2))
      };
      break;
    case S_LEFT:
    case S_RIGHT:
      alignmentVars = {
        top: 1 - (containerTop + popupHeight),
        bottom: containerBottom - popupHeight,
        middle: min(containerVMiddle - popupHeight / 2, 1 - (containerVMiddle + popupHeight / 2))
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

class Open {
  static register() {
    registerAction("open", element => new Open(element));
  }
  constructor(element) {
    const open = widget => widget === null || widget === void 0 ? void 0 : widget.open();
    const close = widget => widget === null || widget === void 0 ? void 0 : widget.close();
    const toggle = widget => widget === null || widget === void 0 ? void 0 : widget.toggle();
    const widgetPromise = fetchUniqueWidget("openable", element, Openable);
    this.do = () => widgetPromise.then(open);
    this.undo = () => widgetPromise.then(close);
    this[S_TOGGLE] = () => widgetPromise.then(toggle);
  }
}

class Pager extends Widget {
  static get(element) {
    const instance = super.get(element, DUMMY_ID$9);
    if (isInstanceOf(instance, Pager)) {
      return instance;
    }
    return null;
  }
  static register() {
    registerWidget(WIDGET_NAME$9, (element, config) => {
      if (!Pager.get(element)) {
        return new Pager(element, config);
      }
      return null;
    }, configValidator$7);
  }
  constructor(element, config) {
    var _Pager$get;
    const destroyPromise = (_Pager$get = Pager.get(element)) === null || _Pager$get === void 0 ? void 0 : _Pager$get.destroy();
    super(element, {
      id: DUMMY_ID$9
    });
    const pages = (config === null || config === void 0 ? void 0 : config.pages) || [];
    const toggles = (config === null || config === void 0 ? void 0 : config.toggles) || [];
    const switches = (config === null || config === void 0 ? void 0 : config.switches) || [];
    const nextPrevSwitch = {
      _next: (config === null || config === void 0 ? void 0 : config.nextSwitch) || null,
      _prev: (config === null || config === void 0 ? void 0 : config.prevSwitch) || null
    };
    const pageSelector = getDefaultWidgetSelector(PREFIX_PAGE__FOR_SELECT);
    const toggleSelector = getDefaultWidgetSelector(PREFIX_TOGGLE__FOR_SELECT);
    const switchSelector = getDefaultWidgetSelector(PREFIX_SWITCH__FOR_SELECT);
    const nextSwitchSelector = getDefaultWidgetSelector(PREFIX_NEXT_SWITCH__FOR_SELECT);
    const prevSwitchSelector = getDefaultWidgetSelector(PREFIX_PREV_SWITCH__FOR_SELECT);
    if (!lengthOf(pages)) {
      pages.push(...querySelectorAll(element, pageSelector));
      if (!lengthOf(pages)) {
        pages.push(...getVisibleContentChildren(element).filter(e => !e.matches(switchSelector)));
      }
    }
    if (!lengthOf(toggles)) {
      toggles.push(...querySelectorAll(element, toggleSelector));
    }
    if (!lengthOf(switches)) {
      switches.push(...querySelectorAll(element, switchSelector));
    }
    if (!nextPrevSwitch._next) {
      nextPrevSwitch._next = querySelector(element, nextSwitchSelector);
    }
    if (!nextPrevSwitch._prev) {
      nextPrevSwitch._prev = querySelector(element, prevSwitchSelector);
    }
    const numPages = lengthOf(pages);
    if (numPages < 2) {
      throw usageError("Pager must have more than 1 page");
    }
    for (const page of pages) {
      if (!element.contains(page) || page === element) {
        throw usageError("Pager's pages must be its descendants");
      }
    }
    const components = {
      _pages: pages,
      _toggles: toggles,
      _switches: switches,
      _nextPrevSwitch: nextPrevSwitch
    };
    const methods = getMethods$2(this, components, element, config);
    (destroyPromise || promiseResolve()).then(() => {
      if (this.isDestroyed()) {
        return;
      }
      init$3(this, element, components, config, methods);
    });
    this.nextPage = () => methods._nextPage();
    this.prevPage = () => methods._prevPage();
    this.goToPage = pageNum => methods._goToPage(pageNum);
    this.disablePage = methods._disablePage;
    this.enablePage = methods._enablePage;
    this.togglePage = methods._togglePage;
    this.isPageDisabled = methods._isPageDisabled;
    this.getCurrentPage = methods._getCurrentPage;
    this.getPreviousPage = methods._getPreviousPage;
    this.getCurrentPageNum = methods._getCurrentPageNum;
    this.getPreviousPageNum = methods._getPreviousPageNum;
    this.onTransition = methods._onTransition;
    this.getPages = () => [...pages];
    this.getSwitches = () => [...switches];
    this.getToggles = () => [...toggles];
  }
}
const MIN_TIME_BETWEEN_WHEEL = 1000;
const S_CURRENT = "current";
const S_ARIA_CURRENT = ARIA_PREFIX + S_CURRENT;
const S_COVERED = "covered";
const S_NEXT = "next";
const S_TOTAL_PAGES = "total-pages";
const S_CURRENT_PAGE = "current-page";
const S_PAGE_NUMBER = "page-number";
const WIDGET_NAME$9 = "pager";
const PREFIXED_NAME$5 = prefixName(WIDGET_NAME$9);
const PREFIX_ROOT$4 = `${PREFIXED_NAME$5}__root`;
const PREFIX_PAGE_CONTAINER = `${PREFIXED_NAME$5}__page-container`;
const PREFIX_PAGE = `${PREFIXED_NAME$5}__page`;
const PREFIX_PAGE__FOR_SELECT = `${PREFIXED_NAME$5}-page`;
const PREFIX_TOGGLE__FOR_SELECT = `${PREFIXED_NAME$5}-toggle`;
const PREFIX_SWITCH__FOR_SELECT = `${PREFIXED_NAME$5}-switch`;
const PREFIX_NEXT_SWITCH__FOR_SELECT = `${PREFIXED_NAME$5}-next-switch`;
const PREFIX_PREV_SWITCH__FOR_SELECT = `${PREFIXED_NAME$5}-prev-switch`;
const PREFIX_IS_FULLSCREEN = prefixName("is-fullscreen");
const PREFIX_USE_PARALLAX = prefixName("use-parallax");
const PREFIX_TOTAL_PAGES = prefixName(S_TOTAL_PAGES);
const PREFIX_CURRENT_PAGE = prefixName(S_CURRENT_PAGE);
const PREFIX_CURRENT_PAGE_IS_LAST = `${PREFIX_CURRENT_PAGE}-is-last`;
const PREFIX_CURRENT_PAGE_IS_FIRST_ENABLED = `${PREFIX_CURRENT_PAGE}-is-first-enabled`;
const PREFIX_CURRENT_PAGE_IS_LAST_ENABLED = `${PREFIX_CURRENT_PAGE_IS_LAST}-enabled`;
const PREFIX_PAGE_STATE = prefixName("page-state");
const PREFIX_PAGE_NUMBER = prefixName(S_PAGE_NUMBER);
const VAR_TOTAL_PAGES = prefixCssJsVar(S_TOTAL_PAGES);
const VAR_CURRENT_PAGE = prefixCssJsVar(S_CURRENT_PAGE);
const VAR_PAGE_NUMBER = prefixCssJsVar(S_PAGE_NUMBER);
const DUMMY_ID$9 = PREFIXED_NAME$5;
const configValidator$7 = {
  initialPage: validateNumber,
  fullscreen: validateBoolean,
  parallax: validateBoolean,
  horizontal: validateBoolean,
  useGestures: (key, value) => {
    if (isNullish(value)) {
      return undefined;
    }
    const bool = toBool(value);
    if (bool !== null) {
      return bool;
    }
    return validateStrList("useGestures", validateString(key, value), isValidInputDevice) || true;
  },
  alignGestureDirection: validateBoolean,
  preventDefault: validateBoolean
};
const fetchClosestScrollable = element => waitForMeasureTime().then(() => {
  var _getClosestScrollable;
  return (_getClosestScrollable = getClosestScrollable(element, {
    active: true
  })) !== null && _getClosestScrollable !== void 0 ? _getClosestScrollable : undefined;
});
const setPageNumber = (components, pageNum) => {
  let lastPromise = promiseResolve();
  for (const el of [components._pages[pageNum - 1], components._toggles[pageNum - 1], components._switches[pageNum - 1]]) {
    if (el) {
      setData(el, PREFIX_PAGE_NUMBER, pageNum + "");
      lastPromise = setStyleProp(el, VAR_PAGE_NUMBER, pageNum + "");
    }
  }
  return lastPromise;
};
const setCurrentPage = (pagerEl, currPageNum, numPages, isPageDisabled) => {
  let isFirstEnabled = true;
  let isLastEnabled = true;
  for (let n = 1; n <= numPages; n++) {
    if (!isPageDisabled(n)) {
      if (n < currPageNum) {
        isFirstEnabled = false;
      } else if (n > currPageNum) {
        isLastEnabled = false;
      }
    }
  }
  setStyleProp(pagerEl, VAR_CURRENT_PAGE, currPageNum + "");
  setData(pagerEl, PREFIX_CURRENT_PAGE, currPageNum + "");
  setBoolData(pagerEl, PREFIX_CURRENT_PAGE_IS_LAST, numPages === numPages);
  setBoolData(pagerEl, PREFIX_CURRENT_PAGE_IS_FIRST_ENABLED, isFirstEnabled);
  return setBoolData(pagerEl, PREFIX_CURRENT_PAGE_IS_LAST_ENABLED, isLastEnabled);
};
const setPageState = async (components, pageNum, state) => {
  for (const el of [components._pages[pageNum - 1], components._toggles[pageNum - 1], components._switches[pageNum - 1]]) {
    if (el) {
      await setData(el, PREFIX_PAGE_STATE, state);
    }
  }
};
const init$3 = (widget, element, components, config, methods) => {
  var _pages$, _config$initialPage, _config$fullscreen, _config$parallax, _config$horizontal, _config$useGestures, _config$alignGestureD, _config$preventDefaul;
  const pages = components._pages;
  const toggles = components._toggles;
  const switches = components._switches;
  const nextSwitch = components._nextPrevSwitch._next;
  const prevSwitch = components._nextPrevSwitch._prev;
  const pageContainer = (_pages$ = pages[0]) === null || _pages$ === void 0 ? void 0 : _pages$.parentElement;
  let initialPage = toInt((_config$initialPage = config === null || config === void 0 ? void 0 : config.initialPage) !== null && _config$initialPage !== void 0 ? _config$initialPage : 1);
  const isFullscreen = (_config$fullscreen = config === null || config === void 0 ? void 0 : config.fullscreen) !== null && _config$fullscreen !== void 0 ? _config$fullscreen : false;
  const isParallax = (_config$parallax = config === null || config === void 0 ? void 0 : config.parallax) !== null && _config$parallax !== void 0 ? _config$parallax : false;
  const isHorizontal = (_config$horizontal = config === null || config === void 0 ? void 0 : config.horizontal) !== null && _config$horizontal !== void 0 ? _config$horizontal : false;
  const orientation = isHorizontal ? S_HORIZONTAL : S_VERTICAL;
  const useGestures = (_config$useGestures = config === null || config === void 0 ? void 0 : config.useGestures) !== null && _config$useGestures !== void 0 ? _config$useGestures : true;
  const alignGestureDirection = (_config$alignGestureD = config === null || config === void 0 ? void 0 : config.alignGestureDirection) !== null && _config$alignGestureD !== void 0 ? _config$alignGestureD : false;
  const preventDefault = (_config$preventDefaul = config === null || config === void 0 ? void 0 : config.preventDefault) !== null && _config$preventDefaul !== void 0 ? _config$preventDefaul : true;
  const scrollWatcher = ScrollWatcher.reuse();
  let gestureWatcher = null;
  let viewWatcher = null;
  if (isFullscreen) {
    viewWatcher = ViewWatcher.reuse({
      rootMargin: "0px",
      threshold: 0.3
    });
  }
  if (useGestures) {
    gestureWatcher = GestureWatcher.reuse();
  }
  const getGestureOptions = directions => {
    return {
      devices: isBoolean(useGestures) ? undefined : useGestures,
      intents: [S_DRAG, S_SCROLL],
      directions,
      deltaThreshold: 25,
      preventDefault
    };
  };
  const scrollToPager = async () => {
    scrollWatcher.scrollTo(element, {
      scrollable: await fetchClosestScrollable(element)
    });
  };
  const transitionOnGesture = (target, data) => {
    const swapDirection = data.intent === S_DRAG;
    if (includes([S_LEFT, S_UP], data.direction)) {
      (swapDirection ? methods._nextPage : methods._prevPage)(data);
    } else {
      (swapDirection ? methods._prevPage : methods._nextPage)(data);
    }
  };
  const addWatcher = () => {
    var _gestureWatcher, _viewWatcher;
    (_gestureWatcher = gestureWatcher) === null || _gestureWatcher === void 0 || _gestureWatcher.onGesture(element, transitionOnGesture, getGestureOptions(alignGestureDirection ? isHorizontal ? [S_LEFT, S_RIGHT] : [S_UP, S_DOWN] : undefined));
    (_viewWatcher = viewWatcher) === null || _viewWatcher === void 0 || _viewWatcher.onView(element, scrollToPager, {
      views: "at"
    });
  };
  const getPageNumForEvent = event => {
    const target = currentTargetOf(event);
    return isElement(target) ? toInt(getData(target, PREFIX_PAGE_NUMBER)) : 0;
  };
  const toggleClickListener = event => {
    const pageNum = getPageNumForEvent(event);
    methods._togglePage(pageNum);
  };
  const switchClickListener = event => {
    const pageNum = getPageNumForEvent(event);
    methods._goToPage(pageNum);
  };
  const nextSwitchClickListener = () => methods._nextPage();
  const prevSwitchClickListener = () => methods._prevPage();
  const removeWatcher = () => {
    var _gestureWatcher2, _viewWatcher2;
    (_gestureWatcher2 = gestureWatcher) === null || _gestureWatcher2 === void 0 || _gestureWatcher2.offGesture(element, transitionOnGesture);
    (_viewWatcher2 = viewWatcher) === null || _viewWatcher2 === void 0 || _viewWatcher2.offView(element, scrollToPager);
  };
  widget.onDisable(removeWatcher);
  widget.onEnable(addWatcher);
  widget.onDestroy(async () => {
    await waitForMutateTime();
    delDataNow(element, PREFIX_ORIENTATION);
    delDataNow(element, PREFIX_IS_FULLSCREEN);
    delDataNow(element, PREFIX_USE_PARALLAX);
    delDataNow(element, PREFIX_CURRENT_PAGE);
    delDataNow(element, PREFIX_CURRENT_PAGE_IS_LAST);
    delDataNow(element, PREFIX_CURRENT_PAGE_IS_FIRST_ENABLED);
    delDataNow(element, PREFIX_CURRENT_PAGE_IS_LAST_ENABLED);
    delDataNow(element, PREFIX_TOTAL_PAGES);
    delStylePropNow(element, VAR_CURRENT_PAGE);
    delStylePropNow(element, VAR_TOTAL_PAGES);
    for (let idx = 0; idx < lengthOf(pages); idx++) {
      removeClassesNow(pages[idx], PREFIX_PAGE);
      for (const [el, listener] of [[pages[idx], null], [toggles[idx], toggleClickListener], [switches[idx], switchClickListener]]) {
        if (el) {
          delDataNow(el, PREFIX_PAGE_STATE);
          delDataNow(el, PREFIX_PAGE_NUMBER);
          delStylePropNow(el, VAR_PAGE_NUMBER);
          if (listener) {
            removeEventListenerFrom(el, S_CLICK, listener);
          }
        }
      }
      delAttr(pages[idx], S_ARIA_CURRENT);
    }
    if (nextSwitch) {
      removeEventListenerFrom(nextSwitch, S_CLICK, nextSwitchClickListener);
    }
    if (prevSwitch) {
      removeEventListenerFrom(prevSwitch, S_CLICK, prevSwitchClickListener);
    }
    removeClassesNow(element, PREFIX_ROOT$4);
    if (pageContainer) {
      removeClassesNow(pageContainer, PREFIX_PAGE_CONTAINER);
    }
  });
  addWatcher();
  addClasses(element, PREFIX_ROOT$4);
  if (pageContainer) {
    addClasses(pageContainer, PREFIX_PAGE_CONTAINER);
  }
  const numPages = lengthOf(pages);
  setData(element, PREFIX_ORIENTATION, orientation);
  setBoolData(element, PREFIX_IS_FULLSCREEN, isFullscreen);
  setBoolData(element, PREFIX_USE_PARALLAX, isParallax);
  setData(element, PREFIX_TOTAL_PAGES, numPages + "");
  setStyleProp(element, VAR_TOTAL_PAGES, (numPages || 1) + "");
  for (const page of pages) {
    disableInitialTransition(page);
    addClasses(page, PREFIX_PAGE);
  }
  for (let idx = 0; idx < numPages; idx++) {
    setPageNumber(components, idx + 1);
    setPageState(components, idx + 1, S_NEXT);
    for (const [el, listener] of [[toggles[idx], toggleClickListener], [switches[idx], switchClickListener]]) {
      if (el) {
        addEventListenerTo(el, S_CLICK, listener);
      }
    }
  }
  if (nextSwitch) {
    addEventListenerTo(nextSwitch, S_CLICK, nextSwitchClickListener);
  }
  if (prevSwitch) {
    addEventListenerTo(prevSwitch, S_CLICK, prevSwitchClickListener);
  }
  if (initialPage < 1 || initialPage > numPages) {
    initialPage = 1;
  }
  methods._goToPage(initialPage);
};
const getMethods$2 = (widget, components, element, config) => {
  const pages = components._pages;
  const scrollWatcher = ScrollWatcher.reuse();
  const isFullscreen = config === null || config === void 0 ? void 0 : config.fullscreen;
  const disabledPages = {};
  const callbacks = newSet();
  const fetchScrollOptions = async () => ({
    scrollable: await fetchClosestScrollable(element),
    asFractionOf: "visible",
    weCanInterrupt: true
  });
  let currPageNum = -1;
  let lastPageNum = -1;
  let lastTransition = 0;
  const canTransition = gestureData => {
    if (widget.isDisabled()) {
      return false;
    }
    if ((gestureData === null || gestureData === void 0 ? void 0 : gestureData.device) !== S_WHEEL) {
      return true;
    }
    const timeNow$1 = timeNow();
    if (timeNow$1 - lastTransition > MIN_TIME_BETWEEN_WHEEL) {
      lastTransition = timeNow$1;
      return true;
    }
    return false;
  };
  const goToPage = async (pageNum, gestureData) => {
    pageNum = toInt(pageNum, -1);
    if (pageNum === currPageNum || !canTransition(gestureData)) {
      return;
    }
    const numPages = lengthOf(pages);
    if (currPageNum === 1 && pageNum === 0 || currPageNum === numPages && pageNum === numPages + 1) {
      if (isFullscreen) {
        scrollWatcher.scroll(pageNum ? (gestureData === null || gestureData === void 0 ? void 0 : gestureData.direction) === S_RIGHT ? S_RIGHT : S_DOWN : (gestureData === null || gestureData === void 0 ? void 0 : gestureData.direction) === S_LEFT ? S_LEFT : S_UP, await fetchScrollOptions());
      }
      return;
    }
    if (isPageDisabled(pageNum) || pageNum < 1 || pageNum > numPages) {
      return;
    }
    lastPageNum = currPageNum > 0 ? currPageNum : pageNum;
    currPageNum = pageNum;
    for (const callback of callbacks) {
      await callback.invoke(widget);
    }
    delAttr(pages[lastPageNum - 1], S_ARIA_CURRENT);
    for (let n = lastPageNum; n !== currPageNum; currPageNum < lastPageNum ? n-- : n++) {
      if (!isPageDisabled(n)) {
        setPageState(components, n, currPageNum < lastPageNum ? S_NEXT : S_COVERED);
      }
    }
    setCurrentPage(element, currPageNum, numPages, isPageDisabled);
    setAttr(pages[currPageNum - 1], S_ARIA_CURRENT);
    await setPageState(components, currPageNum, S_CURRENT);
  };
  const nextPage = async gestureData => {
    let targetPage = currPageNum + 1;
    while (isPageDisabled(targetPage)) {
      targetPage++;
    }
    return goToPage(targetPage, gestureData);
  };
  const prevPage = async gestureData => {
    let targetPage = currPageNum - 1;
    while (isPageDisabled(targetPage)) {
      targetPage--;
    }
    return goToPage(targetPage, gestureData);
  };
  const isPageDisabled = pageNum => disabledPages[pageNum] === true;
  const disablePage = async pageNum => {
    pageNum = toInt(pageNum);
    if (widget.isDisabled() || pageNum < 1 || pageNum > lengthOf(pages)) {
      return;
    }
    disabledPages[pageNum] = true;
    if (pageNum === currPageNum) {
      await prevPage();
      if (pageNum === currPageNum) {
        await nextPage();
        if (pageNum === currPageNum) {
          disabledPages[pageNum] = false;
          return;
        }
      }
    }
    setCurrentPage(element, currPageNum, lengthOf(pages), isPageDisabled);
    await setPageState(components, pageNum, S_DISABLED);
  };
  const enablePage = async pageNum => {
    pageNum = toInt(pageNum);
    if (widget.isDisabled() || !isPageDisabled(pageNum)) {
      return;
    }
    disabledPages[pageNum] = false;
    setCurrentPage(element, currPageNum, lengthOf(pages), isPageDisabled);
    await setPageState(components, pageNum, pageNum < currPageNum ? S_COVERED : S_NEXT);
  };
  const togglePage = pageNum => isPageDisabled(pageNum) ? enablePage(pageNum) : disablePage(pageNum);
  const onTransition = handler => callbacks.add(wrapCallback(handler));
  return {
    _nextPage: nextPage,
    _prevPage: prevPage,
    _goToPage: goToPage,
    _disablePage: disablePage,
    _enablePage: enablePage,
    _togglePage: togglePage,
    _isPageDisabled: isPageDisabled,
    _getCurrentPage: () => pages[currPageNum - 1],
    _getPreviousPage: () => pages[lastPageNum - 1],
    _getCurrentPageNum: () => lengthOf(pages) > 0 ? currPageNum : 0,
    _getPreviousPageNum: () => lengthOf(pages) > 0 ? lastPageNum : 0,
    _onTransition: onTransition
  };
};

class NextPage {
  static register() {
    registerAction("next-page", element => new NextPage(element));
  }
  constructor(element) {
    let toggleState = false;
    const {
      _nextPage,
      _prevPage
    } = getMethods$1(element);
    this.do = () => {
      toggleState = true;
      return _nextPage();
    };
    this.undo = () => {
      toggleState = false;
      return _prevPage();
    };
    this[S_TOGGLE] = () => {
      const method = toggleState ? _prevPage : _nextPage;
      toggleState = !toggleState;
      return method();
    };
  }
}
class PrevPage {
  static register() {
    registerAction("prev-page", element => new PrevPage(element));
  }
  constructor(element) {
    let toggleState = false;
    const {
      _nextPage,
      _prevPage
    } = getMethods$1(element);
    this.do = () => {
      toggleState = true;
      return _prevPage();
    };
    this.undo = () => {
      toggleState = false;
      return _nextPage();
    };
    this[S_TOGGLE] = () => {
      const method = toggleState ? _nextPage : _prevPage;
      toggleState = !toggleState;
      return method();
    };
  }
}
class GoToPage {
  static register() {
    registerAction("go-to-page", (element, args) => new GoToPage(element, toInt(args[0])));
  }
  constructor(element, pageNum) {
    if (!pageNum) {
      throw usageError("Target page is required");
    }
    const {
      _goToPage
    } = getMethods$1(element);
    this.do = () => _goToPage(pageNum);
    this.undo = () => _goToPage(-1);
    this[S_TOGGLE] = () => _goToPage(pageNum, -1);
  }
}
class EnablePage {
  static register() {
    registerAction("enable-page", (element, args) => new EnablePage(element, toInt(args[0])));
  }
  constructor(element, pageNum) {
    if (!pageNum) {
      throw usageError("Target page number is required");
    }
    const {
      _enablePage,
      _disablePage,
      _togglePage
    } = getMethods$1(element);
    _disablePage(pageNum);
    this.do = () => _enablePage(pageNum);
    this.undo = () => _disablePage(pageNum);
    this[S_TOGGLE] = () => _togglePage(pageNum);
  }
}
class DisablePage {
  static register() {
    registerAction("disable-page", (element, args) => new DisablePage(element, toInt(args[0])));
  }
  constructor(element, pageNum) {
    if (!pageNum) {
      throw usageError("Target page number is required");
    }
    const {
      _enablePage,
      _disablePage,
      _togglePage
    } = getMethods$1(element);
    _enablePage(pageNum);
    this.do = () => _disablePage(pageNum);
    this.undo = () => _enablePage(pageNum);
    this[S_TOGGLE] = () => _togglePage(pageNum);
  }
}
const getMethods$1 = element => {
  let lastPageNum = null;
  const nextPage = widget => widget === null || widget === void 0 ? void 0 : widget.nextPage();
  const prevPage = widget => widget === null || widget === void 0 ? void 0 : widget.prevPage();
  const goToPage = async (widget, pageNum, altPageNum) => {
    const currentNum = widget === null || widget === void 0 ? void 0 : widget.getCurrentPageNum();
    let targetNum = currentNum === pageNum ? altPageNum : pageNum;
    if (targetNum === -1) {
      targetNum = lastPageNum;
    }
    if (targetNum) {
      if (pageNum !== -1) {
        lastPageNum = currentNum;
      }
      await (widget === null || widget === void 0 ? void 0 : widget.goToPage(targetNum));
    }
  };
  const enablePage = (widget, pageNum) => widget === null || widget === void 0 ? void 0 : widget.enablePage(pageNum);
  const disablePage = (widget, pageNum) => widget === null || widget === void 0 ? void 0 : widget.disablePage(pageNum);
  const togglePage = (widget, pageNum) => widget === null || widget === void 0 ? void 0 : widget.togglePage(pageNum);
  const widgetPromise = fetchUniqueWidget("pager", element, Pager);
  return {
    _nextPage: () => widgetPromise.then(nextPage),
    _prevPage: () => widgetPromise.then(prevPage),
    _goToPage: (pageNum, altPageNum = null) => widgetPromise.then(w => goToPage(w, pageNum, altPageNum)),
    _enablePage: pageNum => widgetPromise.then(w => enablePage(w, pageNum)),
    _disablePage: pageNum => widgetPromise.then(w => disablePage(w, pageNum)),
    _togglePage: pageNum => widgetPromise.then(w => togglePage(w, pageNum))
  };
};

var _actions = /*#__PURE__*/Object.freeze({
  __proto__: null,
  AddClass: AddClass,
  Animate: Animate,
  AnimatePause: AnimatePause,
  AnimatePlay: AnimatePlay,
  Disable: Disable,
  DisablePage: DisablePage,
  Display: Display,
  Enable: Enable,
  EnablePage: EnablePage,
  GoToPage: GoToPage,
  Hide: Hide,
  NextPage: NextPage,
  Open: Open,
  PrevPage: PrevPage,
  RemoveClass: RemoveClass,
  Run: Run,
  ScrollTo: ScrollTo,
  SetAttribute: SetAttribute,
  Show: Show,
  Undisplay: Undisplay,
  fetchAction: fetchAction,
  registerAction: registerAction
});

class ClickTrigger extends Trigger {
  static register() {
    registerTrigger(S_CLICK, (element, args, actions, config) => new ClickTrigger(element, actions, config), newConfigValidator$5);
  }
  constructor(element, actions, config = {}) {
    super(element, actions, config);
    this.getConfig = () => copyObject(config);
    setupWatcher(this, element, actions, config, S_CLICK);
  }
}
class PressTrigger extends Trigger {
  static register() {
    registerTrigger(S_PRESS, (element, args, actions, config) => new PressTrigger(element, actions, config), newConfigValidator$5);
  }
  constructor(element, actions, config = {}) {
    super(element, actions, config);
    this.getConfig = () => copyObject(config);
    setupWatcher(this, element, actions, config, S_PRESS);
  }
}
class HoverTrigger extends Trigger {
  static register() {
    registerTrigger(S_HOVER, (element, args, actions, config) => new HoverTrigger(element, actions, config), newConfigValidator$5);
  }
  constructor(element, actions, config = {}) {
    super(element, actions, config);
    this.getConfig = () => copyObject(config);
    setupWatcher(this, element, actions, config, S_HOVER);
  }
}
const newConfigValidator$5 = element => {
  return {
    target: (key, value) => {
      var _ref;
      return (_ref = isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref !== void 0 ? _ref : undefined;
    },
    preventDefault: validateBoolean,
    preventSelect: validateBoolean
  };
};
const setupWatcher = (widget, element, actions, config, action) => {
  if (!lengthOf(actions)) {
    return;
  }
  const target = targetOf(config) || element;
  let startHandler;
  let endHandler;
  if (action === S_CLICK) {
    startHandler = endHandler = widget[S_TOGGLE];
  } else {
    startHandler = widget.run;
    endHandler = widget.reverse;
  }
  PointerWatcher.reuse().onPointer(target, startHandler, endHandler, merge({
    actions: action
  }, omitKeys(config, {
    target: null
  })));
};

class LayoutTrigger extends Trigger {
  static register() {
    registerTrigger("layout", (element, args, actions, config) => {
      return new LayoutTrigger(element, actions, assign(config, {
        layout: validateStringRequired("layout", strReplace(strReplace(args[0] || "", /(min|max)-/g, "$1 "), /-to-/g, " to "), value => isValidDeviceList(value) || isValidAspectRatioList(value))
      }));
    }, newConfigValidator$4);
  }
  constructor(element, actions, config) {
    const layout = (config === null || config === void 0 ? void 0 : config.layout) || "";
    if (!layout) {
      throw usageError("'layout' is required");
    }
    super(element, actions, config);
    this.getConfig = () => copyObject(config);
    if (!lengthOf(actions)) {
      return;
    }
    let devices = [];
    let aspectRatios = [];
    let otherDevices = [];
    let otherAspectRatios = [];
    if (isValidDeviceList(layout)) {
      devices = layout;
      otherDevices = getOtherDevices(layout);
    } else {
      aspectRatios = layout;
      otherAspectRatios = getOtherAspectRatios(layout);
    }
    const root = config.root;
    const watcher = LayoutWatcher.reuse({
      root
    });
    watcher.onLayout(this.run, {
      devices,
      aspectRatios
    });
    if (lengthOf(otherDevices) || lengthOf(otherAspectRatios)) {
      watcher.onLayout(this.reverse, {
        devices: otherDevices,
        aspectRatios: otherAspectRatios
      });
    }
  }
}
const newConfigValidator$4 = element => {
  return {
    root: async (key, value) => {
      const root = isLiteralString(value) ? await waitForReferenceElement(value, element) : undefined;
      if (root && !isHTMLElement(root)) {
        throw usageError("root must be HTMLElement");
      }
      return root;
    }
  };
};

class LoadTrigger extends Trigger {
  static register() {
    registerTrigger("load", (element, args, actions, config) => new LoadTrigger(element, actions, config));
  }
  constructor(element, actions, config) {
    super(element, actions, config);
    this.getConfig = () => copyObject(config);
    if (!lengthOf(actions)) {
      return;
    }
    waitForPageReady().then(this.run);
  }
}

class ScrollTrigger extends Trigger {
  static register() {
    registerTrigger(S_SCROLL, (element, args, actions, config) => {
      return new ScrollTrigger(element, actions, assign(config, {
        directions: validateStrList("directions", args, isValidXYDirection)
      }));
    }, newConfigValidator$3);
  }
  constructor(element, actions, config) {
    config = config !== null && config !== void 0 ? config : {};
    let directions = config.directions;
    if (!directions) {
      config.once = true;
      directions = [S_UP, S_DOWN, S_LEFT, S_RIGHT];
    }
    super(element, actions, config);
    this.getConfig = () => copyObject(config);
    if (!lengthOf(actions)) {
      return;
    }
    const watcher = ScrollWatcher.reuse();
    const scrollable = config.scrollable;
    const threshold = config.threshold;
    const oppositeDirections = directions ? getOppositeXYDirections(directions) : [];
    watcher.onScroll(this.run, {
      directions,
      scrollable,
      threshold
    });
    if (lengthOf(oppositeDirections)) {
      watcher.onScroll(this.reverse, {
        directions: oppositeDirections,
        scrollable,
        threshold
      });
    }
  }
}
const newConfigValidator$3 = element => {
  return {
    scrollable: (key, value) => {
      var _ref;
      return (_ref = isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref !== void 0 ? _ref : undefined;
    },
    threshold: validateNumber
  };
};

class ViewTrigger extends Trigger {
  static register() {
    registerTrigger("view", (element, args, actions, config) => {
      return new ViewTrigger(element, actions, assign(config, {
        views: validateStrList("views", args, isValidView)
      }));
    }, newConfigValidator$2);
  }
  constructor(element, actions, config) {
    var _config$rootMargin;
    super(element, actions, config);
    this.getConfig = () => copyObject(config || {});
    if (!lengthOf(actions)) {
      return;
    }
    const watcher = ViewWatcher.reuse({
      root: config === null || config === void 0 ? void 0 : config.root,
      rootMargin: config === null || config === void 0 || (_config$rootMargin = config.rootMargin) === null || _config$rootMargin === void 0 ? void 0 : _config$rootMargin.replace(/,/g, " "),
      threshold: config === null || config === void 0 ? void 0 : config.threshold
    });
    const target = (config === null || config === void 0 ? void 0 : config.target) || element;
    const views = (config === null || config === void 0 ? void 0 : config.views) || S_AT;
    const oppositeViews = getOppositeViews(views);
    const setupWatcher = target => {
      if (!lengthOf(oppositeViews)) {
        this.run();
      } else {
        watcher.onView(target, this.run, {
          views
        });
        watcher.onView(target, this.reverse, {
          views: oppositeViews
        });
      }
    };
    let willAnimate = false;
    for (const action of actions) {
      if (isInstanceOf(action, Animate) || isInstanceOf(action, AnimatePlay)) {
        willAnimate = true;
        break;
      }
    }
    if (willAnimate) {
      setupRepresentative(element).then(setupWatcher);
    } else {
      setupWatcher(target);
    }
  }
}
const newConfigValidator$2 = element => {
  return {
    target: (key, value) => {
      var _ref;
      return isLiteralString(value) && isValidScrollOffset(value) ? value : (_ref = isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref !== void 0 ? _ref : undefined;
    },
    root: (key, value) => {
      var _ref2;
      return (_ref2 = isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref2 !== void 0 ? _ref2 : undefined;
    },
    rootMargin: validateString,
    threshold: (key, value) => validateNumList(key, value)
  };
};
const setupRepresentative = async element => {
  var _MH$classList;
  const allowedToWrap = settings.contentWrappingAllowed === true && getData(element, PREFIX_NO_WRAP) === null && !((_MH$classList = classList(parentOf(element))) !== null && _MH$classList !== void 0 && _MH$classList.contains(PREFIX_WRAPPER$1));
  let target;
  if (allowedToWrap) {
    target = await wrapElement(element, {
      ignoreMove: true
    });
    addClasses(target, PREFIX_WRAPPER$1);
    if (isInlineTag(tagName(target))) {
      addClasses(target, PREFIX_INLINE_WRAPPER);
    }
  } else {
    const prev = element.previousElementSibling;
    const prevChild = childrenOf(prev)[0];
    if (prev && hasClass(prev, PREFIX_WRAPPER$1) && prevChild && hasClass(prevChild, PREFIX_GHOST)) {
      target = prevChild;
    } else {
      target = (await insertGhostClone(element))._clone;
    }
  }
  return target;
};

var index$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ClickTrigger: ClickTrigger,
  HoverTrigger: HoverTrigger,
  LayoutTrigger: LayoutTrigger,
  LoadTrigger: LoadTrigger,
  PressTrigger: PressTrigger,
  ScrollTrigger: ScrollTrigger,
  Trigger: Trigger,
  ViewTrigger: ViewTrigger,
  registerTrigger: registerTrigger
});

const actions = omitKeys(_actions, {
  Open: true,
  NextPage: true,
  PrevPage: true,
  GoToPage: true,
  EnablePage: true,
  DisablePage: true
});
actions.AddClass.register();
actions.RemoveClass.register();
actions.AnimatePlay.register();
actions.AnimatePause.register();
actions.Animate.register();
actions.Display.register();
actions.Undisplay.register();
actions.ScrollTo.register();
actions.SetAttribute.register();
actions.Show.register();
actions.Hide.register();
actions.Enable.register();
actions.Disable.register();
actions.Run.register();
LayoutTrigger.register();
LoadTrigger.register();
ClickTrigger.register();
PressTrigger.register();
HoverTrigger.register();
ScrollTrigger.register();
Trigger.register();
ViewTrigger.register();

class AutoHide extends Widget {
  static get(element, id) {
    const instance = super.get(element, id);
    if (isInstanceOf(instance, AutoHide)) {
      return instance;
    }
    return null;
  }
  static register() {
    for (const [name, remove] of [[WIDGET_NAME_HIDE, false], [WIDGET_NAME_REMOVE, true]]) {
      registerWidget(name, (element, config) => {
        return new AutoHide(element, config);
      }, newConfigValidator$1(remove), {
        supportsMultiple: true
      });
    }
  }
  constructor(element, config) {
    super(element, config);
    const selector = config === null || config === void 0 ? void 0 : config.selector;
    const watcher = DOMWatcher.create({
      root: element,
      subtree: selector ? true : false
    });
    const watcherOptions = selector ? {
      selector: selector,
      categories: [S_ADDED, S_ATTRIBUTE],
      [S_SKIP_INITIAL]: true
    } : {
      categories: [S_ATTRIBUTE],
      [S_SKIP_INITIAL]: true
    };
    const hideOrRemoveEl = config !== null && config !== void 0 && config.remove ? hideAndRemoveElement : hideElement;
    const hideRelevant = () => {
      if (this.isDisabled()) {
        return;
      }
      const targetElements = selector ? querySelectorAll(element, selector) : [element];
      for (const elem of targetElements) {
        var _config$delay;
        hideOrRemoveEl(elem, (_config$delay = config === null || config === void 0 ? void 0 : config.delay) !== null && _config$delay !== void 0 ? _config$delay : DEFAULT_DELAY);
      }
    };
    const addWatcher = () => watcher.onMutation(hideRelevant, watcherOptions);
    const removeWatcher = () => watcher.offMutation(hideRelevant);
    waitForPageReady().then(() => {
      if (this.isDestroyed()) {
        return;
      }
      hideRelevant();
      addWatcher();
    });
    this.onDisable(removeWatcher);
    this.onEnable(() => {
      hideRelevant();
      addWatcher();
    });
  }
}
const WIDGET_NAME_HIDE = "auto-hide";
const WIDGET_NAME_REMOVE = "auto-remove";
const DEFAULT_DELAY = 3000;
const newConfigValidator$1 = autoRemove => {
  return {
    id: validateString,
    remove: () => autoRemove,
    selector: validateString,
    delay: validateNumber
  };
};

class PageLoader extends Widget {
  static get(element) {
    if (!element) {
      return mainWidget$2;
    }
    const instance = super.get(element, DUMMY_ID$8);
    if (isInstanceOf(instance, PageLoader)) {
      return instance;
    }
    return null;
  }
  static register() {
    registerWidget(WIDGET_NAME$8, (element, config) => {
      if (!PageLoader.get(element)) {
        return new PageLoader(element, config);
      }
      return null;
    }, configValidator$6);
  }
  static enableMain(config) {
    const loader = createElement("div");
    const widget = new PageLoader(loader, config);
    widget.onDestroy(() => {
      if (mainWidget$2 === widget) {
        mainWidget$2 = null;
      }
      return moveElement(loader);
    });
    waitForElement(getBody).then(body => {
      if (!widget.isDestroyed()) {
        moveElement(loader, {
          to: body
        });
      }
    });
    mainWidget$2 = widget;
    return widget;
  }
  constructor(element, config) {
    var _PageLoader$get;
    const destroyPromise = (_PageLoader$get = PageLoader.get(element)) === null || _PageLoader$get === void 0 ? void 0 : _PageLoader$get.destroy();
    super(element, {
      id: DUMMY_ID$8
    });
    (destroyPromise || promiseResolve()).then(() => {
      var _config$autoRemove;
      if (this.isDestroyed()) {
        return;
      }
      addClasses(element, PREFIX_ROOT$3);
      const spinner = createElement("div");
      addClasses(spinner, PREFIX_SPINNER);
      moveElement(spinner, {
        to: element
      });
      waitForElement(getBody).then(setHasModal);
      if ((_config$autoRemove = config === null || config === void 0 ? void 0 : config.autoRemove) !== null && _config$autoRemove !== void 0 ? _config$autoRemove : true) {
        waitForPageReady().then(() => hideAndRemoveElement(element)).then(this.destroy);
      }
      this.onDisable(() => {
        undisplayElement(element);
        if (!docQuerySelector(`.${PREFIX_ROOT$3}`)) {
          delHasModal();
        }
      });
      this.onEnable(async () => {
        await displayElement(element);
      });
      this.onDestroy(async () => {
        moveElement(spinner);
        await removeClasses(element, PREFIX_ROOT$3);
        await displayElement(element);
      });
    });
  }
}
const WIDGET_NAME$8 = "page-loader";
const PREFIXED_NAME$4 = prefixName(WIDGET_NAME$8);
const PREFIX_ROOT$3 = `${PREFIXED_NAME$4}__root`;
const PREFIX_SPINNER = prefixName("spinner");
const DUMMY_ID$8 = PREFIXED_NAME$4;
let mainWidget$2 = null;
const configValidator$6 = {
  autoRemove: validateBoolean
};

class SameHeight extends Widget {
  static get(containerElement) {
    const instance = super.get(containerElement, DUMMY_ID$7);
    if (isInstanceOf(instance, SameHeight)) {
      return instance;
    }
    return null;
  }
  static register() {
    registerWidget(WIDGET_NAME$7, (element, config) => {
      if (isHTMLElement(element)) {
        if (!SameHeight.get(element)) {
          return new SameHeight(element, config);
        }
      } else {
        logError(usageError("Only HTMLElement is supported for SameHeight widget"));
      }
      return null;
    }, configValidator$5);
  }
  constructor(containerElement, config) {
    var _SameHeight$get;
    const destroyPromise = (_SameHeight$get = SameHeight.get(containerElement)) === null || _SameHeight$get === void 0 ? void 0 : _SameHeight$get.destroy();
    super(containerElement, {
      id: DUMMY_ID$7
    });
    const items = getItemsFrom(containerElement, config === null || config === void 0 ? void 0 : config.items);
    if (sizeOf(items) < 2) {
      throw usageError("SameHeight must have more than 1 item");
    }
    for (const item of items.keys()) {
      if (parentOf(item) !== containerElement) {
        throw usageError("SameHeight's items must be its immediate children");
      }
    }
    fetchConfig(containerElement, config).then(fullConfig => {
      (destroyPromise || promiseResolve()).then(() => {
        if (this.isDestroyed()) {
          return;
        }
        init$2(this, containerElement, items, fullConfig);
      });
    });
    this.toColumn = () => setData(containerElement, PREFIX_ORIENTATION, S_VERTICAL);
    this.toRow = () => delData(containerElement, PREFIX_ORIENTATION);
    this.getItems = () => [...items.keys()];
    this.getItemConfigs = () => newMap([...items.entries()]);
  }
}
const WIDGET_NAME$7 = "same-height";
const PREFIXED_NAME$3 = prefixName(WIDGET_NAME$7);
const PREFIX_ROOT$2 = `${PREFIXED_NAME$3}__root`;
const PREFIX_ITEM$1 = `${PREFIXED_NAME$3}__item`;
const PREFIX_ITEM__FOR_SELECT$1 = `${PREFIXED_NAME$3}-item`;
const S_TEXT = "text";
const S_IMAGE = "image";
const DUMMY_ID$7 = PREFIXED_NAME$3;
const MIN_CHARS_FOR_TEXT = 100;
const configValidator$5 = {
  diffTolerance: validateNumber,
  resizeThreshold: validateNumber,
  [S_DEBOUNCE_WINDOW]: validateNumber,
  minGap: validateNumber,
  maxFreeR: validateNumber,
  maxWidthR: validateNumber
};
const isText = element => getData(element, PREFIX_ITEM__FOR_SELECT$1) === S_TEXT || getData(element, PREFIX_ITEM__FOR_SELECT$1) !== S_IMAGE && isHTMLElement(element) && lengthOf(element.innerText) >= MIN_CHARS_FOR_TEXT;
const areImagesLoaded = element => {
  for (const img of element.querySelectorAll("img")) {
    if (img.naturalWidth === 0 || img.width === 0 || img.naturalHeight === 0 || img.height === 0) {
      return false;
    }
  }
  return true;
};
const fetchConfig = async (containerElement, userConfig) => {
  var _userConfig$minGap, _userConfig$maxFreeR, _userConfig$maxWidthR, _userConfig$diffToler, _userConfig$resizeThr, _userConfig$debounceW;
  const colGapStr = await getComputedStyleProp(containerElement, "column-gap");
  const minGap = getNumValue(strReplace(colGapStr, /px$/, ""), settings.sameHeightMinGap);
  return {
    _minGap: toNumWithBounds((_userConfig$minGap = userConfig === null || userConfig === void 0 ? void 0 : userConfig.minGap) !== null && _userConfig$minGap !== void 0 ? _userConfig$minGap : minGap, {
      min: 0
    }, 10),
    _maxFreeR: toNumWithBounds((_userConfig$maxFreeR = userConfig === null || userConfig === void 0 ? void 0 : userConfig.maxFreeR) !== null && _userConfig$maxFreeR !== void 0 ? _userConfig$maxFreeR : settings.sameHeightMaxFreeR, {
      min: 0,
      max: 0.9
    }, -1),
    _maxWidthR: toNumWithBounds((_userConfig$maxWidthR = userConfig === null || userConfig === void 0 ? void 0 : userConfig.maxWidthR) !== null && _userConfig$maxWidthR !== void 0 ? _userConfig$maxWidthR : settings.sameHeightMaxWidthR, {
      min: 1
    }, -1),
    _diffTolerance: (_userConfig$diffToler = userConfig === null || userConfig === void 0 ? void 0 : userConfig.diffTolerance) !== null && _userConfig$diffToler !== void 0 ? _userConfig$diffToler : settings.sameHeightDiffTolerance,
    _resizeThreshold: (_userConfig$resizeThr = userConfig === null || userConfig === void 0 ? void 0 : userConfig.resizeThreshold) !== null && _userConfig$resizeThr !== void 0 ? _userConfig$resizeThr : settings.sameHeightResizeThreshold,
    _debounceWindow: (_userConfig$debounceW = userConfig === null || userConfig === void 0 ? void 0 : userConfig.debounceWindow) !== null && _userConfig$debounceW !== void 0 ? _userConfig$debounceW : settings.sameHeightDebounceWindow
  };
};
const getNumValue = (strValue, defaultValue) => {
  const num = strValue ? parseFloat(strValue) : NaN;
  return isNaN(num) ? defaultValue : num;
};
const findItems = containerElement => {
  const items = [...querySelectorAll(containerElement, getDefaultWidgetSelector(PREFIX_ITEM__FOR_SELECT$1))];
  if (!lengthOf(items)) {
    items.push(...getVisibleContentChildren(containerElement));
  }
  return items;
};
const getItemsFrom = (containerElement, inputItems) => {
  const itemMap = newMap();
  inputItems = inputItems || findItems(containerElement);
  const addItem = (item, itemType) => {
    itemType = itemType || (isText(item) ? S_TEXT : S_IMAGE);
    itemMap.set(item, itemType);
  };
  if (isArray(inputItems)) {
    for (const item of inputItems) {
      addItem(item);
    }
  } else if (isInstanceOf(inputItems, Map)) {
    for (const [item, itemType] of inputItems.entries()) {
      addItem(item, itemType);
    }
  }
  return itemMap;
};
const init$2 = (widget, containerElement, items, config) => {
  const diffTolerance = config._diffTolerance;
  const debounceWindow = config._debounceWindow;
  const sizeWatcher = SizeWatcher.reuse({
    [S_DEBOUNCE_WINDOW]: debounceWindow,
    resizeThreshold: config._resizeThreshold
  });
  const allItems = newMap();
  let callCounter = 0;
  let isFirstTime = true;
  let lastOptimalHeight = 0;
  let hasScheduledReset = false;
  let counterTimeout = null;
  const resizeHandler = (element, sizeData) => {
    if (!hasScheduledReset) {
      hasScheduledReset = true;
      setTimer(() => {
        hasScheduledReset = false;
        if (callCounter > 1) {
          callCounter = 0;
          return;
        }
        callCounter++;
        if (counterTimeout) {
          clearTimer(counterTimeout);
        }
        const measurements = calculateMeasurements(containerElement, allItems, isFirstTime);
        const height = measurements ? getOptimalHeight(measurements, config) : null;
        if (height && abs(lastOptimalHeight - height) > diffTolerance) {
          lastOptimalHeight = height;
          isFirstTime = false;
          setWidths(height);
          counterTimeout = setTimer(() => {
            callCounter = 0;
          }, debounceWindow + 50);
        } else {
          callCounter = 0;
        }
      }, 0);
    }
    const properties = allItems.get(element);
    if (!properties) {
      logError(bugError("Got SizeWatcher call for unknown element"));
      return;
    }
    properties._width = sizeData.border[S_WIDTH] || sizeData.content[S_WIDTH];
    properties._height = sizeData.border[S_HEIGHT] || sizeData.content[S_HEIGHT];
  };
  const observeAll = () => {
    isFirstTime = true;
    for (const element of allItems.keys()) {
      sizeWatcher.onResize(resizeHandler, {
        target: element
      });
    }
  };
  const unobserveAll = () => {
    for (const element of allItems.keys()) {
      sizeWatcher.offResize(resizeHandler, element);
    }
  };
  const setWidths = height => {
    for (const [element, properties] of allItems.entries()) {
      if (parentOf(element) === containerElement) {
        const width = getWidthAtH(element, properties, height);
        setNumericStyleProps(element, {
          sameHeightW: width
        }, {
          _units: "px"
        });
      }
    }
  };
  widget.onDisable(unobserveAll);
  widget.onEnable(observeAll);
  widget.onDestroy(async () => {
    for (const element of allItems.keys()) {
      if (parentOf(element) === containerElement) {
        await setNumericStyleProps(element, {
          sameHeightW: NaN
        });
        await removeClasses(element, PREFIX_ITEM$1);
      }
    }
    allItems.clear();
    await removeClasses(containerElement, PREFIX_ROOT$2);
  });
  const getProperties = itemType => {
    return {
      _type: itemType,
      _width: NaN,
      _height: NaN,
      _aspectR: NaN,
      _area: NaN,
      _extraH: NaN,
      _components: []
    };
  };
  allItems.set(containerElement, getProperties(""));
  for (const [item, itemType] of items.entries()) {
    addClasses(item, PREFIX_ITEM$1);
    const properties = getProperties(itemType);
    allItems.set(item, properties);
    if (itemType === S_TEXT) {
      properties._components = getTextComponents(item);
      for (const child of properties._components) {
        allItems.set(child, getProperties(""));
      }
    }
  }
  addClasses(containerElement, PREFIX_ROOT$2);
  observeAll();
};
const getTextComponents = element => {
  const components = [];
  for (const child of getVisibleContentChildren(element)) {
    if (isText(child)) {
      components.push(child);
    } else {
      components.push(...getTextComponents(child));
    }
  }
  return components;
};
const calculateMeasurements = (containerElement, allItems, isFirstTime, logger) => {
  if (getData(containerElement, PREFIX_ORIENTATION) === S_VERTICAL) {
    return null;
  }
  let tArea = NaN,
    tExtraH = 0,
    imgAR = NaN,
    flexW = NaN,
    nItems = 0;
  for (const [element, properties] of allItems.entries()) {
    const width = properties._width;
    const height = properties._height;
    if (element === containerElement) {
      flexW = width;
      nItems = lengthOf(getVisibleContentChildren(element));
    } else if (properties._type === S_TEXT) {
      let thisTxtArea = 0,
        thisTxtExtraH = 0;
      const components = properties._components;
      if (lengthOf(components)) {
        for (const component of properties._components) {
          const cmpProps = allItems.get(component);
          if (cmpProps) {
            thisTxtArea += cmpProps._width * cmpProps._height;
          } else {
            logError(bugError("Text component not observed"));
          }
        }
        thisTxtExtraH = height - thisTxtArea / width;
      } else {
        thisTxtArea = width * height;
      }
      properties._area = thisTxtArea;
      properties._extraH = thisTxtExtraH;
      tArea = (tArea || 0) + thisTxtArea;
      tExtraH += thisTxtExtraH;
    } else if (properties._type === S_IMAGE) {
      if (isFirstTime && !areImagesLoaded(element)) {
        return null;
      }
      const thisAspectR = width / height;
      imgAR = (imgAR || 0) + thisAspectR;
      properties._aspectR = thisAspectR;
    } else {
      continue;
    }
  }
  return {
    _tArea: tArea,
    _tExtraH: tExtraH,
    _imgAR: imgAR,
    _flexW: flexW,
    _nItems: nItems
  };
};
const getWidthAtH = (element, properties, targetHeight) => properties._type === S_TEXT ? properties._area / (targetHeight - (properties._extraH || 0)) : properties._aspectR * targetHeight;
const getOptimalHeight = (measurements, config, logger) => {
  const tArea = measurements._tArea;
  const tExtraH = measurements._tExtraH;
  const imgAR = measurements._imgAR;
  const flexW = measurements._flexW - (measurements._nItems - 1) * config._minGap;
  const maxFreeR = config._maxFreeR;
  const maxWidthR = config._maxWidthR;
  if (isNaN(tArea)) {
    if (!imgAR) {
      return NaN;
    }
    return flexW / imgAR;
  }
  if (isNaN(imgAR)) {
    return tArea / flexW + tExtraH;
  }
  if (!imgAR || !tArea) {
    return NaN;
  }
  const h0 = sqrt(tArea / imgAR) + tExtraH;
  const [h2, h1] = quadraticRoots(imgAR, -(imgAR * tExtraH + flexW), tArea + tExtraH * flexW);
  let hR0 = NaN,
    hR1 = NaN,
    hR2 = NaN;
  if (maxWidthR > 0) {
    hR0 = quadraticRoots(imgAR, -imgAR * tExtraH, -tArea)[0];
    hR1 = quadraticRoots(imgAR * maxWidthR, -imgAR * tExtraH * maxWidthR, -tArea)[0];
    hR2 = quadraticRoots(imgAR / maxWidthR, -imgAR * tExtraH / maxWidthR, -tArea)[0];
  }
  let hF2 = NaN,
    hF1 = NaN;
  if (maxFreeR >= 0) {
    [hF2, hF1] = quadraticRoots(imgAR, -(imgAR * tExtraH + flexW * (1 - maxFreeR)), tArea + tExtraH * flexW * (1 - maxFreeR));
  }
  const hConstr1 = max(...filter([h1, hR1, hF1], v => isValidNum(v)));
  const hConstr2 = min(...filter([h2, hR2, hF2], v => isValidNum(v)));
  const tw0 = tArea / (h0 - tExtraH);
  const iw0 = h0 * imgAR;
  const freeSpace0 = flexW - tw0 - iw0;
  if (!h0 || h0 <= 0) ; else if (isValidNum(h1) !== isValidNum(h2)) ; else if (isValidNum(hR1) !== isValidNum(hR2)) ; else if (isValidNum(hF1) !== isValidNum(hF2)) ; else if (h1 - h0 > 0.1) ; else if (h0 - h2 > 0.1) ; else if (hR0 - h0 > 0.1) ; else if (hR1 - hR0 > 0.1) ; else if (hR0 - hR2 > 0.1) ; else if (hF1 - hF2 > 0.1) ; else if (h1 - hF1 > 0.1) ; else if (hF2 - h2 > 0.1) ; else {
    if (freeSpace0 <= 0) {
      return h0;
    } else {
      return min(hConstr1, hConstr2);
    }
  }
  logError(bugError("Invalid SameHeight calculations"), measurements, config);
  return NaN;
};

class Scrollbar extends Widget {
  static get(scrollable) {
    if (!scrollable) {
      return mainWidget$1;
    }
    if (scrollable === getDocElement()) {
      scrollable = getBody();
    }
    const instance = super.get(scrollable, DUMMY_ID$6);
    if (isInstanceOf(instance, Scrollbar)) {
      return instance;
    }
    return null;
  }
  static enableMain(config) {
    return ScrollWatcher.fetchMainScrollableElement().then(main => {
      const widget = new Scrollbar(main, config);
      widget.onDestroy(() => {
        if (mainWidget$1 === widget) {
          mainWidget$1 = null;
        }
      });
      mainWidget$1 = widget;
      return widget;
    });
  }
  static register() {
    registerWidget(WIDGET_NAME$6, (element, config) => {
      if (isHTMLElement(element)) {
        if (!Scrollbar.get(element)) {
          return new Scrollbar(element, config);
        }
      } else {
        logError(usageError("Only HTMLElement is supported for Scrollbar widget"));
      }
      return null;
    }, configValidator$4);
  }
  constructor(scrollable, config) {
    var _Scrollbar$get;
    if (scrollable === getDocElement()) {
      scrollable = getBody();
    }
    const destroyPromise = (_Scrollbar$get = Scrollbar.get(scrollable)) === null || _Scrollbar$get === void 0 ? void 0 : _Scrollbar$get.destroy();
    super(scrollable, {
      id: DUMMY_ID$6
    });
    const props = getScrollableProps(scrollable);
    const ourScrollable = props.scrollable;
    (destroyPromise || promiseResolve()).then(async () => {
      if (this.isDestroyed()) {
        return;
      }
      await init$1(this, scrollable, props, config);
    });
    this.getScrollable = () => ourScrollable;
  }
}
const WIDGET_NAME$6 = "scrollbar";
const PREFIXED_NAME$2 = prefixName(WIDGET_NAME$6);
const DUMMY_ID$6 = PREFIXED_NAME$2;
const PREFIX_ROOT$1 = `${PREFIXED_NAME$2}__root`;
const PREFIX_CONTAINER = `${PREFIXED_NAME$2}__container`;
const PREFIX_CONTENT = `${PREFIXED_NAME$2}__content`;
const PREFIX_BAR = `${PREFIXED_NAME$2}__bar`;
const PREFIX_WRAPPER = `${PREFIXED_NAME$2}__wrapper`;
const PREFIX_FILL = `${PREFIXED_NAME$2}__fill`;
const PREFIX_SPACER = `${PREFIXED_NAME$2}__spacer`;
const PREFIX_HANDLE = `${PREFIXED_NAME$2}__handle`;
const PREFIX_DRAGGABLE = prefixName("draggable");
const PREFIX_CLICKABLE = prefixName("clickable");
const PREFIX_HAS_WRAPPER = prefixName("has-wrapper");
const PREFIX_ALLOW_COLLAPSE = prefixName("allow-collapse");
const PREFIX_HAS_FIXED_HEIGHT = prefixName("has-fixed-height");
const PREFIX_HAS_SCROLLBAR = prefixName("has-scrollbar");
const PREFIX_HIDE_SCROLL = prefixName("hide-scroll");
const S_SET_POINTER_CAPTURE = "setPointerCapture";
const S_RELEASE_POINTER_CAPTURE = "releasePointerCapture";
const S_ARIA_VALUENOW = ARIA_PREFIX + "valuenow";
const S_SCROLLBAR = "scrollbar";
let mainWidget$1 = null;
const configValidator$4 = {
  id: validateString,
  className: validateStrList,
  hideNative: validateBoolean,
  onMobile: validateBoolean,
  positionH: validateString,
  positionV: validateString,
  autoHide: validateNumber,
  clickScroll: validateBoolean,
  dragScroll: validateBoolean,
  useHandle: validateBoolean
};
const getScrollableProps = containerElement => {
  const mainScrollableElement = tryGetMainScrollableElement();
  const body = getBody();
  const defaultScrollable = getDefaultScrollingElement();
  const isBody = containerElement === body;
  const isMainScrollable = (isBody ? defaultScrollable : containerElement) === mainScrollableElement;
  const root = isMainScrollable ? mainScrollableElement : isBody ? defaultScrollable : containerElement;
  const isBodyInQuirks = root === body && defaultScrollable === body;
  const allowedToWrap = settings.contentWrappingAllowed && getData(containerElement, PREFIX_NO_WRAP) === null;
  const needsSticky = !isMainScrollable && !allowedToWrap;
  const barParent = isMainScrollable ? body : containerElement;
  const hasFixedHeight = isScrollable(root, {
    axis: "y"
  });
  let contentWrapper = null;
  let scrollable = root;
  if (!isMainScrollable && !isBody && allowedToWrap) {
    if (allowedToWrap) {
      contentWrapper = createElement("div");
      scrollable = contentWrapper;
    } else {
      logWarn("Scrollbar on elements other than the main scrollable " + "when settings.contentWrappingAllowed is false relies on " + "position: sticky, is experimental and may not work properly");
    }
  }
  return {
    isMainScrollable,
    isBody,
    isBodyInQuirks,
    root,
    scrollable,
    barParent,
    contentWrapper,
    needsSticky,
    hasFixedHeight
  };
};
const init$1 = (widget, containerElement, props, config) => {
  var _ref, _config$onMobile, _ref2, _config$hideNative, _config$autoHide, _config$clickScroll, _ref3, _config$dragScroll, _ref4, _config$useHandle;
  const {
    isMainScrollable,
    isBody,
    isBodyInQuirks,
    root,
    scrollable,
    barParent,
    contentWrapper,
    needsSticky,
    hasFixedHeight
  } = props;
  const onMobile = (_ref = (_config$onMobile = config === null || config === void 0 ? void 0 : config.onMobile) !== null && _config$onMobile !== void 0 ? _config$onMobile : settings.scrollbarOnMobile) !== null && _ref !== void 0 ? _ref : false;
  const hideNative = (_ref2 = (_config$hideNative = config === null || config === void 0 ? void 0 : config.hideNative) !== null && _config$hideNative !== void 0 ? _config$hideNative : settings.scrollbarHideNative) !== null && _ref2 !== void 0 ? _ref2 : false;
  const positionH = (config === null || config === void 0 ? void 0 : config.positionH) || settings.scrollbarPositionH;
  const positionV = (config === null || config === void 0 ? void 0 : config.positionV) || settings.scrollbarPositionV;
  const autoHideDelay = (_config$autoHide = config === null || config === void 0 ? void 0 : config.autoHide) !== null && _config$autoHide !== void 0 ? _config$autoHide : settings.scrollbarAutoHide;
  const clickScroll = (_config$clickScroll = config === null || config === void 0 ? void 0 : config.clickScroll) !== null && _config$clickScroll !== void 0 ? _config$clickScroll : settings.scrollbarClickScroll;
  const dragScroll = (_ref3 = (_config$dragScroll = config === null || config === void 0 ? void 0 : config.dragScroll) !== null && _config$dragScroll !== void 0 ? _config$dragScroll : settings.scrollbarDragScroll) !== null && _ref3 !== void 0 ? _ref3 : false;
  const useHandle = (_ref4 = (_config$useHandle = config === null || config === void 0 ? void 0 : config.useHandle) !== null && _config$useHandle !== void 0 ? _config$useHandle : settings.scrollbarUseHandle) !== null && _ref4 !== void 0 ? _ref4 : false;
  if (IS_MOBILE && !onMobile) {
    return;
  }
  mapScrollable(root, scrollable);
  const newScrollbar = (wrapper, position) => {
    const barIsHorizontal = position === S_TOP || position === S_BOTTOM;
    const scrollbar = createElement("div");
    addClassesNow(scrollbar, PREFIX_BAR);
    setDataNow(scrollbar, PREFIX_ORIENTATION, barIsHorizontal ? S_HORIZONTAL : S_VERTICAL);
    setDataNow(scrollbar, PREFIX_PLACE, position);
    if (clickScroll || dragScroll) {
      setAttr(scrollbar, S_ROLE, S_SCROLLBAR);
      setAttr(scrollbar, S_ARIA_CONTROLS, scrollDomID);
    }
    const fill = createElement("div");
    addClassesNow(fill, useHandle ? PREFIX_SPACER : PREFIX_FILL);
    let handle = null;
    if (useHandle) {
      handle = createElement("div");
      addClassesNow(handle, PREFIX_HANDLE);
      setBoolDataNow(handle, PREFIX_DRAGGABLE, dragScroll);
    }
    setBoolDataNow(scrollbar, PREFIX_DRAGGABLE, dragScroll && !useHandle);
    setBoolDataNow(scrollbar, PREFIX_CLICKABLE, clickScroll);
    moveElementNow(fill, {
      to: scrollbar
    });
    if (handle) {
      moveElementNow(handle, {
        to: scrollbar
      });
    }
    moveElementNow(scrollbar, {
      to: wrapper
    });
    return {
      _bar: scrollbar,
      _handle: handle,
      _fill: fill
    };
  };
  const setProgress = async (scrollData, tracksH) => {
    const scrollbar = tracksH ? scrollbarH : scrollbarV;
    const hasBarPrefix = `${PREFIX_HAS_SCROLLBAR}-${tracksH ? positionH : positionV}`;
    const completeFraction = tracksH ? scrollData[S_SCROLL_LEFT_FRACTION] : scrollData[S_SCROLL_TOP_FRACTION];
    const viewFraction = tracksH ? scrollData[S_CLIENT_WIDTH] / scrollData[S_SCROLL_WIDTH] : scrollData[S_CLIENT_HEIGHT] / scrollData[S_SCROLL_HEIGHT];
    setAttr(scrollbar, S_ARIA_VALUENOW, round(completeFraction * 100) + "");
    setNumericStyleProps(scrollbar, {
      viewFr: viewFraction,
      completeFr: completeFraction
    }, {
      _numDecimal: 4
    });
    const scrollAxis = tracksH ? "x" : "y";
    if (isScrollable(scrollable, {
      axis: scrollAxis
    }) && viewFraction < 1) {
      setBoolData(containerElement, hasBarPrefix);
      displayElement(scrollbar);
    } else {
      delData(containerElement, hasBarPrefix);
      undisplayElement(scrollbar);
    }
  };
  const updateProgress = (target, scrollData) => {
    setProgress(scrollData, true);
    setProgress(scrollData, false);
    if (!isMainScrollable && !isBody) {
      setBoxMeasureProps(containerElement);
    }
    if (autoHideDelay > 0) {
      showElement(wrapper).then(() => hideElement(wrapper, autoHideDelay));
    }
  };
  const updatePropsOnResize = (target, sizeData) => {
    setBoxMeasureProps(containerElement);
    setNumericStyleProps(containerElement, {
      barHeight: sizeData.border[S_HEIGHT]
    }, {
      _units: "px",
      _numDecimal: 2
    });
  };
  let isDragging = false;
  let lastOffset = 0;
  let lastTargetFraction = 0;
  let scrollAction;
  const onClickOrDrag = async (event, tracksH) => {
    preventDefault(event);
    const scrollbar = tracksH ? scrollbarH : scrollbarV;
    const handle = tracksH ? handleH : handleV;
    const target = targetOf(event);
    if (!isMouseEvent(event) || !isHTMLElement(target)) {
      return;
    }
    const eventType = event.type;
    const isClick = eventType === S_POINTERDOWN || eventType === S_MOUSEDOWN;
    const isHandleClick = isClick && useHandle && hasClass(target, PREFIX_HANDLE);
    const startsDrag = isClick && dragScroll && (isHandleClick || !useHandle);
    if (startsDrag) {
      isDragging = true;
      setOrReleasePointerCapture(event, scrollbar, S_SET_POINTER_CAPTURE);
    }
    if (!isClick && !isDragging || isClick && !startsDrag && !clickScroll) {
      return;
    }
    await waitForMeasureTime();
    const barIsHorizontal = isHorizontal(scrollbar);
    const barLength = barIsHorizontal ? scrollbar[S_CLIENT_WIDTH] : scrollbar[S_CLIENT_HEIGHT];
    const currScrollOffset = tracksH ? scrollable[S_SCROLL_LEFT] : scrollable[S_SCROLL_TOP];
    const maxScrollOffset = tracksH ? scrollable[S_SCROLL_WIDTH] - getClientWidthNow(scrollable) : scrollable[S_SCROLL_HEIGHT] - getClientHeightNow(scrollable);
    const rect = getBoundingClientRect(scrollbar);
    const offset = barIsHorizontal ? event.clientX - rect.left : event.clientY - rect.top;
    if (offset === lastOffset) {
      return;
    }
    const deltaOffset = isClick ? offset : offset - lastOffset;
    lastOffset = offset;
    if (!isClick && useHandle) {
      const handleLength = handle ? parseFloat(getComputedStylePropNow(handle, barIsHorizontal ? S_WIDTH : S_HEIGHT)) : 0;
      lastTargetFraction = lastTargetFraction + deltaOffset / (barLength - (handleLength || 0));
    } else if (isHandleClick) {
      lastTargetFraction = currScrollOffset / maxScrollOffset;
    } else {
      lastTargetFraction = offset / barLength;
    }
    if (isHandleClick || isClick && !clickScroll) {
      return;
    }
    const targetScrollOffset = lastTargetFraction * maxScrollOffset;
    const targetCoordinates = tracksH ? {
      left: targetScrollOffset
    } : {
      top: targetScrollOffset
    };
    if (isClick) {
      scrollAction = await scrollWatcher.scrollTo(targetCoordinates, {
        scrollable,
        weCanInterrupt: true
      });
    } else {
      var _scrollAction;
      (_scrollAction = scrollAction) === null || _scrollAction === void 0 || _scrollAction.cancel();
      scrollAction = null;
      elScrollTo(scrollable, targetCoordinates);
    }
  };
  const onRelease = (event, tracksH) => {
    const scrollbar = tracksH ? scrollbarH : scrollbarV;
    setOrReleasePointerCapture(event, scrollbar, S_RELEASE_POINTER_CAPTURE);
    isDragging = false;
    scrollAction = null;
  };
  const onClickOrDragH = event => onClickOrDrag(event, true);
  const onClickOrDragV = event => onClickOrDrag(event, false);
  const onReleaseH = event => onRelease(event, true);
  const onReleaseV = event => onRelease(event, false);
  const maybeSetNativeHidden = () => {
    if (hideNative) {
      addClasses(scrollable, PREFIX_HIDE_SCROLL);
      if (isBodyInQuirks) {
        addClasses(getDocElement(), PREFIX_HIDE_SCROLL);
      }
    }
  };
  const setNativeShown = () => {
    removeClasses(scrollable, PREFIX_HIDE_SCROLL);
    if (isBodyInQuirks) {
      removeClasses(getDocElement(), PREFIX_HIDE_SCROLL);
    }
  };
  const addWatchers = () => {
    scrollWatcher.trackScroll(updateProgress, {
      threshold: 0,
      scrollable
    });
    sizeWatcher.onResize(updatePropsOnResize, {
      target: containerElement,
      threshold: 0
    });
  };
  const removeWatchers = () => {
    scrollWatcher.noTrackScroll(updateProgress, scrollable);
    sizeWatcher.offResize(updatePropsOnResize, containerElement);
  };
  if (!isMainScrollable && !isBody) {
    addClasses(containerElement, PREFIX_CONTAINER);
  }
  setBoolData(containerElement, PREFIX_ALLOW_COLLAPSE, !IS_MOBILE);
  if (contentWrapper) {
    addClasses(contentWrapper, PREFIX_CONTENT);
    wrapChildren(containerElement, {
      wrapper: contentWrapper});
    setBoolData(containerElement, PREFIX_HAS_WRAPPER);
    if (hasFixedHeight) {
      setBoolData(containerElement, PREFIX_HAS_FIXED_HEIGHT);
    }
  }
  maybeSetNativeHidden();
  if (config !== null && config !== void 0 && config.id) {
    scrollable.id = config.id;
  }
  if (config !== null && config !== void 0 && config.className) {
    addClasses(scrollable, ...toArrayIfSingle(config.className));
  }
  const scrollDomID = clickScroll || dragScroll ? getOrAssignID(scrollable, S_SCROLLBAR) : "";
  const scrollWatcher = ScrollWatcher.reuse({
    [S_DEBOUNCE_WINDOW]: 0
  });
  const sizeWatcher = SizeWatcher.reuse({
    [S_DEBOUNCE_WINDOW]: 0
  });
  addClasses(barParent, PREFIX_ROOT$1);
  const wrapper = createElement("div");
  preventSelect(wrapper);
  addClasses(wrapper, PREFIX_NO_TOUCH_ACTION);
  addClasses(wrapper, PREFIX_WRAPPER);
  if (isBody || isMainScrollable) {
    setData(wrapper, PREFIX_POSITION, S_FIXED);
  } else if (needsSticky) {
    setData(wrapper, PREFIX_POSITION, S_STICKY);
  }
  const {
    _bar: scrollbarH,
    _handle: handleH
  } = newScrollbar(wrapper, positionH);
  const {
    _bar: scrollbarV,
    _handle: handleV
  } = newScrollbar(wrapper, positionV);
  moveElement(wrapper, {
    to: barParent,
    position: "prepend"
  });
  addWatchers();
  if (dragScroll) {
    addEventListenerTo(scrollbarH, S_POINTERMOVE, onClickOrDragH);
    addEventListenerTo(scrollbarV, S_POINTERMOVE, onClickOrDragV);
    addEventListenerTo(scrollbarH, S_POINTERUP, onReleaseH);
    addEventListenerTo(scrollbarV, S_POINTERUP, onReleaseV);
  }
  if (dragScroll || clickScroll) {
    addEventListenerTo(scrollbarH, S_POINTERDOWN, onClickOrDragH);
    addEventListenerTo(scrollbarV, S_POINTERDOWN, onClickOrDragV);
  }
  widget.onDisable(() => {
    removeWatchers();
    undisplayElement(scrollbarH);
    undisplayElement(scrollbarV);
    setNativeShown();
  });
  widget.onEnable(() => {
    addWatchers();
    displayElement(scrollbarH);
    displayElement(scrollbarV);
    maybeSetNativeHidden();
  });
  widget.onDestroy(async () => {
    unmapScrollable(root);
    await waitForMutateTime();
    if (contentWrapper) {
      moveChildrenNow(contentWrapper, containerElement, {
        ignoreMove: true
      });
      moveElementNow(contentWrapper);
    }
    moveElementNow(wrapper);
    if (dragScroll) {
      removeEventListenerFrom(scrollbarH, S_POINTERMOVE, onClickOrDragH);
      removeEventListenerFrom(scrollbarV, S_POINTERMOVE, onClickOrDragV);
      removeEventListenerFrom(scrollbarH, S_POINTERUP, onReleaseH);
      removeEventListenerFrom(scrollbarV, S_POINTERUP, onReleaseV);
    }
    if (dragScroll || clickScroll) {
      removeEventListenerFrom(scrollbarH, S_POINTERDOWN, onClickOrDragH);
      removeEventListenerFrom(scrollbarV, S_POINTERDOWN, onClickOrDragV);
    }
    removeClassesNow(barParent, PREFIX_ROOT$1);
    removeClassesNow(containerElement, PREFIX_CONTAINER);
    for (const position of [S_TOP, S_BOTTOM, S_LEFT, S_RIGHT]) {
      delDataNow(containerElement, `${PREFIX_HAS_SCROLLBAR}-${position}`);
    }
    delDataNow(containerElement, PREFIX_HAS_WRAPPER);
    if (hasFixedHeight) {
      delDataNow(containerElement, PREFIX_HAS_FIXED_HEIGHT);
    }
  });
};
const isHorizontal = scrollbar => getData(scrollbar, PREFIX_ORIENTATION) === S_HORIZONTAL;
const setBoxMeasureProps = async element => {
  for (const side of [S_TOP, S_RIGHT, S_BOTTOM, S_LEFT]) {
    for (const key of [`padding-${side}`, `border-${side}-width`]) {
      const padding = await getComputedStyleProp(element, key);
      setStyleProp(element, prefixCssJsVar(key), padding);
    }
  }
};
const setOrReleasePointerCapture = (event, scrollbar, method) => {
  if (isPointerEvent(event) && method in scrollbar) {
    scrollbar[method](event.pointerId);
  }
};

class ScrollToTop extends Widget {
  static get(element) {
    if (!element) {
      return mainWidget;
    }
    const instance = super.get(element, DUMMY_ID$5);
    if (isInstanceOf(instance, ScrollToTop)) {
      return instance;
    }
    return null;
  }
  static register() {
    registerWidget(WIDGET_NAME$5, (element, config) => {
      if (!ScrollToTop.get(element)) {
        return new ScrollToTop(element, config);
      }
      return null;
    }, configValidator$3);
  }
  static enableMain(config) {
    const button = createButton("Back to top");
    const widget = new ScrollToTop(button, config);
    widget.onDestroy(() => {
      if (mainWidget === widget) {
        mainWidget = null;
      }
      return moveElement(button);
    });
    waitForElement(getBody).then(body => {
      if (!widget.isDestroyed()) {
        moveElement(button, {
          to: body
        });
      }
    });
    mainWidget = widget;
    return widget;
  }
  constructor(element, config) {
    var _ScrollToTop$get;
    const destroyPromise = (_ScrollToTop$get = ScrollToTop.get(element)) === null || _ScrollToTop$get === void 0 ? void 0 : _ScrollToTop$get.destroy();
    super(element, {
      id: DUMMY_ID$5
    });
    const scrollWatcher = ScrollWatcher.reuse();
    const viewWatcher = ViewWatcher.reuse();
    const offset = (config === null || config === void 0 ? void 0 : config.offset) || `${S_TOP}: var(${prefixCssVar("scroll-to-top--offset")}, 200vh)`;
    const position = (config === null || config === void 0 ? void 0 : config.position) || S_RIGHT;
    const clickListener = () => scrollWatcher.scrollTo({
      top: 0
    });
    const arrow = insertArrow(element, S_UP);
    const showIt = () => {
      showElement(element);
    };
    const hideIt = () => {
      hideElement(element);
    };
    (destroyPromise || promiseResolve()).then(() => {
      if (this.isDestroyed()) {
        return;
      }
      disableInitialTransition(element);
      addClasses(element, PREFIX_ROOT);
      setData(element, PREFIX_PLACE, position);
      hideIt();
      addEventListenerTo(element, S_CLICK, clickListener);
      viewWatcher.onView(offset, showIt, {
        views: [S_AT, S_BELOW]
      });
      viewWatcher.onView(offset, hideIt, {
        views: [S_ABOVE]
      });
      this.onDisable(() => {
        undisplayElement(element);
      });
      this.onEnable(() => {
        displayElement(element);
      });
      this.onDestroy(async () => {
        removeEventListenerFrom(element, S_CLICK, clickListener);
        await delData(element, PREFIX_PLACE);
        await moveElement(arrow);
        await removeClasses(element, PREFIX_ROOT);
        await displayElement(element);
        viewWatcher.offView(offset, showIt);
        viewWatcher.offView(offset, hideIt);
      });
    });
  }
}
const WIDGET_NAME$5 = "scroll-to-top";
const PREFIXED_NAME$1 = prefixName(WIDGET_NAME$5);
const PREFIX_ROOT = `${PREFIXED_NAME$1}__root`;
const DUMMY_ID$5 = PREFIXED_NAME$1;
let mainWidget = null;
const configValidator$3 = {
  offset: (key, value) => validateString(key, value, isValidScrollOffset),
  position: (key, value) => validateString(key, value, v => v === S_LEFT || v === S_RIGHT)
};

class Sortable extends Widget {
  static get(element) {
    const instance = super.get(element, DUMMY_ID$4);
    if (isInstanceOf(instance, Sortable)) {
      return instance;
    }
    return null;
  }
  static register() {
    registerWidget(WIDGET_NAME$4, (element, config) => {
      if (!Sortable.get(element)) {
        return new Sortable(element, config);
      }
      return null;
    }, configValidator$2);
  }
  constructor(element, config) {
    var _Sortable$get;
    const destroyPromise = (_Sortable$get = Sortable.get(element)) === null || _Sortable$get === void 0 ? void 0 : _Sortable$get.destroy();
    super(element, {
      id: DUMMY_ID$4
    });
    const items = (config === null || config === void 0 ? void 0 : config.items) || [];
    if (!lengthOf(items)) {
      items.push(...querySelectorAll(element, getDefaultWidgetSelector(PREFIX_ITEM__FOR_SELECT)));
      if (!lengthOf(items)) {
        items.push(...querySelectorAll(element, `[${S_DRAGGABLE}]`));
        if (!lengthOf(items)) {
          items.push(...getVisibleContentChildren(element));
        }
      }
    }
    if (lengthOf(items) < 2) {
      throw usageError("Sortable must have more than 1 item");
    }
    const methods = getMethods(this, items, config);
    (destroyPromise || promiseResolve()).then(() => {
      if (this.isDestroyed()) {
        return;
      }
      init(this, element, items, methods);
    });
    this.disableItem = methods._disableItem;
    this.enableItem = methods._enableItem;
    this.toggleItem = methods._toggleItem;
    this.isItemDisabled = methods._isItemDisabled;
    this.onMove = methods._onMove;
    this.getItems = (currentOrder = false) => currentOrder ? methods._getSortedItems() : [...items];
  }
}
const WIDGET_NAME$4 = "sortable";
const PREFIXED_NAME = prefixName(WIDGET_NAME$4);
const PREFIX_IS_DRAGGABLE = prefixName("is-draggable");
const PREFIX_ITEM = `${PREFIXED_NAME}__item`;
const PREFIX_ITEM__FOR_SELECT = `${PREFIXED_NAME}-item`;
const PREFIX_FLOATING_CLONE = `${PREFIXED_NAME}__ghost`;
const DUMMY_ID$4 = PREFIXED_NAME;
const configValidator$2 = {
  mode: (key, value) => validateString(key, value, v => v === "swap" || v === "move")
};
const touchMoveOptions = {
  passive: false,
  capture: true
};
const isItemDraggable = item => getBoolData(item, PREFIX_IS_DRAGGABLE);
const init = (widget, element, items, methods) => {
  let currentDraggedItem = null;
  let floatingClone = null;
  let ignoreCancel = false;
  let grabOffset = [0, 0];
  const setIgnoreCancel = () => ignoreCancel = true;
  const onDragStart = event => {
    const currTarget = currentTargetOf(event);
    if (isElement(currTarget) && isItemDraggable(currTarget) && isMouseEvent(event)) {
      currentDraggedItem = currTarget;
      setAttr(currTarget, S_DRAGGABLE);
      if (isTouchPointerEvent(event)) {
        const target = targetOf(event);
        if (isElement(target)) {
          target.releasePointerCapture(event.pointerId);
        }
      }
      addEventListenerTo(getDoc(), S_TOUCHMOVE, onTouchMove, touchMoveOptions);
      waitForMeasureTime().then(() => {
        const rect = getBoundingClientRect(currTarget);
        grabOffset = [event.clientX - rect.left, event.clientY - rect.top];
      });
    }
  };
  const onDragEnd = event => {
    if (ignoreCancel && event.type === S_POINTERCANCEL) {
      ignoreCancel = false;
      return;
    }
    if (currentDraggedItem) {
      unsetAttr(currentDraggedItem, S_DRAGGABLE);
      currentDraggedItem = null;
      removeEventListenerFrom(getDoc(), S_TOUCHMOVE, onTouchMove, touchMoveOptions);
      if (floatingClone) {
        moveElement(floatingClone);
        floatingClone = null;
      }
    }
  };
  const onTouchMove = event => {
    if (isTouchEvent(event) && lengthOf(event.touches) === 1) {
      const parentEl = parentOf(currentDraggedItem);
      if (parentEl && currentDraggedItem) {
        preventDefault(event);
        const touch = event.touches[0];
        const clientX = touch.clientX;
        const clientY = touch.clientY;
        if (!floatingClone) {
          floatingClone = cloneElement(currentDraggedItem);
          addClasses(floatingClone, PREFIX_FLOATING_CLONE);
          copyStyle(currentDraggedItem, floatingClone, ["width", "height"]).then(() => {
            if (floatingClone) {
              moveElement(floatingClone, {
                to: parentEl
              });
            }
          });
        }
        if (floatingClone) {
          setNumericStyleProps(floatingClone, {
            clientX: clientX - grabOffset[0],
            clientY: clientY - grabOffset[1]
          }, {
            _units: "px"
          });
        }
      }
    }
  };
  const onDragEnter = event => {
    const currTarget = currentTargetOf(event);
    const dragged = currentDraggedItem;
    if ((isTouchPointerEvent(event) || event.type === S_DRAGENTER) && dragged && isElement(currTarget) && currTarget !== dragged) {
      methods._dragItemOnto(dragged, currTarget);
    }
  };
  const setupEvents = () => {
    for (const item of items) {
      preventSelect(item);
      addEventListenerTo(item, S_POINTERDOWN, onDragStart);
      addEventListenerTo(item, S_DRAGSTART, setIgnoreCancel);
      addEventListenerTo(item, S_POINTERENTER, onDragEnter);
      addEventListenerTo(item, S_DRAGENTER, onDragEnter);
      addEventListenerTo(item, S_DRAGOVER, preventDefault);
      addEventListenerTo(item, S_DRAGEND, onDragEnd);
      addEventListenerTo(item, S_DROP, onDragEnd);
      addEventListenerTo(getDoc(), S_POINTERUP, onDragEnd);
      addEventListenerTo(getDoc(), S_POINTERCANCEL, onDragEnd);
    }
  };
  for (const item of items) {
    addClasses(item, PREFIX_ITEM);
    setBoolData(item, PREFIX_IS_DRAGGABLE);
  }
  widget.onEnable(setupEvents);
  widget.onDisable(() => {
    for (const item of items) {
      undoPreventSelect(item);
      removeEventListenerFrom(item, S_POINTERDOWN, onDragStart);
      removeEventListenerFrom(item, S_DRAGSTART, setIgnoreCancel);
      removeEventListenerFrom(item, S_POINTERENTER, onDragEnter);
      removeEventListenerFrom(item, S_DRAGENTER, onDragEnter);
      removeEventListenerFrom(item, S_DRAGOVER, preventDefault);
      removeEventListenerFrom(item, S_POINTERUP, onDragEnd);
      removeEventListenerFrom(item, S_POINTERCANCEL, onDragEnd);
      removeEventListenerFrom(item, S_DRAGEND, onDragEnd);
      removeEventListenerFrom(item, S_DROP, onDragEnd);
    }
  });
  widget.onDestroy(async () => {
    for (const item of items) {
      await removeClasses(item, PREFIX_ITEM);
      await delData(item, PREFIX_IS_DRAGGABLE);
    }
  });
  setupEvents();
};
const getMethods = (widget, items, config) => {
  const doSwap = (config === null || config === void 0 ? void 0 : config.mode) === "swap";
  const disabledItems = {};
  const callbacks = newSet();
  const getSortedItems = () => [...items].sort((a, b) => isNodeBAfterA(a, b) ? -1 : 1);
  const getOrigItemNumber = (itemNum, currentOrder = false) => currentOrder ? items.indexOf(getSortedItems()[itemNum - 1]) + 1 : itemNum;
  const isItemDisabled = (itemNum, currentOrder = false) => disabledItems[getOrigItemNumber(itemNum, currentOrder)] === true;
  const disableItem = async (itemNum, currentOrder = false) => {
    itemNum = getOrigItemNumber(toInt(itemNum), currentOrder);
    if (widget.isDisabled() || itemNum < 1 || itemNum > lengthOf(items)) {
      return;
    }
    disabledItems[itemNum] = true;
    await unsetBoolData(items[itemNum - 1], PREFIX_IS_DRAGGABLE);
  };
  const enableItem = async (itemNum, currentOrder = false) => {
    itemNum = getOrigItemNumber(toInt(itemNum), currentOrder);
    if (widget.isDisabled() || !isItemDisabled(itemNum)) {
      return;
    }
    disabledItems[itemNum] = false;
    await setBoolData(items[itemNum - 1], PREFIX_IS_DRAGGABLE);
  };
  const toggleItem = (itemNum, currentOrder = false) => isItemDisabled(itemNum, currentOrder) ? enableItem(itemNum, currentOrder) : disableItem(itemNum, currentOrder);
  const onMove = handler => callbacks.add(wrapCallback(handler));
  const dragItemOnto = async (dragged, draggedOver) => {
    if (doSwap) {
      await swapElements(dragged, draggedOver, {
        ignoreMove: true
      });
    } else {
      await moveElement(dragged, {
        to: draggedOver,
        position: isNodeBAfterA(dragged, draggedOver) ? "after" : "before",
        ignoreMove: true
      });
    }
    for (const callback of callbacks) {
      await callback.invoke(widget);
    }
  };
  return {
    _getSortedItems: getSortedItems,
    _disableItem: disableItem,
    _enableItem: enableItem,
    _toggleItem: toggleItem,
    _isItemDisabled: isItemDisabled,
    _onMove: onMove,
    _dragItemOnto: dragItemOnto
  };
};

class TrackGesture extends Widget {
  static get(element) {
    const instance = super.get(element, DUMMY_ID$3);
    if (isInstanceOf(instance, TrackGesture)) {
      return instance;
    }
    return null;
  }
  static register() {
    registerWidget(WIDGET_NAME$3, (element, config) => {
      if (!TrackGesture.get(element)) {
        return new TrackGesture(element, config);
      }
      return null;
    }, configValidator$1);
  }
  constructor(element, config) {
    super(element, {
      id: DUMMY_ID$3
    });
    GestureWatcher.reuse().trackGesture(element, null, {
      preventDefault: config === null || config === void 0 ? void 0 : config.preventDefault,
      minTotalDeltaX: config === null || config === void 0 ? void 0 : config.minDeltaX,
      maxTotalDeltaX: config === null || config === void 0 ? void 0 : config.maxDeltaX,
      minTotalDeltaY: config === null || config === void 0 ? void 0 : config.minDeltaY,
      maxTotalDeltaY: config === null || config === void 0 ? void 0 : config.maxDeltaY,
      minTotalDeltaZ: config === null || config === void 0 ? void 0 : config.minDeltaZ,
      maxTotalDeltaZ: config === null || config === void 0 ? void 0 : config.maxDeltaZ
    });
    this.onDestroy(() => GestureWatcher.reuse().noTrackGesture(element));
  }
}
const WIDGET_NAME$3 = "track-gesture";
const DUMMY_ID$3 = WIDGET_NAME$3;
const configValidator$1 = {
  preventDefault: validateBoolean,
  minDeltaX: validateNumber,
  maxDeltaX: validateNumber,
  minDeltaY: validateNumber,
  maxDeltaY: validateNumber,
  minDeltaZ: validateNumber,
  maxDeltaZ: validateNumber
};

class TrackScroll extends Widget {
  static get(element) {
    const instance = super.get(element, DUMMY_ID$2);
    if (isInstanceOf(instance, TrackScroll)) {
      return instance;
    }
    return null;
  }
  static register() {
    registerWidget(WIDGET_NAME$2, (element, config) => {
      if (!TrackScroll.get(element)) {
        return new TrackScroll(element, config);
      }
      return null;
    }, configValidator);
  }
  constructor(element, config) {
    super(element, {
      id: DUMMY_ID$2
    });
    ScrollWatcher.reuse().trackScroll(null, assign({
      scrollable: element
    }, config));
    this.onDestroy(() => ScrollWatcher.reuse().noTrackScroll(null, element));
  }
}
const WIDGET_NAME$2 = "track-scroll";
const DUMMY_ID$2 = WIDGET_NAME$2;
const configValidator = {
  threshold: validateNumber,
  debounceWindow: validateNumber
};

class TrackSize extends Widget {
  static get(element) {
    const instance = super.get(element, DUMMY_ID$1);
    if (isInstanceOf(instance, TrackSize)) {
      return instance;
    }
    return null;
  }
  static register() {
    registerWidget(WIDGET_NAME$1, element => {
      if (!TrackSize.get(element)) {
        return new TrackSize(element);
      }
      return null;
    });
  }
  constructor(element) {
    super(element, {
      id: DUMMY_ID$1
    });
    SizeWatcher.reuse().trackSize(null, {
      target: element,
      threshold: 0
    });
    this.onDestroy(() => SizeWatcher.reuse().noTrackSize(null, element));
  }
}
const WIDGET_NAME$1 = "track-size";
const DUMMY_ID$1 = WIDGET_NAME$1;

class TrackView extends Widget {
  static get(element) {
    const instance = super.get(element, DUMMY_ID);
    if (isInstanceOf(instance, TrackView)) {
      return instance;
    }
    return null;
  }
  static register() {
    registerWidget(WIDGET_NAME, (element, config) => {
      if (!TrackView.get(element)) {
        return new TrackView(element, config);
      }
      return null;
    }, newConfigValidator);
  }
  constructor(element, config) {
    var _config$rootMargin;
    super(element, {
      id: DUMMY_ID
    });
    const watcher = ViewWatcher.reuse({
      root: config === null || config === void 0 ? void 0 : config.root,
      rootMargin: config === null || config === void 0 || (_config$rootMargin = config.rootMargin) === null || _config$rootMargin === void 0 ? void 0 : _config$rootMargin.replace(/,/g, " "),
      threshold: config === null || config === void 0 ? void 0 : config.threshold
    });
    watcher.trackView(element, null, config);
    this.onDestroy(() => watcher.noTrackView(element));
  }
}
const WIDGET_NAME = "track-view";
const DUMMY_ID = WIDGET_NAME;
const newConfigValidator = element => {
  return {
    root: (key, value) => {
      var _ref;
      return (_ref = isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref !== void 0 ? _ref : undefined;
    },
    rootMargin: validateString,
    threshold: (key, value) => validateNumList(key, value),
    debounceWindow: validateNumber,
    resizeThreshold: validateNumber,
    scrollThreshold: validateNumber
  };
};

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  AutoHide: AutoHide,
  Collapsible: Collapsible,
  Modal: Modal,
  Offcanvas: Offcanvas,
  Openable: Openable,
  PageLoader: PageLoader,
  Pager: Pager,
  Popup: Popup,
  SameHeight: SameHeight,
  ScrollToTop: ScrollToTop,
  Scrollbar: Scrollbar,
  Sortable: Sortable,
  TrackGesture: TrackGesture,
  TrackScroll: TrackScroll,
  TrackSize: TrackSize,
  TrackView: TrackView,
  Widget: Widget,
  fetchUniqueWidget: fetchUniqueWidget,
  fetchWidgetConfig: fetchWidgetConfig,
  getDefaultWidgetSelector: getDefaultWidgetSelector,
  getWidgetConfig: getWidgetConfig,
  registerOpenable: registerOpenable,
  registerWidget: registerWidget
});

AddClass.register();
RemoveClass.register();
AnimatePlay.register();
AnimatePause.register();
Animate.register();
Display.register();
Undisplay.register();
Open.register();
NextPage.register();
PrevPage.register();
GoToPage.register();
EnablePage.register();
DisablePage.register();
ScrollTo.register();
SetAttribute.register();
Show.register();
Hide.register();
Enable.register();
Disable.register();
Run.register();
LayoutTrigger.register();
LoadTrigger.register();
ClickTrigger.register();
PressTrigger.register();
HoverTrigger.register();
ScrollTrigger.register();
Trigger.register();
ViewTrigger.register();
AutoHide.register();
Collapsible.register();
Popup.register();
Modal.register();
Offcanvas.register();
PageLoader.register();
Pager.register();
SameHeight.register();
ScrollToTop.register();
Scrollbar.register();
Sortable.register();
TrackGesture.register();
TrackScroll.register();
TrackSize.register();
TrackView.register();

export { _actions as actions, settings, index$1 as triggers, index$2 as watchers, index as widgets };
//# sourceMappingURL=lisn.es.js.map
