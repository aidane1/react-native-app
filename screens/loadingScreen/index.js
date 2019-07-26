import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
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

import {StackActions, NavigationActions} from 'react-navigation';

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
  _handleNotification = async notification => {
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
    }
  };
  async componentDidMount () {
    // StatusBar.setHidden (true);
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
          let photos = await CameraRoll.getPhotos ({
            first: 500,
            assetType: 'Photos',
            groupTypes: 'All',
          });
          photos.edges.sort ((a, b) => b.node.timestamp - a.node.timestamp);
          global.cameraRollImages = photos.edges.slice (0, 70);
        }

        let user = await User._retrieveFromStorage ();
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
