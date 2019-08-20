import React from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Dimensions,
} from 'react-native';
import AppNavigator from './navigation/appNavigator';

import Message from './components/message-dropdown/index';

import {useScreens} from 'react-native-screens';
useScreens ();

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

export default class Index extends React.Component {
  constructor (props) {
    super (props);
    this.message = React.createRef ();
  }
  render () {
    return (
      <View style={{width, height}}>
        <AppNavigator
          screenProps={{
            message: this.message,
          }}
        />
        <Message width={width} ref={this.message} />
      </View>
    );
  }
}
