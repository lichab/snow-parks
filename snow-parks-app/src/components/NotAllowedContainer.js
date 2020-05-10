import React, { useState, useContext } from 'react'
import { AuthContext } from './AuthProvider'
import NotAllowed from './NotAllowed'
import { __handleErrors__ } from '../handlers'

export default function NotAllowedContainer() {
    const [error, setError] = useState(null)
    const { setAnonymous } = useContext(AuthContext)

    const handleOnToLogin = async () => {
        try {
            await setAnonymous(false)

        } catch ({ message }) {
            __handleErrors__(message, setError)
        }
    }

    return <NotAllowed error={error} onToLogin={handleOnToLogin} />
}