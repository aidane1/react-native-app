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

import CalendarScreenTile from "./calendarIndex";

import ScheduleScreenTile from "./scheduleIndex";

import TabBar from "../../components/tabBar";

import {AccountIcon, EmptyIcon} from "../../classes/icons";

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height


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
    this.semesterMap = global.semesterMap || {};
    this.school = global.school || {};
    this.currentSemesters = global.currentSemesters || [];
    this.schedule = this.school.schedule || [];
    this.dates = global.dates || {startDate: new Date(), newDate: new Date()};
    this.currentCourses = global.currentCourseMap || {};
    //these will hold the value of the items that will be displayed. they will be programically updated before the
    //widget is rendered. It makes the rendering code cleaner

    // string
    this.dayTitle = "Off!";
    // {title, main, secondary}
    this.current = {title: "Current", main: "Nothing!", secondary: "Now"};
    // {title, main, secondary}
    this.next = {title: "Next", main: "Nothing!", secondary: "Now"};
    //[{date, time, info}]
    this.events = [{date: "today", time: "today", info: "No Events!"}];
    // [{course, teacher, time, id, isReal}]
    this.courseList = [{course: "Snackshack 12", teacher: "Mr. Landry", time: "9:10 - 10:12", id: "_", isReal: true}];
    // {date: {scheduleWeek, scheduleDay, events, dayDisplayed}}
    this.calendar = this.dayMap;
  }
  render() {
    let currentDate = new Date();
    let today = this.dayMap[`${currentDate.getFullYear()}_${currentDate.getMonth()}_${currentDate.getDate()}`];

    return (
      <View style={styles.container}>
        <HeaderBar iconLeft={<TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Account')}><AccountIcon size={28}></AccountIcon></TouchableWithoutFeedback>} iconRight={<EmptyIcon width={28} height={32}></EmptyIcon>} width={width} height={60} title="Home"></HeaderBar>
        <View style={styles.bodyHolder}>
          <ScrollView horizontal={true} style={styles.slideView} scrollEnabled={false}  ref={(component) => {this._scrollMain = component}}>
            <View style={styles.bodySlide}>
              <HomeScreenTile dayTitle={this.dayTitle} current={this.current} next={this.next} events={this.events}></HomeScreenTile>
            </View>
            <View style={styles.bodySlide}>
              <LinkScreenTile courseList={this.courseList}></LinkScreenTile>
            </View>
            <View style={styles.bodySlide}>
              <ScheduleScreenTile blocks={this.school.blockNames} courses={this.currentCourses} schedule={this.school.schedule}></ScheduleScreenTile>
            </View>
            <View style={styles.bodySlide}>
              <CalendarScreenTile dates={this.dates} dayMap={this.calendar}></CalendarScreenTile>
            </View>
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
