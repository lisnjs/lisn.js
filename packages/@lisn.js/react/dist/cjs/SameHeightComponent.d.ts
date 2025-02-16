import { ElementType, RefObject } from "react";
import { SameHeight, SameHeightConfig } from "lisn.js";
import { WidgetComponentRef, WidgetComponentProps, GenericComponentProps } from "./types";
export type SameHeightComponentRef = WidgetComponentRef<SameHeight>;
export type SameHeightComponentConfig = Omit<SameHeightConfig, "items"> & {
    items?: RefObject<Element | null>[];
};
export type SameHeightComponentProps<T extends ElementType> = WidgetComponentProps<T, SameHeight, SameHeightComponentConfig>;
export declare const SameHeightComponent: <T extends ElementType = "div">({ as, children, config, widgetRef, ...props }: SameHeightComponentProps<T>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
export type SameHeightItemComponentProps<T extends ElementType> = {
    type?: "text" | "image";
} & GenericComponentProps<T>;
export declare const SameHeightItemComponent: <T extends ElementType = "div">({ type, as, children, ...props }: SameHeightComponentProps<T>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
//# sourceMappingURL=SameHeightComponent.d.ts.map