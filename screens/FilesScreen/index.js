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

import * as icons from './files.json';

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

let fileIcons = {
  '': require ('../../assets/svg/unknown.png'),
  unknown: require ('../../assets/svg/unknown.png'),
  audio: require ('../../assets/svg/audio.png'),
  video: require ('../../assets/svg/video.png'),
  text: require ('../../assets/svg/text.png'),
  archive: require ('../../assets/svg/archive.png'),
  '.jpg': require ('../../assets/svg/jpg.png'),
  '.jpe': require ('../../assets/svg/jpg.png'),
  '.jpeg': require ('../../assets/svg/jpg.png'),
  '.jfif': require ('../../assets/svg/jpg.png'),
  '.png': require ('../../assets/svg/png.png'),
  '.gif': require ('../../assets/svg/gif.png'),
  '.tiff': require ('../../assets/svg/tiff.png'),
  '.svg': require ('../../assets/svg/svg.png'),
  '.psd': require ('../../assets/svg/psd.png'),
  '.ai': require ('../../assets/svg/ai.png'),
  '.dwg': require ('../../assets/svg/dwg.png'),
  '.iso': require ('../../assets/svg/iso.png'),
  '.mdf': require ('../../assets/svg/mdf.png'),
  '.nrg': require ('../../assets/svg/nrg.png'),
  '.zip': require ('../../assets/svg/zip.png'),
  '.7z': require ('../../assets/svg/7z.png'),
  '.7zip': require ('../../assets/svg/7z.png'),
  '.arj': require ('../../assets/svg/arj.png'),
  '.rar': require ('../../assets/svg/rar.png'),
  '.gz': require ('../../assets/svg/archive.png'),
  '.gzip': require ('../../assets/svg/archive.png'),
  '.bz2': require ('../../assets/svg/archive.png'),
  '.bzip2': require ('../../assets/svg/archive.png'),
  '.tar': require ('../../assets/svg/archive.png'),
  '.xls': require ('../../assets/svg/xls.png'),
  '.doc': require ('../../assets/svg/doc.png'),
  '.docx': require ('../../assets/svg/doc.png'),
  '.pdf': require ('../../assets/svg/pdf.png'),
  '.ppt': require ('../../assets/svg/ppt.png'),
  '.rtf': require ('../../assets/svg/rtf.png'),
  '.txt': require ('../../assets/svg/txt.png'),
  '.md': require ('../../assets/svg/text.png'),
  '.markdown': require ('../../assets/svg/text.png'),
  '.avi': require ('../../assets/svg/avi.png'),
  '.mp2': require ('../../assets/svg/mp2.png'),
  '.mp3': require ('../../assets/svg/mp3.png'),
  '.mp4': require ('../../assets/svg/mp4.png'),
  '.fla': require ('../../assets/svg/fla.png'),
  '.mxf': require ('../../assets/svg/mxf.png'),
  '.wav': require ('../../assets/svg/wav.png'),
  '.wma': require ('../../assets/svg/wma.png'),
  '.aac': require ('../../assets/svg/aac.png'),
  '.flac': require ('../../assets/svg/flac.png'),
  '.css': require ('../../assets/svg/css.png'),
  '.csv': require ('../../assets/svg/csv.png'),
  '.html': require ('../../assets/svg/html.png'),
  '.json': require ('../../assets/svg/json.png'),
  '.js': require ('../../assets/svg/js.png'),
  '.xml': require ('../../assets/svg/xml.png'),
  '.dbf': require ('../../assets/svg/dbf.png'),
  '.exe': require ('../../assets/svg/exe.png'),
};

// let gradients =

class FileBlock extends React.Component {
  constructor (props) {
    super (props);
  }
  openURL = url => {
    url = `https://www.apexschools.co${url}`;
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
    let extension = this.props.resource.name.split ('.');
    extension = `.${extension[extension.length - 1]}`;
    fileImport = fileIcons[extension] || fileIcons['unknown'];
    return (
      <Touchable onPress={() => this.openURL (this.props.resource.path)}>
        <View
          style={[
            {
              width: width * 0.9,
              height: 60,
              padding: 10,
              backgroundColor: global.user.getSecondaryTheme (),
              margin: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              //   padding: 10,
            },
            boxShadows.boxShadow7,
          ]}
        >
          <View style={{flexDirection: 'row'}}>
            <Image
              source={fileImport}
              style={{width: 40, height: 40, marginRight: 10}}
            />
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}
            >

              <Text
                style={{
                  color: global.user.getPrimaryTextColor (),
                  fontWeight: '600',
                  fontSize: 16,
                }}
              >
                {this.props.name}
              </Text>
              <Text
                style={{
                  color: global.user.getTertiaryTextColor (),
                  fontSize: 12,
                }}
              >
                {this.props.resource.name}
              </Text>
            </View>
          </View>
          <View>
            <Text
              style={{
                color: global.user.getSecondaryTextColor (),
                fontSize: 14,
              }}
            >
              {this.props.key_description}
            </Text>

          </View>
        </View>
      </Touchable>
    );
  }
}

class EmptyFileBlock extends React.Component {
  constructor (props) {
    super (props);
  }
  render () {
    return (
      <View
        style={[
          {
            width: width * 0.9,
            height: 60,
            padding: 10,
            backgroundColor: global.user.getSecondaryTheme (),
            margin: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            //   padding: 10,
          },
          boxShadows.boxShadow7,
        ]}
      >
        <View style={{flexDirection: 'row'}}>
          <Image
            source={fileIcons['unknown']}
            style={{width: 40, height: 40, marginRight: 10}}
          />
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}
          >

            <Text
              style={{
                color: global.user.getPrimaryTextColor (),
                fontWeight: '600',
                fontSize: 16,
              }}
            >
              No Files!
            </Text>
            <Text
              style={{
                color: global.user.getTertiaryTextColor (),
                fontSize: 12,
              }}
            >
              Empty
            </Text>
          </View>
        </View>
        <View>
          <Text
            style={{
              color: global.user.getSecondaryTextColor (),
              fontSize: 14,
            }}
          >
            School
          </Text>

        </View>
      </View>
    );
  }
}

export default class LinksScreen extends React.Component {
  constructor (props) {
    super (props);
    this.props = props;
    this.state = {
      files: [],
      limit: 365,
      refreshing: false,
    };
    this._isMounted = false;
  }
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    };
  };
  loadFiles = (limit = 365, callback) => {
    let api = new ApexAPI (global.user);
    api
      .get (`student-files?populate=resource`)
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
    this.loadFiles (this.state.limit, (err, files) => {
      this._isMounted && this.setState ({files});
    });
  }
  _onRefresh = () => {
    this.setState ({refreshing: true}, () => {
      this.loadFiles (this.state.limit, (err, body) => {
        if (err) {
          this.setState ({refreshing: false, files: []});
        } else {
          this.refreshingScrollView = true;
          this.setState ({refreshing: false, files: body});
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
          title="Files"
        />
        <View style={[styles.bodyHolder, global.user.primaryTheme ()]}>
          <ScrollView
            contentContainerStyle={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-evenly',
            }}
            onRefresh={this._onRefresh}
            refreshing={false}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
            {this.state.files.length
              ? this.state.files.map ((file, index) => {
                  return <FileBlock {...file} key={file._id} />;
                })
              : <EmptyFileBlock />}
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
