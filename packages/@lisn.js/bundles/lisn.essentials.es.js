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
      if (i = (t = t.call(r)).next, 0 === l) ; else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
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
var S_SKIP_INITIAL = "skipInitial";
var S_DEBOUNCE_WINDOW = "debounceWindow";
var S_CANCEL = "cancel";
var S_KEYDOWN = S_KEY + S_DOWN;
var S_MOUSEUP = S_MOUSE + S_UP;
var S_MOUSEDOWN = S_MOUSE + S_DOWN;
var S_POINTERUP = S_POINTER + S_UP;
var S_POINTERDOWN = S_POINTER + S_DOWN;
var S_POINTERMOVE = "".concat(S_POINTER, "move");
var S_POINTERCANCEL = S_POINTER + S_CANCEL;
var S_TOUCHSTART = "".concat(S_TOUCH, "start");
var S_TOUCHEND = "".concat(S_TOUCH, "end");
var S_TOUCHMOVE = "".concat(S_TOUCH, "move");
var S_TOUCHCANCEL = S_TOUCH + S_CANCEL;
var S_SELECTSTART = "selectstart";
var S_ATTRIBUTES = "attributes";
var S_CHILD_LIST = "childList";
var S_ROLE = "role";
var ARIA_PREFIX = "aria-";
var PREFIX_TRANSITION = "".concat(PREFIX, "-transition");
var PREFIX_TRANSITION_DISABLE = "".concat(PREFIX_TRANSITION, "__disable");
var PREFIX_HIDE = "".concat(PREFIX, "-hide");
var PREFIX_SHOW = "".concat(PREFIX, "-show");
var PREFIX_NO_SELECT = "".concat(PREFIX, "-no-select");
var PREFIX_NO_TOUCH_ACTION = "".concat(PREFIX, "-no-touch-action");
var PREFIX_NO_WRAP = "".concat(PREFIX, "-no-wrap");
var USER_AGENT = typeof navigator === "undefined" ? "" : navigator.userAgent;
USER_AGENT.match(/Mobile|Android|Silk\/|Kindle|BlackBerry|Opera Mini|Opera Mobi/) !== null;

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
var kebabToCamelCase = function kebabToCamelCase(str) {
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
  kebabToCamelCase: kebabToCamelCase,
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
  var numValue = toNum(value, null);
  var min = (_limits$min = limits === null || limits === void 0 ? void 0 : limits.min) !== null && _limits$min !== void 0 ? _limits$min : null;
  var max = (_limits$max = limits === null || limits === void 0 ? void 0 : limits.max) !== null && _limits$max !== void 0 ? _limits$max : null;
  var result;
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
var _validateString = function _validateString(key, value, checkFn, typeDescription) {
  if (isNullish(value)) {
    return;
  }
  if (!isLiteralString(value)) {
    throw usageError("'".concat(key, "' must be ").concat(typeDescription ));
  } else if (checkFn && !checkFn(value)) {
    throw usageError("Invalid value for '".concat(key, "'"));
  }
  return value;
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
var hideElement = function hideElement(element) {
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return transitionElement(element, PREFIX_SHOW, PREFIX_HIDE, delay);
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
var getData = function getData(el, name) {
  return getAttr(el, prefixData(name));
};
var setDataNow = function setDataNow(el, name, value) {
  return setAttr(el, prefixData(name), value);
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
(function () {
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
})();
(function () {
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
})();
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
(function () {
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
})();
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
(function () {
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
})();
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
(function () {
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
})();
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
(function () {
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
})();
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
      var instance = (_instances$get = instances$6.get(root)) === null || _instances$get === void 0 ? void 0 : _instances$get.get(configStrKey);
      if (!instance) {
        instance = new DOMWatcher(myConfig, CONSTRUCTOR_KEY$6);
        instances$6.sGet(root).set(configStrKey, instance);
      }
      return instance;
    }
  }]);
}();
var CONSTRUCTOR_KEY$6 = SYMBOL();
var instances$6 = newXMap(function () {
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
var isValidDirection = function isValidDirection(direction) {
  return includes(DIRECTIONS, direction);
};
var XY_DIRECTIONS = [S_UP, S_DOWN, S_LEFT, S_RIGHT];
var Z_DIRECTIONS = [S_IN, S_OUT];
var SCROLL_DIRECTIONS = [].concat(XY_DIRECTIONS, [S_NONE, S_AMBIGUOUS]);
var DIRECTIONS = [].concat(XY_DIRECTIONS, Z_DIRECTIONS, [S_NONE, S_AMBIGUOUS]);
_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, S_UP, S_DOWN), S_DOWN, S_UP), S_LEFT, S_RIGHT), S_RIGHT, S_LEFT), S_IN, S_OUT), S_OUT, S_IN), S_NONE, null), S_AMBIGUOUS, null);

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
      var instance = instances$5.get(configStrKey);
      if (!instance) {
        instance = new GestureWatcher(myConfig, CONSTRUCTOR_KEY$5);
        instances$5.set(configStrKey, instance);
      }
      return instance;
    }
  }]);
}();
var CONSTRUCTOR_KEY$5 = SYMBOL();
var instances$5 = newMap();
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
          return init$1();
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
          return init$1();
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
var init$1 = function init() {
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
  waitForInteractive().then(init$1);
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
          return init();
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
var init = function init() {
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
      var instance = instances$4.get(configStrKey);
      if (!instance) {
        instance = new SizeWatcher(myConfig, CONSTRUCTOR_KEY$4);
        instances$4.set(configStrKey, instance);
      }
      return instance;
    }
  }]);
}();
var CONSTRUCTOR_KEY$4 = SYMBOL();
var instances$4 = newMap();
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
      var instance = (_instances$get = instances$3.get(myConfig._root)) === null || _instances$get === void 0 ? void 0 : _instances$get.get(configStrKey);
      if (!instance) {
        instance = new LayoutWatcher(myConfig, CONSTRUCTOR_KEY$3);
        instances$3.sGet(myConfig._root).set(configStrKey, instance);
      }
      return instance;
    }
  }]);
}();
var CONSTRUCTOR_KEY$3 = SYMBOL();
var instances$3 = newXMap(function () {
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
      var instance = instances$2.get(configStrKey);
      if (!instance) {
        instance = new PointerWatcher(myConfig, CONSTRUCTOR_KEY$2);
        instances$2.set(configStrKey, instance);
      }
      return instance;
    }
  }]);
}();
var CONSTRUCTOR_KEY$2 = SYMBOL();
var instances$2 = newMap();
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
      var instance = instances$1.get(configStrKey);
      if (!instance) {
        instance = new ScrollWatcher(myConfig, CONSTRUCTOR_KEY$1);
        instances$1.set(configStrKey, instance);
      }
      return instance;
    }
  }]);
}();
var CONSTRUCTOR_KEY$1 = SYMBOL();
var instances$1 = newMap();
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

var isValidView = function isValidView(view) {
  return includes(VIEWS, view);
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
      var instance = (_instances$get = instances.get(myConfig._root)) === null || _instances$get === void 0 ? void 0 : _instances$get.get(configStrKey);
      if (!instance) {
        instance = new ViewWatcher(myConfig, CONSTRUCTOR_KEY);
        instances.sGet(myConfig._root).set(configStrKey, instance);
      }
      return instance;
    }
  }]);
}();
var CONSTRUCTOR_KEY = SYMBOL();
var instances = newXMap(function () {
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
