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
  TextInput
} from 'react-native';


import HeaderBar from "../../components/header";

import { LeftIcon, PlusIcon, CheckBoxFilledIcon, EmptyIcon, CheckBoxOpenIcon, XIcon, SendIcon, PhotoIcon, TrashIcon, SchoolAssignmentsIcon, BeforeSchoolIcon, LunchTimeIcon, AfterSchoolIcon } from "../../classes/icons";

import { ScrollView } from 'react-native-gesture-handler';

import { boxShadows } from "../../constants/boxShadows";

import { Assignment, Assignments } from "../../classes/assignments";

import { Note, Notes } from "../../classes/notes";

import {Topic, Topics } from "../../classes/topics";

import Touchable from 'react-native-platform-touchable';

import Modal from "react-native-modal";

import { TextField } from 'react-native-material-textfield';

import ApexAPI from "../../http/api";

import {LinearGradient} from "expo-linear-gradient";

import { Dropdown } from 'react-native-material-dropdown';

import moment from "moment";

import ImageViewer from 'react-native-image-zoom-viewer';

import ImageBar from "../../components/imagePicker";

import ChatRoom from "./chatroom";


import { ifIphoneX } from 'react-native-iphone-x-helper';



const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

class CheckButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            completed: global.completedAssignments.indexOf(this.props.assignment.id) >= 0,
            scaleVal: new Animated.Value(1),
        }
    }
    handleClick = () => {
        
        if (this.state.completed) {
            global.completedAssignments = global.completedAssignments.filter(id => {
                return id !== this.props.assignment.id;
            })
            Assignments._removeCompletedToStorage(this.props.assignment.id);
            this.setState({completed: false});
        } else {
            global.completedAssignments.push(this.props.assignment.id);
            Assignments._addCompletedToStorage(this.props.assignment.id);
            this.setState({completed: true});
        }
    }
    handlePressIn = () => {
        Animated.timing(
            this.state.scaleVal,
            {
                toValue: 1.05,
                duration: 100,
            }
        ).start();
    }
    handlePressOut = () => {
        Animated.timing(
            this.state.scaleVal,
            {
                toValue: 1,
                duration: 100,
            }
        ).start();
    }
    render() {
        let {scaleVal} = this.state;
        return (
            <TouchableWithoutFeedback onPressIn={this.handlePressIn} onPressOut={this.handlePressOut} onPress={this.handleClick}  hitSlop={{top: 10, bottom: 10, left: 10, right: 0}}>
                <Animated.View style={{paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 20, transform: [{scale: scaleVal}]}}>
                    {
                        this.state.completed ?
                        <CheckBoxFilledIcon size={40} color={"#558de8"}></CheckBoxFilledIcon>
                        :
                        <CheckBoxOpenIcon size={40} color={"#558de8"}></CheckBoxOpenIcon>
                    }
                </Animated.View>
            </TouchableWithoutFeedback>
        )
    }
}

class TopicDropDown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            topic: "_",
            topicType: "id",
        }
    }
    updateTopic = (topic) => {
        this.setState({topic, topicType: topic == "__new__" ? "string" : "id"});
        this.props.handleInput({topic: this.state});
    }
    handleTextInput = (text) => {
        this.props.handleInput({topic: {topic: text["topic"], topicType: "string"}});
        this.setState({topic: text["topic"], topicType: "string"});
    }
    render() {
        let topicsList = Topics._MakeCourseTopicList(this.props.course, global.topics);
        let data = [...topicsList.map(topic => {return {label: topic.topic, value: topic.id}}), {label: "No Topic", value: "_"}, {label: "New Topic", value: "__new__"}];
          return (
            this.state.topicType == "id" ? 
            <View>
                <Dropdown
                    label='Topic'
                    onChangeText={this.updateTopic}
                    animationDuration={100}
                    data={data}
                />
            </View>
            :
            <ModalInput focused={true} stateKey="topic" handleInput={this.handleTextInput} label="New Topic" multiline={false}>

            </ModalInput>
          );
    }
}

class AssignmentRow extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={this.props.last ? styles.assignmentRowLast : styles.assignmentRow}>
                <View style={styles.assignmentCompleted}>
                    <CheckButton assignment={this.props.assignment}></CheckButton>
                </View>
                <TouchableWithoutFeedback onPress={() => {this.props.openAssignment(this.props.assignment)}} style={{width: 0, flexGrow: 1, flexDirection: "row"}}>
                    <View style={styles.assignmentInfo}>
                        <View style={styles.assignmentTitle}>
                            <Text style={{fontSize: 16}} numberOfLines={1}>
                                {this.props.assignment.assignmentTitle}
                            </Text>    
                        </View>
                        <View style={styles.assignmentDue} numberOfLines={1}>
                            <Text style={{fontSize: 14, color: "rgb(190,190,190)"}}>
                                {this.props.assignment.dueDate}
                            </Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
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
                            <AssignmentRow openAssignment={this.props.openAssignment} closeAssignment={this.props.closeAssignment} key={"assignment_" + index} last={index==array.length-1} assignment={assignment} completed={this.props.completedAssignments}></AssignmentRow>
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
        this.state = {
            scaleVal: new Animated.Value(1),
        }
    }
    handleClick = () => {
        Animated.timing(
            this.state.scaleVal,
            {
                toValue: 1.05,
                duration: 100,
            }
        ).start();
    }
    handlePressOut = () => {
        Animated.timing(
            this.state.scaleVal,
            {
                toValue: 1,
                duration: 100,
            }
        ).start();
    }
    render() {
        let {scaleVal} = this.state;
        return (
            <Touchable onPressIn={this.handleClick} onPressOut={this.handlePressOut} style={{width: 140}} onPress={this.props.onPress}>
                <Animated.View style={[styles.createButton, boxShadows.boxShadow2, {transform: [{scale: scaleVal}]}]}>
                    <PlusIcon size={20} style={{paddingTop: 2}}></PlusIcon>
                    <Text style={{color: "white", fontSize: 16}}>Create</Text>
                </Animated.View>
            </Touchable>
        )
    }
}

class ConfirmButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
        }
    }
    render() {
        return (
            this.state.disabled ? 
            <Text style={styles.confirmButton }>Create</Text>
            :
            <Touchable onPress={this.props.onPress}>
                <Text style={styles.confirmButtonAllowed}>Create</Text>
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
        this.TextField = React.createRef();
    }
    componentDidMount() {
        if (this.props.focused) {
            this.TextField.current.focus();
        }
    }
    updateText = (value) => {
        let info = {};
        info[this.props.stateKey] = value;
        this.props.handleInput(info);
        this.setState({value});
    }
    render() {
        return (
            <TextField
                ref={this.TextField}
                label={this.props.label}
                multiline={this.props.multiline !== undefined ? this.props.multiline : true}
                value={this.state.value}
                onChangeText={(value) => this.updateText(value)}>
            </TextField>
        )
    }
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

class ImageViewerModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBackdropVisible: false,
            index: 0,
            images: [
                {
                    "url": "https://www.apexschools.co/info/5d1d2f28c7563c6ce08a960b/courses/5d216334eeb4d72ef19de8dc/resources/5d24f5ef288dda6d00eefcc8/1562703343368.jpg",
                },
                {
                    "url": "https://www.apexschools.co/info/5d1d2f28c7563c6ce08a960b/courses/5d216334eeb4d72ef19de8dc/resources/5d24f5f7288dda6d00eefcca/1562703351641.jpg",
                },
            ],
        }
    }
    swipeDown = () => {
        this.setState({isBackdropVisible: false});
    }
    render() {
        return (
            <View>
                <ReactModal
                    visible={this.state.isBackdropVisible}
                    transparent={true}
                    onRequestClose={() => this.setState({ modalVisible: false })}>
                    <ImageViewer 
                        onSwipeDown={this.swipeDown}
                        enableSwipeDown={true}
                        enablePreload={true}
                        index={this.state.index}
                        imageUrls={this.state.images}>
                    </ImageViewer>
                </ReactModal>
            </View>
        )
    }
}

class DisplayAssignmentModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBackdropVisible: false,
            shouldOpenImageModal: false,
            images: [],
            imageURLs: [],
            imageIndex: 0,
            assignment: {
                assignmentTitle: "",
                dueDate: new Date(),
                topic: "_",
                assignmentNotes: "",
                resources: [],
                id: "_",
            },
        }
    }
    modalHide = () => {
        if (this.state.shouldOpenImageModal) {
            this.props.imageViewer.current.setState({isBackdropVisible: true, images: this.state.imageURLs, index: this.state.imageIndex});
        }
    }
    openImageViewer = (resources, index) => {
        let urls = resources.map(resource => {
            return {url: `https://www.apexschools.co${resource.path}`};
        });
        this.setState({shouldOpenImageModal: true, isBackdropVisible: false, imageURLs: urls, imageIndex: index});
    }
    pushResultImage = async (resource) => {
        let api = new ApexAPI(global.user);
        api.put(`assignments/${this.state.assignment.id}?updateMethods=$push&$push=response_resources`, {
            response_resources: resource._id,
        });
    }
    imageFunction = async (result) => {
        if (result.uri) {            
            result.path = `/courses/${global.courseInfoCourse.id}/resources`
            sendResourseToServer(result)
                .then(res => res.json())
                .then(json => {
                    if (json.status == "ok") {
                        this.state.images.push(json.body);
                        this.setState({images: this.state.images});
                        this.pushResultImage(json.body);
                    }
                });
        }
    }
    render() {
        let topicsMap = Topics._makeTopicMap(global.topics);
        return (
            <View>
                <Modal
                    onModalHide={this.modalHide}
                    animationIn="zoomIn"
                    animationOut="zoomOut"
                    isVisible={this.state.isBackdropVisible} 
                    onBackdropPress={() => this.setState({isBackdropVisible: false})}
                    propagateSwipe={true}>
                        <View style={styles.displayAssignment}>
                            <View style={styles.assignmentModalHeader}>
                                <Text style={{color: "#174ea6", fontSize: 16}}>Assignment</Text>
                                <Touchable onPress={this.props.parent.closeAssignment} hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}>
                                    <XIcon size={30} color="black"></XIcon>
                                </Touchable>
                            </View>
                            <View style={[styles.displayAssignmentModalBody, {height: 0, flexGrow: 1}]}>
                                <ScrollView>
                                    <View style={styles.modalBodySection}>
                                        <Text style={styles.modalBodySectionHeader}>Title</Text>
                                        <Text style={styles.modalBodySectionContent}>{this.state.assignment.assignmentTitle}</Text>
                                    </View>
                                    <View style={styles.modalBodySection}>
                                        <Text style={styles.modalBodySectionHeader}>Topic</Text>
                                        <Text style={styles.modalBodySectionContent}>{this.state.assignment.topic == "_" ? "No Topic" : topicsMap[this.state.assignment.topic].topic}</Text>
                                    </View>
                                    <View style={styles.modalBodySection}>
                                        <Text style={styles.modalBodySectionHeader}>Due</Text>
                                        <Text style={styles.modalBodySectionContent}>{this.state.assignment.dueDate}</Text>
                                    </View>
                                    <View style={styles.modalBodySection}>
                                        <Text style={styles.modalBodySectionHeader}>Notes</Text>
                                        <Text style={styles.modalBodySectionContent}>{this.state.assignment.assignmentNotes}</Text>
                                    </View>
                                    <View style={styles.modalBodySection}>
                                        <Text style={styles.modalBodySectionHeader}>Date Created</Text>
                                        <Text style={styles.modalBodySectionContent}>{moment(this.state.assignment.date).format("MMMM Do YYYY, h:mm:ss a")}</Text>
                                    </View>
                                    <View style={styles.modalBodySection}>
                                        <Text style={[styles.modalBodySectionHeader, {marginBottom: 10}]}>Images</Text>
                                        <View style={{flexDirection: "column", alignItems: "center"}}>
                                            {
                                                this.state.assignment.resources.map((resource, index, array) => {
                                                    return (
                                                        <Touchable key={"image_" + index} onPress={() => {this.openImageViewer(array, index)}}>
                                                            <Image source={{uri: `https://www.apexschools.co${resource.path}`}} style={{width: 200, height: resource.height/resource.width*200, marginTop: 10, marginBottom: 10}}></Image>
                                                        </Touchable>
                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                                    <View style={[styles.modalBodySection]}>
                                        <Text style={[styles.modalBodySectionHeader, {marginBottom: 20}]}>Response Images</Text>
                                        <View style={{flexDirection: "column", alignItems: "center"}}>
                                            {
                                                this.state.images.map((resource, index, array) => {
                                                    return (
                                                        <Touchable key={"image_" + index} onPress={() => {this.openImageViewer(array, index)}}>
                                                            <Image source={{uri: `https://www.apexschools.co${resource.path}`}} style={{width: 200, height: resource.height/resource.width*200, marginTop: 10, marginBottom: 10}}></Image>
                                                        </Touchable>
                                                    )
                                                })
                                            }
                                        </View>
                                        <ImageBar displayImages={false} imageFunction={this.imageFunction}></ImageBar>
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                </Modal>
            </View>
        )
    }
}

class AssignmentModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBackdropVisible: false,
            images: [],
            imageIDs: [],
            topics: Topics._MakeCourseTopicList(global.courseInfoCourse.id, global.topics),
            assignment: "",
            notes: "",
            due: "",
            topic: {
                topicType: "id",
                topic: "_",
            },
            keyboardHeight: new Animated.Value(0),
        }
        this.assignment = React.createRef();
        this.notes = React.createRef();
        this.due = React.createRef();
        this.topic = React.createRef();
        this.create = React.createRef();
    }
    componentWillMount () {
        this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
        this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
    }
    componentWillUnmount() {
        this.keyboardWillShowSub.remove();
        this.keyboardWillHideSub.remove();
    }
    keyboardWillShow = (event) => {
        Animated.timing(
            this.state.keyboardHeight,
            {
                toValue: -100,
                easing: Easing.bezier(.46,.52,.57,1.02),
                duration: 250,
            }
        ).start();
    }
    keyboardWillHide = (event) => {
        Animated.timing(
            this.state.keyboardHeight,
            {
                toValue: 0,
                easing: Easing.bezier(.46,.52,.57,1.02),
                duration: 250,
            }
        ).start();
    }
    handleInput = (info) => {
        this.setState(info, () => {
            if (this.state.assignment && this.state.topic && this.state.due) {
                this.create.current.setState({disabled: false});
            }
        })
    }

    
    imageFunction = (result) => {
        if (result.uri) {            
            result.path = `/courses/${global.courseInfoCourse.id}/resources`
            sendResourseToServer(result)
                .then(res => res.json())
                .then(json => {
                    if (json.status == "ok") {
                        this.state.imageIDs.push(json.body);
                    }
                });
        }
    }
    
    
    createAssignment() {
        let api = new ApexAPI(global.user); 
        let postObject = {
            assignment_title: this.state.assignment,
            due_date: this.state.due,
            assignment_notes: this.state.notes,
            reference_course: global.courseInfoCourse.id,
            resources: this.state.imageIDs.map(image => image._id),
        }
        if (this.state.topic.topicType == "id" && this.state.topic.topic != "_") {
            postObject.topic = this.state.topic.topic;
        }
        api.post("assignments?populate=resources", postObject)
            .then(res => res.json())
            .then(async res => {
                this.setState({isBackdropVisible: false, images: [], imageIDs: []});
                if (res.status == "ok") {
                    let assignment = {
                        topic: res.body.topic || "_",
                        id: res.body._id,
                        assignmentTitle: res.body.assignment_title,
                        assignmentNotes: res.body.assignment_notes,
                        dueDate: res.body.due_date,
                        date: res.body.date,
                        referenceCourse: res.body.reference_course,
                        resources: res.body.resources
                      }
                    assignment = new Assignment(assignment);
                    let assignments = [...this.props.parent.state.assignments];
                    assignments.push(assignment);
                    global.assignments.push(assignment);
                    let storageAssignments = await Assignments._retrieveFromStorage();
                    storageAssignments.push(assignment);
                    await Assignments._saveToStorage(storageAssignments);
                    this.props.parent.setState({assignments});
                }  
            })
    }
    onPress = () => {
        this.create.current.setState({disabled: true});
        if (this.state.assignment && this.state.due && this.state.topic) {
            let api = new ApexAPI(global.user);
            if (this.state.topic.topicType == "string") {
                api.post("topics", {
                    topic: this.state.topic.topic,
                    reference_course: global.courseInfoCourse.id,
                })
                    .then(res => res.json())
                    .then(async res => {
                        if (res.status == "ok") {
                            this.state.topic = {
                                topicType: "id",
                                topic: res.body._id,
                            }
                            let topic = {
                                topic: res.body.topic,
                                id: res.body._id,
                                course: res.body.reference_course
                            }
                            topic = new Topic(topic);
                            global.topics.push(topic);
                            let storageTopics = await Topics._retrieveFromStorage();
                            storageTopics.push(topic);
                            await Topics._saveToStorage(storageTopics);
                            this.createAssignment();
                        }
                    });
            } else {
                this.createAssignment();
            }
        }
    }
    handleClear = () => {
        this.assignment.current.setState({value: ""});
        this.due.current.setState({value: ""});
        this.notes.current.setState({value: ""});
        this.images = [];
        this.imageIDs = [];
        this.topic = {
            topic: "_",
            topicType: "id",
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
                    <Animated.View style={{position: "relative", top: this.state.keyboardHeight}}>
                        <View style={styles.newAssignmentModal}>
                            <View style={styles.assignmentModalHeader}>
                                <Text style={{color: "#174ea6", fontSize: 16}}>Assignment</Text>
                                <Touchable onPress={this.props.parent.closeModal} hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}>
                                    <XIcon size={30} color="black"></XIcon>
                                </Touchable>
                            </View>
                            <View style={styles.assignmentModalBody}>
                                <ScrollView style={{padding: 20}}>
                                    <Text style={{color: "rgb(190,190,190)", fontSize: 14, fontWeight: "500"}}>For {this.props.course.course}</Text>
                                    <ModalInput handleInput={this.handleInput} ref={this.assignment} style={{marginTop: 30}} label="Assignment" stateKey={"assignment"}></ModalInput>
                                    <ModalInput handleInput={this.handleInput} ref={this.notes} style={{marginTop: 30}} label="Instructions/Notes" stateKey={"notes"}></ModalInput>
                                    <ModalInput multiline={false} handleInput={this.handleInput} ref={this.due} style={{marginTop: 30}} label="Due" stateKey={"due"}></ModalInput>
                                    <TopicDropDown course={this.props.parent.course.id} handleInput={this.handleInput} ref={this.topic} topics={this.state.topics}></TopicDropDown>
                                    <Text style={{marginTop: 30, marginBottom: 10, fontSize: 12, color: "rgba(0,0,0,0.38)"}}>Images</Text>
                                    <ImageBar displayImages={true} imageFunction={this.imageFunction}></ImageBar>
                                </ScrollView>
                            </View>
                            <View style={styles.assignmentModalFooter}>
                                <Touchable onPress={this.handleClear}>
                                    <TrashIcon color="black" size={26} style={{marginRight: 30, padding: 20}}></TrashIcon>
                                </Touchable>
                                <ConfirmButton ref={this.create} onPress={this.onPress}></ConfirmButton>
                            </View>
                        </View>
                    </Animated.View>
                </Modal>
            </View>
        )
    }
}

class NoteModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBackdropVisible: false,
            images: [],
            imageIDs: [],
            topics: Topics._MakeCourseTopicList(global.courseInfoCourse.id, global.topics),
            note: "",
            topic: {
                topicType: "id",
                topic: "_",
            },
            keyboardHeight: new Animated.Value(0),
        }
        this.note = React.createRef();
        this.topic = React.createRef();
        this.create = React.createRef();
    }
    componentWillMount () {
        this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
        this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
    }
    componentWillUnmount() {
        this.keyboardWillShowSub.remove();
        this.keyboardWillHideSub.remove();
    }
    keyboardWillShow = (event) => {
        Animated.timing(
            this.state.keyboardHeight,
            {
                toValue: -100,
                easing: Easing.bezier(.46,.52,.57,1.02),
                duration: 250,
            }
        ).start();
    }
    keyboardWillHide = (event) => {
        Animated.timing(
            this.state.keyboardHeight,
            {
                toValue: 0,
                easing: Easing.bezier(.46,.52,.57,1.02),
                duration: 250,
            }
        ).start();
    }
    handleInput = (info) => {
        this.setState(info, () => {
            if (this.state.note && this.state.topic) {
                this.create.current.setState({disabled: false});
            }
        })
    }

    
    imageFunction = (result) => {
        if (result.uri) {            
            result.path = `/courses/${global.courseInfoCourse.id}/resources`
            sendResourseToServer(result)
                .then(res => res.json())
                .then(json => {
                    if (json.status == "ok") {
                        this.state.imageIDs.push(json.body);
                    }
                });
        }
    }
    
    
    createAssignment() {
        let api = new ApexAPI(global.user); 
        let postObject = {
            note: this.state.note,
            resources: this.state.imageIDs.map(image => image._id),
            reference_course: global.courseInfoCourse.id,
        }
        if (this.state.topic.topicType == "id" && this.state.topic.topic != "_") {
            postObject.topic = this.state.topic.topic;
        }
        api.post("notes?populate=resources", postObject)
            .then(res => res.json())
            .then(async res => {
                this.setState({isBackdropVisible: false, images: [], imageIDs: []});
                if (res.status == "ok") {
                    let note = {
                        topic: res.body.topic || "_",
                        note: res.body.note,
                        resources: res.body.resources,
                        id: res.body._id,
                        date: new Date(res.body.date),
                        referenceCourse: global.courseInfoCourse.id,
                      }
                    note = new Note(note);
                    let notes = [...this.props.parent.state.notes];
                    notes.push(note);
                    global.notes.push(note);
                    let storageNotes = await Notes._retrieveFromStorage();
                    storageNotes.push(note);
                    await Notes._saveToStorage(storageNotes);
                    this.props.parent.setState({notes});
                }  
            })
    }
    onPress = () => {
        this.create.current.setState({disabled: true});
        if (this.state.note && this.state.topic) {
            let api = new ApexAPI(global.user);
            if (this.state.topic.topicType == "string") {
                api.post("topics", {
                    topic: this.state.topic.topic,
                    reference_course: global.courseInfoCourse.id,
                })
                    .then(res => res.json())
                    .then(async res => {
                        if (res.status == "ok") {
                            this.state.topic = {
                                topicType: "id",
                                topic: res.body._id,
                            }
                            let topic = {
                                topic: res.body.topic,
                                id: res.body._id,
                                course: res.body.reference_course
                            }
                            topic = new Topic(topic);
                            global.topics.push(topic);
                            let storageTopics = await Topics._retrieveFromStorage();
                            storageTopics.push(topic);
                            await Topics._saveToStorage(storageTopics);
                            this.createAssignment();
                        }
                    });
            } else {
                this.createAssignment();
            }
        }
    }
    handleClear = () => {
        this.assignment.current.setState({value: ""});
        this.due.current.setState({value: ""});
        this.notes.current.setState({value: ""});
        this.images = [];
        this.imageIDs = [];
        this.topic = {
            topic: "_",
            topicType: "id",
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
                    <Animated.View style={{position: "relative", top: this.state.keyboardHeight}}>
                        <View style={styles.newNoteModal}>
                            <View style={styles.assignmentModalHeader}>
                                <Text style={{color: "#174ea6", fontSize: 16}}>Note</Text>
                                <Touchable onPress={this.props.parent.closeNoteModal} hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}>
                                    <XIcon size={30} color="black"></XIcon>
                                </Touchable>
                            </View>
                            <View style={styles.noteModalBody}>
                                <ScrollView style={{padding: 20}}>
                                    <Text style={{color: "rgb(190,190,190)", fontSize: 14, fontWeight: "500"}}>For {this.props.course.course}</Text>
                                    <ModalInput handleInput={this.handleInput} ref={this.note} style={{marginTop: 30}} label="Note" stateKey={"note"}></ModalInput>
                                    <TopicDropDown course={this.props.parent.course.id} handleInput={this.handleInput} ref={this.topic} topics={this.state.topics}></TopicDropDown>
                                    <Text style={{marginTop: 30, marginBottom: 10, fontSize: 12, color: "rgba(0,0,0,0.38)"}}>Images</Text>
                                    <ImageBar displayImages={true} imageFunction={this.imageFunction}></ImageBar>
                                </ScrollView>
                            </View>
                            <View style={styles.assignmentModalFooter}>
                                <Touchable onPress={this.handleClear}>
                                    <TrashIcon color="black" size={26} style={{marginRight: 30, padding: 20}}></TrashIcon>
                                </Touchable>
                                <ConfirmButton ref={this.create} onPress={this.onPress}></ConfirmButton>
                            </View>
                        </View>
                    </Animated.View>
                </Modal>
            </View>
        )
    }
}

class DisplayNoteModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBackdropVisible: false,
            shouldOpenImageModal: false,
            images: [],
            imageURLs: [],
            imageIndex: 0,
            note: {
                note: "",
                topic: "_",
                date: "",
                resources: [],
                id: "_",
            },
        }
    }
    modalHide = () => {
        if (this.state.shouldOpenImageModal) {
            this.props.imageViewer.current.setState({isBackdropVisible: true, images: this.state.imageURLs, index: this.state.imageIndex});
        }
    }
    openImageViewer = (resources, index) => {
        let urls = resources.map(resource => {
            return {url: `https://www.apexschools.co${resource.path}`};
        });
        this.setState({shouldOpenImageModal: true, isBackdropVisible: false, imageURLs: urls, imageIndex: index});
    }
    render() {
        let topicsMap = Topics._makeTopicMap(global.topics);
        return (
            <View>
                <Modal
                    onModalHide={this.modalHide}
                    animationIn="zoomIn"
                    animationOut="zoomOut"
                    isVisible={this.state.isBackdropVisible} 
                    onBackdropPress={() => this.setState({isBackdropVisible: false})}
                    propagateSwipe={true}>
                        <View style={styles.displayAssignment}>
                            <View style={styles.assignmentModalHeader}>
                                <Text style={{color: "#174ea6", fontSize: 16}}>Note</Text>
                                <Touchable onPress={this.props.parent.closeNote} hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}>
                                    <XIcon size={30} color="black"></XIcon>
                                </Touchable>
                            </View>
                            <View style={[styles.displayAssignmentModalBody, {height: 0, flexGrow: 1}]}>
                                <ScrollView>
                                    <View style={styles.modalBodySection}>
                                        <Text style={styles.modalBodySectionHeader}>Note</Text>
                                        <Text style={styles.modalBodySectionContent}>{this.state.note.note}</Text>
                                    </View>
                                    <View style={styles.modalBodySection}>
                                        <Text style={styles.modalBodySectionHeader}>Topic</Text>
                                        <Text style={styles.modalBodySectionContent}>{this.state.note.topic == "_" ? "No Topic" : topicsMap[this.state.note.topic].topic}</Text>
                                    </View>
                                    <View style={styles.modalBodySection}>
                                        <Text style={styles.modalBodySectionHeader}>Date Created</Text>
                                        <Text style={styles.modalBodySectionContent}>{moment(this.state.note.date).format("MMMM Do YYYY, h:mm:ss a")}</Text>
                                    </View>
                                    <View style={styles.modalBodySection}>
                                        <Text style={[styles.modalBodySectionHeader, {marginBottom: 10}]}>Images</Text>
                                        <View style={{flexDirection: "column", alignItems: "center"}}>
                                            {
                                                this.state.note.resources.map((resource, index, array) => {
                                                    return (
                                                        <Touchable key={"image_" + index} onPress={() => {this.openImageViewer(array, index)}}>
                                                            <Image source={{uri: `https://www.apexschools.co${resource.path}`}} style={{width: 200, height: resource.height/resource.width*200, marginTop: 10, marginBottom: 10}}></Image>
                                                        </Touchable>
                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                </Modal>
            </View>
        )
    }
}

class NoteBubble extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let date = this.props.date.split("_");
        date = new Date(...date);
        return (
            <View style={[styles.assignmentBubble, boxShadows.boxShadow3]}>
                <View style={styles.assignmentBubbleHeader}>
                    <Text style={{color: "#174ea6", fontSize: 30}}>
                        {moment(date).format("MMMM Do YYYY")}
                    </Text>
                </View>
                {
                    this.props.notes.map((note, index, array) => {
                        return (
                            <NoteRow openNote={this.props.openNote} closeNote={this.props.closeNote} key={"note_" + index} last={index==array.length-1} note={note}></NoteRow>
                        )
                    })
                }
            </View>
        )
    }
}

class NoteRow extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let topicsMap = Topics._makeTopicMap(global.topics);
        return (
            <View style={this.props.last ? styles.assignmentRowLast : styles.assignmentRow}>
                <TouchableWithoutFeedback onPress={() => {this.props.openNote(this.props.note)}} style={{width: 0, flexGrow: 1, flexDirection: "row"}}>
                    <View style={styles.assignmentInfo}>
                        <View style={styles.assignmentTitle}>
                            <Text style={{fontSize: 16}} numberOfLines={1}>
                                {this.props.note.note}
                            </Text>    
                        </View>
                        <View style={styles.assignmentDue} numberOfLines={1}>
                            <Text style={{fontSize: 14, color: "rgb(190,190,190)"}}>
                                {this.props.note.topic == "_" ? "No Topic" : topicsMap[this.props.note.topic].topic}
                            </Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}




export default class CourseInfoScreen extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.course = global.courseInfoCourse;
        this.state = {
            assignments: Assignments._retrieveAssignmentsByCourse(global.assignments, this.course.id),
            notes: Notes._retrieveNotesByCourse(global.notes, this.course.id),
            pageIndex: 0,
        }
        this.modal = React.createRef();
        this.displayModal = React.createRef();
        this.imageViewerModal = React.createRef();
        this.scrollMain = React.createRef();
        this.chatroom = React.createRef();
        this.displayNoteModal = React.createRef();
        this.noteModal = React.createRef();
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
    openNoteModal = () => {
        this.noteModal.current.setState({isBackdropVisible: true});
    }
    closeNoteModal = () => {
        this.noteModal.current.setState({isBackdropVisible: false});
    }

    openAssignment = (assignment) => {
        this.displayModal.current.setState({images: assignment.responseResources, shouldOpenImageModal: false, assignment, isBackdropVisible: true});
    }
    closeAssignment = () => {
        this.displayModal.current.setState({shouldOpenImageModal: false, isBackdropVisible: false});
    }
    openNote = (note) => {
        this.displayNoteModal.current.setState({shouldOpenImageModal: false, note, isBackdropVisible: true});
    }
    closeNote = () => {
        this.displayNoteModal.current.setState({shouldOpenImageModal: false, isBackdropVisible: false});
    }
    closeImageViewer = () => {

    }
    changePage = (page) => {
        this.scrollMain.current.scrollTo({x: page*width, y: 0, animated: true});
        this.setState({pageIndex: page});
        if (page == 2) {
            this.chatroom.current.isShowing = true;
        } else {
            this.chatroom.current.isShowing = false;
        }
    }
    render() {
        let topicsList = Topics._MakeCourseTopicList(this.course.id, global.topics);
        let topicsMap = Topics._makeTopicMap(topicsList);
        let assignmentsMap = Assignments._formTopicMap(this.state.assignments, topicsList);
        let notesList = this.state.notes.sort((a, b) => {
            return a.date.getTime() > b.date.getTime() ? 1 : -1;    
        });
        notesMap = Notes._formDateMap(notesList);
        return (
            <View style={styles.container}>
                <HeaderBar iconLeft={<Touchable onPress={() => this.props.navigation.goBack()}><LeftIcon size={28}></LeftIcon></Touchable>} iconRight={<EmptyIcon width={28} height={32}></EmptyIcon>} width={width} height={60} title={this.course.course}></HeaderBar>
                <View style={styles.bodyHolder}>
                    <ScrollView ref={this.scrollMain} horizontal={true} style={{width, ...ifIphoneX({height: height-80-60}, {height: height-60-45,})}} scrollEnabled={false} keyboardShouldPersistTaps="always" keyboardDismissMode="on-drag">
                        <ScrollView style={styles.infoHolder}>
                            <View style={styles.optionContent}>
                                <CreateButton onPress={this.openModal}></CreateButton>
                                {
                                    Object.keys(assignmentsMap).map((topic, index) => {
                                        return <AssignmentBubble openAssignment={this.openAssignment} closeAssignment={this.closeAssignment} key={"topic_" + index} assignments={assignmentsMap[topic]} title={topic=="_" ? "No Topic" : topicsMap[topic].topic}></AssignmentBubble>
                                    })
                                }
                            </View>
                        </ScrollView>
                        <ScrollView style={styles.infoHolder}>
                            <View style={styles.optionContent}>
                                <CreateButton onPress={this.openNoteModal}></CreateButton>
                                {
                                    Object.keys(notesMap).map((date, index) => {
                                        return <NoteBubble key={"notebubble_" + index} openNote={this.openNote} closeNote={this.closeNote} notes={notesMap[date]} date={date}></NoteBubble>
                                    })
                                }
                            </View>
                        </ScrollView>
                        <View style={{width, ...ifIphoneX({height: height-80-60}, {height: height-60-45,})}}>
                            <ScrollView scrollEnabled={false} style={{width, ...ifIphoneX({height: height-80-60}, {height: height-60-45,})}}  keyboardShouldPersistTaps="always" keyboardDismissMode="on-drag">
                                <ChatRoom imageViewer={this.imageViewerModal} ref={this.chatroom}>

                                </ChatRoom>
                            </ScrollView>                    
                        </View>
                    </ScrollView>
                </View>
                <View style={[boxShadows.boxShadow7, {zIndex: 5}]}>
                    <LinearGradient start={{x: 0, y: 0}} end={{x:1, y:0}} style={[{width: width, height: ifIphoneX(60, 45)}]} colors={["rgb(0,153,153)", ", rgb(0,130,209)"]}>
                        <View style={styles.switchHeader}>
                            <TouchableWithoutFeedback onPress={() => this.changePage(0)}>
                                <View style={[styles.switchOption, this.state.pageIndex==0 ? styles.switchOptionSelected : {}]}>
                                    <Text style={{color: "white", fontSize: 14}}>Assignments</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => this.changePage(1)}>
                                <View style={[styles.switchOption, this.state.pageIndex==1 ? styles.switchOptionSelected : {}]}>
                                    <Text style={{color: "white", fontSize: 14}}>Notes</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => this.changePage(2)}>
                                <View style={[styles.switchOption, this.state.pageIndex==2 ? styles.switchOptionSelected : {}]}>
                                    <Text style={{color: "white", fontSize: 14}}>Chat</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </LinearGradient>
                </View>
                <AssignmentModal ref={this.modal} parent={this} course={this.course}></AssignmentModal>
                <NoteModal ref={this.noteModal} parent={this} course={this.course}></NoteModal>
                <DisplayAssignmentModal imageViewer={this.imageViewerModal} ref={this.displayModal} parent={this}></DisplayAssignmentModal>
                <DisplayNoteModal imageViewer={this.imageViewerModal} ref={this.displayNoteModal} parent={this}></DisplayNoteModal>
                <ImageViewerModal ref={this.imageViewerModal} parent={this}></ImageViewerModal>
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
        ...ifIphoneX({
            height: height-80-60
        }, {
            height: height-60-45,
        }),
        backgroundColor: "#Fdfdfd",
    },
    infoHolder: {
        backgroundColor: "#Fdfdfd",
        width,
    },
    switchHeader: {
        width, 
        height: ifIphoneX(60, 45),
        flexDirection: "row",
    },
    switchOption: {
        ...ifIphoneX({
            height: 60,
            paddingBottom: 15,
        }, {
            height: 45,
        }),
        flexGrow: 1,
        flexBasis: 0,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    switchOptionSelected: {
        backgroundColor: "rgba(255,255,255,0.4)",
    },
    optionContent: {
        width,
        paddingLeft: 5,
        paddingRight: 5,
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
        paddingLeft: 0,
        paddingRight: 5,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    assignmentRowLast: {
        height: 70,
        paddingRight: 5,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    assignmentInfo: {
        width: 0,
        flexGrow: 1,
    },
    assignmentTitle: {
        marginBottom: 5,
        flexDirection: "row",
    },
    newAssignmentModal: {
        borderRadius: 8,
        height: height*0.9,
        backgroundColor: "white",
        overflow: "hidden",
        flexDirection: "column",
    },
    newNoteModal: {
        borderRadius: 8,
        height: height*0.5,
        backgroundColor: "white",
        overflow: "hidden",
        flexDirection: "column",
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
        flexGrow: 1,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    assignmentModalBody: {
        height: height*0.9-60-70,
    },
    noteModalBody: {
        height: height*0.5-60-70,
    },
    confirmButton: {
        width: 100,
        textAlign: "center",
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#ddd",
        color: "#aaa",
        borderRadius: 3,
        overflow: "hidden",
    },
    confirmButtonAllowed: {
        width: 100,
        textAlign: "center",
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#174ea6",
        color: "white",
        borderRadius: 3,
        overflow: "hidden",
    },
    displayAssignment: {
        height: height*0.5,
        backgroundColor: "white",
        overflow: "hidden",
        flexDirection: "column",
    },
    modalBodySection: {
       paddingLeft: 30,
       marginTop: 25,
       marginBottom: 10,
       paddingRight: 30,
    },
    modalBodySectionHeader: {
        color: "#174ea6",
        fontSize: 18,
        fontWeight: "500",
    },
    modalBodySectionContent: {
        fontSize: 14,
        marginLeft: 10,
        marginTop: 5,
    }
})

