/**
 * @module Utils
 */

import * as MC from "@lisn/globals/minification-constants";
import * as MH from "@lisn/globals/minification-helpers";

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
  if (!MH.isIterableObject(events)) {
    events = [events];
  }

  let isCancelled = false;
  const supports = getBrowserSupport();

  // If the browser supports pointer events, then only take those, and not
  // other mouse events; otherwise take all mouse events
  const pointerUpType = supports._pointer ? MC.S_POINTERUP : MC.S_MOUSEUP;
  const isPointerOrMouse = (event: Event): event is MouseEvent =>
    supports._pointer ? MH.isPointerEvent(event) : MH.isMouseEvent(event);

  const filteredEvents: MouseEvent[] = MH.filter(
    events,
    (event): event is MouseEvent => {
      const eType = event.type;
      isCancelled = isCancelled || eType === MC.S_POINTERCANCEL;
      if (eType !== MC.S_CLICK && isPointerOrMouse(event)) {
        // Only events where the primary button is pressed (unless it's a
        // pointerup event, in which case no buttons should be pressed) are
        // considered, otherwise consider it terminated
        isCancelled =
          isCancelled ||
          (eType === pointerUpType && event.buttons !== 0) ||
          (eType !== pointerUpType && event.buttons !== 1);
        // we don't handle touch pointer events
        return !MH.isTouchPointerEvent(event);
      }

      return false;
    },
  );

  const numEvents = MH.lengthOf(filteredEvents);
  if (numEvents < 2) {
    return false; // no enough events
  }

  if (isCancelled) {
    return null; // terminated
  }

  const firstEvent = filteredEvents[0];
  const lastEvent = filteredEvents[numEvents - 1];
  if (MH.getPointerType(firstEvent) !== MH.getPointerType(lastEvent)) {
    return null; // different devices, consider it terminated
  }

  const deltaX = lastEvent.clientX - firstEvent.clientX;
  const deltaY = lastEvent.clientY - firstEvent.clientY;
  const direction = getVectorDirection(
    [deltaX, deltaY],
    options?.angleDiffThreshold,
  );

  return direction === MC.S_NONE
    ? false
    : {
        device: MC.S_POINTER,
        direction,
        intent: MC.S_DRAG,
        deltaX,
        deltaY,
        deltaZ: 1,
      };
};
