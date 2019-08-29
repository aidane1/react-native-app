import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  ActivityIndicator,
  DatePickerAndroid,
  TimePickerAndroid,
  DatePickerIOS,
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
  UpIcon,
  DownIcon,
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

import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';

import Modal from 'react-native-modal';

import ImageBar from '../../components/imagePicker';

import {ScrollView, TextInput} from 'react-native-gesture-handler';

import {boxShadows} from '../../constants/boxShadows';

import Touchable from '../../components/react-native-platform-touchable';

import {User} from '../../classes/user';

import {ifIphoneX} from 'react-native-iphone-x-helper';

import ApexAPI from '../../http/api';

import {Notifications} from 'expo';

import * as Permissions from 'expo-permissions';

import FormatHours from '../../constants/formatHours';

import {StackActions, NavigationActions} from 'react-navigation';
import Collapsible from 'react-native-collapsible';
import {Platform} from '@unimodules/core';

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
    .then (data => {});
}

// const AnimatedCourseRow = Animated.createAnimatedComponent (CourseRowAnimated);

// class CourseRowAnimated extends React.Component {
//   constructor(props) {
//     super(props);
//   }
//   render () {
//     // if (this.props.last) {
//       return (
//         <View style={this.props.style}>
//           <View
//             style={[styles.courseRowInfo, {borderBottomColor: 'rgba(0,0,0,0)'}]}
//           >
//             <Text
//               style={[
//                 styles.courseRowText,
//                 {color: global.user.getSecondaryTextColor ()},
//               ]}
//             >
//               {this.props.text}
//             </Text>
//             {this.props.control}
//           </View>
//         </View>
//       );
//     // } else {
//     //   return (
//     //     <View
//     //       style={[
//     //         styles.courseRow,
//     //         // {backgroundColor: global.user.getSecondaryTheme ()},
//     //       ]}
//     //     >
//     //       <View
//     //         style={[
//     //           styles.courseRowInfo,
//     //           {borderBottomColor: global.user.getBorderColor ()},
//     //         ]}
//     //       >
//     //         <Text
//     //           style={[
//     //             styles.courseRowText,
//     //             {color: global.user.getSecondaryTextColor ()},
//     //           ]}
//     //         >
//     //           {this.props.text}
//     //         </Text>
//     //         {this.props.control}
//     //       </View>
//     //     </View>
//     //   );
//     // }
//   }
// }

class CourseRow extends React.Component {
  render () {
    if (this.props.last) {
      return (
        <View
          style={[
            styles.courseRow,
            // {backgroundColor: global.user.getSecondaryTheme ()},
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
            // {backgroundColor: global.user.getSecondaryTheme ()},
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

class IOSDateSheet extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      isBackdropVisible: false,
      date: new Date (),
    };
  }
  setDate = date => {
    this.setState ({date});
    this.props.updateDate (date.getHours (), date.getMinutes ());
  };
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
          backdropColor={'black'}
          onBackdropPress={() => this.setState ({isBackdropVisible: false})}
          propagateSwipe={true}
        >
          <DatePickerIOS
            onDateChange={this.setDate}
            date={this.state.date}
            style={{
              backgroundColor: 'white',
            }}
            mode={'time'}
          />
        </Modal>
      </View>
    );
  }
}

class DateCourseRow extends React.Component {
  render () {
    if (this.props.last) {
      return (
        <View style={{backgroundColor: global.user.getPrimaryTheme ()}}>
          <Touchable
            onPress={this.props.openDate}
            style={[
              styles.courseRow,
              {backgroundColor: global.user.getSecondaryTheme ()},
            ]}
          >
            <View
              style={[
                styles.courseRowInfo,
                {borderBottomColor: 'rgba(0,0,0,0)'},
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
              <Text
                style={[
                  styles.courseRowText,
                  {color: global.user.getSecondaryTextColor (), fontSize: 18},
                ]}
              >
                {this.props.date}
              </Text>
            </View>
          </Touchable>
        </View>
      );
    } else {
      return (
        <View style={global.user.primaryTheme ()}>
          <Touchable
            onPress={this.props.openDate}
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
              <Text
                style={[
                  styles.courseRowText,
                  {color: global.user.getSecondaryTextColor (), fontSize: 18},
                ]}
              >
                {this.props.date}
              </Text>
            </View>
          </Touchable>
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
              onImageLoaded={this.props.onImageLoaded}
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

class InteractionTokens extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      interaction_tokens: {},
      collapsed: true,
      loaded: false,
    };
  }
  componentDidMount () {
    let api = new ApexAPI (global.user);
    api
      .get (`users/${global.user.id}`)
      .then (data => data.json ())
      .then (data => {
        if (data.status == 'ok') {
          let body = data.body.interaction_tokens || {};
          let keys = [
            'votes',
            'created_assignments',
            'created_notes',
            'created_important_dates',
            'created_posts',
            'created_comments',
          ];
          let tokens = {};
          keys.forEach (key => {
            if (body[key]) {
              tokens[key] = body[key];
            } else {
              tokens[key] = [];
            }
          });
          this.setState ({
            interaction_tokens: tokens,
            loaded: true,
          });
        }
      });
  }
  render () {
    let {interaction_tokens} = this.state;
    let total = Object.keys (interaction_tokens).reduce ((acc, current) => {
      return (
        acc +
        interaction_tokens[current].reduce ((acc, current) => {
          return acc + current.tokens;
        }, 0)
      );
    }, 0);
    let keys = {
      created_assignments: 'Created Assignments',
      votes: 'Votes',
      created_notes: 'Created Notes',
      created_important_dates: 'Created Important Dates',
      created_posts: 'Created Posts',
      created_comments: 'Created Comments',
    };
    return (
      <View>
        <View
          style={{
            borderTopWidth: StyleSheet.hairlineWidth,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: global.user.getBorderColor (),
          }}
        >
          <Touchable
            onPress={() => {
              this.state.loaded
                ? this.setState ({collapsed: !this.state.collapsed})
                : () => {};
            }}
          >
            <View
              style={[
                styles.courseRow,
                // {backgroundColor: global.user.getSecondaryTheme ()},
              ]}
            >
              <View
                style={[
                  styles.courseRowInfo,
                  {
                    borderBottomColor: this.state.collapsed
                      ? 'rgba(0,0,0,0)'
                      : global.user.getBorderColor (),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.courseRowText,
                    {color: global.user.getSecondaryTextColor ()},
                  ]}
                >
                  Total
                </Text>
                {this.state.loaded
                  ? <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text
                        style={{
                          fontSize: 18,
                          color: global.user.getSecondaryTextColor (),
                        }}
                      >
                        {total}
                      </Text>
                      <View style={{paddingLeft: 10, paddingTop: 3}}>
                        {this.state.collapsed
                          ? <DownIcon
                              color={global.user.getPrimaryTextColor ()}
                              size={28}
                            />
                          : <UpIcon
                              color={global.user.getPrimaryTextColor ()}
                              size={28}
                            />}
                      </View>
                    </View>
                  : <UIActivityIndicator
                      color="white"
                      count={12}
                      size={20}
                      style={{flexGrow: 0, paddingLeft: 15, paddingRight: 15}}
                    />}

              </View>
            </View>
          </Touchable>
          <Collapsible collapsed={this.state.collapsed}>
            {Object.keys (interaction_tokens).map ((token, index) => {
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
                      {
                        marginLeft: 20,
                      },
                      {
                        borderBottomColor: index ==
                          Object.keys (interaction_tokens).length - 1
                          ? 'rgba(0,0,0,0)'
                          : global.user.getBorderColor (),
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.courseRowText,
                        {color: global.user.getSecondaryTextColor ()},
                      ]}
                    >
                      {keys[token]}
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                        color: global.user.getTertiaryTextColor (),
                      }}
                    >
                      {interaction_tokens[token].reduce ((acc, current) => {
                        return acc + current.tokens;
                      }, 0)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </Collapsible>
        </View>
      </View>
    );
  }
}

class DistrictInput extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      districtUsername: this.props.districtUsername,
      districtPassword: this.props.districtPassword,
      grade: this.props.grade,
    };
  }
  updateText = (key, val) => {
    let update = {};
    update[key] = val;
    this.setState (update);
    this.props.updateText (key, val);
  };
  render () {
    return (
      <View>
        <CourseRow
          text={'Username'}
          value={this.state.username}
          control={
            <TextInput
              multiline={false}
              value={this.state.districtUsername}
              placeholderTextColor={global.user.getTertiaryTextColor ()}
              onChangeText={text => this.updateText ('districtUsername', text)}
              style={{
                fontSize: 20,
                color: global.user.getSecondaryTextColor (),
                opacity: 0.9,
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
              placeholderTextColor={global.user.getTertiaryTextColor ()}
              value={this.state.districtPassword}
              onChangeText={text => this.updateText ('districtPassword', text)}
              style={{
                fontSize: 20,
                color: global.user.getSecondaryTextColor (),
                opacity: 0.9,
                alignSelf: 'stretch',
                textAlign: 'right',
                flexGrow: 1,
              }}
              placeholder="Password"
            />
          }
          last={false}
        />
        <CourseRow
          text={'Grade'}
          value={this.state.grade}
          control={
            <TextInput
              multiline={false}
              placeholderTextColor={global.user.getTertiaryTextColor ()}
              keyboardType={'number-pad'}
              value={this.state.grade.toString ()}
              onChangeText={text => this.updateText ('grade', text)}
              style={{
                fontSize: 20,
                color: global.user.getSecondaryTextColor (),
                opacity: 0.9,
                alignSelf: 'stretch',
                textAlign: 'right',
                flexGrow: 1,
              }}
              placeholder="Grade"
            />
          }
          last={true}
        />
      </View>
    );
  }
}

export default class SettingsScreen extends React.Component {
  constructor (props) {
    super (props);

    let num = global.user.getPrimaryTheme ();
    num = num.substring (1, 7);

    let secondaryTheme = global.user.getSecondaryTheme ();
    secondaryTheme = secondaryTheme.substring (1, 7);

    let primaryTextColor = global.user.getPrimaryTextColor ();
    primaryTextColor = primaryTextColor.substring (1, 7);
    let secondaryTextColor = global.user.getSecondaryTextColor ();
    secondaryTextColor = primaryTextColor.substring (1, 7);
    let tertiaryTextColor = global.user.getTertiaryTextColor ();
    tertiaryTextColor = primaryTextColor.substring (1, 7);

    this.iosSheet = React.createRef ();

    this.state = {
      profile_picture: global.user.profile_picture,
      notifications: global.user.notifications,

      theme: global.user.theme,

      scheduled_dark_theme: global.user.scheduled_dark_theme,

      scheduled_start_hour: global.user.scheduled_start_hour,

      scheduled_end_hour: global.user.scheduled_end_hour,

      scheduled_start_minute: global.user.scheduled_start_minute,

      scheduled_end_minute: global.user.scheduled_end_minute,

      grade: global.districtInfo.grade || 9,

      primaryTheme: new Animated.Value (parseInt (num, 16)),

      secondaryTheme: new Animated.Value (parseInt (secondaryTheme, 16)),

      primaryTextColor: new Animated.Value (parseInt (primaryTextColor, 16)),

      secondaryTextColor: new Animated.Value (
        parseInt (secondaryTextColor, 16)
      ),

      tertiaryTextColor: new Animated.Value (parseInt (tertiaryTextColor, 16)),

      trueDark: global.user.trueDark,

      transform: new Animated.Value (0),

      visuallyImpared: global.user.visuallyImpared,
      scheduleType: global.user.scheduleType,
      automaticMarkRetrieval: global.user.automaticMarkRetrieval,
      automaticCourseUpdating: global.user.automaticCourseUpdating,
      grade_only_announcements: global.user.grade_only_announcements,
      pdf_announcements: global.user.pdf_announcements,

      scrollEnabled: true,

      districtUsername: global.districtInfo.districtUsername || '',
      districtPassword: global.districtInfo.districtPassword || '',
    };
    this.scrollView = React.createRef ();
    this.imagePicker = React.createRef ();

    this.editing = 'start';
  }

  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };
  openDateIOS = () => {
    let date = new Date ();
    if (this.editing === 'start') {
      date = new Date (
        date.getFullYear (),
        date.getMonth (),
        date.getDate (),
        this.state.scheduled_start_hour,
        this.state.scheduled_start_minute
      );
    } else {
      date = new Date (
        date.getFullYear (),
        date.getMonth (),
        date.getDate (),
        this.state.scheduled_end_hour,
        this.state.scheduled_end_minute
      );
    }
    this.iosSheet.current.setState ({isBackdropVisible: true, date});
  };
  openDateAndroid = async () => {
    try {
      const {action, hour, minute} = await TimePickerAndroid.open ({
        hour: this.state.scheduled_start_hour,
        minute: this.state.scheduled_start_minute,
        is24Hour: false, // Will display '2 PM'
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        this.updateDate (hour, minute);
        // Selected hour (0-23), minute (0-59)
      }
    } catch (e) {
      console.log (e);
    }
  };
  openDate = date => {
    this.editing = date;
    if (Platform.OS == 'ios') {
      this.openDateIOS ();
    } else {
      this.openDateAndroid ();
    }
  };
  updateDate = async (hours, minutes) => {
    if (this.editing === 'start') {
      global.user['scheduled_start_hour'] = hours;
      global.user['scheduled_start_minute'] = minutes;

      let date = new Date ();
      let sumNow = date.getHours () * 60 + date.getMinutes ();
      let sumStart = hours * 60 + minutes;
      let sumEnd =
        this.state.scheduled_end_hour * 60 + this.state.scheduled_end_minute;
      if (sumNow >= sumStart || sumNow <= sumEnd) {
        global.user.theme = 'Dark';
      } else {
        global.user.theme = 'Light';
      }

      await User._saveToStorage (global.user);

      let num = global.user.getPrimaryTheme ();
      num = num.substring (1, 7);

      Animated.timing (this.state.primaryTheme, {
        toValue: parseInt (num, 16),
        // easing: Easing.bezier (0.2, 0.73, 0.33, 0.99),
        duration: 330,
        delay: 0,
      }).start ();

      let secondaryTheme = global.user.getSecondaryTheme ();
      secondaryTheme = secondaryTheme.substring (1, 7);

      Animated.timing (this.state.secondaryTheme, {
        toValue: parseInt (secondaryTheme, 16),
        // easing: Easing.bezier (0.2, 0.73, 0.33, 0.99),
        duration: 330,
        delay: 0,
      }).start ();

      this.setState ({
        scheduled_start_hour: hours,
        scheduled_start_minute: minutes,
      });
    } else {
      global.user['scheduled_end_hour'] = hours;
      global.user['scheduled_end_minute'] = minutes;

      let date = new Date ();
      let sumNow = date.getHours () * 60 + date.getMinutes ();
      let sumStart =
        this.state.scheduled_start_hour * 60 +
        this.state.scheduled_start_minute;
      let sumEnd = hours * 60 + minutes;
      if (sumNow >= sumStart || sumNow <= sumEnd) {
        global.user.theme = 'Dark';
      } else {
        global.user.theme = 'Light';
      }

      await User._saveToStorage (global.user);

      let num = global.user.getPrimaryTheme ();
      num = num.substring (1, 7);

      Animated.timing (this.state.primaryTheme, {
        toValue: parseInt (num, 16),
        // easing: Easing.bezier (0.2, 0.73, 0.33, 0.99),
        duration: 330,
        delay: 0,
      }).start ();

      let secondaryTheme = global.user.getSecondaryTheme ();
      secondaryTheme = secondaryTheme.substring (1, 7);

      Animated.timing (this.state.secondaryTheme, {
        toValue: parseInt (secondaryTheme, 16),
        // easing: Easing.bezier (0.2, 0.73, 0.33, 0.99),
        duration: 330,
        delay: 0,
      }).start ();

      this.setState ({
        scheduled_end_hour: hours,
        scheduled_end_minute: minutes,
      });
    }
  };
  onImageRecieved = result => {
    // console.log (result);
    let api = new ApexAPI (global.user);
    api
      .put (`users/${global.user.id}`, {
        profile_picture: result.path,
      })
      .then (data => data.json ())
      .then (async data => {
        if (data.status == 'ok') {
          console.log (data.body.profile_picture);
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
  switchScheduled = async val => {
    global.user['scheduled_dark_theme'] = val;

    if (val == true) {
      let date = new Date ();
      let sumNow = date.getHours () * 60 + date.getMinutes ();
      let sumStart =
        global.user.scheduled_start_hour * 60 +
        global.user.scheduled_start_minute;
      let sumEnd =
        global.user.scheduled_end_hour * 60 + global.user.scheduled_end_minute;
      if (sumNow >= sumStart || sumNow <= sumEnd) {
        global.user.theme = 'Dark';
      } else {
        global.user.theme = 'Light';
      }
      let num = global.user.getPrimaryTheme ();
      num = num.substring (1, 7);

      Animated.timing (this.state.primaryTheme, {
        toValue: parseInt (num, 16),
        // easing: Easing.bezier (0.2, 0.73, 0.33, 0.99),
        duration: 330,
        delay: 0,
      }).start ();

      let secondaryTheme = global.user.getSecondaryTheme ();
      secondaryTheme = secondaryTheme.substring (1, 7);

      Animated.timing (this.state.secondaryTheme, {
        toValue: parseInt (secondaryTheme, 16),
        // easing: Easing.bezier (0.2, 0.73, 0.33, 0.99),
        duration: 330,
        delay: 0,
      }).start ();
    }
    await User._saveToStorage (global.user);

    this.setState ({scheduled_dark_theme: val});
  };
  toggleSettings = async (setting, value) => {
    // console.log (setting);
    let state = {...this.state};
    state[setting] = value;
    // console.log (state);
    global.user[setting] = value;
    await User._saveToStorage (global.user);

    if (setting == 'trueDark') {
      this.updateColors ();
    }

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
          pdf_announcements: this.state.pdf_announcements,
          grade_only_announcements: this.state.grade_only_announcements,
          automatic_mark_retrieval: this.state.automaticMarkRetrieval,
          automatic_course_retrieval: this.state.automaticCourseUpdating,
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
    if (Platform.OS == 'ios') {
      this.keyboardWillShowSub = Keyboard.addListener (
        'keyboardWillShow',
        this.keyboardWillShow
      );
      this.keyboardWillHideSub = Keyboard.addListener (
        'keyboardWillHide',
        this.keyboardWillHide
      );
    } else {
      this.keyboardWillShowSub = Keyboard.addListener (
        'keyboardDidShow',
        this.keyboardWillShow
      );
      this.keyboardWillHideSub = Keyboard.addListener (
        'keyboardDidHide',
        this.keyboardWillHide
      );
    }

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
      toValue: -150,
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
  updateText = async (field, value) => {
    if (field == 'grade') {
      if (value) {
        value = parseInt (value);
        global.user[field] = value;
        global.user = await User._saveToStorage (global.user);
        let api = new ApexAPI (global.user);
        api.put ('user', {
          grade: value,
        });
      }
    }
    // this.state[field] = value;
    global.districtInfo[field] = value;
    global.districtInfo = await User._saveDistrictInfo (global.districtInfo);
  };
  updateColors = () => {
    let num = global.user.getPrimaryTheme ();
    num = num.substring (1, 7);

    // console.log(parseInt(num, 16));

    Animated.timing (this.state.primaryTheme, {
      toValue: parseInt (num, 16),
      // easing: Easing.bezier (0.2, 0.73, 0.33, 0.99),
      duration: 330,
      delay: 0,
    }).start ();

    let secondaryTheme = global.user.getSecondaryTheme ();
    secondaryTheme = secondaryTheme.substring (1, 7);

    Animated.timing (this.state.secondaryTheme, {
      toValue: parseInt (secondaryTheme, 16),
      // easing: Easing.bezier (0.2, 0.73, 0.33, 0.99),
      duration: 330,
      delay: 0,
    }).start ();
  };
  updateTheme = async theme => {
    global.user.theme = theme;
    await User._saveToStorage (global.user);
    let api = new ApexAPI (global.user);

    this.updateColors ();
    this.setState ({theme});
    // this.setState ({theme}, () => {
    //   api
    //     .put (`users/${global.user.id}`, {
    //       notifications: {
    //         daily_announcements: this.state.notifications.dailyAnnouncements,
    //         next_class: this.state.notifications.nextClass,
    //         new_assignments: this.state.notifications.newAssignments,
    //         image_replies: this.state.notifications.imageReplies,
    //         upcoming_events: this.state.notifications.upcomingEvents,
    //         marked_assignments: this.state.notifications.markedAssignments,
    //       },
    //       theme: this.state.theme,
    //       true_dark: this.state.trueDark,
    //       visually_impared: this.state.visuallyImpared,
    //       automatic_mark_retrieval: this.state.automaticMarkRetrieval,
    //       automatic_course_updating: this.state.automaticCourseUpdating,
    //     })
    //     .then (data => data.json ())
    //     .then (data => {
    //       // console.log (data);
    //     });
    // });
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
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: this.state.primaryTheme.interpolate ({
              inputRange: [0, 16777215],
              outputRange: ['#000000', '#ffffff'],
            }),
          },
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
                  marginTop: 5,
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

          <View>
            <Text
              style={{
                marginTop: 20,
                marginLeft: 5,
                marginBottom: 5,
                color: global.user.getTertiaryTextColor (),
                fontSize: 12,
              }}
            >
              INTERACTION TOKENS
            </Text>

            <Animated.View
              style={[
                {
                  backgroundColor: this.state.secondaryTheme.interpolate ({
                    inputRange: [0, 16777215],
                    outputRange: ['#000000', '#ffffff'],
                  }),
                },
              ]}
            >

              <InteractionTokens />
            </Animated.View>
          </View>

          <ButtonSection header={'PUSH NOTIFICATIONS'}>
            <Animated.View
              style={[
                {
                  backgroundColor: this.state.secondaryTheme.interpolate ({
                    inputRange: [0, 16777215],
                    outputRange: ['#000000', '#ffffff'],
                  }),
                },
              ]}
            >

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
            </Animated.View>
          </ButtonSection>

          <ButtonSection header={'THEME'}>

            <Animated.View
              style={[
                {
                  backgroundColor: this.state.secondaryTheme.interpolate ({
                    inputRange: [0, 16777215],
                    outputRange: ['#000000', '#ffffff'],
                  }),
                },
              ]}
            >
              <CourseRow
                text={'Scheduled Dark'}
                control={
                  <Switch
                    value={this.state.scheduled_dark_theme}
                    onValueChange={val => this.switchScheduled (val)}
                  />
                }
                last={false}
              />
              {this.state.scheduled_dark_theme
                ? <View>
                    <DateCourseRow
                      text={'Start'}
                      last={false}
                      openDate={() => this.openDate ('start')}
                      date={FormatHours._formatTime (
                        this.state.scheduled_start_hour,
                        this.state.scheduled_start_minute,
                        true
                      )}
                    />
                    <DateCourseRow
                      text={'End'}
                      last={true}
                      openDate={() => this.openDate ('end')}
                      date={FormatHours._formatTime (
                        this.state.scheduled_end_hour,
                        this.state.scheduled_end_minute,
                        true
                      )}
                    />
                  </View>
                : ['Light', 'Dark'].map ((option, index, array) => {
                    return (
                      <Touchable
                        key={'row_' + index}
                        onPress={() => this.updateTheme (option)}
                      >
                        <CourseRow
                          text={option}
                          last={index + 1 == array.length}
                          control={
                            this.state.theme == option
                              ? <CheckMarkIcon color="#ffbb54" size={22} />
                              : <View />
                          }
                        />
                      </Touchable>
                    );
                  })}
            </Animated.View>

          </ButtonSection>

          <ButtonSection header={'DARK THEME'}>
            <Animated.View
              style={[
                {
                  backgroundColor: this.state.secondaryTheme.interpolate ({
                    inputRange: [0, 16777215],
                    outputRange: ['#000000', '#ffffff'],
                  }),
                },
              ]}
            >
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
            </Animated.View>

          </ButtonSection>
          <ButtonSection header={`${global.school.district} ACCOUNT INFO`}>
            <Animated.View
              style={[
                {
                  backgroundColor: this.state.secondaryTheme.interpolate ({
                    inputRange: [0, 16777215],
                    outputRange: ['#000000', '#ffffff'],
                  }),
                },
              ]}
            >
              <DistrictInput
                districtUsername={global.districtInfo.districtUsername}
                districtPassword={global.districtInfo.districtPassword}
                grade={global.districtInfo.grade}
                updateText={this.updateText}
              />
            </Animated.View>
          </ButtonSection>
          <ButtonSection header={'MISCELLANEOUS'}>
            <Animated.View
              style={[
                {
                  backgroundColor: this.state.secondaryTheme.interpolate ({
                    inputRange: [0, 16777215],
                    outputRange: ['#000000', '#ffffff'],
                  }),
                },
              ]}
            >
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
                text={'PDF Announcements'}
                control={
                  <Switch
                    value={this.state.pdf_announcements}
                    onValueChange={val =>
                      this.toggleSettings ('pdf_announcements', val)}
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
            </Animated.View>
          </ButtonSection>
          <View style={{width, marginTop: 20}} />
        </Animated.ScrollView>
        <ImagePickerPopup
          ref={this.imagePicker}
          onImageLoaded={this.onImageRecieved}
        />
        <IOSDateSheet ref={this.iosSheet} updateDate={this.updateDate} />
      </Animated.View>
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
    // backgroundColor: 'white',
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
