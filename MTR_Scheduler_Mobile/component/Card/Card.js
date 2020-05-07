import React from 'react';
import { StyleSheet, Text, View, Animated, Alert, AsyncStorage } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';

export default class Card extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            statusCode: null,
            statusBool: null,
            statusString: null,
            responseToken: null,
            responseData: null,
            data: null,
            error: null,
            loaded: true
        }
    }

    render() {
        //Create local variables from amount to rotate(spinValue) and active status variable passed from parent of DashboardScreen.js
        spinValue = this.props.spinValue;
        isActive = this.props.isActive;
        monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
        var parts = this.props.item.date.slice().split('T')
        var dateComponent = parts[0];
        var timeComponent = parts[1];
        slicedTime = timeComponent.split(':')
        var time = slicedTime[0] + ':' + slicedTime[1]
        dateParts = dateComponent.split('-')

        months = monthList[dateParts[1] - 1]
        year = dateParts[0][2] + dateParts[0][3]
        day = dateParts[2]

        var date = day + ' ' + months + ' ' + year

        return (
            <View style={styles.card}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View>
                        <Text style={styles.cardRoute}>{this.props.item.route}</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={styles.cardDate}>{date}</Text>
                    </View>
                    {/* <Text style={styles.cardText}>Entry Point: {this.props.item.entry_point}</Text> */}
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.cardText}>CS: {this.props.item.callsign}</Text>

                    <View style={{ flex: 1 }}>
                        <Text style={[{ alignSelf: 'flex-end', justifyContent: 'flex-end' }, styles.cardText]}>{this.props.item.aircraft_count + ' x ' + this.props.item.airframe}</Text>
                    </View>
                </View>


                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={styles.cardText}>{'Entry Point: ' + this.props.item.entry_point + ' - ' + time + ' (Z)'}</Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.cardText}>Exit Point: {this.props.item.exit_point}</Text>
                    <Text style={[{ justifyContent: 'flex-end', alignSelf: 'flex-end' }, styles.cardText]}>GS: {this.props.item.ground_speed}</Text>

                    <View style={{ flex: 1, paddingTop: 5 }}>
                        <Animated.Image
                            source={require('../../assets/white_arrow.png')}
                            style={
                                isActive == true ? {
                                    width: 30,
                                    height: 30,
                                    alignSelf: 'flex-end',
                                    transform: [{ rotate: spinValue.interpolate({ inputRange: [1, 2], outputRange: ["180deg", "0deg"] }) }]
                                }
                                    : !isActive ? {
                                        width: 30,
                                        height: 30,
                                        alignSelf: 'flex-end',
                                        transform: [{ rotate: spinValue.interpolate({ inputRange: [1, 2], outputRange: ["0deg", "0deg"] }) }]
                                    }
                                        : {
                                        }
                            }
                        />
                    </View>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    {/* <Button title='Delete Event' color='#FFFFFF' onPress={() => {
                            Alert.alert(
                                'Delete Event',
                                'Are you sure you would like to delete this Event?',
                                [
                                {
                                    text: 'Cancel',
                                    onPress: () => console.log('Cancel Pressed'),
                                    style: 'cancel',
                                },
                                {text: 'OK', onPress: () => this.deleteEvent(this.props.item.event_id)},
                                ],
                                {cancelable: false},
                            );
                        }}/> */}

                    {/* <Text style={{fontSize: 16, color: '#FFFFFF', textAlignVertical: 'bottom'}}>Remarks</Text> */}
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    card: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        marginBottom: 10,
        marginLeft: '2%',
        width: '96%',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 1,
        shadowOffset: {
            width: 3,
            height: 3
        }
    },
    cardImage: {
        width: 40,
        height: 40,
    },
    cardText: {
        fontWeight: '300',
        padding: 10,
        fontSize: 16,
        color: '#fff',
    },
    boldedCardText: {
        fontWeight: '500',
        padding: 10,
        fontSize: 16,
        color: '#fff',
    },
    cardRoute: {
        padding: 10,
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold'
    },
    cardDate: {
        padding: 10,
        fontWeight: '500',
        fontSize: 16,
        textAlignVertical: 'bottom',
        justifyContent: 'flex-end',
        alignSelf: 'flex-end',
        color: '#fff',
    },
});