
import HomeScreen from '../screens/homeScreen/index';
import LoginScreen from '../screens/loginScreen/index';
import LoadingScreen from "../screens/loadingScreen/index";
import AccountScreen from "../screens/accountScreen/index";
import CoursesScreen from "../screens/coursesScreen/index";

import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation';

const MainNavigator = createStackNavigator(
    {
        Home: {screen: HomeScreen, lazy: true},
        Login: {screen: LoginScreen, lazy: true},
        Loading: {screen: LoadingScreen, lazy: true},
        Account: {screen: AccountScreen, lazy: true},
        Courses: {screen: CoursesScreen, lazy: true},
    },
    {
        initialRouteName: "Loading",
    }
);
  
const App = createAppContainer(MainNavigator);

export default App;