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
  Linking,
  TextInput,
  AppState,
  Alert,
  RefreshControl,
  KeyboardAvoidingView,
  Easing,
} from 'react-native';

import {
  LeftIcon,
  PlusIcon,
  CheckBoxFilledIcon,
  EmptyIcon,
  CheckBoxOpenIcon,
  AccountIcon,
  SendIcon,
  PhotoIcon,
  CloseCircleIcon,
} from '../../classes/icons';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

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

import Modal from 'react-native-modal';

// import moment from 'moment';

import moment from 'moment-timezone';

import HeaderBar from '../../components/header';

import {ScrollView, FlatList} from 'react-native-gesture-handler';

import ParsedText from 'react-native-parsed-text';

import Touchable from '../../components/react-native-platform-touchable';

import {boxShadows} from '../../constants/boxShadows';

import ImageViewer from 'react-native-image-zoom-viewer';

import ApexAPI from '../../http/api';

import ImageBar from '../../components/imagePicker';

import {ifIphoneX} from 'react-native-iphone-x-helper';
import {Platform} from '@unimodules/core';

function cacheImages (images) {
  return images.map (image => {
    if (typeof image === 'string') {
      return Image.prefetch (image);
    } else {
      return Asset.fromModule (image).downloadAsync ();
    }
  });
}

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

class ImagePickerPopup extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      isBackdropVisible: false,
      input: false,
      keyBoardIsUp: false,
    };
  }
  backdropPress = () => {
    this.setState ({isBackdropVisible: false}, () => {});
  };
  hide = () => {
    if (this.state.input) {
      if (this.state.keyBoardIsUp) {
        this.state.input.current.focus ();
      }
    }
  };
  render () {
    return (
      <View>
        <Modal
          style={{
            margin: 0,
            paddingBottom: 0,
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
          animationIn="slideInUp"
          animationInTiming={250}
          animationOutTiming={250}
          animationOut="slideOutDown"
          isVisible={this.state.isBackdropVisible}
          backdropColor={
            global.user.theme == 'Light' ? 'black' : 'rgba(255,255,255,0.4)'
          }
          onModalHide={this.hide}
          onBackdropPress={this.backdropPress}
          propagateSwipe={true}
        >

          <View>
            <ImageBar
              style={{marginBottom: 0, padding: 0}}
              displayImagesInline={false}
              onImageRecieved={this.props.onImageRecieved}
              displayCameraRollInline={true}
              column={true}
              path={global.resourcePath}
            />
          </View>
        </Modal>
      </View>
    );
  }
}

class ChatBox extends React.Component {
  constructor (props) {
    super (props);
  }
  openImageViewer = (resources, index) => {
    let urls = resources.map (resource => {
      return {url: `https://www.apexschools.co${resource.path}`};
    });
    this.props.imageViewer.current.setState ({
      isBackdropVisible: true,
      images: urls,
      index: index,
    });
  };
  handleURLPress = (url, matchIndex) => {
    Linking.canOpenURL (url).then (supported => {
      console.log (supported);
      if (supported) {
        Linking.openURL (url);
      } else {
        console.log ('dont know');
      }
    });
  };
  delete = () => {
    let message = {
      type: 'delete',
      room: global.chatroomKey,
      delete_id: this.props.message._id,
    };
    global.websocket.client.sendMessage (message);
  };
  deleteText = () => {
    this.props.message.date = new Date (this.props.message.date);

    let diff = new Date ().getTime () - this.props.message.date.getTime ();

    if (diff < 10000 && this.props.message.username === global.user.username) {
      Keyboard.dismiss ();
      setTimeout (() => {
        Alert.alert (
          'Delete This Message?',
          this.props.message.message,
          [
            {
              text: 'Okay',
              onPress: () => {
                this.delete ();
                // console.log(Object.keys(this.props));
                this.props.parent.createChatBar.current.focus ();
              },
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
      }, 270);
    }
  };
  render () {
    if (this.props.showName) {
      return (
        <Touchable onLongPress={this.deleteText}>
          <View
            style={{
              flexDirection: 'row',
              width,
              paddingLeft: 5,
              alignItems: 'flex-start',
              marginTop: 10,
            }}
          >
            {this.props.message.profile_picture !== ''
              ? <Image
                  source={{
                    uri: `https://www.apexschools.co${this.props.message.profile_picture}`,
                  }}
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: 22.5,
                    overflow: 'hidden',
                    marginTop: 5,
                  }}
                />
              : <AccountIcon
                  size={45}
                  color={global.user.getPrimaryTextColor ()}
                />}
            {/* <AccountIcon size={45} color={global.user.getPrimaryTextColor ()} /> */}
            <View style={ChatRoomStyles.chatBoxHolder}>
              <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                <Text
                  style={[
                    ChatRoomStyles.chatBoxUsername,
                    global.user.primaryTextColor (),
                  ]}
                >
                  {this.props.message.username}
                </Text>
                <Text
                  style={[
                    ChatRoomStyles.chatBoxTime,
                    global.user.tertiaryTextColor (),
                  ]}
                >
                  {moment (this.props.message.date).calendar ()}
                </Text>
              </View>
              <View style={[ChatRoomStyles.chatBox]}>
                <ParsedText
                  style={{
                    fontSize: 13,
                    opacity: 0.9,
                    fontWeight: '200',
                    color: global.user.getPrimaryTextColor (),
                  }}
                  parse={[
                    {
                      type: 'url',
                      style: {
                        fontWeight: '500',
                        textDecorationLine: 'underline',
                      },
                      onPress: this.handleURLPress,
                    },
                  ]}
                >
                  {this.props.message.message}
                </ParsedText>
                {this.props.message.resources.map ((resource, index, array) => {
                  return (
                    <View style={boxShadows.boxShadow4} key={resource._id}>
                      <Touchable
                        onPress={() => {
                          this.openImageViewer (array, index);
                        }}
                      >
                        <Image
                          source={{
                            uri: `https://www.apexschools.co${resource.path}`,
                          }}
                          style={{
                            width: width * 0.6,
                            height: resource.height /
                              resource.width *
                              width *
                              0.6,
                            alignSelf: 'center',
                            marginTop: 10,
                            marginBottom: 10,
                            marginRight: 25,
                          }}
                        />
                      </Touchable>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

        </Touchable>
      );
    } else {
      return (
        <Touchable onLongPress={this.deleteText}>
          <View
            style={{
              flexDirection: 'row',
              width,
              paddingLeft: 50,
              alignItems: 'flex-start',
              marginTop: 0,
            }}
          >
            <View style={ChatRoomStyles.chatBoxHolder}>
              <View style={[ChatRoomStyles.chatBox, {marginTop: 0}]}>
                <Text
                  style={{
                    fontSize: 13,
                    opacity: 0.9,
                    fontWeight: '200',
                    color: global.user.getPrimaryTextColor (),
                  }}
                >
                  {this.props.message.message}
                </Text>
                {this.props.message.resources.map ((resource, index, array) => {
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
                          width: width * 0.6,
                          height: resource.height /
                            resource.width *
                            width *
                            0.6,
                          alignSelf: 'center',
                          marginTop: 10,
                          marginBottom: 10,
                          marginRight: 25,
                        }}
                      />
                    </Touchable>
                  );
                })}
              </View>
            </View>
          </View>
        </Touchable>
      );
    }
  }
}

class CreateChatBar extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      value: '',
      typing: false,
      usersTyping: [],
    };
    this.text = React.createRef ();
    this.keyboardIsUp = false;
    this.canSendMessage = true;
  }
  componentDidMount () {
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
    if (Platform.OS == 'ios') {
      this.keyboardWillShowSub.remove ();
      this.keyboardWillHideSub.remove ();
    } else {
      this.keyboardWillShowSub.remove ();
      this.keyboardWillHideSub.remove ();
    }
  }
  keyboardWillShow = event => {
    this.keyboardIsUp = true;
    if (Platform.OS == 'ios') {
      this.props.compactScrollView (event);
    } else {
      // this.props.compactAndroidScrollView (event);
    }
    this.dropTextBar = true;
  };
  keyboardWillHide = event => {
    if (Platform.OS == 'ios') {
      this.props.openScrollView (event);
    } else {
      // this.props.openAndroidScrollView (event);
    }
    this.keyboardIsUp = false;
  };
  sendMessage = () => {
    if (this.canSendMessage) {
      this.canSendMessage = false;
      let message = {
        message: this.state.value,
        'x-api-key': global.user['x-api-key'],
        'x-id-key': global.user['x-id-key'],
        resources: this.props.images.map (image => image._id),
      };
      this.props.sendMessage (message);
      this.text.current.clear ();
      this.setState ({value: '', typing: false});
      this.canSendMessage = true;
    } else {
      Alert.alert (
        'Error',
        'Must wait at least 3 seconds between messages',
        [
          {text: 'Try Again', onPress: () => this.sendMessage ()},
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
  };
  sendPhoto = () => {
    if (this.keyboardIsUp) {
      setTimeout (() => {
        this.props.imagePickerPopup.current.setState ({
          isBackdropVisible: true,
          input: this.text,
          keyBoardIsUp: true,
        });
      }, 20);
    } else {
      this.props.imagePickerPopup.current.setState ({
        isBackdropVisible: true,
        input: this.text,
        keyBoardIsUp: false,
      });
    }
    Keyboard.dismiss ();
    this.keyboardIsUp = false;
  };
  removeImage = image => {
    this.props.parent.setState ({
      images: this.props.images.filter (
        stateImage => image._id != stateImage._id
      ),
    });
  };
  typing = text => {
    let typing = !!text;
    if (typing && !this.state.typing) {
      this.props.updateTyping (true);
    } else if (!typing && this.state.typing) {
      this.props.updateTyping (false);
    }
    this.setState ({value: text, typing});
  };
  focus = () => {
    setTimeout (() => {
      this.text.current.focus ();
    }, 300);
  };
  render () {
    this.state.usersTyping = this.state.usersTyping.filter (
      user => user != global.user.username
    );
    return (
      <View style={{width, flexDirection: 'column', alignItems: 'center'}}>
        {this.state.usersTyping.length == 0
          ? <View />
          : <View
              style={{
                width: width * 0.90,
                paddingTop: 5,
                paddingBottom: 3,
                paddingLeft: 10,
                paddingRight: 10,
                backgroundColor: global.user.getSecondaryTheme (),
                opacity: 0.8,
                borderTopLeftRadius: 2,
                borderTopRightRadius: 2,
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  color: global.user.getSecondaryTextColor (),
                  fontSize: 12,
                }}
              >
                <Text style={{fontWeight: '700'}}>
                  {this.state.usersTyping.join (', ')}
                </Text>
                <Text style={{opacity: 0.8}}>
                  {this.state.usersTyping.length > 1 ? ' are ' : ' is '}
                  typing...
                </Text>
              </Text>
            </View>}
        <View
          style={[
            ChatRoomStyles.createChat,
            boxShadows.boxShadow5,
            {
              borderTopWidth: StyleSheet.hairlineWidth,
              borderTopColor: global.user.theme == 'Light'
                ? 'rgba(255,255,255,0.5)'
                : 'rgba(0,0,0,0.5)',
            },
            // global.user.secondaryTheme (),
            global.user.primaryTheme (),
          ]}
        >
          {this.props.images.length == 0
            ? <View />
            : <View
                style={[
                  {
                    width,
                    height: 80,
                    backgroundColor: global.user.getPrimaryTheme (),
                  },
                ]}
              >
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  style={{paddingTop: 10, paddingLeft: 10}}
                >
                  {this.props.images.map ((image, index) => {
                    return (
                      <View key={'barImage_' + index}>
                        <Touchable
                          onPress={() => this.removeImage (image)}
                          style={{
                            position: 'absolute',
                            top: -5,
                            left: 0,
                            zIndex: 1,
                          }}
                          hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
                        >
                          <CloseCircleIcon
                            size={20}
                            style={{
                              width: 20,
                              height: 20,
                              color: 'black',
                              backgroundColor: 'white',
                              borderRadius: 10,
                              overflow: 'hidden',
                            }}
                          />
                        </Touchable>
                        <Image
                          source={{
                            uri: image.uri,
                          }}
                          style={{
                            zIndex: 0,
                            height: 70,
                            width: image.width / image.height * 70,
                            backgroundColor: 'black',
                            marginLeft: 10,
                            marginRight: 10,
                          }}
                        />
                      </View>
                    );
                  })}
                </ScrollView>
              </View>}

          <View style={{width, flexDirection: 'row'}}>
            <Touchable onPress={this.sendPhoto}>
              <View style={ChatRoomStyles.photoChat}>
                <PhotoIcon
                  color={global.user.getPrimaryTextColor ()}
                  size={20}
                />
              </View>
            </Touchable>
            <TextInput
              value={this.state.value}
              onChangeText={this.typing}
              ref={this.text}
              style={[
                ChatRoomStyles.createChatText,
                global.user.secondaryTextColor (),
              ]}
              placeholder={`Message ${global.chatroomName}`}
              placeholderTextColor={global.user.getTertiaryTextColor ()}
              keyboardAppearance={global.user.theme.toLowerCase ()}
            />
            <Touchable onPress={this.sendMessage}>
              <View style={ChatRoomStyles.sendChat}>
                <SendIcon
                  color={global.user.getPrimaryTextColor ()}
                  size={20}
                />
              </View>
            </Touchable>
          </View>
        </View>
      </View>
    );
  }
}

class ImageViewerModal extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      isBackdropVisible: false,
      index: 0,
      images: [],
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

// class WSConnection {
//   constructor (parent) {
//     this.parent = parent;
//     this.ws = new WebSocket (
//       `https://www.apexschools.co/web-sockets/app/${global.websocketPath}?x-api-key=${global.user['x-api-key']}&x-id-key=${global.user['x-id-key']}`
//     );
//     this.ws.onopen = this.onopen;
//     this.ws.onmessage = this.onmessage;
//     this.ws.onerror = this.onerror;
//     this.ws.onclose = this.onclose;
//     this.isLoaded = false;
//   }
//   onopen = () => {
//     console.log ('socket is open!');
//     this.isLoaded = true;
//     this.parent.canSendMessages = true;
//   };

//   onmessage = message => {
//     console.log ('socket got message!');
//     console.log (message.data);
//     message = JSON.parse (message.data);
//     if (message.status === 'error') {
//     } else {
//         let chats = [];
//         chats = [message];
//         this.parent.test ();
//         this.parent.showMessages (chats);
//         // this.parent.updateState({chats});
//         // this.parent.setState ({chats}, () => {

//         // });
//     }
//     return false;
//   };

//   onerror = error => {
//     console.log ('error');
//   };
//   onclose = () => {
//     console.log ('closed');
//     this.isLoaded = false;
//     setTimeout (() => {
//       this.parent.updateWebSocket (this.messageBuffer);
//       this.parent.websocket = new WSConnection (
//         this.parent,
//         this.messageBuffer
//       );
//     }, 1000);
//   };
//   sendMessage = message => {
//     this.ws.send (message);
//   };
// }

export default class ChatRoom extends React.Component {
  constructor (props) {
    super (props);
    global.bindWebSocket (this.showMessage, global.chatroomKey);

    this.scrollView = React.createRef ();

    this.canSendMessages = false;
    this.scrollToBottom = true;
    this.imageBar = React.createRef ();
    this.createChatBar = React.createRef ();
    this.webSocketOpen = true;
    this.error = false;
    this.errorMessage = '';
    this.imageViewerModal = React.createRef ();
    this.imagePickerPopup = React.createRef ();
    this.tryAgain = () => {};
    this.state = {
      chats: [],
      images: [],
      height: new Animated.Value (ifIphoneX (height - 80, height - 60)),
      // height: new Animated.Value (200),
      appState: AppState.currentState,
      updated: false,
      refreshing: false,
      limit: 50,
    };
    this.scrollViewHeight = 0;
    this.previousChatLength = 0;
    this.refreshingScrollView = false;
    this.messageBuffer = [];

    this._isMounted = false;
  }
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };

  updateState = state => {
    this.setState (state);
  };

  showMessage = message => {
    // console.log({message});
    if (this._isMounted) {
      if (message.type == 'typing') {
        this.createChatBar.current.setState ({usersTyping: message.users});
      } else if (message.type == 'request') {
        if (message.request == 'users-typing') {
          this.createChatBar.current.setState ({usersTyping: message.users});
        }
      } else if (message.type == 'delete') {
        // console.log (message);
        this.setState (({chats}) => {
          return {
            chats: chats.filter (chat => chat._id != message._id),
          };
        });
      } else {
        // console.log (message);
        this.setState (state => ({
          chats: [...state.chats, message],
        }));
      }
    }
  };
  updateTyping = typing => {
    global.websocket.client.sendMessage ({
      type: 'typing',
      username: global.user.username,
      typing,
      room: global.chatroomKey,
    });
  };
  sendMessage = message => {
    this.updateTyping (false);
    if (message.message || message.resources.length > 0) {
      message.resources = this.state.images.map (image => image._id);
      message.room = global.chatroomKey;
      message.type = 'message';
      global.websocket.client.sendMessage (message);
      this.setState ({images: []});
    } else {
      if (message.message) {
        Alert.alert (
          'Error',
          'Connection closed. Try leaving and re-entering the page to reload connection.',
          [
            {text: 'Try Again', onPress: () => this.sendMessage (message)},
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
      } else {
        Alert.alert (
          'Error',
          'Messages must contain a body',
          [
            {text: 'Try Again', onPress: () => this.sendMessage (message)},
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
    }
  };

  loadChats = (limit = 50, callback) => {
    let api = new ApexAPI (global.user);
    api
      .get (`${global.textPath}&limit=${limit}`)
      .then (res => res.json ())
      .then (res => {
        if (res.status == 'ok') {
          res.body = res.body.reverse ();
          this.previousChatLength = res.body.length;
          callback (null, res.body);
        } else {
          this.error = true;
          this.errorMessage = res.body;
          this.tryAgain = this.loadChats;
          callback (res.body, []);
        }
      })
      .catch (e => {
        if (e.message == "JSON Parse error: Unrecognized token '<'") {
          this.error = true;
          this.errorMessage = 'Unable to retrieve chats';
          this.tryAgain = this.loadChats;
        }
        callback (e, []);
      });
  };
  removeChatroomKey = () => {
    let api = new ApexAPI (global.user);
    api
      .put (`chatroom-keys/pull/${global.user.id}`, {
        key: global.chatroomKey,
      })
      .then (data => data.json ())
      .then (data => {})
      .catch (e => {
        console.log (e);
      });
  };
  componentDidMount () {
    this._isMounted = true;
    AppState.addEventListener ('change', this._handleAppStateChange);
    console.log ('Im gonna do it');
    this.removeChatroomKey ();
    global.websocket.client.sendMessage ({
      type: 'request',
      request: 'users-typing',
      room: global.chatroomKey,
    });
    this.loadChats (this.state.limit, (err, body) => {
      if (err) {
        this.setState ({chats: [], updated: true});
      } else {
        this.setState ({chats: body, updated: true});
      }
    });
  }
  componentWillUnmount () {
    this._isMounted = false;
    AppState.removeEventListener ('change', this._handleAppStateChange);
    this.removeChatroomKey ();
    this.updateTyping (false);
    this.props.navigation.goBack ();
  }
  _handleAppStateChange = nextAppState => {
    console.log (nextAppState);
    if (
      this.state.appState.match (/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.loadChats (this.state.limit, (err, body) => {
        if (err) {
          this.setState ({chats: [], updated: true});
        } else {
          this.setState ({chats: body, updated: true});
        }
      });
    } else if (
      this.state.appState.match (/inactive|active/) &&
      nextAppState === 'background'
    ) {
      this.updateTyping (false);
      this.removeChatroomKey ();
    }
    this.setState ({appState: nextAppState});
  };
  onScroll = event => {
    let scrollPos =
      event.nativeEvent.contentOffset.y +
      event.nativeEvent.layoutMeasurement.height;
    // console.log (scrollPos);
    let bottom = event.nativeEvent.contentSize.height;
    // console.log(bottom);
    this.scrollToBottom = Math.abs (scrollPos - bottom) < 200;
  };
  compactScrollView = event => {
    // Animated.timing (this.state.height, {
    //   toValue: ifIphoneX (height - 80, height - 60) -
    //     event.endCoordinates.height,
    //   easing: Easing.bezier (0.2, 0.73, 0.33, 0.99),
    //   duration: 280,
    //   delay: 50,
    // }).start (() => {
    //   this.scrollView.current.scrollTo ({
    //     x: 0,
    //     y: this.scrollViewHeight,
    //     animated: 'true',
    //   });
    // });
    if (this.scrollToBottom) {
      this.scrollView.current.scrollToEnd ({animated: true});
    }
  };
  compactAndroidScrollView = event => {
    console.log ('cunts');
    console.log (event.endCoordinates);
    console.log (height);
    Animated.timing (this.state.height, {
      toValue: 200,
      // easing: Easing.bezier (0.2, 0.73, 0.33, 0.99),
      duration: 0,
      delay: 0,
    }).start (() => {
      this.scrollView.current.scrollTo ({
        x: 0,
        y: this.scrollViewHeight,
        animated: 'true',
      });
    });
    // if (this.scrollToBottom) {
    //   this.scrollView.current.scrollToEnd ({animated: true});
    // }
    if (this.scrollToBottom) {
      this.scrollView.current.scrollToEnd ({animated: true});
    }
  };
  openAndroidScrollView = event => {
    // Animated.timing (this.state.height, {
    //   toValue: ifIphoneX (height - 80, height - 60),
    //   easing: Easing.bezier (0.2, 0.73, 0.33, 0.99),
    //   duration: 280,
    //   delay: 0,
    // }).start ();
  };
  openScrollView = event => {
    // Animated.timing (this.state.height, {
    //   toValue: ifIphoneX (height - 80, height - 60),
    //   easing: Easing.bezier (0.2, 0.73, 0.33, 0.99),
    //   duration: 280,
    //   delay: 0,
    // }).start ();
  };
  imageFunction = result => {
    this.state.images.push (result);
    this.setState ({images: this.state.images});
  };
  _onRefresh = () => {
    this.setState (
      {refreshing: true, limit: this.state.chats.length + 50},
      () => {
        this.loadChats (this.state.limit, (err, body) => {
          if (err) {
            this.setState ({refreshing: false, chats: []});
          } else {
            this.refreshingScrollView = true;
            this.setState ({refreshing: false, chats: body});
          }
        });
      }
    );
  };
  render () {
    // console.log(this.state.chats);
    return (
      <View style={{width, height}}>
        <HeaderBar
          iconLeft={
            <Touchable onPress={() => this.props.navigation.goBack ()}>
              <LeftIcon size={28} />
            </Touchable>
          }
          iconRight={<EmptyIcon width={28} height={32} />}
          width={width}
          height={60}
          title={`${global.chatroomName} Chatroom`}
        />
        <View
          style={{
            width,
            height: ifIphoneX (height - 80, height - 60),
            backgroundColor: global.user.getPrimaryTheme (),
            overflow: 'hidden',
            flexDirection: 'column',
          }}
        >
          {/* <Animated.View
            style={[
              ChatRoomStyles.chatroom,
              {height: this.state.height},
              global.user.primaryTheme (),
            ]}
          > */}
          {Platform.OS == 'ios'
            ? <KeyboardAvoidingView
                style={[ChatRoomStyles.chatroom, global.user.primaryTheme ()]}
                behavior={'height'}
                enabled={true}
                keyboardVerticalOffset={ifIphoneX (80, 60)}
                // keyboardVerticalOffset={200}
              >
                {/* this  flatlist is a posibility if need be, but try to avoid using it  */}
                {/* <FlatList
              onScroll={this.onScroll}
              keyboardDismissMode={'on-drag'}
              keyboardShouldPersistTaps={'always'}
              scrollEventThrottle={25}
              onContentSizeChange={(contentWidth, contentHeight) => {
                if (this.scrollToBottom) {
                  this.scrollView.current.scrollToEnd ({animated: true});
                } else if (this.refreshingScrollView) {
                  this.refreshingScrollView = false;
                  this.scrollView.current.scrollToIndex({animated: false, index: 50});
                  // this.scrollView.current.scrollTo ({
                  //   x: 0,
                  //   y: contentHeight - this.scrollViewHeight,
                  //   animated: false,
                  // });
                }
                this.scrollViewHeight = contentHeight;
              }}
              data={this.state.chats}
              keyExtractor={(item, index) => {
                return item._id;
              }}
              renderItem={({item, index}) => {
                let chat = item;
                let showName = true;
                if (index != 0) {
                  if (this.state.chats[index - 1].username == chat.username) {
                    showName = false;
                    chat.date = new Date (chat.date);
                    this.state.chats[index - 1].date = new Date (
                      this.state.chats[index - 1].date
                    );
                    if (
                      chat.date.getTime () -
                        this.state.chats[index - 1].date.getTime () >
                      216000
                    ) {
                      showName = true;
                    }
                  }
                }
                return (
                  <ChatBox
                    showName={showName}
                    imageViewer={this.imageViewerModal}
                    sent={global.user.username == chat.username}
                    message={chat}
                  />
                );
              }}
              refreshing={this.state.refreshing}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
              }
              ref={this.scrollView}
            /> */}
                <ScrollView
                  ref={this.scrollView}
                  onScroll={this.onScroll}
                  keyboardDismissMode="on-drag"
                  keyboardShouldPersistTaps={'always'}
                  scrollEventThrottle={25}
                  onContentSizeChange={(contentWidth, contentHeight) => {
                    if (this.scrollToBottom) {
                      this.scrollView.current.scrollToEnd ({animated: true});
                    } else if (this.refreshingScrollView) {
                      this.refreshingScrollView = false;
                      this.scrollView.current.scrollTo ({
                        x: 0,
                        y: contentHeight - this.scrollViewHeight,
                        animated: false,
                      });
                    }
                    this.scrollViewHeight = contentHeight;
                  }}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this._onRefresh}
                    />
                  }
                >
                  {this.state.updated
                    ? this.state.chats.map ((chat, index) => {
                        let showName = true;
                        if (index != 0) {
                          if (
                            this.state.chats[index - 1].username ==
                            chat.username
                          ) {
                            showName = false;
                            chat.date = new Date (chat.date);
                            this.state.chats[index - 1].date = new Date (
                              this.state.chats[index - 1].date
                            );
                            if (
                              chat.date.getTime () -
                                this.state.chats[index - 1].date.getTime () >
                              216000
                            ) {
                              showName = true;
                            }
                          }
                        }
                        return (
                          <ChatBox
                            showName={showName}
                            imageViewer={this.imageViewerModal}
                            key={'chat_' + index}
                            sent={global.user.username == chat.username}
                            message={chat}
                            parent={this}
                          />
                        );
                      })
                    : <UIActivityIndicator
                        color={global.user.getPrimaryTextColor ()}
                        count={12}
                        size={20}
                        style={{marginTop: 80}}
                      />}

                  <View style={{width, height: 20}} />
                </ScrollView>
                <CreateChatBar
                  imagePickerPopup={this.imagePickerPopup}
                  compactScrollView={this.compactScrollView}
                  openScrollView={this.openScrollView}
                  sendMessage={this.sendMessage}
                  updateTyping={this.updateTyping}
                  images={this.state.images}
                  parent={this}
                  ref={this.createChatBar}
                />
              </KeyboardAvoidingView>
            : <Animated.View
                style={[
                  ChatRoomStyles.chatroom,
                  global.user.primaryTheme (),
                  {height: this.state.height},
                ]}
              >
                <ScrollView
                  ref={this.scrollView}
                  onScroll={this.onScroll}
                  keyboardDismissMode="on-drag"
                  // keyboardShouldPersistTaps={'always'}
                  scrollEventThrottle={25}
                  onContentSizeChange={(contentWidth, contentHeight) => {
                    if (this.scrollToBottom) {
                      this.scrollView.current.scrollToEnd ({animated: true});
                    } else if (this.refreshingScrollView) {
                      this.refreshingScrollView = false;
                      this.scrollView.current.scrollTo ({
                        x: 0,
                        y: contentHeight - this.scrollViewHeight,
                        animated: false,
                      });
                    }
                    this.scrollViewHeight = contentHeight;
                  }}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this._onRefresh}
                    />
                  }
                >
                  {this.state.updated
                    ? this.state.chats.map ((chat, index) => {
                        let showName = true;
                        if (index != 0) {
                          if (
                            this.state.chats[index - 1].username ==
                            chat.username
                          ) {
                            showName = false;
                            chat.date = new Date (chat.date);
                            this.state.chats[index - 1].date = new Date (
                              this.state.chats[index - 1].date
                            );
                            if (
                              chat.date.getTime () -
                                this.state.chats[index - 1].date.getTime () >
                              216000
                            ) {
                              showName = true;
                            }
                          }
                        }
                        return (
                          <ChatBox
                            showName={showName}
                            imageViewer={this.imageViewerModal}
                            key={'chat_' + index}
                            sent={global.user.username == chat.username}
                            message={chat}
                            parent={this}
                          />
                        );
                      })
                    : <UIActivityIndicator
                        color={global.user.getPrimaryTextColor ()}
                        count={12}
                        size={20}
                        style={{marginTop: 80}}
                      />}

                  <View style={{width, height: 20}} />
                </ScrollView>
                <CreateChatBar
                  imagePickerPopup={this.imagePickerPopup}
                  compactScrollView={this.compactScrollView}
                  openScrollView={this.openScrollView}
                  compactAndroidScrollView={this.compactAndroidScrollView}
                  openAndroidScrollView={this.openAndroidScrollView}
                  sendMessage={this.sendMessage}
                  updateTyping={this.updateTyping}
                  images={this.state.images}
                  parent={this}
                  ref={this.createChatBar}
                />
              </Animated.View>}

        </View>
        <ImageViewerModal ref={this.imageViewerModal} parent={this} />
        <ImagePickerPopup
          ref={this.imagePickerPopup}
          onImageRecieved={this.imageFunction}
        />
      </View>
    );
  }
}

const ChatRoomStyles = StyleSheet.create ({
  chatroom: {
    width,
    height: ifIphoneX (height - 80, height - 60),
    backgroundColor: '#Fdfdfd',
  },
  chatBox: {
    marginTop: 5,
    marginBottom: 15,
  },
  chatBoxTime: {
    opacity: 0.5,
    fontWeight: '500',
    fontSize: 10,
  },
  chatBoxHolder: {
    width: width - 50,
    flexDirection: 'column',
    paddingLeft: 10,
    paddingRight: 20,
  },
  chatBoxUsername: {
    fontSize: 14,
    marginRight: 10,
  },
  createChat: {
    width,
    backgroundColor: 'white',
    position: 'relative',
    flexDirection: 'column',
  },
  createChatText: {
    width: width - 100,
    height: ifIphoneX (65, 53),
    fontSize: 16,
  },
  photoChat: {
    width: 40,
    height: ifIphoneX (65, 53),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendChat: {
    width: 60,
    height: ifIphoneX (65, 53),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
