/**
 * @module
 * @ignore
 * @internal
 */

import "@lisn/bundle-essentials"; // side effects

import * as _ from "@lisn/_internal";
import * as _actions from "@lisn/actions/index";
import * as triggers from "@lisn/triggers/index";

export * from "@lisn/bundle-essentials";

// --- remove widget specific actions
export const actions = _.omitKeys(_actions, {
  Open: 1,
  NextPage: 1,
  PrevPage: 1,
  GoToPage: 1,
  EnablePage: 1,
  DisablePage: 1,
} as const);

export * as triggers from "@lisn/triggers/index";

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
