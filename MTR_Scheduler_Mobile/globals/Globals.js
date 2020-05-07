import { StyleSheet } from 'react-native';
//import { NavigationActions, StackActions } from 'react-navigation';

export default class Globals {

    logoff() {
        //Removes the key to log the user out
        //AsyncStorage.removeItem('STORAGE_KEY')

        //Navigates back to Login screen when User is logged out
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
