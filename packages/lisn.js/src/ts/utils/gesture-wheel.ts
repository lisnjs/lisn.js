/**
 * @module Utils
 */

import * as _ from "@lisn/_internal";

import { Direction, GestureIntent } from "@lisn/globals/types";

import { getVectorDirection } from "@lisn/utils/directions";

import { havingMaxAbs } from "@lisn/utils/math";
import { normalizeWheel } from "@lisn/utils/normalize-wheel";

import { GestureFragment, addDeltaZ } from "@lisn/utils/gesture";

/**
 * Returns a {@link GestureFragment} for the given events. Only "wheel" events
 * will be considered.
 *
 * If there are no "wheel" events in the given list of events, returns `false`.
 *
 * The deltas of all events are summed together before determining final delta
 * and direction.
 *
 * If the events are of conflicting types, i.e. some scroll, some zoom, then
 * the intent will be "unknown" and the direction will be "ambiguous".
 *
 * If the deltas sum up to 0, the direction will be "none".
 *
 * **IMPORTANT NOTES ON THE DELTA VALUES**
 *
 * For wheel gestures the deltas are _highly_ unreliable, especially when
 * zooming (Control + wheel or pinching trackpad). You should not assume they
 * correspond to the would-be scroll or zoom amount that the browser would do.
 * But they can be used to determine relative amounts for animating, etc.
 *
 * If the browser reports the delta values of a WheelEvent to be in mode "line",
 * then a configurable fixed value is used
 * ({@link Settings.settings.deltaLineHeight | settings.deltaLineHeight}).
 *
 * If the browser reports the delta values of a WheelEvent to be in mode "page",
 * then a configurable fixed value is used
 * ({@link Settings.settings.deltaPageWidth | settings.deltaPageWidth} and
 * ({@link Settings.settings.deltaPageHeight | settings.deltaPageHeight}).
 *
 * For zoom intents `deltaZ` is based on what the browser reports as the
 * `deltaY`, which in most browsers roughly corresponds to a percentage zoom
 * factor.
 *
 * @param [options.angleDiffThreshold] See {@link getVectorDirection}.
 *                                     Default is 5.
 *
 * @returns `false` if there are no "wheel" events in the list, otherwise a
 * {@link GestureFragment}.
 *
 * @category Gestures
 */
export const getWheelGestureFragment = (
  events: Event | readonly Event[],
  options?: {
    angleDiffThreshold?: number;
  },
): GestureFragment | null | false => {
  if (!_.isIterableObject(events)) {
    events = [events];
  }

  let direction: Direction = _.S_NONE;
  let intent: GestureIntent | null = null;
  let deltaX = 0,
    deltaY = 0,
    deltaZ = 1;

  for (const event of events) {
    if (!_.isWheelEvent(event) || event.type !== _.S_WHEEL) {
      continue;
    }

    const data = normalizeWheel(event);
    let thisIntent: GestureIntent = _.S_SCROLL;
    let thisDeltaX = data.pixelX;
    let thisDeltaY = data.pixelY;
    let thisDeltaZ = 1;
    const maxDelta = havingMaxAbs(thisDeltaX, thisDeltaY);

    if (event.ctrlKey && !thisDeltaX) {
      // Browsers report negative deltaY for zoom in, so swap sign
      let percentage = -maxDelta;
      // If it's more than 50, assume it's a mouse wheel => delta is roughly
      // multiple of 10%. Otherwise a trackpad => delta is roughly multiple of 1%
      if (_.abs(percentage) >= 50) {
        percentage /= 10;
      }

      thisDeltaZ = 1 + percentage / 100;

      thisDeltaX = thisDeltaY = 0;
      thisIntent = _.S_ZOOM;
    } else if (event.shiftKey && !thisDeltaX) {
      // Holding Shift while turning wheel or swiping trackpad in vertically
      // results in sideways scroll.
      thisDeltaX = thisDeltaY;
      thisDeltaY = 0;
    }

    deltaX += thisDeltaX;
    deltaY += thisDeltaY;
    deltaZ = addDeltaZ(deltaZ, thisDeltaZ);

    if (!thisIntent) {
      // not a relevant key
    } else if (!intent) {
      intent = thisIntent;
    } else if (intent !== thisIntent) {
      // mixture of zoom and scroll
      intent = _.S_UNKNOWN;
    }
  }

  if (!intent) {
    return false; // no relevant events
  } else if (intent === _.S_UNKNOWN) {
    direction = _.S_AMBIGUOUS;
  } else if (intent === _.S_ZOOM) {
    direction = deltaZ > 1 ? _.S_IN : deltaZ < 1 ? _.S_OUT : _.S_NONE;
  } else {
    direction = getVectorDirection(
      [deltaX, deltaY],
      options?.angleDiffThreshold,
    );
  }

  return direction === _.S_NONE
    ? false
    : {
        device: _.S_WHEEL,
        direction,
        intent,
        deltaX,
        deltaY,
        deltaZ,
      };
};
