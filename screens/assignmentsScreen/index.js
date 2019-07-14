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

import {ScrollView} from 'react-native-gesture-handler';

import {
  LeftIcon,
  RightIcon,
  EmptyIcon,
  SchoolIcons,
  GenericIcon,
} from '../../classes/icons';

import {Courses} from "../../classes/courses";

import {boxShadows} from '../../constants/boxShadows';

import Touchable from 'react-native-platform-touchable';

import {Day} from '../../classes/days';

import {ifIphoneX} from 'react-native-iphone-x-helper';

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
      <View style={styles.dayList}>
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
          <View style={[styles.courseRow]}>
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
                  <Text style={styles.courseRowCourse}>
                    {this.props.course}
                  </Text>
                </View>
                <View>
                  <Text style={styles.courseRowTeacher}>
                    {this.props.semester}
                    ,
                    {' '}
                    {this.props.teacher}
                    , Block
                    {' '}
                    {this.props.block}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.courseRowTime}>
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
          <View style={[styles.courseRow]}>
            <CourseIcon color={icon[1]}>
              <GenericIcon icon={icon[0]} color="black" size={20} />
            </CourseIcon>
            <View style={[styles.courseRowInfo]}>
              <View style={styles.courseRowStack}>
                <View>
                  <Text style={styles.courseRowCourse}>
                    {this.props.course}
                  </Text>
                </View>
                <View>
                  <Text style={styles.courseRowTeacher}>
                    {this.props.semester}
                    ,
                    {' '}
                    {this.props.teacher}
                    , Block
                    {' '}
                    {this.props.block}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
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

export default class AssignmentsScreen extends React.Component {
  constructor (props) {
    super (props);
    this.props = props;
  }
  _navigateToPage = async (page, id) => {
    try {
      global.courseInfoCourse = await Courses._retrieveCourseById (id);
      global.courseInfoPage="assignments";
      if (global.courseInfoCourse.id != '_') {
        this.props.navigation.navigate (page);
      }
    } catch(e) {
      console.log(e);
    }
  };
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };
  render () {
    let semesters = {};
    global.semesters.forEach (semester => {
      semesters[semester.id] = semester;
    });
    let blocks = {};
    global.school.blocks.forEach (block => {
      blocks[block._id] = block;
    });
    let courseList = global.userCourses.map (course => {
      return {
        course: course.course,
        category: course.category,
        teacher: course.teacher,
        semester: semesters[course.semester].name,
        block: blocks[course.block].block,
        id: course.id,
        isReal: true,
      };
    });
    return (
      <View style={styles.container}>
        <HeaderBar
          iconLeft={
            <Touchable onPress={() => this.props.navigation.goBack ()}>
              <LeftIcon size={28} />
            </Touchable>
          }
          iconRight={<EmptyIcon width={28} height={32} />}
          width={width}
          height={60}
          title="Assignments"
        />
        <View style={styles.bodyHolder}>
          <ScrollView>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 30,
                fontWeight: '500',
                marginTop: 30,
                marginBottom: 10,
              }}
            >
              This Year's Classes
            </Text>
            <DayList
              _navigateToPage={this._navigateToPage}
              courses={courseList}
            />
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
    borderBottomColor: 'rgb(210,210,210)',
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderTopColor: 'rgb(210,210,210)',
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    marginTop: 10,
  },
});
