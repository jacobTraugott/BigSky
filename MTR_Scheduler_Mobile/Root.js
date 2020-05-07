import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator, createAppContainer, } from 'react-navigation';
import DashboardScreen from './Screens/DashboardScreen';
import ScheduleStack from './ScheduleNav';
import AccountStack from './AccountNav';
import Testing from './Screens/Testing';

const MainApp = createBottomTabNavigator(
  {
    Home: DashboardScreen,
    Schedule: ScheduleStack,
    Account: AccountStack
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: ({ navigation }) => ({
      headerMode: 'none',
      header: null,
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        if (routeName === 'Home') {
          return (
            <Image
              source={require('./assets/home.png')}
              style={{ width: 30, height: 30, }} />
          );
        } else if (routeName === 'Schedule') {
          return (
            <Image
              source={require('./assets/schedule.png')}
              style={{ width: 30, height: 30 }} />
          );
        } else if (routeName === 'Account') {
          return (
            <Image
              source={require('./assets/account.png')}
              style={{ width: 30, height: 30 }} />
          );
        }
  
      },
    }),
    tabBarOptions: {
      activeTintColor: 'gold',
      inactiveTintColor: 'white',
      style: { backgroundColor: '#1A2D55', },
    },
  },

);


export default createAppContainer(MainApp);