import React, { useState } from 'react'
import { TextInput, View } from 'react-native'
import MyButton from '../Button'
import styles from './styles'

export default function CommentInput({ onCancel, onSubmit }) {
    const [text, setText] = useState('')

    return (
        < View style={styles.newCommentContainer} >
            <TextInput
                style={styles.newComment}
                multiline={true}
                numberOfLines={4}
                onChangeText={txt => setText(txt)}
                value={text}
            />
            <View style={styles.buttonsContainer}>
                <MyButton text='Cancel' style={styles.secondaryButton} textStyle={styles.buttonText} onPress={onCancel} />
                <MyButton text='Submit' style={styles.secondaryButton} textStyle={styles.buttonText} onPress={() => onSubmit(text)} />
            </View>
        </View >
    )
}
