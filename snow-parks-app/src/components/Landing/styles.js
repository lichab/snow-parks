import { StyleSheet } from 'react-native'
import { colors, fonts } from '../../constants'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: colors.BACKGROUND,
        width: '100%',
    },
    logo: {
        width: 250,
        height: 250,
        marginBottom: 10
    },
    skipButton: {
        alignItems: 'center',
        borderColor: colors.MAIN,
        borderWidth: 2,
        backgroundColor: 'white',
        padding: 10,
        marginTop: 10,
        width: '50%',
        alignSelf: 'center'

    },
    buttonContainer: {
        alignItems: 'center',
        borderColor: colors.MAIN,
        borderWidth: 2,
        backgroundColor: colors.SECONDARY,
        padding: 15,
        width: '80%',
        alignSelf: 'center',
        marginTop: 10
    },
    button: {
        color: colors.MAIN,
        fontFamily: fonts.SEMI,
    },
})

export default styles