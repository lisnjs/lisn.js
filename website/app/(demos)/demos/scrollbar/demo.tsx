"use client";
import { useEffect, useRef } from "react";

import { LoadTrigger, Show } from "lisn.js";
import {
  ScrollbarComponent,
  AutoHideComponent,
  AutoHideComponentRef,
} from "@lisn.js/react";
import "lisn.js/scrollbar.css";

import styles from "./demo.module.css";

export default function Page() {
  const msgRef = useRef<AutoHideComponentRef>(null);

  useEffect(() => {
    const msg = msgRef.current?.getWidget()?.getElement();
    if (msg) {
      new LoadTrigger(msg, [new Show(msg)], {
        delay: 1000,
      });
    }
  }, []);

  return (
    <>
      <div className={styles.wrapper}>
        <AutoHideComponent
          widgetRef={msgRef}
          className={[styles.msg, "lisn-hide"].join(" ")}
          as="p"
          config={{ delay: 2500 }} // you can also pass an array of configs for multiple AutoHides
        >
          Scroll the box
        </AutoHideComponent>

        <ScrollbarComponent
          className={styles.demo}
          config={{ onMobile: true, autoHide: 2000, positionV: "top" }}
        >
          <div className={styles.section}>
            <h1>L</h1>
            <h4>Lightweight.</h4>

            <ul>
              <li>Vanilla TypeScript</li>
              <li>Highly optimized</li>
              <li>No layout thrashing</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h1>I</h1>
            <h4>Interactive.</h4>

            <ul>
              <li>Powerful API</li>
              <li>Multi gesture support</li>
              <li>Mobile/touch ready</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h1>S</h1>
            <h4>Simple.</h4>

            <ul>
              <li>Intuitive syntax</li>
              <li>Consistent API</li>
              <li>HTML-only mode</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h1>N</h1>
            <h4>No-nonsense.</h4>

            <ul>
              <li>What says on the box</li>
              <li>Sensible defaults</li>
              <li>Highly customizable</li>
            </ul>
          </div>
        </ScrollbarComponent>
      </div>
    </>
  );
}
