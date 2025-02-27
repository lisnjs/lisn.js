import { RefObject, ComponentRef, ElementType } from "react";
import type { Widget } from "lisn.js";
import { WidgetComponentRef } from "./types";
export declare const useWidget: <T extends ElementType, W extends Widget, C extends object>(newWidget: (element: Element, config?: C) => W | null, config?: C | C[], widgetRef?: RefObject<WidgetComponentRef<W> | null>) => RefObject<ComponentRef<T> | null>;
//# sourceMappingURL=useWidget.d.ts.map