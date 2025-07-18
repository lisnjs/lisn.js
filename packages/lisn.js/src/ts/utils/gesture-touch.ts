/**
 * @module Utils
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

import { Direction, GestureIntent, Vector } from "@lisn/globals/types";

import { getVectorDirection } from "@lisn/utils/directions";

import {
  maxAbs,
  havingMaxAbs,
  distanceBetween,
  areAntiParallel,
} from "@lisn/utils/math";
import { GestureFragment } from "@lisn/utils/gesture";

import { newXMap } from "@lisn/modules/x-map";

/**
 * @category Gestures
 */
export type TouchDiff = {
  startX: number;
  startY: number;

  endX: number;
  endY: number;

  deltaX: number;
  deltaY: number;

  isSignificant: boolean;
};

/**
 * Returns a {@link GestureFragment} for the given events. Only "touchmove" events
 * will be considered.
 *
 * If there are less than 2 such events in the given list of events, returns `false`.
 *
 * If the gesture is to be considered terminated, e.g. because there is
 * "touchcancel" in the list, returns `null`.
 *
 * Note that by default swipe actions follow the natural direction: swipe up
 * with scroll intent results in direction down and swipe down results in
 * direction up. Drag intent always follows the direction of the gesture.
 *
 * For zoom intents, which necessarily involves exactly two fingers `deltaZ`
 * is based on the relative change in distance between the fingers.
 *
 * @param [options.deltaThreshold]
 *                          A change of x or y coordinate less than this is
 *                          considered insignificant, for the purposes of
 *                          determining:
 *                          1) whether the inferred direction is in one of the
 *                             four cardinal ones, or otherwise ambiguous; and
 *                          2) whether more than two fingers have moved and
 *                             therefore whether the direction could be zoom or
 *                             not
 * @param [options.angleDiffThreshold] See {@link getVectorDirection}
 * @param [options.reverseScroll]
 *                          If set to `true`, will disable natural scroll
 *                          direction.
 * @param [options.dragHoldTime]
 *                          If the user presses and holds for at least the
 *                          given amount of milliseconds before moving the
 *                          finger(s), gestures other than pinch will be
 *                          treated as a drag instead of scroll as long as the
 *                          number of fingers touching the screen is
 *                          `options.dragNumFingers`. Default is 500ms.
 * @param [options.dragNumFingers]
 *                          The number of fingers that could be considered a
 *                          drag intent. Default is 1.
 *
 * @returns `false` if there are less than 2 "touchmove" events in the list,
 * `null` if the gesture is terminated, otherwise a {@link GestureFragment}.
 *
 * @category Gestures
 */
export const getTouchGestureFragment = (
  events: Event[],
  options?: {
    deltaThreshold?: number;
    angleDiffThreshold?: number;
    reverseScroll?: boolean;
    dragHoldTime?: number;
    dragNumFingers?: number;
  },
): GestureFragment | null | false => {
  if (!MH.isIterableObject(events)) {
    events = [events];
  }

  let moves = getTouchDiff(events, options?.deltaThreshold);

  if (!moves) {
    return null; // terminated
  }

  let numMoves = MH.lengthOf(moves);

  const holdTime = getHoldTime(events);
  const canBeDrag =
    holdTime >= (options?.dragHoldTime ?? 500) &&
    numMoves === (options?.dragNumFingers ?? 1);
  const angleDiffThreshold = options?.angleDiffThreshold;

  let deltaX = havingMaxAbs(...moves.map((m) => m.deltaX));
  let deltaY = havingMaxAbs(...moves.map((m) => m.deltaY));
  let deltaZ = 1;

  if (numMoves > 2) {
    // Take only the significant ones
    moves = MH.filter(moves, (d) => d.isSignificant);
    numMoves = MH.lengthOf(moves);
  }

  let direction: Direction = MC.S_NONE;
  let intent: GestureIntent = MC.S_UNKNOWN;
  if (numMoves === 2) {
    // Check if it's a zoom
    const vectorA: Vector = [moves[0].deltaX, moves[0].deltaY];
    const vectorB: Vector = [moves[1].deltaX, moves[1].deltaY];

    // If either finger is approx stationary, or if they move in opposite directions,
    // treat it as zoom.
    if (
      !havingMaxAbs(...vectorA) || // finger A still
      !havingMaxAbs(...vectorB) || // finger B still
      areAntiParallel(vectorA, vectorB, angleDiffThreshold)
    ) {
      // It's a pinch motion => zoom
      const startDistance = distanceBetween(
        [moves[0].startX, moves[0].startY],
        [moves[1].startX, moves[1].startY],
      );

      const endDistance = distanceBetween(
        [moves[0].endX, moves[0].endY],
        [moves[1].endX, moves[1].endY],
      );

      direction = startDistance < endDistance ? MC.S_IN : MC.S_OUT;
      deltaZ = endDistance / startDistance;
      deltaX = deltaY = 0;
      intent = MC.S_ZOOM;
    }
  }

  const deltaSign = canBeDrag || options?.reverseScroll ? 1 : -1;
  // If scrolling, swap the deltas for natural scroll direction.
  // Add +0 to force -0 to be +0 since jest doesn't think they're equal
  deltaX = deltaSign * deltaX + 0;
  deltaY = deltaSign * deltaY + 0;

  if (direction === MC.S_NONE) {
    // Wasn't a zoom. Check if all moves are aligned.
    let isFirst = true;

    for (const m of moves) {
      // There's at least one significant move, assume scroll or drag intent.
      intent = canBeDrag ? MC.S_DRAG : MC.S_SCROLL;

      const thisDirection = getVectorDirection(
        [deltaSign * m.deltaX, deltaSign * m.deltaY],
        angleDiffThreshold,
      );

      if (thisDirection === MC.S_NONE) {
        continue;
      }

      if (isFirst) {
        direction = thisDirection;
      } else if (direction !== thisDirection) {
        direction = MC.S_AMBIGUOUS;
        break;
      }

      isFirst = false;
    }
  }

  if (direction === MC.S_NONE) {
    const lastTouchEvent = MH.lastOf(events.filter(MH.isTouchEvent));
    // If all fingers have lifted off, consider it terminated, otherwise wait
    // for more events.
    return MH.lengthOf(lastTouchEvent?.touches) ? false : null;
  }

  return {
    device: MC.S_TOUCH,
    direction,
    intent,
    deltaX,
    deltaY,
    deltaZ,
  };
};

/**
 * Returns a description of the changes in each finger between the first and
 * the last relevant TouchEvent in the list.
 *
 * If the gesture is to be considered terminated, e.g. because there is
 * "touchcancel" in the list, returns `null`.
 *
 * Note that, `deltaX`/`deltaY` are the end X/Y coordinate minus the start X/Y
 * coordinate. For natural scroll direction you should swap their signs.
 *
 * @param deltaThreshold If the change of x and y coordinate are both less
 *                       than this, it is marked as not significant.
 *
 * @category Gestures
 */
export const getTouchDiff = (
  events: Event[],
  deltaThreshold = 0,
): TouchDiff[] | null => {
  // Group each touch point of each event by identifier, so that we can get the
  // start and end coordinate of each finger
  const groupedTouches = newXMap<number, Touch[]>((): Touch[] => []);

  for (const event of events) {
    if (!MH.isTouchEvent(event)) {
      continue;
    }

    if (event.type === MC.S_TOUCHCANCEL) {
      return null; // gesture terminated
    }

    for (const touch of event.touches) {
      groupedTouches.sGet(touch.identifier).push(touch);
    }
  }

  const moves: TouchDiff[] = [];

  for (const touchList of groupedTouches.values()) {
    const nTouches = MH.lengthOf(touchList);
    if (nTouches < 2) {
      // Only one event had that finger in it, so there's no move for it
      continue;
    }

    const firstTouch = touchList[0];
    const lastTouch = touchList[nTouches - 1];
    const startX = firstTouch.clientX;
    const startY = firstTouch.clientY;

    const endX = lastTouch.clientX;
    const endY = lastTouch.clientY;

    const deltaX = endX - startX;
    const deltaY = endY - startY;

    const isSignificant = maxAbs(deltaX, deltaY) >= deltaThreshold;

    // Consider it a move in one of the 4 cardinal ones
    moves.push({
      startX,
      startY,
      endX,
      endY,
      deltaX,
      deltaY,
      isSignificant,
    });
  }

  return moves;
};

// --------------------

const getHoldTime = (events: Event[]) => {
  const firstStart = events.findIndex((e) => e.type === MC.S_TOUCHSTART);
  const firstMove = events.findIndex((e) => e.type === MC.S_TOUCHMOVE);
  if (firstStart < 0 || firstMove < 1) {
    return 0;
  }

  return events[firstMove].timeStamp - events[firstStart].timeStamp;
};
