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
} from 'react-native';

import {
  LeftIcon,
  PlusIcon,
  CheckBoxFilledIcon,
  EmptyIcon,
  CheckBoxOpenIcon,
  XIcon,
  SendIcon,
  PhotoIcon,
  TrashIcon,
  SchoolAssignmentsIcon,
  BeforeSchoolIcon,
  LunchTimeIcon,
  AfterSchoolIcon,
} from '../../classes/icons';

import {ScrollView} from 'react-native-gesture-handler';

import Touchable from '../../components/react-native-platform-touchable';

import {boxShadows} from '../../constants/boxShadows';

import ApexAPI from '../../http/api';

import ImageBar from '../../components/imagePicker';

export default class Notes extends React.Component {
  constructor (props) {
    super (props);
  }
  render () {
    return <View />;
  }
}
