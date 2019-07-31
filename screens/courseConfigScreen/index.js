import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  Image,
  Text,
  KeyboardAvoidingView,
} from 'react-native';

import HeaderBar from '../../components/header';

import {
  LeftIcon,
  CalendarIcon,
  ConfirmIcon,
  EmptyIcon,
  SchoolIcons,
  EventsIcon,
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

import {ScrollView, FlatList} from 'react-native-gesture-handler';

import {boxShadows} from '../../constants/boxShadows';

import Modal from 'react-native-modal';

import Touchable from 'react-native-platform-touchable';

import {TextField} from 'react-native-material-textfield';

import {ifIphoneX} from 'react-native-iphone-x-helper';

import {User} from '../../classes/user';

import {
  ColorPicker,
  TriangleColorPicker,
  toHsv,
  fromHsv,
} from 'react-native-color-picker';

import ApexAPI from '../../http/api';

import {StackActions, NavigationActions} from 'react-navigation';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

function updateInfo (body) {
  let api = new ApexAPI (global.user);
  api
    .put (`users/${global.user.id}`, body)
    .then (data => data.json ())
    .then (data => {
      // console.log (data);
    });
}

class CourseSection extends React.Component {
  constructor (props) {
    super (props);
    console.log (this.props.course.block);
    this.state = {
      //   color: SchoolIcons.getIcon (this.props.course.category)[1],
      color: global.user.block_colors[this.props.course.block] ||
        SchoolIcons.getIcon (this.props.course.category)[1],
      text: global.user.block_names[this.props.course.block] ||
        this.props.course.course,
    };
  }
  updateColor = async color => {
    global.user.block_colors[this.props.course.block] = color;
    global.user = await User._saveToStorage (global.user);
    updateInfo ({block_colors: global.user.block_colors});
    this.setState ({color});
  };
  updateText = async text => {
    global.user.block_names[this.props.course.block] = text;
    global.user = await User._saveToStorage (global.user);
    updateInfo ({block_names: global.user.block_names});
    this.setState ({text});
  };
  render () {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          paddingBottom: 20,
        }}
      >
        <Touchable
          onPress={() =>
            this.props.modal.current.setState ({
              isBackdropVisible: true,
              color: this.state.color,
              oldColor: this.state.color,
              updateColor: this.updateColor,
            })}
        >
          <View
            style={{
              width: 40,
              height: 40,
              backgroundColor: this.state.color,
              borderRadius: 3,
              margin: 10,
            }}
          />
        </Touchable>

        <CourseSectionTextInput
          text={this.state.text}
          updateText={this.updateText}
          block={this.props.course.block}
        />
      </View>
    );
  }
}

class ColourPickerModal extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      isBackdropVisible: false,
      oldColor: '#ff0000',
      color: '#ff0000',
      updateColor: color => {},
    };
  }
  updateColor = color => {
    color = fromHsv (color);
    this.setState ({color}, () => {
      this.state.updateColor (color);
    });
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
          style={{margin: 0}}
        >
          <View
            style={{
              width,
              height: height * 0.5,
              backgroundColor: global.user.getSecondaryTheme (),
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <ColorPicker
              onColorSelected={color => alert (`Color selected: ${color}`)}
              style={{height: height * 0.5, width: width * 0.9}}
              //   hideSliders={true}
              onColorChange={this.updateColor}
              oldColor={this.state.oldColor}
            />
          </View>

        </Modal>
      </View>
    );
  }
}

class CourseSectionTextInput extends React.Component {
  constructor (props) {
    super (props);
    this.block = global.school.blocks.filter (
      block => block._id == this.props.block
    );
    this.block = this.block.length ? this.block[0] : {block: '', _id: ''};
  }
  render () {
    return this.block._id
      ? <TextField
          //   ref={this.TextField}
          label={`Block ${this.block.block}`}
          multiline={false}
          value={this.props.text}
          textColor={global.user.getSecondaryTextColor ()}
          baseColor={global.user.getTertiaryTextColor ()}
          onChangeText={this.props.updateText}
          containerStyle={{flexGrow: 1}}
          //   onChangeText={value => this.updateText (value)}
        />
      : <View />;
  }
}

export default class CourseConfigScreen extends React.Component {
  constructor (props) {
    super (props);

    let currentDate = new Date (2019, 8, 25);
    let currentSemesters = global.semesters
      .filter (semester => {
        return (
          semester.startDate.getTime () <= currentDate.getTime () &&
          semester.endDate.getTime () >= currentDate.getTime ()
        );
      })
      .map (semester => {
        return semester.id;
      });

    this.courses = global.userCourses.filter (
      course => currentSemesters.indexOf (course.semester) >= 0
    );
    this.blockMap = {};
    global.school.blocks.forEach (block => {
      if (!block.is_constant) {
        let course = this.courses.filter (
          course => course.block == block._id
        )[0] || {block: block._id, course: '', category: 'other'};
        this.blockMap[block._id] = course;
      }
    });
    this.modal = React.createRef ();
    // console.log(this.blockMap);
  }
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };
  render () {
    return (
      <View style={[styles.container, global.user.primaryTheme ()]}>
        <HeaderBar
          iconLeft={
            <Touchable onPress={() => this.props.navigation.goBack ()}>
              <LeftIcon size={28} />
            </Touchable>
          }
          iconRight={
            <Touchable
              onPress={() => {
                const resetAction = StackActions.reset ({
                  index: 0,
                  actions: [NavigationActions.navigate ({routeName: 'Home'})],
                });
                this.props.navigation.dispatch (resetAction);
              }}
            >
              <ConfirmIcon size={32} style={{paddingRight: 10}} />
            </Touchable>
          }
          width={width}
          height={60}
          title={'Course Names & Colours'}
        />
        <KeyboardAvoidingView
          behavior={'padding'}
          enabled={true}
          style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}
          keyboardVerticalOffset={10}
        >
          {/* <View style={styles.bodyHolder}> */}
          <FlatList
            data={Object.keys (this.blockMap)}
            renderItem={({item, index}) => {
              return (
                <CourseSection
                  course={this.blockMap[item]}
                  modal={this.modal}
                  last={index == Object.keys (this.blockMap).length - 1}
                />
              );
            }}
            keyExtractor={(item, index) => item}
          />
          {/* </View> */}
        </KeyboardAvoidingView>

        <ColourPickerModal ref={this.modal} />
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
});
