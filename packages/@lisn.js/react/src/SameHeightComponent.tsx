"use client";
import { createElement, ElementType, RefObject } from "react";

import { SameHeight, SameHeightConfig } from "lisn.js";

import { useWidget } from "./useWidget";
import { getElementsFromRefs } from "./util";
import {
  WidgetComponentRef,
  WidgetComponentProps,
  GenericComponentProps,
} from "./types";

export type SameHeightComponentRef = WidgetComponentRef<SameHeight>;

export type SameHeightComponentConfig = Omit<SameHeightConfig, "items"> & {
  items?: RefObject<Element | null>[];
};

export type SameHeightComponentProps<T extends ElementType> =
  WidgetComponentProps<T, SameHeight, SameHeightComponentConfig>;

export const SameHeightComponent = <T extends ElementType = "div">({
  as,
  children,
  config,
  widgetRef,
  ...props
}: SameHeightComponentProps<T>) => {
  const elementRef = useWidget<T, SameHeight, SameHeightComponentConfig>(
    newSameHeight,
    config,
    widgetRef,
  );

  return createElement(as || "div", { ref: elementRef, ...props }, children);
};

export type SameHeightItemComponentProps<T extends ElementType> = {
  type?: "text" | "image";
} & GenericComponentProps<T>;

export const SameHeightItemComponent = <T extends ElementType = "div">({
  type,
  as,
  children,
  ...props
}: SameHeightComponentProps<T>) => {
  return createElement(
    as || "div",
    { ["data-lisn-same-height-item"]: type ?? "", ...props },
    children,
  );
};

// --------------------

const newSameHeight = (element: Element, config?: SameHeightComponentConfig) =>
  element instanceof HTMLElement
    ? new SameHeight(
        element,
        Object.assign({}, config, {
          items: getElementsFromRefs(config?.items),
        }),
      )
    : null;
