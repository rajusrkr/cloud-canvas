// import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router";
import Canvas from "./pages/Canvas";
import Home from "./pages/Home";
import Header from "./components/header";
import Dashboard from "./pages/Dashboard";
import Signin from "./pages/Signin";
import RedirectToDashboardOrSignin from "./pages/RedirectToDashboardOrSignin";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Header />
        <Home />
      </>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <>
        <Header />
        <RedirectToDashboardOrSignin />
      </>
    )
  },
  {
    path: "/dashboard/:userId",
    element: (
      <>
        <Header />
        <Dashboard />
      </>
    ),
  },
  {
    path: "/signin",
    element: (
      <>
        <Signin />
      </>
    ),
  },
  {
    path: "/canvas/:id",
    element: (
      <>
        <Canvas />
      </>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
