import React, { Component } from 'react';
import { StyleSheet, Text, View, Modal, TouchableHighlight } from 'react-native';
import SimpleModal from './SimpleModal';

export default class MyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
        }
    }
    changeModalVisibility = (bool) => {
        this.setState({ isModalVisible: bool });
    }

    render() {
        remarks = this.props
        debugger
        return (
            <View>
                <TouchableHighlight onPress={() => this.changeModalVisibility(true)} style={styles.touchableHighlight}>
                    <Text style={styles.text}> {this.props.remarks}</Text>
                </TouchableHighlight>
                <Modal visible={this.state.isModalVisible} onRequestClose={() => this.changeModalVisibility(false)} animationType='fade'>
                    <SimpleModal remarks={this.props} changeModalVisibility={this.changeModalVisibility} />
                </Modal>
            </View>
        )
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
        marginVertical: 20,
        fontSize: 20,
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