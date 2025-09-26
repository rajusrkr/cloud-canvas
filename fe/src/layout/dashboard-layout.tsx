import { Outlet } from "react-router";
import DashboardNavbar from "../components/navbar";

export default function DashboardLayout() {
  return (
    <div>
      <DashboardNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
