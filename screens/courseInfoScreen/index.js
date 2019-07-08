import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Text,
  Image
} from 'react-native';

import HeaderBar from "../../components/header";

import { LeftIcon, PlusIcon, CheckBoxFilledIcon, EmptyIcon, CheckBoxOpenIcon, XIcon, CameraIcon, PhotoIcon, AssignmentsIcon, SchoolAssignmentsIcon, BeforeSchoolIcon, LunchTimeIcon, AfterSchoolIcon } from "../../classes/icons";

import { ScrollView } from 'react-native-gesture-handler';

import { boxShadows } from "../../constants/boxShadows";

import { Assignment, Assignments } from "../../classes/assignments";

import Touchable from 'react-native-platform-touchable';

import Modal from "react-native-modal";

import ImgToBase64 from 'react-native-image-base64';

import { TextField } from 'react-native-material-textfield';

import {ImagePicker, Camera, Permissions, Constants, LinearGradient} from 'expo';

import ApexAPI from "../../http/api";



const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height


class AssignmentRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "completed": false,
        }
    }
    handleClick = () => {
        this.setState(state => ({
            completed: !state.completed,
        }));
    }
    render() {
        return (
            <View style={this.props.last ? styles.assignmentRowLast : styles.assignmentRow}>
                <View style={styles.assignmentCompleted}>
                    <Touchable onPress={this.handleClick}>
                        {
                            this.state.completed ?
                            <CheckBoxFilledIcon size={40} color={"#558de8"}></CheckBoxFilledIcon>
                            :
                            <CheckBoxOpenIcon size={40} color={"#558de8"}></CheckBoxOpenIcon>
                        }
                    </Touchable>
                </View>
                <View style={styles.assignmentInfo}>
                    <View style={styles.assignmentTitle}>
                        <Text style={{fontSize: 16, }}>
                            {this.props.assignment.assignmentTitle}
                        </Text>    
                    </View>
                    <View style={styles.assignmentDue}>
                        <Text style={{fontSize: 14, color: "rgb(190,190,190)"}}>
                            {this.props.assignment.dueDate}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
}
class AssignmentBubble extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={[styles.assignmentBubble, boxShadows.boxShadow3]}>
                <View style={styles.assignmentBubbleHeader}>
                    <Text style={{color: "#174ea6", fontSize: 30}}>
                        {this.props.title}
                    </Text>
                </View>
                {
                    this.props.assignments.map((assignment, index, array) => {
                        return (
                            <AssignmentRow key={"assignment_" + index} last={index==array.length-1} assignment={assignment} completed={this.props.completedAssignments}></AssignmentRow>
                        )
                    })
                }
            </View>
        )
    }
}
class CreateButton extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Touchable onPress={this.props.onPress}>
                <View style={[styles.createButton, boxShadows.boxShadow2]}>
                    <PlusIcon size={20} style={{paddingTop: 2}}></PlusIcon>
                    <Text style={{color: "white", fontSize: 16}}>Create</Text>
                </View>
            </Touchable>
        )
    }
}

class ModalInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
        }
    }
    updateText = (value) => {
        this.setState({value});
    }
    render() {
        return (
            <TextField
                label={this.props.label}
                multiline={true}
                value={this.state.value}
                onChangeText={(value) => this.updateText(value)}>
            </TextField>
        )
    }
}

class UploadedImage extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={styles.uploadedImage}>
                <Image source={{uri: this.props.image.uri}} style={{width: this.props.image.width/this.props.image.height*250, height: 250}}>

                </Image>
                <View style={styles.uploadedImageHeader}>
                    <LinearGradient colors={["rgba(66, 166, 109, 1)", "rgba(66, 166, 109, 0)"]} style={{height: 70}}>

                    </LinearGradient>
                </View>
            </View>
        )
    }
}

const mimetypes = {
    ".jpg": "image/jpeg",
    ".png": "image/png",
}

function sendResourseToServer(resource) {
    return fetch("https://www.apexschools.co/api/v1/resources?base64=true", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": global.user["x-api-key"],
            "x-id-key": global.user["x-id-key"],
            "school": global.user["school"],
        },
        body: JSON.stringify(resource),
    })
}

class AssignmentModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBackdropVisible: false,
            images: [],
        }
    }
    launchCameraRoll = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            base64: true,
            exif: true,
            quality: 0.1,
        });
        if (result.uri) {
            this.setState(state => ({
                images: [...state.images, result],
            }));
            result.path = `/courses/${global.courseInfoCourse.id}/resources`
            sendResourseToServer(result)
                .then(res => res.json())
                .then(json => {
                    console.log(json);
                });
            // let extension = result.uri.split(".")[1];
            // extension = "." + extension;
            // let serverString = `data:${mimetypes[extension]};base64,${result.base64}`;
        }
    }
    launchCamera = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            base64: true,
            exif: true,
            quality: 0.1,
        });
        if (result.uri) {
            this.setState(state => ({
                images: [...state.images, result],
            }));
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
    render() {
        return (
            <View>
                <Modal
                    animationIn="zoomIn"
                    animationOut="zoomOut"
                    isVisible={this.state.isBackdropVisible} 
                    onBackdropPress={() => this.setState({isBackdropVisible: false})}
                    propagateSwipe={true}>
                    <View style={styles.newAssignmentModal}>
                        <View style={styles.assignmentModalHeader}>
                            <Text style={{color: "#174ea6", fontSize: 16}}>Assignment</Text>
                            <Touchable onPress={this.props.parent.closeModal}>
                                <XIcon size={30} color="black"></XIcon>
                            </Touchable>
                        </View>
                        <View style={styles.assignmentModalBody}>
                            <ScrollView style={{padding: 20}}>
                                <Text style={{color: "rgb(190,190,190)", fontSize: 14, fontWeight: "500"}}>For {this.props.course.course}</Text>
                                <ModalInput label="Assignment"></ModalInput>
                                <ModalInput label="Instructions/Notes"></ModalInput>
                                <ModalInput label="Due"></ModalInput>
                                <Text>Images</Text>
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
                                            this.state.images.map((image, index) => {
                                                return (
                                                    <UploadedImage key={"image_" + index} image={image}></UploadedImage>
                                                )
                                            })
                                        }
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                        <View style={styles.assignmentModalFooter}>
                            
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

export default class CourseInfoScreen extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.course = global.courseInfoCourse;
        this.assignments = Assignments._retrieveAssignmentsByCourse(global.assignments, this.course.id);
        this.topicsMap = Assignments._formTopicMap(this.assignments);
        this.modal = React.createRef();
    }
    static navigationOptions = ({navigation}) => {
        return {
            header: null,
        }
    }
    openModal = () => {
        this.modal.current.setState({isBackdropVisible: true});
    }
    closeModal = () => {
        this.modal.current.setState({isBackdropVisible: false});
    }
    render() {
        return (
            <View style={styles.container}>
                <HeaderBar iconLeft={<Touchable onPress={() => this.props.navigation.goBack()}><LeftIcon size={28}></LeftIcon></Touchable>} iconRight={<EmptyIcon width={28} height={32}></EmptyIcon>} width={width} height={60} title={this.course.course}></HeaderBar>
                <View style={styles.bodyHolder}>
                    <ScrollView style={styles.infoHolder}>
                        <View style={styles.switchHeader}>
                            <View style={styles.switchOption}>
                                <Text style={styles.switchOptionText}>Assignments</Text>
                            </View>
                            <View style={styles.switchOption}>
                                <Text style={styles.switchOptionText}>Notes</Text>
                            </View>
                        </View>
                        <View style={styles.optionContent}>
                            <CreateButton onPress={this.openModal}></CreateButton>
                            {
                                Object.keys(this.topicsMap).map((topic, index) => {
                                    return <AssignmentBubble key={"topic_" + index} assignments={this.topicsMap[topic]} completedAssignments={[]} title={topic=="_" ? "No Topic" : this.topicsMap[topic][0].topic.topic}></AssignmentBubble>
                                })
                            }
                        </View>
                    </ScrollView>
                </View>
                <AssignmentModal ref={this.modal} parent={this} course={this.course}></AssignmentModal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width,
        flexGrow: 1,
        backgroundColor: "#f0f0f0"
    },
    bodyHolder: {
        zIndex: 1,
        flexGrow: 1,
    },
    infoHolder: {
        backgroundColor: "white",
    },
    switchHeader: {
        width, 
        flexDirection: "row",
        justifyContent: "center",
        borderBottomColor: "rgb(210,210,210)",
        borderBottomWidth: StyleSheet.hairlineWidth*2,
    },
    switchOption: {
        paddingTop: 20,
        paddingBottom: 20,
        width: width*0.4,
    },
    switchOptionText: {
        textAlign: "center",
        color: "#2664c9",
        fontSize: 18,
    },
    optionContent: {
        paddingLeft: 15,
        paddingRight: 15,
    },
    createButton: {
        width: 140,
        height: 50,
        backgroundColor: "#1d5bc1",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 25,
    },
    assignmentBubble: {
        backgroundColor: "white",
        margin: 10,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 10,

    },
    assignmentBubbleHeader: {
        paddingBottom: 12,
        borderBottomColor: "#1967d2",
        borderBottomWidth: StyleSheet.hairlineWidth*2,
    },
    assignmentRow: {
        height: 70,
        borderBottomColor: "rgb(210,210,210)",
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingLeft: 15,
        paddingRight: 5,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    assignmentRowLast: {
        height: 70,
        paddingLeft: 15,
        paddingRight: 5,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    assignmentInfo: {
        marginLeft: 15,
    },
    assignmentTitle: {
        marginBottom: 5,
    },
    newAssignmentModal: {
        borderRadius: 8,
        height: height*0.9,
        backgroundColor: "white",
        overflow: "hidden",
    },
    assignmentModalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15,
        borderBottomColor: "rgb(210,210,210)",
        borderBottomWidth: StyleSheet.hairlineWidth*2,
    },
    assignmentModalFooter: {
        height: 50,
    },
    assignmentModalBody: {
        flexGrow: 1,
    },
    imageHolder: {
        backgroundColor: "#f1f0ef",
        padding: 10,
    },
    imageHolderHeader: {

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
    uploadedImageHeader: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 70,
    }
})