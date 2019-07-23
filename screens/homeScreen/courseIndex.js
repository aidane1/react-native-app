import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  AsyncStorage,
  RefreshControl,
} from 'react-native';

import Touchable from 'react-native-platform-touchable';

import {Course, Courses} from '../../classes/courses';

import {RightIcon} from '../../classes/icons';

import {SchoolIcons, GenericIcon} from '../../classes/icons';

import {boxShadows} from '../../constants/boxShadows';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

class CourseIcon extends React.Component {
  render () {
    return (
      <View
        style={[
          styles.icon,
          {backgroundColor: this.props.color},
          boxShadows.boxShadow2,
        ]}
      >
        {this.props.children}
      </View>
    );
  }
}

class DayList extends React.Component {
  render () {
    let list = this.props.courses || [];
    let rowLists = [];
    for (var i = 0; i < list.length; i++) {
      rowLists.push (
        <CourseRow
          _navigateToPage={this.props._navigateToPage}
          last={i == list.length - 1}
          key={'courseRow_' + i.toString ()}
          {...list[i]}
        />
      );
    }
    return (
      <View style={[styles.dayList, global.user.borderColor ()]}>
        {rowLists}
      </View>
    );
  }
}

class CourseRow extends React.Component {
  render () {
    let icon = SchoolIcons.getIcon (this.props.category);
    if (this.props.last) {
      return (
        <Touchable
          onPress={() =>
            this.props.id != '_'
              ? this.props._navigateToPage ('CourseInfo', this.props.id)
              : () => {}}
        >
          <View style={[styles.courseRow, global.user.secondaryTheme ()]}>
            <CourseIcon color={icon[1]}>
              <GenericIcon icon={icon[0]} color="black" size={20} />
            </CourseIcon>
            <View
              style={[
                styles.courseRowInfo,
                {borderBottomColor: 'rgba(0,0,0,0)'},
              ]}
            >
              <View style={styles.courseRowStack}>
                <View>
                  <Text
                    style={[
                      styles.courseRowCourse,
                      global.user.secondaryTextColor (),
                    ]}
                  >
                    {this.props.course}
                  </Text>
                </View>
                <View>
                  <Text
                    style={[
                      styles.courseRowTeacher,
                      global.user.tertiaryTextColor (),
                    ]}
                  >
                    {this.props.teacher}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={[
                    styles.courseRowTime,
                    global.user.secondaryTextColor (),
                  ]}
                >
                  {this.props.time}
                </Text>
                {this.props.id != '_'
                  ? <RightIcon
                      style={{marginTop: 3}}
                      size={30}
                      color="orange"
                    />
                  : <View style={{marginRight: 30}} />}
              </View>
            </View>
          </View>
        </Touchable>
      );
    } else {
      return (
        <Touchable
          onPress={() =>
            this.props.id != '_'
              ? this.props._navigateToPage ('CourseInfo', this.props.id)
              : () => {}}
        >
          <View style={[styles.courseRow, global.user.secondaryTheme ()]}>
            <CourseIcon color={icon[1]}>
              <GenericIcon icon={icon[0]} color="black" size={20} />
            </CourseIcon>
            <View style={[styles.courseRowInfo, global.user.borderColor ()]}>
              <View style={styles.courseRowStack}>
                <View>
                  <Text
                    style={[
                      styles.courseRowCourse,
                      global.user.secondaryTextColor (),
                    ]}
                  >
                    {this.props.course}
                  </Text>
                </View>
                <View>
                  <Text
                    style={[
                      styles.courseRowTeacher,
                      global.user.tertiaryTextColor (),
                    ]}
                  >
                    {this.props.teacher}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={[
                    styles.courseRowTime,
                    global.user.secondaryTextColor (),
                  ]}
                >
                  {this.props.time}
                </Text>
                {this.props.id != '_'
                  ? <RightIcon
                      style={{marginTop: 3}}
                      size={30}
                      color="orange"
                    />
                  : <View style={{marginRight: 30}} />}
              </View>
            </View>
          </View>
        </Touchable>
      );
    }
  }
}

export default class LinksScreenTile extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      refreshing: false,
    }
  }
  _navigateToPage = async (page, id) => {
    try {
      global.courseInfoCourse = await Courses._retrieveCourseById (id);
      global.courseInfoPage = 'assignments';
      if (global.courseInfoCourse.id != '_') {
        this.props.navigation.navigate (page);
      }
    } catch (e) {
      console.log (e);
    }
  };
  _onRefresh = () => {
    this.setState ({refreshing: true});
    // this.props.navigation.replace("Home");
    setTimeout (() => {
      this.props.parent.setState (
        {currentDate: new Date (2019, 10, 8, 12, 30)},
        () => {
          this.setState ({refreshing: false});
        }
      );
    }, 400);
  };

  _navigateToPage = async (page, id) => {
    global.courseInfoCourse = await Courses._retrieveCourseById (id);
    if (global.courseInfoCourse.id != '_') {
      this.props.parent.props.navigation.navigate (page);
    }
  };
  render () {
    return (
      <ScrollView
        style={[styles.scrollBack, global.user.primaryTheme ()]}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
      >
        <View style={[styles.titleBlock, global.user.borderColor ()]}>
          <Text
            style={[styles.h1, {color: global.user.getPrimaryTextColor ()}]}
          >
            Today
          </Text>
        </View>
        <DayList
          courses={this.props.courseList}
          _navigateToPage={this._navigateToPage}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create ({
  titleBlock: {
    width: width,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingTop: 20,
    paddingLeft: 10,
    paddingBottom: 0,
    paddingRight: 10,
  },
  h1: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  scrollBack: {
    backgroundColor: '#f0f0f0',
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
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    marginTop: 10,
  },
});
