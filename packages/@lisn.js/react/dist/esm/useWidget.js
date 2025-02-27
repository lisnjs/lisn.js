"use client";

import { useRef, useEffect, useImperativeHandle } from "react";
import { useDeepMemo } from "./useDeepMemo";
export const useWidget = (newWidget, config, widgetRef) => {
  const configs = config instanceof Array ? config : config ? [config] : [];
  const elementRef = useRef(null);
  const widgetRefsInternal = useRef([]);
  const configsMemo = useDeepMemo(configs);
  useEffect(() => {
    if (elementRef.current instanceof Element) {
      for (const thisConfig of configsMemo) {
        const widget = newWidget(elementRef.current, thisConfig);
        if (widget) {
          widgetRefsInternal.current.push(widget);
        }
      }
    }
    const widgets = widgetRefsInternal.current;
    return () => {
      for (const widget of widgets) {
        widget.destroy();
      }
      widgetRefsInternal.current = [];
    };
  }, [configsMemo, newWidget]);
  useImperativeHandle(widgetRef, () => {
    return {
      getWidget: () => {
        var _widgetRefsInternal$c;
        return (_widgetRefsInternal$c = widgetRefsInternal.current[0]) !== null && _widgetRefsInternal$c !== void 0 ? _widgetRefsInternal$c : null;
      },
      getWidgets: () => widgetRefsInternal.current
    };
  });
  return elementRef;
};
//# sourceMappingURL=useWidget.js.map