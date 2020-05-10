import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../constants'

const styles = StyleSheet.create({
    newCommentContainer: {
        marginVertical: 15,
        borderWidth: 2,
        borderColor: colors.MAIN,
        borderRadius: 5,
        paddingBottom: 10,
        justifyContent: 'space-between'
    },

    newComment: {
        backgroundColor: colors.SECONDARY,
        height: 80,
        fontFamily: fonts.REGULAR,
    },

    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        marginTop: 15
    },

    secondaryButton: {
        borderColor: colors.MAIN,
        borderWidth: 1,
        backgroundColor: 'white',
        padding: 5,

    },

    buttonText: {
        color: colors.MAIN,
        fontFamily: fonts.REGULAR

    },
});

export default styles