import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  AsyncStorage,
  Button,
  RefreshControl,
} from 'react-native';

import {LinearGradient} from 'expo-linear-gradient';

import {boxShadows} from '../../constants/boxShadows';

import Touchable from 'react-native-platform-touchable';

import {Courses} from '../../classes/courses';

import moment from "moment"

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

class GradientBlock extends React.Component {
  render () {
    return (
      <View style={[styles.gradientBlock, boxShadows.boxShadow4]}>
        <LinearGradient
          colors={['#e8865c', '#e86e5c']}
          style={[styles.gradientBlockChild]}
        >
          <View style={styles.blockBody}>
            <View style={styles.blockHeader}>
              <Text style={styles.blockHeaderText}>
                {this.props.title}
              </Text>
            </View>
            <View style={styles.blockLeft}>
              <Text style={[styles.blockMain, {maxWidth: width*0.95-100}]} numberOfLines={1}>
                {this.props.main}
              </Text>
              <Text style={styles.blockSecondary}>
                {this.props.secondary}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }
}
class EventBlock extends React.Component {
  render () {
    return (
      <View style={[styles.gradientBlock, boxShadows.boxShadow4]}>
        <LinearGradient
          colors={['#5cc0e8', '#5c9be8']}
          style={styles.gradientBlockChild}
        >
          <View style={[styles.blockBody, {flexDirection: 'column'}]}>
            <View>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <Text style={styles.eventTopRow}>
                  {this.props.title}
                </Text>
              </ScrollView>
            </View>
            <View style={styles.eventBottomRow}>
              <Text style={styles.eventBottomRowText}>
                
                {moment(this.props.event_date).format("YYYY-MM-DD")}
              </Text>
              <Text style={styles.eventBottomRowText}>
                {this.props.time}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }
}
class AssignmentBlock extends React.Component {
  constructor (props) {
    super (props);
  }
  render () {
    return this.props.id == '_'
      ? <View style={[styles.gradientBlock, boxShadows.boxShadow4]}>
          <LinearGradient
            colors={['#79e098', '#43ba67']}
            style={[styles.gradientBlockChild]}
          >
            <View style={[styles.blockBody, {flexDirection: 'column'}]}>
              <View>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <Text style={styles.eventTopRow}>
                    {this.props.assignmentTitle}
                  </Text>
                </ScrollView>
              </View>
              <View style={styles.eventBottomRow}>
                <Text style={styles.eventBottomRowText}>
                  {this.props.topic}
                </Text>
                <Text style={styles.eventBottomRowText}>
                  {this.props.dueDate}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      : <Touchable
          style={[styles.gradientBlock, boxShadows.boxShadow4]}
          onPress={() =>
            this.props.navigateToPage (
              'CourseInfo',
              this.props.referenceCourse
            )}
        >
          <LinearGradient
            colors={['#79e098', '#43ba67']}
            style={[styles.gradientBlockChild]}
          >
            <View style={[styles.blockBody, {flexDirection: 'column'}]}>
              <View>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <Text style={styles.eventTopRow}>
                    {this.props.assignmentTitle}
                  </Text>
                </ScrollView>
              </View>
              <View style={styles.eventBottomRow}>
                <Text style={styles.eventBottomRowText}>
                  {this.props.topic}
                </Text>
                <Text style={styles.eventBottomRowText}>
                  {this.props.dueDate}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Touchable>;
  }
}

export default class HomeScreenTile extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };
  constructor (props) {
    super (props);
    this.props = props;
    this.state = {
      refreshing: false,
    };
  }

  _onRefresh = () => {
    this.setState ({refreshing: true});
    // this.props.navigation.replace("Home");
    setTimeout (() => {
      this.props.parent.setState (
        {currentDate: new Date ()},
        () => {
          this.setState ({refreshing: false});
        }
      );
    }, 400);
  };

  _navigateToPage = async (page, id) => {
    global.courseInfoCourse = await Courses._retrieveCourseById (id);
    if (global.courseInfoCourse.id != '_') {
      this.props.parent.props.navigation.navigate (page);
    }
  };

  render () {
    return (
      <ScrollView
        style={[
          styles.scrollBack,
          {backgroundColor: global.user.getPrimaryTheme ()},
        ]}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
      >
        <View style={styles.backdrop}>
          <View style={[styles.titleBlock, global.user.borderColor ()]}>
            <Text
              style={[styles.h1, {color: global.user.getPrimaryTextColor ()}]}
            >
              {this.props.dayTitle}
            </Text>
          </View>
          <GradientBlock {...this.props.current} />
          <GradientBlock {...this.props.next} />
          <View style={[styles.titleBlock, global.user.borderColor ()]}>
            <Text
              style={[styles.h1, {color: global.user.getPrimaryTextColor ()}]}
            >
              Events
            </Text>
          </View>
          {this.props.events.map ((y, i) => {
            return <EventBlock key={`event_${i}`} {...y} />;
          })}
          <View style={[styles.titleBlock, global.user.borderColor ()]}>
            <Text
              style={[styles.h1, {color: global.user.getPrimaryTextColor ()}]}
            >
              Assignments
            </Text>
          </View>
          {this.props.assignments.map ((y, i) => {
            return (
              <AssignmentBlock
                navigateToPage={this._navigateToPage}
                key={`event_${i}`}
                {...y}
              />
            );
          })}
          <View style={{width, height: 20}} />
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create ({
  scrollBack: {
    width: width,
    backgroundColor: '#f0f0f0',
  },
  backdrop: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titleBlock: {
    width: width,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingTop: 20,
    paddingLeft: 10,
    paddingBottom: 0,
    paddingRight: 10,
  },
  h1: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  gradientBlock: {
    width: width * 0.95,
    marginTop: 10,
  },
  gradientBlockChild: {
    width: width * 0.95,
    paddingTop: 5,
    paddingRight: 15,
    paddingBottom: 10,
    paddingLeft: 15,
    borderRadius: 5,
  },
  blockBody: {
    flexDirection: 'row',
  },
  blockHeader: {
    flexGrow: 1,
  },
  blockHeaderText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 5,
  },
  blockMain: {
    fontSize: 35,
    fontWeight: '200',
    color: '#ffffff',
    textAlign: 'right',
    overflow: 'hidden',
  },
  blockSecondary: {
    fontSize: 14,
    fontWeight: '300',
    opacity: 0.7,
    color: '#ffffff',
    textAlign: 'right',
  },
  eventBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventBottomRowText: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.7,
  },
  eventTopRow: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 5,
    paddingBottom: 10,
  },
});
