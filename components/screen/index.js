import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';

import HeaderBar from '../../components/header';

import {LeftIcon, RightIcon, EmptyIcon} from '../../classes/icons';

import {LinearGradient} from 'expo-linear-gradient';

import moment from 'moment';

import {ScrollView} from 'react-native-gesture-handler';

import {boxShadows} from '../../constants/boxShadows';

import {ifIphoneX} from 'react-native-iphone-x-helper';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

export default class Screen extends React.Component {
  constructor (props) {
    super (props);
  }
  render () {
    return (
      <View style={[styles.container]}>
        <View>
          {this.props.header}
        </View>
        {this.props.children}
        <View>
          {this.props.footer || null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create ({
  container: {
    width,
    flexGrow: 1,
    backgroundColor: '#f0f0f0',
  },
  bodyHolder: {
    zIndex: 1,
    height: ifIphoneX (height - 80, height - 60),
  },
});
