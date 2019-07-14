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

import {ScrollView} from 'react-native-gesture-handler';

import {boxShadows} from '../../constants/boxShadows';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

export default class AccountScreen extends React.Component {
  constructor (props) {
    super (props);
    this.props = props;
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
      <View style={styles.container}>
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
          <ScrollView />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create ({});
