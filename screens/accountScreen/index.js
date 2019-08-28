import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  Image,
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

import Touchable from '../../components/react-native-platform-touchable';

import {ifIphoneX} from 'react-native-iphone-x-helper';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

function hslString (num, max) {
  if (global.user.theme === 'dark') {
    return `hsl(${num / max * 360}, 57%, 63%)`;
  } else {
    return `hsl(${num / max * 360}, 100%, 75%)`;
  }
}

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
        <View style={[styles.buttonSection, global.user.borderColor ()]}>
          {this.props.children}
        </View>
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
    let current = 0;
    let max = 15;
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
                {global.user.profile_picture !== ''
                  ? <Image
                      source={{
                        uri: `https://www.apexschools.co${global.user.profile_picture}`,
                      }}
                      style={{
                        width: 45,
                        height: 45,
                        borderRadius: 22.5,
                        overflow: 'hidden',
                        marginTop: 5,
                      }}
                    />
                  : <AccountIcon
                      color={global.user.getPrimaryTextColor ()}
                      size={45}
                    />}
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
            <ButtonSection header={'HELP'}>
              <CourseRow
                color={'#aaa'}
                icon={
                  <QuestionMarkIcon
                    style={{marginRight: 2, marginBottom: 2}}
                    size={20}
                    color={'black'}
                  />
                }
                text={'Tutorial'}
                last={true}
                onPress={() => this._navigateToPage ('Tutorial')}
              />

            </ButtonSection>
            <ButtonSection header={'STATIC INFORMATION'}>
              <CourseRow
                color={hslString (current++, max)}
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
                color={hslString (current++, max)}
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
                color={hslString (current++, max)}
                icon={<EventsIcon size={20} color={'black'} />}
                text={'Events'}
                last={true}
                loading={false}
                onPress={() => this._navigateToPage ('Events')}
              />
            </ButtonSection>
            <ButtonSection header={'COMMUNAL'}>
              <CourseRow
                color={hslString (current++, max)}
                icon={<ChatIcon size={20} color={'black'} />}
                text={'Chatrooms'}
                last={false}
                onPress={() => this._navigateToPage ('Chatrooms')}
              />

              <CourseRow
                color={hslString (current++, max)}
                icon={<QuestionIcon size={20} color={'black'} />}
                text={'School Forum'}
                last={false}
                loading={false}
                onPress={() => this._navigateToPage ('Questions')}
              />

              <CourseRow
                color={hslString (current++, max)}
                icon={<AssignmentsIcon size={20} color={'black'} />}
                text={'My Classes'}
                onPress={() => this._navigateToPage ('Assignments')}
                last={true}
              />

            </ButtonSection>
            <ButtonSection header={'SCHOOL RESOURCES'}>
              <CourseRow
                color={hslString (current++, max)}
                icon={<LinkIcon size={20} color={'black'} />}
                text={'Links'}
                onPress={() => this._navigateToPage ('Links')}
                last={false}
              />
              <CourseRow
                color={hslString (current++, max)}
                icon={<FilesIcon size={20} color={'black'} />}
                text={'Files'}
                onPress={() => this._navigateToPage ('Files')}
                last={false}
              />
              <CourseRow
                color={hslString (current++, max)}
                icon={<PollIcon size={20} color={'black'} />}
                text={'Polls'}
                onPress={() => this._navigateToPage ('Polls')}
                last={true}
              />
              {/* <CourseRow
                color={'#b1d7f9'}
                icon={<SchoolAssignmentsIcon size={20} color={'black'} />}
                text={'School Assignments'}
                onPress={() => this._navigateToPage ('SchoolAssignments')}
                last={false}
              /> */}
            </ButtonSection>
            <ButtonSection header={'SCHOOL CONNECTION'}>
              <CourseRow
                color={hslString (current++, max)}
                icon={<MegaPhoneIcon size={20} color={'black'} />}
                text={'Announcements'}
                onPress={() => this._navigateToPage ('Announcements')}
                last={false}
              />
              <CourseRow
                color={hslString (current++, max)}
                icon={<NotificationIcon size={20} color={'black'} />}
                text={'Notifications'}
                onPress={() => this._navigateToPage ('Notifications')}
                last={false}
              />
              {/* <CourseRow
                color={'#b1d7f9'}
                icon={<SchoolAssignmentsIcon size={20} color={'black'} />}
                text={'School Assignments'}
                onPress={() => this._navigateToPage ('SchoolAssignments')}
                last={false}
              /> */}
              <CourseRow
                color={hslString (current++, max)}
                icon={<PdfIcon size={20} color={'black'} />}
                text={'Transcript'}
                onPress={() => this._navigateToPage ('Transcript')}
                last={true}
              />
            </ButtonSection>

            <ButtonSection header={'PRIVATE'}>
              <CourseRow
                color={hslString (current++, max)}
                icon={<CourseConfigIcon size={20} color={'black'} />}
                text={'Course Names & Colours'}
                onPress={() => {
                  this._navigateToPage ('CourseConfig');
                }}
                last={false}
              />
              <CourseRow
                color={hslString (current++, max)}
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
                color={hslString (current++, max)}
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
                color={hslString (current++, max)}
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
            <ButtonSection header={'LOGOUT'}>
              <CourseRow
                color={'#e8ca66'}
                icon={<LogoutIcon size={20} color={'black'} />}
                text={'Logout'}
                last={true}
                onPress={() => this._navigateToPage ('Login')}
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
    borderColor: 'rgb(210,210,210)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: 5,
  },
  clickIcon: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 5,
  },
});
