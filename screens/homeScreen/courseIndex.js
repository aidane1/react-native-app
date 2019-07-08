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
  AsyncStorage
} from 'react-native';

import Touchable from 'react-native-platform-touchable';

import { Course, Courses } from "../../classes/courses";

import { WebBrowser, LinearGradient } from 'expo';

import { Ionicons } from '@expo/vector-icons';

import { SchoolIcons, GenericIcon } from "../../classes/icons";

import { boxShadows } from "../../constants/boxShadows";

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

class CourseIcon extends React.Component {
  render() {
      return (
          <View style={[styles.icon, {backgroundColor: this.props.color}, boxShadows.boxShadow2]}>
              {this.props.children}
          </View>
      )
  }
}

class DayList extends React.Component {
  render() {
    let list = this.props.courses || [];
    let rowLists = [];
    for (var i = 0; i < list.length; i++) {
      rowLists.push(
        <CourseRow _navigateToPage={this.props._navigateToPage} last={i==list.length-1} key={"courseRow_" + i.toString()} {...list[i]}></CourseRow>
      )
    }
    return (
      <View style={styles.dayList}>
        {rowLists}
      </View>
    )
  }
}

class CourseRow extends React.Component {
  render() {
    let icon = SchoolIcons.getIcon(this.props.category);
    if (this.props.last) {
      return (
        <Touchable onPress={() => this.props.id != "_" ? this.props._navigateToPage("CourseInfo", this.props.id) : () => {}}>
          <View style={[styles.courseRow]}>
            <CourseIcon color={icon[1]}>
                <GenericIcon icon={icon[0]} color="black" size={20}></GenericIcon>
            </CourseIcon>
            <View style={[styles.courseRowInfo, {borderBottomColor: "rgba(0,0,0,0)"}]}>
              <View style={styles.courseRowStack}>
                <View>
                  <Text style={styles.courseRowCourse}>
                    {this.props.course}
                  </Text>
                </View>
                <View>
                  <Text style={styles.courseRowTeacher}>
                    {this.props.teacher}
                  </Text>
                </View>
              </View>
              <View>
                <Text style={styles.courseRowTime}>
                    {this.props.time}
                </Text>
              </View>
            </View>
          </View>
        </Touchable>
      )
    } else {
      return (
        <Touchable onPress={() => this.props.id != "_" ? this.props._navigateToPage("CourseInfo", this.props.id) : () => {}}>
          <View style={[styles.courseRow]}>
            <CourseIcon color={icon[1]}>
                <GenericIcon icon={icon[0]} color="black" size={20}></GenericIcon>
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
                    {this.props.teacher}
                  </Text>
                </View>
              </View>
              <View>
                <Text style={styles.courseRowTime}>
                    {this.props.time}
                </Text>
              </View>
            </View>
          </View>
        </Touchable>
      )
    }
  }
}

export default class LinksScreenTile extends React.Component {
  constructor(props)  {
    super(props);

  }
  _navigateToPage = async (page, id) => {
      globalThis.courseInfoCourse = await Courses._retrieveCourseById(id);
      this.props.navigation.navigate(page);
  }
  render() {
    return (
      <ScrollView style={styles.scrollBack}  bounces={false}>
        <View style={styles.titleBlock}>
          <Text style={styles.h1}>
            Today
          </Text>
        </View>
        <DayList courses={this.props.courseList} _navigateToPage={this._navigateToPage}></DayList>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  titleBlock: {
    width: width,
    borderBottomColor: "#000000",
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
    backgroundColor: "#f0f0f0",
  },
  courseRow: {
    alignItems: 'center',
    flexDirection: 'row',
    width: width,
    height: 50.0,
    backgroundColor: "white",
  },
  courseRowInfo: {
    height: 50.0,
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center',
    borderBottomColor: "rgb(210,210,210)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingRight: 10
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
    fontStyle: "italic",
    opacity: 0.7,
  },
  courseRowTime: {
    fontSize: 17,
  },
  dayList: {
    borderBottomColor: "rgb(210,210,210)",
    borderBottomWidth: StyleSheet.hairlineWidth*2,
    borderTopColor: "rgb(210,210,210)",
    borderTopWidth: StyleSheet.hairlineWidth*2,
    marginTop: 10
  }
});
