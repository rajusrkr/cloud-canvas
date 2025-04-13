// import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router";
import Canvas from "./pages/Canvas";
import Home from "./pages/Home";
import Header from "./components/header";
import Dashboard from "./pages/Dashboard";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

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
    path: "/signup",
    element: (
      <>
        <Signup />
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
