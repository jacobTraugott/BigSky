import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';


export default class Button extends TouchableOpacity {
    render = () => {
        console.log(this.props.item.content);
        return (
            <TouchableOpacity style={myStyles.button}>
                <Text style={myStyles.buttonText}>{this.props.item}</Text>
            </TouchableOpacity>
        );
    }
}

const myStyles = StyleSheet.create({
    button: {
        backgroundColor: 'rgba(10, 0, 0, 0 )',
        borderColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 5,
        height: 40,
        width: '60%',
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
