import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Text,
  Switch,
  Animated,
  Keyboard,
  Easing,
} from 'react-native';

import HeaderBar from '../../components/header';

import {
  LeftIcon,
  CheckMarkIcon,
  ConfirmIcon,
  EmptyIcon,
  CourseIcon,
  EventsIcon,
  LogoutIcon,
  NotesIcon,
  AssignmentsIcon,
  SchoolAssignmentsIcon,
  BeforeSchoolIcon,
  LunchTimeIcon,
  AfterSchoolIcon,
  AccountIcon,
} from '../../classes/icons';

import Modal from 'react-native-modal';

import ImageBar from '../../components/imagePicker';

import {ScrollView, TextInput} from 'react-native-gesture-handler';

import {boxShadows} from '../../constants/boxShadows';

import Touchable from 'react-native-platform-touchable';

import {User} from '../../classes/user';

import {ifIphoneX} from 'react-native-iphone-x-helper';

import ApexAPI from '../../http/api';

import {Notifications} from 'expo';

import * as Permissions from 'expo-permissions';

import {StackActions, NavigationActions} from 'react-navigation';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

async function registerForPushNotificationsAsync () {
  const {status: existingStatus} = await Permissions.getAsync (
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const {status} = await Permissions.askAsync (Permissions.NOTIFICATIONS);
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    return;
  }
  let token = await Notifications.getExpoPushTokenAsync ();
  let api = new ApexAPI (global.user);
  return api
    .put (`users/${global.user.id}`, {
      push_token: token,
    })
    .then (data => data.json ())
    .then (data => console.log (data));
}

class CourseRow extends React.Component {
  render () {
    if (this.props.last) {
      return (
        <View
          style={[
            styles.courseRow,
            {backgroundColor: global.user.getSecondaryTheme ()},
          ]}
        >
          <View
            style={[styles.courseRowInfo, {borderBottomColor: 'rgba(0,0,0,0)'}]}
          >
            <Text
              style={[
                styles.courseRowText,
                {color: global.user.getSecondaryTextColor ()},
              ]}
            >
              {this.props.text}
            </Text>
            {this.props.control}
          </View>
        </View>
      );
    } else {
      return (
        <View
          style={[
            styles.courseRow,
            {backgroundColor: global.user.getSecondaryTheme ()},
          ]}
        >
          <View
            style={[
              styles.courseRowInfo,
              {borderBottomColor: global.user.getBorderColor ()},
            ]}
          >
            <Text
              style={[
                styles.courseRowText,
                {color: global.user.getSecondaryTextColor ()},
              ]}
            >
              {this.props.text}
            </Text>
            {this.props.control}
          </View>
        </View>
      );
    }
  }
}

class ImagePickerPopup extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      isBackdropVisible: false,
    };
  }
  render () {
    return (
      <View>
        <Modal
          style={{
            margin: 0,
            paddingBottom: 0,
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          isVisible={this.state.isBackdropVisible}
          backdropColor={
            global.user.theme == 'Light' ? 'black' : 'rgba(255,255,255,0.4)'
          }
          onBackdropPress={() => this.setState ({isBackdropVisible: false})}
          propagateSwipe={true}
        >

          <View>
            <ImageBar
              style={{marginBottom: 0, padding: 0}}
              displayImagesInline={false}
              onImageRecieved={this.props.onImageRecieved}
              allowsEditing={true}
              aspect={[1, 1]}
              column={true}
              path={`/users/${global.user.id}/profile_pictures`}
            />
          </View>
        </Modal>
      </View>
    );
  }
}

class ButtonSection extends React.Component {
  constructor (props) {
    super (props);
    this.props = props;
  }
  render () {
    return (
      <View>
        <Text
          style={{
            marginTop: 20,
            marginLeft: 5,
            color: global.user.getTertiaryTextColor (),
            fontSize: 12,
          }}
        >
          {this.props.header}
        </Text>
        <View
          style={[
            styles.buttonSection,
            {borderColor: global.user.getBorderColor ()},
          ]}
        >
          {this.props.children}
        </View>
      </View>
    );
  }
}

class SwitchList extends React.Component {
  constructor (props) {
    super (props);
  }

  render () {
    return (
      <View>
        <ButtonSection header={this.props.header}>
          {this.props.options.map ((option, index, array) => {
            return (
              <Touchable
                key={'row_' + index}
                onPress={() => this.props.onChange (option)}
              >
                <CourseRow
                  text={option}
                  last={index + 1 == array.length}
                  control={
                    this.props.value == option
                      ? <CheckMarkIcon color="#ffbb54" size={22} />
                      : <View />
                  }
                />
              </Touchable>
            );
          })}
        </ButtonSection>
      </View>
    );
  }
}

export default class SettingsScreen extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      profile_picture: global.user.profile_picture,
      notifications: global.user.notifications,

      theme: global.user.theme,

      trueDark: global.user.trueDark,

      transform: new Animated.Value (0),

      visuallyImpared: global.user.visuallyImpared,
      scheduleType: global.user.scheduleType,
      automaticMarkRetrieval: global.user.automaticMarkRetrieval,
      automaticCourseUpdating: global.user.automaticCourseUpdating,

      scrollEnabled: true,

      username: '',
      password: '',
    };
    this.scrollView = React.createRef ();
    this.imagePicker = React.createRef ();
  }

  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };
  onImageRecieved = result => {
    let api = new ApexAPI (global.user);
    api
      .put (`users/${global.user.id}`, {
        profile_picture: result.path,
      })
      .then (data => data.json ())
      .then (async data => {
        if (data.status == 'ok') {
          global.user.profile_picture = data.body.profile_picture;
          await User._saveToStorage (global.user);
          this.setState ({profile_picture: data.body.profile_picture});
        }
      });
  };
  updateScheduleType = val => {
    this.setState ({scheduleType: val ? 'image' : 'schedule'});
  };
  selectProfileImage = () => {
    this.imagePicker.current.setState ({isBackdropVisible: true});
  };
  toggleSettings = async (setting, value) => {
    let state = {...this.state};
    state[setting] = value;
    global.user[setting] = value;
    await User._saveToStorage (global.user);
    let api = new ApexAPI (global.user);
    this.setState (state, () => {
      api
        .put (`users/${global.user.id}`, {
          notifications: {
            daily_announcements: this.state.notifications.dailyAnnouncements,
            next_class: this.state.notifications.nextClass,
            new_assignments: this.state.notifications.newAssignments,
            image_replies: this.state.notifications.imageReplies,
            upcoming_events: this.state.notifications.upcomingEvents,
          },
          theme: this.state.theme,
          true_dark: this.state.trueDark,
          visually_impared: this.state.visuallyImpared,
          automatic_mark_retrieval: this.state.automaticMarkRetrieval,
          automatic_course_updating: this.state.automaticCourseUpdating,
        })
        .then (data => data.json ())
        .then (data => {});
    });
  };
  toggleNotifications = async (setting, value) => {
    registerForPushNotificationsAsync ();
    let state = {...this.state.notifications};
    state[setting] = value;
    global.user.notifications[setting] = value;
    await User._saveToStorage (global.user);
    let api = new ApexAPI (global.user);
    this.setState ({notifications: state}, () => {
      api
        .put (`users/${global.user.id}`, {
          notifications: {
            daily_announcements: this.state.notifications.dailyAnnouncements,
            next_class: this.state.notifications.nextClass,
            new_assignments: this.state.notifications.newAssignments,
            image_replies: this.state.notifications.imageReplies,
            upcoming_events: this.state.notifications.upcomingEvents,
            marked_assignments: this.state.notifications.markedAssignments,
          },
          theme: this.state.theme,
          true_dark: this.state.trueDark,
          visually_impared: this.state.visuallyImpared,
          automatic_mark_retrieval: this.state.automaticMarkRetrieval,
          automatic_course_updating: this.state.automaticCourseUpdating,
        })
        .then (data => data.json ())
        .then (data => {
          // console.log (data);
        });
    });
  };
  componentDidMount () {
    this.keyboardWillShowSub = Keyboard.addListener (
      'keyboardWillShow',
      this.keyboardWillShow
    );
    this.keyboardWillHideSub = Keyboard.addListener (
      'keyboardWillHide',
      this.keyboardWillHide
    );
    setTimeout (() => {
      registerForPushNotificationsAsync ();
    }, 1000);
  }
  componentWillUnmount () {
    this.keyboardWillShowSub.remove ();
    this.keyboardWillHideSub.remove ();
  }
  keyboardWillShow = event => {
    this.setState ({scrollEnabled: false});
    Animated.timing (this.state.transform, {
      toValue: -350,
      easing: Easing.bezier (0.2, 0.73, 0.33, 0.99),
      duration: 330,
      delay: 0,
    }).start ();
  };
  keyboardWillHide = event => {
    this.setState ({scrollEnabled: true});
    Animated.timing (this.state.transform, {
      toValue: 0,
      easing: Easing.bezier (0.2, 0.73, 0.33, 0.99),
      duration: 330,
      delay: 0,
    }).start ();
  };
  updateText = (field, value) => {
    let state = {...this.state};
    state[field] = value;
    this.setState (state);
  };
  updateTheme = async theme => {
    global.user.theme = theme;
    await User._saveToStorage (global.user);
    let api = new ApexAPI (global.user);
    this.setState ({theme}, () => {
      api
        .put (`users/${global.user.id}`, {
          notifications: {
            daily_announcements: this.state.notifications.dailyAnnouncements,
            next_class: this.state.notifications.nextClass,
            new_assignments: this.state.notifications.newAssignments,
            image_replies: this.state.notifications.imageReplies,
            upcoming_events: this.state.notifications.upcomingEvents,
            marked_assignments: this.state.notifications.markedAssignments,
          },
          theme: this.state.theme,
          true_dark: this.state.trueDark,
          visually_impared: this.state.visuallyImpared,
          automatic_mark_retrieval: this.state.automaticMarkRetrieval,
          automatic_course_updating: this.state.automaticCourseUpdating,
        })
        .then (data => data.json ())
        .then (data => {
          console.log (data);
        });
    });
  };
  finish = () => {
    const resetAction = StackActions.reset ({
      index: 0,
      actions: [NavigationActions.navigate ({routeName: 'Home'})],
    });
    this.props.navigation.dispatch (resetAction);
  };
  render () {
    return (
      <View
        style={[
          styles.container,
          {backgroundColor: global.user.getPrimaryTheme ()},
        ]}
      >
        <HeaderBar
          iconLeft={
            <Touchable onPress={() => this.props.navigation.goBack ()}>
              <LeftIcon size={28} />
            </Touchable>
          }
          iconRight={
            <Touchable onPress={this.finish}>
              <ConfirmIcon size={32} style={{paddingRight: 10}} />
            </Touchable>
          }
          width={width}
          height={60}
          title="Settings"
        />
        <Animated.ScrollView
          scrollEnabled={this.state.scrollEnabled}
          ref={this.scrollView}
          style={[
            styles.bodyHolder,
            {transform: [{translateY: this.state.transform}]},
          ]}
        >
          <View
            style={{
              width,
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: 20,
            }}
          >

            <Touchable onPress={this.selectProfileImage}>
              <View
                style={{
                  borderRadius: 40,
                  overflow: 'hidden',
                  backgroundColor: 'black',
                  marginBottom: 10,
                }}
              >
                {this.state.profile_picture !== ''
                  ? <Image
                      source={{
                        uri: `https://www.apexschools.co${this.state.profile_picture}`,
                      }}
                      style={{
                        width: 80,
                        height: 80,
                        marginTop: 5,
                      }}
                    />
                  : <AccountIcon
                      color={global.user.getPrimaryTextColor ()}
                      size={80}
                    />}
                <View
                  style={{position: 'absolute', bottom: 0, left: 0, right: 0}}
                >
                  <Text
                    style={{
                      backgroundColor: 'black',
                      textAlign: 'center',
                      color: 'white',
                    }}
                  >
                    Edit
                  </Text>
                </View>
              </View>
            </Touchable>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '500',
                color: global.user.getPrimaryTextColor (),
              }}
            >
              {global.user.username}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: global.user.getSecondaryTextColor (),
              }}
            >
              Student ID {global.user.studentNumber}
            </Text>
          </View>
          <ButtonSection header={'PUSH NOTIFICATIONS'}>
            <CourseRow
              text={'Daily Announcements'}
              control={
                <Switch
                  value={this.state.notifications.dailyAnnouncements}
                  onValueChange={val =>
                    this.toggleNotifications ('dailyAnnouncements', val)}
                />
              }
              last={false}
            />
            <CourseRow
              text={'Next Class'}
              control={
                <Switch
                  value={this.state.notifications.nextClass}
                  onValueChange={val =>
                    this.toggleNotifications ('nextClass', val)}
                />
              }
              last={false}
            />
            <CourseRow
              text={'New Assignments'}
              control={
                <Switch
                  value={this.state.notifications.newAssignments}
                  onValueChange={val =>
                    this.toggleNotifications ('newAssignments', val)}
                />
              }
              last={false}
            />
            <CourseRow
              text={'Image Replies'}
              control={
                <Switch
                  value={this.state.notifications.imageReplies}
                  onValueChange={val =>
                    this.toggleNotifications ('imageReplies', val)}
                />
              }
              last={false}
            />
            <CourseRow
              text={'Upcoming Events'}
              control={
                <Switch
                  value={this.state.notifications.upcomingEvents}
                  onValueChange={val =>
                    this.toggleNotifications ('upcomingEvents', val)}
                />
              }
              last={true}
            />
          </ButtonSection>
          <SwitchList
            header="THEME"
            options={['Light', 'Dark']}
            value={this.state.theme}
            onChange={this.updateTheme}
          />
          <ButtonSection header={'DARK THEME'}>
            <CourseRow
              text={'Pure Black'}
              control={
                <Switch
                  value={this.state.trueDark}
                  onValueChange={val => this.toggleSettings ('trueDark', val)}
                />
              }
              last={true}
            />
          </ButtonSection>
          <ButtonSection header={'MISCELLANEOUS'}>
            <CourseRow
              text={'Visually Impared'}
              control={
                <Switch
                  value={this.state.visuallyImpared}
                  onValueChange={val =>
                    this.toggleSettings ('visuallyImpared', val)}
                />
              }
              last={false}
            />
            <CourseRow
              text={'Image as Schedule'}
              control={
                <Switch
                  value={this.state.scheduleType == 'image'}
                  onValueChange={val => this.updateScheduleType (val)}
                />
              }
              last={false}
            />
            {this.state.marks || this.state.courses
              ? <ButtonSection header={'SCHOOL ACCOUNT INFO'}>
                  <CourseRow
                    text={'Username'}
                    value={this.state.username}
                    control={
                      <TextInput
                        multiline={false}
                        onChange={text => this.updateText ('username', text)}
                        style={{
                          fontSize: 20,
                          color: 'rgba(0,0,0,0.7)',
                          alignSelf: 'stretch',
                          textAlign: 'right',
                          flexGrow: 1,
                        }}
                        placeholder="Username"
                      />
                    }
                    last={false}
                  />
                  <CourseRow
                    text={'Password'}
                    value={this.state.password}
                    control={
                      <TextInput
                        secureTextEntry={true}
                        multiline={false}
                        onChange={text => this.updateText ('password', text)}
                        style={{
                          fontSize: 20,
                          color: 'rgba(0,0,0,0.7)',
                          alignSelf: 'stretch',
                          textAlign: 'right',
                          flexGrow: 1,
                        }}
                        placeholder="Password"
                      />
                    }
                    last={true}
                  />
                </ButtonSection>
              : <View />}
            <CourseRow
              text={'Grade only Announcements'}
              control={
                <Switch
                  value={this.state.automaticMarkRetrieval}
                  // onValueChange={val =>
                  //   this.toggleSettings ('automaticMarkRetrieval', val)}
                />
              }
              last={false}
            />
            <CourseRow
              text={'Automatic Mark Retrieval'}
              control={
                <Switch
                  value={this.state.automaticMarkRetrieval}
                  onValueChange={val =>
                    this.toggleSettings ('automaticMarkRetrieval', val)}
                />
              }
              last={false}
            />
            <CourseRow
              text={'Automatic Course Updating'}
              control={
                <Switch
                  value={this.state.automaticCourseUpdating}
                  onValueChange={val =>
                    this.toggleSettings ('automaticCourseUpdating', val)}
                />
              }
              last={true}
            />
          </ButtonSection>
          <View style={{width, marginTop: 20}} />
        </Animated.ScrollView>
        <ImagePickerPopup
          ref={this.imagePicker}
          onImageRecieved={this.onImageRecieved}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create ({
  container: {
    width,
    flexGrow: 1,
    backgroundColor: '#f1f1f1',
  },
  bodyHolder: {
    zIndex: 1,
    height: ifIphoneX (height - 80, height - 60),
  },
  buttonSection: {
    marginTop: 5,
    borderColor: 'rgb(210,210,210)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  courseRow: {
    alignItems: 'center',
    flexDirection: 'row',
    width: width,
    height: 50.0,
    backgroundColor: 'white',
    paddingLeft: 15,
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
  icon: {
    width: 35,
    height: 35,
    margin: 7.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingTop: 3,
    paddingLeft: 2,
  },
  courseRowText: {
    fontSize: 20,
    color: 'rgba(0,0,0,0.7)',
    fontWeight: '300',
  },
  clickIcon: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 5,
  },
});
