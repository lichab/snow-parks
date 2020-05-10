import React, { useState } from 'react'
import { TextInput, Text, TouchableWithoutFeedback, Keyboard, Image } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Button from '../Button'
import styles from './styles'
import { images } from '../../constants'

export default function Register({ onSubmit, error, onToLogin }) {
    const [name, setName] = useState()
    const [surname, setSurname] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    const handleSubmit = () => onSubmit(name, surname, email, password)

    return (

        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <KeyboardAwareScrollView contentContainerStyle={styles.container} >
                < Image source={images.LOGO} style={styles.logo}></Image>
                <TextInput style={styles.input} placeholder='Your name here' onChangeText={(text) => setName(text)} value={name} />
                <TextInput style={styles.input} placeholder='Your surname here' onChangeText={(text) => setSurname(text)} value={surname} />
                <TextInput textContentType='emailAddress' keyboardType='email-address' style={styles.input} placeholder='Your e-mail here' onChangeText={(text) => setEmail(text)} value={email} />
                <TextInput secureTextEntry={true} textContentType='newPassword' style={styles.input} placeholder='Your password here' onChangeText={(text) => setPassword(text)} value={password} />
                <Button text='Register' style={styles.buttonContainer} textStyle={styles.button} onPress={handleSubmit} />
                {error && <Text style={styles.danger}>{error}</Text>}
                <Button textStyle={styles.anchor} text='Already a member? Sign in' onPress={onToLogin} />
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
    )
}


