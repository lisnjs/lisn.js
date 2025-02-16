"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DOMWatcher = void 0;
var MC = _interopRequireWildcard(require("../globals/minification-constants.cjs"));
var MH = _interopRequireWildcard(require("../globals/minification-helpers.cjs"));
var _dom = require("../utils/dom.cjs");
var _domAlter = require("../utils/dom-alter.cjs");
var _domEvents = require("../utils/dom-events.cjs");
var _log = require("../utils/log.cjs");
var _misc = require("../utils/misc.cjs");
var _text = require("../utils/text.cjs");
var _validation = require("../utils/validation.cjs");
var _callback = require("../modules/callback.cjs");
var _xMap = require("../modules/x-map.cjs");
var _debug = _interopRequireDefault(require("../debug/debug.cjs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Watchers/DOMWatcher
 */
/**
 * {@link DOMWatcher} listens for changes do the DOM tree. It's built on top of
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver | MutationObserver}.
 *
 * It manages registered callbacks globally and reuses MutationObservers for
 * more efficient performance.
 *
 * Each instance of DOMWatcher manages up to two MutationObservers: one
 * for `childList` changes and one for attribute changes, and it disconnects
 * them when there are no active callbacks for the relevant type.
 *
 * `characterData` and changes to base
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Node | Node}s
 * (non-{@link https://developer.mozilla.org/en-US/docs/Web/API/Element | Element})
 * are not supported.
 */
var DOMWatcher = exports.DOMWatcher = /*#__PURE__*/function () {
  function DOMWatcher(config, key) {
    _classCallCheck(this, DOMWatcher);
    /**
     * Call the given handler whenever there's a matching mutation within this
     * DOMWatcher's {@link DOMWatcherConfig.root | root}.
     *
     * If {@link OnMutationOptions.skipInitial | options.skipInitial} is `false`
     * (default), _and_ {@link OnMutationOptions.selector | options.selector} is
     * given, _and_ {@link OnMutationOptions.categories | options.categories}
     * includes "added", the handler is also called (almost) immediately with all
     * existing elements matching the selector under this DOMWatcher's
     * {@link DOMWatcherConfig.root | root}.
     *
     * **IMPORTANT:** The same handler can _not_ be added multiple times, even if
     * the options differ. If the handler has already been added, it is removed
     * and re-added with the current options.
     *
     * @throws {@link Errors.LisnUsageError | LisnUsageError}
     *                If the options are not valid.
     */
    _defineProperty(this, "onMutation", void 0);
    /**
     * Removes a previously added handler.
     */
    _defineProperty(this, "offMutation", void 0);
    /**
     * Ignore an upcoming moving/adding/removing of an element.
     *
     * The operation must complete within the next cycle, by the time
     * MutationObserver calls us.
     *
     * Use this to prevent this instance of DOMWatcher from calling any callbacks
     * that listen for relevant changes as a result of this operation, to prevent
     * loops for example.
     *
     * **IMPORTANT:**
     *
     * Ignoring moving of an element from a parent _inside_ this DOMWatcher's
     * root to another parent that's _outside_ the root, will work as expected,
     * even though the "adding to the new parent" mutation will not be observed.
     * This is because the element's current parent at the time of the mutation
     * callback can be examined.
     *
     * However if you want to ignore moving of an element _from a parent outside
     * this DOMWatcher's root_ you need to specify from: null since the "removal
     * from the old parent" mutation would not be observed and there's no way to
     * examine it's previous parent at the time the "adding to the new parent"
     * mutation is observed.
     *
     * For this reason, setting `options.from` to be an element that's not under
     * the root is internally treated the same as `options.from: null`.
     */
    _defineProperty(this, "ignoreMove", void 0);
    if (key !== CONSTRUCTOR_KEY) {
      throw MH.illegalConstructorError("DOMWatcher.create");
    }
    var logger = _debug["default"] ? new _debug["default"].Logger({
      name: "DOMWatcher",
      logAtCreation: config
    }) : null;
    var buffer = (0, _xMap.newXMap)(function (t) {
      return {
        _target: t,
        _categoryBitmask: 0,
        _attributes: MH.newSet(),
        _addedTo: null,
        _removedFrom: null
      };
    });
    var allCallbacks = MH.newMap();

    // ----------

    var timer = null;
    var mutationHandler = function mutationHandler(records) {
      debug: logger === null || logger === void 0 || logger.debug9("Got ".concat(records.length, " new records"), records);
      var _iterator = _createForOfIteratorHelper(records),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var record = _step.value;
          var target = MH.targetOf(record);
          var recType = record.type;

          /* istanbul ignore next */
          if (!MH.isElement(target)) {
            continue;
          }
          if (recType === MC.S_CHILD_LIST) {
            var _iterator3 = _createForOfIteratorHelper(record.addedNodes),
              _step3;
            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                var child = _step3.value;
                if (MH.isElement(child)) {
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
                if (MH.isElement(_child)) {
                  var _operation = buffer.sGet(_child);
                  _operation._removedFrom = target;
                  _operation._categoryBitmask |= REMOVED_BIT;
                }
              }

              //
            } catch (err) {
              _iterator4.e(err);
            } finally {
              _iterator4.f();
            }
          } else if (recType === MC.S_ATTRIBUTES && record.attributeName) {
            var _operation2 = buffer.sGet(target);
            _operation2._attributes.add(record.attributeName);
            _operation2._categoryBitmask |= ATTRIBUTE_BIT;
          }
        }

        // Schedule flushing of the buffer asynchronously so that we can combine
        // the records from the two MutationObservers.
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      if (!timer && MH.sizeOf(buffer)) {
        timer = MH.setTimer(function () {
          debug: logger === null || logger === void 0 || logger.debug9("Processing ".concat(buffer.size, " operations"));
          var _iterator2 = _createForOfIteratorHelper(buffer.values()),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var operation = _step2.value;
              if (shouldSkipOperation(operation)) {
                debug: logger === null || logger === void 0 || logger.debug10("Skipping operation", operation);
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
    var observers = _defineProperty(_defineProperty({}, MC.S_CHILD_LIST, {
      _observer: MH.newMutationObserver(mutationHandler),
      _isActive: false
    }), MC.S_ATTRIBUTES, {
      _observer: MH.newMutationObserver(mutationHandler),
      _isActive: false
    });

    // ----------

    var createCallback = function createCallback(handler, options) {
      var _allCallbacks$get;
      MH.remove((_allCallbacks$get = allCallbacks.get(handler)) === null || _allCallbacks$get === void 0 ? void 0 : _allCallbacks$get._callback);
      debug: logger === null || logger === void 0 || logger.debug5("Adding/updating handler", options);
      var callback = (0, _callback.wrapCallback)(handler);
      callback.onRemove(function () {
        return deleteHandler(handler);
      });
      allCallbacks.set(handler, {
        _callback: callback,
        _options: options
      });
      return callback;
    };

    // ----------

    var setupOnMutation = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(handler, userOptions) {
        var options, callback, root, childQueue, _i, _arr, element, initOperation, bufferedOperation, diffOperation;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              options = getOptions(userOptions || {});
              callback = createCallback(handler, options);
              root = config._root || MH.getBody();
              if (root) {
                _context.next = 9;
                break;
              }
              _context.next = 6;
              return (0, _domEvents.waitForElement)(MH.getBody);
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
                activateObserver(root, MC.S_CHILD_LIST);
              }
              if (options._categoryBitmask & ATTRIBUTE_BIT) {
                activateObserver(root, MC.S_ATTRIBUTES);
              }
              if (!(userOptions !== null && userOptions !== void 0 && userOptions.skipInitial || !options._selector || !(options._categoryBitmask & ADDED_BIT))) {
                _context.next = 17;
                break;
              }
              return _context.abrupt("return");
            case 17:
              // As some of the matching elements that currently exist in the root may
              // have just been added and therefore in the MutationObserver's queue, to
              // avoid calling the handler with those entries twice, we empty its queue
              // now and process it (which would also invoke the newly added callback).
              // Then we skip any elements returned in querySelectorAll that were in
              // the queue.
              childQueue = observers[MC.S_CHILD_LIST]._observer.takeRecords();
              mutationHandler(childQueue);
              _i = 0, _arr = [].concat(_toConsumableArray(MH.querySelectorAll(root, options._selector)), _toConsumableArray(root.matches(options._selector) ? [root] : []));
            case 20:
              if (!(_i < _arr.length)) {
                _context.next = 36;
                break;
              }
              element = _arr[_i];
              initOperation = {
                _target: element,
                _categoryBitmask: ADDED_BIT,
                _attributes: MH.newSet(),
                _addedTo: MH.parentOf(element),
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
              debug: logger === null || logger === void 0 || logger.debug10("Skipping operation", diffOperation);
              _context.next = 33;
              break;
            case 30:
              debug: logger === null || logger === void 0 || logger.debug5("Calling initially with", diffOperation);
              _context.next = 33;
              return invokeCallback(callback, diffOperation);
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

    // ----------

    var deleteHandler = function deleteHandler(handler) {
      MH.deleteKey(allCallbacks, handler);
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
        deactivateObserver(MC.S_CHILD_LIST);
      }
      if (!(activeCategories & ATTRIBUTE_BIT)) {
        deactivateObserver(MC.S_ATTRIBUTES);
      }
    };

    // ----------

    var processOperation = function processOperation(operation) {
      debug: logger === null || logger === void 0 || logger.debug10("Processing operation", operation);
      var _iterator6 = _createForOfIteratorHelper(allCallbacks.values()),
        _step6;
      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var entry = _step6.value;
          var categoryBitmask = entry._options._categoryBitmask;
          var target = entry._options._target;
          var selector = entry._options._selector;
          if (!(operation._categoryBitmask & categoryBitmask)) {
            debug: logger === null || logger === void 0 || logger.debug10("Category does not match: ".concat(categoryBitmask));
            continue;
          }
          var currentTargets = [];
          if (target) {
            if (!operation._target.contains(target)) {
              debug: logger === null || logger === void 0 || logger.debug10("Target does not match", target);
              continue;
            }
            currentTargets.push(target);
          }
          if (selector) {
            var matches = _toConsumableArray(MH.querySelectorAll(operation._target, selector));
            if (operation._target.matches(selector)) {
              matches.push(operation._target);
            }
            if (!MH.lengthOf(matches)) {
              debug: logger === null || logger === void 0 || logger.debug10("Selector does not match: ".concat(selector));
              continue;
            }
            currentTargets.push.apply(currentTargets, _toConsumableArray(matches));
          }
          invokeCallback(entry._callback, operation, currentTargets);
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
    };

    // ----------

    var activateObserver = function activateObserver(root, mutationType) {
      if (!observers[mutationType]._isActive) {
        debug: logger === null || logger === void 0 || logger.debug3("Activating mutation observer for '".concat(mutationType, "'"));
        observers[mutationType]._observer.observe(root, _defineProperty(_defineProperty({}, mutationType, true), "subtree", config._subtree));
        observers[mutationType]._isActive = true;
      }
    };

    // ----------

    var deactivateObserver = function deactivateObserver(mutationType) {
      if (observers[mutationType]._isActive) {
        debug: logger === null || logger === void 0 || logger.debug3("Disconnecting mutation observer for '".concat(mutationType, "'"));
        observers[mutationType]._observer.disconnect();
        observers[mutationType]._isActive = false;
      }
    };

    // ----------

    var shouldSkipOperation = function shouldSkipOperation(operation) {
      var target = operation._target;
      var requestToSkip = (0, _domAlter.getIgnoreMove)(target);
      if (!requestToSkip) {
        return false;
      }
      var removedFrom = operation._removedFrom;
      var addedTo = MH.parentOf(target);
      var requestFrom = requestToSkip.from;
      var requestTo = requestToSkip.to;
      var root = config._root || MH.getBody();
      // If "from" is currently outside our root, we may not have seen a
      // removal operation.
      if ((removedFrom === requestFrom || !root.contains(requestFrom)) && addedTo === requestTo) {
        (0, _domAlter.clearIgnoreMove)(target);
        return true;
      }
      return false;
    };

    // ----------

    this.ignoreMove = _domAlter.ignoreMove;

    // ----------

    this.onMutation = setupOnMutation;

    // ----------

    this.offMutation = function (handler) {
      var _allCallbacks$get2;
      debug: logger === null || logger === void 0 || logger.debug5("Removing handler");
      MH.remove((_allCallbacks$get2 = allCallbacks.get(handler)) === null || _allCallbacks$get2 === void 0 ? void 0 : _allCallbacks$get2._callback);
    };
  }
  return _createClass(DOMWatcher, null, [{
    key: "create",
    value:
    /**
     * Creates a new instance of DOMWatcher with the given
     * {@link DOMWatcherConfig}. It does not save it for future reuse.
     */
    function create() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return new DOMWatcher(getConfig(config), CONSTRUCTOR_KEY);
    }

    /**
     * Returns an existing instance of DOMWatcher with the given
     * {@link DOMWatcherConfig}, or creates a new one.
     *
     * **NOTE:** It saves it for future reuse, so don't use this for temporary
     * short-lived watchers.
     */
  }, {
    key: "reuse",
    value: function reuse() {
      var _instances$get;
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var myConfig = getConfig(config);
      var configStrKey = (0, _text.objToStrKey)((0, _misc.omitKeys)(myConfig, {
        _root: null
      }));
      var root = myConfig._root === MH.getBody() ? null : myConfig._root;
      var instance = (_instances$get = instances.get(root)) === null || _instances$get === void 0 ? void 0 : _instances$get.get(configStrKey);
      if (!instance) {
        instance = new DOMWatcher(myConfig, CONSTRUCTOR_KEY);
        instances.sGet(root).set(configStrKey, instance);
      }
      return instance;
    }
  }]);
}();
/**
 * @interface
 */
/**
 * @interface
 */
/**
 * The handler is invoked with one argument:
 *
 * - a {@link MutationOperation} for a set of mutations related to a particular
 *   element
 *
 * The handler could be invoked multiple times in each "round" (cycle of event
 * loop) if there are mutation operations for more than one element that match
 * the supplied {@link OnMutationOptions}.
 */
// ----------------------------------------
var CONSTRUCTOR_KEY = MC.SYMBOL();
var instances = (0, _xMap.newXMap)(function () {
  return MH.newMap();
});
var getConfig = function getConfig(config) {
  var _config$subtree;
  return {
    _root: config.root || null,
    _subtree: (_config$subtree = config.subtree) !== null && _config$subtree !== void 0 ? _config$subtree : true
  };
};
var CATEGORIES_BITS = _dom.DOM_CATEGORIES_SPACE.bit;
var ADDED_BIT = CATEGORIES_BITS[MC.S_ADDED];
var REMOVED_BIT = CATEGORIES_BITS[MC.S_REMOVED];
var ATTRIBUTE_BIT = CATEGORIES_BITS[MC.S_ATTRIBUTE];

// ----------------------------------------

var getOptions = function getOptions(options) {
  var categoryBitmask = 0;
  var categories = (0, _validation.validateStrList)("categories", options.categories, _dom.DOM_CATEGORIES_SPACE.has);
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
    categoryBitmask = _dom.DOM_CATEGORIES_SPACE.bitmask; // default: all
  }
  var selector = options.selector || "";
  if (!MH.isString(selector)) {
    throw MH.usageError("'selector' must be a string");
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
  var attributes = MH.newSet();
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
  if (!MH.sizeOf(attributes) && !categoryBitmask && !addedTo && !removedFrom) {
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
var invokeCallback = function invokeCallback(callback, operation) {
  var currentTargets = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  if (!MH.lengthOf(currentTargets)) {
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
      })["catch"](_log.logError);
    }
  } catch (err) {
    _iterator9.e(err);
  } finally {
    _iterator9.f();
  }
};
//# sourceMappingURL=dom-watcher.cjs.map