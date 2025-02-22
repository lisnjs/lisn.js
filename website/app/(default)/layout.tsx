import { ReactNode } from "react";

import Header from "@lib/Header";
import MainScrollbar from "@lib/MainScrollbar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <MainScrollbar />
      <Header />
      <main>{children}</main>
    </>
  );
}
