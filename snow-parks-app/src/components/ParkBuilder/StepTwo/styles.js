import { StyleSheet, Dimensions } from 'react-native'
import { colors, fonts } from '../../../constants'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.BACKGROUND,
        justifyContent: 'flex-start',
        paddingHorizontal: 10,
        paddingBottom: 10,
        minHeight: Dimensions.get('window').height,
    },
    nextButton: {
        alignItems: 'center',
        borderColor: colors.MAIN,
        borderWidth: 2,
        backgroundColor: colors.SECONDARY,
        padding: 10,
        width: '75%',
        alignSelf: 'center',
        marginTop: 10
    },

    button: {
        color: colors.MAIN,
        fontFamily: fonts.SEMI
    },

})

export default styles