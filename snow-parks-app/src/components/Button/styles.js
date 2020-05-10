import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    main: {
        backgroundColor: colors.SECONDARY,
        width: 250,
        flex: 0.11,
        borderRadius: 5,
        justifyContent: 'center'
    },
    danger: {
        backgroundColor: 'red',
        flex: 0.1,
        width: 100,
        borderRadius: 5,
        justifyContent: 'center'
    },
    good: {
        backgroundColor: 'green',
        flex: 0.1,
        width: 100,
        borderRadius: 5,
        justifyContent: 'center'
    },
    facebook: {
        backgroundColor: '#4267b2',
        flex: 0.18,
        color: 'white',
        borderRadius: 5,
        justifyContent: 'center',
        width: 300,
    },
    bold: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 1,
        color: 'black',
        marginTop: '30%'
    },
    filter: {
        height: '100%'
    },
    text: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 1,
        color: colors.MAIN

    },
    anchor: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '400',
        letterSpacing: 1,
        color: colors.MAIN
    }
})

export default styles