import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  Animated,
} from 'react-native';

import HeaderBar from '../../components/header';

import {ScrollView} from 'react-native-gesture-handler';

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
  ArrangeIcon,
} from '../../classes/icons';

import {Courses} from '../../classes/courses';

import {boxShadows} from '../../constants/boxShadows';

import Touchable from '../../components/react-native-platform-touchable';

import {ifIphoneX} from 'react-native-iphone-x-helper';

import DraggableFlatList from 'react-native-draggable-flatlist';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

class DrawerItem extends React.Component {
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

class DrawerSection extends React.Component {
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

export default class ChatroomScreen extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      data: [0, 1, 2, 3, 4, 5, 6, 7],
    };
    this.sections = [
      <DrawerSection label="COMMON LINKS">
        <DrawerItem
          label="Home"
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
      </DrawerSection>,
      <DrawerSection label="STATIC INFORMATION">
        <DrawerItem
          label="Courses"
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
      </DrawerSection>,
      <DrawerSection label="COMMUNAL">
        <DrawerItem
          label="Chatrooms"
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
      </DrawerSection>,
      <DrawerSection label="SCHOOL RESOURCES">
        <DrawerItem
          label="Links"
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
      </DrawerSection>,
      <DrawerSection label="SCHOOL CONNECTION">
        <DrawerItem
          label="Announcements"
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
      </DrawerSection>,
      <DrawerSection label="PRIVATE">
        <DrawerItem
          label="Course Names & Colours"
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
      </DrawerSection>,
      <DrawerSection label="INTERACTION">
        <DrawerItem
          label="Customize"
          icon={
            <ArrangeIcon
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
          label="Feedback"
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

      </DrawerSection>,
      <DrawerSection label="LOGOUT">
        <DrawerItem
          label="Logout"
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
      </DrawerSection>,
    ];
  }
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };
  renderItem = ({item, index, move, moveEnd, isActive}) => {
    return (
      <TouchableOpacity onLongPress={move} onPressOut={moveEnd}>
        <View
          style={{
            backgroundColor: isActive
              ? 'blue'
              : global.user.getSecondaryTheme (),
          }}
        >
          {this.sections[item]}
        </View>

      </TouchableOpacity>
    );
  };
  render () {
    return (
      <View>
        <HeaderBar
          iconLeft={
            <Touchable onPress={() => this.props.navigation.navigate ('Home')}>
              <LeftIcon size={28} />
            </Touchable>
          }
          iconRight={<EmptyIcon width={28} height={32} />}
          width={width}
          height={60}
          title="My Classes"
        />
        <View style={[styles.bodyHolder, global.user.primaryTheme ()]}>

          <View
            style={{
              width: 270,
              flexGrow: 1,
              flexDirection: 'column',
              backgroundColor: global.user.getSecondaryTheme (),
            }}
          >
            <DraggableFlatList
              data={this.state.data}
              contentContainerStyle={{
                paddingTop: 200,
              }}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => `draggable-item-${item}`}
              scrollPercent={5}
              onMoveEnd={({data}) => this.setState ({data})}
            />
          </View>

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
  courseRow: {
    alignItems: 'center',
    flexDirection: 'row',
    width: width,
    height: 50.0,
    backgroundColor: 'white',
  },
  courseRowInfo: {
    height: 50.0,
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: 'rgb(210,210,210)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingRight: 10,
  },
  courseRowStack: {
    flexDirection: 'column',
  },
  icon: {
    width: 35,
    height: 35,
    margin: 7.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  courseRowCourse: {
    fontSize: 17,
  },
  courseRowTeacher: {
    fontSize: 10,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  courseRowTime: {
    fontSize: 17,
  },
  dayList: {
    borderColor: 'rgb(210,210,210)',
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    marginTop: 10,
  },
});
