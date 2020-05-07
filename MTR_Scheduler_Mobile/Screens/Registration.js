import React, { Component } from 'react';
import {
    Button,
    TouchableOpacity,
    Text,
    Keyboard,
    Image,
    ImageBackground,
    TextInput,
    View,
    Picker,
    SafeAreaView,
    StyleSheet
} from 'react-native';
import PickerBox from 'react-native-picker-box';
import styles from '../globals/Styles';


class Registration extends Component {


    constructor(props) {
        super(props);

        this.initialState = {
            firstName: null,
            lastName: null,
            email: null,
            password: null,
            confirmPassword: null,
            phoneNumber: null,
            base: [
                { label: 'Altus AFB', value: 'Altus AFB' },
                { label: 'Tinker AFB', value: 'Tinker AFB' }
            ],
            selectedValue: '',
            statusCode: null,
            statusBool: null,
            statusString: null,
            loaded: null,
            error: null,
        };
        this.state = this.initialState;


    }

    baseURL = 'https://mtr-scheduler.herokuapp.com'
    // baseURL = 'https://gi4dgmrrhj3gk4ttnfxw4lzrfyytu3lpmnvteltqojuxg3jopfwwy.prism.stoplight.io'

    async PostLogin(email, pass) {
        //Create error handling of response code within the fetch and not in the setting of the new state
        if (email != null && pass != null) {
            this.setState({ loaded: false, error: null })
            let url = this.baseURL + '/api/login';
            let h = new Headers();
            h.append('Content-Type', 'application/json');
            h.append('Accept', 'application/json');

            let req = new Request(url, {
                headers: h,
                body: JSON.stringify({
                    username: this.state.email,
                    password: this.state.password,
                }),
                method: 'POST'
            });

            await fetch(req)
                .then(response => response.text().then(this.setState({ statusCode: response.status, statusBool: response.ok, statusString: response.statusText })))
                .then(this.setToken)
                .catch(this.badStuff)
        }
    }

    setToken = (apiData) => {
        // apiData is assigned a new state here and if apiData == [] it will go into the render if statement and display no scheduled routes
        this.setState({ loaded: true, apiData })
        if (this.state.statusBool === true) {
            this.storeItem("STORAGE_KEY", apiData)
        }
        else {
            Alert.alert(this.state.statusCode + ': ' + this.state.statusText + '\n Please Try Again')
        }
    }

    //Error catching for API call
    badStuff = (err) => {
        this.setState({ loaded: true, error: err.message });
        console.log('Error: ' + err.message)

    }

    handleSubmit = () => {

        const { firstName, lastName, email, password, phoneNumber, selectedValue } = this.state;

        Keyboard.dismiss();

        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.mil)+$/;

        if (this.state.firstName != '') {

            if (this.state.lastName != '') {

                if (this.state.email != '') {

                    if (reg.test(this.state.email) === true) {

                        if (this.state.password != '') {
                            //Check that passwords match
                            if (this.state.password == this.state.confirmPassword) {

                                if (this.state.phoneNumber != '') {

                                    if (this.state.base != '') {

                                        // saveEvent(firstName, lastName, email, password, phoneNumber, selectedValue)
                                        alert(`${firstName} ${lastName}, ${email}, ${password}, ${phoneNumber}, ${selectedValue}`)
                                    }
                                    else {
                                        alert('Please enter Base');
                                    }
                                } else {
                                    alert('Please enter Phone Number');
                                }
                            } else {
                                alert('Password do not match');
                            }
                        } else {
                            alert('Pease enter Password');
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
        let baseItems = this.state.base.map((s, i) => {
            return <Picker.Item value={s} label={s} />
        });

        return (
            <ImageBackground source={require('../assets/C17.jpg')} style={{ width: '100%', height: '100%' }}>
                <SafeAreaView style={{ flex: 1 }}>
                    <View behavior="padding" style={styles.container}>
                        <View style={{ flexDirection: 'column', flex: 1, marginTop: 40 }}>
                            <Image source={require('../assets/MTRHeader.png')} style={{ width: '100%', resizeMode: 'contain' }} />
                        </View>
                        <View style={{ flexDirection: 'column', flex: 2, alignItems: 'center' }}>

                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <View style={{ width: '50%' }}>
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

                                <View style={{ width: '50%' }}>
                                    <Text style={styles.fieldHeaders}>Last Name</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        keyboardType="default"
                                        returnKeyType="done"
                                        blurOnSubmit
                                        onChangeText={text => this.setState({ lastName: text })}
                                        value={lastName}
                                    />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <View style={{ width: '100%' }}>
                                    <Text style={styles.fieldHeaders}>Email</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        keyboardType="default"
                                        returnKeyType="done"
                                        blurOnSubmit
                                        onChangeText={text => this.setState({ email: text })}
                                        value={email}
                                    />
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <View style={{ width: '50%' }}>
                                    <Text style={styles.fieldHeaders}>Password</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="Password"
                                        keyboardType="default"
                                        returnKeyType="done"
                                        blurOnSubmit
                                        onChangeText={text => this.setState({ password: text })}
                                        value={password}
                                    />
                                </View>

                                <View style={{ width: '50%' }}>
                                    <Text style={styles.fieldHeaders}>Confirm Password</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="Confirm Password"
                                        keyboardType="default"
                                        returnKeyType="done"
                                        blurOnSubmit
                                        onChangeText={text => this.setState({ confirmPassword: text })}
                                        value={confirmPassword}
                                    />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <View style={{ width: '50%' }}>
                                    <Text style={styles.fieldHeaders}>Select Base</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="Select Base (temp)"
                                        keyboardType="default"
                                        returnKeyType="done"
                                        blurOnSubmit
                                        onChangeText={text => this.setState({ base: text })}
                                    />
                                    {/* <Picker
                                            style={{marginLeft: 10, height: 40, width: '90%', backgroundColor: '#FFF'}}
                                            onValueChange={(itemValue, itemIndex) => this.setState({ selectedValue: itemValue })}
                                            selectedValue={ this.state.selectedValue }>

                                                <Picker.Item label = 'Altus AFB' value = 'Altus AFB' />
                                                <Picker.Item label = 'Tinker AFB' value = 'Tinker AFB' />
                                        </Picker> */}
                                </View>
                                <View style={{ width: '50%' }}>
                                    <Text style={styles.fieldHeaders}>Phone Number</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        keyboardType="default"
                                        returnKeyType="done"
                                        blurOnSumbit
                                        onChangeText={text => this.setState({ phoneNumber: text })}
                                        value={phoneNumber}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'column', flex: 2, paddingTop: 75, alignItems: 'center' }}>
                            <TouchableOpacity style={styles.button} onPress={this.handleSubmit}>
                                <Text style={styles.buttonText}>Sign Up</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ backgroundColor: 'rgba(0, 0, 0, 0' }} onPress={() => this.props.navigation.navigate('Home')}>
                                <Text style={{ color: '#FFF', fontSize: 16 }}>Go Back</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </ImageBackground>
        );
    }
};

export default Registration;

const local_styles = StyleSheet.create({
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
    fieldHeaders: {
        color: '#ffffff',
        marginLeft: 10,
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
});
