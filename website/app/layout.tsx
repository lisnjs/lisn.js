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
};

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

import "@app/global.css";

export default function Layout({ children }) {
  return (
    <ThemedRoot className={[roboto.className, "lisn-hide-scroll"].join(" ")}>
      {children}
    </ThemedRoot>
  );
}
