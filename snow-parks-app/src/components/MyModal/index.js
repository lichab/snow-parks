import React from 'react'
import { View, Text, Modal } from 'react-native'
import MyButton from '../Button'
import styles from './styles'

export default MyModal = ({ visibility, modalToggle, title, children }) => (
    <Modal
        animationType="slide"
        presentationStyle='formSheet'
        transparent={false}
        visible={visibility}>
        <View style={styles.modalHeader}>
            <MyButton onPress={modalToggle} text='Cancel' textStyle={styles.modalButton} style={styles.modalButtonContainer} />
            <Text style={styles.modalHeaderText} >{title}</Text>
        </View>
        {children}
    </Modal>
)
