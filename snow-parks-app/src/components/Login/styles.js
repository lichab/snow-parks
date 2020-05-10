import { StyleSheet } from 'react-native'
import { colors, fonts } from '../../constants'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: colors.BACKGROUND,
    },
    input: {
        backgroundColor: colors.MAIN,
        flex: 0.20,
        width: '75%',
        color: colors.SECONDARY,
        alignItems: 'center',
        paddingHorizontal: 10,
        borderColor: colors.SECONDARY,
        borderWidth: 2,
        fontFamily: fonts.REGULAR
    },
    buttonContainer: {
        alignItems: 'center',
        borderColor: colors.MAIN,
        borderWidth: 2,
        backgroundColor: colors.SECONDARY,
        padding: 15,
        width: '75%',
        alignSelf: 'center',
        marginTop: 10
    },
    button: {
        color: colors.MAIN,
        fontFamily: fonts.SEMI
    },

    anchor: {
        color: colors.MAIN,
        fontFamily: fonts.REGULAR
    },

    danger: {
        color: 'red'
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 5
    }
})

export default styles