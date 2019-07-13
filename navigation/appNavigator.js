
import HomeScreen from '../screens/homeScreen/index';
import LoginScreen from '../screens/loginScreen/index';
import LoadingScreen from "../screens/loadingScreen/index";
import AccountScreen from "../screens/accountScreen/index";
import CoursesScreen from "../screens/coursesScreen/index";
import EventsScreen from "../screens/eventsScreen/index";
import CalendarScreen from "../screens/calendarScreen/index";
import CourseInfoScreen from '../screens/courseInfoScreen/index';
import NotesScreen from "../screens/notesPage/index";
import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation';


const MainNavigator = createStackNavigator(
    {
        Home: {screen: HomeScreen, lazy: true},
        Login: {screen: LoginScreen, lazy: true},
        Loading: {screen: LoadingScreen, lazy: true},
        Account: {screen: AccountScreen, lazy: true},
        Courses: {screen: CoursesScreen, lazy: true},
        Events: {screen: EventsScreen, lazy: true},
        Calendar: {screen: CalendarScreen, lazy: true},
        CourseInfo: {screen: CourseInfoScreen, lazy: true},
        Notes: {screen: NotesScreen, lazy: true}
    },
    {
        initialRouteName: "Loading",
    }
);
  
const App = createAppContainer(MainNavigator);

export default App;