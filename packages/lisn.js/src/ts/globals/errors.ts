/**
 * @module Errors
 */

import { LOG_PREFIX } from "@lisn/globals/minification-constants";

/**
 * Base error type emitted by LISN.
 */
export abstract class LisnError extends Error {}

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
