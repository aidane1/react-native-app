import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Text
} from 'react-native';

import HeaderBar from "../../components/header";

import { LeftIcon, RightIcon, EmptyIcon, CourseIcon, EventsIcon, LogoutIcon, NotesIcon, AssignmentsIcon, SchoolAssignmentsIcon, BeforeSchoolIcon, LunchTimeIcon, AfterSchoolIcon } from "../../classes/icons";

import { ScrollView } from 'react-native-gesture-handler';

import { boxShadows } from "../../constants/boxShadows";

import Touchable from 'react-native-platform-touchable';

import Collapsible from 'react-native-collapsible';

import Accordion from 'react-native-collapsible/Accordion';

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

let sections = [
    {
        title: "Science",
        content: [
            {course: "Physics 12", teacher: "Mr. Austin", block: "A"},
            {course: "Physics 12", teacher: "Mr. Austin", block: "A"},
            {course: "Physics 12", teacher: "Mr. Austin", block: "A"}
        ],
    },
    {
        title: "Second",
        content: [
            {course: "Physics 12", teacher: "Mr. Austin", block: "A"},
            {course: "Physics 12", teacher: "Mr. Austin", block: "A"},
            {course: "Physics 12", teacher: "Mr. Austin", block: "A"}
        ]
    }
]

class CourseSelectable extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }
    render() {
        return (
            <View style={[styles.courseSelectable, (this.props.even ? styles.even : styles.odd), (!this.props.even ? boxShadows.boxShadow1 : {})]}>
                <View style={styles.verticalStack}>
                    <Text style={styles.course}>{this.props.course}</Text>
                    <Text style={styles.teacher}>{this.props.teacher}</Text>
                </View>
                <View style={styles.rightItem}> 
                    <Text style={styles.block}>Block {this.props.block}</Text>
                </View>
            </View>
        )
    }
}

class CollapsableSection extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            collapsed: true
        }
        console.log(this.props.section.content);
    }
    _switchState = () => {
        this.setState({collapsed: !this.state.collapsed});
    }
    render() {
        return (
            <View>
                <Touchable onPress={this._switchState}>
                    <View style={styles.sectionHeader}>
                        <Text>{this.props.section.title}</Text>
                    </View>
                </Touchable>
                <Collapsible collapsed={this.state.collapsed}>
                   {
                       this.props.section.content.map((x, index) => {
                            return (<CourseSelectable key={`course_${index}`} {...x} even={index%2==0} />)
                       })
                   } 
                </Collapsible>
            </View>
        )
    }
}

class CourseSemesterList extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.sections = [];
        let coursesMap = {};
        for (var i = 0; i < this.props.courses.length; i++) {
            if (coursesMap[this.props.courses[i].category]) {
                coursesMap[this.props.courses[i].category].push({
                    course: this.props.courses[i].course,
                    teacher: this.props.courses[i].teacher,
                    block: this.props.courses[i].block,
                })
            } else {
                coursesMap[this.props.courses[i].category] = [
                    {
                        course: this.props.courses[i].course,
                        teacher: this.props.courses[i].teacher,
                        block: this.props.courses[i].block,
                    }
                ]
            }
        }
        for (var key in coursesMap) {
            this.sections.push({
                title: key,
                content: coursesMap[key]
            })
        }
    }
    render() {
        return (
            <View>
                {
                    this.sections.map((x, index) => {
                        return (<CollapsableSection section={x} key={`section_${index}`}/>)
                    })
                }
            </View>
        )
    } 
}



export default class CoursesScreen extends React.Component {
    constructor(props) {
        super(props);
        this.props  = props;
        let courses = global.courses;
        let courseSemesterMap = {};
        for (var i = 0; i < courses.length; i++) {
            if (courseSemesterMap[courses[i].semester]) {
                courseSemesterMap[courses[i].semester].push(courses[i]);
            } else {
                courseSemesterMap[courses[i].semester] = [courses[i]];
            }
        }
        this.slides = [];
        for (var key in courseSemesterMap) {
            this.slides.push(
                <View key={key} style={styles.bodySlide}>
                    <ScrollView>
                        <CourseSemesterList courses={courseSemesterMap[key]}></CourseSemesterList>
                    </ScrollView>
                </View>
            )
        }
    }
    static navigationOptions = ({navigation}) => {
        return {
            header: null,
        }
    }
    
    render() {
        return (
            <View style={styles.container}>
                <HeaderBar iconLeft={<TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Home')}><LeftIcon size={28}></LeftIcon></TouchableWithoutFeedback>} iconRight={<EmptyIcon width={28} height={32}></EmptyIcon>} width={width} height={60} title="Courses"></HeaderBar>  
                <View style={styles.bodyHolder}>
                    <ScrollView horizontal={true} style={styles.slideView} scrollEnabled={false}>
                        {
                            this.slides.map((x, index) => {
                                return x;
                            })
                        }
                    </ScrollView>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    flexGrow: 1,
    flexDirection: 'column'
  }, 
  bodyHolder: {
    height: height-60-45,
    zIndex: 1,
  },
  slideView: {
    width: width,
  },  
  bodySlide: {
    width: width,
    flexGrow: 1,
  },
  scrollBack: {
    width: width,
  },
  collapsible: {
      width: width,
  },
  sectionHeader: {
    width: width,
    height: 60,
    backgroundColor: "#f0f0f0",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  courseSelectable: {
    width: width,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15
  },
  verticalStack: {
    flexDirection: "column",
  },
  rightItem: {

  },
  course: {
    fontSize: 16,
    fontWeight: "700",
  },
  teacher: {
    fontSize: 14,
    fontWeight: "300",
    color: "#444"
  },
  block: {
    fontSize: 13,
    fontWeight: "300"
  },
  even: {
    backgroundColor: "white",
    zIndex: 1,
  },
  odd: {
    backgroundColor: "#f0f0f0",
    zIndex: 5,
  }
});