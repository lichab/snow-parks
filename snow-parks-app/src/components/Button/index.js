import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

export default function Button(props) {
    return (
        <TouchableOpacity style={props.style} onPress={props.onPress}>
            <Text style={props.textStyle}>{props.text}</Text>
            {props.children}
        </TouchableOpacity>
    )
}

