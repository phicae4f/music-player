import { useEffect } from "react"
import { useAppSelector } from "../hooks/redux"
import { Navigate } from "react-router-dom"

interface ProtectedRouteProps {
    children: React.ReactNode
}


export const ProtectedRoute = ({children}: ProtectedRouteProps) => {

    const {token} = useAppSelector((state) => state.auth)

    if(!token) {
        return <Navigate to="/login" replace/>
    }

    return (
        <>{children}</>
    )
}