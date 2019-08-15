import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  Alert,
  Text,
  Keyboard,
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

import Touchable from 'react-native-platform-touchable';

import ApexAPI from '../../http/api';

import {ifIphoneX} from 'react-native-iphone-x-helper';

import moment from 'moment';

import * as Haptics from 'expo-haptics';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

class AnnouncementBlock extends React.Component {
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
        <View
          style={{
            borderTopWidth: StyleSheet.hairlineWidth,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: global.user.getBorderColor (),
            marginTop: 20,
          }}
        >
          {this.props.announcements.map ((announcement, index) => {
            return (
              <Announcement
                announcement={announcement}
                navigation={this.props.navigation}
                last={index == this.props.announcements.length - 1}
              />
            );
          })}
        </View>
      </View>
    );
  }
}

class Announcement extends React.Component {
  constructor (props) {
    super (props);
  }
  openAnnouncement = () => {
      this.props.navigation.navigate("Announcement", {announcement: this.props.announcement});
  }
  render () {
    return (
      <Touchable onPress={this.openAnnouncement}>
        <View style={[styles.announcement, global.user.secondaryTheme ()]}>
          <View
            style={{
              marginLeft: 20,
              height: 50,
              borderColor: this.props.last
                ? 'rgba(0,0,0,0}'
                : global.user.getBorderColor (),
              borderBottomWidth: StyleSheet.hairlineWidth,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingRight: 10,
            }}
          >
            <Text
              style={{
                fontSize: 22,
                color: global.user.getSecondaryTextColor (),
              }}
            >
              {moment (this.props.announcement.date_announced).format (
                'MMMM Do, YYYY'
              )}
            </Text>
            <RightIcon style={{marginTop: 3}} size={30} color="orange" />
          </View>
        </View>
      </Touchable>
    );
  }
}

export default class AnnouncementsScreen extends React.Component {
  constructor (props) {
    super (props);
    this.props = props;
    this.state = {
      announcements: [],
      limit: 365,
    };
    this.createQuestion = React.createRef ();
    this.actionSheet = React.createRef ();
    this._isMounted = false;
  }
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };
  loadAnnouncements = (limit = 365, callback) => {
    let api = new ApexAPI (global.user);
    api
      .get (`announcements/announcements?limit=${limit}`)
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
    this.loadAnnouncements (this.state.limit, (err, announcements) => {
      this._isMounted && this.setState ({announcements});
    });
  }
  _onRefresh = () => {
    this.setState ({refreshing: true}, () => {
      this.loadAnnouncements (this.state.limit, (err, body) => {
        if (err) {
          this.setState ({refreshing: false, questions: []});
        } else {
          this.refreshingScrollView = true;
          this.setState ({refreshing: false, announcements: body});
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
    let {announcements} = this.state;
    announcements = announcements.map (announcement => {
      return {
        ...announcement,
        date_announced: announcement.date_announced
          ? new Date (announcement.date_announced)
          : new Date (),
      };
    });
    announcements.sort ((a, b) => {
      return a.date_announced.getTime () > b.date_announced.getTime () ? -1 : 1;
    });
    if (announcements.length) {
      let currentMonth = announcements[0].date_announced.getMonth ();
      monthBlocks[currentMonth] = [];
      monthOrder.push (currentMonth);
      announcements.forEach (event => {
        if (event.date_announced.getMonth () == currentMonth) {
          monthBlocks[currentMonth].push (event);
        } else {
          currentMonth = event.date_announced.getMonth ();
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
          title="Announcements"
        />
        <View style={[styles.bodyHolder, global.user.primaryTheme ()]}>
          <FlatList
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
              <AnnouncementBlock
                parent={this}
                index={index}
                announcements={monthBlocks[item]}
                month={monthNames[item]}
                navigation={this.props.navigation}
              />
            )}
            keyExtractor={(item, index) => `Block_${index}`}
          />
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
