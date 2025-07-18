/**
 * @module Types
 */

import { settings } from "@lisn/globals/settings";

/**
 * @category Layout
 */
export type Device = keyof typeof settings.deviceBreakpoints;

/**
 * @category Layout
 */
export type AspectRatio = keyof typeof settings.aspectRatioBreakpoints;

/**
 * @category Layout
 */
export type Layout = Device | AspectRatio;

/**
 * @category Layout
 */
export type LayoutSpec<L extends Layout> =
  | CommaSeparatedStr<L>
  | `max ${L}`
  | `min ${L}`
  | RangeStr<" to ", L>;

/**
 * @category Layout
 */
export type DeviceSpec = LayoutSpec<Device>;

/**
 * @category Layout
 */
export type AspectRatioSpec = LayoutSpec<AspectRatio>;

/**
 * @category Layout
 */
export type Offset = "top" | "bottom" | "left" | "right";

/**
 * @category Layout
 */
export type Position = Offset;

/**
 * @category Layout
 */
export type FlexDirection = "row" | "column" | "row-reverse" | "column-reverse";

/**
 * @category Views
 */
export type ViewTarget = Element | ScrollOffset;

/**
 * The {@link Watchers/ViewWatcher.ViewWatcherConfig.root | root}'s
 * (default is the viewport) view relative to the target:
 *
 * - "above": the root is above the target, i.e. target is below the root
 * - "below": the root is below the target, i.e. target is above the root
 * - "left":  the root is to the left the target, i.e. target is on the right
 *            of the root
 * - "right": the root is to the right the target, i.e. target is on the left
 *            of the root
 * - "at":    the target is in view of the root
 *
 * @category Views
 */
export type View = "at" | "above" | "below" | "left" | "right";

/**
 * This has the format of <ref>: <value> where <value> can be any valid CSS
 * offset specification*.
 *
 * <ref> must be one of top, bottom, left or right.
 *
 * Using left/right reference only makes sense if the document scrolls
 * horizontally, which is rare. In most cases you would want to use top/bottom
 * as reference.
 *
 * * See for example {@link https://developer.mozilla.org/en-US/docs/Web/CSS/top}
 *
 * @category Views
 */
export type ScrollOffset = `${Offset}: ${string}`;

/**
 * @category Sizing
 */
export type SizeTarget = Element | Document | (Window & typeof globalThis);

/**
 * @category Sizing
 */
export type Box = "content" | "border";

/**
 * @category Sizing
 */
export type Dimension = "width" | "height";

/**
 * @category Sizing
 */
export type Size = { width: number; height: number };

/**
 * - added:     The target was added to the tree
 * - removed:   The target was removed from the tree
 * - attribute: An attribute of the target changed
 *
 * @category DOM
 */
export type MutationCategory = "added" | "removed" | "attribute";

/**
 * @category Scrolling
 */
export type ScrollTarget = Element | Document | (Window & typeof globalThis);

/**
 * If a given coordinate is a function, it is called at the moment the
 * scrolling action begins (and therefore the up-to-date value of the
 * coordinate is needed), and is passed a single argument: the scrolling
 * element that is being scrolled.
 *
 * @category Scrolling
 */
export type TargetCoordinate = number | ((scrollable: Element) => number);

/**
 * @category Scrolling
 */
export type TargetCoordinates = AtLeastOne<{
  top: TargetCoordinate;
  left: TargetCoordinate;
}>;

/**
 * @category Scrolling
 */
export type CoordinateOffset = AtLeastOne<{
  top: number;
  left: number;
}>;

/**
 * @category Scrolling
 */
export type ScrollPosition = {
  top: number;
  left: number;
};

/**
 * @category Directions
 */
export type XYDirection = "up" | "down" | "left" | "right";

/**
 * @category Directions
 */
export type ZDirection = "in" | "out";

/**
 * @category Directions
 */
export type NoDirection = "none";

/**
 * @category Directions
 */
export type AmbiguousDirection = "ambiguous";

/**
 * @category Directions
 */
export type ScrollDirection = XYDirection | NoDirection | AmbiguousDirection;

/**
 * @category Directions
 */
export type Direction =
  | XYDirection
  | ZDirection
  | NoDirection
  | AmbiguousDirection;

/**
 * Indicates the device used:
 * - "key":     results from key presses, in particular Up/Down/Left/Right/PageUp/PageDown/Home/End/Space
 * - "pointer": results from dragging with the mouse
 * - "touch":   results from touch
 * - "wheel":   results from mouse wheel or trackpad
 *
 * @category Gestures
 */
export type GestureDevice = "key" | "pointer" | "touch" | "wheel";

/**
 * Indicates the likely intent of the gesture, or the likely result of the
 * action if it is not prevented. Note that this cannot be 100% reliable as it
 * depends on the  browser and the target element.
 * - "scroll": Would likely result in a scroll or a pan (for touch events
 *             involving multiple fingers). Results from mouse or trackpad
 *             wheel events, from touch moves involving any number of fingers,
 *             or from directional key presses (Arrows, Home, etc), unless
 *             those actions are deemed to be zoom actions (see below).
 * - "zoom":   Would likely result in a zoom. Results from mouse wheel while
 *             holding Ctrl key, from trackpad or touch screen pinch motion or
 *             from pressing +/- on keyboard.
 * - "drag":   Would likely result in a drag. Results from pressing the
 *             primary mouse button then moving.
 *
 * @category Gestures
 */
export type GestureIntent = "scroll" | "zoom" | "drag" | "unknown";

/**
 * Screen coordinate. 0, 0 is top-left corner.
 *
 * @category Misc
 */
export type Point = [/** x position */ number, /** y position */ number];

/**
 * Represents a change of position. Positive x is to the right, positive y is down.
 *
 * @category Misc
 */
export type Vector = [
  /** deltaX/x component */ number,
  /** deltaY/y component */ number,
];

/**
 * @category Misc
 */
export type PointerAction = "click" | "hover" | "press";

/**
 * @category Misc
 */
export type BoundingRect = {
  x: number;
  left: number;
  right: number;
  width: number;
  y: number;
  top: number;
  bottom: number;
  height: number;
};

/**
 * @param args Arguments to log
 *
 * @category Misc
 */
export type LogFunction = (...args: unknown[]) => void;

/**
 * @category Utility
 */
export type DOMElement = HTMLElement | SVGElement | MathMLElement;

/**
 * @category Utility
 */
export type IterableObject<T> = Iterable<T> & object;

/**
 * @category Utility
 */
export type OnlyOneOf<T, U> =
  | ({
      [P in keyof T]: T[P];
    } & {
      [P in keyof U]?: never;
    })
  | ({
      [P in keyof U]: U[P];
    } & {
      [P in keyof T]?: never;
    });

/**
 * @category Utility
 */
export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

/**
 * @category Utility
 */
export type NonEmptyArray<T> = [T, ...T[]];

/**
 * @category Utility
 */
export type NonNullableReturnType<F extends (...args: unknown[]) => unknown> =
  NonNullable<ReturnType<F>>;

/**
 * @category Utility
 */
export type StrRecord =
  | {
      [key: string]: string | number | boolean | null | StrRecord;
    }
  | Array<string | number | boolean>;

/**
 * @category Utility
 */
export type SeparatedStr<
  S extends string,
  T extends string,
  Key extends T = T,
> = Key extends string
  ? `${Key},${SeparatedStr<S, Exclude<T, Key>>}` | Key
  : never;

/**
 * @category Utility
 */
export type CommaSeparatedStr<
  T extends string,
  Key extends T = T,
> = SeparatedStr<",", T, Key>;

/**
 * @category Utility
 */
export type RangeStr<
  S extends string,
  T extends string,
  Key extends T = T,
> = Key extends string ? `${Key}${S}${Exclude<T, Key>}` : never;

/**
 * @category Utility
 */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type Constructor<T> = new (...args: any[]) => T;

/**
 * @category Utility
 */
export type InstanceType<C> = C extends Constructor<infer T> ? T : never;

/**
 * @category Utility
 */
export type MapBase<K, V> = {
  get: (key: K) => V | undefined;
  set: (key: K, value: V) => void;
  delete: (key: K) => void;
  has: (key: K) => boolean;
};

/**
 * @category Utility
 */
export type SetBase<V> = {
  add: (value: V) => SetBase<V>;
  delete: (value: V) => void;
  has: (value: V) => boolean;
};

/**
 * @ignore
 * @internal
 */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type Spread<A extends readonly [...any]> = A extends [
  infer L,
  ...infer R,
]
  ? SpreadTwo<L, Spread<R>>
  : unknown;

// --------------------

type OptionalPropertyNames<T> = {
  /* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
  [K in keyof T]-?: {} extends { [P in K]: T[K] } ? K : never;
}[keyof T];

type SpreadProperties<L, R, K extends keyof L & keyof R> = {
  [P in K]: L[P] | Exclude<R[P], undefined>;
};

type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

type SpreadTwo<L, R> = Id<
  Pick<L, Exclude<keyof L, keyof R>> &
    Pick<R, Exclude<keyof R, OptionalPropertyNames<R>>> &
    Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>> &
    SpreadProperties<L, R, OptionalPropertyNames<R> & keyof L>
>;
