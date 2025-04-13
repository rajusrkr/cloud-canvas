// import './App.css'
import {createBrowserRouter, RouterProvider} from "react-router"
import Canvas from './pages/Canvas'

const router = createBrowserRouter([
  {
    path: "/canvas",
    element: (
      <>
      <Canvas />
      </>
    )
  }
])

function App() {

  return (
   <RouterProvider router={router}/>
  )
}

export default App
