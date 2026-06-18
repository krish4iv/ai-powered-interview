import "react"
import { RouterProvider } from "react-router-dom"
import { router } from "../src/routes/app.routes.jsx"
import { AuthProvider } from "./features/auth/auth.context.jsx"


const App = () => {
  return (
    
      <AuthProvider>
       
          <RouterProvider router = {router}/>

      </AuthProvider>
    
  )
}

export default App
