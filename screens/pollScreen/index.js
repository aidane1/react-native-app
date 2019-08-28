import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  StatusBar,
  Text,
  Image,
  Easing,
  Modal,
} from 'react-native';

import HeaderBar from '../../components/header';

import LinkPreview from 'react-native-link-preview';

import {ScrollView, TextInput, FlatList} from 'react-native-gesture-handler';

import {boxShadows} from '../../constants/boxShadows';

import {
  LeftIcon,
  EmptyIcon,
  CheckBoxFilledIcon,
  MessageIcon,
  LinkIcon,
  EllipsisIcon,
  LightBulbIcon,
  XIcon,
} from '../../classes/icons';

import Touchable from '../../components/react-native-platform-touchable';

import ApexAPI from '../../http/api';

import {ifIphoneX} from 'react-native-iphone-x-helper';

import querystring from 'querystring';

import url from 'url';

import moment from 'moment';

import * as Haptics from 'expo-haptics';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

const AnimatedTouchable = Animated.createAnimatedComponent (Touchable);
// let gradients =

const images = [
  require ('../../assets/poll-image-1.jpg'),
  require ('../../assets/poll-image-2.jpg'),
  require ('../../assets/poll-image-3.jpg'),
  require ('../../assets/poll-image-4.jpg'),
  require ('../../assets/poll-image-5.jpg'),
];

class PollBlock extends React.Component {
  constructor (props) {
    super (props);
    this.block = React.createRef ();
    this.state = {
      width: width * 0.9,
      visible: true,
    };
  }
  updateVisible = visible => {
    console.log (visible);
    this.setState ({visible});
  };
  componentDidMount () {
    // setTimeout (() => {
    //   this.block.current.measure ((fx, fy, width, height, px, py) => {
    //       this.state
    //     console.log ('Component width is: ' + width);
    //     console.log ('Component height is: ' + height);
    //     console.log ('X offset to frame: ' + fx);
    //     console.log ('Y offset to frame: ' + fy);
    //     console.log ('X offset to page: ' + px);
    //     console.log ('Y offset to page: ' + py);
    //   });
    // });
  }
  onPress = () => {
    setTimeout (() => {
      this.updateVisible (false);
    }, 10);

    // console.log (this.block.current);

    // let newWidth = width * 0.95;
    // let newHeight = height * 0.95 - ifIphoneX (80, 60);
    // if (this.state.extended) {
    //   newWidth = width * 0.5;
    //   newHeight = width * 0.5;
    // }
    // Animated.parallel ([
    //   Animated.spring (this.state.width, {
    //     toValue: newWidth,
    //     duration: 1000,
    //   }),
    //   Animated.spring (this.state.height, {
    //     toValue: newHeight,
    //     duration: 1000,
    //   }),
    // ]).start ();
    // this.setState (({extended}) => {
    //   return {
    //     extended: !extended,
    //     position: !extended ? 'absolute' : 'relative',
    //   };
    // });
    StatusBar.setHidden (true);
    this.block.current.measure ((fx, fy, width, height, px, py) => {
      this.props.popup.current.renderPopup ({
        image: this.props.image,
        width: new Animated.Value (width),
        originalWidth: width,
        originalHeight: height,
        originalPx: px,
        originalPy: py,
        height: new Animated.Value (height),
        px: new Animated.Value (px),
        py: new Animated.Value (py),
        poll: this.props.poll,
        updateVisible: this.updateVisible,
      });
    });
  };
  render () {
    return (
      <Touchable
        style={[
          {
            alignSelf: 'center',
            width: this.state.width,
            // width,
            marginTop: 20,
          },
          boxShadows.boxShadow4,
        ]}
        onPress={this.onPress}
      >
        <View
          ref={this.block}
          style={[
            global.user.secondaryTheme (),
            {
              width: this.state.width,
              // width,
              height: 350,
              overflow: 'hidden',
              borderRadius: 15,
              opacity: this.state.visible ? 1 : 0,
            },
          ]}
        >
          <Image
            source={this.props.image}
            resizeMode={'cover'}
            style={{
              width: width,
              height: 450,
              position: 'absolute',
              left: -width / 20,
            }}
          />
          <Text
            style={{
              fontSize: 35,
              color: 'white',
              fontWeight: '800',
              padding: 10,
              position: 'absolute',
              bottom: 5,
              left: 0,
            }}
          >
            {this.props.poll.title}
          </Text>
        </View>
      </Touchable>
    );
  }
}

class EmptyPollBlock extends React.Component {
  constructor (props) {
    super (props);
  }
  render () {
    return <View />;
  }
}

class PopupOption extends React.Component {
  constructor (props) {
    super (props);
  }
  render () {
    return (
      <Touchable
        style={{marginTop: 40}}
        onPress={() => this.props.updateActive (this.props.option)}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <CheckBoxFilledIcon
            color={
              this.props.active
                ? '#558de8'
                : global.user.getSecondaryTextColor ()
            }
            size={22}
            style={{marginRight: 10, opacity: this.props.active ? 1.0 : 0.7}}
          />
          <View
            style={[
              {
                width: width * 0.8,
                padding: 10,
                backgroundColor: global.user.getSecondaryTheme (),
                borderColor: this.props.active
                  ? '#558de8'
                  : global.user.getBorderColor (),
                borderWidth: StyleSheet.hairlineWidth * 2,
                borderRadius: 1,
              },
            ]}
          >

            <Text
              style={{
                color: this.props.active
                  ? '#558de8'
                  : global.user.getSecondaryTextColor (),
                fontWeight: '800',
                fontSize: 15,
              }}
            >
              {this.props.option}
            </Text>
          </View>
        </View>

      </Touchable>
    );
  }
}

class PopupContent extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      active: this.props.votes.reduce ((acc, current) => {
        if (current.user === global.user.id) {
          return current.vote;
        } else {
          return acc;
        }
      }, ''),
    };
  }
  setActive = active => {
    this.setState ({active});
    Haptics.notificationAsync (Haptics.ImpactFeedbackStyle.Success);
    let api = new ApexAPI (global.user);
    api.post (`vote-poll/${this.props._id}`, {
      vote: active,
    });
  };
  render () {
    return (
      <View
        style={{
          width,
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {this.props.options.map ((option, index) => {
          return (
            <PopupOption
              option={option}
              key={`option_${index}`}
              active={this.state.active === option}
              updateActive={this.setActive}
            />
          );
        })}

      </View>
    );
  }
}

class PopupModal extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      image: require ('../../assets/poll-image-1.jpg'),
      visible: false,
      width: new Animated.Value (0),
      originalWidth: 0,
      height: new Animated.Value (0),
      originalHeight: 0,
      px: new Animated.Value (0),
      originalPx: 0,
      py: new Animated.Value (0),
      originalPy: 0,
      borderRadius: new Animated.Value (10),
      bottom: new Animated.Value (105),
      left: new Animated.Value (width / 20),
      opacity: new Animated.Value (0),
      updateVisible: () => {},
      poll: {
        title: '',
      },
    };
    this.height = height;
    this.width = width;
  }
  renderPopup = state => {
    this.setState ({...state, visible: true}, () => {
      let growthDown = height - state.height._value;
      let distanceTop = state.py._value;
      let rateModifier = growthDown / distanceTop / 3;
      Animated.sequence ([
        Animated.parallel ([
          Animated.timing (this.state.width, {
            toValue: width,
            duration: 350,
          }),
          Animated.timing (this.state.height, {
            toValue: height,
            // friction: 40,
            // tension: 7,
            duration: 350,
          }),
          Animated.timing (this.state.px, {
            toValue: 0,
            // friction: 40,
            // tension: 7,
            duration: 350,
          }),
          Animated.spring (this.state.py, {
            toValue: 0,
            // duration: 350 / rateModifier,
            bounciness: 6,
            speed: 3,
            // friction: 80,
            // tension: 7,
          }),
          Animated.timing (this.state.borderRadius, {
            toValue: 0,
            duration: 350,
          }),
          Animated.timing (this.state.opacity, {
            toValue: 1,
            duration: 250,
            delay: 100,
          }),
          Animated.spring (this.state.bottom, {
            toValue: 5,
            bounciness: 6,
            speed: 3,
          }),
          Animated.timing (this.state.left, {
            toValue: 0,
            duration: 350,
          }),
        ]),
      ]).start (() => {
        this.state.updateVisible (true);
      });
    });
  };
  dismiss = () => {
    if (Platform.OS == 'android') {
      StatusBar.setHidden (true);
    } else {
      StatusBar.setHidden (false);
    }
    const {originalHeight, originalWidth, originalPx, originalPy} = this.state;
    Animated.parallel ([
      Animated.timing (this.state.width, {
        toValue: originalWidth,
        duration: 350,
      }),
      Animated.timing (this.state.height, {
        toValue: originalHeight,
        duration: 350,
      }),
      Animated.timing (this.state.px, {
        toValue: originalPx,
        duration: 350,
      }),
      Animated.timing (this.state.py, {
        toValue: originalPy,
        duration: 350,
      }),
      Animated.timing (this.state.borderRadius, {
        toValue: 15,
        duration: 350,
      }),
      Animated.timing (this.state.bottom, {
        toValue: 105,
        duration: 350,
      }),
      Animated.timing (this.state.left, {
        toValue: this.width / 20,
        duration: 350,
      }),
      Animated.timing (this.state.opacity, {
        toValue: 0,
        duration: 200,
      }),
    ]).start (() => {
      this.setState ({visible: false});
    });
  };
  render () {
    let {
      px,
      py,
      width,
      height,
      borderRadius,
      poll,
      image,
      bottom,
      left,
      opacity,
    } = this.state;
    return (
      <View>
        <Modal
          visible={this.state.visible}
          transparent={true}
          onRequestClose={() => this.setState ({visible: false})}
          onDismiss={this.dismiss}
        >
          <Animated.View
            style={{
              position: 'absolute',
              top: py,
              left: px,
              width,
              height,
              borderRadius,
              overflow: 'hidden',
            }}
          >
            <ScrollView
              style={{
                zIndex: 2,
                height: this.height,
                backgroundColor: global.user.getSecondaryTheme (),
              }}
              bounces={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                // height: this.height,
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <View style={{width: this.width, height: 450}}>
                <Image
                  source={image}
                  style={{width: this.width, height: 450}}
                  resizeMode={'cover'}
                />
                <Animated.Text
                  style={{
                    width: this.width * 0.9,
                    fontSize: 35,
                    color: 'white',
                    fontWeight: '800',
                    padding: 10,
                    position: 'absolute',
                    // bottom: this.height - 450,
                    bottom,
                    left,
                    // bottom: maxHeight-450,
                  }}
                >
                  {poll.title}
                </Animated.Text>

                <Animated.View
                  style={{
                    opacity,
                    position: 'absolute',
                    top: 25,
                    right: 25,
                    width: 30,
                    height: 30,
                  }}
                >
                  <Touchable
                    onPress={this.dismiss}
                    hitSlop={{top: 50, left: 50, bottom: 50, right: 50}}
                    style={{
                      borderRadius: 20,
                      backgroundColor: global.user.getSecondaryTextColor (),
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 3,
                    }}
                  >
                    <XIcon
                      size={23}
                      color={global.user.getSecondaryTheme ()}
                      style={{paddingTop: 3, paddingLeft: 0}}
                    />
                  </Touchable>
                </Animated.View>

              </View>

              <PopupContent {...poll} />

              <View style={{width: this.width, height: 20}} />

            </ScrollView>

          </Animated.View>
        </Modal>
      </View>
    );
  }
}

export default class PollScreen extends React.Component {
  constructor (props) {
    super (props);
    this.props = props;
    this.state = {
      polls: [],
      limit: 365,
    };
    this._isMounted = false;
    this.popup = React.createRef ();
  }
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };
  loadPolls = (limit = 365, callback) => {
    let api = new ApexAPI (global.user);
    api
      .get (`polls`)
      .then (data => data.json ())
      .then (data => {
        if (data.status == 'ok' && this._isMounted) {
          callback (null, data.body);
        } else if (this._isMounted) {
          callback (data.body, []);
        }
      })
      .catch (e => {
        console.log (e);
        callback (e, []);
      });
  };
  componentWillUnmount () {
    this._isMounted = false;
  }
  componentDidMount () {
    this._isMounted = true;
    this.loadPolls (this.state.limit, (err, polls) => {
      this._isMounted && this.setState ({polls});
    });
  }
  _onRefresh = () => {
    this.setState ({refreshing: true}, () => {
      this.loadPolls (this.state.limit, (err, body) => {
        if (err) {
          this.setState ({refreshing: false, polls: []});
        } else {
          this.refreshingScrollView = true;
          this.setState ({refreshing: false, polls: body});
        }
      });
    });
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
          iconRight={<EmptyIcon size={28} />}
          width={width}
          height={60}
          title="Polls"
        />
        <View style={[styles.bodyHolder, global.user.primaryTheme ()]}>
          <ScrollView>
            {this.state.polls.length
              ? this.state.polls.map ((poll, index) => {
                  return (
                    <View key={poll._id}>
                      <PollBlock
                        poll={poll}
                        popup={this.popup}
                        image={images[index % images.length]}
                      />
                      {/* <PollBlock {...poll} key={poll._id} /> */}
                      {/* <PollBlock {...poll} key={poll._id} /> */}
                    </View>
                  );
                  //   return <PollBlock {...poll} key={poll._id} />;
                })
              : <EmptyPollBlock />}
            <View style={{width, height: 20}} />
          </ScrollView>

        </View>
        <PopupModal ref={this.popup} />
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
  announcement: {
    width,
    height: 50,
  },
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
});
