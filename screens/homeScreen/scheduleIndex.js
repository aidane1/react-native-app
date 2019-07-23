import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  Text,
  Image,
  Modal as ReactModal,
  Alert,
} from 'react-native';

import {Asset} from 'expo-asset';

import {ScrollView} from 'react-native-gesture-handler';

import Touchable from 'react-native-platform-touchable';

import {CloseCircleIcon} from '../../classes/icons';

import {boxShadows} from '../../constants/boxShadows';

import {LinearGradient} from 'expo-linear-gradient';

import {User} from '../../classes/user';

import ImageBar from '../../components/imagePicker';

import ImageViewer from 'react-native-image-zoom-viewer';

import {ifIphoneX} from 'react-native-iphone-x-helper';

import ApexAPI from '../../http/api';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

function makeColorMap (blockNames) {
  let colorArray = [
    '#FF6633',
    '#FFB399',
    '#FF33FF',
    '#FFFF99',
    '#00B3E6',
    '#E6B333',
    '#3366E6',
    '#999966',
    '#99FF99',
    '#B34D4D',
    '#80B300',
    '#809900',
    '#E6B3B3',
    '#6680B3',
    '#66991A',
    '#FF99E6',
    '#CCFF1A',
    '#FF1A66',
    '#E6331A',
    '#33FFCC',
    '#66994D',
    '#B366CC',
    '#4D8000',
    '#B33300',
    '#CC80CC',
    '#66664D',
    '#991AFF',
    '#E666FF',
    '#4DB3FF',
    '#1AB399',
    '#E666B3',
    '#33991A',
    '#CC9999',
    '#B3B31A',
    '#00E680',
    '#4D8066',
    '#809980',
    '#E6FF80',
    '#1AFF33',
    '#999933',
    '#FF3380',
    '#CCCC00',
    '#66E64D',
    '#4D80CC',
    '#9900B3',
    '#E64D66',
    '#4DB380',
    '#FF4D4D',
    '#99E6E6',
    '#6666FF',
  ];
  let colorMap = {};
  for (var i = 0; i < blockNames.length; i++) {
    if (!blockNames[i].is_constant) {
      colorMap[blockNames[i]._id] = colorArray[i];
    } else {
      colorMap[blockNames[i]._id] = '#ffffff';
    }
  }
  return colorMap;
}

function averageColors (colorArray) {
  //get the red of RGB from a hex value
  function hexToR (h) {
    return parseInt (cutHex (h).substring (0, 2), 16);
  }

  //get the green of RGB from a hex value
  function hexToG (h) {
    return parseInt (cutHex (h).substring (2, 4), 16);
  }

  //get the blue of RGB from a hex value
  function hexToB (h) {
    return parseInt (cutHex (h).substring (4, 6), 16);
  }

  //cut the hex into pieces
  function cutHex (h) {
    if (h.charAt (1) == 'x') {
      return h.substring (2, 8);
    } else {
      return h.substring (1, 7);
    }
  }
  var red = 0, green = 0, blue = 0;

  for (var i = 0; i < colorArray.length; i++) {
    red += hexToR ('' + colorArray[i] + '') ** 2;
    green += hexToG ('' + colorArray[i] + '') ** 2;
    blue += hexToB ('' + colorArray[i] + '') ** 2;
  }

  //Average RGB
  red = Math.round (Math.sqrt (red / colorArray.length));
  green = Math.round (Math.sqrt (green / colorArray.length));
  blue = Math.round (Math.sqrt (blue / colorArray.length));
  return 'rgb(' + red + ',' + green + ',' + blue + ')';
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

function cacheImages (images) {
  return images.map (image => {
    if (typeof image === 'string') {
      return Image.prefetch (image);
    } else {
      return Asset.fromModule (image).downloadAsync ();
    }
  });
}

function formatUnit (hour, minute) {
  return `${(hour + 11) % 12 + 1}:${minute.toString ().length == 1 ? '0' + minute.toString () : minute}`;
}
function formatTime (time) {
  return `${formatUnit (time.start_hour, time.start_minute)} - ${formatUnit (time.end_hour, time.end_minute)}`;
}

function getBlock (block, courses, colorMap) {
  if (block.type == 'block') {
    let course = courses[block.block.block];
    if (!course) {
      course = {
        course: "LC's",
        teacher: 'Free',
        category: 'other',
        id: '_',
      };
    }
    return (
      <View style={[{flexGrow: 1}, boxShadows.boxShadow3]}>
        <LinearGradient
          colors={[
            averageColors ([
              '#ffffff',
              colorMap[block.block.block],
              colorMap[block.block.block],
            ]),
            averageColors ([
              '#ffffff',
              '#ffffff',
              colorMap[block.block.block],
              colorMap[block.block.block],
              colorMap[block.block.block],
            ]),
          ]}
          style={{
            borderRadius: 3,
            overflow: 'hidden',
            flexGrow: 1,
            flexDirection: 'column',
            justifyContent: 'space-evenly',
          }}
        >
          <Text style={{textAlign: 'center', fontSize: 16, fontWeight: '500'}}>
            {course.course}
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontStyle: 'italic',
              color: 'rgba(0,0,0,0.6)',
            }}
          >
            {course.teacher}
          </Text>
        </LinearGradient>
      </View>
    );
  } else if (block.type == 'time') {
    return (
      <View
        style={[
          {
            flexGrow: 1,
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            backgroundColor: global.user.getSecondaryTheme (),
            borderRadius: 3,
          },
          boxShadows.boxShadow3,
        ]}
      >
        <Text
          style={{
            textAlign: 'right',
            fontSize: 14,
            fontWeight: '500',
            color: global.user.getSecondaryTextColor (),
          }}
        >
          {formatUnit (block.time.start_hour, block.time.start_minute)}
        </Text>
        <Text
          style={{
            textAlign: 'right',
            fontSize: 14,
            fontWeight: '500',
            color: global.user.getSecondaryTextColor (),
          }}
        >
          -
        </Text>
        <Text
          style={{
            textAlign: 'right',
            fontSize: 14,
            fontWeight: '500',
            color: global.user.getSecondaryTextColor (),
          }}
        >
          {formatUnit (block.time.end_hour, block.time.end_minute)}
        </Text>
      </View>
    );
  } else if (block.type == 'title') {
    return (
      <View
        style={{
          flexGrow: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: 18,
            fontWeight: '500',
            color: global.user.getSecondaryTextColor (),
          }}
        >
          {block.title}
        </Text>
      </View>
    );
  } else {
    return <View />;
  }
}

export default class ScheduleScreenTile extends React.Component {
  constructor (props) {
    super (props);
    let images = global.user.scheduleImages;
    (images = Array.isArray (images) ? images : []), (this.state = {
      scheduleType: global.user.scheduleType,
      images,
    });
    this.imageViewerModal = React.createRef ();
    let currentDate = new Date (2019, 10, 8);
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
    this.currentSemesters = currentSemesters;
    let courseMap = {};
    for (var i = 0; i < currentSemesters.length; i++) {
      for (var key in global.semesterMap[currentSemesters[i]]) {
        if (
          courseMap[key] == undefined ||
          global.semesterMap[currentSemesters[i]][key].isReal
        ) {
          courseMap[key] = global.semesterMap[currentSemesters[i]][key];
        }
      }
    }
    this.courseMap = courseMap;
    this.colorMap = makeColorMap (global.school.blocks);
  }
  changeScheduleType = async type => {
    global.user.scheduleType = type;
    await User._saveToStorage (global.user);
    this.setState ({scheduleType: type});
    let api = new ApexAPI (global.user);
    api
      .put (`users/${global.user.id}`, {
        schedule_type: type,
      })
      .then (data => data.json ())
      .then (data => {})
      .catch (e => {});
  };
  changeScheduleImage = async result => {
    this.state.images.push (result);
    global.user.scheduleImages = [result];
    await User._saveToStorage (global.user);
    const imageAssets = await cacheImages ([
      `https://www.apexschools.co${result.path}`,
    ]);
    this.setState ({images: [result]});
    let api = new ApexAPI (global.user);
    api
      .put (`users/${global.user.id}`, {
        schedule_images: [result._id],
      })
      .then (data => data.json ())
      .then (data => {})
      .catch (e => {});
  };
  removeImage = async resource => {
    let images = [...global.user.scheduleImages];
    images = images.filter (image => {
      return image._id != resource._id;
    });
    this.state.images = images;
    global.user.scheduleImages = this.state.images;
    await User._saveToStorage (global.user);
    const imageAssets = await cacheImages (
      this.state.images.map (image => `https://www.apexschools.co${image.path}`)
    );
    this.setState ({images: this.state.images});
    let api = new ApexAPI (global.user);
    api
      .put (`users/${global.user.id}`, {
        schedule_images: global.user.scheduleImages,
      })
      .then (data => data.json ())
      .then (data => {})
      .catch (e => {});
  };
  openImageModal = (index, array) => {
    this.imageViewerModal.current.setState ({
      index,
      images: array.map (item => {
        return {url: `https://www.apexschools.co${item.path}`};
      }),
      isBackdropVisible: true,
    });
  };
  render () {
    // console.log(global.school.schedule);
    return (
      <View
        style={{width, height: ifIphoneX (height - 80 - 60, height - 60 - 45)}}
      >
        <ScrollView style={[styles.scrollBack, global.user.primaryTheme ()]}>
          <View style={[styles.titleBlock, global.user.borderColor ()]}>
            <Text
              style={[styles.h1, {color: global.user.getPrimaryTextColor ()}]}
            >
              Schedule
            </Text>
          </View>
          {this.state.scheduleType == 'image'
            ? <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  paddingTop: 10,
                }}
              >
                <View
                  style={[
                    {
                      width: width * 0.95,
                      paddingTop: 40,
                      paddingBottom: 40,
                      backgroundColor: global.user.getSecondaryTheme (),
                      opacity: 0.9,
                      borderRadius: 10,
                    },
                    boxShadows.boxShadow7,
                  ]}
                >
                  {this.state.images.length != 0
                    ? this.state.images.map ((resource, index, array) => {
                        return (
                          <View
                            key={'image_' + index}
                            style={[
                              boxShadows.boxShadow5,
                              {
                                postion: 'relative',
                                marginTop: 15,
                                marginBottom: 15,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                // maxHeight: 150,
                                // overflow: "hidden"
                              },
                            ]}
                          >
                            <Touchable
                              onPress={() => {
                                this.openImageModal (index, array);
                              }}
                            >
                              <Image
                                source={{
                                  uri: `https://www.apexschools.co${resource.path}`,
                                }}
                                style={{
                                  width: width * 0.93,
                                  height: resource.height /
                                    resource.width *
                                    width *
                                    0.93,
                                }}
                              />
                            </Touchable>
                          </View>
                        );
                      })
                    : <View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                          }}
                        >
                          <Text
                            style={{
                              width: width * 0.93,
                              fontSize: 30,
                              fontWeight: '500',
                              backgroundColor: global.user.getPrimaryTheme (),
                              textAlign: 'center',
                              color: global.user.getPrimaryTextColor (),
                              paddingTop: 40,
                              paddingBottom: 40,
                            }}
                          >
                            No Images Yet
                          </Text>
                        </View>
                      </View>}
                </View>

                <ImageBar
                  style={{
                    width: width * 0.95,
                    marginTop: 20,
                  }}
                  displayImagesInline={false}
                  displayCameraRollInline={false}
                  path={`/users/${global.user.id}/schedule_images`}
                  onImageRecieved={this.changeScheduleImage}
                />
              </View>
            : <View>
                {this.currentSemesters.length > 0
                  ? global.school.schedule.map ((schedule, index_1) => {
                      return (
                        <View
                          style={{width, flexDirection: 'row'}}
                          key={'schedule_' + index_1}
                        >
                          <View style={[styles.scheduleDay, {width: 70}]}>
                            {schedule[0].map ((block, index_3) => {
                              return (
                                <View
                                  key={
                                    'schedule_' +
                                      index_1 +
                                      '_day_' +
                                      0 +
                                      '_block_' +
                                      index_3
                                  }
                                  style={[
                                    styles.scheduleBlock,
                                    block.type == 'time'
                                      ? {
                                          width: 60,
                                          height: 70,
                                        }
                                      : {
                                          width: 60,
                                          height: 40,
                                        },
                                  ]}
                                >
                                  {getBlock (
                                    block,
                                    this.courseMap,
                                    this.colorMap
                                  )}
                                </View>
                              );
                            })}
                          </View>
                          <ScrollView
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                            style={{width: width - 70}}
                            contentContainerStyle={{width: 670, marginLeft: 60}}
                          >
                            <View style={styles.scheduleWeek}>
                              {schedule.slice (1).map ((day, index_2) => {
                                return (
                                  <View
                                    key={
                                      'schedule_' + index_1 + '_day_' + index_2
                                    }
                                    style={[
                                      styles.scheduleDay,
                                      index_2 == 0 ? {width: 70} : {width: 130},
                                    ]}
                                  >
                                    {day.map ((block, index_3) => {
                                      return (
                                        <View
                                          key={
                                            'schedule_' +
                                              index_1 +
                                              '_day_' +
                                              index_2 +
                                              '_block_' +
                                              index_3
                                          }
                                          style={[
                                            styles.scheduleBlock,
                                            {
                                              height: block.type == 'block'
                                                ? block.block.block_span * 70 +
                                                    (block.block.block_span -
                                                      1) *
                                                      10
                                                : 70,
                                            },
                                            block.type == 'title'
                                              ? {
                                                  height: 40,
                                                }
                                              : {},
                                          ]}
                                        >
                                          {getBlock (
                                            block,
                                            this.courseMap,
                                            this.colorMap
                                          )}
                                        </View>
                                      );
                                    })}
                                  </View>
                                );
                              })}
                            </View>
                          </ScrollView>
                        </View>
                      );
                    })
                  : <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 18,
                        fontWeight: '500',
                        marginTop: 20,
                        color: 'rgba(0,0,0,0.6)',
                      }}
                    >
                      No semesters currently active!
                    </Text>}
              </View>}
          <View
            style={[
              boxShadows.boxShadow2,
              styles.choiceBar,
              {marginBottom: 30},
            ]}
          >
            <Touchable onPress={() => this.changeScheduleType ('image')}>
              <View
                style={[
                  styles.choiceOption,
                  this.state.scheduleType == 'image'
                    ? styles.choiceOptionSelected
                    : {},
                ]}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '500',
                    color: this.state.scheduleType == 'image'
                      ? 'white'
                      : 'black',
                  }}
                >
                  Image
                </Text>
              </View>
            </Touchable>
            <Touchable onPress={() => this.changeScheduleType ('schedule')}>
              <View
                style={[
                  styles.choiceOption,
                  this.state.scheduleType == 'schedule'
                    ? styles.choiceOptionSelected
                    : {},
                ]}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '500',
                    color: this.state.scheduleType !== 'image'
                      ? 'white'
                      : 'black',
                  }}
                >
                  Schedule
                </Text>
              </View>
            </Touchable>
          </View>
        </ScrollView>
        <ImageViewerModal ref={this.imageViewerModal} parent={this} />
      </View>
    );
  }
}

const styles = StyleSheet.create ({
  scheduleWeek: {
    flexDirection: 'row',
    width: 780,
    marginTop: 0,
    marginBottom: 40,
    marginRight: 30,
  },
  scheduleDay: {
    flexDirection: 'column',
    width: 130,
    alignItems: 'flex-end',
  },
  scheduleBlock: {
    width: 120,
    margin: 5,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  scrollBack: {
    width: width,
    backgroundColor: '#f0f0f0',
  },
  titleBlock: {
    width: width,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingTop: 10,
    paddingLeft: 10,
    paddingBottom: 0,
    paddingRight: 10,
  },
  h1: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  choiceBar: {
    width: width * 0.95,
    height: 40,
    backgroundColor: '#ddd',
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 20,
  },
  choiceOption: {
    width: width * 0.95 / 2,
    height: 40,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    opacity: 0.6,
  },
  choiceOptionSelected: {
    backgroundColor: '#3cc6f0',
    opacity: 1,
  },
});
