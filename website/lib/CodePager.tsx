"use client";
import { useRef, ComponentPropsWithRef } from "react";

import {
  PagerComponent,
  PagerPageComponent,
  PagerSwitchComponent,
} from "@lisn.js/react";

import { useHighlightJs } from "./useHighlightJs";

import styles from "./code-pager.module.css";

export type CodePagerProps = {
  tabNames: string[];
  multiBlocks?: boolean;
  fixedHeight?: boolean;
} & ComponentPropsWithRef<"div">;

export const CodePagerPage = ({
  children,
  className = "",
  ...props
}: ComponentPropsWithRef<"div">) => {
  return (
    <PagerPageComponent
      className={[className, styles.page].join(" ")}
      {...props}
    >
      {children}
    </PagerPageComponent>
  );
};

export const CodePager = ({
  children,
  tabNames,
  multiBlocks = false,
  fixedHeight = false,
  className = "",
  ...props
}: CodePagerProps) => {
  const ref = useRef(null);
  useHighlightJs(ref);

  const tabs = tabNames.map((t) => {
    return (
      <PagerSwitchComponent as="button" key={t} className={styles.tab}>
        {t}
      </PagerSwitchComponent>
    );
  });

  return (
    <>
      <PagerComponent
        className={[
          className,
          styles.pager,
          multiBlocks ? styles.multi : "",
          fixedHeight ? styles.fixedH : "",
        ].join(" ")}
        config={{ useGestures: false }}
        {...props}
      >
        <div className={styles.tabs}>{tabs}</div>
        <div ref={ref} className={styles.pages}>
          {children}
        </div>
      </PagerComponent>
    </>
  );
};

export default CodePager;
