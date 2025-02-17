"use client";
import { useEffect } from "react";

import { SizeWatcher } from "lisn.js";
import { PagerComponent, PagerPageComponent } from "@lisn.js/react";
import "lisn.js/pager.css";

import Image from "@lib/Image";

import styles from "./demo.module.css";

export default function Page() {
  // Track the size of the pager (or equivalently, and for simplicity, in this
  // case, we'll track the window size since the pager is full screen), so that
  // we can calculate transforms for several elements.
  useEffect(() => {
    const watcher = SizeWatcher.reuse();
    watcher.trackSize(null, { threshold: 0 });
    return () => {
      // cleanup
      watcher.noTrackSize();
    };
  }, []);

  return (
    <>
      <div className={[styles.wrapper, "light-theme"].join(" ")}>
        <PagerComponent className={styles.demo} config={{ fullscreen: true }}>
          {/* https://www.pexels.com/photo/yellow-black-and-purple-colored-papers-2457284/ */}
          <PagerPageComponent className={styles.page} data-slide="intro">
            <h1>Scroll down (or swipe/drag up)</h1>
          </PagerPageComponent>

          <PagerPageComponent className={styles.page} data-slide="think">
            <Image
              className={styles.background}
              src="/images/pager-think.png"
              alt=""
            />
            <h1>Think</h1>
          </PagerPageComponent>

          <PagerPageComponent className={styles.page} data-slide="outside">
            <Image
              className={styles.background}
              src="/images/pager-outside.png"
              alt=""
            />
            <h1>Outside</h1>
          </PagerPageComponent>

          <PagerPageComponent className={styles.page} data-slide="the">
            <Image
              className={styles.background}
              src="/images/pager-the.png"
              alt=""
            />
            <h1>The</h1>
          </PagerPageComponent>

          <PagerPageComponent className={styles.page} data-slide="page">
            <Image
              className={styles.background}
              src="/images/pager-page.png"
              alt=""
            />
            <h1>Page.</h1>
          </PagerPageComponent>
        </PagerComponent>
      </div>
    </>
  );
}
