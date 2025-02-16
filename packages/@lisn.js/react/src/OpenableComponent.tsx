"use client";
import {
  useEffect,
  createElement,
  ElementType,
  RefObject,
  ComponentRef,
  ComponentPropsWithoutRef,
} from "react";

import {
  Collapsible,
  CollapsibleConfig,
  Popup,
  PopupConfig,
  Modal,
  ModalConfig,
  Offcanvas,
  OffcanvasConfig,
  OpenableTriggerConfig,
  Openable,
} from "lisn.js";

import { useWidget } from "./useWidget";
import { getElementsFromRefs } from "./util";
import {
  WidgetComponentRef,
  WidgetComponentProps,
  GenericComponentProps,
} from "./types";

export type CollapsibleComponentRef = WidgetComponentRef<Collapsible>;

export type CollapsibleComponentConfig = Omit<CollapsibleConfig, "triggers"> & {
  triggers?: RefObject<Element | null>[];
};

export type CollapsibleComponentProps<T extends ElementType> =
  WidgetComponentProps<T, Collapsible, CollapsibleComponentConfig> & {
    contentId?: string;
  };

export const CollapsibleComponent = <T extends ElementType = "div">({
  config,
  widgetRef,
  ...props
}: CollapsibleComponentProps<T>) => {
  const elementRef = useOpenable<T, Collapsible, CollapsibleComponentConfig>(
    newCollapsible,
    config,
    widgetRef,
  );

  return createOpenableElement<T>({
    name: "collapsible",
    elementRef,
    ...props,
  } as OpenableProps<T>);
};

const newCollapsible = (
  element: Element,
  config?: CollapsibleComponentConfig,
) =>
  element instanceof HTMLElement
    ? new Collapsible(
        element,
        Object.assign({}, config, {
          triggers: getElementsFromRefs(config?.triggers),
        }),
      )
    : null;

// ----------

export type PopupComponentRef = WidgetComponentRef<Popup>;

export type PopupComponentConfig = Omit<PopupConfig, "triggers"> & {
  triggers?: RefObject<Element | null>[];
};

export type PopupComponentProps<T extends ElementType> = WidgetComponentProps<
  T,
  Popup,
  PopupComponentConfig
> & { contentId?: string };

export const PopupComponent = <T extends ElementType = "div">({
  config,
  widgetRef,
  ...props
}: PopupComponentProps<T>) => {
  const elementRef = useOpenable<T, Popup, PopupComponentConfig>(
    newPopup,
    config,
    widgetRef,
  );

  return createOpenableElement<T>({
    name: "popup",
    elementRef,
    ...props,
  } as OpenableProps<T>);
};

const newPopup = (element: Element, config?: PopupComponentConfig) =>
  element instanceof HTMLElement
    ? new Popup(
        element,
        Object.assign({}, config, {
          triggers: getElementsFromRefs(config?.triggers),
        }),
      )
    : null;

// ----------

export type ModalComponentRef = WidgetComponentRef<Modal>;

export type ModalComponentConfig = Omit<ModalConfig, "triggers"> & {
  triggers?: RefObject<Element | null>[];
};

export type ModalComponentProps<T extends ElementType> = WidgetComponentProps<
  T,
  Modal,
  ModalComponentConfig
> & { contentId?: string };

export const ModalComponent = <T extends ElementType = "div">({
  config,
  widgetRef,
  ...props
}: ModalComponentProps<T>) => {
  const elementRef = useOpenable<T, Modal, ModalComponentConfig>(
    newModal,
    config,
    widgetRef,
  );

  return createOpenableElement<T>({
    name: "modal",
    elementRef,
    ...props,
  } as OpenableProps<T>);
};

const newModal = (element: Element, config?: ModalComponentConfig) =>
  element instanceof HTMLElement
    ? new Modal(
        element,
        Object.assign({}, config, {
          triggers: getElementsFromRefs(config?.triggers),
        }),
      )
    : null;

// ----------

export type OffcanvasComponentRef = WidgetComponentRef<Offcanvas>;

export type OffcanvasComponentConfig = Omit<OffcanvasConfig, "triggers"> & {
  triggers?: RefObject<Element | null>[];
};

export type OffcanvasComponentProps<T extends ElementType> =
  WidgetComponentProps<T, Offcanvas, OffcanvasComponentConfig> & {
    contentId?: string;
  };

export const OffcanvasComponent = <T extends ElementType = "div">({
  config,
  widgetRef,
  ...props
}: OffcanvasComponentProps<T>) => {
  const elementRef = useOpenable<T, Offcanvas, OffcanvasComponentConfig>(
    newOffcanvas,
    config,
    widgetRef,
  );

  return createOpenableElement<T>({
    name: "offcanvas",
    elementRef,
    ...props,
  } as OpenableProps<T>);
};

const newOffcanvas = (element: Element, config?: OffcanvasComponentConfig) =>
  element instanceof HTMLElement
    ? new Offcanvas(
        element,
        Object.assign({}, config, {
          triggers: getElementsFromRefs(config?.triggers),
        }),
      )
    : null;

// ----------

export type OpenableTriggerComponentConfig = OpenableTriggerConfig;

export type OpenableTriggerComponentProps<T extends ElementType> =
  GenericComponentProps<T> & {
    as?: T;
    config?: OpenableTriggerComponentConfig;
    contentId?: string;
  };

export const CollapsibleTriggerComponent = <T extends ElementType = "div">(
  allProps: OpenableTriggerComponentProps<T>,
) =>
  TriggerComponent({
    name: "collapsible",
    ...allProps,
  });

export const PopupTriggerComponent = <T extends ElementType = "div">(
  allProps: OpenableTriggerComponentProps<T>,
) =>
  TriggerComponent({
    name: "popup",
    ...allProps,
  });

export const ModalTriggerComponent = <T extends ElementType = "div">(
  allProps: OpenableTriggerComponentProps<T>,
) =>
  TriggerComponent({
    name: "modal",
    ...allProps,
  });

export const OffcanvasTriggerComponent = <T extends ElementType = "div">(
  allProps: OpenableTriggerComponentProps<T>,
) =>
  TriggerComponent({
    name: "offcanvas",
    ...allProps,
  });

const TriggerComponent = <T extends ElementType = "div">({
  name,
  as,
  children,
  config,
  contentId,
  ...props
}: OpenableTriggerComponentProps<T> & { name: string }) => {
  // Since a trigger config object can only be passed as part of the widget
  // configuration (in a trigger map) and that is created in another component,
  // we have to use data attributes to pass the config.
  let configStr = "";
  let prop: keyof OpenableTriggerConfig;
  config = config || {};
  for (prop in config) {
    configStr += (configStr ? "|" : "") + prop + "=" + String(config[prop]);
  }

  return createElement(
    as || "div",
    {
      [`data-lisn-${name}-trigger`]: configStr,
      ...(contentId ? { [`data-lisn-${name}-content-id`]: contentId } : {}),
      ...props,
    },
    children,
  );
};

// --------------------

const useOpenable = <
  T extends ElementType,
  W extends Openable,
  C extends object,
>(
  newWidget: (element: Element, config?: C) => W | null,
  config?: C,
  widgetRef?: RefObject<WidgetComponentRef<W>>,
) => {
  const elementRef = useWidget<T, W, C>(newWidget, config, widgetRef);

  useEffect(() => {
    const element = elementRef.current;
    if (element instanceof Element) {
      element.classList.remove("lisn-undisplay");
    }
  }, [elementRef]);

  return elementRef;
};

type OpenableProps<T extends ElementType> = {
  name: string;
  elementRef: RefObject<ComponentRef<T> | null>;
  as?: T;
  contentId?: string;
} & ComponentPropsWithoutRef<T>;

const createOpenableElement = <T extends ElementType = "div">({
  name,
  as,
  contentId,
  elementRef,
  className,
  children,
  ...baseProps
}: OpenableProps<T>) => {
  return createElement(
    as || "div",
    {
      ref: elementRef,
      ...(contentId ? { [`data-lisn-${name}-content-id`]: contentId } : {}),
      className: [className ?? "", "lisn-undisplay"].join(" "),
      ...baseProps,
    },
    children,
  );
};
