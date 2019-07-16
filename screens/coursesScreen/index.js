import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';

import HeaderBar from '../../components/header';

import {
  LeftIcon,
  ConfirmIcon,
  DownIcon,
  UpIcon,
  EmptyIcon,
  SchoolIcons,
  GenericIcon,
  CloseIcon,
} from '../../classes/icons';

import {User} from '../../classes/user';

import {Courses} from '../../classes/courses';

import {Semesters} from '../../classes/semesters';

import {ScrollView} from 'react-native-gesture-handler';

import {LinearGradient} from 'expo-linear-gradient';

import {boxShadows} from '../../constants/boxShadows';

import Touchable from 'react-native-platform-touchable';

import Collapsible from 'react-native-collapsible';

import {StackActions, NavigationActions} from 'react-navigation';

import {ifIphoneX} from 'react-native-iphone-x-helper';

import ApexAPI from '../../http/api';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

//ruleset: {block: [a]}
function checkIfAllowed (course, ruleset) {
  for (var key in ruleset) {
    for (var i = 0; i < ruleset[key].length; i++) {
      if (course[key] == ruleset[key][i]) {
        return false;
      }
    }
  }
  return true;
}

class CourseSelectable extends React.Component {
  constructor (props) {
    super (props);
    this.props = props;
  }
  handleClick = () => {
    this.props.parent.addBlock ({
      semester: this.props.semester,
      course: this.props.course,
      teacher: this.props.teacher,
      block: this.props.block,
      id: this.props.id,
    });
  };

  render () {
    let block = global.school.blocks.filter (
      block => block._id == this.props.block
    );
    return (
      <Touchable onPress={this.handleClick}>
        <View
          style={[
            styles.courseSelectable,
            this.props.even ? 
            (global.user.theme == "Light" ? {backgroundColor: "white"} : {backgroundColor: "black"}) : (global.user.theme == "Light" ? {backgroundColor: "#fafafa"} : {backgroundColor: "#1a1a1a"}),
          ]}
        >
          <View style={styles.verticalStack}>
            <Text style={[styles.course, global.user.secondaryTextColor()]}>{this.props.course}</Text>
            <Text style={[styles.teacher, global.user.secondaryTextColor()]}>{this.props.teacher}</Text>
          </View>
          <View style={styles.rightItem}>
            <Text style={[styles.block, global.user.secondaryTextColor()]}>
              Block {block.length > 0 ? block[0].block : ''}
            </Text>
          </View>
        </View>
      </Touchable>
    );
  }
}

class CourseIcon extends React.Component {
  render () {
    return (
      <View
        style={[
          styles.icon,
          {backgroundColor: this.props.color},
          boxShadows.boxShadow2,
        ]}
      >
        {this.props.children}
      </View>
    );
  }
}

class CollapsableSection extends React.Component {
  constructor (props) {
    super (props);
    this.props = props;
    this.state = {
      collapsed: true,
    };
  }
  _switchState = () => {
    this.setState ({collapsed: !this.state.collapsed});
  };
  render () {
    let icon = SchoolIcons.getIcon (this.props.section.title);
    return (
      <View>
        <Touchable onPress={this._switchState}>
          <View style={[styles.sectionHeader, global.user.primaryTheme ()]}>
            <CourseIcon color={icon[1]}>
              <GenericIcon icon={icon[0]} color="black" size={20} />
            </CourseIcon>
            <Text style={[styles.sectionHeaderText, global.user.primaryTextColor()]}>
              {this.props.section.title}
            </Text>
            {this.state.collapsed
              ? <DownIcon color={global.user.getPrimaryTextColor()} size={18} />
              : <UpIcon color={global.user.getPrimaryTextColor()} size={18} />}
          </View>
        </Touchable>
        <Collapsible collapsed={this.state.collapsed}>
          {this.props.section.content.map ((x, index) => {
            if (checkIfAllowed (x, this.props.ruleset)) {
              return (
                <CourseSelectable
                  parent={this.props.parent}
                  key={`course_${index}`}
                  {...x}
                  even={index % 2 == 0}
                />
              );
            }
          })}
        </Collapsible>
      </View>
    );
  }
}

class CourseSemesterList extends React.Component {
  addBlock = block => {
    //adds to parent
    this.props.parent.addBlock (block);
    //adds the block to the display
    let courses = this.state.courses;
    courses[block.block] = block;
    //adds the block to the ruleset
    let blocks = this.state.ruleset.block;
    if (blocks.indexOf (block.block) < 0) {
      blocks.push (block.block);
    }
    this.setState ({courses, ruleset: {block: blocks}});
  };
  removeBlock = block => {
    //removes from parent
    this.props.parent.removeBlock (block);
    //removes the block from the display
    let courses = this.state.courses;
    delete courses[block.block];
    //removes the block from the ruleset
    let blocks = this.state.ruleset.block;
    let index = blocks.indexOf (block.block);
    if (index > -1) {
      blocks.splice (index, 1);
    }
    this.setState ({courses, ruleset: {block: blocks}});
  };

  constructor (props) {
    super (props);
    this.props = props;
    let existingBlocks = [];
    let existingCourses = {};
    for (var key in this.props.existing) {
      if (this.props.existing[key].isReal) {
        existingBlocks.push (key);
        existingCourses[key] = this.props.existing[key];
      }
    }
    this.state = {
      ruleset: {
        block: existingBlocks,
      },
      courses: existingCourses,
    };

    this.sections = [];
    let coursesMap = {};
    for (var i = 0; i < this.props.courses.length; i++) {
      if (coursesMap[this.props.courses[i].category]) {
        coursesMap[this.props.courses[i].category].push (this.props.courses[i]);
      } else {
        coursesMap[this.props.courses[i].category] = [this.props.courses[i]];
      }
    }
    for (var key in coursesMap) {
      this.sections.push ({
        title: key,
        content: coursesMap[key],
      });
    }
  }
  render () {
    return (
      <View>
        {this.sections.map ((x, index) => {
          return (
            <CollapsableSection
              ruleset={this.state.ruleset}
              parent={this}
              section={x}
              key={`section_${index}`}
            />
          );
        })}
        <UserCourses parent={this} courses={this.state.courses} />
      </View>
    );
  }
}

class UserCourses extends React.Component {
  render () {
    let blocks = [];
    let allBlocks = global.school.blocks;
    allBlocks.sort ((a, b) => {
      return a.block.localeCompare (b.block);
    });
    for (var i = 0; i < allBlocks.length; i++) {
      if (!allBlocks[i].is_constant) {
        if (this.props.courses[allBlocks[i]._id]) {
          this.props.courses[allBlocks[i]._id].isReal = true;
          blocks.push (
            <UserCourseBlock
              parent={this.props.parent}
              block={allBlocks[i]}
              course={this.props.courses[allBlocks[i]._id]}
              key={`courseBlock_${i}`}
            />
          );
        } else {
          let course = {
            course: global.school.spareName,
            teacher: 'Free',
            block: allBlocks[i]._id,
            isReal: false,
          };
          blocks.push (
            <UserCourseBlock
              course={course}
              block={allBlocks[i]}
              key={`courseBlock_${i}`}
            />
          );
        }
      }
    }
    return (
      <View style={styles.userCourses}>
        {blocks}
      </View>
    );
  }
}

class UserCourseBlock extends React.Component {
  handleClick = () => {
    this.props.parent.removeBlock (this.props.course);
  };
  render () {
    if (this.props.course.isReal) {
      return (
        <View
          style={[
            styles.userBlock,
            boxShadows.boxShadow3,
            global.user.secondaryTheme (),
          ]}
        >
          <View style={styles.verticalStack}>
            <Text
              style={[
                styles.userBlockCourse,
                global.user.secondaryTextColor (),
              ]}
            >
              {this.props.course.course}
            </Text>
            <Text
              style={[
                styles.userBlockTeacher,
                global.user.tertiaryTextColor (),
              ]}
            >
              {this.props.course.teacher}
            </Text>
          </View>
          <View style={styles.rightItem}>
            <Text
              style={[styles.userBlockBlock, global.user.tertiaryTextColor ()]}
            >
              block {this.props.block.block}
            </Text>
            <Touchable onPress={this.handleClick}>
              <CloseIcon style={styles.closeIcon} color="red" />
            </Touchable>
          </View>

        </View>
      );
    } else {
      return (
        <View
          style={[
            styles.userBlock,
            boxShadows.boxShadow3,
            global.user.secondaryTheme (),
          ]}
        >
          <View style={styles.verticalStack}>
            <Text
              style={[
                styles.userBlockCourse,
                global.user.secondaryTextColor (),
              ]}
            >
              {this.props.course.course}
            </Text>
            <Text
              style={[
                styles.userBlockTeacher,
                global.user.tertiaryTextColor (),
              ]}
            >
              {this.props.course.teacher}
            </Text>
          </View>
          <View style={styles.rightItem}>
            <Text
              style={[styles.userBlockBlock, global.user.tertiaryTextColor ()]}
            >
              block {this.props.block.block}
            </Text>
            <CloseIcon style={styles.closeIcon} color="white" />
          </View>
        </View>
      );
    }
  }
}

class SemesterTabBarButton extends React.Component {
  constructor (props) {
    super (props);
  }
  handleClick = () => {
    this.props.bar.setState ({selectedIndex: this.props.index});
    this.props.scrollView.current.scrollTo ({
      x: width * this.props.index,
      y: 0,
      animated: true,
    });
    // this.props.scrollView.scrollTo({x: width, y: 0, animated: true});
  };
  render () {
    if (this.props.selected) {
      return (
        <Touchable onPress={this.handleClick}>
          <View style={[styles.semesterButton, styles.selectedTabButton]}>
            <Text style={styles.semesterText}>
              {this.props.semester}
            </Text>
          </View>
        </Touchable>
      );
    } else {
      return (
        <Touchable onPress={this.handleClick}>
          <View style={styles.semesterButton}>
            <Text style={styles.semesterText}>
              {this.props.semester}
            </Text>
          </View>
        </Touchable>
      );
    }
  }
}
class SemesterTabBar extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      selectedIndex: 0,
    };
  }
  render () {
    return (
      <View>
        <ScrollView
          horizontal={true}
          bounces={false}
          showsHorizontalScrollIndicator={false}
        >
          {this.props.semesters.map ((x, index) => {
            return (
              <SemesterTabBarButton
                semester={x}
                key={`semester_${index}`}
                index={index}
                scrollView={this.props.scrollView}
                bar={this}
                selected={this.state.selectedIndex == index}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

export default class CoursesScreen extends React.Component {
  addBlock = block => {
    try {
      this.semesterMap[block.semester][block.block] = block;
    } catch (e) {
      console.log (e);
    }
  };
  removeBlock = block => {
    try {
      this.semesterMap[block.semester][block.block].isReal = false;
    } catch (e) {
      console.log (e);
    }
  };
  finished = async () => {
    try {
      let finalCourses = [];
      for (var key in this.semesterMap) {
        for (var block in this.semesterMap[key]) {
          if (
            this.semesterMap[key][block].isReal &&
            !this.semesterMap[key][block].constant
          ) {
            finalCourses.push (this.semesterMap[key][block].id);
          }
        }
      }
      let api = new ApexAPI (global.user);
      global.user.courses = finalCourses;
      api
        .put (`users/${global.user.id}`, {
          courses: global.user.courses,
        })
        .then (data => data.json ())
        .then (data => {
          console.log (data);
        });
      await User._saveToStorage (global.user);
      let userCourses = await Courses._retrieveCoursesById (user.courses);
      let semesterMap = await Semesters._createSemesterMap (
        userCourses,
        school.blocks
      );
      let currentCourseMap = await Semesters._createCoursesOnDate (
        userCourses,
        global.school.blocks,
        global.currentSemesters
      );
      global.currentCourseMap = currentCourseMap;
      global.semesterMap = semesterMap;
      global.userCourses = userCourses;
      const resetAction = StackActions.reset ({
        index: 0,
        actions: [NavigationActions.navigate ({routeName: 'Home'})],
      });
      this.props.navigation.dispatch (resetAction);
    } catch (e) {
      console.log (e);
      this.props.navigation.goBack ();
    }
  };
  constructor (props) {
    super (props);
    this.props = props;
    let courses = global.courses;
    let semesters = global.semesters;
    let courseSemesterMap = {};
    for (var i = 0; i < courses.length; i++) {
      if (courseSemesterMap[courses[i].semester]) {
        courseSemesterMap[courses[i].semester].push (courses[i]);
      } else {
        courseSemesterMap[courses[i].semester] = [courses[i]];
      }
    }
    this.semesterMap = global.semesterMap;
    this.slides = [];
    this.semesters = [];
    for (var key in courseSemesterMap) {
      for (var i = 0; i < semesters.length; i++) {
        if (semesters[i].id == key) {
          this.semesters.push (semesters[i].name);
        }
      }
      this.slides.push (
        <View key={key} style={[styles.bodySlide, global.user.primaryTheme ()]}>
          <ScrollView>
            <CourseSemesterList
              parent={this}
              courses={courseSemesterMap[key]}
              existing={this.semesterMap[key]}
            />
          </ScrollView>
        </View>
      );
    }
    this.scrollView = React.createRef ();
  }
  componentDidMount() {
    this.props.navigation.getParam("callback", () => {})();
  }
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };

  render () {
    return (
      <View style={styles.container}>
        <HeaderBar
          iconLeft={
            <Touchable onPress={() => this.props.navigation.goBack ()}>
              <LeftIcon size={28} />
            </Touchable>
          }
          iconRight={
            <Touchable onPress={this.finished}>
              <ConfirmIcon size={32} style={{paddingRight: 10}} />
            </Touchable>
          }
          width={width}
          height={60}
          title="Courses"
        />
        <View style={styles.bodyHolder}>
          <ScrollView
            ref={this.scrollView}
            horizontal={true}
            style={styles.slideView}
            scrollEnabled={false}
          >
            {this.slides.map (x => {
              return x;
            })}
          </ScrollView>
        </View>
        <View style={[boxShadows.boxShadow7, {zIndex: 5}]}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={[{width: width, ...ifIphoneX ({height: 60}, {height: 45})}]}
            colors={['rgb(0,153,153)', ', rgb(0,130,209)']}
          >
            <SemesterTabBar
              scrollView={this.scrollView}
              semesters={this.semesters}
            />
          </LinearGradient>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create ({
  container: {
    width: width,
    flexGrow: 1,
    flexDirection: 'column',
  },
  bodyHolder: {
    ...ifIphoneX (
      {
        height: height - 80 - 60,
      },
      {
        height: height - 60 - 45,
      }
    ),
    zIndex: 1,
  },
  slideView: {
    width: width,
  },
  bodySlide: {
    width: width,
    flexGrow: 1,
    backgroundColor: '#f0f0f0',
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
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
    paddingLeft: 10,
  },
  courseSelectable: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  verticalStack: {
    flexDirection: 'column',
  },
  course: {
    fontSize: 16,
    fontWeight: '700',
  },
  teacher: {
    fontSize: 14,
    fontWeight: '300',
    color: '#444',
  },
  block: {
    fontSize: 13,
    fontWeight: '300',
  },
  even: {
    backgroundColor: 'white',
    zIndex: 1,
  },
  odd: {
    backgroundColor: '#fafafa',
    zIndex: 5,
  },
  semesterButton: {
    minWidth: width / 3,
    ...ifIphoneX (
      {
        height: 60,
        paddingBottom: 15,
      },
      {
        height: 45,
      }
    ),
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  semesterText: {
    fontSize: 14,
    color: 'white',
  },
  selectedTabButton: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  icon: {
    width: 35,
    height: 35,
    margin: 7.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  sectionHeaderText: {
    fontSize: 17,
  },
  userCourses: {
    width,
    marginTop: 15,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  userBlock: {
    width: width * 0.95,
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userBlockCourse: {
    fontSize: 16,
    fontWeight: '700',
  },
  userBlockTeacher: {
    fontSize: 16,
    color: '#444',
    fontWeight: '300',
  },
  userBlockBlock: {
    fontSize: 14,
    fontWeight: '300',
  },
  rightItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeIcon: {
    padding: 10,
  },
});
