"use client";
import { useEffect, useRef } from "react";

import { GestureWatcher } from "lisn.js";

import Image from "@lib/Image";
import Link from "@lib/Link";

import styles from "./demo.module.css";

export default function Page() {
  const demoRef = useRef(null);

  useEffect(() => {
    const watcher = GestureWatcher.reuse();
    const main = demoRef.current;
    if (main) {
      watcher.trackGesture(main, null, {
        minTotalDeltaY: 0,
        maxTotalDeltaY: 960,
        minTotalDeltaZ: 1,
        maxTotalDeltaZ: 2.4,
      });
    }

    return () => {
      // cleanup
      if (main) {
        watcher.noTrackGesture(main);
      }
    };
  }, []);

  return (
    <>
      <div ref={demoRef} className={[styles.demo, "light-theme"].join(" ")}>
        <h1>Scroll or zoom</h1>

        <div className={styles.plane} data-plane="5">
          <Image
            className={styles.background}
            src="/images/landscape-5.png"
            alt=""
          />
        </div>

        <div className={styles.plane} data-plane="4">
          <Image
            className={styles.background}
            src="/images/landscape-4.png"
            alt=""
          />
        </div>

        <div className={styles.plane} data-plane="3">
          <div className={styles.spacer}></div>
          <Image
            className={styles.background}
            src="/images/landscape-3.png"
            alt=""
          />
        </div>

        <div className={styles.plane} data-plane="2">
          <div className={styles.spacer}></div>
          <Image
            className={styles.background}
            src="/images/landscape-2.png"
            alt=""
          />
        </div>

        <div className={styles.plane} data-plane="1">
          <div className={styles.spacer}></div>
          <Image
            className={styles.background}
            src="/images/landscape-1.png"
            alt=""
          />
        </div>
      </div>

      <div className={styles.license}>
        Image by{" "}
        <Link href="http://www.freepik.com/" target="_blank">
          Freepik
        </Link>
      </div>
    </>
  );
}
