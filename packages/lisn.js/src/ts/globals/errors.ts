/**
 * @module Errors
 */

import * as _ from "@lisn/_internal";

/**
 * Base error type emitted by LISN.
 */
export abstract class LisnError extends Error {}

/**
 * Error type emitted for invalid input or incorrect usage of a function.
 */
export class LisnUsageError extends LisnError {
  constructor(message = "") {
    super(`${_.LOG_PREFIX} Incorrect usage: ${message}`);
    this.name = "LisnUsageError";
  }
}

/**
 * Error type emitted if an assertion is wrong => report bug.
 */
export class LisnBugError extends LisnError {
  constructor(message = "") {
    super(`${_.LOG_PREFIX} Please report a bug: ${message}`);
    this.name = "LisnBugError";
  }
}

// ----------

/**
 * @ignore
 * @internal
 */
export const isUsageError = (value: unknown) =>
  _.isInstanceOf(value, LisnUsageError);

/**
 * @ignore
 * @internal
 */
export const usageError = (msg: string) => new LisnUsageError(msg);

/**
 * @ignore
 * @internal
 */
export const bugError = (msg: string) => new LisnBugError(msg);

/**
 * @ignore
 * @internal
 */
export const illegalConstructorError = (useWhat: string) =>
  usageError(`Illegal constructor. Use ${useWhat}.`);

_.brandClass(LisnError, "LisnError");
_.brandClass(LisnUsageError, "LisnUsageError");
_.brandClass(LisnBugError, "LisnBugError");
