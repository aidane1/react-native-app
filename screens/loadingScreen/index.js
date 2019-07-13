import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  Image
} from 'react-native';

// import {AppLoading} from "expo";

import * as Font from "expo-font";

import { Asset } from "expo-asset";

import { Course, Courses } from "../../classes/courses";

import { Event, Events } from "../../classes/events";

import { Semester, Semesters } from "../../classes/semesters";

import { Assignment, Assignments } from "../../classes/assignments";

import { Note, Notes } from "../../classes/notes";

import { School } from "../../classes/school";

import { User } from "../../classes/user";

import { Day, Days } from "../../classes/days";

import { AsyncStorage } from "react-native";

import { Topic, Topics } from "../../classes/topics";

import {StackActions, NavigationActions} from 'react-navigation';

import { Ionicons, Entypo, AntDesign, FontAwesome, MaterialIcons, Feather, MaterialCommunityIcons} from '@expo/vector-icons';

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

function cacheImages(images) {
    return images.map(image => {
        if (typeof image === 'string') {
            return Image.prefetch(image);
        } else {
            return Asset.fromModule(image).downloadAsync();
        }
    });
}

function cacheFonts(fonts) {
    return fonts.map(font => Font.loadAsync(font));
}


export default class LoadingScreen extends React.Component {
    constructor(props) {
        super(props);
    }
    static navigationOptions = {
        header: null,
    }
    async _loadAssetsAsync() {
        const imageAssets = cacheImages([
            require("../../assets/logo_transparent.png"),
            require("../../assets/splash.png"),
        ]);
        const fontAssets = cacheFonts([FontAwesome.font, Ionicons.font, Entypo.font, AntDesign.font, MaterialCommunityIcons.font, MaterialIcons.font, Feather.font]);
        await Promise.all([...imageAssets, ...fontAssets]);
        return true;
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
                let completedAssignments = await Assignments._retrieveCompletedFromStorage();
                let allNotes = await Notes._retrieveFromStorage();
                let allCourses = await Courses._retrieveFromStorage();
                let allSemesters = await Semesters._retrieveFromStorage();
                let school = await School._retrieveFromStorage();
                let semesterMap = await Semesters._createSemesterMap(userCourses, school.blocks);
                let dayMap = await Days._retrieveFromStorage();
                let dates = await Semesters._startAndEndDate();
                let events = await Events._retrieveFromStorage();
                let allTopics = await Topics._retrieveFromStorage();
                let currentCourseMap = await Semesters._createCoursesOnDate(userCourses, school.blocks, currentSemesters);
                global.user = user;
                global.assignments = allAssignments || [];
                global.notes = allNotes || [];
                global.completedAssignments = completedAssignments;
                global.semesterMap = semesterMap;
                global.dayMap = school["dayMap"];
                global.school = school;
                global.dates = dates;
                global.courseInfoCourse = "_";
                global.courses = allCourses;
                global.topics = allTopics;
                global.semesters = allSemesters;
                global.userCourseMap = {};
                global.blocksCourseMap = {};
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'Home' })],
                });
                await this._loadAssetsAsync();
                this.props.navigation.dispatch(resetAction);
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