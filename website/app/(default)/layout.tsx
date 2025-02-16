import Header from "@lib/Header";
import MainScrollbar from "@lib/MainScrollbar";

export default function Layout({ children }) {
  return (
    <>
      <MainScrollbar />
      <Header />
      <main>{children}</main>
    </>
  );
}
