import { StyleSheet } from 'react-native'
import { colors, fonts } from '../../constants'

const styles = StyleSheet.create({
    settingsContainer: {
        flex: 1,
        backgroundColor: colors.BACKGROUND,
        paddingHorizontal: 15,
        paddingVertical: 50
    },

    topSettings: {
        flex: 1
    },

    inputsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 25,
        paddingVertical: 15,
    },

    label: {
        fontFamily: fonts.REGULAR

    },

    sectionHeader: {
        fontFamily: fonts.SEMI,
        alignSelf: 'center'
    },

    textInput: {
        height: '160%',
        backgroundColor: colors.MAIN,
        width: '60%',
        alignSelf: 'flex-end',
        paddingHorizontal: 10,
        borderColor: colors.SECONDARY,
        borderWidth: 2,
        color: colors.SECONDARY,
    },

    bottomSettings: {
        marginVertical: 10
    },

    actionButton: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: colors.MAIN,
        height: 40,
        width: 150,
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },

    buttonText: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: fonts.SEMI,
        letterSpacing: 1,
        color: colors.MAIN

    }
})

export default styles