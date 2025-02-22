"use client";
import { useEffect, useRef, ReactNode } from "react";

import {
  ScrollWatcher,
  ViewWatcher,
  ScrollTrigger,
  ScrollData,
  Hide,
  Show,
  Enable,
} from "lisn.js";
import {
  useScrollbar,
  CollapsibleComponent,
  CollapsibleTriggerComponent,
  PopupComponent,
  PopupTriggerComponent,
  ModalComponent,
  OffcanvasComponent,
  ScrollToTopComponent,
  OffcanvasComponentRef,
  ModalComponentRef,
} from "@lisn.js/react";

// import "lisn.js/collapsible.css";
// import "lisn.js/popup.css";
// import "lisn.js/modal.css";
// import "lisn.js/offcanvas.css";
// import "lisn.js/scrollbar.css";
// import "lisn.js/scroll-to-top.css";
// ^^ Or we could just import "lisn.js/lisn.css" which contains all CSS
import "lisn.js/lisn.css";

import styles from "./demo.module.css";

export default function Page() {
  useScrollbar();

  return (
    <>
      <ScrollToTopComponent />
      <DemoMenu />
      <DemoModal />

      <div className={styles.demo}>
        <DemoIntro />

        {/* blank page for spacing */}
        <div className={styles.section}></div>

        <div
          className={[styles.section, styles.top, styles.accordion].join(" ")}
        >
          <h1 className={styles.huge}>Why LISN?</h1>
          <CollapsibleComponent config={{ peek: "75px" }}>
            <DemoAccordion title="Lightweight.">
              <p>Vanilla TypeScript</p>
              <p>Highly optimized</p>
              <DemoTooltip title="No layout thrashing">
                Correct use of <code>requestAnimationFrame</code> to completely
                eliminate forced re-layouts and run smoothly even on mobile
                devices.
              </DemoTooltip>
            </DemoAccordion>

            <DemoAccordion title="Interactive.">
              <p>Powerful API</p>
              <DemoTooltip title="Multi gesture support">
                Take actions based on user gestures. Scroll, zoom or drag, using
                wheel, touch or pointer device? Any or all of these.
              </DemoTooltip>
              <p>Mobile/touch ready</p>
            </DemoAccordion>

            <DemoAccordion title="Simple.">
              <p>Intuitive syntax</p>
              <p>Consistent API</p>
              <DemoTooltip title="HTML-only mode">
                The HTML-only API can do much of what the full JavaScript API
                can.
              </DemoTooltip>
            </DemoAccordion>

            <DemoAccordion title="No-nonsense.">
              <p>What says on the box</p>
              <DemoTooltip title="Sensible defaults">
                Spend time building your site, not configuring LISN.
              </DemoTooltip>
              <DemoTooltip title="Highly customizable">
                But if you want to tweak... go wild.
              </DemoTooltip>
            </DemoAccordion>
          </CollapsibleComponent>

          {/* trigger will be wrapped and we set the class on the wrapper */}
          <CollapsibleTriggerComponent config={{ className: styles.trigger }}>
            <h5 className={styles.more}>~~ View more ~~</h5>
            <h5 className={styles.less}>~~ View less ~~</h5>
          </CollapsibleTriggerComponent>
        </div>
      </div>
    </>
  );
}

const DemoMenu = () => {
  const menuWidgetRef = useRef<OffcanvasComponentRef>(null);

  useEffect(() => {
    // open/close menu on scroll up/down
    const watcher = ScrollWatcher.reuse();
    const handler = (t: EventTarget, scrollData: ScrollData) => {
      const widget = menuWidgetRef.current?.getWidget();
      if (widget) {
        if (scrollData.direction === "up") {
          widget.open();
        } else if (scrollData.direction === "down") {
          widget.close();
        }
      }
    };

    watcher.onScroll(handler);

    return () => {
      // cleanup
      watcher.offScroll(handler);
    };
  }, []);

  {
    /* Remember, openable components, if not explicitly passed a map/array of
     * triggers, will try to automatically find triggers in the parent element.
     * So either:
     * - wrap it in it own element,
     * - explicitly pass triggers (in this case we want an empty array since it
     *   will be opened by the view watcher) or
     * - explicitly pass contentId
     */
  }
  return (
    <OffcanvasComponent
      className={styles.menu}
      config={{ position: "top", closeButton: false, triggers: [] }}
      widgetRef={menuWidgetRef}
    >
      <a href="/demos" target="_blank">
        More demos
      </a>
      <a href="/#get-started" target="_blank">
        Getting started
      </a>
      <a href="https://github.com/lisnjs/lisn.js" target="_blank">
        Source code
      </a>
    </OffcanvasComponent>
  );
};

const DemoModal = () => {
  const modalWidgetRef = useRef<ModalComponentRef>(null);

  useEffect(() => {
    // show modal when scrolled to the middle of the page
    const watcher = ViewWatcher.create({ rootMargin: "-48% 0px" });
    const target = "top: 50%";
    const handler = () => {
      const widget = modalWidgetRef.current?.getWidget();
      widget?.open();
      watcher.offView(target, handler); // just once
    };
    watcher.onView(target, handler, { views: "at" });

    return () => {
      // cleanup
      watcher.offView(target, handler);
    };
  }, []);

  {
    /* Remember, openable components, if not explicitly passed a map/array of
     * triggers, will try to automatically find triggers in the parent element.
     * So either:
     * - wrap it in it own element,
     * - explicitly pass triggers (in this case we want an empty array since it
     *   will be opened by the view watcher) or
     * - explicitly pass contentId
     */
  }
  return (
    <ModalComponent
      className={styles.modal}
      widgetRef={modalWidgetRef}
      config={{ triggers: [] }}
    >
      You&apos;ve reached the middle of the page. Are you liking LISN already?
    </ModalComponent>
  );
};

const DemoIntro = () => {
  const msg1Ref = useRef(null);
  const msg2Ref = useRef(null);

  useEffect(() => {
    // Show/hide scroll instruction messages
    const msg1 = msg1Ref.current;
    const msg2 = msg2Ref.current;
    const triggers: ScrollTrigger[] = [];
    if (msg1 && msg2) {
      // On scroll up, hide the "Scroll up" message and shortly after enable
      // the trigger on the other message
      triggers.push(
        new ScrollTrigger(msg1, [new Hide(msg1)], {
          directions: "up",
          once: true,
        }),
      );

      triggers.push(
        new ScrollTrigger(
          msg2,
          [new Show(msg2), new Enable(msg2, "hide on down")],
          {
            directions: "up",
            once: true,
            delay: 300,
          },
        ),
      );

      // Logically, we would use Hide on direction down, but this will set the
      // initial state of the element to be shown, so we reverse the logic.
      triggers.push(
        new ScrollTrigger(msg2, [new Show(msg2)], {
          directions: "up",
          once: true,
          id: "hide on down",
        }),
      );
    }

    return () => {
      // cleanup
      for (const trigger of triggers) {
        trigger.destroy();
      }
    };
  }, []);

  return (
    <>
      <div className={styles.section}>
        <p className="text-center">
          This demo includes all four types of openables with several types of
          triggers for opening them.
        </p>
        <h2>Scroll down.</h2>
      </div>

      <div className={styles.section}>
        <h2 ref={msg2Ref} className="lisn-hide">
          Now keep going down.
        </h2>
        <div className={styles.spacer}></div>
        <h2 ref={msg1Ref} className="lisn-hide">
          Then scroll up a bit.
        </h2>
      </div>
    </>
  );
};

const DemoAccordion = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <div>
      <CollapsibleTriggerComponent
        as="h4"
        className={styles.trigger}
        config={{
          icon: "left",
          iconClosed: "plus",
          iconOpen: "minus",
        }}
      >
        {title}
      </CollapsibleTriggerComponent>

      <CollapsibleComponent
        className={styles.content}
        config={{ autoClose: true }}
      >
        {children}
      </CollapsibleComponent>
    </div>
  );
};

const DemoTooltip = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <div>
      <PopupTriggerComponent
        as="p"
        className={styles.tooltip}
        config={{ hover: true }}
      >
        {title}
      </PopupTriggerComponent>
      <PopupComponent className={styles.popup} config={{ position: "top" }}>
        {children}
      </PopupComponent>
    </div>
  );
};
