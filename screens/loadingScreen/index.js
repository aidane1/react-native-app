import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  Image
} from 'react-native';

import {AppLoading} from "expo";

// import {Asset} from "react-native-unimodules";

import { Course, Courses } from "../../classes/courses";

import { Event, Events } from "../../classes/events";

import { Semester, Semesters } from "../../classes/semesters";

import { Assignment, Assignments } from "../../classes/assignments";

import { School } from "../../classes/school";

import { User } from "../../classes/user";

import { Day, Days } from "../../classes/days";

import { AsyncStorage } from "react-native";

import {StackActions, NavigationActions} from 'react-navigation';    

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

// function cacheImages(images) {
//     return images.map(image => {
//         if (typeof image === 'string') {
//             return Image.prefetch(image);
//         } else {
//             return Asset.fromModule(image).downloadAsync();
//         }
//     });
// }

// function cacheFonts(fonts) {
//     return fonts.map(font => Font.loadAsync(font));
// }

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
                let currentSemesters = await Semesters._currentSemesters();
                let userCourses = await Courses._retrieveCoursesById(user.courses);
                let allAssignments = await Assignments._retrieveFromStorage();
                // console.log(userCourses);
                let allCourses = await Courses._retrieveFromStorage();
                let allSemesters = await Semesters._retrieveFromStorage();
                let school = await School._retrieveFromStorage();
                let semesterMap = await Semesters._createSemesterMap(userCourses, school.blocks);
                let dayMap = await Days._retrieveFromStorage();
                let dates = await Semesters._startAndEndDate();
                let events = await Events._retrieveFromStorage();
                let currentCourseMap = await Semesters._createCoursesOnDate(userCourses, school.blocks, currentSemesters);
                //set global props
                global.user = user;
                global.assignments = allAssignments;
                // global.currentSemesters = currentSemesters;
                // global.userCourses = userCourses;
                global.semesterMap = semesterMap;
                global.dayMap = school["dayMap"];
                global.school = school;
                global.dates = dates;
                global.courseInfoCourse = "_";
                // global.currentCourseMap = currentCourseMap;
                global.courses = allCourses;
                global.semesters = allSemesters;
                //end global props

                //re-doing everything slowly to work better
                    // global.courses = allCourses;
                // just the users courses
                global.userCourseMap = {};
                // courses related to all available blocks
                global.blocksCourseMap = {};
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'Home' })],
                });
                // this.props.navigation.dispatch(resetAction);
            }
        } catch(e) {
            console.log(e);
            this.props.navigation.replace("Login");
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Image source={require("../../assets/splash.png")} style={{width, height}}></Image>
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