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

import {ScrollView, RectButton, TextInput} from 'react-native-gesture-handler';

import {
  LeftIcon,
  PlusIcon,
  EmptyIcon,
  XIcon,
  CheckMarkIcon,
  GenericIcon,
} from '../../classes/icons';

import {boxShadows} from '../../constants/boxShadows';

import Touchable from '../../components/react-native-platform-touchable';

import Modal from 'react-native-modal';

import {User} from '../../classes/user';

import {ifIphoneX} from 'react-native-iphone-x-helper';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

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
  render () {
    let {scaleVal} = this.state;
    return (
      <Touchable
        onPressIn={this.handleClick}
        onPressOut={this.handlePressOut}
        style={{width: 140}}
        onPress={this.props.onPress}
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

class ActivityRow extends React.Component {
  constructor (props) {
    super (props);
  }
  render () {
    return this.props.default
      ? <View style={[styles.dayRowLast, global.user.borderColor ()]}>
          <Text
            style={{fontSize: 18, color: global.user.getSecondaryTextColor ()}}
          >
            No activities yet!
          </Text>
        </View>
      : <View
          style={[
            this.props.last ? styles.dayRowLast : styles.dayRow,
            global.user.borderColor (),
          ]}
        >
          <Text
            style={{fontSize: 18, color: global.user.getSecondaryTextColor ()}}
          >
            {this.props.activity}
          </Text>
          <Touchable
            onPress={() =>
              this.props.deleteActivity (
                this.props.objectKey,
                this.props.index
              )}
          >
            <XIcon size={25} color={global.user.getTertiaryTextColor ()} />
          </Touchable>
        </View>;
  }
}

class DayActivityBubble extends React.Component {
  constructor (props) {
    super (props);
  }
  render () {
    return (
      <View
        style={[
          styles.dayBubble,
          boxShadows.boxShadow3,
          global.user.secondaryTheme (),
        ]}
      >
        <View style={styles.dayBubbleHeader}>
          <Text style={{color: '#174ea6', fontSize: 30}}>
            {this.props.day}
          </Text>
          <CreateButton
            onPress={() =>
              this.props.modal.current.setState ({
                isBackdropVisible: true,
                title: this.props.day,
                key: this.props.objectKey,
              })}
          />
        </View>
        {this.props.activities.length == 0
          ? <ActivityRow last={true} default={true} />
          : this.props.activities.map ((activity, index, array) => {
              return (
                <ActivityRow
                  last={index == array.length - 1}
                  activity={activity}
                  key={'activity_' + index}
                  deleteActivity={this.props.deleteActivity}
                  objectKey={this.props.objectKey}
                  index={index}
                />
              );
            })}
      </View>
    );
  }
}

class CreateNewModal extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      isBackdropVisible: false,
      title: 'Monday',
      key: 'day_1',
      activities: [],
      text: '',
    };
    this.activity = React.createRef ();
  }
  modalHide = () => {
    this.setState ({isBackdropVisible: false});
  };
  addActivity = async () => {
    if (this.state.text) {
      global.user[global.activity.key][this.state.key].push (this.state.text);
      await User._saveToStorage (global.user);
      this.activity.current.blur ();
      this.setState ({text: ''}, () => {
        this.props.parent.setState ({user: global.user});
      });
    }
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
            style={[styles.newActivityModal, global.user.secondaryTheme ()]}
          >
            <View
              style={[
                styles.dayBubbleHeader,
                {paddingBottom: 10, paddingTop: 10, paddingLeft: 10},
              ]}
            >
              <Text style={{color: '#174ea6', fontSize: 30}}>
                {this.state.title}
              </Text>
              <Touchable
                onPress={() => this.setState({isBackdropVisible: false})}
                hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
                style={{paddingRight: 15}}
              >
                <XIcon size={30} color={global.user.getPrimaryTextColor ()} />
              </Touchable>
            </View>
            <ScrollView>
              <View style={[styles.dayRow, global.user.borderColor ()]}>
                <TextInput
                  ref={this.activity}
                  placeholder={'Activity...'}
                  multiline={false}
                  placeholderTextColor={global.user.getTertiaryTextColor ()}
                  onChangeText={text => this.setState ({text})}
                  value={this.state.text}
                  style={{
                    fontSize: 18,
                    height: 40,
                    paddingLeft: 5,
                    color: global.user.getSecondaryTextColor (),
                    flexGrow: 1,
                  }}
                />
                <Touchable
                  hitSlop={{top: 15, left: 30, bottom: 15, right: 30}}
                  onPress={this.addActivity}
                >
                  <CheckMarkIcon
                    size={25}
                    color={global.user.getTertiaryTextColor ()}
                    style={{marginRight: 5}}
                  />
                </Touchable>
              </View>
              {global.user[global.activity.key][this.state.key].length == 0
                ? <View
                    key={'modalActivity_' + 0}
                    style={[styles.dayRow, global.user.borderColor ()]}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        color: global.user.getSecondaryTextColor (),
                      }}
                    >
                      No Activities Yet!
                    </Text>
                  </View>
                : global.user[global.activity.key][
                    this.state.key
                  ].map ((activity, index) => {
                    return (
                      <View
                        key={'modalActivity_' + index}
                        style={[styles.dayRow, global.user.borderColor ()]}
                      >
                        <Text
                          style={{
                            fontSize: 18,
                            color: global.user.getSecondaryTextColor (),
                          }}
                        >
                          {activity}
                        </Text>
                        <Touchable
                          onPress={() =>
                            this.props.deleteActivity (this.state.key, index)}
                        >
                          <XIcon
                            size={25}
                            color={global.user.getTertiaryTextColor ()}
                          />
                        </Touchable>
                      </View>
                    );
                  })}
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  }
}

export default class ActivitiesScreen extends React.Component {
  constructor (props) {
    super (props);
    this.props = props;
    this.modal = React.createRef ();
    this.state = {
      user: global.user,
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };
  deleteActivity = async (key, index) => {
    global.user[global.activity.key][key] = global.user[global.activity.key][
      key
    ].filter ((item, i) => {
      return index !== i;
    });
    await User._saveToStorage (global.user);
    this.setState ({user: global.user});
  };
  render () {
    let {user} = this.state;
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
          title={`${global.activity.name} Activities`}
        />
        <View style={[styles.bodyHolder, global.user.primaryTheme ()]}>
          <ScrollView>
            <DayActivityBubble
              modal={this.modal}
              day="Monday"
              objectKey="day_1"
              deleteActivity={this.deleteActivity}
              activities={user[global.activity.key]['day_1']}
            />
            <DayActivityBubble
              modal={this.modal}
              day="Tuesday"
              objectKey="day_2"
              deleteActivity={this.deleteActivity}
              activities={user[global.activity.key]['day_2']}
            />
            <DayActivityBubble
              modal={this.modal}
              day="Wednesday"
              objectKey="day_3"
              deleteActivity={this.deleteActivity}
              activities={user[global.activity.key]['day_3']}
            />
            <DayActivityBubble
              modal={this.modal}
              day="Thursday"
              objectKey="day_4"
              deleteActivity={this.deleteActivity}
              activities={user[global.activity.key]['day_4']}
            />
            <DayActivityBubble
              modal={this.modal}
              day="Friday"
              objectKey="day_5"
              deleteActivity={this.deleteActivity}
              activities={user[global.activity.key]['day_5']}
            />
          </ScrollView>
        </View>
        <CreateNewModal
          deleteActivity={this.deleteActivity}
          parent={this}
          ref={this.modal}
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
  createButton: {
    width: 140,
    height: 50,
    backgroundColor: '#1d5bc1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderRadius: 25,
  },
  dayBubble: {
    backgroundColor: 'white',
    margin: 10,
    paddingTop: 15,
    paddingBottom: 5,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 10,
  },
  dayBubbleHeader: {
    paddingBottom: 12,
    borderBottomColor: '#1967d2',
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayRow: {
    height: 50,
    borderColor: 'rgb(210,210,210)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingLeft: 0,
    paddingRight: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 25,
  },
  dayRowLast: {
    height: 50,
    paddingRight: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 25,
  },
  dayInfo: {
    width: 0,
    flexGrow: 1,
  },
  dayTitle: {
    marginBottom: 5,
    flexDirection: 'row',
  },
  newActivityModal: {
    height: height * 0.5,
    backgroundColor: 'white',
    overflow: 'hidden',
    flexDirection: 'column',
  },
});
