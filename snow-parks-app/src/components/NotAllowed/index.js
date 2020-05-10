import React from 'react'
import { View, Text } from 'react-native'
import MyButton from '../Button'
import Feedback from '../Feedback'
import styles from './styles'

export default function NotAllowed({ onToLogin, error }) {

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Hey stranger!</Text>

            </View>
            <View style={styles.top}>
                <Text style={styles.text}>Hey there,</Text>
                <Text style={styles.text}>if you want full access you will need to create an account</Text>
            </View>
            <View style={styles.bottom}>
                <MyButton
                    onPress={onToLogin}
                    style={styles.actionButton}
                    text='Login'
                    textStyle={styles.buttonText} />
            </View>
            {error && <Feedback level='error' message={error} />}
        </View>
    )

}