/**
 * @module Debugging
 *
 * @categoryDescription Logging
 * {@link Debugging.LocalConsole | LocalConsole} logs to the local browser
 * console. On iOS devices it uses `console.info` for all levels because of a
 * bug in WebKit whereby other log levels don't show in some remote debuggers.
 * Also, iOS console only supports a single argument, so it joins the given
 * arguments as a single string.
 *
 * {@link Debugging.RemoteConsole | RemoteConsole} connects to a remote
 * {@link https://socket.io/ | socket.io} server and logs messages to it.
 *
 * {@link Console} holds a {@link LocalConsole} and optionally a
 * {@link RemoteConsole} and logs to both.
 *
 * {@link Logger} holds a {@link Console} and implements debug at 10 different
 * levels. The maximum logged level is configurable. Also emits a prefix in
 * debug messages that identifies the instance.
 */
import { LogFunction } from "../globals/types.cjs";
import { LoggerInterface, LoggerConfig } from "../debug/types.cjs";
/**
 * Holds a {@link Console} and implements debug at 10 different levels. The
 * maximum logged level is configurable. Also emits a prefix in debug messages
 * that identifies the instance.
 *
 * @category Logging
 */
export declare class Logger implements LoggerInterface {
    readonly debug: LogFunction;
    readonly log: LogFunction;
    readonly info: LogFunction;
    readonly warn: LogFunction;
    readonly error: LogFunction;
    readonly debug1: LogFunction;
    readonly debug2: LogFunction;
    readonly debug3: LogFunction;
    readonly debug4: LogFunction;
    readonly debug5: LogFunction;
    readonly debug6: LogFunction;
    readonly debug7: LogFunction;
    readonly debug8: LogFunction;
    readonly debug9: LogFunction;
    readonly debug10: LogFunction;
    readonly getName: () => string;
    readonly getVerbosityLevel: () => number;
    readonly setVerbosityLevel: (level: number) => void;
    constructor(config?: LoggerConfig);
}
export type ErrorMatchList = Array<RegExp | string | {
    new (): Error;
} | symbol>;
//# sourceMappingURL=logger.d.ts.map