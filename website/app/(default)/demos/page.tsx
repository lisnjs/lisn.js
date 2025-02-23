import type { Metadata } from "next";

import Link from "@lib/Link";
import Section from "@lib/Section";

export const metadata: Metadata = { title: "Demos" };

export default function Page() {
  return (
    <>
      <Section>
        <p className="text-center">
          To view the code of each demo in various formats click "View code" on
          the top of each demo page.
        </p>
        <p className="text-center">
          The demos are available to view also on{" "}
          <Link
            href="https://codepen.io/collection/qBOjZa?grid_type=list"
            external={true}
          >
            CodePen
          </Link>{" "}
          and{" "}
          <Link
            href="https://stackblitz.com/@AaylaSecura/collections/lisn-js"
            external={true}
          >
            StackBlitz
          </Link>
        </p>

        <div className="hrule"></div>

        <ul className="fit center">
          <li>
            <Link href="openables" external={true}>
              Openables: popup, modal, offcanvas, collapsible
            </Link>
          </li>

          <li>
            <Link href="sortable" external={true}>
              Sortable: a puzzle game
            </Link>
          </li>

          <li>
            <Link href="pager-unconventional" external={true}>
              An unconventional pager
            </Link>
          </li>

          <li>
            <Link href="pager-slider" external={true}>
              Slider pager
            </Link>
          </li>

          <li>
            <Link href="pager-carousel" external={true}>
              Carousel pager
            </Link>
          </li>

          <li>
            <Link href="pager-tabs" external={true}>
              Tabbed pager
            </Link>
          </li>

          <li>
            <Link href="scrollbar" external={true}>
              Custom scrollbar: progress bar
            </Link>
          </li>

          <li>
            <Link href="scrollbar-handles" external={true}>
              Custom scrollbar: traditional handles
            </Link>
          </li>

          <li>
            <Link href="view-trigger" external={true}>
              View trigger: implementing scroll sections
            </Link>
          </li>

          <li>
            <Link href="track-gesture" external={true}>
              Track scroll/zoom gestures: full page parallax effect
            </Link>
          </li>

          <li>
            <Link href="track-scroll" external={true}>
              Track scroll offset: background effect
            </Link>
          </li>

          <li>
            <Link href="track-view" external={true}>
              Track view: parallax effect
            </Link>
          </li>

          <li>
            <Link href="layout-trigger" external={true}>
              Layout trigger
            </Link>
          </li>
        </ul>
      </Section>
    </>
  );
}
