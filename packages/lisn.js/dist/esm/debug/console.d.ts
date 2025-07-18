/**
 * @module Debugging
 */
import { LogFunction } from "../globals/types.js";
import { ConsoleInterface } from "../debug/types.js";
/**
 * Holds a {@link LocalConsole} and optionally a {@link RemoteConsole} and logs
 * to both.
 */
export declare class Console implements ConsoleInterface {
    readonly debug: LogFunction;
    readonly log: LogFunction;
    readonly info: LogFunction;
    readonly warn: LogFunction;
    readonly error: LogFunction;
    /**
     * @param remoteUrl        Attempt to use a remote logger at this URL.
     * @param [connectTimeout] The timeout in ms for a remote connection to be
     *                         considered failed. See {@link RemoteConsole}.
     */
    constructor(remoteUrl?: string, connectTimeout?: number);
}
//# sourceMappingURL=console.d.ts.map