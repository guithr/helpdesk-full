import { MainContent } from "./MainContent";
import { Navigation } from "./Navigation";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="flex flex-col md:flex-row  md:h-screen">
      <Navigation />

      <div className="flex flex-1 flex-col md:overflow-hidden bg-gray-100">
        <MainContent>
          <Outlet />
        </MainContent>
      </div>
    </div>
  );
}
