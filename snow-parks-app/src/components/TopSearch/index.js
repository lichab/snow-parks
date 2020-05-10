//TODO

// import React, { useState } from 'react'
// import { View, TextInput, Image } from 'react-native'
// import styles from './styles'
// const searchIcon = require(' ../../../assets/icon-search.png')

// export default function ({ onSubmit, query }) {
//     const [newQuery, setNewQuery] = useState()

//     const handleSetQuery = (text) => setNewQuery(text)
//     const handleOnSubmit = () => onSubmit(newQuery)


//     return (
//         <View style={styles.container}>
//             <View style={styles.iconContainer} >
//                 <Image style={styles.queryIcon} source={searchIcon} />
//             </View>
//             <TextInput
//                 style={styles.input}
//                 defaultValue={query}
//                 onChangeText={handleSetQuery}
//                 onSubmitEditing={handleOnSubmit}
//                 returnKeyType="search"
//             />
//         </View>
//     )
// }