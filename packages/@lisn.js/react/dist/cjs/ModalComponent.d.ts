import { ElementType, RefObject } from "react";
import { Modal, ModalConfig } from "lisn.js";
import { WidgetComponentRef, WidgetComponentProps } from "./types";
export type ModalComponentRef = WidgetComponentRef<Modal>;
export type ModalComponentProps<T extends ElementType> = WidgetComponentProps<T, ModalComponentRef, Omit<ModalConfig, "triggers">> & {
    triggers?: RefObject<Element | null>[];
};
export declare const ModalComponent: <T extends ElementType = "div">({ as, children, triggers, config, widgetRef, ...props }: ModalComponentProps<T>) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ModalComponent.d.ts.map