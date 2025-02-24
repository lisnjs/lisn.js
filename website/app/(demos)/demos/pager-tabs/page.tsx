import path from "path";

import type { Metadata } from "next";

import { fetchCodeCollections } from "@lib/fetchCodeCollections";
import DemoHeader from "@lib/DemoHeader";
import DemoFooter from "@lib/DemoFooter";
import Demo from "./demo";

export const metadata: Metadata = { title: "Tabbed pager" };

// https://github.com/vercel/next.js/issues/60879
const dirname =
  import.meta.dirname ?? path.dirname(new URL(import.meta.url).pathname);

export default async function Page() {
  const collections = await fetchCodeCollections(dirname, {
    react: {
      name: "StackBlitz",
      url: "https://stackblitz.com/edit/lisnjs-demo-pager-tabs-react?file=src%2FApp.tsx",
    },
    jsApi: {
      name: "CodePen",
      url: "https://codepen.io/AaylaSecura/pen/vEYKLMJ",
    },
    htmlApi: {
      name: "CodePen",
      url: "https://codepen.io/AaylaSecura/pen/RNwRrOL?editors=1100",
    },
  });

  return (
    <>
      <DemoHeader collections={collections} />
      <Demo />
      <DemoFooter />
    </>
  );
}
