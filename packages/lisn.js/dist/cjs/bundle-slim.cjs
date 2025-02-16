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
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
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
triggers.ClickTrigger.register();
triggers.PressTrigger.register();
triggers.HoverTrigger.register();
triggers.ScrollTrigger.register();
triggers.Trigger.register();
triggers.ViewTrigger.register();
//# sourceMappingURL=bundle-slim.cjs.map