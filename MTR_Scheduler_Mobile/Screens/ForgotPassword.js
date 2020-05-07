import React, { Component } from 'react';
import {
    KeyboardAvoidingView,
    TouchableOpacity,
    Text,
    Keyboard,
    TextInput,
} from 'react-native';


class ForgotPassword extends Component {

    constructor(props) {
        super(props);


        this.initialState = { email: '' };
        this.state = this.initialState;


    }

    handleSubmit = () => {

        const { email } = this.state;

        Keyboard.dismiss();

        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.mil)+$/;

        if (this.state.email != '') {
            //Check for the First Name TextInput
            if (this.state.emailAddress != '') {
                //Check for the First Name TextInput
                if (reg.test(this.state.emailAddress) === true) {

                    //need to change this to call the email API
                    alert(`${email}`)
                }
                else {
                    alert('Pease Enter Valid EMail');
                }
            } else {
                alert('Please Enter Email Address');
            }
        }
    }


    render() {
        const { email } = this.state;

        return (
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
                <Text style={styles.screenTitle}>Forgot your Password?</Text>


                <TextInput
                    style={styles.textInput}
                    placeholder="Please Enter Email Address"
                    keyboardType="default"
                    returnKeyType="done"
                    blurOnSubmit
                    onChangeText={text => this.setState({ email: text })}
                    value={email}
                />


                <TouchableOpacity style={styles.button} onPress={this.handleSubmit}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>


            </KeyboardAvoidingView>
        );
    }
};

export default ForgotPassword;

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#1A2D55',
    },
    screenTitle: {
        fontSize: 35,
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
    button: {
        backgroundColor: '#9db3e1',
        borderRadius: 3,
        height: 40,
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