import React from 'react';
import { Alert, View, Text, StyleSheet, StatusBar, ActivityIndicator, TouchableOpacity, TextInput, SafeAreaView, AsyncStorage, Keyboard } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import RNPickerSelect from 'react-native-picker-select';
import styles from '../globals/Styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class FinalSchedule extends React.Component {
     static navigationOptions =
          {
               title: 'Final Schedule',
          };

     constructor(props) {
          super(props);

          // define the initial state, so we can use it later
          // when we'll need to reset the form
          this.inputRefs = {};
          this.initialState = {
               data: null,
               loaded: true,
               error: null,
               routeId: null,
               entryTime: '',
               exitTime: '',
               remarks: '',
               modalVisible: false,
               selectedValue: '',
               enT: [],
               statusCode: null,
               statusBool: null,
               statusString: null,
               responseToken: null,
               responseData: null,
               retrievedKey: null,
          };

          this.state = this.initialState;
     }

     baseURL = 'https://mtr-scheduler.herokuapp.com'

     async scheduleEventFetch(routeid, starttime, entrypointid, exitpointid, speed, callsign, remarks, airframevalue, aircraftCount) {
          //Create error handling of response code within the fetch and not in the setting of the new state
          if (routeid != null && routeid != '' && routeid != undefined) {
               this.setState({ loaded: false, error: null })

               let jwt = this.state.retrievedKey
               let url = this.baseURL + '/routes/post_schedule';

               let h = new Headers();
               h.append("Authorization", "JWT " + jwt);
               h.append("Content-Type", "application/json")

               let req = new Request(url, {
                    headers: h,
                    body: JSON.stringify({
                         route_id: routeid,
                         start_time: starttime,
                         entry_point_id: entrypointid,
                         exit_point_id: exitpointid,
                         speed: speed,
                         callsign: callsign,
                         remarks: remarks,
                         airframe_id: airframevalue,
                         aircraft_count: aircraftCount
                    }),
                    method: 'POST'
               });

               await fetch(req)
                    .then(response => response.json().then(this.setState({
                         statusCode: response.status,
                         statusBool: response.ok,
                         statusString: response.statusText,
                         responseToken: response.headers.map.token,
                         responseData: response
                    })))
                    .then(this.scheduleEvent)
                    .catch(this.badStuff)
          }
     }

     scheduleEvent = (apiData) => {
          // apiData is assigned a new state here and if apiData == [] it will go into the render if statement and display no scheduled routes
          this.setState({ loaded: true, apiData })

          let jwt = this.state.responseToken

          if (this.state.statusBool) {
               this.setState({ loaded: true, })
               this.storeItem('STORAGE_KEY', jwt)
               this.props.navigation.dispatch(StackActions.reset({
                    index: 0,
                    actions: [
                         NavigationActions.navigate({
                              routeName: 'TabNav',
                              params: { statusCode: this.state.statusCode }
                         })
                    ]
               }))
          }
          else {
               Alert.alert(this.state.statusCode + ': ' + this.state.statusText + '\n Either your session has expired or there was another issue \n \n For security reasons you have been signed out')
               AsyncStorage.removeItem('STORAGE_KEY')

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

     /* Error Catching */
     badStuff = (err) => {
          this.setState({ loaded: true, error: err.message });
          console.log('Error: ' + err.message)

          Alert.alert(this.state.statusCode + ': ' + this.state.statusText + '\n Either your session has expired or there was another issue \n \n For security reasons you have been signed out')

          AsyncStorage.removeItem('STORAGE_KEY')

          this.props.navigation.dispatch(StackActions.reset({
               index: 0,
               actions: [
                    NavigationActions.navigate({
                         routeName: 'Login'
                    })
               ]
          }))
     }

     /*
          This function checks if all form fields are !null, if they are !null then it will enable the 'Continue' button
          if any of the form fields ARE null then it disables the button
     */
     buttonDisable() {
          if (this.state.entryTime != null && this.state.entryTime != '' && this.state.remarks != '') {
               return false
          }
          else {
               return true
          }
     }

     async handleSubmit(routeid, entryid, exitid, speed, callsign, airframevalue, aircraftCount) {
          Keyboard.dismiss()
          // AsyncStorage.removeItem("userId");
          // this.props.navigation.navigate('Home');
          starttime = this.state.entryTime
          remarks = this.state.remarks
          this.scheduleEventFetch(routeid.key, starttime, entryid.key, exitid.key, speed, callsign, remarks, airframevalue, aircraftCount)
     };

     async retrieveItem(key) {
          try {
               const retrievedItem = await AsyncStorage.getItem(key);
               const item = JSON.parse(retrievedItem);
               return item;

          } catch (error) {
               console.log(error.message);
          }
          return
     }

     async storeItem(key, item) {
          try {
               //we want to wait for the Promise returned by AsyncStorage.setItem()
               //to be resolved to the actual value before returning the value
               var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
               return jsonOfItem;
          } catch (error) {
               console.log(error.message);
          }
     }

     async componentDidMount() {
          this.setState({ loaded: false })

          //Call this.retrieveItem to get the current users token. If the token is invalid we should navigate back to login screen
          const userCred = await this.retrieveItem("STORAGE_KEY")
          this.setState({ retrievedKey: userCred, loaded: true })
     }

     render() {
          const { currentRoute, routeId, entryTime, exitTime, remarks } = this.state;

          // 2. Get the param, provide a fallback value if not available 
          const { navigation } = this.props;
          const airframename = navigation.getParam('airframename', 'No Airframe Value');
          const airframevalue = navigation.getParam('airframevalue', 'No Airframe Value');
          const callsign = navigation.getParam('callsign', 'No Callsign Value');
          const date = navigation.getParam('date', 'No Date Value');
          const aircraftCount = navigation.getParam('aircraftCount', 'No Aircraft Count Value');
          const route = navigation.getParam('route', 'No Route Value');
          const groundSpeed = navigation.getParam('groundSpeed', 'No Ground Speed Value');
          const entryPoint = navigation.getParam('entryPoint', 'No Exit Point Value');
          const exitPoint = navigation.getParam('exitPoint', 'No Entry Point Value');
          const entryTimes = navigation.getParam('entryTimes', 'nolistavailable')
          const isDisabled = this.buttonDisable()

          return (
               <SafeAreaView style={{ flex: 1, backgroundColor: '#0E182D' }}>
                    <StatusBar barStyle='light-content' />
                    <KeyboardAwareScrollView>
                         <View behavior="padding" style={local_styles.container}>
                              <View>
                                   <View>
                                        <Text style={styles.screenTitle}>Schedule Route</Text>
                                   </View>
                              </View>
                              <View>
                                   <View style={local_styles.rowView}>
                                        <View style={{ flex: 1, flexDirection: 'column', width: '50%', }}>
                                             <Text style={styles.fieldHeaders}>Route: {route.value}</Text>
                                             <Text style={styles.fieldHeaders}>Airframe: {airframename}</Text>
                                             <Text style={styles.fieldHeaders}>Aircraft Count: {aircraftCount}</Text>
                                             <Text style={styles.fieldHeaders}>GS: {groundSpeed}</Text>
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'column', width: '50%', }}>
                                             <Text style={styles.fieldHeaders}>Date: {date}</Text>
                                             <Text style={styles.fieldHeaders}>Callsign: {callsign}</Text>
                                             <Text style={styles.fieldHeaders}>Entry Point: {entryPoint.value}</Text>
                                             <Text style={styles.fieldHeaders}>Exit Point: {exitPoint.value}</Text>
                                        </View>
                                   </View>
                              </View>

                              <View style={{ borderBottomColor: '#9A9A9A', borderBottomWidth: 1, marginTop: 20, marginBottom: 20, }} />


                              <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                                   <View style={local_styles.fieldViews}>
                                        <View style={{ width: 100 }}>
                                             <Text style={styles.fieldHeaders} onPress={() => this.myref3.openPicker()}>Entry Time</Text>
                                        </View>

                                        <RNPickerSelect
                                             placeholder={{
                                                  label: 'Select Entry Time...',
                                                  value: null,
                                             }}
                                             items={entryTimes}
                                             onValueChange={(value) => {
                                                  this.setState({
                                                       entryTime: value,
                                                  });
                                             }}
                                             onUpArrow={() => {
                                                  this.inputRefs.picker.togglePicker();
                                             }}
                                             onDownArrow={() => {
                                                  this.inputRefs.company.focus();
                                             }}
                                             style={pickerSelectStyles}
                                             value={this.state.entryTime}
                                             ref={(el) => {
                                                  this.inputRefs.picker2 = el;
                                             }}
                                        />
                                   </View>
                              </View>

                              <View style={{ paddingVertical: 10, alignSelf: 'center', paddingBottom: 50 }}>
                                   <View style={local_styles.fieldViews}>
                                        <View style={{ width: 100 }}>
                                             <Text style={styles.fieldHeaders}>Remarks</Text>
                                        </View>
                                        <TextInput
                                             style={{ ...local_styles.textInput, width: 225 }}
                                             placeholder="Flight Remarks"
                                             keyboardType="default"
                                             returnKeyType="done"
                                             multiline={true}
                                             numberOfLines={3}
                                             blurOnSubmit
                                             onChangeText={text => this.setState({ remarks: text })}
                                             value={remarks}
                                        />
                                   </View>
                              </View>

                              <TouchableOpacity style={isDisabled ? local_styles.buttonDisabled : local_styles.buttonEnabled} disabled={isDisabled} onPress={() => {
                                   this.handleSubmit(route, entryPoint, exitPoint, groundSpeed, callsign, airframevalue, aircraftCount);
                              }}>
                                   <Text style={styles.buttonText}>Continue</Text>
                              </TouchableOpacity>
                         </View>

                    </KeyboardAwareScrollView>

                    {!this.state.loaded &&
                         <View style={local_styles.loading}>
                              <ActivityIndicator size='large' color='#C3A266' />
                         </View>
                    }

               </SafeAreaView>
          );
     }
}
export default FinalSchedule;

const local_styles = StyleSheet.create({
     container: {
          flex: 1,
          flexDirection: 'column',
          paddingHorizontal: 20,
          backgroundColor: '#0E182D',

     },
     loading: {
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          opacity: 0.5,
          backgroundColor: 'black',
          justifyContent: 'center',
          alignItems: 'center'
     },
     textStyle: {
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          width: 300,
          height: 150,
          borderRadius: 6,
          color: '#5f9ea0',
     },
     button: {
          backgroundColor: 'rgba(14, 24, 45, .35)',
          borderRadius: 3,
          borderColor: '#FFFFFF',
          borderWidth: 1,
          height: 50,
          marginBottom: 10,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
     },
     buttonDisabled: {
          backgroundColor: 'rgba(14, 24, 45, .35)',
          borderRadius: 3,
          borderColor: 'black',
          borderWidth: 1,
          height: 50,
          marginBottom: 10,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
     },
     buttonEnabled: {
          backgroundColor: 'rgba(14, 24, 45, .35)',
          borderRadius: 3,
          borderColor: '#FFF',
          borderWidth: 1,
          height: 50,
          marginBottom: 10,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
     },
     buttonText: {
          color: '#FFF',
          fontWeight: 'bold',
          fontSize: 16,
          alignContent: "center"
     },
     textInput: {
          height: 40,
          borderColor: '#FFF',
          borderWidth: 1,
          borderRadius: 3,
          backgroundColor: '#f0ffff',
          paddingTop: 8,
          paddingHorizontal: 10,
          fontSize: 18,
          width: '60%',
          color: '#556b2f',
     },
     fieldHeaders: {
          color: '#ffffff',
          margin: 10,
          justifyContent: 'flex-start',
     },
     fieldViews: {
          flexDirection: "row",
     },
     rowView: {
          flexDirection: "row",
          alignItems: "flex-start"
     }
});

const pickerSelectStyles = StyleSheet.create({
     inputIOS: {
          height: 40,
          width: 225,
          fontSize: 18,
          paddingHorizontal: 10,
          marginBottom: 10,
          borderColor: '#FFF',
          borderWidth: 1,
          borderRadius: 3,
          backgroundColor: '#f0ffff',
          color: '#556b2f',
     },
});
