import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../constants'

const styles = StyleSheet.create({
    commentContainer: {
        marginVertical: 15,
        borderWidth: 2,
        borderColor: colors.MAIN,
        borderRadius: 5,
        padding: 15,
        backgroundColor: colors.SECONDARY,
        justifyContent: 'space-between',
    },

    commentPublisher: {
        fontFamily: fonts.SEMI
    },

    commentHeader: {
        paddingBottom: 5,
    },
    commentBody: {
        paddingVertical: 15
    },

    commentBodyText: {
        fontFamily: fonts.REGULAR,
    },
    commentFooter: {
        width: '30%',
        alignSelf: 'flex-end'
    },
    image: {
        width: '100%',
        height: 200
    },
});

export default styles