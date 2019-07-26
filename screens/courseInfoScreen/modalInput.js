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

import {importantDateModal} from "./importantDates";

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

// import ChatRoom from './chatroom';

import {ifIphoneX} from 'react-native-iphone-x-helper';

import ActionSheet from 'react-native-actionsheet';

import * as Haptics from 'expo-haptics';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

export class ModalInput extends React.Component {
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