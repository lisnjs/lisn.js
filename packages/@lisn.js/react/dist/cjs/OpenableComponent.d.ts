import { ElementType, RefObject } from "react";
import { Collapsible, CollapsibleConfig, Popup, PopupConfig, Modal, ModalConfig, Offcanvas, OffcanvasConfig, OpenableTriggerConfig } from "lisn.js";
import { WidgetComponentRef, WidgetComponentProps, GenericComponentProps } from "./types";
export type CollapsibleComponentRef = WidgetComponentRef<Collapsible>;
export type CollapsibleComponentConfig = Omit<CollapsibleConfig, "triggers"> & {
    triggers?: RefObject<Element | null>[];
};
export type CollapsibleComponentProps<T extends ElementType> = WidgetComponentProps<T, Collapsible, CollapsibleComponentConfig> & {
    contentId?: string;
};
export declare const CollapsibleComponent: <T extends ElementType = "div">({ config, widgetRef, ...props }: CollapsibleComponentProps<T>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
export type PopupComponentRef = WidgetComponentRef<Popup>;
export type PopupComponentConfig = Omit<PopupConfig, "triggers"> & {
    triggers?: RefObject<Element | null>[];
};
export type PopupComponentProps<T extends ElementType> = WidgetComponentProps<T, Popup, PopupComponentConfig> & {
    contentId?: string;
};
export declare const PopupComponent: <T extends ElementType = "div">({ config, widgetRef, ...props }: PopupComponentProps<T>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
export type ModalComponentRef = WidgetComponentRef<Modal>;
export type ModalComponentConfig = Omit<ModalConfig, "triggers"> & {
    triggers?: RefObject<Element | null>[];
};
export type ModalComponentProps<T extends ElementType> = WidgetComponentProps<T, Modal, ModalComponentConfig> & {
    contentId?: string;
};
export declare const ModalComponent: <T extends ElementType = "div">({ config, widgetRef, ...props }: ModalComponentProps<T>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
export type OffcanvasComponentRef = WidgetComponentRef<Offcanvas>;
export type OffcanvasComponentConfig = Omit<OffcanvasConfig, "triggers"> & {
    triggers?: RefObject<Element | null>[];
};
export type OffcanvasComponentProps<T extends ElementType> = WidgetComponentProps<T, Offcanvas, OffcanvasComponentConfig> & {
    contentId?: string;
};
export declare const OffcanvasComponent: <T extends ElementType = "div">({ config, widgetRef, ...props }: OffcanvasComponentProps<T>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
export type OpenableTriggerComponentConfig = OpenableTriggerConfig;
export type OpenableTriggerComponentProps<T extends ElementType> = GenericComponentProps<T> & {
    as?: T;
    config?: OpenableTriggerComponentConfig;
    contentId?: string;
};
export declare const CollapsibleTriggerComponent: <T extends ElementType = "div">(allProps: OpenableTriggerComponentProps<T>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
export declare const PopupTriggerComponent: <T extends ElementType = "div">(allProps: OpenableTriggerComponentProps<T>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
export declare const ModalTriggerComponent: <T extends ElementType = "div">(allProps: OpenableTriggerComponentProps<T>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
export declare const OffcanvasTriggerComponent: <T extends ElementType = "div">(allProps: OpenableTriggerComponentProps<T>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
//# sourceMappingURL=OpenableComponent.d.ts.map