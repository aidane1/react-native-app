import React from 'react';

import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  AppState,
  Dimensions,
} from 'react-native';

import AppNavigator from './navigation/appNavigator';

import DrawerNavigator from './navigation/drawerNavigator';

import {Notifications} from 'expo';

import Message from './components/message-dropdown/index';

import {useScreens} from 'react-native-screens';
useScreens ();

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

export default class Index extends React.Component {
  constructor (props) {
    super (props);
    this.message = React.createRef ();
    this.state = {
      appState: AppState.currentState,
    };
  }
  componentDidMount () {
    AppState.addEventListener ('change', this._handleAppStateChange);
  }

  componentWillUnmount () {
    AppState.removeEventListener ('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match (/inactive|background/) &&
      nextAppState === 'active'
    ) {
      Notifications.setBadgeNumberAsync (0);
    }
    this.setState ({appState: nextAppState});
  };
  // render () {
  //   return (
  //     <View style={{width, height}}>
  //       <AppNavigator
  //         screenProps={{
  //           message: this.message,
  //         }}
  //       />
  //       <Message width={width} ref={this.message} />
  //     </View>
  //   );
  // }
  render () {
    return (
      <View style={{width, height}}>
        <DrawerNavigator
          screenProps={{
            message: this.message,
          }}
        />
        <Message width={width} ref={this.message} />
      </View>
    );
  }
}
