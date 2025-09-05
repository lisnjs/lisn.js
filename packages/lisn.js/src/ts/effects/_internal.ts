/**
 * @module
 * @ignore
 * @internal
 */

// XXX move other internals here

import * as _ from "@lisn/_internal";

import { Size } from "@lisn/globals/types";

import { waitForSubsequentMeasureTime } from "@lisn/utils/dom-optimize";

import { createCallback } from "@lisn/modules/callback";

import { SizeWatcher, OnResizeHandler } from "@lisn/watchers/size-watcher";
import { ViewWatcher, OnViewHandler } from "@lisn/watchers/view-watcher";

export const atLeastOneVisible = (
  elements: Iterable<Element>,
  callback: (hasVisible: boolean) => void,
  viewWatcher?: ViewWatcher,
) => {
  viewWatcher ??= ViewWatcher.reuse();
  const visible = _.createMap<Element, boolean>();

  let hasVisible = false;

  const viewHandler: OnViewHandler = (el, viewData) => {
    const isThisVisible = viewData.views[0] === "at";
    visible.set(el, isThisVisible);

    const newHasVisible = isThisVisible || [...visible.values()].some((v) => v);

    if (hasVisible !== newHasVisible) {
      hasVisible = newHasVisible;
      callback(hasVisible);
    }
  };

  const start = () => {
    for (const el of elements) {
      viewWatcher.onView(el, viewHandler);
    }
  };

  const stop = () => {
    for (const el of elements) {
      viewWatcher.offView(el, viewHandler);
    }
  };

  return { start, stop } as const;
};

export const watchSize = (target?: Element) => {
  let width = 0,
    height = 0;
  const sizeWatcher = SizeWatcher.reuse();
  const resizeHandler: OnResizeHandler = createCallback(
    (e__ignored, sizeData) => {
      width = sizeData.border[_.S_WIDTH];
      height = sizeData.border[_.S_HEIGHT];
    },
    true,
  );

  const start = () => {
    sizeWatcher.offResize(resizeHandler);
  };

  const stop = () => {
    sizeWatcher.onResize(resizeHandler, _.fastWatcherConf({ target }));
  };

  return {
    get: (): Size => ({ width, height }),
    start,
    stop,
  } as const;
};

export const loopOnAfterPaint = (callback: () => void) => {
  let shouldStop = false;

  let isRunning = false;

  const looper = async () => {
    if (!isRunning) {
      isRunning = true;

      while (true) {
        await waitForSubsequentMeasureTime(); // just after each repaint
        if (shouldStop) {
          break;
        }

        callback();
      }

      isRunning = false;
    }
  };

  return {
    stop: () => {
      shouldStop = true;
    },
    start: () => {
      looper();
    },
  } as const;
};
