"use client";
import { usePathname } from "next/navigation";

import styles from "./header.module.css";

import Badge from "./Badge";
import GitHubCorner from "./GitHubCorner";
import Link from "./Link";

export const Header = ({ className = "" }) => {
  const pathname = usePathname();

  return (
    <header className={className}>
      <Link
        className={styles.github}
        href="https://github.com/lisnjs/lisn.js"
        target="_blank"
      >
        <GitHubCorner />
      </Link>

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
          <Link href={(pathname === "/" ? "" : "/") + "#quick-start"}>
            Quick start
          </Link>
          <Link href="/demos">Demos</Link>
          <Link href="/docs" external={true}>
            Docs
          </Link>
          <Link href="/changelog" external={true}>
            Changelog
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
