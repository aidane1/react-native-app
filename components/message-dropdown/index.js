import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  View,
  Dimensions,
  Picker,
  Keyboard,
  Animated,
  Easing,
} from 'react-native';

import Modal from 'react-native-modal';

import {boxShadows} from '../../constants/boxShadows';

export default class Message extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      visible: false,
      message: '',
      //types: enum("Success", "Warning", "Error")
      type: 'Success',
    };

    this.colors = {
      Success: {
        border: '#58c73c',
      },
      Warning: {
        border: '#f5d820',
      },
      Error: {
        border: '#f06d56',
      },
    };
  }
  success = message => {
    this.setState ({visible: true, message, type: 'Success'});
  };
  warning = message => {
    this.setState ({visible: true, message, type: 'Warning'});
  };
  error = message => {
    this.setState ({visible: true, message, type: 'Error'});
  };
  render () {
    let colors = this.colors[this.state.type];
    console.log(colors);
    return (
      <View>
        <Modal
          onBackdropPress={() => this.setState ({visible: false})}
          animationIn={'slideInDown'}
          animationOut={'slideOutUp'}
          isVisible={this.state.visible}
          style={{margin: 0, alignItems: 'center'}}
          backdropOpacity={0.5}
        >
          <View
            style={[
              {
                backgroundColor: 'white',
                width: this.props.width * 0.95,
                borderLeftWidth: 5,
                borderLeftColor: colors.border,
                padding: 10,
              },
              boxShadows.boxShadow7,
            ]}
          >
            <Text style={{fontSize: 18, fontWeight: '600', marginBottom: 5}}>
              {this.state.type}
            </Text>
            <Text style={{fontSize: 14, fontWeight: '300'}}>
              {this.state.message || this.state.type}
            </Text>
          </View>
        </Modal>
      </View>
    );
  }
}
