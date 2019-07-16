import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';

import HeaderBar from '../../components/header';

import {
  LeftIcon,
  CalendarIcon,
  RightIcon,
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
  ChatIcon,
  QuestionIcon
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

import {ScrollView} from 'react-native-gesture-handler';

import {boxShadows} from '../../constants/boxShadows';

import Touchable from 'react-native-platform-touchable';

import {ifIphoneX} from 'react-native-iphone-x-helper';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

class CourseIconBlock extends React.Component {
  render () {
    return (
      <View
        style={[
          styles.icon,
          boxShadows.boxShadow2,
          {backgroundColor: this.props.color || '#ffaaaa'},
        ]}
      >
        {this.props.children}
      </View>
    );
  }
}

class CourseRow extends React.Component {
  render () {
    if (this.props.last) {
      return (
        <Touchable onPress={this.props.onPress}>
          <View style={[styles.courseRow, global.user.secondaryTheme ()]}>
            <CourseIconBlock color={this.props.color}>
              {this.props.icon}
            </CourseIconBlock>
            <View
              style={[
                styles.courseRowInfo,
                {borderBottomColor: 'rgba(0,0,0,0)'},
              ]}
            >
              <Text
                style={[
                  styles.courseRowText,
                  global.user.secondaryTextColor (),
                ]}
              >
                {this.props.text}
              </Text>
              {this.props.loading
                ? <UIActivityIndicator
                    color="orange"
                    count={12}
                    size={20}
                    style={{flexGrow: 0, paddingRight: 15}}
                  />
                : <RightIcon
                    style={styles.clickIcon}
                    size={30}
                    color="orange"
                  />}
            </View>
          </View>
        </Touchable>
      );
    } else {
      return (
        <Touchable onPress={this.props.onPress}>
          <View style={[styles.courseRow, global.user.secondaryTheme ()]}>
            <CourseIconBlock color={this.props.color}>
              {this.props.icon}
            </CourseIconBlock>
            <View style={[styles.courseRowInfo, global.user.borderColor ()]}>
              <Text
                style={[
                  styles.courseRowText,
                  global.user.secondaryTextColor (),
                ]}
              >
                {this.props.text}
              </Text>
              {this.props.loading
                ? <UIActivityIndicator
                    color="orange"
                    count={12}
                    size={20}
                    style={{flexGrow: 0, paddingRight: 15}}
                  />
                : <RightIcon
                    style={styles.clickIcon}
                    size={30}
                    color="orange"
                  />}
            </View>
          </View>
        </Touchable>
      );
    }
  }
}

class ButtonSection extends React.Component {
  constructor (props) {
    super (props);
    this.props = props;
  }
  render () {
    return (
      <View style={[styles.buttonSection, global.user.borderColor ()]}>
        {this.props.children}
      </View>
    );
  }
}

export default class AccountScreen extends React.Component {
  constructor (props) {
    super (props);
    this.props = props;
    this.state = {
      loading: false,
      loadingRoute: '',
    };
  }
  _navigateToPage = (page, props = {}) => {
    this.props.navigation.navigate (page, props);
  };
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };
  callback () {
    this.setState ({loading: false});
  }
  render () {
    return (
      <View style={[styles.container, global.user.primaryTheme ()]}>
        <HeaderBar
          iconLeft={
            <Touchable onPress={() => this.props.navigation.goBack ()}>
              <LeftIcon size={28} />
            </Touchable>
          }
          iconRight={<EmptyIcon width={28} height={32} />}
          width={width}
          height={60}
          title="Account"
        />
        <View style={styles.bodyHolder}>
          <ScrollView>
            <Touchable onPress={() => this._navigateToPage ('Settings')}>
              <View
                style={{
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderColor: global.user.getBorderColor (),
                  borderTopWidth: StyleSheet.hairlineWidth,
                  backgroundColor: global.user.getSecondaryTheme (),
                  paddingTop: 15,
                  paddingBottom: 15,
                  paddingLeft: 5,
                  paddingRight: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                }}
              >
                <AccountIcon
                  size={45}
                  color={global.user.getPrimaryTextColor ()}
                />
                <View
                  style={{
                    flexDirection: 'column',
                    alignSelf: 'stretch',
                    justifyContent: 'space-evenly',
                    marginLeft: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: '500',
                      color: global.user.getSecondaryTextColor (),
                    }}
                  >
                    {global.user.username}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 12,
                      color: global.user.getTertiaryTextColor (),
                      fontStyle: 'italic',
                      width: width * 0.7,
                    }}
                  >
                    Account Settings, Push Notifications, Theme
                  </Text>
                </View>
                <View style={{marginLeft: 'auto'}}>
                  <RightIcon
                    style={styles.clickIcon}
                    size={30}
                    color="orange"
                  />
                </View>
              </View>
            </Touchable>
            <ButtonSection>
              <CourseRow
                color={'#ef8b8b'}
                icon={<CourseIcon size={20} color={'black'} />}
                text={'Courses'}
                last={false}
                loading={
                  this.state.loading && this.state.loadingRoute == 'Courses'
                }
                onPress={async () => {
                  this.setState (
                    {loading: true, loadingRoute: 'Courses'},
                    () => {
                      setTimeout (() => {
                        this._navigateToPage ('Courses', {
                          callback: () =>
                            this.setState ({loading: false, loadingRoute: ''}),
                        });
                      }, 1);
                    }
                  );
                }}
              />
              <CourseRow
                color={'#e8a266'}
                icon={<QuestionIcon size={20} color={'black'} />}
                text={'Questions'}
                last={false}
                loading={false}
                onPress={() => this._navigateToPage ('Questions')}
              />
              <CourseRow
                color={'#e8b266'}
                icon={<EventsIcon size={20} color={'black'} />}
                text={'Events'}
                last={false}
                loading={false}
                onPress={() => this._navigateToPage ('Events')}
              />
              <CourseRow
                color={'#e8ca66'}
                icon={<LogoutIcon size={20} color={'black'} />}
                text={'Login'}
                last={true}
                onPress={() => this._navigateToPage ('Login')}
              />
            </ButtonSection>
            <ButtonSection>
              <CourseRow
                color={'#ebe07c'}
                icon={<CalendarIcon size={20} color={'black'} />}
                text={'Calendar'}
                last={false}
                loading={
                  this.state.loading && this.state.loadingRoute == 'Calendar'
                }
                onPress={async () => {
                  this.setState (
                    {loading: true, loadingRoute: 'Calendar'},
                    () => {
                      setTimeout (() => {
                        this._navigateToPage ('Calendar', {
                          callback: () =>
                            this.setState ({loading: false, loadingRoute: ''}),
                        });
                      }, 1);
                    }
                  );
                }}
              />
              <CourseRow
                color={'#afffad'}
                icon={<AssignmentsIcon size={20} color={'black'} />}
                text={'Assignments'}
                onPress={() => this._navigateToPage ('Assignments')}
                last={false}
              />
              <CourseRow
                color={'#42f5bc'}
                icon={<NotesIcon size={20} color={'black'} />}
                text={'Notes'}
                last={false}
                onPress={() => this._navigateToPage ('Notes')}
              />
              <CourseRow
                color={'#42cef5'}
                icon={<ChatIcon size={20} color={'black'} />}
                text={'Chatrooms'}
                last={true}
                onPress={() => this._navigateToPage ('Chatrooms')}
              />
            </ButtonSection>
            <ButtonSection>
              <CourseRow
                color={'#b1d7f9'}
                icon={<SchoolAssignmentsIcon size={20} color={'black'} />}
                text={'School Assignments'}
                onPress={() => this._navigateToPage ('SchoolAssignments')}
                last={true}
              />
            </ButtonSection>
            <ButtonSection>
              <CourseRow
                color={'#b2b1f9'}
                icon={<BeforeSchoolIcon size={20} color={'black'} />}
                text={'Before School Activities'}
                onPress={() => {
                  global.activity = {
                    name: 'Before School',
                    page: 0,
                    key: 'beforeSchoolActivities',
                  };
                  this._navigateToPage ('Activities');
                }}
                last={false}
              />
              <CourseRow
                color={'#d7b1f9'}
                icon={<LunchTimeIcon size={20} color={'black'} />}
                text={'Lunchtime Activities'}
                onPress={() => {
                  global.activity = {
                    name: 'Lunch Time',
                    page: 1,
                    key: 'lunchTimeActivities',
                  };
                  this._navigateToPage ('Activities');
                }}
                last={false}
              />
              <CourseRow
                color={'#f6b1f9'}
                icon={<AfterSchoolIcon size={20} color={'black'} />}
                text={'After School Activities'}
                onPress={() => {
                  global.activity = {
                    name: 'After School',
                    page: 2,
                    key: 'afterSchoolActivities',
                  };
                  this._navigateToPage ('Activities');
                }}
                last={true}
              />
            </ButtonSection>
            <View style={{width, marginTop: 20}} />
          </ScrollView>
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
  },
  courseRowInfo: {
    height: 50.0,
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  buttonSection: {
    marginTop: 20,
    borderColor: 'rgb(210,210,210)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  clickIcon: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 5,
  },
});
