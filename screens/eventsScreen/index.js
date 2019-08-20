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

import {LeftIcon, RightIcon, EmptyIcon} from '../../classes/icons';

import {LinearGradient} from 'expo-linear-gradient';

import moment from 'moment';

import {ScrollView} from 'react-native-gesture-handler';

import {boxShadows} from '../../constants/boxShadows';

import {ifIphoneX} from 'react-native-iphone-x-helper';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

class EventBlock extends React.Component {
  render () {
    return (
      <View style={[styles.gradientBlock, boxShadows.boxShadow4]}>
        <LinearGradient
          // colors={['#5cc0e8', '#5c9be8']}
          colors={['#5c9be8', '#3b87e3']}
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
                  {' '}
                  {!this.props.school_in ? '(No School)' : ''}
                </Text>
              </ScrollView>
            </View>
            <View style={styles.eventBottomRow}>
              <Text style={styles.eventBottomRowText}>

                {moment (this.props.event_date).format ('dddd, MMMM Do, YYYY')}
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

export default class EventScreen extends React.Component {
  constructor (props) {
    super (props);
    this.props = props;

    let events = global.events.sort ((a, b) => {
      return a.event_date.getTime () > b.event_date.getTime () ? 1 : -1;
    });
    let eventBlocks = {};
    let monthOrder = [];
    this.monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    if (events.length) {
      let currentMonth = events[0].event_date.getMonth ();
      eventBlocks[currentMonth] = [];
      monthOrder.push (currentMonth);
      events.forEach (event => {
        if (event.event_date.getMonth () == currentMonth) {
          eventBlocks[currentMonth].push (event);
        } else {
          currentMonth = event.event_date.getMonth ();
          monthOrder.push (currentMonth);
          eventBlocks[currentMonth] = [event];
        }
      });
    } else {
      eventBlocks[new Date ().getMonth ()] = [
        {
          school_in: true,
          title: 'No Events!',
          event_date: new Date (),
          time: 'now',
        },
      ];
      monthOrder.push (new Date ().getMonth ());
    }
    this.eventBlocks = eventBlocks;
    this.monthOrder = monthOrder;
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
      <View style={[styles.container, global.user.primaryTheme ()]}>
        <HeaderBar
          iconLeft={
            <TouchableWithoutFeedback
              onPress={() => this.props.navigation.goBack ()}
            >
              <LeftIcon size={28} />
            </TouchableWithoutFeedback>
          }
          iconRight={<EmptyIcon width={28} height={32} />}
          width={width}
          height={60}
          title="Events"
        />
        <View style={styles.bodyHolder}>
          <ScrollView
            contentContainerStyle={{
              width,
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {this.monthOrder.map ((key, index_1) => {
              return (
                <View key={'block_' + index_1}>
                  <View style={[styles.titleBlock, global.user.borderColor ()]}>
                    <Text
                      style={[
                        styles.h1,
                        {color: global.user.getPrimaryTextColor ()},
                      ]}
                    >
                      {this.monthNames[key]}
                    </Text>
                  </View>
                  {this.eventBlocks[key].map ((event, index_2) => {
                    return <EventBlock key={event._id} {...event} />;
                  })}
                </View>
              );
            })}
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
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
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
