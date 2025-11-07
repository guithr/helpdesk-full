import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="flex  min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col bg-gray-100">
        <main className="flex-1 bg-gray-600 md:px-12 md:pt-13 md:mt-3 md:rounded-tl-[20px] overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
