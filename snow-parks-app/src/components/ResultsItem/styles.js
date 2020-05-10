import { StyleSheet, Dimensions } from 'react-native'
import { colors, fonts } from '../../constants'

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width * 0.95,
        marginVertical: 10,
    },

    item: {
        flex: 1,
        padding: 15,
        flexDirection: 'row',
        borderStyle: 'solid',
        borderColor: colors.MAIN,
        borderWidth: 4,
        borderRadius: 5,
        backgroundColor: colors.BACKGROUND,
    },
    text: {
        color: colors.MAIN,
        fontFamily: fonts.REGULAR,
        paddingVertical: 2
    },
    textBold: {
        color: colors.MAIN,
        fontSize: 16,
        fontFamily: fonts.SEMI,
        letterSpacing: 1
    },

    image: {
        height: 70,
        width: 70,
        alignSelf: 'center'
    },
    colOne: {
        flex: 0.70,
        paddingHorizontal: 8,
        justifyContent: 'space-between',

    },
    colTwo: {
        flex: 0.30,
        justifyContent: "space-between",
        alignItems: 'stretch',
        marginRight: 5

    },
    true: {
        backgroundColor: 'rgba(0,250,154, 0.7)',
        width: 85,
        textAlign: 'center',
        fontFamily: fonts.REGULAR
    },
    false: {
        backgroundColor: 'rgba(255,69,0, 0.3)',
        width: 85,
        textAlign: 'center',
        fontFamily: fonts.REGULAR,
    }
})

export default styles

