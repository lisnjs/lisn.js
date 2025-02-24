"use client";
import { ReactNode } from "react";

import styles from "./demo.module.css";

export type DemoFooterProps = {
  className?: string;
  children?: ReactNode;
};

export const DemoFooter = ({ children, className = "" }: DemoFooterProps) => {
  return (
    children && (
      <footer className={className}>
        <div className={styles.footer}>{children}</div>
      </footer>
    )
  );
};

export default DemoFooter;
