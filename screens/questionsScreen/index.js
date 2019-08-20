import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  Alert,
  Text,
  Keyboard,
  Easing,
  RefreshControl,
} from 'react-native';

import HeaderBar from '../../components/header';

import {ScrollView, TextInput, FlatList} from 'react-native-gesture-handler';

import {
  LeftIcon,
  PlusIcon,
  ReplyIcon,
  MessageIcon,
  ClockIcon,
  EllipsisIcon,
  LightBulbIcon,
  SchoolIcons,
} from '../../classes/icons';

import Modal from 'react-native-modal';

import {boxShadows} from '../../constants/boxShadows';

import Touchable from '../../components/react-native-platform-touchable';

import ApexAPI from '../../http/api';

import {ifIphoneX} from 'react-native-iphone-x-helper';

import ImagePicker from '../../components/imagePicker';

import moment from 'moment';

import Swipeable from 'react-native-swipeable-row';

import ActionSheet from 'react-native-actionsheet';

import * as Haptics from 'expo-haptics';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

class CreateQuestion extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      isBackdropVisible: false,
      title: '',
      body: '',
      images: [],
      tags: [],
      tag: '',
      height: new Animated.Value (height),
    };
  }
  updateTitle = text => {
    this.setState ({title: text});
  };
  updateBody = text => {
    this.setState ({body: text});
  };
  post = () => {
    let api = new ApexAPI (global.user);
    api
      .post ('posts', {
        title: this.state.title,
        body: this.state.body,
        resources: this.state.images.map (image => image._id),
        tags: this.state.tags,
      })
      .then (data => data.json ())
      .then (data => {
        if (data.status == 'ok') {
          setTimeout (() => {
            this.props.parent.loadQuestions (
              this.props.parent.state.limit,
              this.props.callback
            );
          }, 500);
          this.setState ({
            isBackdropVisible: false,
            images: [],
            tags: [],
            body: '',
            tag: '',
            title: '',
          });
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
  updateTag = text => {
    this.setState ({tag: text});
  };
  addTag = (tag, colour) => {
    this.state.tags.push ([tag, colour]);
    this.setState (state => ({
      tags: state.tags,
    }));
  };
  compactScrollView = event => {
    Animated.timing (this.state.height, {
      toValue: height - event.endCoordinates.height,
      easing: Easing.bezier (0.2, 0.73, 0.33, 0.99),
      duration: 270,
      delay: 50,
    }).start ();
  };
  openScrollView = event => {
    Animated.timing (this.state.height, {
      toValue: height,
      easing: Easing.bezier (0.2, 0.73, 0.33, 0.99),
      duration: 270,
      delay: 0,
    }).start ();
  };
  addCustomTag = () => {
    if (this.state.tag) {
      this.state.tags.push ([this.state.tag, '#ffffff']);
      this.setState (state => ({
        tags: state.tags,
        tag: '',
      }));
    } else {
      Alert.alert (
        'Error',
        'Tags must contain text',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        {cancelable: false}
      );
    }
  };
  removeTag = tag => {
    this.setState (state => ({
      tags: state.tags.filter (stateTag => stateTag[0] != tag),
    }));
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
            <Animated.View style={{height: this.state.height}}>
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
                  this.state.title
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
                title="New Question"
              />
              <ScrollView
                style={[styles.bodyHolder, global.user.primaryTheme ()]}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
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
                      height: 50,
                      flexDirection: 'row',
                      paddingLeft: 20,
                    }}
                  >
                    <TextInput
                      style={{
                        flexGrow: 1,
                        height: 50,
                        fontSize: 20,
                        color: global.user.getSecondaryTextColor (),
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderColor: global.user.getBorderColor (),
                      }}
                      onChangeText={this.updateTitle}
                      value={this.state.title}
                      placeholderTextColor={global.user.getTertiaryTextColor ()}
                      placeholder="Question Title"
                    />
                  </View>
                  <View
                    style={{
                      width,
                      height: 50,
                      flexDirection: 'row',
                      paddingLeft: 20,
                    }}
                  >
                    <TextInput
                      style={{
                        width: 170,
                        height: 50,
                        fontSize: 18,
                        color: global.user.getSecondaryTextColor (),
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderColor: global.user.getBorderColor (),
                      }}
                      onChangeText={this.updateTag}
                      value={this.state.tag}
                      placeholderTextColor={global.user.getTertiaryTextColor ()}
                      placeholder="Add Tag"
                      maxLength={12}
                    />
                    <View
                      style={{
                        width: 40,
                        height: 50,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderColor: global.user.getBorderColor (),
                      }}
                    >
                      <Touchable
                        hitSlop={{top: 15, left: 15, bottom: 15, right: 15}}
                        onPress={this.addCustomTag}
                      >
                        <PlusIcon
                          size={30}
                          color={global.user.getSecondaryTextColor ()}
                        />
                      </Touchable>
                    </View>
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      style={{
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderColor: global.user.getBorderColor (),
                      }}
                      contentContainerStyle={{
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}
                    >
                      {global.userCourses.map ((course, index) => {
                        return (
                          <Touchable
                            key={'course_' + course.id}
                            onPress={() =>
                              this.addTag (
                                course.course,
                                SchoolIcons.getIcon (course.category)[1]
                              )}
                          >
                            <View
                              style={{
                                paddingLeft: 8,
                                paddingRight: 8,
                                paddingTop: 3,
                                paddingBottom: 3,
                                borderRadius: 15,
                                backgroundColor: SchoolIcons.getIcon (
                                  course.category
                                )[1],
                                marginRight: 5,
                              }}
                            >
                              <Text>
                                {course.course}
                              </Text>
                            </View>
                          </Touchable>
                        );
                      })}
                    </ScrollView>
                  </View>
                  <View
                    style={{
                      width,
                      height: 50,
                      flexDirection: 'row',
                      paddingLeft: 20,
                    }}
                  >
                    <ScrollView
                      horizontal={true}
                      contentContainerStyle={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                      }}
                      showsHorizontalScrollIndicator={false}
                      style={{
                        height: 50,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderColor: global.user.getBorderColor (),
                      }}
                    >
                      {this.state.tags.length
                        ? this.state.tags.map ((tag, index) => {
                            return (
                              <Touchable
                                key={'tag_' + index}
                                onPress={() => this.removeTag (tag[0])}
                              >
                                <View
                                  style={{
                                    paddingLeft: 8,
                                    paddingRight: 8,
                                    paddingTop: 3,
                                    paddingBottom: 3,
                                    borderRadius: 15,
                                    backgroundColor: tag[1],
                                    marginRight: 5,
                                  }}
                                >
                                  <Text>
                                    {tag[0]}
                                  </Text>
                                </View>
                              </Touchable>
                            );
                          })
                        : <Text
                            style={{
                              fontSize: 18,
                              color: global.user.getTertiaryTextColor (),
                            }}
                          >
                            No Tags
                          </Text>}
                    </ScrollView>
                  </View>
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
                        minHeight: 170,
                        fontSize: 18,
                        color: global.user.getSecondaryTextColor (),
                        paddingTop: 15,
                        marginBottom: 15,
                      }}
                      multiline={true}
                      onChangeText={this.updateBody}
                      value={this.state.body}
                      placeholderTextColor={global.user.getTertiaryTextColor ()}
                      placeholder="Question Body (optional)"
                      scrollEnabled={false}
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
            </Animated.View>
          </View>
        </Modal>
      </View>
    );
  }
}

function dateToTimestamp (date) {
  let difference = new Date ().getTime () - date.getTime ();
  if (difference > 86400000) {
    return [
      Math.round (moment.duration (moment ().diff (moment (date))).asDays ()),
      'd',
    ];
  } else if (difference > 3600000) {
    return [
      Math.round (moment.duration (moment ().diff (moment (date))).asHours ()),
      'h',
    ];
  } else if (difference > 60000) {
    return [
      Math.round (
        moment.duration (moment ().diff (moment (date))).asMinutes ()
      ),
      'm',
    ];
  } else {
    return [
      Math.round (
        moment.duration (moment ().diff (moment (date))).asSeconds ()
      ),
      's',
    ];
  }
}

class Question extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      inActiveZone: false,
      scale: new Animated.Value (1),
    };
  }
  inZone = () => {
    Haptics.impactAsync (Haptics.ImpactFeedbackStyle.Light);
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
      this.props.parent.props.navigation.navigate ('Question', {
        question: this.props.question,
      });
    }, 300);
  };
  render () {
    this.props.question.userVote = this.props.question.helpful_votes.indexOf (
      global.user.id
    ) >= 0
      ? 1
      : this.props.question.unhelpful_votes.indexOf (global.user.id) >= 0
          ? -1
          : 0;
    return (
      <View style={{marginTop: 5, position: 'relative'}}>
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
              styles.post,
              // global.user.primaryTheme (),
              global.user.borderColor (),
              global.user.theme == 'Light'
                ? {
                    backgroundColor: 'white',
                  }
                : !global.user.trueDark
                    ? {
                        backgroundColor: '#292a30',
                      }
                    : {
                        backgroundColor: '#000000',
                      },
            ]}
          >
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                flexWrap: 'wrap',
                marginBottom: 3,
              }}
            >
              {this.props.question.tags.map ((tag, index) => {
                return (
                  <View
                    key={'tag_' + index}
                    style={{
                      paddingLeft: 8,
                      paddingRight: 8,
                      paddingTop: 3,
                      paddingBottom: 3,
                      borderRadius: 15,
                      backgroundColor: tag[1],
                      marginRight: 5,
                      alignSelf: 'flex-start',
                    }}
                  >
                    <Text>
                      {tag[0]}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>

            <Text style={[styles.postTitle, global.user.secondaryTextColor ()]}>
              {this.props.question.title}
            </Text>
            <Text
              style={[
                styles.postBody,
                global.user.tertiaryTextColor (),
                {marginBottom: 10},
              ]}
              numberOfLines={5}
              selectable={true}
            >
              {this.props.question.body || ''}
            </Text>
            <Text
              style={{
                marginBottom: 7,
                fontSize: 12,
                fontWeight: '300',
                color: global.user.getTertiaryTextColor (),
              }}
            >
              by {this.props.question.username}
            </Text>
            <View
              style={{
                alignSelf: 'stretch',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View style={{flexDirection: 'row'}}>
                <MessageIcon
                  color={global.user.getTertiaryTextColor ()}
                  style={{marginRight: 3}}
                />
                <Text
                  style={[global.user.tertiaryTextColor (), {marginRight: 10}]}
                >
                  {this.props.question.comments.length}
                </Text>
                <ClockIcon
                  color={global.user.getTertiaryTextColor ()}
                  style={{marginRight: 3}}
                />
                <Text
                  style={[global.user.tertiaryTextColor (), {marginRight: 10}]}
                >
                  {dateToTimestamp (new Date (this.props.question.date)).join (
                    ''
                  )}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <LightBulbIcon
                  size={14}
                  color={global.user.getTertiaryTextColor ()}
                />
                <Text
                  style={{
                    fontSize: 12,
                    color: this.props.question.userVote == -1
                      ? '#e03634'
                      : this.props.question.userVote == 1
                          ? '#20d67b'
                          : global.user.getTertiaryTextColor (),
                    marginLeft: 5,
                  }}
                >
                  {this.props.question.helpful_votes.length +
                    this.props.question.unhelpful_votes.length >
                    0
                    ? `${Math.round (this.props.question.helpful_votes.length / (this.props.question.helpful_votes.length + this.props.question.unhelpful_votes.length) * 100)}% `
                    : 'Unkown % '}
                  Helpful
                </Text>
              </View>
              <Touchable
                hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                onPress={() => this.props.showActionSheet (this.props.question)}
              >
                <EllipsisIcon
                  size={20}
                  color={global.user.getTertiaryTextColor ()}
                  style={{marginRight: 20}}
                />
              </Touchable>
            </View>
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
              size={35}
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

class CustomActionSheet extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      question: {},
      options: [
        'Open',
        'Vote as Helpful',
        'Vote as Unhelpful',
        'Report',
        'Cancel',
      ],
    };
    this.actionSheet = React.createRef ();
  }
  show (question) {
    let options = [
      'Open',
      'Vote as Helpful',
      'Vote as Unhelpful',
      'Report',
      'Cancel',
    ];
    if (
      global.user.permission_level >= 3 ||
      question.uploaded_by == global.user.id
    ) {
      options[3] = 'Delete';
    }
    this.setState (
      {
        options,
        question,
      },
      () => {
        this.actionSheet.current.show ();
      }
    );
  }
  actionSheetAction = index => {
    let api = new ApexAPI (global.user);
    switch (index) {
      case 0:
        this.props.parent.props.navigation.navigate ('Question', {
          question: this.state.question,
        });
        break;
      case 1:
        Haptics.notificationAsync (Haptics.ImpactFeedbackStyle.Success);
        api
          .get (`vote/posts/${this.state.question._id}?vote=helpful`)
          .then (data => data.json ())
          .then (async data => {
            if (data.status == 'ok') {
              let questions = this.props.parent.state.questions.map (
                question => {
                  if (question._id == data.body._id) {
                    return data.body;
                  } else {
                    return question;
                  }
                }
              );
              setTimeout (() => {
                this.props.parent.setState ({questions});
              }, 0);
            } else {
              Alert.alert (
                'Error',
                res.body,
                [
                  {
                    text: 'Try Again',
                    onPress: () => this.createAssignment (),
                  },
                  {
                    text: 'Cancel',
                    onPress: () => {
                      this.setState ({
                        isBackdropVisible: false,
                        images: [],
                      });
                    },
                    style: 'cancel',
                  },
                ],
                {cancelable: false}
              );
            }
          })
          .catch (e => {
            console.log (e);
            if (e.message == "JSON Parse error: Unrecognized token '<'") {
              Alert.alert (
                'Connection Error',
                'Unable to connect to the server',
                [
                  {text: 'Try Again', onPress: () => this.onPress ()},
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
          });
        break;
      case 2:
        Haptics.notificationAsync (Haptics.ImpactFeedbackStyle.Error);
        api
          .get (`vote/posts/${this.state.question._id}?vote=unhelpful`)
          .then (data => data.json ())
          .then (async data => {
            if (data.status == 'ok') {
              let questions = this.props.parent.state.questions.map (
                question => {
                  if (question._id == data.body._id) {
                    return data.body;
                  } else {
                    return question;
                  }
                }
              );
              setTimeout (() => {
                this.props.parent.setState ({questions});
              }, 0);
            } else {
              Alert.alert (
                'Error',
                res.body,
                [
                  {
                    text: 'Try Again',
                    onPress: () => this.createAssignment (),
                  },
                  {
                    text: 'Cancel',
                    onPress: () => {
                      this.setState ({
                        isBackdropVisible: false,
                        images: [],
                      });
                    },
                    style: 'cancel',
                  },
                ],
                {cancelable: false}
              );
            }
          })
          .catch (e => {
            console.log (e);
            if (e.message == "JSON Parse error: Unrecognized token '<'") {
              Alert.alert (
                'Connection Error',
                'Unable to connect to the server',
                [
                  {text: 'Try Again', onPress: () => this.onPress ()},
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
          });
        break;
      case 3:
        if (
          global.user.permission_level >= 3 ||
          this.state.question.uploaded_by == global.user.id
        ) {
          api
            .delete (`posts/${this.state.question._id}`)
            .then (data => data.json ())
            .then (async data => {
              if (data.status == 'ok') {
                this.props.parent.loadQuestions (20, (err, questions) => {
                  this.props.parent._isMounted &&
                    this.props.parent.setState ({questions});
                });
              } else {
                Alert.alert (
                  'Error',
                  data.body.error,
                  [
                    {
                      text: 'Cancel',
                      onPress: () => {},
                      style: 'cancel',
                    },
                  ],
                  {cancelable: false}
                );
              }
            })
            .catch (e => {
              console.log (e);
              if (e.message == "JSON Parse error: Unrecognized token '<'") {
                Alert.alert (
                  'Connection Error',
                  'Unable to connect to the server',
                  [
                    {text: 'Try Again', onPress: () => this.onPress ()},
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
            });
        } else {
        }
        break;
    }
  };
  render () {
    return (
      <ActionSheet
        ref={this.actionSheet}
        options={this.state.options}
        cancelButtonIndex={4}
        destructiveButtonIndex={3}
        onPress={this.actionSheetAction}
      />
    );
  }
}

export default class QuestionsScreen extends React.Component {
  constructor (props) {
    super (props);
    this.props = props;
    this.state = {
      questions: [],
      limit: 20,
    };
    this.createQuestion = React.createRef ();
    this.actionSheet = React.createRef ();
    this._isMounted = false;
  }
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };
  loadQuestions = (limit = 20, callback) => {
    let api = new ApexAPI (global.user);
    api
      .get (
        `posts?find_fields=school&school=${global.school.id}&order_by=date&order_direction=-1&populate=resources&limit=${limit}`
      )
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
    this.loadQuestions (this.state.limit, (err, questions) => {
      this._isMounted && this.setState ({questions});
    });
  }
  openCreate = () => {
    this.createQuestion.current.setState ({isBackdropVisible: true});
  };
  showActionSheet = question => {
    this.actionSheet.current.show (question);
  };
  _onRefresh = () => {
    this.setState ({refreshing: true}, () => {
      this.loadQuestions (this.state.limit, (err, body) => {
        if (err) {
          this.setState ({refreshing: false, questions: []});
        } else {
          this.refreshingScrollView = true;
          this.setState ({refreshing: false, questions: body});
        }
      });
    });
  };
  render () {
    return (
      <View style={[styles.container, global.user.primaryTheme ()]}>
        <HeaderBar
          iconLeft={
            <Touchable
              onPress={() => this.props.navigation.goBack ()}
              style={{paddingLeft: 0, paddingRight: 45}}
            >
              <LeftIcon size={28} />
            </Touchable>
          }
          iconRight={
            <Touchable style={{paddingRight: 10}} onPress={this.openCreate}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <PlusIcon size={20} color="orange" />
                <Text style={{fontSize: 24, color: 'orange', marginLeft: 5}}>
                  New
                </Text>
              </View>
            </Touchable>
          }
          width={width}
          height={60}
          title="Forum"
        />
        <View style={[styles.bodyHolder, global.user.primaryTheme ()]}>
          {this.state.questions.length
            ? <FlatList
                data={
                  this.state.questions.length != 0 ? this.state.questions : []
                }
                onRefresh={this._onRefresh}
                refreshing={false}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                  />
                }
                renderItem={({item, index}) => (
                  <Question
                    showActionSheet={this.showActionSheet}
                    parent={this}
                    index={index}
                    question={item}
                  />
                )}
                keyExtractor={(item, index) => item._id}
              />
            : <Text
                style={{
                  color: global.user.getSecondaryTextColor (),
                  textAlign: 'center',
                  fontSize: 18,
                  marginTop: 50,
                  padding: 20,
                }}
              >
                No Questions Yet! Create a question to get help from your classmates
              </Text>}

        </View>
        <CreateQuestion
          parent={this}
          ref={this.createQuestion}
          callback={(err, questions) => {
            this._isMounted && this.setState ({questions});
          }}
        />
        <CustomActionSheet ref={this.actionSheet} parent={this} />
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
  post: {
    width,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  postTitle: {
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 0,
  },
  postBody: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.9,
  },
});
