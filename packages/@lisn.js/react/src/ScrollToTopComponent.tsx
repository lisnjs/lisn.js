"use client";
import { createElement, ElementType } from "react";

import { ScrollToTop, ScrollToTopConfig } from "lisn.js";

import { useWidget } from "./useWidget";
import { WidgetComponentRef, WidgetComponentProps } from "./types";

export type ScrollToTopComponentRef = WidgetComponentRef<ScrollToTop>;

export type ScrollToTopComponentConfig = ScrollToTopConfig;

export type ScrollToTopComponentProps<T extends ElementType> =
  WidgetComponentProps<T, ScrollToTop, ScrollToTopComponentConfig>;

export const ScrollToTopComponent = <T extends ElementType = "button">({
  as,
  config,
  widgetRef,
  ...props
}: ScrollToTopComponentProps<T>) => {
  const elementRef = useWidget<T, ScrollToTop, ScrollToTopComponentConfig>(
    newScrollToTop,
    config,
    widgetRef,
  );

  return createElement(as || "div", { ref: elementRef, ...props });
};

const newScrollToTop = (
  element: Element,
  config?: ScrollToTopComponentConfig,
) => new ScrollToTop(element, config);
