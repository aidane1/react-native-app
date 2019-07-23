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
  AppState,
  Alert,
  RefreshControl,
  KeyboardAvoidingView,
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

import moment from 'moment';

import HeaderBar from '../../components/header';

import {ScrollView, FlatList} from 'react-native-gesture-handler';

import Touchable from 'react-native-platform-touchable';

import {boxShadows} from '../../constants/boxShadows';

import ImageViewer from 'react-native-image-zoom-viewer';

import ApexAPI from '../../http/api';

import ImageBar from '../../components/imagePicker';

import {ifIphoneX} from 'react-native-iphone-x-helper';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

class ImagePickerPopup extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      isBackdropVisible: false,
    };
  }
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
          animationOut="slideOutDown"
          isVisible={this.state.isBackdropVisible}
          backdropColor={
            global.user.theme == 'Light' ? 'black' : 'rgba(255,255,255,0.4)'
          }
          onBackdropPress={() => this.setState ({isBackdropVisible: false})}
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
  render () {
    if (this.props.showName) {
      return (
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
      );
    } else {
      return (
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
                        height: resource.height / resource.width * width * 0.6,
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
      );
    }
  }
}

class CreateChatBar extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      value: '',
    };
    this.text = React.createRef ();
    this.keyboardIsUp = false;
    this.canSendMessage = true;
  }
  componentDidMount () {
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
    this.keyboardIsUp = true;
    this.props.compactScrollView (event);
    this.dropTextBar = true;
  };
  keyboardWillHide = event => {
    this.props.openScrollView (event);
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
      this.setState ({value: ''});
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
        });
      }, 250);
    } else {
      this.props.imagePickerPopup.current.setState ({isBackdropVisible: true});
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
  render () {
    return (
      <View
        style={[
          ChatRoomStyles.createChat,
          boxShadows.boxShadow3,
          global.user.secondaryTheme (),
        ]}
      >
        {this.props.images.length == 0
          ? <View />
          : <View
              style={[
                {
                  width,
                  height: 80,
                  backgroundColor: global.user.getSecondaryTheme (),
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
                          uri: `https://www.apexschools.co${image.path}`,
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
              <PhotoIcon color={global.user.getPrimaryTextColor ()} size={20} />
            </View>
          </Touchable>
          <TextInput
            value={this.state.value}
            onChangeText={text => this.setState ({value: text})}
            ref={this.text}
            style={[
              ChatRoomStyles.createChatText,
              global.user.secondaryTextColor (),
            ]}
            placeholder="Write a message"
            placeholderTextColor={global.user.getTertiaryTextColor ()}
            keyboardAppearance={global.user.theme.toLowerCase ()}
          />
          <Touchable onPress={this.sendMessage}>
            <View style={ChatRoomStyles.sendChat}>
              <SendIcon color={global.user.getPrimaryTextColor ()} size={20} />
            </View>
          </Touchable>
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

class WSConnection {
  constructor (parent) {
    this.parent = parent;
    this.ws = new WebSocket (
      `https://www.apexschools.co/web-sockets/app/${global.websocketPath}?x-api-key=${global.user['x-api-key']}&x-id-key=${global.user['x-id-key']}`
    );
    this.ws.onopen = this.onopen;
    this.ws.onmessage = this.onmessage;
    this.ws.onerror = this.onerror;
    this.ws.onclose = this.onclose;
    this.isLoaded = false;
  }
  onopen = () => {
    console.log ('socket is open!');
    this.isLoaded = true;
    this.parent.canSendMessages = true;
  };

  onmessage = message => {
    console.log ('socket got message!');
    console.log (message.data);
    message = JSON.parse (message.data);
    if (message.status === 'error') {
    } else {
        let chats = [];
        chats = [message];
        this.parent.test ();
        this.parent.showMessages (chats);
        // this.parent.updateState({chats});
        // this.parent.setState ({chats}, () => {

        // });
    }
    return false;
  };

  onerror = error => {
    console.log ('error');
  };
  onclose = () => {
    console.log ('closed');
    this.isLoaded = false;
    setTimeout (() => {
      this.parent.updateWebSocket (this.messageBuffer);
      this.parent.websocket = new WSConnection (
        this.parent,
        this.messageBuffer
      );
    }, 1000);
  };
  sendMessage = message => {
    this.ws.send (message);
  };
}

export default class ChatRoom extends React.Component {
  constructor (props) {
    super (props);
    this.scrollView = React.createRef ();
    this.websocket = new WSConnection (this);
    this.canSendMessages = false;
    this.scrollToBottom = true;
    this.imageBar = React.createRef ();
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
      appState: AppState.currentState,
      updated: false,
      refreshing: false,
      limit: 50,
    };
    this.scrollViewHeight = 0;
    this.previousChatLength = 0;
    this.refreshingScrollView = false;
    this.messageBuffer = [];
  }
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };
  test = () => {
    console.log ('parent is active');
  };
  updateWebSocket = messageBuffer => {
    this.websocket = new WSConnection (this, messageBuffer);
  };
  updateState = state => {
    this.setState (state);
  };
  showMessages = messages => {
    console.log (messages);
    if (this.state.appState == 'active') {
      if (this.messageBuffer.length > 0) {
        messages = [...this.messageBuffer, ...messages];
        this.messageBuffer = [];
      }
      this.setState (state => ({
        chats: [...state.chats, ...messages],
      }));
    } else {
      this.messageBuffer = [...this.messageBuffer, ...messages];
    }
  };
  sendMessage = message => {
    if (
      this.canSendMessages &&
      (message.message || message.resources.length > 0)
    ) {
      message.resources = this.state.images.map (image => image._id);
      this.websocket.sendMessage (JSON.stringify (message));
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
  componentDidMount () {
    console.log ('mounting');
    AppState.addEventListener ('change', this._handleAppStateChange);
    this.loadChats (this.state.limit, (err, body) => {
      if (err) {
        this.setState ({chats: [], updated: true});
      } else {
        this.setState ({chats: body, updated: true});
      }
    });
  }
  componentWillUnmount () {
    console.log ('unmounting, daddy!');
    AppState.removeEventListener ('change', this._handleAppStateChange);
    this.props.navigation.goBack ();
  }
  _handleAppStateChange = nextAppState => {
    console.log(nextAppState);
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
    this.setState ({refreshing: true, limit: this.state.limit + 50}, () => {
      this.loadChats (this.state.limit, (err, body) => {
        if (err) {
          this.setState ({refreshing: false, chats: []});
        } else {
          this.refreshingScrollView = true;
          this.setState ({refreshing: false, chats: body});
        }
      });
    });
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
          <KeyboardAvoidingView
            style={[ChatRoomStyles.chatroom, global.user.primaryTheme ()]}
            behavior={'height'}
            enabled
            keyboardVerticalOffset={60}
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
                        this.state.chats[index - 1].username == chat.username
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
              images={this.state.images}
              parent={this}
            />
            {/* </Animated.View> */}
          </KeyboardAvoidingView>
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
    height: 55,
    fontSize: 16,
  },
  photoChat: {
    width: 40,
    height: 55,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendChat: {
    width: 60,
    height: 55,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
