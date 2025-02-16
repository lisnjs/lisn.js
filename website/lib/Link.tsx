import { ComponentProps } from "react";
import NextLink from "next/link";

import styles from "./link.module.css";

export const ExternalLinkIcon = ({
  size = 10,
  color = "var(--text-color)",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 10 10"
      className={styles.external}
    >
      <path
        fill={color}
        d="M9.02,5.91c0-.26.21-.47.47-.47s.47.21.47.47v2.7c0,.38-.16.73-.41.98s-.6.41-.99.41H1.4c-.38,0-.73-.16-.99-.41-.25-.25-.41-.6-.41-.98V1.4c0-.38.16-.73.41-.98C.66.16,1.01,0,1.4,0h2.69c.26,0,.47.21.47.47s-.21.47-.47.47H1.4c-.12,0-.24.05-.32.13-.08.08-.13.19-.13.32v7.21c0,.12.05.24.13.32.08.08.19.13.32.13h7.17c.12,0,.24-.05.32-.13s.13-.19.13-.32v-2.7h0ZM9.17,1.42l-4.76,4.81c-.18.18-.48.19-.67,0s-.19-.48,0-.66L8.31.95h-1.91c-.26,0-.47-.21-.47-.47S6.15,0,6.41,0h2.16c.42,0,.96-.07,1.28.25.2.2.16,1.83.13,2.78,0,.24-.01.43-.01.56,0,.26-.21.47-.47.47s-.47-.21-.47-.47c0-.03,0-.27.02-.59.01-.49.09-1.14.13-1.59h0Z"
      />
    </svg>
  );
};

export type LinkProps = { external?: boolean } & ComponentProps<
  typeof NextLink
>;

export const Link = ({ children, external = false, ...props }: LinkProps) => {
  return (
    <NextLink target={external ? "_blank" : "_self"} {...props}>
      {children}
      {external && <ExternalLinkIcon />}
    </NextLink>
  );
};

export default Link;
