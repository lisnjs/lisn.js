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
  config?: C,
  widgetRef?: RefObject<WidgetComponentRef<W>>,
) => {
  const elementRef = useRef<ComponentRef<T>>(null);
  const widgetRefInternal = useRef<W>(null);
  const configMemo = useDeepMemo(config);

  useEffect(() => {
    if (elementRef.current instanceof Element) {
      widgetRefInternal.current = newWidget(elementRef.current, configMemo);
    }

    return () => {
      widgetRefInternal.current?.destroy();
    };
  }, [configMemo, newWidget]);

  useImperativeHandle(widgetRef, () => {
    return {
      getWidget: () => widgetRefInternal.current,
    };
  });

  return elementRef;
};
