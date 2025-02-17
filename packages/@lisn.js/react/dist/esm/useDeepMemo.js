"use client";

import { useRef, useMemo } from "react";
import { dequal } from "dequal";
export const useDeepMemo = value => {
  const valueRef = useRef(value);
  return useMemo(() => {
    if (!dequal(value, valueRef.current)) {
      valueRef.current = value;
    }
    return valueRef.current;
  }, [value]);
};
//# sourceMappingURL=useDeepMemo.js.map