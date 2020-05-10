import { StyleSheet } from 'react-native'
import { colors, fonts } from '../../constants'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        margin: 0
    },
    inputContainer: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingBottom: 10
    },
    input: {
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        height: '16%',
        flex: 0.9,
        paddingLeft: 10,
        backgroundColor: 'white',
        shadowColor: 'white',
        shadowOpacity: 100,
        fontFamily: fonts.REGULAR
    },

    optionsContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        backgroundColor: colors.BACKGROUND,
        justifyContent: 'space-between'
    },
    topImageContainer: {
        flex: 1,
        backgroundColor: colors.SECONDARY

    },
    topImage: {
        opacity: 0.75
    },
    image: {
        width: '100%',
        height: '100%'
    },
    imageContainer: {
        width: '49.5%',
        height: '49%',
        marginBottom: 4
    },
    queryIcon: {
        width: 30,
        height: 30,
        tintColor: colors.MAIN
    },
    queryButton: {
        paddingLeft: 10,
        backgroundColor: 'white',
        height: '16%',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        justifyContent: 'center',
        shadowColor: 'white',
        shadowOpacity: 100
    },
    buttonText: {
        fontFamily: fonts.SEMI,
        alignSelf: 'center'
    },

    filterButton: {
        height: '100%',
        justifyContent: 'center'
    }
})

export default styles