/**
 * @module Debugging
 */

import { LogFunction } from "@lisn/globals/types";

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
   * Updates the name of the logger.
   *
   * @since v1.3.0
   */
  readonly setName: (name: string) => void;

  /**
   * Returns the name of the logger.
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

  /**
   * Returns the {@link LoggerConfig.compact}.
   *
   * @since v1.3.0
   */
  readonly usesCompact: () => boolean;

  /**
   * Sets the {@link LoggerConfig.compact}.
   *
   * @since v1.3.0
   */
  readonly useCompact: (compact: boolean) => void;

  /**
   * Returns a copy of the full configuration used by the logger.
   *
   * @since v1.3.0
   */
  readonly getConfig: () => EffectiveLoggerConfig;
};

/**
 * @interface
 */
export type LoggerConfig = {
  /**
   * The name that's shown in the prefix of all emitted messages.
   *
   * @defaultValue ""
   */
  name?: string;

  /**
   * Set the verbosity level.
   *
   * @defaultValue {@link Settings.settings.verbosityLevel | settings.verbosityLevel}
   */
  verbosityLevel?: number;

  /**
   * Whether to format objects when logging in debug level and add spacing and
   * indentation.
   *
   * @since v1.3.0
   *
   * @defaultValue {@link Settings.settings.compactLogging | settings.compactLogging}
   */
  compact?: boolean;

  /**
   * Set the remote logger URL.
   *
   * @defaultValue {@link Settings.settings.remoteLoggerURL | settings.remoteLoggerURL}.
   */
  remoteLoggerURL?: string;

  /**
   * Set the remote logger connection timeout.
   * See {@link Debugging.RemoteConsole | RemoteConsole}.
   *
   * @defaultValue {@link Settings.settings.remoteLoggerConnectTimeout | settings.remoteLoggerConnectTimeout}.
   */
  remoteLoggerConnectTimeout?: number;

  /**
   * Set whether to use remote logger on mobile devices only.
   *
   * @defaultValue {@link Settings.settings.remoteLoggerOnMobileOnly | settings.remoteLoggerOnMobileOnly}.
   */
  remoteLoggerOnMobileOnly?: boolean;

  /**
   * Set the ID of the logger that will be shown in debugging messages.
   *
   * If not specified, the default for logger instances associated with a tagged
   * object, is the object's tag; otherwise an 8-character randomly generated string.
   *
   * @defaultValue undefined // see explanation above
   */
  debugID?: string;

  /**
   * Log the given value when the logger is created.
   *
   * @defaultValue undefined // none
   */
  logAtCreation?: unknown;

  /**
   * If given, a string representation of the element will be appended to the
   * name. Moreover, if the element is
   * {@link Debugging.Logger.tagObject | tagged}, the {@link debugID} will use
   * that tag by default. And if the element is not tagged, it will be tagged
   * with the {@link debugID} of the logger.
   *
   * @since v1.3.0
   *
   * @defaultValue undefined // none
   */
  forElement?: Element;
};

/**
 * @see {@ling LoggerConfig}
 *
 * @interface
 */
export type EffectiveLoggerConfig = {
  name: string;
  verbosityLevel: number;
  compact: boolean;
  remoteLoggerURL: string;
  remoteLoggerConnectTimeout: number;
  remoteLoggerOnMobileOnly: boolean;
  debugID: string;
  logAtCreation?: unknown;
  forElement?: Element;
};

export type LevelName = "debug" | "log" | "info" | "warn" | "error";
