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


export default class ScheduleScreenTile extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View>

      </View>
    )
  }
}

