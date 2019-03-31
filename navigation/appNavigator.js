
import HomeScreen from '../screens/homeScreen/index';
import LoginScreen from '../screens/loginScreen/index';
import LoadingScreen from "../screens/loadingScreen/index";
import AccountScreen from "../screens/accountScreen/index";
import CoursesScreen from "../screens/coursesScreen/index";

import { createAppContainer, createStackNavigator } from 'react-navigation';

const MainNavigator = createStackNavigator(
    {
        Home: {screen: HomeScreen},
        Login: {screen: LoginScreen},
        Loading: {screen: LoadingScreen},
        Account: {screen: AccountScreen},
        Courses: {screen: CoursesScreen},
    },
    {
        initialRouteName: "Loading",
    }
);
  
const App = createAppContainer(MainNavigator);

export default App;