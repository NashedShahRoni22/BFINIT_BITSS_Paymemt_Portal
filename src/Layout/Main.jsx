import { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "../components/Shared/Sidebar";
import TopNavbar from "../components/Shared/TopNavbar";
import { Toaster } from "react-hot-toast";

export default function Main() {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <main className="relative mx-auto flex flex-col bg-white lg:flex-row">
      <TopNavbar toggleSidebar={toggleSidebar} />
      <Sidebar showSidebar={showSidebar} toggleSidebar={toggleSidebar} />
      <div className="h-screen w-full overflow-y-auto">
        <Outlet />
      </div>

      <Toaster />
    </main>
  );
}
