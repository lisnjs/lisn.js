import { ReactNode } from "react";

import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import ThemedRoot from "@lib/ThemedRoot";

import lisnPkgJson from "lisn.js/package.json";

export const metadata: Metadata = {
  title: {
    template: "%s | LISN.js",
    default: "LISN.js",
  },
  description:
    "Lightweight and simple. Powerful and flexible. LISN handles all complexities so you can simply handle user gestures, actions and events.",
  keywords: lisnPkgJson.keywords,
  openGraph: {
    title: "LISN.js",
    description:
      "Lightweight and simple. Powerful and flexible. LISN handles all complexities so you can simply handle user gestures, actions and events.",
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
