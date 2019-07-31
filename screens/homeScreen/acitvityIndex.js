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
  RefreshControl,
  DatePickerAndroid,
  DatePickerIOS,
} from 'react-native';

import Touchable from 'react-native-platform-touchable';

import {Course, Courses} from '../../classes/courses';

import {LinearGradient} from 'expo-linear-gradient';

import ScheduleScreenTile from './scheduleIndex';

import {Assignment, Assignments} from '../../classes/assignments';

import {Topic, Topics} from '../../classes/topics';

import {Note, Notes} from '../../classes/notes';

import {ImportantDate, ImportantDates} from '../../classes/importantDates';

import {Event, Events} from '../../classes/events';

import ApexAPI from '../../http/api';

import {
  SchoolIcons,
  GenericIcon,
  RightIcon,
  CaretRight,
  CalendarIcon,
} from '../../classes/icons';

import {boxShadows} from '../../constants/boxShadows';

import Modal from 'react-native-modal';

import moment from 'moment';
import {FlatList} from 'react-native-gesture-handler';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

class AssignmentBlock extends React.Component {
  constructor (props) {
    super (props);
  }
  render () {
    return (
      <View style={[styles.gradientBlock, boxShadows.boxShadow4]}>
        <Touchable
          onPress={() =>
            this.props._navigateToPage (
              'CourseInfo',
              this.props.assignment.referenceCourse
            )}
        >
          <LinearGradient
            colors={['#289e10', '#147500']}
            style={[styles.gradientBlockChild]}
          >
            <View style={{flexGrow: 1, flexDirection: 'column'}}>
              <View style={{flexGrow: 0}}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: '20',
                    fontWeight: 'bold',
                    color: 'white',
                    paddingTop: 5,
                    paddingBottom: 10,
                  }}
                >
                  {this.props.assignment.assignmentTitle}
                </Text>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.7)',
                    maxWidth: width * 0.95 * 0.4,
                  }}
                  numberOfLines={1}
                >
                  {this.props.assignment.topic}
                </Text>
                <Text style={{fontSize: 14, color: 'rgba(255,255,255,0.7)'}}>
                  {this.props.assignment.courseName.course}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Touchable>

      </View>
    );
  }
}
class ChatBlock extends React.Component {
  constructor (props) {
    super (props);
  }
  navigate = async key => {
    global.chatroomKey = `${key}`;
    global.textPath = `texts?find_fields=key&key=${key}&order_by=date&order_direction=-1&populate=resources`;
    key = key.split ('_');
    if (key[0] == 'course') {
      let course = await Courses._retrieveCourseById (key[1]);
      if (course.id != '_') {
        global.chatroomName = `${course.course}`;
        global.resourcePath = `/chatrooms/courses/${course.id}`;
        this.props.navigation.navigate ('PureChatroom');
      }
    } else if (key[0] == 'grade') {
      let grade = key[1].split ('-')[1];
      if (isNaN (parseInt (grade)) || !global.districtInfo) {
      } else {
        if (grade.toString () == global.districtInfo.grade.toString ()) {
          global.chatroomName = `Grade ${grade}`;
          global.resourcePath = ` /chatrooms/grades/${grade}`;
          this.props.navigation.navigate ('PureChatroom');
        }
      }
    } else if (key[0] == 'school') {
      global.chatroomName = `${global.school.name}`;
      global.resourcePath = `/chatrooms/schools/${global.school.id}`;
      this.props.navigation.navigate ('PureChatroom');
    }
  };
  render () {
    return (
      <View style={[styles.gradientBlock, boxShadows.boxShadow4]}>
        <Touchable onPress={() => this.navigate (this.props.chat.key)}>
          <LinearGradient
            colors={['#8a8a8a', '#6e6e6e']}
            style={[
              styles.gradientBlockChild,
              // {borderWidth: 2, borderColor: 'black'},
            ]}
          >
            <View style={{flexGrow: 1, flexDirection: 'column'}}>
              <View style={{flexGrow: 0}}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: '20',
                    fontWeight: 'bold',
                    color: 'white',
                    paddingTop: 5,
                    paddingBottom: 10,
                  }}
                >
                  {this.props.chat.name}
                </Text>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.7)',
                    maxWidth: width * 0.95 * 0.45,
                  }}
                  numberOfLines={1}
                >
                  {moment (this.props.chat.date).calendar ()}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.7)',
                    maxWidth: width * 0.95 * 0.45,
                  }}
                  numberOfLines={1}
                >
                  {this.props.chat.users.join (', ')}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Touchable>

      </View>
    );
  }
}
class NoteBlock extends React.Component {
  constructor (props) {
    super (props);
    // console.log(this.props.note);
  }
  render () {
    return (
      <View style={[styles.gradientBlock, boxShadows.boxShadow4]}>
        <Touchable
          onPress={() =>
            this.props._navigateToPage (
              'CourseInfo',
              this.props.note.referenceCourse
            )}
        >
          <LinearGradient
            colors={['#6f2fbd', '#4e1791']}
            style={[styles.gradientBlockChild]}
          >
            <View style={{flexGrow: 1, flexDirection: 'column'}}>
              <View style={{flexGrow: 0}}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: '20',
                    fontWeight: 'bold',
                    color: 'white',
                    paddingTop: 5,
                    paddingBottom: 10,
                  }}
                >
                  {this.props.note.note}
                </Text>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}
              >
                <Text style={{fontSize: 14, color: 'rgba(255,255,255,0.7)'}}>
                  {this.props.note.topic}
                </Text>
                <Text style={{fontSize: 14, color: 'rgba(255,255,255,0.7)'}}>
                  {this.props.note.courseName.course}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Touchable>

      </View>
    );
  }
}
class ImportantDateBlock extends React.Component {
  constructor (props) {
    super (props);
    // console.log(this.props.importantDate);
  }
  render () {
    return (
      <View style={[styles.gradientBlock, boxShadows.boxShadow4]}>
        <Touchable
          onPress={() =>
            this.props._navigateToPage (
              'CourseInfo',
              this.props.importantDate.reference_course
            )}
        >
          <LinearGradient
            colors={['#c42b56', '#9e1038']}
            style={[styles.gradientBlockChild]}
          >
            <View style={{flexGrow: 1, flexDirection: 'column'}}>
              <View style={{flexGrow: 0}}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: '20',
                    fontWeight: 'bold',
                    color: 'white',
                    paddingTop: 5,
                    paddingBottom: 10,
                  }}
                >
                  {this.props.importantDate.title}
                </Text>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}
              >
                <Text style={{fontSize: 14, color: 'rgba(255,255,255,0.7)'}}>
                  {moment (this.props.importantDate.date_of_event).format (
                    'dddd, MMM Do YYYY'
                  )}
                </Text>
                <Text style={{fontSize: 14, color: 'rgba(255,255,255,0.7)'}}>
                  {this.props.importantDate.courseName.course}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Touchable>

      </View>
    );
  }
}

export default class LinksScreenTile extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      refreshing: false,
      chatrooms: [],
    };
  }

  _navigateToPage = async (page, id) => {
    try {
      global.courseInfoCourse = await Courses._retrieveCourseById (id);
      global.courseInfoPage = 'assignments';
      if (global.courseInfoCourse.id != '_') {
        this.props.navigation.navigate (page);
      }
    } catch (e) {
      console.log (e);
    }
  };

  componentDidMount () {
    let api = new ApexAPI (global.user);
    api
      .get ('chatroom-keys')
      .then (data => data.json ())
      .then (data => {
        if (data.status == 'ok') {
          data.body = data.body.map (room => {
            return {...room, users: [...new Set (room.users)]};
          });
          this.setState ({chatrooms: data.body});
        } else {
        }
      })
      .catch (e => {
        console.log (e);
      });
  }

  _onRefresh = () => {
    this.setState ({refreshing: true});
    // this.props.navigation.replace("Home");
    setTimeout (() => {
      this.props.parent.setState (
        // {currentDate: new Date (2019, 10, 8, 12, 30)},
        {currentDate: new Date ()},
        () => {
          this.setState ({refreshing: false});
        }
      );
    }, 400);
  };

  render () {
    let {courseMap} = this.props;
    let assignments = Object.keys (courseMap)
      .filter (block => {
        let courseAssignments = Assignments._retrieveAssignmentsByCourse (
          global.assignments,
          courseMap[block].id
        );
        if (courseAssignments.length > 0) {
          return true;
        } else {
          return false;
        }
      })
      .map (block => {
        if (courseMap[block].id != '_') {
          let courseAssignments = Assignments._retrieveAssignmentsByCourse (
            global.assignments,
            courseMap[block].id
          ).sort ((a, b) => {
            return a.date.getTime () > b.date.getTime () ? -1 : 1;
          });
          let topicsList = Topics._MakeCourseTopicList (
            courseMap[block].id,
            global.topics
          );
          let topicsMap = Topics._makeTopicMap (topicsList);
          if (topicsMap[courseAssignments[0].topic]) {
            return {
              ...courseAssignments[0],
              topic: topicsMap[courseAssignments[0].topic].topic,
            };
          } else {
            return {
              ...courseAssignments[0],
              topic: 'No Topic',
            };
          }
        }
      })
      .map (assignment => {
        return {
          ...assignment,
          courseName: Courses._retrieveById (
            global.courses,
            assignment.referenceCourse
          ),
        };
      });
    let notes = Object.keys (courseMap)
      .filter (block => {
        let courseNotes = Notes._retrieveNotesByCourse (
          global.notes,
          courseMap[block].id
        );
        if (courseNotes.length > 0) {
          return true;
        } else {
          return false;
        }
      })
      .map (block => {
        if (courseMap[block].id != '_') {
          let courseNotes = Notes._retrieveNotesByCourse (
            global.notes,
            courseMap[block].id
          ).sort ((a, b) => {
            return a.date.getTime () > b.date.getTime () ? -1 : 1;
          });
          let topicsList = Topics._MakeCourseTopicList (
            courseMap[block].id,
            global.topics
          );
          let topicsMap = Topics._makeTopicMap (topicsList);
          if (topicsMap[courseNotes[0].topic]) {
            return {
              ...courseNotes[0],
              topic: topicsMap[courseNotes[0].topic].topic,
            };
          } else {
            return {
              ...courseNotes[0],
              topic: 'No Topic',
            };
          }
        }
      })
      .map (note => {
        return {
          ...note,
          courseName: Courses._retrieveById (
            global.courses,
            note.referenceCourse
          ),
        };
      });

    let importantDates = Object.keys (courseMap)
      .filter (block => {
        let courseDates = ImportantDates._retrieveDatesByCourse (
          global.importantDates,
          courseMap[block].id
        );
        let current = new Date ();
        let isUpcoming = courseDates.reduce ((accumulator, currentValue) => {
          return (
            accumulator ||
            currentValue.date_of_event.getTime () >= current.getTime ()
          );
        }, false);
        if (courseDates.length > 0 && isUpcoming) {
          return true;
        } else {
          return false;
        }
      })
      .map (block => {
        if (courseMap[block].id != '_') {
          let current = new Date ();
          let courseDates = ImportantDates._retrieveDatesByCourse (
            global.importantDates,
            courseMap[block].id
          )
            .filter (value => {
              return value.date_of_event.getTime () >= current.getTime ();
            })
            .sort ((a, b) => {
              return Math.abs (
                current.getTime () - a.date_of_event.getTime ()
              ) > Math.abs (current.getTime () - b.date_of_event.getTime ())
                ? 1
                : -1;
            });
          return courseDates[0];
        }
      })
      .map (important => {
        return {
          ...important,
          courseName: Courses._retrieveById (
            global.courses,
            important.reference_course
          ),
        };
      });

    let chats = this.state.chatrooms;

    // console.log (this.props.courseMap);
    // console.log (assignments);
    return (
      <ScrollView
        style={[styles.scrollBack, global.user.primaryTheme ()]}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
      >

        <View style={[styles.titleBlock, global.user.borderColor ()]}>
          <Text
            style={[styles.h1, {color: global.user.getPrimaryTextColor ()}]}
          >
            Important Dates
          </Text>
        </View>
        <FlatList
          data={
            importantDates.length !== 0
              ? importantDates
              : [{
                  title: 'No Upcoming Important Dates!',
                  reference_course: '_',
                  courseName: {course: '_', _id: ''},
                  date_of_event: new Date (),
                }]
          }
          keyExtractor={(item, index) => item._id}
          renderItem={({item, index}) => {
            return (
              <ImportantDateBlock
                _navigateToPage={this._navigateToPage}
                importantDate={item}
              />
            );
          }}
        />
        <View style={[styles.titleBlock, global.user.borderColor ()]}>
          <Text
            style={[styles.h1, {color: global.user.getPrimaryTextColor ()}]}
          >
            Recent Chats
          </Text>
        </View>
        <FlatList
          data={chats}
          keyExtractor={(item, index) => item._id}
          renderItem={({item, index}) => {
            return <ChatBlock navigation={this.props.navigation} chat={item} />;
          }}
        />
        <View style={[styles.titleBlock, global.user.borderColor ()]}>
          <Text
            style={[styles.h1, {color: global.user.getPrimaryTextColor ()}]}
          >
            Recent Assignments
          </Text>
        </View>
        <FlatList
          data={assignments.length ? assignments: [
            {
              assignmentTitle: "No Recent Assignments!",
              topic: "No Topic",
              courseName: {course: "_", id: "_"},
              referenceCourse: "_",
            }
          ]}
          keyExtractor={(item, index) => item.id}
          renderItem={({item, index}) => {
            return (
              <AssignmentBlock
                _navigateToPage={this._navigateToPage}
                assignment={item}
              />
            );
          }}
        />

        <View style={[styles.titleBlock, global.user.borderColor ()]}>
          <Text
            style={[styles.h1, {color: global.user.getPrimaryTextColor ()}]}
          >
            Recent Notes
          </Text>
        </View>
        <FlatList
          data={notes}
          keyExtractor={(item, index) => item.id}
          _navigateToPage={this._navigateToPage}
          renderItem={({item, index}) => {
            return (
              <NoteBlock _navigateToPage={this._navigateToPage} note={item} />
            );
          }}
        />
        <View style={{width, height: 20}} />

      </ScrollView>
    );
  }
}

// upcoming events, recent notes, recent chatroom texts, recent alerts,  recently created assignments, recently created important dates,
// upcoming important dates, most recent announcements

const styles = StyleSheet.create ({
  titleBlock: {
    width: width,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingTop: 20,
    paddingLeft: 10,
    paddingBottom: 0,
    paddingRight: 10,
  },
  h1: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  scrollBack: {
    backgroundColor: '#f0f0f0',
  },
  gradientBlock: {
    width: width * 0.95,
    marginTop: 10,
    alignSelf: 'center',
  },
  gradientBlockChild: {
    width: width * 0.95,
    paddingTop: 5,
    paddingRight: 15,
    paddingBottom: 10,
    paddingLeft: 15,
    borderRadius: 5,
    flexDirection: 'row',
  },
});
