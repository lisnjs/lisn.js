"use client";
import { useEffect, useRef } from "react";

import {
  ViewWatcher,
  ScrollWatcher,
  LoadTrigger,
  Show,
  AutoHide,
} from "lisn.js";
import { ScrollbarComponent } from "@lisn.js/react";
import "lisn.js/scrollbar.css";

import styles from "./demo.module.css";

export default function Page() {
  const msgRef = useRef(null);
  const demoRef = useRef(null);

  useEffect(() => {
    const main = demoRef.current;
    const scrollWatcher = ScrollWatcher.reuse();
    let viewWatcher;
    if (main) {
      const scrollable = main.querySelector(`.${styles.scrollable}`);
      const tabs = main.querySelectorAll(`.${styles.tab}`);
      const triggerLines = scrollable.querySelectorAll(`.${styles.trigger}`);

      viewWatcher = ViewWatcher.create({
        root: scrollable,
        rootMargin: "0px",
      });

      for (let i = 0; i < triggerLines.length; i++) {
        const tab = tabs[i];
        if (tab) {
          viewWatcher.onView(triggerLines[i], (e, viewData) => {
            if (viewData.views[0] === "at") {
              tab.classList.add(styles.inview);
            } else {
              tab.classList.remove(styles.inview);
            }
          });

          tab.addEventListener("click", () =>
            scrollWatcher.scrollTo(triggerLines[i], {
              scrollable: scrollable,
              offset: { top: -5 },
            }),
          );
        }
      }
    }

    return () => {
      // cleanup
      if (main) {
        viewWatcher.noTrackScroll(null, main);
      }
    };
  }, []);

  useEffect(() => {
    const msg = msgRef.current;
    let widget;
    if (msg) {
      new LoadTrigger(msg, [new Show(msg)], {
        delay: 1000,
      });
      widget = new AutoHide(msg, { delay: 2500 });
    }

    return () => {
      // cleanup
      widget?.destroy();
    };
  }, []);

  return (
    <>
      <div className={styles.wrapper}>
        <p ref={msgRef} className={[styles.msg, "lisn-hide"].join(" ")}>
          Scroll the box
        </p>

        <div ref={demoRef} className={styles.demo}>
          <div className={styles.tabs}>
            <div className={styles.tab}>L</div>
            <div className={styles.tab}>I</div>
            <div className={styles.tab}>S</div>
            <div className={styles.tab}>N</div>
          </div>

          <ScrollbarComponent className={styles.scrollable}>
            <div className={styles.trigger}></div>
            <div className={styles.section}>
              <h1>L</h1>
              <h4>Lightweight.</h4>

              <ul>
                <li>Vanilla TypeScript</li>
                <li>Highly optimized</li>
                <li>No layout thrashing</li>
              </ul>
            </div>

            <div className={styles.trigger}></div>
            <div className={styles.section}>
              <h1>I</h1>
              <h4>Interactive.</h4>

              <ul>
                <li>Powerful API</li>
                <li>Multi gesture support</li>
                <li>Mobile/touch ready</li>
              </ul>
            </div>

            <div className={styles.trigger}></div>
            <div className={styles.section}>
              <h1>S</h1>
              <h4>Simple.</h4>

              <ul>
                <li>Intuitive syntax</li>
                <li>Consistent API</li>
                <li>HTML-only mode</li>
              </ul>
            </div>

            <div className={styles.trigger}></div>
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
      </div>
    </>
  );
}
