/**
 * @module
 * @ignore
 * @internal
 */

import "./bundle-slim.js"; // side effects

import * as actions from "./actions/index.js";
import * as triggers from "./triggers/index.js";
import * as widgets from "./widgets/index.js";
export * from "./bundle-essentials.js";
import * as _actions from "./actions/index.js";
export { _actions as actions };
import * as _triggers from "./triggers/index.js";
export { _triggers as triggers };
import * as _widgets from "./widgets/index.js";
export { _widgets as widgets };
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
widgets.SmoothScroll.register();
widgets.Sortable.register();
widgets.TrackGesture.register();
widgets.TrackScroll.register();
widgets.TrackSize.register();
widgets.TrackView.register();
//# sourceMappingURL=bundle.js.map