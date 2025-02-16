import { ElementType, RefObject } from "react";
import { Sortable, SortableConfig } from "lisn.js";
import { WidgetComponentRef, WidgetComponentProps, GenericComponentProps } from "./types";
export type SortableComponentRef = WidgetComponentRef<Sortable>;
export type SortableComponentConfig = Omit<SortableConfig, "items"> & {
    items?: RefObject<Element | null>[];
};
export type SortableComponentProps<T extends ElementType> = WidgetComponentProps<T, Sortable, SortableComponentConfig>;
export declare const SortableComponent: <T extends ElementType = "div">({ as, children, config, widgetRef, ...props }: SortableComponentProps<T>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
export declare const SortableItemComponent: <T extends ElementType = "div">({ as, children, ...props }: GenericComponentProps<T>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
//# sourceMappingURL=SortableComponent.d.ts.map