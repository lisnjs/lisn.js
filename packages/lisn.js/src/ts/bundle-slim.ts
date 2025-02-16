/**
 * @module
 * @ignore
 * @internal
 */

import "@lisn/bundle-essentials"; // side effects

import { omitKeys } from "@lisn/utils/misc";
import * as _actions from "@lisn/actions/index";
import * as triggers from "@lisn/triggers/index";

export * from "@lisn/bundle-essentials";

// --- remove widget specific actions
export const actions = omitKeys(_actions, {
  Open: true,
  NextPage: true,
  PrevPage: true,
  GoToPage: true,
  EnablePage: true,
  DisablePage: true,
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
triggers.ClickTrigger.register();
triggers.PressTrigger.register();
triggers.HoverTrigger.register();
triggers.ScrollTrigger.register();
triggers.Trigger.register();
triggers.ViewTrigger.register();
