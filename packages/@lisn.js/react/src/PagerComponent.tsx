"use client";
import {
  useEffect,
  useRef,
  createElement,
  ElementType,
  RefObject,
  ComponentRef,
} from "react";

import { Pager, PagerConfig } from "lisn.js";

import { useWidget } from "./useWidget";
import { getElementsFromRefs } from "./util";
import {
  WidgetComponentRef,
  WidgetComponentProps,
  GenericComponentProps,
} from "./types";

export type PagerComponentRef = WidgetComponentRef<Pager>;

export type PagerComponentConfig = Omit<
  PagerConfig,
  "pages" | "toggles" | "switches"
> & {
  pages?: RefObject<Element | null>[];
  toggles?: RefObject<Element | null>[];
  switches?: RefObject<Element | null>[];
};

export type PagerComponentProps<T extends ElementType> = WidgetComponentProps<
  T,
  Pager,
  PagerComponentConfig
>;

export const PagerComponent = <T extends ElementType = "div">({
  as,
  children,
  config,
  widgetRef,
  ...props
}: PagerComponentProps<T>) => {
  const elementRef = useWidget<T, Pager, PagerComponentConfig>(
    newPager,
    config,
    widgetRef,
  );

  return createElement(as || "div", { ref: elementRef, ...props }, children);
};

export const PagerPageComponent = <T extends ElementType = "div">({
  as,
  children,
  className,
  ...props
}: GenericComponentProps<T>) => {
  const elementRef = useRef<ComponentRef<T>>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (element instanceof Element) {
      element.classList.remove("lisn-undisplay");
    }
  }, [elementRef]);

  return createElement(
    as || "div",
    {
      ["data-lisn-pager-page"]: "",
      ref: elementRef,
      className: [className ?? "", "lisn-undisplay"].join(" "),
      ...props,
    },
    children,
  );
};

export const PagerToggleComponent = <T extends ElementType = "div">({
  as,
  children,
  ...props
}: GenericComponentProps<T>) => {
  return createElement(
    as || "div",
    { ["data-lisn-pager-toggle"]: "", ...props },
    children,
  );
};

export const PagerSwitchComponent = <T extends ElementType = "div">({
  as,
  children,
  ...props
}: GenericComponentProps<T>) => {
  return createElement(
    as || "div",
    { ["data-lisn-pager-switch"]: "", ...props },
    children,
  );
};

export const PagerPrevSwitchComponent = <T extends ElementType = "div">({
  as,
  children,
  ...props
}: GenericComponentProps<T>) => {
  return createElement(
    as || "div",
    { ["data-lisn-pager-prev-switch"]: "", ...props },
    children,
  );
};

export const PagerNextSwitchComponent = <T extends ElementType = "div">({
  as,
  children,
  ...props
}: GenericComponentProps<T>) => {
  return createElement(
    as || "div",
    { ["data-lisn-pager-next-switch"]: "", ...props },
    children,
  );
};

// --------------------

const newPager = (element: Element, config?: PagerComponentConfig) =>
  new Pager(
    element,
    Object.assign({}, config, {
      pages: getElementsFromRefs(config?.pages),
      toggles: getElementsFromRefs(config?.toggles),
      switches: getElementsFromRefs(config?.switches),
    }),
  );
