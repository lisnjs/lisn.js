import { RefObject, ElementType, ComponentPropsWithoutRef } from "react";
import { Widget } from "lisn.js";
export type WidgetComponentRef<W extends Widget> = {
    getWidget: () => W | null;
};
export type WidgetComponentProps<T extends ElementType, W extends Widget, C> = {
    as?: T;
    config?: C;
    widgetRef?: RefObject<WidgetComponentRef<W>>;
} & ComponentPropsWithoutRef<T>;
export type GenericComponentProps<T extends ElementType> = {
    as?: T;
} & ComponentPropsWithoutRef<T>;
//# sourceMappingURL=types.d.ts.map