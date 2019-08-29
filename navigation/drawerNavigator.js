import HomeScreen from '../screens/homeScreen/index';
import LoginScreen from '../screens/loginScreen/index';
import LoadingScreen from '../screens/loadingScreen/index';
import AccountScreen from '../screens/accountScreen/index';
import CoursesScreen from '../screens/coursesScreen/index';
import EventsScreen from '../screens/eventsScreen/index';
import CalendarScreen from '../screens/calendarScreen/index';
import CourseInfoScreen from '../screens/courseInfoScreen/index';
import NotesScreen from '../screens/notesPage/index';
import AssignmentsScreen from '../screens/assignmentsScreen/index';
import ChatroomScreen from '../screens/chatroomScreen/index';
import SettingsScreen from '../screens/settingsScreen/index';
import SchoolAssignmentsScreen from '../screens/schoolAssignmentsScreen/index';
import PureChatroomScreen from '../screens/pureChatRoomScreen/index';
import ActivitiesScreen from '../screens/activitiesScreen/index';
import QuestionsScreen from '../screens/questionsScreen/index';
import QuestionScreen from '../screens/questionScreen/index';
import OnboardingScreen from '../screens/onboardingScreen/index';
import AnnouncementsScreen from '../screens/announcementsScreen/index';
import AnnouncementScreen from '../screens/announcementScreen/index';
import tutorialScreen from '../screens/tutorialScreen/index';
import NotificationScreen from '../screens/notificationsScreen/index';
import CourseConfigScreen from '../screens/courseConfigScreen/index';
import TranscriptScreen from '../screens/transcriptScreen/index';
import LinkScreen from '../screens/linksScreen/index';
import FileScreen from '../screens/FilesScreen/index';
import PollScreen from '../screens/pollScreen/index';
import FeedbackScreen from '../screens/feedbackScreen/index';

import {
  createAppContainer,
  createDrawerNavigator,
  createStackNavigator,
  DrawerItems,
} from 'react-navigation';

import React, {Component} from 'react';

import {boxShadows} from '../constants/boxShadows';

import {
  LeftIcon,
  CalendarIcon,
  RightIcon,
  EmptyIcon,
  CourseIcon,
  EventsIcon,
  LogoutIcon,
  CourseConfigIcon,
  AssignmentsIcon,
  SchoolAssignmentsIcon,
  BeforeSchoolIcon,
  LunchTimeIcon,
  AfterSchoolIcon,
  AccountIcon,
  ChatIcon,
  QuestionIcon,
  MegaPhoneIcon,
  NotificationIcon,
  PdfIcon,
  QuestionMarkIcon,
  LinkIcon,
  FilesIcon,
  PollIcon,
  HomeIcon,
  FeedBackIcon,
} from '../classes/icons';

import {
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {ifIphoneX} from 'react-native-iphone-x-helper';

let drawerLabel = options => {
  return (
    <Text>
      Hey
    </Text>
  );
};

class DrawerItem extends Component {
  constructor (props) {
    super (props);
    this.state = {
      opacity: new Animated.Value (1),
    };
  }
  pressIn = () => {
    Animated.timing (this.state.opacity, {
      toValue: 0.9,
      duration: 200,
    }).start ();
  };
  pressOut = () => {
    Animated.timing (this.state.opacity, {
      toValue: 1,
      duration: 200,
    }).start ();
  };
  render () {
    return (
      <View
        style={{
          backgroundColor: '#0086f5',
          borderTopRightRadius: 50,
          borderBottomRightRadius: 50,
          overflow: 'hidden',
          marginRight: 5,
        }}
      >
        <TouchableWithoutFeedback
          //   activeOpacity={0.92}
          onPressIn={this.pressIn}
          onPressOut={this.pressOut}
          onPress={
            this.props.route
              ? () => this.props.navigation.navigate (this.props.route)
              : this.props.onPress
          }
        >
          <Animated.View
            style={{
              opacity: this.state.opacity,
              backgroundColor: global.user.getSecondaryTheme (),
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
              overflow: 'hidden',
            }}
          >
            <View style={{width: 50}}>
              {this.props.icon}
            </View>

            <Text
              style={{
                fontSize: 15,
                color: global.user.theme === 'Light'
                  ? 'rgba(20,20,30,0.8)'
                  : 'rgba(235,235,245,0.8)',
              }}
            >
              {this.props.label}
            </Text>
          </Animated.View>

        </TouchableWithoutFeedback>
      </View>
    );
  }
}

class DrawerSection extends Component {
  constructor (props) {
    super (props);
  }
  render () {
    return (
      <View
        style={{
          marginBottom: 10,
          padding: 15,
          paddingLeft: 0,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: global.user.theme === 'Light'
            ? 'rgba(0,0,0,0.9)'
            : 'rgba(255,255,255,0.9)',
        }}
      >
        <Text
          style={{
            fontSize: 11,
            color: global.user.getTertiaryTextColor (),
            opacity: 0.8,
            marginBottom: 10,
            marginLeft: 10,
          }}
        >
          {this.props.label}
        </Text>
        {this.props.children}
      </View>
    );
  }
}

const HEADER_MIN_HEIGHT = ifIphoneX (80, 60);
const HEADER_MAX_HEIGHT = 210;

const AnimatedImage = Animated.createAnimatedComponent (Image);

const AnimatedIcon = Animated.createAnimatedComponent (AccountIcon);

class CustomDrawerContentComponent extends Component {
  constructor (props) {
    super (props);
    this.animatedHeight = new Animated.Value (0);
  }
  handleScroll = event => {
    Animated.event ([
      {nativeEvent: {contentOffset: {y: this.animatedHeight}}},
    ]) (event);
  };
  render () {
    let props = this.props;

    const headerHeight = this.animatedHeight.interpolate ({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: 'clamp',
    });

    const opacity = this.animatedHeight.interpolate ({
      inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT) / 2],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const positionLeft = this.animatedHeight.interpolate ({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [10, 100],
      extrapolate: 'clamp',
    });

    const positionTop = this.animatedHeight.interpolate ({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [120, ifIphoneX (40, 20)],
      extrapolate: 'clamp',
    });

    const imageLeft = this.animatedHeight.interpolate ({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [10, 20],
      extrapolate: 'clamp',
    });

    const imageTop = this.animatedHeight.interpolate ({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [20, ifIphoneX (25, 5)],
      extrapolate: 'clamp',
    });

    const ImageSize = this.animatedHeight.interpolate ({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [70, 50],
      extrapolate: 'clamp',
    });

    const borderRadius = this.animatedHeight.interpolate ({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [35, 25],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.container}>
        <ScrollView
          style={{backgroundColor: global.user.getSecondaryTheme ()}}
          contentContainerStyle={{
            paddingTop: 200,
          }}
          scrollEventThrottle={16}
          onScroll={this.handleScroll}
        >
          <SafeAreaView
            style={styles.container}
            forceInset={{top: 'always', horizontal: 'never'}}
          >

            <DrawerSection label="COMMON LINKS">
              <DrawerItem
                label="Home"
                route={'Home'}
                navigation={props.navigation}
                icon={
                  <HomeIcon
                    size={22}
                    color={
                      global.user.theme === 'Light'
                        ? 'rgba(20,20,30,0.8)'
                        : 'rgba(235,235,245,0.8)'
                    }
                  />
                }
              />
              <DrawerItem
                label="Tutorial"
                route={'Tutorial'}
                navigation={props.navigation}
                icon={
                  <QuestionMarkIcon
                    size={22}
                    color={
                      global.user.theme === 'Light'
                        ? 'rgba(20,20,30,0.8)'
                        : 'rgba(235,235,245,0.8)'
                    }
                  />
                }
              />
            </DrawerSection>
            <DrawerSection label="STATIC INFORMATION">
              <DrawerItem
                label="Courses"
                route={'Courses'}
                navigation={props.navigation}
                icon={
                  <CourseIcon
                    size={22}
                    color={
                      global.user.theme === 'Light'
                        ? 'rgba(20,20,30,0.8)'
                        : 'rgba(235,235,245,0.8)'
                    }
                  />
                }
              />
              <DrawerItem
                label="Calendar"
                route={'Calendar'}
                navigation={props.navigation}
                icon={
                  <CalendarIcon
                    size={22}
                    color={
                      global.user.theme === 'Light'
                        ? 'rgba(20,20,30,0.8)'
                        : 'rgba(235,235,245,0.8)'
                    }
                  />
                }
              />
              <DrawerItem
                label="Events"
                route={'Events'}
                navigation={props.navigation}
                icon={
                  <EventsIcon
                    size={22}
                    color={
                      global.user.theme === 'Light'
                        ? 'rgba(20,20,30,0.8)'
                        : 'rgba(235,235,245,0.8)'
                    }
                  />
                }
              />
            </DrawerSection>
            <DrawerSection label="COMMUNAL">
              <DrawerItem
                label="Chatrooms"
                route={'Chatrooms'}
                navigation={props.navigation}
                icon={
                  <ChatIcon
                    size={22}
                    color={
                      global.user.theme === 'Light'
                        ? 'rgba(20,20,30,0.8)'
                        : 'rgba(235,235,245,0.8)'
                    }
                  />
                }
              />
              <DrawerItem
                label="School Forum"
                route={'Questions'}
                navigation={props.navigation}
                icon={
                  <QuestionIcon
                    size={22}
                    color={
                      global.user.theme === 'Light'
                        ? 'rgba(20,20,30,0.8)'
                        : 'rgba(235,235,245,0.8)'
                    }
                  />
                }
              />
              <DrawerItem
                label="My Classes"
                route={'Assignments'}
                navigation={props.navigation}
                icon={
                  <AssignmentsIcon
                    size={22}
                    color={
                      global.user.theme === 'Light'
                        ? 'rgba(20,20,30,0.8)'
                        : 'rgba(235,235,245,0.8)'
                    }
                  />
                }
              />
            </DrawerSection>
            <DrawerSection label="SCHOOL RESOURCES">
              <DrawerItem
                label="Links"
                route={'Links'}
                navigation={props.navigation}
                icon={
                  <LinkIcon
                    size={22}
                    color={
                      global.user.theme === 'Light'
                        ? 'rgba(20,20,30,0.8)'
                        : 'rgba(235,235,245,0.8)'
                    }
                  />
                }
              />
              <DrawerItem
                label="Files"
                route={'Files'}
                navigation={props.navigation}
                icon={
                  <FilesIcon
                    size={22}
                    color={
                      global.user.theme === 'Light'
                        ? 'rgba(20,20,30,0.8)'
                        : 'rgba(235,235,245,0.8)'
                    }
                  />
                }
              />
              <DrawerItem
                label="Polls"
                route={'Polls'}
                navigation={props.navigation}
                icon={
                  <PollIcon
                    size={22}
                    color={
                      global.user.theme === 'Light'
                        ? 'rgba(20,20,30,0.8)'
                        : 'rgba(235,235,245,0.8)'
                    }
                  />
                }
              />
            </DrawerSection>
            <DrawerSection label="SCHOOL CONNECTION">
              <DrawerItem
                label="Announcements"
                route={'Announcements'}
                navigation={props.navigation}
                icon={
                  <MegaPhoneIcon
                    size={22}
                    color={
                      global.user.theme === 'Light'
                        ? 'rgba(20,20,30,0.8)'
                        : 'rgba(235,235,245,0.8)'
                    }
                  />
                }
              />
              <DrawerItem
                label="Notifications"
                route={'Notifications'}
                navigation={props.navigation}
                icon={
                  <NotificationIcon
                    size={22}
                    color={
                      global.user.theme === 'Light'
                        ? 'rgba(20,20,30,0.8)'
                        : 'rgba(235,235,245,0.8)'
                    }
                  />
                }
              />
              <DrawerItem
                label="Transcript"
                route={'Transcript'}
                navigation={props.navigation}
                icon={
                  <PdfIcon
                    size={22}
                    color={
                      global.user.theme === 'Light'
                        ? 'rgba(20,20,30,0.8)'
                        : 'rgba(235,235,245,0.8)'
                    }
                  />
                }
              />
            </DrawerSection>
            <DrawerSection label="PRIVATE">
              <DrawerItem
                label="Course Names & Colours"
                route={'CourseConfig'}
                navigation={props.navigation}
                icon={
                  <MegaPhoneIcon
                    size={22}
                    color={
                      global.user.theme === 'Light'
                        ? 'rgba(20,20,30,0.8)'
                        : 'rgba(235,235,245,0.8)'
                    }
                  />
                }
              />
              <DrawerItem
                label="Before School Activities"
                onPress={() => {
                  global.activity = {
                    name: 'Before School',
                    page: 0,
                    key: 'beforeSchoolActivities',
                  };
                  props.navigation.navigate ('Activities');
                }}
                navigation={props.navigation}
                icon={
                  <BeforeSchoolIcon
                    size={22}
                    color={
                      global.user.theme === 'Light'
                        ? 'rgba(20,20,30,0.8)'
                        : 'rgba(235,235,245,0.8)'
                    }
                  />
                }
              />
              <DrawerItem
                label="Lunch Time Activities"
                onPress={() => {
                  global.activity = {
                    name: 'Lunch Time',
                    page: 1,
                    key: 'lunchTimeActivities',
                  };
                  this._navigateToPage ('Activities');
                }}
                navigation={props.navigation}
                icon={
                  <LunchTimeIcon
                    size={22}
                    color={
                      global.user.theme === 'Light'
                        ? 'rgba(20,20,30,0.8)'
                        : 'rgba(235,235,245,0.8)'
                    }
                  />
                }
              />
              <DrawerItem
                label="After School Activities"
                onPress={() => {
                  global.activity = {
                    name: 'After School',
                    page: 2,
                    key: 'afterSchoolActivities',
                  };
                  props.navigation.navigate ('Activities');
                }}
                navigation={props.navigation}
                icon={
                  <AfterSchoolIcon
                    size={22}
                    color={
                      global.user.theme === 'Light'
                        ? 'rgba(20,20,30,0.8)'
                        : 'rgba(235,235,245,0.8)'
                    }
                  />
                }
              />
            </DrawerSection>
            <DrawerSection label="FEEDBACK">
              <DrawerItem
                label="Feedback"
                route={'Feedback'}
                navigation={props.navigation}
                icon={
                  <FeedBackIcon
                    size={22}
                    color={
                      global.user.theme === 'Light'
                        ? 'rgba(20,20,30,0.8)'
                        : 'rgba(235,235,245,0.8)'
                    }
                  />
                }
              />

            </DrawerSection>
            <DrawerSection label="LOGOUT">
              <DrawerItem
                label="Logout"
                route={'Login'}
                navigation={props.navigation}
                icon={
                  <LogoutIcon
                    size={22}
                    color={
                      global.user.theme === 'Light'
                        ? 'rgba(20,20,30,0.8)'
                        : 'rgba(235,235,245,0.8)'
                    }
                  />
                }
              />
            </DrawerSection>

            {/* <DrawerItems {...props} /> */}
          </SafeAreaView>
        </ScrollView>

        <Animated.View
          style={[
            styles.animatedHeaderContainer,
            {
              height: headerHeight,
              backgroundColor: global.user.getSecondaryTheme (),
            },
            boxShadows.boxShadow4,
          ]}
        >
          <TouchableOpacity
            onPress={() => props.navigation.navigate ('Settings')}
            activeOpacity={0.4}
            style={{
              width: 270,
              // height: headerHeight,
              height: '100%',
              flexDirection: 'column',
              justifyContent: 'space-evenly',

              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: global.user.theme === 'Light'
                ? 'rgba(0,0,0,0.9)'
                : 'rgba(255,255,255,0.9)',
            }}
          >
            <View
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
                overflow: 'hidden',
                backgroundColor: 'red',
              }}
            >
              <Image
                source={require ('../assets/account_background.jpg')}
                resizeMode={'cover'}
              />
            </View>

            <Animated.View
              style={{position: 'absolute', top: imageTop, left: imageLeft}}
            >
              {global.user.profile_picture !== ''
                ? <AnimatedImage
                    source={{
                      uri: `https://www.apexschools.co${global.user.profile_picture}`,
                    }}
                    style={{
                      width: ImageSize,
                      height: ImageSize,
                      borderRadius,
                      overflow: 'hidden',
                    }}
                  />
                : <AnimatedIcon
                    color={global.user.getPrimaryTextColor ()}
                    size={ImageSize}
                  />}
            </Animated.View>

            <Animated.Text
              style={{
                fontSize: 20,
                fontWeight: '600',
                color: 'rgba(255,255,255,0.9)',
                position: 'absolute',
                left: positionLeft,
                top: positionTop,
              }}
            >
              {global.user.username}
            </Animated.Text>

            <Animated.View
              style={{opacity, position: 'absolute', bottom: 10, left: 10}}
            >
              <Text
                style={{
                  marginTop: 5,
                  fontSize: 13,
                  fontWeight: '300',
                  // color: 'rgba(0,0,0,0.6)',
                  color: 'rgba(255,255,255,0.6)',
                }}
              >
                Student ID {global.user.studentNumber}
              </Text>
              <Text
                style={{
                  marginTop: 5,
                  fontSize: 13,
                  fontWeight: '300',
                  // color: 'rgba(0,0,0,0.6)',
                  color: 'rgba(255,255,255,0.6)',
                }}
              >
                {global.user.theme} Theme
              </Text>
            </Animated.View>

          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create ({
  container: {
    flex: 1,
  },
  animatedHeaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 22,
  },
});

const QuestionNavigator = createStackNavigator (
  {
    Questions: {screen: QuestionsScreen, lazy: true},
    Question: {screen: QuestionScreen, lazy: true},
  },
  {
    initialRouteName: 'Questions',
  }
);

const ChatroomNavigator = createStackNavigator (
  {
    Chatrooms: {screen: ChatroomScreen, lazy: true},
    PureChatroom: {screen: PureChatroomScreen, lazy: true},
  },
  {
    initialRouteName: 'Chatrooms',
  }
);

const CoursesNavigator = createStackNavigator (
  {
    Assignments: {screen: AssignmentsScreen, lazy: true},
    CourseInfo: {screen: CourseInfoScreen, lazy: true},
  },
  {
    initialRouteName: 'Assignments',
  }
);

const AnnouncementNavigator = createStackNavigator (
  {
    Announcements: {screen: AnnouncementsScreen, lazy: true},
    Announcement: {screen: AnnouncementScreen, lazy: true},
  },
  {
    initialRouteName: 'Announcements',
  }
);

// const ChatroomNavigator = create

const DrawerNavigator = createDrawerNavigator (
  {
    Home: {screen: HomeScreen},
    Account: {screen: AccountScreen, lazy: true},
    Login: {screen: LoginScreen, lazy: true},
    Loading: {screen: LoadingScreen, lazy: true},
    Courses: {screen: CoursesScreen},
    Events: {screen: EventsScreen},
    Calendar: {screen: CalendarScreen},

    Notes: {screen: NotesScreen, lazy: true},

    Assignments: {screen: CoursesNavigator, lazy: true},
    CourseInfo: {screen: CourseInfoScreen, lazy: true},

    // Chatrooms: {screen: ChatroomScreen, lazy: true},

    Chatrooms: {screen: ChatroomNavigator, lazy: true},
    PureChatroom: {screen: PureChatroomScreen},

    Settings: {screen: SettingsScreen, lazy: true},
    SchoolAssignments: {screen: SchoolAssignmentsScreen, lazy: true},

    Activities: {screen: ActivitiesScreen, lazy: true},

    Questions: {screen: QuestionNavigator},
    // Questions: {screen: QuestionsScreen, lazy: true},
    Question: {screen: QuestionScreen, lazy: true},

    OnBoarding: {screen: OnboardingScreen, lazy: true},

    Announcements: {screen: AnnouncementNavigator, lazy: true},
    Announcement: {screen: AnnouncementScreen, lazy: false},

    Tutorial: {screen: tutorialScreen, lazy: true},
    Notifications: {screen: NotificationScreen, lazy: true},
    CourseConfig: {screen: CourseConfigScreen, lazy: true},
    Transcript: {screen: TranscriptScreen, lazy: true},
    Links: {screen: LinkScreen, lazy: true},
    Files: {screen: FileScreen, lazy: true},
    Polls: {screen: PollScreen, lazy: true},
    Feedback: {screen: FeedbackScreen, lazy: true},
  },
  {
    initialRouteName: 'Home',
    hideStatusBar: true,
    drawerPosition: 'left',
    drawerWidth: 270,
    contentComponent: CustomDrawerContentComponent,
    navigationOptions: ({navigation}) => {
      return {
        drawerLabel: 'Gay',
        header: null,
        hideStatusBar: true,
      };
      //   return {
      //     headerStyle: {backgroundColor: '#4C3E54'},
      //     title: 'Home',
      //     headerTintColor: 'white',
      //   };
    },
    // overlayColor: '#6b52ae',
    contentOptions: {
      activeTintColor: 'black',
      activeBackgroundColor: 'transparent',
    },
  }
);

const defaultGetStateForAction = DrawerNavigator.router.getStateForAction;

DrawerNavigator.router.getStateForAction = (action, state) => {
  switch (action.type) {
    case 'Navigation/OPEN_DRAWER':
    case 'Navigation/DRAWER_OPENED':
      if (Platform.OS == 'android') {
        StatusBar.setHidden (true, 'none');
      }
      break;
    case 'Navigation/CLOSE_DRAWER':
    case 'Navigation/DRAWER_CLOSED':
      if (Platform.OS == 'android') {
        StatusBar.setHidden (true, 'none');
      }
      break;
  }
  return defaultGetStateForAction (action, state);
};

const StackNavigator = createStackNavigator (
  {
    Home: {screen: DrawerNavigator},
    Login: {screen: LoginScreen, lazy: true},
    Loading: {screen: LoadingScreen, lazy: true},
    Account: {screen: AccountScreen, lazy: true},
    Courses: {screen: CoursesScreen, lazy: true},
    Events: {screen: EventsScreen, lazy: true},
    Calendar: {screen: CalendarScreen, lazy: true},
    CourseInfo: {screen: CourseInfoScreen, lazy: true},
    Notes: {screen: NotesScreen, lazy: true},
    Assignments: {screen: AssignmentsScreen, lazy: true},
    Chatrooms: {screen: ChatroomScreen, lazy: true},
    Settings: {screen: SettingsScreen, lazy: true},
    SchoolAssignments: {screen: SchoolAssignmentsScreen, lazy: true},
    PureChatroom: {screen: PureChatroomScreen, lazy: true},
    Activities: {screen: ActivitiesScreen, lazy: true},
    Questions: {screen: QuestionsScreen, lazy: true},
    Question: {screen: QuestionScreen, lazy: true},
    OnBoarding: {screen: OnboardingScreen, lazy: true},
    Announcements: {screen: AnnouncementsScreen, lazy: true},
    Announcement: {screen: AnnouncementScreen, lazy: false},
    Tutorial: {screen: tutorialScreen, lazy: true},
    Notifications: {screen: NotificationScreen, lazy: true},
    CourseConfig: {screen: CourseConfigScreen, lazy: true},
    Transcript: {screen: TranscriptScreen, lazy: true},
    Links: {screen: LinkScreen, lazy: true},
    Files: {screen: FileScreen, lazy: true},
    Polls: {screen: PollScreen, lazy: true},
    Feedback: {screen: FeedbackScreen, lazy: true},
  },
  {
    initialRouteName: 'Loading',
  }
);

export default createAppContainer (StackNavigator);
