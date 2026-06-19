import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";



export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context


    const handleLogin = async ({ email, password }) => {
    setLoading(true);

    try {
        const data = await login({ email, password });

        if (!data) {
            throw new Error("login() returned undefined");
        }

        setUser(data.user);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
};

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            setUser(data.user)
        }  
        catch (err) {
            console.log("Register Error:", err.response?.data);
            console.log("Status:", err.response?.status);
            throw err;
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            const data = await logout()
            setUser(null)
        } catch (err) {
            console.log("Logout Error:", err.response?.data);
            console.log("Status:", err.response?.status);
            throw err;
        } finally {
            setLoading(false)
        }
    }



    return { user, loading, handleRegister, handleLogin, handleLogout }
}