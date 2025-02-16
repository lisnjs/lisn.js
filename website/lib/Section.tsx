import { ComponentPropsWithRef } from "react";

import styles from "./section.module.css";

export type SectionProps = {
  opaque?: boolean;
  shadow?: boolean; // default true if opaque, otherwise false
  fullWidth?: boolean;
  textCenter?: boolean;
} & ComponentPropsWithRef<"div">;

export const Section = ({
  children,
  opaque = false,
  shadow = null,
  fullWidth = false,
  textCenter = false,
  className = "",
  ...props
}: SectionProps) => {
  shadow = shadow ?? opaque;
  return (
    <section
      className={[
        className,
        styles.section,
        opaque ? styles.opaque : "",
        shadow ? styles.shadow : "",
      ].join(" ")}
      {...props}
    >
      <div
        className={[
          styles.content,
          fullWidth ? styles.wide : "",
          textCenter ? "text-center" : "",
        ].join(" ")}
      >
        {children}
      </div>
    </section>
  );
};

export default Section;
