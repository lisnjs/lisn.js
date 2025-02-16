import { ElementType } from "react";
import { Scrollbar, ScrollbarConfig } from "lisn.js";
import { WidgetComponentRef, WidgetComponentProps } from "./types";
export type ScrollbarComponentRef = WidgetComponentRef<Scrollbar>;
export type ScrollbarComponentConfig = ScrollbarConfig;
export type ScrollbarComponentProps<T extends ElementType> = WidgetComponentProps<T, Scrollbar, ScrollbarComponentConfig>;
export declare const ScrollbarComponent: <T extends ElementType = "div">({ as, children, config, widgetRef, className, ...props }: ScrollbarComponentProps<T>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
export declare const useScrollbar: (config?: ScrollbarConfig) => {
    getWidget: () => Scrollbar | null;
};
//# sourceMappingURL=ScrollbarComponent.d.ts.map