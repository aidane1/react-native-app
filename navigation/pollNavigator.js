import PollScreen from '../screens/pollScreen/index';
import {createAppContainer, createStackNavigator} from 'react-navigation';

import transitionConfig from './pollTransitionConfig';

const PollsNavigator = createStackNavigator (
  {
    Polls: {screen: PollScreen, lazy: true},
  },
  {
    initialRouteName: 'Polls',
    transitionConfig,
  }
);

const Polls = createAppContainer (PollsNavigator);

export default Polls;
