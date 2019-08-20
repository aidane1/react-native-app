import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  WebView,
  Alert,
  Text,
  Keyboard,
  Easing,
  RefreshControl,
} from 'react-native';

import HeaderBar from '../../components/header';

import {ScrollView, TextInput, FlatList} from 'react-native-gesture-handler';

import {
  LeftIcon,
  EmptyIcon,
  UpIcon,
  DownIcon,
  ClockIcon,
  EllipsisIcon,
  LightBulbIcon,
  SchoolIcons,
} from '../../classes/icons';

import Touchable from '../../components/react-native-platform-touchable';

import ApexAPI from '../../http/api';

import {ifIphoneX} from 'react-native-iphone-x-helper';

import Collapsible from 'react-native-collapsible';

import {boxShadows} from '../../constants/boxShadows';

import moment from 'moment';

import * as Haptics from 'expo-haptics';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

let deltaToText = delta => {
  return (
    <Text style={{}}>
      {delta.map ((insert, index) => {
        return (
          <Text style={{color: global.user.getSecondaryTextColor ()}}>
            {insert.insert}
          </Text>
        );
      })}
    </Text>
  );
};

class AnnouncmentTile extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      collapsed: true,
    };
  }
  switchState = () => {
    this.setState (state => ({
      collapsed: !state.collapsed,
    }));
  };
  render () {
    return (
      <Touchable onPress={this.switchState}>
        <View
          style={{
            paddingTop: 15,
            paddingBottom: 15,
            borderColor: global.user.getBorderColor (),
            borderBottomWidth: StyleSheet.hairlineWidth,
            backgroundColor: global.user.getSecondaryTheme (),
            // backgroundColor: global.user.theme == 'Light'
            //   ? '#ffffff'
            //   : 'rgba(40,40,40,0.5)',
          }}
        >

          <View
            style={{
              padding: 5,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 28,
                color: global.user.getPrimaryTextColor (),
              }}
            >
              {this.props.tile.title}
            </Text>
            {this.state.collapsed
              ? <DownIcon
                  size={28}
                  color={global.user.getPrimaryTextColor ()}
                />
              : <UpIcon size={28} color={global.user.getPrimaryTextColor ()} />}
          </View>
          <Collapsible collapsed={this.state.collapsed}>
            {this.props.tile.announcements.map ((announcement, index) => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    padding: 20,
                  }}
                >
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      marginTop: 4,
                      marginRight: 5,
                      backgroundColor: global.user.getPrimaryTextColor (),
                    }}
                  />
                  {deltaToText (announcement.delta)}
                </View>
              );
            })}
          </Collapsible>
        </View>
      </Touchable>
    );
  }
}

export default class AnnouncementScreen extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      announcement: this.props.navigation.getParam ('announcement'),
    };
    console.log (this.state.announcement);
    this._isMounted = false;
  }
  componentDidMount () {
    this._isMounted = true;
  }
  componentWillUnmount () {
    this._isMounted = false;
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
          iconRight={<EmptyIcon size={28} />}
          width={width}
          height={60}
          title="Announcement"
        />
        <ScrollView style={styles.bodyHolder} bounces={false} >
          <View style={[styles.titleBlock, global.user.borderColor ()]}>
            <Text
              style={[styles.h1, {color: global.user.getPrimaryTextColor ()}]}
            >
              {moment (this.state.announcement.date_announced).format (
                'MMMM Do, YYYY'
              )}
            </Text>
          </View>
          {global.user.pdf_announcements
            ? <WebView
                style={{
                  width,
                  height: height-ifIphoneX(170, 150)
                  // flexGrow: 1, 
                }}
                source={{
                  uri: `https://www.apexschools.co${this.state.announcement.file_path}.pdf`,
                  headers: {
                    'x-api-key': global.user['x-api-key'],
                    'x-id-key': global.user['x-id-key'],
                    school: global.school['id'],
                  },
                }}
              />
            : <View
                style={[
                  {
                    // width: width * 0.97,
                    width,
                    paddingTop: 40,
                    paddingBottom: 40,
                    borderRadius: 8,
                    alignSelf: 'center',
                    marginTop: 40,
                    // backgroundColor: global.user.theme == "Light" ? "#ebebeb" : "#313131",
                    backgroundColor: global.user.getSecondaryTheme (),
                  },
                  boxShadows.boxShadow5,
                ]}
              >
                <FlatList
                  data={this.state.announcement.tiles}
                  keyExtractor={(item, index) => item._id}
                  renderItem={({item, index}) => (
                    <AnnouncmentTile tile={item} />
                  )}
                  style={{
                    borderTopColor: global.user.getBorderColor (),
                    borderTopWidth: StyleSheet.hairlineWidth,
                  }}
                />
              </View>}

          <View style={{width, height: 20}} />
        </ScrollView>
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
    flexDirection: 'column',
  },
  announcement: {
    width,
    height: 50,
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
});
