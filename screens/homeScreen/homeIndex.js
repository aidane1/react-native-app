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
  Button
} from 'react-native';

import { WebBrowser } from 'expo';

import { LinearGradient } from 'expo-linear-gradient';

import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import {boxShadows} from '../../constants/boxShadows';


const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

class GradientBlock extends React.Component {
  render() {
    return (
      <View style={boxShadows.boxShadow4}>
        <LinearGradient colors={["#e8865c", "#e86e5c"]} style={[styles.gradientBlock]}>
          <View style={styles.blockBody}>
            <View style={styles.blockHeader}>
              <Text style={styles.blockHeaderText}>
                {this.props.title}
              </Text>
            </View>
            <View style={styles.blockLeft}>
              <Text style={styles.blockMain} numberOfLines={1}>
                {this.props.main}
              </Text>
              <Text style={styles.blockSecondary}>
              {this.props.secondary}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    )
  }
}
class EventBlock extends React.Component {
  render() {
    return (
      <LinearGradient colors={["#5cc0e8", "#5c9be8"]} style={styles.gradientBlock}>
        <View style={[styles.blockBody, {flexDirection: 'column'}]}>
          <View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <Text style={styles.eventTopRow}>
                {this.props.info}
              </Text>
            </ScrollView>
          </View>
          <View style={styles.eventBottomRow}>
            <Text style={styles.eventBottomRowText}>
              {this.props.date}
            </Text>
            <Text style={styles.eventBottomRowText}>
              {this.props.time}
            </Text>
          </View>
        </View>
      </LinearGradient>
    )
  }
}

export default class HomeScreenTile extends React.Component {
  
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    }
  }
  constructor(props) {
    super(props);
    this.props = props;
  }
  render() {
    return (
        <ScrollView style={styles.scrollBack} bounces={false}>
            <View style = {styles.backdrop}>
            <View style={styles.titleBlock}>
                <Text style = {styles.h1}>{this.props.dayTitle}</Text>
            </View>
            <GradientBlock {...this.props.current}></GradientBlock>
            <GradientBlock {...this.props.next}></GradientBlock>
            <View style={styles.titleBlock}>
                <Text style = {styles.h1}>Events</Text>
            </View>
            {
              this.props.events.map((y, i) => {
                return (
                  <EventBlock key={`event_${i}`} {...y}></EventBlock>
                )
              })
            }
            </View>
        </ScrollView>
    )
  }
}
const styles = StyleSheet.create({
  scrollBack: {
    width: width,
    backgroundColor: "#f0f0f0",
  },
  backdrop: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titleBlock: {
    width: width,
    borderBottomColor: "#000000",
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
    width: width*0.95,
    marginTop: 10,
    borderRadius: 5,
    paddingTop: 5,
    paddingRight: 15,
    paddingBottom: 10,
    paddingLeft: 15,
  },
  blockBody: {
    flexDirection: 'row',
  },
  blockHeader: {
    flexGrow: 1,
  },
  blockHeaderText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 5,
  },
  blockMain: {
    fontSize: 35,
    fontWeight: '200',
    color: "#ffffff",
    textAlign: 'right',
    overflow: "hidden",
  },
  blockSecondary: {
    fontSize: 14,
    fontWeight: '300',
    opacity: 0.7,
    color: "#ffffff",
    textAlign: 'right',
  },
  eventBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventBottomRowText: {
    fontSize: 14,
    color: "#ffffff",
    opacity: 0.7,
  },
  eventTopRow: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 5,
    paddingBottom: 10,
  }
});
