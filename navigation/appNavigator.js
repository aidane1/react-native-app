import HomeScreen from '../screens/homeScreen/index';
import LoginScreen from '../screens/loginScreen/index';
import LoadingScreen from '../screens/loadingScreen/index';
import AccountScreen from '../screens/accountScreen/index';
import CoursesScreen from '../screens/coursesScreen/index';
import EventsScreen from '../screens/eventsScreen/index';
import CalendarScreen from '../screens/calendarScreen/index';
import CourseInfoScreen from '../screens/courseInfoScreen/index';
import NotesScreen from '../screens/notesPage/index';
import AssignmentsScreen from '../screens/assignmentsScreen/index';
import ChatroomScreen from '../screens/chatroomScreen/index';
import SettingsScreen from '../screens/settingsScreen/index';
import SchoolAssignmentsScreen from '../screens/schoolAssignmentsScreen/index';
import PureChatroomScreen from '../screens/pureChatRoomScreen/index';
import ActivitiesScreen from '../screens/activitiesScreen/index';
import QuestionsScreen from '../screens/questionsScreen/index';
import QuestionScreen from '../screens/questionScreen/index';
import OnboardingScreen from '../screens/onboardingScreen/index';
import AnnouncementsScreen from '../screens/announcementsScreen/index';
import AnnouncementScreen from '../screens/announcementScreen/index';
import tutorialScreen from '../screens/tutorialScreen/index';
import NotificationScreen from '../screens/notificationsScreen/index';
import CourseConfigScreen from '../screens/courseConfigScreen/index';
import TranscriptScreen from '../screens/transcriptScreen/index';
import LinkScreen from '../screens/linksScreen/index';
import FileScreen from '../screens/FilesScreen/index';
import PollScreen from '../screens/pollScreen/index';

import {createAppContainer, createStackNavigator} from 'react-navigation';

import transitionConfig from './transitionConfig';

const MainNavigator = createStackNavigator (
  {
    Home: {screen: HomeScreen, lazy: true},
    Login: {screen: LoginScreen, lazy: true},
    Loading: {screen: LoadingScreen, lazy: true},
    Account: {screen: AccountScreen, lazy: true},
    Courses: {screen: CoursesScreen, lazy: true},
    Events: {screen: EventsScreen, lazy: true},
    Calendar: {screen: CalendarScreen, lazy: true},
    CourseInfo: {screen: CourseInfoScreen, lazy: true},
    Notes: {screen: NotesScreen, lazy: true},
    Assignments: {screen: AssignmentsScreen, lazy: true},
    Chatrooms: {screen: ChatroomScreen, lazy: true},
    Settings: {screen: SettingsScreen, lazy: true},
    SchoolAssignments: {screen: SchoolAssignmentsScreen, lazy: true},
    PureChatroom: {screen: PureChatroomScreen, lazy: true},
    Activities: {screen: ActivitiesScreen, lazy: true},
    Questions: {screen: QuestionsScreen, lazy: true},
    Question: {screen: QuestionScreen, lazy: true},
    OnBoarding: {screen: OnboardingScreen, lazy: true},
    Announcements: {screen: AnnouncementsScreen, lazy: true},
    Announcement: {screen: AnnouncementScreen, lazy: false},
    Tutorial: {screen: tutorialScreen, lazy: true},
    Notifications: {screen: NotificationScreen, lazy: true},
    CourseConfig: {screen: CourseConfigScreen, lazy: true},
    Transcript: {screen: TranscriptScreen, lazy: true},
    Links: {screen: LinkScreen, lazy: true},
    Files: {screen: FileScreen, lazy: true},
    Polls: {screen: PollScreen, lazy: true},
    // Polls: {screen: PollNavigator},
  },
  {
    initialRouteName: 'Loading',
    // transitionConfig,
  }
);

const App = createAppContainer (MainNavigator);

export default App;
