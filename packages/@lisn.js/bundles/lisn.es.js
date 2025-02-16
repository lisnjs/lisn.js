/*!
 * LISN.js v1.0.0
 * (c) 2025 @AaylaSecura
 * Released under the MIT License.
 */
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function asyncGeneratorStep(n, t, e, r, o, a, c) {
  try {
    var i = n[a](c),
      u = i.value;
  } catch (n) {
    return void e(n);
  }
  i.done ? t(u) : Promise.resolve(u).then(r, o);
}
function _asyncToGenerator(n) {
  return function () {
    var t = this,
      e = arguments;
    return new Promise(function (r, o) {
      var a = n.apply(t, e);
      function _next(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
      }
      function _throw(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
      }
      _next(void 0);
    });
  };
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _construct(t, e, r) {
  if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments);
  var o = [null];
  o.push.apply(o, e);
  var p = new (t.bind.apply(t, o))();
  return r && _setPrototypeOf(p, r.prototype), p;
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: false
  }), e;
}
function _createForOfIteratorHelper(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (!t) {
    if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
      t && (r = t);
      var n = 0,
        F = function () {};
      return {
        s: F,
        n: function () {
          return n >= r.length ? {
            done: true
          } : {
            done: false,
            value: r[n++]
          };
        },
        e: function (r) {
          throw r;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var o,
    a = true,
    u = false;
  return {
    s: function () {
      t = t.call(r);
    },
    n: function () {
      var r = t.next();
      return a = r.done, r;
    },
    e: function (r) {
      u = true, o = r;
    },
    f: function () {
      try {
        a || null == t.return || t.return();
      } finally {
        if (u) throw o;
      }
    }
  };
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function _get() {
  return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) {
    var p = _superPropBase(e, t);
    if (p) {
      var n = Object.getOwnPropertyDescriptor(p, t);
      return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value;
    }
  }, _get.apply(null, arguments);
}
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, _getPrototypeOf(t);
}
function _inherits(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: true,
      configurable: true
    }
  }), Object.defineProperty(t, "prototype", {
    writable: false
  }), e && _setPrototypeOf(t, e);
}
function _isNativeFunction(t) {
  try {
    return -1 !== Function.toString.call(t).indexOf("[native code]");
  } catch (n) {
    return "function" == typeof t;
  }
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function () {
    return !!t;
  })();
}
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = true,
      o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = true, n = r;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _possibleConstructorReturn(t, e) {
  if (e && ("object" == typeof e || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return _assertThisInitialized(t);
}
function _regeneratorRuntime() {
  _regeneratorRuntime = function () {
    return e;
  };
  var t,
    e = {},
    r = Object.prototype,
    n = r.hasOwnProperty,
    o = Object.defineProperty || function (t, e, r) {
      t[e] = r.value;
    },
    i = "function" == typeof Symbol ? Symbol : {},
    a = i.iterator || "@@iterator",
    c = i.asyncIterator || "@@asyncIterator",
    u = i.toStringTag || "@@toStringTag";
  function define(t, e, r) {
    return Object.defineProperty(t, e, {
      value: r,
      enumerable: true,
      configurable: true,
      writable: true
    }), t[e];
  }
  try {
    define({}, "");
  } catch (t) {
    define = function (t, e, r) {
      return t[e] = r;
    };
  }
  function wrap(t, e, r, n) {
    var i = e && e.prototype instanceof Generator ? e : Generator,
      a = Object.create(i.prototype),
      c = new Context(n || []);
    return o(a, "_invoke", {
      value: makeInvokeMethod(t, r, c)
    }), a;
  }
  function tryCatch(t, e, r) {
    try {
      return {
        type: "normal",
        arg: t.call(e, r)
      };
    } catch (t) {
      return {
        type: "throw",
        arg: t
      };
    }
  }
  e.wrap = wrap;
  var h = "suspendedStart",
    l = "suspendedYield",
    f = "executing",
    s = "completed",
    y = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var p = {};
  define(p, a, function () {
    return this;
  });
  var d = Object.getPrototypeOf,
    v = d && d(d(values([])));
  v && v !== r && n.call(v, a) && (p = v);
  var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
  function defineIteratorMethods(t) {
    ["next", "throw", "return"].forEach(function (e) {
      define(t, e, function (t) {
        return this._invoke(e, t);
      });
    });
  }
  function AsyncIterator(t, e) {
    function invoke(r, o, i, a) {
      var c = tryCatch(t[r], t, o);
      if ("throw" !== c.type) {
        var u = c.arg,
          h = u.value;
        return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) {
          invoke("next", t, i, a);
        }, function (t) {
          invoke("throw", t, i, a);
        }) : e.resolve(h).then(function (t) {
          u.value = t, i(u);
        }, function (t) {
          return invoke("throw", t, i, a);
        });
      }
      a(c.arg);
    }
    var r;
    o(this, "_invoke", {
      value: function (t, n) {
        function callInvokeWithMethodAndArg() {
          return new e(function (e, r) {
            invoke(t, n, e, r);
          });
        }
        return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(e, r, n) {
    var o = h;
    return function (i, a) {
      if (o === f) throw Error("Generator is already running");
      if (o === s) {
        if ("throw" === i) throw a;
        return {
          value: t,
          done: true
        };
      }
      for (n.method = i, n.arg = a;;) {
        var c = n.delegate;
        if (c) {
          var u = maybeInvokeDelegate(c, n);
          if (u) {
            if (u === y) continue;
            return u;
          }
        }
        if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) {
          if (o === h) throw o = s, n.arg;
          n.dispatchException(n.arg);
        } else "return" === n.method && n.abrupt("return", n.arg);
        o = f;
        var p = tryCatch(e, r, n);
        if ("normal" === p.type) {
          if (o = n.done ? s : l, p.arg === y) continue;
          return {
            value: p.arg,
            done: n.done
          };
        }
        "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
      }
    };
  }
  function maybeInvokeDelegate(e, r) {
    var n = r.method,
      o = e.iterator[n];
    if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
    var i = tryCatch(o, e.iterator, r.arg);
    if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
    var a = i.arg;
    return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
  }
  function pushTryEntry(t) {
    var e = {
      tryLoc: t[0]
    };
    1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
  }
  function resetTryEntry(t) {
    var e = t.completion || {};
    e.type = "normal", delete e.arg, t.completion = e;
  }
  function Context(t) {
    this.tryEntries = [{
      tryLoc: "root"
    }], t.forEach(pushTryEntry, this), this.reset(true);
  }
  function values(e) {
    if (e || "" === e) {
      var r = e[a];
      if (r) return r.call(e);
      if ("function" == typeof e.next) return e;
      if (!isNaN(e.length)) {
        var o = -1,
          i = function next() {
            for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = false, next;
            return next.value = t, next.done = true, next;
          };
        return i.next = i;
      }
    }
    throw new TypeError(typeof e + " is not iterable");
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: true
  }), o(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: true
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) {
    var e = "function" == typeof t && t.constructor;
    return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
  }, e.mark = function (t) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
  }, e.awrap = function (t) {
    return {
      __await: t
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () {
    return this;
  }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) {
    void 0 === i && (i = Promise);
    var a = new AsyncIterator(wrap(t, r, n, o), i);
    return e.isGeneratorFunction(r) ? a : a.next().then(function (t) {
      return t.done ? t.value : a.next();
    });
  }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () {
    return this;
  }), define(g, "toString", function () {
    return "[object Generator]";
  }), e.keys = function (t) {
    var e = Object(t),
      r = [];
    for (var n in e) r.push(n);
    return r.reverse(), function next() {
      for (; r.length;) {
        var t = r.pop();
        if (t in e) return next.value = t, next.done = false, next;
      }
      return next.done = true, next;
    };
  }, e.values = values, Context.prototype = {
    constructor: Context,
    reset: function (e) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = false, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
    },
    stop: function () {
      this.done = true;
      var t = this.tryEntries[0].completion;
      if ("throw" === t.type) throw t.arg;
      return this.rval;
    },
    dispatchException: function (e) {
      if (this.done) throw e;
      var r = this;
      function handle(n, o) {
        return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
      }
      for (var o = this.tryEntries.length - 1; o >= 0; --o) {
        var i = this.tryEntries[o],
          a = i.completion;
        if ("root" === i.tryLoc) return handle("end");
        if (i.tryLoc <= this.prev) {
          var c = n.call(i, "catchLoc"),
            u = n.call(i, "finallyLoc");
          if (c && u) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, true);
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          } else if (c) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, true);
          } else {
            if (!u) throw Error("try statement without catch or finally");
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          }
        }
      }
    },
    abrupt: function (t, e) {
      for (var r = this.tryEntries.length - 1; r >= 0; --r) {
        var o = this.tryEntries[r];
        if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
          var i = o;
          break;
        }
      }
      i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
      var a = i ? i.completion : {};
      return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
    },
    complete: function (t, e) {
      if ("throw" === t.type) throw t.arg;
      return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
    },
    finish: function (t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
      }
    },
    catch: function (t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.tryLoc === t) {
          var n = r.completion;
          if ("throw" === n.type) {
            var o = n.arg;
            resetTryEntry(r);
          }
          return o;
        }
      }
      throw Error("illegal catch attempt");
    },
    delegateYield: function (e, r, n) {
      return this.delegate = {
        iterator: values(e),
        resultName: r,
        nextLoc: n
      }, "next" === this.method && (this.arg = t), y;
    }
  }, e;
}
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _superPropBase(t, o) {
  for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t)););
  return t;
}
function _superPropGet(t, o, e, r) {
  var p = _get(_getPrototypeOf(t), o, e);
  return 2 & r && "function" == typeof p ? function (t) {
    return p.apply(e, t);
  } : p;
}
function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (String )(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}
function _wrapNativeSuper(t) {
  var r = "function" == typeof Map ? new Map() : void 0;
  return _wrapNativeSuper = function (t) {
    if (null === t || !_isNativeFunction(t)) return t;
    if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function");
    if (void 0 !== r) {
      if (r.has(t)) return r.get(t);
      r.set(t, Wrapper);
    }
    function Wrapper() {
      return _construct(t, arguments, _getPrototypeOf(this).constructor);
    }
    return Wrapper.prototype = Object.create(t.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    }), _setPrototypeOf(Wrapper, t);
  }, _wrapNativeSuper(t);
}

var PREFIX = "lisn";
var LOG_PREFIX = "[LISN.js]";
var OBJECT = Object;
var SYMBOL = Symbol;
var ARRAY = Array;
var STRING = String;
var FUNCTION = Function;
var MATH = Math;
var NUMBER = Number;
var PROMISE = Promise;
var PI = MATH.PI;
var INFINITY = Infinity;
var S_ABSOLUTE = "absolute";
var S_FIXED = "fixed";
var S_STICKY = "sticky";
var S_WIDTH = "width";
var S_HEIGHT = "height";
var S_TOP = "top";
var S_BOTTOM = "bottom";
var S_UP = "up";
var S_DOWN = "down";
var S_LEFT = "left";
var S_RIGHT = "right";
var S_AT = "at";
var S_ABOVE = "above";
var S_BELOW = "below";
var S_IN = "in";
var S_OUT = "out";
var S_NONE = "none";
var S_AMBIGUOUS = "ambiguous";
var S_ADDED = "added";
var S_REMOVED = "removed";
var S_ATTRIBUTE = "attribute";
var S_KEY = "key";
var S_MOUSE = "mouse";
var S_POINTER = "pointer";
var S_TOUCH = "touch";
var S_WHEEL = "wheel";
var S_CLICK = "click";
var S_HOVER = "hover";
var S_PRESS = "press";
var S_SCROLL = "scroll";
var S_ZOOM = "zoom";
var S_DRAG = "drag";
var S_UNKNOWN = "unknown";
var S_SCROLL_TOP = "".concat(S_SCROLL, "Top");
var S_SCROLL_LEFT = "".concat(S_SCROLL, "Left");
var S_SCROLL_WIDTH = "".concat(S_SCROLL, "Width");
var S_SCROLL_HEIGHT = "".concat(S_SCROLL, "Height");
var S_CLIENT_WIDTH = "clientWidth";
var S_CLIENT_HEIGHT = "clientHeight";
var S_SCROLL_TOP_FRACTION = "".concat(S_SCROLL, "TopFraction");
var S_SCROLL_LEFT_FRACTION = "".concat(S_SCROLL, "LeftFraction");
var S_HORIZONTAL = "horizontal";
var S_VERTICAL = "vertical";
var S_SKIP_INITIAL = "skipInitial";
var S_DEBOUNCE_WINDOW = "debounceWindow";
var S_TOGGLE = "toggle";
var S_CANCEL = "cancel";
var S_KEYDOWN = S_KEY + S_DOWN;
var S_MOUSEUP = S_MOUSE + S_UP;
var S_MOUSEDOWN = S_MOUSE + S_DOWN;
var S_POINTERUP = S_POINTER + S_UP;
var S_POINTERDOWN = S_POINTER + S_DOWN;
var S_POINTERENTER = "".concat(S_POINTER, "enter");
var S_POINTERLEAVE = "".concat(S_POINTER, "leave");
var S_POINTERMOVE = "".concat(S_POINTER, "move");
var S_POINTERCANCEL = S_POINTER + S_CANCEL;
var S_TOUCHSTART = "".concat(S_TOUCH, "start");
var S_TOUCHEND = "".concat(S_TOUCH, "end");
var S_TOUCHMOVE = "".concat(S_TOUCH, "move");
var S_TOUCHCANCEL = S_TOUCH + S_CANCEL;
var S_DRAGSTART = "".concat(S_DRAG, "start");
var S_DRAGEND = "".concat(S_DRAG, "end");
var S_DRAGENTER = "".concat(S_DRAG, "enter");
var S_DRAGOVER = "".concat(S_DRAG, "over");
var S_DROP = "drop";
var S_SELECTSTART = "selectstart";
var S_ATTRIBUTES = "attributes";
var S_CHILD_LIST = "childList";
var S_REVERSE = "reverse";
var S_DRAGGABLE = "draggable";
var S_DISABLED = "disabled";
var S_ARROW = "arrow";
var S_ROLE = "role";
var ARIA_PREFIX = "aria-";
var S_ARIA_CONTROLS = ARIA_PREFIX + "controls";
var PREFIX_WRAPPER$1 = "".concat(PREFIX, "-wrapper");
var PREFIX_INLINE_WRAPPER = "".concat(PREFIX_WRAPPER$1, "-inline");
var PREFIX_TRANSITION = "".concat(PREFIX, "-transition");
var PREFIX_TRANSITION_DISABLE = "".concat(PREFIX_TRANSITION, "__disable");
var PREFIX_HIDE = "".concat(PREFIX, "-hide");
var PREFIX_SHOW = "".concat(PREFIX, "-show");
var PREFIX_DISPLAY = "".concat(PREFIX, "-display");
var PREFIX_UNDISPLAY = "".concat(PREFIX, "-undisplay");
var PREFIX_PLACE = "".concat(PREFIX, "-place");
var PREFIX_ORIENTATION = "".concat(PREFIX, "-orientation");
var PREFIX_POSITION = "".concat(PREFIX, "-position");
var PREFIX_GHOST = "".concat(PREFIX, "-ghost");
var PREFIX_NO_SELECT = "".concat(PREFIX, "-no-select");
var PREFIX_NO_TOUCH_ACTION = "".concat(PREFIX, "-no-touch-action");
var PREFIX_NO_WRAP = "".concat(PREFIX, "-no-wrap");
var S_ANIMATE = "animate";
var ANIMATE_PREFIX = "".concat(PREFIX, "-").concat(S_ANIMATE, "__");
var PREFIX_ANIMATE_DISABLE = "".concat(ANIMATE_PREFIX, "disable");
var PREFIX_ANIMATE_PAUSE = "".concat(ANIMATE_PREFIX, "pause");
var PREFIX_ANIMATE_REVERSE = "".concat(ANIMATE_PREFIX).concat(S_REVERSE);
var USER_AGENT = typeof navigator === "undefined" ? "" : navigator.userAgent;
var IS_MOBILE = USER_AGENT.match(/Mobile|Android|Silk\/|Kindle|BlackBerry|Opera Mini|Opera Mobi/) !== null;

var LisnError = function (_Error) {
  function LisnError() {
    _classCallCheck(this, LisnError);
    return _callSuper(this, LisnError, arguments);
  }
  _inherits(LisnError, _Error);
  return _createClass(LisnError);
}(_wrapNativeSuper(Error));
var LisnUsageError = function (_LisnError) {
  function LisnUsageError() {
    var _this;
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    _classCallCheck(this, LisnUsageError);
    _this = _callSuper(this, LisnUsageError, ["".concat(LOG_PREFIX, " Incorrect usage: ").concat(message)]);
    _this.name = "LisnUsageError";
    return _this;
  }
  _inherits(LisnUsageError, _LisnError);
  return _createClass(LisnUsageError);
}(LisnError);
var LisnBugError = function (_LisnError2) {
  function LisnBugError() {
    var _this2;
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    _classCallCheck(this, LisnBugError);
    _this2 = _callSuper(this, LisnBugError, ["".concat(LOG_PREFIX, " Please report a bug: ").concat(message)]);
    _this2.name = "LisnBugError";
    return _this2;
  }
  _inherits(LisnBugError, _LisnError2);
  return _createClass(LisnBugError);
}(LisnError);

var root = (typeof self === "undefined" ? "undefined" : _typeof(self)) === "object" && self.self === self && self || (typeof global === "undefined" ? "undefined" : _typeof(global)) == "object" && global.global === global && global || Function("return this")() || {};
var kebabToCamelCase$1 = function kebabToCamelCase(str) {
  return str.replace(/-./g, function (m) {
    return toUpperCase(m.charAt(1));
  });
};
var camelToKebabCase$1 = function camelToKebabCase(str) {
  return str.replace(/[A-Z][a-z]/g, function (m) {
    return "-" + toLowerCase(m);
  }).replace(/[A-Z]+/, function (m) {
    return "-" + toLowerCase(m);
  });
};
var prefixName = function prefixName(name) {
  return "".concat(PREFIX, "-").concat(name);
};
var prefixCssVar = function prefixCssVar(name) {
  return "--" + prefixName(name);
};
var prefixCssJsVar = function prefixCssJsVar(name) {
  return prefixCssVar("js--" + name);
};
var prefixData = function prefixData(name) {
  return "data-".concat(camelToKebabCase$1(name));
};
var prefixLisnData = function prefixLisnData(name) {
  return prefixData(prefixName(name));
};
var toLowerCase = function toLowerCase(s) {
  return s.toLowerCase();
};
var toUpperCase = function toUpperCase(s) {
  return s.toUpperCase();
};
var timeNow = Date.now.bind(Date);
var timeSince = function timeSince(startTime) {
  return timeNow() - startTime;
};
var hasDOM = function hasDOM() {
  return typeof document !== "undefined";
};
var getWindow = function getWindow() {
  return window;
};
var getDoc = function getDoc() {
  return document;
};
var getDocElement = function getDocElement() {
  return getDoc().documentElement;
};
var getDocScrollingElement = function getDocScrollingElement() {
  return getDoc().scrollingElement;
};
var getBody = function getBody() {
  return getDoc().body;
};
var getReadyState = function getReadyState() {
  return getDoc().readyState;
};
var getPointerType = function getPointerType(event) {
  return isPointerEvent(event) ? event.pointerType : isMouseEvent(event) ? "mouse" : null;
};
var onAnimationFrame = hasDOM() ? root.requestAnimationFrame.bind(root) : function () {};
var createElement = function createElement(tagName, options) {
  return getDoc().createElement(tagName, options);
};
var createButton = function createButton() {
  var label = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var tag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "button";
  var btn = createElement(tag);
  setTabIndex(btn);
  setAttr(btn, S_ROLE, "button");
  setAttr(btn, ARIA_PREFIX + "label", label);
  return btn;
};
var isNullish = function isNullish(v) {
  return v === undefined || v === null;
};
var isEmpty = function isEmpty(v) {
  return isNullish(v) || v === "";
};
var isIterableObject = function isIterableObject(v) {
  return isNonPrimitive(v) && SYMBOL.iterator in v;
};
var isArray = function isArray(v) {
  return isInstanceOf(v, ARRAY);
};
var isObject = function isObject(v) {
  return isInstanceOf(v, OBJECT);
};
var isNonPrimitive = function isNonPrimitive(v) {
  return v !== null && typeOf(v) === "object";
};
var isNumber = function isNumber(v) {
  return typeOf(v) === "number";
};
var isString = function isString(v) {
  return typeOf(v) === "string" || isInstanceOf(v, STRING);
};
var isLiteralString = function isLiteralString(v) {
  return typeOf(v) === "string";
};
var isBoolean = function isBoolean(v) {
  return typeOf(v) === "boolean";
};
var isFunction = function isFunction(v) {
  return typeOf(v) === "function" || isInstanceOf(v, FUNCTION);
};
var isDoc = function isDoc(target) {
  return target === getDoc();
};
var isMouseEvent = function isMouseEvent(event) {
  return isInstanceOf(event, MouseEvent);
};
var isPointerEvent = function isPointerEvent(event) {
  return isInstanceOf(event, PointerEvent);
};
var isTouchPointerEvent = function isTouchPointerEvent(event) {
  return isPointerEvent(event) && getPointerType(event) === S_TOUCH;
};
var isWheelEvent = function isWheelEvent(event) {
  return isInstanceOf(event, WheelEvent);
};
var isKeyboardEvent = function isKeyboardEvent(event) {
  return isInstanceOf(event, KeyboardEvent);
};
var isTouchEvent = function isTouchEvent(event) {
  return isInstanceOf(event, TouchEvent);
};
var isNode = function isNode(target) {
  return isInstanceOf(target, Node);
};
var isElement = function isElement(target) {
  return isInstanceOf(target, Element);
};
var isHTMLElement = function isHTMLElement(target) {
  return isInstanceOf(target, HTMLElement);
};
var isNodeBAfterA = function isNodeBAfterA(nodeA, nodeB) {
  return (nodeA.compareDocumentPosition(nodeB) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
};
var strReplace = function strReplace(s, match, replacement) {
  return s.replace(match, replacement);
};
var setTimer = root.setTimeout.bind(root);
var clearTimer = root.clearTimeout.bind(root);
var getBoundingClientRect = function getBoundingClientRect(el) {
  return el.getBoundingClientRect();
};
var copyBoundingRectProps = function copyBoundingRectProps(rect) {
  return _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({
    x: rect.x,
    left: rect.left,
    right: rect.right
  }, S_WIDTH, rect[S_WIDTH]), "y", rect.y), "top", rect.top), "bottom", rect.bottom), S_HEIGHT, rect[S_HEIGHT]);
};
var querySelector = function querySelector(root, selector) {
  return root.querySelector(selector);
};
var querySelectorAll = function querySelectorAll(root, selector) {
  return root.querySelectorAll(selector);
};
var docQuerySelector = function docQuerySelector(selector) {
  return querySelector(getDoc(), selector);
};
var docQuerySelectorAll = function docQuerySelectorAll(selector) {
  return querySelectorAll(getDoc(), selector);
};
var getElementById = function getElementById(id) {
  return getDoc().getElementById(id);
};
var getAttr = function getAttr(el, name) {
  return el.getAttribute(name);
};
var setAttr = function setAttr(el, name) {
  var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "true";
  return el.setAttribute(name, value);
};
var unsetAttr = function unsetAttr(el, name) {
  return el.setAttribute(name, "false");
};
var delAttr = function delAttr(el, name) {
  return el.removeAttribute(name);
};
var includes = function includes(arr, v, startAt) {
  return arr.indexOf(v, startAt) >= 0;
};
var filter = function filter(array, filterFn) {
  return array.filter(filterFn);
};
var filterBlank = function filterBlank(array) {
  var result = array ? filter(array, function (v) {
    return !isEmpty(v);
  }) : undefined;
  return lengthOf(result) ? result : undefined;
};
var sizeOf = function sizeOf(obj) {
  var _obj$size;
  return (_obj$size = obj === null || obj === void 0 ? void 0 : obj.size) !== null && _obj$size !== void 0 ? _obj$size : 0;
};
var lengthOf = function lengthOf(obj) {
  var _obj$length;
  return (_obj$length = obj === null || obj === void 0 ? void 0 : obj.length) !== null && _obj$length !== void 0 ? _obj$length : 0;
};
var tagName = function tagName(el) {
  return el.tagName;
};
var preventDefault = function preventDefault(event) {
  return event.preventDefault();
};
var arrayFrom = ARRAY.from.bind(ARRAY);
var keysOf = function keysOf(obj) {
  return OBJECT.keys(obj);
};
var defineProperty = OBJECT.defineProperty.bind(OBJECT);
var merge = function merge() {
  var _MC$OBJECT;
  for (var _len = arguments.length, a = new Array(_len), _key = 0; _key < _len; _key++) {
    a[_key] = arguments[_key];
  }
  return (_MC$OBJECT = OBJECT).assign.apply(_MC$OBJECT, [{}].concat(a));
};
var copyObject = function copyObject(obj) {
  return merge(obj);
};
var promiseResolve = PROMISE.resolve.bind(PROMISE);
var promiseAll = PROMISE.all.bind(PROMISE);
var assign = OBJECT.assign.bind(OBJECT);
var freezeObj = OBJECT.freeze.bind(OBJECT);
var hasOwnProp = function hasOwnProp(o, prop) {
  return OBJECT.prototype.hasOwnProperty.call(o, prop);
};
var preventExtensions = OBJECT.preventExtensions.bind(OBJECT);
var stringify = JSON.stringify.bind(JSON);
var floor = MATH.floor.bind(MATH);
var ceil = MATH.ceil.bind(MATH);
var log2 = MATH.log2.bind(MATH);
var sqrt = MATH.sqrt.bind(MATH);
var max = MATH.max.bind(MATH);
var min = MATH.min.bind(MATH);
var abs = MATH.abs.bind(MATH);
var round = MATH.round.bind(MATH);
var pow = MATH.pow.bind(MATH);
var parseFloat = NUMBER.parseFloat.bind(NUMBER);
var isNaN$1 = NUMBER.isNaN.bind(NUMBER);
var isInstanceOf = function isInstanceOf(value, Class) {
  return value instanceof Class;
};
var constructorOf = function constructorOf(obj) {
  return obj.constructor;
};
var typeOf = function typeOf(obj) {
  return _typeof(obj);
};
var typeOrClassOf = function typeOrClassOf(obj) {
  var _constructorOf;
  return isObject(obj) ? (_constructorOf = constructorOf(obj)) === null || _constructorOf === void 0 ? void 0 : _constructorOf.name : typeOf(obj);
};
var parentOf = function parentOf(element) {
  return (element === null || element === void 0 ? void 0 : element.parentElement) || null;
};
var childrenOf = function childrenOf(element) {
  return (element === null || element === void 0 ? void 0 : element.children) || [];
};
var targetOf = function targetOf(obj) {
  return obj === null || obj === void 0 ? void 0 : obj.target;
};
var currentTargetOf = function currentTargetOf(obj) {
  return obj === null || obj === void 0 ? void 0 : obj.currentTarget;
};
var classList = function classList(el) {
  return el === null || el === void 0 ? void 0 : el.classList;
};
var S_TABINDEX = "tabindex";
var getTabIndex = function getTabIndex(el) {
  return getAttr(el, S_TABINDEX);
};
var setTabIndex = function setTabIndex(el) {
  var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "0";
  return setAttr(el, S_TABINDEX, index);
};
var unsetTabIndex = function unsetTabIndex(el) {
  return delAttr(el, S_TABINDEX);
};
var remove = function remove(obj) {
  return obj === null || obj === void 0 ? void 0 : obj.remove();
};
var deleteObjKey = function deleteObjKey(obj, key) {
  return delete obj[key];
};
var deleteKey = function deleteKey(map, key) {
  return map === null || map === void 0 ? void 0 : map["delete"](key);
};
var elScrollTo = function elScrollTo(el, coords) {
  var behavior = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "instant";
  return el.scrollTo(merge({
    behavior: behavior
  }, coords));
};
var elScrollBy = function elScrollBy(el, coords) {
  var behavior = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "instant";
  return el.scrollBy(merge({
    behavior: behavior
  }, coords));
};
var newPromise = function newPromise(executor) {
  return new Promise(executor);
};
var newMap = function newMap(entries) {
  return new Map(entries);
};
var newWeakMap = function newWeakMap(entries) {
  return new WeakMap(entries);
};
var newSet = function newSet(values) {
  return new Set(values);
};
var newWeakSet = function newWeakSet(values) {
  return new WeakSet(values);
};
var newIntersectionObserver = function newIntersectionObserver(callback, options) {
  return new IntersectionObserver(callback, options);
};
var newResizeObserver = function newResizeObserver(callback) {
  return typeof ResizeObserver === "undefined" ? null : new ResizeObserver(callback);
};
var newMutationObserver = function newMutationObserver(callback) {
  return new MutationObserver(callback);
};
var usageError = function usageError(msg) {
  return new LisnUsageError(msg);
};
var bugError = function bugError(msg) {
  return new LisnBugError(msg);
};
var illegalConstructorError = function illegalConstructorError(useWhat) {
  return usageError("Illegal constructor. Use ".concat(useWhat, "."));
};
var CONSOLE = console;
var consoleDebug = CONSOLE.debug.bind(CONSOLE);
var consoleLog = CONSOLE.log.bind(CONSOLE);
var consoleInfo = CONSOLE.info.bind(CONSOLE);
var consoleWarn = CONSOLE.warn.bind(CONSOLE);
var consoleError = CONSOLE.error.bind(CONSOLE);

var MH = /*#__PURE__*/Object.freeze({
  __proto__: null,
  abs: abs,
  arrayFrom: arrayFrom,
  assign: assign,
  bugError: bugError,
  camelToKebabCase: camelToKebabCase$1,
  ceil: ceil,
  childrenOf: childrenOf,
  classList: classList,
  clearTimer: clearTimer,
  consoleDebug: consoleDebug,
  consoleError: consoleError,
  consoleInfo: consoleInfo,
  consoleLog: consoleLog,
  consoleWarn: consoleWarn,
  constructorOf: constructorOf,
  copyBoundingRectProps: copyBoundingRectProps,
  copyObject: copyObject,
  createButton: createButton,
  createElement: createElement,
  currentTargetOf: currentTargetOf,
  defineProperty: defineProperty,
  delAttr: delAttr,
  deleteKey: deleteKey,
  deleteObjKey: deleteObjKey,
  docQuerySelector: docQuerySelector,
  docQuerySelectorAll: docQuerySelectorAll,
  elScrollBy: elScrollBy,
  elScrollTo: elScrollTo,
  filter: filter,
  filterBlank: filterBlank,
  floor: floor,
  freezeObj: freezeObj,
  getAttr: getAttr,
  getBody: getBody,
  getBoundingClientRect: getBoundingClientRect,
  getDoc: getDoc,
  getDocElement: getDocElement,
  getDocScrollingElement: getDocScrollingElement,
  getElementById: getElementById,
  getPointerType: getPointerType,
  getReadyState: getReadyState,
  getTabIndex: getTabIndex,
  getWindow: getWindow,
  hasDOM: hasDOM,
  hasOwnProp: hasOwnProp,
  illegalConstructorError: illegalConstructorError,
  includes: includes,
  isArray: isArray,
  isBoolean: isBoolean,
  isDoc: isDoc,
  isElement: isElement,
  isEmpty: isEmpty,
  isFunction: isFunction,
  isHTMLElement: isHTMLElement,
  isInstanceOf: isInstanceOf,
  isIterableObject: isIterableObject,
  isKeyboardEvent: isKeyboardEvent,
  isLiteralString: isLiteralString,
  isMouseEvent: isMouseEvent,
  isNaN: isNaN$1,
  isNode: isNode,
  isNodeBAfterA: isNodeBAfterA,
  isNonPrimitive: isNonPrimitive,
  isNullish: isNullish,
  isNumber: isNumber,
  isObject: isObject,
  isPointerEvent: isPointerEvent,
  isString: isString,
  isTouchEvent: isTouchEvent,
  isTouchPointerEvent: isTouchPointerEvent,
  isWheelEvent: isWheelEvent,
  kebabToCamelCase: kebabToCamelCase$1,
  keysOf: keysOf,
  lengthOf: lengthOf,
  log2: log2,
  max: max,
  merge: merge,
  min: min,
  newIntersectionObserver: newIntersectionObserver,
  newMap: newMap,
  newMutationObserver: newMutationObserver,
  newPromise: newPromise,
  newResizeObserver: newResizeObserver,
  newSet: newSet,
  newWeakMap: newWeakMap,
  newWeakSet: newWeakSet,
  onAnimationFrame: onAnimationFrame,
  parentOf: parentOf,
  parseFloat: parseFloat,
  pow: pow,
  prefixCssJsVar: prefixCssJsVar,
  prefixCssVar: prefixCssVar,
  prefixData: prefixData,
  prefixLisnData: prefixLisnData,
  prefixName: prefixName,
  preventDefault: preventDefault,
  preventExtensions: preventExtensions,
  promiseAll: promiseAll,
  promiseResolve: promiseResolve,
  querySelector: querySelector,
  querySelectorAll: querySelectorAll,
  remove: remove,
  round: round,
  setAttr: setAttr,
  setTabIndex: setTabIndex,
  setTimer: setTimer,
  sizeOf: sizeOf,
  sqrt: sqrt,
  strReplace: strReplace,
  stringify: stringify,
  tagName: tagName,
  targetOf: targetOf,
  timeNow: timeNow,
  timeSince: timeSince,
  toLowerCase: toLowerCase,
  toUpperCase: toUpperCase,
  typeOf: typeOf,
  typeOrClassOf: typeOrClassOf,
  unsetAttr: unsetAttr,
  unsetTabIndex: unsetTabIndex,
  usageError: usageError
});

var settings = preventExtensions({
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

var roundNumTo = function roundNumTo(value) {
  var numDecimal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var multiplicationFactor = pow(10, numDecimal);
  return round(value * multiplicationFactor) / multiplicationFactor;
};
var isValidNum = function isValidNum(value) {
  return isNumber(value) && NUMBER.isFinite(value);
};
var toNum = function toNum(value) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var numValue = isLiteralString(value) ? parseFloat(value) : value;
  return isValidNum(numValue) && numValue == value ? numValue : defaultValue;
};
var toInt = function toInt(value) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var numValue = toNum(value, null);
  numValue = numValue === null ? numValue : floor(numValue);
  return isValidNum(numValue) && numValue == value ? numValue : defaultValue;
};
var toNonNegNum = function toNonNegNum(value) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var numValue = toNum(value, null);
  return numValue !== null && numValue >= 0 ? numValue : defaultValue;
};
var toPosNum = function toPosNum(value) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var numValue = toNum(value, null);
  return numValue !== null && numValue > 0 ? numValue : defaultValue;
};
var toNumWithBounds = function toNumWithBounds(value, limits, defaultValue) {
  var _limits$min, _limits$max;
  var isDefaultGiven = defaultValue !== undefined;
  var numValue = toNum(value, null);
  var min = (_limits$min = limits === null || limits === void 0 ? void 0 : limits.min) !== null && _limits$min !== void 0 ? _limits$min : null;
  var max = (_limits$max = limits === null || limits === void 0 ? void 0 : limits.max) !== null && _limits$max !== void 0 ? _limits$max : null;
  var result;
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
var maxAbs = function maxAbs() {
  for (var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++) {
    values[_key] = arguments[_key];
  }
  return max.apply(MH, _toConsumableArray(values.map(function (v) {
    return abs(v);
  })));
};
var havingMaxAbs = function havingMaxAbs() {
  for (var _len3 = arguments.length, values = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    values[_key3] = arguments[_key3];
  }
  return lengthOf(values) ? values.sort(function (a, b) {
    return abs(b) - abs(a);
  })[0] : -INFINITY;
};
var hAngle = function hAngle(x, y) {
  return normalizeAngle(MATH.atan2(y, x));
};
var normalizeAngle = function normalizeAngle(a) {
  while (a < 0 || a > PI * 2) {
    a += (a < 0 ? 1 : -1) * PI * 2;
  }
  return a > PI ? a - PI * 2 : a;
};
var degToRad = function degToRad(a) {
  return a * PI / 180;
};
var areParallel = function areParallel(vA, vB) {
  var angleDiffThreshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var angleA = hAngle(vA[0], vA[1]);
  var angleB = hAngle(vB[0], vB[1]);
  angleDiffThreshold = min(89.99, abs(angleDiffThreshold));
  return abs(normalizeAngle(angleA - angleB)) <= degToRad(angleDiffThreshold);
};
var areAntiParallel = function areAntiParallel(vA, vB) {
  var angleDiffThreshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  return areParallel(vA, [-vB[0], -vB[1]], angleDiffThreshold);
};
var distanceBetween = function distanceBetween(ptA, ptB) {
  return sqrt(pow(ptA[0] - ptB[0], 2) + pow(ptA[1] - ptB[1], 2));
};
var quadraticRoots = function quadraticRoots(a, b, c) {
  var z = sqrt(b * b - 4 * a * c);
  return [(-b + z) / (2 * a), (-b - z) / (2 * a)];
};
var easeInOutQuad = function easeInOutQuad(x) {
  return x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;
};
var sortedKeysByVal = function sortedKeysByVal(obj) {
  var descending = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (descending) {
    return keysOf(obj).sort(function (x, y) {
      return obj[y] - obj[x];
    });
  }
  return keysOf(obj).sort(function (x, y) {
    return obj[x] - obj[y];
  });
};
var keyWithMaxVal = function keyWithMaxVal(obj) {
  return sortedKeysByVal(obj).slice(-1)[0];
};
var _getBitmask = function getBitmask(start, end) {
  return start > end ? _getBitmask(end, start) : -1 >>> 32 - end - 1 + start << start;
};

var _copyExistingKeys = function copyExistingKeys(fromObj, toObj) {
  for (var key in toObj) {
    if (!hasOwnProp(toObj, key)) {
      continue;
    }
    if (key in fromObj) {
      if (isNonPrimitive(fromObj[key]) && isNonPrimitive(toObj[key])) {
        _copyExistingKeys(fromObj[key], toObj[key]);
      } else {
        toObj[key] = fromObj[key];
      }
    }
  }
};
var omitKeys = function omitKeys(obj, keysToRm) {
  var res = {};
  var key;
  for (key in obj) {
    if (!(key in keysToRm)) {
      res[key] = obj[key];
    }
  }
  return res;
};
var _compareValuesIn = function compareValuesIn(objA, objB) {
  var roundTo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3;
  for (var key in objA) {
    if (!hasOwnProp(objA, key)) {
      continue;
    }
    var valA = objA[key];
    var valB = objB[key];
    if (isNonPrimitive(valA) && isNonPrimitive(valB)) {
      if (!_compareValuesIn(valA, valB)) {
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
var toArrayIfSingle = function toArrayIfSingle(value) {
  return isArray(value) ? value : !isNullish(value) ? [value] : [];
};
var toBool = function toBool(value) {
  return value === true || value === "true" || value === "" ? true : isNullish(value) || value === false || value === "false" ? false : null;
};

var formatAsString = function formatAsString(value, maxLen) {
  var result = _maybeConvertToString(value, false);
  return result;
};
var joinAsString = function joinAsString(separator) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  return args.map(function (a) {
    return formatAsString(a);
  }).join(separator);
};
var splitOn = function splitOn(input, separator, trim, limit) {
  if (!input.trim()) {
    return [];
  }
  limit = limit !== null && limit !== void 0 ? limit : -1;
  var output = [];
  var addEntry = function addEntry(s) {
    return output.push(trim ? s.trim() : s);
  };
  while (limit--) {
    var matchIndex = -1,
      matchLength = 0;
    if (isLiteralString(separator)) {
      matchIndex = input.indexOf(separator);
      matchLength = lengthOf(separator);
    } else {
      var _match$index;
      var match = separator.exec(input);
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
var kebabToCamelCase = kebabToCamelCase$1;
var camelToKebabCase = camelToKebabCase$1;
var randId = function randId() {
  var nChars = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 8;
  var segment = function segment() {
    return floor(100000 + MATH.random() * 900000).toString(36);
  };
  var s = "";
  while (lengthOf(s) < nChars) {
    s += segment();
  }
  return s.slice(0, nChars);
};
var toMargins = function toMargins(value, absoluteSize) {
  var _parts$, _parts$2, _ref, _parts$3;
  var toPxValue = function toPxValue(strValue, index) {
    var margin = parseFloat(strValue || "") || 0;
    if (strValue === margin + "%") {
      margin *= index % 2 ? absoluteSize[S_HEIGHT] : absoluteSize[S_WIDTH];
    }
    return margin;
  };
  var parts = splitOn(value, " ", true);
  var margins = [toPxValue(parts[0], 0), toPxValue((_parts$ = parts[1]) !== null && _parts$ !== void 0 ? _parts$ : parts[0], 1), toPxValue((_parts$2 = parts[2]) !== null && _parts$2 !== void 0 ? _parts$2 : parts[0], 2), toPxValue((_ref = (_parts$3 = parts[3]) !== null && _parts$3 !== void 0 ? _parts$3 : parts[1]) !== null && _ref !== void 0 ? _ref : parts[0], 3)];
  return margins;
};
var objToStrKey = function objToStrKey(obj) {
  return stringify(_flattenForSorting(obj));
};
var _flattenForSorting = function flattenForSorting(obj) {
  var array = isArray(obj) ? obj : keysOf(obj).sort().map(function (k) {
    return obj[k];
  });
  return array.map(function (value) {
    if (isArray(value) || isNonPrimitive(value) && constructorOf(value) === OBJECT) {
      return _flattenForSorting(value);
    }
    return value;
  });
};
var stringifyReplacer = function stringifyReplacer(key, value) {
  return key ? _maybeConvertToString(value, true) : value;
};
var _maybeConvertToString = function maybeConvertToString(value, nested) {
  var result = "";
  if (isElement(value)) {
    var classStr = classList(value).toString().trim();
    result = value.id ? "#" + value.id : "<".concat(tagName(value)).concat(classStr ? ' class="' + classStr + '"' : "", ">");
  } else if (isInstanceOf(value, Error)) {
    if ("stack" in value && isString(value.stack)) {
      result = value.stack;
    } else {
      result = "Error: ".concat(value.message);
    }
  } else if (isArray(value)) {
    result = "[" + value.map(function (v) {
      return isString(v) ? stringify(v) : _maybeConvertToString(v, false);
    }).join(",") + "]";
  } else if (isIterableObject(value)) {
    result = typeOrClassOf(value) + "(" + _maybeConvertToString(arrayFrom(value), false) + ")";
  } else if (isNonPrimitive(value)) {
    result = nested ? value : stringify(value, stringifyReplacer);
  } else {
    result = nested ? value : STRING(value);
  }
  return result;
};

var validateStrList = function validateStrList(key, value, checkFn) {
  var _toArray;
  return filterBlank((_toArray = toArray(value)) === null || _toArray === void 0 ? void 0 : _toArray.map(function (v) {
    return _validateString(key, v, checkFn, "a string or a string array");
  }));
};
var validateNumList = function validateNumList(key, value) {
  var _toArray2;
  return filterBlank((_toArray2 = toArray(value)) === null || _toArray2 === void 0 ? void 0 : _toArray2.map(function (v) {
    return _validateNumber(key, v, "a number or a number array");
  }));
};
var validateNumber = function validateNumber(key, value) {
  return _validateNumber(key, value);
};
var validateBoolean = function validateBoolean(key, value) {
  return _validateBoolean(key, value);
};
var validateString = function validateString(key, value, checkFn) {
  return _validateString(key, value, checkFn);
};
var validateStringRequired = function validateStringRequired(key, value, checkFn) {
  var result = _validateString(key, value, checkFn);
  if (isEmpty(result)) {
    throw usageError("'".concat(key, "' is required"));
  }
  return result;
};
var validateBooleanOrString = function validateBooleanOrString(key, value, stringCheckFn) {
  return _validateBooleanOrString(key, value, stringCheckFn);
};
var toArray = function toArray(value) {
  var result;
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
  return result ? filterBlank(result.map(function (v) {
    return isLiteralString(v) ? v.trim() : v;
  })) : undefined;
};
var _validateNumber = function _validateNumber(key, value, typeDescription) {
  if (isNullish(value)) {
    return;
  }
  var numVal = toNum(value, null);
  if (numVal === null) {
    throw usageError("'".concat(key, "' must be ").concat(typeDescription !== null && typeDescription !== void 0 ? typeDescription : "a number"));
  }
  return numVal;
};
var _validateBoolean = function _validateBoolean(key, value, typeDescription) {
  if (isNullish(value)) {
    return;
  }
  var boolVal = toBool(value);
  if (boolVal === null) {
    throw usageError("'".concat(key, "' must be ").concat('"true" or "false"'));
  }
  return boolVal;
};
var _validateString = function _validateString(key, value, checkFn, typeDescription) {
  if (isNullish(value)) {
    return;
  }
  if (!isLiteralString(value)) {
    throw usageError("'".concat(key, "' must be ").concat(typeDescription !== null && typeDescription !== void 0 ? typeDescription : "a string"));
  } else if (checkFn && !checkFn(value)) {
    throw usageError("Invalid value for '".concat(key, "'"));
  }
  return value;
};
var _validateBooleanOrString = function _validateBooleanOrString(key, value, stringCheckFn, typeDescription) {
  if (isNullish(value)) {
    return;
  }
  var boolVal = toBool(value);
  if (boolVal !== null) {
    return boolVal;
  }
  if (!isLiteralString(value)) {
    throw usageError("'".concat(key, "' must be ").concat("a boolean or string"));
  }
  return _validateString(key, value, stringCheckFn);
};

var BitSpaces = _createClass(function BitSpaces() {
  _classCallCheck(this, BitSpaces);
  var counter = newCounter();
  this.create = function () {
    for (var _len = arguments.length, propNames = new Array(_len), _key = 0; _key < _len; _key++) {
      propNames[_key] = arguments[_key];
    }
    return newBitSpace(counter, propNames);
  };
  defineProperty(this, "nBits", {
    get: function get() {
      return counter._nBits;
    }
  });
  defineProperty(this, "bitmask", {
    get: function get() {
      return counter._bitmask;
    }
  });
});
var newBitSpaces = function newBitSpaces() {
  return new BitSpaces();
};
var createBitSpace = function createBitSpace(spaces) {
  for (var _len2 = arguments.length, propNames = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    propNames[_key2 - 1] = arguments[_key2];
  }
  return spaces.create.apply(spaces, propNames);
};
var newCounter = function newCounter() {
  return {
    _nBits: 0,
    _bitmask: 0
  };
};
var newBitSpace = function newBitSpace(counter, propNames) {
  var start = counter._nBits;
  var end = start + lengthOf(propNames) - 1;
  if (end >= 31) {
    throw usageError("BitSpaces overflow");
  }
  var bitmask = _getBitmask(start, end);
  var space = {
    bit: {},
    start: start,
    end: end,
    bitmask: bitmask,
    has: function has(p) {
      return isString(p) && p in space.bit && isNumber(space.bit[p]);
    },
    bitmaskFor: function bitmaskFor(pStart, pEnd) {
      if (!isEmpty(pStart) && !space.has(pStart) || !isEmpty(pEnd) && !space.has(pEnd)) {
        return 0;
      }
      var thisStart = !isEmpty(pStart) ? log2(space.bit[pStart]) : start;
      var thisEnd = !isEmpty(pEnd) ? log2(space.bit[pEnd]) : end;
      return _getBitmask(thisStart, thisEnd);
    },
    nameOf: function nameOf(val) {
      var _propNames;
      return (_propNames = propNames[log2(val) - start]) !== null && _propNames !== void 0 ? _propNames : null;
    }
  };
  var _iterator = _createForOfIteratorHelper(propNames),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var name = _step.value;
      defineProperty(space.bit, name, {
        value: 1 << counter._nBits++,
        enumerable: true
      });
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  counter._bitmask |= bitmask;
  return space;
};

var DOM_CATEGORIES_SPACE = createBitSpace(newBitSpaces(), S_ADDED, S_REMOVED, S_ATTRIBUTE);

var scheduleHighPriorityTask = function scheduleHighPriorityTask(task) {
  if (typeof scheduler !== "undefined") {
    scheduler.postTask(task, {
      priority: "user-blocking"
    });
  } else {
    var channel = new MessageChannel();
    channel.port1.onmessage = function () {
      channel.port1.close();
      task();
    };
    channel.port2.postMessage("");
  }
};
var getDebouncedHandler = function getDebouncedHandler(debounceWindow, handler) {
  if (!debounceWindow) {
    return handler;
  }
  var timer = null;
  var lastArgs;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    lastArgs = args;
    if (timer === null) {
      timer = setTimer(_asyncToGenerator(_regeneratorRuntime().mark(function _callee() {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return handler.apply(void 0, _toConsumableArray(lastArgs));
            case 2:
              timer = null;
            case 3:
            case "end":
              return _context.stop();
          }
        }, _callee);
      })), debounceWindow);
    }
  };
};
var waitForDelay = function waitForDelay(delay) {
  return newPromise(function (resolve) {
    setTimer(resolve, delay);
  });
};

var _wrapCallback = function wrapCallback(handlerOrCallback) {
  var debounceWindow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var isFunction$1 = isFunction(handlerOrCallback);
  var isRemoved = function isRemoved() {
    return false;
  };
  if (isFunction$1) {
    var callback = callablesMap.get(handlerOrCallback);
    if (callback) {
      return _wrapCallback(callback);
    }
  } else {
    isRemoved = handlerOrCallback.isRemoved;
  }
  var handler = isFunction$1 ? handlerOrCallback : function () {
    return handlerOrCallback.invoke.apply(handlerOrCallback, arguments);
  };
  var wrapper = new Callback(getDebouncedHandler(debounceWindow, function () {
    if (!isRemoved()) {
      return handler.apply(void 0, arguments);
    }
  }));
  if (!isFunction$1) {
    handlerOrCallback.onRemove(wrapper.remove);
  }
  return wrapper;
};
var Callback = _createClass(function Callback(handler) {
  var _this = this;
  _classCallCheck(this, Callback);
  var isRemoved = false;
  var id = SYMBOL();
  var onRemove = newSet();
  this.isRemoved = function () {
    return isRemoved;
  };
  this.remove = function () {
    if (!isRemoved) {
      isRemoved = true;
      var _iterator = _createForOfIteratorHelper(onRemove),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var rmFn = _step.value;
          rmFn();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      CallbackScheduler._clear(id);
    }
  };
  this.onRemove = function (fn) {
    return onRemove.add(fn);
  };
  this.invoke = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return newPromise(function (resolve, reject) {
      if (isRemoved) {
        reject(usageError("Callback has been removed"));
        return;
      }
      CallbackScheduler._push(id, _asyncToGenerator(_regeneratorRuntime().mark(function _callee() {
        var result;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return handler.apply(void 0, args);
            case 3:
              result = _context.sent;
              _context.next = 9;
              break;
            case 6:
              _context.prev = 6;
              _context.t0 = _context["catch"](0);
              reject(_context.t0);
            case 9:
              if (result === Callback.REMOVE) {
                _this.remove();
              }
              resolve();
            case 11:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[0, 6]]);
      })), reject);
    });
  };
  callablesMap.set(this.invoke, this);
});
_defineProperty(Callback, "KEEP", SYMBOL("KEEP"));
_defineProperty(Callback, "REMOVE", SYMBOL("REMOVE"));
_defineProperty(Callback, "wrap", _wrapCallback);
var callablesMap = newWeakMap();
var CallbackScheduler = function () {
  var queues = newMap();
  var flush = function () {
    var _ref2 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee2(queue) {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return null;
          case 2:
            if (!lengthOf(queue)) {
              _context2.next = 9;
              break;
            }
            queue[0]._running = true;
            _context2.next = 6;
            return queue[0]._task();
          case 6:
            queue.shift();
            _context2.next = 2;
            break;
          case 9:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function flush(_x) {
      return _ref2.apply(this, arguments);
    };
  }();
  return {
    _clear: function _clear(id) {
      var queue = queues.get(id);
      if (queue) {
        var item;
        while (item = queue.shift()) {
          if (!item._running) {
            item._onRemove(Callback.REMOVE);
          }
        }
        deleteKey(queues, id);
      }
    },
    _push: function _push(id, task, onRemove) {
      var queue = queues.get(id);
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
}();

var logWarn = function logWarn() {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }
  if (!isMessageSeen(args)) {
    consoleWarn.apply(MH, [LOG_PREFIX].concat(args));
  }
};
var logError = function logError() {
  for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }
  if ((lengthOf(args) > 1 || args[0] !== Callback.REMOVE) && !isMessageSeen(args)) {
    consoleError.apply(MH, [LOG_PREFIX].concat(args));
  }
};
var discardMessages = newSet();
var isMessageSeen = function isMessageSeen(args) {
  var msg = joinAsString.apply(void 0, [" "].concat(_toConsumableArray(args)));
  var isSeen = discardMessages.has(msg);
  discardMessages.add(msg);
  return isSeen;
};

var waitForMutateTime = function waitForMutateTime() {
  return newPromise(function (resolve) {
    scheduleDOMTask(scheduledDOMMutations, resolve);
  });
};
var waitForMeasureTime = function waitForMeasureTime() {
  return newPromise(function (resolve) {
    scheduleDOMTask(scheduledDOMMeasurements, resolve);
  });
};
var waitForSubsequentMutateTime = function waitForSubsequentMutateTime() {
  return waitForMutateTime().then(waitForMeasureTime).then(waitForMutateTime);
};
var waitForSubsequentMeasureTime = function waitForSubsequentMeasureTime() {
  return waitForMeasureTime().then(waitForMutateTime).then(waitForMeasureTime);
};
var scheduledDOMMeasurements = [];
var scheduledDOMMutations = [];
var hasScheduledDOMTasks = false;
var scheduleDOMTask = function scheduleDOMTask(queue, resolve) {
  queue.push(resolve);
  if (!hasScheduledDOMTasks) {
    hasScheduledDOMTasks = true;
    onAnimationFrame(_runAllDOMTasks);
  }
};
var _runAllDOMTasks = function () {
  var _ref = _asyncToGenerator(_regeneratorRuntime().mark(function _callee2() {
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          if (!lengthOf(scheduledDOMMutations)) {
            _context2.next = 6;
            break;
          }
          runDOMTaskQueue(scheduledDOMMutations);
          _context2.next = 4;
          return null;
        case 4:
          _context2.next = 0;
          break;
        case 6:
          scheduleHighPriorityTask(_asyncToGenerator(_regeneratorRuntime().mark(function _callee() {
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  if (!lengthOf(scheduledDOMMeasurements)) {
                    _context.next = 6;
                    break;
                  }
                  runDOMTaskQueue(scheduledDOMMeasurements);
                  _context.next = 4;
                  return null;
                case 4:
                  _context.next = 0;
                  break;
                case 6:
                  if (lengthOf(scheduledDOMMutations)) {
                    onAnimationFrame(_runAllDOMTasks);
                  } else {
                    hasScheduledDOMTasks = false;
                  }
                case 7:
                case "end":
                  return _context.stop();
              }
            }, _callee);
          })));
        case 7:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function runAllDOMTasks() {
    return _ref.apply(this, arguments);
  };
}();
var runDOMTaskQueue = function runDOMTaskQueue(queue) {
  var resolve;
  while (resolve = queue.shift()) {
    try {
      resolve();
    } catch (err) {
      logError(err);
    }
  }
};

var getVisibleContentChildren = function getVisibleContentChildren(el) {
  return filter(_toConsumableArray(childrenOf(el)), function (e) {
    return isVisibleContentTag(tagName(e));
  });
};
var isVisibleContentTag = function isVisibleContentTag(tagName) {
  return !includes(["script", "style"], toLowerCase(tagName));
};
var isInlineTag = function isInlineTag(tagName) {
  return inlineTags.has(tagName.toLowerCase());
};
var isDOMElement = function isDOMElement(target) {
  return isHTMLElement(target) || isInstanceOf(target, SVGElement) || typeof MathMLElement !== "undefined" && isInstanceOf(target, MathMLElement);
};
var inlineTags = newSet(["a", "abbr", "acronym", "b", "bdi", "bdo", "big", "button", "cite", "code", "data", "dfn", "em", "i", "img", "input", "kbd", "label", "mark", "map", "object", "output", "q", "rp", "rt", "ruby", "s", "samp", "script", "select", "small", "span", "strong", "sub", "sup", "textarea", "time", "tt", "u", "var"]);

var transitionElementNow = function transitionElementNow(element, fromCls, toCls) {
  cancelCSSTransitions(element, fromCls, toCls);
  var didChange = false;
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
var transitionElement = function () {
  var _ref = _asyncToGenerator(_regeneratorRuntime().mark(function _callee(element, fromCls, toCls) {
    var delay,
      thisTransition,
      didChange,
      transitionDuration,
      _args = arguments;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          delay = _args.length > 3 && _args[3] !== undefined ? _args[3] : 0;
          thisTransition = scheduleCSSTransition(element, toCls);
          if (!delay) {
            _context.next = 5;
            break;
          }
          _context.next = 5;
          return waitForDelay(delay);
        case 5:
          _context.next = 7;
          return waitForMutateTime();
        case 7:
          if (!thisTransition._isCancelled()) {
            _context.next = 9;
            break;
          }
          return _context.abrupt("return", false);
        case 9:
          didChange = transitionElementNow(element, fromCls, toCls);
          thisTransition._finish();
          if (didChange) {
            _context.next = 13;
            break;
          }
          return _context.abrupt("return", false);
        case 13:
          _context.next = 15;
          return getMaxTransitionDuration(element);
        case 15:
          transitionDuration = _context.sent;
          if (!transitionDuration) {
            _context.next = 19;
            break;
          }
          _context.next = 19;
          return waitForDelay(transitionDuration);
        case 19:
          return _context.abrupt("return", true);
        case 20:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function transitionElement(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var displayElementNow = function displayElementNow(element) {
  return transitionElementNow(element, PREFIX_UNDISPLAY, PREFIX_DISPLAY);
};
var displayElement = function displayElement(element) {
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return transitionElement(element, PREFIX_UNDISPLAY, PREFIX_DISPLAY, delay);
};
var undisplayElementNow = function undisplayElementNow(element) {
  return transitionElementNow(element, PREFIX_DISPLAY, PREFIX_UNDISPLAY);
};
var undisplayElement = function undisplayElement(element) {
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return transitionElement(element, PREFIX_DISPLAY, PREFIX_UNDISPLAY, delay);
};
var showElement = function showElement(element) {
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return transitionElement(element, PREFIX_HIDE, PREFIX_SHOW, delay);
};
var hideElement = function hideElement(element) {
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return transitionElement(element, PREFIX_SHOW, PREFIX_HIDE, delay);
};
var toggleDisplayElement = function toggleDisplayElement(element) {
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return isElementUndisplayed(element) ? displayElement(element, delay) : undisplayElement(element, delay);
};
var toggleShowElement = function toggleShowElement(element) {
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return isElementHidden(element) ? showElement(element, delay) : hideElement(element, delay);
};
var isElementHidden = function isElementHidden(element) {
  return hasClass(element, PREFIX_HIDE);
};
var isElementUndisplayed = function isElementUndisplayed(element) {
  return hasClass(element, PREFIX_UNDISPLAY);
};
var hasClass = function hasClass(el, className) {
  return classList(el).contains(className);
};
var addClassesNow = function addClassesNow(el) {
  var _MH$classList;
  for (var _len = arguments.length, classNames = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    classNames[_key - 1] = arguments[_key];
  }
  return (_MH$classList = classList(el)).add.apply(_MH$classList, classNames);
};
var addClasses = function addClasses(el) {
  for (var _len2 = arguments.length, classNames = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    classNames[_key2 - 1] = arguments[_key2];
  }
  return waitForMutateTime().then(function () {
    return addClassesNow.apply(void 0, [el].concat(classNames));
  });
};
var removeClassesNow = function removeClassesNow(el) {
  var _MH$classList2;
  for (var _len3 = arguments.length, classNames = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    classNames[_key3 - 1] = arguments[_key3];
  }
  return (_MH$classList2 = classList(el)).remove.apply(_MH$classList2, classNames);
};
var removeClasses = function removeClasses(el) {
  for (var _len4 = arguments.length, classNames = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    classNames[_key4 - 1] = arguments[_key4];
  }
  return waitForMutateTime().then(function () {
    return removeClassesNow.apply(void 0, [el].concat(classNames));
  });
};
var toggleClassNow = function toggleClassNow(el, className, force) {
  return classList(el).toggle(className, force);
};
var toggleClass = function toggleClass(el, className, force) {
  return waitForMutateTime().then(function () {
    return toggleClassNow(el, className, force);
  });
};
var getData = function getData(el, name) {
  return getAttr(el, prefixData(name));
};
var getBoolData = function getBoolData(el, name) {
  var value = getData(el, name);
  return value !== null && value !== "false";
};
var setDataNow = function setDataNow(el, name, value) {
  return setAttr(el, prefixData(name), value);
};
var setData = function setData(el, name, value) {
  return waitForMutateTime().then(function () {
    return setDataNow(el, name, value);
  });
};
var setBoolDataNow = function setBoolDataNow(el, name) {
  var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return setAttr(el, prefixData(name), value + "");
};
var setBoolData = function setBoolData(el, name) {
  var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return waitForMutateTime().then(function () {
    return setBoolDataNow(el, name, value);
  });
};
var unsetBoolDataNow = function unsetBoolDataNow(el, name) {
  return unsetAttr(el, prefixData(name));
};
var unsetBoolData = function unsetBoolData(el, name) {
  return waitForMutateTime().then(function () {
    return unsetBoolDataNow(el, name);
  });
};
var delDataNow = function delDataNow(el, name) {
  return delAttr(el, prefixData(name));
};
var delData = function delData(el, name) {
  return waitForMutateTime().then(function () {
    return delDataNow(el, name);
  });
};
var getComputedStylePropNow = function getComputedStylePropNow(element, prop) {
  return getComputedStyle(element).getPropertyValue(prop);
};
var getComputedStyleProp = function getComputedStyleProp(element, prop) {
  return waitForMeasureTime().then(function () {
    return getComputedStylePropNow(element, prop);
  });
};
var getStylePropNow = function getStylePropNow(element, prop) {
  var _style;
  return (_style = element.style) === null || _style === void 0 ? void 0 : _style.getPropertyValue(prop);
};
var getStyleProp = function getStyleProp(element, prop) {
  return waitForMeasureTime().then(function () {
    return getStylePropNow(element, prop);
  });
};
var setStylePropNow = function setStylePropNow(element, prop, value) {
  var _style2;
  return (_style2 = element.style) === null || _style2 === void 0 ? void 0 : _style2.setProperty(prop, value);
};
var setStyleProp = function setStyleProp(element, prop, value) {
  return waitForMutateTime().then(function () {
    return setStylePropNow(element, prop, value);
  });
};
var delStylePropNow = function delStylePropNow(element, prop) {
  var _style3;
  return (_style3 = element.style) === null || _style3 === void 0 ? void 0 : _style3.removeProperty(prop);
};
var delStyleProp = function delStyleProp(element, prop) {
  return waitForMutateTime().then(function () {
    return delStylePropNow(element, prop);
  });
};
var getMaxTransitionDuration = function () {
  var _ref2 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee2(element) {
    var propVal;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return getComputedStyleProp(element, "transition-duration");
        case 2:
          propVal = _context2.sent;
          return _context2.abrupt("return", max.apply(MH, _toConsumableArray(splitOn(propVal, ",", true).map(function (strValue) {
            var duration = parseFloat(strValue) || 0;
            if (strValue === duration + "s") {
              duration *= 1000;
            }
            return duration;
          }))));
        case 4:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function getMaxTransitionDuration(_x4) {
    return _ref2.apply(this, arguments);
  };
}();
var disableInitialTransition = function () {
  var _ref3 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee3(element) {
    var delay,
      _args3 = arguments;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          delay = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : 0;
          _context3.next = 3;
          return addClasses(element, PREFIX_TRANSITION_DISABLE);
        case 3:
          if (!delay) {
            _context3.next = 6;
            break;
          }
          _context3.next = 6;
          return waitForDelay(delay);
        case 6:
          _context3.next = 8;
          return waitForSubsequentMutateTime();
        case 8:
          removeClassesNow(element, PREFIX_TRANSITION_DISABLE);
        case 9:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function disableInitialTransition(_x5) {
    return _ref3.apply(this, arguments);
  };
}();
var setHasModal = function setHasModal() {
  return setBoolData(getBody(), PREFIX_HAS_MODAL);
};
var delHasModal = function delHasModal() {
  return delData(getBody(), PREFIX_HAS_MODAL);
};
var copyStyle = function () {
  var _ref4 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee4(fromElement, toElement, includeComputedProps) {
    var props, _iterator, _step, prop, style, _prop, value, _prop2;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          if (!(!isDOMElement(fromElement) || !isDOMElement(toElement))) {
            _context4.next = 2;
            break;
          }
          return _context4.abrupt("return");
        case 2:
          _context4.next = 4;
          return waitForMeasureTime();
        case 4:
          props = {};
          if (includeComputedProps) {
            _iterator = _createForOfIteratorHelper(includeComputedProps);
            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                prop = _step.value;
                props[prop] = getComputedStylePropNow(fromElement, prop);
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
          }
          style = fromElement.style;
          for (_prop in style) {
            value = style.getPropertyValue(_prop);
            if (value) {
              props[_prop] = value;
            }
          }
          for (_prop2 in props) {
            setStyleProp(toElement, _prop2, props[_prop2]);
          }
          addClasses.apply(void 0, [toElement].concat(_toConsumableArray(classList(fromElement))));
        case 10:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function copyStyle(_x6, _x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
var setNumericStyleProps = function () {
  var _ref5 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee5(element, props) {
    var options,
      transformFn,
      varPrefix,
      prop,
      cssPropSuffix,
      varName,
      value,
      _options$_numDecimal,
      thisNumDecimal,
      currValue,
      _args5 = arguments;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          options = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : {};
          if (isDOMElement(element)) {
            _context5.next = 3;
            break;
          }
          return _context5.abrupt("return");
        case 3:
          transformFn = options._transformFn;
          varPrefix = prefixCssJsVar((options === null || options === void 0 ? void 0 : options._prefix) || "");
          _context5.t0 = _regeneratorRuntime().keys(props);
        case 6:
          if ((_context5.t1 = _context5.t0()).done) {
            _context5.next = 28;
            break;
          }
          prop = _context5.t1.value;
          cssPropSuffix = camelToKebabCase(prop);
          varName = "".concat(varPrefix).concat(cssPropSuffix);
          value = void 0;
          if (isValidNum(props[prop])) {
            _context5.next = 15;
            break;
          }
          value = null;
          _context5.next = 25;
          break;
        case 15:
          value = props[prop];
          thisNumDecimal = (_options$_numDecimal = options === null || options === void 0 ? void 0 : options._numDecimal) !== null && _options$_numDecimal !== void 0 ? _options$_numDecimal : value > 0 && value < 1 ? 2 : 0;
          if (!transformFn) {
            _context5.next = 24;
            break;
          }
          _context5.t2 = MH;
          _context5.next = 21;
          return getStyleProp(element, varName);
        case 21:
          _context5.t3 = _context5.sent;
          currValue = _context5.t2.parseFloat.call(_context5.t2, _context5.t3);
          value = transformFn(prop, currValue || 0, value);
        case 24:
          value = roundNumTo(value, thisNumDecimal);
        case 25:
          if (value === null) {
            delStyleProp(element, varName);
          } else {
            setStyleProp(element, varName, value + ((options === null || options === void 0 ? void 0 : options._units) || ""));
          }
          _context5.next = 6;
          break;
        case 28:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function setNumericStyleProps(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();
var PREFIX_HAS_MODAL = prefixName("has-modal");
var scheduledCSSTransitions = newWeakMap();
var cancelCSSTransitions = function cancelCSSTransitions(element) {
  var scheduledTransitions = scheduledCSSTransitions.get(element);
  if (!scheduledTransitions) {
    return;
  }
  for (var _len5 = arguments.length, toClasses = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    toClasses[_key5 - 1] = arguments[_key5];
  }
  for (var _i = 0, _toClasses = toClasses; _i < _toClasses.length; _i++) {
    var toCls = _toClasses[_i];
    var scheduledTransition = scheduledTransitions[toCls];
    if (scheduledTransition) {
      scheduledTransition._cancel();
    }
  }
};
var scheduleCSSTransition = function scheduleCSSTransition(element, toCls) {
  var scheduledTransitions = scheduledCSSTransitions.get(element);
  if (!scheduledTransitions) {
    scheduledTransitions = {};
    scheduledCSSTransitions.set(element, scheduledTransitions);
  }
  var isCancelled = false;
  scheduledTransitions[toCls] = {
    _cancel: function _cancel() {
      isCancelled = true;
      deleteObjKey(scheduledTransitions, toCls);
    },
    _finish: function _finish() {
      deleteObjKey(scheduledTransitions, toCls);
    },
    _isCancelled: function _isCancelled() {
      return isCancelled;
    }
  };
  return scheduledTransitions[toCls];
};

var wrapElementNow = function wrapElementNow(element, options) {
  var wrapper = createWrapperFor(element, options === null || options === void 0 ? void 0 : options.wrapper);
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
var wrapElement = function () {
  var _ref = _asyncToGenerator(_regeneratorRuntime().mark(function _callee(element, options) {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", waitForMutateTime().then(function () {
            return wrapElementNow(element, options);
          }));
        case 1:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function wrapElement(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var wrapChildrenNow = function wrapChildrenNow(element, options) {
  var wrapper = createWrapperFor(element, options === null || options === void 0 ? void 0 : options.wrapper);
  moveChildrenNow(element, wrapper, {
    ignoreMove: true
  });
  moveElementNow(wrapper, {
    to: element,
    ignoreMove: true
  });
  return wrapper;
};
var wrapChildren = function () {
  var _ref2 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee2(element, options) {
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", waitForMutateTime().then(function () {
            return wrapChildrenNow(element, options);
          }));
        case 1:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function wrapChildren(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var replaceElementNow = function replaceElementNow(element, newElement, options) {
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
(function () {
  var _ref3 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee3(element, newElement, options) {
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          return _context3.abrupt("return", waitForMutateTime().then(function () {
            return replaceElementNow(element, newElement, options);
          }));
        case 1:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function replaceElement(_x5, _x6, _x7) {
    return _ref3.apply(this, arguments);
  };
})();
var swapElementsNow = function swapElementsNow(elementA, elementB, options) {
  var temp = createElement("div");
  replaceElementNow(elementA, temp, options);
  replaceElementNow(elementB, elementA, options);
  replaceElementNow(temp, elementB, options);
};
var swapElements = function () {
  var _ref4 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee4(elementA, elementB, options) {
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          return _context4.abrupt("return", waitForMutateTime().then(function () {
            return swapElementsNow(elementA, elementB, options);
          }));
        case 1:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function swapElements(_x8, _x9, _x10) {
    return _ref4.apply(this, arguments);
  };
}();
var moveChildrenNow = function moveChildrenNow(oldParent, newParent, options) {
  if ((options === null || options === void 0 ? void 0 : options.ignoreMove) === true) {
    var _iterator = _createForOfIteratorHelper(childrenOf(oldParent)),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var child = _step.value;
        ignoreMove(child, {
          from: oldParent,
          to: newParent
        });
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
  newParent.append.apply(newParent, _toConsumableArray(childrenOf(oldParent)));
};
(function () {
  var _ref5 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee5(oldParent, newParent, options) {
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          return _context5.abrupt("return", waitForMutateTime().then(function () {
            return moveChildrenNow(oldParent, newParent, options);
          }));
        case 1:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function moveChildren(_x11, _x12, _x13) {
    return _ref5.apply(this, arguments);
  };
})();
var moveElementNow = function moveElementNow(element, options) {
  var parentEl = (options === null || options === void 0 ? void 0 : options.to) || null;
  var position = (options === null || options === void 0 ? void 0 : options.position) || "append";
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
var moveElement = function () {
  var _ref6 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee6(element, options) {
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          return _context6.abrupt("return", waitForMutateTime().then(function () {
            return moveElementNow(element, options);
          }));
        case 1:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function moveElement(_x14, _x15) {
    return _ref6.apply(this, arguments);
  };
}();
var hideAndRemoveElement = function () {
  var _ref7 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee7(element) {
    var delay,
      options,
      _args7 = arguments;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          delay = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : 0;
          options = _args7.length > 2 ? _args7[2] : undefined;
          _context7.next = 4;
          return hideElement(element, delay);
        case 4:
          moveElementNow(element, options);
        case 5:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function hideAndRemoveElement(_x16) {
    return _ref7.apply(this, arguments);
  };
}();
var getOrAssignID = function getOrAssignID(element) {
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var domID = element.id;
  if (!domID) {
    domID = "".concat(prefix, "-").concat(randId());
    element.id = domID;
  }
  return domID;
};
var wrapScrollingContent = function () {
  var _ref8 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee8(element) {
    var wrapper, firstChild;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return waitForMutateTime();
        case 2:
          firstChild = childrenOf(element)[0];
          if (lengthOf(childrenOf(element)) === 1 && isHTMLElement(firstChild) && hasClass(firstChild, PREFIX_CONTENT_WRAPPER)) {
            wrapper = firstChild;
          } else {
            wrapper = wrapChildrenNow(element, {
              });
            addClassesNow(wrapper, PREFIX_CONTENT_WRAPPER);
          }
          return _context8.abrupt("return", wrapper);
        case 5:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return function wrapScrollingContent(_x17) {
    return _ref8.apply(this, arguments);
  };
}();
var cloneElement = function cloneElement(element) {
  var clone = element.cloneNode(true);
  setBoolData(clone, prefixName("clone"));
  return clone;
};
var insertGhostCloneNow = function insertGhostCloneNow(element) {
  var insertBefore = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var clone = cloneElement(element);
  clone.id = "";
  addClassesNow(clone, PREFIX_GHOST, PREFIX_TRANSITION_DISABLE, PREFIX_ANIMATE_DISABLE);
  var wrapper = wrapElementNow(clone);
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
var insertGhostClone = function insertGhostClone(element) {
  var insertBefore = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  return waitForMutateTime().then(function () {
    return insertGhostCloneNow(element, insertBefore);
  });
};
var ignoreMove = function ignoreMove(target, options) {
  return recordsToSkipOnce.set(target, {
    from: options.from || null,
    to: options.to || null
  });
};
var getIgnoreMove = function getIgnoreMove(target) {
  return recordsToSkipOnce.get(target) || null;
};
var clearIgnoreMove = function clearIgnoreMove(target) {
  setTimer(function () {
    deleteKey(recordsToSkipOnce, target);
  }, 100);
};
var insertArrow = function insertArrow(target, direction) {
  var position = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "append";
  var tag = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "span";
  var arrow = createElement(tag);
  addClassesNow(arrow, prefixName(S_ARROW));
  setDataNow(arrow, prefixName("direction"), direction);
  moveElement(arrow, {
    to: target,
    position: position,
    ignoreMove: true
  });
  return arrow;
};
var PREFIX_CONTENT_WRAPPER = prefixName("content-wrapper");
var recordsToSkipOnce = newMap();
var createWrapperFor = function createWrapperFor(element, wrapper) {
  if (isElement(wrapper)) {
    return wrapper;
  }
  var tag = wrapper;
  if (!tag) {
    if (isInlineTag(tagName(element))) {
      tag = "span";
    } else {
      tag = "div";
    }
  }
  return createElement(tag);
};

var waitForElement = function waitForElement(checkFn, timeout) {
  return newPromise(function (resolve) {
    var callFn = function callFn() {
      var result = checkFn();
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
      setTimer(function () {
        resolve(null);
        observer.disconnect();
      }, timeout);
    }
    var observer = newMutationObserver(function () {
      if (callFn()) {
        observer.disconnect();
      }
    });
    observer.observe(getDocElement(), {
      childList: true,
      subtree: true
    });
  });
};
var waitForElementOrInteractive = function waitForElementOrInteractive(checkFn) {
  return newPromise(function (resolve) {
    var isInteractive = false;
    waitForElement(function () {
      return isInteractive || checkFn();
    }).then(function (res) {
      if (!isInteractive) {
        resolve(res);
      }
    });
    waitForInteractive().then(function () {
      isInteractive = true;
      resolve(null);
    });
  });
};
var waitForInteractive = function waitForInteractive() {
  return newPromise(function (resolve) {
    var readyState = getReadyState();
    if (readyState === INTERACTIVE || readyState === COMPLETE) {
      resolve();
      return;
    }
    getDoc().addEventListener("DOMContentLoaded", function () {
      return resolve();
    });
  });
};
var waitForComplete = function waitForComplete() {
  return newPromise(function (resolve) {
    if (getReadyState() === COMPLETE) {
      resolve();
      return;
    }
    getDoc().addEventListener("readystatechange", function () {
      if (getReadyState() === COMPLETE) {
        resolve();
      }
    });
  });
};
var waitForPageReady = function waitForPageReady() {
  return newPromise(function (resolve) {
    if (pageIsReady) {
      resolve();
      return;
    }
    return waitForInteractive().then(function () {
      var timer = null;
      var dispatchReady = function dispatchReady() {
        pageIsReady = true;
        if (timer) {
          clearTimer(timer);
          timer = null;
        }
        resolve();
      };
      if (settings.pageLoadTimeout > 0) {
        timer = setTimer(function () {
          dispatchReady();
        }, settings.pageLoadTimeout);
      }
      waitForComplete().then(dispatchReady);
    });
  });
};
var isPageReady = function isPageReady() {
  return pageIsReady;
};
var COMPLETE = "complete";
var INTERACTIVE = "interactive";
var pageIsReady = false;
if (!hasDOM()) {
  pageIsReady = true;
} else {
  waitForPageReady();
}

var newXMap = function newXMap(getDefaultV) {
  return new XMap(getDefaultV);
};
var newXMapGetter = function newXMapGetter(getDefaultV) {
  return function () {
    return newXMap(getDefaultV);
  };
};
var newXWeakMap = function newXWeakMap(getDefaultV) {
  return new XWeakMap(getDefaultV);
};
var newXWeakMapGetter = function newXWeakMapGetter(getDefaultV) {
  return function () {
    return newXWeakMap(getDefaultV);
  };
};
var XMapBase = _createClass(function XMapBase(root, getDefaultV) {
  _classCallCheck(this, XMapBase);
  this.get = function (key) {
    return root.get(key);
  };
  this.set = function (key, value) {
    return root.set(key, value);
  };
  this["delete"] = function (key) {
    return deleteKey(root, key);
  };
  this.has = function (key) {
    return root.has(key);
  };
  this.sGet = function (key) {
    var result = root.get(key);
    if (result === undefined) {
      result = getDefaultV(key);
      root.set(key, result);
    }
    return result;
  };
  this.prune = function (sk) {
    var value = root.get(sk);
    for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }
    if (value instanceof XMapBase && lengthOf(rest)) {
      value.prune.apply(value, [rest[0]].concat(_toConsumableArray(rest.slice(1))));
    }
    if (value === undefined || isIterableObject(value) && !("size" in value && value.size || "length" in value && value.length)) {
      deleteKey(root, sk);
    }
  };
});
var XMap = function (_XMapBase) {
  function XMap(getDefaultV) {
    var _this;
    _classCallCheck(this, XMap);
    var root = newMap();
    _this = _callSuper(this, XMap, [root, getDefaultV]);
    defineProperty(_this, "size", {
      get: function get() {
        return root.size;
      }
    });
    _this.clear = function () {
      return root.clear();
    };
    _this.entries = function () {
      return root.entries();
    };
    _this.keys = function () {
      return root.keys();
    };
    _this.values = function () {
      return root.values();
    };
    _this[SYMBOL.iterator] = function () {
      return root[SYMBOL.iterator]();
    };
    return _this;
  }
  _inherits(XMap, _XMapBase);
  return _createClass(XMap);
}(XMapBase);
_defineProperty(XMap, "newXMapGetter", newXMapGetter);
var XWeakMap = function (_XMapBase2) {
  function XWeakMap(getDefaultV) {
    _classCallCheck(this, XWeakMap);
    var root = newWeakMap();
    return _callSuper(this, XWeakMap, [root, getDefaultV]);
  }
  _inherits(XWeakMap, _XMapBase2);
  return _createClass(XWeakMap);
}(XMapBase);
_defineProperty(XWeakMap, "newXWeakMapGetter", newXWeakMapGetter);

var DOMWatcher = function () {
  function DOMWatcher(config, key) {
    _classCallCheck(this, DOMWatcher);
    if (key !== CONSTRUCTOR_KEY$6) {
      throw illegalConstructorError("DOMWatcher.create");
    }
    var buffer = newXMap(function (t) {
      return {
        _target: t,
        _categoryBitmask: 0,
        _attributes: newSet(),
        _addedTo: null,
        _removedFrom: null
      };
    });
    var allCallbacks = newMap();
    var timer = null;
    var mutationHandler = function mutationHandler(records) {
      var _iterator = _createForOfIteratorHelper(records),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var record = _step.value;
          var target = targetOf(record);
          var recType = record.type;
          if (!isElement(target)) {
            continue;
          }
          if (recType === S_CHILD_LIST) {
            var _iterator3 = _createForOfIteratorHelper(record.addedNodes),
              _step3;
            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                var child = _step3.value;
                if (isElement(child)) {
                  var operation = buffer.sGet(child);
                  operation._addedTo = target;
                  operation._categoryBitmask |= ADDED_BIT;
                }
              }
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }
            var _iterator4 = _createForOfIteratorHelper(record.removedNodes),
              _step4;
            try {
              for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                var _child = _step4.value;
                if (isElement(_child)) {
                  var _operation = buffer.sGet(_child);
                  _operation._removedFrom = target;
                  _operation._categoryBitmask |= REMOVED_BIT;
                }
              }
            } catch (err) {
              _iterator4.e(err);
            } finally {
              _iterator4.f();
            }
          } else if (recType === S_ATTRIBUTES && record.attributeName) {
            var _operation2 = buffer.sGet(target);
            _operation2._attributes.add(record.attributeName);
            _operation2._categoryBitmask |= ATTRIBUTE_BIT;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      if (!timer && sizeOf(buffer)) {
        timer = setTimer(function () {
          var _iterator2 = _createForOfIteratorHelper(buffer.values()),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var operation = _step2.value;
              if (shouldSkipOperation(operation)) {
              } else {
                processOperation(operation);
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
          buffer.clear();
          timer = null;
        }, 0);
      }
    };
    var observers = _defineProperty(_defineProperty({}, S_CHILD_LIST, {
      _observer: newMutationObserver(mutationHandler),
      _isActive: false
    }), S_ATTRIBUTES, {
      _observer: newMutationObserver(mutationHandler),
      _isActive: false
    });
    var createCallback = function createCallback(handler, options) {
      var _allCallbacks$get;
      remove((_allCallbacks$get = allCallbacks.get(handler)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get._callback);
      var callback = _wrapCallback(handler);
      callback.onRemove(function () {
        return deleteHandler(handler);
      });
      allCallbacks.set(handler, {
        _callback: callback,
        _options: options
      });
      return callback;
    };
    var setupOnMutation = function () {
      var _ref = _asyncToGenerator(_regeneratorRuntime().mark(function _callee(handler, userOptions) {
        var options, callback, root, childQueue, _i, _arr, element, initOperation, bufferedOperation, diffOperation;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              options = getOptions$3(userOptions || {});
              callback = createCallback(handler, options);
              root = config._root || getBody();
              if (root) {
                _context.next = 9;
                break;
              }
              _context.next = 6;
              return waitForElement(getBody);
            case 6:
              root = _context.sent;
              _context.next = 11;
              break;
            case 9:
              _context.next = 11;
              return null;
            case 11:
              if (!callback.isRemoved()) {
                _context.next = 13;
                break;
              }
              return _context.abrupt("return");
            case 13:
              if (options._categoryBitmask & (ADDED_BIT | REMOVED_BIT)) {
                activateObserver(root, S_CHILD_LIST);
              }
              if (options._categoryBitmask & ATTRIBUTE_BIT) {
                activateObserver(root, S_ATTRIBUTES);
              }
              if (!(userOptions !== null && userOptions !== void 0 && userOptions.skipInitial || !options._selector || !(options._categoryBitmask & ADDED_BIT))) {
                _context.next = 17;
                break;
              }
              return _context.abrupt("return");
            case 17:
              childQueue = observers[S_CHILD_LIST]._observer.takeRecords();
              mutationHandler(childQueue);
              _i = 0, _arr = [].concat(_toConsumableArray(querySelectorAll(root, options._selector)), _toConsumableArray(root.matches(options._selector) ? [root] : []));
            case 20:
              if (!(_i < _arr.length)) {
                _context.next = 36;
                break;
              }
              element = _arr[_i];
              initOperation = {
                _target: element,
                _categoryBitmask: ADDED_BIT,
                _attributes: newSet(),
                _addedTo: parentOf(element),
                _removedFrom: null
              };
              bufferedOperation = buffer.get(element);
              diffOperation = getDiffOperation(initOperation, bufferedOperation);
              if (!diffOperation) {
                _context.next = 33;
                break;
              }
              if (!shouldSkipOperation(diffOperation)) {
                _context.next = 30;
                break;
              }
              _context.next = 33;
              break;
            case 30:
              _context.next = 33;
              return invokeCallback$5(callback, diffOperation);
            case 33:
              _i++;
              _context.next = 20;
              break;
            case 36:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function setupOnMutation(_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }();
    var deleteHandler = function deleteHandler(handler) {
      deleteKey(allCallbacks, handler);
      var activeCategories = 0;
      var _iterator5 = _createForOfIteratorHelper(allCallbacks.values()),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var entry = _step5.value;
          activeCategories |= entry._options._categoryBitmask;
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
      if (!(activeCategories & (ADDED_BIT | REMOVED_BIT))) {
        deactivateObserver(S_CHILD_LIST);
      }
      if (!(activeCategories & ATTRIBUTE_BIT)) {
        deactivateObserver(S_ATTRIBUTES);
      }
    };
    var processOperation = function processOperation(operation) {
      var _iterator6 = _createForOfIteratorHelper(allCallbacks.values()),
        _step6;
      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var entry = _step6.value;
          var categoryBitmask = entry._options._categoryBitmask;
          var target = entry._options._target;
          var selector = entry._options._selector;
          if (!(operation._categoryBitmask & categoryBitmask)) {
            continue;
          }
          var currentTargets = [];
          if (target) {
            if (!operation._target.contains(target)) {
              continue;
            }
            currentTargets.push(target);
          }
          if (selector) {
            var matches = _toConsumableArray(querySelectorAll(operation._target, selector));
            if (operation._target.matches(selector)) {
              matches.push(operation._target);
            }
            if (!lengthOf(matches)) {
              continue;
            }
            currentTargets.push.apply(currentTargets, _toConsumableArray(matches));
          }
          invokeCallback$5(entry._callback, operation, currentTargets);
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
    };
    var activateObserver = function activateObserver(root, mutationType) {
      if (!observers[mutationType]._isActive) {
        observers[mutationType]._observer.observe(root, _defineProperty(_defineProperty({}, mutationType, true), "subtree", config._subtree));
        observers[mutationType]._isActive = true;
      }
    };
    var deactivateObserver = function deactivateObserver(mutationType) {
      if (observers[mutationType]._isActive) {
        observers[mutationType]._observer.disconnect();
        observers[mutationType]._isActive = false;
      }
    };
    var shouldSkipOperation = function shouldSkipOperation(operation) {
      var target = operation._target;
      var requestToSkip = getIgnoreMove(target);
      if (!requestToSkip) {
        return false;
      }
      var removedFrom = operation._removedFrom;
      var addedTo = parentOf(target);
      var requestFrom = requestToSkip.from;
      var requestTo = requestToSkip.to;
      var root = config._root || getBody();
      if ((removedFrom === requestFrom || !root.contains(requestFrom)) && addedTo === requestTo) {
        clearIgnoreMove(target);
        return true;
      }
      return false;
    };
    this.ignoreMove = ignoreMove;
    this.onMutation = setupOnMutation;
    this.offMutation = function (handler) {
      var _allCallbacks$get2;
      remove((_allCallbacks$get2 = allCallbacks.get(handler)) === null || _allCallbacks$get2 === void 0 ? void 0 : _allCallbacks$get2._callback);
    };
  }
  return _createClass(DOMWatcher, null, [{
    key: "create",
    value: function create() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return new DOMWatcher(getConfig$6(config), CONSTRUCTOR_KEY$6);
    }
  }, {
    key: "reuse",
    value: function reuse() {
      var _instances$get;
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var myConfig = getConfig$6(config);
      var configStrKey = objToStrKey(omitKeys(myConfig, {
        _root: null
      }));
      var root = myConfig._root === getBody() ? null : myConfig._root;
      var instance = (_instances$get = instances$8.get(root)) === null || _instances$get === void 0 ? void 0 : _instances$get.get(configStrKey);
      if (!instance) {
        instance = new DOMWatcher(myConfig, CONSTRUCTOR_KEY$6);
        instances$8.sGet(root).set(configStrKey, instance);
      }
      return instance;
    }
  }]);
}();
var CONSTRUCTOR_KEY$6 = SYMBOL();
var instances$8 = newXMap(function () {
  return newMap();
});
var getConfig$6 = function getConfig(config) {
  var _config$subtree;
  return {
    _root: config.root || null,
    _subtree: (_config$subtree = config.subtree) !== null && _config$subtree !== void 0 ? _config$subtree : true
  };
};
var CATEGORIES_BITS = DOM_CATEGORIES_SPACE.bit;
var ADDED_BIT = CATEGORIES_BITS[S_ADDED];
var REMOVED_BIT = CATEGORIES_BITS[S_REMOVED];
var ATTRIBUTE_BIT = CATEGORIES_BITS[S_ATTRIBUTE];
var getOptions$3 = function getOptions(options) {
  var categoryBitmask = 0;
  var categories = validateStrList("categories", options.categories, DOM_CATEGORIES_SPACE.has);
  if (categories) {
    var _iterator7 = _createForOfIteratorHelper(categories),
      _step7;
    try {
      for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
        var cat = _step7.value;
        categoryBitmask |= CATEGORIES_BITS[cat];
      }
    } catch (err) {
      _iterator7.e(err);
    } finally {
      _iterator7.f();
    }
  } else {
    categoryBitmask = DOM_CATEGORIES_SPACE.bitmask;
  }
  var selector = options.selector || "";
  if (!isString(selector)) {
    throw usageError("'selector' must be a string");
  }
  return {
    _categoryBitmask: categoryBitmask,
    _target: options.target || null,
    _selector: options.selector || ""
  };
};
var getDiffOperation = function getDiffOperation(operationA, operationB) {
  if (!operationB || operationA._target !== operationB._target) {
    return operationA;
  }
  var attributes = newSet();
  var _iterator8 = _createForOfIteratorHelper(operationA._attributes),
    _step8;
  try {
    for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
      var attr = _step8.value;
      if (!operationB._attributes.has(attr)) {
        attributes.add(attr);
      }
    }
  } catch (err) {
    _iterator8.e(err);
  } finally {
    _iterator8.f();
  }
  var categoryBitmask = operationA._categoryBitmask ^ operationB._categoryBitmask;
  var addedTo = operationA._addedTo === operationB._addedTo ? null : operationA._addedTo;
  var removedFrom = operationA._removedFrom === operationB._removedFrom ? null : operationA._removedFrom;
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
var invokeCallback$5 = function invokeCallback(callback, operation) {
  var currentTargets = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  if (!lengthOf(currentTargets)) {
    currentTargets = [operation._target];
  }
  var _iterator9 = _createForOfIteratorHelper(currentTargets),
    _step9;
  try {
    for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
      var currentTarget = _step9.value;
      callback.invoke({
        target: operation._target,
        currentTarget: currentTarget,
        attributes: operation._attributes,
        addedTo: operation._addedTo,
        removedFrom: operation._removedFrom
      })["catch"](logError);
    }
  } catch (err) {
    _iterator9.e(err);
  } finally {
    _iterator9.f();
  }
};

var getMaxDeltaDirection = function getMaxDeltaDirection(deltaX, deltaY) {
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
var getVectorDirection = function getVectorDirection(vector) {
  var angleDiffThreshold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  angleDiffThreshold = min(44.99, abs(angleDiffThreshold));
  if (!maxAbs.apply(void 0, _toConsumableArray(vector))) {
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
var getOppositeDirection = function getOppositeDirection(direction) {
  if (!(direction in OPPOSITE_DIRECTIONS)) {
    throw usageError("Invalid 'direction'");
  }
  return OPPOSITE_DIRECTIONS[direction];
};
var getOppositeXYDirections = function getOppositeXYDirections(directions) {
  var directionList = validateStrList("directions", directions, isValidXYDirection);
  if (!directionList) {
    throw usageError("'directions' is required");
  }
  var opposites = [];
  var _iterator = _createForOfIteratorHelper(directionList),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _direction = _step.value;
      var opposite = getOppositeDirection(_direction);
      if (opposite && isValidXYDirection(opposite) && !includes(directionList, opposite)) {
        opposites.push(opposite);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  if (!lengthOf(opposites)) {
    var _iterator2 = _createForOfIteratorHelper(XY_DIRECTIONS),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var direction = _step2.value;
        if (!includes(directionList, direction)) {
          opposites.push(direction);
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }
  return opposites;
};
var isValidXYDirection = function isValidXYDirection(direction) {
  return includes(XY_DIRECTIONS, direction);
};
var isValidDirection = function isValidDirection(direction) {
  return includes(DIRECTIONS, direction);
};
var XY_DIRECTIONS = [S_UP, S_DOWN, S_LEFT, S_RIGHT];
var Z_DIRECTIONS = [S_IN, S_OUT];
var SCROLL_DIRECTIONS = [].concat(XY_DIRECTIONS, [S_NONE, S_AMBIGUOUS]);
var DIRECTIONS = [].concat(XY_DIRECTIONS, Z_DIRECTIONS, [S_NONE, S_AMBIGUOUS]);
var OPPOSITE_DIRECTIONS = _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, S_UP, S_DOWN), S_DOWN, S_UP), S_LEFT, S_RIGHT), S_RIGHT, S_LEFT), S_IN, S_OUT), S_OUT, S_IN), S_NONE, null), S_AMBIGUOUS, null);

var callEventListener = function callEventListener(handler, event) {
  if (isFunction(handler)) {
    handler.call(event.currentTarget || self, event);
  } else {
    handler.handleEvent.call(event.currentTarget || self, event);
  }
};
var addEventListenerTo = function addEventListenerTo(target, eventType, handler) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  eventType = transformEventType(eventType);
  if (getEventHandlerData(target, eventType, handler, options)) {
    return false;
  }
  var thirdArg = options;
  var wrappedHandler = handler;
  var supports = getBrowserSupport();
  if (isNonPrimitive(options)) {
    if (!supports._optionsArg) {
      var _options$capture;
      thirdArg = (_options$capture = options.capture) !== null && _options$capture !== void 0 ? _options$capture : false;
    }
    if (options.once && !supports._options.once) {
      wrappedHandler = function wrappedHandler(event) {
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
var removeEventListenerFrom = function removeEventListenerFrom(target, eventType, handler) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  eventType = transformEventType(eventType);
  var data = getEventHandlerData(target, eventType, handler, options);
  if (!data) {
    return false;
  }
  target.removeEventListener(eventType, data._wrappedHandler, data._thirdArg);
  deleteEventHandlerData(target, eventType, handler, options);
  return true;
};
var preventSelect = function preventSelect(target) {
  addEventListenerTo(target, S_SELECTSTART, preventDefault);
  if (isElement(target)) {
    addClasses(target, PREFIX_NO_SELECT);
  }
};
var undoPreventSelect = function undoPreventSelect(target) {
  removeEventListenerFrom(target, S_SELECTSTART, preventDefault);
  if (isElement(target)) {
    removeClasses(target, PREFIX_NO_SELECT);
  }
};
var getBrowserSupport = function getBrowserSupport() {
  if (browserEventSupport) {
    return browserEventSupport;
  }
  var supports = {
    _pointer: false,
    _optionsArg: false,
    _options: {
      capture: false,
      passive: false,
      once: false,
      signal: false
    }
  };
  var optTest = {};
  var opt;
  var _loop = function _loop() {
    var thisOpt = opt;
    defineProperty(optTest, thisOpt, {
      get: function get() {
        supports._options[thisOpt] = true;
        if (thisOpt === "signal") {
          return new AbortController().signal;
        }
        return false;
      }
    });
  };
  for (opt in supports._options) {
    _loop();
  }
  var dummyHandler = function dummyHandler() {};
  var dummyElement = createElement("div");
  try {
    dummyElement.addEventListener("testOptionSupport", dummyHandler, optTest);
    dummyElement.removeEventListener("testOptionSupport", dummyHandler, optTest);
    supports._optionsArg = true;
  } catch (e__ignored) {}
  supports._pointer = "onpointerup" in dummyElement;
  browserEventSupport = supports;
  return supports;
};
var browserEventSupport;
var registeredEventHandlerData = newXWeakMap(newXMapGetter(newXMapGetter(function () {
  return newMap();
})));
var getEventOptionsStr = function getEventOptionsStr(options) {
  var finalOptions = {
    capture: false,
    passive: false,
    once: false
  };
  if (options === false || options === true) {
    finalOptions.capture = options;
  } else if (isObject(options)) {
    _copyExistingKeys(options, finalOptions);
  }
  return stringify(finalOptions);
};
var getEventHandlerData = function getEventHandlerData(target, eventType, handler, options) {
  var _registeredEventHandl;
  var optionsStr = getEventOptionsStr(options);
  return (_registeredEventHandl = registeredEventHandlerData.get(target)) === null || _registeredEventHandl === void 0 || (_registeredEventHandl = _registeredEventHandl.get(eventType)) === null || _registeredEventHandl === void 0 || (_registeredEventHandl = _registeredEventHandl.get(handler)) === null || _registeredEventHandl === void 0 ? void 0 : _registeredEventHandl.get(optionsStr);
};
var deleteEventHandlerData = function deleteEventHandlerData(target, eventType, handler, options) {
  var _registeredEventHandl2;
  var optionsStr = getEventOptionsStr(options);
  deleteKey((_registeredEventHandl2 = registeredEventHandlerData.get(target)) === null || _registeredEventHandl2 === void 0 || (_registeredEventHandl2 = _registeredEventHandl2.get(eventType)) === null || _registeredEventHandl2 === void 0 ? void 0 : _registeredEventHandl2.get(handler), optionsStr);
  registeredEventHandlerData.prune(target, eventType, handler);
};
var setEventHandlerData = function setEventHandlerData(target, eventType, handler, options, data) {
  var optionsStr = getEventOptionsStr(options);
  registeredEventHandlerData.sGet(target).sGet(eventType).sGet(handler).set(optionsStr, data);
};
var transformEventType = function transformEventType(eventType) {
  var supports = getBrowserSupport();
  if (eventType.startsWith(S_POINTER) && !supports._pointer) {
    return strReplace(eventType, S_POINTER, S_MOUSE);
  }
  return eventType;
};

var isValidInputDevice = function isValidInputDevice(device) {
  return includes(DEVICES, device);
};
var isValidIntent = function isValidIntent(intent) {
  return includes(INTENTS, intent);
};
var addDeltaZ = function addDeltaZ(current, increment) {
  return max(MIN_DELTA_Z, current * increment);
};
var DEVICES = [S_KEY, S_POINTER, S_TOUCH, S_WHEEL];
var INTENTS = [S_SCROLL, S_ZOOM, S_DRAG, S_UNKNOWN];
var MIN_DELTA_Z = 0.1;

var getKeyGestureFragment = function getKeyGestureFragment(events, options) {
  var _options$scrollHeight;
  if (!isIterableObject(events)) {
    events = [events];
  }
  var LINE = settings.deltaLineHeight;
  var PAGE = settings.deltaPageHeight;
  var CONTENT = (_options$scrollHeight = options === null || options === void 0 ? void 0 : options.scrollHeight) !== null && _options$scrollHeight !== void 0 ? _options$scrollHeight : PAGE;
  var deltasUp = function deltasUp(amount) {
    return [0, -amount, 1];
  };
  var deltasDown = function deltasDown(amount) {
    return [0, amount, 1];
  };
  var deltasLeft = function deltasLeft(amount) {
    return [-amount, 0, 1];
  };
  var deltasRight = function deltasRight(amount) {
    return [amount, 0, 1];
  };
  var deltasIn = [0, 0, 1.15];
  var deltasOut = [0, 0, 1 / 1.15];
  var direction = S_NONE;
  var intent = null;
  var deltaX = 0,
    deltaY = 0,
    deltaZ = 1;
  var _iterator = _createForOfIteratorHelper(events),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _deltasForKey;
      var event = _step.value;
      if (!isKeyboardEvent(event) || event.type !== S_KEYDOWN) {
        continue;
      }
      var deltasForKey = (_deltasForKey = {}, _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_deltasForKey, SK_UP, deltasUp(LINE)), SK_ARROWUP, deltasUp(LINE)), SK_PAGEUP, deltasUp(PAGE)), "Home", deltasUp(CONTENT)), SK_DOWN, deltasDown(LINE)), SK_ARROWDOWN, deltasDown(LINE)), SK_PAGEDOWN, deltasDown(PAGE)), "End", deltasDown(CONTENT)), SK_LEFT, deltasLeft(LINE)), SK_ARROWLEFT, deltasLeft(LINE)), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_deltasForKey, SK_RIGHT, deltasRight(LINE)), SK_ARROWRIGHT, deltasRight(LINE)), " ", (event.shiftKey ? deltasUp : deltasDown)(PAGE)), "+", deltasIn), "=", event.ctrlKey ? deltasIn : null), "-", deltasOut));
      var theseDeltas = deltasForKey[event.key] || null;
      if (!theseDeltas) {
        continue;
      }
      var _theseDeltas = _slicedToArray(theseDeltas, 3),
        thisDeltaX = _theseDeltas[0],
        thisDeltaY = _theseDeltas[1],
        thisDeltaZ = _theseDeltas[2];
      var thisIntent = thisDeltaZ !== 1 ? S_ZOOM : S_SCROLL;
      deltaX += thisDeltaX;
      deltaY += thisDeltaY;
      deltaZ = addDeltaZ(deltaZ, thisDeltaZ);
      if (!intent) {
        intent = thisIntent;
      } else if (intent !== thisIntent) {
        intent = S_UNKNOWN;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
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
    direction: direction,
    intent: intent,
    deltaX: deltaX,
    deltaY: deltaY,
    deltaZ: deltaZ
  };
};
var SK_UP = "Up";
var SK_DOWN = "Down";
var SK_LEFT = "Left";
var SK_RIGHT = "Right";
var SK_PAGE = "Page";
var SK_ARROW = "Arrow";
var SK_PAGEUP = SK_PAGE + SK_UP;
var SK_PAGEDOWN = SK_PAGE + SK_DOWN;
var SK_ARROWUP = SK_ARROW + SK_UP;
var SK_ARROWDOWN = SK_ARROW + SK_DOWN;
var SK_ARROWLEFT = SK_ARROW + SK_LEFT;
var SK_ARROWRIGHT = SK_ARROW + SK_RIGHT;

var getPointerGestureFragment = function getPointerGestureFragment(events, options) {
  if (!isIterableObject(events)) {
    events = [events];
  }
  var isCancelled = false;
  var supports = getBrowserSupport();
  var pointerEventClass = supports._pointer ? PointerEvent : MouseEvent;
  var pointerUpType = supports._pointer ? S_POINTERUP : S_MOUSEUP;
  var filteredEvents = filter(events, function (event) {
    var eType = event.type;
    isCancelled = isCancelled || eType === S_POINTERCANCEL;
    if (eType !== S_CLICK && isInstanceOf(event, pointerEventClass)) {
      isCancelled = isCancelled || eType === pointerUpType && event.buttons !== 0 || eType !== pointerUpType && event.buttons !== 1;
      return !isTouchPointerEvent(event);
    }
    return false;
  });
  var numEvents = lengthOf(filteredEvents);
  if (numEvents < 2) {
    return false;
  }
  if (isCancelled) {
    return null;
  }
  var firstEvent = filteredEvents[0];
  var lastEvent = filteredEvents[numEvents - 1];
  if (getPointerType(firstEvent) !== getPointerType(lastEvent)) {
    return null;
  }
  var deltaX = lastEvent.clientX - firstEvent.clientX;
  var deltaY = lastEvent.clientY - firstEvent.clientY;
  var direction = getVectorDirection([deltaX, deltaY], options === null || options === void 0 ? void 0 : options.angleDiffThreshold);
  return direction === S_NONE ? false : {
    device: S_POINTER,
    direction: direction,
    intent: S_DRAG,
    deltaX: deltaX,
    deltaY: deltaY,
    deltaZ: 1
  };
};

var getTouchGestureFragment = function getTouchGestureFragment(events, options) {
  var _options$dragHoldTime, _options$dragNumFinge;
  if (!isIterableObject(events)) {
    events = [events];
  }
  var moves = getTouchDiff(events, options === null || options === void 0 ? void 0 : options.deltaThreshold);
  if (!moves) {
    return null;
  }
  var numMoves = lengthOf(moves);
  var holdTime = getHoldTime(events);
  var canBeDrag = holdTime >= ((_options$dragHoldTime = options === null || options === void 0 ? void 0 : options.dragHoldTime) !== null && _options$dragHoldTime !== void 0 ? _options$dragHoldTime : 500) && numMoves === ((_options$dragNumFinge = options === null || options === void 0 ? void 0 : options.dragNumFingers) !== null && _options$dragNumFinge !== void 0 ? _options$dragNumFinge : 1);
  var angleDiffThreshold = options === null || options === void 0 ? void 0 : options.angleDiffThreshold;
  var deltaX = havingMaxAbs.apply(void 0, _toConsumableArray(moves.map(function (m) {
    return m.deltaX;
  })));
  var deltaY = havingMaxAbs.apply(void 0, _toConsumableArray(moves.map(function (m) {
    return m.deltaY;
  })));
  var deltaZ = 1;
  if (numMoves > 2) {
    moves = filter(moves, function (d) {
      return d.isSignificant;
    });
    numMoves = lengthOf(moves);
  }
  var direction = S_NONE;
  var intent = S_UNKNOWN;
  if (numMoves === 2) {
    var vectorA = [moves[0].deltaX, moves[0].deltaY];
    var vectorB = [moves[1].deltaX, moves[1].deltaY];
    if (!havingMaxAbs.apply(void 0, vectorA) || !havingMaxAbs.apply(void 0, vectorB) || areAntiParallel(vectorA, vectorB, angleDiffThreshold)) {
      var startDistance = distanceBetween([moves[0].startX, moves[0].startY], [moves[1].startX, moves[1].startY]);
      var endDistance = distanceBetween([moves[0].endX, moves[0].endY], [moves[1].endX, moves[1].endY]);
      direction = startDistance < endDistance ? S_IN : S_OUT;
      deltaZ = endDistance / startDistance;
      deltaX = deltaY = 0;
      intent = S_ZOOM;
    }
  }
  var deltaSign = canBeDrag || options !== null && options !== void 0 && options.reverseScroll ? 1 : -1;
  deltaX = deltaSign * deltaX + 0;
  deltaY = deltaSign * deltaY + 0;
  if (direction === S_NONE) {
    var isFirst = true;
    var _iterator = _createForOfIteratorHelper(moves),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var m = _step.value;
        intent = canBeDrag ? S_DRAG : S_SCROLL;
        var thisDirection = getVectorDirection([deltaSign * m.deltaX, deltaSign * m.deltaY], angleDiffThreshold);
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
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
  if (direction === S_NONE) {
    var lastTouchEvent = events.filter(isTouchEvent).slice(-1)[0];
    return lengthOf(lastTouchEvent === null || lastTouchEvent === void 0 ? void 0 : lastTouchEvent.touches) ? false : null;
  }
  return {
    device: S_TOUCH,
    direction: direction,
    intent: intent,
    deltaX: deltaX,
    deltaY: deltaY,
    deltaZ: deltaZ
  };
};
var getTouchDiff = function getTouchDiff(events) {
  var deltaThreshold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var groupedTouches = newXMap(function () {
    return [];
  });
  var _iterator2 = _createForOfIteratorHelper(events),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var event = _step2.value;
      if (!isTouchEvent(event)) {
        continue;
      }
      if (event.type === S_TOUCHCANCEL) {
        return null;
      }
      var _iterator4 = _createForOfIteratorHelper(event.touches),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var touch = _step4.value;
          groupedTouches.sGet(touch.identifier).push(touch);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  var moves = [];
  var _iterator3 = _createForOfIteratorHelper(groupedTouches.values()),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var touchList = _step3.value;
      var nTouches = lengthOf(touchList);
      if (nTouches < 2) {
        continue;
      }
      var firstTouch = touchList[0];
      var lastTouch = touchList[nTouches - 1];
      var startX = firstTouch.clientX;
      var startY = firstTouch.clientY;
      var endX = lastTouch.clientX;
      var endY = lastTouch.clientY;
      var deltaX = endX - startX;
      var deltaY = endY - startY;
      var isSignificant = maxAbs(deltaX, deltaY) >= deltaThreshold;
      moves.push({
        startX: startX,
        startY: startY,
        endX: endX,
        endY: endY,
        deltaX: deltaX,
        deltaY: deltaY,
        isSignificant: isSignificant
      });
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  return moves;
};
var getHoldTime = function getHoldTime(events) {
  var firstStart = events.findIndex(function (e) {
    return e.type === S_TOUCHSTART;
  });
  var firstMove = events.findIndex(function (e) {
    return e.type === S_TOUCHMOVE;
  });
  if (firstStart < 0 || firstMove < 1) {
    return 0;
  }
  return events[firstMove].timeStamp - events[firstStart].timeStamp;
};

var normalizeWheel = function normalizeWheel(event) {
  var spinX = 0,
    spinY = 0,
    pixelX = event.deltaX,
    pixelY = event.deltaY;
  var LINE = settings.deltaLineHeight;
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
    spinX: spinX,
    spinY: spinY,
    pixelX: pixelX,
    pixelY: pixelY
  };
};

var getWheelGestureFragment = function getWheelGestureFragment(events, options) {
  if (!isIterableObject(events)) {
    events = [events];
  }
  var direction = S_NONE;
  var intent = null;
  var deltaX = 0,
    deltaY = 0,
    deltaZ = 1;
  var _iterator = _createForOfIteratorHelper(events),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var event = _step.value;
      if (!isWheelEvent(event) || event.type !== S_WHEEL) {
        continue;
      }
      var data = normalizeWheel(event);
      var thisIntent = S_SCROLL;
      var thisDeltaX = data.pixelX;
      var thisDeltaY = data.pixelY;
      var thisDeltaZ = 1;
      var maxDelta = havingMaxAbs(thisDeltaX, thisDeltaY);
      if (event.ctrlKey && !thisDeltaX) {
        var percentage = -maxDelta;
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
      if (!thisIntent) {} else if (!intent) {
        intent = thisIntent;
      } else if (intent !== thisIntent) {
        intent = S_UNKNOWN;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
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
    direction: direction,
    intent: intent,
    deltaX: deltaX,
    deltaY: deltaY,
    deltaZ: deltaZ
  };
};

var GestureWatcher = function () {
  function GestureWatcher(config, key) {
    var _this = this;
    _classCallCheck(this, GestureWatcher);
    if (key !== CONSTRUCTOR_KEY$5) {
      throw illegalConstructorError("GestureWatcher.create");
    }
    var allCallbacks = newXWeakMap(function () {
      return newMap();
    });
    var allListeners = newXWeakMap(function () {
      return newMap();
    });
    var createCallback = function createCallback(target, handler, options) {
      var _allCallbacks$get;
      remove((_allCallbacks$get = allCallbacks.get(target)) === null || _allCallbacks$get === void 0 || (_allCallbacks$get = _allCallbacks$get.get(handler)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get._callback);
      var _getCallbackAndWrappe = getCallbackAndWrapper(handler, options),
        _callback = _getCallbackAndWrappe._callback,
        _wrapper = _getCallbackAndWrappe._wrapper;
      _callback.onRemove(function () {
        return deleteHandler(target, handler, options);
      });
      allCallbacks.sGet(target).set(handler, {
        _callback: _callback,
        _wrapper: _wrapper,
        _options: options
      });
      return _callback;
    };
    var setupOnGesture = function () {
      var _ref = _asyncToGenerator(_regeneratorRuntime().mark(function _callee(target, handler, userOptions) {
        var options, _iterator, _step, _allListeners$get, device, listeners;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              options = getOptions$2(config, userOptions || {});
              createCallback(target, handler, options);
              _iterator = _createForOfIteratorHelper(options._devices || DEVICES);
              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  device = _step.value;
                  listeners = (_allListeners$get = allListeners.get(target)) === null || _allListeners$get === void 0 ? void 0 : _allListeners$get.get(device);
                  if (listeners) {
                  } else {
                    listeners = setupListeners(target, device, options);
                    allListeners.sGet(target).set(device, listeners);
                  }
                  listeners._nCallbacks++;
                  if (options._preventDefault) {
                    listeners._nPreventDefault++;
                  }
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
            case 4:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function setupOnGesture(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      };
    }();
    var deleteHandler = function deleteHandler(target, handler, options) {
      deleteKey(allCallbacks.get(target), handler);
      allCallbacks.prune(target);
      var _iterator2 = _createForOfIteratorHelper(options._devices || DEVICES),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _allListeners$get2;
          var device = _step2.value;
          var listeners = (_allListeners$get2 = allListeners.get(target)) === null || _allListeners$get2 === void 0 ? void 0 : _allListeners$get2.get(device);
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
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    };
    var invokeCallbacks = function invokeCallbacks(target, device, event) {
      var _allListeners$get3, _allCallbacks$get2;
      var preventDefault = (((_allListeners$get3 = allListeners.get(target)) === null || _allListeners$get3 === void 0 || (_allListeners$get3 = _allListeners$get3.get(device)) === null || _allListeners$get3 === void 0 ? void 0 : _allListeners$get3._nPreventDefault) || 0) > 0;
      var isTerminated = false;
      var _iterator3 = _createForOfIteratorHelper(((_allCallbacks$get2 = allCallbacks.get(target)) === null || _allCallbacks$get2 === void 0 ? void 0 : _allCallbacks$get2.values()) || []),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _wrapper = _step3.value._wrapper;
          isTerminated = _wrapper(target, device, event, preventDefault) || isTerminated;
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      return isTerminated;
    };
    var setupListeners = function setupListeners(target, device, options) {
      var intents = options._intents;
      var hasAddedTabIndex = false;
      var hasPreventedSelect = false;
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
      var addOrRemoveListeners = function addOrRemoveListeners(action, listener, eventTypes) {
        var method = action === "add" ? addEventListenerTo : removeEventListenerFrom;
        var _iterator4 = _createForOfIteratorHelper(eventTypes),
          _step4;
        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var eventType = _step4.value;
            method(target, eventType, listener, {
              passive: false,
              capture: true
            });
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      };
      var addInitialListener = function addInitialListener() {
        return addOrRemoveListeners("add", initialListener, initiatingEvents[device]);
      };
      var removeInitialListener = function removeInitialListener() {
        return addOrRemoveListeners("remove", initialListener, initiatingEvents[device]);
      };
      var addOngoingListener = function addOngoingListener() {
        return addOrRemoveListeners("add", processEvent, ongoingEvents[device]);
      };
      var removeOngoingListener = function removeOngoingListener() {
        return addOrRemoveListeners("remove", processEvent, ongoingEvents[device]);
      };
      var initialListener = function initialListener(event) {
        processEvent(event);
        removeInitialListener();
        addOngoingListener();
      };
      var processEvent = function processEvent(event) {
        var isTerminated = invokeCallbacks(target, device, event);
        if (isTerminated) {
          removeOngoingListener();
          addInitialListener();
        }
      };
      addInitialListener();
      return {
        _nCallbacks: 0,
        _nPreventDefault: 0,
        _remove: function _remove() {
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
    this.trackGesture = function (element, handler, options) {
      if (!handler) {
        handler = setGestureCssProps;
        var _iterator5 = _createForOfIteratorHelper(INTENTS),
          _step5;
        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var intent = _step5.value;
            setGestureCssProps(element, {
              intent: intent,
              totalDeltaX: 0,
              totalDeltaY: 0,
              totalDeltaZ: 1
            });
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      }
      return setupOnGesture(element, handler, options);
    };
    this.noTrackGesture = function (element, handler) {
      if (!handler) {
        handler = setGestureCssProps;
        var _iterator6 = _createForOfIteratorHelper(INTENTS),
          _step6;
        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var intent = _step6.value;
            setGestureCssProps(element, {
              intent: intent
            });
          }
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }
      }
      _this.offGesture(element, handler);
    };
    this.onGesture = setupOnGesture;
    this.offGesture = function (target, handler) {
      var _allCallbacks$get3;
      remove((_allCallbacks$get3 = allCallbacks.get(target)) === null || _allCallbacks$get3 === void 0 || (_allCallbacks$get3 = _allCallbacks$get3.get(handler)) === null || _allCallbacks$get3 === void 0 ? void 0 : _allCallbacks$get3._callback);
    };
  }
  return _createClass(GestureWatcher, null, [{
    key: "create",
    value: function create() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return new GestureWatcher(getConfig$5(config), CONSTRUCTOR_KEY$5);
    }
  }, {
    key: "reuse",
    value: function reuse() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var myConfig = getConfig$5(config);
      var configStrKey = objToStrKey(myConfig);
      var instance = instances$7.get(configStrKey);
      if (!instance) {
        instance = new GestureWatcher(myConfig, CONSTRUCTOR_KEY$5);
        instances$7.set(configStrKey, instance);
      }
      return instance;
    }
  }]);
}();
var CONSTRUCTOR_KEY$5 = SYMBOL();
var instances$7 = newMap();
var getConfig$5 = function getConfig(config) {
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
var initiatingEvents = {
  key: [S_KEYDOWN],
  pointer: [S_POINTERDOWN, S_CLICK],
  touch: [S_TOUCHSTART],
  wheel: [S_WHEEL]
};
var ongoingEvents = {
  key: [S_KEYDOWN],
  pointer: [S_POINTERDOWN, S_POINTERUP, S_POINTERMOVE, S_POINTERCANCEL, S_CLICK],
  touch: [S_TOUCHSTART, S_TOUCHEND, S_TOUCHMOVE, S_TOUCHCANCEL],
  wheel: [S_WHEEL]
};
var fragmentGetters = _defineProperty(_defineProperty(_defineProperty(_defineProperty({}, S_KEY, getKeyGestureFragment), S_POINTER, getPointerGestureFragment), S_TOUCH, getTouchGestureFragment), S_WHEEL, getWheelGestureFragment);
var getOptions$2 = function getOptions(config, options) {
  var _options$minTotalDelt, _options$maxTotalDelt, _options$minTotalDelt2, _options$maxTotalDelt2, _options$minTotalDelt3, _options$maxTotalDelt3, _options$preventDefau, _options$naturalTouch, _options$touchDragHol, _options$touchDragNum;
  var debounceWindow = toNonNegNum(options[S_DEBOUNCE_WINDOW], config._debounceWindow);
  var deltaThreshold = toNonNegNum(options.deltaThreshold, config._deltaThreshold);
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
var getCallbackAndWrapper = function getCallbackAndWrapper(handler, options, logger) {
  var totalDeltaX = 0,
    totalDeltaY = 0,
    totalDeltaZ = 1;
  var preventNextClick = false;
  var directions = options._directions;
  var intents = options._intents;
  var minTotalDeltaX = options._minTotalDeltaX;
  var maxTotalDeltaX = options._maxTotalDeltaX;
  var minTotalDeltaY = options._minTotalDeltaY;
  var maxTotalDeltaY = options._maxTotalDeltaY;
  var minTotalDeltaZ = options._minTotalDeltaZ;
  var maxTotalDeltaZ = options._maxTotalDeltaZ;
  var deltaThreshold = options._deltaThreshold;
  var angleDiffThreshold = options._angleDiffThreshold;
  var reverseScroll = !options._naturalTouchScroll;
  var dragHoldTime = options._touchDragHoldTime;
  var dragNumFingers = options._touchDragNumFingers;
  var eventQueue = [];
  randId();
  var callback = _wrapCallback(handler);
  var debouncedWrapper = getDebouncedHandler(options._debounceWindow, function (target, fragment, eventQueueCopy) {
    var _eventQueueCopy, _eventQueueCopy$;
    if (callback.isRemoved()) {
      return;
    }
    var deltaX = fragment.deltaX;
    var deltaY = fragment.deltaY;
    var deltaZ = fragment.deltaZ;
    var device = fragment.device;
    if (round(maxAbs(deltaX, deltaY, (1 - deltaZ) * 100)) < deltaThreshold) {
      return;
    }
    clearEventQueue(device, eventQueue);
    var newTotalDeltaX = toNumWithBounds(totalDeltaX + deltaX, {
      min: minTotalDeltaX,
      max: maxTotalDeltaX
    });
    var newTotalDeltaY = toNumWithBounds(totalDeltaY + deltaY, {
      min: minTotalDeltaY,
      max: maxTotalDeltaY
    });
    var newTotalDeltaZ = toNumWithBounds(addDeltaZ(totalDeltaZ, deltaZ), {
      min: minTotalDeltaZ,
      max: maxTotalDeltaZ
    });
    if (newTotalDeltaX === totalDeltaX && newTotalDeltaY === totalDeltaY && newTotalDeltaZ === totalDeltaZ) {
      return;
    }
    totalDeltaX = newTotalDeltaX;
    totalDeltaY = newTotalDeltaY;
    totalDeltaZ = newTotalDeltaZ;
    var direction = fragment.direction;
    var intent = fragment.intent;
    var time = ((_eventQueueCopy = eventQueueCopy[lengthOf(eventQueueCopy) - 1]) === null || _eventQueueCopy === void 0 ? void 0 : _eventQueueCopy.timeStamp) - ((_eventQueueCopy$ = eventQueueCopy[0]) === null || _eventQueueCopy$ === void 0 ? void 0 : _eventQueueCopy$.timeStamp) || 0;
    var data = {
      device: device,
      direction: direction,
      intent: intent,
      deltaX: deltaX,
      deltaY: deltaY,
      deltaZ: deltaZ,
      time: time,
      totalDeltaX: totalDeltaX,
      totalDeltaY: totalDeltaY,
      totalDeltaZ: totalDeltaZ
    };
    if (direction !== S_NONE && (!directions || includes(directions, direction)) && (!intents || includes(intents, intent))) {
      callback.invoke(target, data, eventQueueCopy)["catch"](logError);
    }
  });
  var wrapper = function wrapper(target, device, event, preventDefault) {
    eventQueue.push(event);
    var fragment = fragmentGetters[device](eventQueue, {
      angleDiffThreshold: angleDiffThreshold,
      deltaThreshold: deltaThreshold,
      reverseScroll: reverseScroll,
      dragHoldTime: dragHoldTime,
      dragNumFingers: dragNumFingers
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
      setTimer(function () {
        preventNextClick = false;
      }, 10);
    }
    debouncedWrapper(target, fragment, [].concat(eventQueue));
    return false;
  };
  return {
    _callback: callback,
    _wrapper: wrapper
  };
};
var clearEventQueue = function clearEventQueue(device, queue) {
  var keepLastEvent = device === S_POINTER || device === S_TOUCH;
  queue.splice(0, lengthOf(queue) - (keepLastEvent ? 1 : 0));
};
var preventDefaultActionFor = function preventDefaultActionFor(event, isActualGesture) {
  var target = event.currentTarget;
  var eventType = event.type;
  var isPointerDown = eventType === S_POINTERDOWN || eventType === S_MOUSEDOWN;
  if (eventType === S_TOUCHMOVE || eventType === S_WHEEL || (eventType === S_CLICK || eventType === S_KEYDOWN) && isActualGesture || isPointerDown && event.buttons === 1) {
    preventDefault(event);
    if (isPointerDown && isHTMLElement(target)) {
      target.focus({
        preventScroll: true
      });
    }
  }
};
var setGestureCssProps = function setGestureCssProps(target, data) {
  var intent = data.intent;
  if (!isElement(target) || !intent || intent === S_UNKNOWN) {
    return;
  }
  var prefix = "".concat(intent, "-");
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

var isValidDeviceList = function isValidDeviceList(device) {
  return isValidForType(S_DEVICES, device, ORDERED_DEVICES);
};
var isValidAspectRatioList = function isValidAspectRatioList(aspectR) {
  return isValidForType(S_ASPECTRS_CAMEL, aspectR, ORDERED_ASPECTR);
};
var getOtherDevices = function getOtherDevices(device) {
  return getOtherLayouts(S_DEVICES, device, ORDERED_DEVICES);
};
var getOtherAspectRatios = function getOtherAspectRatios(aspectR) {
  return getOtherLayouts(S_ASPECTRS_CAMEL, aspectR, ORDERED_ASPECTR);
};
var getLayoutBitmask = function getLayoutBitmask(options) {
  var layoutBitmask = getBitmaskFromSpec(S_DEVICES, options === null || options === void 0 ? void 0 : options.devices, ORDERED_DEVICES) | getBitmaskFromSpec(S_ASPECTRS_CAMEL, options === null || options === void 0 ? void 0 : options.aspectRatios, ORDERED_ASPECTR);
  if (!layoutBitmask) {
    layoutBitmask = ORDERED_DEVICES.bitmask | ORDERED_ASPECTR.bitmask;
  }
  return layoutBitmask;
};
var ORDERED_DEVICE_NAMES = sortedKeysByVal(settings.deviceBreakpoints);
var ORDERED_ASPECTR_NAMES = sortedKeysByVal(settings.aspectRatioBreakpoints);
var bitSpaces = newBitSpaces();
var ORDERED_DEVICES = createBitSpace.apply(void 0, [bitSpaces].concat(_toConsumableArray(ORDERED_DEVICE_NAMES)));
var ORDERED_ASPECTR = createBitSpace.apply(void 0, [bitSpaces].concat(_toConsumableArray(ORDERED_ASPECTR_NAMES)));
var NUM_LAYOUTS = lengthOf(ORDERED_DEVICE_NAMES) + lengthOf(ORDERED_ASPECTR_NAMES);
var S_DEVICES = "devices";
var S_ASPECTRS_CAMEL = "aspectRatios";
var LAYOUT_RANGE_REGEX = RegExp("^ *(" + "(?<layoutA>[a-z-]+) +to +(?<layoutB>[a-z-]+)|" + "min +(?<minLayout>[a-z-]+)|" + "max +(?<maxLayout>[a-z-]+)" + ") *$");
var getLayoutsFromBitmask = function getLayoutsFromBitmask(keyName, bitmask, bitSpace) {
  var layouts = [];
  for (var bit = bitSpace.start; bit <= bitSpace.end; bit++) {
    var value = 1 << bit;
    if (bitmask & value) {
      var name = bitSpace.nameOf(value);
      if (name) {
        layouts.push(name);
      }
    }
  }
  return layouts;
};
var getOtherLayouts = function getOtherLayouts(keyName, spec, bitSpace) {
  var bitmask = getBitmaskFromSpec(keyName, spec, bitSpace);
  if (!bitmask) {
    return [];
  }
  var oppositeBitmask = bitSpace.bitmask & ~bitmask;
  return getLayoutsFromBitmask(keyName, oppositeBitmask, bitSpace);
};
var isValidForType = function isValidForType(keyName, spec, bitSpace) {
  try {
    var bitmask = getBitmaskFromSpec(keyName, spec, bitSpace);
    return bitmask !== 0;
  } catch (err) {
    if (isInstanceOf(err, LisnUsageError)) {
      return false;
    }
    throw err;
  }
};
var getBitmaskFromSpec = function getBitmaskFromSpec(keyName, spec, bitSpace) {
  if (isEmpty(spec)) {
    return 0;
  }
  var singleKeyName = keyName.slice(0, -1);
  if (isString(spec)) {
    var rangeMatch = spec.match(LAYOUT_RANGE_REGEX);
    if (rangeMatch) {
      if (!rangeMatch.groups) {
        throw bugError("Layout regex has no named groups");
      }
      var minLayout = rangeMatch.groups.layoutA || rangeMatch.groups.minLayout;
      var maxLayout = rangeMatch.groups.layoutB || rangeMatch.groups.maxLayout;
      if (minLayout !== undefined && !bitSpace.has(minLayout)) {
        throw usageError("Unknown ".concat(singleKeyName, " '").concat(minLayout, "'"));
      }
      if (maxLayout !== undefined && !bitSpace.has(maxLayout)) {
        throw usageError("Unknown ".concat(singleKeyName, " '").concat(maxLayout, "'"));
      }
      return bitSpace.bitmaskFor(minLayout, maxLayout);
    }
  }
  var bitmask = 0;
  var layouts = validateStrList(keyName, spec, bitSpace.has);
  if (layouts) {
    var _iterator = _createForOfIteratorHelper(layouts),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var lt = _step.value;
        bitmask |= bitSpace.bit[lt];
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
  return bitmask;
};

var _isScrollable = function isScrollable(element, options) {
  var _ref = options || {},
    axis = _ref.axis,
    active = _ref.active,
    noCache = _ref.noCache;
  if (!axis) {
    return _isScrollable(element, {
      axis: "y",
      active: active,
      noCache: noCache
    }) || _isScrollable(element, {
      axis: "x",
      active: active,
      noCache: noCache
    });
  }
  if (!noCache) {
    var _isScrollableCache$ge;
    var cachedResult = (_isScrollableCache$ge = isScrollableCache.get(element)) === null || _isScrollableCache$ge === void 0 ? void 0 : _isScrollableCache$ge.get(axis);
    if (!isNullish(cachedResult)) {
      return cachedResult;
    }
  }
  var offset = axis === "x" ? "Left" : "Top";
  var result = false;
  var doCache = !noCache;
  if (element["scroll".concat(offset)]) {
    result = true;
  } else if (active) {
    elScrollTo(element, _defineProperty({}, toLowerCase(offset), 1));
    var canScroll = element["scroll".concat(offset)] > 0;
    elScrollTo(element, _defineProperty({}, toLowerCase(offset), 0));
    result = canScroll;
  } else {
    var dimension = axis === "x" ? "Width" : "Height";
    result = element["scroll".concat(dimension)] > element["client".concat(dimension)];
    doCache = false;
  }
  if (doCache) {
    isScrollableCache.sGet(element).set(axis, result);
    setTimer(function () {
      deleteKey(isScrollableCache.get(element), axis);
      isScrollableCache.prune(element);
    }, IS_SCROLLABLE_CACHE_TIMEOUT);
  }
  return result;
};
var getClosestScrollable = function getClosestScrollable(element, options) {
  var ancestor = element;
  while (ancestor = parentOf(ancestor)) {
    if (_isScrollable(ancestor, options)) {
      return ancestor;
    }
  }
  return null;
};
var getCurrentScrollAction = function getCurrentScrollAction(scrollable) {
  scrollable = toScrollableOrDefault(scrollable);
  var action = currentScrollAction.get(scrollable);
  if (action) {
    return copyObject(action);
  }
  return null;
};
var scrollTo = function scrollTo(to, userOptions) {
  var options = getOptions$1(to, userOptions);
  var scrollable = options._scrollable;
  var currentScroll = currentScrollAction.get(scrollable);
  if (currentScroll) {
    if (!currentScroll.cancel()) {
      return null;
    }
  }
  var isCancelled = false;
  var cancelFn = options._weCanInterrupt ? function () {
    return isCancelled = true;
  } : function () {
    return false;
  };
  var scrollEvents = ["touchmove", "wheel"];
  var preventScrollHandler = null;
  if (options._userCanInterrupt) {
    var _iterator = _createForOfIteratorHelper(scrollEvents),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var eventType = _step.value;
        addEventListenerTo(scrollable, eventType, function () {
          isCancelled = true;
        }, {
          once: true
        });
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  } else {
    preventScrollHandler = preventDefault;
    var _iterator2 = _createForOfIteratorHelper(scrollEvents),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _eventType = _step2.value;
        addEventListenerTo(scrollable, _eventType, preventScrollHandler, {
          passive: false
        });
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }
  var promise = initiateScroll(options, function () {
    return isCancelled;
  });
  var thisScrollAction = {
    waitFor: function waitFor() {
      return promise;
    },
    cancel: cancelFn
  };
  var cleanup = function cleanup() {
    if (currentScrollAction.get(scrollable) === thisScrollAction) {
      deleteKey(currentScrollAction, scrollable);
    }
    if (preventScrollHandler) {
      for (var _i = 0, _scrollEvents = scrollEvents; _i < _scrollEvents.length; _i++) {
        var _eventType2 = _scrollEvents[_i];
        removeEventListenerFrom(scrollable, _eventType2, preventScrollHandler, {
          passive: false
        });
      }
    }
  };
  thisScrollAction.waitFor().then(cleanup)["catch"](cleanup);
  currentScrollAction.set(scrollable, thisScrollAction);
  return thisScrollAction;
};
var isValidScrollDirection = function isValidScrollDirection(direction) {
  return includes(SCROLL_DIRECTIONS, direction);
};
var mapScrollable = function mapScrollable(original, actualScrollable) {
  return mappedScrollables.set(original, actualScrollable);
};
var unmapScrollable = function unmapScrollable(original) {
  return deleteKey(mappedScrollables, original);
};
var getClientWidthNow = function getClientWidthNow(element) {
  return isScrollableBodyInQuirks(element) ? element.offsetWidth - getBorderWidth(element, S_LEFT) - getBorderWidth(element, S_RIGHT) : element[S_CLIENT_WIDTH];
};
var getClientHeightNow = function getClientHeightNow(element) {
  return isScrollableBodyInQuirks(element) ? element.offsetHeight - getBorderWidth(element, S_TOP) - getBorderWidth(element, S_BOTTOM) : element[S_CLIENT_HEIGHT];
};
var fetchMainContentElement = function () {
  var _ref2 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee() {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return init$5();
        case 2:
          return _context.abrupt("return", mainContentElement);
        case 3:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function fetchMainContentElement() {
    return _ref2.apply(this, arguments);
  };
}();
var tryGetMainScrollableElement = function tryGetMainScrollableElement() {
  return mainScrollableElement !== null && mainScrollableElement !== void 0 ? mainScrollableElement : null;
};
var fetchMainScrollableElement = function () {
  var _ref3 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee2() {
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return init$5();
        case 2:
          return _context2.abrupt("return", mainScrollableElement);
        case 3:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function fetchMainScrollableElement() {
    return _ref3.apply(this, arguments);
  };
}();
var getDefaultScrollingElement = function getDefaultScrollingElement() {
  var body = getBody();
  return _isScrollable(body) ? body : getDocScrollingElement() || body;
};
var fetchScrollableElement = function () {
  var _ref4 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee3(target) {
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          return _context3.abrupt("return", toScrollableOrMain(target, fetchMainScrollableElement));
        case 1:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function fetchScrollableElement(_x) {
    return _ref4.apply(this, arguments);
  };
}();
var IS_SCROLLABLE_CACHE_TIMEOUT = 1000;
var isScrollableCache = newXMap(function () {
  return newMap();
});
var mappedScrollables = newMap();
var currentScrollAction = newMap();
var DIFF_THRESHOLD = 5;
var arePositionsDifferent = function arePositionsDifferent(start, end) {
  return maxAbs(start.top - end.top, start.left - end.left) >= DIFF_THRESHOLD;
};
var toScrollableOrMain = function toScrollableOrMain(target, getMain) {
  if (isElement(target)) {
    return mappedScrollables.get(target) || target;
  }
  if (!target || target === getWindow() || target === getDoc()) {
    return getMain();
  }
  throw usageError("Unsupported scroll target");
};
var toScrollableOrDefault = function toScrollableOrDefault(scrollable) {
  return scrollable !== null && scrollable !== void 0 ? scrollable : getDefaultScrollingElement();
};
var getOptions$1 = function getOptions(to, options) {
  var _options$weCanInterru, _options$userCanInter;
  var scrollable = toScrollableOrDefault(options === null || options === void 0 ? void 0 : options.scrollable);
  var target = _getTargetCoordinates(scrollable, to);
  var altTarget = options !== null && options !== void 0 && options.altTarget ? _getTargetCoordinates(scrollable, options === null || options === void 0 ? void 0 : options.altTarget) : null;
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
var _getTargetCoordinates = function getTargetCoordinates(scrollable, target) {
  var docScrollingElement = getDocScrollingElement();
  if (isElement(target)) {
    if (scrollable === target || !scrollable.contains(target)) {
      throw usageError("Target must be a descendant of the scrollable one");
    }
    return {
      top: function top() {
        return scrollable[S_SCROLL_TOP] + getBoundingClientRect(target).top - (scrollable === docScrollingElement ? 0 : getBoundingClientRect(scrollable).top);
      },
      left: function left() {
        return scrollable[S_SCROLL_LEFT] + getBoundingClientRect(target).left - (scrollable === docScrollingElement ? 0 : getBoundingClientRect(scrollable).left);
      }
    };
  }
  if (isString(target)) {
    var targetEl = docQuerySelector(target);
    if (!targetEl) {
      throw usageError("No match for '".concat(target, "'"));
    }
    return _getTargetCoordinates(scrollable, targetEl);
  }
  if (!isObject(target) || !("top" in target || "left" in target)) {
    throw usageError("Invalid coordinates");
  }
  return target;
};
var getStartEndPosition = function () {
  var _ref5 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee4(options) {
    var applyOffset, scrollable, start, end;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return waitForMeasureTime();
        case 2:
          applyOffset = function applyOffset(position, offset) {
            position.top += (offset === null || offset === void 0 ? void 0 : offset.top) || 0;
            position.left += (offset === null || offset === void 0 ? void 0 : offset.left) || 0;
          };
          scrollable = options._scrollable;
          start = {
            top: scrollable[S_SCROLL_TOP],
            left: scrollable[S_SCROLL_LEFT]
          };
          end = getEndPosition(scrollable, start, options._target);
          applyOffset(end, options._offset);
          if (!arePositionsDifferent(start, end) && options._altTarget) {
            end = getEndPosition(scrollable, start, options._altTarget);
            applyOffset(end, options._altOffset);
          }
          return _context4.abrupt("return", {
            start: start,
            end: end
          });
        case 9:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function getStartEndPosition(_x2) {
    return _ref5.apply(this, arguments);
  };
}();
var getEndPosition = function getEndPosition(scrollable, startPosition, targetCoordinates) {
  var endPosition = copyObject(startPosition);
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
  var scrollH = scrollable[S_SCROLL_HEIGHT];
  var scrollW = scrollable[S_SCROLL_WIDTH];
  var clientH = getClientHeightNow(scrollable);
  var clientW = getClientWidthNow(scrollable);
  endPosition.top = min(scrollH - clientH, endPosition.top);
  endPosition.top = max(0, endPosition.top);
  endPosition.left = min(scrollW - clientW, endPosition.left);
  endPosition.left = max(0, endPosition.left);
  return endPosition;
};
var initiateScroll = function () {
  var _ref6 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee6(options, isCancelled) {
    var position, duration, scrollable, startTime, previousTimeStamp, currentPosition, _step3;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return getStartEndPosition(options);
        case 2:
          position = _context6.sent;
          duration = options._duration;
          scrollable = options._scrollable;
          currentPosition = position.start;
          _step3 = function () {
            var _ref7 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee5() {
              var timeStamp, elapsed, progress;
              return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                while (1) switch (_context5.prev = _context5.next) {
                  case 0:
                    _context5.next = 2;
                    return waitForMutateTime();
                  case 2:
                    _context5.next = 4;
                    return waitForMeasureTime();
                  case 4:
                    timeStamp = timeNow();
                    if (!isCancelled()) {
                      _context5.next = 7;
                      break;
                    }
                    throw currentPosition;
                  case 7:
                    if (startTime) {
                      _context5.next = 12;
                      break;
                    }
                    if (!(duration === 0 || !arePositionsDifferent(currentPosition, position.end))) {
                      _context5.next = 11;
                      break;
                    }
                    elScrollTo(scrollable, position.end);
                    return _context5.abrupt("return", position.end);
                  case 11:
                    startTime = timeStamp;
                  case 12:
                    if (!(startTime !== timeStamp && previousTimeStamp !== timeStamp)) {
                      _context5.next = 19;
                      break;
                    }
                    elapsed = timeStamp - startTime;
                    progress = easeInOutQuad(min(1, elapsed / duration));
                    currentPosition = {
                      top: position.start.top + (position.end.top - position.start.top) * progress,
                      left: position.start.left + (position.end.left - position.start.left) * progress
                    };
                    elScrollTo(scrollable, currentPosition);
                    if (!(progress === 1)) {
                      _context5.next = 19;
                      break;
                    }
                    return _context5.abrupt("return", currentPosition);
                  case 19:
                    previousTimeStamp = timeStamp;
                    return _context5.abrupt("return", _step3());
                  case 21:
                  case "end":
                    return _context5.stop();
                }
              }, _callee5);
            }));
            return function step() {
              return _ref7.apply(this, arguments);
            };
          }();
          return _context6.abrupt("return", _step3());
        case 8:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function initiateScroll(_x3, _x4) {
    return _ref6.apply(this, arguments);
  };
}();
var isScrollableBodyInQuirks = function isScrollableBodyInQuirks(element) {
  return element === getBody() && getDocScrollingElement() === null;
};
var getBorderWidth = function getBorderWidth(element, side) {
  return ceil(parseFloat(getComputedStylePropNow(element, "border-".concat(side))));
};
var mainContentElement;
var mainScrollableElement;
var initPromise$1 = null;
var init$5 = function init() {
  if (!initPromise$1) {
    initPromise$1 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee7() {
      var mainScrollableElementSelector, contentElement;
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            mainScrollableElementSelector = settings.mainScrollableElementSelector;
            _context7.next = 3;
            return waitForElementOrInteractive(function () {
              return mainScrollableElementSelector ? docQuerySelector(mainScrollableElementSelector) : getBody();
            });
          case 3:
            contentElement = _context7.sent;
            mainScrollableElement = getDefaultScrollingElement();
            mainContentElement = getBody();
            if (!contentElement) {
              logError(usageError("No match for '".concat(mainScrollableElementSelector, "'. ") + "Scroll tracking/capturing may not work as intended."));
            } else if (!isHTMLElement(contentElement)) {
              logWarn("mainScrollableElementSelector should point to an HTMLElement");
            } else if (contentElement !== mainContentElement) {
              mainScrollableElement = mainContentElement = contentElement;
            }
          case 7:
          case "end":
            return _context7.stop();
        }
      }, _callee7);
    }))();
  }
  return initPromise$1;
};
if (hasDOM()) {
  waitForInteractive().then(init$5);
}

var createOverlay = function () {
  var _ref = _asyncToGenerator(_regeneratorRuntime().mark(function _callee(userOptions) {
    var options, canReuse, _overlays$get2, existingOverlay, overlay, isPercentageHOffset, isPercentageVOffset, needsContentWrapping, parentEl;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return fetchOverlayOptions(userOptions);
        case 2:
          options = _context.sent;
          canReuse = !options._id;
          if (!canReuse) {
            _context.next = 11;
            break;
          }
          existingOverlay = (_overlays$get2 = overlays.get(options._parent)) === null || _overlays$get2 === void 0 ? void 0 : _overlays$get2.get(options._overlayKey);
          if (!existingOverlay) {
            _context.next = 11;
            break;
          }
          if (parentOf(existingOverlay)) {
            _context.next = 10;
            break;
          }
          _context.next = 10;
          return waitForMutateTime();
        case 10:
          return _context.abrupt("return", existingOverlay);
        case 11:
          overlay = createOnlyOverlay(options);
          if (canReuse) {
            overlays.sGet(options._parent).set(options._overlayKey, overlay);
          } else {
            overlay.id = options._id;
          }
          isPercentageHOffset = includes((options._style.left || "") + (options._style.right || ""), "%");
          isPercentageVOffset = includes((options._style.top || "") + (options._style.bottom || ""), "%");
          needsContentWrapping = false;
          parentEl = options._parent;
          if (isPercentageHOffset || isPercentageVOffset) {
            needsContentWrapping = isPercentageHOffset && _isScrollable(parentEl, {
              axis: "x"
            }) || isPercentageVOffset && _isScrollable(parentEl, {
              axis: "y"
            });
          }
          if (!needsContentWrapping) {
            _context.next = 26;
            break;
          }
          if (!settings.contentWrappingAllowed) {
            _context.next = 25;
            break;
          }
          _context.next = 22;
          return wrapScrollingContent(parentEl);
        case 22:
          parentEl = _context.sent;
          _context.next = 26;
          break;
        case 25:
          logWarn("Percentage offset view trigger with scrolling root requires contentWrappingAllowed");
        case 26:
          if (options._style.position === S_ABSOLUTE) {
            addClasses(parentEl, prefixName("overlay-container"));
          }
          _context.next = 29;
          return moveElement(overlay, {
            to: parentEl
          });
        case 29:
          return _context.abrupt("return", overlay);
        case 30:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function createOverlay(_x) {
    return _ref.apply(this, arguments);
  };
}();
var overlays = newXWeakMap(function () {
  return newMap();
});
var fetchOverlayOptions = function () {
  var _ref2 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee2(userOptions) {
    var _userOptions$data2, _userOptions$id2;
    var style, data, parentEl;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          style = getCssProperties(userOptions === null || userOptions === void 0 ? void 0 : userOptions.style);
          data = (_userOptions$data2 = userOptions === null || userOptions === void 0 ? void 0 : userOptions.data) !== null && _userOptions$data2 !== void 0 ? _userOptions$data2 : {};
          _context2.next = 4;
          return fetchParent(userOptions === null || userOptions === void 0 ? void 0 : userOptions.parent, style.position);
        case 4:
          parentEl = _context2.sent;
          return _context2.abrupt("return", {
            _parent: parentEl,
            _id: (_userOptions$id2 = userOptions === null || userOptions === void 0 ? void 0 : userOptions.id) !== null && _userOptions$id2 !== void 0 ? _userOptions$id2 : "",
            _style: style,
            _data: data,
            _overlayKey: getOverlayKey(style, data)
          });
        case 6:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function fetchOverlayOptions(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
var getOverlayKey = function getOverlayKey(style, data) {
  return objToStrKey(style) + "|" + objToStrKey(data);
};
var getCssProperties = function getCssProperties(style) {
  var finalCssProperties = merge({
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
var fetchParent = function () {
  var _ref3 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee3(userSuppliedParent, position) {
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          if (!(userSuppliedParent !== null && userSuppliedParent !== void 0)) {
            _context3.next = 4;
            break;
          }
          _context3.t0 = userSuppliedParent;
          _context3.next = 14;
          break;
        case 4:
          if (!(position === S_FIXED)) {
            _context3.next = 10;
            break;
          }
          _context3.next = 7;
          return waitForElement(getBody);
        case 7:
          _context3.t1 = _context3.sent;
          _context3.next = 13;
          break;
        case 10:
          _context3.next = 12;
          return fetchMainContentElement();
        case 12:
          _context3.t1 = _context3.sent;
        case 13:
          _context3.t0 = _context3.t1;
        case 14:
          return _context3.abrupt("return", _context3.t0);
        case 15:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function fetchParent(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();
var createOnlyOverlay = function createOnlyOverlay(options) {
  var overlay = createElement("div");
  addClassesNow(overlay, prefixName("overlay"));
  var data = options._data;
  var _iterator = _createForOfIteratorHelper(keysOf(data)),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var attr = _step.value;
      setDataNow(overlay, camelToKebabCase(attr), data[attr]);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  var style = options._style;
  var _iterator2 = _createForOfIteratorHelper(keysOf(style)),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var prop = _step2.value;
      setStylePropNow(overlay, prop, style[prop]);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return overlay;
};

var getEntryContentBox = function getEntryContentBox(entry) {
  var size = entry.contentBoxSize;
  if (size) {
    return getSizeFromInlineBlock(size);
  }
  var rect = entry.contentRect;
  return _defineProperty(_defineProperty({}, S_WIDTH, rect[S_WIDTH]), S_HEIGHT, rect[S_HEIGHT]);
};
var getEntryBorderBox = function getEntryBorderBox(entry) {
  var fallbackToContent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var size = entry.borderBoxSize;
  if (size) {
    return getSizeFromInlineBlock(size);
  } else if (fallbackToContent) {
    return getEntryContentBox(entry);
  }
  return _defineProperty(_defineProperty({}, S_WIDTH, NaN), S_HEIGHT, NaN);
};
var isValidBox = function isValidBox(box) {
  return includes(ALL_BOXES, box);
};
var isValidDimension = function isValidDimension(dimension) {
  return includes(ALL_DIMENSIONS, dimension);
};
var tryGetViewportOverlay = function tryGetViewportOverlay() {
  return viewportOverlay !== null && viewportOverlay !== void 0 ? viewportOverlay : null;
};
var fetchViewportOverlay = function () {
  var _ref3 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee() {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return init$4();
        case 2:
          return _context.abrupt("return", viewportOverlay);
        case 3:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function fetchViewportOverlay() {
    return _ref3.apply(this, arguments);
  };
}();
var fetchViewportSize = function () {
  var _ref4 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee2() {
    var _MH$getDocScrollingEl;
    var realtime,
      root,
      _args2 = arguments;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          realtime = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : false;
          if (realtime) {
            _context2.next = 4;
            break;
          }
          _context2.next = 4;
          return waitForMeasureTime();
        case 4:
          root = hasDOM() ? (_MH$getDocScrollingEl = getDocScrollingElement()) !== null && _MH$getDocScrollingEl !== void 0 ? _MH$getDocScrollingEl : getBody() : null;
          return _context2.abrupt("return", _defineProperty(_defineProperty({}, S_WIDTH, (root === null || root === void 0 ? void 0 : root.clientWidth) || 0), S_HEIGHT, (root === null || root === void 0 ? void 0 : root.clientHeight) || 0));
        case 6:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function fetchViewportSize() {
    return _ref4.apply(this, arguments);
  };
}();
var S_INLINE_SIZE = "inlineSize";
var S_BLOCK_SIZE = "blockSize";
var ALL_BOXES = ["content", "border"];
var ALL_DIMENSIONS = [S_WIDTH, S_HEIGHT];
var getSizeFromInlineBlock = function getSizeFromInlineBlock(size) {
  if (isIterableObject(size)) {
    return _defineProperty(_defineProperty({}, S_WIDTH, size[0][S_INLINE_SIZE]), S_HEIGHT, size[0][S_BLOCK_SIZE]);
  }
  return _defineProperty(_defineProperty({}, S_WIDTH, size[S_INLINE_SIZE]), S_HEIGHT, size[S_BLOCK_SIZE]);
};
var viewportOverlay;
var initPromise = null;
var init$4 = function init() {
  if (!initPromise) {
    initPromise = _asyncToGenerator(_regeneratorRuntime().mark(function _callee3() {
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return createOverlay({
              id: prefixName("vp-ovrl"),
              style: _defineProperty(_defineProperty({
                position: "fixed"
              }, S_WIDTH, "100vw"), S_HEIGHT, "100vh")
            });
          case 2:
            viewportOverlay = _context3.sent;
          case 3:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }))();
  }
  return initPromise;
};

var XResizeObserver = _createClass(function XResizeObserver(callback, debounceWindow) {
  var _this = this;
  _classCallCheck(this, XResizeObserver);
  var buffer = newMap();
  var targetsToSkip = newWeakMap();
  var observedTargets = newWeakSet();
  debounceWindow = debounceWindow || 0;
  var timer = null;
  var resizeHandler = function resizeHandler(entries) {
    var _iterator = _createForOfIteratorHelper(entries),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var entry = _step.value;
        var target = targetOf(entry);
        var skipNum = targetsToSkip.get(target);
        if (skipNum !== undefined) {
          if (skipNum === 2) {
            targetsToSkip.set(target, 1);
          } else {
            if (skipNum !== 1) {
              logError(bugError("# targetsToSkip is ".concat(skipNum)));
            }
            deleteKey(targetsToSkip, target);
          }
          continue;
        }
        buffer.set(target, entry);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    if (!timer && sizeOf(buffer)) {
      timer = setTimer(function () {
        if (sizeOf(buffer)) {
          callback(arrayFrom(buffer.values()), _this);
          buffer.clear();
        }
        timer = null;
      }, debounceWindow);
    }
  };
  var borderObserver = newResizeObserver(resizeHandler);
  var contentObserver = newResizeObserver(resizeHandler);
  if (!borderObserver || !contentObserver) {
    logWarn("This browser does not support ResizeObserver. Some features won't work.");
  }
  var observeTarget = function observeTarget(target) {
    observedTargets.add(target);
    borderObserver === null || borderObserver === void 0 || borderObserver.observe(target, {
      box: "border-box"
    });
    contentObserver === null || contentObserver === void 0 || contentObserver.observe(target);
  };
  this.observe = function () {
    for (var _len = arguments.length, targets = new Array(_len), _key = 0; _key < _len; _key++) {
      targets[_key] = arguments[_key];
    }
    for (var _i = 0, _targets = targets; _i < _targets.length; _i++) {
      var target = _targets[_i];
      observeTarget(target);
    }
  };
  this.observeLater = function () {
    for (var _len2 = arguments.length, targets = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      targets[_key2] = arguments[_key2];
    }
    for (var _i2 = 0, _targets2 = targets; _i2 < _targets2.length; _i2++) {
      var target = _targets2[_i2];
      if (observedTargets.has(target)) {
        continue;
      }
      targetsToSkip.set(target, 2);
      observeTarget(target);
    }
  };
  this.unobserve = function () {
    for (var _len3 = arguments.length, targets = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      targets[_key3] = arguments[_key3];
    }
    for (var _i3 = 0, _targets3 = targets; _i3 < _targets3.length; _i3++) {
      var target = _targets3[_i3];
      deleteKey(observedTargets, target);
      borderObserver === null || borderObserver === void 0 || borderObserver.unobserve(target);
      contentObserver === null || contentObserver === void 0 || contentObserver.unobserve(target);
    }
  };
  this.disconnect = function () {
    observedTargets = newWeakSet();
    borderObserver === null || borderObserver === void 0 || borderObserver.disconnect();
    contentObserver === null || contentObserver === void 0 || contentObserver.disconnect();
  };
});

var SizeWatcher = function () {
  function SizeWatcher(config, key) {
    _classCallCheck(this, SizeWatcher);
    if (key !== CONSTRUCTOR_KEY$4) {
      throw illegalConstructorError("SizeWatcher.create");
    }
    var allSizeData = newWeakMap();
    var allCallbacks = newXWeakMap(function () {
      return newMap();
    });
    var resizeHandler = function resizeHandler(entries) {
      var _iterator = _createForOfIteratorHelper(entries),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var entry = _step.value;
          processEntry(entry);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    };
    var xObserver = new XResizeObserver(resizeHandler);
    var fetchCurrentSize = function () {
      var _ref = _asyncToGenerator(_regeneratorRuntime().mark(function _callee(target) {
        var element, sizeData;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return fetchElement$1(target);
            case 2:
              element = _context.sent;
              sizeData = allSizeData.get(element);
              if (!sizeData) {
                _context.next = 6;
                break;
              }
              return _context.abrupt("return", copyObject(sizeData));
            case 6:
              return _context.abrupt("return", newPromise(function (resolve) {
                var observer = newResizeObserver(function (entries) {
                  var sizeData = getSizeData(entries[0]);
                  observer === null || observer === void 0 || observer.disconnect();
                  resolve(sizeData);
                });
                if (observer) {
                  observer.observe(element);
                } else {
                  resolve({
                    border: _defineProperty(_defineProperty({}, S_WIDTH, 0), S_HEIGHT, 0),
                    content: _defineProperty(_defineProperty({}, S_WIDTH, 0), S_HEIGHT, 0)
                  });
                }
              }));
            case 7:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function fetchCurrentSize(_x) {
        return _ref.apply(this, arguments);
      };
    }();
    var fetchOptions = function () {
      var _ref2 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee2(options) {
        var _options$box, _options$dimension, _options$MC$S_DEBOUNC;
        var box, dimension;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              box = (_options$box = options.box) !== null && _options$box !== void 0 ? _options$box : null;
              if (!(box && !isValidBox(box))) {
                _context2.next = 3;
                break;
              }
              throw usageError("Unknown box type: '".concat(box, "'"));
            case 3:
              dimension = (_options$dimension = options.dimension) !== null && _options$dimension !== void 0 ? _options$dimension : null;
              if (!(dimension && !isValidDimension(dimension))) {
                _context2.next = 6;
                break;
              }
              throw usageError("Unknown dimension: '".concat(dimension, "'"));
            case 6:
              _context2.next = 8;
              return fetchElement$1(targetOf(options));
            case 8:
              _context2.t0 = _context2.sent;
              _context2.t1 = box;
              _context2.t2 = dimension;
              _context2.t3 = toNonNegNum(options.threshold, config._resizeThreshold) || 1;
              _context2.t4 = (_options$MC$S_DEBOUNC = options[S_DEBOUNCE_WINDOW]) !== null && _options$MC$S_DEBOUNC !== void 0 ? _options$MC$S_DEBOUNC : config._debounceWindow;
              return _context2.abrupt("return", {
                _element: _context2.t0,
                _box: _context2.t1,
                _dimension: _context2.t2,
                _threshold: _context2.t3,
                _debounceWindow: _context2.t4
              });
            case 14:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      return function fetchOptions(_x2) {
        return _ref2.apply(this, arguments);
      };
    }();
    var createCallback = function createCallback(handler, options) {
      var _allCallbacks$get;
      var element = options._element;
      remove((_allCallbacks$get = allCallbacks.get(element)) === null || _allCallbacks$get === void 0 || (_allCallbacks$get = _allCallbacks$get.get(handler)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get._callback);
      var callback = _wrapCallback(handler, options._debounceWindow);
      callback.onRemove(function () {
        deleteHandler(handler, options);
      });
      var entry = {
        _callback: callback,
        _options: options
      };
      allCallbacks.sGet(element).set(handler, entry);
      return entry;
    };
    var setupOnResize = function () {
      var _ref3 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee3(handler, userOptions) {
        var options, element, entry, callback, sizeData;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return fetchOptions(userOptions || {});
            case 2:
              options = _context3.sent;
              element = options._element;
              entry = createCallback(handler, options);
              callback = entry._callback;
              _context3.next = 8;
              return fetchCurrentSize(element);
            case 8:
              sizeData = _context3.sent;
              if (!callback.isRemoved()) {
                _context3.next = 11;
                break;
              }
              return _context3.abrupt("return");
            case 11:
              entry._data = sizeData;
              allSizeData.set(element, sizeData);
              xObserver.observeLater(element);
              if (userOptions !== null && userOptions !== void 0 && userOptions.skipInitial) {
                _context3.next = 18;
                break;
              }
              _context3.next = 18;
              return invokeCallback$4(_wrapCallback(handler), element, sizeData);
            case 18:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      return function setupOnResize(_x3, _x4) {
        return _ref3.apply(this, arguments);
      };
    }();
    var removeOnResize = function () {
      var _ref4 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee4(handler, target) {
        var _allCallbacks$get2;
        var options, element, currEntry;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return fetchOptions({
                target: target
              });
            case 2:
              options = _context4.sent;
              element = options._element;
              currEntry = (_allCallbacks$get2 = allCallbacks.get(element)) === null || _allCallbacks$get2 === void 0 ? void 0 : _allCallbacks$get2.get(handler);
              if (currEntry) {
                remove(currEntry._callback);
                if (handler === setSizeCssProps) {
                  setSizeCssProps(element, null);
                }
              }
            case 6:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      return function removeOnResize(_x5, _x6) {
        return _ref4.apply(this, arguments);
      };
    }();
    var deleteHandler = function deleteHandler(handler, options) {
      var element = options._element;
      deleteKey(allCallbacks.get(element), handler);
      allCallbacks.prune(element);
      if (!allCallbacks.has(element)) {
        xObserver.unobserve(element);
        deleteKey(allSizeData, element);
      }
    };
    var processEntry = function processEntry(entry) {
      var _allCallbacks$get3;
      var element = targetOf(entry);
      var latestData = getSizeData(entry);
      allSizeData.set(element, latestData);
      var _iterator2 = _createForOfIteratorHelper(((_allCallbacks$get3 = allCallbacks.get(element)) === null || _allCallbacks$get3 === void 0 ? void 0 : _allCallbacks$get3.values()) || []),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _entry = _step2.value;
          var thresholdsExceeded = hasExceededThreshold$1(_entry._options, latestData, _entry._data);
          if (!thresholdsExceeded) {
            continue;
          }
          _entry._data = latestData;
          invokeCallback$4(_entry._callback, element, latestData);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    };
    this.fetchCurrentSize = fetchCurrentSize;
    this.trackSize = function () {
      var _ref5 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee5(handler, options) {
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              if (!handler) {
                handler = setSizeCssProps;
              }
              return _context5.abrupt("return", setupOnResize(handler, options));
            case 2:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      }));
      return function (_x7, _x8) {
        return _ref5.apply(this, arguments);
      };
    }();
    this.noTrackSize = function (handler, target) {
      if (!handler) {
        handler = setSizeCssProps;
      }
      removeOnResize(handler, target);
    };
    this.onResize = setupOnResize;
    this.offResize = function (handler, target) {
      removeOnResize(handler, target);
    };
  }
  return _createClass(SizeWatcher, null, [{
    key: "create",
    value: function create() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return new SizeWatcher(getConfig$4(config), CONSTRUCTOR_KEY$4);
    }
  }, {
    key: "reuse",
    value: function reuse() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var myConfig = getConfig$4(config);
      var configStrKey = objToStrKey(myConfig);
      var instance = instances$6.get(configStrKey);
      if (!instance) {
        instance = new SizeWatcher(myConfig, CONSTRUCTOR_KEY$4);
        instances$6.set(configStrKey, instance);
      }
      return instance;
    }
  }]);
}();
var CONSTRUCTOR_KEY$4 = SYMBOL();
var instances$6 = newMap();
var getConfig$4 = function getConfig(config) {
  return {
    _debounceWindow: toNonNegNum(config[S_DEBOUNCE_WINDOW], 75),
    _resizeThreshold: toNonNegNum(config.resizeThreshold, 50) || 1
  };
};
var hasExceededThreshold$1 = function hasExceededThreshold(options, latestData, lastThresholdData) {
  if (!lastThresholdData) {
    return false;
  }
  var box, dim;
  for (box in latestData) {
    if (options._box && options._box !== box) {
      continue;
    }
    for (dim in latestData[box]) {
      if (options._dimension && options._dimension !== dim) {
        continue;
      }
      var diff = abs(latestData[box][dim] - lastThresholdData[box][dim]);
      if (diff >= options._threshold) {
        return true;
      }
    }
  }
  return false;
};
var getSizeData = function getSizeData(entry) {
  var borderBox = getEntryBorderBox(entry, true);
  var contentBox = getEntryContentBox(entry);
  return {
    border: borderBox,
    content: contentBox
  };
};
var setSizeCssProps = function setSizeCssProps(element, sizeData) {
  var prefix = "";
  if (element === tryGetViewportOverlay()) {
    element = getDocElement();
    prefix = "window-";
  }
  var props = {
    borderWidth: sizeData === null || sizeData === void 0 ? void 0 : sizeData.border[S_WIDTH],
    borderHeight: sizeData === null || sizeData === void 0 ? void 0 : sizeData.border[S_HEIGHT],
    contentWidth: sizeData === null || sizeData === void 0 ? void 0 : sizeData.content[S_WIDTH],
    contentHeight: sizeData === null || sizeData === void 0 ? void 0 : sizeData.content[S_HEIGHT]
  };
  setNumericStyleProps(element, props, {
    _prefix: prefix
  });
};
var fetchElement$1 = function () {
  var _ref6 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee6(target) {
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          if (!isElement(target)) {
            _context6.next = 2;
            break;
          }
          return _context6.abrupt("return", target);
        case 2:
          if (!(!target || target === getWindow())) {
            _context6.next = 4;
            break;
          }
          return _context6.abrupt("return", fetchViewportOverlay());
        case 4:
          if (!(target === getDoc())) {
            _context6.next = 6;
            break;
          }
          return _context6.abrupt("return", getDocElement());
        case 6:
          throw usageError("Unsupported resize target");
        case 7:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function fetchElement(_x9) {
    return _ref6.apply(this, arguments);
  };
}();
var invokeCallback$4 = function invokeCallback(callback, element, sizeData) {
  return callback.invoke(element, copyObject(sizeData))["catch"](logError);
};

var LayoutWatcher = function () {
  function LayoutWatcher(config, key) {
    _classCallCheck(this, LayoutWatcher);
    if (key !== CONSTRUCTOR_KEY$3) {
      throw illegalConstructorError("LayoutWatcher.create");
    }
    var nonIntersectingBitmask = 0;
    var currentLayoutData = {
      device: null,
      aspectRatio: null
    };
    var allCallbacks = newMap();
    var fetchCurrentLayout = function () {
      var _ref = _asyncToGenerator(_regeneratorRuntime().mark(function _callee() {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return readyPromise;
            case 2:
              return _context.abrupt("return", copyObject(currentLayoutData));
            case 3:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function fetchCurrentLayout() {
        return _ref.apply(this, arguments);
      };
    }();
    var setupOverlays = function () {
      var _ref2 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee2() {
        var _yield$createOverlays, root, overlays;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return createOverlays(config._root, config._deviceBreakpoints, config._aspectRatioBreakpoints);
            case 2:
              _yield$createOverlays = _context2.sent;
              root = _yield$createOverlays.root;
              overlays = _yield$createOverlays.overlays;
              return _context2.abrupt("return", newPromise(function (resolve) {
                var isReady = false;
                var intersectionHandler = function intersectionHandler(entries) {
                  var numEntries = lengthOf(entries);
                  if (!isReady) {
                    if (numEntries < NUM_LAYOUTS) {
                      logWarn(bugError("Got IntersectionObserver ".concat(numEntries, ", ") + "expected >= ".concat(NUM_LAYOUTS)));
                    }
                  }
                  var _iterator = _createForOfIteratorHelper(entries),
                    _step;
                  try {
                    for (_iterator.s(); !(_step = _iterator.n()).done;) {
                      var entry = _step.value;
                      nonIntersectingBitmask = getNonIntersecting(nonIntersectingBitmask, entry);
                    }
                  } catch (err) {
                    _iterator.e(err);
                  } finally {
                    _iterator.f();
                  }
                  processLayoutChange(!isReady);
                  isReady = true;
                  resolve();
                };
                var observeOptions = {
                  root: root,
                  rootMargin: "5px 0% 5px -100%"
                };
                var observer = newIntersectionObserver(intersectionHandler, observeOptions);
                var _iterator2 = _createForOfIteratorHelper(overlays),
                  _step2;
                try {
                  for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                    var triggerOverlay = _step2.value;
                    observer.observe(triggerOverlay);
                  }
                } catch (err) {
                  _iterator2.e(err);
                } finally {
                  _iterator2.f();
                }
              }));
            case 6:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      return function setupOverlays() {
        return _ref2.apply(this, arguments);
      };
    }();
    var createCallback = function createCallback(handler, layoutBitmask) {
      var _allCallbacks$get;
      remove((_allCallbacks$get = allCallbacks.get(handler)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get._callback);
      var callback = _wrapCallback(handler);
      callback.onRemove(function () {
        deleteHandler(handler);
      });
      allCallbacks.set(handler, {
        _callback: callback,
        _layoutBitmask: layoutBitmask
      });
      return callback;
    };
    var setupOnLayout = function () {
      var _ref3 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee3(handler, options) {
        var layoutBitmask, callback, layoutData;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              layoutBitmask = getLayoutBitmask(options);
              callback = createCallback(handler, layoutBitmask);
              if (!(options !== null && options !== void 0 && options.skipInitial)) {
                _context3.next = 4;
                break;
              }
              return _context3.abrupt("return");
            case 4:
              _context3.next = 6;
              return fetchCurrentLayout();
            case 6:
              layoutData = _context3.sent;
              if (!(!callback.isRemoved() && changeMatches(layoutBitmask, layoutData, null))) {
                _context3.next = 11;
                break;
              }
              _context3.next = 11;
              return invokeCallback$3(callback, layoutData);
            case 11:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      return function setupOnLayout(_x, _x2) {
        return _ref3.apply(this, arguments);
      };
    }();
    var deleteHandler = function deleteHandler(handler) {
      deleteKey(allCallbacks, handler);
    };
    var processLayoutChange = function processLayoutChange(skipCallbacks) {
      var deviceBit = floor(log2(nonIntersectingBitmask & ORDERED_DEVICES.bitmask));
      var aspectRatioBit = floor(log2(nonIntersectingBitmask & ORDERED_ASPECTR.bitmask));
      var layoutData = {
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
        var _iterator3 = _createForOfIteratorHelper(allCallbacks.values()),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var entry = _step3.value;
            var layoutBitmask = entry._layoutBitmask;
            if (!changeMatches(layoutBitmask, layoutData, currentLayoutData)) {
              continue;
            }
            invokeCallback$3(entry._callback, layoutData);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
      currentLayoutData = layoutData;
    };
    var readyPromise = setupOverlays();
    this.fetchCurrentLayout = fetchCurrentLayout;
    this.onLayout = setupOnLayout;
    this.offLayout = function (handler) {
      var _allCallbacks$get2;
      remove((_allCallbacks$get2 = allCallbacks.get(handler)) === null || _allCallbacks$get2 === void 0 ? void 0 : _allCallbacks$get2._callback);
    };
  }
  return _createClass(LayoutWatcher, null, [{
    key: "create",
    value: function create() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return new LayoutWatcher(getConfig$3(config), CONSTRUCTOR_KEY$3);
    }
  }, {
    key: "reuse",
    value: function reuse() {
      var _instances$get;
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var myConfig = getConfig$3(config);
      var configStrKey = objToStrKey(omitKeys(myConfig, {
        _root: null
      }));
      var instance = (_instances$get = instances$5.get(myConfig._root)) === null || _instances$get === void 0 ? void 0 : _instances$get.get(configStrKey);
      if (!instance) {
        instance = new LayoutWatcher(myConfig, CONSTRUCTOR_KEY$3);
        instances$5.sGet(myConfig._root).set(configStrKey, instance);
      }
      return instance;
    }
  }]);
}();
var CONSTRUCTOR_KEY$3 = SYMBOL();
var instances$5 = newXMap(function () {
  return newMap();
});
var VAR_BORDER_HEIGHT = prefixCssJsVar("border-height");
var PREFIX_DEVICE = prefixName("device");
var PREFIX_ASPECTR = prefixName("aspect-ratio");
var getConfig$3 = function getConfig(config) {
  var deviceBreakpoints = copyObject(settings.deviceBreakpoints);
  if (config !== null && config !== void 0 && config.deviceBreakpoints) {
    _copyExistingKeys(config.deviceBreakpoints, deviceBreakpoints);
  }
  var aspectRatioBreakpoints = copyObject(settings.aspectRatioBreakpoints);
  if (config !== null && config !== void 0 && config.aspectRatioBreakpoints) {
    _copyExistingKeys(config.aspectRatioBreakpoints, aspectRatioBreakpoints);
  }
  return {
    _root: (config === null || config === void 0 ? void 0 : config.root) || null,
    _deviceBreakpoints: deviceBreakpoints,
    _aspectRatioBreakpoints: aspectRatioBreakpoints
  };
};
var createOverlays = function () {
  var _ref4 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee4(root, deviceBreakpoints, aspectRatioBreakpoints) {
    var overlayPromises, overlayParent, device, parentHeightCss, aspectRatio, overlays;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          overlayPromises = [];
          if (!root) {
            _context4.next = 5;
            break;
          }
          overlayParent = root;
          _context4.next = 8;
          break;
        case 5:
          _context4.next = 7;
          return createOverlay({
            style: _defineProperty({
              position: "fixed"
            }, S_WIDTH, "100vw")
          });
        case 7:
          overlayParent = _context4.sent;
        case 8:
          for (device in deviceBreakpoints) {
            overlayPromises.push(createOverlay({
              parent: overlayParent,
              style: _defineProperty({
                position: "absolute"
              }, S_WIDTH, deviceBreakpoints[device] + "px"),
              data: _defineProperty({}, PREFIX_DEVICE, device)
            }));
          }
          parentHeightCss = root ? "var(".concat(VAR_BORDER_HEIGHT, ", 0) * 1px") : "100vh";
          if (root) {
            SizeWatcher.reuse().trackSize(null, {
              target: root
            });
          }
          for (aspectRatio in aspectRatioBreakpoints) {
            overlayPromises.push(createOverlay({
              parent: overlayParent,
              style: _defineProperty({
                position: "absolute"
              }, S_WIDTH, "calc(".concat(aspectRatioBreakpoints[aspectRatio], " ") + "* ".concat(parentHeightCss, ")")),
              data: _defineProperty({}, PREFIX_ASPECTR, aspectRatio)
            }));
          }
          _context4.next = 14;
          return promiseAll(overlayPromises);
        case 14:
          overlays = _context4.sent;
          return _context4.abrupt("return", {
            root: overlayParent,
            overlays: overlays
          });
        case 16:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function createOverlays(_x3, _x4, _x5) {
    return _ref4.apply(this, arguments);
  };
}();
var getOverlayLayout = function getOverlayLayout(overlay) {
  var layout = getData(overlay, PREFIX_DEVICE) || getData(overlay, PREFIX_ASPECTR);
  if (layout && (ORDERED_DEVICES.has(layout) || ORDERED_ASPECTR.has(layout))) {
    return layout;
  } else {
    logError(bugError("No device or aspectRatio data attribute"));
    return null;
  }
};
var changeMatches = function changeMatches(layoutBitmask, thisLayoutData, prevLayoutData) {
  if ((prevLayoutData === null || prevLayoutData === void 0 ? void 0 : prevLayoutData.device) !== thisLayoutData.device && (!thisLayoutData.device || ORDERED_DEVICES.bit[thisLayoutData.device] & layoutBitmask)) {
    return true;
  }
  if ((prevLayoutData === null || prevLayoutData === void 0 ? void 0 : prevLayoutData.aspectRatio) !== thisLayoutData.aspectRatio && (!thisLayoutData.aspectRatio || ORDERED_ASPECTR.bit[thisLayoutData.aspectRatio] & layoutBitmask)) {
    return true;
  }
  return false;
};
var getNonIntersecting = function getNonIntersecting(nonIntersectingBitmask, entry) {
  var target = targetOf(entry);
  if (!isHTMLElement(target)) {
    logError(bugError("IntersectionObserver called us with '".concat(typeOrClassOf(target), "'")));
    return nonIntersectingBitmask;
  }
  var layout = getOverlayLayout(target);
  var bit = 0;
  if (!layout) ; else if (ORDERED_DEVICES.has(layout)) {
    bit = ORDERED_DEVICES.bit[layout];
  } else if (ORDERED_ASPECTR.has(layout)) {
    bit = ORDERED_ASPECTR.bit[layout];
  } else {
    logError(bugError("Unknown device or aspectRatio data attribute: ".concat(layout)));
  }
  if (entry.isIntersecting) {
    nonIntersectingBitmask &= ~bit;
  } else {
    nonIntersectingBitmask |= bit;
  }
  return nonIntersectingBitmask;
};
var invokeCallback$3 = function invokeCallback(callback, layoutData) {
  return callback.invoke(copyObject(layoutData))["catch"](logError);
};

var isValidPointerAction = function isValidPointerAction(action) {
  return includes(POINTER_ACTIONS, action);
};
var POINTER_ACTIONS = [S_CLICK, S_HOVER, S_PRESS];

var PointerWatcher = function () {
  function PointerWatcher(config, key) {
    _classCallCheck(this, PointerWatcher);
    if (key !== CONSTRUCTOR_KEY$2) {
      throw illegalConstructorError("PointerWatcher.create");
    }
    var allCallbacks = newXWeakMap(function () {
      return newMap();
    });
    var createCallback = function createCallback(target, handler) {
      var _allCallbacks$get;
      remove((_allCallbacks$get = allCallbacks.get(target)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get.get(handler));
      var callback = _wrapCallback(handler);
      callback.onRemove(function () {
        deleteKey(allCallbacks.get(target), handler);
      });
      allCallbacks.sGet(target).set(handler, callback);
      return callback;
    };
    var setupOnPointer = function () {
      var _ref = _asyncToGenerator(_regeneratorRuntime().mark(function _callee(target, startHandler, endHandler, userOptions) {
        var options, startCallback, endCallback, _iterator, _step, action;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              options = getOptions(config, userOptions);
              startCallback = createCallback(target, startHandler);
              endCallback = endHandler && endHandler !== startHandler ? createCallback(target, endHandler) : startCallback;
              _iterator = _createForOfIteratorHelper(options._actions);
              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  action = _step.value;
                  listenerSetupFn[action](target, startCallback, endCallback, options);
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
            case 5:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function setupOnPointer(_x, _x2, _x3, _x4) {
        return _ref.apply(this, arguments);
      };
    }();
    this.onPointer = setupOnPointer;
    this.offPointer = function (target, startHandler, endHandler) {
      var entry = allCallbacks.get(target);
      remove(entry === null || entry === void 0 ? void 0 : entry.get(startHandler));
      if (endHandler) {
        remove(entry === null || entry === void 0 ? void 0 : entry.get(endHandler));
      }
    };
  }
  return _createClass(PointerWatcher, null, [{
    key: "create",
    value: function create() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return new PointerWatcher(getConfig$2(config), CONSTRUCTOR_KEY$2);
    }
  }, {
    key: "reuse",
    value: function reuse() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var myConfig = getConfig$2(config);
      var configStrKey = objToStrKey(myConfig);
      var instance = instances$4.get(configStrKey);
      if (!instance) {
        instance = new PointerWatcher(myConfig, CONSTRUCTOR_KEY$2);
        instances$4.set(configStrKey, instance);
      }
      return instance;
    }
  }]);
}();
var CONSTRUCTOR_KEY$2 = SYMBOL();
var instances$4 = newMap();
var getConfig$2 = function getConfig(config) {
  var _config$preventDefaul, _config$preventSelect;
  return {
    _preventDefault: (_config$preventDefaul = config === null || config === void 0 ? void 0 : config.preventDefault) !== null && _config$preventDefaul !== void 0 ? _config$preventDefaul : false,
    _preventSelect: (_config$preventSelect = config === null || config === void 0 ? void 0 : config.preventSelect) !== null && _config$preventSelect !== void 0 ? _config$preventSelect : true
  };
};
var getOptions = function getOptions(config, options) {
  var _options$preventDefau, _options$preventSelec;
  return {
    _actions: validateStrList("actions", options === null || options === void 0 ? void 0 : options.actions, isValidPointerAction) || POINTER_ACTIONS,
    _preventDefault: (_options$preventDefau = options === null || options === void 0 ? void 0 : options.preventDefault) !== null && _options$preventDefau !== void 0 ? _options$preventDefau : config._preventDefault,
    _preventSelect: (_options$preventSelec = options === null || options === void 0 ? void 0 : options.preventSelect) !== null && _options$preventSelec !== void 0 ? _options$preventSelec : config._preventSelect
  };
};
var setupClickListener = function setupClickListener(target, startCallback, endCallback, options) {
  var toggleState = false;
  var wrapper = function wrapper(event) {
    if (options._preventDefault) {
      preventDefault(event);
    }
    toggleState = !toggleState;
    var data = {
      action: S_CLICK,
      state: toggleState ? "ON" : "OFF"
    };
    invokeCallback$2(toggleState ? startCallback : endCallback, target, data, event);
  };
  addEventListenerTo(target, S_CLICK, wrapper);
  var remove = function remove() {
    return removeEventListenerFrom(target, S_CLICK, wrapper);
  };
  startCallback.onRemove(remove);
  endCallback.onRemove(remove);
};
var setupPointerListeners = function setupPointerListeners(action, target, startCallback, endCallback, options) {
  var startEventSuff = action === S_HOVER ? "enter" : "down";
  var endEventSuff = action === S_HOVER ? "leave" : "up";
  var startEvent = S_POINTER + startEventSuff;
  var endEvent = S_POINTER + endEventSuff;
  var wrapper = function wrapper(event, callback) {
    if (options._preventDefault) {
      preventDefault(event);
    }
    var data = {
      action: action,
      state: strReplace(event.type, /pointer|mouse/, "") === startEventSuff ? "ON" : "OFF"
    };
    invokeCallback$2(callback, target, data, event);
  };
  var startListener = function startListener(event) {
    return wrapper(event, startCallback);
  };
  var endListener = function endListener(event) {
    return wrapper(event, endCallback);
  };
  addEventListenerTo(target, startEvent, startListener);
  addEventListenerTo(target, endEvent, endListener);
  if (options._preventSelect) {
    preventSelect(target);
  }
  startCallback.onRemove(function () {
    undoPreventSelect(target);
    removeEventListenerFrom(target, startEvent, startListener);
  });
  endCallback.onRemove(function () {
    undoPreventSelect(target);
    removeEventListenerFrom(target, endEvent, endListener);
  });
};
var listenerSetupFn = {
  click: setupClickListener,
  hover: function hover() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return setupPointerListeners.apply(void 0, [S_HOVER].concat(args));
  },
  press: function press() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    return setupPointerListeners.apply(void 0, [S_PRESS].concat(args));
  }
};
var invokeCallback$2 = function invokeCallback(callback, target, actionData, event) {
  return callback.invoke(target, copyObject(actionData), event)["catch"](logError);
};

var ScrollWatcher = function () {
  function ScrollWatcher(config, key) {
    var _this = this;
    _classCallCheck(this, ScrollWatcher);
    if (key !== CONSTRUCTOR_KEY$1) {
      throw illegalConstructorError("ScrollWatcher.create");
    }
    var allScrollData = newWeakMap();
    var activeListeners = newWeakMap();
    var allCallbacks = newXWeakMap(function () {
      return newMap();
    });
    var fetchCurrentScroll = function () {
      var _ref = _asyncToGenerator(_regeneratorRuntime().mark(function _callee(element) {
        var realtime,
          isScrollEvent,
          previousEventData,
          latestData,
          _args = arguments;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              realtime = _args.length > 1 && _args[1] !== undefined ? _args[1] : false;
              isScrollEvent = _args.length > 2 && _args[2] !== undefined ? _args[2] : false;
              previousEventData = allScrollData.get(element);
              _context.next = 5;
              return fetchScrollData(element, previousEventData, realtime);
            case 5:
              latestData = _context.sent;
              if (!isScrollEvent && previousEventData) {
                latestData.direction = previousEventData.direction;
              }
              return _context.abrupt("return", latestData);
            case 8:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function fetchCurrentScroll(_x) {
        return _ref.apply(this, arguments);
      };
    }();
    var createCallback = function createCallback(handler, options, trackType) {
      var _allCallbacks$get;
      var element = options._element;
      remove((_allCallbacks$get = allCallbacks.get(element)) === null || _allCallbacks$get === void 0 || (_allCallbacks$get = _allCallbacks$get.get(handler)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get._callback);
      var callback = _wrapCallback(handler, options._debounceWindow);
      callback.onRemove(function () {
        deleteHandler(handler, options);
      });
      var entry = {
        _callback: callback,
        _trackType: trackType,
        _options: options
      };
      allCallbacks.sGet(element).set(handler, entry);
      return entry;
    };
    var setupOnScroll = function () {
      var _ref2 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee2(handler, userOptions, trackType) {
        var options, element, entry, callback, eventTarget, scrollData, listenerOptions, directions;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return fetchOnScrollOptions(config, userOptions || {});
            case 2:
              options = _context2.sent;
              element = options._element;
              entry = createCallback(handler, options, trackType);
              callback = entry._callback;
              eventTarget = options._eventTarget;
              _context2.next = 9;
              return fetchCurrentScroll(element, options._debounceWindow === 0);
            case 9:
              scrollData = _context2.sent;
              if (!callback.isRemoved()) {
                _context2.next = 12;
                break;
              }
              return _context2.abrupt("return");
            case 12:
              entry._data = scrollData;
              allScrollData.set(element, scrollData);
              if (!(trackType === TRACK_FULL$1)) {
                _context2.next = 17;
                break;
              }
              _context2.next = 17;
              return setupSizeTrack(entry);
            case 17:
              listenerOptions = activeListeners.get(eventTarget);
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
              directions = options._directions;
              if (!(!callback.isRemoved() && !(userOptions !== null && userOptions !== void 0 && userOptions.skipInitial) && directionMatches(directions, scrollData.direction))) {
                _context2.next = 25;
                break;
              }
              _context2.next = 25;
              return invokeCallback$1(_wrapCallback(handler), element, scrollData);
            case 25:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      return function setupOnScroll(_x2, _x3, _x4) {
        return _ref2.apply(this, arguments);
      };
    }();
    var removeOnScroll = function () {
      var _ref3 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee3(handler, scrollable, trackType) {
        var _allCallbacks$get2;
        var options, element, currEntry;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return fetchOnScrollOptions(config, {
                scrollable: scrollable
              });
            case 2:
              options = _context3.sent;
              element = options._element;
              currEntry = (_allCallbacks$get2 = allCallbacks.get(element)) === null || _allCallbacks$get2 === void 0 ? void 0 : _allCallbacks$get2.get(handler);
              if ((currEntry === null || currEntry === void 0 ? void 0 : currEntry._trackType) === trackType) {
                remove(currEntry._callback);
                if (handler === setScrollCssProps) {
                  setScrollCssProps(element, null);
                }
              }
            case 6:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      return function removeOnScroll(_x5, _x6, _x7) {
        return _ref3.apply(this, arguments);
      };
    }();
    var deleteHandler = function deleteHandler(handler, options) {
      var element = options._element;
      var eventTarget = options._eventTarget;
      deleteKey(allCallbacks.get(element), handler);
      allCallbacks.prune(element);
      var listenerOptions = activeListeners.get(eventTarget);
      if (listenerOptions && options._debounceWindow === 0) {
        listenerOptions._nRealtime--;
      }
      if (!allCallbacks.has(element)) {
        deleteKey(allScrollData, element);
        removeEventListenerFrom(eventTarget, S_SCROLL, scrollHandler);
        deleteKey(activeListeners, eventTarget);
      }
    };
    var setupSizeTrack = function () {
      var _ref4 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee5(entry) {
        var options, element, scrollCallback, doc, docScrollingElement, resizeCallback, sizeWatcher, setupOnResize, observedElements, allowedToWrap, wrapper, _iterator, _step, child, domWatcher, onAddedCallback;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              options = entry._options;
              element = options._element;
              scrollCallback = entry._callback;
              doc = getDoc();
              docScrollingElement = getDocScrollingElement();
              resizeCallback = _wrapCallback(_asyncToGenerator(_regeneratorRuntime().mark(function _callee4() {
                var latestData, thresholdsExceeded;
                return _regeneratorRuntime().wrap(function _callee4$(_context4) {
                  while (1) switch (_context4.prev = _context4.next) {
                    case 0:
                      _context4.next = 2;
                      return fetchCurrentScroll(element);
                    case 2:
                      latestData = _context4.sent;
                      thresholdsExceeded = hasExceededThreshold(options, latestData, entry._data);
                      if (thresholdsExceeded) {
                        _context4.next = 8;
                        break;
                      }
                      _context4.next = 11;
                      break;
                    case 8:
                      if (scrollCallback.isRemoved()) {
                        _context4.next = 11;
                        break;
                      }
                      _context4.next = 11;
                      return invokeCallback$1(scrollCallback, element, latestData);
                    case 11:
                    case "end":
                      return _context4.stop();
                  }
                }, _callee4);
              })));
              scrollCallback.onRemove(resizeCallback.remove);
              sizeWatcher = SizeWatcher.reuse();
              setupOnResize = function setupOnResize(target) {
                return sizeWatcher.onResize(resizeCallback, _defineProperty(_defineProperty({
                  target: target
                }, S_DEBOUNCE_WINDOW, options._debounceWindow), "threshold", options._threshold));
              };
              if (!(element === docScrollingElement)) {
                _context5.next = 14;
                break;
              }
              setupOnResize();
              setupOnResize(doc);
              return _context5.abrupt("return");
            case 14:
              observedElements = newSet([element]);
              setupOnResize(element);
              allowedToWrap = settings.contentWrappingAllowed === true && element !== docScrollingElement && getData(element, PREFIX_NO_WRAP) === null;
              if (!allowedToWrap) {
                _context5.next = 25;
                break;
              }
              _context5.next = 20;
              return wrapScrollingContent(element);
            case 20:
              wrapper = _context5.sent;
              setupOnResize(wrapper);
              observedElements.add(wrapper);
              _context5.next = 27;
              break;
            case 25:
              _iterator = _createForOfIteratorHelper(childrenOf(element));
              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  child = _step.value;
                  setupOnResize(child);
                  observedElements.add(child);
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
            case 27:
              domWatcher = DOMWatcher.create({
                root: element,
                subtree: false
              });
              onAddedCallback = _wrapCallback(function (operation) {
                var child = currentTargetOf(operation);
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
            case 31:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      }));
      return function setupSizeTrack(_x8) {
        return _ref4.apply(this, arguments);
      };
    }();
    var scrollHandler = function () {
      var _ref6 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee6(event) {
        var _activeListeners$get, _allCallbacks$get3;
        var scrollable, element, realtime, latestData, _iterator2, _step2, entry, _options, thresholdsExceeded;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              scrollable = targetOf(event);
              if (!(!scrollable || !(isElement(scrollable) || isDoc(scrollable)))) {
                _context6.next = 3;
                break;
              }
              return _context6.abrupt("return");
            case 3:
              _context6.next = 5;
              return fetchScrollableElement(scrollable);
            case 5:
              element = _context6.sent;
              realtime = (((_activeListeners$get = activeListeners.get(scrollable)) === null || _activeListeners$get === void 0 ? void 0 : _activeListeners$get._nRealtime) || 0) > 0;
              _context6.next = 9;
              return fetchCurrentScroll(element, realtime, true);
            case 9:
              latestData = _context6.sent;
              allScrollData.set(element, latestData);
              _iterator2 = _createForOfIteratorHelper(((_allCallbacks$get3 = allCallbacks.get(element)) === null || _allCallbacks$get3 === void 0 ? void 0 : _allCallbacks$get3.values()) || []);
              _context6.prev = 13;
              _iterator2.s();
            case 15:
              if ((_step2 = _iterator2.n()).done) {
                _context6.next = 29;
                break;
              }
              entry = _step2.value;
              _options = entry._options;
              thresholdsExceeded = hasExceededThreshold(_options, latestData, entry._data);
              if (thresholdsExceeded) {
                _context6.next = 22;
                break;
              }
              return _context6.abrupt("continue", 27);
            case 22:
              entry._data = latestData;
              if (directionMatches(_options._directions, latestData.direction)) {
                _context6.next = 26;
                break;
              }
              return _context6.abrupt("continue", 27);
            case 26:
              invokeCallback$1(entry._callback, element, latestData);
            case 27:
              _context6.next = 15;
              break;
            case 29:
              _context6.next = 34;
              break;
            case 31:
              _context6.prev = 31;
              _context6.t0 = _context6["catch"](13);
              _iterator2.e(_context6.t0);
            case 34:
              _context6.prev = 34;
              _iterator2.f();
              return _context6.finish(34);
            case 37:
            case "end":
              return _context6.stop();
          }
        }, _callee6, null, [[13, 31, 34, 37]]);
      }));
      return function scrollHandler(_x9) {
        return _ref6.apply(this, arguments);
      };
    }();
    this.fetchCurrentScroll = function (scrollable, realtime) {
      return fetchScrollableElement(scrollable).then(function (element) {
        return fetchCurrentScroll(element, realtime);
      });
    };
    this.scroll = function (direction) {
      var _options$amount;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (!isValidScrollDirection(direction)) {
        throw usageError("Unknown scroll direction: '".concat(direction, "'"));
      }
      var isVertical = direction === S_UP || direction === S_DOWN;
      var sign = direction === S_UP || direction === S_LEFT ? -1 : 1;
      var targetCoordinate;
      var amount = (_options$amount = options.amount) !== null && _options$amount !== void 0 ? _options$amount : 100;
      var asFractionOf = options.asFractionOf;
      if (asFractionOf === "visible") {
        targetCoordinate = isVertical ? function (el) {
          return el[S_SCROLL_TOP] + sign * amount * getClientHeightNow(el) / 100;
        } : function (el) {
          return el[S_SCROLL_LEFT] + sign * amount * getClientWidthNow(el) / 100;
        };
      } else if (asFractionOf === "content") {
        targetCoordinate = isVertical ? function (el) {
          return el[S_SCROLL_TOP] + sign * amount * el[S_SCROLL_HEIGHT] / 100;
        } : function (el) {
          return el[S_SCROLL_LEFT] + sign * amount * el[S_SCROLL_WIDTH] / 100;
        };
      } else if (asFractionOf !== undefined && asFractionOf !== "pixel") {
        throw usageError("Unknown 'asFractionOf' keyword: '".concat(asFractionOf, "'"));
      } else {
        targetCoordinate = isVertical ? function (el) {
          return el[S_SCROLL_TOP] + sign * amount;
        } : function (el) {
          return el[S_SCROLL_LEFT] + sign * amount;
        };
      }
      var target = isVertical ? {
        top: targetCoordinate
      } : {
        left: targetCoordinate
      };
      return _this.scrollTo(target, options);
    };
    this.scrollTo = function () {
      var _ref7 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee7(to) {
        var options,
          _args7 = arguments;
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              options = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : {};
              _context7.t0 = scrollTo;
              _context7.t1 = to;
              _context7.t2 = MH;
              _context7.t3 = {
                duration: config._scrollDuration
              };
              _context7.t4 = options;
              _context7.next = 8;
              return fetchScrollableElement(options.scrollable);
            case 8:
              _context7.t5 = _context7.sent;
              _context7.t6 = {
                scrollable: _context7.t5
              };
              _context7.t7 = _context7.t2.merge.call(_context7.t2, _context7.t3, _context7.t4, _context7.t6);
              return _context7.abrupt("return", (0, _context7.t0)(_context7.t1, _context7.t7));
            case 12:
            case "end":
              return _context7.stop();
          }
        }, _callee7);
      }));
      return function (_x10) {
        return _ref7.apply(this, arguments);
      };
    }();
    this.fetchCurrentScrollAction = function (scrollable) {
      return fetchScrollableElement(scrollable).then(function (element) {
        return getCurrentScrollAction(element);
      });
    };
    this.stopUserScrolling = _asyncToGenerator(_regeneratorRuntime().mark(function _callee8() {
      var options,
        element,
        stopScroll,
        _args8 = arguments;
      return _regeneratorRuntime().wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            options = _args8.length > 0 && _args8[0] !== undefined ? _args8[0] : {};
            _context8.next = 3;
            return fetchScrollableElement(options.scrollable);
          case 3:
            element = _context8.sent;
            stopScroll = function stopScroll() {
              return elScrollTo(element, {
                top: element[S_SCROLL_TOP],
                left: element[S_SCROLL_LEFT]
              });
            };
            if (options.immediate) {
              stopScroll();
            } else {
              waitForMeasureTime().then(stopScroll);
            }
          case 6:
          case "end":
            return _context8.stop();
        }
      }, _callee8);
    }));
    this.trackScroll = function (handler, options) {
      if (!handler) {
        handler = setScrollCssProps;
      }
      return setupOnScroll(handler, options, TRACK_FULL$1);
    };
    this.noTrackScroll = function (handler, scrollable) {
      if (!handler) {
        handler = setScrollCssProps;
      }
      removeOnScroll(handler, scrollable, TRACK_FULL$1);
    };
    this.onScroll = function (handler, options) {
      return setupOnScroll(handler, options, TRACK_REGULAR$1);
    };
    this.offScroll = function (handler, scrollable) {
      removeOnScroll(handler, scrollable, TRACK_REGULAR$1);
    };
  }
  return _createClass(ScrollWatcher, null, [{
    key: "fetchMainContentElement",
    value: function fetchMainContentElement$1() {
      return fetchMainContentElement();
    }
  }, {
    key: "fetchMainScrollableElement",
    value: function fetchMainScrollableElement$1() {
      return fetchMainScrollableElement();
    }
  }, {
    key: "create",
    value: function create() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return new ScrollWatcher(getConfig$1(config), CONSTRUCTOR_KEY$1);
    }
  }, {
    key: "reuse",
    value: function reuse() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var myConfig = getConfig$1(config);
      var configStrKey = objToStrKey(myConfig);
      var instance = instances$3.get(configStrKey);
      if (!instance) {
        instance = new ScrollWatcher(myConfig, CONSTRUCTOR_KEY$1);
        instances$3.set(configStrKey, instance);
      }
      return instance;
    }
  }]);
}();
var CONSTRUCTOR_KEY$1 = SYMBOL();
var instances$3 = newMap();
var getConfig$1 = function getConfig(config) {
  return {
    _debounceWindow: toNonNegNum(config[S_DEBOUNCE_WINDOW], 75),
    _scrollThreshold: toNonNegNum(config.scrollThreshold, 50) || 1,
    _scrollDuration: toNonNegNum(config.scrollDuration, 1000)
  };
};
var TRACK_REGULAR$1 = 1;
var TRACK_FULL$1 = 2;
var fetchOnScrollOptions = function () {
  var _ref9 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee9(config, options) {
    var _options$MC$S_DEBOUNC;
    var directions, element;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          directions = validateStrList("directions", options.directions, isValidScrollDirection) || null;
          _context9.next = 3;
          return fetchScrollableElement(options.scrollable);
        case 3:
          element = _context9.sent;
          return _context9.abrupt("return", {
            _element: element,
            _eventTarget: getEventTarget(element),
            _directions: directions,
            _threshold: toNonNegNum(options.threshold, config._scrollThreshold) || 1,
            _debounceWindow: (_options$MC$S_DEBOUNC = options[S_DEBOUNCE_WINDOW]) !== null && _options$MC$S_DEBOUNC !== void 0 ? _options$MC$S_DEBOUNC : config._debounceWindow
          });
        case 5:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  }));
  return function fetchOnScrollOptions(_x11, _x12) {
    return _ref9.apply(this, arguments);
  };
}();
var directionMatches = function directionMatches(userDirections, latestDirection) {
  return !userDirections || includes(userDirections, latestDirection);
};
var hasExceededThreshold = function hasExceededThreshold(options, latestData, lastThresholdData) {
  var directions = options._directions;
  var threshold = options._threshold;
  if (!lastThresholdData) {
    return false;
  }
  var topDiff = maxAbs(latestData[S_SCROLL_TOP] - lastThresholdData[S_SCROLL_TOP], latestData[S_SCROLL_HEIGHT] - lastThresholdData[S_SCROLL_HEIGHT], latestData[S_CLIENT_HEIGHT] - lastThresholdData[S_CLIENT_HEIGHT]);
  var leftDiff = maxAbs(latestData[S_SCROLL_LEFT] - lastThresholdData[S_SCROLL_LEFT], latestData[S_SCROLL_WIDTH] - lastThresholdData[S_SCROLL_WIDTH], latestData[S_CLIENT_WIDTH] - lastThresholdData[S_CLIENT_WIDTH]);
  var checkTop = false,
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
var fetchScrollData = function () {
  var _ref10 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee10(element, previousEventData, realtime) {
    var scrollTop, scrollLeft, scrollWidth, scrollHeight, clientWidth, clientHeight, scrollTopFraction, scrollLeftFraction, prevScrollTop, prevScrollLeft, direction;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          if (realtime) {
            _context10.next = 3;
            break;
          }
          _context10.next = 3;
          return waitForMeasureTime();
        case 3:
          scrollTop = ceil(element[S_SCROLL_TOP]);
          scrollLeft = ceil(element[S_SCROLL_LEFT]);
          scrollWidth = element[S_SCROLL_WIDTH];
          scrollHeight = element[S_SCROLL_HEIGHT];
          clientWidth = getClientWidthNow(element);
          clientHeight = getClientHeightNow(element);
          scrollTopFraction = round(scrollTop) / (scrollHeight - clientHeight || INFINITY);
          scrollLeftFraction = round(scrollLeft) / (scrollWidth - clientWidth || INFINITY);
          prevScrollTop = (previousEventData === null || previousEventData === void 0 ? void 0 : previousEventData.scrollTop) || 0;
          prevScrollLeft = (previousEventData === null || previousEventData === void 0 ? void 0 : previousEventData.scrollLeft) || 0;
          direction = getMaxDeltaDirection(scrollLeft - prevScrollLeft, scrollTop - prevScrollTop);
          return _context10.abrupt("return", _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({
            direction: direction
          }, S_SCROLL_TOP, scrollTop), S_SCROLL_TOP_FRACTION, scrollTopFraction), S_SCROLL_LEFT, scrollLeft), S_SCROLL_LEFT_FRACTION, scrollLeftFraction), S_SCROLL_WIDTH, scrollWidth), S_SCROLL_HEIGHT, scrollHeight), S_CLIENT_WIDTH, clientWidth), S_CLIENT_HEIGHT, clientHeight));
        case 15:
        case "end":
          return _context10.stop();
      }
    }, _callee10);
  }));
  return function fetchScrollData(_x13, _x14, _x15) {
    return _ref10.apply(this, arguments);
  };
}();
var setScrollCssProps = function setScrollCssProps(element, scrollData) {
  var prefix = "";
  if (element === tryGetMainScrollableElement()) {
    element = getDocElement();
    prefix = "page-";
  }
  scrollData = scrollData || {};
  var props = _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, S_SCROLL_TOP, scrollData[S_SCROLL_TOP]), S_SCROLL_TOP_FRACTION, scrollData[S_SCROLL_TOP_FRACTION]), S_SCROLL_LEFT, scrollData[S_SCROLL_LEFT]), S_SCROLL_LEFT_FRACTION, scrollData[S_SCROLL_LEFT_FRACTION]), S_SCROLL_WIDTH, scrollData[S_SCROLL_WIDTH]), S_SCROLL_HEIGHT, scrollData[S_SCROLL_HEIGHT]);
  setNumericStyleProps(element, props, {
    _prefix: prefix
  });
};
var getEventTarget = function getEventTarget(element) {
  if (element === getDocScrollingElement()) {
    return getDoc();
  }
  return element;
};
var invokeCallback$1 = function invokeCallback(callback, element, scrollData) {
  return callback.invoke(element, copyObject(scrollData))["catch"](logError);
};

var isValidScrollOffset = function isValidScrollOffset(offset) {
  return offset.match(OFFSET_REGEX) !== null;
};
var isValidView = function isValidView(view) {
  return includes(VIEWS, view);
};
var getOppositeViews = function getOppositeViews(views) {
  var bitmask = getViewsBitmask(views);
  var oppositeBitmask = VIEWS_SPACE.bitmask & ~bitmask;
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
var getViewsBitmask = function getViewsBitmask(viewsStr) {
  var viewsBitmask = 0;
  var views = validateStrList("views", viewsStr, isValidView);
  if (views) {
    var _iterator = _createForOfIteratorHelper(views),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var v = _step.value;
        if (!isValidView(v)) {
          throw usageError("Unknown view '".concat(v, "'"));
        }
        viewsBitmask |= VIEWS_SPACE.bit[v];
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  } else {
    viewsBitmask = VIEWS_SPACE.bitmask;
  }
  return viewsBitmask;
};
var parseScrollOffset = function parseScrollOffset(input) {
  var _match$groups, _match$groups2;
  var match = input.match(OFFSET_REGEX);
  if (!match) {
    throw usageError("Invalid offset: '".concat(input, "'"));
  }
  var reference = (_match$groups = match.groups) === null || _match$groups === void 0 ? void 0 : _match$groups.ref;
  var value = (_match$groups2 = match.groups) === null || _match$groups2 === void 0 ? void 0 : _match$groups2.value;
  if (!reference || !value) {
    throw bugError("Offset regex: blank named groups");
  }
  return {
    reference: reference,
    value: value
  };
};
var VIEWS = [S_AT, S_ABOVE, S_BELOW, S_LEFT, S_RIGHT];
var VIEWS_SPACE = createBitSpace.apply(void 0, [newBitSpaces()].concat(VIEWS));
var OFFSET_REGEX = RegExp("(?<ref>top|bottom|left|right): *(?<value>[^ ].+)");
var getViewsFromBitmask = function getViewsFromBitmask(bitmask) {
  var views = [];
  for (var bit = VIEWS_SPACE.start; bit <= VIEWS_SPACE.end; bit++) {
    var value = 1 << bit;
    if (bitmask & value) {
      var name = VIEWS_SPACE.nameOf(value);
      if (name) {
        views.push(name);
      }
    }
  }
  return views;
};

var XIntersectionObserver = _createClass(function XIntersectionObserver(callback, observeOptions) {
  var _this = this;
  _classCallCheck(this, XIntersectionObserver);
  var observedTargets = newWeakSet();
  var targetsToSkip = newWeakSet();
  var intersectionHandler = function intersectionHandler(entries) {
    var selectedEntries = [];
    var _iterator = _createForOfIteratorHelper(entries),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var entry = _step.value;
        if (targetsToSkip.has(targetOf(entry))) {
          deleteKey(targetsToSkip, targetOf(entry));
          continue;
        }
        selectedEntries.push(entry);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    if (lengthOf(selectedEntries)) {
      callback(selectedEntries, _this);
    }
  };
  var observer = newIntersectionObserver(intersectionHandler, observeOptions);
  defineProperty(this, "root", {
    get: function get() {
      return observer.root;
    }
  });
  defineProperty(this, "rootMargin", {
    get: function get() {
      return observer.rootMargin;
    }
  });
  defineProperty(this, "thresholds", {
    get: function get() {
      return observer.thresholds;
    }
  });
  this.observe = function () {
    for (var _len = arguments.length, targets = new Array(_len), _key = 0; _key < _len; _key++) {
      targets[_key] = arguments[_key];
    }
    for (var _i = 0, _targets = targets; _i < _targets.length; _i++) {
      var target = _targets[_i];
      observedTargets.add(target);
      observer.observe(target);
    }
  };
  this.observeLater = function () {
    for (var _len2 = arguments.length, targets = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      targets[_key2] = arguments[_key2];
    }
    for (var _i2 = 0, _targets2 = targets; _i2 < _targets2.length; _i2++) {
      var target = _targets2[_i2];
      if (observedTargets.has(target)) {
        continue;
      }
      targetsToSkip.add(target);
      _this.observe(target);
    }
  };
  this.unobserve = function () {
    for (var _len3 = arguments.length, targets = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      targets[_key3] = arguments[_key3];
    }
    for (var _i3 = 0, _targets3 = targets; _i3 < _targets3.length; _i3++) {
      var target = _targets3[_i3];
      deleteKey(observedTargets, target);
      observer.unobserve(target);
    }
  };
  this.disconnect = function () {
    observedTargets = newWeakSet();
    observer.disconnect();
  };
  this.takeRecords = function () {
    return observer.takeRecords();
  };
});

var ViewWatcher = function () {
  function ViewWatcher(config, key) {
    _classCallCheck(this, ViewWatcher);
    if (key !== CONSTRUCTOR_KEY) {
      throw illegalConstructorError("ViewWatcher.create");
    }
    var allViewData = newWeakMap();
    var allCallbacks = newXWeakMap(function () {
      return newMap();
    });
    var intersectionHandler = function intersectionHandler(entries) {
      var _iterator = _createForOfIteratorHelper(entries),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var entry = _step.value;
          processEntry(entry);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    };
    var observeOptions = {
      root: config._root,
      threshold: config._threshold,
      rootMargin: config._rootMargin
    };
    var xObserver = new XIntersectionObserver(intersectionHandler, observeOptions);
    var fetchCurrentView = function fetchCurrentView(element) {
      var realtime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var fetchData = function () {
        var _ref = _asyncToGenerator(_regeneratorRuntime().mark(function _callee(entryOrElement) {
          var intersection, data;
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return fetchIntersectionData(config, entryOrElement, realtime);
              case 2:
                intersection = _context.sent;
                _context.next = 5;
                return fetchViewData(intersection, realtime);
              case 5:
                data = _context.sent;
                return _context.abrupt("return", data);
              case 7:
              case "end":
                return _context.stop();
            }
          }, _callee);
        }));
        return function fetchData(_x) {
          return _ref.apply(this, arguments);
        };
      }();
      if (realtime) {
        return fetchData(element);
      }
      return newPromise(function (resolve) {
        var observer = newIntersectionObserver(function (entries) {
          var promise = fetchData(entries[0]);
          observer.disconnect();
          promise.then(resolve);
        }, observeOptions);
        observer.observe(element);
      });
    };
    var createCallback = function createCallback(handler, options, trackType) {
      var _allCallbacks$get;
      var element = options._element;
      remove((_allCallbacks$get = allCallbacks.get(element)) === null || _allCallbacks$get === void 0 || (_allCallbacks$get = _allCallbacks$get.get(handler)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get._callback);
      var callback = _wrapCallback(handler);
      callback.onRemove(function () {
        deleteHandler(handler, options);
      });
      allCallbacks.sGet(element).set(handler, {
        _callback: callback,
        _trackType: trackType,
        _options: options
      });
      return callback;
    };
    var setupOnView = function () {
      var _ref2 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee2(target, handler, userOptions, trackType) {
        var options, element, callback, viewData;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return fetchOptions(config._root, target, userOptions);
            case 2:
              options = _context2.sent;
              element = options._element;
              callback = createCallback(handler, options, trackType);
              _context2.next = 7;
              return waitForInteractive();
            case 7:
              _context2.next = 9;
              return fetchCurrentView(element);
            case 9:
              viewData = _context2.sent;
              if (!(viewData.rootBounds[S_WIDTH] === 0 && viewData.rootBounds[S_HEIGHT] === 0)) {
                _context2.next = 17;
                break;
              }
              _context2.next = 14;
              return waitForSubsequentMeasureTime();
            case 14:
              _context2.next = 16;
              return fetchCurrentView(element);
            case 16:
              viewData = _context2.sent;
            case 17:
              if (!(trackType === TRACK_FULL)) {
                _context2.next = 20;
                break;
              }
              _context2.next = 20;
              return setupInviewTrack(options, callback, viewData);
            case 20:
              if (!callback.isRemoved()) {
                _context2.next = 22;
                break;
              }
              return _context2.abrupt("return");
            case 22:
              xObserver.observeLater(element);
              if (userOptions !== null && userOptions !== void 0 && userOptions.skipInitial) {
                _context2.next = 28;
                break;
              }
              if (!(viewsToBitmask(viewData.views) & options._viewsBitmask)) {
                _context2.next = 28;
                break;
              }
              _context2.next = 28;
              return invokeCallback(callback, element, viewData);
            case 28:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      return function setupOnView(_x2, _x3, _x4, _x5) {
        return _ref2.apply(this, arguments);
      };
    }();
    var removeOnView = function () {
      var _ref3 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee3(target, handler, trackType) {
        var _allCallbacks$get2;
        var options, element, currEntry;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return fetchOptions(config._root, target, {});
            case 2:
              options = _context3.sent;
              element = options._element;
              currEntry = (_allCallbacks$get2 = allCallbacks.get(element)) === null || _allCallbacks$get2 === void 0 ? void 0 : _allCallbacks$get2.get(handler);
              if ((currEntry === null || currEntry === void 0 ? void 0 : currEntry._trackType) === trackType) {
                remove(currEntry._callback);
                if (handler === setViewCssProps) {
                  setViewCssProps(element, null);
                }
              }
            case 6:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      return function removeOnView(_x6, _x7, _x8) {
        return _ref3.apply(this, arguments);
      };
    }();
    var deleteHandler = function deleteHandler(handler, options) {
      var element = options._element;
      deleteKey(allCallbacks.get(element), handler);
      allCallbacks.prune(element);
      if (!allCallbacks.has(element)) {
        xObserver.unobserve(element);
        deleteKey(allViewData, element);
      }
    };
    var processEntry = function () {
      var _ref4 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee4(entry) {
        var _allCallbacks$get3;
        var element, intersection, latestData, viewsBitmask, _iterator2, _step2, _entry;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              element = targetOf(entry);
              _context4.next = 3;
              return fetchIntersectionData(config, entry);
            case 3:
              intersection = _context4.sent;
              _context4.next = 6;
              return fetchViewData(intersection);
            case 6:
              latestData = _context4.sent;
              viewsBitmask = viewsToBitmask(latestData.views);
              _iterator2 = _createForOfIteratorHelper(((_allCallbacks$get3 = allCallbacks.get(element)) === null || _allCallbacks$get3 === void 0 ? void 0 : _allCallbacks$get3.values()) || []);
              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  _entry = _step2.value;
                  if (viewsBitmask & _entry._options._viewsBitmask) {
                    invokeCallback(_entry._callback, element, latestData);
                  }
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }
            case 11:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      return function processEntry(_x9) {
        return _ref4.apply(this, arguments);
      };
    }();
    var setupInviewTrack = function () {
      var _ref5 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee6(options, viewCallback, viewData) {
        var element, sizeWatcher, scrollWatcher, realtime, domWatcher, isInview, removeTrackCallback, scrollableAncestors, addTrackCallback, enterOrLeaveCallback;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              element = options._element;
              sizeWatcher = SizeWatcher.reuse();
              scrollWatcher = ScrollWatcher.reuse();
              realtime = options._debounceWindow === 0;
              domWatcher = DOMWatcher.create({
                root: element,
                subtree: false
              });
              isInview = false;
              removeTrackCallback = null;
              _context6.next = 10;
              return fetchScrollableAncestors(element, realtime);
            case 10:
              scrollableAncestors = _context6.sent;
              if (!viewCallback.isRemoved()) {
                _context6.next = 13;
                break;
              }
              return _context6.abrupt("return");
            case 13:
              addTrackCallback = function addTrackCallback() {
                var _config$_root;
                var trackCallback = _wrapCallback(_asyncToGenerator(_regeneratorRuntime().mark(function _callee5() {
                  var prevData, latestData, changed;
                  return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                    while (1) switch (_context5.prev = _context5.next) {
                      case 0:
                        prevData = allViewData.get(element);
                        _context5.next = 3;
                        return fetchCurrentView(element, realtime);
                      case 3:
                        latestData = _context5.sent;
                        changed = viewChanged(latestData, prevData);
                        if (!changed) {
                          _context5.next = 13;
                          break;
                        }
                        allViewData.set(element, latestData);
                        if (!(isInview && !viewCallback.isRemoved())) {
                          _context5.next = 11;
                          break;
                        }
                        _context5.next = 11;
                        return invokeCallback(viewCallback, element, latestData);
                      case 11:
                        _context5.next = 14;
                        break;
                      case 13:
                      case 14:
                      case "end":
                        return _context5.stop();
                    }
                  }, _callee5);
                })));
                viewCallback.onRemove(trackCallback.remove);
                removeTrackCallback = trackCallback.remove;
                domWatcher.onMutation(trackCallback, _defineProperty({
                  categories: [S_ATTRIBUTE]
                }, S_SKIP_INITIAL, true));
                sizeWatcher.onResize(trackCallback, _defineProperty(_defineProperty(_defineProperty({
                  target: element
                }, S_DEBOUNCE_WINDOW, options._debounceWindow), "threshold", options._resizeThreshold), S_SKIP_INITIAL, true));
                sizeWatcher.onResize(trackCallback, _defineProperty(_defineProperty(_defineProperty({
                  target: (_config$_root = config._root) !== null && _config$_root !== void 0 ? _config$_root : getWindow()
                }, S_DEBOUNCE_WINDOW, options._debounceWindow), "threshold", options._resizeThreshold), S_SKIP_INITIAL, true));
                var _iterator3 = _createForOfIteratorHelper(scrollableAncestors),
                  _step3;
                try {
                  for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                    var ancestor = _step3.value;
                    scrollWatcher.onScroll(trackCallback, _defineProperty(_defineProperty(_defineProperty({
                      scrollable: ancestor
                    }, S_DEBOUNCE_WINDOW, options._debounceWindow), "threshold", options._scrollThreshold), S_SKIP_INITIAL, true));
                  }
                } catch (err) {
                  _iterator3.e(err);
                } finally {
                  _iterator3.f();
                }
              };
              enterOrLeaveCallback = createCallback(function (target__ignored, viewData) {
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
            case 18:
            case "end":
              return _context6.stop();
          }
        }, _callee6);
      }));
      return function setupInviewTrack(_x10, _x11, _x12) {
        return _ref5.apply(this, arguments);
      };
    }();
    this.fetchCurrentView = function (target) {
      var realtime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return fetchElement(config._root, target).then(function (element) {
        return fetchCurrentView(element, realtime);
      });
    };
    this.trackView = function (element, handler, options) {
      if (!handler) {
        handler = setViewCssProps;
      }
      return setupOnView(element, handler, options, TRACK_FULL);
    };
    this.noTrackView = function (element, handler) {
      if (!handler) {
        handler = setViewCssProps;
      }
      removeOnView(element, handler, TRACK_FULL);
    };
    this.onView = function (target, handler, options) {
      return setupOnView(target, handler, options, TRACK_REGULAR);
    };
    this.offView = function (target, handler) {
      return removeOnView(target, handler, TRACK_REGULAR);
    };
  }
  return _createClass(ViewWatcher, null, [{
    key: "create",
    value: function create() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return new ViewWatcher(getConfig(config), CONSTRUCTOR_KEY);
    }
  }, {
    key: "reuse",
    value: function reuse() {
      var _instances$get;
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var myConfig = getConfig(config);
      var configStrKey = objToStrKey(omitKeys(myConfig, {
        _root: null
      }));
      var instance = (_instances$get = instances$2.get(myConfig._root)) === null || _instances$get === void 0 ? void 0 : _instances$get.get(configStrKey);
      if (!instance) {
        instance = new ViewWatcher(myConfig, CONSTRUCTOR_KEY);
        instances$2.sGet(myConfig._root).set(configStrKey, instance);
      }
      return instance;
    }
  }]);
}();
var CONSTRUCTOR_KEY = SYMBOL();
var instances$2 = newXMap(function () {
  return newMap();
});
var getConfig = function getConfig(config) {
  var _config$rootMargin;
  return {
    _root: (config === null || config === void 0 ? void 0 : config.root) || null,
    _rootMargin: (_config$rootMargin = config === null || config === void 0 ? void 0 : config.rootMargin) !== null && _config$rootMargin !== void 0 ? _config$rootMargin : "0px 0px 0px 0px",
    _threshold: (config === null || config === void 0 ? void 0 : config.threshold) || 0
  };
};
var TRACK_REGULAR = 1;
var TRACK_FULL = 2;
var fetchOptions = function () {
  var _ref7 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee7(root, target, options) {
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return fetchElement(root, target);
        case 2:
          _context7.t0 = _context7.sent;
          _context7.t1 = getViewsBitmask(options === null || options === void 0 ? void 0 : options.views);
          _context7.t2 = options === null || options === void 0 ? void 0 : options.debounceWindow;
          _context7.t3 = options === null || options === void 0 ? void 0 : options.resizeThreshold;
          _context7.t4 = options === null || options === void 0 ? void 0 : options.scrollThreshold;
          return _context7.abrupt("return", {
            _element: _context7.t0,
            _viewsBitmask: _context7.t1,
            _debounceWindow: _context7.t2,
            _resizeThreshold: _context7.t3,
            _scrollThreshold: _context7.t4
          });
        case 8:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function fetchOptions(_x13, _x14, _x15) {
    return _ref7.apply(this, arguments);
  };
}();
var fetchScrollableAncestors = function () {
  var _ref8 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee8(element, realtime) {
    var scrollableAncestors, ancestor;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          if (realtime) {
            _context8.next = 3;
            break;
          }
          _context8.next = 3;
          return waitForMeasureTime();
        case 3:
          scrollableAncestors = [];
          ancestor = element;
          while (ancestor = getClosestScrollable(ancestor, {
            active: true
          })) {
            scrollableAncestors.push(ancestor);
          }
          return _context8.abrupt("return", scrollableAncestors);
        case 7:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return function fetchScrollableAncestors(_x16, _x17) {
    return _ref8.apply(this, arguments);
  };
}();
var viewChanged = function viewChanged(latestData, prevData) {
  return !prevData || viewsToBitmask(prevData.views) !== viewsToBitmask(latestData.views) || !_compareValuesIn(copyBoundingRectProps(prevData.targetBounds), copyBoundingRectProps(latestData.targetBounds)) || !_compareValuesIn(prevData.rootBounds, latestData.rootBounds) || !_compareValuesIn(prevData.relative, latestData.relative);
};
var viewsToBitmask = function viewsToBitmask(views) {
  return VIEWS_SPACE.bit[views[0]] | (views[1] ? VIEWS_SPACE.bit[views[1]] : 0);
};
var fetchIntersectionData = function () {
  var _ref9 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee9(config, entryOrTarget) {
    var realtime,
      root,
      vpSize,
      rootMargins,
      target,
      targetBounds,
      rootBounds,
      isIntersecting,
      isCrossOrigin,
      _args9 = arguments;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          realtime = _args9.length > 2 && _args9[2] !== undefined ? _args9[2] : false;
          root = config._root;
          _context9.next = 4;
          return fetchViewportSize(realtime);
        case 4:
          vpSize = _context9.sent;
          rootMargins = toMargins(config._rootMargin, vpSize);
          rootBounds = null;
          isIntersecting = null;
          isCrossOrigin = null;
          if (!isInstanceOf(entryOrTarget, IntersectionObserverEntry)) {
            _context9.next = 17;
            break;
          }
          target = entryOrTarget.target;
          targetBounds = entryOrTarget.boundingClientRect;
          rootBounds = entryOrTarget.rootBounds;
          isIntersecting = entryOrTarget.isIntersecting;
          isCrossOrigin = !entryOrTarget.rootBounds;
          _context9.next = 21;
          break;
        case 17:
          target = entryOrTarget;
          _context9.next = 20;
          return fetchBounds(target, realtime);
        case 20:
          targetBounds = _context9.sent;
        case 21:
          if (rootBounds) {
            _context9.next = 25;
            break;
          }
          _context9.next = 24;
          return fetchBounds(root, realtime, rootMargins);
        case 24:
          rootBounds = _context9.sent;
        case 25:
          return _context9.abrupt("return", {
            _target: target,
            _targetBounds: targetBounds,
            _root: root,
            _rootMargins: rootMargins,
            _rootBounds: rootBounds,
            _isIntersecting: isIntersecting,
            _isCrossOrigin: isCrossOrigin
          });
        case 26:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  }));
  return function fetchIntersectionData(_x18, _x19) {
    return _ref9.apply(this, arguments);
  };
}();
var fetchBounds = function () {
  var _ref10 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee10(root, realtime, rootMargins) {
    var rect, _yield$fetchViewportS, width, height;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          if (!root) {
            _context10.next = 7;
            break;
          }
          if (realtime) {
            _context10.next = 4;
            break;
          }
          _context10.next = 4;
          return waitForMeasureTime();
        case 4:
          rect = copyBoundingRectProps(getBoundingClientRect(root));
          _context10.next = 13;
          break;
        case 7:
          _context10.next = 9;
          return fetchViewportSize(realtime);
        case 9:
          _yield$fetchViewportS = _context10.sent;
          width = _yield$fetchViewportS.width;
          height = _yield$fetchViewportS.height;
          rect = {
            x: 0,
            left: 0,
            right: width,
            width: width,
            y: 0,
            top: 0,
            bottom: height,
            height: height
          };
        case 13:
          if (rootMargins) {
            rect.x = rect[S_LEFT] -= rootMargins[3];
            rect[S_RIGHT] += rootMargins[1];
            rect[S_WIDTH] += rootMargins[1] + rootMargins[3];
            rect.y = rect[S_TOP] -= rootMargins[0];
            rect[S_BOTTOM] += rootMargins[2];
            rect[S_HEIGHT] += rootMargins[0] + rootMargins[2];
          }
          return _context10.abrupt("return", rect);
        case 15:
        case "end":
          return _context10.stop();
      }
    }, _callee10);
  }));
  return function fetchBounds(_x20, _x21, _x22) {
    return _ref10.apply(this, arguments);
  };
}();
var fetchViewData = function () {
  var _ref11 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee11(intersection) {
    var _intersection$_isInte;
    var realtime,
      vpSize,
      vpHeight,
      vpWidth,
      views,
      relative,
      viewData,
      _args11 = arguments;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          realtime = _args11.length > 1 && _args11[1] !== undefined ? _args11[1] : false;
          _context11.next = 3;
          return fetchViewportSize(realtime);
        case 3:
          vpSize = _context11.sent;
          vpHeight = vpSize[S_HEIGHT];
          vpWidth = vpSize[S_WIDTH];
          _context11.next = 8;
          return _fetchViews(intersection, realtime);
        case 8:
          views = _context11.sent;
          relative = merge({
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
          viewData = {
            isIntersecting: (_intersection$_isInte = intersection._isIntersecting) !== null && _intersection$_isInte !== void 0 ? _intersection$_isInte : views[0] === S_AT,
            targetBounds: intersection._targetBounds,
            rootBounds: intersection._rootBounds,
            views: views,
            relative: relative
          };
          return _context11.abrupt("return", viewData);
        case 22:
        case "end":
          return _context11.stop();
      }
    }, _callee11);
  }));
  return function fetchViewData(_x23) {
    return _ref11.apply(this, arguments);
  };
}();
var _fetchViews = function () {
  var _ref12 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee12(intersection, realtime, useScrollingAncestor) {
    var rootBounds, targetBounds, delta, xView, yView, scrollingAncestor;
    return _regeneratorRuntime().wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          if (!intersection._isIntersecting) {
            _context12.next = 2;
            break;
          }
          return _context12.abrupt("return", [S_AT]);
        case 2:
          if (!useScrollingAncestor) {
            _context12.next = 8;
            break;
          }
          _context12.next = 5;
          return fetchBounds(useScrollingAncestor, realtime, intersection._rootMargins);
        case 5:
          rootBounds = _context12.sent;
          _context12.next = 9;
          break;
        case 8:
          rootBounds = intersection._rootBounds;
        case 9:
          targetBounds = intersection._targetBounds;
          delta = {
            _left: rootBounds[S_LEFT] - targetBounds[S_LEFT],
            _right: targetBounds[S_RIGHT] - rootBounds[S_RIGHT],
            _top: rootBounds[S_TOP] - targetBounds[S_TOP],
            _bottom: targetBounds[S_BOTTOM] - rootBounds[S_BOTTOM]
          };
          xView = null;
          yView = null;
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
          if (!(xView && yView)) {
            _context12.next = 19;
            break;
          }
          return _context12.abrupt("return", [xView, yView]);
        case 19:
          if (!xView) {
            _context12.next = 23;
            break;
          }
          return _context12.abrupt("return", [xView]);
        case 23:
          if (!yView) {
            _context12.next = 25;
            break;
          }
          return _context12.abrupt("return", [yView]);
        case 25:
          if (intersection._isCrossOrigin) {
            _context12.next = 29;
            break;
          }
          scrollingAncestor = getClosestScrollable(useScrollingAncestor !== null && useScrollingAncestor !== void 0 ? useScrollingAncestor : intersection._target);
          if (!scrollingAncestor) {
            _context12.next = 29;
            break;
          }
          return _context12.abrupt("return", _fetchViews(intersection, realtime, scrollingAncestor));
        case 29:
          return _context12.abrupt("return", [S_AT]);
        case 30:
        case "end":
          return _context12.stop();
      }
    }, _callee12);
  }));
  return function fetchViews(_x24, _x25, _x26) {
    return _ref12.apply(this, arguments);
  };
}();
var setViewCssProps = function setViewCssProps(element, viewData) {
  var relative = (viewData === null || viewData === void 0 ? void 0 : viewData.relative) || {};
  var props = _defineProperty(_defineProperty(_defineProperty(_defineProperty({
    top: relative.top,
    bottom: relative.bottom,
    left: relative.left,
    right: relative.right
  }, S_WIDTH, relative[S_WIDTH]), S_HEIGHT, relative[S_HEIGHT]), "hMiddle", relative.hMiddle), "vMiddle", relative.vMiddle);
  setNumericStyleProps(element, props, {
    _prefix: "r-",
    _numDecimal: 4
  });
};
var fetchElement = function () {
  var _ref13 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee13(root, target) {
    var overlayOptions;
    return _regeneratorRuntime().wrap(function _callee13$(_context13) {
      while (1) switch (_context13.prev = _context13.next) {
        case 0:
          if (!isElement(target)) {
            _context13.next = 4;
            break;
          }
          return _context13.abrupt("return", target);
        case 4:
          if (isString(target)) {
            _context13.next = 6;
            break;
          }
          throw usageError("'target' must be an offset string or an HTMLElement | SVGElement | MathMLElement");
        case 6:
          overlayOptions = getOverlayOptions(root, target);
          _context13.next = 9;
          return createOverlay(overlayOptions);
        case 9:
          return _context13.abrupt("return", _context13.sent);
        case 10:
        case "end":
          return _context13.stop();
      }
    }, _callee13);
  }));
  return function fetchElement(_x27, _x28) {
    return _ref13.apply(this, arguments);
  };
}();
var getOverlayOptions = function getOverlayOptions(root, target) {
  var _parseScrollOffset = parseScrollOffset(target),
    reference = _parseScrollOffset.reference,
    value = _parseScrollOffset.value;
  var ovrDimension;
  if (reference === S_TOP || reference === S_BOTTOM) {
    ovrDimension = S_WIDTH;
  } else if (reference === S_LEFT || reference === S_RIGHT) {
    ovrDimension = S_HEIGHT;
  } else {
    throw usageError("Invalid offset reference: '".concat(reference, "'"));
  }
  return {
    parent: isHTMLElement(root) ? root : undefined,
    style: _defineProperty(_defineProperty({}, reference, value), ovrDimension, "100%")
  };
};
var invokeCallback = function invokeCallback(callback, element, viewData) {
  return callback.invoke(element, copyObject(viewData))["catch"](logError);
};

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

var Widget = function () {
  function Widget(element, config) {
    var _this = this;
    _classCallCheck(this, Widget);
    var id = config === null || config === void 0 ? void 0 : config.id;
    if (id) {
      var _instances$get;
      (_instances$get = instances$1.get(element)) === null || _instances$get === void 0 || (_instances$get = _instances$get.get(id)) === null || _instances$get === void 0 || _instances$get.destroy();
      instances$1.sGet(element).set(id, this);
    }
    var isDisabled = false;
    var isDestroyed = false;
    var destroyPromise;
    var enableCallbacks = newSet();
    var disableCallbacks = newSet();
    var destroyCallbacks = newSet();
    this.disable = _asyncToGenerator(_regeneratorRuntime().mark(function _callee() {
      var _iterator, _step, callback;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (isDisabled) {
              _context.next = 20;
              break;
            }
            isDisabled = true;
            _iterator = _createForOfIteratorHelper(disableCallbacks);
            _context.prev = 4;
            _iterator.s();
          case 6:
            if ((_step = _iterator.n()).done) {
              _context.next = 12;
              break;
            }
            callback = _step.value;
            _context.next = 10;
            return callback.invoke(_this);
          case 10:
            _context.next = 6;
            break;
          case 12:
            _context.next = 17;
            break;
          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](4);
            _iterator.e(_context.t0);
          case 17:
            _context.prev = 17;
            _iterator.f();
            return _context.finish(17);
          case 20:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[4, 14, 17, 20]]);
    }));
    this.enable = _asyncToGenerator(_regeneratorRuntime().mark(function _callee2() {
      var _iterator2, _step2, callback;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            if (!(!isDestroyed && isDisabled)) {
              _context2.next = 20;
              break;
            }
            isDisabled = false;
            _iterator2 = _createForOfIteratorHelper(enableCallbacks);
            _context2.prev = 4;
            _iterator2.s();
          case 6:
            if ((_step2 = _iterator2.n()).done) {
              _context2.next = 12;
              break;
            }
            callback = _step2.value;
            _context2.next = 10;
            return callback.invoke(_this);
          case 10:
            _context2.next = 6;
            break;
          case 12:
            _context2.next = 17;
            break;
          case 14:
            _context2.prev = 14;
            _context2.t0 = _context2["catch"](4);
            _iterator2.e(_context2.t0);
          case 17:
            _context2.prev = 17;
            _iterator2.f();
            return _context2.finish(17);
          case 20:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[4, 14, 17, 20]]);
    }));
    this.toggleEnable = _asyncToGenerator(_regeneratorRuntime().mark(function _callee3() {
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            if (isDestroyed) {
              _context3.next = 3;
              break;
            }
            _context3.next = 3;
            return (isDisabled ? _this.enable : _this.disable)();
          case 3:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    this.onDisable = function (handler) {
      return disableCallbacks.add(_wrapCallback(handler));
    };
    this.onEnable = function (handler) {
      return enableCallbacks.add(_wrapCallback(handler));
    };
    this.isDisabled = function () {
      return isDisabled;
    };
    this.destroy = function () {
      if (!destroyPromise) {
        destroyPromise = _asyncToGenerator(_regeneratorRuntime().mark(function _callee4() {
          var _iterator3, _step3, callback, elInstances;
          return _regeneratorRuntime().wrap(function _callee4$(_context4) {
            while (1) switch (_context4.prev = _context4.next) {
              case 0:
                isDestroyed = true;
                _context4.next = 4;
                return _this.disable();
              case 4:
                _iterator3 = _createForOfIteratorHelper(destroyCallbacks);
                _context4.prev = 5;
                _iterator3.s();
              case 7:
                if ((_step3 = _iterator3.n()).done) {
                  _context4.next = 13;
                  break;
                }
                callback = _step3.value;
                _context4.next = 11;
                return callback.invoke(_this);
              case 11:
                _context4.next = 7;
                break;
              case 13:
                _context4.next = 18;
                break;
              case 15:
                _context4.prev = 15;
                _context4.t0 = _context4["catch"](5);
                _iterator3.e(_context4.t0);
              case 18:
                _context4.prev = 18;
                _iterator3.f();
                return _context4.finish(18);
              case 21:
                enableCallbacks.clear();
                disableCallbacks.clear();
                destroyCallbacks.clear();
                if (id) {
                  elInstances = instances$1.get(element);
                  if ((elInstances === null || elInstances === void 0 ? void 0 : elInstances.get(id)) === _this) {
                    deleteKey(elInstances, id);
                    instances$1.prune(element);
                  }
                }
              case 25:
              case "end":
                return _context4.stop();
            }
          }, _callee4, null, [[5, 15, 18, 21]]);
        }))();
      }
      return destroyPromise;
    };
    this.onDestroy = function (handler) {
      return destroyCallbacks.add(_wrapCallback(handler));
    };
    this.isDestroyed = function () {
      return isDestroyed;
    };
    this.getElement = function () {
      return element;
    };
  }
  return _createClass(Widget, null, [{
    key: "get",
    value: function get(element, id) {
      var _instances$get2;
      return ((_instances$get2 = instances$1.get(element)) === null || _instances$get2 === void 0 ? void 0 : _instances$get2.get(id)) || null;
    }
  }]);
}();
var registerWidget = function () {
  var _ref5 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee6(name, newWidget, configValidator, options) {
    var _options$selector;
    var prefixedName, selector, domWatcher;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          if (!registeredWidgets.has(name)) {
            _context6.next = 2;
            break;
          }
          return _context6.abrupt("return");
        case 2:
          registeredWidgets.add(name);
          _context6.next = 5;
          return waitForInteractive();
        case 5:
          prefixedName = prefixName(name);
          selector = (_options$selector = options === null || options === void 0 ? void 0 : options.selector) !== null && _options$selector !== void 0 ? _options$selector : getDefaultWidgetSelector(prefixedName);
          if (settings.autoWidgets) {
            domWatcher = DOMWatcher.reuse();
            domWatcher.onMutation(function () {
              var _ref6 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee5(operation) {
                var element, thisConfigValidator, widgets, configSpecs, dataAttr, _i, _configSpecs, spec, _config, theseWidgets;
                return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                  while (1) switch (_context5.prev = _context5.next) {
                    case 0:
                      element = currentTargetOf(operation);
                      if (!isFunction(configValidator)) {
                        _context5.next = 7;
                        break;
                      }
                      _context5.next = 4;
                      return configValidator(element);
                    case 4:
                      _context5.t0 = _context5.sent;
                      _context5.next = 8;
                      break;
                    case 7:
                      _context5.t0 = configValidator;
                    case 8:
                      thisConfigValidator = _context5.t0;
                      widgets = [];
                      configSpecs = [];
                      dataAttr = getData(element, prefixedName);
                      if (options !== null && options !== void 0 && options.supportsMultiple) {
                        if (hasClass(element, prefixedName)) {
                          configSpecs.push("");
                        }
                        if (dataAttr !== null) {
                          configSpecs.push.apply(configSpecs, _toConsumableArray(dataAttr ? splitOn(dataAttr, ";", true) : [""]));
                        }
                      } else {
                        configSpecs.push(dataAttr !== null && dataAttr !== void 0 ? dataAttr : "");
                      }
                      _i = 0, _configSpecs = configSpecs;
                    case 14:
                      if (!(_i < _configSpecs.length)) {
                        _context5.next = 31;
                        break;
                      }
                      spec = _configSpecs[_i];
                      if (!thisConfigValidator) {
                        _context5.next = 22;
                        break;
                      }
                      _context5.next = 19;
                      return fetchWidgetConfig(spec, thisConfigValidator);
                    case 19:
                      _context5.t1 = _context5.sent;
                      _context5.next = 23;
                      break;
                    case 22:
                      _context5.t1 = undefined;
                    case 23:
                      _config = _context5.t1;
                      _context5.next = 26;
                      return newWidget(element, _config);
                    case 26:
                      theseWidgets = _context5.sent;
                      if (theseWidgets) {
                        widgets.push.apply(widgets, _toConsumableArray(toArrayIfSingle(theseWidgets)));
                      }
                    case 28:
                      _i++;
                      _context5.next = 14;
                      break;
                    case 31:
                      if (lengthOf(widgets)) {
                        domWatcher.onMutation(function () {
                          var _iterator4 = _createForOfIteratorHelper(widgets),
                            _step4;
                          try {
                            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                              var w = _step4.value;
                              w.destroy();
                            }
                          } catch (err) {
                            _iterator4.e(err);
                          } finally {
                            _iterator4.f();
                          }
                        }, {
                          target: element,
                          categories: [S_REMOVED]
                        });
                      }
                    case 32:
                    case "end":
                      return _context5.stop();
                  }
                }, _callee5);
              }));
              return function (_x5) {
                return _ref6.apply(this, arguments);
              };
            }(), {
              selector: selector,
              categories: [S_ADDED]
            });
          }
        case 8:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function registerWidget(_x, _x2, _x3, _x4) {
    return _ref5.apply(this, arguments);
  };
}();
var getWidgetConfig = function getWidgetConfig(input, validator) {
  var separator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "|";
  var config = {};
  if (!(input instanceof Object)) {
    input = toOptionsObject(input, separator);
  }
  for (var _key in validator) {
    config[_key] = validator[_key](_key, input[_key]);
  }
  return config;
};
var fetchWidgetConfig = function () {
  var _ref7 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee7(input, validator) {
    var separator,
      config,
      configPromises,
      _key2,
      _args7 = arguments;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          separator = _args7.length > 2 && _args7[2] !== undefined ? _args7[2] : "|";
          config = {};
          configPromises = getWidgetConfig(input, validator, separator);
          _context7.t0 = _regeneratorRuntime().keys(configPromises);
        case 4:
          if ((_context7.t1 = _context7.t0()).done) {
            _context7.next = 11;
            break;
          }
          _key2 = _context7.t1.value;
          _context7.next = 8;
          return configPromises[_key2];
        case 8:
          config[_key2] = _context7.sent;
          _context7.next = 4;
          break;
        case 11:
          return _context7.abrupt("return", config);
        case 12:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function fetchWidgetConfig(_x6, _x7) {
    return _ref7.apply(this, arguments);
  };
}();
var getDefaultWidgetSelector = function getDefaultWidgetSelector(prefix) {
  return ".".concat(prefix, ",[data-").concat(prefix, "]");
};
var fetchUniqueWidget = function () {
  var _ref8 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee8(name, element, Type) {
    var widget;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          widget = Type.get(element);
          if (widget) {
            _context8.next = 8;
            break;
          }
          _context8.next = 4;
          return waitForDelay(0);
        case 4:
          widget = Type.get(element);
          if (widget) {
            _context8.next = 8;
            break;
          }
          logWarn("No ".concat(name, " widget for element ").concat(formatAsString(element)));
          return _context8.abrupt("return", null);
        case 8:
          return _context8.abrupt("return", widget);
        case 9:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return function fetchUniqueWidget(_x8, _x9, _x10) {
    return _ref8.apply(this, arguments);
  };
}();
var instances$1 = newXWeakMap(function () {
  return newMap();
});
var registeredWidgets = newSet();
var toOptionsObject = function toOptionsObject(input, separator) {
  var options = {};
  var _iterator5 = _createForOfIteratorHelper(filter(splitOn(input !== null && input !== void 0 ? input : "", separator, true), function (v) {
      return !isEmpty(v);
    })),
    _step5;
  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var entry = _step5.value;
      var _splitOn = splitOn(entry, /\s*=\s*/, true, 1),
        _splitOn2 = _slicedToArray(_splitOn, 2),
        _key3 = _splitOn2[0],
        value = _splitOn2[1];
      options[kebabToCamelCase(_key3)] = value !== null && value !== void 0 ? value : "";
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }
  return options;
};

var registerAction = function registerAction(name, newAction, configValidator) {
  if (registeredActions.has(name)) {
    return;
  }
  var newActionFromSpec = function () {
    var _ref = _asyncToGenerator(_regeneratorRuntime().mark(function _callee(element, argsAndOptions) {
      var thisConfigValidator, args, config, _iterator, _step, entry;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (!isFunction(configValidator)) {
              _context.next = 6;
              break;
            }
            _context.next = 3;
            return configValidator(element);
          case 3:
            _context.t0 = _context.sent;
            _context.next = 7;
            break;
          case 6:
            _context.t0 = configValidator;
          case 7:
            thisConfigValidator = _context.t0;
            args = [];
            if (!thisConfigValidator) {
              _context.next = 15;
              break;
            }
            _context.next = 12;
            return fetchWidgetConfig(argsAndOptions, thisConfigValidator, ",");
          case 12:
            _context.t1 = _context.sent;
            _context.next = 16;
            break;
          case 15:
            _context.t1 = undefined;
          case 16:
            config = _context.t1;
            _iterator = _createForOfIteratorHelper(splitOn(argsAndOptions, ",", true));
            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                entry = _step.value;
                if (entry) {
                  if (!includes(entry, "=")) {
                    args.push(entry);
                  }
                }
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
            return _context.abrupt("return", newAction(element, args, config));
          case 20:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function newActionFromSpec(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
  registeredActions.set(name, newActionFromSpec);
};
var fetchAction = function () {
  var _ref2 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee2(element, name, argsAndOptions) {
    var newActionFromSpec;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          newActionFromSpec = registeredActions.get(name);
          if (newActionFromSpec) {
            _context2.next = 3;
            break;
          }
          throw usageError("Unknown action '".concat(name, "'"));
        case 3:
          _context2.next = 5;
          return newActionFromSpec(element, argsAndOptions || "");
        case 5:
          return _context2.abrupt("return", _context2.sent);
        case 6:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function fetchAction(_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();
var registeredActions = newMap();

var AddClass = function () {
  function AddClass(element) {
    _classCallCheck(this, AddClass);
    for (var _len = arguments.length, classNames = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      classNames[_key - 1] = arguments[_key];
    }
    var _getMethods = getMethods$7(element, classNames),
      _add = _getMethods._add,
      _remove = _getMethods._remove,
      _toggle = _getMethods._toggle;
    _remove();
    this["do"] = _add;
    this.undo = _remove;
    this[S_TOGGLE] = _toggle;
  }
  return _createClass(AddClass, null, [{
    key: "register",
    value: function register() {
      registerAction("add-class", function (element, classNames) {
        return _construct(AddClass, [element].concat(_toConsumableArray(classNames)));
      });
    }
  }]);
}();
var RemoveClass = function () {
  function RemoveClass(element) {
    _classCallCheck(this, RemoveClass);
    for (var _len2 = arguments.length, classNames = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      classNames[_key2 - 1] = arguments[_key2];
    }
    var _getMethods2 = getMethods$7(element, classNames),
      _add = _getMethods2._add,
      _remove = _getMethods2._remove,
      _toggle = _getMethods2._toggle;
    _add();
    this["do"] = _remove;
    this.undo = _add;
    this[S_TOGGLE] = _toggle;
  }
  return _createClass(RemoveClass, null, [{
    key: "register",
    value: function register() {
      registerAction("remove-class", function (element, classNames) {
        return _construct(RemoveClass, [element].concat(_toConsumableArray(classNames)));
      });
    }
  }]);
}();
var getMethods$7 = function getMethods(element, classNames) {
  return {
    _add: function _add() {
      return addClasses.apply(void 0, [element].concat(_toConsumableArray(classNames)));
    },
    _remove: function _remove() {
      return removeClasses.apply(void 0, [element].concat(_toConsumableArray(classNames)));
    },
    _toggle: function () {
      var _toggle2 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee() {
        var _iterator, _step, cls;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _iterator = _createForOfIteratorHelper(classNames);
              _context.prev = 1;
              _iterator.s();
            case 3:
              if ((_step = _iterator.n()).done) {
                _context.next = 9;
                break;
              }
              cls = _step.value;
              _context.next = 7;
              return toggleClass(element, cls);
            case 7:
              _context.next = 3;
              break;
            case 9:
              _context.next = 14;
              break;
            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](1);
              _iterator.e(_context.t0);
            case 14:
              _context.prev = 14;
              _iterator.f();
              return _context.finish(14);
            case 17:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[1, 11, 14, 17]]);
      }));
      function _toggle() {
        return _toggle2.apply(this, arguments);
      }
      return _toggle;
    }()
  };
};

var iterateAnimations = function () {
  var _ref = _asyncToGenerator(_regeneratorRuntime().mark(function _callee(element, webAnimationCallback, legacyCallback) {
    var realtime,
      _iterator,
      _step,
      animation,
      _args = arguments;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          realtime = _args.length > 3 && _args[3] !== undefined ? _args[3] : false;
          if (!("getAnimations" in element && getData(element, prefixName("test-legacy")) === null)) {
            _context.next = 9;
            break;
          }
          if (realtime) {
            _context.next = 5;
            break;
          }
          _context.next = 5;
          return waitForMeasureTime();
        case 5:
          _iterator = _createForOfIteratorHelper(element.getAnimations());
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              animation = _step.value;
              webAnimationCallback(animation);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
          _context.next = 13;
          break;
        case 9:
          if (realtime) {
            _context.next = 12;
            break;
          }
          _context.next = 12;
          return waitForMutateTime();
        case 12:
          legacyCallback(element);
        case 13:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function iterateAnimations(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var resetCssAnimationsNow = function resetCssAnimationsNow(element) {
  addClassesNow(element, PREFIX_ANIMATE_DISABLE);
  element[S_CLIENT_WIDTH];
  removeClassesNow(element, PREFIX_ANIMATE_DISABLE);
};

var Animate = function () {
  function Animate(element) {
    _classCallCheck(this, Animate);
    var logger = null;
    animate$1(element, GO_FORWARD, logger, true);
    var isFirst = true;
    this["do"] = function () {
      return animate$1(element, GO_FORWARD, logger);
    };
    this.undo = function () {
      return animate$1(element, GO_BACKWARD, logger);
    };
    this[S_TOGGLE] = function () {
      var res = animate$1(element, isFirst ? GO_FORWARD : GO_TOGGLE, logger);
      isFirst = false;
      return res;
    };
  }
  return _createClass(Animate, null, [{
    key: "register",
    value: function register() {
      registerAction("animate", function (element) {
        return new Animate(element);
      });
    }
  }]);
}();
var GO_FORWARD = 0;
var GO_BACKWARD = 1;
var GO_TOGGLE = 2;
var animate$1 = function animate(element, direction, logger) {
  var isInitial = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  return iterateAnimations(element, function (animation) {
    return setupAnimation(animation, direction, logger, isInitial);
  }, function (element) {
    return setupAnimationLegacy(element, direction, logger, isInitial);
  }, isInitial);
};
var setupAnimation = function setupAnimation(animation, direction, logger, isInitial) {
  var pauseTillReady = !isPageReady();
  var isBackward = animation.playbackRate === -1;
  if (direction === GO_TOGGLE || direction === GO_FORWARD && isBackward || direction === GO_BACKWARD && !isBackward) {
    animation.reverse();
  } else if (animation.playState === "paused") {
    animation.play();
  } else ;
  if (isInitial || pauseTillReady) {
    animation.pause();
    if (!isInitial) {
      waitForPageReady().then(function () {
        animation.play();
      });
    }
  }
  if (isInstanceOf(animation, CSSAnimation)) {
    var cancelHandler = function cancelHandler(event) {
      return onAnimationCancel(event, animation, direction, logger, isInitial);
    };
    animation.addEventListener(S_CANCEL, cancelHandler);
    animation.addEventListener("finish", function () {
      return animation.removeEventListener(S_CANCEL, cancelHandler);
    });
  }
};
var onAnimationCancel = function onAnimationCancel(event, animation, direction, logger, isInitial) {
  var _MH$targetOf;
  var target = targetOf(event);
  if (!isInstanceOf(target, Animation)) {
    return;
  }
  var effect = target.effect;
  if (!isInstanceOf(effect, KeyframeEffect)) {
    return;
  }
  var _iterator = _createForOfIteratorHelper(((_MH$targetOf = targetOf(effect)) === null || _MH$targetOf === void 0 ? void 0 : _MH$targetOf.getAnimations()) || []),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var newAnimation = _step.value;
      if (isInstanceOf(newAnimation, CSSAnimation) && newAnimation.animationName === animation.animationName) {
        setupAnimation(newAnimation, direction, logger, isInitial);
        break;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
};
var setupAnimationLegacy = function setupAnimationLegacy(element, direction, logger, isInitial) {
  var isBackward = hasClass(element, PREFIX_ANIMATE_REVERSE);
  var isPaused = hasClass(element, PREFIX_ANIMATE_PAUSE);
  var pauseTillReady = !isPageReady();
  var goBackwards = direction === GO_BACKWARD || direction === GO_TOGGLE && !isBackward;
  var doPause = isInitial || pauseTillReady;
  if (goBackwards === isBackward && doPause === isPaused) {
    return;
  }
  resetCssAnimationsNow(element);
  removeClassesNow(element, PREFIX_ANIMATE_PAUSE, PREFIX_ANIMATE_REVERSE);
  addClassesNow.apply(void 0, [element].concat(_toConsumableArray(goBackwards ? [PREFIX_ANIMATE_REVERSE] : []), _toConsumableArray(doPause ? [PREFIX_ANIMATE_PAUSE] : [])));
  if (!isInitial && pauseTillReady) {
    waitForPageReady().then(function () {
      return removeClasses(element, PREFIX_ANIMATE_PAUSE);
    });
  }
};

var AnimatePlay = function () {
  function AnimatePlay(element) {
    _classCallCheck(this, AnimatePlay);
    var _getMethods = getMethods$6(element),
      _play = _getMethods._play,
      _pause = _getMethods._pause,
      _toggle = _getMethods._toggle;
    animate(element, PAUSE, true);
    this["do"] = _play;
    this.undo = _pause;
    this[S_TOGGLE] = _toggle;
  }
  return _createClass(AnimatePlay, null, [{
    key: "register",
    value: function register() {
      registerAction("animate-play", function (element) {
        return new AnimatePlay(element);
      });
    }
  }]);
}();
var AnimatePause = function () {
  function AnimatePause(element) {
    _classCallCheck(this, AnimatePause);
    var _getMethods2 = getMethods$6(element),
      _play = _getMethods2._play,
      _pause = _getMethods2._pause,
      _toggle = _getMethods2._toggle;
    _play();
    this["do"] = _pause;
    this.undo = _play;
    this[S_TOGGLE] = _toggle;
  }
  return _createClass(AnimatePause, null, [{
    key: "register",
    value: function register() {
      registerAction("animate-pause", function (element) {
        return new AnimatePause(element);
      });
    }
  }]);
}();
var PLAY = 0;
var PAUSE = 1;
var TOGGLE = 2;
var getMethods$6 = function getMethods(element) {
  return {
    _play: function _play() {
      return animate(element, PLAY);
    },
    _pause: function _pause() {
      return animate(element, PAUSE);
    },
    _toggle: function _toggle() {
      return animate(element, TOGGLE);
    }
  };
};
var animate = function animate(element, action) {
  var isInitial = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return iterateAnimations(element, function (animation) {
    var isPaused = animation.playState === "paused";
    if (action === PLAY || isPaused && action === TOGGLE) {
      animation.play();
    } else {
      animation.pause();
    }
  }, function (element) {
    if (isInitial) {
      resetCssAnimationsNow(element);
    }
    var isPaused = hasClass(element, PREFIX_ANIMATE_PAUSE);
    if (action === PLAY || isPaused && action === TOGGLE) {
      removeClassesNow(element, PREFIX_ANIMATE_PAUSE);
    } else {
      addClassesNow(element, PREFIX_ANIMATE_PAUSE);
    }
  }, isInitial);
};

var Display = function () {
  function Display(element) {
    _classCallCheck(this, Display);
    undisplayElementNow(element);
    var _getMethods = getMethods$5(element),
      _display = _getMethods._display,
      _undisplay = _getMethods._undisplay,
      _toggle = _getMethods._toggle;
    this["do"] = _display;
    this.undo = _undisplay;
    this[S_TOGGLE] = _toggle;
  }
  return _createClass(Display, null, [{
    key: "register",
    value: function register() {
      registerAction("display", function (element) {
        return new Display(element);
      });
    }
  }]);
}();
var Undisplay = function () {
  function Undisplay(element) {
    _classCallCheck(this, Undisplay);
    displayElementNow(element);
    var _getMethods2 = getMethods$5(element),
      _display = _getMethods2._display,
      _undisplay = _getMethods2._undisplay,
      _toggle = _getMethods2._toggle;
    this["do"] = _undisplay;
    this.undo = _display;
    this[S_TOGGLE] = _toggle;
  }
  return _createClass(Undisplay, null, [{
    key: "register",
    value: function register() {
      registerAction("undisplay", function (element) {
        return new Undisplay(element);
      });
    }
  }]);
}();
var getMethods$5 = function getMethods(element) {
  return {
    _display: function () {
      var _display2 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee() {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return displayElement(element);
            case 2:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function _display() {
        return _display2.apply(this, arguments);
      }
      return _display;
    }(),
    _undisplay: function () {
      var _undisplay2 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee2() {
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return undisplayElement(element);
            case 2:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function _undisplay() {
        return _undisplay2.apply(this, arguments);
      }
      return _undisplay;
    }(),
    _toggle: function () {
      var _toggle2 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee3() {
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return toggleDisplayElement(element);
            case 2:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function _toggle() {
        return _toggle2.apply(this, arguments);
      }
      return _toggle;
    }()
  };
};

var getReferenceElement = function getReferenceElement(spec, thisElement) {
  if (!spec) {
    return thisElement;
  }
  if (spec[0] === "#") {
    var _referenceElement = getElementById(spec.slice(1));
    if (!_referenceElement) {
      return null;
    }
    return _referenceElement;
  }
  var relation = ["next", "prev", "this", "first", "last"].find(function (p) {
    return spec.startsWith("".concat(p, ".")) || spec.startsWith("".concat(p, "-")) || spec === p;
  });
  if (!relation) {
    throw usageError("Invalid search specification '".concat(spec, "'"));
  }
  var rest = spec.slice(lengthOf(relation));
  var matchOp = rest.slice(0, 1);
  var refOrCls = rest.slice(1);
  var selector;
  if (matchOp === ".") {
    selector = matchOp + refOrCls;
  } else {
    if (!refOrCls) {
      refOrCls = getData(thisElement, PREFIX_REF) || "";
    }
    if (!refOrCls) {
      throw usageError("No reference name in '".concat(spec, "'"));
    }
    selector = "[".concat(DATA_REF, "=\"").concat(refOrCls, "\"]");
  }
  var referenceElement;
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
        logError(bugError("Unhandled relation case ".concat(relation)));
        return null;
      }
    }
  }
  if (!referenceElement) {
    return null;
  }
  return referenceElement;
};
var waitForReferenceElement = function waitForReferenceElement(spec, thisElement) {
  var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;
  return waitForElement(function () {
    return getReferenceElement(spec, thisElement);
  }, timeout);
};
var PREFIX_REF = prefixName("ref");
var DATA_REF = prefixData(PREFIX_REF);
var getAllReferenceElements = function getAllReferenceElements(selector) {
  return docQuerySelectorAll(selector);
};
var getFirstReferenceElement = function getFirstReferenceElement(selector) {
  return docQuerySelector(selector);
};
var getLastReferenceElement = function getLastReferenceElement(selector) {
  var allRefs = getAllReferenceElements(selector);
  return allRefs && allRefs[lengthOf(allRefs) - 1] || null;
};
var getThisReferenceElement = function getThisReferenceElement(selector, thisElement) {
  return thisElement.closest(selector);
};
var getNextReferenceElement = function getNextReferenceElement(selector, thisElement) {
  return getNextOrPrevReferenceElement(selector, thisElement, false);
};
var getPrevReferenceElement = function getPrevReferenceElement(selector, thisElement) {
  return getNextOrPrevReferenceElement(selector, thisElement, true);
};
var getNextOrPrevReferenceElement = function getNextOrPrevReferenceElement(selector, thisElement, goBackward) {
  thisElement = getThisReferenceElement(selector, thisElement) || thisElement;
  if (!getDoc().contains(thisElement)) {
    return null;
  }
  var allRefs = getAllReferenceElements(selector);
  if (!allRefs) {
    return null;
  }
  var numRefs = lengthOf(allRefs);
  var refIndex = goBackward ? numRefs - 1 : -1;
  for (var i = 0; i < numRefs; i++) {
    var currentIsAfter = isNodeBAfterA(thisElement, allRefs[i]);
    if (allRefs[i] === thisElement || currentIsAfter) {
      refIndex = i + (goBackward ? -1 : currentIsAfter ? 0 : 1);
      break;
    }
  }
  return allRefs[refIndex] || null;
};

var Trigger = function (_Widget) {
  function Trigger(element, actions, config) {
    var _config$once, _config$oneWay, _config$doDelay, _config$undoDelay;
    var _this;
    _classCallCheck(this, Trigger);
    _this = _callSuper(this, Trigger, [element, config]);
    var once = (_config$once = config === null || config === void 0 ? void 0 : config.once) !== null && _config$once !== void 0 ? _config$once : false;
    var oneWay = (_config$oneWay = config === null || config === void 0 ? void 0 : config.oneWay) !== null && _config$oneWay !== void 0 ? _config$oneWay : false;
    var delay = (config === null || config === void 0 ? void 0 : config.delay) || 0;
    var doDelay = (_config$doDelay = config === null || config === void 0 ? void 0 : config.doDelay) !== null && _config$doDelay !== void 0 ? _config$doDelay : delay;
    var undoDelay = (_config$undoDelay = config === null || config === void 0 ? void 0 : config.undoDelay) !== null && _config$undoDelay !== void 0 ? _config$undoDelay : delay;
    var lastCallId;
    var toggleState = false;
    var callActions = function () {
      var _ref = _asyncToGenerator(_regeneratorRuntime().mark(function _callee(delay, callFn, newToggleState) {
        var myCallId, _iterator, _step, action;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!_this.isDisabled()) {
                _context.next = 2;
                break;
              }
              return _context.abrupt("return");
            case 2:
              myCallId = randId();
              lastCallId = myCallId;
              if (!delay) {
                _context.next = 11;
                break;
              }
              _context.next = 8;
              return waitForDelay(delay);
            case 8:
              if (!(lastCallId !== myCallId)) {
                _context.next = 11;
                break;
              }
              return _context.abrupt("return");
            case 11:
              _iterator = _createForOfIteratorHelper(actions);
              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  action = _step.value;
                  callFn(action);
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
              toggleState = newToggleState;
              if (toggleState && once) {
                remove(run);
                remove(reverse);
                remove(toggle);
              }
            case 15:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function callActions(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      };
    }();
    var run = _wrapCallback(function () {
      callActions(doDelay, function (action) {
        action["do"]();
      }, true);
    });
    var reverse = _wrapCallback(function () {
      if (!oneWay) {
        callActions(undoDelay, function (action) {
          action.undo();
        }, false);
      }
    });
    var toggle = _wrapCallback(function () {
      callActions(toggleState ? undoDelay : doDelay, function (action) {
        action[S_TOGGLE]();
      }, !toggleState);
    });
    _this.run = run.invoke;
    _this.reverse = reverse.invoke;
    _this[S_TOGGLE] = oneWay ? run.invoke : toggle.invoke;
    _this.getActions = function () {
      return _toConsumableArray(actions);
    };
    _this.getConfig = function () {
      return copyObject(config || {});
    };
    return _this;
  }
  _inherits(Trigger, _Widget);
  return _createClass(Trigger, null, [{
    key: "get",
    value: function get(element, id) {
      var instance = _superPropGet(Trigger, "get", this, 2)([element, id]);
      if (isInstanceOf(instance, Trigger)) {
        return instance;
      }
      return null;
    }
  }, {
    key: "register",
    value: function register() {
      registerTrigger("run", function (element, a, actions, config) {
        return new Trigger(element, actions, config);
      }, {});
    }
  }]);
}(Widget);
var registerTrigger = function registerTrigger(name, newTrigger, configValidator) {
  var clsPref = prefixName("on-".concat(name));
  var newWidget = function () {
    var _ref2 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee2(element) {
      var _getData;
      var widgets, baseConfigValidator, thisConfigValidator, allSpecs, _iterator2, _step2, cls, _iterator3, _step3, _config$actOn, spec, _splitOn, _splitOn2, tmp, configSpec, _splitOn3, _splitOn4, argSpec, allActionSpecs, _args2, _config, actionTarget, _actions, _iterator4, _step4, actionSpec, _splitOn5, _splitOn6, _name, actionArgsAndOptions;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            widgets = [];
            baseConfigValidator = newBaseConfigValidator(element);
            if (!isFunction(configValidator)) {
              _context2.next = 8;
              break;
            }
            _context2.next = 5;
            return configValidator(element);
          case 5:
            _context2.t0 = _context2.sent;
            _context2.next = 9;
            break;
          case 8:
            _context2.t0 = configValidator;
          case 9:
            thisConfigValidator = _context2.t0;
            allSpecs = splitOn((_getData = getData(element, prefixName("on-".concat(name)))) !== null && _getData !== void 0 ? _getData : "", TRIGGER_SEP, true);
            _iterator2 = _createForOfIteratorHelper(classList(element));
            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                cls = _step2.value;
                if (cls.startsWith("".concat(clsPref, "--"))) {
                  allSpecs.push(cls.slice(lengthOf(clsPref) + 2));
                }
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
            _iterator3 = _createForOfIteratorHelper(allSpecs);
            _context2.prev = 14;
            _iterator3.s();
          case 16:
            if ((_step3 = _iterator3.n()).done) {
              _context2.next = 62;
              break;
            }
            spec = _step3.value;
            _splitOn = splitOn(spec, OPTION_PREF_CHAR, true, 1), _splitOn2 = _slicedToArray(_splitOn, 2), tmp = _splitOn2[0], configSpec = _splitOn2[1];
            _splitOn3 = splitOn(tmp, ACTION_PREF_CHAR, true, 1), _splitOn4 = _slicedToArray(_splitOn3, 2), argSpec = _splitOn4[0], allActionSpecs = _splitOn4[1];
            _args2 = filterBlank(splitOn(argSpec, ",", true)) || [];
            _context2.next = 23;
            return fetchWidgetConfig(configSpec, assign(baseConfigValidator, thisConfigValidator), OPTION_PREF_CHAR);
          case 23:
            _config = _context2.sent;
            actionTarget = (_config$actOn = _config.actOn) !== null && _config$actOn !== void 0 ? _config$actOn : element;
            _actions = [];
            _iterator4 = _createForOfIteratorHelper(splitOn(allActionSpecs || "", ACTION_PREF_CHAR, true));
            _context2.prev = 27;
            _iterator4.s();
          case 29:
            if ((_step4 = _iterator4.n()).done) {
              _context2.next = 47;
              break;
            }
            actionSpec = _step4.value;
            _splitOn5 = splitOn(actionSpec, ACTION_ARGS_PREF_CHAR, true, 1), _splitOn6 = _slicedToArray(_splitOn5, 2), _name = _splitOn6[0], actionArgsAndOptions = _splitOn6[1];
            _context2.prev = 32;
            _context2.t1 = _actions;
            _context2.next = 36;
            return fetchAction(actionTarget, _name, actionArgsAndOptions || "");
          case 36:
            _context2.t2 = _context2.sent;
            _context2.t1.push.call(_context2.t1, _context2.t2);
            _context2.next = 45;
            break;
          case 40:
            _context2.prev = 40;
            _context2.t3 = _context2["catch"](32);
            if (!isInstanceOf(_context2.t3, LisnUsageError)) {
              _context2.next = 44;
              break;
            }
            return _context2.abrupt("continue", 45);
          case 44:
            throw _context2.t3;
          case 45:
            _context2.next = 29;
            break;
          case 47:
            _context2.next = 52;
            break;
          case 49:
            _context2.prev = 49;
            _context2.t4 = _context2["catch"](27);
            _iterator4.e(_context2.t4);
          case 52:
            _context2.prev = 52;
            _iterator4.f();
            return _context2.finish(52);
          case 55:
            _context2.t5 = widgets;
            _context2.next = 58;
            return newTrigger(element, _args2, _actions, _config);
          case 58:
            _context2.t6 = _context2.sent;
            _context2.t5.push.call(_context2.t5, _context2.t6);
          case 60:
            _context2.next = 16;
            break;
          case 62:
            _context2.next = 67;
            break;
          case 64:
            _context2.prev = 64;
            _context2.t7 = _context2["catch"](14);
            _iterator3.e(_context2.t7);
          case 67:
            _context2.prev = 67;
            _iterator3.f();
            return _context2.finish(67);
          case 70:
            return _context2.abrupt("return", widgets);
          case 71:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[14, 64, 67, 70], [27, 49, 52, 55], [32, 40]]);
    }));
    return function newWidget(_x4) {
      return _ref2.apply(this, arguments);
    };
  }();
  registerWidget(name, newWidget, null, {
    selector: "[class^=\"".concat(clsPref, "--\"],[class*=\" ").concat(clsPref, "--\"],[data-").concat(clsPref, "]")
  });
};
var TRIGGER_SEP = ";";
var OPTION_PREF_CHAR = "+";
var ACTION_PREF_CHAR = "@";
var ACTION_ARGS_PREF_CHAR = ":";
var newBaseConfigValidator = function newBaseConfigValidator(element) {
  return {
    id: validateString,
    once: validateBoolean,
    oneWay: validateBoolean,
    delay: validateNumber,
    doDelay: validateNumber,
    undoDelay: validateNumber,
    actOn: function actOn(key, value) {
      var _ref3;
      return (_ref3 = isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref3 !== void 0 ? _ref3 : undefined;
    }
  };
};

var Enable = function () {
  function Enable(element) {
    _classCallCheck(this, Enable);
    for (var _len = arguments.length, ids = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      ids[_key - 1] = arguments[_key];
    }
    var _getMethods = getMethods$4(element, ids),
      _enable = _getMethods._enable,
      _disable = _getMethods._disable,
      _toggleEnable = _getMethods._toggleEnable;
    _disable();
    this["do"] = _enable;
    this.undo = _disable;
    this[S_TOGGLE] = _toggleEnable;
  }
  return _createClass(Enable, null, [{
    key: "register",
    value: function register() {
      registerAction("enable", function (element, ids) {
        return _construct(Enable, [element].concat(_toConsumableArray(ids)));
      });
    }
  }]);
}();
var Disable = function () {
  function Disable(element) {
    _classCallCheck(this, Disable);
    for (var _len2 = arguments.length, ids = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      ids[_key2 - 1] = arguments[_key2];
    }
    var _getMethods2 = getMethods$4(element, ids),
      _enable = _getMethods2._enable,
      _disable = _getMethods2._disable,
      _toggleEnable = _getMethods2._toggleEnable;
    _enable();
    this["do"] = _disable;
    this.undo = _enable;
    this[S_TOGGLE] = _toggleEnable;
  }
  return _createClass(Disable, null, [{
    key: "register",
    value: function register() {
      registerAction("disable", function (element, ids) {
        return _construct(Disable, [element].concat(_toConsumableArray(ids)));
      });
    }
  }]);
}();
var Run = function () {
  function Run(element) {
    _classCallCheck(this, Run);
    for (var _len3 = arguments.length, ids = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      ids[_key3 - 1] = arguments[_key3];
    }
    var _getMethods3 = getMethods$4(element, ids),
      _run = _getMethods3._run,
      _reverse = _getMethods3._reverse,
      _toggle = _getMethods3._toggle;
    this["do"] = _run;
    this.undo = _reverse;
    this[S_TOGGLE] = _toggle;
  }
  return _createClass(Run, null, [{
    key: "register",
    value: function register() {
      registerAction("run", function (element, ids) {
        return _construct(Run, [element].concat(_toConsumableArray(ids)));
      });
    }
  }]);
}();
var getMethods$4 = function getMethods(element, ids) {
  var triggerPromises = getTriggers(element, ids);
  var call = function () {
    var _ref = _asyncToGenerator(_regeneratorRuntime().mark(function _callee(method) {
      var triggers, _iterator, _step, trigger;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return triggerPromises;
          case 2:
            triggers = _context.sent;
            _iterator = _createForOfIteratorHelper(triggers);
            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                trigger = _step.value;
                trigger[method]();
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
          case 5:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function call(_x) {
      return _ref.apply(this, arguments);
    };
  }();
  return {
    _enable: function _enable() {
      return call("enable");
    },
    _disable: function _disable() {
      return call("disable");
    },
    _toggleEnable: function _toggleEnable() {
      return call("toggleEnable");
    },
    _run: function _run() {
      return call("run");
    },
    _reverse: function _reverse() {
      return call("reverse");
    },
    _toggle: function _toggle() {
      return call(S_TOGGLE);
    }
  };
};
var getTriggers = function () {
  var _ref2 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee2(element, ids) {
    var triggers, _iterator2, _step2, id, trigger;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          triggers = [];
          if (lengthOf(ids)) {
            _context2.next = 4;
            break;
          }
          logWarn("At least 1 ID is required for enable action");
          return _context2.abrupt("return", triggers);
        case 4:
          _iterator2 = _createForOfIteratorHelper(ids);
          _context2.prev = 5;
          _iterator2.s();
        case 7:
          if ((_step2 = _iterator2.n()).done) {
            _context2.next = 20;
            break;
          }
          id = _step2.value;
          trigger = Trigger.get(element, id);
          if (trigger) {
            _context2.next = 17;
            break;
          }
          _context2.next = 13;
          return waitForDelay(0);
        case 13:
          trigger = Trigger.get(element, id);
          if (trigger) {
            _context2.next = 17;
            break;
          }
          logWarn("No trigger with ID ".concat(id, " for element ").concat(formatAsString(element)));
          return _context2.abrupt("continue", 18);
        case 17:
          triggers.push(trigger);
        case 18:
          _context2.next = 7;
          break;
        case 20:
          _context2.next = 25;
          break;
        case 22:
          _context2.prev = 22;
          _context2.t0 = _context2["catch"](5);
          _iterator2.e(_context2.t0);
        case 25:
          _context2.prev = 25;
          _iterator2.f();
          return _context2.finish(25);
        case 28:
          return _context2.abrupt("return", triggers);
        case 29:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[5, 22, 25, 28]]);
  }));
  return function getTriggers(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var ScrollTo = function () {
  function ScrollTo(element, config) {
    _classCallCheck(this, ScrollTo);
    var offset = config === null || config === void 0 ? void 0 : config.offset;
    var scrollable = config === null || config === void 0 ? void 0 : config.scrollable;
    var watcher = ScrollWatcher.reuse();
    var prevScrollTop = -1,
      prevScrollLeft = -1;
    this["do"] = _asyncToGenerator(_regeneratorRuntime().mark(function _callee() {
      var current, action;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return watcher.fetchCurrentScroll();
          case 2:
            current = _context.sent;
            prevScrollTop = current[S_SCROLL_TOP];
            prevScrollLeft = current[S_SCROLL_LEFT];
            _context.next = 7;
            return watcher.scrollTo(element, {
              offset: offset,
              scrollable: scrollable
            });
          case 7:
            action = _context.sent;
            _context.next = 10;
            return action === null || action === void 0 ? void 0 : action.waitFor();
          case 10:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    this.undo = _asyncToGenerator(_regeneratorRuntime().mark(function _callee2() {
      var action;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            if (!(prevScrollTop !== -1)) {
              _context2.next = 6;
              break;
            }
            _context2.next = 3;
            return watcher.scrollTo({
              top: prevScrollTop,
              left: prevScrollLeft
            });
          case 3:
            action = _context2.sent;
            _context2.next = 6;
            return action === null || action === void 0 ? void 0 : action.waitFor();
          case 6:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    this[S_TOGGLE] = _asyncToGenerator(_regeneratorRuntime().mark(function _callee3() {
      var start, canReverse, hasReversed, altTarget, action;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return watcher.fetchCurrentScroll();
          case 2:
            start = _context3.sent;
            canReverse = prevScrollTop !== -1;
            hasReversed = false;
            altTarget = {
              top: function top() {
                hasReversed = true;
                return prevScrollTop;
              },
              left: prevScrollLeft
            };
            _context3.next = 8;
            return watcher.scrollTo(element, canReverse ? {
              altTarget: altTarget,
              offset: offset
            } : {
              offset: offset
            });
          case 8:
            action = _context3.sent;
            _context3.next = 11;
            return action === null || action === void 0 ? void 0 : action.waitFor();
          case 11:
            if (!hasReversed) {
              prevScrollTop = start[S_SCROLL_TOP];
              prevScrollLeft = start[S_SCROLL_LEFT];
            }
          case 12:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
  }
  return _createClass(ScrollTo, null, [{
    key: "register",
    value: function register() {
      registerAction("scroll-to", function (element, args, config) {
        var offset = config ? {
          left: config.offsetX,
          top: config.offsetY
        } : undefined;
        return new ScrollTo(element, {
          scrollable: config === null || config === void 0 ? void 0 : config.scrollable,
          offset: offset
        });
      }, newConfigValidator$6);
    }
  }]);
}();
var newConfigValidator$6 = function newConfigValidator(element) {
  return {
    offsetX: function offsetX(key, value) {
      var _validateNumber;
      return (_validateNumber = validateNumber(key, value)) !== null && _validateNumber !== void 0 ? _validateNumber : 0;
    },
    offsetY: function offsetY(key, value) {
      var _validateNumber2;
      return (_validateNumber2 = validateNumber(key, value)) !== null && _validateNumber2 !== void 0 ? _validateNumber2 : 0;
    },
    scrollable: function scrollable(key, value) {
      var _ref4;
      return (_ref4 = isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref4 !== void 0 ? _ref4 : undefined;
    }
  };
};

var SetAttribute = function () {
  function SetAttribute(element, attributes) {
    _classCallCheck(this, SetAttribute);
    if (!attributes) {
      throw usageError("Attributes are required");
    }
    var isOn = false;
    var setAttrs = function () {
      var _ref = _asyncToGenerator(_regeneratorRuntime().mark(function _callee(on) {
        var attr, value, attrName;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              isOn = on;
              _context.next = 3;
              return waitForMutateTime();
            case 3:
              for (attr in attributes) {
                value = attributes[attr][on ? "on" : "off"];
                attrName = camelToKebabCase(attr);
                if (isNullish(value)) {
                  delAttr(element, attrName);
                } else {
                  setAttr(element, attrName, value);
                }
              }
            case 4:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function setAttrs(_x) {
        return _ref.apply(this, arguments);
      };
    }();
    this["do"] = function () {
      return setAttrs(true);
    };
    this.undo = function () {
      return setAttrs(false);
    };
    this[S_TOGGLE] = function () {
      return setAttrs(!isOn);
    };
    this.undo();
  }
  return _createClass(SetAttribute, null, [{
    key: "register",
    value: function register() {
      registerAction("set-attribute", function (element, args, config) {
        return new SetAttribute(element, _defineProperty({}, args[0], config || {}));
      }, configValidator$8);
    }
  }]);
}();
var configValidator$8 = {
  on: validateString,
  off: validateString
};

var Show = function () {
  function Show(element) {
    _classCallCheck(this, Show);
    disableInitialTransition(element);
    hideElement(element);
    var _getMethods = getMethods$3(element),
      _show = _getMethods._show,
      _hide = _getMethods._hide,
      _toggle = _getMethods._toggle;
    this["do"] = _show;
    this.undo = _hide;
    this[S_TOGGLE] = _toggle;
  }
  return _createClass(Show, null, [{
    key: "register",
    value: function register() {
      registerAction("show", function (element) {
        return new Show(element);
      });
    }
  }]);
}();
var Hide = function () {
  function Hide(element) {
    _classCallCheck(this, Hide);
    disableInitialTransition(element);
    showElement(element);
    var _getMethods2 = getMethods$3(element),
      _show = _getMethods2._show,
      _hide = _getMethods2._hide,
      _toggle = _getMethods2._toggle;
    this["do"] = _hide;
    this.undo = _show;
    this[S_TOGGLE] = _toggle;
  }
  return _createClass(Hide, null, [{
    key: "register",
    value: function register() {
      registerAction("hide", function (element) {
        return new Hide(element);
      });
    }
  }]);
}();
var getMethods$3 = function getMethods(element) {
  return {
    _show: function () {
      var _show2 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee() {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return showElement(element);
            case 2:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function _show() {
        return _show2.apply(this, arguments);
      }
      return _show;
    }(),
    _hide: function () {
      var _hide2 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee2() {
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return hideElement(element);
            case 2:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function _hide() {
        return _hide2.apply(this, arguments);
      }
      return _hide;
    }(),
    _toggle: function () {
      var _toggle2 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee3() {
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return toggleShowElement(element);
            case 2:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function _toggle() {
        return _toggle2.apply(this, arguments);
      }
      return _toggle;
    }()
  };
};

var isValidPosition = function isValidPosition(position) {
  return includes(POSITIONS, position);
};
var isValidTwoFoldPosition = function isValidTwoFoldPosition(position) {
  return position.match(TWO_FOLD_POSITION_REGEX) !== null;
};
var POSITIONS = [S_TOP, S_BOTTOM, S_LEFT, S_RIGHT];
var POSITIONS_OPTIONS_STR = "(" + POSITIONS.join("|") + ")";
var TWO_FOLD_POSITION_REGEX = RegExp("^".concat(POSITIONS_OPTIONS_STR, "-").concat(POSITIONS_OPTIONS_STR, "$"));

var registerOpenable = function registerOpenable(name, newOpenable, configValidator) {
  registerWidget(name, function (element, config) {
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
var Openable = function (_Widget) {
  function Openable(element, properties) {
    var _this;
    _classCallCheck(this, Openable);
    _this = _callSuper(this, Openable, [element]);
    var isModal = properties.isModal,
      isOffcanvas = properties.isOffcanvas;
    var openCallbacks = newSet();
    var closeCallbacks = newSet();
    var isOpen = false;
    var open = function () {
      var _ref = _asyncToGenerator(_regeneratorRuntime().mark(function _callee() {
        var _iterator, _step, callback;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!(_this.isDisabled() || isOpen)) {
                _context.next = 2;
                break;
              }
              return _context.abrupt("return");
            case 2:
              isOpen = true;
              _iterator = _createForOfIteratorHelper(openCallbacks);
              _context.prev = 4;
              _iterator.s();
            case 6:
              if ((_step = _iterator.n()).done) {
                _context.next = 12;
                break;
              }
              callback = _step.value;
              _context.next = 10;
              return callback.invoke(_this);
            case 10:
              _context.next = 6;
              break;
            case 12:
              _context.next = 17;
              break;
            case 14:
              _context.prev = 14;
              _context.t0 = _context["catch"](4);
              _iterator.e(_context.t0);
            case 17:
              _context.prev = 17;
              _iterator.f();
              return _context.finish(17);
            case 20:
              if (isModal) {
                setHasModal();
              }
              _context.next = 23;
              return setBoolData(root, PREFIX_IS_OPEN);
            case 23:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[4, 14, 17, 20]]);
      }));
      return function open() {
        return _ref.apply(this, arguments);
      };
    }();
    var close = function () {
      var _ref2 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee2() {
        var _iterator2, _step2, callback;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!(_this.isDisabled() || !isOpen)) {
                _context2.next = 2;
                break;
              }
              return _context2.abrupt("return");
            case 2:
              isOpen = false;
              _iterator2 = _createForOfIteratorHelper(closeCallbacks);
              _context2.prev = 4;
              _iterator2.s();
            case 6:
              if ((_step2 = _iterator2.n()).done) {
                _context2.next = 12;
                break;
              }
              callback = _step2.value;
              _context2.next = 10;
              return callback.invoke(_this);
            case 10:
              _context2.next = 6;
              break;
            case 12:
              _context2.next = 17;
              break;
            case 14:
              _context2.prev = 14;
              _context2.t0 = _context2["catch"](4);
              _iterator2.e(_context2.t0);
            case 17:
              _context2.prev = 17;
              _iterator2.f();
              return _context2.finish(17);
            case 20:
              if (isModal) {
                delHasModal();
              }
              if (isOffcanvas) {
                scrollWrapperToTop();
              }
              _context2.next = 24;
              return unsetBoolData(root, PREFIX_IS_OPEN);
            case 24:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[4, 14, 17, 20]]);
      }));
      return function close() {
        return _ref2.apply(this, arguments);
      };
    }();
    var scrollWrapperToTop = function () {
      var _ref3 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee3() {
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return waitForDelay(1000);
            case 2:
              _context3.next = 4;
              return waitForMeasureTime();
            case 4:
              elScrollTo(outerWrapper, {
                top: 0,
                left: 0
              });
            case 5:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      return function scrollWrapperToTop() {
        return _ref3.apply(this, arguments);
      };
    }();
    _this.open = open;
    _this.close = close;
    _this[S_TOGGLE] = function () {
      return isOpen ? close() : open();
    };
    _this.onOpen = function (handler) {
      return openCallbacks.add(_wrapCallback(handler));
    };
    _this.onClose = function (handler) {
      return closeCallbacks.add(_wrapCallback(handler));
    };
    _this.isOpen = function () {
      return isOpen;
    };
    _this.getRoot = function () {
      return root;
    };
    _this.getContainer = function () {
      return container;
    };
    _this.getTriggers = function () {
      return _toConsumableArray(triggers.keys());
    };
    _this.getTriggerConfigs = function () {
      return newMap(_toConsumableArray(triggers.entries()));
    };
    _this.onDestroy(function () {
      openCallbacks.clear();
      closeCallbacks.clear();
    });
    var _setupElements = setupElements(_this, element, properties),
      root = _setupElements.root,
      container = _setupElements.container,
      triggers = _setupElements.triggers,
      outerWrapper = _setupElements.outerWrapper;
    return _this;
  }
  _inherits(Openable, _Widget);
  return _createClass(Openable, null, [{
    key: "get",
    value: function get(element) {
      return instances.get(element) || null;
    }
  }]);
}(Widget);
var Collapsible = function (_Openable) {
  function Collapsible(element, config) {
    var _config$autoClose, _config$reverse;
    var _this2;
    _classCallCheck(this, Collapsible);
    var isHorizontal = config === null || config === void 0 ? void 0 : config.horizontal;
    var orientation = isHorizontal ? S_HORIZONTAL : S_VERTICAL;
    var onSetup = function onSetup() {
      var _iterator3 = _createForOfIteratorHelper(_this2.getTriggerConfigs().entries()),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _step3$value = _slicedToArray(_step3.value, 2),
            trigger = _step3$value[0],
            triggerConfig = _step3$value[1];
          insertCollapsibleIcon(trigger, triggerConfig, _assertThisInitialized(_this2), config);
          setDataNow(trigger, PREFIX_ORIENTATION, orientation);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    };
    _this2 = _callSuper(this, Collapsible, [element, {
      name: WIDGET_NAME_COLLAPSIBLE,
      id: config === null || config === void 0 ? void 0 : config.id,
      className: config === null || config === void 0 ? void 0 : config.className,
      autoClose: (_config$autoClose = config === null || config === void 0 ? void 0 : config.autoClose) !== null && _config$autoClose !== void 0 ? _config$autoClose : false,
      isModal: false,
      isOffcanvas: false,
      closeButton: false,
      triggers: config === null || config === void 0 ? void 0 : config.triggers,
      wrapTriggers: true,
      onSetup: onSetup
    }]);
    var root = _this2.getRoot();
    var wrapper = childrenOf(root)[0];
    setData(root, PREFIX_ORIENTATION, orientation);
    setBoolData(root, PREFIX_REVERSE, (_config$reverse = config === null || config === void 0 ? void 0 : config.reverse) !== null && _config$reverse !== void 0 ? _config$reverse : false);
    disableInitialTransition(element, 100);
    disableInitialTransition(root, 100);
    disableInitialTransition(wrapper, 100);
    var disableTransitionTimer = null;
    var tempEnableTransition = function () {
      var _ref4 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee4() {
        var transitionDuration;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return removeClasses(root, PREFIX_TRANSITION_DISABLE);
            case 2:
              _context4.next = 4;
              return removeClasses(wrapper, PREFIX_TRANSITION_DISABLE);
            case 4:
              if (disableTransitionTimer) {
                clearTimer(disableTransitionTimer);
              }
              _context4.next = 7;
              return getMaxTransitionDuration(root);
            case 7:
              transitionDuration = _context4.sent;
              disableTransitionTimer = setTimer(function () {
                if (_this2.isOpen()) {
                  addClasses(root, PREFIX_TRANSITION_DISABLE);
                  addClasses(wrapper, PREFIX_TRANSITION_DISABLE);
                  disableTransitionTimer = null;
                }
              }, transitionDuration);
            case 9:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      return function tempEnableTransition() {
        return _ref4.apply(this, arguments);
      };
    }();
    _this2.onOpen(tempEnableTransition);
    _this2.onClose(tempEnableTransition);
    var peek = config === null || config === void 0 ? void 0 : config.peek;
    if (peek) {
      _asyncToGenerator(_regeneratorRuntime().mark(function _callee5() {
        var peekSize;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              peekSize = null;
              if (!isString(peek)) {
                _context5.next = 5;
                break;
              }
              peekSize = peek;
              _context5.next = 8;
              break;
            case 5:
              _context5.next = 7;
              return getStyleProp(element, VAR_PEEK_SIZE);
            case 7:
              peekSize = _context5.sent;
            case 8:
              addClasses(root, PREFIX_PEEK);
              if (peekSize) {
                setStyleProp(root, VAR_PEEK_SIZE, peekSize);
              }
            case 10:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      }))();
    }
    if (isHorizontal) {
      var updateWidth = function () {
        var _ref6 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee6() {
          var width;
          return _regeneratorRuntime().wrap(function _callee6$(_context6) {
            while (1) switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return getComputedStyleProp(root, S_WIDTH);
              case 2:
                width = _context6.sent;
                _context6.next = 5;
                return setStyleProp(element, VAR_JS_COLLAPSIBLE_WIDTH, width);
              case 5:
              case "end":
                return _context6.stop();
            }
          }, _callee6);
        }));
        return function updateWidth() {
          return _ref6.apply(this, arguments);
        };
      }();
      setTimer(updateWidth);
      _this2.onClose(updateWidth);
      _this2.onOpen(_asyncToGenerator(_regeneratorRuntime().mark(function _callee7() {
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return updateWidth();
            case 2:
              waitForDelay(2000).then(function () {
                if (_this2.isOpen()) {
                  delStyleProp(element, VAR_JS_COLLAPSIBLE_WIDTH);
                }
              });
            case 3:
            case "end":
              return _context7.stop();
          }
        }, _callee7);
      })));
    }
    return _this2;
  }
  _inherits(Collapsible, _Openable);
  return _createClass(Collapsible, null, [{
    key: "register",
    value: function register() {
      registerOpenable(WIDGET_NAME_COLLAPSIBLE, function (el, config) {
        return new Collapsible(el, config);
      }, collapsibleConfigValidator);
    }
  }]);
}(Openable);
var Popup = function (_Openable2) {
  function Popup(element, config) {
    var _config$autoClose2, _config$closeButton, _config$position;
    var _this3;
    _classCallCheck(this, Popup);
    _this3 = _callSuper(this, Popup, [element, {
      name: WIDGET_NAME_POPUP,
      id: config === null || config === void 0 ? void 0 : config.id,
      className: config === null || config === void 0 ? void 0 : config.className,
      autoClose: (_config$autoClose2 = config === null || config === void 0 ? void 0 : config.autoClose) !== null && _config$autoClose2 !== void 0 ? _config$autoClose2 : true,
      isModal: false,
      isOffcanvas: false,
      closeButton: (_config$closeButton = config === null || config === void 0 ? void 0 : config.closeButton) !== null && _config$closeButton !== void 0 ? _config$closeButton : false,
      triggers: config === null || config === void 0 ? void 0 : config.triggers
    }]);
    var root = _this3.getRoot();
    var container = _this3.getContainer();
    var position = (_config$position = config === null || config === void 0 ? void 0 : config.position) !== null && _config$position !== void 0 ? _config$position : S_AUTO;
    if (position !== S_AUTO) {
      setData(root, PREFIX_PLACE, position);
    }
    if (container && position === S_AUTO) {
      _this3.onOpen(_asyncToGenerator(_regeneratorRuntime().mark(function _callee8() {
        var _yield$MH$promiseAll, _yield$MH$promiseAll2, contentSize, containerView, placement;
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return promiseAll([SizeWatcher.reuse().fetchCurrentSize(element), ViewWatcher.reuse().fetchCurrentView(container)]);
            case 2:
              _yield$MH$promiseAll = _context8.sent;
              _yield$MH$promiseAll2 = _slicedToArray(_yield$MH$promiseAll, 2);
              contentSize = _yield$MH$promiseAll2[0];
              containerView = _yield$MH$promiseAll2[1];
              _context8.next = 8;
              return fetchPopupPlacement(contentSize, containerView);
            case 8:
              placement = _context8.sent;
              if (!placement) {
                _context8.next = 12;
                break;
              }
              _context8.next = 12;
              return setData(root, PREFIX_PLACE, placement);
            case 12:
            case "end":
              return _context8.stop();
          }
        }, _callee8);
      })));
    }
    return _this3;
  }
  _inherits(Popup, _Openable2);
  return _createClass(Popup, null, [{
    key: "register",
    value: function register() {
      registerOpenable(WIDGET_NAME_POPUP, function (el, config) {
        return new Popup(el, config);
      }, popupConfigValidator);
    }
  }]);
}(Openable);
var Modal = function (_Openable3) {
  function Modal(element, config) {
    var _config$autoClose3, _config$closeButton2;
    _classCallCheck(this, Modal);
    return _callSuper(this, Modal, [element, {
      name: WIDGET_NAME_MODAL,
      id: config === null || config === void 0 ? void 0 : config.id,
      className: config === null || config === void 0 ? void 0 : config.className,
      autoClose: (_config$autoClose3 = config === null || config === void 0 ? void 0 : config.autoClose) !== null && _config$autoClose3 !== void 0 ? _config$autoClose3 : true,
      isModal: true,
      isOffcanvas: true,
      closeButton: (_config$closeButton2 = config === null || config === void 0 ? void 0 : config.closeButton) !== null && _config$closeButton2 !== void 0 ? _config$closeButton2 : true,
      triggers: config === null || config === void 0 ? void 0 : config.triggers
    }]);
  }
  _inherits(Modal, _Openable3);
  return _createClass(Modal, null, [{
    key: "register",
    value: function register() {
      registerOpenable(WIDGET_NAME_MODAL, function (el, config) {
        return new Modal(el, config);
      }, modalConfigValidator);
    }
  }]);
}(Openable);
var Offcanvas = function (_Openable4) {
  function Offcanvas(element, config) {
    var _config$autoClose4, _config$closeButton3;
    var _this4;
    _classCallCheck(this, Offcanvas);
    _this4 = _callSuper(this, Offcanvas, [element, {
      name: WIDGET_NAME_OFFCANVAS,
      id: config === null || config === void 0 ? void 0 : config.id,
      className: config === null || config === void 0 ? void 0 : config.className,
      autoClose: (_config$autoClose4 = config === null || config === void 0 ? void 0 : config.autoClose) !== null && _config$autoClose4 !== void 0 ? _config$autoClose4 : true,
      isModal: false,
      isOffcanvas: true,
      closeButton: (_config$closeButton3 = config === null || config === void 0 ? void 0 : config.closeButton) !== null && _config$closeButton3 !== void 0 ? _config$closeButton3 : true,
      triggers: config === null || config === void 0 ? void 0 : config.triggers
    }]);
    var position = (config === null || config === void 0 ? void 0 : config.position) || S_RIGHT;
    setData(_this4.getRoot(), PREFIX_PLACE, position);
    return _this4;
  }
  _inherits(Offcanvas, _Openable4);
  return _createClass(Offcanvas, null, [{
    key: "register",
    value: function register() {
      registerOpenable(WIDGET_NAME_OFFCANVAS, function (el, config) {
        return new Offcanvas(el, config);
      }, offcanvasConfigValidator);
    }
  }]);
}(Openable);
var instances = newWeakMap();
var WIDGET_NAME_COLLAPSIBLE = "collapsible";
var WIDGET_NAME_POPUP = "popup";
var WIDGET_NAME_MODAL = "modal";
var WIDGET_NAME_OFFCANVAS = "offcanvas";
var PREFIX_CLOSE_BTN = prefixName("close-button");
var PREFIX_IS_OPEN = prefixName("is-open");
var PREFIX_REVERSE = prefixName(S_REVERSE);
var PREFIX_PEEK = prefixName("peek");
var PREFIX_OPENS_ON_HOVER = prefixName("opens-on-hover");
var PREFIX_LINE = prefixName("line");
var PREFIX_ICON_POSITION = prefixName("icon-position");
var PREFIX_TRIGGER_ICON = prefixName("trigger-icon");
var PREFIX_ICON_WRAPPER = prefixName("icon-wrapper");
var S_AUTO = "auto";
var S_ARIA_EXPANDED = ARIA_PREFIX + "expanded";
var S_ARIA_MODAL = ARIA_PREFIX + "modal";
var VAR_PEEK_SIZE = prefixCssVar("peek-size");
var VAR_JS_COLLAPSIBLE_WIDTH = prefixCssJsVar("collapsible-width");
var MIN_CLICK_TIME_AFTER_HOVER_OPEN = 1000;
var S_ARROW_UP = "".concat(S_ARROW, "-").concat(S_UP);
var S_ARROW_DOWN = "".concat(S_ARROW, "-").concat(S_DOWN);
var S_ARROW_LEFT = "".concat(S_ARROW, "-").concat(S_LEFT);
var S_ARROW_RIGHT = "".concat(S_ARROW, "-").concat(S_RIGHT);
var ARROW_TYPES = [S_ARROW_UP, S_ARROW_DOWN, S_ARROW_LEFT, S_ARROW_RIGHT];
var ICON_CLOSED_TYPES = ["plus"].concat(ARROW_TYPES);
var ICON_OPEN_TYPES = ["minus", "x"].concat(ARROW_TYPES);
var isValidIconClosed = function isValidIconClosed(value) {
  return includes(ICON_CLOSED_TYPES, value);
};
var isValidIconOpen = function isValidIconOpen(value) {
  return includes(ICON_OPEN_TYPES, value);
};
var triggerConfigValidator = {
  id: validateString,
  className: function className(key, value) {
    return validateStrList(key, toArrayIfSingle(value));
  },
  autoClose: validateBoolean,
  icon: function icon(key, value) {
    return value && toBool(value) === false ? false : validateString(key, value, isValidPosition);
  },
  iconClosed: function iconClosed(key, value) {
    return validateString(key, value, isValidIconClosed);
  },
  iconOpen: function iconOpen(key, value) {
    return validateString(key, value, isValidIconOpen);
  },
  hover: validateBoolean
};
var collapsibleConfigValidator = {
  id: validateString,
  className: function className(key, value) {
    return validateStrList(key, toArrayIfSingle(value));
  },
  horizontal: validateBoolean,
  reverse: validateBoolean,
  peek: validateBooleanOrString,
  autoClose: validateBoolean,
  icon: function icon(key, value) {
    return toBool(value) === false ? false : validateString(key, value, isValidPosition);
  },
  iconClosed: function iconClosed(key, value) {
    return validateString(key, value, isValidIconClosed);
  },
  iconOpen: function iconOpen(key, value) {
    return validateString(key, value, isValidIconOpen);
  }
};
var popupConfigValidator = {
  id: validateString,
  className: function className(key, value) {
    return validateStrList(key, toArrayIfSingle(value));
  },
  closeButton: validateBoolean,
  position: function position(key, value) {
    return validateString(key, value, function (v) {
      return v === S_AUTO || isValidPosition(v) || isValidTwoFoldPosition(v);
    });
  },
  autoClose: validateBoolean
};
var modalConfigValidator = {
  id: validateString,
  className: function className(key, value) {
    return validateStrList(key, toArrayIfSingle(value));
  },
  closeButton: validateBoolean,
  autoClose: validateBoolean
};
var offcanvasConfigValidator = {
  id: validateString,
  className: function className(key, value) {
    return validateStrList(key, toArrayIfSingle(value));
  },
  closeButton: validateBoolean,
  position: function position(key, value) {
    return validateString(key, value, isValidPosition);
  },
  autoClose: validateBoolean
};
var getPrefixedNames = function getPrefixedNames(name) {
  var pref = prefixName(name);
  return {
    _root: "".concat(pref, "__root"),
    _overlay: "".concat(pref, "__overlay"),
    _innerWrapper: "".concat(pref, "__inner-wrapper"),
    _outerWrapper: "".concat(pref, "__outer-wrapper"),
    _content: "".concat(pref, "__content"),
    _container: "".concat(pref, "__container"),
    _trigger: "".concat(pref, "__trigger"),
    _containerForSelect: "".concat(pref, "-container"),
    _triggerForSelect: "".concat(pref, "-trigger"),
    _contentId: "".concat(pref, "-content-id")
  };
};
var findContainer = function findContainer(content, cls) {
  var currWidget = instances.get(content);
  var childRef = (currWidget === null || currWidget === void 0 ? void 0 : currWidget.getRoot()) || content;
  if (!parentOf(childRef)) {
    childRef = content;
  }
  var container = childRef.closest(".".concat(cls));
  if (!container) {
    container = parentOf(childRef);
  }
  return container;
};
var findTriggers = function findTriggers(content, prefixedNames) {
  var container = findContainer(content, prefixedNames._containerForSelect);
  var getTriggerSelector = function getTriggerSelector(suffix) {
    return ".".concat(prefixedNames._triggerForSelect).concat(suffix, ",") + "[data-".concat(prefixedNames._triggerForSelect, "]").concat(suffix);
  };
  var contentId = getData(content, prefixedNames._contentId);
  var triggers = [];
  if (contentId) {
    triggers = _toConsumableArray(docQuerySelectorAll(getTriggerSelector("[data-".concat(prefixedNames._contentId, "=\"").concat(contentId, "\"]"))));
  } else if (container) {
    triggers = _toConsumableArray(arrayFrom(querySelectorAll(container, getTriggerSelector(":not([data-".concat(prefixedNames._contentId, "])")))).filter(function (t) {
      return !content.contains(t);
    }));
  }
  return triggers;
};
var getTriggersFrom = function getTriggersFrom(content, inputTriggers, wrapTriggers, prefixedNames) {
  var triggerMap = newMap();
  inputTriggers = inputTriggers || findTriggers(content, prefixedNames);
  var addTrigger = function addTrigger(trigger, triggerConfig) {
    if (wrapTriggers) {
      var wrapper = createElement(isInlineTag(tagName(trigger)) ? "span" : "div");
      wrapElement(trigger, {
        wrapper: wrapper,
        ignoreMove: true
      });
      trigger = wrapper;
    }
    triggerMap.set(trigger, triggerConfig);
  };
  if (isArray(inputTriggers)) {
    var _iterator4 = _createForOfIteratorHelper(inputTriggers),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var trigger = _step4.value;
        addTrigger(trigger, getWidgetConfig(getData(trigger, prefixedNames._triggerForSelect), triggerConfigValidator));
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
  } else if (isInstanceOf(inputTriggers, Map)) {
    var _iterator5 = _createForOfIteratorHelper(inputTriggers.entries()),
      _step5;
    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var _step5$value = _slicedToArray(_step5.value, 2),
          _trigger = _step5$value[0],
          triggerConfig = _step5$value[1];
        addTrigger(_trigger, getWidgetConfig(triggerConfig, triggerConfigValidator));
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
  }
  return triggerMap;
};
var setupElements = function setupElements(widget, content, properties) {
  var _properties$wrapTrigg;
  var prefixedNames = getPrefixedNames(properties.name);
  var container = findContainer(content, prefixedNames._containerForSelect);
  var wrapTriggers = (_properties$wrapTrigg = properties.wrapTriggers) !== null && _properties$wrapTrigg !== void 0 ? _properties$wrapTrigg : false;
  var triggers = getTriggersFrom(content, properties.triggers, wrapTriggers, prefixedNames);
  var innerWrapper = createElement("div");
  addClasses(innerWrapper, prefixedNames._innerWrapper);
  var outerWrapper = wrapElementNow(innerWrapper);
  var root;
  var placeholder;
  if (properties.isOffcanvas) {
    addClasses(outerWrapper, prefixedNames._outerWrapper);
    root = wrapElementNow(outerWrapper);
    placeholder = createElement("div");
    var overlay = createElement("div");
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
    addClassesNow.apply(void 0, [root].concat(_toConsumableArray(toArrayIfSingle(properties.className))));
  }
  unsetBoolData(root, PREFIX_IS_OPEN);
  var domID = getOrAssignID(root, properties.name);
  if (properties.isModal) {
    setAttr(root, S_ROLE, "dialog");
    setAttr(root, S_ARIA_MODAL);
  }
  addClasses(root, prefixedNames._root);
  disableInitialTransition(root);
  if (properties.closeButton) {
    var closeBtn = createButton("Close");
    addClasses(closeBtn, PREFIX_CLOSE_BTN);
    addEventListenerTo(closeBtn, S_CLICK, function () {
      widget.close();
    });
    moveElement(closeBtn, {
      to: properties.isOffcanvas ? root : innerWrapper
    });
  }
  for (var _i = 0, _arr = [settings.lightThemeClassName, settings.darkThemeClassName]; _i < _arr.length; _i++) {
    var cls = _arr[_i];
    if (hasClass(content, cls)) {
      addClasses(root, cls);
    }
  }
  var elements = {
    content: content,
    root: root,
    container: container,
    outerWrapper: outerWrapper,
    triggers: triggers
  };
  widget.onClose(_asyncToGenerator(_regeneratorRuntime().mark(function _callee9() {
    var _iterator6, _step6, trigger;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _iterator6 = _createForOfIteratorHelper(triggers.keys());
          _context9.prev = 1;
          _iterator6.s();
        case 3:
          if ((_step6 = _iterator6.n()).done) {
            _context9.next = 11;
            break;
          }
          trigger = _step6.value;
          delData(trigger, PREFIX_OPENS_ON_HOVER);
          unsetAttr(trigger, S_ARIA_EXPANDED);
          _context9.next = 9;
          return unsetBoolData(trigger, PREFIX_IS_OPEN);
        case 9:
          _context9.next = 3;
          break;
        case 11:
          _context9.next = 16;
          break;
        case 13:
          _context9.prev = 13;
          _context9.t0 = _context9["catch"](1);
          _iterator6.e(_context9.t0);
        case 16:
          _context9.prev = 16;
          _iterator6.f();
          return _context9.finish(16);
        case 19:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[1, 13, 16, 19]]);
  })));
  widget.onDestroy(_asyncToGenerator(_regeneratorRuntime().mark(function _callee10() {
    var _iterator7, _step7, _step7$value, trigger, triggerConfig, _i2, _arr2, el;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return waitForMutateTime();
        case 2:
          replaceElementNow(placeholder, content, {
            ignoreMove: true
          });
          moveElementNow(root);
          removeClassesNow(content, prefixedNames._content);
          if (container) {
            removeClassesNow(container, prefixedNames._container);
          }
          _iterator7 = _createForOfIteratorHelper(triggers.entries());
          try {
            for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
              _step7$value = _slicedToArray(_step7.value, 2), trigger = _step7$value[0], triggerConfig = _step7$value[1];
              delAttr(trigger, S_ARIA_CONTROLS);
              delAttr(trigger, S_ARIA_EXPANDED);
              delDataNow(trigger, PREFIX_OPENS_ON_HOVER);
              delDataNow(trigger, PREFIX_IS_OPEN);
              removeClassesNow.apply(void 0, [trigger, prefixedNames._trigger].concat(_toConsumableArray((triggerConfig === null || triggerConfig === void 0 ? void 0 : triggerConfig.className) || [])));
              if (trigger.id === (triggerConfig === null || triggerConfig === void 0 ? void 0 : triggerConfig.id)) {
                trigger.id = "";
              }
              if (wrapTriggers) {
                replaceElementNow(trigger, childrenOf(trigger)[0], {
                  ignoreMove: true
                });
              }
            }
          } catch (err) {
            _iterator7.e(err);
          } finally {
            _iterator7.f();
          }
          triggers.clear();
          for (_i2 = 0, _arr2 = [content].concat(_toConsumableArray(triggers.keys())); _i2 < _arr2.length; _i2++) {
            el = _arr2[_i2];
            if (instances.get(el) === widget) {
              deleteKey(instances, el);
            }
          }
        case 10:
        case "end":
          return _context10.stop();
      }
    }, _callee10);
  })));
  var currWidget = instances.get(content);
  for (var _i3 = 0, _arr3 = [content].concat(_toConsumableArray(triggers.keys())); _i3 < _arr3.length; _i3++) {
    var el = _arr3[_i3];
    instances.set(el, widget);
  }
  waitForInteractive().then(currWidget === null || currWidget === void 0 ? void 0 : currWidget.destroy).then(waitForMutateTime).then(function () {
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
    var _iterator8 = _createForOfIteratorHelper(triggers.entries()),
      _step8;
    try {
      for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
        var _step8$value = _slicedToArray(_step8.value, 2),
          trigger = _step8$value[0],
          triggerConfig = _step8$value[1];
        setAttr(trigger, S_ARIA_CONTROLS, domID);
        unsetAttr(trigger, S_ARIA_EXPANDED);
        setBoolDataNow(trigger, PREFIX_OPENS_ON_HOVER, triggerConfig[S_HOVER]);
        unsetBoolDataNow(trigger, PREFIX_IS_OPEN);
        addClassesNow.apply(void 0, [trigger, prefixedNames._trigger].concat(_toConsumableArray((triggerConfig === null || triggerConfig === void 0 ? void 0 : triggerConfig.className) || [])));
        if (triggerConfig !== null && triggerConfig !== void 0 && triggerConfig.id) {
          trigger.id = triggerConfig.id;
        }
      }
    } catch (err) {
      _iterator8.e(err);
    } finally {
      _iterator8.f();
    }
    setupListeners(widget, elements, properties, prefixedNames);
    if (properties.onSetup) {
      properties.onSetup();
    }
  });
  return elements;
};
var setupListeners = function setupListeners(widget, elements, properties, prefixedNames) {
  var content = elements.content,
    root = elements.root,
    triggers = elements.triggers;
  var doc = getDoc();
  var hoverTimeOpened = 0;
  var isPointerOver = false;
  var activeTrigger = null;
  var isTrigger = function isTrigger(element) {
    return includes(arrayFrom(triggers.keys()), element.closest(getDefaultWidgetSelector(prefixedNames._trigger)));
  };
  var shouldPreventDefault = function shouldPreventDefault(trigger) {
    var _triggers$get$prevent, _triggers$get;
    return (_triggers$get$prevent = (_triggers$get = triggers.get(trigger)) === null || _triggers$get === void 0 ? void 0 : _triggers$get.preventDefault) !== null && _triggers$get$prevent !== void 0 ? _triggers$get$prevent : true;
  };
  var usesHover = function usesHover(trigger) {
    var _triggers$get2;
    return (_triggers$get2 = triggers.get(trigger)) === null || _triggers$get2 === void 0 ? void 0 : _triggers$get2.hover;
  };
  var usesAutoClose = function usesAutoClose(trigger) {
    var _ref11, _triggers$get3;
    return (_ref11 = trigger ? (_triggers$get3 = triggers.get(trigger)) === null || _triggers$get3 === void 0 ? void 0 : _triggers$get3.autoClose : null) !== null && _ref11 !== void 0 ? _ref11 : properties.autoClose;
  };
  var toggleTrigger = function toggleTrigger(event, openIt) {
    var trigger = currentTargetOf(event);
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
  var setIsPointerOver = function setIsPointerOver() {
    isPointerOver = true;
  };
  var unsetIsPointerOver = function unsetIsPointerOver(event) {
    isPointerOver = isPointerOver && isTouchPointerEvent(event);
  };
  var pointerEntered = function pointerEntered(event) {
    setIsPointerOver();
    if (!widget.isOpen()) {
      hoverTimeOpened = timeNow();
      toggleTrigger(event, true);
    }
  };
  var pointerLeft = function pointerLeft(event) {
    unsetIsPointerOver(event);
    var trigger = currentTargetOf(event);
    if (isElement(trigger) && usesAutoClose(trigger)) {
      setTimer(function () {
        if (!isPointerOver) {
          widget.close();
        }
      }, properties.isOffcanvas ? 300 : 50);
    }
  };
  var closeIfEscape = function closeIfEscape(event) {
    if (event.key === "Escape") {
      widget.close();
    }
  };
  var closeIfClickOutside = function closeIfClickOutside(event) {
    var target = targetOf(event);
    if (target === doc || isElement(target) && !content.contains(target) && !isTrigger(target)) {
      widget.close();
    }
  };
  var maybeSetupAutoCloseListeners = function maybeSetupAutoCloseListeners(trigger, remove) {
    if (usesAutoClose(trigger)) {
      var addOrRemove = remove ? removeEventListenerFrom : addEventListenerTo;
      addOrRemove(doc, "keyup", closeIfEscape);
      setTimer(function () {
        return addOrRemove(doc, S_CLICK, closeIfClickOutside);
      }, 100);
      if (trigger && usesHover(trigger)) {
        addOrRemove(trigger, S_POINTERLEAVE, pointerLeft);
      }
    }
  };
  var setupOrCleanup = function setupOrCleanup(remove) {
    var addOrRemove = remove ? removeEventListenerFrom : addEventListenerTo;
    var _iterator9 = _createForOfIteratorHelper(triggers.entries()),
      _step9;
    try {
      for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
        var _step9$value = _slicedToArray(_step9.value, 2),
          trigger = _step9$value[0],
          triggerConfig = _step9$value[1];
        addOrRemove(trigger, S_CLICK, toggleTrigger);
        if (triggerConfig[S_HOVER]) {
          addOrRemove(trigger, S_POINTERENTER, pointerEntered);
        }
      }
    } catch (err) {
      _iterator9.e(err);
    } finally {
      _iterator9.f();
    }
  };
  setupOrCleanup(false);
  widget.onOpen(function () {
    maybeSetupAutoCloseListeners(activeTrigger, false);
  });
  widget.onClose(function () {
    hoverTimeOpened = 0;
    isPointerOver = false;
    removeEventListenerFrom(root, S_POINTERENTER, setIsPointerOver);
    removeEventListenerFrom(root, S_POINTERLEAVE, pointerLeft);
    maybeSetupAutoCloseListeners(activeTrigger, true);
    activeTrigger = null;
  });
  widget.onDestroy(function () {
    setupOrCleanup(true);
  });
};
var insertCollapsibleIcon = function insertCollapsibleIcon(trigger, triggerConfig, widget, widgetConfig) {
  var _triggerConfig$icon, _ref12, _triggerConfig$iconCl, _ref13, _triggerConfig$iconOp;
  var iconPosition = (_triggerConfig$icon = triggerConfig.icon) !== null && _triggerConfig$icon !== void 0 ? _triggerConfig$icon : widgetConfig === null || widgetConfig === void 0 ? void 0 : widgetConfig.icon;
  var iconClosed = (_ref12 = (_triggerConfig$iconCl = triggerConfig.iconClosed) !== null && _triggerConfig$iconCl !== void 0 ? _triggerConfig$iconCl : widgetConfig === null || widgetConfig === void 0 ? void 0 : widgetConfig.iconClosed) !== null && _ref12 !== void 0 ? _ref12 : "plus";
  var iconOpen = (_ref13 = (_triggerConfig$iconOp = triggerConfig.iconOpen) !== null && _triggerConfig$iconOp !== void 0 ? _triggerConfig$iconOp : widgetConfig === null || widgetConfig === void 0 ? void 0 : widgetConfig.iconOpen) !== null && _ref13 !== void 0 ? _ref13 : "minus";
  if (iconPosition) {
    addClasses(trigger, PREFIX_ICON_WRAPPER);
    setData(trigger, PREFIX_ICON_POSITION, iconPosition);
    var icon = createElement("span");
    setDataNow(icon, PREFIX_TRIGGER_ICON, iconClosed);
    for (var l = 0; l < 2; l++) {
      var line = createElement("span");
      addClassesNow(line, PREFIX_LINE);
      moveElementNow(line, {
        to: icon
      });
    }
    moveElement(icon, {
      to: trigger,
      ignoreMove: true
    });
    widget.onOpen(function () {
      if (getBoolData(trigger, PREFIX_IS_OPEN)) {
        setData(icon, PREFIX_TRIGGER_ICON, iconOpen);
      }
    });
    widget.onClose(function () {
      setData(icon, PREFIX_TRIGGER_ICON, iconClosed);
    });
  }
};
var fetchPopupPlacement = function () {
  var _ref14 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee11(contentSize, containerView) {
    var containerPosition, containerTop, containerBottom, containerLeft, containerRight, containerHMiddle, containerVMiddle, vpSize, popupWidth, popupHeight, placementVars, placement, finalPlacement, alignmentVars, alignment;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          containerPosition = containerView.relative;
          containerTop = containerPosition[S_TOP];
          containerBottom = containerPosition[S_BOTTOM];
          containerLeft = containerPosition[S_LEFT];
          containerRight = containerPosition[S_RIGHT];
          containerHMiddle = containerPosition.hMiddle;
          containerVMiddle = containerPosition.vMiddle;
          _context11.next = 9;
          return fetchViewportSize();
        case 9:
          vpSize = _context11.sent;
          popupWidth = contentSize.border[S_WIDTH] / vpSize[S_WIDTH];
          popupHeight = contentSize.border[S_HEIGHT] / vpSize[S_HEIGHT];
          placementVars = {
            top: containerTop - popupHeight,
            bottom: 1 - (containerBottom + popupHeight),
            left: containerLeft - popupWidth,
            right: 1 - (containerRight + popupWidth)
          };
          placement = keyWithMaxVal(placementVars);
          if (!(placement === undefined)) {
            _context11.next = 16;
            break;
          }
          return _context11.abrupt("return");
        case 16:
          finalPlacement = placement;
          _context11.t0 = placement;
          _context11.next = _context11.t0 === S_TOP ? 20 : _context11.t0 === S_BOTTOM ? 20 : _context11.t0 === S_LEFT ? 22 : _context11.t0 === S_RIGHT ? 22 : 24;
          break;
        case 20:
          alignmentVars = {
            left: 1 - (containerLeft + popupWidth),
            right: containerRight - popupWidth,
            middle: min(containerHMiddle - popupWidth / 2, 1 - (containerHMiddle + popupWidth / 2))
          };
          return _context11.abrupt("break", 25);
        case 22:
          alignmentVars = {
            top: 1 - (containerTop + popupHeight),
            bottom: containerBottom - popupHeight,
            middle: min(containerVMiddle - popupHeight / 2, 1 - (containerVMiddle + popupHeight / 2))
          };
          return _context11.abrupt("break", 25);
        case 24:
          return _context11.abrupt("return");
        case 25:
          alignment = keyWithMaxVal(alignmentVars);
          if (alignment !== "middle") {
            finalPlacement += "-" + alignment;
          }
          return _context11.abrupt("return", finalPlacement);
        case 28:
        case "end":
          return _context11.stop();
      }
    }, _callee11);
  }));
  return function fetchPopupPlacement(_x, _x2) {
    return _ref14.apply(this, arguments);
  };
}();

var Open = function () {
  function Open(element) {
    _classCallCheck(this, Open);
    var open = function open(widget) {
      return widget === null || widget === void 0 ? void 0 : widget.open();
    };
    var close = function close(widget) {
      return widget === null || widget === void 0 ? void 0 : widget.close();
    };
    var toggle = function toggle(widget) {
      return widget === null || widget === void 0 ? void 0 : widget.toggle();
    };
    var widgetPromise = fetchUniqueWidget("openable", element, Openable);
    this["do"] = function () {
      return widgetPromise.then(open);
    };
    this.undo = function () {
      return widgetPromise.then(close);
    };
    this[S_TOGGLE] = function () {
      return widgetPromise.then(toggle);
    };
  }
  return _createClass(Open, null, [{
    key: "register",
    value: function register() {
      registerAction("open", function (element) {
        return new Open(element);
      });
    }
  }]);
}();

var Pager = function (_Widget) {
  function Pager(element, config) {
    var _Pager$get;
    var _this;
    _classCallCheck(this, Pager);
    var destroyPromise = (_Pager$get = Pager.get(element)) === null || _Pager$get === void 0 ? void 0 : _Pager$get.destroy();
    _this = _callSuper(this, Pager, [element, {
      id: DUMMY_ID$9
    }]);
    var pages = (config === null || config === void 0 ? void 0 : config.pages) || [];
    var toggles = (config === null || config === void 0 ? void 0 : config.toggles) || [];
    var switches = (config === null || config === void 0 ? void 0 : config.switches) || [];
    var nextPrevSwitch = {
      _next: (config === null || config === void 0 ? void 0 : config.nextSwitch) || null,
      _prev: (config === null || config === void 0 ? void 0 : config.prevSwitch) || null
    };
    var pageSelector = getDefaultWidgetSelector(PREFIX_PAGE__FOR_SELECT);
    var toggleSelector = getDefaultWidgetSelector(PREFIX_TOGGLE__FOR_SELECT);
    var switchSelector = getDefaultWidgetSelector(PREFIX_SWITCH__FOR_SELECT);
    var nextSwitchSelector = getDefaultWidgetSelector(PREFIX_NEXT_SWITCH__FOR_SELECT);
    var prevSwitchSelector = getDefaultWidgetSelector(PREFIX_PREV_SWITCH__FOR_SELECT);
    if (!lengthOf(pages)) {
      pages.push.apply(pages, _toConsumableArray(querySelectorAll(element, pageSelector)));
      if (!lengthOf(pages)) {
        pages.push.apply(pages, _toConsumableArray(getVisibleContentChildren(element).filter(function (e) {
          return !e.matches(switchSelector);
        })));
      }
    }
    if (!lengthOf(toggles)) {
      toggles.push.apply(toggles, _toConsumableArray(querySelectorAll(element, toggleSelector)));
    }
    if (!lengthOf(switches)) {
      switches.push.apply(switches, _toConsumableArray(querySelectorAll(element, switchSelector)));
    }
    if (!nextPrevSwitch._next) {
      nextPrevSwitch._next = querySelector(element, nextSwitchSelector);
    }
    if (!nextPrevSwitch._prev) {
      nextPrevSwitch._prev = querySelector(element, prevSwitchSelector);
    }
    var numPages = lengthOf(pages);
    if (numPages < 2) {
      throw usageError("Pager must have more than 1 page");
    }
    var _iterator = _createForOfIteratorHelper(pages),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var page = _step.value;
        if (!element.contains(page) || page === element) {
          throw usageError("Pager's pages must be its descendants");
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    var components = {
      _pages: pages,
      _toggles: toggles,
      _switches: switches,
      _nextPrevSwitch: nextPrevSwitch
    };
    var methods = getMethods$2(_this, components, element, config);
    (destroyPromise || promiseResolve()).then(function () {
      if (_this.isDestroyed()) {
        return;
      }
      init$3(_this, element, components, config, methods);
    });
    _this.nextPage = function () {
      return methods._nextPage();
    };
    _this.prevPage = function () {
      return methods._prevPage();
    };
    _this.goToPage = function (pageNum) {
      return methods._goToPage(pageNum);
    };
    _this.disablePage = methods._disablePage;
    _this.enablePage = methods._enablePage;
    _this.togglePage = methods._togglePage;
    _this.isPageDisabled = methods._isPageDisabled;
    _this.getCurrentPage = methods._getCurrentPage;
    _this.getPreviousPage = methods._getPreviousPage;
    _this.getCurrentPageNum = methods._getCurrentPageNum;
    _this.getPreviousPageNum = methods._getPreviousPageNum;
    _this.onTransition = methods._onTransition;
    _this.getPages = function () {
      return _toConsumableArray(pages);
    };
    _this.getSwitches = function () {
      return _toConsumableArray(switches);
    };
    _this.getToggles = function () {
      return _toConsumableArray(toggles);
    };
    return _this;
  }
  _inherits(Pager, _Widget);
  return _createClass(Pager, null, [{
    key: "get",
    value: function get(element) {
      var instance = _superPropGet(Pager, "get", this, 2)([element, DUMMY_ID$9]);
      if (isInstanceOf(instance, Pager)) {
        return instance;
      }
      return null;
    }
  }, {
    key: "register",
    value: function register() {
      registerWidget(WIDGET_NAME$9, function (element, config) {
        if (!Pager.get(element)) {
          return new Pager(element, config);
        }
        return null;
      }, configValidator$7);
    }
  }]);
}(Widget);
var MIN_TIME_BETWEEN_WHEEL = 1000;
var S_CURRENT = "current";
var S_ARIA_CURRENT = ARIA_PREFIX + S_CURRENT;
var S_COVERED = "covered";
var S_NEXT = "next";
var S_TOTAL_PAGES = "total-pages";
var S_CURRENT_PAGE = "current-page";
var S_PAGE_NUMBER = "page-number";
var WIDGET_NAME$9 = "pager";
var PREFIXED_NAME$5 = prefixName(WIDGET_NAME$9);
var PREFIX_ROOT$4 = "".concat(PREFIXED_NAME$5, "__root");
var PREFIX_PAGE_CONTAINER = "".concat(PREFIXED_NAME$5, "__page-container");
var PREFIX_PAGE = "".concat(PREFIXED_NAME$5, "__page");
var PREFIX_PAGE__FOR_SELECT = "".concat(PREFIXED_NAME$5, "-page");
var PREFIX_TOGGLE__FOR_SELECT = "".concat(PREFIXED_NAME$5, "-toggle");
var PREFIX_SWITCH__FOR_SELECT = "".concat(PREFIXED_NAME$5, "-switch");
var PREFIX_NEXT_SWITCH__FOR_SELECT = "".concat(PREFIXED_NAME$5, "-next-switch");
var PREFIX_PREV_SWITCH__FOR_SELECT = "".concat(PREFIXED_NAME$5, "-prev-switch");
var PREFIX_IS_FULLSCREEN = prefixName("is-fullscreen");
var PREFIX_USE_PARALLAX = prefixName("use-parallax");
var PREFIX_TOTAL_PAGES = prefixName(S_TOTAL_PAGES);
var PREFIX_CURRENT_PAGE = prefixName(S_CURRENT_PAGE);
var PREFIX_CURRENT_PAGE_IS_LAST = "".concat(PREFIX_CURRENT_PAGE, "-is-last");
var PREFIX_CURRENT_PAGE_IS_FIRST_ENABLED = "".concat(PREFIX_CURRENT_PAGE, "-is-first-enabled");
var PREFIX_CURRENT_PAGE_IS_LAST_ENABLED = "".concat(PREFIX_CURRENT_PAGE_IS_LAST, "-enabled");
var PREFIX_PAGE_STATE = prefixName("page-state");
var PREFIX_PAGE_NUMBER = prefixName(S_PAGE_NUMBER);
var VAR_TOTAL_PAGES = prefixCssJsVar(S_TOTAL_PAGES);
var VAR_CURRENT_PAGE = prefixCssJsVar(S_CURRENT_PAGE);
var VAR_PAGE_NUMBER = prefixCssJsVar(S_PAGE_NUMBER);
var DUMMY_ID$9 = PREFIXED_NAME$5;
var configValidator$7 = {
  initialPage: validateNumber,
  fullscreen: validateBoolean,
  parallax: validateBoolean,
  horizontal: validateBoolean,
  useGestures: function useGestures(key, value) {
    if (isNullish(value)) {
      return undefined;
    }
    var bool = toBool(value);
    if (bool !== null) {
      return bool;
    }
    return validateStrList("useGestures", validateString(key, value), isValidInputDevice) || true;
  },
  alignGestureDirection: validateBoolean,
  preventDefault: validateBoolean
};
var fetchClosestScrollable = function fetchClosestScrollable(element) {
  return waitForMeasureTime().then(function () {
    var _getClosestScrollable;
    return (_getClosestScrollable = getClosestScrollable(element, {
      active: true
    })) !== null && _getClosestScrollable !== void 0 ? _getClosestScrollable : undefined;
  });
};
var setPageNumber = function setPageNumber(components, pageNum) {
  var lastPromise = promiseResolve();
  var _iterator2 = _createForOfIteratorHelper([components._pages[pageNum - 1], components._toggles[pageNum - 1], components._switches[pageNum - 1]]),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var el = _step2.value;
      if (el) {
        setData(el, PREFIX_PAGE_NUMBER, pageNum + "");
        lastPromise = setStyleProp(el, VAR_PAGE_NUMBER, pageNum + "");
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return lastPromise;
};
var setCurrentPage = function setCurrentPage(pagerEl, currPageNum, numPages, isPageDisabled) {
  var isFirstEnabled = true;
  var isLastEnabled = true;
  for (var n = 1; n <= numPages; n++) {
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
var setPageState = function () {
  var _ref = _asyncToGenerator(_regeneratorRuntime().mark(function _callee(components, pageNum, state) {
    var _iterator3, _step3, el;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _iterator3 = _createForOfIteratorHelper([components._pages[pageNum - 1], components._toggles[pageNum - 1], components._switches[pageNum - 1]]);
          _context.prev = 1;
          _iterator3.s();
        case 3:
          if ((_step3 = _iterator3.n()).done) {
            _context.next = 10;
            break;
          }
          el = _step3.value;
          if (!el) {
            _context.next = 8;
            break;
          }
          _context.next = 8;
          return setData(el, PREFIX_PAGE_STATE, state);
        case 8:
          _context.next = 3;
          break;
        case 10:
          _context.next = 15;
          break;
        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](1);
          _iterator3.e(_context.t0);
        case 15:
          _context.prev = 15;
          _iterator3.f();
          return _context.finish(15);
        case 18:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 12, 15, 18]]);
  }));
  return function setPageState(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var init$3 = function init(widget, element, components, config, methods) {
  var _pages$, _config$initialPage, _config$fullscreen, _config$parallax, _config$horizontal, _config$useGestures, _config$alignGestureD, _config$preventDefaul;
  var pages = components._pages;
  var toggles = components._toggles;
  var switches = components._switches;
  var nextSwitch = components._nextPrevSwitch._next;
  var prevSwitch = components._nextPrevSwitch._prev;
  var pageContainer = (_pages$ = pages[0]) === null || _pages$ === void 0 ? void 0 : _pages$.parentElement;
  var initialPage = toInt((_config$initialPage = config === null || config === void 0 ? void 0 : config.initialPage) !== null && _config$initialPage !== void 0 ? _config$initialPage : 1);
  var isFullscreen = (_config$fullscreen = config === null || config === void 0 ? void 0 : config.fullscreen) !== null && _config$fullscreen !== void 0 ? _config$fullscreen : false;
  var isParallax = (_config$parallax = config === null || config === void 0 ? void 0 : config.parallax) !== null && _config$parallax !== void 0 ? _config$parallax : false;
  var isHorizontal = (_config$horizontal = config === null || config === void 0 ? void 0 : config.horizontal) !== null && _config$horizontal !== void 0 ? _config$horizontal : false;
  var orientation = isHorizontal ? S_HORIZONTAL : S_VERTICAL;
  var useGestures = (_config$useGestures = config === null || config === void 0 ? void 0 : config.useGestures) !== null && _config$useGestures !== void 0 ? _config$useGestures : true;
  var alignGestureDirection = (_config$alignGestureD = config === null || config === void 0 ? void 0 : config.alignGestureDirection) !== null && _config$alignGestureD !== void 0 ? _config$alignGestureD : false;
  var preventDefault = (_config$preventDefaul = config === null || config === void 0 ? void 0 : config.preventDefault) !== null && _config$preventDefaul !== void 0 ? _config$preventDefaul : true;
  var scrollWatcher = ScrollWatcher.reuse();
  var gestureWatcher = null;
  var viewWatcher = null;
  if (isFullscreen) {
    viewWatcher = ViewWatcher.reuse({
      rootMargin: "0px",
      threshold: 0.3
    });
  }
  if (useGestures) {
    gestureWatcher = GestureWatcher.reuse();
  }
  var getGestureOptions = function getGestureOptions(directions) {
    return {
      devices: isBoolean(useGestures) ? undefined : useGestures,
      intents: [S_DRAG, S_SCROLL],
      directions: directions,
      deltaThreshold: 25,
      preventDefault: preventDefault
    };
  };
  var scrollToPager = function () {
    var _ref2 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee2() {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.t0 = scrollWatcher;
            _context2.t1 = element;
            _context2.next = 4;
            return fetchClosestScrollable(element);
          case 4:
            _context2.t2 = _context2.sent;
            _context2.t3 = {
              scrollable: _context2.t2
            };
            _context2.t0.scrollTo.call(_context2.t0, _context2.t1, _context2.t3);
          case 7:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function scrollToPager() {
      return _ref2.apply(this, arguments);
    };
  }();
  var transitionOnGesture = function transitionOnGesture(target, data) {
    var swapDirection = data.intent === S_DRAG;
    if (includes([S_LEFT, S_UP], data.direction)) {
      (swapDirection ? methods._nextPage : methods._prevPage)(data);
    } else {
      (swapDirection ? methods._prevPage : methods._nextPage)(data);
    }
  };
  var addWatcher = function addWatcher() {
    var _gestureWatcher, _viewWatcher;
    (_gestureWatcher = gestureWatcher) === null || _gestureWatcher === void 0 || _gestureWatcher.onGesture(element, transitionOnGesture, getGestureOptions(alignGestureDirection ? isHorizontal ? [S_LEFT, S_RIGHT] : [S_UP, S_DOWN] : undefined));
    (_viewWatcher = viewWatcher) === null || _viewWatcher === void 0 || _viewWatcher.onView(element, scrollToPager, {
      views: "at"
    });
  };
  var getPageNumForEvent = function getPageNumForEvent(event) {
    var target = currentTargetOf(event);
    return isElement(target) ? toInt(getData(target, PREFIX_PAGE_NUMBER)) : 0;
  };
  var toggleClickListener = function toggleClickListener(event) {
    var pageNum = getPageNumForEvent(event);
    methods._togglePage(pageNum);
  };
  var switchClickListener = function switchClickListener(event) {
    var pageNum = getPageNumForEvent(event);
    methods._goToPage(pageNum);
  };
  var nextSwitchClickListener = function nextSwitchClickListener() {
    return methods._nextPage();
  };
  var prevSwitchClickListener = function prevSwitchClickListener() {
    return methods._prevPage();
  };
  var removeWatcher = function removeWatcher() {
    var _gestureWatcher2, _viewWatcher2;
    (_gestureWatcher2 = gestureWatcher) === null || _gestureWatcher2 === void 0 || _gestureWatcher2.offGesture(element, transitionOnGesture);
    (_viewWatcher2 = viewWatcher) === null || _viewWatcher2 === void 0 || _viewWatcher2.offView(element, scrollToPager);
  };
  widget.onDisable(removeWatcher);
  widget.onEnable(addWatcher);
  widget.onDestroy(_asyncToGenerator(_regeneratorRuntime().mark(function _callee3() {
    var idx, _iterator4, _step4, _step4$value, el, listener;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return waitForMutateTime();
        case 2:
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
          for (idx = 0; idx < lengthOf(pages); idx++) {
            removeClassesNow(pages[idx], PREFIX_PAGE);
            _iterator4 = _createForOfIteratorHelper([[pages[idx], null], [toggles[idx], toggleClickListener], [switches[idx], switchClickListener]]);
            try {
              for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                _step4$value = _slicedToArray(_step4.value, 2), el = _step4$value[0], listener = _step4$value[1];
                if (el) {
                  delDataNow(el, PREFIX_PAGE_STATE);
                  delDataNow(el, PREFIX_PAGE_NUMBER);
                  delStylePropNow(el, VAR_PAGE_NUMBER);
                  if (listener) {
                    removeEventListenerFrom(el, S_CLICK, listener);
                  }
                }
              }
            } catch (err) {
              _iterator4.e(err);
            } finally {
              _iterator4.f();
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
        case 17:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  })));
  addWatcher();
  addClasses(element, PREFIX_ROOT$4);
  if (pageContainer) {
    addClasses(pageContainer, PREFIX_PAGE_CONTAINER);
  }
  var numPages = lengthOf(pages);
  setData(element, PREFIX_ORIENTATION, orientation);
  setBoolData(element, PREFIX_IS_FULLSCREEN, isFullscreen);
  setBoolData(element, PREFIX_USE_PARALLAX, isParallax);
  setData(element, PREFIX_TOTAL_PAGES, numPages + "");
  setStyleProp(element, VAR_TOTAL_PAGES, (numPages || 1) + "");
  var _iterator5 = _createForOfIteratorHelper(pages),
    _step5;
  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var page = _step5.value;
      disableInitialTransition(page);
      addClasses(page, PREFIX_PAGE);
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }
  for (var idx = 0; idx < numPages; idx++) {
    setPageNumber(components, idx + 1);
    setPageState(components, idx + 1, S_NEXT);
    var _iterator6 = _createForOfIteratorHelper([[toggles[idx], toggleClickListener], [switches[idx], switchClickListener]]),
      _step6;
    try {
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        var _step6$value = _slicedToArray(_step6.value, 2),
          el = _step6$value[0],
          listener = _step6$value[1];
        if (el) {
          addEventListenerTo(el, S_CLICK, listener);
        }
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
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
var getMethods$2 = function getMethods(widget, components, element, config) {
  var pages = components._pages;
  var scrollWatcher = ScrollWatcher.reuse();
  var isFullscreen = config === null || config === void 0 ? void 0 : config.fullscreen;
  var disabledPages = {};
  var callbacks = newSet();
  var fetchScrollOptions = function () {
    var _ref4 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee4() {
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return fetchClosestScrollable(element);
          case 2:
            _context4.t0 = _context4.sent;
            return _context4.abrupt("return", {
              scrollable: _context4.t0,
              asFractionOf: "visible",
              weCanInterrupt: true
            });
          case 4:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }));
    return function fetchScrollOptions() {
      return _ref4.apply(this, arguments);
    };
  }();
  var currPageNum = -1;
  var lastPageNum = -1;
  var lastTransition = 0;
  var canTransition = function canTransition(gestureData) {
    if (widget.isDisabled()) {
      return false;
    }
    if ((gestureData === null || gestureData === void 0 ? void 0 : gestureData.device) !== S_WHEEL) {
      return true;
    }
    var timeNow$1 = timeNow();
    if (timeNow$1 - lastTransition > MIN_TIME_BETWEEN_WHEEL) {
      lastTransition = timeNow$1;
      return true;
    }
    return false;
  };
  var goToPage = function () {
    var _ref5 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee5(pageNum, gestureData) {
      var numPages, _iterator7, _step7, callback, n;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            pageNum = toInt(pageNum, -1);
            if (!(pageNum === currPageNum || !canTransition(gestureData))) {
              _context5.next = 3;
              break;
            }
            return _context5.abrupt("return");
          case 3:
            numPages = lengthOf(pages);
            if (!(currPageNum === 1 && pageNum === 0 || currPageNum === numPages && pageNum === numPages + 1)) {
              _context5.next = 13;
              break;
            }
            if (!isFullscreen) {
              _context5.next = 12;
              break;
            }
            _context5.t0 = scrollWatcher;
            _context5.t1 = pageNum ? (gestureData === null || gestureData === void 0 ? void 0 : gestureData.direction) === S_RIGHT ? S_RIGHT : S_DOWN : (gestureData === null || gestureData === void 0 ? void 0 : gestureData.direction) === S_LEFT ? S_LEFT : S_UP;
            _context5.next = 10;
            return fetchScrollOptions();
          case 10:
            _context5.t2 = _context5.sent;
            _context5.t0.scroll.call(_context5.t0, _context5.t1, _context5.t2);
          case 12:
            return _context5.abrupt("return");
          case 13:
            if (!(isPageDisabled(pageNum) || pageNum < 1 || pageNum > numPages)) {
              _context5.next = 15;
              break;
            }
            return _context5.abrupt("return");
          case 15:
            lastPageNum = currPageNum > 0 ? currPageNum : pageNum;
            currPageNum = pageNum;
            _iterator7 = _createForOfIteratorHelper(callbacks);
            _context5.prev = 18;
            _iterator7.s();
          case 20:
            if ((_step7 = _iterator7.n()).done) {
              _context5.next = 26;
              break;
            }
            callback = _step7.value;
            _context5.next = 24;
            return callback.invoke(widget);
          case 24:
            _context5.next = 20;
            break;
          case 26:
            _context5.next = 31;
            break;
          case 28:
            _context5.prev = 28;
            _context5.t3 = _context5["catch"](18);
            _iterator7.e(_context5.t3);
          case 31:
            _context5.prev = 31;
            _iterator7.f();
            return _context5.finish(31);
          case 34:
            delAttr(pages[lastPageNum - 1], S_ARIA_CURRENT);
            for (n = lastPageNum; n !== currPageNum; currPageNum < lastPageNum ? n-- : n++) {
              if (!isPageDisabled(n)) {
                setPageState(components, n, currPageNum < lastPageNum ? S_NEXT : S_COVERED);
              }
            }
            setCurrentPage(element, currPageNum, numPages, isPageDisabled);
            setAttr(pages[currPageNum - 1], S_ARIA_CURRENT);
            _context5.next = 40;
            return setPageState(components, currPageNum, S_CURRENT);
          case 40:
          case "end":
            return _context5.stop();
        }
      }, _callee5, null, [[18, 28, 31, 34]]);
    }));
    return function goToPage(_x4, _x5) {
      return _ref5.apply(this, arguments);
    };
  }();
  var nextPage = function () {
    var _ref6 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee6(gestureData) {
      var targetPage;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            targetPage = currPageNum + 1;
            while (isPageDisabled(targetPage)) {
              targetPage++;
            }
            return _context6.abrupt("return", goToPage(targetPage, gestureData));
          case 3:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
    }));
    return function nextPage(_x6) {
      return _ref6.apply(this, arguments);
    };
  }();
  var prevPage = function () {
    var _ref7 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee7(gestureData) {
      var targetPage;
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            targetPage = currPageNum - 1;
            while (isPageDisabled(targetPage)) {
              targetPage--;
            }
            return _context7.abrupt("return", goToPage(targetPage, gestureData));
          case 3:
          case "end":
            return _context7.stop();
        }
      }, _callee7);
    }));
    return function prevPage(_x7) {
      return _ref7.apply(this, arguments);
    };
  }();
  var isPageDisabled = function isPageDisabled(pageNum) {
    return disabledPages[pageNum] === true;
  };
  var disablePage = function () {
    var _ref8 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee8(pageNum) {
      return _regeneratorRuntime().wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            pageNum = toInt(pageNum);
            if (!(widget.isDisabled() || pageNum < 1 || pageNum > lengthOf(pages))) {
              _context8.next = 3;
              break;
            }
            return _context8.abrupt("return");
          case 3:
            disabledPages[pageNum] = true;
            if (!(pageNum === currPageNum)) {
              _context8.next = 13;
              break;
            }
            _context8.next = 7;
            return prevPage();
          case 7:
            if (!(pageNum === currPageNum)) {
              _context8.next = 13;
              break;
            }
            _context8.next = 10;
            return nextPage();
          case 10:
            if (!(pageNum === currPageNum)) {
              _context8.next = 13;
              break;
            }
            disabledPages[pageNum] = false;
            return _context8.abrupt("return");
          case 13:
            setCurrentPage(element, currPageNum, lengthOf(pages), isPageDisabled);
            _context8.next = 16;
            return setPageState(components, pageNum, S_DISABLED);
          case 16:
          case "end":
            return _context8.stop();
        }
      }, _callee8);
    }));
    return function disablePage(_x8) {
      return _ref8.apply(this, arguments);
    };
  }();
  var enablePage = function () {
    var _ref9 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee9(pageNum) {
      return _regeneratorRuntime().wrap(function _callee9$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            pageNum = toInt(pageNum);
            if (!(widget.isDisabled() || !isPageDisabled(pageNum))) {
              _context9.next = 3;
              break;
            }
            return _context9.abrupt("return");
          case 3:
            disabledPages[pageNum] = false;
            setCurrentPage(element, currPageNum, lengthOf(pages), isPageDisabled);
            _context9.next = 7;
            return setPageState(components, pageNum, pageNum < currPageNum ? S_COVERED : S_NEXT);
          case 7:
          case "end":
            return _context9.stop();
        }
      }, _callee9);
    }));
    return function enablePage(_x9) {
      return _ref9.apply(this, arguments);
    };
  }();
  var togglePage = function togglePage(pageNum) {
    return isPageDisabled(pageNum) ? enablePage(pageNum) : disablePage(pageNum);
  };
  var onTransition = function onTransition(handler) {
    return callbacks.add(_wrapCallback(handler));
  };
  return {
    _nextPage: nextPage,
    _prevPage: prevPage,
    _goToPage: goToPage,
    _disablePage: disablePage,
    _enablePage: enablePage,
    _togglePage: togglePage,
    _isPageDisabled: isPageDisabled,
    _getCurrentPage: function _getCurrentPage() {
      return pages[currPageNum - 1];
    },
    _getPreviousPage: function _getPreviousPage() {
      return pages[lastPageNum - 1];
    },
    _getCurrentPageNum: function _getCurrentPageNum() {
      return lengthOf(pages) > 0 ? currPageNum : 0;
    },
    _getPreviousPageNum: function _getPreviousPageNum() {
      return lengthOf(pages) > 0 ? lastPageNum : 0;
    },
    _onTransition: onTransition
  };
};

var NextPage = function () {
  function NextPage(element) {
    _classCallCheck(this, NextPage);
    var toggleState = false;
    var _getMethods = getMethods$1(element),
      _nextPage = _getMethods._nextPage,
      _prevPage = _getMethods._prevPage;
    this["do"] = function () {
      toggleState = true;
      return _nextPage();
    };
    this.undo = function () {
      toggleState = false;
      return _prevPage();
    };
    this[S_TOGGLE] = function () {
      var method = toggleState ? _prevPage : _nextPage;
      toggleState = !toggleState;
      return method();
    };
  }
  return _createClass(NextPage, null, [{
    key: "register",
    value: function register() {
      registerAction("next-page", function (element) {
        return new NextPage(element);
      });
    }
  }]);
}();
var PrevPage = function () {
  function PrevPage(element) {
    _classCallCheck(this, PrevPage);
    var toggleState = false;
    var _getMethods2 = getMethods$1(element),
      _nextPage = _getMethods2._nextPage,
      _prevPage = _getMethods2._prevPage;
    this["do"] = function () {
      toggleState = true;
      return _prevPage();
    };
    this.undo = function () {
      toggleState = false;
      return _nextPage();
    };
    this[S_TOGGLE] = function () {
      var method = toggleState ? _nextPage : _prevPage;
      toggleState = !toggleState;
      return method();
    };
  }
  return _createClass(PrevPage, null, [{
    key: "register",
    value: function register() {
      registerAction("prev-page", function (element) {
        return new PrevPage(element);
      });
    }
  }]);
}();
var GoToPage = function () {
  function GoToPage(element, pageNum) {
    _classCallCheck(this, GoToPage);
    if (!pageNum) {
      throw usageError("Target page is required");
    }
    var _getMethods3 = getMethods$1(element),
      _goToPage = _getMethods3._goToPage;
    this["do"] = function () {
      return _goToPage(pageNum);
    };
    this.undo = function () {
      return _goToPage(-1);
    };
    this[S_TOGGLE] = function () {
      return _goToPage(pageNum, -1);
    };
  }
  return _createClass(GoToPage, null, [{
    key: "register",
    value: function register() {
      registerAction("go-to-page", function (element, args) {
        return new GoToPage(element, toInt(args[0]));
      });
    }
  }]);
}();
var EnablePage = function () {
  function EnablePage(element, pageNum) {
    _classCallCheck(this, EnablePage);
    if (!pageNum) {
      throw usageError("Target page number is required");
    }
    var _getMethods4 = getMethods$1(element),
      _enablePage = _getMethods4._enablePage,
      _disablePage = _getMethods4._disablePage,
      _togglePage = _getMethods4._togglePage;
    _disablePage(pageNum);
    this["do"] = function () {
      return _enablePage(pageNum);
    };
    this.undo = function () {
      return _disablePage(pageNum);
    };
    this[S_TOGGLE] = function () {
      return _togglePage(pageNum);
    };
  }
  return _createClass(EnablePage, null, [{
    key: "register",
    value: function register() {
      registerAction("enable-page", function (element, args) {
        return new EnablePage(element, toInt(args[0]));
      });
    }
  }]);
}();
var DisablePage = function () {
  function DisablePage(element, pageNum) {
    _classCallCheck(this, DisablePage);
    if (!pageNum) {
      throw usageError("Target page number is required");
    }
    var _getMethods5 = getMethods$1(element),
      _enablePage = _getMethods5._enablePage,
      _disablePage = _getMethods5._disablePage,
      _togglePage = _getMethods5._togglePage;
    _enablePage(pageNum);
    this["do"] = function () {
      return _disablePage(pageNum);
    };
    this.undo = function () {
      return _enablePage(pageNum);
    };
    this[S_TOGGLE] = function () {
      return _togglePage(pageNum);
    };
  }
  return _createClass(DisablePage, null, [{
    key: "register",
    value: function register() {
      registerAction("disable-page", function (element, args) {
        return new DisablePage(element, toInt(args[0]));
      });
    }
  }]);
}();
var getMethods$1 = function getMethods(element) {
  var lastPageNum = null;
  var nextPage = function nextPage(widget) {
    return widget === null || widget === void 0 ? void 0 : widget.nextPage();
  };
  var prevPage = function prevPage(widget) {
    return widget === null || widget === void 0 ? void 0 : widget.prevPage();
  };
  var goToPage = function () {
    var _ref = _asyncToGenerator(_regeneratorRuntime().mark(function _callee(widget, pageNum, altPageNum) {
      var currentNum, targetNum;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            currentNum = widget === null || widget === void 0 ? void 0 : widget.getCurrentPageNum();
            targetNum = currentNum === pageNum ? altPageNum : pageNum;
            if (targetNum === -1) {
              targetNum = lastPageNum;
            }
            if (!targetNum) {
              _context.next = 7;
              break;
            }
            if (pageNum !== -1) {
              lastPageNum = currentNum;
            }
            _context.next = 7;
            return widget === null || widget === void 0 ? void 0 : widget.goToPage(targetNum);
          case 7:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function goToPage(_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();
  var enablePage = function enablePage(widget, pageNum) {
    return widget === null || widget === void 0 ? void 0 : widget.enablePage(pageNum);
  };
  var disablePage = function disablePage(widget, pageNum) {
    return widget === null || widget === void 0 ? void 0 : widget.disablePage(pageNum);
  };
  var togglePage = function togglePage(widget, pageNum) {
    return widget === null || widget === void 0 ? void 0 : widget.togglePage(pageNum);
  };
  var widgetPromise = fetchUniqueWidget("pager", element, Pager);
  return {
    _nextPage: function _nextPage() {
      return widgetPromise.then(nextPage);
    },
    _prevPage: function _prevPage() {
      return widgetPromise.then(prevPage);
    },
    _goToPage: function _goToPage(pageNum) {
      var altPageNum = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return widgetPromise.then(function (w) {
        return goToPage(w, pageNum, altPageNum);
      });
    },
    _enablePage: function _enablePage(pageNum) {
      return widgetPromise.then(function (w) {
        return enablePage(w, pageNum);
      });
    },
    _disablePage: function _disablePage(pageNum) {
      return widgetPromise.then(function (w) {
        return disablePage(w, pageNum);
      });
    },
    _togglePage: function _togglePage(pageNum) {
      return widgetPromise.then(function (w) {
        return togglePage(w, pageNum);
      });
    }
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

var ClickTrigger = function (_Trigger) {
  function ClickTrigger(element, actions) {
    var _this;
    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    _classCallCheck(this, ClickTrigger);
    _this = _callSuper(this, ClickTrigger, [element, actions, config]);
    _this.getConfig = function () {
      return copyObject(config);
    };
    setupWatcher(_this, element, actions, config, S_CLICK);
    return _this;
  }
  _inherits(ClickTrigger, _Trigger);
  return _createClass(ClickTrigger, null, [{
    key: "register",
    value: function register() {
      registerTrigger(S_CLICK, function (element, args, actions, config) {
        return new ClickTrigger(element, actions, config);
      }, newConfigValidator$5);
    }
  }]);
}(Trigger);
var PressTrigger = function (_Trigger2) {
  function PressTrigger(element, actions) {
    var _this2;
    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    _classCallCheck(this, PressTrigger);
    _this2 = _callSuper(this, PressTrigger, [element, actions, config]);
    _this2.getConfig = function () {
      return copyObject(config);
    };
    setupWatcher(_this2, element, actions, config, S_PRESS);
    return _this2;
  }
  _inherits(PressTrigger, _Trigger2);
  return _createClass(PressTrigger, null, [{
    key: "register",
    value: function register() {
      registerTrigger(S_PRESS, function (element, args, actions, config) {
        return new PressTrigger(element, actions, config);
      }, newConfigValidator$5);
    }
  }]);
}(Trigger);
var HoverTrigger = function (_Trigger3) {
  function HoverTrigger(element, actions) {
    var _this3;
    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    _classCallCheck(this, HoverTrigger);
    _this3 = _callSuper(this, HoverTrigger, [element, actions, config]);
    _this3.getConfig = function () {
      return copyObject(config);
    };
    setupWatcher(_this3, element, actions, config, S_HOVER);
    return _this3;
  }
  _inherits(HoverTrigger, _Trigger3);
  return _createClass(HoverTrigger, null, [{
    key: "register",
    value: function register() {
      registerTrigger(S_HOVER, function (element, args, actions, config) {
        return new HoverTrigger(element, actions, config);
      }, newConfigValidator$5);
    }
  }]);
}(Trigger);
var newConfigValidator$5 = function newConfigValidator(element) {
  return {
    target: function target(key, value) {
      var _ref;
      return (_ref = isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref !== void 0 ? _ref : undefined;
    },
    preventDefault: validateBoolean,
    preventSelect: validateBoolean
  };
};
var setupWatcher = function setupWatcher(widget, element, actions, config, action) {
  if (!lengthOf(actions)) {
    return;
  }
  var target = targetOf(config) || element;
  var startHandler;
  var endHandler;
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

var LayoutTrigger = function (_Trigger) {
  function LayoutTrigger(element, actions, config) {
    var _this;
    _classCallCheck(this, LayoutTrigger);
    var layout = (config === null || config === void 0 ? void 0 : config.layout) || "";
    if (!layout) {
      throw usageError("'layout' is required");
    }
    _this = _callSuper(this, LayoutTrigger, [element, actions, config]);
    _this.getConfig = function () {
      return copyObject(config);
    };
    if (!lengthOf(actions)) {
      return _possibleConstructorReturn(_this);
    }
    var devices = [];
    var aspectRatios = [];
    var otherDevices = [];
    var otherAspectRatios = [];
    if (isValidDeviceList(layout)) {
      devices = layout;
      otherDevices = getOtherDevices(layout);
    } else {
      aspectRatios = layout;
      otherAspectRatios = getOtherAspectRatios(layout);
    }
    var root = config.root;
    var watcher = LayoutWatcher.reuse({
      root: root
    });
    watcher.onLayout(_this.run, {
      devices: devices,
      aspectRatios: aspectRatios
    });
    if (lengthOf(otherDevices) || lengthOf(otherAspectRatios)) {
      watcher.onLayout(_this.reverse, {
        devices: otherDevices,
        aspectRatios: otherAspectRatios
      });
    }
    return _this;
  }
  _inherits(LayoutTrigger, _Trigger);
  return _createClass(LayoutTrigger, null, [{
    key: "register",
    value: function register() {
      registerTrigger("layout", function (element, args, actions, config) {
        return new LayoutTrigger(element, actions, assign(config, {
          layout: validateStringRequired("layout", strReplace(strReplace(args[0] || "", /(min|max)-/g, "$1 "), /-to-/g, " to "), function (value) {
            return isValidDeviceList(value) || isValidAspectRatioList(value);
          })
        }));
      }, newConfigValidator$4);
    }
  }]);
}(Trigger);
var newConfigValidator$4 = function newConfigValidator(element) {
  return {
    root: function () {
      var _root = _asyncToGenerator(_regeneratorRuntime().mark(function _callee(key, value) {
        var root;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!isLiteralString(value)) {
                _context.next = 6;
                break;
              }
              _context.next = 3;
              return waitForReferenceElement(value, element);
            case 3:
              _context.t0 = _context.sent;
              _context.next = 7;
              break;
            case 6:
              _context.t0 = undefined;
            case 7:
              root = _context.t0;
              if (!(root && !isHTMLElement(root))) {
                _context.next = 10;
                break;
              }
              throw usageError("root must be HTMLElement");
            case 10:
              return _context.abrupt("return", root);
            case 11:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function root(_x, _x2) {
        return _root.apply(this, arguments);
      }
      return root;
    }()
  };
};

var LoadTrigger = function (_Trigger) {
  function LoadTrigger(element, actions, config) {
    var _this;
    _classCallCheck(this, LoadTrigger);
    _this = _callSuper(this, LoadTrigger, [element, actions, config]);
    _this.getConfig = function () {
      return copyObject(config);
    };
    if (!lengthOf(actions)) {
      return _possibleConstructorReturn(_this);
    }
    waitForPageReady().then(_this.run);
    return _this;
  }
  _inherits(LoadTrigger, _Trigger);
  return _createClass(LoadTrigger, null, [{
    key: "register",
    value: function register() {
      registerTrigger("load", function (element, args, actions, config) {
        return new LoadTrigger(element, actions, config);
      });
    }
  }]);
}(Trigger);

var ScrollTrigger = function (_Trigger) {
  function ScrollTrigger(element, actions, config) {
    var _this;
    _classCallCheck(this, ScrollTrigger);
    config = config !== null && config !== void 0 ? config : {};
    var directions = config.directions;
    if (!directions) {
      config.once = true;
      directions = [S_UP, S_DOWN, S_LEFT, S_RIGHT];
    }
    _this = _callSuper(this, ScrollTrigger, [element, actions, config]);
    _this.getConfig = function () {
      return copyObject(config);
    };
    if (!lengthOf(actions)) {
      return _possibleConstructorReturn(_this);
    }
    var watcher = ScrollWatcher.reuse();
    var scrollable = config.scrollable;
    var threshold = config.threshold;
    var oppositeDirections = directions ? getOppositeXYDirections(directions) : [];
    watcher.onScroll(_this.run, {
      directions: directions,
      scrollable: scrollable,
      threshold: threshold
    });
    if (lengthOf(oppositeDirections)) {
      watcher.onScroll(_this.reverse, {
        directions: oppositeDirections,
        scrollable: scrollable,
        threshold: threshold
      });
    }
    return _this;
  }
  _inherits(ScrollTrigger, _Trigger);
  return _createClass(ScrollTrigger, null, [{
    key: "register",
    value: function register() {
      registerTrigger(S_SCROLL, function (element, args, actions, config) {
        return new ScrollTrigger(element, actions, assign(config, {
          directions: validateStrList("directions", args, isValidXYDirection)
        }));
      }, newConfigValidator$3);
    }
  }]);
}(Trigger);
var newConfigValidator$3 = function newConfigValidator(element) {
  return {
    scrollable: function scrollable(key, value) {
      var _ref;
      return (_ref = isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref !== void 0 ? _ref : undefined;
    },
    threshold: validateNumber
  };
};

var ViewTrigger = function (_Trigger) {
  function ViewTrigger(element, actions, config) {
    var _config$rootMargin;
    var _this;
    _classCallCheck(this, ViewTrigger);
    _this = _callSuper(this, ViewTrigger, [element, actions, config]);
    _this.getConfig = function () {
      return copyObject(config || {});
    };
    if (!lengthOf(actions)) {
      return _possibleConstructorReturn(_this);
    }
    var watcher = ViewWatcher.reuse({
      root: config === null || config === void 0 ? void 0 : config.root,
      rootMargin: config === null || config === void 0 || (_config$rootMargin = config.rootMargin) === null || _config$rootMargin === void 0 ? void 0 : _config$rootMargin.replace(/,/g, " "),
      threshold: config === null || config === void 0 ? void 0 : config.threshold
    });
    var target = (config === null || config === void 0 ? void 0 : config.target) || element;
    var views = (config === null || config === void 0 ? void 0 : config.views) || S_AT;
    var oppositeViews = getOppositeViews(views);
    var setupWatcher = function setupWatcher(target) {
      if (!lengthOf(oppositeViews)) {
        _this.run();
      } else {
        watcher.onView(target, _this.run, {
          views: views
        });
        watcher.onView(target, _this.reverse, {
          views: oppositeViews
        });
      }
    };
    var willAnimate = false;
    var _iterator = _createForOfIteratorHelper(actions),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var action = _step.value;
        if (isInstanceOf(action, Animate) || isInstanceOf(action, AnimatePlay)) {
          willAnimate = true;
          break;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    if (willAnimate) {
      setupRepresentative(element).then(setupWatcher);
    } else {
      setupWatcher(target);
    }
    return _this;
  }
  _inherits(ViewTrigger, _Trigger);
  return _createClass(ViewTrigger, null, [{
    key: "register",
    value: function register() {
      registerTrigger("view", function (element, args, actions, config) {
        return new ViewTrigger(element, actions, assign(config, {
          views: validateStrList("views", args, isValidView)
        }));
      }, newConfigValidator$2);
    }
  }]);
}(Trigger);
var newConfigValidator$2 = function newConfigValidator(element) {
  return {
    target: function target(key, value) {
      var _ref;
      return isLiteralString(value) && isValidScrollOffset(value) ? value : (_ref = isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref !== void 0 ? _ref : undefined;
    },
    root: function root(key, value) {
      var _ref2;
      return (_ref2 = isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref2 !== void 0 ? _ref2 : undefined;
    },
    rootMargin: validateString,
    threshold: function threshold(key, value) {
      return validateNumList(key, value);
    }
  };
};
var setupRepresentative = function () {
  var _ref3 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee(element) {
    var _MH$classList;
    var allowedToWrap, target, prev, prevChild;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          allowedToWrap = settings.contentWrappingAllowed === true && getData(element, PREFIX_NO_WRAP) === null && !((_MH$classList = classList(parentOf(element))) !== null && _MH$classList !== void 0 && _MH$classList.contains(PREFIX_WRAPPER$1));
          if (!allowedToWrap) {
            _context.next = 9;
            break;
          }
          _context.next = 4;
          return wrapElement(element, {
            ignoreMove: true
          });
        case 4:
          target = _context.sent;
          addClasses(target, PREFIX_WRAPPER$1);
          if (isInlineTag(tagName(target))) {
            addClasses(target, PREFIX_INLINE_WRAPPER);
          }
          _context.next = 18;
          break;
        case 9:
          prev = element.previousElementSibling;
          prevChild = childrenOf(prev)[0];
          if (!(prev && hasClass(prev, PREFIX_WRAPPER$1) && prevChild && hasClass(prevChild, PREFIX_GHOST))) {
            _context.next = 15;
            break;
          }
          target = prevChild;
          _context.next = 18;
          break;
        case 15:
          _context.next = 17;
          return insertGhostClone(element);
        case 17:
          target = _context.sent._clone;
        case 18:
          return _context.abrupt("return", target);
        case 19:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function setupRepresentative(_x) {
    return _ref3.apply(this, arguments);
  };
}();

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

var actions = omitKeys(_actions, {
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

var AutoHide = function (_Widget) {
  function AutoHide(element, config) {
    var _this;
    _classCallCheck(this, AutoHide);
    _this = _callSuper(this, AutoHide, [element, config]);
    var selector = config === null || config === void 0 ? void 0 : config.selector;
    var watcher = DOMWatcher.create({
      root: element,
      subtree: selector ? true : false
    });
    var watcherOptions = selector ? _defineProperty({
      selector: selector,
      categories: [S_ADDED, S_ATTRIBUTE]
    }, S_SKIP_INITIAL, true) : _defineProperty({
      categories: [S_ATTRIBUTE]
    }, S_SKIP_INITIAL, true);
    var hideOrRemoveEl = config !== null && config !== void 0 && config.remove ? hideAndRemoveElement : hideElement;
    var hideRelevant = function hideRelevant() {
      if (_this.isDisabled()) {
        return;
      }
      var targetElements = selector ? querySelectorAll(element, selector) : [element];
      var _iterator = _createForOfIteratorHelper(targetElements),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _config$delay;
          var elem = _step.value;
          hideOrRemoveEl(elem, (_config$delay = config === null || config === void 0 ? void 0 : config.delay) !== null && _config$delay !== void 0 ? _config$delay : DEFAULT_DELAY);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    };
    var addWatcher = function addWatcher() {
      return watcher.onMutation(hideRelevant, watcherOptions);
    };
    var removeWatcher = function removeWatcher() {
      return watcher.offMutation(hideRelevant);
    };
    waitForPageReady().then(function () {
      if (_this.isDestroyed()) {
        return;
      }
      hideRelevant();
      addWatcher();
    });
    _this.onDisable(removeWatcher);
    _this.onEnable(function () {
      hideRelevant();
      addWatcher();
    });
    return _this;
  }
  _inherits(AutoHide, _Widget);
  return _createClass(AutoHide, null, [{
    key: "get",
    value: function get(element, id) {
      var instance = _superPropGet(AutoHide, "get", this, 2)([element, id]);
      if (isInstanceOf(instance, AutoHide)) {
        return instance;
      }
      return null;
    }
  }, {
    key: "register",
    value: function register() {
      var _iterator2 = _createForOfIteratorHelper([[WIDGET_NAME_HIDE, false], [WIDGET_NAME_REMOVE, true]]),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _step2$value = _slicedToArray(_step2.value, 2),
            name = _step2$value[0],
            remove = _step2$value[1];
          registerWidget(name, function (element, config) {
            return new AutoHide(element, config);
          }, newConfigValidator$1(remove), {
            supportsMultiple: true
          });
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }]);
}(Widget);
var WIDGET_NAME_HIDE = "auto-hide";
var WIDGET_NAME_REMOVE = "auto-remove";
var DEFAULT_DELAY = 3000;
var newConfigValidator$1 = function newConfigValidator(autoRemove) {
  return {
    id: validateString,
    remove: function remove() {
      return autoRemove;
    },
    selector: validateString,
    delay: validateNumber
  };
};

var PageLoader = function (_Widget) {
  function PageLoader(element, config) {
    var _PageLoader$get;
    var _this;
    _classCallCheck(this, PageLoader);
    var destroyPromise = (_PageLoader$get = PageLoader.get(element)) === null || _PageLoader$get === void 0 ? void 0 : _PageLoader$get.destroy();
    _this = _callSuper(this, PageLoader, [element, {
      id: DUMMY_ID$8
    }]);
    (destroyPromise || promiseResolve()).then(function () {
      var _config$autoRemove;
      if (_this.isDestroyed()) {
        return;
      }
      addClasses(element, PREFIX_ROOT$3);
      var spinner = createElement("div");
      addClasses(spinner, PREFIX_SPINNER);
      moveElement(spinner, {
        to: element
      });
      waitForElement(getBody).then(setHasModal);
      if ((_config$autoRemove = config === null || config === void 0 ? void 0 : config.autoRemove) !== null && _config$autoRemove !== void 0 ? _config$autoRemove : true) {
        waitForPageReady().then(function () {
          return hideAndRemoveElement(element);
        }).then(_this.destroy);
      }
      _this.onDisable(function () {
        undisplayElement(element);
        if (!docQuerySelector(".".concat(PREFIX_ROOT$3))) {
          delHasModal();
        }
      });
      _this.onEnable(_asyncToGenerator(_regeneratorRuntime().mark(function _callee() {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return displayElement(element);
            case 2:
            case "end":
              return _context.stop();
          }
        }, _callee);
      })));
      _this.onDestroy(_asyncToGenerator(_regeneratorRuntime().mark(function _callee2() {
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              moveElement(spinner);
              _context2.next = 3;
              return removeClasses(element, PREFIX_ROOT$3);
            case 3:
              _context2.next = 5;
              return displayElement(element);
            case 5:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      })));
    });
    return _this;
  }
  _inherits(PageLoader, _Widget);
  return _createClass(PageLoader, null, [{
    key: "get",
    value: function get(element) {
      if (!element) {
        return mainWidget$2;
      }
      var instance = _superPropGet(PageLoader, "get", this, 2)([element, DUMMY_ID$8]);
      if (isInstanceOf(instance, PageLoader)) {
        return instance;
      }
      return null;
    }
  }, {
    key: "register",
    value: function register() {
      registerWidget(WIDGET_NAME$8, function (element, config) {
        if (!PageLoader.get(element)) {
          return new PageLoader(element, config);
        }
        return null;
      }, configValidator$6);
    }
  }, {
    key: "enableMain",
    value: function enableMain(config) {
      var loader = createElement("div");
      var widget = new PageLoader(loader, config);
      widget.onDestroy(function () {
        if (mainWidget$2 === widget) {
          mainWidget$2 = null;
        }
        return moveElement(loader);
      });
      waitForElement(getBody).then(function (body) {
        if (!widget.isDestroyed()) {
          moveElement(loader, {
            to: body
          });
        }
      });
      mainWidget$2 = widget;
      return widget;
    }
  }]);
}(Widget);
var WIDGET_NAME$8 = "page-loader";
var PREFIXED_NAME$4 = prefixName(WIDGET_NAME$8);
var PREFIX_ROOT$3 = "".concat(PREFIXED_NAME$4, "__root");
var PREFIX_SPINNER = prefixName("spinner");
var DUMMY_ID$8 = PREFIXED_NAME$4;
var mainWidget$2 = null;
var configValidator$6 = {
  autoRemove: validateBoolean
};

var SameHeight = function (_Widget) {
  function SameHeight(containerElement, config) {
    var _SameHeight$get;
    var _this;
    _classCallCheck(this, SameHeight);
    var destroyPromise = (_SameHeight$get = SameHeight.get(containerElement)) === null || _SameHeight$get === void 0 ? void 0 : _SameHeight$get.destroy();
    _this = _callSuper(this, SameHeight, [containerElement, {
      id: DUMMY_ID$7
    }]);
    var items = getItemsFrom(containerElement, config === null || config === void 0 ? void 0 : config.items);
    if (sizeOf(items) < 2) {
      throw usageError("SameHeight must have more than 1 item");
    }
    var _iterator = _createForOfIteratorHelper(items.keys()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var item = _step.value;
        if (parentOf(item) !== containerElement) {
          throw usageError("SameHeight's items must be its immediate children");
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    fetchConfig(containerElement, config).then(function (fullConfig) {
      (destroyPromise || promiseResolve()).then(function () {
        if (_this.isDestroyed()) {
          return;
        }
        init$2(_this, containerElement, items, fullConfig);
      });
    });
    _this.toColumn = function () {
      return setData(containerElement, PREFIX_ORIENTATION, S_VERTICAL);
    };
    _this.toRow = function () {
      return delData(containerElement, PREFIX_ORIENTATION);
    };
    _this.getItems = function () {
      return _toConsumableArray(items.keys());
    };
    _this.getItemConfigs = function () {
      return newMap(_toConsumableArray(items.entries()));
    };
    return _this;
  }
  _inherits(SameHeight, _Widget);
  return _createClass(SameHeight, null, [{
    key: "get",
    value: function get(containerElement) {
      var instance = _superPropGet(SameHeight, "get", this, 2)([containerElement, DUMMY_ID$7]);
      if (isInstanceOf(instance, SameHeight)) {
        return instance;
      }
      return null;
    }
  }, {
    key: "register",
    value: function register() {
      registerWidget(WIDGET_NAME$7, function (element, config) {
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
  }]);
}(Widget);
var WIDGET_NAME$7 = "same-height";
var PREFIXED_NAME$3 = prefixName(WIDGET_NAME$7);
var PREFIX_ROOT$2 = "".concat(PREFIXED_NAME$3, "__root");
var PREFIX_ITEM$1 = "".concat(PREFIXED_NAME$3, "__item");
var PREFIX_ITEM__FOR_SELECT$1 = "".concat(PREFIXED_NAME$3, "-item");
var S_TEXT = "text";
var S_IMAGE = "image";
var DUMMY_ID$7 = PREFIXED_NAME$3;
var MIN_CHARS_FOR_TEXT = 100;
var configValidator$5 = _defineProperty(_defineProperty(_defineProperty(_defineProperty({
  diffTolerance: validateNumber,
  resizeThreshold: validateNumber
}, S_DEBOUNCE_WINDOW, validateNumber), "minGap", validateNumber), "maxFreeR", validateNumber), "maxWidthR", validateNumber);
var isText = function isText(element) {
  return getData(element, PREFIX_ITEM__FOR_SELECT$1) === S_TEXT || getData(element, PREFIX_ITEM__FOR_SELECT$1) !== S_IMAGE && isHTMLElement(element) && lengthOf(element.innerText) >= MIN_CHARS_FOR_TEXT;
};
var areImagesLoaded = function areImagesLoaded(element) {
  var _iterator2 = _createForOfIteratorHelper(element.querySelectorAll("img")),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var img = _step2.value;
      if (img.naturalWidth === 0 || img.width === 0 || img.naturalHeight === 0 || img.height === 0) {
        return false;
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return true;
};
var fetchConfig = function () {
  var _ref = _asyncToGenerator(_regeneratorRuntime().mark(function _callee(containerElement, userConfig) {
    var _userConfig$minGap, _userConfig$maxFreeR, _userConfig$maxWidthR, _userConfig$diffToler, _userConfig$resizeThr, _userConfig$debounceW;
    var colGapStr, minGap;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return getComputedStyleProp(containerElement, "column-gap");
        case 2:
          colGapStr = _context.sent;
          minGap = getNumValue(strReplace(colGapStr, /px$/, ""), settings.sameHeightMinGap);
          return _context.abrupt("return", {
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
          });
        case 5:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function fetchConfig(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var getNumValue = function getNumValue(strValue, defaultValue) {
  var num = strValue ? parseFloat(strValue) : NaN;
  return isNaN$1(num) ? defaultValue : num;
};
var findItems = function findItems(containerElement) {
  var items = _toConsumableArray(querySelectorAll(containerElement, getDefaultWidgetSelector(PREFIX_ITEM__FOR_SELECT$1)));
  if (!lengthOf(items)) {
    items.push.apply(items, _toConsumableArray(getVisibleContentChildren(containerElement)));
  }
  return items;
};
var getItemsFrom = function getItemsFrom(containerElement, inputItems) {
  var itemMap = newMap();
  inputItems = inputItems || findItems(containerElement);
  var addItem = function addItem(item, itemType) {
    itemType = itemType || (isText(item) ? S_TEXT : S_IMAGE);
    itemMap.set(item, itemType);
  };
  if (isArray(inputItems)) {
    var _iterator3 = _createForOfIteratorHelper(inputItems),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var item = _step3.value;
        addItem(item);
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
  } else if (isInstanceOf(inputItems, Map)) {
    var _iterator4 = _createForOfIteratorHelper(inputItems.entries()),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var _step4$value = _slicedToArray(_step4.value, 2),
          _item = _step4$value[0],
          itemType = _step4$value[1];
        addItem(_item, itemType);
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
  }
  return itemMap;
};
var init$2 = function init(widget, containerElement, items, config) {
  var diffTolerance = config._diffTolerance;
  var debounceWindow = config._debounceWindow;
  var sizeWatcher = SizeWatcher.reuse(_defineProperty(_defineProperty({}, S_DEBOUNCE_WINDOW, debounceWindow), "resizeThreshold", config._resizeThreshold));
  var allItems = newMap();
  var callCounter = 0;
  var isFirstTime = true;
  var lastOptimalHeight = 0;
  var hasScheduledReset = false;
  var counterTimeout = null;
  var resizeHandler = function resizeHandler(element, sizeData) {
    if (!hasScheduledReset) {
      hasScheduledReset = true;
      setTimer(function () {
        hasScheduledReset = false;
        if (callCounter > 1) {
          callCounter = 0;
          return;
        }
        callCounter++;
        if (counterTimeout) {
          clearTimer(counterTimeout);
        }
        var measurements = calculateMeasurements(containerElement, allItems, isFirstTime);
        var height = measurements ? getOptimalHeight(measurements, config) : null;
        if (height && abs(lastOptimalHeight - height) > diffTolerance) {
          lastOptimalHeight = height;
          isFirstTime = false;
          setWidths(height);
          counterTimeout = setTimer(function () {
            callCounter = 0;
          }, debounceWindow + 50);
        } else {
          callCounter = 0;
        }
      }, 0);
    }
    var properties = allItems.get(element);
    if (!properties) {
      logError(bugError("Got SizeWatcher call for unknown element"));
      return;
    }
    properties._width = sizeData.border[S_WIDTH] || sizeData.content[S_WIDTH];
    properties._height = sizeData.border[S_HEIGHT] || sizeData.content[S_HEIGHT];
  };
  var observeAll = function observeAll() {
    isFirstTime = true;
    var _iterator5 = _createForOfIteratorHelper(allItems.keys()),
      _step5;
    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var element = _step5.value;
        sizeWatcher.onResize(resizeHandler, {
          target: element
        });
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
  };
  var unobserveAll = function unobserveAll() {
    var _iterator6 = _createForOfIteratorHelper(allItems.keys()),
      _step6;
    try {
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        var element = _step6.value;
        sizeWatcher.offResize(resizeHandler, element);
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
    }
  };
  var setWidths = function setWidths(height) {
    var _iterator7 = _createForOfIteratorHelper(allItems.entries()),
      _step7;
    try {
      for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
        var _step7$value = _slicedToArray(_step7.value, 2),
          element = _step7$value[0],
          properties = _step7$value[1];
        if (parentOf(element) === containerElement) {
          var width = getWidthAtH(element, properties, height);
          setNumericStyleProps(element, {
            sameHeightW: width
          }, {
            _units: "px"
          });
        }
      }
    } catch (err) {
      _iterator7.e(err);
    } finally {
      _iterator7.f();
    }
  };
  widget.onDisable(unobserveAll);
  widget.onEnable(observeAll);
  widget.onDestroy(_asyncToGenerator(_regeneratorRuntime().mark(function _callee2() {
    var _iterator8, _step8, element;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _iterator8 = _createForOfIteratorHelper(allItems.keys());
          _context2.prev = 1;
          _iterator8.s();
        case 3:
          if ((_step8 = _iterator8.n()).done) {
            _context2.next = 12;
            break;
          }
          element = _step8.value;
          if (!(parentOf(element) === containerElement)) {
            _context2.next = 10;
            break;
          }
          _context2.next = 8;
          return setNumericStyleProps(element, {
            sameHeightW: NaN
          });
        case 8:
          _context2.next = 10;
          return removeClasses(element, PREFIX_ITEM$1);
        case 10:
          _context2.next = 3;
          break;
        case 12:
          _context2.next = 17;
          break;
        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](1);
          _iterator8.e(_context2.t0);
        case 17:
          _context2.prev = 17;
          _iterator8.f();
          return _context2.finish(17);
        case 20:
          allItems.clear();
          _context2.next = 23;
          return removeClasses(containerElement, PREFIX_ROOT$2);
        case 23:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 14, 17, 20]]);
  })));
  var getProperties = function getProperties(itemType) {
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
  var _iterator9 = _createForOfIteratorHelper(items.entries()),
    _step9;
  try {
    for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
      var _step9$value = _slicedToArray(_step9.value, 2),
        item = _step9$value[0],
        itemType = _step9$value[1];
      addClasses(item, PREFIX_ITEM$1);
      var properties = getProperties(itemType);
      allItems.set(item, properties);
      if (itemType === S_TEXT) {
        properties._components = _getTextComponents(item);
        var _iterator10 = _createForOfIteratorHelper(properties._components),
          _step10;
        try {
          for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
            var child = _step10.value;
            allItems.set(child, getProperties(""));
          }
        } catch (err) {
          _iterator10.e(err);
        } finally {
          _iterator10.f();
        }
      }
    }
  } catch (err) {
    _iterator9.e(err);
  } finally {
    _iterator9.f();
  }
  addClasses(containerElement, PREFIX_ROOT$2);
  observeAll();
};
var _getTextComponents = function getTextComponents(element) {
  var components = [];
  var _iterator11 = _createForOfIteratorHelper(getVisibleContentChildren(element)),
    _step11;
  try {
    for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
      var child = _step11.value;
      if (isText(child)) {
        components.push(child);
      } else {
        components.push.apply(components, _toConsumableArray(_getTextComponents(child)));
      }
    }
  } catch (err) {
    _iterator11.e(err);
  } finally {
    _iterator11.f();
  }
  return components;
};
var calculateMeasurements = function calculateMeasurements(containerElement, allItems, isFirstTime, logger) {
  if (getData(containerElement, PREFIX_ORIENTATION) === S_VERTICAL) {
    return null;
  }
  var tArea = NaN,
    tExtraH = 0,
    imgAR = NaN,
    flexW = NaN,
    nItems = 0;
  var _iterator12 = _createForOfIteratorHelper(allItems.entries()),
    _step12;
  try {
    for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
      var _step12$value = _slicedToArray(_step12.value, 2),
        element = _step12$value[0],
        properties = _step12$value[1];
      var width = properties._width;
      var height = properties._height;
      if (element === containerElement) {
        flexW = width;
        nItems = lengthOf(getVisibleContentChildren(element));
      } else if (properties._type === S_TEXT) {
        var thisTxtArea = 0,
          thisTxtExtraH = 0;
        var components = properties._components;
        if (lengthOf(components)) {
          var _iterator13 = _createForOfIteratorHelper(properties._components),
            _step13;
          try {
            for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
              var component = _step13.value;
              var cmpProps = allItems.get(component);
              if (cmpProps) {
                thisTxtArea += cmpProps._width * cmpProps._height;
              } else {
                logError(bugError("Text component not observed"));
              }
            }
          } catch (err) {
            _iterator13.e(err);
          } finally {
            _iterator13.f();
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
        var thisAspectR = width / height;
        imgAR = (imgAR || 0) + thisAspectR;
        properties._aspectR = thisAspectR;
      } else {
        continue;
      }
    }
  } catch (err) {
    _iterator12.e(err);
  } finally {
    _iterator12.f();
  }
  return {
    _tArea: tArea,
    _tExtraH: tExtraH,
    _imgAR: imgAR,
    _flexW: flexW,
    _nItems: nItems
  };
};
var getWidthAtH = function getWidthAtH(element, properties, targetHeight) {
  return properties._type === S_TEXT ? properties._area / (targetHeight - (properties._extraH || 0)) : properties._aspectR * targetHeight;
};
var getOptimalHeight = function getOptimalHeight(measurements, config, logger) {
  var tArea = measurements._tArea;
  var tExtraH = measurements._tExtraH;
  var imgAR = measurements._imgAR;
  var flexW = measurements._flexW - (measurements._nItems - 1) * config._minGap;
  var maxFreeR = config._maxFreeR;
  var maxWidthR = config._maxWidthR;
  if (isNaN$1(tArea)) {
    if (!imgAR) {
      return NaN;
    }
    return flexW / imgAR;
  }
  if (isNaN$1(imgAR)) {
    return tArea / flexW + tExtraH;
  }
  if (!imgAR || !tArea) {
    return NaN;
  }
  var h0 = sqrt(tArea / imgAR) + tExtraH;
  var _quadraticRoots = quadraticRoots(imgAR, -(imgAR * tExtraH + flexW), tArea + tExtraH * flexW),
    _quadraticRoots2 = _slicedToArray(_quadraticRoots, 2),
    h2 = _quadraticRoots2[0],
    h1 = _quadraticRoots2[1];
  var hR0 = NaN,
    hR1 = NaN,
    hR2 = NaN;
  if (maxWidthR > 0) {
    hR0 = quadraticRoots(imgAR, -imgAR * tExtraH, -tArea)[0];
    hR1 = quadraticRoots(imgAR * maxWidthR, -imgAR * tExtraH * maxWidthR, -tArea)[0];
    hR2 = quadraticRoots(imgAR / maxWidthR, -imgAR * tExtraH / maxWidthR, -tArea)[0];
  }
  var hF2 = NaN,
    hF1 = NaN;
  if (maxFreeR >= 0) {
    var _quadraticRoots3 = quadraticRoots(imgAR, -(imgAR * tExtraH + flexW * (1 - maxFreeR)), tArea + tExtraH * flexW * (1 - maxFreeR));
    var _quadraticRoots4 = _slicedToArray(_quadraticRoots3, 2);
    hF2 = _quadraticRoots4[0];
    hF1 = _quadraticRoots4[1];
  }
  var hConstr1 = max.apply(MH, _toConsumableArray(filter([h1, hR1, hF1], function (v) {
    return isValidNum(v);
  })));
  var hConstr2 = min.apply(MH, _toConsumableArray(filter([h2, hR2, hF2], function (v) {
    return isValidNum(v);
  })));
  var tw0 = tArea / (h0 - tExtraH);
  var iw0 = h0 * imgAR;
  var freeSpace0 = flexW - tw0 - iw0;
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

var Scrollbar = function (_Widget) {
  function Scrollbar(scrollable, config) {
    var _Scrollbar$get;
    var _this;
    _classCallCheck(this, Scrollbar);
    if (scrollable === getDocElement()) {
      scrollable = getBody();
    }
    var destroyPromise = (_Scrollbar$get = Scrollbar.get(scrollable)) === null || _Scrollbar$get === void 0 ? void 0 : _Scrollbar$get.destroy();
    _this = _callSuper(this, Scrollbar, [scrollable, {
      id: DUMMY_ID$6
    }]);
    var props = getScrollableProps(scrollable);
    var ourScrollable = props.scrollable;
    (destroyPromise || promiseResolve()).then(_asyncToGenerator(_regeneratorRuntime().mark(function _callee() {
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (!_this.isDestroyed()) {
              _context.next = 2;
              break;
            }
            return _context.abrupt("return");
          case 2:
            _context.next = 4;
            return init$1(_this, scrollable, props, config);
          case 4:
          case "end":
            return _context.stop();
        }
      }, _callee);
    })));
    _this.getScrollable = function () {
      return ourScrollable;
    };
    return _this;
  }
  _inherits(Scrollbar, _Widget);
  return _createClass(Scrollbar, null, [{
    key: "get",
    value: function get(scrollable) {
      if (!scrollable) {
        return mainWidget$1;
      }
      if (scrollable === getDocElement()) {
        scrollable = getBody();
      }
      var instance = _superPropGet(Scrollbar, "get", this, 2)([scrollable, DUMMY_ID$6]);
      if (isInstanceOf(instance, Scrollbar)) {
        return instance;
      }
      return null;
    }
  }, {
    key: "enableMain",
    value: function enableMain(config) {
      return ScrollWatcher.fetchMainScrollableElement().then(function (main) {
        var widget = new Scrollbar(main, config);
        widget.onDestroy(function () {
          if (mainWidget$1 === widget) {
            mainWidget$1 = null;
          }
        });
        mainWidget$1 = widget;
        return widget;
      });
    }
  }, {
    key: "register",
    value: function register() {
      registerWidget(WIDGET_NAME$6, function (element, config) {
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
  }]);
}(Widget);
var WIDGET_NAME$6 = "scrollbar";
var PREFIXED_NAME$2 = prefixName(WIDGET_NAME$6);
var DUMMY_ID$6 = PREFIXED_NAME$2;
var PREFIX_ROOT$1 = "".concat(PREFIXED_NAME$2, "__root");
var PREFIX_CONTAINER = "".concat(PREFIXED_NAME$2, "__container");
var PREFIX_CONTENT = "".concat(PREFIXED_NAME$2, "__content");
var PREFIX_BAR = "".concat(PREFIXED_NAME$2, "__bar");
var PREFIX_WRAPPER = "".concat(PREFIXED_NAME$2, "__wrapper");
var PREFIX_FILL = "".concat(PREFIXED_NAME$2, "__fill");
var PREFIX_SPACER = "".concat(PREFIXED_NAME$2, "__spacer");
var PREFIX_HANDLE = "".concat(PREFIXED_NAME$2, "__handle");
var PREFIX_DRAGGABLE = prefixName("draggable");
var PREFIX_CLICKABLE = prefixName("clickable");
var PREFIX_HAS_WRAPPER = prefixName("has-wrapper");
var PREFIX_ALLOW_COLLAPSE = prefixName("allow-collapse");
var PREFIX_HAS_FIXED_HEIGHT = prefixName("has-fixed-height");
var PREFIX_HAS_SCROLLBAR = prefixName("has-scrollbar");
var PREFIX_HIDE_SCROLL = prefixName("hide-scroll");
var S_SET_POINTER_CAPTURE = "setPointerCapture";
var S_RELEASE_POINTER_CAPTURE = "releasePointerCapture";
var S_ARIA_VALUENOW = ARIA_PREFIX + "valuenow";
var S_SCROLLBAR = "scrollbar";
var mainWidget$1 = null;
var configValidator$4 = {
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
var getScrollableProps = function getScrollableProps(containerElement) {
  var mainScrollableElement = tryGetMainScrollableElement();
  var body = getBody();
  var defaultScrollable = getDefaultScrollingElement();
  var isBody = containerElement === body;
  var isMainScrollable = (isBody ? defaultScrollable : containerElement) === mainScrollableElement;
  var root = isMainScrollable ? mainScrollableElement : isBody ? defaultScrollable : containerElement;
  var isBodyInQuirks = root === body && defaultScrollable === body;
  var allowedToWrap = settings.contentWrappingAllowed && getData(containerElement, PREFIX_NO_WRAP) === null;
  var needsSticky = !isMainScrollable && !allowedToWrap;
  var barParent = isMainScrollable ? body : containerElement;
  var hasFixedHeight = _isScrollable(root, {
    axis: "y"
  });
  var contentWrapper = null;
  var scrollable = root;
  if (!isMainScrollable && !isBody && allowedToWrap) {
    if (allowedToWrap) {
      contentWrapper = createElement("div");
      scrollable = contentWrapper;
    } else {
      logWarn("Scrollbar on elements other than the main scrollable " + "when settings.contentWrappingAllowed is false relies on " + "position: sticky, is experimental and may not work properly");
    }
  }
  return {
    isMainScrollable: isMainScrollable,
    isBody: isBody,
    isBodyInQuirks: isBodyInQuirks,
    root: root,
    scrollable: scrollable,
    barParent: barParent,
    contentWrapper: contentWrapper,
    needsSticky: needsSticky,
    hasFixedHeight: hasFixedHeight
  };
};
var init$1 = function init(widget, containerElement, props, config) {
  var _ref2, _config$onMobile, _ref3, _config$hideNative, _config$autoHide, _config$clickScroll, _ref4, _config$dragScroll, _ref5, _config$useHandle;
  var isMainScrollable = props.isMainScrollable,
    isBody = props.isBody,
    isBodyInQuirks = props.isBodyInQuirks,
    root = props.root,
    scrollable = props.scrollable,
    barParent = props.barParent,
    contentWrapper = props.contentWrapper,
    needsSticky = props.needsSticky,
    hasFixedHeight = props.hasFixedHeight;
  var onMobile = (_ref2 = (_config$onMobile = config === null || config === void 0 ? void 0 : config.onMobile) !== null && _config$onMobile !== void 0 ? _config$onMobile : settings.scrollbarOnMobile) !== null && _ref2 !== void 0 ? _ref2 : false;
  var hideNative = (_ref3 = (_config$hideNative = config === null || config === void 0 ? void 0 : config.hideNative) !== null && _config$hideNative !== void 0 ? _config$hideNative : settings.scrollbarHideNative) !== null && _ref3 !== void 0 ? _ref3 : false;
  var positionH = (config === null || config === void 0 ? void 0 : config.positionH) || settings.scrollbarPositionH;
  var positionV = (config === null || config === void 0 ? void 0 : config.positionV) || settings.scrollbarPositionV;
  var autoHideDelay = (_config$autoHide = config === null || config === void 0 ? void 0 : config.autoHide) !== null && _config$autoHide !== void 0 ? _config$autoHide : settings.scrollbarAutoHide;
  var clickScroll = (_config$clickScroll = config === null || config === void 0 ? void 0 : config.clickScroll) !== null && _config$clickScroll !== void 0 ? _config$clickScroll : settings.scrollbarClickScroll;
  var dragScroll = (_ref4 = (_config$dragScroll = config === null || config === void 0 ? void 0 : config.dragScroll) !== null && _config$dragScroll !== void 0 ? _config$dragScroll : settings.scrollbarDragScroll) !== null && _ref4 !== void 0 ? _ref4 : false;
  var useHandle = (_ref5 = (_config$useHandle = config === null || config === void 0 ? void 0 : config.useHandle) !== null && _config$useHandle !== void 0 ? _config$useHandle : settings.scrollbarUseHandle) !== null && _ref5 !== void 0 ? _ref5 : false;
  if (IS_MOBILE && !onMobile) {
    return;
  }
  mapScrollable(root, scrollable);
  var newScrollbar = function newScrollbar(wrapper, position) {
    var barIsHorizontal = position === S_TOP || position === S_BOTTOM;
    var scrollbar = createElement("div");
    addClassesNow(scrollbar, PREFIX_BAR);
    setDataNow(scrollbar, PREFIX_ORIENTATION, barIsHorizontal ? S_HORIZONTAL : S_VERTICAL);
    setDataNow(scrollbar, PREFIX_PLACE, position);
    if (clickScroll || dragScroll) {
      setAttr(scrollbar, S_ROLE, S_SCROLLBAR);
      setAttr(scrollbar, S_ARIA_CONTROLS, scrollDomID);
    }
    var fill = createElement("div");
    addClassesNow(fill, useHandle ? PREFIX_SPACER : PREFIX_FILL);
    var handle = null;
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
  var setProgress = function () {
    var _ref6 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee2(scrollData, tracksH) {
      var scrollbar, hasBarPrefix, completeFraction, viewFraction, scrollAxis;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            scrollbar = tracksH ? scrollbarH : scrollbarV;
            hasBarPrefix = "".concat(PREFIX_HAS_SCROLLBAR, "-").concat(tracksH ? positionH : positionV);
            completeFraction = tracksH ? scrollData[S_SCROLL_LEFT_FRACTION] : scrollData[S_SCROLL_TOP_FRACTION];
            viewFraction = tracksH ? scrollData[S_CLIENT_WIDTH] / scrollData[S_SCROLL_WIDTH] : scrollData[S_CLIENT_HEIGHT] / scrollData[S_SCROLL_HEIGHT];
            setAttr(scrollbar, S_ARIA_VALUENOW, round(completeFraction * 100) + "");
            setNumericStyleProps(scrollbar, {
              viewFr: viewFraction,
              completeFr: completeFraction
            }, {
              _numDecimal: 4
            });
            scrollAxis = tracksH ? "x" : "y";
            if (_isScrollable(scrollable, {
              axis: scrollAxis
            }) && viewFraction < 1) {
              setBoolData(containerElement, hasBarPrefix);
              displayElement(scrollbar);
            } else {
              delData(containerElement, hasBarPrefix);
              undisplayElement(scrollbar);
            }
          case 9:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function setProgress(_x, _x2) {
      return _ref6.apply(this, arguments);
    };
  }();
  var updateProgress = function updateProgress(target, scrollData) {
    setProgress(scrollData, true);
    setProgress(scrollData, false);
    if (!isMainScrollable && !isBody) {
      setBoxMeasureProps(containerElement);
    }
    if (autoHideDelay > 0) {
      showElement(wrapper).then(function () {
        return hideElement(wrapper, autoHideDelay);
      });
    }
  };
  var updatePropsOnResize = function updatePropsOnResize(target, sizeData) {
    setBoxMeasureProps(containerElement);
    setNumericStyleProps(containerElement, {
      barHeight: sizeData.border[S_HEIGHT]
    }, {
      _units: "px",
      _numDecimal: 2
    });
  };
  var isDragging = false;
  var lastOffset = 0;
  var lastTargetFraction = 0;
  var scrollAction;
  var onClickOrDrag = function () {
    var _ref7 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee3(event, tracksH) {
      var scrollbar, handle, target, eventType, isClick, isHandleClick, startsDrag, barIsHorizontal, barLength, currScrollOffset, maxScrollOffset, rect, offset, deltaOffset, handleLength, targetScrollOffset, targetCoordinates, _scrollAction;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            preventDefault(event);
            scrollbar = tracksH ? scrollbarH : scrollbarV;
            handle = tracksH ? handleH : handleV;
            target = targetOf(event);
            if (!(!isMouseEvent(event) || !isHTMLElement(target))) {
              _context3.next = 6;
              break;
            }
            return _context3.abrupt("return");
          case 6:
            eventType = event.type;
            isClick = eventType === S_POINTERDOWN || eventType === S_MOUSEDOWN;
            isHandleClick = isClick && useHandle && hasClass(target, PREFIX_HANDLE);
            startsDrag = isClick && dragScroll && (isHandleClick || !useHandle);
            if (startsDrag) {
              isDragging = true;
              setOrReleasePointerCapture(event, scrollbar, S_SET_POINTER_CAPTURE);
            }
            if (!(!isClick && !isDragging || isClick && !startsDrag && !clickScroll)) {
              _context3.next = 14;
              break;
            }
            return _context3.abrupt("return");
          case 14:
            _context3.next = 16;
            return waitForMeasureTime();
          case 16:
            barIsHorizontal = isHorizontal(scrollbar);
            barLength = barIsHorizontal ? scrollbar[S_CLIENT_WIDTH] : scrollbar[S_CLIENT_HEIGHT];
            currScrollOffset = tracksH ? scrollable[S_SCROLL_LEFT] : scrollable[S_SCROLL_TOP];
            maxScrollOffset = tracksH ? scrollable[S_SCROLL_WIDTH] - getClientWidthNow(scrollable) : scrollable[S_SCROLL_HEIGHT] - getClientHeightNow(scrollable);
            rect = getBoundingClientRect(scrollbar);
            offset = barIsHorizontal ? event.clientX - rect.left : event.clientY - rect.top;
            if (!(offset === lastOffset)) {
              _context3.next = 25;
              break;
            }
            return _context3.abrupt("return");
          case 25:
            deltaOffset = isClick ? offset : offset - lastOffset;
            lastOffset = offset;
            if (!isClick && useHandle) {
              handleLength = handle ? parseFloat(getComputedStylePropNow(handle, barIsHorizontal ? S_WIDTH : S_HEIGHT)) : 0;
              lastTargetFraction = lastTargetFraction + deltaOffset / (barLength - (handleLength || 0));
            } else if (isHandleClick) {
              lastTargetFraction = currScrollOffset / maxScrollOffset;
            } else {
              lastTargetFraction = offset / barLength;
            }
            if (!(isHandleClick || isClick && !clickScroll)) {
              _context3.next = 30;
              break;
            }
            return _context3.abrupt("return");
          case 30:
            targetScrollOffset = lastTargetFraction * maxScrollOffset;
            targetCoordinates = tracksH ? {
              left: targetScrollOffset
            } : {
              top: targetScrollOffset
            };
            if (!isClick) {
              _context3.next = 39;
              break;
            }
            _context3.next = 36;
            return scrollWatcher.scrollTo(targetCoordinates, {
              scrollable: scrollable,
              weCanInterrupt: true
            });
          case 36:
            scrollAction = _context3.sent;
            _context3.next = 42;
            break;
          case 39:
            (_scrollAction = scrollAction) === null || _scrollAction === void 0 || _scrollAction.cancel();
            scrollAction = null;
            elScrollTo(scrollable, targetCoordinates);
          case 42:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return function onClickOrDrag(_x3, _x4) {
      return _ref7.apply(this, arguments);
    };
  }();
  var onRelease = function onRelease(event, tracksH) {
    var scrollbar = tracksH ? scrollbarH : scrollbarV;
    setOrReleasePointerCapture(event, scrollbar, S_RELEASE_POINTER_CAPTURE);
    isDragging = false;
    scrollAction = null;
  };
  var onClickOrDragH = function onClickOrDragH(event) {
    return onClickOrDrag(event, true);
  };
  var onClickOrDragV = function onClickOrDragV(event) {
    return onClickOrDrag(event, false);
  };
  var onReleaseH = function onReleaseH(event) {
    return onRelease(event, true);
  };
  var onReleaseV = function onReleaseV(event) {
    return onRelease(event, false);
  };
  var maybeSetNativeHidden = function maybeSetNativeHidden() {
    if (hideNative) {
      addClasses(scrollable, PREFIX_HIDE_SCROLL);
      if (isBodyInQuirks) {
        addClasses(getDocElement(), PREFIX_HIDE_SCROLL);
      }
    }
  };
  var setNativeShown = function setNativeShown() {
    removeClasses(scrollable, PREFIX_HIDE_SCROLL);
    if (isBodyInQuirks) {
      removeClasses(getDocElement(), PREFIX_HIDE_SCROLL);
    }
  };
  var addWatchers = function addWatchers() {
    scrollWatcher.trackScroll(updateProgress, {
      threshold: 0,
      scrollable: scrollable
    });
    sizeWatcher.onResize(updatePropsOnResize, {
      target: containerElement,
      threshold: 0
    });
  };
  var removeWatchers = function removeWatchers() {
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
      wrapper: contentWrapper,
      ignoreMove: true
    });
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
    addClasses.apply(void 0, [scrollable].concat(_toConsumableArray(toArrayIfSingle(config.className))));
  }
  var scrollDomID = clickScroll || dragScroll ? getOrAssignID(scrollable, S_SCROLLBAR) : "";
  var scrollWatcher = ScrollWatcher.reuse(_defineProperty({}, S_DEBOUNCE_WINDOW, 0));
  var sizeWatcher = SizeWatcher.reuse(_defineProperty({}, S_DEBOUNCE_WINDOW, 0));
  addClasses(barParent, PREFIX_ROOT$1);
  var wrapper = createElement("div");
  preventSelect(wrapper);
  addClasses(wrapper, PREFIX_NO_TOUCH_ACTION);
  addClasses(wrapper, PREFIX_WRAPPER);
  if (isBody || isMainScrollable) {
    setData(wrapper, PREFIX_POSITION, S_FIXED);
  } else if (needsSticky) {
    setData(wrapper, PREFIX_POSITION, S_STICKY);
  }
  var _newScrollbar = newScrollbar(wrapper, positionH),
    scrollbarH = _newScrollbar._bar,
    handleH = _newScrollbar._handle;
  var _newScrollbar2 = newScrollbar(wrapper, positionV),
    scrollbarV = _newScrollbar2._bar,
    handleV = _newScrollbar2._handle;
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
  widget.onDisable(function () {
    removeWatchers();
    undisplayElement(scrollbarH);
    undisplayElement(scrollbarV);
    setNativeShown();
  });
  widget.onEnable(function () {
    addWatchers();
    displayElement(scrollbarH);
    displayElement(scrollbarV);
    maybeSetNativeHidden();
  });
  widget.onDestroy(_asyncToGenerator(_regeneratorRuntime().mark(function _callee4() {
    var _i, _arr, position;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          unmapScrollable(root);
          _context4.next = 3;
          return waitForMutateTime();
        case 3:
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
          for (_i = 0, _arr = [S_TOP, S_BOTTOM, S_LEFT, S_RIGHT]; _i < _arr.length; _i++) {
            position = _arr[_i];
            delDataNow(containerElement, "".concat(PREFIX_HAS_SCROLLBAR, "-").concat(position));
          }
          delDataNow(containerElement, PREFIX_HAS_WRAPPER);
          if (hasFixedHeight) {
            delDataNow(containerElement, PREFIX_HAS_FIXED_HEIGHT);
          }
        case 12:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  })));
};
var isHorizontal = function isHorizontal(scrollbar) {
  return getData(scrollbar, PREFIX_ORIENTATION) === S_HORIZONTAL;
};
var setBoxMeasureProps = function () {
  var _ref9 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee5(element) {
    var _i2, _arr2, side, _i3, _arr3, key, padding;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _i2 = 0, _arr2 = [S_TOP, S_RIGHT, S_BOTTOM, S_LEFT];
        case 1:
          if (!(_i2 < _arr2.length)) {
            _context5.next = 16;
            break;
          }
          side = _arr2[_i2];
          _i3 = 0, _arr3 = ["padding-".concat(side), "border-".concat(side, "-width")];
        case 4:
          if (!(_i3 < _arr3.length)) {
            _context5.next = 13;
            break;
          }
          key = _arr3[_i3];
          _context5.next = 8;
          return getComputedStyleProp(element, key);
        case 8:
          padding = _context5.sent;
          setStyleProp(element, prefixCssJsVar(key), padding);
        case 10:
          _i3++;
          _context5.next = 4;
          break;
        case 13:
          _i2++;
          _context5.next = 1;
          break;
        case 16:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function setBoxMeasureProps(_x5) {
    return _ref9.apply(this, arguments);
  };
}();
var setOrReleasePointerCapture = function setOrReleasePointerCapture(event, scrollbar, method) {
  if (isPointerEvent(event) && method in scrollbar) {
    scrollbar[method](event.pointerId);
  }
};

var ScrollToTop = function (_Widget) {
  function ScrollToTop(element, config) {
    var _ScrollToTop$get;
    var _this;
    _classCallCheck(this, ScrollToTop);
    var destroyPromise = (_ScrollToTop$get = ScrollToTop.get(element)) === null || _ScrollToTop$get === void 0 ? void 0 : _ScrollToTop$get.destroy();
    _this = _callSuper(this, ScrollToTop, [element, {
      id: DUMMY_ID$5
    }]);
    var scrollWatcher = ScrollWatcher.reuse();
    var viewWatcher = ViewWatcher.reuse();
    var offset = (config === null || config === void 0 ? void 0 : config.offset) || "".concat(S_TOP, ": var(").concat(prefixCssVar("scroll-to-top--offset"), ", 200vh)");
    var position = (config === null || config === void 0 ? void 0 : config.position) || S_RIGHT;
    var clickListener = function clickListener() {
      return scrollWatcher.scrollTo({
        top: 0
      });
    };
    var arrow = insertArrow(element, S_UP);
    var showIt = function showIt() {
      showElement(element);
    };
    var hideIt = function hideIt() {
      hideElement(element);
    };
    (destroyPromise || promiseResolve()).then(function () {
      if (_this.isDestroyed()) {
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
      _this.onDisable(function () {
        undisplayElement(element);
      });
      _this.onEnable(function () {
        displayElement(element);
      });
      _this.onDestroy(_asyncToGenerator(_regeneratorRuntime().mark(function _callee() {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              removeEventListenerFrom(element, S_CLICK, clickListener);
              _context.next = 3;
              return delData(element, PREFIX_PLACE);
            case 3:
              _context.next = 5;
              return moveElement(arrow);
            case 5:
              _context.next = 7;
              return removeClasses(element, PREFIX_ROOT);
            case 7:
              _context.next = 9;
              return displayElement(element);
            case 9:
              viewWatcher.offView(offset, showIt);
              viewWatcher.offView(offset, hideIt);
            case 11:
            case "end":
              return _context.stop();
          }
        }, _callee);
      })));
    });
    return _this;
  }
  _inherits(ScrollToTop, _Widget);
  return _createClass(ScrollToTop, null, [{
    key: "get",
    value: function get(element) {
      if (!element) {
        return mainWidget;
      }
      var instance = _superPropGet(ScrollToTop, "get", this, 2)([element, DUMMY_ID$5]);
      if (isInstanceOf(instance, ScrollToTop)) {
        return instance;
      }
      return null;
    }
  }, {
    key: "register",
    value: function register() {
      registerWidget(WIDGET_NAME$5, function (element, config) {
        if (!ScrollToTop.get(element)) {
          return new ScrollToTop(element, config);
        }
        return null;
      }, configValidator$3);
    }
  }, {
    key: "enableMain",
    value: function enableMain(config) {
      var button = createButton("Back to top");
      var widget = new ScrollToTop(button, config);
      widget.onDestroy(function () {
        if (mainWidget === widget) {
          mainWidget = null;
        }
        return moveElement(button);
      });
      waitForElement(getBody).then(function (body) {
        if (!widget.isDestroyed()) {
          moveElement(button, {
            to: body
          });
        }
      });
      mainWidget = widget;
      return widget;
    }
  }]);
}(Widget);
var WIDGET_NAME$5 = "scroll-to-top";
var PREFIXED_NAME$1 = prefixName(WIDGET_NAME$5);
var PREFIX_ROOT = "".concat(PREFIXED_NAME$1, "__root");
var DUMMY_ID$5 = PREFIXED_NAME$1;
var mainWidget = null;
var configValidator$3 = {
  offset: function offset(key, value) {
    return validateString(key, value, isValidScrollOffset);
  },
  position: function position(key, value) {
    return validateString(key, value, function (v) {
      return v === S_LEFT || v === S_RIGHT;
    });
  }
};

var Sortable = function (_Widget) {
  function Sortable(element, config) {
    var _Sortable$get;
    var _this;
    _classCallCheck(this, Sortable);
    var destroyPromise = (_Sortable$get = Sortable.get(element)) === null || _Sortable$get === void 0 ? void 0 : _Sortable$get.destroy();
    _this = _callSuper(this, Sortable, [element, {
      id: DUMMY_ID$4
    }]);
    var items = (config === null || config === void 0 ? void 0 : config.items) || [];
    if (!lengthOf(items)) {
      items.push.apply(items, _toConsumableArray(querySelectorAll(element, getDefaultWidgetSelector(PREFIX_ITEM__FOR_SELECT))));
      if (!lengthOf(items)) {
        items.push.apply(items, _toConsumableArray(querySelectorAll(element, "[".concat(S_DRAGGABLE, "]"))));
        if (!lengthOf(items)) {
          items.push.apply(items, _toConsumableArray(getVisibleContentChildren(element)));
        }
      }
    }
    if (lengthOf(items) < 2) {
      throw usageError("Sortable must have more than 1 item");
    }
    var methods = getMethods(_this, items, config);
    (destroyPromise || promiseResolve()).then(function () {
      if (_this.isDestroyed()) {
        return;
      }
      init(_this, element, items, methods);
    });
    _this.disableItem = methods._disableItem;
    _this.enableItem = methods._enableItem;
    _this.toggleItem = methods._toggleItem;
    _this.isItemDisabled = methods._isItemDisabled;
    _this.onMove = methods._onMove;
    _this.getItems = function () {
      var currentOrder = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      return currentOrder ? methods._getSortedItems() : _toConsumableArray(items);
    };
    return _this;
  }
  _inherits(Sortable, _Widget);
  return _createClass(Sortable, null, [{
    key: "get",
    value: function get(element) {
      var instance = _superPropGet(Sortable, "get", this, 2)([element, DUMMY_ID$4]);
      if (isInstanceOf(instance, Sortable)) {
        return instance;
      }
      return null;
    }
  }, {
    key: "register",
    value: function register() {
      registerWidget(WIDGET_NAME$4, function (element, config) {
        if (!Sortable.get(element)) {
          return new Sortable(element, config);
        }
        return null;
      }, configValidator$2);
    }
  }]);
}(Widget);
var WIDGET_NAME$4 = "sortable";
var PREFIXED_NAME = prefixName(WIDGET_NAME$4);
var PREFIX_IS_DRAGGABLE = prefixName("is-draggable");
var PREFIX_ITEM = "".concat(PREFIXED_NAME, "__item");
var PREFIX_ITEM__FOR_SELECT = "".concat(PREFIXED_NAME, "-item");
var PREFIX_FLOATING_CLONE = "".concat(PREFIXED_NAME, "__ghost");
var DUMMY_ID$4 = PREFIXED_NAME;
var configValidator$2 = {
  mode: function mode(key, value) {
    return validateString(key, value, function (v) {
      return v === "swap" || v === "move";
    });
  }
};
var touchMoveOptions = {
  passive: false,
  capture: true
};
var isItemDraggable = function isItemDraggable(item) {
  return getBoolData(item, PREFIX_IS_DRAGGABLE);
};
var init = function init(widget, element, items, methods) {
  var currentDraggedItem = null;
  var floatingClone = null;
  var ignoreCancel = false;
  var grabOffset = [0, 0];
  var setIgnoreCancel = function setIgnoreCancel() {
    return ignoreCancel = true;
  };
  var onDragStart = function onDragStart(event) {
    var currTarget = currentTargetOf(event);
    if (isElement(currTarget) && isItemDraggable(currTarget) && isMouseEvent(event)) {
      currentDraggedItem = currTarget;
      setAttr(currTarget, S_DRAGGABLE);
      if (isTouchPointerEvent(event)) {
        var target = targetOf(event);
        if (isElement(target)) {
          target.releasePointerCapture(event.pointerId);
        }
      }
      addEventListenerTo(getDoc(), S_TOUCHMOVE, onTouchMove, touchMoveOptions);
      waitForMeasureTime().then(function () {
        var rect = getBoundingClientRect(currTarget);
        grabOffset = [event.clientX - rect.left, event.clientY - rect.top];
      });
    }
  };
  var onDragEnd = function onDragEnd(event) {
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
  var onTouchMove = function onTouchMove(event) {
    if (isTouchEvent(event) && lengthOf(event.touches) === 1) {
      var parentEl = parentOf(currentDraggedItem);
      if (parentEl && currentDraggedItem) {
        preventDefault(event);
        var touch = event.touches[0];
        var clientX = touch.clientX;
        var clientY = touch.clientY;
        if (!floatingClone) {
          floatingClone = cloneElement(currentDraggedItem);
          addClasses(floatingClone, PREFIX_FLOATING_CLONE);
          copyStyle(currentDraggedItem, floatingClone, ["width", "height"]).then(function () {
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
  var onDragEnter = function onDragEnter(event) {
    var currTarget = currentTargetOf(event);
    var dragged = currentDraggedItem;
    if ((isTouchPointerEvent(event) || event.type === S_DRAGENTER) && dragged && isElement(currTarget) && currTarget !== dragged) {
      methods._dragItemOnto(dragged, currTarget);
    }
  };
  var setupEvents = function setupEvents() {
    var _iterator = _createForOfIteratorHelper(items),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var item = _step.value;
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
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
  var _iterator2 = _createForOfIteratorHelper(items),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var item = _step2.value;
      addClasses(item, PREFIX_ITEM);
      setBoolData(item, PREFIX_IS_DRAGGABLE);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  widget.onEnable(setupEvents);
  widget.onDisable(function () {
    var _iterator3 = _createForOfIteratorHelper(items),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var item = _step3.value;
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
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
  });
  widget.onDestroy(_asyncToGenerator(_regeneratorRuntime().mark(function _callee() {
    var _iterator4, _step4, item;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _iterator4 = _createForOfIteratorHelper(items);
          _context.prev = 1;
          _iterator4.s();
        case 3:
          if ((_step4 = _iterator4.n()).done) {
            _context.next = 11;
            break;
          }
          item = _step4.value;
          _context.next = 7;
          return removeClasses(item, PREFIX_ITEM);
        case 7:
          _context.next = 9;
          return delData(item, PREFIX_IS_DRAGGABLE);
        case 9:
          _context.next = 3;
          break;
        case 11:
          _context.next = 16;
          break;
        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](1);
          _iterator4.e(_context.t0);
        case 16:
          _context.prev = 16;
          _iterator4.f();
          return _context.finish(16);
        case 19:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 13, 16, 19]]);
  })));
  setupEvents();
};
var getMethods = function getMethods(widget, items, config) {
  var doSwap = (config === null || config === void 0 ? void 0 : config.mode) === "swap";
  var disabledItems = {};
  var callbacks = newSet();
  var getSortedItems = function getSortedItems() {
    return _toConsumableArray(items).sort(function (a, b) {
      return isNodeBAfterA(a, b) ? -1 : 1;
    });
  };
  var getOrigItemNumber = function getOrigItemNumber(itemNum) {
    var currentOrder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return currentOrder ? items.indexOf(getSortedItems()[itemNum - 1]) + 1 : itemNum;
  };
  var isItemDisabled = function isItemDisabled(itemNum) {
    var currentOrder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return disabledItems[getOrigItemNumber(itemNum, currentOrder)] === true;
  };
  var disableItem = function () {
    var _ref2 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee2(itemNum) {
      var currentOrder,
        _args2 = arguments;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            currentOrder = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : false;
            itemNum = getOrigItemNumber(toInt(itemNum), currentOrder);
            if (!(widget.isDisabled() || itemNum < 1 || itemNum > lengthOf(items))) {
              _context2.next = 4;
              break;
            }
            return _context2.abrupt("return");
          case 4:
            disabledItems[itemNum] = true;
            _context2.next = 7;
            return unsetBoolData(items[itemNum - 1], PREFIX_IS_DRAGGABLE);
          case 7:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function disableItem(_x) {
      return _ref2.apply(this, arguments);
    };
  }();
  var enableItem = function () {
    var _ref3 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee3(itemNum) {
      var currentOrder,
        _args3 = arguments;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            currentOrder = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : false;
            itemNum = getOrigItemNumber(toInt(itemNum), currentOrder);
            if (!(widget.isDisabled() || !isItemDisabled(itemNum))) {
              _context3.next = 4;
              break;
            }
            return _context3.abrupt("return");
          case 4:
            disabledItems[itemNum] = false;
            _context3.next = 7;
            return setBoolData(items[itemNum - 1], PREFIX_IS_DRAGGABLE);
          case 7:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return function enableItem(_x2) {
      return _ref3.apply(this, arguments);
    };
  }();
  var toggleItem = function toggleItem(itemNum) {
    var currentOrder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return isItemDisabled(itemNum, currentOrder) ? enableItem(itemNum, currentOrder) : disableItem(itemNum, currentOrder);
  };
  var onMove = function onMove(handler) {
    return callbacks.add(_wrapCallback(handler));
  };
  var dragItemOnto = function () {
    var _ref4 = _asyncToGenerator(_regeneratorRuntime().mark(function _callee4(dragged, draggedOver) {
      var _iterator5, _step5, callback;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            if (!doSwap) {
              _context4.next = 5;
              break;
            }
            _context4.next = 3;
            return swapElements(dragged, draggedOver, {
              ignoreMove: true
            });
          case 3:
            _context4.next = 7;
            break;
          case 5:
            _context4.next = 7;
            return moveElement(dragged, {
              to: draggedOver,
              position: isNodeBAfterA(dragged, draggedOver) ? "after" : "before",
              ignoreMove: true
            });
          case 7:
            _iterator5 = _createForOfIteratorHelper(callbacks);
            _context4.prev = 8;
            _iterator5.s();
          case 10:
            if ((_step5 = _iterator5.n()).done) {
              _context4.next = 16;
              break;
            }
            callback = _step5.value;
            _context4.next = 14;
            return callback.invoke(widget);
          case 14:
            _context4.next = 10;
            break;
          case 16:
            _context4.next = 21;
            break;
          case 18:
            _context4.prev = 18;
            _context4.t0 = _context4["catch"](8);
            _iterator5.e(_context4.t0);
          case 21:
            _context4.prev = 21;
            _iterator5.f();
            return _context4.finish(21);
          case 24:
          case "end":
            return _context4.stop();
        }
      }, _callee4, null, [[8, 18, 21, 24]]);
    }));
    return function dragItemOnto(_x3, _x4) {
      return _ref4.apply(this, arguments);
    };
  }();
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

var TrackGesture = function (_Widget) {
  function TrackGesture(element, config) {
    var _this;
    _classCallCheck(this, TrackGesture);
    _this = _callSuper(this, TrackGesture, [element, {
      id: DUMMY_ID$3
    }]);
    GestureWatcher.reuse().trackGesture(element, null, {
      preventDefault: config === null || config === void 0 ? void 0 : config.preventDefault,
      minTotalDeltaX: config === null || config === void 0 ? void 0 : config.minDeltaX,
      maxTotalDeltaX: config === null || config === void 0 ? void 0 : config.maxDeltaX,
      minTotalDeltaY: config === null || config === void 0 ? void 0 : config.minDeltaY,
      maxTotalDeltaY: config === null || config === void 0 ? void 0 : config.maxDeltaY,
      minTotalDeltaZ: config === null || config === void 0 ? void 0 : config.minDeltaZ,
      maxTotalDeltaZ: config === null || config === void 0 ? void 0 : config.maxDeltaZ
    });
    _this.onDestroy(function () {
      return GestureWatcher.reuse().noTrackGesture(element);
    });
    return _this;
  }
  _inherits(TrackGesture, _Widget);
  return _createClass(TrackGesture, null, [{
    key: "get",
    value: function get(element) {
      var instance = _superPropGet(TrackGesture, "get", this, 2)([element, DUMMY_ID$3]);
      if (isInstanceOf(instance, TrackGesture)) {
        return instance;
      }
      return null;
    }
  }, {
    key: "register",
    value: function register() {
      registerWidget(WIDGET_NAME$3, function (element, config) {
        if (!TrackGesture.get(element)) {
          return new TrackGesture(element, config);
        }
        return null;
      }, configValidator$1);
    }
  }]);
}(Widget);
var WIDGET_NAME$3 = "track-gesture";
var DUMMY_ID$3 = WIDGET_NAME$3;
var configValidator$1 = {
  preventDefault: validateBoolean,
  minDeltaX: validateNumber,
  maxDeltaX: validateNumber,
  minDeltaY: validateNumber,
  maxDeltaY: validateNumber,
  minDeltaZ: validateNumber,
  maxDeltaZ: validateNumber
};

var TrackScroll = function (_Widget) {
  function TrackScroll(element, config) {
    var _this;
    _classCallCheck(this, TrackScroll);
    _this = _callSuper(this, TrackScroll, [element, {
      id: DUMMY_ID$2
    }]);
    ScrollWatcher.reuse().trackScroll(null, assign({
      scrollable: element
    }, config));
    _this.onDestroy(function () {
      return ScrollWatcher.reuse().noTrackScroll(null, element);
    });
    return _this;
  }
  _inherits(TrackScroll, _Widget);
  return _createClass(TrackScroll, null, [{
    key: "get",
    value: function get(element) {
      var instance = _superPropGet(TrackScroll, "get", this, 2)([element, DUMMY_ID$2]);
      if (isInstanceOf(instance, TrackScroll)) {
        return instance;
      }
      return null;
    }
  }, {
    key: "register",
    value: function register() {
      registerWidget(WIDGET_NAME$2, function (element, config) {
        if (!TrackScroll.get(element)) {
          return new TrackScroll(element, config);
        }
        return null;
      }, configValidator);
    }
  }]);
}(Widget);
var WIDGET_NAME$2 = "track-scroll";
var DUMMY_ID$2 = WIDGET_NAME$2;
var configValidator = {
  threshold: validateNumber,
  debounceWindow: validateNumber
};

var TrackSize = function (_Widget) {
  function TrackSize(element) {
    var _this;
    _classCallCheck(this, TrackSize);
    _this = _callSuper(this, TrackSize, [element, {
      id: DUMMY_ID$1
    }]);
    SizeWatcher.reuse().trackSize(null, {
      target: element,
      threshold: 0
    });
    _this.onDestroy(function () {
      return SizeWatcher.reuse().noTrackSize(null, element);
    });
    return _this;
  }
  _inherits(TrackSize, _Widget);
  return _createClass(TrackSize, null, [{
    key: "get",
    value: function get(element) {
      var instance = _superPropGet(TrackSize, "get", this, 2)([element, DUMMY_ID$1]);
      if (isInstanceOf(instance, TrackSize)) {
        return instance;
      }
      return null;
    }
  }, {
    key: "register",
    value: function register() {
      registerWidget(WIDGET_NAME$1, function (element) {
        if (!TrackSize.get(element)) {
          return new TrackSize(element);
        }
        return null;
      });
    }
  }]);
}(Widget);
var WIDGET_NAME$1 = "track-size";
var DUMMY_ID$1 = WIDGET_NAME$1;

var TrackView = function (_Widget) {
  function TrackView(element, config) {
    var _config$rootMargin;
    var _this;
    _classCallCheck(this, TrackView);
    _this = _callSuper(this, TrackView, [element, {
      id: DUMMY_ID
    }]);
    var watcher = ViewWatcher.reuse({
      root: config === null || config === void 0 ? void 0 : config.root,
      rootMargin: config === null || config === void 0 || (_config$rootMargin = config.rootMargin) === null || _config$rootMargin === void 0 ? void 0 : _config$rootMargin.replace(/,/g, " "),
      threshold: config === null || config === void 0 ? void 0 : config.threshold
    });
    watcher.trackView(element, null, config);
    _this.onDestroy(function () {
      return watcher.noTrackView(element);
    });
    return _this;
  }
  _inherits(TrackView, _Widget);
  return _createClass(TrackView, null, [{
    key: "get",
    value: function get(element) {
      var instance = _superPropGet(TrackView, "get", this, 2)([element, DUMMY_ID]);
      if (isInstanceOf(instance, TrackView)) {
        return instance;
      }
      return null;
    }
  }, {
    key: "register",
    value: function register() {
      registerWidget(WIDGET_NAME, function (element, config) {
        if (!TrackView.get(element)) {
          return new TrackView(element, config);
        }
        return null;
      }, newConfigValidator);
    }
  }]);
}(Widget);
var WIDGET_NAME = "track-view";
var DUMMY_ID = WIDGET_NAME;
var newConfigValidator = function newConfigValidator(element) {
  return {
    root: function root(key, value) {
      var _ref;
      return (_ref = isLiteralString(value) ? waitForReferenceElement(value, element) : null) !== null && _ref !== void 0 ? _ref : undefined;
    },
    rootMargin: validateString,
    threshold: function threshold(key, value) {
      return validateNumList(key, value);
    },
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
