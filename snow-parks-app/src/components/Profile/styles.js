import { StyleSheet } from 'react-native'
import { colors, fonts } from '../../constants'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        backgroundColor: colors.BACKGROUND,
    },
    header: {
        flex: 0.5,
        flexDirection: 'row',
        backgroundColor: colors.MAIN,
        justifyContent: 'space-between',
        padding: 15,

    },

    headerText: {
        paddingTop: 10,
        alignSelf: 'center',
        color: colors.SECONDARY,
        fontFamily: fonts.SEMI,
        fontSize: 18,
        alignSelf: 'flex-end'
    },

    noImage: {
        width: 100,
        height: 100,
        backgroundColor: colors.SECONDARY,
        justifyContent: 'center',
        borderRadius: 10,
    },
    imageContainer: {
        //Todo for when adding images
    },
    topDataContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "space-around",
        alignContent: 'center',
        alignSelf: 'center'
    },

    logoutImage: {
        height: 22,
        width: 22,
        tintColor: colors.SECONDARY
    },

    dataType: {
        alignSelf: 'center',
        fontFamily: fonts.SEMI,
        paddingBottom: 30,
    },
    data: {
        alignSelf: 'center',
        fontFamily: fonts.REGULAR
    },
    topData: {
        //Leave this here for extra styling later
    },
    top: {
        height: '30%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 15

    },

    userInfo: {
        flex: 0.30,
        justifyContent: 'space-around',
        padding: 15,
        alignSelf: 'flex-start',
        textAlign: 'left'
    },
    bottom: {
        flex: 0.4,
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingBottom: 40,
        justifyContent: 'space-around'
    },
    actionButton: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: colors.MAIN,
        height: 40,
        width: 150,
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },

    logoutButtonContainer: {
        height: 40,
        width: 100,
        justifyContent: 'flex-end',
        alignItems: 'flex-end'

    },
    logoutButton: {
        color: 'red',
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: fonts.SEMI,
        letterSpacing: 1,
        color: colors.MAIN

    },

    text: {
        fontFamily: fonts.REGULAR,
    },
})

export default styles