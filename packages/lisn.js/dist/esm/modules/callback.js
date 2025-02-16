var _Callback;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @module Modules/Callback
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { getDebouncedHandler } from "../utils/tasks.js";
import debug from "../debug/debug.js";

/**
 * @typeParam Args  See {@link Callback}
 */

/**
 * For minification optimization. Exposed through Callback.wrap.
 *
 * @ignore
 * @internal
 */
var _wrapCallback = function wrapCallback(handlerOrCallback) {
  var debounceWindow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var isFunction = MH.isFunction(handlerOrCallback);
  var isRemoved = function isRemoved() {
    return false;
  };
  if (isFunction) {
    // check if it's an invoke method
    var callback = callablesMap.get(handlerOrCallback);
    if (callback) {
      return _wrapCallback(callback);
    }
  } else {
    isRemoved = handlerOrCallback.isRemoved;
  }
  var handler = isFunction ? handlerOrCallback : function () {
    return handlerOrCallback.invoke.apply(handlerOrCallback, arguments);
  };
  var wrapper = new Callback(getDebouncedHandler(debounceWindow, function () {
    if (!isRemoved()) {
      return handler.apply(void 0, arguments);
    }
  }));
  if (!isFunction) {
    handlerOrCallback.onRemove(wrapper.remove);
  }
  return wrapper;
};

/**
 * {@link Callback} wraps user-supplied callbacks. Supports
 * - removing a callback either when calling {@link remove} or if the user
 *   handler returns {@link Callback.REMOVE}
 * - calling custom {@link onRemove} hooks
 * - debouncing (via {@link wrap})
 * - awaiting on an asynchronous handler and ensuring that the handler does not
 *  run concurrently to itself, i.e. subsequent {@link invoke}s will be queued
 *
 * @typeParam Args  The type of arguments that the callback expects.
 */
export { _wrapCallback as wrapCallback };
export var Callback = /*#__PURE__*/_createClass(
/**
 * @param {} handler     The actual function to call. This should return one of
 *                       the known {@link CallbackReturnType} values.
 */
function Callback(handler) {
  var _this = this;
  _classCallCheck(this, Callback);
  /**
   * Call the handler with the given arguments.
   *
   * If the handler is asynchronous, it awaits on it. Furthermore, calls will
   * always wait for previous calls to this handler to complete first, i.e. it
   * never runs concurrently to itself. If you need multiple calls to the async
   * handler to run concurrently, then wrap it in a non-async function that
   * does not await it.
   *
   * The returned promise is rejected in two cases:
   * - If the callback throws an error or returns a rejected Promise.
   * - If the callback is removed _after_ you call {@link invoke} but before the
   *   handler is actually called (while it's waiting in the queue to be called)
   *   In this case, the rejection reason is {@link Callback.REMOVE}.
   *
   * @throws {@link Errors.LisnUsageError | LisnUsageError}
   *                If the callback is already removed.
   */
  _defineProperty(this, "invoke", void 0);
  /**
   * Mark the callback as removed and call the registered {@link onRemove} hooks.
   *
   * Future attempts to call it will result in
   * {@link Errors.LisnUsageError | LisnUsageError}.
   */
  _defineProperty(this, "remove", void 0);
  /**
   * Returns true if the callback has been removed and cannot be called again.
   */
  _defineProperty(this, "isRemoved", void 0);
  /**
   * Registers the given function to be called when the callback is removed.
   *
   * You can call {@link onRemove} multiple times to register multiple hooks.
   */
  _defineProperty(this, "onRemove", void 0);
  var logger = debug ? new debug.Logger({
    name: "Callback",
    logAtCreation: handler
  }) : null;
  var isRemoved = false;
  var id = MC.SYMBOL();
  var onRemove = MH.newSet();
  this.isRemoved = function () {
    return isRemoved;
  };
  this.remove = function () {
    debug: logger === null || logger === void 0 || logger.debug8("Removing");
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
    return MH.newPromise(function (resolve, reject) {
      debug: logger === null || logger === void 0 || logger.debug8("Calling with", args);
      if (isRemoved) {
        reject(MH.usageError("Callback has been removed"));
        return;
      }
      CallbackScheduler._push(id, /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
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

// ----------------------------------------
_Callback = Callback;
/**
 * Possible return value for the handler.
 *
 * Do not do anything. Same as not retuning anything from the function.
 */
_defineProperty(Callback, "KEEP", MC.SYMBOL("KEEP"));
/**
 * Possible return value for the handler.
 *
 * Will remove this callback.
 */
_defineProperty(Callback, "REMOVE", MC.SYMBOL("REMOVE"));
/**
 * Wraps the given handler or callback as a callback, optionally debounced by
 * the given debounce window.
 *
 * If the argument is already a callback _or an invoke method of a callback_,
 * then the wrapper will call that callback and return the same value as it.
 * It will also set up the returned wrapper callback so that it is removed
 * when the original (given) callback is removed. However, removing the
 * returned wrapper callback will _not_ cause the original callback (being
 * wrapped) to be removed. If you want to do this, then do
 * `wrapper.onRemove(wrapped.remove)`.
 *
 * Note that if the argument is a callback that's already debounced by a
 * _larger_ window, then `debounceWindow` will have no effect.
 *
 * @param {} debounceWindow  If non-0, the callback will be called at most
 *                           every `debounceWindow` ms. The arguments it will
 *                           be called with will be the last arguments the
 *                           wrapper was called with.
 */
_defineProperty(Callback, "wrap", _wrapCallback);
var callablesMap = MH.newWeakMap();
var CallbackScheduler = function () {
  var queues = MH.newMap();
  var flush = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(queue) {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return null;
          case 2:
            if (!MH.lengthOf(queue)) {
              _context2.next = 9;
              break;
            }
            // shouldn't throw anything as Callback must catch errors
            queue[0]._running = true;
            _context2.next = 6;
            return queue[0]._task();
          case 6:
            // only remove when done
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
        MH.deleteKey(queues, id);
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
      if (MH.lengthOf(queue) === 1) {
        flush(queue);
      }
    }
  };
}();
//# sourceMappingURL=callback.js.map