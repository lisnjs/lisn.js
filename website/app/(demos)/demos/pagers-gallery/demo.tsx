"use client";
import { useRef, useEffect } from "react";

import {
  useScrollbar,
  PagerComponent,
  PagerPageComponent,
  PagerSwitchComponent,
  PagerComponentRef,
} from "@lisn.js/react";
import "lisn.js/pager.css";
import "lisn.js/scrollbar.css";

import Image from "next/image";

import styles from "./demo.module.css";

const images = Array.from(
  { length: 8 },
  (e, i) => `https://picsum.photos/600/300?p=${i}`,
);

export default function Page() {
  useScrollbar({ useHandle: true });

  const mainPagerRef = useRef<PagerComponentRef>(null);
  const thumbPagerRef = useRef<PagerComponentRef>(null);

  useEffect(() => {
    const mainPager = mainPagerRef.current?.getWidget();
    const thumbPager = thumbPagerRef.current?.getWidget();
    if (mainPager && thumbPager) {
      thumbPager.onTransition(() =>
        mainPager.goToPage(thumbPager.getCurrentPageNum()),
      );
    }
  }, []);

  return (
    <>
      <div className={styles.wrapper}>
        <PagerComponent
          widgetRef={mainPagerRef}
          className={styles.preview}
          config={{ style: "tabs", useGestures: false }}
        >
          {
            // the array is constant so we can use idx as the key
            images.map((url, idx) => {
              return (
                <PagerPageComponent key={idx}>
                  <Image src={url} alt="" />
                </PagerPageComponent>
              );
            })
          }
        </PagerComponent>

        <PagerComponent
          className={styles.slider}
          widgetRef={thumbPagerRef}
          config={{
            style: "carousel",
            peek: true,
            pageSize: 150,
            horizontal: true,
            parallax: true,
            useGestures: "wheel,touch",
          }}
        >
          {
            // the array is constant so we can use idx as the key
            images.map((url, idx) => {
              return (
                <PagerPageComponent key={idx}>
                  <PagerSwitchComponent>
                    <Image src={url} alt="" />
                  </PagerSwitchComponent>
                </PagerPageComponent>
              );
            })
          }
        </PagerComponent>
      </div>
    </>
  );
}
