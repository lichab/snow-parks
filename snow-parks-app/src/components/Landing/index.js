import React from 'react'
import { View, Image } from 'react-native'
import Button from '../Button'
import styles from './styles'
import { images } from '../../constants'

export default function Landing({ onToHome, onToRegister, onToLogin }) {

    return (
        <View style={styles.container}>
            < Image source={images.LOGO} style={styles.logo}></Image>

            <Button text='Sign in now' style={styles.buttonContainer} textStyle={styles.button} onPress={onToLogin} />
            <Button text='Sign up with an e-email' style={styles.buttonContainer} textStyle={styles.button} onPress={onToRegister} />
            <Button text='Skip sign in' style={styles.skipButton} textStyle={styles.button} onPress={onToHome} />
        </View>
    )
}

