import React from 'react';
import {
     StyleSheet,
     Text,
     Keyboard,
     TextInput,
     TouchableOpacity,
     ActivityIndicator,
     Alert,
     Modal,
     TouchableHighlight,
     View,
     SafeAreaView,
     KeyboardAvoidingView,
     StatusBar,
     AsyncStorage
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import DatePicker from 'react-native-datepicker';
import { NavigationActions, StackActions } from 'react-navigation';
import styles from '../globals/Styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default class FirstSchedule extends React.Component {
     static navigationOptions =
          {
               title: 'Schedule',
               header: null
          };

     constructor(props) {
          super(props);

          // define the initial state, so we can use it later
          // when we'll need to reset the form
          this.inputRefs = {};

          this.initialState = {
               retrievedKey: null,
               callsign: null,
               date: null,
               apiData: null,
               loaded: true,
               error: null,
               aircraftCount: null,
               route: null,
               entryPoint: null,
               exitPoint: null,
               statusCode: null,
               groundSpeed: null,
               statusBool: null,
               statusString: null,
               enP: [],
               exP: [],
               entryTimeList: [],
               exitTimeList: [],
               routeData: [],
               radio_props: [
                    { label: 'VR', value: 'VR' },
                    { label: 'IR', value: 'IR' },
                    { label: 'SR', value: 'SR' }
               ],
               airframeList: [],
               airframe: null,
               modalVisible: false,
               statusCode: null,
               statusBool: null,
               statusString: null,
               responseToken: null,
               responseData: null,
          };
          this.state = this.initialState;
     }

     setModalInvisible() {
          this.setState({ modalVisible: false });
     }

     setModalVisible(visible) {
          this.setState({ modalVisible: visible });
     }


     baseURL = 'https://mtr-scheduler.herokuapp.com'

     /* Get Airframe List APIs */
     getAirframes = (ev) => {
          //Create error handling of response code within the fetch and not in the setting of the new state
          this.setState({ loaded: false, error: null })

          let jwt = this.state.retrievedKey
          let url = this.baseURL + '/routes/get_airframes';
          let h = new Headers();
          h.append("Authorization", "JWT " + jwt);

          let req = new Request(url, {
               headers: h,
               method: 'GET'
          });

          fetch(req)
               .then(response => response.json().then(this.setState({ statusCode: response.status, statusBool: response.ok, statusString: response.statusText, responseToken: response.headers.map.token, responseData: response })))
               .then(this.showAirframes)
               .catch(this.badStuff)
     }

     showAirframes = (apiData) => {
          // apiData is assigned a new state here and if apiData == [] it will go into the render if statement and display no scheduled routes
          this.setState({ loaded: true, apiData })

          airframeArray = [];
          let jwt = this.state.responseToken

          if (this.state.statusBool === true) {
               console.log(apiData)
               this.storeItem('STORAGE_KEY', jwt)
               apiData.map((key, index) => {
                    airframeArray.push({ label: key.airframe_name, value: { key: key.id, value: key.airframe_name } });
               })
               this.setState({ airframeList: airframeArray, retrievedKey: jwt })
          }
          else {
               if (this.state.statusCode >= 400 && this.state.statusCode <= 499) {
                    Alert.alert(this.state.statusCode + ': ' + apiData.message + '\n Either your session has expired or there was another issue \n \n For security reasons you have been signed out')
                    console.log(this.state.statusCode + ': ' + apiData.message + ' on get_airframes')
               }
               else {
                    Alert.alert(this.state.statusCode + ': ' + this.state.statusText + '\n Either your session has expired or there was another issue \n \n For security reasons you have been signed out')
                    console.log(this.state.statusCode + ': ' + this.state.statusText + ' on get_airframes')
               }
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

     /* Get Routes APIs */
     getRouteData = (ev) => {
          this.setState({ loaded: false, error: null, route: null, routeData: [], routeArray: [], enP: [], entryPoint: null, exitArray: [], exitPoint: null })
          Keyboard.dismiss()

          let jwt = this.state.retrievedKey
          let url = this.baseURL + '/routes/get_routes';
          let h = new Headers();
          h.append("Authorization", "JWT " + jwt);
          h.append("Content-Type", "application/json")

          let req = new Request(url, {
               headers: h,
               body: JSON.stringify({
                    route_type: ev
               }),
               method: 'POST'
          });

          fetch(req)
               .then(response => response.json().then(this.setState({
                    statusCode: response.status,
                    statusBool: response.ok,
                    statusString: response.statusText,
                    responseToken: response.headers.map.token,
                    responseData: response
               })))
               .then(this.showRouteData)
               .catch(this.badStuff)
     }

     showRouteData = (apiData) => {
          // apiData is assigned a new state here and if apiData == [] it will go into the render if statement and display no scheduled routes
          this.setState({ apiData })

          routeArray = []
          let jwt = this.state.responseToken
          if (this.state.statusBool === true) {
               this.storeItem('STORAGE_KEY', jwt)

               apiData.map((key, index) => {
                    // When pushing to this.state.routeData it wasn't re-rendering the state. By pushing to a variable and then setState of routeData
                    // it allows the state to re-render and populate the list correctly
                    routeArray.push({ label: key.route_name, value: { key: key.id, value: key.route_name } });
               })

               this.setState({ routeData: routeArray, loaded: true, retrievedKey: jwt })
          }
          else {
               if (this.state.statusCode >= 400 && this.state.statusCode <= 499) {
                    Alert.alert(this.state.statusCode + ': ' + apiData.message + '\n Either your session has expired or there was another issue \n \n For security reasons you have been signed out')
                    console.log(this.state.statusCode + ': ' + apiData.message + ' on get_routes')
               }
               else {
                    Alert.alert(this.state.statusCode + ': ' + this.state.statusText + '\n Either your session has expired or there was another issue \n \n For security reasons you have been signed out')
                    console.log(this.state.statusCode + ': ' + this.state.statusText + ' on get_routes')
               }
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

     /* Get Entry Points APIs */
     getEntryPoints = (selectedRoute) => {
          //Create error handling of response code within the fetch and not in the setting of the new state

          if (selectedRoute != null && selectedRoute != '' && selectedRoute != undefined) {
               this.setState({ loaded: false, error: null })

               let jwt = this.state.retrievedKey
               let url = this.baseURL + '/routes/get_entry_points';

               let h = new Headers();
               h.append("Authorization", "JWT " + jwt);

               let req = new Request(url, {
                    headers: h,
                    body: JSON.stringify({
                         route_id: selectedRoute.key
                    }),
                    method: 'POST'
               });

               fetch(req)
                    .then(response => response.json().then(this.setState({
                         statusCode: response.status,
                         statusBool: response.ok,
                         statusString: response.statusText,
                         responseToken: response.headers.map.token,
                         responseData: response
                    })))
                    .then(this.showEntryPoints)
                    .catch(this.badStuff)
          }
          else {
               Alert.alert('Please check your fields have info entered')
          }
     }

     showEntryPoints = (apiData) => {
          // apiData is assigned a new state here and if apiData == [] it will go into the render if statement and display no scheduled routes
          this.setState({ loaded: true, apiData })

          entryArray = [];
          let jwt = this.state.responseToken

          if (this.state.statusBool === true) {
               this.storeItem('STORAGE_KEY', jwt)

               apiData.map((key, index) => {
                    entryArray.push({ label: key.point_name, value: { key: key.id, value: key.point_name } });
               })

               this.setState({ enP: entryArray, retrievedKey: jwt })

          }
          else {

               if (this.state.statusCode >= 400 && this.state.statusCode <= 499) {
                    Alert.alert(this.state.statusCode + ': ' + apiData.message + '\n Either your session has expired or there was another issue \n \n For security reasons you have been signed out')
                    console.log(this.state.statusCode + ': ' + apiData.message + ' on get_entry_points')
               }
               else {
                    Alert.alert(this.state.statusCode + ': ' + this.state.statusText + '\n Either your session has expired or there was another issue \n \n For security reasons you have been signed out')
                    console.log(this.state.statusCode + ': ' + this.state.statusText + ' on get_entry_points')
               }
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

     /* Get Exit Points APIs */
     getExitPoints = (EntryPoint, selectedRoute) => {
          //Create error handling of response code within the fetch and not in the setting of the new state
          if (EntryPoint != null && EntryPoint != '' && EntryPoint != undefined) {
               this.setState({ loaded: false, error: null })

               let jwt = this.state.retrievedKey
               let url = this.baseURL + '/routes/get_exit_points';

               let h = new Headers();
               h.append("Authorization", "JWT " + jwt);

               let req = new Request(url, {
                    headers: h,
                    body: JSON.stringify({
                         entry_point_id: EntryPoint.key,
                         route_id: selectedRoute.key
                    }),
                    method: 'POST'
               });

               fetch(req)
                    .then(response => response.json().then(this.setState({
                         statusCode: response.status,
                         statusBool: response.ok,
                         statusString: response.statusText,
                         responseToken: response.headers.map.token,
                         responseData: response
                    })))
                    .then(this.showExitPoints)
                    .catch(this.badStuff)
          }
     }

     showExitPoints = (apiData) => {
          // apiData is assigned a new state here and if apiData == [] it will go into the render if statement and display no scheduled routes
          this.setState({ loaded: true, apiData })
          exitArray = [];
          let jwt = this.state.responseToken

          if (this.state.statusBool === true) {
               this.storeItem('STORAGE_KEY', jwt)

               apiData.map((key, index) => {
                    exitArray.push({ label: key.point_name, value: { key: key.id, value: key.point_name } });
               })

               this.setState({ exP: exitArray, retrievedKey: jwt })
          }
          else {

               if (this.state.statusCode >= 400 && this.state.statusCode <= 499) {
                    Alert.alert(this.state.statusCode + ': ' + apiData.message + '\n Either your session has expired or there was another issue \n \n For security reasons you have been signed out')
                    console.log(this.state.statusCode + ': ' + apiData.message + ' on get_exit_points')
               }
               else {
                    Alert.alert(this.state.statusCode + ': ' + this.state.statusText + '\n Either your session has expired or there was another issue \n \n For security reasons you have been signed out')
                    console.log(this.state.statusCode + ': ' + this.state.statusText + ' on get_exit_points')
               }
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

     /* Get Times APIs */
     async getTimes(routeid, entrypointid, exitpointid, speed, date) {
          //Create error handling of response code within the fetch and not in the setting of the new state
          if (routeid != null && routeid != '' && routeid != undefined) {
               this.setState({ loaded: false, error: null, timesCall: true })
               let jwt = this.state.retrievedKey
               let speedInt = parseInt(speed)

               let url = this.baseURL + '/routes/get_times';
               let h = new Headers();

               h.append("Authorization", "JWT " + jwt);
               h.append("Content-Type", "application/json")

               let req = new Request(url, {
                    headers: h,
                    body: JSON.stringify({
                         route_id: routeid,
                         entry_point_id: entrypointid,
                         exit_point_id: exitpointid,
                         speed: speedInt,
                         date: date
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
                    .then(this.showTimes)
                    .catch(this.badStuff)
          }
     }

     showTimes = (apiData) => {
          // apiData is assigned a new state here and if apiData == [] it will go into the render if statement and display no scheduled routes
          this.setState({ loaded: true, apiData })
          entryList = []
          let jwt = this.state.responseToken

          if (this.state.statusBool === true) {
               this.storeItem('STORAGE_KEY', jwt)

               for (x of apiData) {
                    var parts = x.slice().split('T')
                    var dateComponent = parts[0];
                    var timeComponent = parts[1];
                    slicedTime = timeComponent.split(':')
                    newTime = slicedTime[0] + ':' + slicedTime[1]
                    entryList.push({ label: newTime, value: x })
               }
               this.setState({ loaded: true, entryTimeList: entryList, retrievedKey: jwt })
          }
          else {
               if (this.state.statusCode >= 400 && this.state.statusCode <= 499) {
                    Alert.alert(this.state.statusCode + ': ' + apiData.message + '\n Either your session has expired or there was another issue \n \n For security reasons you have been signed out')
                    console.log(this.state.statusCode + ': ' + apiData.message + ' on get_times')
               }
               else {
                    Alert.alert(this.state.statusCode + ': ' + this.state.statusText + '\n Either your session has expired or there was another issue \n \n For security reasons you have been signed out')
                    console.log(this.state.statusCode + ': ' + this.state.statusText + ' on get_times')
               }
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

          if (this.state.statusCode >= 400 && this.state.statusCode <= 499) {
               Alert.alert(this.state.statusCode + ': ' + this.state.apiData.message + '\n Either your session has expired or there was another issue \n \n For security reasons you have been signed out')
               console.log(this.state.statusCode + ': ' + this.state.apiData.message + 'in error handling function')
          }
          else {
               Alert.alert(this.state.statusCode + ': ' + this.state.statusText + '\n Either your session has expired or there was another issue \n \n For security reasons you have been signed out')
               console.log(this.state.statusCode + ': ' + this.state.statusText + 'in error handling function')
          }

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

     /* Run after render and data has been loaded */
     async componentDidMount() {
          this.setState({ loaded: false })

          //Call this.retrieveItem to get the current users token. If the token is invalid we should navigate back to login screen
          const userCred = await this.retrieveItem("STORAGE_KEY")
          this.setState({ retrievedKey: userCred })

          //Call this.getAirframes to populate our airframes list upon opening of the screen
          this.getAirframes()
          this.setState({ loaded: true })
     }

     /*
          Whenever 'Continue' button is pressed it calls this function to check the form fields for data and if there is not data it will alert the user

          If all form fields are filled out it execute the getTimes function to perform the API call and then navigate to FinalSchedule.js
          with the times and all form fields passed as props inside navigation
     */
     async handleSubmit() {
          Keyboard.dismiss();

          if (this.state.airframe === '') {
               alert('Airframe is Required');
          }
          else if (this.state.callsign === '') {
               alert('Callsign is Required');
          }
          else if (this.state.date === '') {
               alert('Date is Required');
          }
          else if (this.state.aircraftCount === '' || this.state.aircraftCount > 99) {
               alert('Aircraft Count is too High');
          }
          else if (this.state.route === '' || this.state.route === null) {
               alert('Please Select A Route');
          }
          else if (this.state.groundSpeed === '' || this.state.groundSpeed === null || this.state.groundSpeed > 1000 || this.state.groundSpeed < 100) {
               alert('Enter a valid Ground Speed');
          }
          else if (this.state.entryPoint === '' || this.state.entryPoint === null) {
               alert('Please Select A Entry Point');
          }
          else if (this.state.exitPoint === '' || this.state.exitPoint === null) {
               alert('Please Select A Exit Point');
          }
          else {
               apiRoute = this.state.route
               apiEntry = this.state.entryPoint
               apiExit = this.state.exitPoint
               speed = parseInt(this.state.groundSpeed)
               aircraftCount = parseInt(this.state.aircraftCount)
               await this.getTimes(apiRoute.key, apiEntry.key, apiExit.key, this.state.groundSpeed, this.state.date)

               this.props.navigation.navigate('Final',
                    {
                         statusCode: this.state.statusCode,
                         entryTimes: this.state.entryTimeList,
                         airframename: this.state.airframe.value,
                         airframevalue: this.state.airframe.key,
                         callsign: this.state.callsign,
                         date: this.state.date,
                         aircraftCount: aircraftCount,
                         route: this.state.route,
                         groundSpeed: speed,
                         entryPoint: this.state.entryPoint,
                         exitPoint: this.state.exitPoint
                    }
               )
          }
     };

     /*
          This function checks if all form fields are !null, if they are !null then it will enable the 'Continue' button
          if any of the form fields ARE null then it disables the button
     */
     buttonDisable() {
          if (
               this.state.statusCode != null &&
               this.state.entryTimeList != null &&
               this.state.exitTimeList != null &&
               this.state.airframe != null &&
               this.state.callsign != null &&
               this.state.date != null &&
               this.state.aircraftCount != null &&
               this.state.route != null &&
               this.state.groundSpeed != null &&
               this.state.entryPoint != null &&
               this.state.exitPoint != null) {
               return false
          }
          else {
               return true
          }

     }

     render() {
          const { airframe, callsign, date, aircraftCount, airframeList } = this.state;
          const isDisabled = this.buttonDisable()
          return (
               <>
                    <StatusBar barStyle='light-content' />
                    <SafeAreaView style={{ flex: 1, backgroundColor: '#0E182D' }}>
                         <KeyboardAwareScrollView>
                              <View style={styles.container}>
                                   <Text style={styles.screenTitle}>Schedule Route</Text>

                                   <View style={local_styles.rowView}>
                                        <Text style={local_styles.fieldHeaders} onPress={() => this.myref.openPicker()}>Airframe</Text>
                                        <RNPickerSelect
                                             placeholder={{
                                                  label: 'Select Airframe...',
                                                  value: null,
                                             }}
                                             items={this.state.airframeList}
                                             onValueChange={(value) => {
                                                  this.setState({
                                                       airframe: value,
                                                  });
                                             }}

                                             style={{ ...pickerSelectStyles, paddingTop: 20 }}
                                             value={this.state.airframe}
                                             ref={(el) => {
                                                  this.inputRefs.picker2 = el;
                                             }}
                                        />
                                   </View>

                                   <View style={local_styles.rowView}>
                                        <Text style={local_styles.fieldHeaders}>Callsign</Text>
                                        <TextInput
                                             style={local_styles.textInput}
                                             placeholder="Callsign"
                                             keyboardType="default"
                                             returnKeyType="done"
                                             blurOnSubmit
                                             onChangeText={text => this.setState({ callsign: text })}
                                             value={callsign}
                                        />
                                   </View>

                                   <View style={local_styles.rowView}>
                                        <Text style={local_styles.fieldHeaders}>Date</Text>
                                        <DatePicker
                                             style={{ height: 40, width: '60%', borderRadius: 4, backgroundColor: 'black' }}
                                             date={date}
                                             mode="date"
                                             iconSource={require('../assets/schedule.png')}
                                             placeholder="select date"
                                             format="YYYY-MM-DD"
                                             minDate={this.state.date}
                                             maxDate="2100-12-31"
                                             confirmBtnText="Confirm"
                                             cancelBtnText="Cancel"
                                             customStyles={{
                                                  dateIcon: {
                                                       position: 'absolute',
                                                       right: 0,
                                                       top: 4,
                                                       marginLeft: 0
                                                  },
                                                  dateInput: {
                                                       marginLeft: 0,
                                                       backgroundColor: '#fff'
                                                  }
                                                  // ... You can check the source to find the other keys.
                                             }}
                                             onDateChange={(date) => { this.setState({ date: date }) }}
                                             value={this.state.date}
                                        />
                                   </View>

                                   <View style={local_styles.rowView}>
                                        <Text style={local_styles.fieldHeaders}>Aircraft Count</Text>
                                        <TextInput
                                             style={local_styles.textInput}
                                             placeholder="Aircraft Count"
                                             keyboardType='numeric'
                                             returnKeyType="done"
                                             blurOnSubmit
                                             onChangeText={text => this.setState({ aircraftCount: text })}
                                             value={aircraftCount}
                                        />
                                   </View>
                                   <KeyboardAvoidingView>
                                        {/* Start of API calls here!*/}
                                        <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                                             <Text style={styles.fieldHeaders}>Route Type</Text>
                                        </View>

                                        <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                                             <RadioForm
                                                  radio_props={this.state.radio_props}
                                                  initial={-1}
                                                  formHorizontal={true}
                                                  labelHorizontal={true}
                                                  style={{ marginTop: 20 }}
                                                  selectedButtonColor={'#EEEEEE'}
                                                  buttonStyle={'#EEEEEE'}
                                                  buttonColor={'#EEEEEE'}
                                                  labelStyle={{ marginRight: 15, color: '#EEEEEE' }}
                                                  /*
                                                  When animation is true on RadioForm prop, in the react-native-simple-radio-button it has a componentWillUpdate that causes a spring animation
                                                  that will occur when you navigate back to DashboardScreen.js so if you set the animation prop
                                                  to true it will do a spring animation on Dashboard every time you select a radio button
                                                  */
                                                  animation={false}
                                                  onPress={(value) => { this.setState({ value: value }); this.getRouteData(value) }}
                                             />
                                        </View>

                                        <View style={{ paddingVertical: 5, flexDirection: 'row', alignItems: 'center' }}>
                                             <View style={local_styles.rowView}>
                                                  <View style={{ flexDirection: 'column', paddingHorizontal: 10, width: '50%' }}>
                                                       <Text style={styles.fieldHeaders}>Route</Text>
                                                       <RNPickerSelect
                                                            placeholder={{
                                                                 label: 'Select route..',
                                                                 value1: null,
                                                            }}
                                                            items={this.state.routeData}
                                                            onValueChange={(value) => {
                                                                 if (value != this.state.route) {
                                                                      this.getEntryPoints(value)
                                                                      this.setState({
                                                                           route: value,
                                                                      });
                                                                 }
                                                            }}
                                                            style={pickerSelectStyles2}
                                                            value={this.state.route}
                                                            ref={(el) => {
                                                                 this.inputRefs.picker = el;
                                                            }}
                                                       />
                                                  </View>

                                                  <View style={{ flexDirection: 'column', paddingHorizontal: 10, width: '50%' }}>

                                                       <Text style={styles.fieldHeaders}>GS</Text>
                                                       <TextInput
                                                            style={local_styles.textInput2}
                                                            placeholder="Ex: 300"
                                                            keyboardType="numeric"
                                                            returnKeyType="done"
                                                            blurOnSubmit
                                                            onChangeText={number => this.setState({ groundSpeed: number })}
                                                            value={this.state.groundSpeed}
                                                       />
                                                  </View>
                                             </View>
                                        </View>

                                        <View style={{ paddingVertical: 5, flexDirection: 'row', alignItems: 'center' }}>
                                             <View style={{ flexDirection: 'column', paddingHorizontal: 10, width: '50%' }}>
                                                  <Text style={styles.fieldHeaders}>Entry Point</Text>
                                                  <RNPickerSelect
                                                       placeholder={{
                                                            label: 'Select Point..',
                                                            value: null,
                                                       }}
                                                       items={this.state.enP}
                                                       onValueChange={(value) => {
                                                            if (value != this.state.entryPoint) {
                                                                 this.getExitPoints(value, this.state.route)
                                                                 this.setState({
                                                                      entryPoint: value,
                                                                 });
                                                            }

                                                       }}

                                                       style={pickerSelectStyles2}
                                                       value={this.state.entryPoint}
                                                       ref={(el) => {
                                                            this.inputRefs.picker = el;
                                                       }}
                                                  />
                                             </View>
                                             <View style={{ flexDirection: 'column', paddingHorizontal: 10, width: '50%' }}>
                                                  <Text style={styles.fieldHeaders}>Exit Point</Text>
                                                  <RNPickerSelect
                                                       placeholder={{
                                                            label: 'Select route..',
                                                            value: null,
                                                       }}
                                                       items={this.state.exP}
                                                       onValueChange={(value) => {
                                                            this.setState({
                                                                 exitPoint: value,
                                                            });
                                                       }}
                                                       style={pickerSelectStyles2}
                                                       value={this.state.exitPoint}
                                                       ref={(el) => {
                                                            this.inputRefs.picker = el;
                                                       }}
                                                  />
                                             </View>
                                        </View>
                                   </KeyboardAvoidingView>

                                   <View style={local_styles.rowView}>
                                        <Modal
                                             animationType="fade"
                                             transparent={true}
                                             visible={this.state.modalVisible}
                                             onRequestClose={() => {
                                                  Alert.alert('Incorrect Credentials \n Please Try Again');
                                             }}>
                                             <View style={local_styles.modalContainer}>
                                                  <View style={local_styles.innerContainer}>
                                                       <TouchableHighlight
                                                            onPressIn={() => {
                                                                 this.setModalVisible(!this.state.modalVisible);
                                                            }}>
                                                            <Text style={local_styles.modalText}>Something Went Wrong!{'\n'} Please Try Again</Text>
                                                       </TouchableHighlight>
                                                  </View>
                                             </View>
                                        </Modal>
                                   </View>
                                   <View style={local_styles.rowView2}>
                                        <TouchableOpacity style={isDisabled ? local_styles.buttonDisabled : local_styles.button} disabled={isDisabled} onPress={() => {
                                             this.handleSubmit();
                                        }}>
                                             <Text style={styles.buttonText}>Continue</Text>
                                        </TouchableOpacity>
                                   </View>


                              </View>

                         </KeyboardAwareScrollView>
                         {!this.state.loaded &&
                              <View style={local_styles.loading}>
                                   <ActivityIndicator size='large' color='#C3A266' />
                                   {this.state.timesCall &&
                                        <Text style={{ justifyContent: 'center', alignItems: 'center', color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>Calculating Deconfliction</Text>
                                   }
                              </View>
                         }
                    </SafeAreaView>
               </>
          );
     }
}

const local_styles = StyleSheet.create({
     modalText: {
          fontSize: 15,
     },
     modalContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
     },
     loading: {
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          opacity: 0.8,
          backgroundColor: 'black',
          justifyContent: 'center',
          alignItems: 'center'
     },
     innerContainer: {
          height: 100,
          width: 250,
          opacity: 0.98,
          borderRadius: 6,
          fontSize: 10,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#696969',
     },
     container: {
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          paddingHorizontal: 10,
          backgroundColor: 'rgba(0, 0, 0, .3)',
     },
     screenTitle: {
          fontSize: 35,
          textAlign: 'center',
          margin: 10,
          color: '#FFF',
     },
     textInput: {
          height: 40,
          width: '60%',
          borderColor: '#FFF',
          borderWidth: 1,
          borderRadius: 5,
          backgroundColor: '#f0ffff',
          paddingLeft: 10,
          // marginBottom: 10,
          fontSize: 18,
          color: '#556b2f',
     },
     textInput2: {
          height: 40,
          width: 150,
          borderColor: '#FFF',
          borderWidth: 1,
          borderRadius: 5,
          backgroundColor: '#f0ffff',
          paddingLeft: 10,
          // marginBottom: 10,
          fontSize: 18,
          color: '#556b2f',
     },
     fieldHeaders: {
          color: '#ffffff',
          marginLeft: 10,
          width: '35%',
          alignSelf: 'center',
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
     buttonText: {
          color: '#FFF',
          fontWeight: 'bold',
          fontSize: 16,
     },
     rowView: {
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 10,
          alignSelf: 'center',
          justifyContent: 'center'
     },
     rowView2: {
          flex: 1,
          flexDirection: "row",
          alignItems: "center"
     },
     textStyle: {
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          width: 300,
          height: 150,
          borderRadius: 6,
          backgroundColor: '#5f9ea0',
     },
});

const pickerSelectStyles = StyleSheet.create({
     inputIOS: {
          height: 40,
          width: 223,
          fontSize: 18,
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderColor: '#FFF',
          borderWidth: 1,
          borderRadius: 3,
          backgroundColor: '#f0ffff',
          color: '#556b2f',
          alignSelf: 'center'
     },
});

const pickerSelectStyles2 = StyleSheet.create({
     inputIOS: {
          height: 40,
          width: 150,
          fontSize: 18,
          paddingHorizontal: 10,
          // marginBottom: 10,
          borderColor: '#FFF',
          borderWidth: 1,
          borderRadius: 3,
          backgroundColor: '#f0ffff',
          color: '#556b2f',
     },
});