import { StyleSheet } from 'react-native'
import { colors, fonts } from '../../constants'

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        flex: 1,
        flexGrow: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: colors.MAIN,
    },
    input: {
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        height: '40%',
        flex: 1,
        flexGrow: 1,
        paddingLeft: 10,
        backgroundColor: 'white',
        fontFamily: fonts.REGULAR
    },
    queryIcon: {
        width: 15,
        height: 15,
        tintColor: colors.MAIN
    },
    iconContainer: {
        paddingLeft: 10,
        backgroundColor: 'white',
        height: '40%',
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        justifyContent: 'center',

    }
})

export default styles