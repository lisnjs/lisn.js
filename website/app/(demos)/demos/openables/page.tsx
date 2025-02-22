import path from "path";

import type { Metadata } from "next";

import { fetchCodeCollections } from "@lib/fetchCodeCollections";
import DemoHeader from "@lib/DemoHeader";
import Demo from "./demo";

export const metadata: Metadata = { title: "Openables" };

// https://github.com/vercel/next.js/issues/60879
const dirname =
  import.meta.dirname ?? path.dirname(new URL(import.meta.url).pathname);

export default async function Page() {
  const collections = await fetchCodeCollections(dirname, {
    react: {
      name: "StackBlitz",
      url: "https://stackblitz.com/edit/vitejs-vite-koohz4tb?file=src%2FApp.tsx",
    },
    next: {
      name: "StackBlitz",
      url: "https://stackblitz.com/edit/stackblitz-starters-nohuatdg?file=app%2Fpage.tsx",
    },
    jsApi: {
      name: "CodePen",
      url: "https://codepen.io/AaylaSecura/pen/zxYvzRg",
    },
    htmlApi: {
      name: "CodePen",
      url: "https://codepen.io/AaylaSecura/pen/QwWbXNm",
    },
  });

  return (
    <>
      <DemoHeader collections={collections} />
      <Demo />
    </>
  );
}
