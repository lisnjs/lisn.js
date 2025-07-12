"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  actions: true,
  triggers: true
};
exports.triggers = exports.actions = void 0;
var _bundleEssentials = require("./bundle-essentials.cjs");
Object.keys(_bundleEssentials).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _bundleEssentials[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _bundleEssentials[key];
    }
  });
});
var _misc = require("./utils/misc.cjs");
var _actions = _interopRequireWildcard(require("./actions/index.cjs"));
var triggers = _interopRequireWildcard(require("./triggers/index.cjs"));
var _triggers = triggers;
exports.triggers = triggers;
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * @module
 * @ignore
 * @internal
 */

// side effects

// --- remove widget specific actions
const actions = exports.actions = (0, _misc.omitKeys)(_actions, {
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
triggers.LayoutTrigger.register();
triggers.LoadTrigger.register();
triggers.CheckTrigger.register();
triggers.ClickTrigger.register();
triggers.PressTrigger.register();
triggers.HoverTrigger.register();
triggers.ScrollTrigger.register();
triggers.Trigger.register();
triggers.ViewTrigger.register();
//# sourceMappingURL=bundle-slim.cjs.map