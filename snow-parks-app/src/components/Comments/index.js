import React from 'react'
import { Text, View, ScrollView } from 'react-native'
import Comment from '../Comment'
import styles from './styles'

// Takes the CommentInput as children so it is easier to handle the events directly from parent component
export default function Comments({ comments, children }) {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                {children}
                {comments.length > 0 ? (comments.map((comment, index) => (<Comment key={index} data={comment} />)))
                    : (
                        <View style={styles.noComments}>
                            <Text style={styles.text}>No comments yet...</Text>
                            <Text style={styles.text}>Be the first one!</Text>
                        </View>
                    )}
            </ScrollView>
        </View>
    )
}

