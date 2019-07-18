import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  Image,
  Alert,
  Text,
  Modal as ReactModal,
} from 'react-native';

import HeaderBar from '../../components/header';

import {ScrollView, TextInput, FlatList} from 'react-native-gesture-handler';

import {
  LeftIcon,
  PlusIcon,
  ReplyIcon,
  SchoolIcons,
  GenericIcon,
  EmptyIcon,
} from '../../classes/icons';

import Modal from 'react-native-modal';

import {boxShadows} from '../../constants/boxShadows';

import Touchable from 'react-native-platform-touchable';

import ApexAPI from '../../http/api';

import ImageViewer from 'react-native-image-zoom-viewer';

import {ifIphoneX} from 'react-native-iphone-x-helper';

import ImagePicker from '../../components/imagePicker';

import Swipeable from 'react-native-swipeable-row';

import ImageViewerModal from '../../components/imageViewer';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

class CreateComment extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      isBackdropVisible: false,
      comment: '',
      parents: [],
      images: [],
    };
  }
  updateComment = text => {
    this.setState ({comment: text});
  };
  post = () => {
    let api = new ApexAPI (global.user);
    api
      .post ('comments', {
        body: this.state.comment,
        parent: this.props.question._id,
        parents: this.state.parents,
        depth: this.state.parents.length - 1,
        resources: this.state.images.map (image => image._id),
      })
      .then (data => data.json ())
      .then (data => {
        if (data.status == 'ok') {
          this.setState ({comment: '', imageIDs: []});
          this.props.parent.loadComments (
            this.props.question._id,
            this.props.callback
          );
          this.setState ({isBackdropVisible: false, images: []});
        } else {
        }
      })
      .catch (e => {
        console.log (e);
      });
  };
  imageFunction = result => {
    this.state.images.push (result);
  };
  render () {
    return (
      <View>
        <Modal
          style={{margin: 0}}
          onModalHide={this.modalHide}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          isVisible={this.state.isBackdropVisible}
          backdropColor={'rgba(0,0,0,0)'}
          onBackdropPress={() => this.setState ({isBackdropVisible: false})}
          propagateSwipe={true}
        >
          <View style={[styles.container, global.user.primaryTheme ()]}>
            <HeaderBar
              iconLeft={
                <Touchable
                  style={{paddingRight: 10}}
                  onPress={() => this.setState ({isBackdropVisible: false})}
                >
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: 18, color: 'red', marginLeft: 5}}>
                      Cancel
                    </Text>
                  </View>
                </Touchable>
              }
              iconRight={
                this.state.comment
                  ? <Touchable style={{paddingRight: 10}} onPress={this.post}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}
                      >
                        <Text
                          style={{
                            fontSize: 18,
                            color: 'orange',
                            marginLeft: 5,
                          }}
                        >
                          Post
                        </Text>
                      </View>
                    </Touchable>
                  : <View style={{paddingRight: 10}}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}
                      >
                        <Text
                          style={{
                            fontSize: 18,
                            color: 'rgba(200,200,200,0.8)',
                            marginLeft: 5,
                          }}
                        >
                          Post
                        </Text>
                      </View>
                    </View>
              }
              width={width}
              height={60}
              title="New Comment"
            />
            <ScrollView
              style={[styles.bodyHolder, global.user.primaryTheme ()]}
              bounces={false}
            >
              <View
                style={{
                  width,
                  backgroundColor: global.user.getSecondaryTheme (),
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderColor: global.user.getBorderColor (),
                }}
              >
                <View
                  style={{
                    width,
                    minHeight: 50,
                    flexDirection: 'row',
                    paddingLeft: 20,
                    paddingBottom: 5,
                  }}
                >
                  <TextInput
                    style={{
                      flexGrow: 1,
                      minHeight: 50,
                      fontSize: 22,
                      color: global.user.getSecondaryTextColor (),
                      paddingTop: 15,
                    }}
                    multiline={true}
                    onChangeText={this.updateComment}
                    placeholderTextColor={global.user.getTertiaryTextColor ()}
                    placeholder="Comment Body"
                  />
                </View>
                <ImagePicker
                  onImageRecieved={this.imageFunction}
                  displayImagesInline={true}
                  displayCameraRollInline={true}
                  style={{
                    marginBottom: 0,
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderTopColor: global.user.getBorderColor (),
                  }}
                />
              </View>

            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  }
}

class Comment extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      inActiveZone: false,
      scale: new Animated.Value (1),
    };
    this.colors = [
      '#000080',
      '#0f52ba',
      '#0080ff',
      '#6593f5',
      '#73c2fb',
      '#57a0d3',
      '#89cff0',
      '#7ef9ff',
    ];
  }
  inZone = () => {
    this.setState ({inActiveZone: true});
    Animated.sequence ([
      Animated.timing (this.state.scale, {
        toValue: 1.25,
        duration: 70,
      }),
      Animated.timing (this.state.scale, {
        toValue: 1,
        duration: 100,
      }),
    ]).start ();
  };
  outOfZone = () => {
    this.setState ({inActiveZone: false});
    Animated.sequence ([
      Animated.timing (this.state.scale, {
        toValue: 1.25,
        duration: 70,
      }),
      Animated.timing (this.state.scale, {
        toValue: 1,
        duration: 100,
      }),
    ]).start ();
  };
  openPost = () => {
    setTimeout (() => {
      this.props.parent.openCommentReply (this.props.comment);
    }, 300);
  };
  render () {
    return (
      <View
        style={{
          borderLeftWidth: StyleSheet.hairlineWidth * 5,
          borderLeftColor: this.props.comment.depth == 0
            ? 'rgba(0,0,0,0)'
            : this.colors[this.props.comment.depth % 8],
          width: width - this.props.comment.depth * 15,
          minWidth: width * 0.5,
          marginTop: 5,
          position: 'relative',
          alignSelf: 'flex-end',
        }}
      >
        <Swipeable
          style={{zIndex: 1}}
          rightButtons={[]}
          rightActionActivationDistance={80}
          rightContent={
            <View
              style={{
                width: 0,
                height: 0,
                backgroundColor: 'rgba(0,0,0,0)',
              }}
            />
          }
          bounceOnMount={this.props.index == 0}
          onRightActionActivate={this.inZone}
          onRightActionDeactivate={this.outOfZone}
          onRightActionRelease={this.openPost}
        >
          <View
            style={[
              styles.comment,
              global.user.primaryTheme (),
              global.user.borderColor (),
              {
                width: width - this.props.comment.depth * 15,
                minWidth: width * 0.5,
              },
              {flexDirection: 'column'},
            ]}
          >
            <Text
              style={[
                {fontSize: 16, marginBottom: 13},
                global.user.primaryTextColor (),
              ]}
            >
              {this.props.comment.username}
            </Text>
            <Text style={[styles.commentBody, global.user.primaryTextColor ()]}>
              {this.props.comment.body}
            </Text>
            {this.props.comment.resources.map ((resource, index, array) => {
              return (
                <Touchable
                  onPress={() => {
                    this.props.openImageViewer (array, index);
                  }}
                  key={'image_' + resource._id}
                >
                  <InlineImage resource={resource} index={index} style={{width: (width - this.props.comment.depth * 15)*0.95}} />
                </Touchable>
              );
            })}
          </View>
        </Swipeable>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 0,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            backgroundColor: '#64d7fa',
          }}
        >
          <Animated.View
            style={{
              alignSelf: 'stretch',
              width: 80,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              transform: [{scale: this.state.scale}],
            }}
          >
            <ReplyIcon
              size={25}
              color={
                this.state.inActiveZone ? 'white' : 'rgba(255,255,255,0.3)'
              }
            />
          </Animated.View>
        </View>
      </View>
    );
  }
}

class InlineImage extends React.Component {
  constructor (props) {
    super (props);
  }
  render () {
    let {resource} = this.props;
    return (
      <View
        style={[{
          padding: 5,
          backgroundColor: global.user.getSecondaryTheme (),
          marginTop: 5,
          marginBottom: 2,
          width: width * 0.9,
          borderRadius: 2,
          borderWidth: StyleSheet.hairlineWidth * 5,
          borderColor: global.user.getBorderColor (),
          overflow: 'hidden',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }, this.props.style || {}]}
      >
        <View
          style={{
            paddingRight: 10,
            borderRightWidth: StyleSheet.hairlineWidth * 2,
            borderRightColor: global.user.getBorderColor (),
            marginRight: 10,
          }}
        >
          <Image
            source={{
              uri: `https://www.apexschools.co${resource.path}`,
            }}
            style={{
              height: 35,
              width: resource.width / resource.height * 35,
            }}
          />
        </View>
        <View
          style={{
            flexGrow: 1,
            flexDirection: 'column',
            justifyContent: 'space-evenly',
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: global.user.getSecondaryTextColor (),
            }}
          >
            Image
            {' '}
            {this.props.index}
          </Text>
          <Text
            style={{
              alignSelf: 'stretch',
              fontSize: 12,
              fontStyle: 'italic',
              color: global.user.getTertiaryTextColor (),
            }}
            numberOfLines={1}
          >
            {' '}
            https://www.apexschools.co
            {resource.path}
          </Text>
        </View>
      </View>
    );
  }
}

export default class QuestionScreen extends React.Component {
  constructor (props) {
    super (props);
    this.props = props;

    this.question = this.props.navigation.getParam ('question');
    this.state = {
      comments: [],
    };
    this.createComment = React.createRef ();
    this.imageViewerModal = React.createRef ();
    this._isMounted = false;
  }
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };
  loadComments = (post, callback) => {
    let api = new ApexAPI (global.user);
    api
      .get (
        `comments?find_fields=parent&parent=${post}&order_by=date&order_direction=-1&populate=resources`
      )
      .then (data => data.json ())
      .then (data => {
        if (data.status == 'ok') {
          callback (null, data.body);
        } else {
          callback (data.body, []);
        }
      })
      .catch (e => {
        console.log (e);
        callback (e, []);
      });
  };
  componentWillMount () {
    this._isMounted = false;
  }
  componentDidMount () {
    this._isMounted = true;
    this.loadComments (this.question._id, (err, comments) => {
      this._isMounted && this.setState ({comments});
    });
  }
  openCreate = () => {
    this.createComment.current.setState ({
      isBackdropVisible: true,
      parents: [this.question._id],
    });
  };
  commentTree (depth, root, comments) {
    let directChildren = comments.filter (comment => {
      let depthParent;
      let arrayIndex = (depth + 2) * -1;
      if (true) {
        [depthParent] = comment.parents.slice (-1);
      } else {
        [depthParent] = comment.parents.slice (arrayIndex, arrayIndex - 1);
      }
      return comment.depth == depth + 1 && depthParent == root._id;
    });
    return {
      node: root,
      children: directChildren.map (child => {
        return this.commentTree (depth + 1, child, comments);
      }),
    };
  }
  flattenTree (tree, accumulatorArray = []) {
    if (tree.children.length == 0) {
      return [...accumulatorArray, tree.node];
    } else {
      accumulatorArray.push (tree.node);
      tree.children.forEach (leaf => {
        accumulatorArray = [...this.flattenTree (leaf, accumulatorArray)];
      });
      return accumulatorArray;
    }
  }
  openCommentReply = comment => {
    this.createComment.current.setState ({
      isBackdropVisible: true,
      parents: [...comment.parents, comment._id],
    });
  };
  openImageViewer = (resources, index) => {
    let urls = resources.map (resource => {
      return {url: `https://www.apexschools.co${resource.path}`};
    });
    this.imageViewerModal.current.setState ({
      isBackdropVisible: true,
      images: urls,
      index: index,
    });
  };
  render () {
    let commentTree = this.commentTree (-1, this.question, this.state.comments);
    let commentList = [];
    if (commentTree.children.length) {
      commentList = this.flattenTree (commentTree);
    }
    commentList = commentList.slice (1);
    return (
      <View style={[styles.container, global.user.primaryTheme ()]}>
        <HeaderBar
          iconLeft={
            <Touchable onPress={() => this.props.navigation.goBack ()}>
              <LeftIcon size={28} />
            </Touchable>
          }
          iconRight={<EmptyIcon width={24} height={32} />}
          width={width}
          height={60}
          title="Question"
        />
        <View style={[styles.bodyHolder, global.user.primaryTheme ()]}>
          <ScrollView style={global.user.primaryTheme ()}>
            <View
              style={{
                width,
                paddingTop: 15,
                paddingBottom: 15,
                borderBottomWidth: StyleSheet.hairlineWidth * 2,
                borderColor: global.user.getBorderColor (),
              }}
            >
              <View
                style={{
                  paddingLeft: 25,
                  paddingRight: 25,
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    color: global.user.getPrimaryTextColor (),
                    fontWeight: '500',
                  }}
                >
                  {this.question.title}
                </Text>

                <Text
                  style={{
                    fontSize: 14,
                    color: global.user.getSecondaryTextColor (),
                    marginTop: 15,
                  }}
                >

                  {this.question.body}
                </Text>
              </View>
              <View
                style={{
                  width,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}
              >
                {this.question.resources.map ((resource, index, array) => {
                  return (
                    <Touchable
                      onPress={() => {
                        this.openImageViewer (array, index);
                      }}
                      key={'image_' + resource._id}
                    >
                      <InlineImage resource={resource} index={index} />
                    </Touchable>
                  );
                })}
              </View>

            </View>
            <Touchable
              onPress={this.openCreate}
              style={{
                borderBottomWidth: StyleSheet.hairlineWidth * 2,
                borderColor: global.user.getBorderColor (),
                width,
                height: 45,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#64d7fa',
              }}
            >
              <ReplyIcon size={30} />
            </Touchable>
            <FlatList
              data={commentList}
              renderItem={({item, index}) => (
                <Comment
                  openImageViewer={this.openImageViewer}
                  parent={this}
                  index={index}
                  comment={item}
                />
              )}
              keyExtractor={(item, index) => item._id}
              contentContainerStyle={{
                backgroundColor: global.user.getPrimaryTheme (),
              }}
            />
          </ScrollView>
        </View>
        <CreateComment
          parent={this}
          question={this.question}
          ref={this.createComment}
          callback={(err, comments) => {
            this.setState ({comments});
          }}
        />
        <ImageViewerModal ref={this.imageViewerModal} parent={this} />
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
  comment: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  commentBody: {
    fontSize: 15,
  },
});
