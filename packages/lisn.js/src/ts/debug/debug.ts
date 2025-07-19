/**
 * @module
 * @ignore
 * @internal
 */

// Used internally to allow importing it conditionally based on the bundle
// type. This module's export is replaced with a dummy null export in
// production bundles.
import { Logger } from "@lisn/debug/logger";
import { Console } from "@lisn/debug/console";
import { RemoteConsole } from "@lisn/debug/remote-console";

const result = { Logger, Console, RemoteConsole };
export default result as typeof result | null;
