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

import HeaderBar from '../../components/header';

import {ScrollView} from 'react-native-gesture-handler';

import Touchable from 'react-native-platform-touchable';

import {boxShadows} from '../../constants/boxShadows';

import ImageViewer from 'react-native-image-zoom-viewer';

import ApexAPI from '../../http/api';

import ImageBar from '../../components/imagePicker';

import {ifIphoneX} from 'react-native-iphone-x-helper';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

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
    return (
      <View style={{width, flexDirection: 'column'}}>
        <Text
          style={[
            ChatRoomStyles.chatBoxUsername,
            this.props.sent
              ? ChatRoomStyles.usernameSent
              : ChatRoomStyles.usernameRecieved,
            global.user.tertiaryTextColor (),
          ]}
        >
          {this.props.message.username}
        </Text>
        <View
          style={[
            ChatRoomStyles.chatBox,
            this.props.sent
              ? ChatRoomStyles.chatBoxSent
              : ChatRoomStyles.chatBoxRecieved,
          ]}
        >
          <Text style={{fontSize: 16}}>
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
                  source={{uri: `https://www.apexschools.co${resource.path}`}}
                  style={{
                    width: width * 0.7,
                    height: resource.height / resource.width * width * 0.7,
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                />
              </Touchable>
            );
          })}
        </View>
      </View>
    );
  }
}

class CreateChatBar extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      keyboardHeight: new Animated.Value (0),
      value: '',
    };
    this.text = React.createRef ();
    this.dropTextBar = true;
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
    this.props.compactScrollView (event);
    this.dropTextBar = true;
  };
  keyboardWillHide = event => {
    if (this.dropTextBar) {
      this.props.openScrollView (event);
    }
  };
  sendMessage = () => {
    if (this.canSendMessage) {
      this.canSendMessage = false;
      let message = {
        message: this.state.value,
        'x-api-key': global.user['x-api-key'],
        'x-id-key': global.user['x-id-key'],
      };
      this.props.imageBar.current.clearImages ();
      this.props.sendMessage (message);
      this.text.current.clear ();
      this.setState ({value: ''});
      setTimeout (() => {
        this.canSendMessage = true;
      }, 3000);
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
    if (this.dropTextBar) {
      this.dropTextBar = false;
      Keyboard.dismiss ();
    } else {
      this.text.current.focus ();
      this.dropTextBar = true;
    }
  };
  render () {
    return (
      <Animated.View
        style={[
          ChatRoomStyles.createChat,
          boxShadows.boxShadow3,
          {top: this.state.keyboardHeight},
          global.user.secondaryTheme (),
        ]}
      >
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
      </Animated.View>
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

function sendResourseToServer (resource) {
  return fetch (
    'https://www.apexschools.co/api/v1/resources?base64=true&populate=resources',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': global.user['x-api-key'],
        'x-id-key': global.user['x-id-key'],
        school: global.user['school'],
      },
      body: JSON.stringify (resource),
    }
  );
}

export default class ChatRoom extends React.Component {
  constructor (props) {
    super (props);
    this.scrollView = React.createRef ();
    this.websocket = new WebSocket (
      `https://www.apexschools.co/web-sockets/app/${global.websocketPath}?x-api-key=${global.user['x-api-key']}&x-id-key=${global.user['x-id-key']}`
    );
    this.canSendMessages = false;
    this.scrollToBottom = true;
    this.imageBar = React.createRef ();
    this.webSocketOpen = true;
    this.error = false;
    this.errorMessage = '';
    this.imageViewerModal = React.createRef ();
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
    this.websocket.onopen = () => {
      this.canSendMessages = true;
    };
    this.websocket.onmessage = message => {
      message = JSON.parse (message.data);
      let chats = [...this.state.chats, message];
      this.setState ({chats}, () => {
        this.scrollView.current.scrollTo ({
          x: 0,
          y: this.scrollViewHeight,
          animated: 'true',
        });
      });
      return false;
    };
    this.websocket.onerror = () => {
      this.canSendMessages = false;
    };
    this.websocket.onclose = () => {
      this.canSendMessages = false;
      this.websocket = new WebSocket (
        `https://www.apexschools.co/web-sockets/app/${global.websocketPath}?x-api-key=${global.user['x-api-key']}&x-id-key=${global.user['x-id-key']}`
      );
      this.webSocketOpen = false;
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };
  sendMessage = message => {
    if (this.canSendMessages && message.message) {
      message.resources = this.state.images.map (image => image._id);
      this.websocket.send (JSON.stringify (message));
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
    AppState.removeEventListener ('change', this._handleAppStateChange);
  }
  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match (/inactive|background/) &&
      nextAppState === 'active'
    ) {
      if (!this.webSocketOpen) {
        this.websocket = new WebSocket (
          `https://www.apexschools.co/web-sockets/app/${global.websocketPath}?x-api-key=${global.user['x-api-key']}&x-id-key=${global.user['x-id-key']}`
        );
      }
      console.log ('App has come to the foreground!');
    }
    this.setState ({appState: nextAppState});
  };
  onScroll = event => {
    let scrollPos =
      event.nativeEvent.contentOffset.y +
      event.nativeEvent.layoutMeasurement.height;
    let bottom = event.nativeEvent.contentSize.height;
    this.scrollToBottom = Math.abs (scrollPos - bottom) < 100;
  };
  compactScrollView = event => {
    Animated.timing (this.state.height, {
      toValue: ifIphoneX (height - 80, height - 60) -
        event.endCoordinates.height,
      easing: Easing.bezier (0.2, 0.73, 0.33, 0.99),
      duration: 280,
      delay: 50,
    }).start (() => {
      this.scrollView.current.scrollTo ({
        x: 0,
        y: this.scrollViewHeight,
        animated: 'true',
      });
    });
    this.scrollToBottom = true;
  };
  openScrollView = event => {
    Animated.timing (this.state.height, {
      toValue: ifIphoneX (height - 80, height - 60),
      easing: Easing.bezier (0.2, 0.73, 0.33, 0.99),
      duration: 280,
      delay: 0,
    }).start ();
  };
  addImage = async result => {
    if (result.uri) {
      result.path = `/courses/${global.courseInfoCourse.id}/resources`;
      sendResourseToServer (result).then (res => res.json ()).then (json => {
        if (json.status == 'ok') {
          this.state.images.push (json.body);
          this.setState ({images: this.state.images});
        }
      });
    }
  };
  _onRefresh = () => {
    this.setState ({refreshing: true, limit: this.state.limit + 50}, () => {
      this.loadChats (this.state.limit, (err, body) => {
        if (err) {
          this.setState({refreshing: false, chats: []});
        } else {
          this.setState ({refreshing: false, chats: body});
        }
      });
    });
  };
  render () {
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
          <Animated.View
            style={[
              ChatRoomStyles.chatroom,
              {height: this.state.height},
              global.user.primaryTheme (),
            ]}
          >
            <ScrollView
              ref={this.scrollView}
              onScroll={this.onScroll}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps={'always'}
              scrollEventThrottle={25}
              onContentSizeChange={(contentWidth, contentHeight) => {
                this.scrollViewHeight = contentHeight;
                if (this.scrollToBottom) {
                  this.scrollView.current.scrollToEnd ({animated: true});
                }
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
                    return (
                      <ChatBox
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
            </ScrollView>
            <CreateChatBar
              imageBar={this.imageBar}
              compactScrollView={this.compactScrollView}
              openScrollView={this.openScrollView}
              sendMessage={this.sendMessage}
            />
          </Animated.View>
          <View
            style={{
              width,
              height: 0,
              flexGrow: 1,
              backgroundColor: global.user.getSecondaryTheme (),
            }}
          >
            <ScrollView style={{width}}>
              <ImageBar
                ref={this.imageBar}
                displayImages={true}
                imageFunction={this.addImage}
              />
            </ScrollView>
          </View>
        </View>
        <ImageViewerModal ref={this.imageViewerModal} parent={this} />
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
    maxWidth: width * 0.8,
    padding: 8,
    borderRadius: 3,
    marginTop: 2,
    marginBottom: 10,
  },
  chatBoxUsername: {
    marginTop: 10,
    fontSize: 12,
    fontStyle: 'italic',
  },
  usernameSent: {
    alignSelf: 'flex-end',
    position: 'relative',
    right: 15,
    color: 'rgba(0,0,0,0.5)',
    display: 'none',
  },
  usernameRecieved: {
    position: 'relative',
    left: 15,
    alignSelf: 'flex-start',
  },
  chatBoxSent: {
    backgroundColor: '#6ec7fa',
    alignSelf: 'flex-end',
    position: 'relative',
    right: 15,
  },
  chatBoxRecieved: {
    backgroundColor: '#e1e1e1',
    position: 'relative',
    left: 15,
    alignSelf: 'flex-start',
  },
  createChat: {
    width,
    height: 55,
    backgroundColor: 'white',
    position: 'relative',
    flexDirection: 'row',
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
