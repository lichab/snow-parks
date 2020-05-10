import React, { useState } from 'react'
import MapView, { Marker } from 'react-native-maps'
import { View, Modal, Text } from 'react-native'
import Button from '../Button'

import styles from './styles'

export default function MapModal({ visibility, modalToggle, addLocation }) {
    const [location, setLocation] = useState({})

    const acceptLocation = () => addLocation(location)

    return (
        <Modal
            animationType="slide"
            transparent={false}
            presentationStyle='formSheet'
            visible={visibility}
        >
            <View style={styles.modalHeader}>
                <Button
                    onPress={() => { setLocation({}); modalToggle() }}
                    text='Cancel'
                    textStyle={styles.buttonText}
                />
                <Text style={styles.modalText}>Pick a location</Text>
                <Button
                    onPress={acceptLocation}
                    text='Accept'
                    textStyle={styles.buttonText}
                />
            </View>
            <View style={styles.container}>
                <MapView
                    showsUserLocation={true}
                    style={styles.mapStyle}
                    onPress={({ nativeEvent }) => setLocation(nativeEvent.coordinate)}
                >
                    {location.latitude && (<Marker coordinate={location} />)}
                </MapView>
            </View>
        </Modal >
    )
}

