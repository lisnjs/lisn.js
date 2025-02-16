"use client";
import { createElement, ElementType } from "react";

import { PageLoader, PageLoaderConfig } from "lisn.js";

import { useWidget } from "./useWidget";
import { WidgetComponentRef, WidgetComponentProps } from "./types";

export type PageLoaderComponentRef = WidgetComponentRef<PageLoader>;

export type PageLoaderComponentConfig = PageLoaderConfig;

export type PageLoaderComponentProps<T extends ElementType> =
  WidgetComponentProps<T, PageLoader, PageLoaderConfig>;

export const PageLoaderComponent = <T extends ElementType = "button">({
  as,
  config,
  widgetRef,
  ...props
}: PageLoaderComponentProps<T>) => {
  const elementRef = useWidget<T, PageLoader, PageLoaderComponentConfig>(
    newPageLoader,
    config,
    widgetRef,
  );

  return createElement(as || "div", { ref: elementRef, ...props });
};

const newPageLoader = (element: Element, config?: PageLoaderComponentConfig) =>
  new PageLoader(element, config);
