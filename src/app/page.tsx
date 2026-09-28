import ArViewer from "./ArViewer";

export const metadata = {
  title: "3D AR Viewer",
  description: "Fullscreen 3D AR Viewer",
};

export default function Home() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-black m-0 p-0">
      <ArViewer />
    </main>
  );
}
