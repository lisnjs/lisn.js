/**
 * @module Utils
 */

import * as _ from "@lisn/_internal";

import { getVectorDirection } from "@lisn/utils/directions";
import { getBrowserSupport } from "@lisn/utils/event";
import { GestureFragment } from "@lisn/utils/gesture";

/**
 * Returns a {@link GestureFragment} for the given events. If the browser
 * supports Pointer events, then only "pointermove" events will be considered.
 * Otherwise, only "mousemove" events will be considered.
 *
 * If there are less than 2 such events in the given list of events, returns
 * `false`.
 *
 * If the gesture is to be considered terminated, e.g. because there is
 * "pointercancel" in the list or buttons other than the primary are pressed,
 * returns `null`.
 *
 * Pointer gestures always require the primary button to be pressed and the
 * resulting intent is always "drag", and `deltaZ` is always 1.
 *
 * @param [options.angleDiffThreshold] See {@link getVectorDirection}
 *
 * @returns `false` if there are less than 2 "pointermove"/"mousemove" events
 * in the list, `null` if the gesture is terminated, otherwise a
 * {@link GestureFragment}.
 *
 * @category Gestures
 */
export const getPointerGestureFragment = (
  events: Event | readonly Event[],
  options?: {
    angleDiffThreshold?: number;
  },
): GestureFragment | null | false => {
  if (!_.isIterableObject(events)) {
    events = [events];
  }

  let isCancelled = false;
  const supports = getBrowserSupport();

  // If the browser supports pointer events, then only take those, and not
  // other mouse events; otherwise take all mouse events
  const pointerUpType = supports._pointer ? _.S_POINTERUP : _.S_MOUSEUP;
  const isPointerOrMouse = (event: Event): event is MouseEvent =>
    supports._pointer ? _.isPointerEvent(event) : _.isMouseEvent(event);

  const filteredEvents: MouseEvent[] = _.filter(
    events,
    (event): event is MouseEvent => {
      const eType = event.type;
      isCancelled = isCancelled || eType === _.S_POINTERCANCEL;
      if (eType !== _.S_CLICK && isPointerOrMouse(event)) {
        // Only events where the primary button is pressed (unless it's a
        // pointerup event, in which case no buttons should be pressed) are
        // considered, otherwise consider it terminated
        isCancelled =
          isCancelled ||
          (eType === pointerUpType && event.buttons !== 0) ||
          (eType !== pointerUpType && event.buttons !== 1);
        // we don't handle touch pointer events
        return !_.isTouchPointerEvent(event);
      }

      return false;
    },
  );

  const numEvents = _.lengthOf(filteredEvents);
  if (numEvents < 2) {
    return false; // no enough events
  }

  if (isCancelled) {
    return null; // terminated
  }

  const firstEvent = filteredEvents[0];
  const lastEvent = filteredEvents[numEvents - 1];
  if (_.getPointerType(firstEvent) !== _.getPointerType(lastEvent)) {
    return null; // different devices, consider it terminated
  }

  const deltaX = lastEvent.clientX - firstEvent.clientX;
  const deltaY = lastEvent.clientY - firstEvent.clientY;
  const direction = getVectorDirection(
    [deltaX, deltaY],
    options?.angleDiffThreshold,
  );

  return direction === _.S_NONE
    ? false
    : {
        device: _.S_POINTER,
        direction,
        intent: _.S_DRAG,
        deltaX,
        deltaY,
        deltaZ: 1,
      };
};
