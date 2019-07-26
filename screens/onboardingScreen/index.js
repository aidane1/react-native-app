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
  Alert,
  Dimensions,
  CameraRoll,
  AsyncStorage,
  Button,
} from 'react-native';
import {
  CompassIcon,
  NotificationIcon,
  AssignmentsIcon,
  EventsIcon,
  QuestionIcon,
} from '../../classes/icons';

import {User} from '../../classes/user';

import {StackActions, NavigationActions} from 'react-navigation';

import * as Permissions from 'expo-permissions';

const width = Dimensions.get ('window').width; //full width
const height = Dimensions.get ('window').height; //full height

async function registerForPushNotificationsAsync () {
  const {status: existingStatus} = await Permissions.getAsync (
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    setTimeout (() => {
      Alert.alert (
        'Push Notifications',
        'This app uses push notifications to keep students up to date on everything happening in the school. Allow push notifications?',
        [
          {
            text: 'Ok',
            onPress: async () => {
              const {status} = await Permissions.askAsync (
                Permissions.NOTIFICATIONS
              );
              finalStatus = status;
              if (finalStatus !== 'granted') {
                return;
              }
              let token = await Notifications.getExpoPushTokenAsync ();
              let api = new ApexAPI (global.user);
              return api
                .put (`users/${global.user.id}`, {
                  push_token: token,
                })
                .then (data => data.json ())
                .then (data => console.log (data));
            },
          },
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
        ],
        {cancelable: false}
      );
    }, 500);
  }
}

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
  askPermissions = async () => {
    await registerForPushNotificationsAsync ();
  };
  render () {
    return (
      <Onboarding
        //   style={{width, height}}
        onSkip={this.onSkipped}
        skipToPage={3}
        onDone={this.onFinished}
        pageIndexCallback={index => {
          index == 3 && this.askPermissions ();
        }}
        showDone={true}
        pages={[
          {
            backgroundColor: '#83d8fc',
            image: <AssignmentsIcon size={300} color="white" />,
            title: (
              <Text
                style={{
                  fontSize: 30,
                  fontFamily: 'montserrat-500',
                  color: '#050654',
                }}
              >
                Stay Connected
              </Text>
            ),
            subtitle: (
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: 'montserrat-400',
                  color: 'white',
                  marginTop: 15,
                }}
              >
                Never miss an assignment again
              </Text>
            ),
          },
          {
            backgroundColor: '#f0cb75',
            image: <CompassIcon size={300} color="white" />,
            title: (
              <Text
                style={{
                  fontSize: 30,
                  fontFamily: 'montserrat-500',
                  color: '#050654',
                }}
              >
                Stay On Track
              </Text>
            ),
            subtitle: (
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: 'montserrat-400',
                  color: 'white',
                  marginTop: 15,
                }}
              >
                Know where to be, at all times
              </Text>
            ),
          },
          {
            backgroundColor: '#888888',
            image: <QuestionIcon size={300} color="white" />,
            title: (
              <Text
                style={{
                  fontSize: 30,
                  fontFamily: 'montserrat-500',
                  color: '#050654',
                }}
              >
                Get The Help You Need
              </Text>
            ),
            subtitle: (
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: 'montserrat-400',
                  color: 'white',
                  marginTop: 15,
                }}
              >
                Ask your classmates or teachers
              </Text>
            ),
          },
          {
            backgroundColor: '#97e38f',
            image: <EventsIcon size={300} color="white" />,
            title: (
              <Text
                style={{
                  fontSize: 30,
                  fontFamily: 'montserrat-500',
                  color: '#050654',
                }}
              >
                Keep Up To Date
              </Text>
            ),
            subtitle: (
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: 'montserrat-400',
                  color: 'white',
                  marginTop: 15,
                }}
              >
                Never miss an event
              </Text>
            ),
          },
        ]}
      />
    );
  }
}
