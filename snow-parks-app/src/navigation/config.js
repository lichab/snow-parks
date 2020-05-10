import React from 'react'
import { colors, images, fonts } from '../constants'
import { Image } from 'react-native'
import styles from './styles'

export const bottomNavScreenOptions = ({ route }) => ({
    tabBarIcon: () => {
        let iconName
        if (route.name === 'Home') iconName = images.SEARCH
        else if (route.name === 'Build') iconName = images.BUILDER
        else if (route.name === 'Profile') iconName = images.PROFILE

        return <Image source={iconName} style={styles.icon} />
    },
})

export const bottomTabOptions = {
    activeTintColor: colors.BACKGROUND,
    inactiveTintColor: 'lightgrey',
    style: {
        backgroundColor: colors.MAIN
    }
}

export const stackOptions = {
    headerBackTitleVisible: false,
    headerStyle: {
        backgroundColor: colors.MAIN
    },
    headerTitleStyle: {
        fontFamily: fonts.SEMI
    },
    headerTintColor: colors.SECONDARY
}
