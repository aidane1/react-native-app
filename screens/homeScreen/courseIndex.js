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

import { WebBrowser, LinearGradient } from 'expo';
import { Ionicons } from '@expo/vector-icons';

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

class CourseIcon extends React.Component {
  render() {
    return (
      <View style={[styles.icon, {backgroundColor: "#ffaaaa"}]}>
        <Ionicons name={this.props.icon} size={20} color="black" />
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
        <CourseRow last={i==list.length-1} key={"courseRow_" + i.toString()} {...list[i]}></CourseRow>
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
    if (this.props.last) {
      return (
        <View style={[styles.courseRow]}>
          <CourseIcon icon="ios-beaker"></CourseIcon>
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
      )
    } else {
      return (
        <View style={styles.courseRow}>
          <CourseIcon icon="ios-beaker"></CourseIcon>
          <View style={styles.courseRowInfo}>
            <View style={styles.courseRowStack}>
              <View>
                <Text style={styles.courseRowCourse}>
                  {this.props.course.course}
                </Text>
              </View>
              <View>
                <Text style={styles.courseRowTeacher}>
                  {this.props.course.teacher}
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
      )
    }
  }
}

export default class LinksScreenTile extends React.Component {
  static navigationOptions = {
    title: 'Courses',
  };

  render() {
    return (
      <ScrollView style={styles.scrollBack}  bounces={false}>
        <View style={styles.titleBlock}>
          <Text style={styles.h1}>
            Today
          </Text>
        </View>
        <DayList courses={this.props.courseList}></DayList>
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
