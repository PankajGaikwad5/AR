import InBrowserViewer from "./InBrowserViewer";

export const metadata = {
  title: "In-Browser AI/AR Experience",
  description: "Experimental In-Browser AR and AI Generator",
};

export default function InBrowserPage() {
  return (
    <main className="w-screen h-[100dvh] overflow-hidden bg-black m-0 p-0">
      <InBrowserViewer />
    </main>
  );
}
