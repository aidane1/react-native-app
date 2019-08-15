import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  AsyncStorage,
  Button,
} from 'react-native';

import {LinearGradient} from 'expo-linear-gradient';

import {boxShadows} from '../constants/boxShadows';

import {ifIphoneX} from 'react-native-iphone-x-helper';

export default class HeaderBar extends React.Component {
  render () {
    return (
      <View
        style={[
          {
            width: this.props.width,
            ...ifIphoneX ({height: 80}, {height: 60}),
            zIndex: 5,
          },
          boxShadows.boxShadow7,
        ]}
      >
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={[
            {
              width: this.props.width,
              ...ifIphoneX ({height: 80}, {height: 60}),
            },
            styles.tabBar,
          ]}
          colors={
            global.user.theme == 'Light'
              ? ['rgb(0,153,153)', ', rgb(0,130,209)']
              : ['rgb(0,78,78)', ', rgb(0,66,107)']
          }
        >
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'flex-end',
              paddingLeft: 10,
              paddingRight: 10,
            }}
          >
            <Text
              style={[styles.headerText, {maxWidth: this.props.width * 0.7}]}
              numberOfLines={1}
            >
              {this.props.title}
            </Text>
          </View>
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              paddingLeft: 10,
              paddingRight: 10,
            }}
          >
            <View style={styles.iconLeft}>
              {this.props.iconLeft}
            </View>
            <View style={styles.iconRight}>
              {this.props.iconRight}
            </View>
          </View>

        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create ({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingLeft: 10,
    paddingRight: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 25,
    fontWeight: '300',
    paddingBottom: 10,
  },
  iconLeft: {
    paddingBottom: 10,
  },
  iconRight: {
    paddingBottom: 10,
  },
});
