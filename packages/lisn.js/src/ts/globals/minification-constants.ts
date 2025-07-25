/**
 * For minification optimization.
 *
 * @module
 * @ignore
 * @internal
 */

export const PREFIX = "lisn";
export const LOG_PREFIX = "[LISN.js]";

export const OBJECT = Object;
export const SYMBOL = Symbol;
export const ARRAY = Array;
export const STRING = String;
export const FUNCTION = Function;
export const MATH = Math;
export const NUMBER = Number;
export const PROMISE = Promise;

export const PI = MATH.PI;
export const INFINITY = Infinity;

export const S_ABSOLUTE = "absolute";
export const S_FIXED = "fixed";
export const S_STICKY = "sticky";

export const S_WIDTH = "width";
export const S_HEIGHT = "height";

export const S_TOP = "top";
export const S_BOTTOM = "bottom";

export const S_UP = "up";
export const S_DOWN = "down";

export const S_LEFT = "left";
export const S_RIGHT = "right";

export const S_AT = "at";
export const S_ABOVE = "above";
export const S_BELOW = "below";

export const S_IN = "in";
export const S_OUT = "out";

export const S_NONE = "none";
export const S_AMBIGUOUS = "ambiguous";

export const S_ADDED = "added";
export const S_REMOVED = "removed";
export const S_ATTRIBUTE = "attribute";

export const S_KEY = "key";
export const S_MOUSE = "mouse";
export const S_POINTER = "pointer";
export const S_TOUCH = "touch";
export const S_WHEEL = "wheel";
export const S_CLICK = "click";
export const S_HOVER = "hover";
export const S_PRESS = "press";

export const S_SCROLL = "scroll";
export const S_ZOOM = "zoom";
export const S_DRAG = "drag";
export const S_UNKNOWN = "unknown";

export const S_SCROLL_TOP = `${S_SCROLL}Top`;
export const S_SCROLL_LEFT = `${S_SCROLL}Left`;

export const S_SCROLL_WIDTH = `${S_SCROLL}Width`;
export const S_SCROLL_HEIGHT = `${S_SCROLL}Height`;

export const S_CLIENT_WIDTH = "clientWidth";
export const S_CLIENT_HEIGHT = "clientHeight";

export const S_SCROLL_TOP_FRACTION = `${S_SCROLL}TopFraction`;
export const S_SCROLL_LEFT_FRACTION = `${S_SCROLL}LeftFraction`;

export const S_HORIZONTAL = "horizontal";
export const S_VERTICAL = "vertical";
export const S_SKIP_INITIAL = "skipInitial";
export const S_DEBOUNCE_WINDOW = "debounceWindow";
export const S_TOGGLE = "toggle";

export const S_CANCEL = "cancel";

export const S_KEYDOWN = `${S_KEY}${S_DOWN}`;

export const S_MOUSEUP = `${S_MOUSE}${S_UP}`;
export const S_MOUSEDOWN = `${S_MOUSE}${S_DOWN}`;
export const S_MOUSEMOVE = `${S_MOUSE}move`;

export const S_POINTERUP = `${S_POINTER}${S_UP}`;
export const S_POINTERDOWN = `${S_POINTER}${S_DOWN}`;
export const S_POINTERENTER = `${S_POINTER}enter`;
export const S_POINTERLEAVE = `${S_POINTER}leave`;
export const S_POINTERMOVE = `${S_POINTER}move`;
export const S_POINTERCANCEL = `${S_POINTER}${S_CANCEL}`;

export const S_TOUCHSTART = `${S_TOUCH}start`;
export const S_TOUCHEND = `${S_TOUCH}end`;
export const S_TOUCHMOVE = `${S_TOUCH}move`;
export const S_TOUCHCANCEL = `${S_TOUCH}${S_CANCEL}`;

export const S_DRAGSTART = `${S_DRAG}start`;
export const S_DRAGEND = `${S_DRAG}end`;
export const S_DRAGENTER = `${S_DRAG}enter`;
export const S_DRAGOVER = `${S_DRAG}over`;
export const S_DRAGLEAVE = `${S_DRAG}leave`;
export const S_DROP = "drop";

export const S_SELECTSTART = "selectstart";

export const S_ATTRIBUTES = "attributes";
export const S_CHILD_LIST = "childList";

export const S_REVERSE = "reverse";
export const S_DRAGGABLE = "draggable";
export const S_DISABLED = "disabled";

export const S_ARROW = "arrow";

export const S_ROLE = "role";

export const S_AUTO = "auto";
export const S_VISIBLE = "visible";

export const ARIA_PREFIX = "aria-";
export const S_ARIA_CONTROLS = ARIA_PREFIX + "controls";

export const PREFIX_RELATIVE = `${PREFIX}-relative`;
export const PREFIX_WRAPPER = `${PREFIX}-wrapper`;
export const PREFIX_WRAPPER_INLINE = `${PREFIX_WRAPPER}-inline`;
export const PREFIX_TRANSITION = `${PREFIX}-transition`;
export const PREFIX_TRANSITION_DISABLE = `${PREFIX_TRANSITION}__disable`;
export const PREFIX_HIDE = `${PREFIX}-hide`;
export const PREFIX_SHOW = `${PREFIX}-show`;
export const PREFIX_DISPLAY = `${PREFIX}-display`;
export const PREFIX_UNDISPLAY = `${PREFIX}-undisplay`;
export const PREFIX_PLACE = `${PREFIX}-place`;
export const PREFIX_ORIENTATION = `${PREFIX}-orientation`;
export const PREFIX_POSITION = `${PREFIX}-position`;
export const PREFIX_GHOST = `${PREFIX}-ghost`;
export const PREFIX_BORDER_SIZE = `${PREFIX}-border-size`;
export const PREFIX_NO_SELECT = `${PREFIX}-no-select`;
export const PREFIX_NO_TOUCH_ACTION = `${PREFIX}-no-touch-action`;
export const PREFIX_NO_WRAP = `${PREFIX}-no-wrap`;

export const S_ANIMATE = "animate";
export const ANIMATE_PREFIX = `${PREFIX}-${S_ANIMATE}__`;
export const PREFIX_ANIMATE_DISABLE = `${ANIMATE_PREFIX}disable`;
export const PREFIX_ANIMATE_PAUSE = `${ANIMATE_PREFIX}pause`;
export const PREFIX_ANIMATE_REVERSE = `${ANIMATE_PREFIX}${S_REVERSE}`;
export const PREFIX_ANIMATE_INFINITE = `${ANIMATE_PREFIX}infinite`;
