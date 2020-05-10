import React, { useContext } from 'react'
import Landing from './Landing'
import { AuthContext } from './AuthProvider'

export default function LandingContainer({ navigation }) {
    const { setAnonymous } = useContext(AuthContext)

    const handleOnToLogin = () => navigation.navigate('Login')

    const handleOnToRegister = () => navigation.navigate('Register')

    const handleOnToHome = async () => await setAnonymous(true)

    return <Landing onToLogin={handleOnToLogin} onToRegister={handleOnToRegister} onToHome={handleOnToHome} />
}