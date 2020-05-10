import React, { useState, useEffect } from 'react'
import { View, Text, Image, ScrollView, Modal, Alert } from 'react-native'
import MyButton from '../Button'
import Map from '../Map'
import FeatureInput from '../FeatureInput'
import Feature from '../Feature'
import Comments from '../Comments'
import CommentInput from '../CommentInput'
import Feedback from '../Feedback'
import styles from './styles'
import { images } from '../../constants'

export default function ParkDetails({ error, user, park, onVote, onCommentSubmit, onContribution, onUpdate, onDeletePark }) {
    const [comments, setComments] = useState()
    const [votes, setVotes] = useState()
    const [showComments, setShowComments] = useState(false)
    const [createComment, setCreateComment] = useState(false)
    const [featureInput, setFeatureInput] = useState(false)

    useEffect(() => {
        setComments(park.comments)
        setVotes(park.rating)
    }, [park])

    const handleNewFeature = (feature) => onUpdate({ features: [...park.features, feature] })

    const handleDeleteFeature = (id) => {
        const update = park.features.filter(feature => feature.id !== id)

        onUpdate({ features: [...update] })
    }

    const handleDeletePark = () => {
        Alert.alert(
            'Delete Park',
            `Are you sure you want to delete ${park.name}?`,
            [{ text: `Yes, I'm sure`, onPress: onDeletePark },
            { text: 'Cancel', onPress: () => { }, style: 'cancel' },
            ],
        )
    }

    const handleReport = () => {
        Alert.alert(
            "Report a problem",
            'Please let us know what went wrong',
            [
                { text: 'Fake', onPress: () => onContribution('unreal') },
                { text: 'Duplicate', onPress: () => onContribution('duplicate') },
                { text: 'Cancel', onPress: () => { }, style: 'cancel' },
            ],
        )

    }

    const handleSubmit = (body) => {
        onCommentSubmit(body)

        setCreateComment(false)
    }

    if (error) return (
        <View style={{ justifyContent: "center", width: '100%', height: 200 }}>
            <Feedback message={error} level='error' />
        </View>
    )

    return (
        <ScrollView >
            <View key={0} style={styles.container}>
                <Image style={styles.image} source={images.PARK_DEFAULT} />
                <View style={styles.infoContainer}>
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <Text style={styles.postedAt}>Creation date: {park.created.toString().slice(0, 10)}.</Text>
                            <Text>Created by: {park.creator.name}</Text>
                        </View>
                        <View style={styles.headerRight}>
                            <MyButton text='See what people are saying' style={styles.commentsButton} textStyle={styles.commentsLink} onPress={() => setShowComments(!showComments)} />
                        </View>
                    </View>
                    <View style={styles.top}>
                        <View style={styles.basicInfoContainer}>
                            <View>
                                <Text style={styles.basicInfo}>{park.resort.toUpperCase()}</Text>
                            </View>
                            <View>
                                <Text style={styles.votes}>{park.size.toUpperCase()}</Text>
                            </View>
                            <View >
                                <Text style={styles.basicInfo}>{park.level}</Text>
                            </View>
                        </View>
                        <View style={styles.votesContainer}>
                            <MyButton text='+ Vote' textStyle={styles.upVote} onPress={() => onVote(true)} />
                            <View>
                                <Text style={styles.votes}>{votes ? votes : 0}</Text>
                            </View>
                            <MyButton text='- Vote' textStyle={styles.downVote} onPress={() => onVote(false)} />
                        </View>
                    </View>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={showComments}>
                        <View style={styles.modalHeader}>
                            <MyButton onPress={() => setShowComments(!showComments)} text='Cancel' textStyle={styles.headerText} />
                            <Text style={styles.headerTextBold}>Comments</Text>
                            <MyButton onPress={() => setCreateComment(!createComment)} text='Add' textStyle={styles.headerText} />
                        </View>
                        <Comments comments={comments}>
                            {createComment && (<CommentInput onCancel={() => setCreateComment(false)} onSubmit={handleSubmit} />)}
                        </Comments>
                    </Modal>
                    <View style={styles.mapContainer}>
                        <Map coordinates={park.location.coordinates} />
                    </View>

                    {park.verified && (<View style={styles.approve}>
                        <Text style={styles.actionText}>Verified Park</Text>
                    </View>
                    )}

                    {!park.verified && user.id !== park.creator.id && (
                        <View style={styles.actionsContainer}>
                            <MyButton style={styles.approve} textStyle={styles.actionText} text='✅ Approve' onPress={() => onContribution('approve')} />
                            <MyButton style={styles.report} textStyle={styles.actionText} text='❕ Report ' onPress={handleReport} />
                        </View>
                    )}

                    {user.id === park.creator.id
                        ? (<View style={styles.delete}>
                            <MyButton
                                text='Delete park'
                                style={styles.report}
                                textStyle={styles.actionText}
                                onPress={handleDeletePark}
                            />
                        </View>)
                        : null}

                    <View style={styles.featuresContainer}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                            <Text style={styles.sectionHeader}>Park features ({park.features.length})</Text>

                            {user.id === park.creator.id
                                ? (<MyButton
                                    text='➕'
                                    textStyle={styles.commentButton}
                                    onPress={() => setFeatureInput(!featureInput)}
                                />)
                                : null}

                        </View>
                        {featureInput && (<FeatureInput onNewFeature={handleNewFeature} />)}
                        {park.features.length
                            ? (park.features.map((feature, index) => (
                                <Feature
                                    key={index}
                                    featureId={feature.id}
                                    onDelete={handleDeleteFeature}
                                    removable={user.id === park.creator.id}
                                    feature={feature}

                                />)))
                            : (<Text>No features were added to this park</Text>)}
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}
