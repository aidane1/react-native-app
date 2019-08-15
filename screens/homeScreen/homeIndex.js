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
  RefreshControl,
  TouchableNativeFeedback,
} from 'react-native';

import {LinearGradient} from 'expo-linear-gradient';

import ParsedText from 'react-native-parsed-text';

import {boxShadows} from '../../constants/boxShadows';

import Touchable from 'react-native-platform-touchable';

import {Courses} from '../../classes/courses';

import moment from 'moment';

import ApexAPI from '../../http/api';
import {FlatList} from 'react-native-gesture-handler';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

class GradientBlock extends React.Component {
  render () {
    console.log (this.props);
    return (
      <Touchable
        style={[styles.gradientBlock, boxShadows.boxShadow4]}
        onPress={() => this.props.navigateToPage ('CourseInfo', this.props.id)}
      >
        <LinearGradient
          colors={['#e8865c', '#e86e5c']}
          // colors={['#e64b90', '#d81e72']}
          style={[styles.gradientBlockChild]}
        >
          <View style={styles.blockBody}>
            <View style={styles.blockHeader}>
              <Text style={styles.blockHeaderText}>
                {this.props.title}
              </Text>
            </View>
            <View style={styles.blockLeft}>
              <Text
                style={[styles.blockMain, {maxWidth: width * 0.95 - 100}]}
                numberOfLines={1}
              >
                {this.props.main}
              </Text>
              <Text style={styles.blockSecondary}>
                {this.props.secondary}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Touchable>
    );
  }
}
class EventBlock extends React.Component {
  render () {
    return (
      <Touchable
        style={[styles.gradientBlock, boxShadows.boxShadow4]}
        onPress={() => this.props.navigation.navigate ('Events')}
        // useForeground={true}
        // background={TouchableNativeFeedback.SelectableBackground ()}
        // background={Touchable.Ripple ('white')}
      >
        <LinearGradient
          // colors={['#5cc0e8', '#5c9be8']}
          colors={['#5c9be8', '#3b87e3']}
          style={styles.gradientBlockChild}
        >
          <View style={[styles.blockBody, {flexDirection: 'column'}]}>
            <View>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <Text style={styles.eventTopRow}>
                  {this.props.title}
                  {' '}
                  {!this.props.school_in ? '(No School)' : ''}
                </Text>
              </ScrollView>
            </View>
            <View style={styles.eventBottomRow}>
              <Text style={styles.eventBottomRowText}>

                {moment (this.props.event_date).format ('dddd, MMMM Do, YYYY')}
              </Text>
              <Text style={styles.eventBottomRowText}>
                {this.props.time}
              </Text>
            </View>
          </View>
        </LinearGradient>

      </Touchable>
    );
  }
}

class RecentNotifications extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      notifications: [
        {
          data: 'No Notifications!',
          send_date: new Date (),
        },
      ],
    };
  }
  componentDidMount () {
    let api = new ApexAPI (global.user);
    api.get ('/notifications').then (data => data.json ()).then (data => {
      if (data.status == 'ok') {
        let current = new Date ();
        let notifications = data.body
          .filter (notification => {
            return (
              new Date (notification.send_date).getTime () >
              new Date (
                current.getFullYear (),
                current.getMonth (),
                current.getDate () - 3
              ).getTime ()
            );
          })
          .sort ((a, b) => {
            return new Date (a.send_date).getTime () >
              new Date (b.send_date).getTime ()
              ? -1
              : 1;
          });
        notifications.length && this.setState ({notifications});
      }
    });
  }
  render () {
    return (
      <View>
        <FlatList
          data={this.state.notifications}
          keyExtractor={(item, index) => item._id}
          renderItem={({item, index}) => (
            <NotificationBlock
              notification={item}
              navigation={this.props.navigation}
            />
          )}
        />
      </View>
    );
  }
}
class NotificationBlock extends React.Component {
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
      <Touchable
        onPress={() => this.props.navigation.navigate ('Notifications')}
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
          colors={['#67b71a', '#508e14']}
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
      </Touchable>
    );
  }
}
class AssignmentBlock extends React.Component {
  constructor (props) {
    super (props);
  }
  render () {
    return this.props.id == '_'
      ? <View style={[styles.gradientBlock, boxShadows.boxShadow4]}>
          <LinearGradient
            colors={['#289e10', '#147500']}
            style={[styles.gradientBlockChild]}
          >
            <View style={[styles.blockBody, {flexDirection: 'column'}]}>
              <View>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <Text style={styles.eventTopRow}>
                    {this.props.assignmentTitle}
                  </Text>
                </ScrollView>
              </View>
              <View style={styles.eventBottomRow}>
                <Text style={styles.eventBottomRowText}>
                  {this.props.topic}
                </Text>
                <Text style={styles.eventBottomRowText}>
                  {this.props.dueDate}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      : <Touchable
          style={[styles.gradientBlock, boxShadows.boxShadow4]}
          onPress={() =>
            this.props.navigateToPage (
              'CourseInfo',
              this.props.referenceCourse
            )}
        >
          <LinearGradient
            colors={['#289e10', '#147500']}
            style={[styles.gradientBlockChild]}
          >
            <View style={[styles.blockBody, {flexDirection: 'column'}]}>
              <View>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <Text style={styles.eventTopRow}>
                    {this.props.assignmentTitle}
                  </Text>
                </ScrollView>
              </View>
              <View style={styles.eventBottomRow}>
                <Text style={styles.eventBottomRowText}>
                  {this.props.topic}
                </Text>
                <Text style={styles.eventBottomRowText}>
                  {this.props.dueDate}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Touchable>;
  }
}

export default class HomeScreenTile extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };
  constructor (props) {
    super (props);
    this.props = props;
    this.state = {
      refreshing: false,
    };
  }

  _onRefresh = () => {
    this.setState ({refreshing: true});
    // this.props.navigation.replace("Home");
    setTimeout (() => {
      this.props.parent.setState ({currentDate: new Date ()}, () => {
        this.setState ({refreshing: false});
      });
    }, 400);
  };

  _navigateToPage = async (page, id) => {
    console.log ({page, id});
    global.courseInfoCourse = await Courses._retrieveCourseById (id);
    if (global.courseInfoCourse.id != '_') {
      this.props.parent.props.navigation.navigate (page);
    }
  };

  render () {
    return (
      <ScrollView
        style={[
          styles.scrollBack,
          {backgroundColor: global.user.getPrimaryTheme ()},
        ]}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
      >
        <View style={styles.backdrop}>
          <View style={[styles.titleBlock, global.user.borderColor ()]}>
            <Text
              style={[styles.h1, {color: global.user.getPrimaryTextColor ()}]}
            >
              {this.props.dayTitle}
            </Text>
          </View>
          <GradientBlock
            {...this.props.current}
            navigateToPage={this._navigateToPage}
          />
          <GradientBlock
            {...this.props.next}
            navigateToPage={this._navigateToPage}
          />
          <View style={[styles.titleBlock, global.user.borderColor ()]}>
            <Text
              style={[styles.h1, {color: global.user.getPrimaryTextColor ()}]}
            >
              Events
            </Text>
          </View>
          {this.props.events.map ((y, i) => {
            return (
              <EventBlock
                key={`event_${i}`}
                {...y}
                navigation={this.props.parent.props.navigation}
              />
            );
          })}
          <View style={[styles.titleBlock, global.user.borderColor ()]}>
            <Text
              style={[styles.h1, {color: global.user.getPrimaryTextColor ()}]}
            >
              Notifications
            </Text>
          </View>
          <RecentNotifications
            navigation={this.props.parent.props.navigation}
          />
          <View style={{width, height: 20}} />
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create ({
  scrollBack: {
    width: width,
    backgroundColor: '#f0f0f0',
  },
  backdrop: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
  gradientBlock: {
    width: width * 0.95,
    marginTop: 10,
  },
  gradientBlockChild: {
    width: width * 0.95,
    paddingTop: 5,
    paddingRight: 15,
    paddingBottom: 10,
    paddingLeft: 15,
    borderRadius: 5,
  },
  blockBody: {
    flexDirection: 'row',
  },
  blockHeader: {
    flexGrow: 1,
  },
  blockHeaderText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 5,
  },
  blockMain: {
    fontSize: 35,
    fontWeight: '200',
    color: '#ffffff',
    textAlign: 'right',
    overflow: 'hidden',
  },
  blockSecondary: {
    fontSize: 14,
    fontWeight: '300',
    opacity: 0.7,
    color: '#ffffff',
    textAlign: 'right',
  },
  eventBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventBottomRowText: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.7,
  },
  eventTopRow: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 5,
    paddingBottom: 10,
  },
});
