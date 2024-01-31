import { Navigation } from "@/components/navigation";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="w-screen flex">
      <div className="border-r h-screen shrink-0">
        <Navigation />
      </div>
      <div className="bg-muted grow-1 w-full px-2">
        <Outlet />
      </div>
    </div>
  );
}
