import React from "react"
import AuthProvider from './AuthProvider'
import { StatusBar } from 'react-native'
import AppNavigation from "../navigation/index"

export const Providers = ({ }) => {
    return (
        <AuthProvider>
            <StatusBar hidden={false} barStyle={'dark-content'} />
            <AppNavigation />
        </AuthProvider>
    )
}