import React from 'react'
import { View, Text } from 'react-native'
import MyButton from '../Button'
import styles from './styles'

export default function ({ removable, featureId, feature, onDelete }) {

    return (<View style={styles.container}>
        {removable && (
            <View style={{ alignSelf: 'flex-start', marginLeft: 10, marginTop: 15 }}>
                <MyButton text='✖' onPress={() => onDelete(featureId)} />
            </View>
        )}
        <View style={styles.featureContainer} >
            <View style={styles.propContainer}>
                <Text style={styles.featureProp}>Type</Text>
                <Text style={styles.featureData}>{feature.name}</Text>
            </View>
            <View style={styles.propContainer}>
                <Text style={styles.featureProp}>Size</Text>
                <Text style={styles.featureData}>{feature.size.toUpperCase()}</Text>
            </View>
            <View style={styles.propContainer}>
                <Text style={styles.featureProp}>Description</Text>
                <Text style={styles.featureData}>{feature.description || 'N/A'}</Text>
            </View>
        </View >
    </View>
    )
}