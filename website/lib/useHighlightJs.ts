"use client";
import { useEffect, RefObject } from "react";

import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import xml from "highlight.js/lib/languages/xml";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import css from "highlight.js/lib/languages/css";

import "@app/highlightjs.scss";

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("css", css);

export const useHighlightJs = (ref?: RefObject<HTMLElement>) => {
  useEffect(() => {
    const element = ref?.current;
    if (element) {
      for (const code of element.tagName.toLowerCase() === "code"
        ? [element]
        : element.querySelectorAll("code")) {
        hljs.highlightElement(code);
      }
    } else {
      hljs.highlightAll();
    }
    return () => {};
  }, [ref]);
};
