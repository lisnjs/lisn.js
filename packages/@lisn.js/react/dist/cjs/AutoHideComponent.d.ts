import { ElementType } from "react";
import { AutoHide, AutoHideConfig } from "lisn.js";
import { WidgetComponentRef, WidgetComponentProps } from "./types";
export type AutoHideComponentRef = WidgetComponentRef<AutoHide>;
export type AutoHideComponentConfig = AutoHideConfig;
export type AutoHideComponentProps<T extends ElementType> = WidgetComponentProps<T, AutoHide, AutoHideComponentConfig>;
export declare const AutoHideComponent: <T extends ElementType = "div">({ as, children, config, widgetRef, ...props }: AutoHideComponentProps<T>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
//# sourceMappingURL=AutoHideComponent.d.ts.map