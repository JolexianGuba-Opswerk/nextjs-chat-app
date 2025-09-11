import SideBar from "./components/sidebar/SideBar";
import RightSideBar from "./components/sidebar/RightSideBar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <SideBar />
      <main className="flex-1">{children}</main>
      <RightSideBar />
    </div>
  );
}
