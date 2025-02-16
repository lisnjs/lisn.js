"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LisnUsageError = exports.LisnError = exports.LisnBugError = void 0;
var _minificationConstants = require("./minification-constants.cjs");
/**
 * @module Errors
 */

/**
 * Base error type emitted by LISN.
 */
class LisnError extends Error {}

/**
 * Error type emitted for invalid input or incorrect usage of a function.
 */
exports.LisnError = LisnError;
class LisnUsageError extends LisnError {
  constructor(message = "") {
    super(`${_minificationConstants.LOG_PREFIX} Incorrect usage: ${message}`);
    this.name = "LisnUsageError";
  }
}

/**
 * Error type emitted if an assertion is wrong => report bug.
 */
exports.LisnUsageError = LisnUsageError;
class LisnBugError extends LisnError {
  constructor(message = "") {
    super(`${_minificationConstants.LOG_PREFIX} Please report a bug: ${message}`);
    this.name = "LisnBugError";
  }
}
exports.LisnBugError = LisnBugError;
//# sourceMappingURL=errors.cjs.map