import { StyleSheet } from 'react-native'
import { colors, fonts } from '../../constants'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.BACKGROUND,
        flexDirection: 'column',
        width: '100%'
    },
    infoContainer: {
        width: '95%',
        marginHorizontal: '2.5%'
    },

    mapContainer: {
        width: '100%',
        marginVertical: 15
    },
    featuresContainer: {
        marginTop: 15,
        marginBottom: 40

    },

    pickerContainer: {
        flex: 0.2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        alignItems: 'center'
    },
    picker: {
        height: 35,
        color: colors.SECONDARY,
        width: '60%',
        backgroundColor: colors.MAIN,
        borderColor: colors.SECONDARY,
        borderWidth: 2
    },

    inputsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        flex: 1,
    },

    textInput: {
        height: '100%',
        backgroundColor: colors.MAIN,
        width: '60%',
        alignSelf: 'flex-end',
        paddingHorizontal: 10,
        borderColor: colors.SECONDARY,
        borderWidth: 2,
        fontFamily: fonts.REGULAR
    },
    image: {
        width: '100%',
        height: 200
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    headerLeft: {
        flex: 0.7,
        paddingTop: 3,
        flexDirection: 'column'
    },
    headerRight: {
        flex: 0.5,
        alignSelf: 'center',
    },

    top: {
        flexDirection: 'row',
        marginVertical: 20,
        justifyContent: 'space-between'
    },

    headerText: {
        fontSize: 16,
        color: colors.SECONDARY,
        marginTop: 10,
        fontFamily: fonts.REGULAR
    },
    headerTextBold: {
        fontSize: 18,
        color: colors.SECONDARY,
        marginTop: 10,
        paddingRight: 10,
        fontFamily: fonts.SEMI
    },
    modalHeader: {
        flex: 0.1,
        flexDirection: 'row',
        padding: 5,
        paddingHorizontal: 15,
        backgroundColor: colors.MAIN,
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    isVerified: {
        alignSelf: 'center',
        backgroundColor: 'lightgreen',
        padding: 5,
        fontFamily: fonts.REGULAR
    },

    isNotVerified: {
        alignSelf: 'center',
        backgroundColor: '#ff726f',
        padding: 5,
    },

    delete: {
        marginVertical: 10,
    },

    votesContainer: {
        margin: 10,
        width: '35%',
        alignSelf: 'flex-end',

    },

    basicInfoContainer: {
        marginLeft: 10,
        width: '50%'
    },

    actionsContainer: {
        flex: 1,
        margin: 10,
        marginBottom: 25,
        width: '95%',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    approve: {
        padding: 5,
        borderRadius: 5,
        flex: 0.4,
        backgroundColor: '#18BC0F'
    },
    actionText: {
        fontFamily: fonts.SEMI,
        textAlign: 'center',
        color: 'white'
    },

    report: {
        backgroundColor: 'red',
        padding: 5,
        borderRadius: 5,
        flex: 0.4
    },

    postedAt: {
        fontStyle: 'italic',
        paddingBottom: 3,
    },
    mapStyle: {
        width: '98%',
        height: 150,
        marginVertical: 10
    },

    sectionHeader: {
        fontSize: 20,
        fontFamily: fonts.SEMI
    },

    votes: {
        fontSize: 35,
        fontFamily: fonts.SEMI,
        color: colors.MAIN,
        textAlign: 'center',
    },


    basicInfo: {
        backgroundColor: colors.MAIN,
        padding: 10,
        borderColor: colors.SECONDARY,
        borderWidth: 2,
        fontFamily: fonts.BOLD,
        textAlign: 'center',
        color: colors.SECONDARY,
    },
    upVote: {
        backgroundColor: 'white',
        padding: 5,
        borderColor: colors.MAIN,
        borderWidth: 2,
        fontFamily: fonts.SEMI,
        textAlign: 'center',
        color: '#18BC0F',
    },
    downVote: {
        backgroundColor: 'white',
        padding: 5,
        borderColor: colors.MAIN,
        borderWidth: 2,
        fontFamily: fonts.SEMI,
        textAlign: 'center',
        color: '#ff726f',
    },

    featureContainer: {
        marginVertical: 15,
        borderWidth: 2,
        borderColor: colors.MAIN,
        borderRadius: 5,
        padding: 15,
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    featureProp: {
        fontFamily: fonts.SEMI,
        paddingBottom: 10,
    },

    featureData: {
        fontFamily: fonts.REGULAR,
    },
    propContainer: {
        flex: 1,
        justifyContent: 'space-around'
    },
    commentsLink: {
        textAlign: 'center',
        fontFamily: fonts.SEMI,
    }
})

export default styles