"use client";
import {
  useRef,
  useEffect,
  useImperativeHandle,
  RefObject,
  ComponentRef,
  ElementType,
} from "react";

import type { Widget } from "lisn.js";
import { WidgetComponentRef } from "./types";
import { useDeepMemo } from "./useDeepMemo";

export const useWidget = <
  T extends ElementType,
  W extends Widget,
  C extends object,
>(
  newWidget: (element: Element, config?: C) => W | null,
  config?: C | C[],
  widgetRef?: RefObject<WidgetComponentRef<W> | null>,
) => {
  const configs = config instanceof Array ? config : [config];

  const elementRef = useRef<ComponentRef<T>>(null);
  const widgetRefsInternal = useRef<W[]>([]);
  const configsMemo = useDeepMemo(configs);

  useEffect(() => {
    if (elementRef.current instanceof Element) {
      for (const thisConfig of configsMemo) {
        const widget = newWidget(elementRef.current, thisConfig);

        if (widget) {
          widgetRefsInternal.current.push(widget);
        }
      }
    }
    const widgets = widgetRefsInternal.current;

    return () => {
      for (const widget of widgets) {
        widget.destroy();
      }
      widgetRefsInternal.current = [];
    };
  }, [configsMemo, newWidget]);

  useImperativeHandle(widgetRef, () => {
    return {
      getWidget: () => widgetRefsInternal.current[0] ?? null,
      getWidgets: () => widgetRefsInternal.current,
    };
  });

  return elementRef;
};
