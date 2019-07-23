import Onboarding from 'react-native-onboarding-swiper';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Dimensions,
  CameraRoll,
  AsyncStorage,
  Button,
} from 'react-native';

import {User} from '../../classes/user';

import {StackActions, NavigationActions} from 'react-navigation';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

export default class OnboardingScreen extends React.Component {
  constructor (props) {
    super (props);
  }
  static navigationOptions = {
    header: null,
  };
  onFinished = async () => {
    await User._setTutorialState (true);
    this.props.navigation.replace ('Home');
  };
  onSkipped = async () => {
    await User._setTutorialState (true);
    this.props.navigation.replace ('Home');
  };
  render () {
    return (
      <Onboarding
        //   style={{width, height}}
        onSkip={this.onSkipped}
        onDone={this.onFinished}
        showDone={true}
        pages={[
          {
            backgroundColor: '#222222',
            image: (
              <Image
                source={require ('../../assets/tutorial.png')}
                style={{width: width * 0.8, height: width * 1.42}}
              />
            ),
            title: '',
            subtitle: '',
          },
          {
            backgroundColor: '#444444',
            image: (
              <Image
                source={require ('../../assets/navigationTutorial.png')}
                style={{width: width * 0.8, height: width * 1.42}}
              />
            ),
            title: '',
            subtitle: '',
          },
          {
            backgroundColor: '#666666',
            image: (
              <Image
                source={require ('../../assets/questionTutorial.png')}
                style={{width: width * 0.8, height: width * 1.42}}
              />
            ),
            title: '',
            subtitle: '',
          },
          {
            backgroundColor: '#888888',
            image: (
              <Image
                source={require ('../../assets/createTutorial.png')}
                style={{width: width * 0.8, height: width * 1.42}}
              />
            ),
            title: '',
            subtitle: '',
          },
        ]}
      />
    );
  }
}
