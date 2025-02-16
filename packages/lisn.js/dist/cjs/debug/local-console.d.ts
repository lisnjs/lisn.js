/**
 * @module Debugging
 */
import { LogFunction } from "../globals/types.cjs";
import { ConsoleInterface } from "../debug/types.cjs";
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