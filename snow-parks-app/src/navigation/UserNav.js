import React from 'react'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import HomeStack from './stacks/Home'
import BuilderStack from './stacks/Builder'
import { ProfileContainer } from '../components'
import { bottomTabOptions, bottomNavScreenOptions } from './config'

const Tabs = createBottomTabNavigator()

export default () => (

    <Tabs.Navigator tabBarOptions={bottomTabOptions} screenOptions={bottomNavScreenOptions}>
        <Tabs.Screen name="Home" component={HomeStack} />
        <Tabs.Screen name="Build" component={BuilderStack} />
        <Tabs.Screen name="Profile" component={ProfileContainer} />
    </Tabs.Navigator>
)
