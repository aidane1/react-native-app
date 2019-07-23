import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Text,
  Image,
  Animated,
  Modal as ReactModal,
  Keyboard,
  Easing,
  TextInput,
  Alert,
} from 'react-native';

import HeaderBar from '../../components/header';

import {
  LeftIcon,
  PlusIcon,
  CheckBoxFilledIcon,
  EmptyIcon,
  CheckBoxOpenIcon,
  XIcon,
  VerticalEllipsisIcon,
  LightBulbIcon,
  TrashIcon,
  SchoolAssignmentsIcon,
  BeforeSchoolIcon,
  LunchTimeIcon,
  AfterSchoolIcon,
} from '../../classes/icons';

import {ScrollView} from 'react-native-gesture-handler';

import {boxShadows} from '../../constants/boxShadows';

import {Assignment, Assignments} from '../../classes/assignments';

import {Note, Notes} from '../../classes/notes';

import {Topic, Topics} from '../../classes/topics';

import Touchable from 'react-native-platform-touchable';

import Modal from 'react-native-modal';

import {TextField} from 'react-native-material-textfield';

import ApexAPI from '../../http/api';

import {LinearGradient} from 'expo-linear-gradient';

import {Dropdown} from 'react-native-material-dropdown';

import moment from 'moment';

import ImageViewer from 'react-native-image-zoom-viewer';

import ImageBar from '../../components/imagePicker';

import ChatRoom from './chatroom';

import {ifIphoneX} from 'react-native-iphone-x-helper';

import ActionSheet from 'react-native-actionsheet';

import * as Haptics from 'expo-haptics';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

class CheckButton extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      completed: global.completedAssignments.indexOf (
        this.props.assignment.id
      ) >= 0,
      scaleVal: new Animated.Value (1),
    };
  }
  handleClick = () => {
    // Haptics.selectionAsync();
    // Haptics.notificationAsync(Haptics.ImpactFeedbackStyle.Error);
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    if (this.state.completed) {
      global.completedAssignments = global.completedAssignments.filter (id => {
        return id !== this.props.assignment.id;
      });
      Assignments._removeCompletedToStorage (this.props.assignment.id);
      this.setState ({completed: false});
    } else {
      global.completedAssignments.push (this.props.assignment.id);
      Assignments._addCompletedToStorage (this.props.assignment.id);
      this.setState ({completed: true});
    }
  };
  handlePressIn = () => {
    Haptics.impactAsync (Haptics.ImpactFeedbackStyle.Light);
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

class TopicDropDown extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      topic: '_',
      topicType: 'id',
    };
  }
  updateTopic = topic => {
    this.setState ({topic, topicType: topic == '__new__' ? 'string' : 'id'});
    this.props.handleInput ({topic: this.state});
  };
  handleTextInput = text => {
    this.props.handleInput ({
      topic: {topic: text['topic'], topicType: 'string'},
    });
    this.setState ({topic: text['topic'], topicType: 'string'});
  };
  render () {
    let topicsList = Topics._MakeCourseTopicList (
      this.props.course,
      global.topics
    );
    let data = [
      ...topicsList.map (topic => {
        return {label: topic.topic, value: topic.id};
      }),
      {label: 'No Topic', value: '_'},
      {label: 'New Topic', value: '__new__'},
    ];
    return this.state.topicType == 'id'
      ? <View>
          <Dropdown
            label="Topic"
            onChangeText={this.updateTopic}
            animationDuration={100}
            textColor={global.user.getSecondaryTextColor ()}
            baseColor={global.user.getTertiaryTextColor ()}
            pickerStyle={global.user.primaryTheme ()}
            data={data}
          />
        </View>
      : <ModalInput
          focused={true}
          stateKey="topic"
          handleInput={this.handleTextInput}
          textColor={global.user.getSecondaryTextColor ()}
          baseColor={global.user.getTertiaryTextColor ()}
          label="New Topic"
          multiline={false}
        />;
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
          <CheckButton assignment={this.props.assignment} />
        </View>
        <View
          style={{
            flexGrow: 1,
            width: 0,
            paddingRight: 20,
            flexDirection: 'row',
          }}
        >
          <Touchable
            onPress={() => {
              this.props.openAssignment (this.props.assignment);
            }}
            style={{width: 0, flexGrow: 1, flexDirection: 'row', zIndex: 2}}
          >
            <View style={[styles.assignmentInfo, {overflow: 'hidden'}]}>
              <View style={styles.assignmentTitle}>
                <Text
                  style={{
                    fontSize: 16,
                    color: global.user.getSecondaryTextColor (),
                  }}
                  numberOfLines={1}
                >
                  {this.props.assignment.assignmentTitle}
                </Text>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}
                numberOfLines={1}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 14,
                    color: global.user.getTertiaryTextColor (),
                  }}
                >
                  {this.props.assignment.dueDate}
                </Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <LightBulbIcon
                    size={14}
                    color={global.user.getTertiaryTextColor ()}
                  />
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 12,
                      color: this.props.assignment.userVote == -1
                        ? '#e03634'
                        : this.props.assignment.userVote == 1
                            ? '#20d67b'
                            : global.user.getTertiaryTextColor (),
                      marginLeft: 5,
                    }}
                  >
                    {this.props.assignment.helpful == 0 &&
                      this.props.assignment.unhelpful == 0
                      ? 'Unkown % '
                      : `${Math.round (this.props.assignment.helpful / (this.props.assignment.helpful + this.props.assignment.unhelpful) * 100)}% `}
                    Helpful
                  </Text>
                </View>

              </View>
            </View>
          </Touchable>
          <View
            style={{
              zIndex: 1,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <Touchable
              onPress={() =>
                this.props.showActionSheet (
                  this.props.assignment,
                  'assignment'
                )}
              hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}
            >
              <VerticalEllipsisIcon
                size={20}
                color={global.user.getTertiaryTextColor ()}
              />
            </Touchable>

          </View>
        </View>
      </View>
    );
  }
}

class CustomActionSheet extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      resource: {},
      options: [],
      type: '_',
    };
    this.actionSheet = React.createRef ();
  }
  show (resource, type) {
    let assignmentOptions = [
      'Open',
      'Vote as Helpful',
      'Vote as Unhelpful',
      'Report',
      'Cancel',
    ];
    let noteOptions = [
      'Open',
      'Vote as Helpful',
      'Vote as Unhelpful',
      'Report',
      'Cancel',
    ];
    if (
      global.user.permission_level >= 3 ||
      resource.uploaded_by == global.user.accountId
    ) {
      assignmentOptions[3] = 'Delete';
      noteOptions[3] = 'Delete';
    }
    this.setState (
      {
        options: this.state.type == 'assignment'
          ? assignmentOptions
          : noteOptions,
        resource,
        type,
      },
      () => {
        this.actionSheet.current.show ();
      }
    );
  }
  actionSheetAction = index => {
    if (
      this.state.type == 'assignment' &&
      this.state.resource.id &&
      this.state.resource.id != '_'
    ) {
      let api = new ApexAPI (global.user);
      switch (index) {
        case 0:
          this.props.openAssignment (this.state.resource);
          break;
        case 1:
          Haptics.notificationAsync (Haptics.ImpactFeedbackStyle.Success);
          api
            .get (`vote/assignments/${this.state.resource.id}?vote=helpful`)
            .then (data => data.json ())
            .then (async data => {
              if (data.status == 'ok') {
                global.assignments = global.assignments.map (assignment => {
                  if (assignment.id == data.body._id) {
                    assignment.helpful = data.body.helpful_votes.length;
                    assignment.unhelpful = data.body.unhelpful_votes.length;
                    assignment.userVote = data.body.helpful_votes.indexOf (
                      global.user.id
                    ) >= 0
                      ? 1
                      : data.body.unhelpful_votes.indexOf (global.user.id) >= 0
                          ? -1
                          : 0;
                    return assignment;
                  } else {
                    return assignment;
                  }
                });
                await Assignments._saveToStorage (global.assignments);
                let assignments = [...this.props.parent.state.assignments];
                setTimeout (() => {
                  this.props.parent.setState ({assignments});
                }, 0);
              } else {
                Alert.alert (
                  'Error',
                  res.body,
                  [
                    {
                      text: 'Try Again',
                      onPress: () => this.createAssignment (),
                    },
                    {
                      text: 'Cancel',
                      onPress: () => {
                        this.setState ({
                          isBackdropVisible: false,
                          images: [],
                        });
                      },
                      style: 'cancel',
                    },
                  ],
                  {cancelable: false}
                );
              }
            })
            .catch (e => {
              console.log (e);
              if (e.message == "JSON Parse error: Unrecognized token '<'") {
                Alert.alert (
                  'Connection Error',
                  'Unable to connect to the server',
                  [
                    {text: 'Try Again', onPress: () => this.onPress ()},
                    {
                      text: 'Cancel',
                      onPress: () => {
                        console.log ('cancelled');
                      },
                      style: 'cancel',
                    },
                  ],
                  {cancelable: false}
                );
              }
            });
          break;
        case 2:
          Haptics.notificationAsync (Haptics.ImpactFeedbackStyle.Error);
          api
            .get (`vote/assignments/${this.state.resource.id}?vote=unhelpful`)
            .then (data => data.json ())
            .then (async data => {
              if (data.status == 'ok') {
                global.assignments = global.assignments.map (assignment => {
                  if (assignment.id == data.body._id) {
                    assignment.helpful = data.body.helpful_votes.length;
                    assignment.unhelpful = data.body.unhelpful_votes.length;
                    assignment.userVote = data.body.helpful_votes.indexOf (
                      global.user.id
                    ) >= 0
                      ? 1
                      : data.body.unhelpful_votes.indexOf (global.user.id) >= 0
                          ? -1
                          : 0;
                    return assignment;
                  } else {
                    return assignment;
                  }
                });
                await Assignments._saveToStorage (global.assignments);
                let assignments = [...this.props.parent.state.assignments];
                setTimeout (() => {
                  this.props.parent.setState ({assignments});
                }, 0);
              } else {
                Alert.alert (
                  'Error',
                  res.body,
                  [
                    {
                      text: 'Try Again',
                      onPress: () => this.createAssignment (),
                    },
                    {
                      text: 'Cancel',
                      onPress: () => {
                        this.setState ({
                          isBackdropVisible: false,
                          images: [],
                        });
                      },
                      style: 'cancel',
                    },
                  ],
                  {cancelable: false}
                );
              }
            })
            .catch (e => {
              console.log (e);
              if (e.message == "JSON Parse error: Unrecognized token '<'") {
                Alert.alert (
                  'Connection Error',
                  'Unable to connect to the server',
                  [
                    {text: 'Try Again', onPress: () => this.onPress ()},
                    {
                      text: 'Cancel',
                      onPress: () => {
                        console.log ('cancelled');
                      },
                      style: 'cancel',
                    },
                  ],
                  {cancelable: false}
                );
              }
            });
          break;
        case 3:
          if (
            global.user.permission_level >= 3 ||
            this.state.resource.uploaded_by == global.user.accountId
          ) {
            api
              .delete (`assignments/${this.state.resource.id}`)
              .then (data => data.json ())
              .then (async data => {
                if (data.status == 'ok') {
                  global.assignments = global.assignments.filter (
                    assignment => {
                      return assignment.id != data.body._id;
                    }
                  );
                  await Assignments._saveToStorage (global.assignments);
                  let assignments = [
                    ...this.props.parent.state.assignments,
                  ].filter (assignment => assignment.id != data.body._id);
                  setTimeout (() => {
                    this.props.parent.setState ({assignments});
                  }, 0);
                } else {
                  Alert.alert (
                    'Error',
                    data.body.error,
                    [
                      {
                        text: 'Cancel',
                        onPress: () => {},
                        style: 'cancel',
                      },
                    ],
                    {cancelable: false}
                  );
                }
              })
              .catch (e => {
                console.log (e);
                if (e.message == "JSON Parse error: Unrecognized token '<'") {
                  Alert.alert (
                    'Connection Error',
                    'Unable to connect to the server',
                    [
                      {text: 'Try Again', onPress: () => this.onPress ()},
                      {
                        text: 'Cancel',
                        onPress: () => {
                          console.log ('cancelled');
                        },
                        style: 'cancel',
                      },
                    ],
                    {cancelable: false}
                  );
                }
              });
          } else {
          }
          break;
      }
    } else if (
      this.state.type == 'note' &&
      this.state.resource &&
      this.state.resource.id
    ) {
      let api = new ApexAPI (global.user);
      switch (index) {
        case 0:
          this.props.openNote (this.state.resource);
          break;
        case 1:
          Haptics.notificationAsync (Haptics.ImpactFeedbackStyle.Success);
          api
            .get (`vote/notes/${this.state.resource.id}?vote=helpful`)
            .then (data => data.json ())
            .then (async data => {
              if (data.status == 'ok') {
                global.notes = global.notes.map (note => {
                  if (note.id == data.body._id) {
                    note.helpful = data.body.helpful_votes.length;
                    note.unhelpful = data.body.unhelpful_votes.length;
                    note.userVote = data.body.helpful_votes.indexOf (
                      global.user.id
                    ) >= 0
                      ? 1
                      : data.body.unhelpful_votes.indexOf (global.user.id) >= 0
                          ? -1
                          : 0;
                    return note;
                  } else {
                    return note;
                  }
                });
                await Notes._saveToStorage (global.notes);
                let notes = [...this.props.parent.state.notes];
                setTimeout (() => {
                  this.props.parent.setState ({notes});
                }, 0);
              } else {
                Alert.alert (
                  'Error',
                  res.body,
                  [
                    {
                      text: 'Try Again',
                      onPress: () => this.createAssignment (),
                    },
                    {
                      text: 'Cancel',
                      onPress: () => {
                        this.setState ({
                          isBackdropVisible: false,
                          images: [],
                        });
                      },
                      style: 'cancel',
                    },
                  ],
                  {cancelable: false}
                );
              }
            })
            .catch (e => {
              console.log (e);
              if (e.message == "JSON Parse error: Unrecognized token '<'") {
                Alert.alert (
                  'Connection Error',
                  'Unable to connect to the server',
                  [
                    {text: 'Try Again', onPress: () => this.onPress ()},
                    {
                      text: 'Cancel',
                      onPress: () => {
                        console.log ('cancelled');
                      },
                      style: 'cancel',
                    },
                  ],
                  {cancelable: false}
                );
              }
            });
          break;
        case 2:
          Haptics.notificationAsync (Haptics.ImpactFeedbackStyle.Error);
          api
            .get (`vote/notes/${this.state.resource.id}?vote=unhelpful`)
            .then (data => data.json ())
            .then (async data => {
              if (data.status == 'ok') {
                global.notes = global.notes.map (note => {
                  if (note.id == data.body._id) {
                    note.helpful = data.body.helpful_votes.length;
                    note.unhelpful = data.body.unhelpful_votes.length;
                    note.userVote = data.body.helpful_votes.indexOf (
                      global.user.id
                    ) >= 0
                      ? 1
                      : data.body.unhelpful_votes.indexOf (global.user.id) >= 0
                          ? -1
                          : 0;
                    return note;
                  } else {
                    return note;
                  }
                });
                await Notes._saveToStorage (global.notes);
                let notes = [...this.props.parent.state.notes];
                setTimeout (() => {
                  this.props.parent.setState ({notes});
                }, 0);
              } else {
                Alert.alert (
                  'Error',
                  res.body,
                  [
                    {
                      text: 'Try Again',
                      onPress: () => this.createAssignment (),
                    },
                    {
                      text: 'Cancel',
                      onPress: () => {
                        this.setState ({
                          isBackdropVisible: false,
                          images: [],
                        });
                      },
                      style: 'cancel',
                    },
                  ],
                  {cancelable: false}
                );
              }
            })
            .catch (e => {
              console.log (e);
              if (e.message == "JSON Parse error: Unrecognized token '<'") {
                Alert.alert (
                  'Connection Error',
                  'Unable to connect to the server',
                  [
                    {text: 'Try Again', onPress: () => this.onPress ()},
                    {
                      text: 'Cancel',
                      onPress: () => {
                        console.log ('cancelled');
                      },
                      style: 'cancel',
                    },
                  ],
                  {cancelable: false}
                );
              }
            });
          break;
        case 3:
          if (
            global.user.permission_level >= 3 ||
            this.state.resource.uploaded_by == global.user.accountId
          ) {
            api
              .delete (`notes/${this.state.resource.id}`)
              .then (data => data.json ())
              .then (async data => {
                if (data.status == 'ok') {
                  global.notes = global.notes.filter (note => {
                    return note.id != data.body._id;
                  });
                  await Notes._saveToStorage (global.notes);
                  let notes = [...this.props.parent.state.notes].filter (
                    note => note.id != data.body._id
                  );
                  setTimeout (() => {
                    this.props.parent.setState ({notes});
                  }, 0);
                } else {
                  Alert.alert (
                    'Error',
                    data.body.error,
                    [
                      {
                        text: 'Cancel',
                        onPress: () => {},
                        style: 'cancel',
                      },
                    ],
                    {cancelable: false}
                  );
                }
              })
              .catch (e => {
                console.log (e);
                if (e.message == "JSON Parse error: Unrecognized token '<'") {
                  Alert.alert (
                    'Connection Error',
                    'Unable to connect to the server',
                    [
                      {text: 'Try Again', onPress: () => this.onPress ()},
                      {
                        text: 'Cancel',
                        onPress: () => {
                          console.log ('cancelled');
                        },
                        style: 'cancel',
                      },
                    ],
                    {cancelable: false}
                  );
                }
              });
          } else {
          }
          break;
      }
    }
  };
  render () {
    return (
      <ActionSheet
        ref={this.actionSheet}
        options={this.state.options}
        cancelButtonIndex={4}
        destructiveButtonIndex={3}
        onPress={this.actionSheetAction}
      />
    );
  }
}

class AssignmentBubble extends React.Component {
  constructor (props) {
    super (props);
  }
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
        {this.props.assignments.map ((assignment, index, array) => {
          return (
            <AssignmentRow
              openAssignment={this.props.openAssignment}
              closeAssignment={this.props.closeAssignment}
              key={'assignment_' + index}
              last={index == array.length - 1}
              assignment={assignment}
              completed={this.props.completedAssignments}
              showActionSheet={this.props.showActionSheet}
            />
          );
        })}
      </View>
    );
  }
}

class CreateButton extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      scaleVal: new Animated.Value (1),
    };
  }
  handleClick = () => {
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
  onPress = () => {
    this.props.onPress ();
  };
  render () {
    let {scaleVal} = this.state;
    return (
      <Touchable
        onPressIn={this.handleClick}
        onPressOut={this.handlePressOut}
        style={{width: 140}}
        onPress={this.onPress}
      >
        <Animated.View
          style={[
            styles.createButton,
            boxShadows.boxShadow2,
            {transform: [{scale: scaleVal}]},
          ]}
        >
          <PlusIcon size={20} style={{paddingTop: 2}} />
          <Text style={{color: 'white', fontSize: 16}}>Create</Text>
        </Animated.View>
      </Touchable>
    );
  }
}

class ConfirmButton extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      disabled: true,
    };
  }
  render () {
    return this.state.disabled
      ? <Text style={styles.confirmButton}>Create</Text>
      : <Touchable onPress={this.props.onPress}>
          <Text style={styles.confirmButtonAllowed}>Create</Text>
        </Touchable>;
  }
}

class ModalInput extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      value: '',
    };
    this.TextField = React.createRef ();
  }
  componentDidMount () {
    if (this.props.focused) {
      this.TextField.current.focus ();
    }
  }
  updateText = value => {
    let info = {};
    info[this.props.stateKey] = value;
    this.props.handleInput (info);
    this.setState ({value});
  };
  render () {
    return (
      <TextField
        ref={this.TextField}
        label={this.props.label}
        multiline={
          this.props.multiline !== undefined ? this.props.multiline : true
        }
        value={this.state.value}
        textColor={this.props.textColor}
        baseColor={this.props.baseColor}
        onChangeText={value => this.updateText (value)}
      />
    );
  }
}

class ImageViewerModal extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      isBackdropVisible: false,
      index: 0,
      images: [
        {
          url: 'https://www.apexschools.co/info/5d1d2f28c7563c6ce08a960b/courses/5d216334eeb4d72ef19de8dc/resources/5d24f5ef288dda6d00eefcc8/1562703343368.jpg',
        },
        {
          url: 'https://www.apexschools.co/info/5d1d2f28c7563c6ce08a960b/courses/5d216334eeb4d72ef19de8dc/resources/5d24f5f7288dda6d00eefcca/1562703351641.jpg',
        },
      ],
    };
  }
  swipeDown = () => {
    this.setState ({isBackdropVisible: false});
  };
  render () {
    return (
      <View>
        <ReactModal
          visible={this.state.isBackdropVisible}
          transparent={true}
          onRequestClose={() => this.setState ({modalVisible: false})}
        >
          <ImageViewer
            onSwipeDown={this.swipeDown}
            enableSwipeDown={true}
            enablePreload={true}
            index={this.state.index}
            imageUrls={this.state.images}
          />
        </ReactModal>
      </View>
    );
  }
}

class DisplayAssignmentModal extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      isBackdropVisible: false,
      shouldOpenImageModal: false,
      images: [],
      imageURLs: [],
      imageIndex: 0,
      assignment: {
        assignmentTitle: '',
        dueDate: new Date (),
        topic: '_',
        assignmentNotes: '',
        resources: [],
        id: '_',
      },
    };
  }
  modalHide = () => {
    if (this.state.shouldOpenImageModal) {
      this.props.imageViewer.current.setState ({
        isBackdropVisible: true,
        images: this.state.imageURLs,
        index: this.state.imageIndex,
      });
    }
  };
  openImageViewer = (resources, index) => {
    let urls = resources.map (resource => {
      return {url: `https://www.apexschools.co${resource.path}`};
    });
    this.setState ({
      shouldOpenImageModal: true,
      isBackdropVisible: false,
      imageURLs: urls,
      imageIndex: index,
    });
  };
  pushResultImage = async resource => {
    let api = new ApexAPI (global.user);
    api
      .put (
        `assignments/${this.state.assignment.id}?updateMethods=$push&$push=response_resources`,
        {
          response_resources: resource._id,
        }
      )
      .catch (e => {
        console.log (e);
        if (e.message == "JSON Parse error: Unrecognized token '<'") {
          Alert.alert (
            'Connection Error',
            'Unable to connect to the server',
            [
              {
                text: 'Try Again',
                onPress: () => this.pushResultImage (resource),
              },
              {
                text: 'Cancel',
                onPress: () => {
                  console.log ('cancelled');
                },
                style: 'cancel',
              },
            ],
            {cancelable: false}
          );
        }
      });
  };
  imageFunction = async result => {
    this.state.images.push (result);
    this.setState ({images: this.state.images});
    this.pushResultImage (result);
  };
  render () {
    let topicsMap = Topics._makeTopicMap (global.topics);
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
                onPress={this.props.parent.closeAssignment}
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
                    {this.state.assignment.assignmentTitle}
                  </Text>
                </View>
                <View style={styles.modalBodySection}>
                  <Text style={styles.modalBodySectionHeader}>Topic</Text>
                  <Text
                    style={[
                      styles.modalBodySectionContent,
                      global.user.secondaryTextColor (),
                    ]}
                  >
                    {this.state.assignment.topic == '_'
                      ? 'No Topic'
                      : topicsMap[this.state.assignment.topic].topic}
                  </Text>
                </View>
                <View style={styles.modalBodySection}>
                  <Text style={styles.modalBodySectionHeader}>Due</Text>
                  <Text
                    style={[
                      styles.modalBodySectionContent,
                      global.user.secondaryTextColor (),
                    ]}
                  >
                    {this.state.assignment.dueDate}
                  </Text>
                </View>
                <View style={styles.modalBodySection}>
                  <Text style={styles.modalBodySectionHeader}>Notes</Text>
                  <Text
                    style={[
                      styles.modalBodySectionContent,
                      global.user.secondaryTextColor (),
                    ]}
                  >
                    {this.state.assignment.assignmentNotes}
                  </Text>
                </View>
                <View style={styles.modalBodySection}>
                  <Text style={styles.modalBodySectionHeader}>
                    Date Created
                  </Text>
                  <Text
                    style={[
                      styles.modalBodySectionContent,
                      global.user.secondaryTextColor (),
                    ]}
                  >
                    {moment (this.state.assignment.date).format (
                      'MMMM Do YYYY, h:mm:ss a'
                    )}
                  </Text>
                </View>
                <View style={styles.modalBodySection}>
                  <Text
                    style={[styles.modalBodySectionHeader, {marginBottom: 10}]}
                  >
                    Images
                  </Text>
                  <View style={{flexDirection: 'column', alignItems: 'center'}}>
                    {this.state.assignment.resources.map (
                      (resource, index, array) => {
                        return (
                          <Touchable
                            key={'image_' + index}
                            onPress={() => {
                              this.openImageViewer (array, index);
                            }}
                          >
                            <Image
                              source={{
                                uri: `https://www.apexschools.co${resource.path}`,
                              }}
                              style={{
                                width: 200,
                                height: resource.height / resource.width * 200,
                                marginTop: 10,
                                marginBottom: 10,
                              }}
                            />
                          </Touchable>
                        );
                      }
                    )}
                  </View>
                </View>
                <View style={[styles.modalBodySection]}>
                  <Text
                    style={[styles.modalBodySectionHeader, {marginBottom: 20}]}
                  >
                    Response Images
                  </Text>
                  <View style={{flexDirection: 'column', alignItems: 'center'}}>
                    {this.state.images.map ((resource, index, array) => {
                      return (
                        <Touchable
                          key={'image_' + index}
                          onPress={() => {
                            this.openImageViewer (array, index);
                          }}
                        >
                          <Image
                            source={{
                              uri: `https://www.apexschools.co${resource.path}`,
                            }}
                            style={{
                              width: 200,
                              height: resource.height / resource.width * 200,
                              marginTop: 10,
                              marginBottom: 10,
                            }}
                          />
                        </Touchable>
                      );
                    })}
                  </View>
                  <ImageBar
                    displayImagesInline={false}
                    onImageRecieved={this.imageFunction}
                    displayCameraRollInline={false}
                    path={`/courses/${global.courseInfoCourse.id}/assignments`}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

class AssignmentModal extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      isBackdropVisible: false,
      images: [],
      topics: Topics._MakeCourseTopicList (
        global.courseInfoCourse.id,
        global.topics
      ),
      assignment: '',
      notes: '',
      due: '',
      topic: {
        topicType: 'id',
        topic: '_',
      },
      keyboardHeight: new Animated.Value (0),
    };
    this.assignment = React.createRef ();
    this.notes = React.createRef ();
    this.due = React.createRef ();
    this.topic = React.createRef ();
    this.create = React.createRef ();
  }
  componentWillMount () {
    this.keyboardWillShowSub = Keyboard.addListener (
      'keyboardWillShow',
      this.keyboardWillShow
    );
    this.keyboardWillHideSub = Keyboard.addListener (
      'keyboardWillHide',
      this.keyboardWillHide
    );
  }
  componentWillUnmount () {
    this.keyboardWillShowSub.remove ();
    this.keyboardWillHideSub.remove ();
  }
  keyboardWillShow = event => {
    Animated.timing (this.state.keyboardHeight, {
      toValue: -100,
      easing: Easing.bezier (0.46, 0.52, 0.57, 1.02),
      duration: 250,
    }).start ();
  };
  keyboardWillHide = event => {
    Animated.timing (this.state.keyboardHeight, {
      toValue: 0,
      easing: Easing.bezier (0.46, 0.52, 0.57, 1.02),
      duration: 250,
    }).start ();
  };
  handleInput = info => {
    this.setState (info, () => {
      if (this.state.assignment && this.state.topic && this.state.due) {
        this.create.current.setState ({disabled: false});
      }
    });
  };

  imageFunction = result => {
    this.state.images.push (result);
  };

  createAssignment () {
    let api = new ApexAPI (global.user);
    let postObject = {
      assignment_title: this.state.assignment,
      due_date: this.state.due,
      assignment_notes: this.state.notes,
      reference_course: global.courseInfoCourse.id,
      resources: this.state.images.map (image => image._id),
    };
    if (this.state.topic.topicType == 'id' && this.state.topic.topic != '_') {
      postObject.topic = this.state.topic.topic;
    }
    api
      .post ('assignments?populate=resources', postObject)
      .then (res => res.json ())
      .then (async res => {
        this.setState ({isBackdropVisible: false, images: []});
        if (res.status == 'ok') {
          let assignment = {
            topic: res.body.topic || '_',
            id: res.body._id,
            assignmentTitle: res.body.assignment_title,
            assignmentNotes: res.body.assignment_notes,
            dueDate: res.body.due_date,
            date: res.body.date,
            referenceCourse: res.body.reference_course,
            resources: res.body.resources,
            helpful: res.body.helpful_votes.length,
            unhelpful: res.body.unhelpful_votes.length,
            uploaded_by: res.body.uploaded_by,
            userVote: res.body.helpful_votes.indexOf (global.user.id) >= 0
              ? 1
              : res.body.unhelpful_votes.indexOf (global.user.id) >= 0 ? -1 : 0,
          };
          assignment = new Assignment (assignment);
          let assignments = [...this.props.parent.state.assignments];
          assignments.push (assignment);
          global.assignments.push (assignment);
          let storageAssignments = await Assignments._retrieveFromStorage ();
          storageAssignments.push (assignment);
          await Assignments._saveToStorage (storageAssignments);
          setTimeout (() => {
            this.props.parent.setState ({assignments});
          }, 500);
        } else {
          Alert.alert (
            'Error',
            res.body,
            [
              {text: 'Try Again', onPress: () => this.createAssignment ()},
              {
                text: 'Cancel',
                onPress: () => {
                  this.setState ({
                    isBackdropVisible: false,
                    images: [],
                  });
                },
                style: 'cancel',
              },
            ],
            {cancelable: false}
          );
        }
      })
      .catch (e => {
        console.log (e);
        if (e.message == "JSON Parse error: Unrecognized token '<'") {
          Alert.alert (
            'Connection Error',
            'Unable to connect to the server',
            [
              {text: 'Try Again', onPress: () => this.createAssignment ()},
              {
                text: 'Cancel',
                onPress: () => {
                  console.log ('cancelled');
                },
                style: 'cancel',
              },
            ],
            {cancelable: false}
          );
        }
      });
  }
  onPress = () => {
    this.create.current.setState ({disabled: true});
    if (this.state.assignment && this.state.due && this.state.topic) {
      let api = new ApexAPI (global.user);
      if (this.state.topic.topicType == 'string') {
        api
          .post ('topics', {
            topic: this.state.topic.topic,
            reference_course: global.courseInfoCourse.id,
          })
          .then (res => res.json ())
          .then (async res => {
            if (res.status == 'ok') {
              this.state.topic = {
                topicType: 'id',
                topic: res.body._id,
              };
              let topic = {
                topic: res.body.topic,
                id: res.body._id,
                course: res.body.reference_course,
              };
              topic = new Topic (topic);
              global.topics.push (topic);
              let storageTopics = await Topics._retrieveFromStorage ();
              storageTopics.push (topic);
              await Topics._saveToStorage (storageTopics);
              this.createAssignment ();
            } else {
              Alert.alert (
                'Error',
                res.body,
                [
                  {text: 'Try Again', onPress: () => this.onPress ()},
                  {
                    text: 'Cancel',
                    onPress: () => {
                      console.log ('cancelled');
                    },
                    style: 'cancel',
                  },
                ],
                {cancelable: false}
              );
            }
          })
          .catch (e => {
            console.log (e);
            if (e.message == "JSON Parse error: Unrecognized token '<'") {
              Alert.alert (
                'Connection Error',
                'Unable to connect to the server',
                [
                  {text: 'Try Again', onPress: () => this.onPress ()},
                  {
                    text: 'Cancel',
                    onPress: () => {
                      console.log ('cancelled');
                    },
                    style: 'cancel',
                  },
                ],
                {cancelable: false}
              );
            }
          });
      } else {
        this.createAssignment ();
      }
    }
  };
  handleClear = () => {
    this.assignment.current.setState ({value: ''});
    this.due.current.setState ({value: ''});
    this.notes.current.setState ({value: ''});
    this.images = [];
    this.topic = {
      topic: '_',
      topicType: 'id',
    };
  };
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
          <Animated.View
            style={{
              position: 'relative',
              transform: [{translateY: this.state.keyboardHeight}],
            }}
          >
            <View
              style={[styles.newAssignmentModal, global.user.secondaryTheme ()]}
            >
              <View style={styles.assignmentModalHeader}>
                <Text style={{color: '#174ea6', fontSize: 16}}>Assignment</Text>
                <Touchable
                  onPress={this.props.parent.closeModal}
                  hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
                >
                  <XIcon size={30} color={global.user.getPrimaryTextColor ()} />
                </Touchable>
              </View>
              <View style={styles.assignmentModalBody}>
                <ScrollView style={{padding: 20}}>
                  <Text
                    style={{
                      color: 'rgb(190,190,190)',
                      fontSize: 14,
                      fontWeight: '500',
                    }}
                  >
                    For {this.props.course.course}
                  </Text>
                  <ModalInput
                    handleInput={this.handleInput}
                    ref={this.assignment}
                    style={{marginTop: 30}}
                    textColor={global.user.getSecondaryTextColor ()}
                    baseColor={global.user.getTertiaryTextColor ()}
                    label="Assignment"
                    stateKey={'assignment'}
                  />
                  <ModalInput
                    handleInput={this.handleInput}
                    ref={this.notes}
                    style={{marginTop: 30}}
                    textColor={global.user.getSecondaryTextColor ()}
                    baseColor={global.user.getTertiaryTextColor ()}
                    label="Instructions/Notes"
                    stateKey={'notes'}
                  />
                  <ModalInput
                    multiline={false}
                    handleInput={this.handleInput}
                    ref={this.due}
                    style={{marginTop: 30}}
                    textColor={global.user.getSecondaryTextColor ()}
                    baseColor={global.user.getTertiaryTextColor ()}
                    label="Due"
                    stateKey={'due'}
                  />
                  <TopicDropDown
                    course={this.props.parent.course.id}
                    handleInput={this.handleInput}
                    ref={this.topic}
                    topics={this.state.topics}
                  />
                  <Text
                    style={{
                      marginTop: 30,
                      marginBottom: 10,
                      fontSize: 12,
                      color: global.user.getTertiaryTextColor (),
                      opacity: 0.6,
                    }}
                  >
                    Images
                  </Text>
                  <ImageBar
                    displayImagesInline={true}
                    onImageRecieved={this.imageFunction}
                    displayCameraRollInline={false}
                    path={`/courses/${global.courseInfoCourse.id}/response_assignments`}
                  />
                </ScrollView>
              </View>
              <View style={styles.assignmentModalFooter}>
                <Touchable onPress={this.handleClear}>
                  <TrashIcon
                    color={global.user.getPrimaryTextColor ()}
                    size={26}
                    style={{marginRight: 30, padding: 20}}
                  />
                </Touchable>
                <ConfirmButton ref={this.create} onPress={this.onPress} />
              </View>
            </View>
          </Animated.View>
        </Modal>
      </View>
    );
  }
}

class NoteModal extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      isBackdropVisible: false,
      images: [],
      topics: Topics._MakeCourseTopicList (
        global.courseInfoCourse.id,
        global.topics
      ),
      note: '',
      topic: {
        topicType: 'id',
        topic: '_',
      },
      keyboardHeight: new Animated.Value (0),
    };
    this.note = React.createRef ();
    this.topic = React.createRef ();
    this.create = React.createRef ();
  }
  componentWillMount () {
    this.keyboardWillShowSub = Keyboard.addListener (
      'keyboardWillShow',
      this.keyboardWillShow
    );
    this.keyboardWillHideSub = Keyboard.addListener (
      'keyboardWillHide',
      this.keyboardWillHide
    );
  }
  componentWillUnmount () {
    this.keyboardWillShowSub.remove ();
    this.keyboardWillHideSub.remove ();
  }
  keyboardWillShow = event => {
    Animated.timing (this.state.keyboardHeight, {
      toValue: -100,
      easing: Easing.bezier (0.46, 0.52, 0.57, 1.02),
      duration: 250,
    }).start ();
  };
  keyboardWillHide = event => {
    Animated.timing (this.state.keyboardHeight, {
      toValue: 0,
      easing: Easing.bezier (0.46, 0.52, 0.57, 1.02),
      duration: 250,
    }).start ();
  };
  handleInput = info => {
    this.setState (info, () => {
      if (this.state.note && this.state.topic) {
        this.create.current.setState ({disabled: false});
      }
    });
  };

  imageFunction = result => {
    this.state.images.push (result);
  };

  createAssignment () {
    let api = new ApexAPI (global.user);
    let postObject = {
      note: this.state.note,
      resources: this.state.images.map (image => image._id),
      reference_course: global.courseInfoCourse.id,
    };
    if (this.state.topic.topicType == 'id' && this.state.topic.topic != '_') {
      postObject.topic = this.state.topic.topic;
    }
    api
      .post ('notes?populate=resources', postObject)
      .then (res => res.json ())
      .then (async res => {
        this.setState ({isBackdropVisible: false, images: [], imageIDs: []});
        if (res.status == 'ok') {
          let note = {
            topic: res.body.topic || '_',
            note: res.body.note,
            resources: res.body.resources,
            id: res.body._id,
            date: new Date (res.body.date),
            referenceCourse: global.courseInfoCourse.id,
            helpful: res.body.helpful_votes.length,
            uploaded_by: res.body.uploaded_by,
            unhelpful: res.body.unhelpful_votes.length,
            userVote: res.body.helpful_votes.indexOf (global.user.id) >= 0
              ? 1
              : res.body.unhelpful_votes.indexOf (global.user.id) >= 0 ? -1 : 0,
          };
          note = new Note (note);
          let notes = [...this.props.parent.state.notes];
          notes.push (note);
          global.notes.push (note);
          let storageNotes = await Notes._retrieveFromStorage ();
          storageNotes.push (note);
          await Notes._saveToStorage (storageNotes);
          this.setState ({isBackdropVisible: false}, () => {
            setTimeout (() => {
              this.props.parent.setState ({notes});
            }, 500);
          });
        } else {
          Alert.alert (
            'Error',
            res.body,
            [
              {text: 'Try Again', onPress: () => this.createAssignment ()},
              {
                text: 'Cancel',
                onPress: () => {
                  this.setState ({
                    isBackdropVisible: false,
                    images: [],
                    imageIDs: [],
                  });
                },
                style: 'cancel',
              },
            ],
            {cancelable: false}
          );
        }
      })
      .catch (e => {
        console.log (e);
        if (e.message == "JSON Parse error: Unrecognized token '<'") {
          Alert.alert (
            'Connection Error',
            'Unable to connect to the server',
            [
              {text: 'Try Again', onPress: () => this.createAssignment ()},
              {
                text: 'Cancel',
                onPress: () => {
                  console.log ('cancelled');
                },
                style: 'cancel',
              },
            ],
            {cancelable: false}
          );
        }
      });
  }
  onPress = () => {
    this.create.current.setState ({disabled: true});
    if (this.state.note && this.state.topic) {
      let api = new ApexAPI (global.user);
      if (this.state.topic.topicType == 'string') {
        api
          .post ('topics', {
            topic: this.state.topic.topic,
            reference_course: global.courseInfoCourse.id,
          })
          .then (res => res.json ())
          .then (async res => {
            if (res.status == 'ok') {
              this.state.topic = {
                topicType: 'id',
                topic: res.body._id,
              };
              let topic = {
                topic: res.body.topic,
                id: res.body._id,
                course: res.body.reference_course,
              };
              topic = new Topic (topic);
              global.topics.push (topic);
              let storageTopics = await Topics._retrieveFromStorage ();
              storageTopics.push (topic);
              await Topics._saveToStorage (storageTopics);
              this.createAssignment ();
            } else {
              Alert.alert (
                'Error',
                res.body,
                [
                  {text: 'Try Again', onPress: () => this.onPress ()},
                  {
                    text: 'Cancel',
                    onPress: () => {
                      console.log ('cancelled');
                    },
                    style: 'cancel',
                  },
                ],
                {cancelable: false}
              );
            }
          })
          .catch (e => {
            console.log (e);
            if (e.message == "JSON Parse error: Unrecognized token '<'") {
              Alert.alert (
                'Connection Error',
                'Unable to connect to the server',
                [
                  {text: 'Try Again', onPress: () => this.onPress ()},
                  {
                    text: 'Cancel',
                    onPress: () => {
                      console.log ('cancelled');
                    },
                    style: 'cancel',
                  },
                ],
                {cancelable: false}
              );
            }
          });
      } else {
        this.createAssignment ();
      }
    }
  };
  handleClear = () => {
    this.assignment.current.setState ({value: ''});
    this.due.current.setState ({value: ''});
    this.notes.current.setState ({value: ''});
    this.images = [];
    this.topic = {
      topic: '_',
      topicType: 'id',
    };
  };
  render () {
    return (
      <View>
        <Modal
          animationIn="zoomIn"
          animationOut="zoomOut"
          isVisible={this.state.isBackdropVisible}
          backdropColor={
            global.user.theme == 'Light' ? 'black' : 'rgba(255,255,255,0.4)'
          }
          onBackdropPress={() => this.setState ({isBackdropVisible: false})}
          propagateSwipe={true}
        >
          <Animated.View
            style={{
              position: 'relative',
              transform: [{translateY: this.state.keyboardHeight}],
            }}
          >
            <View style={[styles.newNoteModal, global.user.secondaryTheme ()]}>
              <View style={styles.assignmentModalHeader}>
                <Text style={{color: '#174ea6', fontSize: 16}}>Note</Text>
                <Touchable
                  onPress={this.props.parent.closeNoteModal}
                  hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
                >
                  <XIcon size={30} color={global.user.getPrimaryTextColor ()} />
                </Touchable>
              </View>
              <View style={styles.noteModalBody}>
                <ScrollView style={{padding: 20}}>
                  <Text
                    style={{
                      color: 'rgb(190,190,190)',
                      fontSize: 14,
                      fontWeight: '500',
                    }}
                  >
                    For {this.props.course.course}
                  </Text>
                  <ModalInput
                    handleInput={this.handleInput}
                    ref={this.note}
                    style={{marginTop: 30}}
                    textColor={global.user.getSecondaryTextColor ()}
                    baseColor={global.user.getTertiaryTextColor ()}
                    label="Note"
                    stateKey={'note'}
                  />
                  <TopicDropDown
                    course={this.props.parent.course.id}
                    handleInput={this.handleInput}
                    ref={this.topic}
                    topics={this.state.topics}
                  />
                  <Text
                    style={{
                      marginTop: 30,
                      marginBottom: 10,
                      fontSize: 12,
                      color: global.user.getTertiaryTextColor (),
                      opacity: 0.6,
                    }}
                  >
                    Images
                  </Text>
                  <ImageBar
                    displayImagesInline={true}
                    onImageRecieved={this.imageFunction}
                    displayCameraRollInline={false}
                    path={`/courses/${global.courseInfoCourse.id}/notes`}
                  />
                </ScrollView>
              </View>
              <View style={styles.assignmentModalFooter}>
                <Touchable onPress={this.handleClear}>
                  <TrashIcon
                    color={global.user.getPrimaryTextColor ()}
                    size={26}
                    style={{marginRight: 30, padding: 20}}
                  />
                </Touchable>
                <ConfirmButton ref={this.create} onPress={this.onPress} />
              </View>
            </View>
          </Animated.View>
        </Modal>
      </View>
    );
  }
}

class DisplayNoteModal extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      isBackdropVisible: false,
      shouldOpenImageModal: false,
      images: [],
      imageURLs: [],
      imageIndex: 0,
      note: {
        note: '',
        topic: '_',
        date: '',
        resources: [],
        id: '_',
      },
    };
  }
  modalHide = () => {
    if (this.state.shouldOpenImageModal) {
      this.props.imageViewer.current.setState ({
        isBackdropVisible: true,
        images: this.state.imageURLs,
        index: this.state.imageIndex,
      });
    }
  };
  openImageViewer = (resources, index) => {
    let urls = resources.map (resource => {
      return {url: `https://www.apexschools.co${resource.path}`};
    });
    this.setState ({
      shouldOpenImageModal: true,
      isBackdropVisible: false,
      imageURLs: urls,
      imageIndex: index,
    });
  };
  render () {
    let topicsMap = Topics._makeTopicMap (global.topics);
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
            <View style={styles.assignmentModalHeader}>
              <Text style={{color: '#174ea6', fontSize: 16}}>Note</Text>
              <Touchable
                onPress={this.props.parent.closeNote}
                hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
              >
                <XIcon size={30} color={global.user.getPrimaryTextColor ()} />
              </Touchable>
            </View>
            <View
              style={[
                styles.displayAssignmentModalBody,
                {height: 0, flexGrow: 1},
              ]}
            >
              <ScrollView>
                <View style={styles.modalBodySection}>
                  <Text style={styles.modalBodySectionHeader}>Note</Text>
                  <Text
                    style={[
                      styles.modalBodySectionContent,
                      global.user.secondaryTextColor (),
                    ]}
                  >
                    {this.state.note.note}
                  </Text>
                </View>
                <View style={styles.modalBodySection}>
                  <Text style={styles.modalBodySectionHeader}>Topic</Text>
                  <Text
                    style={[
                      styles.modalBodySectionContent,
                      global.user.secondaryTextColor (),
                    ]}
                  >
                    {this.state.note.topic == '_'
                      ? 'No Topic'
                      : topicsMap[this.state.note.topic].topic}
                  </Text>
                </View>
                <View style={styles.modalBodySection}>
                  <Text style={styles.modalBodySectionHeader}>
                    Date Created
                  </Text>
                  <Text
                    style={[
                      styles.modalBodySectionContent,
                      global.user.secondaryTextColor (),
                    ]}
                  >
                    {moment (this.state.note.date).format (
                      'MMMM Do YYYY, h:mm:ss a'
                    )}
                  </Text>
                </View>
                <View style={styles.modalBodySection}>
                  <Text
                    style={[styles.modalBodySectionHeader, {marginBottom: 10}]}
                  >
                    Images
                  </Text>
                  <View style={{flexDirection: 'column', alignItems: 'center'}}>
                    {this.state.note.resources.map (
                      (resource, index, array) => {
                        return (
                          <Touchable
                            key={'image_' + index}
                            onPress={() => {
                              this.openImageViewer (array, index);
                            }}
                          >
                            <Image
                              source={{
                                uri: `https://www.apexschools.co${resource.path}`,
                              }}
                              style={{
                                width: 200,
                                height: resource.height / resource.width * 200,
                                marginTop: 10,
                                marginBottom: 10,
                              }}
                            />
                          </Touchable>
                        );
                      }
                    )}
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

class NoteBubble extends React.Component {
  constructor (props) {
    super (props);
  }
  render () {
    let date = this.props.date.split ('_');
    date = new Date (...date);
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
            {moment (date).format ('MMMM Do YYYY')}
          </Text>
        </View>
        {this.props.notes.map ((note, index, array) => {
          return (
            <NoteRow
              openNote={this.props.openNote}
              closeNote={this.props.closeNote}
              key={'note_' + index}
              last={index == array.length - 1}
              note={note}
              showActionSheet={this.props.showActionSheet}
            />
          );
        })}
      </View>
    );
  }
}

class NoteRow extends React.Component {
  constructor (props) {
    super (props);
  }
  render () {
    let topicsMap = Topics._makeTopicMap (global.topics);
    return (
      <View
        style={
          this.props.last ? styles.assignmentRowLast : styles.assignmentRow
        }
      >
        <View
          style={{
            flexGrow: 1,
            width: 0,
            paddingRight: 20,
            paddingLeft: 20,
            flexDirection: 'row',
          }}
        >
          <Touchable
            onPress={() => {
              this.props.openNote (this.props.note);
            }}
            style={{width: 0, flexGrow: 1, flexDirection: 'row', zIndex: 2}}
          >
            <View style={[styles.assignmentInfo, {overflow: 'hidden'}]}>
              <View style={styles.assignmentTitle}>
                <Text
                  style={{
                    fontSize: 16,
                    color: global.user.getSecondaryTextColor (),
                  }}
                  numberOfLines={1}
                >
                  {this.props.note.note}
                </Text>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}
                numberOfLines={1}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 14,
                    color: global.user.getTertiaryTextColor (),
                  }}
                >
                  {this.props.note.topic == '_'
                    ? 'No Topic'
                    : topicsMap[this.props.note.topic].topic}
                </Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <LightBulbIcon
                    size={14}
                    color={global.user.getTertiaryTextColor ()}
                  />
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 12,
                      color: this.props.note.userVote == -1
                        ? '#e03634'
                        : this.props.note.userVote == 1
                            ? '#20d67b'
                            : global.user.getTertiaryTextColor (),
                      marginLeft: 5,
                    }}
                  >
                    {this.props.note.helpful == 0 &&
                      this.props.note.unhelpful == 0
                      ? 'Unkown % '
                      : `${Math.round (this.props.note.helpful / (this.props.note.helpful + this.props.note.unhelpful) * 100)}% `}
                    Helpful
                  </Text>
                </View>

              </View>
            </View>
          </Touchable>
          <View
            style={{
              zIndex: 1,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <Touchable
              onPress={() =>
                this.props.showActionSheet (this.props.note, 'note')}
              hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}
            >
              <VerticalEllipsisIcon
                size={20}
                color={global.user.getTertiaryTextColor ()}
              />
            </Touchable>
          </View>
        </View>
      </View>
    );
  }
}

class NoAssignmentsBubble extends React.Component {
  constructor (props) {
    super (props);
  }
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
            No Assignments!
          </Text>
        </View>
        <View style={styles.assignmentRowLast}>
          <View
            style={{
              flexGrow: 1,
              width: 0,
              paddingRight: 20,
              paddingLeft: 20,
              flexDirection: 'row',
            }}
          >
            <Touchable
              style={{width: 0, flexGrow: 1, flexDirection: 'row', zIndex: 2}}
            >
              <View style={[styles.assignmentInfo, {overflow: 'hidden'}]}>
                <View style={styles.assignmentTitle}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: global.user.getSecondaryTextColor (),
                    }}
                    numberOfLines={1}
                  >
                    Tap Create to create an assignment!
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                  numberOfLines={1}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 14,
                      color: global.user.getTertiaryTextColor (),
                    }}
                  >
                    Increase User Score
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <LightBulbIcon
                      size={14}
                      color={global.user.getTertiaryTextColor ()}
                    />
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 12,
                        color: '#20d67b',
                        marginLeft: 5,
                      }}
                    >
                      100% Helpful
                    </Text>
                  </View>
                </View>
              </View>
            </Touchable>
            <View
              style={{
                zIndex: 1,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              {/* <Touchable
                onPress={() =>
                  this.props.showActionSheet (this.props.note, 'note')}
                hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}
              >
                <VerticalEllipsisIcon
                  size={20}
                  color={global.user.getTertiaryTextColor ()}
                />
              </Touchable> */}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

class NoNotesBubble extends React.Component {
  constructor (props) {
    super (props);
  }
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
            No Notes!
          </Text>
        </View>
        <View style={styles.assignmentRowLast}>
          <View
            style={{
              flexGrow: 1,
              width: 0,
              paddingRight: 20,
              paddingLeft: 20,
              flexDirection: 'row',
            }}
          >
            <Touchable
              style={{width: 0, flexGrow: 1, flexDirection: 'row', zIndex: 2}}
            >
              <View style={[styles.assignmentInfo, {overflow: 'hidden'}]}>
                <View style={styles.assignmentTitle}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: global.user.getSecondaryTextColor (),
                    }}
                    numberOfLines={1}
                  >
                    Tap Create to create a note!
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                  numberOfLines={1}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 14,
                      color: global.user.getTertiaryTextColor (),
                    }}
                  >
                    Increase User Score
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <LightBulbIcon
                      size={14}
                      color={global.user.getTertiaryTextColor ()}
                    />
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 12,
                        color: '#20d67b',
                        marginLeft: 5,
                      }}
                    >
                      100% Helpful
                    </Text>
                  </View>
                </View>
              </View>
            </Touchable>
            <View
              style={{
                zIndex: 1,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              {/* <Touchable
                onPress={() =>
                  this.props.showActionSheet (this.props.note, 'note')}
                hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}
              >
                <VerticalEllipsisIcon
                  size={20}
                  color={global.user.getTertiaryTextColor ()}
                />
              </Touchable> */}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default class CourseInfoScreen extends React.Component {
  constructor (props) {
    super (props);
    this.props = props;
    this.course = global.courseInfoCourse;
    this.state = {
      assignments: Assignments._retrieveAssignmentsByCourse (
        global.assignments,
        this.course.id
      ),
      notes: Notes._retrieveNotesByCourse (global.notes, this.course.id),
      pageIndex: 0,
    };
    this.modal = React.createRef ();
    this.displayModal = React.createRef ();
    this.imageViewerModal = React.createRef ();
    this.scrollMain = React.createRef ();
    this.chatroom = React.createRef ();
    this.displayNoteModal = React.createRef ();
    this.noteModal = React.createRef ();
    this.actionSheet = React.createRef ();
  }
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };

  componentDidMount () {
    setTimeout (() => {
      if (global.courseInfoPage == 'assignments') {
        this.changePage (0);
      } else if (global.courseInfoPage == 'notes') {
        this.changePage (1);
      } else if (global.courseInfoPage == 'chatrooms') {
        this.changePage (2);
      }
    }, 0);
  }

  openModal = () => {
    this.modal.current.setState ({isBackdropVisible: true});
  };

  closeModal = () => {
    this.modal.current.setState ({isBackdropVisible: false});
  };

  openNoteModal = () => {
    this.noteModal.current.setState ({isBackdropVisible: true});
  };

  closeNoteModal = () => {
    this.noteModal.current.setState ({isBackdropVisible: false});
  };

  openAssignment = assignment => {
    this.displayModal.current.setState ({
      images: assignment.responseResources,
      shouldOpenImageModal: false,
      assignment,
      isBackdropVisible: true,
    });
  };

  closeAssignment = () => {
    this.displayModal.current.setState ({
      shouldOpenImageModal: false,
      isBackdropVisible: false,
    });
  };

  openNote = note => {
    this.displayNoteModal.current.setState ({
      shouldOpenImageModal: false,
      note,
      isBackdropVisible: true,
    });
  };

  closeNote = () => {
    this.displayNoteModal.current.setState ({
      shouldOpenImageModal: false,
      isBackdropVisible: false,
    });
  };

  showActionSheet = (resource, type = 'assignment') => {
    this.actionSheet.current.show (resource, type);
  };

  closeImageViewer = () => {};

  changePage = page => {
    this.scrollMain.current.scrollTo ({x: page * width, y: 0, animated: true});
    this.setState ({pageIndex: page});
    if (page == 2) {
      this.chatroom.current.isShowing = true;
      if (this.chatroom.current.error) {
        Alert.alert (
          'Error',
          this.chatroom.current.errorMessage,
          [
            {
              text: 'Try Again',
              onPress: () => this.chatroom.current.tryAgain (),
            },
            {
              text: 'Cancel',
              onPress: () => {
                console.log ('cancelled');
              },
              style: 'cancel',
            },
          ],
          {cancelable: false}
        );
      }
    } else {
      this.chatroom.current.isShowing = false;
    }
  };
  render () {
    let topicsList = Topics._MakeCourseTopicList (
      this.course.id,
      global.topics
    );
    let topicsMap = Topics._makeTopicMap (topicsList);
    let assignmentsMap = Assignments._formTopicMap (
      this.state.assignments,
      topicsList
    );
    let notesList = this.state.notes.sort ((a, b) => {
      return a.date.getTime () > b.date.getTime () ? -1 : 1;
    });
    notesMap = Notes._formDateMap (notesList);
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
          title={this.course.course}
        />
        <View style={[styles.bodyHolder, global.user.primaryTheme ()]}>
          <ScrollView
            ref={this.scrollMain}
            horizontal={true}
            style={{
              width,
              ...ifIphoneX (
                {height: height - 80 - 60},
                {height: height - 60 - 45}
              ),
            }}
            scrollEnabled={false}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
          >
            <ScrollView
              style={[styles.infoHolder, global.user.primaryTheme ()]}
            >
              <View style={styles.optionContent}>
                <CreateButton onPress={this.openModal} />
                {Object.keys (assignmentsMap).length > 0
                  ? Object.keys (assignmentsMap).map ((topic, index) => {
                      return (
                        <AssignmentBubble
                          openAssignment={this.openAssignment}
                          closeAssignment={this.closeAssignment}
                          key={'topic_' + index}
                          assignments={assignmentsMap[topic]}
                          title={
                            topic == '_' ? 'No Topic' : topicsMap[topic].topic
                          }
                          showActionSheet={this.showActionSheet}
                        />
                      );
                    })
                  : <NoAssignmentsBubble />}
              </View>
            </ScrollView>
            <ScrollView
              style={[styles.infoHolder, global.user.primaryTheme ()]}
            >
              <View style={styles.optionContent}>
                <CreateButton onPress={this.openNoteModal} />
                {Object.keys (notesMap).length > 0
                  ? Object.keys (notesMap).map ((date, index) => {
                      return (
                        <NoteBubble
                          key={'notebubble_' + index}
                          openNote={this.openNote}
                          closeNote={this.closeNote}
                          notes={notesMap[date]}
                          date={date}
                          showActionSheet={this.showActionSheet}
                        />
                      );
                    })
                  : <NoNotesBubble />}
              </View>
            </ScrollView>
            <View
              style={{
                width,
                ...ifIphoneX (
                  {height: height - 80 - 60},
                  {height: height - 60 - 45}
                ),
              }}
            >
              <ScrollView
                scrollEnabled={false}
                style={{
                  width,
                  ...ifIphoneX (
                    {height: height - 80 - 60},
                    {height: height - 60 - 45}
                  ),
                }}
                keyboardShouldPersistTaps="always"
                keyboardDismissMode="on-drag"
              >
                <ChatRoom
                  imageViewer={this.imageViewerModal}
                  ref={this.chatroom}
                />
              </ScrollView>
            </View>
          </ScrollView>
        </View>
        <View style={[boxShadows.boxShadow7, {zIndex: 5}]}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={[{width: width, height: ifIphoneX (60, 45)}]}
            colors={
              global.user.theme == 'Light'
                ? ['rgb(0,153,153)', ', rgb(0,130,209)']
                : ['rgb(0,78,78)', ', rgb(0,66,107)']
            }
          >
            <View style={styles.switchHeader}>
              <TouchableWithoutFeedback onPressIn={() => this.changePage (0)}>
                <View
                  style={[
                    styles.switchOption,
                    this.state.pageIndex == 0
                      ? styles.switchOptionSelected
                      : {},
                  ]}
                >
                  <Text style={{color: 'white', fontSize: 14}}>
                    Assignments
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPressIn={() => this.changePage (1)}>
                <View
                  style={[
                    styles.switchOption,
                    this.state.pageIndex == 1
                      ? styles.switchOptionSelected
                      : {},
                  ]}
                >
                  <Text style={{color: 'white', fontSize: 14}}>Notes</Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPressIn={() => this.changePage (2)}>
                <View
                  style={[
                    styles.switchOption,
                    this.state.pageIndex == 2
                      ? styles.switchOptionSelected
                      : {},
                  ]}
                >
                  <Text style={{color: 'white', fontSize: 14}}>Chat</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </LinearGradient>
        </View>
        <AssignmentModal ref={this.modal} parent={this} course={this.course} />
        <NoteModal ref={this.noteModal} parent={this} course={this.course} />
        <DisplayAssignmentModal
          imageViewer={this.imageViewerModal}
          ref={this.displayModal}
          parent={this}
        />
        <DisplayNoteModal
          imageViewer={this.imageViewerModal}
          ref={this.displayNoteModal}
          parent={this}
        />
        <ImageViewerModal ref={this.imageViewerModal} parent={this} />
        <CustomActionSheet
          ref={this.actionSheet}
          parent={this}
          openAssignment={this.openAssignment}
          openNote={this.openNote}
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
    ...ifIphoneX (
      {
        height: height - 80 - 60,
      },
      {
        height: height - 60 - 45,
      }
    ),
    backgroundColor: '#Fdfdfd',
  },
  infoHolder: {
    backgroundColor: '#Fdfdfd',
    width,
  },
  switchHeader: {
    width,
    height: ifIphoneX (60, 45),
    flexDirection: 'row',
  },
  switchOption: {
    ...ifIphoneX (
      {
        height: 60,
        paddingBottom: 15,
      },
      {
        height: 45,
      }
    ),
    flexGrow: 1,
    flexBasis: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchOptionSelected: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  optionContent: {
    width,
    paddingLeft: 5,
    paddingRight: 5,
  },
  createButton: {
    width: 140,
    height: 50,
    backgroundColor: '#1d5bc1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 25,
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
  newAssignmentModal: {
    borderRadius: 8,
    height: height * 0.9,
    backgroundColor: 'white',
    overflow: 'hidden',
    flexDirection: 'column',
  },
  newNoteModal: {
    borderRadius: 8,
    height: height * 0.5,
    backgroundColor: 'white',
    overflow: 'hidden',
    flexDirection: 'column',
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
  noteModalBody: {
    height: height * 0.5 - 60 - 70,
  },
  confirmButton: {
    width: 100,
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#ddd',
    color: '#aaa',
    borderRadius: 3,
    overflow: 'hidden',
  },
  confirmButtonAllowed: {
    width: 100,
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#174ea6',
    color: 'white',
    borderRadius: 3,
    overflow: 'hidden',
  },
  displayAssignment: {
    height: height * 0.5,
    backgroundColor: 'white',
    overflow: 'hidden',
    flexDirection: 'column',
  },
  assignnmentDue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
