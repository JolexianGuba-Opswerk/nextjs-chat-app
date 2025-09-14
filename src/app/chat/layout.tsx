import SideBar from "../../components/chat/sidebar/SideBar";
import RightSideBar from "../../components/chat/sidebar/RightSideBar";

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
