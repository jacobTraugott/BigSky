import React, { Component } from 'react';
import { StyleSheet, Text, View, Modal, TouchableHighlight, TouchableOpacity, Dimensions } from 'react-native';

export default class SimpleModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: Dimensions.get('window').width,

        };
        Dimensions.addEventListener('change', (e) => {
            this.setState(e.window);
        })
    }

    closeModal = () => {
        this.props.changeModalVisibility(false);
    }

    render() {
        //let {text} = this.props
        //remarks = this.props.remarks
        debugger
        return (
            <TouchableOpacity activeOpacity={1} disabled={true} style={StyleSheet.contentContainer}>
                <View style={[styles.modal, { width: this.state.width - 80 }]}>
                    <View style={styles.textView}>
                        <Text style={[styles.text, { fontSize: 20 }]}>Remarks</Text>
                        <Text> Yo </Text>
                    </View>
                    <View style={styles.buttonsView}>
                        <TouchableHighlight onPress={() => this.closeModal()} style={styles.touchableHighlight} underlayColor={'#f1f1f1'}>
                            <Text style={styles.text}> Cancel </Text>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={() => this.closeModal()}>
                            <Text style={styles.text}>OK</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        height: 150,
        paddingTop: 10,
        alignSelf: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: "white",
        borderRadius: 10,
    },
    text: {
        margin: 5,
        fontSize: 16,
        fontWeight: 'bold',
    },
    touchableHighlight: {
        flex: 1,
        backgroundColor: 'white',
        paddingVertical: 10,
        alignSelf: 'stretch',
        alignItems: 'center',
        borderRadius: 10,
    },
    textView: {
        flex: 1,
        alignItems: 'center',
    },
    buttonsView: {
        width: '100%',
        flexDirection: 'row',
    }
});