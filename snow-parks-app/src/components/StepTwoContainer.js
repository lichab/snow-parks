import React, { useState } from 'react'
import StepTwo from './ParkBuilder/StepTwo'

export default function StepTwoContainer({ navigation, route }) {
    const [cache, setCache] = useState([])

    const { park } = route.params

    const handleToStepThree = features => {
        setCache(features)
        navigation.navigate('StepThree', { park, features })
    }

    return <StepTwo onToStepThree={handleToStepThree} cachedData={cache} />
}
