import { BrowserRouter, Route, Routes } from "react-router";
import Signin from "./pages/signin";
import DashboardLayout from "./layout/dashboard-layout";
import Dashboard from "./pages/dashboard";
import Landing from "./pages/landing";
import Canvas from "./pages/canvas";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Signin */}
        <Route>
          <Route path="/signin" element={<Signin />} />
          <Route path="/" element = {<Landing />}/>
          <Route path="/canvas/:id" element = {<Canvas />}/>
        </Route>
        {/* Dashboard and canvas */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
