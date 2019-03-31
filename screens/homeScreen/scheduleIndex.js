import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  Text
} from 'react-native';

import { DayBlock } from "../../classes/school";

import { ScrollView } from 'react-native-gesture-handler';

import { boxShadows } from '../../constants/boxShadows';

import { LinearGradient } from 'expo';

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

function makeColorMap(blockNames) {
  let colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
  let colorMap = {};
  for (var i = 0; i < blockNames.length; i++) {
    if (blockNames[i][1] == "changing") {
      colorMap[blockNames[i][0]] = colorArray[i];
    } else {
      colorMap[blockNames[i][0]] = "#ffffff";
    }
  }
  return colorMap;
}


function averageColors( colorArray ){
  //get the red of RGB from a hex value
  function hexToR(h) {return parseInt((cutHex( h )).substring( 0, 2 ), 16 )}

  //get the green of RGB from a hex value
  function hexToG(h) {return parseInt((cutHex( h )).substring( 2, 4 ), 16 )}

  //get the blue of RGB from a hex value
  function hexToB(h) {return parseInt((cutHex( h )).substring( 4, 6 ), 16 )}

  //cut the hex into pieces
  function cutHex(h) {if(h.charAt(1) == "x"){return h.substring( 2, 8 );} else {return h.substring(1,7);}}
  var red = 0, green = 0, blue = 0;

  for ( var i = 0; i < colorArray.length; i++ ){
      red += hexToR( "" + colorArray[ i ] + "" )**2;
      green += hexToG( "" + colorArray[ i ] + "" )**2;
      blue += hexToB( "" + colorArray[ i ] + "" )**2;
  }

  //Average RGB
  red = Math.round(Math.sqrt(red/colorArray.length));
  green = Math.round(Math.sqrt(green/colorArray.length));
  blue = Math.round(Math.sqrt(blue/colorArray.length));
  return ( "rgb("+ red +","+ green +","+ blue +")" );
}

class ScheduleBlock {
  constructor(info) {
    this.timeString = info.timeString;
    this.teacher = info.teacher;
    this.course = info.course;
    this.block = info.block;
    this.isConstant = info.isConstant;
  }
}

class ScheduleDisplayBlock extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  render() {
    if (this.props.block.isConstant) {
      return (
        <View style={boxShadows.boxShadow3}>
          <LinearGradient colors={["white", "white"]} style={[styles.constantScheduleBlock]}>
            <Text style={styles.course} adjustsFontSizeToFit={true} numberOfLines={1}>{this.props.block.course}</Text>
            <Text style={styles.time} adjustsFontSizeToFit={true} numberOfLines={1}>{this.props.block.timeString}</Text>
          </LinearGradient>
        </View>
      )
    } else {
      let colour1 = averageColors([this.props.colourMap[this.props.block.block], this.props.colourMap[this.props.block.block], this.props.colourMap[this.props.block.block], "#ffffff"]);
      let colour2 = averageColors([this.props.colourMap[this.props.block.block], this.props.colourMap[this.props.block.block], "#ffffff"]);
      return (
        <View style={boxShadows.boxShadow5}>
          <LinearGradient colors={[colour1, colour2]} style={[styles.scheduleBlock]}>
            <Text style={styles.course} adjustsFontSizeToFit={true} numberOfLines={1}>{this.props.block.course}</Text>
            <Text style={styles.teacher} adjustsFontSizeToFit={true} numberOfLines={1}>{this.props.block.teacher}</Text>
            <Text style={styles.time} adjustsFontSizeToFit={true} numberOfLines={1}>{this.props.block.timeString}</Text>
          </LinearGradient>
        </View>

        
      )
    }
  }
}

class ScheduleDay extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.blocks = this.props.blocks;
  }
  render() {
    return (
      <View style={styles.scheduleDay}>
        <View>
          <Text style={styles.titleText}>Day 5</Text>
        </View>
        {
          this.blocks.map((x, index) => {
            return (<ScheduleDisplayBlock colourMap={this.props.colourMap} block={x} key={`block_${index}`}></ScheduleDisplayBlock>)
          })
        }
      </View>
    )
  }
}

class ScheduleWeek extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  render() {
    let blocks = [];
    for (var key in this.props.schedule) {
      blocks.push(<ScheduleDay key={`day_${key}`} colourMap={this.props.colourMap} blocks={this.props.schedule[key]}></ScheduleDay>);
    }
    return (
      <View style={styles.scheduleWeekContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={styles.scheduleWeek}>
            {blocks}
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default class ScheduleScreenTile extends React.Component {
  constructor(props) {
      super(props);
      this.props = props;
      this.schedule = this.props.schedule;
      this.courses = this.props.courses;
      this.colourMap = makeColorMap(this.props.blocks);
      this.formattedSchedule = [];
      for (var i = 0; i < this.schedule.length; i++) {
        let currentWeek = {};
        for (var key in this.schedule[i]) {
          let currentDay = [];
          for (var j = 0; j < this.schedule[i][key].length; j++) {
            let currentCourse = this.courses[this.schedule[i][key][j].block];
            this.schedule[i][key][j] = new DayBlock(this.schedule[i][key][j]);
            let currentBlock = new ScheduleBlock({isConstant: currentCourse.constant, block: this.schedule[i][key][j].block, timeString: this.schedule[i][key][j].toTimeString(), teacher: currentCourse.teacher, course: currentCourse.course});
            currentDay.push(currentBlock);
          }
          currentWeek[key] = currentDay;
        }
        this.formattedSchedule.push(currentWeek);
      }
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={width}>
          {
            this.formattedSchedule.map((x, index) => {
              return (<ScheduleWeek colourMap={this.colourMap} key={`week_${index}`} schedule={x}></ScheduleWeek>)
            })
          }
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width,
    backgroundColor: "#f0f0f0",
  },
  scheduleBlock: {
    width: 120,
    height: 80,
    margin: 8,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
  },
  constantScheduleBlock: {
    width: 120,
    height: 60,
    margin: 8,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
  },
  scheduleWeek: {
    flexDirection: "row"
  },  
  course: {
    fontSize: 13,
  },
  teacher: {
    fontSize: 12,
  },
  time: {
    fontSize: 10, 
  },
  titleText: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 20
  }
});