import React, { Component } from 'react';
import {
    KeyboardAvoidingView,
    TouchableOpacity,
    Text,
    Keyboard,
    TextInput,
    ImageBackground,
    View
} from 'react-native';

class Registration extends Component {

    constructor(props) {
        super(props);


        this.initialState = {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            base: [
                { label: 'Altus AFB', value: 'Altus AFB' },
                { label: 'Tinker AFB', value: 'Tinker AFB' }
            ],
            selectedValue: ''
        };
        this.state = this.initialState;


    }

    handleSubmit = () => {

        const { firstName, lastName, email, phoneNumber, selectedValue } = this.state;

        Keyboard.dismiss();

        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.mil)+$/;

        if (this.state.firstName != '') {

            if (this.state.lastName != '') {

                if (this.state.email != '') {

                    if (reg.test(this.state.email) === true) {


                        if (this.state.phoneNumber != '') {

                            if (this.state.base != '') {

                                //Change this to API call to register user
                                alert(`${firstName} ${lastName}, ${email}, ${phoneNumber}, ${selectedValue}`)
                            }
                            else {
                                alert('Please enter Base');
                            }
                        } else {
                            alert('Please enter Phone Number');
                        }
                    } else {
                        alert('Please enter valid Email Address');
                    }
                } else {
                    alert('Please enter Email Address');
                }
            } else {
                alert('Please enter Last Name');
            }
        } else {
            alert('Please enter First Name');
        }

    }


    render() {
        const { firstName, lastName, email, password, confirmPassword, phoneNumber, selectedValue } = this.state;

        return (
            <ImageBackground source={require('../assets/C17.jpg')} style={{ width: '100%', height: '100%' }}>
                <View style={styles.container}>
                    <View style={{ flex: 2 }}>
                        <Text style={styles.screenTitle}>Edit User</Text>
                    </View>
                    <View style={{ flex: 4 }}>
                        <View style={{ flexDirection: 'row', flex: 1, width: '100%' }}>
                            <Text style={styles.fieldHeaders}>First Name</Text>
                            <TextInput
                                style={styles.textInput}
                                keyboardType="default"
                                returnKeyType="done"
                                blurOnSubmit
                                onChangeText={text => this.setState({ firstName: text })}
                                value={firstName}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', flex: 1, width: '100%' }}>
                            <Text style={styles.fieldHeaders}>Last Name</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Last Name"
                                keyboardType="default"
                                returnKeyType="done"
                                blurOnSubmit
                                onChangeText={text => this.setState({ lastName: text })}
                                value={lastName}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', flex: 1, width: '100%' }}>
                            <Text style={styles.fieldHeaders}>Email</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Email Address"
                                keyboardType="default"
                                returnKeyType="done"
                                blurOnSubmit
                                onChangeText={text => this.setState({ email: text })}
                                value={email}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', flex: 1, width: '100%' }}>
                            <Text style={styles.fieldHeaders}>Phone Number</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Phone #"
                                keyboardType="numeric"
                                returnKeyType="done"
                                blurOnSubmit
                                onChangeText={text => this.setState({ phoneNumber: text })}
                                value={phoneNumber}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', flex: 1, width: '100%' }}>
                            <Text style={styles.fieldHeaders}>Base</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Base"
                                keyboardType="default"
                                returnKeyType="done"
                                blurOnSubmit
                            />
                        </View>
                    </View>

                    <View style={{ flex: 4, width: '100%', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => { this.handleSubmit }} style={styles.button}>
                            <Text style={styles.buttonText}>Save Details</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        );
    }
}

export default Registration;

const styles = {
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'rgba(0, 0, 0, .3)',
    },
    screenTitle: {
        fontSize: 36,
        textAlign: 'center',
        margin: 10,
        color: '#FFF',
    },
    screenTitleSmall: {
        fontSize: 20,
        textAlign: 'left',
        margin: 10,
        color: '#FFF',
    },
    textInput: {
        height: 40,
        width: '60%',
        borderColor: '#FFF',
        borderWidth: 1,
        borderRadius: 3,
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
    fieldHeaders: {
        color: '#ffffff',
        marginLeft: 10,
        width: '30%',
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
};
