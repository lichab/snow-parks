import { StyleSheet } from 'react-native'
import { colors, fonts } from '../../constants'

const styles = StyleSheet.create({
    modalHeader: {
        height: 60,
        flexDirection: 'row',
        backgroundColor: colors.MAIN,
        alignItems: 'center',
        paddingHorizontal: 25,
        justifyContent: 'space-between'
    },

    modalButton: {
        color: colors.SECONDARY,
        paddingTop: 10
    },
    modalHeaderText: {
        paddingTop: 10,
        alignSelf: 'center',
        color: colors.SECONDARY,
        fontWeight: 'bold',
        fontSize: 18,
        fontFamily: fonts.SEMI,
    },
})

export default styles