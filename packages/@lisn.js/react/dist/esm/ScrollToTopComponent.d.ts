import { ElementType } from "react";
import { ScrollToTop, ScrollToTopConfig } from "lisn.js";
import { WidgetComponentRef, WidgetComponentProps } from "./types";
export type ScrollToTopComponentRef = WidgetComponentRef<ScrollToTop>;
export type ScrollToTopComponentConfig = ScrollToTopConfig;
export type ScrollToTopComponentProps<T extends ElementType> = WidgetComponentProps<T, ScrollToTop, ScrollToTopComponentConfig>;
export declare const ScrollToTopComponent: <T extends ElementType = "button">({ as, config, widgetRef, ...props }: ScrollToTopComponentProps<T>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
//# sourceMappingURL=ScrollToTopComponent.d.ts.map