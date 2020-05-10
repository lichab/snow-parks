import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import styles from './styles'
import { colors } from '../../constants'
import Feedback from '../Feedback'

export default function Loading({ error }) {

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={`${colors.MAIN}`} />
            {error && <Feedback level='error' message={error} />}
        </View>
    )
}
