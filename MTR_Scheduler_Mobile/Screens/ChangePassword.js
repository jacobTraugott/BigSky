import React, { Component } from 'react';
import { Text, StyleSheet, TouchableOpacity, TextInput, ImageBackground, View } from 'react-native';
import Button from '../component/Button/Button';


class ChangePassword extends Component {

    constructor(props) {
        super(props);


        //set the initial state
        this.initialState = { oldPassword: '', newPassword: '', confirmNewPassword: '' };
        this.state = this.initialState;

        handleSubmit = () => {

            const { newPassword, confirmNewPassword } = this.state;

            Keyboard.dismiss();

            //handle logic for old password matching actual password and password matches confirmnewpassword
            if (newPassword == confirmNewPassword) {
                //save new password
                // async savePassword(newPasswrod) {
                //     try {
                //         await AsyncStorage.setItme('@MyPassword:key', value);
                //     } catch (error) {
                //         alert("Error saving data" + error);
                //     }

                this.props.navigation.navigate('AccountSettings');
            } else {
                alert("Passwords Do Not Match");
            }
        }

    };



    render() {
        const { newPassword, oldPassword, confirmNewPassword } = this.state;

        return (
            <ImageBackground source={require('../assets/C17.jpg')} style={{ width: '100%', height: '100%' }}>
                <View style={styles.container}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={styles.screenTitle}>Account Settings</Text>
                    </View>
                    <View style={{ flex: 2 }}>
                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            <Text style={styles.fieldHeaders}>Old Password:</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Old Password"
                                keyboardType="default"
                                returnKeyType="done"
                                blurOnSubmit
                                onChangeText={text => this.setState({ oldpassword: text })}
                                value={oldPassword}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            <Text style={styles.fieldHeaders}>New Password:</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="New Password"
                                keyboardType="default"
                                returnKeyType="done"
                                blurOnSubmit
                                onChangeText={text => this.setState({ newPassword: text })}
                                value={newPassword}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            <Text style={styles.fieldHeaders}>Confirm New Password:</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Confirm Password"
                                keyboardType="default"
                                returnKeyType="done"
                                blurOnSubmit
                                onChangeText={text => this.setState({ confirmNewPassword: text })}
                                value={confirmNewPassword}
                            />
                        </View>
                        <View style={{ width: '100%', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => { this.handleSubmit() }} style={styles.button}>
                                <Text style={styles.buttonText}>Change Password</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        );
    }
}

export default ChangePassword;

const styles = StyleSheet.create({
    modalText: {
        fontSize: 15,
    },
    textStyle: {
        fontSize: 20,
        textAlign: 'left',
        margin: 10,
        color: 'white',
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
        width: '65%',
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
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 10,
        width: '29%',
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

