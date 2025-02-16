"use client";
import {
  PagerComponent,
  PagerPageComponent,
  PagerSwitchComponent,
  PagerPrevSwitchComponent,
  PagerNextSwitchComponent,
} from "@lisn.js/react";
// Don't load the default pager CSS otherwise we'd have to override quite a few
// properties. We need to set custom style for everything anyway.
// import "lisn.js/pager.css";

import styles from "./demo.module.css";

export default function Page() {
  return (
    <>
      <div className={styles.wrapper}>
        <PagerComponent
          className={styles.demo}
          config={{
            horizontal: true,
            useGestures: "touch,wheel",
            alignGestureDirection: true,
            preventDefault: false,
          }}
        >
          <div className={styles.arrows}>
            <PagerPrevSwitchComponent
              className={styles.arrow}
              data-switch="prev"
              aria-label="Previous"
            ></PagerPrevSwitchComponent>
            <PagerNextSwitchComponent
              className={styles.arrow}
              data-switch="next"
              aria-label="Next"
            ></PagerNextSwitchComponent>
          </div>

          <div className={styles.pages}>
            {/* Pages act as switches themselves so that the user can tap one
						to make it active */}
            <PagerPageComponent className={styles.page}>
              <PagerSwitchComponent className={styles.content}>
                <h1>L</h1>
                <h4>Lightweight.</h4>

                <ul>
                  <li>Vanilla TypeScript</li>
                  <li>Highly optimized</li>
                  <li>No layout thrashing</li>
                </ul>
              </PagerSwitchComponent>
            </PagerPageComponent>

            <PagerPageComponent className={styles.page}>
              <PagerSwitchComponent className={styles.content}>
                <h1>I</h1>
                <h4>Interactive.</h4>

                <ul>
                  <li>Powerful API</li>
                  <li>Multi gesture support</li>
                  <li>Mobile/touch ready</li>
                </ul>
              </PagerSwitchComponent>
            </PagerPageComponent>

            <PagerPageComponent className={styles.page}>
              <PagerSwitchComponent className={styles.content}>
                <h1>S</h1>
                <h4>Simple.</h4>

                <ul>
                  <li>Intuitive syntax</li>
                  <li>Consistent API</li>
                  <li>HTML-only mode</li>
                </ul>
              </PagerSwitchComponent>
            </PagerPageComponent>

            <PagerPageComponent className={styles.page}>
              <PagerSwitchComponent className={styles.content}>
                <h1>N</h1>
                <h4>No-nonsense.</h4>

                <ul>
                  <li>What says on the box</li>
                  <li>Sensible defaults</li>
                  <li>Highly customizable</li>
                </ul>
              </PagerSwitchComponent>
            </PagerPageComponent>
          </div>
        </PagerComponent>
      </div>
    </>
  );
}
