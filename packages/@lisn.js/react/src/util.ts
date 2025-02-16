import { RefObject } from "react";

export const getElementsFromRefs = (refs?: RefObject<Element | null>[]) =>
  refs?.map((r) => r.current).filter((e) => e !== null);
