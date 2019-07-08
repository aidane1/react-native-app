import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Dimensions,
  AsyncStorage,
  Button
} from 'react-native';

import { LinearGradient } from 'expo';

import HeaderBar from "../../components/header";

import HomeScreenTile from "./homeIndex";

import LinkScreenTile from "./courseIndex";

import ScheduleScreenTile from "./scheduleIndex";

import TabBar from "../../components/tabBar";

import Touchable from 'react-native-platform-touchable';

import { AccountIcon, EmptyIcon, RefreshIcon } from "../../classes/icons";

import {Assignment, Assignments } from "../../classes/assignments";

import ApexAPI from "../../http/api";



const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height


function formatUnit(hour, minute) {
  return `${(hour+11) % 12 + 1}:${minute.toString().length == 1 ? "0"+minute.toString() : minute}`;
}
function formatTime(time) {
  return `${formatUnit(time.start_hour, time.start_minute)} - ${formatUnit(time.end_hour, time.end_minute)}`;
}


export default class HomeScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    }
  }
  constructor(props) {
    super(props);
    this.props = props;
    this.dayMap = global.dayMap || {};
    // this.semesterMap = global.semesterMap || {};
    // this.school = global.school || {};
    // this.currentSemesters = global.currentSemesters || [];
    this.schedule = global.school.schedule || [];
    // this.dates = global.dates || {startDate: new Date(), newDate: new Date()};
    // this.currentCourses = global.currentCourseMap || {};
    //these will hold the value of the items that will be displayed. they will be programically updated before the
    //widget is rendered. It makes the rendering code cleaner


    let currentDate = new Date(2019, 10, 8);
    // let currentDate = new Date();

    let currentSemesters = global.semesters.filter(semester => {
      // return (semester.startDate.getTime() <= currentDate.getTime() && semester.endDate.getTime() >= currentDate.getTime());
      return true;
    }).map(semester => {
      return semester.id;
    });
    let courseMap = {};
    for (var i = 0; i < currentSemesters.length; i++) {
      for (var key in global.semesterMap[currentSemesters[i]]) {
        if (courseMap[key] == undefined || global.semesterMap[currentSemesters[i]][key].isReal) {
          courseMap[key] = global.semesterMap[currentSemesters[i]][key];
        }
      }
    }
    
    let today = this.dayMap[`${currentDate.getFullYear()}_${currentDate.getMonth()}_${currentDate.getDate()}`];

    let todaySchedule = today !== undefined ? global.school.rawSchedule["day_blocks"][today.week][today.day] : [];
    let todayTimes = today !== undefined ? global.school.rawSchedule["block_times"] : [];

    // [{course, teacher, time, id, isReal}]
    this.courseList = [];
    if (todaySchedule !== undefined && todaySchedule.length > 0) {
      let blockCount = 0;
      for (var i = 0; i < todaySchedule.length; i++) {
        let currentStartBlock = todayTimes[blockCount];
        let currentEndBlock = todayTimes[blockCount+todaySchedule[i].block_span-1];
        let currentTime = {start_hour: currentStartBlock.start_hour, start_minute: currentStartBlock.start_minute, end_hour: currentEndBlock.end_hour, end_minute: currentEndBlock.end_minute};
        this.courseList.push({course: courseMap[todaySchedule[i].block].course, category: courseMap[todaySchedule[i].block].category, teacher: courseMap[todaySchedule[i].block].teacher, time: formatTime(currentTime), id: courseMap[todaySchedule[i].block].id, isReal: false});
        blockCount += todaySchedule[i].block_span;
      }
    } else {
      this.courseList.push({course: "Nothing!", teacher: "Free", time: "All Day", category: "other", id: "_", isReal: false});
    }
    
    
    
    
    // string
    this.dayTitle = "Off!";
    // {title, main, secondary}
    this.current = {title: "Current", main: "Nothing!", secondary: "Now"};
    // {title, main, secondary}
    this.next = {title: "Next", main: "Nothing!", secondary: "Now"};
    //[{date, time, info}]
    this.events = [{date: "today", time: "today", info: "No Events!"}];
    // {date: {scheduleWeek, scheduleDay, events, dayDisplayed}}
    // this.calendar = this.dayMap;
  }

  componentDidMount() {
    let api = new ApexAPI({"x-api-key": global.user["x-api-key"], "school": global.user["school"], "x-id-key": global.user["x-id-key"]});
    if (global.user.courses.length) {
      api.get(`assignments?populate=resources,topic&reference_course=${global.user.courses.join(",")}`)
        .then(res => res.json())
        .then(data => {
          if (data.status == "ok") {
            Assignments._saveToStorage(data.body.map(assignment => {
              return {
                topic: assignment.topic || "_",
                id: assignment._id,
                assignmentTitle: assignment.assignment_title,
                assignmentNotes: assignment.assignment_notes,
                dueDate: assignment.due_date,
                date: assignment.date,
                referenceCourse: assignment.reference_course,
                resources: assignment.resources
              }
            }));
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
    
  }
  render() {
    return (
      <View style={styles.container}>
        <HeaderBar iconLeft={<Touchable onPress={() => this.props.navigation.navigate('Account')}><AccountIcon size={28} style={{paddingLeft: 10, paddingRight: 10, paddingTop: 10}}></AccountIcon></Touchable>} iconRight={<Touchable onPress={() => this.props.navigation.replace("Home")}><RefreshIcon size={28} style={{paddingLeft: 10, paddingRight: 10, paddingTop: 10}}></RefreshIcon></Touchable>} width={width} height={60} title="Home"></HeaderBar>
        <View style={styles.bodyHolder}>
          <ScrollView horizontal={true} style={styles.slideView} scrollEnabled={false}  ref={(component) => {this._scrollMain = component}}>
            <View style={styles.bodySlide}>
              <HomeScreenTile dayTitle={this.dayTitle} current={this.current} next={this.next} events={this.events}></HomeScreenTile>
            </View>
            <View style={styles.bodySlide}>
              <LinkScreenTile navigation={this.props.navigation} courseList={this.courseList}></LinkScreenTile>
            </View>
            <View style={styles.bodySlide}>
              <ScheduleScreenTile></ScheduleScreenTile>
            </View>
            {/* <View style={styles.bodySlide}>
              <CalendarScreenTile dayTitles={this.school.dayTitles} dates={this.dates}></CalendarScreenTile>
            </View> */}
          </ScrollView>
        </View>
        <TabBar tapFunction={this}></TabBar>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    flexGrow: 1,
    flexDirection: 'column'
  }, 
  bodyHolder: {
    height: height-60-45,
    zIndex: 1,
  },
  slideView: {
    width: width,
  },  
  bodySlide: {
    width: width,
    flexGrow: 1,
  },
  scrollBack: {
    width: width,
    backgroundColor: "#f0f0f0",
  }
});
