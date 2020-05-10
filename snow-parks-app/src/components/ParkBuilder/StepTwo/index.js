import React, { useState } from 'react'
import { ScrollView, KeyboardAvoidingView, View } from 'react-native'
import Button from '../../Button'
import FeatureInput from '../../FeatureInput'
import Feature from '../../Feature'
import styles from './styles'


export default function StepOne({ onToStepThree, cachedData }) {
    const [features, setFeatures] = useState(cachedData || [])

    const handleNextStep = () => onToStepThree(features)

    const addFeature = (feature) => setFeatures([...features, feature])

    const deleteFeature = (position) => {
        const updatedFeatures = features.filter((feature, index) => index !== position)
        setFeatures(updatedFeatures)
    }

    return (
        <KeyboardAvoidingView behavior='padding'>
            <ScrollView scrollEnabled={true}>
                <View style={styles.container}>
                    <FeatureInput onNewFeature={addFeature} />
                    {features.length > 0 ? (features.map((feature, index) =>
                        <Feature
                            removable={true}
                            featureId={index}
                            key={index.toString()}
                            feature={feature}
                            onDelete={deleteFeature}
                        />)) : null}
                    <Button style={styles.nextButton} text='Next' textStyle={styles.button}
                        onPress={handleNextStep}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}


