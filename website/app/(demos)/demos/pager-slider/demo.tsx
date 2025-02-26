"use client";
import {
  PagerComponent,
  PagerPageComponent,
  PagerSwitchComponent,
  PagerPrevSwitchComponent,
  PagerNextSwitchComponent,
} from "@lisn.js/react";
import "lisn.js/pager-slider.css";

import Image from "next/image";

import styles from "./demo.module.css";

export default function Page() {
  return (
    <>
      <div className={styles.wrapper}>
        <PagerComponent
          className={styles.demo}
          config={{ horizontal: true, parallax: true, useGestures: false }}
        >
          <div className={styles.switches} data-switches="prev-next">
            <PagerPrevSwitchComponent
              className={styles.switch}
              data-switch="prev"
              aria-label="Previous"
            ></PagerPrevSwitchComponent>
            <PagerNextSwitchComponent
              className={styles.switch}
              data-switch="next"
              aria-label="Next"
            ></PagerNextSwitchComponent>
          </div>

          <div className={styles.switches} data-switches="select">
            <PagerSwitchComponent
              className={styles.switch}
              aria-label="Page 1"
            ></PagerSwitchComponent>
            <PagerSwitchComponent
              className={styles.switch}
              aria-label="Page 2"
            ></PagerSwitchComponent>
            <PagerSwitchComponent
              className={styles.switch}
              aria-label="Page 3"
            ></PagerSwitchComponent>
            <PagerSwitchComponent
              className={styles.switch}
              aria-label="Page 4"
            ></PagerSwitchComponent>
          </div>

          <div className={styles.pages}>
            <PagerPageComponent>
              {/* https://unsplash.com/photos/a-close-up-of-a-red-and-black-substance-OOFSqPWjCt0 */}
              <Image
                className={styles.background}
                src="/images/abstract-1.jpg"
                alt=""
              />
            </PagerPageComponent>

            <PagerPageComponent>
              {/* https://unsplash.com/photos/a-very-long-line-of-yellow-lines-on-a-black-background-YeUVDKZWSZ4 */}
              <Image
                className={styles.background}
                src="/images/abstract-2.jpg"
                alt=""
              />
            </PagerPageComponent>

            <PagerPageComponent>
              {/* https://unsplash.com/photos/purple-black-and-orange-abstract-paintin-arwTpnIUHdM */}
              <Image
                className={styles.background}
                src="/images/abstract-3.jpg"
                alt=""
              />
            </PagerPageComponent>

            <PagerPageComponent>
              {/* https://unsplash.com/photos/a-purple-and-green-abstract-background-with-lots-of-lines-pEgsWN0kwbQ */}
              <Image
                className={styles.background}
                src="/images/abstract-4.jpg"
                alt=""
              />
            </PagerPageComponent>
          </div>
        </PagerComponent>
      </div>
    </>
  );
}
