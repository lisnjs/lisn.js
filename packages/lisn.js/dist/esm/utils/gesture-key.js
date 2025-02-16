/**
 * @module Utils
 */

import * as MC from "../globals/minification-constants.js";
import * as MH from "../globals/minification-helpers.js";
import { settings } from "../globals/settings.js";
import { getVectorDirection } from "./directions.js";
import { addDeltaZ } from "./gesture.js";

/**
 * Returns a {@link GestureFragment} for the given events. Only "keydown"
 * events will be considered.
 *
 * If there are no "keydown" events in the given list of events, returns
 * `false`.
 *
 * The deltas of all events are summed together before determining final delta
 * and direction.
 *
 * If the events are of conflicting types, i.e. some scroll, some zoom, then
 * the intent will be "unknown" and the direction will be "ambiguous".
 *
 * Otherwise, if the deltas sum up to 0, the direction will be "none".
 *
 * **IMPORTANT NOTES ON THE DELTA VALUES**
 *
 * For key gestures the deltas are unreliable. You should not assume they
 * correspond to the would-be scroll or zoom amount that the browser would do.
 * But they can be used to determine relative amounts for animating, etc.
 *
 * Key press events can be divided into 3 categories: that scroll by a "line"
 * (e.g. arrow keys), by a "page" (e.g. PageUp/PageDown) or by the full content
 * height/width (e.g. Home/End). The actual scroll amount that _would_ result
 * from the event is dependent on the browser, the window size or the element's
 * scroll width/height, so ours can only be a best guess.
 *
 * Since the actual pixel equivalent is browser specific, we use reasonable
 * default values of delta for each of these "line", "page" or "content" modes,
 * similar to what
 * {@link Utils.getWheelGestureFragment | getWheelGestureFragment} does:
 * - For "line", then a configurable fixed value is used
 *  ({@link settings.deltaLineHeight}).
 * - For "page", then a configurable fixed value is used
 *  ({@link settings.deltaPageHeight}).
 * - For "content", the element's scroll height is used if given, otherwise
 *   the viewport height (same as "page"). We do not try to get the current
 *   scroll height of the target element, (which would be the best guess value
 *   of `deltaY` in case of Home/End key presses), as that would either involve
 *   an asynchronous action or would result in forced layout. If the caller is
 *   already tracking the scroll height of the target, you can pass this as an
 *   argument. Otherwise, we'll default to using the viewport height, same as
 *   for PageUp/Down.
 *
 * If the key gesture fragment is a result of multiple events that were
 * accumulated, the deltas are summed as usual, e.g. if a "page" is equal to 20
 * "lines", then pressing PageDown and then 10 times Up, would result in a
 * delta equal to 10 "lines" down.
 *
 * For zoom intents, `deltaZ` gives a relative change of scale, whereby each
 * press of + or - steps up by 15% or down by ~13% (`1 / 1.15` to be exact)
 * since the previous one.
 *
 * @param {} [options.angleDiffThreshold]
 *                                  See {@link getVectorDirection}
 * @param {} [options.scrollHeight] Use this as deltaY when Home/End is pressed
 *
 * @return {} `false` if there are no "keydown" events in the list, otherwise a
 * {@link GestureFragment}.
 *
 * @category Gestures
 */
export const getKeyGestureFragment = (events, options) => {
  var _options$scrollHeight;
  if (!MH.isIterableObject(events)) {
    events = [events];
  }
  const LINE = settings.deltaLineHeight;
  const PAGE = settings.deltaPageHeight;
  const CONTENT = (_options$scrollHeight = options === null || options === void 0 ? void 0 : options.scrollHeight) !== null && _options$scrollHeight !== void 0 ? _options$scrollHeight : PAGE;
  const deltasUp = amount => [0, -amount, 1];
  const deltasDown = amount => [0, amount, 1];
  const deltasLeft = amount => [-amount, 0, 1];
  const deltasRight = amount => [amount, 0, 1];
  const deltasIn = [0, 0, 1.15];
  const deltasOut = [0, 0, 1 / 1.15];
  let direction = MC.S_NONE;
  let intent = null;
  let deltaX = 0,
    deltaY = 0,
    deltaZ = 1;
  for (const event of events) {
    if (!MH.isKeyboardEvent(event) || event.type !== MC.S_KEYDOWN) {
      continue;
    }
    const deltasForKey = {
      [SK_UP]: deltasUp(LINE),
      [SK_ARROWUP]: deltasUp(LINE),
      [SK_PAGEUP]: deltasUp(PAGE),
      Home: deltasUp(CONTENT),
      [SK_DOWN]: deltasDown(LINE),
      [SK_ARROWDOWN]: deltasDown(LINE),
      [SK_PAGEDOWN]: deltasDown(PAGE),
      End: deltasDown(CONTENT),
      [SK_LEFT]: deltasLeft(LINE),
      [SK_ARROWLEFT]: deltasLeft(LINE),
      [SK_RIGHT]: deltasRight(LINE),
      [SK_ARROWRIGHT]: deltasRight(LINE),
      " ": (event.shiftKey ? deltasUp : deltasDown)(PAGE),
      "+": deltasIn,
      "=": event.ctrlKey ? deltasIn : null,
      "-": deltasOut
    };
    const theseDeltas = deltasForKey[event.key] || null;
    if (!theseDeltas) {
      // not a relevant key
      continue;
    }
    const [thisDeltaX, thisDeltaY, thisDeltaZ] = theseDeltas;
    const thisIntent = thisDeltaZ !== 1 ? MC.S_ZOOM : MC.S_SCROLL;
    deltaX += thisDeltaX;
    deltaY += thisDeltaY;
    deltaZ = addDeltaZ(deltaZ, thisDeltaZ);
    if (!intent) {
      intent = thisIntent;
    } else if (intent !== thisIntent) {
      // mixture of zoom and scroll
      intent = MC.S_UNKNOWN;
    }
  }
  if (!intent) {
    return false; // no relevant events
  } else if (intent === MC.S_UNKNOWN) {
    direction = MC.S_AMBIGUOUS;
  } else if (intent === MC.S_ZOOM) {
    direction = deltaZ > 1 ? MC.S_IN : deltaZ < 1 ? MC.S_OUT : MC.S_NONE;
  } else {
    direction = getVectorDirection([deltaX, deltaY], options === null || options === void 0 ? void 0 : options.angleDiffThreshold);
  }
  return direction === MC.S_NONE ? false : {
    device: MC.S_KEY,
    direction,
    intent,
    deltaX,
    deltaY,
    deltaZ
  };
};

// --------------------

const SK_UP = "Up";
const SK_DOWN = "Down";
const SK_LEFT = "Left";
const SK_RIGHT = "Right";
const SK_PAGE = "Page";
const SK_ARROW = "Arrow";
const SK_PAGEUP = SK_PAGE + SK_UP;
const SK_PAGEDOWN = SK_PAGE + SK_DOWN;
const SK_ARROWUP = SK_ARROW + SK_UP;
const SK_ARROWDOWN = SK_ARROW + SK_DOWN;
const SK_ARROWLEFT = SK_ARROW + SK_LEFT;
const SK_ARROWRIGHT = SK_ARROW + SK_RIGHT;
//# sourceMappingURL=gesture-key.js.map