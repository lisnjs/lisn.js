import { ElementType } from "react";
import { PageLoader, PageLoaderConfig } from "lisn.js";
import { WidgetComponentRef, WidgetComponentProps } from "./types";
export type PageLoaderComponentRef = WidgetComponentRef<PageLoader>;
export type PageLoaderComponentConfig = PageLoaderConfig;
export type PageLoaderComponentProps<T extends ElementType> = WidgetComponentProps<T, PageLoader, PageLoaderConfig>;
export declare const PageLoaderComponent: <T extends ElementType = "button">({ as, config, widgetRef, ...props }: PageLoaderComponentProps<T>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
//# sourceMappingURL=PageLoaderComponent.d.ts.map