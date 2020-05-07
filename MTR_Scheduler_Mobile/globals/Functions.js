import React, { Component } from 'react';
import {
    Alert,
    AsyncStorage
} from 'react-native';


baseURL = 'https://mtr-scheduler.herokuapp.com'

/* Get Airframe List APIs */
export function getAirframes() {
    //Create error handling of response code within the fetch and not in the setting of the new state
    this.setState({ loaded: false, error: null })
    
    let jwt = this.state.retrievedKey
    let url = this.baseURL + '/routes/get_airframes';
    let h = new Headers();
    h.append("Authorization", "JWT " + jwt);

    let req = new Request(url, {
        headers: h,
        method: 'GET'
    });

    fetch(req)
        .then(response => response.json().then(this.setState({ statusCode: response.status, statusBool: response.ok, statusString: response.statusText, responseToken: response.headers.map.token, responseData: response })))
        .then(this.showAirframes)
        .catch(this.badStuff)
}

export function showAirframes(apiData) {
    // apiData is assigned a new state here and if apiData == [] it will go into the render if statement and display no scheduled routes
    this.setState({ loaded: true, apiData })

    airframeArray = [];
    let jwt = this.state.responseToken

    if (this.state.statusBool === true) {
        this.storeItem('STORAGE_KEY', jwt)
        apiData.map((key, index) => {
            airframeArray.push({ label: key.airframe_name, value: { key: key.id, value: key.airframe_name } });
        })
        this.setState({ airframeList: airframeArray, retrievedKey: jwt })
    }
    else {
        if (this.state.statusCode >= 400 && this.state.statusCode <= 499) {
            Alert.alert(this.state.statusCode + ': ' + apiData.message + '\n Either your session has expired or there was another issue \n \n For security reasons you have been signed out')
            console.log(this.state.statusCode + ': ' + apiData.message + ' on get_airframes')
        }
        else {
            Alert.alert(this.state.statusCode + ': ' + this.state.statusText + '\n Either your session has expired or there was another issue \n \n For security reasons you have been signed out')
            console.log(this.state.statusCode + ': ' + this.state.statusText + ' on get_airframes')
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

export async function retrieveItem(key) {
    try {
         const retrievedItem = await AsyncStorage.getItem(key);
         const item = JSON.parse(retrievedItem);

         return item;

    } catch (error) {
         console.log(error.message);
    }
    return
}

export async function storeItem(key, item) {
    try {
         //we want to wait for the Promise returned by AsyncStorage.setItem()
         //to be resolved to the actual value before returning the value
         var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
         return jsonOfItem;
    } catch (error) {
         console.log(error.message);
    }
}