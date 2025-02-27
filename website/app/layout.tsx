import { ReactNode } from "react";

import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import ThemedRoot from "@lib/ThemedRoot";

import lisnPkgJson from "lisn.js/package.json";

const description =
  "Lightweight, easy-to use and powerful library for handling user gestures, actions and events. Includes widgets: collapsible, popup, modal, offcanvas menu, carousel, slider, tabbed pager, custom scrollbars, sortable, scroll-to-top button, page loader.";

export const metadata: Metadata = {
  title: {
    template: "%s | LISN.js",
    default: "LISN.js",
  },
  description,
  keywords: lisnPkgJson.keywords,
  openGraph: {
    title: "LISN.js",
    description,
    url: "https://lisnjs.github.io/",
    siteName: "LISN.js",
    images: [
      {
        url: "https://lisnjs.github.io/cover.jpg",
        width: 1200,
        height: 600,
        alt: "LISN.js preview image",
      },
    ],
    type: "website",
  },
};

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

import "@app/global.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ThemedRoot className={[roboto.className, "lisn-hide-scroll"].join(" ")}>
      {children}
    </ThemedRoot>
  );
}
