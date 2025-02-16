"use client";
import { usePathname } from "next/navigation";

import styles from "./header.module.css";

import Badge from "./Badge";
import GitHubLogo from "./GitHubLogo";
import Link from "./Link";

export const Header = ({ className = "" }) => {
  const pathname = usePathname();

  return (
    <header className={className}>
      <div className={styles.header}>
        <div className={styles.version}>
          <Badge
            label="Latest version"
            path="npm/v/lisn.js"
            extra="label=version%3A"
          />
          <Badge
            label="Release date"
            path="npm/last-update/lisn.js"
            extra="label=%7C"
          />
        </div>

        <div className={styles.links}>
          <Link href={(pathname === "/" ? "" : "/") + "#get-started"}>
            Get started
          </Link>
          <Link href="/demos">Demos</Link>
          <Link href="/docs" external={true}>
            Docs
          </Link>
          <Link href="/changelog" external={true}>
            Changelog
          </Link>
          <Link href="https://github.com/lisnjs/lisn.js" target="_blank">
            <GitHubLogo />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
