/**
 * @module
 * @ignore
 * @internal
 */

import "./bundle.js"; // side effects

import { settings } from "./globals/settings.js";
settings.verbosityLevel = 10;
export * from "./bundle.js";
import * as _debug from "./debug/index.js";
export { _debug as debug };
import * as _utils from "./utils/index.js";
export { _utils as utils };
import * as _modules from "./modules/index.js";
export { _modules as modules };
//# sourceMappingURL=bundle-debug.js.map