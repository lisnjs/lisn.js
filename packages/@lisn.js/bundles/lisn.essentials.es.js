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
const S_SKIP_INITIAL = "skipInitial";
const S_DEBOUNCE_WINDOW = "debounceWindow";
const S_CANCEL = "cancel";
const S_KEYDOWN = S_KEY + S_DOWN;
const S_MOUSEUP = S_MOUSE + S_UP;
const S_MOUSEDOWN = S_MOUSE + S_DOWN;
const S_POINTERUP = S_POINTER + S_UP;
const S_POINTERDOWN = S_POINTER + S_DOWN;
const S_POINTERMOVE = `${S_POINTER}move`;
const S_POINTERCANCEL = S_POINTER + S_CANCEL;
const S_TOUCHSTART = `${S_TOUCH}start`;
const S_TOUCHEND = `${S_TOUCH}end`;
const S_TOUCHMOVE = `${S_TOUCH}move`;
const S_TOUCHCANCEL = S_TOUCH + S_CANCEL;
const S_SELECTSTART = "selectstart";
const S_ATTRIBUTES = "attributes";
const S_CHILD_LIST = "childList";
const PREFIX_NO_SELECT = `${PREFIX}-no-select`;
const PREFIX_NO_TOUCH_ACTION = `${PREFIX}-no-touch-action`;
const PREFIX_NO_WRAP = `${PREFIX}-no-wrap`;
const USER_AGENT = typeof navigator === "undefined" ? "" : navigator.userAgent;
USER_AGENT.match(/Mobile|Android|Silk\/|Kindle|BlackBerry|Opera Mini|Opera Mobi/) !== null;

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
const camelToKebabCase$1 = str => str.replace(/[A-Z][a-z]/g, m => "-" + toLowerCase(m)).replace(/[A-Z]+/, m => "-" + toLowerCase(m));
const prefixName = name => `${PREFIX}-${name}`;
const prefixCssVar = name => "--" + prefixName(name);
const prefixCssJsVar = name => prefixCssVar("js--" + name);
const prefixData = name => `data-${camelToKebabCase$1(name)}`;
const toLowerCase = s => s.toLowerCase();
const timeNow = Date.now.bind(Date);
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
const isNullish = v => v === undefined || v === null;
const isEmpty = v => isNullish(v) || v === "";
const isIterableObject = v => isNonPrimitive(v) && SYMBOL.iterator in v;
const isArray = v => isInstanceOf(v, ARRAY);
const isObject = v => isInstanceOf(v, OBJECT);
const isNonPrimitive = v => v !== null && typeOf(v) === "object";
const isNumber = v => typeOf(v) === "number";
const isString = v => typeOf(v) === "string" || isInstanceOf(v, STRING);
const isLiteralString = v => typeOf(v) === "string";
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
const getAttr = (el, name) => el.getAttribute(name);
const setAttr = (el, name, value = "true") => el.setAttribute(name, value);
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
PROMISE.resolve.bind(PROMISE);
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
NUMBER.isNaN.bind(NUMBER);
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
  const numValue = toNum(value, null);
  const min = (_limits$min = limits === null || limits === void 0 ? void 0 : limits.min) !== null && _limits$min !== void 0 ? _limits$min : null;
  const max = (_limits$max = limits === null || limits === void 0 ? void 0 : limits.max) !== null && _limits$max !== void 0 ? _limits$max : null;
  let result;
  if (!isValidNum(numValue)) {
    var _ref;
    result = (_ref = min !== null && min !== void 0 ? min : max) !== null && _ref !== void 0 ? _ref : 0;
  } else if (min !== null && numValue < min) {
    result = min;
  } else if (max !== null && numValue > max) {
    result = max;
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
const easeInOutQuad = x => x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;
const sortedKeysByVal = (obj, descending = false) => {
  if (descending) {
    return keysOf(obj).sort((x, y) => obj[y] - obj[x]);
  }
  return keysOf(obj).sort((x, y) => obj[x] - obj[y]);
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
const _validateString = (key, value, checkFn, typeDescription) => {
  if (isNullish(value)) {
    return;
  }
  if (!isLiteralString(value)) {
    throw usageError(`'${key}' must be ${typeDescription }`);
  } else if (checkFn && !checkFn(value)) {
    throw usageError(`Invalid value for '${key}'`);
  }
  return value;
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

const isInlineTag = tagName => inlineTags.has(tagName.toLowerCase());
const isDOMElement = target => isHTMLElement(target) || isInstanceOf(target, SVGElement) || typeof MathMLElement !== "undefined" && isInstanceOf(target, MathMLElement);
const inlineTags = newSet(["a", "abbr", "acronym", "b", "bdi", "bdo", "big", "button", "cite", "code", "data", "dfn", "em", "i", "img", "input", "kbd", "label", "mark", "map", "object", "output", "q", "rp", "rt", "ruby", "s", "samp", "script", "select", "small", "span", "strong", "sub", "sup", "textarea", "time", "tt", "u", "var"]);

const hasClass = (el, className) => classList(el).contains(className);
const addClassesNow = (el, ...classNames) => classList(el).add(...classNames);
const addClasses = (el, ...classNames) => waitForMutateTime().then(() => addClassesNow(el, ...classNames));
const removeClassesNow = (el, ...classNames) => classList(el).remove(...classNames);
const removeClasses = (el, ...classNames) => waitForMutateTime().then(() => removeClassesNow(el, ...classNames));
const getData = (el, name) => getAttr(el, prefixData(name));
const setDataNow = (el, name, value) => setAttr(el, prefixData(name), value);
const getComputedStylePropNow = (element, prop) => getComputedStyle(element).getPropertyValue(prop);
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
newWeakMap();

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
    let instance = (_instances$get = instances$6.get(root)) === null || _instances$get === void 0 ? void 0 : _instances$get.get(configStrKey);
    if (!instance) {
      instance = new DOMWatcher(myConfig, CONSTRUCTOR_KEY$6);
      instances$6.sGet(root).set(configStrKey, instance);
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
const instances$6 = newXMap(() => newMap());
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
const isValidDirection = direction => includes(DIRECTIONS, direction);
const XY_DIRECTIONS = [S_UP, S_DOWN, S_LEFT, S_RIGHT];
const Z_DIRECTIONS = [S_IN, S_OUT];
const SCROLL_DIRECTIONS = [...XY_DIRECTIONS, S_NONE, S_AMBIGUOUS];
const DIRECTIONS = [...XY_DIRECTIONS, ...Z_DIRECTIONS, S_NONE, S_AMBIGUOUS];

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
    let instance = instances$5.get(configStrKey);
    if (!instance) {
      instance = new GestureWatcher(myConfig, CONSTRUCTOR_KEY$5);
      instances$5.set(configStrKey, instance);
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
const instances$5 = newMap();
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
const getClientWidthNow = element => isScrollableBodyInQuirks(element) ? element.offsetWidth - getBorderWidth(element, S_LEFT) - getBorderWidth(element, S_RIGHT) : element[S_CLIENT_WIDTH];
const getClientHeightNow = element => isScrollableBodyInQuirks(element) ? element.offsetHeight - getBorderWidth(element, S_TOP) - getBorderWidth(element, S_BOTTOM) : element[S_CLIENT_HEIGHT];
const fetchMainContentElement = async () => {
  await init$1();
  return mainContentElement;
};
const tryGetMainScrollableElement = () => mainScrollableElement !== null && mainScrollableElement !== void 0 ? mainScrollableElement : null;
const fetchMainScrollableElement = async () => {
  await init$1();
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
const init$1 = () => {
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
  waitForInteractive().then(init$1);
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
  await init();
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
const init = () => {
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
    let instance = instances$4.get(configStrKey);
    if (!instance) {
      instance = new SizeWatcher(myConfig, CONSTRUCTOR_KEY$4);
      instances$4.set(configStrKey, instance);
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
const instances$4 = newMap();
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
    let instance = (_instances$get = instances$3.get(myConfig._root)) === null || _instances$get === void 0 ? void 0 : _instances$get.get(configStrKey);
    if (!instance) {
      instance = new LayoutWatcher(myConfig, CONSTRUCTOR_KEY$3);
      instances$3.sGet(myConfig._root).set(configStrKey, instance);
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
const instances$3 = newXMap(() => newMap());
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
    let instance = instances$2.get(configStrKey);
    if (!instance) {
      instance = new PointerWatcher(myConfig, CONSTRUCTOR_KEY$2);
      instances$2.set(configStrKey, instance);
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
const instances$2 = newMap();
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
    let instance = instances$1.get(configStrKey);
    if (!instance) {
      instance = new ScrollWatcher(myConfig, CONSTRUCTOR_KEY$1);
      instances$1.set(configStrKey, instance);
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
const instances$1 = newMap();
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

const isValidView = view => includes(VIEWS, view);
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
    let instance = (_instances$get = instances.get(myConfig._root)) === null || _instances$get === void 0 ? void 0 : _instances$get.get(configStrKey);
    if (!instance) {
      instance = new ViewWatcher(myConfig, CONSTRUCTOR_KEY);
      instances.sGet(myConfig._root).set(configStrKey, instance);
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
const instances = newXMap(() => newMap());
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

var index = /*#__PURE__*/Object.freeze({
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

export { settings, index as watchers };
//# sourceMappingURL=lisn.essentials.es.js.map
