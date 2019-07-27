import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  Image,
  Text,
} from 'react-native';

import {LeftIcon, EmptyIcon, UpIcon, DownIcon} from '../../classes/icons';

import Touchable from 'react-native-platform-touchable';

import HeaderBar from '../../components/header';

import {ifIphoneX} from 'react-native-iphone-x-helper';
import {ScrollView} from 'react-native-gesture-handler';

import Collapsible from 'react-native-collapsible';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

class TutorialSection extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      collapsed: true,
    };
  }
  render () {
    return (
      <View style={{backgroundColor: global.user.getSecondaryTheme ()}}>
        <Touchable
          onPress={() => this.setState ({collapsed: !this.state.collapsed})}
          style={{
            borderBottomColor: global.user.getBorderColor (),
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        >
          <View style={[styles.titleBlock, global.user.borderColor ()]}>
            <Text
              style={[
                styles.h1,
                {
                  fontFamily: 'montserrat-400',
                  color: global.user.getPrimaryTextColor (),
                },
              ]}
            >
              {this.props.header}
            </Text>
            {this.state.collapsed
              ? <DownIcon
                  size={28}
                  color={global.user.getPrimaryTextColor ()}
                />
              : <UpIcon size={28} color={global.user.getPrimaryTextColor ()} />}
          </View>
        </Touchable>
        <Collapsible collapsed={this.state.collapsed}>
          <View
            style={{
              paddingLeft: 20,
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: global.user.getBorderColor (),
            }}
          >
            {this.props.sections.map ((section, index) => {
              return (
                <View style={{paddingTop: 20}}>
                  <Text
                    style={{
                      fontFamily: 'montserrat-500',
                      color: global.user.getSecondaryTextColor (),
                      fontSize: 28,
                    }}
                  >
                    {section.title}
                  </Text>
                  <View
                    style={{paddingLeft: 10, paddingTop: 5, paddingBottom: 20}}
                  >
                    {section.body[0] && section.body[0].title == undefined
                      ? section.body.map ((item, index) => {
                          return (
                            <View
                              style={{
                                marginTop: 20,
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                              }}
                            >
                              <View
                                style={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: 5,
                                  backgroundColor: global.user.getPrimaryTextColor (),
                                  marginTop: 5,
                                  marginRight: 10,
                                }}
                              />
                              <View style={{marginRight: 30, flexGrow: 1}}>
                                <Text
                                  style={{
                                    fontSize: 16,
                                    fontFamily: 'montserrat-300',
                                    color: global.user.getSecondaryTextColor (),
                                  }}
                                >
                                  {item}
                                </Text>
                              </View>
                            </View>
                          );
                        })
                      : section.body.map ((item, index) => {
                          return (
                            <View style={{paddingLeft: 10, paddingTop: 20}}>
                              <View>
                                <Text
                                  style={{
                                    fontSize: '24',
                                    fontFamily: 'montserrat-400',
                                    color: global.user.getSecondaryTextColor (),
                                  }}
                                >
                                  {item.title}
                                </Text>
                                <View style={{paddingLeft: 20}}>
                                  {item.body.map ((item, index) => {
                                    return (
                                      <View
                                        style={{
                                          marginTop: 20,
                                          flexDirection: 'row',
                                          alignItems: 'flex-start',
                                        }}
                                      >
                                        <View
                                          style={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: 5,
                                            backgroundColor: global.user.getPrimaryTextColor (),
                                            marginTop: 5,
                                            marginRight: 10,
                                          }}
                                        />
                                        <View
                                          style={{marginRight: 30, flexGrow: 1}}
                                        >
                                          <Text
                                            style={{
                                              fontSize: 16,
                                              fontFamily: 'montserrat-300',
                                              color: global.user.getSecondaryTextColor (),
                                            }}
                                          >
                                            {item}
                                          </Text>
                                        </View>
                                      </View>
                                    );
                                  })}
                                </View>
                              </View>
                            </View>
                          );
                        })}
                  </View>
                </View>
              );
            })}
          </View>
        </Collapsible>

      </View>
    );
  }
}

export default class TutorialScreen extends React.Component {
  constructor (props) {
    super (props);
  }
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };
  render () {
    return (
      <View style={[styles.container, global.user.primaryTheme ()]}>
        <HeaderBar
          iconLeft={
            <Touchable onPress={() => this.props.navigation.goBack ()}>
              <LeftIcon size={28} />
            </Touchable>
          }
          iconRight={<EmptyIcon width={28} height={32} />}
          width={width}
          height={60}
          title="Tutorial"
        />
        <View style={styles.bodyHolder}>
          <ScrollView>
            <TutorialSection
              header="Home Screen"
              sections={[
                {
                  title: 'Home',
                  // body: ['Yeet'],
                  body: [
                    {
                      title: 'Current Class',
                      body: [
                        'Indicates what class is being currently attended. Tap to navigate to that course.',
                      ],
                    },
                    {
                      title: 'Next Class',
                      body: [
                        'Indicated the next class to be attended. Tap to navigate to that course.',
                      ],
                    },
                    {
                      title: 'Events',
                      body: [
                        'Displays any event upcoming within the next 2 days. Tap to navigate to that calendar day.',
                      ],
                    },
                    {
                      title: 'Recent Assignments',
                      body: [
                        'Displays the most recently created assignment from each class that semester. Tap to navigate to that assignment',
                      ],
                    },
                  ],
                },
                {
                  title: 'Courses',
                  body: [
                    {
                      title: 'Course List',
                      body: [
                        'Displays all courses to be attended, in order, on a particular day',
                        'Tap on the forward arrow to jump one day in to the future',
                        "Tap on the date or 'Today' to manually specify a date",
                      ],
                    },
                  ],
                },
                {
                  title: 'Schedule',
                  body: [
                    {
                      title: 'Schedule List',
                      body: ['A full view of your entire schedule'],
                    },
                    {
                      title: 'Image/Schedule Picker',
                      body: [
                        'Specify whether you would prefer a computer generated schedule, or an image of your schedule',
                      ],
                    },
                  ],
                },
              ]}
            />
            <TutorialSection
              header="Settings"
              sections={[
                {
                  title: 'Push Notifications',
                  body: [
                    {
                      title: 'Daily Announcements',
                      body: [
                        'The daily announcements sent out by the school each day',
                        'Click to opt out of recieving notifications for this',
                      ],
                    },
                    {
                      title: 'Next Class',
                      body: [
                        'An alert to be sent 10 minutes before class change, to alert you of your next class',
                        'Click to opt out of recieving notifications for this',
                      ],
                    },
                    {
                      title: 'New Assignments',
                      body: [
                        'An alert to be sent out whenever a new assignment is created in a class you attend',
                        'Click to opt out of recieving notifications for this',
                      ],
                    },
                    {
                      title: 'Image Replies',
                      body: [
                        'An alert to be sent out whenever someone responds to an assignment you created with an image',
                        'Click to opt out of recieving notifications for this',
                      ],
                    },
                    {
                      title: 'Upcoming Events',
                      body: [
                        'An alert sent out the night before any event',
                        'Click to opt out of recieving notifications for this',
                      ],
                    },
                  ],
                },
                {
                  title: 'Theme',
                  body: [
                    'The main appearance of the app. Pure black mode uses pure black as the primary theme.',
                  ],
                },
                {
                  title: 'Miscellaneous',
                  body: [
                    {
                      title: 'Visually Impared',
                      body: [
                        'Enable to turn on visually impared mode, which reads the home page out in response to touch',
                      ],
                    },
                    {
                      title: 'Grade Only Announcements',
                      body: [
                        'Specify whether to recieve all announcements, or just ones that have been selected for your grade',
                      ],
                    },
                    {
                      title: 'Automatic Mark Retrieval',
                      body: [
                        'Enable to automatically retrieve school marks from server',
                      ],
                    },
                    {
                      title: 'Automatic Course Updating',
                      body: [
                        'Enable to automatically update your enrolled courses',
                      ],
                    },
                  ],
                },
              ]}
            />
            <TutorialSection
              header="Static Information"
              sections={[
                {
                  title: 'Courses',
                  body: [
                    "Manually select what courses you're attending",
                    'Change semesters using the bottom tab bar',
                  ],
                },
                {
                  title: 'Calendar',
                  body: [
                    'View the entire school year sequentially in a calendar format',
                    'Click on any day of the year to see what courses you have on that day and what events there are',
                  ],
                },
                {
                  title: 'Events',
                  body: [
                    "View the entire year's events in order grouped by month",
                  ],
                },
              ]}
            />
            <TutorialSection
              header="Class Connection"
              sections={[
                {
                  title: 'Voting',
                  body: [
                    {
                      title: 'Helpfulness',
                      body: [
                        'The helpfulness score of an assignment, note, important date, question, or comment is a measure of what percent of students found it helpful in some way.',
                        'A red helpfulness indicates that you have voted the resource as unhelpful',
                        'A green helpfulness indicates that you have voted the resource as helpful',
                      ],
                    },
                    {
                      title: 'Casting your Vote',
                      body: [
                        'To cast your vote on any resource, click the 3 horizontal or vertical dots on the right side of it',
                      ],
                    },
                    {
                      title: 'Reporting',
                      body: [
                        'If you believe a resource to be offensive, you can report it from the 3 dot menu. 3 reports will delete a resource',
                      ],
                    },
                  ],
                },
                {
                  title: 'School Forum',
                  body: [
                    {
                      title: 'Opening',
                      body: [
                        'To open a question, swipe from right to left on the post',
                      ],
                    },
                    {
                      title: 'Creating',
                      body: [
                        'To create a question, tap on the word new in the top right corner',
                      ],
                    },
                    {
                      title: 'Tags',
                      body: [
                        'Tags are used to specify a subject field for a post. A list of all your classes are presented as default tag options, but custom tags are possible too.',
                      ],
                    },
                  ],
                },
                {
                  title: 'Assignments',
                  body: [
                    {
                      title: 'Opening',
                      body: [
                        'To open an assignment for a more in depth list of information, you can either click on it or open it from the 3 dot menu',
                      ],
                    },
                    {
                      title: 'Creating',
                      body: [
                        'To create a new assignment, click the create button in the top left corner. All assignments are publically viewable by everyone',
                      ],
                    },
                    {
                      title: 'Marking as Completed',
                      body: [
                        'You can keep track of what assignments you have completed by clicking on the open circle next to the assignment',
                      ],
                    },
                  ],
                },
                {
                  title: 'Notes',
                  body: ['Yeet'],
                },
                {
                  title: 'Important Dates',
                  body: ['Yeet'],
                },
                {
                  title: 'Secondary Info',
                  body: [
                    'Fuck',
                    'Shit',
                    'Bitch',
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque convallis vulputate tellus eget vestibulum. Duis lobortis augue et dolor luctus, a ornare turpis malesuada. Vivamus at neque aliquam, eleifend leo facilisis, commodo nisi. Proin porta libero quis risus eleifend faucibus.',
                  ],
                },
              ]}
            />
            <TutorialSection
              header="School Connection"
              sections={[
                {
                  title: 'Announcements',
                  body: ['Yeet'],
                },
                {
                  title: 'Notifications',
                  body: ['Yeet'],
                },
                {
                  title: 'School Assignments',
                  body: ['Yeet'],
                },
              ]}
            />
            <TutorialSection
              header="Private"
              sections={[
                {
                  title: 'Activities',
                  body: ['Yeet'],
                },
              ]}
            />
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
    height: ifIphoneX (height - 80, height - 60),
  },
  titleBlock: {
    width: width,
    paddingTop: 20,
    paddingLeft: 10,
    paddingBottom: 20,
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  h1: {
    fontSize: 34,
    fontWeight: 'bold',
  },
});
