import { StyleSheet } from 'react-native'
import { colors, fonts } from '../../constants'

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.BACKGROUND,
        flex: 1,
        paddingHorizontal: 15
    },
    scroll: {
        backgroundColor: colors.BACKGROUND
    },
    noComments: {
        alignItems: 'center',

    },
    text: {
        fontFamily: fonts.REGULAR,
    },
})

export default styles