import React from 'react'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import styles from './styles'

import HomeStack from './stacks/Home'
import { NotAllowedContainer } from '../components'
import { bottomTabOptions, bottomNavScreenOptions } from './config'

const Tabs = createBottomTabNavigator()

export default () => (
    <Tabs.Navigator tabBarOptions={bottomTabOptions} screenOptions={bottomNavScreenOptions}>
        <Tabs.Screen name="Home" component={HomeStack} />
        <Tabs.Screen name="Build" component={NotAllowedContainer} />
        <Tabs.Screen name="Profile" component={NotAllowedContainer} />
    </Tabs.Navigator>
)


