// import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router";
import Canvas from "./pages/Canvas";
import Home from "./pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Home />
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
