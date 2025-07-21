"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.S_TOGGLE = exports.S_STICKY = exports.S_SKIP_INITIAL = exports.S_SELECTSTART = exports.S_SCROLL_WIDTH = exports.S_SCROLL_TOP_FRACTION = exports.S_SCROLL_TOP = exports.S_SCROLL_LEFT_FRACTION = exports.S_SCROLL_LEFT = exports.S_SCROLL_HEIGHT = exports.S_SCROLL = exports.S_ROLE = exports.S_RIGHT = exports.S_REVERSE = exports.S_REMOVED = exports.S_PRESS = exports.S_POINTERUP = exports.S_POINTERMOVE = exports.S_POINTERLEAVE = exports.S_POINTERENTER = exports.S_POINTERDOWN = exports.S_POINTERCANCEL = exports.S_POINTER = exports.S_OUT = exports.S_NONE = exports.S_MOUSEUP = exports.S_MOUSEMOVE = exports.S_MOUSEDOWN = exports.S_MOUSE = exports.S_LEFT = exports.S_KEYDOWN = exports.S_KEY = exports.S_IN = exports.S_HOVER = exports.S_HORIZONTAL = exports.S_HEIGHT = exports.S_FIXED = exports.S_DROP = exports.S_DRAGSTART = exports.S_DRAGOVER = exports.S_DRAGLEAVE = exports.S_DRAGGABLE = exports.S_DRAGENTER = exports.S_DRAGEND = exports.S_DRAG = exports.S_DOWN = exports.S_DISABLED = exports.S_DEBOUNCE_WINDOW = exports.S_CLIENT_WIDTH = exports.S_CLIENT_HEIGHT = exports.S_CLICK = exports.S_CHILD_LIST = exports.S_CANCEL = exports.S_BOTTOM = exports.S_BELOW = exports.S_AUTO = exports.S_ATTRIBUTES = exports.S_ATTRIBUTE = exports.S_AT = exports.S_ARROW = exports.S_ARIA_CONTROLS = exports.S_ANIMATE = exports.S_AMBIGUOUS = exports.S_ADDED = exports.S_ABSOLUTE = exports.S_ABOVE = exports.SYMBOL = exports.STRING = exports.PROMISE = exports.PREFIX_WRAPPER = exports.PREFIX_UNDISPLAY = exports.PREFIX_TRANSITION_DISABLE = exports.PREFIX_TRANSITION = exports.PREFIX_SHOW = exports.PREFIX_POSITION = exports.PREFIX_PLACE = exports.PREFIX_ORIENTATION = exports.PREFIX_NO_WRAP = exports.PREFIX_NO_TOUCH_ACTION = exports.PREFIX_NO_SELECT = exports.PREFIX_INLINE_WRAPPER = exports.PREFIX_HIDE = exports.PREFIX_GHOST = exports.PREFIX_DISPLAY = exports.PREFIX_BORDER_SIZE = exports.PREFIX_ANIMATE_REVERSE = exports.PREFIX_ANIMATE_PAUSE = exports.PREFIX_ANIMATE_INFINITE = exports.PREFIX_ANIMATE_DISABLE = exports.PREFIX = exports.PI = exports.OBJECT = exports.NUMBER = exports.MATH = exports.LOG_PREFIX = exports.INFINITY = exports.FUNCTION = exports.ARRAY = exports.ARIA_PREFIX = exports.ANIMATE_PREFIX = void 0;
exports.S_ZOOM = exports.S_WIDTH = exports.S_WHEEL = exports.S_VISIBLE = exports.S_VERTICAL = exports.S_UP = exports.S_UNKNOWN = exports.S_TOUCHSTART = exports.S_TOUCHMOVE = exports.S_TOUCHEND = exports.S_TOUCHCANCEL = exports.S_TOUCH = exports.S_TOP = void 0;
/**
 * For minification optimization.
 *
 * @module
 * @ignore
 * @internal
 */

const PREFIX = exports.PREFIX = "lisn";
const LOG_PREFIX = exports.LOG_PREFIX = "[LISN.js]";
const OBJECT = exports.OBJECT = Object;
const SYMBOL = exports.SYMBOL = Symbol;
const ARRAY = exports.ARRAY = Array;
const STRING = exports.STRING = String;
const FUNCTION = exports.FUNCTION = Function;
const MATH = exports.MATH = Math;
const NUMBER = exports.NUMBER = Number;
const PROMISE = exports.PROMISE = Promise;
const PI = exports.PI = MATH.PI;
const INFINITY = exports.INFINITY = Infinity;
const S_ABSOLUTE = exports.S_ABSOLUTE = "absolute";
const S_FIXED = exports.S_FIXED = "fixed";
const S_STICKY = exports.S_STICKY = "sticky";
const S_WIDTH = exports.S_WIDTH = "width";
const S_HEIGHT = exports.S_HEIGHT = "height";
const S_TOP = exports.S_TOP = "top";
const S_BOTTOM = exports.S_BOTTOM = "bottom";
const S_UP = exports.S_UP = "up";
const S_DOWN = exports.S_DOWN = "down";
const S_LEFT = exports.S_LEFT = "left";
const S_RIGHT = exports.S_RIGHT = "right";
const S_AT = exports.S_AT = "at";
const S_ABOVE = exports.S_ABOVE = "above";
const S_BELOW = exports.S_BELOW = "below";
const S_IN = exports.S_IN = "in";
const S_OUT = exports.S_OUT = "out";
const S_NONE = exports.S_NONE = "none";
const S_AMBIGUOUS = exports.S_AMBIGUOUS = "ambiguous";
const S_ADDED = exports.S_ADDED = "added";
const S_REMOVED = exports.S_REMOVED = "removed";
const S_ATTRIBUTE = exports.S_ATTRIBUTE = "attribute";
const S_KEY = exports.S_KEY = "key";
const S_MOUSE = exports.S_MOUSE = "mouse";
const S_POINTER = exports.S_POINTER = "pointer";
const S_TOUCH = exports.S_TOUCH = "touch";
const S_WHEEL = exports.S_WHEEL = "wheel";
const S_CLICK = exports.S_CLICK = "click";
const S_HOVER = exports.S_HOVER = "hover";
const S_PRESS = exports.S_PRESS = "press";
const S_SCROLL = exports.S_SCROLL = "scroll";
const S_ZOOM = exports.S_ZOOM = "zoom";
const S_DRAG = exports.S_DRAG = "drag";
const S_UNKNOWN = exports.S_UNKNOWN = "unknown";
const S_SCROLL_TOP = exports.S_SCROLL_TOP = `${S_SCROLL}Top`;
const S_SCROLL_LEFT = exports.S_SCROLL_LEFT = `${S_SCROLL}Left`;
const S_SCROLL_WIDTH = exports.S_SCROLL_WIDTH = `${S_SCROLL}Width`;
const S_SCROLL_HEIGHT = exports.S_SCROLL_HEIGHT = `${S_SCROLL}Height`;
const S_CLIENT_WIDTH = exports.S_CLIENT_WIDTH = "clientWidth";
const S_CLIENT_HEIGHT = exports.S_CLIENT_HEIGHT = "clientHeight";
const S_SCROLL_TOP_FRACTION = exports.S_SCROLL_TOP_FRACTION = `${S_SCROLL}TopFraction`;
const S_SCROLL_LEFT_FRACTION = exports.S_SCROLL_LEFT_FRACTION = `${S_SCROLL}LeftFraction`;
const S_HORIZONTAL = exports.S_HORIZONTAL = "horizontal";
const S_VERTICAL = exports.S_VERTICAL = "vertical";
const S_SKIP_INITIAL = exports.S_SKIP_INITIAL = "skipInitial";
const S_DEBOUNCE_WINDOW = exports.S_DEBOUNCE_WINDOW = "debounceWindow";
const S_TOGGLE = exports.S_TOGGLE = "toggle";
const S_CANCEL = exports.S_CANCEL = "cancel";
const S_KEYDOWN = exports.S_KEYDOWN = `${S_KEY}${S_DOWN}`;
const S_MOUSEUP = exports.S_MOUSEUP = `${S_MOUSE}${S_UP}`;
const S_MOUSEDOWN = exports.S_MOUSEDOWN = `${S_MOUSE}${S_DOWN}`;
const S_MOUSEMOVE = exports.S_MOUSEMOVE = `${S_MOUSE}move`;
const S_POINTERUP = exports.S_POINTERUP = `${S_POINTER}${S_UP}`;
const S_POINTERDOWN = exports.S_POINTERDOWN = `${S_POINTER}${S_DOWN}`;
const S_POINTERENTER = exports.S_POINTERENTER = `${S_POINTER}enter`;
const S_POINTERLEAVE = exports.S_POINTERLEAVE = `${S_POINTER}leave`;
const S_POINTERMOVE = exports.S_POINTERMOVE = `${S_POINTER}move`;
const S_POINTERCANCEL = exports.S_POINTERCANCEL = `${S_POINTER}${S_CANCEL}`;
const S_TOUCHSTART = exports.S_TOUCHSTART = `${S_TOUCH}start`;
const S_TOUCHEND = exports.S_TOUCHEND = `${S_TOUCH}end`;
const S_TOUCHMOVE = exports.S_TOUCHMOVE = `${S_TOUCH}move`;
const S_TOUCHCANCEL = exports.S_TOUCHCANCEL = `${S_TOUCH}${S_CANCEL}`;
const S_DRAGSTART = exports.S_DRAGSTART = `${S_DRAG}start`;
const S_DRAGEND = exports.S_DRAGEND = `${S_DRAG}end`;
const S_DRAGENTER = exports.S_DRAGENTER = `${S_DRAG}enter`;
const S_DRAGOVER = exports.S_DRAGOVER = `${S_DRAG}over`;
const S_DRAGLEAVE = exports.S_DRAGLEAVE = `${S_DRAG}leave`;
const S_DROP = exports.S_DROP = "drop";
const S_SELECTSTART = exports.S_SELECTSTART = "selectstart";
const S_ATTRIBUTES = exports.S_ATTRIBUTES = "attributes";
const S_CHILD_LIST = exports.S_CHILD_LIST = "childList";
const S_REVERSE = exports.S_REVERSE = "reverse";
const S_DRAGGABLE = exports.S_DRAGGABLE = "draggable";
const S_DISABLED = exports.S_DISABLED = "disabled";
const S_ARROW = exports.S_ARROW = "arrow";
const S_ROLE = exports.S_ROLE = "role";
const S_AUTO = exports.S_AUTO = "auto";
const S_VISIBLE = exports.S_VISIBLE = "visible";
const ARIA_PREFIX = exports.ARIA_PREFIX = "aria-";
const S_ARIA_CONTROLS = exports.S_ARIA_CONTROLS = ARIA_PREFIX + "controls";
const PREFIX_WRAPPER = exports.PREFIX_WRAPPER = `${PREFIX}-wrapper`;
const PREFIX_INLINE_WRAPPER = exports.PREFIX_INLINE_WRAPPER = `${PREFIX_WRAPPER}-inline`;
const PREFIX_TRANSITION = exports.PREFIX_TRANSITION = `${PREFIX}-transition`;
const PREFIX_TRANSITION_DISABLE = exports.PREFIX_TRANSITION_DISABLE = `${PREFIX_TRANSITION}__disable`;
const PREFIX_HIDE = exports.PREFIX_HIDE = `${PREFIX}-hide`;
const PREFIX_SHOW = exports.PREFIX_SHOW = `${PREFIX}-show`;
const PREFIX_DISPLAY = exports.PREFIX_DISPLAY = `${PREFIX}-display`;
const PREFIX_UNDISPLAY = exports.PREFIX_UNDISPLAY = `${PREFIX}-undisplay`;
const PREFIX_PLACE = exports.PREFIX_PLACE = `${PREFIX}-place`;
const PREFIX_ORIENTATION = exports.PREFIX_ORIENTATION = `${PREFIX}-orientation`;
const PREFIX_POSITION = exports.PREFIX_POSITION = `${PREFIX}-position`;
const PREFIX_GHOST = exports.PREFIX_GHOST = `${PREFIX}-ghost`;
const PREFIX_BORDER_SIZE = exports.PREFIX_BORDER_SIZE = `${PREFIX}-border-size`;
const PREFIX_NO_SELECT = exports.PREFIX_NO_SELECT = `${PREFIX}-no-select`;
const PREFIX_NO_TOUCH_ACTION = exports.PREFIX_NO_TOUCH_ACTION = `${PREFIX}-no-touch-action`;
const PREFIX_NO_WRAP = exports.PREFIX_NO_WRAP = `${PREFIX}-no-wrap`;
const S_ANIMATE = exports.S_ANIMATE = "animate";
const ANIMATE_PREFIX = exports.ANIMATE_PREFIX = `${PREFIX}-${S_ANIMATE}__`;
const PREFIX_ANIMATE_DISABLE = exports.PREFIX_ANIMATE_DISABLE = `${ANIMATE_PREFIX}disable`;
const PREFIX_ANIMATE_PAUSE = exports.PREFIX_ANIMATE_PAUSE = `${ANIMATE_PREFIX}pause`;
const PREFIX_ANIMATE_REVERSE = exports.PREFIX_ANIMATE_REVERSE = `${ANIMATE_PREFIX}${S_REVERSE}`;
const PREFIX_ANIMATE_INFINITE = exports.PREFIX_ANIMATE_INFINITE = `${ANIMATE_PREFIX}infinite`;
//# sourceMappingURL=minification-constants.cjs.map