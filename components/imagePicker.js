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
} from 'react-native';

import {CameraIcon, PhotoIcon} from '../classes/icons';

import Touchable from 'react-native-platform-touchable';

import {ImagePicker, Camera} from 'expo';

import Constants from 'expo-constants';

import * as Permissions from 'expo-permissions';

class UploadedImage extends React.Component {
  constructor (props) {
    super (props);
  }
  render () {
    return (
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
          {this.state.images.map ((image, index) => {
            return this.props.displayImages
              ? <UploadedImage key={'image_' + index} image={image} />
              : <View key={'image_' + index} />;
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create ({
  imageHolder: {
    backgroundColor: '#f1f0ef',
    padding: 10,
    marginBottom: 20,
  },
  imageUploadTypes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
