"use client";
import { createElement, ElementType, RefObject } from "react";

import { Sortable, SortableConfig } from "lisn.js";

import { useWidget } from "./useWidget";
import { getElementsFromRefs } from "./util";
import {
  WidgetComponentRef,
  WidgetComponentProps,
  GenericComponentProps,
} from "./types";

export type SortableComponentRef = WidgetComponentRef<Sortable>;

export type SortableComponentConfig = Omit<SortableConfig, "items"> & {
  items?: RefObject<Element | null>[];
};

export type SortableComponentProps<T extends ElementType> =
  WidgetComponentProps<T, Sortable, SortableComponentConfig>;

export const SortableComponent = <T extends ElementType = "div">({
  as,
  children,
  config,
  widgetRef,
  ...props
}: SortableComponentProps<T>) => {
  const elementRef = useWidget<T, Sortable, SortableComponentConfig>(
    newSortable,
    config,
    widgetRef,
  );

  return createElement(as || "div", { ref: elementRef, ...props }, children);
};

export const SortableItemComponent = <T extends ElementType = "div">({
  as,
  children,
  ...props
}: GenericComponentProps<T>) => {
  return createElement(
    as || "div",
    { ["data-lisn-sortable-item"]: "", ...props },
    children,
  );
};

// --------------------

const newSortable = (element: Element, config?: SortableComponentConfig) =>
  new Sortable(
    element,
    Object.assign({}, config, {
      items: getElementsFromRefs(config?.items),
    }),
  );
