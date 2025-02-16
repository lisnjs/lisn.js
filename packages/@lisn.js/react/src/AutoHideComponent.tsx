"use client";
import { createElement, ElementType } from "react";

import { AutoHide, AutoHideConfig } from "lisn.js";

import { useWidget } from "./useWidget";
import { WidgetComponentRef, WidgetComponentProps } from "./types";

export type AutoHideComponentRef = WidgetComponentRef<AutoHide>;

export type AutoHideComponentConfig = AutoHideConfig;

export type AutoHideComponentProps<T extends ElementType> =
  WidgetComponentProps<T, AutoHide, AutoHideComponentConfig>;

export const AutoHideComponent = <T extends ElementType = "div">({
  as,
  children,
  config,
  widgetRef,
  ...props
}: AutoHideComponentProps<T>) => {
  const elementRef = useWidget<T, AutoHide, AutoHideComponentConfig>(
    newAutoHide,
    config,
    widgetRef,
  );

  return createElement(as || "div", { ref: elementRef, ...props }, children);
};

const newAutoHide = (element: Element, config?: AutoHideComponentConfig) =>
  new AutoHide(element, config);
