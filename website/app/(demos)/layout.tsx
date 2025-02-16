import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Demos | LISN.js",
    default: "Demos | LISN.js",
  },
};

export default function Layout({ children }) {
  return children;
}
