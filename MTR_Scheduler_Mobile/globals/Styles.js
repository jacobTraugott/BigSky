import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#0E182D',
    },
    screenTitle: {
        fontSize: 34,
        fontWeight: '700',
        textAlign: 'center',
        margin: 10,
        marginBottom: 20,
        color: '#FFF',
    },
    fieldHeaders: {
        color: '#ffffff',
        marginTop: 10,
        marginBottom: 4,
        justifyContent: 'flex-start',
    },
    button: {
        backgroundColor: 'rgba(14, 24, 45, .35)',
        borderRadius: 3,
        borderColor: '#FFFFFF',
        borderWidth: 1,
        height: 50,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    screenTitleSmall: {
        fontSize: 20,
        textAlign: 'left',
        margin: 10,
        color: '#FFF',
    },
    textInput: {
        height: 40,
        marginLeft: 10,
        marginRight: 10,
        borderColor: '#FFF',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#FFF',
        paddingHorizontal: 10,
        marginBottom: 10,
        fontSize: 18,
        color: '#3F4EA5',
    },
    picker: {
        margin: 10,
        height: 50,
        width: 100,
        backgroundColor: '#fff'
    },

})