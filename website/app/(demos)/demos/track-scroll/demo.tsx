"use client";
import { useEffect, useRef } from "react";

import { ScrollWatcher, LoadTrigger, Show } from "lisn.js";
import { AutoHideComponent, AutoHideComponentRef } from "@lisn.js/react";
import "lisn.js/base.css";

import styles from "./demo.module.css";

export default function Page() {
  const msgRef = useRef<AutoHideComponentRef>(null);
  const demoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const watcher = ScrollWatcher.reuse();
    const main = demoRef.current;
    if (main) {
      watcher.trackScroll(null, {
        scrollable: main,
        threshold: 0,
      });
    }

    return () => {
      // cleanup
      if (main) {
        watcher.noTrackScroll(null, main);
      }
    };
  }, []);

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

        <div ref={demoRef} className={styles.demo}>
          <div className={styles.spotlight}></div>

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
        </div>
      </div>
    </>
  );
}
