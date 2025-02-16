/**
 * @module Debugging
 */
import { LogFunction } from "../globals/types.cjs";
/**
 * @interface
 */
export type ConsoleInterface = {
    /**
     * Logs a message at level 'debug'.
     */
    readonly debug: LogFunction;
    /**
     * Logs a message at level 'log'.
     */
    readonly log: LogFunction;
    /**
     * Logs a message at level 'info'.
     */
    readonly info: LogFunction;
    /**
     * Logs a message at level 'warn'.
     */
    readonly warn: LogFunction;
    /**
     * Logs a message at level 'error'.
     */
    readonly error: LogFunction;
};
export type LoggerInterface = ConsoleInterface & {
    /**
     * Logs a debugging message with a special debug ID in the prefix, at level 1.
     */
    readonly debug1: LogFunction;
    /**
     * Logs a debugging message with a special debug ID in the prefix, at level 2.
     */
    readonly debug2: LogFunction;
    /**
     * Logs a debugging message with a special debug ID in the prefix, at level 3.
     */
    readonly debug3: LogFunction;
    /**
     * Logs a debugging message with a special debug ID in the prefix, at level 4.
     */
    readonly debug4: LogFunction;
    /**
     * Logs a debugging message with a special debug ID in the prefix, at level 5.
     */
    readonly debug5: LogFunction;
    /**
     * Logs a debugging message with a special debug ID in the prefix, at level 6.
     */
    readonly debug6: LogFunction;
    /**
     * Logs a debugging message with a special debug ID in the prefix, at level 7.
     */
    readonly debug7: LogFunction;
    /**
     * Logs a debugging message with a special debug ID in the prefix, at level 8.
     */
    readonly debug8: LogFunction;
    /**
     * Logs a debugging message with a special debug ID in the prefix, at level 9.
     */
    readonly debug9: LogFunction;
    /**
     * Logs a debugging message with a special debug ID in the prefix, at level 10.
     */
    readonly debug10: LogFunction;
    /**
     * Returns the name of the Logger that was passed to the constructor.
     */
    readonly getName: () => string;
    /**
     * Returns the {@link LoggerConfig.verbosityLevel}.
     */
    readonly getVerbosityLevel: () => number;
    /**
     * Sets the {@link LoggerConfig.verbosityLevel}.
     */
    readonly setVerbosityLevel: (level: number) => void;
};
/**
 * @interface
 */
export type LoggerConfig = {
    /**
     * The name that's shown in the prefix of all emitted messages.
     */
    name?: string;
    /**
     * Set the verbosity level. Defaults to
     * {@link Settings.settings.verbosityLevel | settings.verbosityLevel}.
     */
    verbosityLevel?: number;
    /**
     * Set the remote logger URL. Defaults to
     * {@link Settings.settings.remoteLoggerURL | settings.remoteLoggerURL}.
     */
    remoteLoggerURL?: string;
    /**
     * Set the remote logger connection timeout.
     * See {@link Debugging.RemoteConsole | RemoteConsole}.
     */
    remoteLoggerConnectTimeout?: number;
    /**
     * Set whether to use remote logger on mobile devices only. Defaults to
     * {@link Settings.settings.remoteLoggerOnMobileOnly | settings.remoteLoggerOnMobileOnly}.
     */
    remoteLoggerOnMobileOnly?: boolean;
    /**
     * Set the ID of the logger that will be shown in debugging messages.
     * Defaults to an 8-character random string.
     */
    debugID?: string;
    /**
     * Log the given value when the logger is created (for debugging purposes, to
     * be able to see the debug ID of the new Logger).
     */
    logAtCreation?: unknown;
};
export type LevelName = "debug" | "log" | "info" | "warn" | "error";
//# sourceMappingURL=types.d.ts.map