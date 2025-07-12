/**
 * For minification optimization
 *
 * @module
 * @ignore
 * @internal
 */
import { BoundingRect, IterableObject, Constructor, InstanceType, MapBase, SetBase, Spread } from "../globals/types.cjs";
import { LisnUsageError, LisnBugError } from "../globals/errors.cjs";
export declare const root: any;
export declare const userAgent: string;
export declare const kebabToCamelCase: (str: string) => string;
export declare const camelToKebabCase: (str: string) => string;
export declare const prefixName: (name: string) => string;
export declare const prefixCssVar: (name: string) => string;
export declare const prefixCssJsVar: (name: string) => string;
export declare const prefixData: (name: string) => string;
export declare const prefixLisnData: (name: string) => string;
export declare const toLowerCase: (s: string) => string;
export declare const toUpperCase: (s: string) => string;
export declare const timeNow: () => number;
export declare const timeSince: (startTime: number) => number;
export declare const hasDOM: () => boolean;
export declare const getWindow: () => Window & typeof globalThis;
export declare const getDoc: () => Document;
export declare const getDocElement: () => HTMLElement;
export declare const getDocScrollingElement: () => HTMLElement | null;
export declare const getBody: () => HTMLElement;
export declare const getReadyState: () => DocumentReadyState;
export declare const getPointerType: (event: Event) => string | null;
export declare const onAnimationFrame: (callback: FrameRequestCallback) => number;
export declare const createElement: (tagName: string, options?: ElementCreationOptions) => HTMLElement;
export declare const createButton: (label?: string, tag?: string) => HTMLElement;
export declare const isNullish: (v: unknown) => v is null | undefined;
export declare const isEmpty: (v: unknown) => v is null | undefined | "";
export declare const isIterableObject: (v: unknown) => v is IterableObject<unknown>;
export declare const isArray: (v: unknown) => v is unknown[];
export declare const isObject: (v: unknown) => v is Object;
export declare const isNonPrimitive: (v: unknown) => v is object;
export declare const isNumber: (v: unknown) => v is number;
export declare const isString: (v: unknown) => v is string | String;
export declare const isLiteralString: (v: unknown) => v is string;
export declare const isBoolean: (v: unknown) => v is boolean;
export declare const isFunction: (v: unknown) => v is Function;
export declare const isDoc: (target: unknown) => target is Document;
export declare const isMouseEvent: (event: Event) => event is MouseEvent;
export declare const isPointerEvent: (event: Event) => event is PointerEvent;
export declare const isTouchPointerEvent: (event: Event) => event is PointerEvent;
export declare const isWheelEvent: (event: Event) => event is WheelEvent;
export declare const isKeyboardEvent: (event: Event) => event is KeyboardEvent;
export declare const isTouchEvent: (event: Event) => event is TouchEvent;
export declare const isNode: (target: unknown) => target is Node;
export declare const isElement: (target: unknown) => target is Element;
export declare const isHTMLElement: (target: unknown) => target is HTMLElement;
export declare const isNodeBAfterA: (nodeA: Node, nodeB: Node) => boolean;
export declare const strReplace: (s: string, match: string | RegExp, replacement: string) => string;
export declare const setTimer: any;
export declare const clearTimer: any;
export declare const getBoundingClientRect: (element: Element) => DOMRect;
export declare const copyBoundingRectProps: (rect: BoundingRect) => BoundingRect;
export declare const querySelector: (root: Element | Document, selector: string) => Element | null;
export declare const querySelectorAll: (root: Element | Document, selector: string) => NodeListOf<Element>;
export declare const docQuerySelector: (selector: string) => Element | null;
export declare const docQuerySelectorAll: (selector: string) => NodeListOf<Element>;
export declare const getElementById: (id: string) => HTMLElement | null;
export declare const getAttr: (element: Element, name: string) => string | null;
export declare const setAttr: (element: Element, name: string, value?: string) => void;
export declare const unsetAttr: (element: Element, name: string) => void;
export declare const delAttr: (element: Element, name: string) => void;
export declare const includes: (arr: readonly unknown[] | string, v: unknown, startAt?: number) => boolean;
export declare const every: <A extends readonly unknown[], C extends ArrayCallbackFn<A[number]>>(array: A, predicate: C) => boolean;
export declare const some: <A extends readonly unknown[], C extends ArrayCallbackFn<A[number]>>(array: A, predicate: C) => boolean;
export declare const filter: <A extends readonly unknown[], T extends A[number], C extends ArrayCallbackFn<A[number]> | FilterFnTypeP<A[number], T>>(array: A, filterFn: C) => FilteredType<C, A[number], T>[];
export declare const filterBlank: <A extends readonly unknown[]>(array: A | null | undefined) => NonNullable<A[number]>[] | undefined;
export declare const sizeOf: (obj: {
    size: number;
} | null | undefined) => number;
export declare const lengthOf: (obj: {
    length: number;
} | null | undefined) => number;
export declare const lastOf: <A extends readonly unknown[]>(a: A | null | undefined) => LastElement<A>;
export declare const firstOf: <A extends readonly unknown[]>(a: A | null | undefined) => FirstElement<A>;
export declare const tagName: (element: Element) => string;
export declare const hasTagName: (element: Element, tag: string) => boolean;
export declare const preventDefault: (event: Event) => void;
export declare const arrayFrom: {
    <T>(arrayLike: ArrayLike<T>): T[];
    <T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): U[];
    <T>(iterable: Iterable<T> | ArrayLike<T>): T[];
    <T, U>(iterable: Iterable<T> | ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): U[];
};
export declare const keysOf: <T extends Record<string | symbol, unknown>>(obj: T) => Array<keyof T & string>;
export declare const defineProperty: <T>(o: T, p: PropertyKey, attributes: PropertyDescriptor & ThisType<any>) => T;
export declare const merge: <A extends readonly (object | null | undefined)[]>(...a: [...A]) => Spread<A>;
export declare const copyObject: <T extends object | undefined>(obj: T) => Pick<T, Exclude<keyof T, never>> & Pick<unknown, never> & {} extends infer T_1 ? T_1 extends Pick<T, Exclude<keyof T, never>> & Pick<unknown, never> & {} ? T_1 extends infer U ? { [K in keyof U]: U[K]; } : never : never : never;
export declare const promiseResolve: {
    (): Promise<void>;
    <T>(value: T): Promise<Awaited<T>>;
    <T>(value: T | PromiseLike<T>): Promise<Awaited<T>>;
};
export declare const promiseAll: {
    <T>(values: Iterable<T | PromiseLike<T>>): Promise<Awaited<T>[]>;
    <T extends readonly unknown[] | []>(values: T): Promise<{ -readonly [P in keyof T]: Awaited<T[P]>; }>;
};
export declare const assign: {
    <T extends {}, U>(target: T, source: U): T & U;
    <T extends {}, U, V>(target: T, source1: U, source2: V): T & U & V;
    <T extends {}, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
    (target: object, ...sources: any[]): any;
};
export declare const freezeObj: {
    <T extends Function>(f: T): T;
    <T extends {
        [idx: string]: U | null | undefined | object;
    }, U extends string | bigint | number | boolean | symbol>(o: T): Readonly<T>;
    <T>(o: T): Readonly<T>;
};
export declare const hasOwnProp: (o: object, prop: string | symbol) => boolean;
export declare const preventExtensions: <T>(o: T) => T;
export declare const stringify: {
    (value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string;
    (value: any, replacer?: (number | string)[] | null, space?: string | number): string;
};
export declare const floor: (x: number) => number;
export declare const ceil: (x: number) => number;
export declare const log2: (x: number) => number;
export declare const sqrt: (x: number) => number;
export declare const max: (...values: number[]) => number;
export declare const min: (...values: number[]) => number;
export declare const abs: (x: number) => number;
export declare const round: (x: number) => number;
export declare const pow: (x: number, y: number) => number;
export declare const exp: (x: number) => number;
export declare const parseFloat: (string: string) => number;
export declare const isNaN: (number: unknown) => boolean;
export declare const isInstanceOf: <C extends Constructor<unknown>>(value: unknown, Class: C) => value is InstanceType<C>;
export declare const constructorOf: (obj: object) => Function;
export declare const typeOf: (obj: unknown) => "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
export declare const typeOrClassOf: (obj: unknown) => string;
export declare const parentOf: (element: Element | undefined | null) => HTMLElement | null;
export declare const childrenOf: (element: Element | undefined | null) => HTMLCollection | never[];
export declare const targetOf: <O extends {
    target?: unknown;
} | null | undefined>(obj: O) => O extends {
    target: infer T;
} ? T : O extends {
    target?: infer T;
} ? T | undefined : undefined;
export declare const currentTargetOf: <O extends {
    currentTarget?: unknown;
} | null | undefined>(obj: O) => O extends {
    currentTarget: infer T;
} ? T : O extends {
    currentTarget?: infer T;
} ? T | undefined : undefined;
export declare const classList: <T extends Element | null | undefined>(element: T) => T extends Element ? DOMTokenList : undefined;
export declare const getTabIndex: (element: Element) => string | null;
export declare const setTabIndex: (element: Element, index?: string) => void;
export declare const unsetTabIndex: (element: Element) => void;
export declare const remove: (obj: {
    remove: () => void;
} | null | undefined) => void | undefined;
export declare const deleteObjKey: <O extends object>(obj: O, key: keyof O) => boolean;
export declare const deleteKey: <K, V>(map: MapBase<K, V> | SetBase<K> | null | undefined, key: K) => void | undefined;
export declare const elScrollTo: (element: Element, coords: {
    top?: number;
    left?: number;
}, behavior?: ScrollBehavior) => void;
export declare const elScrollBy: (element: Element, coords: {
    top?: number;
    left?: number;
}, behavior?: ScrollBehavior) => void;
export declare const newPromise: <T>(executor: (resolve: (value: T) => void, reject: (reason?: any) => void) => void) => Promise<T>;
export declare const newMap: <K, V>(entries?: readonly (readonly [K, V])[] | null) => Map<K, V>;
export declare const newWeakMap: <K extends WeakKey, V>(entries?: readonly (readonly [K, V])[] | null) => WeakMap<K, V>;
export declare const newSet: <T>(values?: readonly T[] | null) => Set<T>;
export declare const newWeakSet: <T extends WeakKey>(values?: readonly T[] | null) => WeakSet<T>;
export declare const newIntersectionObserver: (callback: IntersectionObserverCallback, options?: IntersectionObserverInit) => IntersectionObserver;
export declare const newResizeObserver: (callback: ResizeObserverCallback) => ResizeObserver | null;
export declare const newMutationObserver: (callback: MutationCallback) => MutationObserver;
export declare const usageError: (msg: string) => LisnUsageError;
export declare const bugError: (msg: string) => LisnBugError;
export declare const illegalConstructorError: (useWhat: string) => LisnUsageError;
export declare const consoleDebug: {
    (...data: any[]): void;
    (message?: any, ...optionalParams: any[]): void;
};
export declare const consoleLog: {
    (...data: any[]): void;
    (message?: any, ...optionalParams: any[]): void;
};
export declare const consoleInfo: {
    (...data: any[]): void;
    (message?: any, ...optionalParams: any[]): void;
};
export declare const consoleWarn: {
    (...data: any[]): void;
    (message?: any, ...optionalParams: any[]): void;
};
export declare const consoleError: {
    (...data: any[]): void;
    (message?: any, ...optionalParams: any[]): void;
};
type FirstElement<T extends readonly unknown[]> = T extends readonly [
    infer Head,
    ...infer Last__ignored
] ? Head : T[number] | undefined;
type LastElement<T extends readonly unknown[]> = T extends readonly [
    ...infer Head__ignored,
    infer Last
] ? Last : T[number] | undefined;
type ArrayCallbackFn<V> = (value: V, index: number, array: readonly V[]) => unknown;
type FilterFnTypeP<V, T extends V> = (value: V, index: number, array: readonly V[]) => value is T;
type FilteredType<C extends ArrayCallbackFn<V> | FilterFnTypeP<V, T>, V, T extends V> = C extends FilterFnTypeP<V, infer T> ? T : V;
export {};
//# sourceMappingURL=minification-helpers.d.ts.map