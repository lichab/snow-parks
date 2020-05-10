import React from 'react'
import { View, FlatList } from 'react-native'
import ResultsItem from '../ResultsItem'
import FeedBack from '../Feedback'
import styles from './styles'

export default function Results({ results, onToDetails, error }) {

    return (
        <View style={styles.container}>

            {!error && <FlatList
                data={results}
                renderItem={({ item }) => (<ResultsItem park={item} onToPark={onToDetails} />)}
                keyExtractor={item => item.id}
            />}

            {error && <FeedBack level='warn' message={error} />}
        </View>
    )
}
