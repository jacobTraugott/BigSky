import React, { Component } from 'react';
import LoginScreen from '../Screens/LoginScreen';
import Root from '../Root';
import { createStackNavigator, createAppContainer } from 'react-navigation';

const RootStack = createStackNavigator(
  {
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        header: null,
      }
    },
    TabNav: {
      screen: Root,
      navigationOptions: {
        header: null,
      }
    }
  },
  {
    initialRouteName: 'Login',
    header: null,
  }
);
console.disableYellowBox = true;

const AppContainer = createAppContainer(RootStack);

export default AppContainer