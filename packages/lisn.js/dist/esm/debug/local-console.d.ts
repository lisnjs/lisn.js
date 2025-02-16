/**
 * @module Debugging
 */
import { LogFunction } from "../globals/types.js";
import { ConsoleInterface } from "../debug/types.js";
/**
 * Logs to the local browser console. On iOS devices it uses `console.info` for
 * all levels because of a bug in WebKit whereby other log levels don't show in
 * some remote debuggers. Also, iOS console only supports a single argument, so
 * it joins the given arguments as a single string.
 *
 * @category Logging
 */
export declare class LocalConsole implements ConsoleInterface {
    readonly debug: LogFunction;
    readonly log: LogFunction;
    readonly info: LogFunction;
    readonly warn: LogFunction;
    readonly error: LogFunction;
    constructor();
}
//# sourceMappingURL=local-console.d.ts.map