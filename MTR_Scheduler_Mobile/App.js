import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import AppLoggedContainer from './navigation/LoggedNav';
import AppContainer from './navigation/DefaultContainer';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      isUserLoggedIn: false
    };
    this.state = this.initialState;
  }

  componentDidMount() {
    let jwt = this.retrieveItem("STORAGE_KEY");
    if (jwt != '' && jwt != null) {
      this.setState({ isUserLoggedIn: true })
    }
    else {
      this.setState({ isUserLoggedIn: false })
    }
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

  render() {
    if (this.state.isUserLoggedIn) {
      return <AppContainer />
    }
    else {
      return <AppContainer />
    }
  }
}