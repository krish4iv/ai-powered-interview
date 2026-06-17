import "react"
import { RouterProvider } from "react-router-dom"
import { router } from "../src/routes/app.routes.jsx"


const App = () => {
  return (
    <div className="flex flex-col w-screen min-h-screen bg-black font-inter">
      <RouterProvider router = {router}/>
    </div>
    
  )
}

export default App
