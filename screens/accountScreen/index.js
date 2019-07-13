import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Text
} from 'react-native';

import HeaderBar from "../../components/header";

import { LeftIcon, CalendarIcon, RightIcon, EmptyIcon, CourseIcon, EventsIcon, LogoutIcon, NotesIcon, AssignmentsIcon, SchoolAssignmentsIcon, BeforeSchoolIcon, LunchTimeIcon, AfterSchoolIcon } from "../../classes/icons";

import { ScrollView } from 'react-native-gesture-handler';

import { boxShadows } from "../../constants/boxShadows";

import Touchable from 'react-native-platform-touchable';

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

class CourseIconBlock extends React.Component {
    render() {
        return (
            <View style={[styles.icon, boxShadows.boxShadow2, {backgroundColor: this.props.color || "#ffaaaa"}]}>
                {this.props.children}
            </View>
        )
    }
}


class CourseRow extends React.Component {
    render() {
        if (this.props.last) {
            return (
                <Touchable onPress={this.props.onPress}>
                    <View style={[styles.courseRow]}>
                        <CourseIconBlock color={this.props.color}>
                            {this.props.icon}
                        </CourseIconBlock>
                        <View style={[styles.courseRowInfo, {borderBottomColor: "rgba(0,0,0,0)"}]}>
                            <Text style={styles.courseRowText}>
                                {this.props.text}         
                            </Text>
                            <RightIcon style={styles.clickIcon} size={30} color="orange" />
                        </View>
                    </View>
                </Touchable>
            )
        } else {
            return (
                <Touchable onPress={this.props.onPress}>
                    <View style={[styles.courseRow]}>
                        <CourseIconBlock color={this.props.color}>
                            {this.props.icon}
                        </CourseIconBlock>
                        <View style={[styles.courseRowInfo]}>
                            <Text style={styles.courseRowText}>
                                {this.props.text}         
                            </Text>
                            <RightIcon style={styles.clickIcon} size={30} color="orange" />
                        </View>
                    </View>
                </Touchable>
            )
        }
    }
}

class ButtonSection extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }
    render() {
        return (
            <View style={[styles.buttonSection]}>
                {this.props.children}
            </View>
        )
    }
}

export default class AccountScreen extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }
    _navigateToPage = (page) => {
        this.props.navigation.navigate(page);
    }
    static navigationOptions = ({navigation}) => {
        return {
            header: null,
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <HeaderBar iconLeft={<Touchable onPress={() => this.props.navigation.goBack()}><LeftIcon size={28}></LeftIcon></Touchable>} iconRight={<EmptyIcon width={28} height={32}></EmptyIcon>} width={width} height={60} title="Account"></HeaderBar>
                <View style={styles.bodyHolder}>
                    <ScrollView>
                        <ButtonSection>
                            <CourseRow color={"#ef8b8b"} icon={<CourseIcon size={20} color={"black"}></CourseIcon>} text={"Courses"} last={false} onPress={() => this._navigateToPage("Courses")}></CourseRow>
                            <CourseRow color={"#f2cc98"} icon={<EventsIcon size={20} color={"black"}></EventsIcon>} text={"Events"} last={false} onPress={() => this._navigateToPage("Events")}></CourseRow>
                            <CourseRow color={"#ffffad"} icon={<LogoutIcon size={20} color={"black"}></LogoutIcon>} text={"Login"} last={true} onPress={() => this._navigateToPage("Login")}></CourseRow>
                        </ButtonSection>
                        <ButtonSection>
                            <CourseRow color={"#fffec9"} icon={<CalendarIcon size={20} color={"black"}></CalendarIcon>} text={"Calendar"} last={false} onPress={() => this._navigateToPage("Calendar")}></CourseRow>
                            <CourseRow color={"#afffad"} icon={<NotesIcon size={20} color={"black"}></NotesIcon>} text={"Notes"} last={false} onPress={() => this._navigateToPage("Notes")}></CourseRow>
                            <CourseRow color={"#b1f9ed"} icon={<AssignmentsIcon size={20} color={"black"}></AssignmentsIcon>} text={"Assignments"} last={true}></CourseRow>
                        </ButtonSection>
                        <ButtonSection>
                            <CourseRow color={"#b1d7f9"} icon={<SchoolAssignmentsIcon size={20} color={"black"}></SchoolAssignmentsIcon>} text={"School Assignments"} last={true}></CourseRow>
                        </ButtonSection>
                        <ButtonSection>
                            <CourseRow color={"#b2b1f9"} icon={<BeforeSchoolIcon size={20} color={"black"}></BeforeSchoolIcon>} text={"Before School Activities"} last={false}></CourseRow>
                            <CourseRow color={"#d7b1f9"} icon={<LunchTimeIcon size={20} color={"black"}></LunchTimeIcon>} text={"Lunchtime Activities"} last={false}></CourseRow>
                            <CourseRow color={"#f6b1f9"} icon={<AfterSchoolIcon size={20} color={"black"}></AfterSchoolIcon>} text={"After School Activities"} last={true}></CourseRow>
                        </ButtonSection>
                    </ScrollView>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width,
        flexGrow: 1,
        backgroundColor: "#f0f0f0"
    },
    bodyHolder: {
        zIndex: 1,
        flexGrow: 1,
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
    icon: {
        width: 35,
        height: 35,
        margin: 7.5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        paddingTop: 3,
        paddingLeft: 2,
    },
    courseRowText: {
        fontSize: 20,
        color: "#444",
        fontWeight: "300"
    },
    buttonSection: {
        marginTop: 20,
        borderColor: "rgb(210,210,210)",
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    clickIcon: {
        flexDirection: "row",
        justifyContent: "center",
        paddingTop: 5,
    }
})