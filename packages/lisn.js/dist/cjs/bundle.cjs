"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  actions: true,
  triggers: true,
  widgets: true
};
exports.widgets = exports.triggers = exports.actions = void 0;
require("./bundle-slim.cjs");
var actions = _interopRequireWildcard(require("./actions/index.cjs"));
var _actions = actions;
exports.actions = actions;
var triggers = _interopRequireWildcard(require("./triggers/index.cjs"));
var _triggers = triggers;
exports.triggers = triggers;
var widgets = _interopRequireWildcard(require("./widgets/index.cjs"));
var _widgets = widgets;
exports.widgets = widgets;
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
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * @module
 * @ignore
 * @internal
 */

// side effects

actions.AddClass.register();
actions.RemoveClass.register();
actions.AnimatePlay.register();
actions.AnimatePause.register();
actions.Animate.register();
actions.Display.register();
actions.Undisplay.register();
actions.Open.register();
actions.NextPage.register();
actions.PrevPage.register();
actions.GoToPage.register();
actions.EnablePage.register();
actions.DisablePage.register();
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
widgets.AutoHide.register();
widgets.Collapsible.register();
widgets.Popup.register();
widgets.Modal.register();
widgets.Offcanvas.register();
widgets.PageLoader.register();
widgets.Pager.register();
widgets.SameHeight.register();
widgets.Scrollbar.register();
widgets.ScrollToTop.register();
// widgets.SmoothScroll.register();
widgets.Sortable.register();
widgets.TrackGesture.register();
widgets.TrackScroll.register();
widgets.TrackSize.register();
widgets.TrackView.register();
//# sourceMappingURL=bundle.cjs.map