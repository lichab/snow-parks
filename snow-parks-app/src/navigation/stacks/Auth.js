import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"
import { LoginContainer, RegisterContainer, LandingContainer } from '../../components'
import { stackOptions } from '../config'

const AuthStack = createStackNavigator()

export default () => (

    <AuthStack.Navigator screenOptions={stackOptions}>
        <AuthStack.Screen options={{ headerShown: false }} name='Landing' component={LandingContainer} />
        <AuthStack.Screen options={{ title: 'Sign up' }} name='Register' component={RegisterContainer} />
        <AuthStack.Screen options={{ title: 'Sign in' }} name='Login' component={LoginContainer} />
    </AuthStack.Navigator>

)

