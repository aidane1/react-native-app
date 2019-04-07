import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator
} from 'react-native';

import { Course, Courses } from "../../classes/courses";

import { Event, Events } from "../../classes/events";

import { Semester, Semesters } from "../../classes/semesters";

import { School } from "../../classes/school";

import { User } from "../../classes/user";

import { Day, Days } from "../../classes/days";

import { AsyncStorage } from "react-native";

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

export default class LoadingScreen extends React.Component {
    static navigationOptions = {
        header: null,
    }
    async componentDidMount() {
        try {
            let loggedIn = await User._isLoggedIn();
            if (!loggedIn) {
                this.props.navigation.navigate("Login");
            } else {
                let user = await User._retrieveFromStorage();
                let currentSemesters = Semesters._currentSemesters();
                let userCourses = await Courses._retrieveCoursesById(user.courses);
                let allCourses = Courses._retrieveFromStorage();
                let allSemesters = Semesters._retrieveFromStorage();
                let school = await School._retrieveFromStorage();
                let semesterMap = Semesters._createSemesterMap(userCourses, school.blockNames);
                let dayMap = Days._retrieveFromStorage();
                let dates = Semesters._startAndEndDate();
                [currentSemesters, semesterMap, dayMap, dates, allCourses, allSemesters] = await Promise.all([currentSemesters, semesterMap, dayMap, dates, allCourses, allSemesters]);
                let currentCourseMap = await Semesters._createCoursesOnDate(userCourses, school.blockNames, currentSemesters);
                //set global props
                global.user = user;
                global.currentSemesters = currentSemesters;
                global.userCourses = userCourses;
                global.semesterMap = semesterMap;
                global.dayMap = dayMap;
                global.school = school;
                global.dates = dates;
                global.currentCourseMap = currentCourseMap;
                global.courses = allCourses;
                global.semesters = allSemesters;
                //end global props

                this.props.navigation.replace("Home");
            }
        } catch(e) {
            console.log(e);
            this.props.navigation.replace("Login");
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )
    }
}



const styles = StyleSheet.create({
    container: {
        width: width,
        flexGrow: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    }
});