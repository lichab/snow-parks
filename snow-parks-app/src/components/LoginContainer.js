import { __handleErrors__ } from '../handlers'
import { AuthContext } from './AuthProvider'
import Login from './Login'
import React, { useState, useContext } from 'react'

export default function LoginContainer({ navigation }) {
    const { login } = useContext(AuthContext)
    const [error, setError] = useState(null)

    const handleLogin = async (email, password) => {
        try {
            setError(null)

            await login(email, password)
        } catch ({ message }) {
            __handleErrors__(message, setError)
        }
    }

    const handleGoToRegister = () => navigation.navigate('Register')

    return <Login onSubmit={handleLogin} onToRegister={handleGoToRegister} error={error} />
}
