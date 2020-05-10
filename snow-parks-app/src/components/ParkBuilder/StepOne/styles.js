import { StyleSheet, Dimensions } from 'react-native'
import { colors, fonts } from '../../../constants'

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.BACKGROUND,
        // justifyContent: 'space-between',
        alignItems: 'stretch',
        paddingHorizontal: 10,
        paddingVertical: 5,
        height: Dimensions.get('window').height
    },
    inputsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 25,
    },

    textInput: {
        height: 40,
        backgroundColor: colors.MAIN,
        width: '60%',
        alignSelf: 'flex-end',
        paddingHorizontal: 10,
        borderColor: colors.SECONDARY,
        borderWidth: 2,
        fontFamily: fonts.REGULAR,
        color: colors.SECONDARY

    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10
    },
    picker: {
        height: 45,
        color: colors.SECONDARY,
        width: '60%',
        backgroundColor: colors.MAIN,
        borderColor: colors.SECONDARY,
        borderWidth: 2,
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.855,
    },

    numbersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 25,
        flex: 1
    },
    buttonContainer: {
        alignItems: 'center',
        borderColor: colors.MAIN,
        borderWidth: 2,
        backgroundColor: 'white',
        padding: 10,
        marginTop: 10,
        width: '90%',
        alignSelf: 'center'

    },
    nextButton: {
        alignItems: 'center',
        borderColor: colors.MAIN,
        borderWidth: 2,
        backgroundColor: colors.SECONDARY,
        padding: 10,
        width: '75%',
        alignSelf: 'center',
        marginTop: 10,

    },
    button: {
        color: colors.MAIN,
        fontFamily: fonts.SEMI
    },
    actionButtons: {
        height: '25%',
        justifyContent: "space-around"
    },

    label: {
        fontFamily: fonts.SEMI,
        alignSelf: 'center'

    }

})

export default styles