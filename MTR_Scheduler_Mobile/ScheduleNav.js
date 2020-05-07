import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import FirstSchedule from './Screens/FirstSchedule';
import FinalSchedule from './Screens/FinalSchedule';

const ScheduleStack = createStackNavigator(
  {
    Schedule: FirstSchedule,
    Final: FinalSchedule
  },
  {
    initialRouteName: 'Schedule',
    headerMode: 'none',
  }
);


const ScheduleStackContainer = createAppContainer(ScheduleStack);

// export default class ScheduleNav extends React.Component {
//   render() {
//       return <ScheduleStackContainer />
//     }
//   }
export default ScheduleStack;