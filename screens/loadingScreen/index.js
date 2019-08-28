import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
  Image,
  CameraRoll,
  StatusBar,
} from 'react-native';

// import {AppLoading} from "expo";

import * as Font from 'expo-font';

import {Asset} from 'expo-asset';

import {Notifications} from 'expo';

import {Course, Courses} from '../../classes/courses';

import {Event, Events} from '../../classes/events';

import {Semester, Semesters} from '../../classes/semesters';

import {Assignment, Assignments} from '../../classes/assignments';

import {ImportantDate, ImportantDates} from '../../classes/importantDates';

import {Note, Notes} from '../../classes/notes';

import {School} from '../../classes/school';

import {User} from '../../classes/user';

import {Day, Days} from '../../classes/days';

import {AsyncStorage} from 'react-native';

import {Topic, Topics} from '../../classes/topics';

import ApexAPI from '../../http/api';

import {StackActions, NavigationActions, DrawerActions} from 'react-navigation';

import * as Permissions from 'expo-permissions';

import {
  Ionicons,
  Entypo,
  AntDesign,
  FontAwesome,
  MaterialIcons,
  Feather,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

function formatUnit (hour, minute) {
  return `${(hour + 11) % 12 + 1}:${minute.toString ().length == 1 ? '0' + minute.toString () : minute}`;
}
function formatTime (time) {
  return `${formatUnit (time.start_hour, time.start_minute)} - ${formatUnit (time.end_hour, time.end_minute)}`;
}

function cacheImages (images) {
  return images.map (image => {
    if (typeof image === 'string') {
      return Image.prefetch (image);
    } else {
      return Asset.fromModule (image).downloadAsync ();
    }
  });
}

function cacheFonts (fonts) {
  return fonts.map (font => Font.loadAsync (font));
}

global.socketBindings = {};

global.bindWebSocket = (callback, room) => {
  if (global.socketBindings[room]) {
    global.socketBindings[room].push (callback);
  } else {
    global.socketBindings[room] = [callback];
  }
};

global.emitMessage = (room, text) => {
  global.socketBindings[room] &&
    global.socketBindings[room].forEach (socket => {
      socket (text);
    });
};

class WSConnection {
  constructor (buffer = []) {
    this.ws = new WebSocket (
      `https://www.apexschools.co/web-sockets/app?x-api-key=${global.user['x-api-key']}&x-id-key=${global.user['x-id-key']}`
    );
    this.ws.onopen = this.onopen;
    this.ws.onmessage = this.onmessage;
    this.ws.onerror = this.onerror;
    this.ws.onclose = this.onclose;
    this.isLoaded = false;
    this.buffer = buffer;
  }
  onopen = () => {
    console.log ('socket is open!');
    this.isLoaded = true;
    this.buffer.forEach (message => {
      this.sendMessage (message);
    });
    this.buffer = [];
  };

  onmessage = message => {
    message = JSON.parse (message.data);
    if (message.status === 'error') {
    } else {
      if (message.key) {
        global.emitMessage (message.key, message);
      }
    }
    return false;
  };

  onerror = error => {
    console.log ('error');
  };
  onclose = () => {
    console.log ('closed');
    this.isLoaded = false;
    setTimeout (() => {
      global.websocket.update ();
    }, 1000);
  };
  sendMessage = message => {
    if (this.isLoaded) {
      this.ws.send (JSON.stringify (message));
    } else {
      this.buffer.push (message);
    }
  };
}

async function getNextClassNotifiction (date) {
  if (global.user.notifications.nextClass) {
    let currentSemesters = global.semesters
      .filter (semester => {
        return (
          semester.startDate.getTime () <= date.getTime () &&
          semester.endDate.getTime () >= date.getTime ()
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

    let today =
      global.dayMap[
        `${date.getFullYear ()}_${date.getMonth ()}_${date.getDate ()}`
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
    }

    let current = {
      title: 'Current',
      main: 'Nothing!',
      secondary: 'Now',
      time_num: false,
    };
    // {title, main, secondary}
    let next = {
      title: 'Next',
      main: 'Nothing!',
      secondary: 'Now',
      time_num: false,
    };

    let foundCurrent = false;
    if (courseList.length == 0) {
    } else {
      for (var i = 0; i < courseList.length; i++) {
        if (
          !foundCurrent &&
          courseList[i].time_num.end_hour * 60 +
            courseList[i].time_num.end_minute >=
            date.getHours () * 60 + date.getMinutes ()
        ) {
          let beforeStart = false;
          if (
            courseList[i].time_num.start_hour * 60 +
              courseList[i].time_num.start_minute <=
            date.getHours () * 60 + date.getMinutes ()
          ) {
            current = {
              title: 'Current',
              main: courseList[i].course,
              secondary: courseList[i].time,
              time_num: courseList[i].time_num,
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
                time_num: courseList[i].time_num,
              };
            } else {
              next = {
                title: 'Next',
                main: courseList[i + 1].course,
                secondary: courseList[i + 1].time,
                time_num: courseList[i + 1].time_num,
              };
            }
          }
          foundCurrent = true;
        }
      }
    }
    if (next.time_num !== false) {
      if (
        next.time_num.start_hour * 60 + next.time_num.start_minute ==
        date.getHours () * 60 + date.getMinutes () + 10
      ) {
        // console.log ({current, next});
        const permissions = await Permissions.getAsync (
          Permissions.NOTIFICATIONS
        );
        if (permissions.status !== 'denied') {
          let notificationId = await Notifications.presentLocalNotificationAsync (
            {
              title: 'Next Class',
              body: `${next.main} from ${next.secondary}`,
            }
          );
          console.log (notificationId); // can be saved in AsyncStorage or send to server
        }
      }
    }
  }
}
async function getUpcomingEventsNotification (date) {
  if (global.user.notifications.upcomingEvents) {
    if (date.getHours () == 7 && date.getMinutes () == 20) {
      let events = global.events
        .filter (event => {
          return (
            event.event_date.getFullYear () === date.getFullYear () &&
            event.event_date.getMonth () === date.getMonth () &&
            event.event_date.getDate () === date.getDate ()
          );
        })
        .map (event => {
          return `at ${event.time} : ${event.title}`;
        });
      if (events.length) {
        const permissions = await Permissions.getAsync (
          Permissions.NOTIFICATIONS
        );
        if (permissions.status !== 'denied') {
          let notificationId = await Notifications.presentLocalNotificationAsync (
            {
              title: 'Events Today',
              body: events.join (', '),
            }
          );
          console.log (notificationId); // can be saved in AsyncStorage or send to server
        }
      }
    }
  }
}

export default class LoadingScreen extends React.Component {
  constructor (props) {
    super (props);
  }
  static navigationOptions = {
    header: null,
  };
  async _loadAssetsAsync () {
    const imageAssets = cacheImages ([
      require ('../../assets/logo_transparent.png'),
      require ('../../assets/splash.png'),
      require ('../../assets/tutorial.png'),
      require ('../../assets/questionTutorial.png'),
      require ('../../assets/createTutorial.png'),
      require ('../../assets/navigationTutorial.png'),
      require ('../../assets/next-class.png'),
      require ('../../assets/current-class.png'),
      require ('../../assets/events.png'),
      require ('../../assets/notifications.png'),
      require ('../../assets/svg/7z.png'),
      require ('../../assets/svg/aac.png'),
      require ('../../assets/svg/ai.png'),
      require ('../../assets/svg/archive.png'),
      require ('../../assets/svg/arj.png'),
      require ('../../assets/svg/audio.png'),
      require ('../../assets/svg/avi.png'),
      require ('../../assets/svg/css.png'),
      require ('../../assets/svg/csv.png'),
      require ('../../assets/svg/dbf.png'),
      require ('../../assets/svg/doc.png'),
      require ('../../assets/svg/dwg.png'),
      require ('../../assets/svg/exe.png'),
      require ('../../assets/svg/fla.png'),
      require ('../../assets/svg/flac.png'),
      require ('../../assets/svg/gif.png'),
      require ('../../assets/svg/html.png'),
      require ('../../assets/svg/iso.png'),
      require ('../../assets/svg/jpg.png'),
      require ('../../assets/svg/js.png'),
      require ('../../assets/svg/json.png'),
      require ('../../assets/svg/mdf.png'),
      require ('../../assets/svg/mp2.png'),
      require ('../../assets/svg/mp3.png'),
      require ('../../assets/svg/mp4.png'),
      require ('../../assets/svg/mxf.png'),
      require ('../../assets/svg/nrg.png'),
      require ('../../assets/svg/pdf.png'),
      require ('../../assets/svg/png.png'),
      require ('../../assets/svg/ppt.png'),
      require ('../../assets/svg/psd.png'),
      require ('../../assets/svg/rar.png'),
      require ('../../assets/svg/rtf.png'),
      require ('../../assets/svg/svg.png'),
      require ('../../assets/svg/text.png'),
      require ('../../assets/svg/tiff.png'),
      require ('../../assets/svg/txt.png'),
      require ('../../assets/svg/unknown.png'),
      require ('../../assets/svg/video.png'),
      require ('../../assets/svg/wav.png'),
      require ('../../assets/svg/wma.png'),
      require ('../../assets/svg/xls.png'),
      require ('../../assets/svg/xml.png'),
      require ('../../assets/svg/zip.png'),
      require ('../../assets/poll-image-1.jpg'),
      require ('../../assets/poll-image-2.jpg'),
      require ('../../assets/poll-image-3.jpg'),
      require ('../../assets/poll-image-4.jpg'),
      require ('../../assets/poll-image-5.jpg'),
      require ('../../assets/account_background.jpg'),
    ]);
    const fontAssets = cacheFonts ([
      FontAwesome.font,
      Ionicons.font,
      Entypo.font,
      AntDesign.font,
      MaterialCommunityIcons.font,
      MaterialIcons.font,
      Feather.font,
    ]);
    await Font.loadAsync ({
      'montserrat-400': require ('../../assets/Montserrat/Montserrat-Regular.ttf'),
      'montserrat-300': require ('../../assets/Montserrat/Montserrat-Light.ttf'),
      'montserrat-500': require ('../../assets/Montserrat/Montserrat-Bold.ttf'),
    });
    await Promise.all ([...imageAssets, ...fontAssets]);
    return true;
  }
  _loadLocalNotifications = async () => {
    // let date = new Date (2019, 8, 20, 7, 19);

    let date = new Date ();
    setInterval (async () => {
      try {
        // let currentDate = new Date (2019, 8, 20, 7, date.getMinutes () + 1);
        let currentDate = new Date ();
        if (!(date.getDate () === currentDate.getDate ()) || true) {
          date = currentDate;
          await getNextClassNotifiction (date);
          await getUpcomingEventsNotification (date);
        } else {
        }
      } catch (e) {
        console.log (e);
      }
    }, 60000);
  };
  _handleNotification = async notification => {
    try {
      if (notification.origin == 'selected') {
        if (notification.data.action == 'assignment-upload') {
          let course = await Courses._retrieveCourseById (
            notification.data.assignment.reference_course
          );
          global.courseInfoCourse = course;
          global.courseInfoPage = 'assignments';
          if (course.id !== '_') {
            let api = new ApexAPI (global.user);
            api
              .get (`topics?reference_course=${course.id}`)
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
                `assignments?populate=resources,response_resources&reference_course=${course.id}`
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
                        userVote: assignment.helpful_votes.indexOf (
                          global.user.id
                        ) >= 0
                          ? 1
                          : assignment.unhelpful_votes.indexOf (
                              global.user.id
                            ) >= 0
                              ? -1
                              : 0,
                      };
                    })
                  );
                  global.assignments = await Assignments._retrieveFromStorage ();
                  const resetAction = StackActions.reset ({
                    index: 1,
                    actions: [
                      NavigationActions.navigate ({routeName: 'Home'}),
                      NavigationActions.navigate ({routeName: 'CourseInfo'}),
                    ],
                  });
                  this.props.navigation.dispatch (resetAction);
                }
              })
              .catch (e => {
                console.log (e);
              });
          }
        } else if (notification.data.action == 'image-reply') {
          let course = await Courses._retrieveCourseById (
            notification.data.assignment.reference_course
          );
          global.courseInfoCourse = course;
          global.courseInfoPage = 'assignments';
          if (course.id !== '_') {
            let api = new ApexAPI (global.user);
            api
              .get (`topics?reference_course=${course.id}`)
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
                `assignments?populate=resources,response_resources&reference_course=${course.id}`
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
                        userVote: assignment.helpful_votes.indexOf (
                          global.user.id
                        ) >= 0
                          ? 1
                          : assignment.unhelpful_votes.indexOf (
                              global.user.id
                            ) >= 0
                              ? -1
                              : 0,
                      };
                    })
                  );
                  global.assignments = await Assignments._retrieveFromStorage ();
                  const resetAction = StackActions.reset ({
                    index: 1,
                    actions: [
                      NavigationActions.navigate ({routeName: 'Home'}),
                      NavigationActions.navigate ({routeName: 'CourseInfo'}),
                    ],
                  });
                  this.props.navigation.dispatch (resetAction);
                }
              })
              .catch (e => {
                console.log (e);
              });
          }
        } else if (notification.data.action == 'message') {
        } else if (notification.data.action == 'announcement') {
          let api = new ApexAPI (global.user);
          api
            .get (
              `announcements/announcements/${notification.data.announcement}`
            )
            .then (data => data.json ())
            .then (data => {
              console.log (data);
              if (data.status == 'ok') {
                const resetAction = StackActions.reset ({
                  index: 1,
                  actions: [
                    NavigationActions.navigate ({routeName: 'Home'}),
                    NavigationActions.navigate ({
                      routeName: 'Announcement',
                      params: {announcement: data.body},
                    }),
                  ],
                });
                this.props.navigation.dispatch (resetAction);
              }
            });
        } else if (notification.data.action == 'chatroom-text') {
          console.log (notification.data.text);
          let key = notification.data.text.key;
          global.chatroomKey = `${key}`;
          global.textPath = `texts?find_fields=key&key=${key}&order_by=date&order_direction=-1&populate=resources`;
          key = key.split ('_');
          if (key[0] == 'course') {
            let course = await Courses._retrieveCourseById (key[1]);
            if (course.id != '_') {
              global.chatroomName = `${course.course}`;
              global.resourcePath = `/chatrooms/courses/${course.id}`;
              const resetAction = StackActions.reset ({
                index: 1,
                actions: [
                  NavigationActions.navigate ({routeName: 'Home'}),
                  NavigationActions.navigate ({routeName: 'PureChatroom'}),
                ],
              });
              this.props.navigation.dispatch (resetAction);
            }
          } else if (key[0] == 'grade') {
            let grade = key[1].split ('-')[1];
            if (isNaN (parseInt (grade)) || !global.districtInfo) {
            } else {
              if (grade.toString () == global.districtInfo.grade.toString ()) {
                global.chatroomName = `Grade ${grade}`;
                global.resourcePath = ` /chatrooms/grades/${grade}`;
                const resetAction = StackActions.reset ({
                  index: 1,
                  actions: [
                    NavigationActions.navigate ({routeName: 'Home'}),
                    NavigationActions.navigate ({routeName: 'PureChatroom'}),
                  ],
                });
                this.props.navigation.dispatch (resetAction);
              }
            }
          } else if (key[0] == 'school') {
            global.chatroomName = `${global.school.name}`;
            global.resourcePath = `/chatrooms/schools/${global.school.id}`;
            const resetAction = StackActions.reset ({
              index: 1,
              actions: [
                NavigationActions.navigate ({routeName: 'Home'}),
                NavigationActions.navigate ({routeName: 'PureChatroom'}),
              ],
            });
            this.props.navigation.dispatch (resetAction);
          }
        } else if (notification.data.action == 'post') {
          let api = new ApexAPI (global.user);
          api
            .get (
              `posts/${notification.data.announcement}`
            )
            .then (data => data.json ())
            .then (data => {
              console.log (data);
              if (data.status == 'ok') {
                const resetAction = StackActions.reset ({
                  index: 1,
                  actions: [
                    NavigationActions.navigate ({routeName: 'Home'}),
                    NavigationActions.navigate ({
                      routeName: 'Question',
                      params: {question: data.body},
                    }),
                  ],
                });
                this.props.navigation.dispatch (resetAction);
              }
            });
        }
      }
    } catch (e) {
      console.log (e);
    }
  };
  async componentDidMount () {
    if (Platform.OS == 'android') {
      StatusBar.setHidden (true);
    }
    this._notificationSubscription = Notifications.addListener (
      this._handleNotification
    );
    try {
      let loggedIn = await User._isLoggedIn ();
      if (!loggedIn) {
        this.props.navigation.navigate ('Login');
      } else {
        let {status} = await Permissions.getAsync (Permissions.CAMERA_ROLL);
        global.status = status;
        global.cameraRollImages = [];
        global.getCameraRollImages = callback => {
          if (status !== 'granted') {
            callback ([]);
          } else {
            callback (global.cameraRollImages);
          }
        };

        if (status == 'granted') {
          let photos = await CameraRoll.getPhotos (
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
          );
          photos.edges.sort ((a, b) => b.node.timestamp - a.node.timestamp);
          global.cameraRollImages = photos.edges.slice (0, 70);
        }

        let user = await User._retrieveFromStorage ();
        let districtInfo = await User._getDistrictInfo ();
        let currentSemesters = await Semesters._currentSemesters ();
        let userCourses = await Courses._retrieveCoursesById (user.courses);
        let allAssignments = await Assignments._retrieveFromStorage ();
        let allImportantDates = await ImportantDates._retrieveFromStorage ();
        let completedAssignments = await Assignments._retrieveCompletedFromStorage ();
        let allNotes = await Notes._retrieveFromStorage ();
        let allCourses = await Courses._retrieveFromStorage ();
        let allSemesters = await Semesters._retrieveFromStorage ();
        let school = await School._retrieveFromStorage ();
        let semesterMap = await Semesters._createSemesterMap (
          userCourses,
          school.blocks
        );
        let dates = await Semesters._startAndEndDate ();
        let events = await Events._retrieveFromStorage ();
        let allTopics = await Topics._retrieveFromStorage ();

        global.user = user;
        (global.courseInfoPage =
          'assignments'), (global.userCourses = userCourses);
        global.assignments = allAssignments || [];
        global.notes = allNotes || [];
        global.activity = {
          name: 'Before School',
          page: 0,
          key: 'beforeSchoolActivities',
        };
        global.importantDates = allImportantDates || [];
        global.completedAssignments = completedAssignments;
        global.semesterMap = semesterMap;
        global.dayMap = school['dayMap'];
        global.events = events;
        global.school = school;
        global.dates = dates;
        global.courseInfoCourse = '_';
        global.courses = allCourses;
        global.districtInfo = districtInfo;
        global.topics = allTopics;
        global.semesters = allSemesters;
        global.userCourseMap = {};
        global.blocksCourseMap = {};

        global.websocket = {
          client: new WSConnection (),
          update: () => {
            let buffer = global.websocket.client.buffer;
            delete global.websocket['client'];
            global.websocket.client = new WSConnection (buffer);
          },
        };

        let hasViewedTutorial = await User._hasViewedTutorial ();
        await this._loadAssetsAsync ();

        if (hasViewedTutorial) {
          this._loadLocalNotifications ();
          // const resetAction = StackActions.reset ({
          //   index: 0,
          //   actions: [
          //     NavigationActions.navigate ({
          //       routeName: 'Home',
          //     }),
          //   ],
          // });
          //
          // this.props.navigation.dispatch (resetAction);

          const resetAction = StackActions.reset ({
            index: 0,
            actions: [NavigationActions.navigate ({routeName: 'Home'})],
          });
          this.props.navigation.dispatch (resetAction);
        } else {
          const resetAction = StackActions.reset ({
            index: 0,
            actions: [NavigationActions.navigate ({routeName: 'OnBoarding'})],
          });
          this.props.navigation.dispatch (resetAction);
        }
      }
    } catch (e) {
      console.log (e);
      this.props.navigation.replace ('Login');
    }
  }
  render () {
    return (
      <View style={styles.container}>
        <Image
          source={require ('../../assets/splash.png')}
          style={{width, height}}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSection: {
    marginTop: 20,
    borderColor: 'rgb(210,210,210)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
