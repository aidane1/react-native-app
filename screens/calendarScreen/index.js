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
  FlatList,
} from 'react-native';

import Modal from 'react-native-modal';

import Touchable from 'react-native-platform-touchable';

import {boxShadows} from '../../constants/boxShadows';

import HeaderBar from '../../components/header';

import {LeftIcon, EmptyIcon} from '../../classes/icons';

import {ifIphoneX} from 'react-native-iphone-x-helper';

import moment from 'moment';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

function opacityColors (color) {
  //get the red of RGB from a hex value
  function hexToR (h) {
    return parseInt (cutHex (h).substring (0, 2), 16);
  }

  //get the green of RGB from a hex value
  function hexToG (h) {
    return parseInt (cutHex (h).substring (2, 4), 16);
  }

  //get the blue of RGB from a hex value
  function hexToB (h) {
    return parseInt (cutHex (h).substring (4, 6), 16);
  }

  //cut the hex into pieces
  function cutHex (h) {
    if (h.charAt (1) == 'x') {
      return h.substring (2, 8);
    } else {
      return h.substring (1, 7);
    }
  }
  var red = 0, green = 0, blue = 0;
  colorArray = [color];
  for (var i = 0; i < colorArray.length; i++) {
    red += hexToR ('' + colorArray[i] + '') ** 2;
    green += hexToG ('' + colorArray[i] + '') ** 2;
    blue += hexToB ('' + colorArray[i] + '') ** 2;
  }
  //Average RGB
  red = Math.round (Math.sqrt (red / colorArray.length));
  green = Math.round (Math.sqrt (green / colorArray.length));
  blue = Math.round (Math.sqrt (blue / colorArray.length));
  return 'rgba(' + red + ',' + green + ',' + blue + ',0.5)';
}

function calculateCurrentCourses (semesters, date) {
  let currentSemesters = global.semesters
    .filter (semester => {
      return (
        semester.startDate.getTime () <= date.getTime () &&
        semester.endDate.getTime () >= date.getTime ()
      );
    })
    .map (semester => {
      return semester.id;
    });
  let courses = {};
  for (var i = 0; i < currentSemesters.length; i++) {
    for (var key in global.semesterMap[currentSemesters[i]]) {
      if (
        courses[key] == undefined ||
        global.semesterMap[currentSemesters[i]][key].isReal
      ) {
        courses[key] = global.semesterMap[currentSemesters[i]][key];
      }
    }
  }
  return courses;
}

function makeSemesterCourseList (courseList, week, day) {
  let courses = [];

  let todaySchedule = week !== undefined && day !== undefined
    ? global.school.rawSchedule['day_blocks'][week][day]
    : [];
  let todayTimes = week !== undefined && day !== undefined
    ? global.school.rawSchedule['block_times']
    : [];

  if (todaySchedule !== undefined && todaySchedule.length > 0) {
    let blockCount = 0;
    for (var i = 0; i < todaySchedule.length; i++) {
      if (courseList[todaySchedule[i].block]) {
        let currentStartBlock = todayTimes[blockCount];
        let currentEndBlock =
          todayTimes[blockCount + todaySchedule[i].block_span - 1];
        courses.push ({
          course: courseList[todaySchedule[i].block].course,
          startTime: currentStartBlock.start_hour * 60 +
            currentStartBlock.start_minute,
          endTime: currentEndBlock.end_hour * 60 + currentEndBlock.end_minute,
        });
        blockCount += todaySchedule[i].block_span;
      }
    }
  }
  return courses;
}

function makeMonthRows (month) {
  let firstDay = new Date (month.getFullYear (), month.getMonth (), 1);
  let rows = [[]];
  let empties = Array.apply (null, {length: firstDay.getDay () % 7});
  rows[0] = empties.map ((x, index) => {
    return {
      isLast: false,
      date: new Date (
        month.getFullYear (),
        month.getMonth (),
        1 - firstDay.getDay () + index
      ),
      isInMonth: false,
    };
  });
  let currentDay = new Date (month.getFullYear (), month.getMonth (), 1);
  let currentDayInfo = global.dayMap[
    `${currentDay.getFullYear ()}_${currentDay.getMonth ()}_${currentDay.getDate ()}`
  ] || {week: 0, day: 'day_1'};
  while (
    (currentDay.getDate () == 1 &&
      currentDay.getMonth () == month.getMonth ()) ||
    currentDay.getDate () >
      new Date (
        currentDay.getFullYear (),
        currentDay.getMonth (),
        currentDay.getDate () - 1
      ).getDate ()
  ) {
    if (rows[rows.length - 1].length < 7) {
      rows[rows.length - 1].push ({
        events: currentDayInfo.events,
        scheduleDay: currentDayInfo.day,
        scheduleWeek: currentDayInfo.week,
        isLast: false,
        date: currentDay,
        isInMonth: true,
      });
    } else {
      rows.push ([
        {
          events: currentDayInfo.events,
          scheduleDay: currentDayInfo.day,
          scheduleWeek: currentDayInfo.week,
          isLast: false,
          date: currentDay,
          isInMonth: true,
        },
      ]);
    }
    currentDay = new Date (
      currentDay.getFullYear (),
      currentDay.getMonth (),
      currentDay.getDate () + 1
    );
    currentDayInfo = global.dayMap[
      `${currentDay.getFullYear ()}_${currentDay.getMonth ()}_${currentDay.getDate ()}`
    ] || {week: 0, day: 'day_1'};
  }
  if (rows[rows.length - 1].length != 7) {
    let diff = 7 - rows[rows.length - 1].length;
    for (var i = 0; i < diff; i++) {
      rows[rows.length - 1].push ({
        events: currentDayInfo.events,
        scheduleDay: currentDayInfo.day,
        scheduleWeek: currentDayInfo.week,
        date: new Date (
          currentDay.getFullYear (),
          currentDay.getMonth (),
          currentDay.getDate () + i
        ),
        isInMonth: false,
      });
    }
  }
  for (var i = 0; i < rows[rows.length - 1].length; i++) {
    rows[rows.length - 1][i].isLast = true;
  }
  return rows;
}

class CalendarMonthTitle extends React.Component {
  render () {
    return (
      <View style={[styles.calendarMonthTitle, global.user.secondaryTheme ()]}>
        <View
          style={[styles.bar, {backgroundColor: global.user.getBorderColor ()}]}
        />
        <Text style={[styles.monthTitle, global.user.primaryTextColor ()]}>
          {this.props.month}
        </Text>
        <View
          style={[styles.bar, {backgroundColor: global.user.getBorderColor ()}]}
        />
      </View>
    );
  }
}

class CalendarMonth extends React.Component {
  constructor (props) {
    super (props);

    this.props = props;
    this.monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    let startDate = new Date (
      this.props.date.getFullYear (),
      this.props.date.getMonth (),
      1
    );
    this.startDate = startDate;
    this.calendarWeeks = makeMonthRows (this.startDate);
    this.currentCalendar = false;
    if (this.startDate.getMonth () == new Date ().getMonth ()) {
      this.currentCalendar = true;
    }

    this.calendarRef = React.createRef ();
  }
  measureSize = () => {
    if (this.currentCalendar) {
      this.calendarRef.current.measure ((fx, fy, width, height, px, py) => {
        this.props.current._scrollToPosition (py - 100 > 0 ? py - 100 : 0);
      });
    }
  };
  render () {
    return (
      <View
        style={styles.calendarMonth}
        ref={this.calendarRef}
        onLayout={this.measureSize}
      >
        <CalendarMonthTitle
          month={`${this.monthNames[this.startDate.getMonth ()]} ${this.startDate.getFullYear ()}`}
        />
        {this.calendarWeeks.map ((y, index1) => {
          return (
            <View key={`week_${index1}`} style={styles.calendarWeek}>
              {y.map ((z, index2) => {
                let zDay =
                  global.dayMap[
                    `${z.date.getFullYear ()}_${z.date.getMonth ()}_${z.date.getDate ()}`
                  ];
                if (zDay) {
                  zDay.isInMonth = z.isInMonth;
                  zDay.date = z.date;
                } else {
                  zDay = {
                    isInMonth: false,
                    is_displayed: false,
                    date: z.date,
                  };
                }
                return (
                  <CalendarDay
                    modal={this.props.modal}
                    titles={this.props.dayTitles}
                    key={`day_${index1}_${index2}`}
                    day={zDay}
                  />
                );
              })}
            </View>
          );
        })}
      </View>
    );
  }
}

class CalendarDay extends React.Component {
  constructor (props) {
    super (props);
    this.props = props;
  }
  handleClick = () => {
    this.props.modal.current.setState ({
      schedule: [this.props.day.week, this.props.day.day],
      modalShown: true,
      events: this.props.day.events || [],
      date: this.props.day.date,
    });
  };
  render () {
    if (
      this.props.day.isInMonth &&
      this.props.day.week !== undefined &&
      this.props.day.day !== undefined
    ) {
      if (this.props.day.events.length > 0) {
        return (
          <Touchable onPress={this.handleClick}>
            <View
              style={[
                styles.calendarDay,
                styles.fullDay,
                global.user.secondaryTheme (),
              ]}
            >
              <Text
                style={[styles.calendarDate, global.user.secondaryTextColor ()]}
              >
                {this.props.day.date.getDate ()}
              </Text>
              {(() => {
                if (this.props.day.is_displayed) {
                  return (
                    <Text
                      style={[
                        styles.calendarTitle,
                        global.user.tertiaryTextColor (),
                      ]}
                    >
                      {
                        this.props.titles[this.props.day.week][
                          this.props.day.day
                        ]
                      }
                    </Text>
                  );
                } else {
                  return <Text style={styles.calendarTitle}> </Text>;
                }
              }) ()}
              {(() => {
                if (this.props.day.events.length > 0) {
                  return <View style={styles.hasEvents} />;
                } else {
                  return <View style={styles.noEvents} />;
                }
              }) ()}
            </View>
          </Touchable>
        );
      } else {
        return (
          <Touchable onPress={this.handleClick}>
            <View
              style={[
                styles.calendarDay,
                styles.fullDay,
                styles.fullDay,
                global.user.secondaryTheme (),
              ]}
            >
              <Text
                style={[styles.calendarDate, global.user.secondaryTextColor ()]}
              >
                {this.props.day.date.getDate ()}
              </Text>
              {(() => {
                if (this.props.day.is_displayed) {
                  return (
                    <Text
                      style={[
                        styles.calendarTitle,
                        global.user.tertiaryTextColor (),
                      ]}
                    >
                      {
                        this.props.titles[this.props.day.week][
                          this.props.day.day
                        ]
                      }
                    </Text>
                  );
                } else {
                  return <Text style={styles.calendarTitle}> </Text>;
                }
              }) ()}
              {(() => {
                if (this.props.day.events.length > 0) {
                  return <View style={styles.hasEvents} />;
                } else {
                  return <View style={styles.noEvents} />;
                }
              }) ()}
            </View>
          </Touchable>
        );
      }
    } else {
      return (
        <View
          style={[
            styles.calendarDay,
            styles.emptyDay,
            global.user.secondaryTheme (),
          ]}
        />
      );
    }
  }
}

class ModalSelect extends React.Component {
  //events: [{info, startTime}]
  //scheduled: [{startTime, endTime, info, (optional) color}]
  constructor (props) {
    super (props);
    this.state = {
      modalShown: false,
      events: [],
      scheduled: [],
      date: new Date (),
      schedule: [],
    };
  }
  _toggleModal = () => this.setState ({modalShown: !this.state.modalShown});
  render () {
    return (
      <View style={styles.modalHolder}>
        <Modal
          style={{margin: 0}}
          onBackdropPress={() => this.setState ({modalShown: false})}
          isVisible={this.state.modalShown}
          animationIn={'slideInRight'}
          animationOut={'slideOutRight'}
          backdropOpacity={0.4}
        >
          <SideBar {...this.state} />
        </Modal>
      </View>
    );
  }
}

class SideBarHour extends React.Component {
  render () {
    return (
      <View style={styles.sidebarHour}>
        <View style={styles.sidebarHourLine}>
          <Text style={styles.sidebarMarker}>{this.props.text}</Text>
          <View style={styles.line} />
        </View>
      </View>
    );
  }
}
class SideBarEvent extends React.Component {
  render () {
    return (
      <View
        style={[
          styles.sidebarEvent,
          global.user.borderColor (),
          {backgroundColor: global.user.getBorderColor ()},
        ]}
      >
        <Text style={styles.eventTimeText}>
          {this.props.event.time}
        </Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.eventScroll}
        >
          <Text style={styles.eventText}>
            {this.props.event.info || 'No Events!'}
          </Text>
        </ScrollView>
      </View>
    );
  }
}
class SideBarScheduled extends React.Component {
  render () {
    if (this.props.event.endTime - this.props.event.startTime > 30) {
      return (
        <View
          style={[
            styles.sidebarScheduled,
            {backgroundColor: this.props.color},
            {
              position: 'absolute',
              top: this.props.event.startTime - 10,
              left: 0,
              right: 0,
              height: this.props.event.endTime - this.props.event.startTime,
            },
          ]}
        >
          <Text style={styles.sidebarScheduledText}>
            {this.props.event.info}
          </Text>
        </View>
      );
    } else {
      return <View />;
    }
  }
}
class SideBar extends React.Component {
  render () {
    return (
      <View
        style={[
          styles.sidebar,
          boxShadows.boxShadow5,
          global.user.primaryTheme (),
        ]}
      >
        <SideBarHeader
          date={this.props.date}
          events={
            this.props.events.length
              ? this.props.events
              : [{time: '', event: 'No Events!'}]
          }
        />
        <SideBarList schedule={this.props.schedule} date={this.props.date} />
      </View>
    );
  }
}

class SideBarHeader extends React.Component {
  render () {
    return (
      <View
        style={[
          styles.sidebarHeader,
          boxShadows.boxShadow5,
          global.user.secondaryTheme (),
        ]}
      >
        <Text style={[styles.sidebarDate, global.user.secondaryTextColor ()]}>
          {moment (this.props.date).format ('MMMM Do, YYYY')}
        </Text>
        {this.props.events.map ((event, index) => {
          return <SideBarEvent event={event} key={`event_${index}`} />;
        })}
      </View>
    );
  }
}

class SideBarList extends React.Component {
  render () {
    let colorArray = [
      '#FF6633',
      '#FFB399',
      '#FF33FF',
      '#FFFF99',
      '#00B3E6',
      '#E6B333',
      '#3366E6',
      '#999966',
      '#99FF99',
      '#B34D4D',
      '#80B300',
      '#809900',
      '#E6B3B3',
      '#6680B3',
      '#66991A',
      '#FF99E6',
      '#CCFF1A',
      '#FF1A66',
      '#E6331A',
      '#33FFCC',
      '#66994D',
      '#B366CC',
      '#4D8000',
      '#B33300',
      '#CC80CC',
      '#66664D',
      '#991AFF',
      '#E666FF',
      '#4DB3FF',
      '#1AB399',
      '#E666B3',
      '#33991A',
      '#CC9999',
      '#B3B31A',
      '#00E680',
      '#4D8066',
      '#809980',
      '#E6FF80',
      '#1AFF33',
      '#999933',
      '#FF3380',
      '#CCCC00',
      '#66E64D',
      '#4D80CC',
      '#9900B3',
      '#E64D66',
      '#4DB380',
      '#FF4D4D',
      '#99E6E6',
      '#6666FF',
    ];
    let courses = calculateCurrentCourses (global.semesters, this.props.date);
    let courseList = makeSemesterCourseList (
      courses,
      this.props.schedule[0],
      this.props.schedule[1]
    );
    return (
      <View style={styles.sidebarList}>
        <ScrollView>
          <View>
            <SideBarHour text="1:00AM" />
            <SideBarHour text="2:00AM" />
            <SideBarHour text="3:00AM" />
            <SideBarHour text="4:00AM" />
            <SideBarHour text="5:00AM" />
            <SideBarHour text="6:00AM" />
            <SideBarHour text="7:00AM" />
            <SideBarHour text="8:00AM" />
            <SideBarHour text="9:00AM" />
            <SideBarHour text="10:00AM" />
            <SideBarHour text="11:00AM" />
            <SideBarHour text="12:00PM" />
            <SideBarHour text="1:00PM" />
            <SideBarHour text="2:00PM" />
            <SideBarHour text="3:00PM" />
            <SideBarHour text="4:00PM" />
            <SideBarHour text="5:00PM" />
            <SideBarHour text="6:00PM" />
            <SideBarHour text="7:00PM" />
            <SideBarHour text="8:00PM" />
            <SideBarHour text="9:00PM" />
            <SideBarHour text="10:00PM" />
            <SideBarHour text="11:00PM" />
            <SideBarHour text="12:00AM" />
          </View>
          {courseList.map ((course, index) => {
            return (
              <SideBarScheduled
                key={`course_${index}`}
                color={opacityColors (colorArray[index % colorArray.length])}
                event={{
                  startTime: course.startTime,
                  endTime: course.endTime,
                  info: course.course,
                }}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

class Calendars extends React.Component {
  constructor (props) {
    super (props);
    this.props = props;
    this.state = {offset: 0};
    this.calendars = React.createRef ();
    this.position = 0;
    this.mounted = false;
  }
  _scrollToPosition = position => {
    this.position = position;
    if (this.mounted) {
      this.calendars.current.scrollToOffset ({
        animated: false,
        offset: this.position,
      });
    }
  };
  componentDidMount () {
    this.mounted = true;
    this.calendars.current.scrollToOffset ({
      animated: false,
      offset: this.position,
    });
  }
  render () {
    return (
      <FlatList
        style={global.user.secondaryTheme ()}
        ref={this.calendars}
        data={this.props.months}
        renderItem={({item, index}) => (
          <CalendarMonth
            index={index}
            dayTitles={this.props.dayTitles}
            date={item}
            current={this}
            modal={this.props.modal}
          />
        )}
        keyExtractor={(item, index) => `month_${index}`}
      />
    );
  }
}

export default class CalendarScreenTile extends React.Component {
  constructor (props) {
    super (props);
    this.props = props;
    this.months = [];
    this.startDate = global.dates.startDate;
    let numMonths =
      global.dates.endDate.getFullYear () * 12 +
      global.dates.endDate.getMonth () -
      (global.dates.startDate.getFullYear () * 12 +
        global.dates.startDate.getMonth ());
    for (var i = 0; i <= numMonths; i++) {
      this.months.push (
        new Date (this.startDate.getFullYear (), this.startDate.getMonth () + i)
      );
    }
    this.modal = React.createRef ();
  }
  openModal = () => {
    this.modal.current.setState ({modalShown: true});
  };
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };
  componentDidMount () {
    this.props.navigation.getParam ('callback', () => {}) ();
  }
  render () {
    return (
      <View styles={[styles.container, global.user.primaryTheme ()]}>
        <HeaderBar
          iconLeft={
            <Touchable onPress={() => this.props.navigation.goBack ()}>
              <LeftIcon size={28} />
            </Touchable>
          }
          iconRight={<EmptyIcon width={28} height={32} />}
          width={width}
          height={60}
          title="Calendar"
        />
        <View style={{width, height: ifIphoneX (height - 80, height - 60)}}>
          <Calendars
            months={this.months}
            modal={this.modal}
            dayTitles={global.school.dayTitles}
          />
          <ModalSelect ref={this.modal} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create ({
  scrollBack: {
    width: width,
    backgroundColor: '#f0f0f0',
  },
  calendarDay: {
    width: width / 7,
    height: 70,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  calendarWeek: {
    width: width,
    flexDirection: 'row',
  },
  calendarMonth: {
    flexDirection: 'column',
    width: width,
  },
  calendarDate: {
    fontSize: 14,
  },
  calendarTitle: {
    fontSize: 10,
    color: 'rgba(0,0,0,0.7)',
  },
  hasEvents: {
    width: 7.5,
    height: 7.5,
    borderRadius: 7.5,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  noEvents: {
    width: 7.5,
    height: 7.5,
    borderRadius: 7.5,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  calendarMonthTitle: {
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bar: {
    flexGrow: 1,
    height: StyleSheet.hairlineWidth * 3,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  monthTitle: {
    fontSize: 24,
    marginLeft: 10,
    marginRight: 10,
  },
  sidebar: {
    width: width * 0.7,
    minWidth: 280,
    height: height,
    backgroundColor: 'white',
    position: 'absolute',
    right: 0,
    flexDirection: 'column',
  },
  sidebarHour: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingLeft: 10,
  },
  sidebarScheduledText: {
    fontSize: 18,
  },
  sidebarScheduled: {
    width: '100%',
    backgroundColor: 'red',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  sidebarHourLine: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  sidebarMarker: {
    fontSize: 16,
    color: '#999',
  },
  line: {
    height: StyleSheet.hairlineWidth * 2,
    backgroundColor: '#ccc',
    flexGrow: 1,
    marginLeft: 10,
  },
  sidebarHeader: {
    width: '100%',
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  sidebarDate: {
    fontSize: 22,
    textAlign: 'center',
  },
  sidebarList: {
    width: '100%',
    flexGrow: 1,
  },
  eventScroll: {
    flexGrow: 1,
    backgroundColor: '#90f276',
    paddingLeft: 5,
  },
  sidebarEvent: {
    width: '100%',
    backgroundColor: '#ccc',
    borderWidth: 4,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  eventTimeText: {
    paddingRight: 5,
  },
  eventText: {
    color: '#427036',
  },
});
