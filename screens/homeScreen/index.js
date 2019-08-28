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
  LinkIcon,
  HomeIcon,
} from '../../classes/icons';

import HeaderBar from '../../components/header';

import * as Permissions from 'expo-permissions';

import {Notifications} from 'expo';

import HomeScreenTile from './homeIndex';

import LinkScreenTile from './courseIndex';

import VisualTile from './visualIndex';

import ActivityScreenTile from './acitvityIndex';

import TabBar from '../../components/tabBar';

import Touchable from '../../components/react-native-platform-touchable';

import {AccountIcon, EmptyIcon, RefreshIcon} from '../../classes/icons';

import {Assignment, Assignments} from '../../classes/assignments';

import {ImportantDate, ImportantDates} from '../../classes/importantDates';

import {Note, Notes} from '../../classes/notes';

import {Topic, Topics} from '../../classes/topics';

import {Course, Courses} from '../../classes/courses';

import {Semester, Semesters} from '../../classes/semesters';

import {Event, Events} from '../../classes/events';

import {School, DayBlock} from '../../classes/school';

import {User} from '../../classes/user';

import ApexAPI from '../../http/api';

import {ifIphoneX} from 'react-native-iphone-x-helper';

import Constants from 'expo-constants';

import * as Speech from 'expo-speech';

import {
  FloatingAction,
} from '../../components/react-native-floating-action/index';

import {StackActions, NavigationActions} from 'react-navigation';

import {
  constructCourseList,
  constructSchoolObject,
  constructSemesterList,
  constructTopicList,
  constructUserObject,
  constructEventList,
} from '../../data-parsing/server-parser';

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
      drawerLabel: 'Home',
      drawerIcon: <HomeIcon color="black"/>,
      header: null,
    };
  };
  constructor (props) {
    global.courseInfoPage = 'assignments';
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
      // currentDate: new Date (2019, 8, 19, 9, 10),
      currentDate: new Date (),
    };

    this.speaking = false;

    this.current;
    this.next;
    this.dayTitle;
    this.events;
    this.assignments;
    this.courses;

    this.message = React.createRef ();
  }

  loadHelpBanner = async () => {
    let state = await User._hasViewedHelp ();
    if (!state) {
      Alert.alert (
        'Help',
        'It is greatly advised that you skim through the tutorial before continued use. View the tutorial?',
        [
          {
            text: 'Tutorial',
            onPress: async () => {
              User._setHelpState (true);
              this.props.navigation.navigate ('Tutorial');
            },
          },
          {
            text: 'No',
            onPress: () => {
              Alert.alert (
                'Are you sure?',
                "The help page can be viewed from the more ... button or the navigation page any time you'd like",
                [
                  {
                    text: 'Tutorial',
                    onPress: async () => {
                      User._setHelpState (true);
                      this.props.navigation.navigate ('Tutorial');
                    },
                  },
                  {
                    text: 'Okay',
                    style: 'cancel',
                    onPress: async () => {
                      User._setHelpState (true);
                    },
                  },
                ]
              );
            },
            style: 'cancel',
          },
        ]
      );
    }
  };

  loadCoursesBanner () {
    if (global.user.courses.length === 0) {
      Alert.alert (
        'Courses',
        'You have no courses selected - select courses?',
        [
          {
            text: 'Yes',
            onPress: () => {
              this.props.navigation.navigate ('Courses');
            },
          },
          {
            text: 'No',
            onPress: () => {},
            style: 'cancel',
          },
        ]
      );
    }
  }

  loadRoomsPush = async () => {
    const {status: existingStatus} = await Permissions.getAsync (
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    let chatrooms = global.user.courses.map (course => `course_${course}`);
    if (global.districtInfo.grade) {
      chatrooms.push (`grade_${global.school.id}-${global.districtInfo.grade}`);
    }

    let sendObject = {
      chatrooms,
    };

    if (existingStatus === 'granted') {
      sendObject['push_token'] = await Notifications.getExpoPushTokenAsync ();
    }

    let api = new ApexAPI (global.user);

    api
      .put (`users/${global.user.id}`, sendObject)
      .then (data => data.json ())
      .then (data => {
        // console.log(data);
      });
  };

  componentDidMount () {
    this.loadHelpBanner ();
    this.loadCoursesBanner ();
    this.loadRoomsPush ();

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
                  uploaded_by: assignment.uploaded_by,
                  username: assignment.username,
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
                  uploaded_by: note.uploaded_by,
                  username: note.username,
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
      api
        .get (
          `important-dates?populate=resources&reference_course=${global.user.courses.join (',')}`
        )
        .then (res => res.json ())
        .then (async data => {
          if (data.status == 'ok') {
            await ImportantDates._saveToStorage (data.body);
            global.importantDates = await ImportantDates._retrieveFromStorage ();
          }
        })
        .catch (e => {
          console.log (e);
        });
    }
    if (global.status == 'granted') {
      CameraRoll.getPhotos (
        Platform.select ({
          ios: {
            first: 500,
            assetType: 'Photos',
            groupTypes: 'All',
          },
          android: {
            first: 500,
            assetType: 'Photos',
          },
        })
      ).then (photos => {
        photos.edges.sort ((a, b) => b.node.timestamp - a.node.timestamp);
        global.cameraRollImages = photos.edges.slice (0, 70);
      });
    }
    ApexAPI.authenticate (
      global.user.username,
      global.user.password,
      global.school.id
    )
      .then (res => res.json ())
      .then (async response => {
        if (response.status == 'ok') {
          global.courses = await Courses._saveToStorage (
            constructCourseList (response.body.courses)
          );
          global.semesters = await Semesters._saveToStorage (
            constructSemesterList (response.body.semesters)
          );
          global.events = await Events._saveToStorage (
            constructEventList (response.body.events)
          );
          global.school = await School._saveToStorage (
            constructSchoolObject (response.body.school, response.body.blocks)
          );
          global.dayMap = global.school['dayMap'];
          global.user.permission_level = response.body.permission_level;
          await User._saveToStorage (global.user);
          // global.user = await User._saveToStorage (
          //   constructUserObject ({
          //     grade: response.body.user.grade || global.user.grade || 9,
          //     scheduleImages: response.body.user.schedule_images,
          //     permission_level: response.body.permission_level,
          //     scheduleType: response.body.user.schedule_type,
          //     profile_picture: response.body.user.profile_picture,
          //     id: response.body.user._id,
          //     accountId: response.body.accountId,
          //     firstName: response.body.user.first_name,
          //     lastName: response.body.user.last_name,
          //     studentNumber: response.body.user.student_number,
          //     block_colors: response.body.user.block_colors,
          //     block_names: response.body.user.block_names,
          //     username: response.body.username,
          //     password: global.user.password,
          //     'x-api-key': response.body['api_key'],
          //     'x-id-key': response.body['_id'],
          //     courses: response.body.user.courses,
          //     pdf_announcements: response.body.user.pdf_announcements !==
          //       undefined
          //       ? response.body.user.pdf_announcements
          //       : true,
          //     school: school._id,
          //     notifications: {
          //       dailyAnnouncements: response.body.user.notifications
          //         .daily_announcements || false,
          //       nextClass: response.body.user.notifications.next_class || false,
          //       newAssignments: response.body.user.notifications
          //         .new_assignments !== undefined
          //         ? response.body.user.notifications.new_assignments
          //         : true,
          //       markedAssignments: response.body.user.notifications
          //         .marked_assignments || false,
          //       imageReplies: response.body.user.notifications.image_replies !==
          //         undefined
          //         ? response.body.user.notifications.image_replies
          //         : true,
          //       upcomingEvents: response.body.user.notifications
          //         .upcoming_events !== undefined
          //         ? response.body.user.notifications.upcoming_events
          //         : true,
          //       activities: response.body.user.notifications.activities ||
          //         false,
          //     },
          //     theme: response.body.user.theme || 'Light',
          //     trueDark: response.body.user.true_dark || false,
          //     visuallyImpared: response.body.user.visuallyImpared || false,
          //     automaticMarkRetrieval: response.body.user
          //       .automatic_mark_retrieval || false,
          //     automaticCourseUpdating: response.body.user
          //       .automatic_course_retrieval !== undefined
          //       ? response.body.user.automatic_course_retrieval
          //       : true,
          //   })
          // );
        }
      })
      .catch (e => {
        console.log (e);
      });
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
    // return <View />;
    try {
      const actions = [
        {
          text: 'Select Courses',
          // icon: require ('./images/ic_accessibility_white.png'),
          icon: <CoursesIcon size={22} style={{marginTop: 3}} />,
          name: 'Courses',
          position: 0,
        },
        {
          text: 'Chatrooms',
          // icon: require ('./images/ic_language_white.png'),
          icon: <ChatIcon size={22} style={{marginTop: 3}} />,
          name: 'Chatrooms',
          position: 1,
        },
        {
          text: 'School Forum',
          // icon: require ('./images/ic_accessibility_white.png'),
          icon: <QuestionIcon size={22} />,
          name: 'Questions',
          position: 2,
        },
        {
          text: 'My Classes',
          // icon: require ('./images/ic_room_white.png'),
          icon: <NotesIcon size={22} />,
          name: 'Assignments',
          position: 3,
        },
        {
          text: 'Links',
          // icon: require ('./images/ic_accessibility_white.png'),
          icon: <LinkIcon size={22} style={{marginTop: 3}} />,
          name: 'Links',
          position: 4,
        },
        {
          text: 'Help',
          // icon: require ('./images/ic_room_white.png'),
          icon: <QuestionMarkIcon size={22} />,
          name: 'Tutorial',
          position: 5,
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
      if (
        today &&
        today.school_in &&
        todaySchedule !== undefined &&
        todaySchedule.length > 0
      ) {
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
          if (courseMap[todaySchedule[i].block]) {
            courseList.push ({
              time_num: currentTime,
              block: todaySchedule[i].block,
              course: courseMap[todaySchedule[i].block].course,
              category: courseMap[todaySchedule[i].block].category,
              teacher: courseMap[todaySchedule[i].block].teacher,
              time: formatTime (currentTime),
              id: courseMap[todaySchedule[i].block].id,
              isReal: true,
            });
          } else {
            courseList.push ({
              time_num: currentTime,
              block: todaySchedule[i].block,
              course: global.school.spareName,
              category: 'other',
              teacher: 'Free',
              time: formatTime (currentTime),
              id: '_',
              isReal: false,
            });
          }

          blockCount += todaySchedule[i].block_span;
        }
      } else {
        courseList.push ({
          block: '_',
          course: 'Nothing!',
          teacher: 'Free',
          time: 'All Day',
          time_num: {
            start_hour: 0,
            end_hour: 23,
            start_minute: 0,
            end_minute: 59,
          },
          category: 'other',
          id: '_',
          isReal: false,
          isEmptyDay: true,
        });
      }
      this.courses = courseList;

      // string
      let dayTitle = 'No School!';
      if (today && today.week !== undefined && today.day && today.school_in) {
        dayTitle = global.school.day_titles[today.week][today.day];
      }
      // {title, main, secondary}
      let current = {
        title: 'Current',
        main: 'Nothing!',
        secondary: 'Now',
        id: '_',
      };
      // {title, main, secondary}
      let next = {title: 'Next', main: 'Nothing!', secondary: 'Now', id: '_'};

      let foundCurrent = false;
      if (courseList[0].isEmptyDay) {
      } else {
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
                id: courseList[i].id,
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
                  id: courseList[i].id,
                };
              } else {
                next = {
                  title: 'Next',
                  main: courseList[i + 1].course,
                  secondary: courseList[i + 1].time,
                  id: courseList[i].id,
                };
              }
            }
            foundCurrent = true;
          }
        }
      }
      this.current = current;
      this.next = next;
      this.dayTitle = dayTitle;

      // {date: {scheduleWeek, scheduleDay, events, dayDisplayed}}
      // this.calendar = this.dayMap;
      this.courseMap = courseMap;
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
          if (courseAssignments.length > 0) {
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

      this.events = global.events.filter (event => {
        return (
          event.event_date.getTime () - this.state.currentDate.getTime () > 0 &&
          event.event_date.getTime () - this.state.currentDate.getTime () <
            129600000
        );
      });
      if (this.events.length == 0) {
        this.events = [
          {
            event_date: this.state.currentDate,
            title: 'No Events!',
            time: 'now',
            school_in: true,
          },
        ];
      }
      return (
        <View style={styles.container}>
          <HeaderBar
            iconLeft={
              <Touchable
                // onPress={() => this.props.navigation.navigate ('Account')}
                // onPress={() => {
                //   console.log (this.props.navigation);
                // }}
                onPress={this.props.navigation.openDrawer}
                hitSlop={{top: 40, bottom: 40, left: 40, right: 40}}
              >
                <CompassIcon
                  size={32}
                  style={{paddingLeft: 8, paddingRight: 10, paddingTop: 10}}
                />
              </Touchable>
            }
            iconRight={
              <Touchable
                onPress={() => this.props.navigation.replace ('Home')}
                hitSlop={{top: 40, bottom: 40, left: 40, right: 40}}
              >
                <RefreshIcon
                  size={28}
                  style={{paddingLeft: 10, paddingRight: 20, paddingTop: 10}}
                />
              </Touchable>
            }
            width={width}
            height={60}
            title="Home"
          />
          {global.user.visuallyImpared
            ? <VisualTile
                courses={this.courses}
                next={this.next}
                current={this.current}
                dayTitle={this.dayTitle}
                height={height}
                width={width}
                date={this.state.currentDate}
                events={this.events}
                parent={this}
              />
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
                        events={this.events}
                      />
                    </View>
                    <View style={styles.bodySlide}>
                      <LinkScreenTile
                        parent={this}
                        navigation={this.props.navigation}
                        courseList={courseList}
                      />
                    </View>
                    <View style={styles.bodySlide}>
                      <ActivityScreenTile
                        parent={this}
                        courseMap={this.courseMap}
                        navigation={this.props.navigation}
                        courseList={courseList}
                      />
                    </View>
                  </ScrollView>
                </View>
                <TabBar tapFunction={this} />
              </View>}
          {/* {global.user.visuallyImpared
            ? null
            : <FloatingAction
                actions={actions}
                distanceToEdge={ifIphoneX (80, 65)}
                // style={{position: "absolute", bottom: 200}}
                // position={"right"}
                floatingIcon={<MoreIcon size={30} color="white" />}
                onPressItem={name => {
                  this.props.navigation.navigate (name);
                }}
              />} */}
        </View>
      );
    } catch (e) {
      console.log (e);
      const resetAction = StackActions.reset ({
        index: 0,
        actions: [NavigationActions.navigate ({routeName: 'Login'})],
      });
      this.props.navigation.dispatch (resetAction);
      return <View />;
    }
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
