/**
 * @module Debugging
 */
import { LogFunction } from "../globals/types.cjs";
import { ConsoleInterface } from "../debug/types.cjs";
/**
 * Connects to a remote {@link https://socket.io/ | socket.io} server and logs
 * messages to it.
 *
 * In the root of the Git repository, there is a simple example server that
 * listens for these messages and logs them to the local console.
 *
 * @category Logging
 */
export declare class RemoteConsole implements ConsoleInterface {
    /**
     * Emits a message with ID `console.debug`.
     */
    readonly debug: LogFunction;
    /**
     * Emits a message with ID `console.log`.
     */
    readonly log: LogFunction;
    /**
     * Emits a message with ID `console.info`.
     */
    readonly info: LogFunction;
    /**
     * Emits a message with ID `console.warn`.
     */
    readonly warn: LogFunction;
    /**
     * Emits a message with ID `console.error`.
     */
    readonly error: LogFunction;
    /**
     * Disconnects and destroys the {@link RemoteConsole}. Cannot be undone.
     */
    readonly destroy: () => void;
    /**
     * Returns true if the client has been disconnected for more than
     * the connect timeout.
     */
    readonly hasFailed: () => boolean;
    /**
     * Creates a new {@link RemoteConsole} and attempts to connect to the logger
     * at the given URL.
     *
     * @param {} url                      The URL of the remote logger.
     * @param {} [connectTimeout = 1500]  The timeout in ms for a connection
     *                                    to be considered failed.
     */
    constructor(url: string, connectTimeout?: number);
    /**
     * Returns an existing {@link RemoteConsole} for the given URL and timeout or
     * creates a new one.
     *
     * If a new one is created, it will be saved for later reuse.
     *
     * @param {} url               The URL of the remote logger.
     * @param {} [connectTimeout]  The timeout in ms for a remote connection to
     *                             be considered failed. Default is 1500.
     */
    static reuse(url: string, connectTimeout?: number): RemoteConsole;
}
//# sourceMappingURL=remote-console.d.ts.map