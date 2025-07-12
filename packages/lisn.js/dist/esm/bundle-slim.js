/**
 * @module
 * @ignore
 * @internal
 */

import "./bundle-essentials.js"; // side effects

import { omitKeys } from "./utils/misc.js";
import * as _actions from "./actions/index.js";
import * as triggers from "./triggers/index.js";
export * from "./bundle-essentials.js";

// --- remove widget specific actions
export const actions = omitKeys(_actions, {
  Open: true,
  NextPage: true,
  PrevPage: true,
  GoToPage: true,
  EnablePage: true,
  DisablePage: true
});
import * as _triggers from "./triggers/index.js";
export { _triggers as triggers };
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
//# sourceMappingURL=bundle-slim.js.map