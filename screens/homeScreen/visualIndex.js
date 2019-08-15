import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Dimensions,
  CameraRoll,
  Alert,
  Button,
} from 'react-native';

import {
  ChatIcon,
  QuestionIcon,
  NotesIcon,
  QuestionMarkIcon,
  CompassIcon,
  MoreIcon,
  CoursesIcon,
} from '../../classes/icons';

import HeaderBar from '../../components/header';

import HomeScreenTile from './homeIndex';

import LinkScreenTile from './courseIndex';

import ActivityScreenTile from './acitvityIndex';

import TabBar from '../../components/tabBar';

import Touchable from 'react-native-platform-touchable';

import {boxShadows} from '../../constants/boxShadows';

import {AccountIcon, EmptyIcon, RefreshIcon} from '../../classes/icons';

import {Assignment, Assignments} from '../../classes/assignments';

import {ImportantDate, ImportantDates} from '../../classes/importantDates';

import {Note, Notes} from '../../classes/notes';

import {Topic, Topics} from '../../classes/topics';

import {Course, Courses} from '../../classes/courses';

import {Semester, Semesters} from '../../classes/semesters';

import {Event, Events} from '../../classes/events';

import {School, DayBlock} from '../../classes/school';

import moment from 'moment';

import {User} from '../../classes/user';

import ApexAPI from '../../http/api';

import {ifIphoneX} from 'react-native-iphone-x-helper';

import Constants from 'expo-constants';

import * as Speech from 'expo-speech';

import {FloatingAction} from 'react-native-floating-action';

import {StackActions, NavigationActions} from 'react-navigation';

function formatUnit (hour, minute) {
  return `${(hour + 11) % 12 + 1}:${minute.toString ().length == 1 ? '0' + minute.toString () : minute}`;
}
function formatTime (time) {
  return `${formatUnit (time.start_hour, time.start_minute)} - ${formatUnit (time.end_hour, time.end_minute)}`;
}

export default class VisualPage extends React.Component {
  constructor (props) {
    super (props);
    this.speaking = false;

    this.longPressBack = false;
    this.longPressForwards = false;
  }

  readOut = section => {
    let speech = `Current Time: ${moment (this.props.date).format ('h:mm a')}: `;
    if (section == 'today') {
      let timesOne = this.props.current.secondary.split (' - ');
      let timesTwo = this.props.next.secondary.split (' - ');
      if (timesOne.length == 2) timesOne = `${timesOne[0]}: to ${timesOne[1]}:`;
      if (timesTwo.length == 2) timesTwo = `${timesTwo[0]}: to ${timesTwo[1]}:`;
      speech += `Today: ${this.props.dayTitle}: current class: ${this.props.current.main}: from ${timesOne}. Next Class: ${this.props.next.main}: from ${timesTwo}:`;
    } else if (section == 'courses') {
      this.props.courses.forEach (course => {
        speech += `${course.course} with ${course.teacher}: . . . ${formatUnit (course.time_num.start_hour, course.time_num.start_minute)} to ${formatUnit (course.time_num.end_hour, course.time_num.end_minute)}:`;
      });
    } else {
      this.props.events.forEach (event => {
        if (event.title == 'No Events!') {
          speech += ': No Events :';
        } else {
          speech += `Upcoming Event: ${event.title} : at : ${event.time} : on : ${moment (event.event_date).format ('MMMM Do, YYYY')} : ${event.school_in ? ':' : 'School Not Attended:'}`;
        }
      });
    }
    this.speak (speech);
  };

  speak = (text, rate = 0.9, callback = () => {}) => {
    if (!this.speaking) {
      this.speaking = true;
      Speech.speak (text, {
        // voice: 'com.apple.ttsbundle.siri_male_en-AU_compact',
        onDone: () => {
          this.speaking = false;
          callback ();
        },
        rate,
      });
    } else {
      Speech.stop ();
      this.speaking = false;
    }
  };
  longPress = section => {};

  dayBack = () => {
    if (!this.speaking) {
      this.longPressBack = false;
      let newDate = new Date (
        this.props.date.getFullYear (),
        this.props.date.getMonth (),
        this.props.date.getDate () - 1,
        this.props.date.getHours (),
        this.props.date.getMinutes ()
      );
      this.props.parent.setState ({currentDate: newDate}, () => {
        let speech = `back one day, to ${moment (newDate).format ('dddd, MMMM Do, YYYY')}`;
        this.speak (speech, 1.1);
      });
    } else {
      Speech.stop ();
      this.speaking = false;
    }
  };

  quickDayBack = () => {
    if (!this.speaking) {
      this.longPressBack = true;
      let newDate = new Date (
        this.props.date.getFullYear (),
        this.props.date.getMonth (),
        this.props.date.getDate () - 1,
        this.props.date.getHours (),
        this.props.date.getMinutes ()
      );
      this.readDaysBack (newDate, true);
    } else {
      Speech.stop ();
      this.speaking = false;
    }
  };

  readDaysBack = (day, readMonth = false) => {
    this.props.parent.setState ({currentDate: day}, () => {
      let speech;
      if (readMonth) {
        if (day.getMonth () === 11) {
          speech = moment (day).format ('MMMM Do, YYYY');
        } else {
          speech = moment (day).format ('MMMM Do');
        }
      } else {
        speech = moment (day).format ('Do');
      }
      this.speak (speech, 1.3, () => {
        if (this.longPressBack) {
          let newDate = new Date (
            this.props.date.getFullYear (),
            this.props.date.getMonth (),
            this.props.date.getDate () - 1,
            this.props.date.getHours (),
            this.props.date.getMinutes ()
          );
          this.readDaysBack (newDate, newDate.getMonth () != day.getMonth ());
        }
      });
    });
  };

  quickDayForwards = () => {
    if (!this.speaking) {
      this.longPressBack = true;
      let newDate = new Date (
        this.props.date.getFullYear (),
        this.props.date.getMonth (),
        this.props.date.getDate () + 1,
        this.props.date.getHours (),
        this.props.date.getMinutes ()
      );
      this.readDaysForwards (newDate, true);
    } else {
      Speech.stop ();
      this.speaking = false;
    }
  };

  readDaysForwards = (day, readMonth = false) => {
    this.props.parent.setState ({currentDate: day}, () => {
      let speech;
      if (day.getDate () === 1 || readMonth) {
        if (day.getMonth () === 0) {
          speech = moment (day).format ('MMMM Do, YYYY');
        } else {
          speech = moment (day).format ('MMMM Do');
        }
      } else {
        speech = moment (day).format ('Do');
      }
      this.speak (speech, 1.3, () => {
        if (this.longPressBack) {
          let newDate = new Date (
            this.props.date.getFullYear (),
            this.props.date.getMonth (),
            this.props.date.getDate () + 1,
            this.props.date.getHours (),
            this.props.date.getMinutes ()
          );
          this.readDaysForwards (newDate);
        }
      });
    });
  };

  releaseBack = () => {
    this.longPressBack = false;
    this.longPressForwards = false;
  };
  dayForward = () => {
    if (!this.speaking) {
      this.longPressForwards = false;
      let newDate = new Date (
        this.props.date.getFullYear (),
        this.props.date.getMonth (),
        this.props.date.getDate () + 1,
        this.props.date.getHours (),
        this.props.date.getMinutes ()
      );
      this.props.parent.setState ({currentDate: newDate}, () => {
        let speech = `Forwards one day, to ${moment (newDate).format ('dddd, MMMM Do, YYYY')}`;
        this.speak (speech, 1.1);
      });
    } else {
      Speech.stop ();
      this.speaking = false;
    }
  };

  render () {
    return (
      <View
        style={{
          flexDirection: 'column',
          height: ifIphoneX (this.props.height - 80, this.props.height - 60),
        }}
      >
        <View
          style={{
            flexDirection: 'column',
            width: this.props.width,
            height: ifIphoneX (
              2 * (this.props.height - 80) / 2,
              2 * (this.props.height - 60) / 2
            ),
          }}
        >
          <Touchable
            style={[
              styles.accessButton,
              {backgroundColor: '#32a852'},
              boxShadows.boxShadow4,
            ]}
            onPress={() => this.readOut ('today')}
            onLongPress={() => this.longPress ('today')}
          >
            <Text style={styles.accessButtonText}>Today</Text>
          </Touchable>
          <Touchable
            style={[
              styles.accessButton,
              {backgroundColor: '#44bac9'},
              boxShadows.boxShadow4,
            ]}
            onPress={() => this.readOut ('courses')}
            onLongPress={() => this.longPress ('courses')}
          >
            <Text style={styles.accessButtonText}>Courses</Text>
          </Touchable>
          <Touchable
            style={[
              styles.accessButton,
              {backgroundColor: '#d68d45'},
              boxShadows.boxShadow4,
            ]}
            onPress={() => this.readOut ('events')}
          >
            <Text style={styles.accessButtonText}>Events</Text>
          </Touchable>
          <View
            style={{
              flexDirection: 'row',
              flexGrow: 1 / 7,
              flexBasis: 0,
            }}
          >
            <Touchable
              onPress={this.dayBack}
              style={{
                margin: 3,
                flexGrow: 1,
                flexBasis: 0,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 3,
                backgroundColor: '#6c45d6',
              }}
              onLongPress={this.quickDayBack}
              onPressOut={this.releaseBack}
            >
              <Text style={{fontSize: 25, fontWeight: 500}}>Backwards</Text>
            </Touchable>
            <Touchable
              onPress={this.dayForward}
              style={{
                margin: 3,
                flexGrow: 1,
                flexBasis: 0,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 3,
                backgroundColor: '#9d43d1',
              }}
              onLongPress={this.quickDayForwards}
              onPressOut={this.releaseBack}
            >
              <Text style={{fontSize: 25, fontWeight: 500}}>Forwards</Text>
            </Touchable>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create ({
  accessButton: {
    flexGrow: 2 / 7,
    flexBasis: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
    borderRadius: 3,
  },
  accessButtonText: {
    fontSize: 30,
    fontWeight: '500',
  },
});
