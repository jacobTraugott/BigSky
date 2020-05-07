import React from 'react';
import {
    StyleSheet,
    KeyboardAvoidingView,
    Text,
    Keyboard,
    TextInput,
    TouchableOpacity,
    Alert,
    Modal,
    TouchableHighlight,
    View,
    AsyncStorage,
    Image,
    ImageBackground,
    ActivityIndicator,
    SafeAreaView
} from 'react-native';
import { NavigationActions, StackActions, createStackNavigator, createAppContainer } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Registration from './Registration';
import ForgotPassword from './ForgotPassword';
import styles from '../globals/Styles'

class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        // define the initial state, so we can use it later
        // when we'll need to reset the form
        this.initialState = {
            email: '',
            password: '',
            modalVisible: false,
            validation: false,
            loaded: true,
            statusCode: null,
            statusBool: null,
            statusString: null,
            apiData: null
        };

        this.state = this.initialState;
    }

    baseURL = 'https://mtr-scheduler.herokuapp.com'

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
                .then(response => response.json().then(this.setState({
                    statusCode: response.status,
                    statusBool: response.ok,
                    statusString: response.statusText,
                })))
                .then(this.setToken)
                .catch(this.badStuff)
        }
    }

    setToken = (apiData) => {
        // apiData is assigned a new state here and if apiData == [] it will go into the render if statement and display no scheduled routes
        this.setState({ loaded: true, retrievedKey: apiData })
        let jwt = this.state.retrievedKey

        if (this.state.statusBool === true && jwt != null & jwt != '') {
            this.storeItem("STORAGE_KEY", jwt.token)

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

    async storeItem(key, item) {
        try {
            //we want to wait for the Promise returned by AsyncStorage.setItem()
            //to be resolved to the actual value before returning the value
            var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
            return jsonOfItem;
        } catch (error) {
            console.log(error.message);
        }
    }

    setModalInvisible() {
        this.setState({ modalVisible: false });
    }
    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    /*
    Validate function is used to ensure it is a correctly formatted .mil email.
    Once verified the email is formatted correctly it will change it to all lowercase so the 
    it is not case sensitive when the user enters it into the email form field.
    */
    validate = (text) => {
        text = text.nativeEvent.text;
        textlower = text.toLowerCase()

        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(textlower) === false && textlower != '') {
            this.setState({ email: textlower, validation: false })
            alert('Please use a valid email format');
            return false;
        }
        else {
            this.setState({ email: textlower, validation: true })
            console.log("Email is Correct");
            return true
        }
    }

    /*
    Submit handles the input user information for login and verifies it is not blank and fits reg expression.
    After verifying reg expression, it will run the API call to get a JWT (JSON Web Token) to be passed as the user verification on each screen.
    Lastly, if the API call is successfuly it will navigate to DashboardScreen.js or in the case of an error it will alert the user to try again.
    */
    async handleSubmit() {
        const { email, password, user, validation } = this.state;
        Keyboard.dismiss();

        if (email === '') {
            alert('Email is Required');
        }
        else if (password === '') {
            alert('Password is Required');
        }
        else {
            await this.PostLogin(email, password)

            if (this.state.statusBool) {
                this.props.navigation.dispatch(StackActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({
                            routeName: 'TabNav'
                        })
                    ]
                }))
            }
            else {
                alert('Something went wrong.\nPlease Try Again')
            }
        }
    };


    render() {
        const { email, password, user } = this.state;

        return (
            <ImageBackground source={require('../assets/C17.jpg')} style={{ height: '100%', width: '100%' }}>
                <SafeAreaView style={{ flex: 1 }}>
                    <KeyboardAwareScrollView>
                        <KeyboardAvoidingView behavior="padding" style={local_styles.container}>
                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', paddingTop: 40, paddingBottom: 20 }}>
                                <Image source={require('../assets/MTRHeader.png')} style={{ width: '100%', resizeMode: 'contain' }} />
                            </View>

                            <View style={{ width: '70%', flex: 1 }}>
                                <Text style={styles.fieldHeaders}>Email</Text>
                                <TextInput
                                    style={{ ...styles.textInput, marginLeft: 0, marginRight: 0 }}
                                    placeholder="Email Address"
                                    onChangeText={text => this.setState({ email: text })}
                                    onBlur={(text) => this.validate(text)}
                                    returnKeyType="done"
                                    value={this.state.email}
                                />
                                <Text style={styles.fieldHeaders}>Password</Text>
                                <TextInput
                                    style={{ ...styles.textInput, marginLeft: 0, marginRight: 0 }}
                                    placeholder="Password"
                                    keyboardType="default"
                                    secureTextEntry={true}
                                    returnKeyType="done"
                                    blurOnSubmit
                                    onChangeText={text => this.setState({ password: text })}
                                    value={password}
                                />
                            </View>

                            <Modal
                                animationType="fade"
                                transparent={true}
                                visible={this.state.modalVisible}
                                onRequestClose={() => {
                                    Alert.alert('Incorrect Credentials \n Please Try Again');
                                }}>
                                <View style={local_styles.modalContainer}>
                                    <View style={local_styles.innerContainer}>
                                        <TouchableHighlight
                                            onPressIn={() => {
                                                this.setModalVisible(!this.state.modalVisible);
                                            }}>
                                            <Text style={styles.modalText}>Incorrect Credentials{'\n'} Please Try Again</Text>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                            </Modal>

                            <View style={{ width: '100%', flex: 1, alignItems: 'center', justifyContent: 'top' }}>


                                <TouchableOpacity style={{ ...styles.button, marginTop: 20, marginBottom: 20 }} onPress={() => {
                                    this.handleSubmit();
                                }}>
                                    <Text style={styles.buttonText}>Log In</Text>
                                </TouchableOpacity>

                                {/* Create Account shall be commented until Registration functionality is enabled for Mobile App */}
                                {/* <TouchableOpacity style={{backgroundColor: 'rgba(0, 0, 0, 0'}} onPress={() => this.props.navigation.navigate('Registration')}>
                                    <Text style={{color: '#FFF', fontSize: 16}}>Create Account</Text>
                                </TouchableOpacity> */}
                            </View>

                        </KeyboardAvoidingView>
                    </KeyboardAwareScrollView>
                    {!this.state.loaded &&
                        <View style={local_styles.loading}>
                            <ActivityIndicator size='large' color='#C3A266' />
                        </View>
                    }
                </SafeAreaView>
            </ImageBackground>
        );
    }
}


const AppNavigator = createStackNavigator(
    {
        Home: LoginScreen,
        Registration: Registration,
        ForgotPassword: ForgotPassword
    },
    {
        initialRouteName: "Home",
        headerMode: 'none',
    }
);

export default createAppContainer(AppNavigator)

const local_styles = StyleSheet.create({
    modalText: {
        color: '#FFF',
        fontSize: 15,
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
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        alignItems: 'center'
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.5,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    },
    screenTitle: {
        fontSize: 36,
        textAlign: 'center',
        margin: 10,
        color: '#FFF',
    },
    textInput: {
        height: 40,
        width: '100%',
        borderColor: '#FFF',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#f0ffff',
        paddingHorizontal: 10,
        marginBottom: 10,
        fontSize: 18,
        color: '#556b2f',
    },
    fieldHeaders: {
        color: '#ffffff',
        marginLeft: 10,
        width: '100%',
        justifyContent: 'flex-end',
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