/**
 * @module Utils
 */
import { Position } from "../globals/types.js";
/**
 * @category Validation
 */
export declare const isValidPosition: (position: string) => position is Position;
/**
 * @category Validation
 */
export declare const isValidTwoFoldPosition: (position: string) => position is `${Position}-${Position}`;
/**
 * @ignore
 * @internal
 */
export declare const POSITIONS: readonly ["top", "bottom", "left", "right"];
//# sourceMappingURL=position.d.ts.map