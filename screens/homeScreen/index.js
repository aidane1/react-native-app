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

import HeaderBar from "../../components/header";

import HomeScreenTile from "./homeIndex";

import LinkScreenTile from "./courseIndex";

import ScheduleScreenTile from "./scheduleIndex";

import TabBar from "../../components/tabBar";

import Touchable from 'react-native-platform-touchable';

import { AccountIcon, EmptyIcon, RefreshIcon } from "../../classes/icons";

import {Assignment, Assignments } from "../../classes/assignments";

import {Note, Notes } from "../../classes/notes";

import {Topic, Topics } from "../../classes/topics";

import ApexAPI from "../../http/api";

import { ifIphoneX } from 'react-native-iphone-x-helper'


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
    this.state = {
      currentDate: new Date(2019, 10, 8, 9, 10),
    }
    // let currentDate = new Date();
  }

  componentDidMount() {
    let api = new ApexAPI({"x-api-key": global.user["x-api-key"], "school": global.user["school"], "x-id-key": global.user["x-id-key"]});
    if (global.user.courses.length) {
      api.get(`topics?reference_course=${global.user.courses.join(",")}`)
        .then(res => res.json())
        .then(async data => {
          if (data.status == "ok") {
            await Topics._saveToStorage(data.body.map(topic => {
              return {
                topic: topic.topic,
                course: topic.reference_course,
                id: topic._id,
              }
            }));
            global.topics = await Topics._retrieveFromStorage();
          }
        })
        .catch(e => {
          console.log(e);
        })
      api.get(`assignments?populate=resources,response_resources&reference_course=${global.user.courses.join(",")}`)
        .then(res => res.json())
        .then(async data => {
          if (data.status == "ok") {
            await Assignments._saveToStorage(data.body.map(assignment => {
              return {
                topic: assignment.topic || "_",
                id: assignment._id,
                assignmentTitle: assignment.assignment_title,
                assignmentNotes: assignment.assignment_notes,
                dueDate: assignment.due_date,
                date: assignment.date,
                referenceCourse: assignment.reference_course,
                resources: assignment.resources || [],
                responseResources: assignment.response_resources || [],
              }
            }));
            global.assignments = await Assignments._retrieveFromStorage();
          }
        })
        .catch(e => {
          console.log(e);
        });
      api.get(`notes?populate=resources&reference_course=${global.user.courses.join(",")}`)
      .then(res => res.json())
      .then(async data => {
        if (data.status == "ok") {
          await Notes._saveToStorage(data.body.map(note => {
            return {
              topic: note.topic || "_",
              id: note._id,
              note: note.note,
              date: note.date,
              referenceCourse: note.reference_course,
              resources: note.resources || [],
            }
          }));
          global.notes = await Notes._retrieveFromStorage();
        }
      })
      .catch(e => {
        console.log(e);
      });
    }
  }
  render() {
    let { currentDate } = this.state;
    let currentSemesters = global.semesters.filter(semester => {
      return (semester.startDate.getTime() <= currentDate.getTime() && semester.endDate.getTime() >= currentDate.getTime());
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
    let courseList = [];
    if (todaySchedule !== undefined && todaySchedule.length > 0) {
      let blockCount = 0;
      for (var i = 0; i < todaySchedule.length; i++) {
        let currentStartBlock = todayTimes[blockCount];
        let currentEndBlock = todayTimes[blockCount+todaySchedule[i].block_span-1];
        let currentTime = {start_hour: currentStartBlock.start_hour, start_minute: currentStartBlock.start_minute, end_hour: currentEndBlock.end_hour, end_minute: currentEndBlock.end_minute};
        courseList.push({time_num:currentTime, course: courseMap[todaySchedule[i].block].course, category: courseMap[todaySchedule[i].block].category, teacher: courseMap[todaySchedule[i].block].teacher, time: formatTime(currentTime), id: courseMap[todaySchedule[i].block].id, isReal: false});
        blockCount += todaySchedule[i].block_span;
      }
    } else {
      courseList.push({course: "Nothing!", teacher: "Free", time: "All Day", category: "other", id: "_", isReal: false});
    }
    
    
    
    
    // string
    let dayTitle = "Off!";
    // {title, main, secondary}
    let current = {title: "Current", main: "Nothing!", secondary: "Now"};
    // {title, main, secondary}
    let next = {title: "Next", main: "Nothing!", secondary: "Now"};

    let foundCurrent = false;
    for (var i = 0; i < courseList.length; i++) {
      if (!foundCurrent && (courseList[i].time_num.end_hour*60 + courseList[i].time_num.end_minute >= currentDate.getHours()*60 + currentDate.getMinutes())) {
        let beforeStart = false;
        if ((courseList[i].time_num.start_hour*60 + courseList[i].time_num.start_minute <= currentDate.getHours()*60 + currentDate.getMinutes())) {
          current = {title: "Current", main: courseList[i].course, secondary: courseList[i].time};
        } else {
          beforeStart = true;
        }
        if (i != courseList.length-1) {
          if (beforeStart) {
            next = {title: "Next", main: courseList[i].course, secondary: courseList[i].time}
          } else {
            next = {title: "Next", main: courseList[i+1].course, secondary: courseList[i+1].time}
          }
        }
        foundCurrent = true;
      }
    }

    //[{date, time, info}]
    let events = [{date: "today", time: "today", info: "No Events!"}];
    // {date: {scheduleWeek, scheduleDay, events, dayDisplayed}}
    // this.calendar = this.dayMap;
    let assignments = Object.keys(courseMap).filter(block => {
      let courseAssignments = Assignments._retrieveAssignmentsByCourse(global.assignments, courseMap[block].id);
      return courseAssignments.length > 0;
    }).map(block => {
      if (courseMap[block].id != "_") {
        let courseAssignments = Assignments._retrieveAssignmentsByCourse(global.assignments, courseMap[block].id).sort((a, b) => {
          return a.date.getTime() > b.date.getTime() ? -1 : 1
        })
        let topicsList = Topics._MakeCourseTopicList(courseMap[block].id, global.topics);
        let topicsMap = Topics._makeTopicMap(topicsList);
        courseAssignments[0].topic = topicsMap[courseAssignments[0].topic].topic;
        return courseAssignments[0];
      }
    })
    if (assignments.length == 0) {
      assignments = [{assignmentTitle: "No Assignments!", dueDate: "today", topic: "No Topic", referenceCourse: "_"}]
    }
    return (
      <View style={styles.container}>
        <HeaderBar iconLeft={<Touchable onPress={() => this.props.navigation.navigate('Account')}><AccountIcon size={28} style={{paddingLeft: 10, paddingRight: 10, paddingTop: 10}}></AccountIcon></Touchable>} iconRight={<Touchable onPress={() => this.props.navigation.replace("Home")}><RefreshIcon size={28} style={{paddingLeft: 10, paddingRight: 10, paddingTop: 10}}></RefreshIcon></Touchable>} width={width} height={60} title="Home"></HeaderBar>
        <View style={styles.bodyHolder}>
          <ScrollView horizontal={true} style={styles.slideView} scrollEnabled={false}  ref={(component) => {this._scrollMain = component}}>
            <View style={styles.bodySlide}>
              <HomeScreenTile assignments={assignments} dayTitle={dayTitle} current={current} next={next} parent={this} events={events}></HomeScreenTile>
            </View>
            <View style={styles.bodySlide}>
              <LinkScreenTile navigation={this.props.navigation} courseList={courseList}></LinkScreenTile>
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
    ...ifIphoneX({
      height: height-80-60
    }, {
      height: height-60-45,
    }),
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
