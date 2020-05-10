import React from 'react'
import { ScrollView, View, Text } from 'react-native'
import Button from '../../Button'
import Map from '../../Map'
import styles from './styles'

export default function StepThree({ features, park, onConfirmation }) {

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.innerContainer}>
                <View style={styles.details}>
                    <View style={styles.detailsCols}>
                        <Text style={styles.label}>Name: </Text>
                        <Text style={styles.label}>Size: </Text>
                        <Text style={styles.label}>Level: </Text>
                        <Text style={styles.label}>Flow: </Text>
                        <Text style={styles.label}>Features: </Text>
                    </View>
                    <View style={styles.detailsCols}>
                        <Text style={styles.text}>{park.name.toUpperCase()}</Text>
                        <Text style={styles.text}>{park.size.toUpperCase()}</Text>
                        <Text style={styles.text}>{park.level.toUpperCase()}</Text>
                        <Text style={styles.text}>{park.flow.toUpperCase()}</Text>
                        <Text style={styles.text}>{features}</Text>
                    </View>
                </View>
                <View style={styles.mapContainer}>
                    <Map coordinates={[park.location.longitude, park.location.latitude]} />
                </View>
                <Button
                    text='Confirm'
                    style={styles.nextButton}
                    textStyle={styles.button}
                    onPress={onConfirmation} />
            </ScrollView>
        </View>
    )
}

