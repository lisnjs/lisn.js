/**
 * @module
 * @ignore
 * @internal
 */

// Used internally to allow importing it conditionally based on the bundle
// type. This module's export is replaced with a dummy null export in
// production bundles.
import { Logger } from "./logger.js";
import { Console } from "./console.js";
import { RemoteConsole } from "./remote-console.js";
export default {
  Logger: Logger,
  Console: Console,
  RemoteConsole: RemoteConsole
};
//# sourceMappingURL=debug.js.map