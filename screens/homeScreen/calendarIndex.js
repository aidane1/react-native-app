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
  AsyncStorage,
  Button,
  FlatList
} from 'react-native';

import Modal from "react-native-modal";

import Touchable from 'react-native-platform-touchable';

import {boxShadows} from '../../constants/boxShadows';

// import { FlatList } from 'react-native-gesture-handler';

import moment from "moment";

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

function opacityColors( color ){
    //get the red of RGB from a hex value
    function hexToR(h) {return parseInt((cutHex( h )).substring( 0, 2 ), 16 )}

    //get the green of RGB from a hex value
    function hexToG(h) {return parseInt((cutHex( h )).substring( 2, 4 ), 16 )}

    //get the blue of RGB from a hex value
    function hexToB(h) {return parseInt((cutHex( h )).substring( 4, 6 ), 16 )}

    //cut the hex into pieces
    function cutHex(h) {if(h.charAt(1) == "x"){return h.substring( 2, 8 );} else {return h.substring(1,7);}}
    var red = 0, green = 0, blue = 0;
    colorArray=[color];
    for ( var i = 0; i < colorArray.length; i++ ){
        red += hexToR( "" + colorArray[ i ] + "" )**2;
        green += hexToG( "" + colorArray[ i ] + "" )**2;
        blue += hexToB( "" + colorArray[ i ] + "" )**2;
    }
    //Average RGB
    red = Math.round(Math.sqrt(red/colorArray.length));
    green = Math.round(Math.sqrt(green/colorArray.length));
    blue = Math.round(Math.sqrt(blue/colorArray.length));
    return ( "rgba("+ red +","+ green +","+ blue +",0.5)" );
}

function calculateCurrentCourses(semesters, semesterMap, date) {
    let currentDate = date;
    let currentSemesters = [];
    for (var i = 0; i < semesters.length; i++) {
        if (semesters[i].startDate.getTime() < currentDate.getTime() && semesters[i].endDate.getTime() > currentDate.getTime()) {
            currentSemesters.push(semesters[i]);
        }
    }
    let courses = {};
    for (var i = 0; i < currentSemesters.length; i++) {
        let currentSemester = semesterMap[currentSemesters[i].id];
        for (var key in currentSemester) {
            if (currentSemester[key].isReal || !courses[key]) {
                courses[key] = currentSemester[key];
            }
        }
    }
    return courses;
}

function makeSemesterCourseList(courseList, schedule) {
    let courses = [];
    for (var i = 0; i < schedule.length; i++) {
        if (courseList[schedule[i].block]) {
            courses.push({course: courseList[schedule[i].block], startTime: schedule[i].startHour*60+schedule[i].startMinute, endTime: schedule[i].endHour*60+schedule[i].endMinute});
        }
    }
    return courses;
}

class CalendarMonthTitle extends React.Component {
    render() {
        return (
            <View style={styles.calendarMonthTitle}>
                <View style={styles.bar} />
                <Text style={styles.monthTitle}>{this.props.month}</Text>
                <View style={styles.bar} />
            </View>
        )
    }
}

class CalendarMonth extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        this.calendarWeeks = [];
        let startDate = new Date(this.props.date.getFullYear(), this.props.date.getMonth(), 1);
        this.startDate = startDate;
        let currentDate = startDate;
        let endDate = new Date(this.props.date.getFullYear(), this.props.date.getMonth()+1, 0);
        let offset = startDate.getDay();
        let done = false;
        while (!done) {
            let currentWeek = [];
            for (var i = 0; i < 7; i++) {
                let currentDay = global.dayMap[`${currentDate.getFullYear()}_${currentDate.getMonth()}_${currentDate.getDate()}`];
                if (!currentDay) {
                    currentDay = {isInMonth: false};
                }
                currentDay.date = currentDate;
                if (currentDate.getFullYear() > endDate.getFullYear() || currentDate.getMonth() > endDate.getMonth()) {
                    done = true;
                    currentWeek.push({isInMonth: false, date: currentDate});
                } else {
                    if (offset <= 0) {
                        currentDay.isInMonth = true;
                        currentWeek.push(currentDay);
                        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()+1);
                    } else {
                        offset--;
                        currentWeek.push({isInMonth: false, date: currentDate});
                    }
                }
            }
            this.calendarWeeks.push(currentWeek);
        }
        this.currentCalendar = false;
        if (this.startDate.getMonth() == new Date().getMonth()) {
            this.currentCalendar = true;
        }
        
        this.calendarRef = React.createRef();
    }
    measureSize = () => {
        if (this.currentCalendar) {
            this.calendarRef.current.measure((fx, fy, width, height, px, py) => {
                this.props.current._scrollToPosition((py - 100) > 0 ? py-100 : 0);
            });
        }    
    }
    render() {
        return(
            <View style={styles.calendarMonth} ref={this.calendarRef} onLayout={this.measureSize}>
                <CalendarMonthTitle month={`${this.monthNames[this.startDate.getMonth()]} ${this.startDate.getFullYear()}`}></CalendarMonthTitle>
                {
                    this.calendarWeeks.map((y, index1) => {
                        return (
                            <View key={`week_${index1}`} style={styles.calendarWeek}>
                                {
                                    y.map((z, index2) => {
                                        return (<CalendarDay modal={this.props.modal} titles={this.props.dayTitles} key={`day_${index1}_${index2}`} day={z}></CalendarDay>)
                                    })
                                }
                            </View>
                        )
                    })
                }
            </View>
        )
    }
}

class CalendarDay extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }
    handleClick = () => {
        this.props.modal.current.setState({schedule: [this.props.day.scheduleWeek, this.props.day.scheduleDay], modalShown: true, events: this.props.day.events || [], date: this.props.day.date});
    }
    render() {
        if (this.props.day.isInMonth && this.props.day.scheduleWeek !== undefined && this.props.day.scheduleDay !== undefined) {
            if (this.props.day.events.length > 0) {
                return (
                    <Touchable onPress={this.handleClick}>
                        <View style={[styles.calendarDay, styles.fullDay]}>
                            <Text style={styles.calendarDate}>{this.props.day.date.getDate()}</Text>
                            {
                                (() => {
                                    if (this.props.day.dayDisplayed) {
                                        return (<Text style={styles.calendarTitle}>{this.props.titles[this.props.day.scheduleWeek][`day${this.props.day.scheduleDay+1}`]}</Text>);
                                    } else {
                                        return (<Text style={styles.calendarTitle}> </Text>);
                                    }
                                })()
                            }
                            {
                                (() => {
                                    if (this.props.day.events.length > 0) {
                                        return (<View style={styles.hasEvents}></View>)
                                    } else {
                                        return (<View style={styles.noEvents}></View>)
                                    }
                                })()
                            }
                        </View>
                    </Touchable>
                )
            } else {
                return (
                    <Touchable onPress={this.handleClick}>
                        <View style={[styles.calendarDay, styles.fullDay]}>
                            <Text style={styles.calendarDate}>{this.props.day.date.getDate()}</Text>
                            {
                                (() => {
                                    if (this.props.day.dayDisplayed) {
                                        return (<Text style={styles.calendarTitle}>{this.props.titles[this.props.day.scheduleWeek][`day${this.props.day.scheduleDay+1}`]}</Text>);
                                    } else {
                                        return (<Text style={styles.calendarTitle}> </Text>);
                                    }
                                })()
                            }
                            {
                                (() => {
                                    if (this.props.day.events.length > 0) {
                                        return (<View style={styles.hasEvents}></View>)
                                    } else {
                                        return (<View style={styles.noEvents}></View>)
                                    }
                                })()
                            }
                        </View>
                    </Touchable>
                )   
            }
        } else {
            return (
                <View style={[styles.calendarDay, styles.emptyDay]}>
                
                </View>
            )
        }
    }
}

class ModalSelect extends React.Component {
    //events: [{info, startTime}]
    //scheduled: [{startTime, endTime, info, (optional) color}]
    constructor(props) {
        super(props);
        this.state = {
            modalShown: false,
            events: [],
            scheduled: [],
            date: new Date(),
            schedule: [],
        }
    }
    _toggleModal = () => this.setState({ modalShown: !this.state.modalShown });
    render() {
        return(
            <View style={styles.modalHolder}>
                <Modal
                    style={{margin: 0}}
                    onBackdropPress={() => this.setState({ modalShown: false })}
                    isVisible={this.state.modalShown}
                    animationIn={"slideInRight"}
                    animationOut={"slideOutRight"}
                    backdropOpacity={0.4}>
                    <SideBar {...this.state}></SideBar>
                </Modal>
            </View>
        )
    }
}

class SideBarHour extends React.Component {
    render() {
        return (
            <View style={styles.sidebarHour}>
                <View style={styles.sidebarHourLine}>
                    <Text style={styles.sidebarMarker}>{this.props.text}</Text>
                    <View style={styles.line}></View>
                </View>
            </View>
        )
    }
}
class SideBarEvent extends React.Component {
    render() {
        return (
            <View style={styles.sidebarEvent}>
                <Text style={styles.eventTimeText}>
                    {this.props.event.time}
                </Text>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.eventScroll}>
                    <Text style={styles.eventText}>{this.props.event.info || "No Events!"}</Text>
                </ScrollView>
            </View>
        )
    }
}
class SideBarScheduled extends React.Component {
    render() {
        if (this.props.event.endTime - this.props.event.startTime > 30) {
            return(
                <View style={[styles.sidebarScheduled, {backgroundColor: this.props.color}, {position: "absolute", top: this.props.event.startTime-10, left: 0, right: 0, height: this.props.event.endTime - this.props.event.startTime}]}>
                    <Text style={styles.sidebarScheduledText}>{this.props.event.info}</Text>
                </View>
            )
        } else {
            return <View></View>
        }
    }
}
class SideBar extends React.Component {
    render() {
        return (
            <View style={[styles.sidebar, boxShadows.boxShadow5]}>
                <SideBarHeader date={this.props.date} events={this.props.events.length ? this.props.events : [{time: "", event: "No Events!"}]}></SideBarHeader>
                <SideBarList schedule={this.props.schedule} date={this.props.date}></SideBarList>
            </View>
        )
    }
}

class SideBarHeader extends React.Component {
    render() {
        return (
            <View style={[styles.sidebarHeader, boxShadows.boxShadow5]}>
                <Text style={styles.sidebarDate}>{moment(this.props.date).format("MMMM Do, YYYY")}</Text>
                {
                    this.props.events.map((event, index) => {
                        return (<SideBarEvent event={event} key={`event_${index}`}></SideBarEvent>)
                    })
                }
            </View>
        )
    }
}

class SideBarList extends React.Component {
    render() {
        let colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
        '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
        '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
        '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
        '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
        '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
        '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
        '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
        '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
        '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
        let courses = calculateCurrentCourses(global.semesters, global.semesterMap, this.props.date);
        let courseList = makeSemesterCourseList(courses, global.school.schedule[this.props.schedule[0]][`day${this.props.schedule[1]+1}`]);
        return (
            <View style={styles.sidebarList}>
                <ScrollView>
                    <View>
                        <SideBarHour text="1:00AM"></SideBarHour>
                        <SideBarHour text="2:00AM"></SideBarHour>
                        <SideBarHour text="3:00AM"></SideBarHour>
                        <SideBarHour text="4:00AM"></SideBarHour>
                        <SideBarHour text="5:00AM"></SideBarHour>
                        <SideBarHour text="6:00AM"></SideBarHour>
                        <SideBarHour text="7:00AM"></SideBarHour>
                        <SideBarHour text="8:00AM"></SideBarHour>
                        <SideBarHour text="9:00AM"></SideBarHour>
                        <SideBarHour text="10:00AM"></SideBarHour>
                        <SideBarHour text="11:00AM"></SideBarHour>
                        <SideBarHour text="12:00PM"></SideBarHour>
                        <SideBarHour text="1:00PM"></SideBarHour>
                        <SideBarHour text="2:00PM"></SideBarHour>
                        <SideBarHour text="3:00PM"></SideBarHour>
                        <SideBarHour text="4:00PM"></SideBarHour>
                        <SideBarHour text="5:00PM"></SideBarHour>
                        <SideBarHour text="6:00PM"></SideBarHour>
                        <SideBarHour text="7:00PM"></SideBarHour>
                        <SideBarHour text="8:00PM"></SideBarHour>
                        <SideBarHour text="9:00PM"></SideBarHour>
                        <SideBarHour text="10:00PM"></SideBarHour>
                        <SideBarHour text="11:00PM"></SideBarHour>
                        <SideBarHour text="12:00AM"></SideBarHour>
                    </View>
                    {
                        courseList.map((course, index) => {
                            return(<SideBarScheduled key={`course_${index}`} color={opacityColors(colorArray[index%colorArray.length])} event={{startTime: course.startTime, endTime: course.endTime, info: course.course.course}}></SideBarScheduled>)
                        })
                    }
                </ScrollView>
            </View>
        )
    }
}

class Calendars extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state={offset: 0};
        this.calendars = React.createRef();
        this.position = 0;
        this.mounted = false;
    }
    _scrollToPosition = (position) => {
        this.position = position;
        if (this.mounted) {
            this.calendars.current.scrollToOffset({animated: false, offset: this.position});
        }
    }
    componentDidMount() {
        this.mounted = true;
        this.calendars.current.scrollToOffset({animated: false, offset: this.position});
    }
    render() {
        return (
            <FlatList
                ref={this.calendars}
                data={this.props.months}
                renderItem={({item, index}) => <CalendarMonth index={index} dayTitles={this.props.dayTitles} date={item} current={this} modal={this.props.modal}></CalendarMonth>}
                keyExtractor={(item, index) => `month_${index}`}
            />
        )
    }
}

export default class CalendarScreenTile extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.months = [];
        this.startDate = this.props.dates.startDate;
        let numMonths = this.props.dates.endDate.getFullYear()*12+this.props.dates.endDate.getMonth() - (this.props.dates.startDate.getFullYear()*12+this.props.dates.startDate.getMonth());
        for (var i = 0; i <= numMonths; i++) {
            this.months.push(new Date(this.startDate.getFullYear(), this.startDate.getMonth()+i));
        }
        this.modal = React.createRef();
    }
    openModal = () => {
        this.modal.current.setState({modalShown: true});
    }
    render() {
        return (
            <View>
                <Calendars months={this.months} modal={this.modal} dayTitles={global.school.dayTitles}></Calendars>
                <ModalSelect ref={this.modal} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    scrollBack: {
        width: width,
        backgroundColor: "#f0f0f0",
    },
    calendarDay: {
        width: width/7,
        height: 70,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
    },
    calendarWeek: {
        width: width,
        flexDirection: "row",
    },
    calendarMonth: {
        flexDirection: "column",
        width: width,
    },
    calendarDate: {
        fontSize: 14,
    },
    calendarTitle: {
        fontSize: 10,
        color: "rgba(0,0,0,0.7)"
    },
    hasEvents: {
        width: 7.5,
        height: 7.5,
        borderRadius: 7.5,
        backgroundColor: "rgba(0,0,0,0.4)"
    },
    noEvents: {
        width: 7.5,
        height: 7.5,
        borderRadius: 7.5,
        backgroundColor: "rgba(0,0,0,0)"
    },
    calendarMonthTitle: {
        width: width,
        flexDirection: "row",
        alignItems: "center",
    },
    bar: {
        flexGrow: 1,
        height: StyleSheet.hairlineWidth*3,
        backgroundColor: "rgba(0,0,0,0.3)",
    },
    monthTitle: {
        fontSize: 24,
        marginLeft: 10,
        marginRight: 10,
    },
    sidebar: {
        width: width*0.7,
        minWidth: 280,
        height: height,
        backgroundColor: "white",
        position: "absolute",
        right: 0,
        flexDirection: "column",
    },
    sidebarHour: {
        height: 60,
        width: "100%",   
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "flex-start",
        paddingLeft: 10,
    },
    sidebarScheduledText: {
        fontSize: 18,
    },
    sidebarScheduled: {
        width: "100%",
        backgroundColor: "red",
        flexDirection: "column",
        justifyContent: "center",
    },
    sidebarHourLine: {
        flexGrow: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    sidebarMarker: {
        fontSize: 16,
        color: "#999",
    },
    line: {
        height: StyleSheet.hairlineWidth*2,
        backgroundColor: "#ccc",
        flexGrow: 1,
        marginLeft: 10,
    },
    sidebarHeader: {
        width: "100%",
        paddingTop: 20,
        paddingBottom: 10,
        backgroundColor: "#f9f9f9",
    },
    sidebarDate: {
        fontSize: 22,
        textAlign: "center"
    },
    sidebarList: {
        width: "100%",
        flexGrow: 1,
    },
    eventScroll: {
        flexGrow: 1,
        backgroundColor: "#90f276",
        paddingLeft: 5,
    },
    sidebarEvent: {
        width: "100%",
        backgroundColor: "#ccc",
        borderWidth: 4,
        borderColor: "#ccc",
        flexDirection: "row",
        justifyContent: "flex-start",
        marginTop: 10,
    },
    eventTimeText: {
        paddingRight: 5,
    },
    eventText: {
        color: "#427036",
    }
});