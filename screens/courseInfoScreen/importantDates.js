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
  Picker,
  Alert,
  DatePickerIOS,
  DatePickerAndroid,
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

import {ImportantDate, ImportantDates} from '../../classes/importantDates';

import {Note, Notes} from '../../classes/notes';

import {Topic, Topics} from '../../classes/topics';

import Touchable from '../../components/react-native-platform-touchable';

import Modal from 'react-native-modal';

import {TextField} from 'react-native-material-textfield';

import ApexAPI from '../../http/api';

import {ConfirmButton} from './confirmButton';

import {LinearGradient} from 'expo-linear-gradient';

import {Dropdown} from 'react-native-material-dropdown';

import moment from 'moment';

import {ModalInput} from './modalInput';

import ImageViewer from 'react-native-image-zoom-viewer';

import ImageBar from '../../components/imagePicker';

import Collapsible from 'react-native-collapsible';

// import ChatRoom from './chatroom';

import {ifIphoneX} from 'react-native-iphone-x-helper';
import {Platform} from '@unimodules/core';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

export class DisplayImportantDateModal extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      isBackdropVisible: false,
      shouldOpenImageModal: false,
      images: [],
      imageURLs: [],
      imageIndex: 0,
      date: {
        title: '',
        type: '',
        date: new Date (),
        date_of_event: new Date (),
        _id: '_',
        resources: [],
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
              <Text style={{color: '#174ea6', fontSize: 16}}>
                Important Date
              </Text>
              <Touchable
                onPress={this.props.parent.closeDate}
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
                  <Text style={styles.modalBodySectionHeader}>Title</Text>
                  <Text
                    style={[
                      styles.modalBodySectionContent,
                      global.user.secondaryTextColor (),
                    ]}
                  >
                    {this.state.date.title}
                  </Text>
                </View>

                <View style={styles.modalBodySection}>
                  <Text style={styles.modalBodySectionHeader}>Type</Text>
                  <Text
                    style={[
                      styles.modalBodySectionContent,
                      global.user.secondaryTextColor (),
                    ]}
                  >
                    {this.state.date.type}
                  </Text>
                </View>
                <View style={styles.modalBodySection}>
                  <Text style={styles.modalBodySectionHeader}>Event Date</Text>
                  <Text
                    style={[
                      styles.modalBodySectionContent,
                      global.user.secondaryTextColor (),
                    ]}
                  >
                    {moment (this.state.date.date_of_event).format (
                      'MMMM Do, YYYY'
                    )}
                  </Text>
                </View>
                <View style={styles.modalBodySection}>
                  <Text style={styles.modalBodySectionHeader}>Uploaded By</Text>
                  <Text
                    style={[
                      styles.modalBodySectionContent,
                      global.user.secondaryTextColor (),
                    ]}
                  >
                    {this.state.date.username || 'Anonymous'}
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
                    {moment (this.state.date.date).format (
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
                    {this.state.date.resources.map (
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

export class ImportantDateModal extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      isBackdropVisible: false,
      images: [],
      title: '',
      date: new Date (),
      keyboardHeight: new Animated.Value (0),
      typeExtended: false,
      typeValue: 'Quiz',
      dateExtended: false,
      dateValue: new Date (),
    };
    this.event_title = React.createRef ();
    this.create = React.createRef ();
  }
  componentWillMount () {
    if (Platform.OS == 'ios') {
      this.keyboardWillShowSub = Keyboard.addListener (
        'keyboardWillShow',
        this.keyboardWillShow
      );
      this.keyboardWillHideSub = Keyboard.addListener (
        'keyboardWillHide',
        this.keyboardWillHide
      );
    } else {
      this.keyboardWillShowSub = Keyboard.addListener (
        'keyboardDidShow',
        this.keyboardWillShow
      );
      this.keyboardWillHideSub = Keyboard.addListener (
        'keyboardDidHide',
        this.keyboardWillHide
      );
    }
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
      this.create.current.setState ({disabled: !this.state.title});
    });
  };

  imageFunction = result => {
    this.state.images.push (result);
  };

  createAssignment () {
    let api = new ApexAPI (global.user);
    let postObject = {
      title: this.state.title,
      resources: this.state.images.map (image => image._id),
      reference_course: global.courseInfoCourse.id,
      type: this.state.typeValue,
      date_of_event: this.state.dateValue,
    };
    console.log (postObject);
    api
      .post ('important-dates?populate=resources', postObject)
      .then (res => res.json ())
      .then (async res => {
        console.log (res.body);
        this.setState ({isBackdropVisible: false, images: []});
        if (res.status == 'ok') {
          let date = new ImportantDate (res.body);
          let dates = [...this.props.parent.state.dates];
          dates.push (date);
          global.importantDates.push (date);
          let storageDates = await ImportantDates._retrieveFromStorage ();
          storageDates.push (date);
          await ImportantDates._saveToStorage (storageDates);
          this.setState ({isBackdropVisible: false}, () => {
            setTimeout (() => {
              this.props.parent.setState ({dates});
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
    this.createAssignment ();
  };
  handleClear = () => {
    this.setState ({event_title: ''});
    this.event_title.current.setState ({value: ''});
    this.state.images = [];
  };

  toggleTypeSelector = () => {
    this.setState ({typeExtended: !this.state.typeExtended});
  };
  openDaySelectAndroid = async () => {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open ({
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.
        date: new Date (),
        mode: 'calendar',
      });
      console.log ({action, year, month, day});
      if (action !== DatePickerAndroid.dismissedAction) {
        this.setState (state => ({
          dateValue: new Date (
            year,
            month,
            day,
            state.dateValue.getHours (),
            state.dateValue.getMinutes ()
          ),
        }));
        // Selected year, month (0-11), day
      }
    } catch (e) {
      console.log (e);
    }
  };
  toggleDateSelector = () => {
    if (Platform.OS == 'ios') {
      this.setState ({dateExtended: !this.state.dateExtended});
    } else {
      this.openDaySelectAndroid ();
    }
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
                  onPress={this.props.parent.closeDateModal}
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
                  {/* [event title, event type, event date, event resources] */}
                  <ModalInput
                    handleInput={this.handleInput}
                    ref={this.event_title}
                    style={{marginTop: 30}}
                    textColor={global.user.getSecondaryTextColor ()}
                    baseColor={global.user.getTertiaryTextColor ()}
                    label="Event Title"
                    stateKey={'title'}
                  />

                  {Platform.OS == 'ios'
                    ? <Touchable onPress={this.toggleTypeSelector}>
                        <View
                          style={{
                            borderBottomWidth: 1,
                            height: 50,
                            paddingBottom: 8,
                            borderBottomColor: global.user.getBorderColor (),
                            flexDirection: 'row',
                            alignItems: 'flex-end',
                            justifyContent: 'space-between',
                            marginTop: 20,
                          }}
                        >
                          <Text
                            style={{
                              color: global.user.getTertiaryTextColor (),
                              fontSize: 16,
                            }}
                          >
                            Event Type
                          </Text>
                          <Text
                            style={{
                              color: global.user.getSecondaryTextColor (),
                              fontSize: 16,
                            }}
                          >
                            {this.state.typeValue}
                          </Text>
                        </View>
                      </Touchable>
                    : <View>
                        <Dropdown
                          label="Event Type"
                          onChangeText={text => {
                            console.log (text);
                            this.setState ({typeValue: text});
                          }}
                          animationDuration={100}
                          textColor={global.user.getSecondaryTextColor ()}
                          baseColor={global.user.getTertiaryTextColor ()}
                          pickerStyle={[
                            global.user.primaryTheme (),
                            {flexGrow: 1},
                          ]}
                          style={{flexGrow: 1}}
                          data={[
                            {label: 'Exam', value: 'Exam'},
                            {label: 'Test', value: 'Test'},
                            {label: 'Quiz', value: 'Quiz'},
                            {label: 'Field Trip', value: 'Field Trip'},
                            {label: 'Rehersal', value: 'Rehersal'},
                          ]}
                        />
                      </View>}
                  {Platform.OS == 'ios'
                    ? <Collapsible collapsed={!this.state.typeExtended}>
                        <View style={{backgroundColor: '#f5f5f5'}}>
                          <Picker
                            style={{height: 200}}
                            selectedValue={this.state.typeValue}
                            onValueChange={(itemValue, itemIndex) => {
                              this.setState ({typeValue: itemValue});
                            }}
                          >
                            <Picker.Item
                              label="Exam"
                              value="Exam"
                              style={{color: 'white'}}
                            />
                            <Picker.Item
                              label="Test"
                              value="Test"
                              style={{color: 'white'}}
                            />
                            <Picker.Item
                              label="Quiz"
                              value="Quiz"
                              style={{color: 'white'}}
                            />
                            <Picker.Item
                              label="Field Trip"
                              value="Field Trip"
                              style={{color: 'white'}}
                            />
                            <Picker.Item
                              label="Rehersal"
                              value="Rehersal"
                              style={{color: 'white'}}
                            />
                          </Picker>
                        </View>
                      </Collapsible>
                    : null}

                  <Touchable onPress={this.toggleDateSelector}>
                    <View
                      style={{
                        borderBottomWidth: 1,
                        height: 50,
                        paddingBottom: 8,
                        borderBottomColor: global.user.getBorderColor (),
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        marginTop: 25,
                      }}
                    >
                      <Text
                        style={{
                          color: global.user.getTertiaryTextColor (),
                          fontSize: 16,
                        }}
                      >
                        Event Date
                      </Text>
                      <Text
                        style={{
                          color: global.user.getSecondaryTextColor (),
                          fontSize: 16,
                        }}
                      >
                        {moment (this.state.dateValue).format ('MMMM Do, YYYY')}
                      </Text>
                    </View>
                  </Touchable>
                  {Platform.OS == 'ios'
                    ? <Collapsible collapsed={!this.state.dateExtended}>
                        <View style={{backgroundColor: '#f5f5f5'}}>
                          <DatePickerIOS
                            style={{height: 200}}
                            onDateChange={date => {
                              this.setState ({dateValue: date});
                            }}
                            date={this.state.dateValue}
                            style={{
                              backgroundColor: '#f5f5f5',
                            }}
                            mode={'date'}
                          />
                        </View>
                      </Collapsible>
                    : null}

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
    height: height * 0.9,
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
    height: height * 0.9 - 60 - 70,
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
