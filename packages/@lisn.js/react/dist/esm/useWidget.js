"use client";

import { useRef, useEffect, useImperativeHandle } from "react";
import { useDeepMemo } from "./useDeepMemo";
export const useWidget = (newWidget, config, widgetRef) => {
  const elementRef = useRef(null);
  const widgetRefInternal = useRef(null);
  const configMemo = useDeepMemo(config);
  useEffect(() => {
    if (elementRef.current instanceof Element) {
      widgetRefInternal.current = newWidget(elementRef.current, configMemo);
    }
    return () => {
      var _widgetRefInternal$cu;
      (_widgetRefInternal$cu = widgetRefInternal.current) === null || _widgetRefInternal$cu === void 0 || _widgetRefInternal$cu.destroy();
    };
  }, [configMemo, newWidget]);
  useImperativeHandle(widgetRef, () => {
    return {
      getWidget: () => widgetRefInternal.current
    };
  });
  return elementRef;
};
//# sourceMappingURL=useWidget.js.map