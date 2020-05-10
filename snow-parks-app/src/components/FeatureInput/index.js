import React, { useState } from 'react'
import { TextInput, Picker, View, Text } from 'react-native'
import Button from '../Button'
import Feedback from '../Feedback'
import styles from "./styles";
import { colors } from '../../constants';

export default function ({ onNewFeature, error }) {
    const [feature, setFeature] = useState({ name: 'rail', size: 's', description: '' })

    return (
        <View style={styles.container}>
            <View style={styles.pickerContainer}>
                <Text style={styles.featureProp} >Type: </Text>
                <Picker
                    selectedValue={feature.name}
                    style={styles.picker}
                    itemStyle={{ height: 40 }}
                    onValueChange={(value) => setFeature({ ...feature, name: value })}
                >
                    <Picker.Item label="Rail" value="rail" />
                    <Picker.Item label="Kicker" value="kicker" />
                    <Picker.Item label="Box" value="box" />
                    <Picker.Item label="Pipe" value="pipe" />
                    <Picker.Item label="Other" value="other" />

                </Picker>
            </View>
            <View style={styles.pickerContainer}>
                <Text style={styles.featureProp} >Size: </Text>
                <Picker
                    selectedValue={feature.size}
                    style={styles.picker}
                    itemStyle={{ height: 40 }}
                    onValueChange={(value) => setFeature({ ...feature, size: value })}
                >
                    <Picker.Item label="Small" value="s" />
                    <Picker.Item label="Medium" value="m" />
                    <Picker.Item label="Large" value="l" />
                    <Picker.Item label="XL" value="xl" />
                </Picker>
            </View>

            <View style={styles.inputsContainer}>
                <Text style={styles.featureProp}>Description:</Text>
                <TextInput
                    selectionColor={colors.BACKGROUND}
                    value={feature.description}
                    placeholder='Eg: Gnarly kinked rail'
                    style={styles.textInput}
                    onChangeText={(text) => setFeature({ ...feature, description: text })}
                />
            </View>
            <Button text='+ Add feature' style={styles.secondaryButton} textStyle={styles.button} onPress={() => onNewFeature(feature)} />
            {error && <Feedback level='warn' message={error} />}
        </ View>
    )
}
