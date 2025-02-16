"use client";

import { useRef, useMemo } from "react";
import { dequal } from "dequal";
export var useDeepMemo = function useDeepMemo(value) {
  var valueRef = useRef(value);
  return useMemo(function () {
    if (!dequal(value, valueRef.current)) {
      valueRef.current = value;
    }
    return valueRef.current;
  }, [value]);
};
//# sourceMappingURL=useDeepMemo.js.map