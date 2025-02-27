import { RefObject, ElementType, ComponentPropsWithoutRef } from "react";

import { Widget } from "lisn.js";

export type WidgetComponentRef<W extends Widget> = {
  getWidget: () => W | null;
  getWidgets: () => W[];
};

export type WidgetComponentProps<T extends ElementType, W extends Widget, C> = {
  as?: T;
  config?: C;
  widgetRef?: RefObject<WidgetComponentRef<W> | null>;
} & ComponentPropsWithoutRef<T>;

export type GenericComponentProps<T extends ElementType> = {
  as?: T;
} & ComponentPropsWithoutRef<T>;

export type MultiWidgetComponentProps<
  T extends ElementType,
  W extends Widget,
  C,
> = WidgetComponentProps<T, W, C> & {
  config?: C | C[];
};
