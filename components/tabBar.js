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

import { LinearGradient } from 'expo-linear-gradient';

import {HomeIcon, CoursesIcon, ScheduleIcon, CalendarIcon} from "../classes/icons";

import { boxShadows } from '../constants/boxShadows';

import { ifIphoneX } from 'react-native-iphone-x-helper';

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

class TabButton extends React.Component {
    handleClick = () => {
        this.props.self.setState({selectedIndex: this.props.index});
        this.props.tapFunction._scrollMain.scrollTo({x: width*this.props.index, y: 0, animated: true})
    }
    render() {
        if (this.props.selected) {
            return (
                <TouchableWithoutFeedback onPress={this.handleClick}>
                <View style={[styles.tabButton, styles.selectedTabButton, boxShadows.boxShadow7]}>
                    <View style={styles.tabBarIcon}>
                        {[<ScheduleIcon></ScheduleIcon>, <HomeIcon></HomeIcon>, <CoursesIcon></CoursesIcon>][["Schedule", "Home", "Courses"].indexOf(this.props.title)] || <HomeIcon></HomeIcon>}
                    </View>
                    <Text style={styles.tabButtonText}>
                        {this.props.title}
                    </Text>
                </View>
                </TouchableWithoutFeedback>
            )
        } else {
            return (
                <TouchableWithoutFeedback onPress={this.handleClick}>
                <View style={[styles.tabButton]}>
                    <View style={styles.tabBarIcon}>
                    {[<ScheduleIcon></ScheduleIcon>, <HomeIcon></HomeIcon>, <CoursesIcon></CoursesIcon>][["Schedule", "Home", "Courses"].indexOf(this.props.title)] || <HomeIcon></HomeIcon>}
                    </View>
                    <Text style={styles.tabButtonText}>
                        {this.props.title}
                    </Text>
                </View>
                </TouchableWithoutFeedback>
            )
        }
    }
}

class TabBarButtons extends React.Component {
    render() {
        let list = this.props.tabs || [];
        let tabs = [];
        for (var i = 0; i < list.length; i++) {
            tabs.push(
                <TabButton index={i} selected={i==this.props.selectedIndex} key={"tabButton_" + i.toString()} title={list[i]} index={i} tapFunction={this.props.tapFunction} self={this.props.self}></TabButton>
            )
        }
        return (
            <View style={styles.tabBarButtons}>
                {tabs}
            </View>
        )
    }
}
export default class TabBar extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
        selectedIndex: 0,
        }
    }
    render() {
        return (
        <View style={[{width: width, ...ifIphoneX({height: 60}, {height: 45}), zIndex: 5}, boxShadows.boxShadow7]}>
            <LinearGradient start={{x: 0, y: 0}} end={{x:1, y:0}} style={[{width: width, ...ifIphoneX({height: 60}, {height: 45})}]} colors={["rgb(0,153,153)", ", rgb(0,130,209)"]}>
                <TabBarButtons selectedIndex={this.state.selectedIndex} tabs={["Home", "Courses", "Schedule", "Calendar"]} tapFunction={this.props.tapFunction} self={this}>

                </TabBarButtons>
            </LinearGradient>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: "row",
    },
    tabBarButtons: {
        flexDirection: "row",
        height: "100%",
    },
    tabButton: {
        width: "33.33%",
        height: "100%",
        ...ifIphoneX({
            height: 60,
            paddingBottom: 15,
        },{
            height: 45,
        }),
        flexDirection: "column",
        justifyContent: "center",
    },
    selectedTabButton: {
      backgroundColor: "rgba(255,255,255,0.4)",
    },  
    tabButtonText: {
        width: "100%",
        textAlign: "center",
        color: "white",
    },
    tabBarIcon: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "center",
    }
});