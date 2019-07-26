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
                    {section.body.map ((item, index) => {
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
                  body: ['Yeet'],
                },
                {
                  title: 'Courses',
                  body: ['Yeet'],
                },
                {
                  title: 'Schedule',
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
              header="Settings"
              sections={[
                {
                  title: 'Home',
                  body: ['Yeet'],
                },
                {
                  title: 'Courses',
                  body: ['Yeet'],
                },
                {
                  title: 'Schedule',
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
              header="Static Information"
              sections={[
                {
                  title: 'Home',
                  body: ['Yeet'],
                },
                {
                  title: 'Courses',
                  body: ['Yeet'],
                },
                {
                  title: 'Schedule',
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
              header="Class Connection"
              sections={[
                {
                  title: 'School Forum',
                  body: ['Yeet'],
                },
                {
                  title: 'Assignments',
                  body: ['Yeet'],
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
