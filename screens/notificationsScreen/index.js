import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  Alert,
  Text,
  Linking,
  Easing,
  RefreshControl,
} from 'react-native';

import HeaderBar from '../../components/header';

import {ScrollView, TextInput, FlatList} from 'react-native-gesture-handler';

import {
  LeftIcon,
  EmptyIcon,
  RightIcon,
  MessageIcon,
  ClockIcon,
  EllipsisIcon,
  LightBulbIcon,
  SchoolIcons,
} from '../../classes/icons';

import {boxShadows} from '../../constants/boxShadows';

import Touchable from '../../components/react-native-platform-touchable';

import {LinearGradient} from 'expo-linear-gradient';

import ApexAPI from '../../http/api';

import {ifIphoneX} from 'react-native-iphone-x-helper';

import ParsedText from 'react-native-parsed-text';

import moment from 'moment';

import * as Haptics from 'expo-haptics';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

class MonthBlock extends React.Component {
  constructor (props) {
    super (props);
  }
  render () {
    return (
      <View>
        <View style={[styles.titleBlock, global.user.borderColor ()]}>
          <Text
            style={[styles.h1, {color: global.user.getPrimaryTextColor ()}]}
          >
            {this.props.month}
          </Text>
        </View>
        <View>
          {this.props.notifications.map ((notification, index) => {
            return <GradientBlock notification={notification} />;
          })}
        </View>
      </View>
    );
  }
}

class GradientBlock extends React.Component {
  constructor (props) {
    super (props);
  }
  handleURLPress = (url, matchIndex) => {
    Linking.canOpenURL (url).then (supported => {
      console.log (supported);
      if (supported) {
        Linking.openURL (url);
      } else {
        console.log ('dont know');
      }
    });
  };
  render () {
    return (
      <View
        style={[
          {
            width: width * 0.95,
            marginTop: 10,
            marginBottom: 10,
            alignSelf: 'center',
          },
          boxShadows.boxShadow4,
        ]}
      >
        <LinearGradient
          // colors={['#ffa799', '#fc8d8d']}
          colors={['hsl(91, 75%, 41%)', 'hsl(111, 75%, 41%)']}
          style={{
            borderRadius: 5,
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          <View style={[styles.blockBody, {flexDirection: 'column'}]}>
            <View style={{marginBottom: 10}}>
              <ParsedText
                style={{color: 'white', fontSize: 16}}
                parse={[
                  {
                    type: 'url',
                    style: {
                      fontWeight: '500',
                      textDecorationLine: 'underline',
                    },
                    onPress: this.handleURLPress,
                  },
                ]}
              >
                {this.props.notification.data}
              </ParsedText>
            </View>
            <Text style={{fontSize: 14, color: 'rgba(255,255,255,0.7)'}}>
              {moment (this.props.notification.send_date).format (
                'dddd, MMMM Do, YYYY'
              )}
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  }
}

export default class NotificationsScreen extends React.Component {
  constructor (props) {
    super (props);
    this.props = props;
    this.state = {
      notifications: [],
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };
  loadNotifications = callback => {
    let api = new ApexAPI (global.user);
    api
      .get (`notifications`)
      .then (data => data.json ())
      .then (data => {
        if (data.status == 'ok' && this._isMounted) {
          callback (null, data.body);
        } else if (this._isMounted) {
          callback (data.body, []);
        }
      })
      .catch (e => {
        console.log (e);
        callback (e, []);
      });
  };
  componentWillUnmount () {
    this._isMounted = false;
  }
  componentDidMount () {
    this._isMounted = true;
    this.loadNotifications ((err, notifications) => {
      this._isMounted && this.setState ({notifications});
    });
  }
  _onRefresh = () => {
    this.setState ({refreshing: true}, () => {
      this.loadNotifications ((err, body) => {
        if (err) {
          this.setState ({refreshing: false, notifications: []});
        } else {
          this.refreshingScrollView = true;
          this.setState ({refreshing: false, notifications: body});
        }
      });
    });
  };
  render () {
    let monthBlocks = {};
    let monthOrder = [];
    let monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    let {notifications} = this.state;
    notifications = notifications.map (notification => {
      return {
        ...notification,
        send_date: notification.send_date
          ? new Date (notification.send_date)
          : new Date (),
      };
    });
    notifications.sort ((a, b) => {
      return a.send_date.getTime () > b.send_date.getTime () ? -1 : 1;
    });
    if (notifications.length) {
      let currentMonth = notifications[0].send_date.getMonth ();
      monthBlocks[currentMonth] = [];
      monthOrder.push (currentMonth);
      notifications.forEach (event => {
        if (event.send_date.getMonth () == currentMonth) {
          monthBlocks[currentMonth].push (event);
        } else {
          currentMonth = event.send_date.getMonth ();
          monthOrder.push (currentMonth);
          monthBlocks[currentMonth] = [event];
        }
      });
    }
    return (
      <View style={[styles.container, global.user.primaryTheme ()]}>
        <HeaderBar
          iconLeft={
            <Touchable onPress={() => this.props.navigation.goBack ()}>
              <LeftIcon size={28} />
            </Touchable>
          }
          iconRight={<EmptyIcon size={28} />}
          width={width}
          height={60}
          title="Notifications"
        />
        <View style={[styles.bodyHolder, global.user.primaryTheme ()]}>
          {this.state.notifications.length
            ? <FlatList
                data={monthOrder}
                onRefresh={this._onRefresh}
                refreshing={false}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                  />
                }
                renderItem={({item, index}) => (
                  <MonthBlock
                    parent={this}
                    index={index}
                    notifications={monthBlocks[item]}
                    month={monthNames[item]}
                    navigation={this.props.navigation}
                  />
                )}
                keyExtractor={(item, index) => `Block_${index}`}
              />
            : <Text
                style={{
                  color: global.user.getSecondaryTextColor (),
                  textAlign: 'center',
                  fontSize: 18,
                  marginTop: 50,
                  padding: 20,
                }}
              >
                No Notifications Yet! Notifications will be sent out by the office
              </Text>}

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
  announcement: {
    width,
    height: 50,
  },
  titleBlock: {
    width: width,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingTop: 20,
    paddingLeft: 10,
    paddingBottom: 0,
    paddingRight: 10,
  },
  h1: {
    fontSize: 34,
    fontWeight: 'bold',
  },
});
