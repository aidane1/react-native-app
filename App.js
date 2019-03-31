import React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text } from 'react-native';
import { AppLoading } from 'expo';
import AppNavigator from './navigation/appNavigator';


export default AppNavigator;
// export default class App extends React.Component {
//   state = {
//     isLoadingComplete: true,
//   };

//   render() {
//     if (!this.state.isLoadingComplete) {
//       return (
//         <View>
//           <Text>FUCK</Text>
//           <AppLoading
//             onLoad={() => true}
//             onError={this._handleLoadingError}
//             onFinish={this._handleFinishLoading}
//           />
//         </View>
//       );
//     } else {
//       return (
//         <View style={styles.container}>
//           {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
//           <AppNavigator />
//         </View>
//       );
//     }
//   }
//   _handleLoadingError = error => {
//     // In this case, you might want to report the error to your error
//     // reporting service, for example Sentry
//     console.warn(error);
//   };
//   _handleFinishLoading = () => {
//     this.setState({ isLoadingComplete: true });
//   };
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
