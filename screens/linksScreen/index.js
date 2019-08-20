import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  Image,
  Text,
  Linking,
  Easing,
  RefreshControl,
} from 'react-native';

import HeaderBar from '../../components/header';

import LinkPreview from 'react-native-link-preview';

import {ScrollView, TextInput, FlatList} from 'react-native-gesture-handler';

import {boxShadows} from '../../constants/boxShadows';

import {
  LeftIcon,
  EmptyIcon,
  RightIcon,
  MessageIcon,
  LinkIcon,
  EllipsisIcon,
  LightBulbIcon,
  SchoolIcons,
} from '../../classes/icons';

import Touchable from '../../components/react-native-platform-touchable';

import ApexAPI from '../../http/api';

import {ifIphoneX} from 'react-native-iphone-x-helper';

import querystring from 'querystring';

import url from 'url';

import moment from 'moment';

import * as Haptics from 'expo-haptics';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

// let gradients =

class LinkBlock extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      title: '',
      favicon: '',
      images: [],
      url: '',
      loading: true,
    };
  }
  getData = async () => {
    try {
      let data = await LinkPreview.getPreview (this.props.link);
      let info = {url: this.props.link, loading: false};
      if (data.favicons.length) {
        let favicon = data.favicons[0];
        let width = 0;
        if (url.parse (data.favicons[0], true).query.w) {
          width = parseInt (url.parse (data.favicons[0], true).query.w);
        }
        data.favicons.forEach (thisFavicon => {
          let query = url.parse (thisFavicon, true);
          if (query.query.w && parseInt (query.query.w) > width) {
            width = parseInt (query.query.w);
            favicon = thisFavicon;
          }
        });
        info['favicon'] = favicon;
      }
      if (data.title) {
        info['title'] = data.title;
      }
      if (data.images) {
        info['images'] = data.images;
      }
      this.setState (info);
      console.log (info);
    } catch (e) {
      console.log (e);
    }
  };
  componentDidMount () {
    this.getData ();
  }
  openURL = url => {
    Linking.canOpenURL (url).then (supported => {
      console.log (supported);
      if (supported) {
        Linking.openURL (url);
      } else {
        console.log ('dont know');
      }
    });
  };
  render () {
    let {loading, url, favicon, images, title} = this.state;
    console.log (images);
    return (
      <Touchable onPress={() => this.openURL (this.props.link)}>
        <View
          style={[
            {
              width: width * 0.4,
              height: width * 0.4,
              backgroundColor: global.user.getSecondaryTheme (),
              margin: 20,
              //   padding: 10,
            },
            boxShadows.boxShadow7,
          ]}
        >
          {loading
            ? <View><Text>Loading</Text></View>
            : <View
                style={{
                  width: width * 0.4,
                  height: width * 0.4,
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Image
                  resizeMethod={'resize'}
                  resizeMode={'contain'}
                  source={{uri: favicon}}
                  style={{width: width * 0.2, flexGrow: 0.8}}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    paddingLeft: 15,
                    paddingRight: 15,
                    paddingTop: 5,
                    fontSize: 12,
                    color: global.user.getSecondaryTextColor (),
                  }}
                >
                  {title.trim ()}
                </Text>
              </View>}
        </View>
      </Touchable>
    );
  }
}

class EmptyLinkBlock extends React.Component {
  constructor (props) {
    super (props);
  }
  render () {
    return (
      <View
        style={{
          width: width * 0.4,
          height: width * 0.4,
          backgroundColor: 'white',
          margin: 20,
        }}
      >
        <Text>No Links</Text>
      </View>
    );
  }
}

export default class LinksScreen extends React.Component {
  constructor (props) {
    super (props);
    this.props = props;
    this.state = {
      links: [],
      limit: 365,
    };
    this._isMounted = false;
  }
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };
  loadLinks = (limit = 365, callback) => {
    let api = new ApexAPI (global.user);
    api
      .get (`links`)
      .then (data => data.json ())
      .then (data => {
        if (data.status == 'ok' && this._isMounted) {
          callback (null, data.body);
        } else if (this._isMounted) {
          callback (data.body, []);
        }
      })
      .catch (e => {
        console.log (e);
        callback (e, []);
      });
  };
  componentWillUnmount () {
    this._isMounted = false;
  }
  componentDidMount () {
    this._isMounted = true;
    this.loadLinks (this.state.limit, (err, links) => {
      this._isMounted && this.setState ({links});
    });
  }
  _onRefresh = () => {
    this.setState ({refreshing: true}, () => {
      this.loadLinks (this.state.limit, (err, body) => {
        if (err) {
          this.setState ({refreshing: false, links: []});
        } else {
          this.refreshingScrollView = true;
          this.setState ({refreshing: false, links: body});
        }
      });
    });
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
          title="Links"
        />
        <View style={[styles.bodyHolder, global.user.primaryTheme ()]}>
          <ScrollView
            contentContainerStyle={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-evenly',
            }}
          >
            {this.state.links.length
              ? this.state.links.map ((link, index) => {
                  return <LinkBlock {...link} key={link._id} />;
                })
              : <EmptyLinkBlock />}
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
