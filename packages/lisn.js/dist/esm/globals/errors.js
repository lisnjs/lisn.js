/**
 * @module Errors
 */

import { LOG_PREFIX } from "./minification-constants.js";

/**
 * Base error type emitted by LISN.
 */
export class LisnError extends Error {}

/**
 * Error type emitted for invalid input or incorrect usage of a function.
 */
export class LisnUsageError extends LisnError {
  constructor(message = "") {
    super(`${LOG_PREFIX} Incorrect usage: ${message}`);
    this.name = "LisnUsageError";
  }
}

/**
 * Error type emitted if an assertion is wrong => report bug.
 */
export class LisnBugError extends LisnError {
  constructor(message = "") {
    super(`${LOG_PREFIX} Please report a bug: ${message}`);
    this.name = "LisnBugError";
  }
}
//# sourceMappingURL=errors.js.map