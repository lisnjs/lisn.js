/**
 * @module
 * @ignore
 * @internal
 */

import "@lisn/bundle-slim"; // side effects

import * as actions from "@lisn/actions/index";
import * as triggers from "@lisn/triggers/index";
import * as widgets from "@lisn/widgets/index";

export * from "@lisn/bundle-essentials";
export * as actions from "@lisn/actions/index";
export * as triggers from "@lisn/triggers/index";
export * as widgets from "@lisn/widgets/index";

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
widgets.ScrollToTop.register();
widgets.Scrollbar.register();
widgets.Sortable.register();
widgets.TrackGesture.register();
widgets.TrackScroll.register();
widgets.TrackSize.register();
widgets.TrackView.register();
