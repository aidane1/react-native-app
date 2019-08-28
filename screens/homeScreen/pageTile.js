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
  Animated,
  Button,
  RefreshControl,
  TouchableNativeFeedback,
} from 'react-native';

import {LinearGradient} from 'expo-linear-gradient';

import ParsedText from 'react-native-parsed-text';

import {boxShadows} from '../../constants/boxShadows';

import Touchable from '../../components/react-native-platform-touchable';

import {Courses} from '../../classes/courses';

import moment from 'moment';

import ApexAPI from '../../http/api';
import {FlatList} from 'react-native-gesture-handler';

import HomeScreenTile from './homeIndex';
import {ifIphoneX} from 'react-native-iphone-x-helper';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

export default class PageTile extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      expanded: false,
      position: 'relative',
      zIndex: 1,
      width: new Animated.Value (width * 0.95),
      height: new Animated.Value (200),
      top: new Animated.Value (0),
      left: new Animated.Value (0),
      opacity: new Animated.Value (1),
    };
    this.view = React.createRef ();
  }
  expand = () => {
    // this.setState ({position: 'absolute'});
    this.view.current.measure ((fx, fy, oldWidth, oldHeight, px, py) => {
      this.setState (
        {
          position: 'absolute',
          zIndex: 10,
          top: new Animated.Value (py - ifIphoneX (80, 60) - 10),
          left: new Animated.Value (px),
        },
        () => {
          Animated.parallel ([
            Animated.timing (this.state.width, {
              toValue: width,
              duration: 350,
            }),
            Animated.timing (this.state.left, {
              toValue: 0,
              duration: 350,
            }),
            Animated.timing (this.state.top, {
              toValue: 0,
              duration: 350,
            }),
            Animated.timing (this.state.height, {
              toValue: height - ifIphoneX (80, 60),
              duration: 350,
            }),
            Animated.timing (this.state.opacity, {
              toValue: 0,
              duration: 350,
            }),
          ]).start (() => {
            this.setState ({expanded: true});
          });
        }
      );
      // this.props.popup.current.renderPopup ({
      //   image: this.props.image,
      //   width: new Animated.Value (width),
      //   originalWidth: width,
      //   originalHeight: height,
      //   originalPx: px,
      //   originalPy: py,
      //   height: new Animated.Value (height),

      //   poll: this.props.poll,
      //   updateVisible: this.updateVisible,
      // });
    });
    // if (this.state.expanded) {
    //   this.setState ({
    //     position: 'relative',
    //     width: width * 0.95,
    //     height: 200,
    //     zIndex: 1,
    //     expanded: false,
    //   });
    // } else {
    //   this.setState ({
    //     position: 'absolute',
    //     width,
    //     height: 400,
    //     zIndex: 10,
    //     expanded: true,
    //   });
    // }
  };
  render () {
    let {position, zIndex, top, left} = this.state;
    return (
      <Animated.View
        style={[
          styles.container,
          boxShadows.boxShadow3,
          {
            position,
            zIndex,
            top,
            left,
            width: this.state.width,
            height: this.state.height,
          },
        ]}
      >
        <View style={styles.pageBlock}>
          {this.props.children}
        </View>
        {this.state.expanded
          ? null
          : <View style={styles.overlay} ref={this.view}>
              <Animated.View
                style={[styles.overlay, {opacity: this.state.opacity}]}
              >
                <Image
                  source={require ('../../assets/account_background.jpg')}
                  resizeMode={'cover'}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    opacity: 1,
                  }}
                />
                <TouchableOpacity
                  activeOpacity={0.2}
                  style={styles.overlay}
                  onPress={this.expand}
                >
                  <Text style={styles.title}>{this.props.title}</Text>
                </TouchableOpacity>
              </Animated.View>

            </View>}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create ({
  container: {
    width: width * 0.95,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  pageBlock: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: 'white',
    borderRadius: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 30,
    // backgroundColor: 'rgba(255,255,255,0.9)',
    zIndex: 3,
    borderRadius: 20,
    overflow: 'hidden',
  },
  title: {
    fontSize: 40,
    fontWeight: '600',
    color: 'white',
  },
});
