"use client";
import { useEffect, useRef } from "react";

import { ViewWatcher } from "lisn.js";

import Image from "next/image";

import styles from "./demo.module.css";

export default function Page() {
  const demoRef = useRef(null);
  const sectionRefs = useRef(new Set<Element>());

  const addSectionRef = (section: Element | null) => {
    if (section) {
      sectionRefs.current.add(section);
    }
  };

  useEffect(() => {
    let watcher: ViewWatcher;
    const main = demoRef.current;
    const sections = [...sectionRefs.current];

    if (main) {
      watcher = ViewWatcher.create({
        root: main,
        rootMargin: "200px",
      });

      for (const section of sections) {
        watcher.trackView(section, null, {
          debounceWindow: 0,
          resizeThreshold: 0,
          scrollThreshold: 0,
        });
      }
    }

    return () => {
      // cleanup
      for (const section of sections) {
        watcher.noTrackView(section);
      }
    };
  }, []);

  return (
    <>
      <div className={styles.wrapper}>
        <div ref={demoRef} className={[styles.demo, "light-theme"].join(" ")}>
          <div ref={addSectionRef} className={styles.section}>
            {/* https://unsplash.com/photos/a-close-up-of-a-red-and-black-substance-OOFSqPWjCt0 */}
            <div className={styles.background}>
              <Image src="/images/abstract-1.jpg" alt="" />
            </div>

            <div className={styles.content}>
              <div className={styles.card}>
                <h1>Lean</h1>
              </div>
            </div>
          </div>

          <div ref={addSectionRef} className={styles.section}>
            {/* https://unsplash.com/photos/a-purple-and-green-abstract-background-with-lots-of-lines-pEgsWN0kwbQ */}
            <div className={styles.background}>
              <Image src="/images/abstract-4.jpg" alt="" />
            </div>

            <div className={styles.content}>
              <div className={styles.card}>
                <h1>Ingenious</h1>
              </div>
            </div>
          </div>

          <div ref={addSectionRef} className={styles.section}>
            {/* https://unsplash.com/photos/purple-black-and-orange-abstract-paintin-arwTpnIUHdM */}
            <div className={styles.background}>
              <Image src="/images/abstract-3.jpg" alt="" />
            </div>

            <div className={styles.content}>
              <div className={styles.card}>
                <h1>Skillful</h1>
              </div>
            </div>
          </div>

          <div ref={addSectionRef} className={styles.section}>
            {/* https://unsplash.com/photos/a-very-long-line-of-yellow-lines-on-a-black-background-YeUVDKZWSZ4 */}
            <div className={styles.background}>
              <Image src="/images/abstract-2.jpg" alt="" />
            </div>

            <div className={styles.content}>
              <div className={styles.card}>
                <h1>Natty</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
