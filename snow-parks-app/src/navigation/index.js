import React, { useState, useEffect, useContext } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AuthNavigation from './stacks/Auth'
import UserNavigation from './UserNav'
import AnonymousNavigation from './AnonymousNav'
import { AuthContext } from '../components/AuthProvider'
import { Loading } from '../components'
import { __handleErrors__ } from '../handlers'

export default () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { isUserLogged, isUserAnonymous, isUser, isAnonymous } = useContext(AuthContext)


    useEffect(() => {
        (async () => {
            try {
                if (await isUserLogged()) return setLoading(false)
                if (await isUserAnonymous()) return setLoading(false)

                setLoading(false)
            } catch ({ message }) {
                __handleErrors__(message, setError)
            }

        })()

    }, [isUser, isAnonymous])


    if (loading) return <Loading error={error} />

    return (

        <NavigationContainer>

            {!isUser && !isAnonymous && <AuthNavigation error={error} />}
            {isAnonymous && <AnonymousNavigation error={error} />}
            {isUser && <UserNavigation error={error} />}

        </NavigationContainer>
    )
}



