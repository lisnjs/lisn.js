"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
    get: function get() {
      return _bundleEssentials[key];
    }
  });
});
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
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
widgets.ScrollToTop.register();
widgets.Scrollbar.register();
widgets.Sortable.register();
widgets.TrackGesture.register();
widgets.TrackScroll.register();
widgets.TrackSize.register();
widgets.TrackView.register();
//# sourceMappingURL=bundle.cjs.map