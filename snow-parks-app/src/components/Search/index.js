import React, { useState } from 'react'
import { View, TextInput, ImageBackground, Image } from 'react-native'
import Button from '../Button'
import styles from './styles'
import { images } from '../../constants'


export default function Search({ onSubmit }) {
    const [query, setQuery] = useState()

    return (<>
        <ImageBackground source={images.HOME}
            style={styles.topImageContainer} imageStyle={styles.topImage} >
            <View style={styles.inputContainer}>
                <View style={styles.queryButton} >
                    <Image style={styles.queryIcon} source={images.SEARCH} />
                </View>
                <TextInput style={styles.input} placeholder='Find a Park...' onChangeText={(text) => setQuery(text)} onSubmitEditing={() => onSubmit(query)} returnKeyType="search" />
            </View>
        </ImageBackground >

        <View style={styles.optionsContainer}>
            <ImageBackground imageStyle={styles.image} style={styles.imageContainer} source={images.FILTER_RIGHT}>
                <Button textStyle={styles.buttonText} text='VERIFIED PARKS' style={styles.filterButton} onPress={() => { onSubmit('verified') }} />
            </ImageBackground>

            <ImageBackground imageStyle={styles.image} style={styles.imageContainer} source={images.FILTER_RIGHT}>
                <Button textStyle={styles.buttonText} text='XL PARKS' style={styles.filterButton} onPress={() => { onSubmit('xl') }} />
            </ImageBackground>

            <ImageBackground imageStyle={styles.image} style={styles.imageContainer} source={images.FILTER_LEFT}>
                <Button textStyle={styles.buttonText} text='BEGGINER PARKS' style={styles.filterButton} onPress={() => { onSubmit('begginer') }} />
            </ImageBackground>

            <ImageBackground imageStyle={styles.image} style={styles.imageContainer} source={images.FILTER_LEFT}>
                <Button textStyle={styles.buttonText} text='LATEST PARKS' style={styles.filterButton} onPress={() => { onSubmit('latest') }} />
            </ImageBackground>
        </View>
    </>
    )
}
