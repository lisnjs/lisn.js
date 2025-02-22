"use client";
import {
  PagerComponent,
  PagerPageComponent,
  PagerSwitchComponent,
} from "@lisn.js/react";
// Don't load the default pager CSS otherwise we'd have to override quite a few
// properties. We need to set custom style for everything anyway.
// import "lisn.js/pager.css";

import Image from "next/image";

import styles from "./demo.module.css";

export default function Page() {
  return (
    <>
      <div className={styles.wrapper}>
        <PagerComponent className={styles.demo} config={{ useGestures: false }}>
          <div className={styles.tabs}>
            <PagerSwitchComponent className={styles.tab}>
              Limitless
            </PagerSwitchComponent>
            <PagerSwitchComponent className={styles.tab}>
              Imaginative
            </PagerSwitchComponent>
            <PagerSwitchComponent className={styles.tab}>
              Sleek
            </PagerSwitchComponent>
            <PagerSwitchComponent className={styles.tab}>
              Neoteric
            </PagerSwitchComponent>
          </div>

          <div className={styles.pages}>
            <PagerPageComponent className={styles.page}>
              {/* https://unsplash.com/photos/a-purple-and-green-abstract-background-with-lots-of-lines-pEgsWN0kwbQ */}
              <Image
                className={styles.background}
                src="/images/abstract-4.jpg"
                alt=""
              />
            </PagerPageComponent>

            <PagerPageComponent className={styles.page}>
              {/* https://unsplash.com/photos/purple-black-and-orange-abstract-paintin-arwTpnIUHdM */}
              <Image
                className={styles.background}
                src="/images/abstract-3.jpg"
                alt=""
              />
            </PagerPageComponent>

            <PagerPageComponent className={styles.page}>
              {/* https://unsplash.com/photos/a-very-long-line-of-yellow-lines-on-a-black-background-YeUVDKZWSZ4 */}
              <Image
                className={styles.background}
                src="/images/abstract-2.jpg"
                alt=""
              />
            </PagerPageComponent>

            <PagerPageComponent className={styles.page}>
              {/* https://unsplash.com/photos/a-close-up-of-a-red-and-black-substance-OOFSqPWjCt0 */}
              <Image
                className={styles.background}
                src="/images/abstract-1.jpg"
                alt=""
              />
            </PagerPageComponent>
          </div>
        </PagerComponent>
      </div>
    </>
  );
}
