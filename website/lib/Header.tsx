"use client";
import { usePathname } from "next/navigation";

import styles from "./header.module.css";

import GitHubLogo from "./GitHubLogo";
import Image from "./Image";
import Link from "./Link";

export const Header = ({ className = "" }) => {
  const pathname = usePathname();

  return (
    <header className={className}>
      <div className={styles.header}>
        <div className={styles.version}>
          <Image
            alt="Latest version"
            src="https://img.shields.io/npm/v/lisn.js?style=flat-square&labelColor=%232e2e4c&color=%232e2e4c&label=version%3A"
            unoptimized={true}
          />

          <Image
            alt="Release date"
            src="https://img.shields.io/npm/last-update/lisn.js?style=flat-square&labelColor=%232e2e4c&color=%232e2e4c&label=%7C"
            unoptimized={true}
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
