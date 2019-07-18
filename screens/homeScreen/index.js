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
  AsyncStorage,
  Button,
} from 'react-native';

import {
  ChatIcon,
  QuestionIcon,
  NotesIcon,
  AssignmentsIcon,
} from '../../classes/icons';

import HeaderBar from '../../components/header';

import HomeScreenTile from './homeIndex';

import LinkScreenTile from './courseIndex';

import ScheduleScreenTile from './scheduleIndex';

import TabBar from '../../components/tabBar';

import Touchable from 'react-native-platform-touchable';

import {AccountIcon, EmptyIcon, RefreshIcon} from '../../classes/icons';

import {Assignment, Assignments} from '../../classes/assignments';

import {Note, Notes} from '../../classes/notes';

import {Topic, Topics} from '../../classes/topics';

import ApexAPI from '../../http/api';

import {ifIphoneX} from 'react-native-iphone-x-helper';

import Constants from 'expo-constants';

import * as Speech from 'expo-speech';

import {FloatingAction} from 'react-native-floating-action';

import {StackActions, NavigationActions} from 'react-navigation';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

function formatUnit (hour, minute) {
  return `${(hour + 11) % 12 + 1}:${minute.toString ().length == 1 ? '0' + minute.toString () : minute}`;
}
function formatTime (time) {
  return `${formatUnit (time.start_hour, time.start_minute)} - ${formatUnit (time.end_hour, time.end_minute)}`;
}

export default class HomeScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };
  constructor (props) {
    super (props);
    this.props = props;
    this.dayMap = global.dayMap || {};
    // this.semesterMap = global.semesterMap || {};
    // this.school = global.school || {};
    // this.currentSemesters = global.currentSemesters || [];
    this.schedule = global.school.schedule || [];
    // this.dates = global.dates || {startDate: new Date(), newDate: new Date()};
    // this.currentCourses = global.currentCourseMap || {};
    //these will hold the value of the items that will be displayed. they will be programically updated before the
    //widget is rendered. It makes the rendering code cleaner
    this.state = {
      currentDate: new Date (2019, 10, 8, 9, 10),
    };

    this.speaking = false;

    this.current;
    this.next;
    this.dayTitle;
    this.events;
    this.assignments;
    this.courses;
    // let currentDate = new Date();
  }

  componentDidMount () {
    let api = new ApexAPI ({
      'x-api-key': global.user['x-api-key'],
      school: global.user['school'],
      'x-id-key': global.user['x-id-key'],
    });
    if (global.user.courses.length) {
      api
        .get (`topics?reference_course=${global.user.courses.join (',')}`)
        .then (res => res.json ())
        .then (async data => {
          if (data.status == 'ok') {
            await Topics._saveToStorage (
              data.body.map (topic => {
                return {
                  topic: topic.topic,
                  course: topic.reference_course,
                  id: topic._id,
                };
              })
            );
            global.topics = await Topics._retrieveFromStorage ();
          }
        })
        .catch (e => {
          console.log (e);
        });
      api
        .get (
          `assignments?populate=resources,response_resources&reference_course=${global.user.courses.join (',')}`
        )
        .then (res => res.json ())
        .then (async data => {
          if (data.status == 'ok') {
            await Assignments._saveToStorage (
              data.body.map (assignment => {
                return {
                  topic: assignment.topic || '_',
                  id: assignment._id,
                  assignmentTitle: assignment.assignment_title,
                  assignmentNotes: assignment.assignment_notes,
                  dueDate: assignment.due_date,
                  date: assignment.date,
                  referenceCourse: assignment.reference_course,
                  resources: assignment.resources || [],
                  responseResources: assignment.response_resources || [],
                  helpful: assignment.helpful_votes.length,
                  unhelpful: assignment.unhelpful_votes.length,
                  userVote: assignment.helpful_votes.indexOf (global.user.id) >=
                    0
                    ? 1
                    : assignment.unhelpful_votes.indexOf (global.user.id) >= 0
                        ? -1
                        : 0,
                };
              })
            );
            global.assignments = await Assignments._retrieveFromStorage ();
          }
        })
        .catch (e => {
          console.log (e);
        });
      api
        .get (
          `notes?populate=resources&reference_course=${global.user.courses.join (',')}`
        )
        .then (res => res.json ())
        .then (async data => {
          if (data.status == 'ok') {
            await Notes._saveToStorage (
              data.body.map (note => {
                return {
                  topic: note.topic || '_',
                  id: note._id,
                  note: note.note,
                  date: note.date,
                  referenceCourse: note.reference_course,
                  resources: note.resources || [],
                  helpful: note.helpful_votes.length,
                  unhelpful: note.unhelpful_votes.length,
                  userVote: note.helpful_votes.indexOf (global.user.id) >= 0
                    ? 1
                    : note.unhelpful_votes.indexOf (global.user.id) >= 0
                        ? -1
                        : 0,
                };
              })
            );
            global.notes = await Notes._retrieveFromStorage ();
          }
        })
        .catch (e => {
          console.log (e);
        });
    }
    if (global.status == 'granted') {
      CameraRoll.getPhotos ({
        first: 500,
        assetType: 'Photos',
        groupTypes: 'All',
      }).then (photos => {
        photos.edges.sort ((a, b) => b.node.timestamp - a.node.timestamp);
        global.cameraRollImages = photos.edges.slice (0, 70);
      });
    }
  }
  readOut = section => {
    if (!this.speaking) {
      this.speaking = true;
      let speech = `Current Time: ${new Date ().getHours () % 12}: ${new Date ().getMinutes ()}: `;
      if (section == 'today') {
        let timesOne = this.current.secondary.split (' - ');
        let timesTwo = this.next.secondary.split (' - ');
        if (timesOne.length == 2)
          timesOne = `${timesOne[0]}: to ${timesOne[1]}:`;
        if (timesTwo.length == 2)
          timesTwo = `${timesTwo[0]}: to ${timesTwo[1]}:`;
        speech += `Today: ${this.dayTitle}: current class: ${this.current.main}: from ${timesOne}. Next Class: ${this.next.main}: from ${timesTwo}:`;
      } else if (section == 'courses') {
        this.courses.forEach (course => {
          speech += `${course.course} with ${course.teacher}: . . . ${formatUnit (course.time_num.start_hour, course.time_num.start_minute)} to ${formatUnit (course.time_num.end_hour, course.time_num.end_minute)}:`;
        });
      } else {
      }
      Speech.speak (speech, {
        voice: 'com.apple.ttsbundle.siri_male_en-AU_compact',
        onDone: () => {
          this.speaking = false;
        },
        rate: 0.8,
      });
    } else {
      Speech.stop ();
      this.speaking = false;
    }
  };
  longPress = section => {};
  render () {
    const actions = [
      {
        text: 'Questions',
        // icon: require ('./images/ic_accessibility_white.png'),
        icon: <QuestionIcon size={22} />,
        name: 'Questions',
        position: 2,
      },
      {
        text: 'Chatrooms',
        // icon: require ('./images/ic_language_white.png'),
        icon: <ChatIcon size={22} style={{marginTop: 3}} />,
        name: 'Chatrooms',
        position: 1,
      },
      {
        text: 'Notes',
        // icon: require ('./images/ic_room_white.png'),
        icon: <NotesIcon size={22} />,
        name: 'Notes',
        position: 3,
      },
      {
        text: 'Assignments',
        // icon: require ('./images/ic_videocam_white.png'),
        icon: <AssignmentsIcon size={22} />,
        name: 'Assignments',
        position: 4,
      },
    ];
    let {currentDate} = this.state;
    let currentSemesters = global.semesters
      .filter (semester => {
        return (
          semester.startDate.getTime () <= currentDate.getTime () &&
          semester.endDate.getTime () >= currentDate.getTime ()
        );
      })
      .map (semester => {
        return semester.id;
      });
    let courseMap = {};
    for (var i = 0; i < currentSemesters.length; i++) {
      for (var key in global.semesterMap[currentSemesters[i]]) {
        if (
          courseMap[key] == undefined ||
          global.semesterMap[currentSemesters[i]][key].isReal
        ) {
          courseMap[key] = global.semesterMap[currentSemesters[i]][key];
        }
      }
    }

    let today = this.dayMap[
      `${currentDate.getFullYear ()}_${currentDate.getMonth ()}_${currentDate.getDate ()}`
    ];

    let todaySchedule = today !== undefined
      ? global.school.rawSchedule['day_blocks'][today.week][today.day]
      : [];
    let todayTimes = today !== undefined
      ? global.school.rawSchedule['block_times']
      : [];

    // [{course, teacher, time, id, isReal}]
    let courseList = [];
    if (todaySchedule !== undefined && todaySchedule.length > 0) {
      let blockCount = 0;
      for (var i = 0; i < todaySchedule.length; i++) {
        let currentStartBlock = todayTimes[blockCount];
        let currentEndBlock =
          todayTimes[blockCount + todaySchedule[i].block_span - 1];
        let currentTime = {
          start_hour: currentStartBlock.start_hour,
          start_minute: currentStartBlock.start_minute,
          end_hour: currentEndBlock.end_hour,
          end_minute: currentEndBlock.end_minute,
        };
        courseList.push ({
          time_num: currentTime,
          course: courseMap[todaySchedule[i].block].course,
          category: courseMap[todaySchedule[i].block].category,
          teacher: courseMap[todaySchedule[i].block].teacher,
          time: formatTime (currentTime),
          id: courseMap[todaySchedule[i].block].id,
          isReal: false,
        });
        blockCount += todaySchedule[i].block_span;
      }
    } else {
      courseList.push ({
        course: 'Nothing!',
        teacher: 'Free',
        time: 'All Day',
        category: 'other',
        id: '_',
        isReal: false,
      });
    }
    this.courses = courseList;

    // string
    let dayTitle = 'Off!';
    // {title, main, secondary}
    let current = {title: 'Current', main: 'Nothing!', secondary: 'Now'};
    // {title, main, secondary}
    let next = {title: 'Next', main: 'Nothing!', secondary: 'Now'};

    let foundCurrent = false;
    for (var i = 0; i < courseList.length; i++) {
      if (
        !foundCurrent &&
        courseList[i].time_num.end_hour * 60 +
          courseList[i].time_num.end_minute >=
          currentDate.getHours () * 60 + currentDate.getMinutes ()
      ) {
        let beforeStart = false;
        if (
          courseList[i].time_num.start_hour * 60 +
            courseList[i].time_num.start_minute <=
          currentDate.getHours () * 60 + currentDate.getMinutes ()
        ) {
          current = {
            title: 'Current',
            main: courseList[i].course,
            secondary: courseList[i].time,
          };
        } else {
          beforeStart = true;
        }
        if (i != courseList.length - 1) {
          if (beforeStart) {
            next = {
              title: 'Next',
              main: courseList[i].course,
              secondary: courseList[i].time,
            };
          } else {
            next = {
              title: 'Next',
              main: courseList[i + 1].course,
              secondary: courseList[i + 1].time,
            };
          }
        }
        foundCurrent = true;
      }
    }
    this.current = current;
    this.next = next;
    this.dayTitle = dayTitle;

    //[{date, time, info}]
    let events = [{date: 'today', time: 'today', info: 'No Events!'}];
    this.events = events;
    // {date: {scheduleWeek, scheduleDay, events, dayDisplayed}}
    // this.calendar = this.dayMap;
    let assignments = Object.keys (courseMap)
      .filter (block => {
        let courseAssignments = Assignments._retrieveAssignmentsByCourse (
          global.assignments,
          courseMap[block].id
        );
        let topicsList = Topics._MakeCourseTopicList (
          courseMap[block].id,
          global.topics
        );
        let topicsMap = Topics._makeTopicMap (topicsList);
        if (
          courseAssignments.length > 0 &&
          topicsMap[courseAssignments[0].topic]
        ) {
          return true;
        } else {
          return false;
        }
      })
      .map (block => {
        if (courseMap[block].id != '_') {
          let courseAssignments = Assignments._retrieveAssignmentsByCourse (
            global.assignments,
            courseMap[block].id
          ).sort ((a, b) => {
            return a.date.getTime () > b.date.getTime () ? -1 : 1;
          });
          let topicsList = Topics._MakeCourseTopicList (
            courseMap[block].id,
            global.topics
          );
          let topicsMap = Topics._makeTopicMap (topicsList);
          if (topicsMap[courseAssignments[0].topic]) {
            return {
              ...courseAssignments[0],
              topic: topicsMap[courseAssignments[0].topic].topic,
            };
          } else {
            return {
              ...courseAssignments[0],
              topic: 'No Topic',
            };
          }
        }
      });
    if (assignments.length == 0) {
      assignments = [
        {
          assignmentTitle: 'No Assignments!',
          dueDate: 'today',
          topic: 'No Topic',
          referenceCourse: '_',
        },
      ];
    }
    this.assignments = assignments;
    return (
      <View style={styles.container}>
        <HeaderBar
          iconLeft={
            <Touchable
              onPress={() => this.props.navigation.navigate ('Account')}
            >
              <AccountIcon
                size={28}
                style={{paddingLeft: 10, paddingRight: 10, paddingTop: 10}}
              />
            </Touchable>
          }
          iconRight={
            <Touchable onPress={() => this.props.navigation.replace ('Home')}>
              <RefreshIcon
                size={28}
                style={{paddingLeft: 10, paddingRight: 10, paddingTop: 10}}
              />
            </Touchable>
          }
          width={width}
          height={60}
          title="Home"
        />
        {global.user.visuallyImpared
          ? <View
              style={{
                flexDirection: 'column',
                height: ifIphoneX (height - 80, height - 60),
              }}
            >
              <View
                style={{
                  flexDirection: 'column',
                  width,
                  height: ifIphoneX (
                    2 * (height - 80) / 2,
                    2 * (height - 60) / 2
                  ),
                }}
              >
                <Touchable
                  style={styles.accessButton}
                  onPress={() => this.readOut ('today')}
                  onLongPress={() => this.longPress ('today')}
                >
                  <Text style={styles.accessButtonText}>Today</Text>
                </Touchable>
                <Touchable
                  style={styles.accessButton}
                  onPress={() => this.readOut ('courses')}
                  onLongPress={() => this.longPress ('courses')}
                >
                  <Text style={styles.accessButtonText}>Courses</Text>
                </Touchable>
                <Touchable
                  style={styles.accessButton}
                  onPress={() => this.readOut ('schedule')}
                >
                  <Text style={styles.accessButtonText}>Schedule</Text>
                </Touchable>
              </View>
              <Text>Yeet</Text>
            </View>
          : <View>
              <View style={styles.bodyHolder}>
                <ScrollView
                  horizontal={true}
                  style={styles.slideView}
                  scrollEnabled={false}
                  ref={component => {
                    this._scrollMain = component;
                  }}
                >
                  <View style={styles.bodySlide}>
                    <HomeScreenTile
                      assignments={assignments}
                      dayTitle={dayTitle}
                      current={current}
                      next={next}
                      parent={this}
                      events={events}
                    />
                  </View>
                  <View style={styles.bodySlide}>
                    <LinkScreenTile
                      navigation={this.props.navigation}
                      courseList={courseList}
                    />
                  </View>
                  <View style={styles.bodySlide}>
                    <ScheduleScreenTile />
                  </View>
                </ScrollView>
              </View>
              <TabBar tapFunction={this} />
            </View>}

        <FloatingAction
          actions={actions}
          distanceToEdge={ifIphoneX (70, 50)}
          onPressItem={name => {
            this.props.navigation.navigate (name);
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create ({
  container: {
    width: width,
    flexGrow: 1,
    flexDirection: 'column',
  },
  bodyHolder: {
    ...ifIphoneX (
      {
        height: height - 80 - 60,
      },
      {
        height: height - 60 - 45,
      }
    ),
    zIndex: 1,
  },
  slideView: {
    width: width,
  },
  bodySlide: {
    width: width,
    flexGrow: 1,
  },
  accessButton: {
    width,
    flexGrow: 1 / 3,
    flexBasis: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 2,
    borderColor: '#000',
    borderWidth: 5,
  },
  accessButtonText: {
    fontSize: 30,
    fontWeight: '500',
  },
});
