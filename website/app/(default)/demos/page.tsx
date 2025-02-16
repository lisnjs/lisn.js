import type { Metadata } from "next";

import Link from "@lib/Link";
import Section from "@lib/Section";

export const metadata: Metadata = { title: "Demos" };

export default function Page() {
  return (
    <>
      <Section>
        <p className="text-center">
          Note: to view the code of each demo in various formats click "View
          code" on the top of each demo page.
        </p>
        <ul className="fit center">
          <li>
            <Link href="openables" target="_blank">
              Openables: popup, modal, offcanvas, collapsible
            </Link>
          </li>

          <li>
            <Link href="sortable" target="_blank">
              Sortable: a puzzle game
            </Link>
          </li>

          <li>
            <Link href="pager-unconventional" target="_blank">
              An unconventional pager
            </Link>
          </li>

          <li>
            <Link href="pager-slider" target="_blank">
              Slider pager
            </Link>
          </li>

          <li>
            <Link href="pager-carousel" target="_blank">
              Carousel pager
            </Link>
          </li>

          <li>
            <Link href="pager-tabs" target="_blank">
              Tabbed pager
            </Link>
          </li>

          <li>
            <Link href="scrollbar" target="_blank">
              Custom scrollbar: progress bar
            </Link>
          </li>

          <li>
            <Link href="scrollbar-handles" target="_blank">
              Custom scrollbar: traditional handles
            </Link>
          </li>

          <li>
            <Link href="view-trigger" target="_blank">
              View trigger: implementing scroll sections
            </Link>
          </li>

          <li>
            <Link href="track-gesture" target="_blank">
              Track scroll/zoom gestures: full page parallax effect
            </Link>
          </li>

          <li>
            <Link href="track-scroll" target="_blank">
              Track scroll offset: background effect
            </Link>
          </li>

          <li>
            <Link href="track-view" target="_blank">
              Track view: parallax effect
            </Link>
          </li>

          <li>
            <Link href="layout-trigger" target="_blank">
              Layout trigger
            </Link>
          </li>
        </ul>
      </Section>
    </>
  );
}
