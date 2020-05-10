import React from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import styles from './styles'

export default function Map({ coordinates }) {

    return (<>
        <MapView
            style={styles.container}
            provider={PROVIDER_GOOGLE}
            region={{
                latitude: coordinates[1],
                longitude: coordinates[0],
                latitudeDelta: 1,
                longitudeDelta: 1,
            }}>
            <Marker
                coordinate={{
                    latitude: coordinates[1],
                    longitude: coordinates[0],
                }} />
        </MapView>
    </>)

}
