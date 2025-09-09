/**
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
 * levels. The maximum logged level is configurable. It emits a prefix in
 * debug messages that identifies the instance. It also supports various other
 * configuration options.
 *
 * @module Debugging
 */

import * as _ from "@lisn/_internal";

import { settings } from "@lisn/globals/settings";

import { LogFunction } from "@lisn/globals/types";

import { randId, joinAsString, formatAsString } from "@lisn/utils/text";

import {
  LoggerInterface,
  LoggerConfig,
  EffectiveLoggerConfig,
} from "@lisn/debug/types";
import { Console } from "@lisn/debug/console";

/**
 * Holds a {@link Console} and implements debug at 10 different levels. The
 * maximum logged level is configurable. Also emits a prefix in debug messages
 * that identifies the instance.
 */
export class Logger implements LoggerInterface {
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
  readonly setName: (name: string) => void;
  readonly getVerbosityLevel: () => number;
  readonly setVerbosityLevel: (level: number) => void;
  readonly usesCompact: () => boolean;
  readonly useCompact: (compact: boolean) => void;
  readonly getConfig: () => EffectiveLoggerConfig;
  readonly getChildLogger: (config?: LoggerConfig) => Logger;

  /**
   * Tags the given object, so that the tag is included with it whenever the
   * object is logged.
   *
   * @param tag If not given, a random one will be generated
   *
   * @since v1.3.0
   */
  static tagObject(object: object, tag?: string) {
    objectTags.set(object, tag ?? randId(4));
  }

  /**
   * Returns a logger instance associated with the given object. If there's no
   * logger for this object yet, it is created using the given `defaultConfig`.
   *
   * If `defaultConfig` does not explicitly set `name`, then a name is chosen as
   * follows:
   * - if object has a {@link tagObject}, the tag will be used
   * - otherwise if object's
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString | string tag}
   * is other than "Object", this will be used
   * - otherwise name will be blank
   *
   * If `defaultConfig` does not explicitly set `debugID` but the object is
   * {@link tagObject | tagged}, a newly created logger will use that for its
   * `debugID`. An existing logger instance however won't have its `debugID`
   * changed.
   *
   * ------
   *
   * If the object is not tagged, it will be tagged with the final `debugID` of
   * the logger.
   *
   * ------
   *
   * If `defaultConfig` includes `logAtCreation` it will always be logged, even
   * if there's already an existing logger instance.
   *
   * ### Updating existing instance configuration
   *
   * If `defaultConfig` includes `verbosityLevel` or `compact`, an existing
   * logger instance's {@link setVerbosityLevel | verbosity level} and
   * {@link useCompact | compact} settings will be updated.
   *
   * And if a non-blank name was chosen based on the given object (as explained
   * above), the logger instance will also be {@link setName | renamed}.
   */
  static getLoggerFor(object: object, defaultConfig?: LoggerConfig) {
    const objTag = objectTags.get(object);
    const strTag = _.typeOrClassOf(object);
    const defaultName = objTag ?? (strTag === "Object" ? void 0 : strTag);

    const config: LoggerConfig = _.merge(defaultConfig, {
      name: defaultConfig?.name || defaultName,
      debugID: defaultConfig?.debugID || objTag,
    });

    let logger = instances.get(object);

    if (!logger) {
      logger = new Logger(config);
      instances.set(object, logger);
    } else {
      const { name, verbosityLevel, compact } = config;

      if (name && name !== defaultName) {
        logger.setName(name);
      }

      if (!_.isUndefined(verbosityLevel)) {
        logger.setVerbosityLevel(verbosityLevel);
      }

      if (!_.isUndefined(compact)) {
        logger.useCompact(compact);
      }

      if ("logAtCreation" in config) {
        logger.debug5("Reused logger:", config.logAtCreation);
      }
    }

    if (_.isUndefined(objTag)) {
      objectTags.set(object, logger.getConfig().debugID);
    }

    return logger;
  }

  constructor(config?: LoggerConfig) {
    const myConfig: EffectiveLoggerConfig = {
      // set defaults
      name: "",
      verbosityLevel: settings.verbosityLevel,
      compact: settings.compactLogging,
      remoteLoggerURL: settings.remoteLoggerURL ?? "",
      remoteLoggerOnMobileOnly: settings.remoteLoggerOnMobileOnly,
      remoteLoggerConnectTimeout: settings.remoteLoggerConnectTimeout,
      debugID: randId(4),
      parent: void 0,
      logAtCreation: void 0,
      forElement: void 0,
    };

    const parent = config?.parent;
    if (parent) {
      // override some defaults
      _.copyExistingKeysTo(
        _.omitKeys(parent.getConfig(), {
          name: 1,
          debugID: 1,
          parent: 1,
          logAtCreation: 1,
        }),
        myConfig,
      );
    }

    // override with explicit config
    _.copyExistingKeysTo(config ?? {}, myConfig);

    if (
      getBooleanURLParam("disableRemoteLog") ||
      (myConfig.remoteLoggerOnMobileOnly && isMobile())
    ) {
      myConfig.remoteLoggerURL = "";
    }

    const myConsole = new Console(
      myConfig.remoteLoggerURL,
      myConfig.remoteLoggerConnectTimeout,
    );

    const { forElement } = myConfig;
    let logPrefix = "";
    let debugPrefix = "";

    this.getName = () => myConfig.name;
    this.setName = (name: string) => {
      if (forElement) {
        name += "-" + formatAsString(forElement);
      }
      myConfig.name = name;

      const logNames: string[] = [];
      const debugNames: string[] = [];
      let c: EffectiveLoggerConfig | undefined = myConfig;
      while (c) {
        logNames.push(c.name);
        debugNames.push(c.name + "_" + c.debugID);
        c = c.parent?.getConfig();
      }

      logPrefix = `[LISN: ${logNames.reverse().join(" > ")}]`;
      debugPrefix = `[LISN: ${debugNames.reverse().join(" > ")}]`;
    };

    this.getVerbosityLevel = () => myConfig.verbosityLevel;
    this.setVerbosityLevel = (l) => {
      myConfig.verbosityLevel = l;
    };

    this.usesCompact = () => myConfig.compact;
    this.useCompact = (p) => {
      myConfig.compact = p;
    };

    this.getConfig = () => _.copyNested(myConfig);

    this.getChildLogger = (childConfig) =>
      new Logger(_.merge(childConfig, { parent: this }));

    this.debug1 = (...args) => logDebugN(this, 1, debugPrefix, ...args);
    this.debug2 = (...args) => logDebugN(this, 2, debugPrefix, ...args);
    this.debug3 = (...args) => logDebugN(this, 3, debugPrefix, ...args);
    this.debug4 = (...args) => logDebugN(this, 4, debugPrefix, ...args);
    this.debug5 = (...args) => logDebugN(this, 5, debugPrefix, ...args);
    this.debug6 = (...args) => logDebugN(this, 6, debugPrefix, ...args);
    this.debug7 = (...args) => logDebugN(this, 7, debugPrefix, ...args);
    this.debug8 = (...args) => logDebugN(this, 8, debugPrefix, ...args);
    this.debug9 = (...args) => logDebugN(this, 9, debugPrefix, ...args);
    this.debug10 = (...args) => logDebugN(this, 10, debugPrefix, ...args);

    this.debug = (...args) => myConsole.debug(debugPrefix, ...args);
    this.log = (...args) => myConsole.log(logPrefix, ...args);
    this.info = (...args) => myConsole.info(logPrefix, ...args);
    this.warn = (...args) => myConsole.warn(logPrefix, ...args);
    this.error = (...args) => {
      myConsole.error(logPrefix, ...args);
    };

    // --------------------

    this.setName(myConfig.name); // append forElement and parent name if needed

    if (forElement) {
      if (!objectTags.has(forElement)) {
        objectTags.set(forElement, myConfig.debugID);
      }
    }

    if ("logAtCreation" in myConfig) {
      this.debug5("New logger", myConfig.logAtCreation);
    }
  }
}

export type ErrorMatchList = Array<
  RegExp | string | { new (): Error } | symbol
>;

// ----------------------------------------

const instances = _.createWeakMap<object, Logger>();
const objectTags = _.createWeakMap<object, string>();

const logDebugN = (
  logger: Logger,
  level: number,
  debugPrefix: string,
  ...args: unknown[]
) => {
  if (logger.getVerbosityLevel() < level) {
    return;
  }

  const usesCompact = logger.usesCompact();
  const string = joinAsString(
    {
      separator: usesCompact ? " " : "\n",
      depth: 10,
      lineLength: 100,
      compact: usesCompact,
      formatter: (value) => {
        const tag = _.isObject(value) ? objectTags.get(value) : void 0;
        return tag ? `TAGGED: ${tag}` : value;
      },
    },
    ...args,
  );

  const filter = settings.debugMessageFilter;
  if (!filter || (debugPrefix + " " + string).match(filter)) {
    logger.debug(`[DEBUG ${level}]`, string);
  }
};

const isMobile = () => {
  const regex =
    /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(_.userAgent);
};

const getBooleanURLParam = (name: string) => {
  const value = getURLParameter(name);
  return value && (value === "1" || _.toLowerCase(value) === "true");
};

const getURLParameter = (name: string) => {
  if (!_.hasDOM()) {
    return null;
  }

  const loc = _.getDoc().location;
  if (typeof URLSearchParams !== "undefined") {
    const urlParams = new URLSearchParams(loc.search);
    return urlParams.get(name);
  }

  name = _.strReplace(name, /[[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  const match = loc.href.match(regex);

  if (!match) {
    return null;
  }

  if (!match[2]) {
    return "";
  }
  return decodeURIComponent(_.strReplace(match[2], /\+/g, " "));
};

_.brandClass(Logger, "Logger");
