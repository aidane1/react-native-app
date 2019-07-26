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

import {ImportantDateModal} from './importantDates';

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

import {ModalInput} from './modalInput';

// import ChatRoom from './chatroom';

import {ifIphoneX} from 'react-native-iphone-x-helper';

import ActionSheet from 'react-native-actionsheet';

import * as Haptics from 'expo-haptics';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

export class ConfirmButton extends React.Component {
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
