import { StyleSheet, Dimensions } from 'react-native'
import { colors, fonts } from '../../constants'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.855,
    },
    buttonText: {
        fontSize: 16,
        color: colors.BACKGROUND
    },

    modalText: {
        color: colors.SECONDARY,
        fontSize: 16,
        fontFamily: fonts.SEMI,
    },
    modalHeader: {
        flex: 0.1,
        paddingHorizontal: 10,
        flexDirection: 'row',
        backgroundColor: colors.MAIN,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
})

export default styles