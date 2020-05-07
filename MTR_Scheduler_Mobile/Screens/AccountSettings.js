import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    AsyncStorage,
    StatusBar,
    SafeAreaView
} from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import Button from '../component/Button/Button';
import styles from '../globals/Styles';


export default class AccountSettings extends React.Component {
    static navigationOptions =
        {
            title: 'Account',
        };

    componentDidMount() {
        const currentUser = this.retrieveItem('userObj')
        console.log(currentUser)
    }

    async retrieveItem(key) {
        try {
            const retrievedItem = await AsyncStorage.getItem(key);
            const item = JSON.parse(retrievedItem);
            return item;
        } catch (error) {
            console.log(error.message);
        }
        return
    }


    constructor(props) {
        super(props);
    }

    async removeItemValue(key) {
        try {
            await AsyncStorage.removeItem(key);
            return true;
        }
        catch (exception) {
            return false;
        }
    }

    logoff() {
        //Removes the key to log the user out
        AsyncStorage.removeItem('STORAGE_KEY')

        //Navigates back to Login screen when User is logged out
        this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: 'Login'
                })
            ]
        }))
    }

    render() {
        const { navigation } = this.props;
        const email = navigation.getParam('email', 'user@example.com');
        const phoneNumber = navigation.getParam('phoneNumber', '512-867-5309');
        const userRole = navigation.getParam('userRole', 'some default value');
        const base = navigation.getParam('base', 'Why not Minot');
        const firstName = navigation.getParam('firstName', 'Tommy');
        const lastName = navigation.getParam('lastName', 'Tutone');

        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#0E182D' }}>
                <StatusBar barStyle='light-content' />
                <KeyboardAvoidingView behavior="padding" style={styles.container}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.screenTitle}>Account Settings</Text>
                    </View>

                    {/* <View style={{flex: 2, flexDirection: 'column'}}>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <Text style={local_styles.fieldHeaders}>User:</Text>
                            <Text style={local_styles.textStyle}>{firstName} {lastName}</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <Text style={local_styles.fieldHeaders}>User Role:</Text>
                            <Text style={local_styles.textStyle}>{userRole}</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <Text style={local_styles.fieldHeaders}>Email:</Text>
                            <Text style={local_styles.textStyle}>{email}</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <Text style={local_styles.fieldHeaders}>Phone #:</Text>
                            <Text style={local_styles.textStyle}>{phoneNumber}</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <Text style={local_styles.fieldHeaders}>Base:</Text>
                            <Text style={local_styles.textStyle}>{base}</Text>
                        </View>
                    </View> */}

                    <View style={{ width: '100%', alignItems: 'center', flex: 2, flexDirection: 'column' }}>
                        {/* <TouchableOpacity onPress={()=> {this.props.navigation.navigate('Edit')}} style={styles.button}>
                            <Text style={styles.buttonText}>Edit Details</Text>
                        </TouchableOpacity> */}
                        <View style={{ padding: 30 }}>
                            <Text style={local_styles.textStyle}>{'Contact Account Administrator to Edit Account Details'}</Text>
                        </View>

                        <TouchableOpacity style={styles.button} onPress={() => { this.logoff() }}>
                            <Text style={styles.buttonText}>Logoff</Text>
                        </TouchableOpacity>
                    </View>

                </KeyboardAvoidingView>
            </SafeAreaView>

        );

    }
}



const local_styles = StyleSheet.create({
    modalText: {
        fontSize: 15,
    },
    textStyle: {
        fontSize: 25,
        textAlign: 'center',
        margin: 10,
        color: '#FFF',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerContainer: {
        height: 100,
        width: 250,
        opacity: 0.98,
        borderRadius: 6,
        fontSize: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1A2D55',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'rgba(0, 0, 0, .3)',
    },
    screenTitle: {
        fontSize: 35,
        textAlign: 'center',
        margin: 10,
        color: '#FFF',
    },
    textInput: {
        height: 40,
        borderColor: '#FFF',
        borderWidth: 1,
        borderRadius: 3,
        backgroundColor: '#f0ffff',
        paddingHorizontal: 10,
        marginBottom: 10,
        fontSize: 18,
        color: '#556b2f',
    },
    fieldHeaders: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '700',
        margin: 10,
        width: '25%',
        justifyContent: 'flex-end',
    },
    button: {
        backgroundColor: 'rgba(10, 0, 0, 0 )',
        borderColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 5,
        height: 40,
        width: '60%',
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

