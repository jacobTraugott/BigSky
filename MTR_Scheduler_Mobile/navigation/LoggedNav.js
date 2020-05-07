import React, { Component } from 'react';
import LoginScreen from '../Screens/LoginScreen';
import Root from '../Root';
import { createStackNavigator, createAppContainer } from 'react-navigation';


console.disableYellowBox = true;
const RootLoggedStack = createStackNavigator(
  {
    TabNav: {
      screen: Root,
      navigationOptions: {
        header: null,
      }
    },
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        header: null,
      }
    }
  },
  {
    initialRouteName: 'TabNav',
    header: null,
  }
);

const AppLoggedContainer = createAppContainer(RootLoggedStack);

export default AppLoggedContainer;