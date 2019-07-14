import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  View,
  Dimensions,
  Picker,
  Keyboard,
  Animated,
  Easing,
} from 'react-native';

import Modal from 'react-native-modal';

import {LinearGradient} from 'expo-linear-gradient';

import {Input} from 'react-native-elements';

import {boxShadows} from '../../constants/boxShadows';

import {PasswordIcon, UsernameIcon, SchoolIcon} from '../../classes/icons';

import {Course, Courses} from '../../classes/courses';

import {Day, Days} from '../../classes/days';

import {Semester, Semesters} from '../../classes/semesters';

import {Event, Events} from '../../classes/events';

import {Topic, Topics} from '../../classes/topics';

import {School, DayBlock} from '../../classes/school';

import {User} from '../../classes/user';

import Touchable from 'react-native-platform-touchable';

import ApexAPI from '../../http/api';

import {StackActions, NavigationActions} from 'react-navigation';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

class UsernameInput extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      text: '',
      focused: false,
    };
  }
  enterText = text => {
    this.setState ({text: text});
    this.props.updateText ({username: text});
  };
  onFocus = () => {
    this.setState ({focused: true});
  };
  onBlur = () => {
    this.setState ({focused: false});
  };
  render () {
    if (this.state.focused) {
      return (
        <View style={styles.inputContainer}>
          <UsernameIcon color="#ffe0e0" size={32} style={{width: 40}} />
          <Input
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            autoCapitalize="none"
            inputStyle={{fontSize: 24, fontWeight: '300'}}
            placeholderTextColor="black"
            font
            placeholder="Username"
            multiline={false}
            containerStyle={[
              styles.textInput,
              {
                borderBottomColor: '#ffe0e0',
                borderBottomWidth: StyleSheet.hairlineWidth * 3,
              },
            ]}
            inputContainerStyle={{borderBottomWidth: 0}}
            onChangeText={text => this.enterText (text)}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.inputContainer}>
          <UsernameIcon color="black" size={32} style={{width: 40}} />
          <Input
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            autoCapitalize="none"
            inputStyle={{fontSize: 24, fontWeight: '300'}}
            placeholderTextColor="black"
            font
            placeholder="Username"
            multiline={false}
            containerStyle={styles.textInput}
            inputContainerStyle={{borderBottomWidth: 0}}
            onChangeText={text => this.enterText (text)}
          />
        </View>
      );
    }
  }
}

class PasswordInput extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      text: '',
      focused: false,
    };
  }
  enterText = text => {
    this.setState ({text: text});
    this.props.updateText ({password: text});
  };
  onFocus = () => {
    this.setState ({focused: true});
  };
  onBlur = () => {
    this.setState ({focused: false});
  };
  render () {
    if (this.state.focused) {
      return (
        <View style={styles.inputContainer}>
          <PasswordIcon color="#ffe0e0" size={32} style={{width: 40}} />
          <Input
            secureTextEntry={true}
            isSecure={true}
            password={true}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            autoCapitalize="none"
            inputStyle={{fontSize: 24, fontWeight: '300'}}
            placeholderTextColor="black"
            font
            placeholder="Password"
            multiline={false}
            containerStyle={[
              styles.textInput,
              {
                borderBottomColor: '#ffe0e0',
                borderBottomWidth: StyleSheet.hairlineWidth * 3,
              },
            ]}
            inputContainerStyle={{borderBottomWidth: 0}}
            onChangeText={text => this.enterText (text)}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.inputContainer}>
          <PasswordIcon color="black" size={32} style={{width: 40}} />
          <Input
            secureTextEntry={true}
            isSecure={true}
            password={true}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            autoCapitalize="none"
            inputStyle={{fontSize: 24, fontWeight: '300'}}
            placeholderTextColor="black"
            font
            placeholder="Password"
            multiline={false}
            containerStyle={styles.textInput}
            inputContainerStyle={{borderBottomWidth: 0}}
            onChangeText={text => this.enterText (text)}
          />
        </View>
      );
    }
  }
}

class SchoolInput extends React.Component {
  constructor (props) {
    super (props);
    this.props = props;
    this.props.schools = this.props.schools || [];
    this.state = {
      id: this.props.id,
      schoolIndex: 0,
    };
  }
  render () {
    return (
      <View style={styles.inputContainer}>
        <SchoolIcon color="black" size={32} style={{width: 40}} />
        <View style={styles.schoolSelectButton}>
          <Text style={styles.schoolText}>
            {this.props.schools[this.state.schoolIndex]
              ? this.props.schools[this.state.schoolIndex].name
              : 'Loading Schools...'}
          </Text>
        </View>
      </View>
    );
  }
}

function constructCourseList (serverData) {
  let courses = [];
  for (var i = 0; i < serverData.length; i++) {
    serverData[i].id = serverData[i]._id;
    let current = new Course (serverData[i]);
    courses.push (current);
  }
  return courses;
}

function constructDayMap (serverData) {
  let dayMap = {};
  for (var key in serverData) {
    let events = [];
    for (var i = 0; i < serverData[key][3].length; i++) {
      serverData[key][3][i].id = serverData[key][3][i]._id;
      let event = new Event (serverData[key][3][i]);
      events.push (event);
    }
    let currentDay = {
      scheduleWeek: serverData[key][0][0],
      scheduleDay: serverData[key][0][1],
      events: events,
      dayDisplayed: serverData[key][1],
      hasEvents: serverData[key][2],
    };
    let day = new Day (currentDay);
    dayMap[key] = day;
  }
  return dayMap;
}

function constructSemesterList (serverData) {
  let semesters = [];
  for (var i = 0; i < serverData.length; i++) {
    serverData[i].id = serverData[i]._id;
    let current = new Semester (serverData[i]);
    semesters.push (current);
  }
  return semesters;
}

function constructEventList (serverData) {
  let events = [];
  for (var i = 0; i < serverData.length; i++) {
    serverData[i].id = serverData[i]._id;
    let current = new Event (serverData[i]);
    events.push (current);
  }
  return events;
}

function constructSchoolObject (serverData) {
  return {
    schedule: serverData.schedule,
    rawSchedule: serverData.rawSchedule,
    dayMap: serverData['year_day_object'],
    blocks: serverData['blocks'],
    spareName: serverData['spare_name'],
    dayTitles: serverData['day_titles'],
    id: serverData._id,
  };
}

function constructUserObject (serverData) {
  let user = new User (serverData);
  return user;
}

function constructTopicList (serverData) {
  let topics = [];
  for (var i = 0; i < serverData.length; i++) {
    serverData[i].id = serverData[i]._id;
    let current = new Topic (serverData[i]);
    topics.push (current);
  }
  return topics;
}

class LoginButton extends React.Component {
  constructor (props) {
    super (props);
    this.props = props;
    this.state = {
      username: '',
      password: '',
      school: '',
      active: false,
    };
  }
  handleClick = () => {
    let username = this.props.inputs[0].current.state.text;
    let password = this.props.inputs[1].current.state.text;
    let school = this.props.inputs[2].current.state.id;
    this.setState ({username, password, school, active: false});
    ApexAPI.authenticate (username, password, school)
      .then (res => res.json ())
      .then (async response => {
        if (response.status == 'ok') {
          await Courses._saveToStorage (
            constructCourseList (response.body.courses)
          );
          await Semesters._saveToStorage (
            constructSemesterList (response.body.semesters)
          );
          await Events._saveToStorage (
            constructEventList (response.body.events)
          );
          await Topics._saveToStorage (
            constructTopicList (response.body.topics)
          );
          await School._saveToStorage (
            constructSchoolObject (response.body.school)
          );
          await User._saveToStorage (
            constructUserObject ({
              scheduleImages: response.body.user.schedule_images,
              scheduleType: response.body.schedule_type,
              id: response.body.user._id,
              firstName: response.body.user.first_name,
              lastName: response.body.user.last_name,
              studentNumber: response.body.user.student_number,
              username: response.body.username,
              password,
              'x-api-key': response.body['api_key'],
              'x-id-key': response.body['_id'],
              courses: response.body.user.courses,
              school,
            })
          );
          await User._setLoginState (true);
          const resetAction = StackActions.reset ({
            index: 0,
            actions: [NavigationActions.navigate ({routeName: 'Loading'})],
          });
          this.props.navigation.dispatch (resetAction);
        } else {
          this.props.navigation.navigate ('Login');
        }
      })
      .catch (e => {
        console.log (e);
        this.props.navigation.navigate ('Login');
      });
  };

  render () {
    return this.state.active
      ? <Touchable onPress={this.handleClick}>
          <View style={[styles.loginButton, boxShadows.boxShadow3]}>
            <Text style={styles.loginButtonText}>
              LOGIN
            </Text>
          </View>
        </Touchable>
      : <View style={[styles.loginButtonInactive, boxShadows.boxShadow3]}>
          <Text style={styles.loginButtonText}>
            LOGIN
          </Text>
        </View>;
  }
}

class SchoolPicker extends React.Component {
  constructor (props) {
    super (props);
    this.props = props;
    this.props.schools = this.props.schools || [];
    this.state = {
      school: '_',
    };
  }
  render () {
    if (!this.props.schools.length) {
      return (
        <View style={styles.pickerHolder}>
          <Picker selectedValue={this.state.school} style={styles.picker} />
        </View>
      );
    } else {
      return (
        <View style={styles.pickerHolder}>
          <Picker
            selectedValue={this.state.school}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => {
              let currentSchool = this.props.schools[0];
              for (var i = 0; i < this.props.schools.length; i++) {
                if (this.props.schools[i]._id == itemValue) {
                  currentSchool = this.props.schools[i];
                }
              }
              this.setState ({school: itemValue});
              this.props.display.current.setState ({
                schoolIndex: itemIndex,
                id: currentSchool.id,
              });
            }}
          >
            {this.props.schools.map (y => {
              return (
                <Picker.Item
                  key={y._id}
                  label={y.name + ` (${y.district || 'No District'})`}
                  value={y._id}
                />
              );
            })}
          </Picker>
        </View>
      );
    }
  }
}

class ModalSelect extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      modalShown: false,
    };
  }
  _toggleModal = () => this.setState ({modalShown: !this.state.modalShown});

  render () {
    return (
      <View style={styles.modalHolder}>
        <Modal
          style={{margin: 0}}
          onBackdropPress={() => this.setState ({modalShown: false})}
          isVisible={this.state.modalShown}
          backdropOpacity={0.4}
        >
          <SchoolPicker {...this.props} />
        </Modal>
      </View>
    );
  }
}

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor (props) {
    super (props);
    this.username = React.createRef ();
    this.password = React.createRef ();
    this.school = React.createRef ();
    this.modal = React.createRef ();
    this.loginButton = React.createRef ();
    this.state = {
      isLoadingComplete: false,
      schools: [],
      height: new Animated.Value (0),
      username: '',
      password: '',
    };
  }
  openModal = () => {
    this.modal.current.setState ({modalShown: true});
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
    ApexAPI.getSchoolList ()
      .then (res => res.json ())
      .then (res => {
        if (res.status == 'error') {
          res.setState ({schools: []});
        } else {
          this.school.current.setState ({
            id: res.body[0] ? res.body[0]._id : '_',
          });
          this.setState ({schools: res.body});
        }
      })
      .catch (e => this.setState ({schools: []}));
  }
  componentWillUnmount () {
    this.keyboardWillShowSub.remove ();
    this.keyboardWillHideSub.remove ();
  }
  keyboardWillShow = event => {
    Animated.timing (this.state.height, {
      toValue: -100,
      easing: Easing.bezier (0.2, 0.73, 0.33, 0.99),
      duration: 250,
      delay: 0,
    }).start ();
  };
  keyboardWillHide = event => {
    Animated.timing (this.state.height, {
      toValue: 0,
      easing: Easing.bezier (0.2, 0.73, 0.33, 0.99),
      duration: 250,
      delay: 0,
    }).start ();
  };
  updateText = text => {
    this.state[Object.keys (text)[0]] = text[Object.keys (text)[0]];
    if (this.state.username && this.state.password) {
      this.loginButton.current.setState ({active: true});
    } else {
      this.loginButton.current.setState ({active: false});
    }
  };
  render () {
    return (
      <View style={styles.container}>
        <LinearGradient
          style={{flexGrow: 1, flexDirection: 'column'}}
          colors={['#ffc371', '#ff5f6d']}
          start={{x: 1, y: 0}}
          end={{x: 0, y: 1}}
        >
          <Animated.View
            style={{
              width,
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              top: this.state.height,
            }}
          >
            <View style={styles.imageContainer}>
              <Image
                source={require ('../../assets/logo_transparent.png')}
                style={styles.logo}
              />
            </View>
            <UsernameInput
              updateText={this.updateText}
              name="username"
              ref={this.username}
            />
            <PasswordInput
              updateText={this.updateText}
              name="password"
              ref={this.password}
            />
            <Touchable onPress={this.openModal}>
              <SchoolInput
                name="school"
                ref={this.school}
                schools={this.state.schools}
              />
            </Touchable>
            <LoginButton
              ref={this.loginButton}
              navigation={this.props.navigation}
              inputs={[this.username, this.password, this.school]}
            />
          </Animated.View>
        </LinearGradient>
        <ModalSelect
          name="modal"
          ref={this.modal}
          display={this.school}
          schools={this.state.schools}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create ({
  container: {
    flexGrow: 1,
    width: width,
    flexDirection: 'column',
    alignItems: 'center',
  },
  imageContainer: {
    width: width,
    flexDirection: 'row',
    height: 150,
    justifyContent: 'center',
    marginTop: 40,
  },
  logo: {
    flexGrow: 0.6,
    width: undefined,
    height: undefined,
    resizeMode: 'contain',
  },
  inputContainer: {
    width: width * 0.9,
    flexDirection: 'row',
    marginTop: 30,
  },
  textInput: {
    width: 0,
    flexGrow: 1,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderColor: 'black',
  },
  schoolSelectButton: {
    width: 0,
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  schoolText: {
    flexGrow: 1,
    textAlign: 'right',
    fontSize: 22,
  },
  loginButton: {
    marginTop: 30,
    width: width * 0.95,
    height: 35,
    backgroundColor: '#775fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonInactive: {
    marginTop: 30,
    width: width * 0.95,
    height: 35,
    backgroundColor: '#a1a1a1',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 24,
  },
  pickerHolder: {
    height: 200,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
  },
  picker: {},
});
