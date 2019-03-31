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
  Button
} from 'react-native';

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

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
                let currentDay = this.props.dayMap[`${currentDate.getFullYear()}_${currentDate.getMonth()}_${currentDate.getDate()}`];
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
    }
    render() {
        return(
            <View style={styles.calendarMonth}>
                <CalendarMonthTitle month={`${this.monthNames[this.startDate.getMonth()]} ${this.startDate.getFullYear()}`}></CalendarMonthTitle>
                {
                    this.calendarWeeks.map((y, index1) => {
                        return (
                            <View key={`week_${index1}`} style={styles.calendarWeek}>
                                {
                                    y.map((z, index2) => {
                                        return (<CalendarDay titles={[["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"]]} key={`day_${index1}_${index2}`} day={z}></CalendarDay>)
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
    render() {
        if (this.props.day.isInMonth && this.props.day.scheduleWeek !== undefined && this.props.day.scheduleDay !== undefined) {
            return (
                <View style={[styles.calendarDay, styles.fullDay]}>
                    <Text style={styles.calendarDate}>{this.props.day.date.getDate()}</Text>
                    {
                        (() => {
                            if (this.props.day.dayDisplayed) {
                                return (<Text style={styles.calendarTitle}>{this.props.titles[this.props.day.scheduleWeek][this.props.day.scheduleDay]}</Text>);
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
            )
        } else {
            return (
                <View style={[styles.calendarDay, styles.emptyDay]}>
    
                </View>
            )
        }
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
    }
    render() {
        
        return (
            <ScrollView style={styles.scrollBack}>
                {
                    this.months.map((month, index) => {
                        return (
                            <CalendarMonth key={`month_${index}`} date={month} dayMap={this.props.dayMap}></CalendarMonth>
                        )
                    })
                }
            </ScrollView>
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
        // borderWidth: StyleSheet.hairlineWidth,
        // borderColor: "black",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
    },
    fullDay: {
        // backgroundColor: "red",
    },
    emptyDay: {
        // backgroundColor: "blue",
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
});