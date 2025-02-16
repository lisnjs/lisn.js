/**
 * @module Errors
 */
/**
 * Base error type emitted by LISN.
 */
export declare abstract class LisnError extends Error {
}
/**
 * Error type emitted for invalid input or incorrect usage of a function.
 */
export declare class LisnUsageError extends LisnError {
    constructor(message?: string);
}
/**
 * Error type emitted if an assertion is wrong => report bug.
 */
export declare class LisnBugError extends LisnError {
    constructor(message?: string);
}
//# sourceMappingURL=errors.d.ts.map