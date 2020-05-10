import React from 'react'
import { SearchContainer, ResultsContainer, ParkDetailsContainer } from '../../components'
import { createStackNavigator } from "@react-navigation/stack"
import { stackOptions } from '../config'

const HomeStack = createStackNavigator()

export default () => (
    <HomeStack.Navigator mode='modal' headerMode='screen' initialRouteName='Search' screenOptions={stackOptions}>

        <HomeStack.Screen name="Search" options={{ headerShown: false }} component={SearchContainer} />
        <HomeStack.Screen name="Results" component={ResultsContainer} />
        <HomeStack.Screen name="ParkDetails" options={{ title: 'Park' }} component={ParkDetailsContainer} />

    </HomeStack.Navigator >

)