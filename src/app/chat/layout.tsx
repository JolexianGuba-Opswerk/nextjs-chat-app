import SideBar from "../../components/chat/sidebar/SideBar";
import RightSideBar from "../../components/chat/sidebar/RightSideBar";
import NotificationListener from "./NotificationListener";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <NotificationListener />
      <SideBar />
      <main className="flex-1">{children}</main>
      <RightSideBar />
    </div>
  );
}
