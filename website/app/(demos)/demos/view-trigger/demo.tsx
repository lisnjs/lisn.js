"use client";
import { useEffect, useRef } from "react";

import {
  ViewWatcher,
  ScrollWatcher,
  LoadTrigger,
  Show,
  AutoHide,
  ViewData,
} from "lisn.js";
import { ScrollbarComponent } from "@lisn.js/react";
import "lisn.js/scrollbar.css";

import styles from "./demo.module.css";

export default function Page() {
  const msgRef = useRef(null);
  const scrollableRef = useRef(null);
  const triggerRefs = useRef([]);
  const tabRefs = useRef([]);

  const addTriggerRef = (trigger) => {
    triggerRefs.current.push(trigger);
  };

  const addTabRef = (tab) => {
    tabRefs.current.push(tab);
  };

  const getTabForTrigger = (trigger: Element) =>
    tabRefs.current[triggerRefs.current.indexOf(trigger)];

  const getTriggerForTab = (tab: Element) =>
    triggerRefs.current[tabRefs.current.indexOf(tab)];

  const onTabSelect = (event) => {
    const tab = event.target;
    const scrollable = scrollableRef.current.getWidget()?.getScrollable();
    if (scrollable && tab instanceof Element) {
      const trigger = getTriggerForTab(tab);
      if (trigger) {
        ScrollWatcher.reuse().scrollTo(trigger, {
          scrollable: scrollable,
          offset: { top: -5 },
        });
      }
    }
  };

  useEffect(() => {
    let viewWatcher;
    const scrollable = scrollableRef.current.getWidget()?.getScrollable();
    const triggers = [...triggerRefs.current];

    const onViewHandler = (trigger: Element, viewData: ViewData) => {
      const tab = getTabForTrigger(trigger);
      if (tab) {
        if (viewData.views[0] === "at") {
          tab.classList.add(styles.inview);
        } else {
          tab.classList.remove(styles.inview);
        }
      }
    };

    if (scrollable) {
      viewWatcher = ViewWatcher.create({
        root: scrollable,
        rootMargin: "0px",
      });

      for (const trigger of triggers) {
        viewWatcher.onView(trigger, onViewHandler);
      }
    }

    return () => {
      // cleanup
      for (const trigger of triggers) {
        viewWatcher?.offView(trigger, onViewHandler);
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

        <div className={styles.demo}>
          <div className={styles.tabs}>
            <div ref={addTabRef} onClick={onTabSelect} className={styles.tab}>
              L
            </div>
            <div ref={addTabRef} onClick={onTabSelect} className={styles.tab}>
              I
            </div>
            <div ref={addTabRef} onClick={onTabSelect} className={styles.tab}>
              S
            </div>
            <div ref={addTabRef} onClick={onTabSelect} className={styles.tab}>
              N
            </div>
          </div>

          <ScrollbarComponent
            widgetRef={scrollableRef}
            className={styles.scrollable}
          >
            <div ref={addTriggerRef} className={styles.trigger}></div>
            <div className={styles.section}>
              <h1>L</h1>
              <h4>Lightweight.</h4>

              <ul>
                <li>Vanilla TypeScript</li>
                <li>Highly optimized</li>
                <li>No layout thrashing</li>
              </ul>
            </div>

            <div ref={addTriggerRef} className={styles.trigger}></div>
            <div className={styles.section}>
              <h1>I</h1>
              <h4>Interactive.</h4>

              <ul>
                <li>Powerful API</li>
                <li>Multi gesture support</li>
                <li>Mobile/touch ready</li>
              </ul>
            </div>

            <div ref={addTriggerRef} className={styles.trigger}></div>
            <div className={styles.section}>
              <h1>S</h1>
              <h4>Simple.</h4>

              <ul>
                <li>Intuitive syntax</li>
                <li>Consistent API</li>
                <li>HTML-only mode</li>
              </ul>
            </div>

            <div ref={addTriggerRef} className={styles.trigger}></div>
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
