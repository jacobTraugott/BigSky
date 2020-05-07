import React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { consoleWorld } from '../globals/Functions';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class Testing extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={{ justifyContent: 'center', alignItems: 'center' }}>Testing</Text>

                <Button title={'Button'} onPress={consoleWorld}></Button>
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
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#556b2f',

    }
});