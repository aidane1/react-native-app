import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Text,
  Animated,
} from 'react-native';

import HeaderBar from '../../components/header';

import {ScrollView} from 'react-native-gesture-handler';

import {
  LeftIcon,
  CheckBoxOpenIcon,
  EmptyIcon,
  CheckBoxFilledIcon,
  UpIcon,
  DownIcon,
  XIcon,
} from '../../classes/icons';

import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';

import {Courses} from '../../classes/courses';

import {boxShadows} from '../../constants/boxShadows';

import Touchable from 'react-native-platform-touchable';

import Collapsible from 'react-native-collapsible';

import {Day} from '../../classes/days';

import {ifIphoneX} from 'react-native-iphone-x-helper';

import ApexAPI from '../../http/api';

import Modal from 'react-native-modal';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

class DisplayAssignmentModal extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      isBackdropVisible: false,
      assignment: {
        course: '',
        teacher: '',
        category: '',
        title: '',
        mark: '',
        completed: '',
        grade: '',
      },
    };
  }
  render () {
    return (
      <View>
        <Modal
          onModalHide={this.modalHide}
          animationIn="zoomIn"
          animationOut="zoomOut"
          isVisible={this.state.isBackdropVisible}
          backdropColor={
            global.user.theme == 'Light' ? 'black' : 'rgba(255,255,255,0.4)'
          }
          onBackdropPress={() => this.setState ({isBackdropVisible: false})}
          propagateSwipe={true}
        >
          <View
            style={[styles.displayAssignment, global.user.secondaryTheme ()]}
          >
            <View
              style={[
                styles.assignmentModalHeader,
                global.user.secondaryTheme (),
              ]}
            >
              <Text style={{color: '#174ea6', fontSize: 16}}>Assignment</Text>
              <Touchable
                onPress={this.props.closeAssignment}
                hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
              >
                <XIcon size={30} color={global.user.getPrimaryTextColor ()} />
              </Touchable>
            </View>
            <View
              style={[
                styles.displayAssignmentModalBody,
                {height: 0, flexGrow: 1},
                global.user.secondaryTheme (),
              ]}
            >
              <ScrollView>
                <View style={styles.modalBodySection}>
                  <Text style={styles.modalBodySectionHeader}>Title</Text>
                  <Text
                    style={[
                      styles.modalBodySectionContent,
                      global.user.secondaryTextColor (),
                    ]}
                  >
                    {this.state.assignment.title}
                  </Text>
                </View>
                <View style={styles.modalBodySection}>
                  <Text style={styles.modalBodySectionHeader}>
                    Weight Category
                  </Text>
                  <Text
                    style={[
                      styles.modalBodySectionContent,
                      global.user.secondaryTextColor (),
                    ]}
                  >
                    {this.state.assignment.category}
                  </Text>
                </View>
                <View style={styles.modalBodySection}>
                  <Text style={styles.modalBodySectionHeader}>Teacher</Text>
                  <Text
                    style={[
                      styles.modalBodySectionContent,
                      global.user.secondaryTextColor (),
                    ]}
                  >
                    {this.state.assignment.teacher}
                  </Text>
                </View>
                <View style={styles.modalBodySection}>
                  <Text style={styles.modalBodySectionHeader}>Mark</Text>
                  <Text
                    style={[
                      styles.modalBodySectionContent,
                      global.user.secondaryTextColor (),
                    ]}
                  >
                    {this.state.assignment.mark}
                    {' '}
                    (
                    {this.state.assignment.grade}
                    {' '}
                    Percent)
                  </Text>
                </View>
                <View style={styles.modalBodySection}>
                  <Text style={styles.modalBodySectionHeader}>
                    Completed
                  </Text>
                  <Text
                    style={[
                      styles.modalBodySectionContent,
                      global.user.secondaryTextColor (),
                    ]}
                  >
                    {this.state.assignment.completed}
                  </Text>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

class CheckButton extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      completed: this.props.completed,
      scaleVal: new Animated.Value (1),
    };
  }
  handleClick = () => {
    if (this.state.completed) {
      this.setState ({completed: false});
    } else {
      this.setState ({completed: true});
    }
  };
  handlePressIn = () => {
    Animated.timing (this.state.scaleVal, {
      toValue: 1.05,
      duration: 100,
    }).start ();
  };
  handlePressOut = () => {
    Animated.timing (this.state.scaleVal, {
      toValue: 1,
      duration: 100,
    }).start ();
  };
  render () {
    let {scaleVal} = this.state;
    return (
      <TouchableWithoutFeedback
        onPressIn={this.handlePressIn}
        onPressOut={this.handlePressOut}
        onPress={this.handleClick}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 0}}
      >
        <Animated.View
          style={{
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 20,
            paddingRight: 20,
            transform: [{scale: scaleVal}],
          }}
        >
          {this.state.completed
            ? <CheckBoxFilledIcon size={40} color={'#558de8'} />
            : <CheckBoxOpenIcon size={40} color={'#558de8'} />}
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

class AssignmentRow extends React.Component {
  constructor (props) {
    super (props);
  }
  render () {
    return (
      <View
        style={
          this.props.last ? styles.assignmentRowLast : styles.assignmentRow
        }
      >
        <View style={styles.assignmentCompleted}>
          <CheckButton completed={this.props.assignment.completed == 'yes'} />
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.openAssignment (this.props.assignment);
          }}
          style={{width: 0, flexGrow: 1, flexDirection: 'row'}}
        >
          <View style={styles.assignmentInfo}>
            <View style={styles.assignmentTitle}>
              <Text
                style={{
                  fontSize: 16,
                  color: global.user.getSecondaryTextColor (),
                }}
                numberOfLines={1}
              >
                {this.props.assignment.title}
              </Text>
            </View>
            <View style={styles.assignmentDue} numberOfLines={1}>
              <Text
                style={{
                  fontSize: 14,
                  color: global.user.getTertiaryTextColor (),
                }}
              >
                {this.props.assignment.mark}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
class AssignmentBubble extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      collapsed: true,
    };
  }
  toggleCollapsed = () => {
    this.setState ({collapsed: !this.state.collapsed});
  };
  render () {
    return (
      <View
        style={[
          styles.assignmentBubble,
          boxShadows.boxShadow3,
          global.user.secondaryTheme (),
        ]}
      >
        <View style={styles.assignmentBubbleHeader}>
          <Text style={{color: '#174ea6', fontSize: 30}}>
            {this.props.title}
          </Text>
        </View>
        <Touchable onPress={this.toggleCollapsed}>
          <View
            style={{
              padding: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: global.user.getSecondaryTextColor (),
              }}
            >
              Assignments
            </Text>
            <View>
              {this.state.collapsed
                ? <DownIcon
                    color={global.user.getPrimaryTextColor ()}
                    size={18}
                  />
                : <UpIcon
                    color={global.user.getPrimaryTextColor ()}
                    size={18}
                  />}
            </View>
          </View>
        </Touchable>
        <Collapsible collapsed={this.state.collapsed}>
          {this.props.assignments.map ((assignment, index, array) => {
            return (
              <AssignmentRow
                openAssignment={this.props.openAssignment}
                closeAssignment={this.closeAssignment}
                key={'assignment_' + index}
                last={index == array.length - 1}
                assignment={assignment}
              />
            );
          })}
        </Collapsible>
      </View>
    );
  }
}

export default class SchoolAssignmentsScreen extends React.Component {
  constructor (props) {
    super (props);
    this.props = props;
    this.state = {
      updated: false,
      assignments: {},
    };
    this.displayModal = React.createRef ();
  }

  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };
  openAssignment = assignment => {
    this.displayModal.current.setState ({
      assignment,
      isBackdropVisible: true,
    });
  };
  closeAssignment = () => {
    this.displayModal.current.setState ({
      isBackdropVisible: false,
    });
  };
  componentDidMount () {
    let api = new ApexAPI (global.user);
    api
      .get (
        `district-assignments?username=${global.user.username}&password=${global.user.password}&district=sd83`
      )
      .then (data => data.json ())
      .then (data => {
        if (data.status == 'ok') {
          console.log (data.body);
          let courses = data.body.map (assignment => {
            let mark = assignment[5][0];
            let grade;
            mark = mark.split (' / ');
            if (mark.length != 2) {
              grade = 'Unknown';
            } else {
              mark = mark.map (mark => parseInt (mark));
              grade = Math.round (mark[0] / mark[1] * 100);
            }
            return {
              course: assignment[1][0],
              teacher: assignment[0][0],
              category: assignment[3][0],
              title: assignment[4][0],
              mark: assignment[5][0],
              completed: assignment[6][0],
              grade,
            };
          });
          let assignments = {};
          courses.forEach (course => {
            if (assignments[course.course]) {
              assignments[course.course].children.push (course);
            } else {
              assignments[course.course] = {children: [course], marks: {}};
            }
          });
          for (var key in assignments) {
            let marks = {};
            assignments[key].children.forEach (assignment => {
              if (assignment.grade !== 'Unknown') {
                if (marks[assignment.category]) {
                  marks[assignment.category].push (assignment.grade);
                } else {
                  marks[assignment.category] = [assignment.grade];
                }
              }
            });
            for (var key2 in marks) {
              let length = marks[key2].length;
              marks[key2] = marks[key2].reduce ((accumulator, currentVal) => {
                return (accumulator += currentVal);
              });
              marks[key2] /= length;
            }
            assignments[key].marks = marks;
          }
          this.setState ({assignments, updated: true});
        }
      });
  }
  render () {
    let {assignments} = this.state;
    return (
      <View style={[styles.container, global.user.primaryTheme ()]}>
        <HeaderBar
          iconLeft={
            <Touchable onPress={() => this.props.navigation.goBack ()}>
              <LeftIcon size={28} />
            </Touchable>
          }
          iconRight={<EmptyIcon width={28} height={32} />}
          width={width}
          height={60}
          title="School Assignments"
        />
        <View style={[styles.bodyHolder, global.user.primaryTheme ()]}>
          <ScrollView>
            {this.state.updated
              ? Object.keys (assignments).map ((key, index) => {
                  return (
                    <AssignmentBubble
                      key={'bubble_' + key}
                      assignments={assignments[key].children}
                      marks={assignments[key].marks}
                      title={key}
                      openAssignment={this.openAssignment}
                      closeAssignment={this.closeAssignment}
                    />
                  );
                })
              : <UIActivityIndicator
                  color={global.user.getPrimaryTextColor ()}
                  count={12}
                  size={80}
                  style={{marginTop: 80}}
                />}
          </ScrollView>
        </View>
        <DisplayAssignmentModal
          closeAssignment={this.closeAssignment}
          ref={this.displayModal}
          parent={this}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create ({
  container: {
    width,
    flexGrow: 1,
    backgroundColor: '#f0f0f0',
  },
  bodyHolder: {
    zIndex: 1,
    height: ifIphoneX (height - 80, height - 60),
  },
  assignmentBubble: {
    backgroundColor: 'white',
    margin: 10,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 10,
  },
  assignmentBubbleHeader: {
    paddingBottom: 12,
    borderBottomColor: '#1967d2',
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
  },
  assignmentRow: {
    height: 70,
    borderBottomColor: 'rgb(210,210,210)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingLeft: 0,
    paddingRight: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  assignmentRowLast: {
    height: 70,
    paddingRight: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  assignmentInfo: {
    width: 0,
    flexGrow: 1,
  },
  assignmentTitle: {
    marginBottom: 5,
    flexDirection: 'row',
  },
  assignmentModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomColor: 'rgb(210,210,210)',
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
  },
  assignmentModalFooter: {
    flexGrow: 1,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  assignmentModalBody: {
    height: height * 0.9 - 60 - 70,
  },
  displayAssignment: {
    height: height * 0.5,
    backgroundColor: 'white',
    overflow: 'hidden',
    flexDirection: 'column',
  },
  modalBodySection: {
    paddingLeft: 30,
    marginTop: 25,
    marginBottom: 10,
    paddingRight: 30,
  },
  modalBodySectionHeader: {
    color: '#174ea6',
    fontSize: 18,
    fontWeight: '500',
  },
  modalBodySectionContent: {
    fontSize: 14,
    marginLeft: 10,
    marginTop: 5,
  },
});
