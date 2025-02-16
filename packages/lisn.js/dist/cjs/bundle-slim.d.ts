/**
 * @module
 * @ignore
 * @internal
 */
import "./bundle-essentials.cjs";
import * as _actions from "./actions/index.cjs";
export * from "./bundle-essentials.cjs";
export declare const actions: Omit<typeof _actions, "Open" | "NextPage" | "PrevPage" | "GoToPage" | "EnablePage" | "DisablePage">;
export * as triggers from "./triggers/index.cjs";
//# sourceMappingURL=bundle-slim.d.ts.map