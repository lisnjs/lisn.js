"use client";

import { useRef, useEffect, useImperativeHandle } from "react";
import { useDeepMemo } from "./useDeepMemo";
export var useWidget = function useWidget(newWidget, config, widgetRef) {
  var elementRef = useRef(null);
  var widgetRefInternal = useRef(null);
  var configMemo = useDeepMemo(config);
  useEffect(function () {
    if (elementRef.current instanceof Element) {
      widgetRefInternal.current = newWidget(elementRef.current, configMemo);
    }
    return function () {
      var _widgetRefInternal$cu;
      (_widgetRefInternal$cu = widgetRefInternal.current) === null || _widgetRefInternal$cu === void 0 || _widgetRefInternal$cu.destroy();
    };
  }, [configMemo, newWidget]);
  useImperativeHandle(widgetRef, function () {
    return {
      getWidget: function getWidget() {
        return widgetRefInternal.current;
      }
    };
  });
  return elementRef;
};
//# sourceMappingURL=useWidget.js.map