"use client";
import { useEffect, useRef } from "react";

import { LayoutWatcher, LayoutData, LayoutTrigger, Show } from "lisn.js";
import "lisn.js/base.css";

import styles from "./demo.module.css";

export default function Page() {
  const boxRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLHeadingElement>(null);
  const windowLayoutMsgRef = useRef<HTMLParagraphElement>(null);
  const boxLayoutMsgRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // box layout
    const box = boxRef.current;
    const msg = boxLayoutMsgRef.current;
    const handler = (layout: LayoutData) => {
      const { device, aspectRatio } = layout;
      if (msg && device && aspectRatio) {
        msg.innerText =
          `The resizable box below has a ${formatLayout(device)} width ` +
          `and a ${formatLayout(aspectRatio)} aspect ratio.`;
      }
    };
    let watcher: LayoutWatcher;

    if (box) {
      watcher = LayoutWatcher.create({ root: box });
      watcher.onLayout(handler);
    }

    return () => {
      // cleanup
      watcher?.offLayout(handler);
    };
  }, []);

  useEffect(() => {
    // window layout
    const msg = windowLayoutMsgRef.current;
    const handler = (layout: LayoutData) => {
      const { device, aspectRatio } = layout;
      if (msg && device && aspectRatio) {
        msg.innerText =
          `This is a ${formatLayout(device)} device ` +
          `with a ${formatLayout(aspectRatio)} aspect ratio.`;
      }
    };
    const watcher = LayoutWatcher.reuse();
    watcher.onLayout(handler);

    return () => {
      // cleanup
      watcher.offLayout(handler);
    };
  }, []);

  useEffect(() => {
    // You could also use LayoutWatcher directly and show/hide the element in
    // your callback
    const msg = msgRef.current;
    let trigger: LayoutTrigger;
    if (msg) {
      trigger = new LayoutTrigger(msg, [new Show(msg)], {
        layout: "max tablet",
      });
    }

    return () => {
      // cleanup
      trigger?.destroy();
    };
  }, []);

  return (
    <>
      <div className={styles.wrapper}>
        <h4 ref={msgRef} className={[styles.msg, "lisn-hide"].join(" ")}>
          This demo is best viewed on a computer.
        </h4>

        <div className={styles.demo}>
          <p ref={windowLayoutMsgRef}></p>
          <p ref={boxLayoutMsgRef}></p>
          <div ref={boxRef} className={styles.box}></div>
        </div>
      </div>
    </>
  );
}

const layoutMapping: { [K in string]: string } = {
  "mobile-wide": "mobile (landscape)",
  square: "roughly square",
};

const formatLayout = (l: string) =>
  (l in layoutMapping ? layoutMapping[l] : l).replace(/-/g, " ");
