import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import ChangePassword from './Screens/ChangePassword';
import AccountEdit from './Screens/AccountEdit';
import AccountSettings from './Screens/AccountSettings';
import AppLoggedContainer  from './App';

const AccountStack= createStackNavigator(
  {
    Account: AccountSettings,
    Edit: AccountEdit,
    ChangePassword: ChangePassword,
  },
  {
    initialRouteName: 'Account',
    headerMode: 'none',
  }
);

const AccountStackContainer = createAppContainer(AccountStack);

export default AccountStack;