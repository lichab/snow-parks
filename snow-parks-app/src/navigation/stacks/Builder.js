import React from 'react'
import { StepOneContainer, StepTwoContainer, StepThreeContainer } from '../../components'
import { createStackNavigator } from "@react-navigation/stack"
import { stackOptions } from '../config'
const BuilderStack = createStackNavigator()

export default () => (
    <BuilderStack.Navigator screenOptions={stackOptions} initialRouteName='StepOne' >

        <BuilderStack.Screen name="StepOne" options={{ title: 'New Park' }} component={StepOneContainer} />
        <BuilderStack.Screen name="StepTwo" options={{ title: 'Add Features' }} component={StepTwoContainer} />
        <BuilderStack.Screen name="StepThree" options={{ title: 'Summary' }} component={StepThreeContainer} />

    </BuilderStack.Navigator >
)

