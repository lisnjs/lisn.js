/**
 * @module
 * @ignore
 * @internal
 */
export declare const isTouchScreen: () => boolean;
export declare const copyExistingKeys: <T extends object>(fromObj: T, toObj: T) => void;
export declare const omitKeys: <O extends object, R extends { [K in keyof O]?: unknown; }>(obj: O, keysToRm: R) => Omit<O, keyof R>;
export declare const compareValuesIn: <T extends object>(objA: T, objB: T, roundTo?: number) => boolean;
export declare const keyExists: <T extends object>(obj: T, key: string | number | symbol) => key is keyof T;
export declare const toArrayIfSingle: <T>(value?: T | T[] | null | undefined) => T[];
export declare const toBool: (value: unknown) => boolean | null;
//# sourceMappingURL=misc.d.ts.map