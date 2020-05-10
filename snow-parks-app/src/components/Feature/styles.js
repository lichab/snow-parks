import { StyleSheet } from 'react-native'
import { colors, fonts } from '../../constants'

const styles = StyleSheet.create({
    featuresContainer: {
        marginTop: 15,
        marginBottom: 40

    },
    featureContainer: {
        marginVertical: 15,
        borderWidth: 2,
        borderColor: colors.MAIN,
        borderRadius: 5,
        padding: 15,
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    featureData: {
        fontFamily: fonts.REGULAR,
    },
    featureProp: {
        fontFamily: fonts.SEMI,
        paddingBottom: 10,
    },

    propContainer: {
        flex: 1,
        justifyContent: 'space-around'

    },

})

export default styles