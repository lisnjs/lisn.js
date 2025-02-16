"use client";
import { useRef, useMemo } from "react";

import { dequal } from "dequal";

export const useDeepMemo = <V>(value: V) => {
  const valueRef = useRef(value);
  return useMemo(() => {
    if (!dequal(value, valueRef.current)) {
      valueRef.current = value;
    }

    return valueRef.current;
  }, [value]);
};
