/**
 * @module Utils
 */
import { CommaSeparatedStr } from "../globals/types.js";
/**
 * Returns true if the input is a string array or comma-separated string, whose
 * elements are valid according to the `validator` function.
 *
 * @param allowEmpty If `false`, then input without any entries is
 * considered _invalid_.
 *
 * @category Validation
 */
export declare const isValidStrList: <T extends string = string>(value: unknown, checkFn: (value: string) => value is T, allowEmpty?: boolean) => value is CommaSeparatedStr<T> | T[];
/**
 * Returns an array of strings from the given list while validating each one
 * using the `checkFn` function.
 *
 * If it returns without throwing, the input is necessarily valid.
 * If the result is an empty array, it will return `null`.
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                If the input is not a string or array of strings, or if any
 *                entries do not pass `checkFn`.
 *
 * @param key Used in the error message thrown
 *
 * @returns `undefined` if the input contains no non-empty values (after
 * trimming whitespace on left/right from each), otherwise a non-empty array of
 * values.
 *
 * @category Validation
 */
export declare const validateStrList: <T extends string = string>(key: string, value: unknown, checkFn?: (value: string) => value is T) => T[] | undefined;
/**
 * Returns an array of numbers from the given list.
 *
 * If it returns without throwing, the input is necessarily valid.
 * If the result is an empty array, it will return `null`.
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                If the input is not a number or array of numbers. Numerical
 *                strings are accepted.
 *
 * @param key Used in the error message thrown
 *
 * @returns `undefined` if the input contains no non-empty values (after
 * trimming whitespace on left/right from each), otherwise a non-empty array of
 * values.
 *
 * @category Validation
 */
export declare const validateNumList: (key: string, value: unknown) => number[] | undefined;
/**
 * Returns a number corresponding to the supplied value, ensuring the supplied
 * value is a valid number or a string containing only a number.
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                If the value is invalid.
 *
 * @returns `undefined` if the input is nullish.
 *
 * @category Validation
 */
export declare const validateNumber: (key: string, value: unknown) => number | undefined;
/**
 * Returns a boolean corresponding to the given value as follows:
 *
 * - `null` and `undefined` result in `undefined`
 * - `false` and `"false"` result in `false`
 * - `""`, `true` and `"true"` result in `true`
 * - other values throw an error error
 *
 * Note that an empty string is treated as `true`.
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                If the value is not a valid boolean or boolean string.
 *
 * @returns `undefined` if the input is nullish.
 *
 * @category Validation
 */
export declare const validateBoolean: (key: string, value: unknown) => boolean | undefined;
/**
 * Returns a valid string from the supplied value, ensuring the supplied value
 * is a string that conforms to the given `checkFn`.
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                If the value is invalid.
 *
 * @param checkFn If given and the supplied value is a string, then it is
 *                called with the value as a single argument. It must return
 *                true if the value is valid and false otherwise. If it is not
 *                given, then any literal string is accepted.
 *
 * @returns `undefined` if the input is nullish.
 *
 * @category Validation
 */
export declare const validateString: <T extends string = string>(key: string, value: unknown, checkFn?: (value: string) => value is T) => T | undefined;
/**
 * Like {@link validateString} except it requires input to be given and
 * non-empty.
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                If the value is invalid or empty.
 *
 * @category Validation
 */
export declare const validateStringRequired: <T extends string = string>(key: string, value: unknown, checkFn?: (value: string) => value is T) => T;
/**
 * Returns a valid boolean or a string from the supplied value, ensuring the
 * supplied value is either a boolean or boolean string (see
 * {@link validateBoolean}), or a string that conforms to the given `checkFn`.
 *
 * @throws {@link Errors.LisnUsageError | LisnUsageError}
 *                If the value is invalid.
 *
 * @param stringCheckFn If given and the supplied value is a string _other than
 *                      a boolean string_, then it is called with the value as
 *                      a single argument. It must return true if the value is
 *                      valid and false otherwise. If it is not given, then any
 *                      literal string is accepted.
 *
 * @category Validation
 */
export declare const validateBooleanOrString: <T extends string = string>(key: string, value: unknown, stringCheckFn?: (value: string) => value is T) => boolean | T | undefined;
//# sourceMappingURL=validation.d.ts.map