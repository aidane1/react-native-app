import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Text,
  Image,
  Animated,
  Vibration,
  Modal as ReactModal,
  CameraRoll,
  RefreshControl,
} from 'react-native';

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

import {boxShadows} from '../constants/boxShadows';

import ProgressBar from 'react-native-progress/Bar';

import {CameraIcon, PhotoIcon} from '../classes/icons';

import {ScrollView, TextInput, FlatList} from 'react-native-gesture-handler';

import Touchable from 'react-native-platform-touchable';

import {ImagePicker, Camera} from 'expo';

import Constants from 'expo-constants';

import * as FileSystem from 'expo-file-system';

import * as Permissions from 'expo-permissions';

class UploadedImage extends React.Component {
  constructor (props) {
    super (props);
  }
  render () {
    return this.props.image._id
      ? <View style={styles.uploadedImage}>
          <Image
            source={{uri: `https://www.apexschools.co${this.props.image.path}`}}
            style={{
              width: this.props.image.width / this.props.image.height * 250,
              height: 250,
            }}
          />
        </View>
      : <View style={styles.uploadedImage}>
          <Image
            source={{uri: this.props.image.uri}}
            style={{
              width: this.props.image.width / this.props.image.height * 250,
              height: 250,
            }}
          />
        </View>;
  }
}

export default class ImageBar extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      images: [],
      unloadedImages: [],
      loadedImages: [],
      cameraRollImages: global.cameraRollImages,
      uploading: 0,
    };
    this._isMounted = false;
  }
  getCameraPermissions = async () => {
    let {status} = await Permissions.askAsync (Permissions.CAMERA);
    if (status !== 'granted') {
      alert ('Sorry, we need camera permissions to make this work!');
    }
  };
  getCameraRollPermissions = async () => {
    let {status} = await Permissions.askAsync (Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      alert ('Sorry, we need camera roll permissions to make this work!');
    } else {
      let photos = await CameraRoll.getPhotos ({
        first: 20,
        assetType: 'Photos',
        groupTypes: 'All',
      });
      global.cameraRollImages = photos.edges;
      global.cameraRollImages.reverse ();
      global.status = 'granted';
      this.setState ({cameraRollImages: global.cameraRollImages});
    }
  };
  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      await this.getCameraPermissions ();
      await this.getCameraRollPermissions ();
    }
  };
  clearImages = () => {
    this.setState ({images: []});
  };
  launchCameraRoll = async () => {
    try {
      await this.getPermissionAsync ();
      let result = await ImagePicker.launchImageLibraryAsync ({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        base64: true,
        exif: true,
        quality: 0.1,
      });
      if (result.uri) {
        result.id = new Date ().getTime ();
        this.setState (state => ({
          unloadedImages: [...state.unloadedImages, result],
          uploading: this.state.uploading + 1,
        }));
        result.path = this.props.path;
        this.sendResourseToServer (result)
          .then (res => res.json ())
          .then (json => {
            if (json.status == 'ok') {
              this.props.onImageRecieved (json.body);
              this.setState (state => ({
                unloadedImages: state.unloadedImages.filter (
                  image => image.id != result.id
                ),
                uploading: state.uploading - 1,
                loadedImages: [...state.loadedImages, json.body],
              }));
            }
          });
      }
    } catch (e) {
      console.log (e);
    }
  };
  launchCamera = async () => {
    try {
      await this.getPermissionAsync ();
      let result = await ImagePicker.launchCameraAsync ({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        base64: true,
        exif: true,
        quality: 0.1,
      });
      if (result.uri) {
        result.id = new Date ().getTime ();
        this.setState (state => ({
          unloadedImages: [...state.unloadedImages, result],
          uploading: this.state.uploading + 1,
        }));
        result.path = this.props.path;
        this.sendResourseToServer (result)
          .then (res => res.json ())
          .then (json => {
            if (json.status == 'ok') {
              this.props.onImageRecieved (json.body);
              this.setState (state => ({
                unloadedImages: state.unloadedImages.filter (
                  image => image.id != result.id
                ),
                uploading: state.uploading - 1,
                loadedImages: [...state.loadedImages, json.body],
              }));
            }
          });
      }
    } catch (e) {
      console.log (e);
    }
  };
  sendResourseToServer (resource) {
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
  openCameraRollFile = async file => {
    let response = await fetch (file);
    let blob = await response.blob ();
    const req = new XMLHttpRequest ();
    req.open (
      'POST',
      `https://www.apexschools.co/api/v1/resources?blob=true&file_name=${blob._data.name}&path=${this.props.path}`,
      true
    );
    req.setRequestHeader ('x-api-key', global.user['x-api-key']);
    req.setRequestHeader ('x-id-key', global.user['x-id-key']);
    req.setRequestHeader ('school', global.user['school']);
    req.setRequestHeader ('Content-Type', blob._data.type);
    let self = this;
    req.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 201) {
        let response = JSON.parse (this.responseText);
        if (response.status == 'ok') {
          if (self._isMounted) {
            self.setState (
              state => ({
                loadedImages: [...state.loadedImages, response.body],
                uploading: state.uploading - 1,
              }),
              () => {
                self.props.onImageRecieved (response.body);
              }
            );
          } else {
            self.props.onImageRecieved (response.body);
          }
        }
      }
    };
    req.onprogress = e => {
      console.log ('progress!');
    };
    req.onload = () => {
      console.log ('done!');
    };
    req.onerror = () => {
      console.log ('error');
    };
    req.send (blob);
    this.setState ({uploading: this.state.uploading + 1});
  };
  getAllImages = () => {
    return this.state.loadedImages;
  };
  clear = () => {
    this.setState ({
      loadedImages: [],
      unloadedImages: [],
      images: [],
    });
  };

  componentDidMount () {
    this._isMounted = true;
  }

  componentWillUnmount () {
    this._isMounted = false;
  }

  render () {
    return (
      <View
        style={[
          styles.imageHolder,
          this.props.style,
          global.user.theme == 'Light'
            ? {
                backgroundColor: '#fdfdfd',
              }
            : {
                backgroundColor: '#111111',
              },
        ]}
      >
        {this.state.uploading == 0
          ? <View style={{width: 30, height: 8}} />
          : <ProgressBar
              progress={0.5}
              width={null}
              height={6}
              borderRadius={0}
              indeterminate={true}
            />}
        <View style={styles.imageHolderHeader}>
          {this.props.displayCameraRollInline
            ? <View>
                {global.status == 'granted'
                  ? <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                    >
                      {this.state.cameraRollImages.map ((image, index) => {
                        return (
                          <Touchable
                            onPress={() =>
                              this.openCameraRollFile (image.node.image.uri)}
                            key={'roll_image_' + index}
                            style={{borderWidth: 3, borderColor: 'black'}}
                          >
                            <Image
                              source={{uri: image.node.image.uri}}
                              style={{
                                height: 200,
                                width: image.node.image.width /
                                  image.node.image.height *
                                  200,
                              }}
                            />
                          </Touchable>
                        );
                      })}
                    </ScrollView>
                  : <Touchable
                      onPress={() => this.getCameraRollPermissions ()}
                      style={{
                        height: 206,
                        alignSelf: 'center',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <View
                        style={[
                          {padding: 15, backgroundColor: '#3cc6f0'},
                          boxShadows.boxShadow4,
                        ]}
                      >
                        <Text
                          style={[
                            {
                              fontSize: 20,
                              color: 'white',
                              fontWeight: '500',
                            },
                          ]}
                        >
                          Enable Camera Roll Permissions
                        </Text>
                      </View>
                    </Touchable>}
              </View>
            : <View />}
          <View
            style={[
              styles.imageUploadTypes,
              this.props.column
                ? {flexDirection: 'column'}
                : {flexDirection: 'row'},
            ]}
          >
            <Touchable onPress={() => this.launchCamera ()}>
              <View
                style={[
                  {flexDirection: 'row', alignItems: 'center', padding: 5},
                  this.props.column
                    ? {
                        justifyContent: 'center',
                        padding: 15,
                        borderBottomWidth: StyleSheet.hairlineWidth * 3,
                        borderBottomColor: global.user.getBorderColor (),
                        paddingBottom: 20,
                      }
                    : {},
                ]}
              >
                <CameraIcon
                  color={global.user.getPrimaryTextColor ()}
                  size={this.props.column ? 20 : 16}
                />
                <Text
                  style={{
                    color: global.user.getSecondaryTextColor (),
                    marginLeft: 10,
                    fontSize: this.props.column ? 20 : 16,
                  }}
                >
                  Take Photo
                </Text>
              </View>
            </Touchable>
            <Touchable onPress={() => this.launchCameraRoll ()}>
              <View
                style={[
                  {flexDirection: 'row', alignItems: 'center', padding: 5},
                  this.props.column
                    ? {
                        justifyContent: 'center',
                        padding: 15,
                        paddingBottom: 25,
                        paddingTop: 20,
                      }
                    : {},
                ]}
              >
                <PhotoIcon
                  color={global.user.getPrimaryTextColor ()}
                  size={this.props.column ? 20 : 16}
                />
                <Text
                  style={{
                    color: global.user.getSecondaryTextColor (),
                    marginLeft: 10,
                    fontSize: this.props.column ? 20 : 16,
                  }}
                >
                  Camera Roll
                </Text>
              </View>
            </Touchable>
          </View>
        </View>
        <View style={styles.imageHolderBody}>
          {this.props.displayImagesInline
            ? [
                ...this.state.loadedImages.map ((image, index) => {
                  return <UploadedImage key={'image_' + index} image={image} />;
                }),
                ...this.state.unloadedImages.map ((image, index) => {
                  return (
                    <UploadedImage
                      key={'image_' + (index + this.state.loadedImages.length)}
                      image={image}
                    />
                  );
                }),
              ]
            : <View />}
        </View>

      </View>
    );
  }
}

//props: onImageRecieved, onImageLoaded, displayImagesInline, path, displayCameraRollInline,
//methods: getAllImages, clear, isLoaded

const styles = StyleSheet.create ({
  imageHolder: {
    backgroundColor: '#f1f0ef',
    padding: 10,
    marginBottom: 20,
    flexDirection: 'column',
  },
  imageUploadTypes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  imageHolderBody: {
    flexDirection: 'column',
  },
  uploadedImage: {
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 15,
  },
});
