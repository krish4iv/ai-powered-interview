import {useAuth} from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"

const Protected = ({children}) => {
    const { loading, user} = useAuth()
    const navigate = useNavigate()
    if(loading){
        return <div>Loading...</div>
    }
    if(!user){
        navigate('/login')
        return null
    }
    return children
}

export default Protected