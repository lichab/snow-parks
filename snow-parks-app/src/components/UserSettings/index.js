import React, { useState } from 'react'
import { KeyboardAvoidingView, ScrollView, View, TextInput, Text } from 'react-native'
import Button from '../Button'
import Feedback from '../Feedback'
import styles from './styles'

export default function UserSettings({ user, onUpdate, error }) {
    const [userUpdates, setUserUpdates] = useState({})

    const update = () => {
        onUpdate(userUpdates)
        setUserUpdates({})
    }

    return (

        <KeyboardAvoidingView behavior='padding'>
            <ScrollView scrollEnabled={true}>
                <View style={styles.settingsContainer}>
                    <View style={styles.topSettings}>
                        <Text style={styles.sectionHeader}>Update my info</Text>
                        <View style={styles.inputsContainer}>
                            <Text style={styles.label}>E-mail:  </Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder={user.email}
                                onChangeText={(email) => setUserUpdates({ ...userUpdates, email })}

                            />
                        </View>
                        <View style={styles.inputsContainer}>
                            <Text style={styles.label}>Name:  </Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder={user.name}
                                onChangeText={(name) => setUserUpdates({ ...userUpdates, name })}
                            />
                        </View>
                        <View style={styles.inputsContainer}>
                            <Text style={styles.label}>Surname:  </Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder={user.surname}
                                onChangeText={(surname) => setUserUpdates({ ...userUpdates, surname })}
                            />
                        </View>
                    </View>
                    <View style={styles.bottomSettings}>
                        <Text style={styles.sectionHeader}>Change Password</Text>
                        <View style={styles.inputsContainer}>
                            <Text style={styles.label}>Password:  </Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder='Your new password'
                                onChangeText={(password) => setUserUpdates({ ...userUpdates, password })}
                            />
                        </View>
                        <View style={styles.inputsContainer}>
                            <Text style={styles.label}>Old Password:  </Text>

                            <TextInput
                                style={styles.textInput}
                                placeholder='Your old password'
                                onChangeText={(oldPassword) => setUserUpdates({ ...userUpdates, oldPassword })}
                            />
                        </View>

                        <Button style={styles.actionButton} text='Submit' textStyle={styles.buttonText} onPress={update} />
                    </View>
                    {error && <Feedback level='warn' message={error} />}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
} 