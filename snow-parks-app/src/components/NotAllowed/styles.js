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
    top: {
        paddingTop: 15,

        alignItems: 'center'
    },
    bottom: {
        flex: 0.4,
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingBottom: 40,
        justifyContent: 'space-around'
    },

    text: {
        fontFamily: fonts.REGULAR,
        textAlign: 'center'
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
    buttonText: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: fonts.SEMI,
        letterSpacing: 1,
        color: colors.MAIN
    },

})

export default styles