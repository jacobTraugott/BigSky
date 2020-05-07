import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, Button, AsyncStorage, ActivityIndicator, Animated, ScrollView, Easing, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';
import Card from '../component/Card/Card';
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
import styles from '../globals/Styles';
import { NavigationActions, StackActions } from 'react-navigation';

class DashboardScreen extends Component {
    static navigationOptions =
        {
            title: 'Home',
            header: null
        };
    constructor(props) {
        super(props);
        this.state = {
            activeSections: [],
            data: null,
            item: null,
            statusCode: null,
            statusBool: null,
            statusString: null,
            responseToken: null,
            responseData: null,
            retrievedKey: null,
            loaded: true,
            error: null,
            expanded: false,
            spinValue: new Animated.Value(0),
        }
        //Declare this as a global variable to be accessed within renderHeader function
        _this = this
    }

    baseURL = 'https://mtr-scheduler.herokuapp.com'

    //Gets data from API POST, GET, Etc..
    getData = (ev) => {
        this.setState({ loaded: false, error: null })

        let jwt = this.state.retrievedKey
        let url = this.baseURL + '/routes/get_scheduled';

        let h = new Headers();
        h.append('Authorization', 'JWT ' + jwt);

        let req = new Request(url, {
            headers: h,
            method: 'POST'
        });

        fetch(req)
            .then(response => response.json().then(this.setState({
                statusCode: response.status,
                statusBool: response.ok,
                statusString: response.statusText,
                responseToken: response.headers.map.token,
                responseData: response
            })))
            .then(this.showData)
            .catch(this.badStuff)
    }

    showData = (data) => {
        // Data is assigned a new state here and if data == [] it will go into the render if statement and display no scheduled routes
        this.setState({ loaded: true, data })
        let jwt = this.state.responseToken

        if (this.state.statusBool) {
            this.storeItem('STORAGE_KEY', jwt)
        }
        else {
            AsyncStorage.removeItem('STORAGE_KEY')

            this.props.navigation.dispatch(StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({
                        routeName: 'Login'
                    })
                ]
            }))
        }

    }

    deleteEvent = (ev) => {
        this.setState({ loaded: false, error: null })

        let jwt = this.state.retrievedKey
        let url = this.baseURL + '/routes/delete_event';

        let h = new Headers();
        h.append('Authorization', 'JWT ' + jwt);
        h.append('Content-Type', 'application/json')

        let req = new Request(url, {
            headers: h,
            body: JSON.stringify({
                event_id: ev
            }),
            method: 'POST'
        });

        fetch(req)
            .then(response => response.json().then(this.setState({
                statusCode: response.status,
                statusBool: response.ok,
                statusString: response.statusText,
                responseToken: response.headers.map.token,
                responseData: response
            })))
            .then(this.showDelete)
            .catch(this.badStuff)
    }

    showDelete = (data) => {
        // data is assigned a new state here and if data == [] it will go into the render if statement and display no scheduled routes
        this.setState({ loaded: true, data })

        let jwt = this.state.responseToken

        if (this.state.statusBool === true) {
            this.storeItem('STORAGE_KEY', jwt)
            this.setState({ retrievedKey: jwt })

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
            if (this.state.statusCode >= 400 && this.state.statusCode <= 499) {
                Alert.alert(this.state.statusCode + ': ' + data.message + '\n Either your session has expired or there was another issue \n \n For security reasons you have been signed out')
                console.log(this.state.statusCode + ': ' + data.message + ' on delete_event')
            }
            else {
                Alert.alert(this.state.statusCode + ': ' + this.state.statusText + '\n Either your session has expired or there was another issue \n \n For security reasons you have been signed out')
                console.log(this.state.statusCode + ': ' + this.state.statusText + ' on delete_event')
            }
            AsyncStorage.removeItem('STORAGE_KEY')

            this.props.navigation.dispatch(StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({
                        routeName: 'Login'
                    })
                ]
            }))
        }
    }

    /* Error Catching */
    badStuff = (err) => {
        this.setState({ loaded: true, error: err.message });
        console.log('Error: ' + err.message)

        if (this.state.statusCode >= 400 && this.state.statusCode <= 499) {
            Alert.alert(this.state.statusCode + ': ' + data.message + '\n Either your session has expired or there was another issue \n \n For security reasons you have been signed out')
            console.log(this.state.statusCode + ': ' + data.message + ' on an api call')
        }
        else {
            Alert.alert(this.state.statusCode + ': ' + this.state.statusText + '\n Either your session has expired or there was another issue \n \n For security reasons you have been signed out')
            console.log(this.state.statusCode + ': ' + this.state.statusText + ' on an api call')
        }
        AsyncStorage.removeItem('STORAGE_KEY')

        this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: 'Login'
                })
            ]
        }))
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

    //Initializes API call upon launch of the mount
    //ComponentDidMount is called during the LifeCycle after the View has rendered and the data is loaded
    async componentDidMount() {
        this.setState({ loaded: false })

        const userCred = await this.retrieveItem("STORAGE_KEY")
        this.setState({ retrievedKey: userCred })

        this.getData()
        showMessage({
            message: "Route Successfully Scheduled",
            duration: 1850,
            type: "success",
        });
    }

    //Assigns the content of the data retrieved from GetRoutesScheduled API
    _renderSectionTitle = section => {
        return (
            <View style={styles.content}>
                <Text>{section.content}</Text>
            </View>
        );
    };

    //Creates the card with all route info thats in the SECTIONS array
    _renderHeader = (section, index, isActive, sections) => {
        //Gets the current state of spinValue to be used for remarks dropdown arrow animation
        _this.state.spinValue.setValue(0)

        // Sets up animation for dropdown arrow used to display remarks
        Animated.timing(
            _this.state.spinValue,
            {
                toValue: 1,
                duration: 200,
                easing: Easing.linear,
                useNativeDriver: true
            }
        ).start()
        return (
            <Animatable.View
                duration={1000}
                transition="backgroundColor"
                style={{ backgroundColor: (isActive ? '#0E182D' : '#0E182D') }}>
                {index != 0 &&
                    <View
                        style={{
                            borderBottomColor: '#696969',
                            borderBottomWidth: 1,
                        }}
                    />}
                {/*Below creates the cards for each Route Object in a list format*/}
                <Card item={section} spinValue={_this.state.spinValue} isActive={isActive} />
                <Button title='Delete Event' color='#a82525' onPress={() => {
                    Alert.alert(
                        'Delete Event',
                        'Are you sure you would like to delete this Event?',
                        [
                            {
                                text: 'Cancel',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel',
                            },
                            { text: 'OK', onPress: () => this.deleteEvent(section.event_id) },
                        ],
                        { cancelable: false },
                    );
                }} />
            </Animatable.View>
        );
    }



    //Makes the remarks portion of the card and animates it with Animatable library
    _renderContent = (section, i, isActive, sections) => {
        return (
            <Animatable.View
                duration={100}
                transition="backgroundColor"
                style={{ backgroundColor: 'rbga(34, 44, 66, .6', borderRadius: 8 }}>
                <Animatable.Text
                    duration={200}
                    easing="ease-in"
                    // animation={'fadein'}
                    style={{ color: '#fff', borderRadius: 15, padding: 10 }}>
                    {section.remarks}
                </Animatable.Text>

            </Animatable.View>
        );
    }

    // Updates the active "Section"(Card) for the Accordion view
    _updateSections = activeSections => {
        this.setState({ activeSections });
    };

    render() {
        const { navigation } = this.props;
        const statusCode = navigation.getParam('statusCode', 'No Code');

        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#0E182D' }}>
                <StatusBar barStyle='light-content' />
                {/*If the API call encounters any error it will display in this conditional*/}
                {this.state.error && (
                    <Text style={styles.err}>{this.state.error}</Text>
                )}

                {/*Takes data into conditional and is there is any data it will display it in the Accordion allowing the remarks dropdown*/}
                {this.state.data && this.state.data.length > 0 && (
                    <ScrollView style={local_styles.container}>
                        <View>
                            <Text style={styles.screenTitle}>Upcoming Routes</Text>
                        </View>
                        <Accordion
                            sections={this.state.data}
                            onChange={this._updateSections}
                            activeSections={this.state.activeSections}
                            renderSectionTitle={this._renderSectionTitle}
                            renderHeader={this._renderHeader}
                            renderContent={this._renderContent}
                            style={{ paddingTop: 40, backgroundColor: 'rgba(0, 0, 0, 0)' }}
                        />
                    </ScrollView>
                )}

                {/*If the API call has no roues then it will display "No Routes Available" and give you a button to schedule a new route*/}
                {/*Data must == [] to display No Scheduled Routes!!!*/}
                {this.state.data && this.state.data.length == 0 && (
                    <View style={local_styles.container2}>
                        <Text style={{ fontSize: 28, color: '#FFF', paddingBottom: 20 }}>
                            NO UPCOMING ROUTES
                        </Text>
                        <TouchableOpacity style={styles.button} onPress={() => { this.props.navigation.navigate('Schedule') }}>
                            <Text style={styles.buttonText}>Schedule</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/*If the API call isn't done it displays "loading"*/}
                {!this.state.loaded &&
                    <View style={local_styles.loading}>
                        <ActivityIndicator size='large' color='#C3A266' />
                    </View>
                }
                {statusCode == 200 &&
                    <FlashMessage position="top" />
                }
            </SafeAreaView>
        );
    }
}
export default DashboardScreen;

const local_styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        backgroundColor: '#0E182D',
        flex: 1,
    },
    container2: {
        paddingHorizontal: 20,
        backgroundColor: '#0E182D',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    button: {
        backgroundColor: '#2f4f4f',
        borderRadius: 3,
        height: 70,
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
        alignContent: "center"
    },
    scrollView: {
        backgroundColor: 'pink',
        marginHorizontal: 20,
    },
    card: {
        borderRadius: 5,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        marginBottom: 10,
        marginLeft: '2%',
        width: '96%',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 1,
        shadowOffset: {
            width: 3,
            height: 3
        }
    },
    cardImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover'
    },
    cardText: {
        padding: 10,
        fontSize: 16,
        color: '#fff',
    },
    image1: {
        height: 10,
        width: 10,
    },
    image2: {
        height: 1,
        width: 1,
        transform: [{ rotate: '1800deg' }]
    },
    err: {
        flex: 1,
        fontSize: 30,
        justifyContent: 'center',
        alignSelf: 'center'
    }
});