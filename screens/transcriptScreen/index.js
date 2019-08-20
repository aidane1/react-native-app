import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Text,
  Animated,
  WebView,
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

import Touchable from '../../components/react-native-platform-touchable';

import Collapsible from 'react-native-collapsible';

import {Day} from '../../classes/days';

import {ifIphoneX} from 'react-native-iphone-x-helper';

import ApexAPI from '../../http/api';

import Modal from 'react-native-modal';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

export default class SchoolAssignmentsScreen extends React.Component {
  constructor (props) {
    super (props);
    this.props = props;
    this.state = {
      buffer: '',
    };
    this._isMounted = false;
  }

  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };
  componentWillUnmount () {
    this._isMounted = false;
  }
  componentDidMount () {
    this._isMounted = true;
    // let api = new ApexAPI (global.user);
    // api
    //   .get (
    //     `transcript?username=${global.user.username}&password=${global.user.password}&district=${global.school.district}`,
    //     this.abortController
    //   )
    //   .then (data => data.buffer ())
    //   .then (data => {
    //     console.log (data);
    //     this.setState ({buffer: data.toString ('base64')});
    //   })
    //   .catch (e => {
    //     console.log (e);
    //   });
  }
  render () {
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
          title="Transcript"
        />
        <View style={[styles.bodyHolder, global.user.primaryTheme ()]}>
          {/* <WebView
            source={{
              html: `
                <div id ="pdfView">
                <embed class="form-control" src="data:application/pdf;base64,${this.state.buffer}"/>
                </div>`,
            }}
          /> */}
          <WebView
            style={{
              width,
              height: height - 60,
            }}
            source={{
              uri: `https://www.apexschools.co/api/v1/transcript?username=${global.districtInfo.districtUsername}&password=${global.districtInfo.districtPassword}&district=${global.school.district}`,
              headers: {
                'x-api-key': global.user['x-api-key'],
                'x-id-key': global.user['x-id-key'],
                school: global.school['id'],
              },
            }}
          />
        </View>
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
