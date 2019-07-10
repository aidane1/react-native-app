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
  Modal as ReactModal
} from 'react-native';

import {  CameraIcon, PhotoIcon } from "../classes/icons";


import Touchable from 'react-native-platform-touchable';


import {ImagePicker, Camera, Permissions, Constants} from 'expo';


class UploadedImage extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={styles.uploadedImage}>
                <Image source={{uri: this.props.image.uri}} style={{width: this.props.image.width/this.props.image.height*250, height: 250}}>

                </Image>
            </View>
        )
    }
}


export default class ImageBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
        }
    }
    componentDidMount() {
        this.getPermissionAsync();
    }
    getCameraPermissions = async () => {
        let { status } = await Permissions.askAsync(Permissions.CAMERA);
        if (status !== 'granted') {
            alert('Sorry, we need camera permissions to make this work!');
        }
    }
    getCameraRollPermissions = async () => {
        let { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        }
    }
    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            await this.getCameraPermissions();
            await this.getCameraRollPermissions();
        }
    }
    launchCameraRoll = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            base64: true,
            exif: true,
            quality: 0.1,
        });
        this.props.imageFunction(result);
        if (result.uri) {
            this.setState(state => ({
                images: [...state.images, result],
            }));
        }
    }
    launchCamera = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            base64: true,
            exif: true,
            quality: 0.1,
        });
        this.props.imageFunction(result);
    }

    render() {
        return (
            <View style={styles.imageHolder}>
                <View style={styles.imageHolderHeader}>
                    <View style={styles.imageUploadTypes}>
                        <Touchable onPress={() => this.launchCamera()}>
                            <View style={{flexDirection: "row", alignItems: "center", padding: 5}}>
                                <CameraIcon color="black"></CameraIcon>
                                <Text style={{color: "#4c4e53", marginLeft: 10}}>Take Photo</Text>
                            </View>
                        </Touchable>
                        <Touchable onPress={() => this.launchCameraRoll()}>
                            <View style={{flexDirection: "row", alignItems: "center", padding: 5}}>
                                <PhotoIcon color="black"></PhotoIcon>
                                <Text style={{color: "#4c4e53", marginLeft: 10}}>Camera Roll</Text>
                            </View>
                        </Touchable>
                    </View>
                </View>
                <View style={styles.imageHolderBody}>
                    {
                        this.state.images.filter((image) => this.props.displayImages).map((image, index) => {
                            return (
                                <UploadedImage key={"image_" + index} image={image}></UploadedImage>
                            )
                        })
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    imageHolder: {
        backgroundColor: "#f1f0ef",
        padding: 10,
        marginBottom: 20,
    },
    imageUploadTypes: {
        flexDirection: "row",
        justifyContent: "space-between",
    }, 
    imageHolderBody: {
        flexDirection: "column",
    },
    uploadedImage: {
        backgroundColor: "black",
        flexDirection: "row",
        justifyContent: "center",
        borderRadius: 8,
        overflow: "hidden",
        marginTop: 15,
    },
});