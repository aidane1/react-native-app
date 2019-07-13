import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';

import HeaderBar from '../../components/header';

import {
  LeftIcon,
  CalendarIcon,
  RightIcon,
  EmptyIcon,
  CourseIcon,
  EventsIcon,
  LogoutIcon,
  NotesIcon,
  AssignmentsIcon,
  SchoolAssignmentsIcon,
  BeforeSchoolIcon,
  LunchTimeIcon,
  AfterSchoolIcon,
} from '../../classes/icons';

import {ScrollView} from 'react-native-gesture-handler';

import {boxShadows} from '../../constants/boxShadows';

import Touchable from 'react-native-platform-touchable';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

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

class DayList extends React.Component {
  render () {
    let list = this.props.courses || [];
    let rowLists = [];
    for (var i = 0; i < list.length; i++) {
      rowLists.push (
        <CourseRow
          _navigateToPage={this.props._navigateToPage}
          last={i == list.length - 1}
          key={'courseRow_' + i.toString ()}
          {...list[i]}
        />
      );
    }
    return (
      <View style={styles.dayList}>
        {rowLists}
      </View>
    );
  }
}

class CourseRow extends React.Component {
  render () {
    let icon = SchoolIcons.getIcon (this.props.category);
    if (this.props.last) {
      return (
        <Touchable
          onPress={() =>
            this.props.id != '_'
              ? this.props._navigateToPage ('CourseInfo', this.props.id)
              : () => {}}
        >
          <View style={[styles.courseRow]}>
            <CourseIcon color={icon[1]}>
              <GenericIcon icon={icon[0]} color="black" size={20} />
            </CourseIcon>
            <View
              style={[
                styles.courseRowInfo,
                {borderBottomColor: 'rgba(0,0,0,0)'},
              ]}
            >
              <View style={styles.courseRowStack}>
                <View>
                  <Text style={styles.courseRowCourse}>
                    {this.props.course}
                  </Text>
                </View>
                <View>
                  <Text style={styles.courseRowTeacher}>
                    {this.props.teacher}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.courseRowTime}>
                  {this.props.time}
                </Text>
                {this.props.id != '_'
                  ? <RightIcon
                      style={{marginTop: 3}}
                      size={30}
                      color="orange"
                    />
                  : <View style={{marginRight: 30}} />}
              </View>
            </View>
          </View>
        </Touchable>
      );
    } else {
      return (
        <Touchable
          onPress={() =>
            this.props.id != '_'
              ? this.props._navigateToPage ('CourseInfo', this.props.id)
              : () => {}}
        >
          <View style={[styles.courseRow]}>
            <CourseIcon color={icon[1]}>
              <GenericIcon icon={icon[0]} color="black" size={20} />
            </CourseIcon>
            <View style={[styles.courseRowInfo]}>
              <View style={styles.courseRowStack}>
                <View>
                  <Text style={styles.courseRowCourse}>
                    {this.props.course}
                  </Text>
                </View>
                <View>
                  <Text style={styles.courseRowTeacher}>
                    {this.props.teacher}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.courseRowTime}>
                  {this.props.time}
                </Text>
                {this.props.id != '_'
                  ? <RightIcon
                      style={{marginTop: 3}}
                      size={30}
                      color="orange"
                    />
                  : <View style={{marginRight: 30}} />}
              </View>
            </View>
          </View>
        </Touchable>
      );
    }
  }
}

export default class NotesScreen extends React.Component {
  constructor (props) {
    super (props);
    this.props = props;
  }
  _navigateToPage = page => {
    this.props.navigation.navigate (page);
  };
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
          iconRight={<EmptyIcon width={28} height={32} />}
          width={width}
          height={60}
          title="Notes"
        />
        <View style={styles.bodyHolder}>
          <ScrollView>
            <ButtonSection>
              <CourseRow
                color={'#ef8b8b'}
                icon={<CourseIcon size={20} color={'black'} />}
                text={'Courses'}
                last={false}
                onPress={() => this._navigateToPage ('Courses')}
              />
              <CourseRow
                color={'#f2cc98'}
                icon={<EventsIcon size={20} color={'black'} />}
                text={'Events'}
                last={false}
                onPress={() => this._navigateToPage ('Events')}
              />
              <CourseRow
                color={'#ffffad'}
                icon={<LogoutIcon size={20} color={'black'} />}
                text={'Login'}
                last={true}
                onPress={() => this._navigateToPage ('Login')}
              />
            </ButtonSection>
            <ButtonSection>
              <CourseRow
                color={'#fffec9'}
                icon={<CalendarIcon size={20} color={'black'} />}
                text={'Calendar'}
                last={false}
                onPress={() => this._navigateToPage ('Calendar')}
              />
              <CourseRow
                color={'#afffad'}
                icon={<NotesIcon size={20} color={'black'} />}
                text={'Notes'}
                last={false}
              />
              <CourseRow
                color={'#b1f9ed'}
                icon={<AssignmentsIcon size={20} color={'black'} />}
                text={'Assignments'}
                last={true}
              />
            </ButtonSection>
            <ButtonSection>
              <CourseRow
                color={'#b1d7f9'}
                icon={<SchoolAssignmentsIcon size={20} color={'black'} />}
                text={'School Assignments'}
                last={true}
              />
            </ButtonSection>
            <ButtonSection>
              <CourseRow
                color={'#b2b1f9'}
                icon={<BeforeSchoolIcon size={20} color={'black'} />}
                text={'Before School Activities'}
                last={false}
              />
              <CourseRow
                color={'#d7b1f9'}
                icon={<LunchTimeIcon size={20} color={'black'} />}
                text={'Lunchtime Activities'}
                last={false}
              />
              <CourseRow
                color={'#f6b1f9'}
                icon={<AfterSchoolIcon size={20} color={'black'} />}
                text={'After School Activities'}
                last={true}
              />
            </ButtonSection>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create ({
  container: {
    width,
    flexGrow: 1,
    backgroundColor: '#f0f0f0',
  },
  bodyHolder: {
    zIndex: 1,
    flexGrow: 1,
  },
  courseRow: {
    alignItems: 'center',
    flexDirection: 'row',
    width: width,
    height: 50.0,
    backgroundColor: 'white',
  },
  courseRowInfo: {
    height: 50.0,
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: 'rgb(210,210,210)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingRight: 10,
  },
  icon: {
    width: 35,
    height: 35,
    margin: 7.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingTop: 3,
    paddingLeft: 2,
  },
  courseRowText: {
    fontSize: 20,
    color: '#444',
    fontWeight: '300',
  },
  buttonSection: {
    marginTop: 20,
    borderColor: 'rgb(210,210,210)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  clickIcon: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 5,
  },
});
