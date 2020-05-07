import React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';

class Details extends React.Component {
    static navigationOptions =
        {
            title: 'Settings',
        };
    render() {
        //    // 2. Get the param, provide a fallback value if not available 
        //    const { navigation } = this.props;
        //    const itemId = navigation.getParam('itemId', 'NO-ID');
        //    const otherParam = navigation.getParam('otherParam', 'some default value');
        //    const firstName = navigation.getParam('firstName', 'some default value');
        //    const lastName = navigation.getParam('lastName', 'some default value');

        return (
            <View style={styles.container}>
                <View style={styles.innerContainer}>
                    <Text>Settings</Text>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    modalText: {
        fontSize: 15,
    },
    modalContainer: {
        height: 100,
        width: 300,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'grey',
    },
    innerContainer: {
        height: 100,
        width: 250,
        opacity: 0.98,
        borderRadius: 6,
        fontSize: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#696969',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#556b2f',

    }
});
export default Details;

