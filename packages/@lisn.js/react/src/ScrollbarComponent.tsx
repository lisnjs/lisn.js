"use client";
import { useRef, useEffect, createElement, ElementType } from "react";

import { Scrollbar, ScrollbarConfig } from "lisn.js";
import { settings } from "lisn.js";

import { useWidget } from "./useWidget";
import { useDeepMemo } from "./useDeepMemo";
import { WidgetComponentRef, WidgetComponentProps } from "./types";

export type ScrollbarComponentRef = WidgetComponentRef<Scrollbar>;

export type ScrollbarComponentConfig = ScrollbarConfig;

export type ScrollbarComponentProps<T extends ElementType> =
  WidgetComponentProps<T, Scrollbar, ScrollbarComponentConfig>;

export const ScrollbarComponent = <T extends ElementType = "div">({
  as,
  children,
  config,
  widgetRef,
  className,
  ...props
}: ScrollbarComponentProps<T>) => {
  const elementRef = useWidget<T, Scrollbar, ScrollbarComponentConfig>(
    newScrollbar,
    config,
    widgetRef,
  );

  return createElement(
    as || "div",
    {
      ref: elementRef,
      className: [
        className ?? "",
        (config?.hideNative ?? settings.scrollbarHideNative)
          ? "lisn-hide-scroll"
          : "",
      ].join(" "),
      ...props,
    },
    children,
  );
};

export const useScrollbar = (config?: ScrollbarConfig) => {
  const widgetRef = useRef<Scrollbar>(null);
  const configMemo = useDeepMemo(config);

  useEffect(() => {
    const widgetPromise = Scrollbar.enableMain(configMemo);
    widgetPromise.then((widget) => {
      widgetRef.current = widget;
    });

    return () => {
      widgetPromise.then((widget) => widget.destroy());
    };
  }, [configMemo]);

  return {
    getWidget: () => widgetRef.current,
  };
};

// ----------

const newScrollbar = (element: Element, config?: ScrollbarComponentConfig) =>
  element instanceof HTMLElement ? new Scrollbar(element, config) : null;
