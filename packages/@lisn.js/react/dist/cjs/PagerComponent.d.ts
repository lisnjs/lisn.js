import { ElementType, RefObject } from "react";
import { Pager, PagerConfig } from "lisn.js";
import { WidgetComponentRef, WidgetComponentProps, GenericComponentProps } from "./types";
export type PagerComponentRef = WidgetComponentRef<Pager>;
export type PagerComponentConfig = Omit<PagerConfig, "pages" | "toggles" | "switches"> & {
    pages?: RefObject<Element | null>[];
    toggles?: RefObject<Element | null>[];
    switches?: RefObject<Element | null>[];
};
export type PagerComponentProps<T extends ElementType> = WidgetComponentProps<T, Pager, PagerComponentConfig>;
export declare const PagerComponent: <T extends ElementType = "div">({ as, children, config, widgetRef, ...props }: PagerComponentProps<T>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
export declare const PagerPageComponent: <T extends ElementType = "div">({ as, children, className, ...props }: GenericComponentProps<T>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
export declare const PagerToggleComponent: <T extends ElementType = "div">({ as, children, ...props }: GenericComponentProps<T>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
export declare const PagerSwitchComponent: <T extends ElementType = "div">({ as, children, ...props }: GenericComponentProps<T>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
export declare const PagerPrevSwitchComponent: <T extends ElementType = "div">({ as, children, ...props }: GenericComponentProps<T>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
export declare const PagerNextSwitchComponent: <T extends ElementType = "div">({ as, children, ...props }: GenericComponentProps<T>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
//# sourceMappingURL=PagerComponent.d.ts.map