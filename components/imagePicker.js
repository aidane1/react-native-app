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
    return (
      this.props.image._id ? 
      <View style={styles.uploadedImage}>
        <Image
          source={{uri: `https://www.apexschools.co${this.props.image.path}`}}
          style={{
            width: this.props.image.width / this.props.image.height * 250,
            height: 250,
          }}
        />
      </View>
      :
      <View style={styles.uploadedImage}>
        <Image
          source={{uri: this.props.image.uri}}
          style={{
            width: this.props.image.width / this.props.image.height * 250,
            height: 250,
          }}
        />
      </View>
    );
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
      uploading: false,
    };
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
      this.props.imageFunction (result);
      if (result.uri) {
        this.setState (state => ({
          images: [...state.images, result],
        }));
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
          self.setState(state => ({
            loadedImages: [...state.loadedImages, response.body],
          }), () => {
            self.props.onImageRecieved (response.body);
          })
        }
      }
    };
    req.onprogress = e => {
      console.log ('progress!');
    };
    req.onload = () => {
      console.log ('done!');
      this.setState ({uploading: false});
    };
    req.onerror = () => {
      console.log ('error');
    };
    req.send (blob);
    this.setState ({uploading: true});
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
        <View style={styles.imageHolderHeader}>
          {this.props.displayCameraRollInline
            ? <View style={{flexDirection: 'row'}}>
                <ScrollView horizontal={true}>
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

              </View>
            : <View />}
          <View style={styles.imageUploadTypes}>
            <Touchable onPress={() => this.launchCamera ()}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', padding: 5}}
              >
                <CameraIcon color={global.user.getPrimaryTextColor ()} />
                <Text
                  style={{
                    color: global.user.getSecondaryTextColor (),
                    marginLeft: 10,
                  }}
                >
                  Take Photo
                </Text>
              </View>
            </Touchable>
            <Touchable onPress={() => this.launchCameraRoll ()}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', padding: 5}}
              >
                <PhotoIcon color={global.user.getPrimaryTextColor ()} />
                <Text
                  style={{
                    color: global.user.getSecondaryTextColor (),
                    marginLeft: 10,
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
                  console.log({image});
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
        <UIActivityIndicator
          color={global.user.getPrimaryTextColor ()}
          count={12}
          size={25}
          style={{
            display: this.state.uploading ? 'flex' : 'none',
            position: 'absolute',
            top: -12.5,
            right: -12.5,
          }}
        />
      </View>
    );
  }
}

//props: onImageRecieved, onImageLoaded, displayImagesInline, path, displayCameraRollInline,
//methods: getAllImages, clear,

const styles = StyleSheet.create ({
  imageHolder: {
    backgroundColor: '#f1f0ef',
    padding: 10,
    marginBottom: 20,
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
