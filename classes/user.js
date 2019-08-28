import {AsyncStorage} from 'react-native';

export class User {
  constructor (user) {
    this.districtUsername = user.districtUsername || user.username;

    this.districtPassword = user.districtPassword || '';

    this.grade = user.grade || 9;

    this.automaticCourseUpdating = user.automaticCourseUpdating !== undefined
      ? user.automaticCourseUpdating
      : false;

    this.block_colors = user.block_colors || {};

    this.block_names = user.block_names || {};

    this.username = user.username;
    this.password = user.password;
    this['x-api-key'] = user['x-api-key'];
    this['x-id-key'] = user['x-id-key'];
    this.courses = user.courses || [];
    this.school = user.school;
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.studentNumber = user.studentNumber;
    this.scheduleType = user.scheduleType || 'schedule';
    this.scheduleImages = user.scheduleImages || [];
    this.permission_level = user.permission_level || 0;
    this.notifications = user.notifications || {
      dailyAnnouncements: false,
      nextClass: false,
      newAssignments: true,
      markedAssignments: false,
      imageReplies: true,
      upcomingEvents: true,
      activities: false,
    };
    this.theme = user.theme || 'Dark';
    this.scheduled_dark_theme = user.scheduled_dark_theme || false;
    this.scheduled_start_hour = user.scheduled_start_hour || 20;
    this.scheduled_end_hour = user.scheduled_end_hour || 7;
    this.scheduled_start_minute = user.scheduled_start_minute || 0;
    this.scheduled_end_minute = user.scheduled_end_minute || 30;
    this.accountId = user.accountId || '_';
    this.trueDark = user.trueDark || false;
    this.visuallyImpared = user.visuallyImpared || false;
    this.automaticMarkRetrieval = user.automaticMarkRetrieval
      ? user.automaticMarkRetrieval
      : false;
    this.profile_picture = user.profile_picture || '';
    this.grade_only_announcements = user.grade_only_announcements || false;
    this.pdf_announcements = user.pdf_announcements !== undefined
      ? user.pdf_announcements
      : true;
    this.beforeSchoolActivities = user.beforeSchoolActivities || {
      day_1: [],
      day_2: [],
      day_3: [],
      day_4: [],
      day_5: [],
    };
    this.lunchTimeActivities = user.lunchTimeActivities || {
      day_1: [],
      day_2: [],
      day_3: [],
      day_4: [],
      day_5: [],
    };
    this.afterSchoolActivities = user.afterSchoolActivities || {
      day_1: [],
      day_2: [],
      day_3: [],
      day_4: [],
      day_5: [],
    };

    if (this.scheduled_dark_theme) {
      let date = new Date ();
      let sumNow = date.getHours () * 60 + date.getMinutes ();
      let sumStart =
        this.scheduled_start_hour * 60 + this.scheduled_start_minute;
      let sumEnd = this.scheduled_end_hour * 60 + this.scheduled_end_minute;
      if (sumNow >= sumStart || sumNow <= sumEnd) {
        this.theme = 'Dark';
      } else {
        this.theme = 'Light';
      }
    }
    setInterval (() => {
      if (this.scheduled_dark_theme) {
        let date = new Date ();
        let sumNow = date.getHours () * 60 + date.getMinutes ();
        let sumStart =
          this.scheduled_start_hour * 60 + this.scheduled_start_minute;
        let sumEnd = this.scheduled_end_hour * 60 + this.scheduled_end_minute;
        if (sumNow >= sumStart || sumNow <= sumEnd) {
          this.theme = 'Dark';
        } else {
          this.theme = 'Light';
        }
      }
    }, 60000);
  }
  toString () {
    return {
      username: this.username,
      password: this.password,
      courses: this.courses,
      'x-api-key': this['x-api-key'],
      'x-id-key': this['x-id-key'],
      permission_level: this.permission_level,
      school: this.school,
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      studentNumber: this.studentNumber,
      scheduleType: this.scheduleType,
      accountId: this.accountId,
      scheduleImages: this.scheduleImages || [],
      notifications: this.notifications || {
        dailyAnnouncements: false,
        nextClass: false,
        newAssignments: true,
        markedAssignments: false,
        imageReplies: true,
        upcomingEvents: true,
        grade_only_announcements: false,
      },
      block_colors: this.block_colors || {},
      block_names: this.block_names || {},
      theme: this.theme || 'Light',
      scheduled_dark_theme: this.scheduled_dark_theme || false,
      scheduled_start_hour: this.scheduled_start_hour || 20,
      scheduled_end_hour: this.scheduled_end_hour || 8,
      scheduled_start_hour: this.scheduled_start_minute || 0,
      scheduled_end_hour: this.scheduled_end_hour || 30,
      trueDark: this.trueDark || false,
      visuallyImpared: this.visuallyImpared || false,
      profile_picture: this.profile_picture,
      automaticMarkRetrieval: this.automaticMarkRetrieval || false,
      automaticCourseUpdating: this.automaticCourseUpdating || false,
      afterSchoolActivities: this.afterSchoolActivities || {
        day_1: [],
        day_2: [],
        day_3: [],
        day_4: [],
        day_5: [],
      },
      lunchTimeActivities: this.lunchTimeActivities || {
        day_1: [],
        day_2: [],
        day_3: [],
        day_4: [],
        day_5: [],
      },
      beforeSchoolActivities: this.beforeSchoolActivities || {
        day_1: [],
        day_2: [],
        day_3: [],
        day_4: [],
        day_5: [],
      },
    };
  }
  getPrimaryTheme = () => {
    console.log ('theme read');
    console.log (this.theme);
    if (this.theme == 'Light') {
      return '#f0f0f0';
    } else {
      if (this.trueDark) {
        return '#242424';
      } else {
        return '#34353b';
      }
    }
  };
  getSecondaryTheme = () => {
    if (this.theme == 'Light') {
      return '#ffffff';
    } else {
      if (this.trueDark) {
        return '#000000';
      } else {
        // return '#1b1d29';
        return '#1b1b1b';
      }
    }
  };
  getPrimaryTextColor = () => {
    if (this.theme == 'Light') {
      return 'rgba(0,0,0,0.9)';
    } else {
      if (this.trueDark) {
        return '#ffffff';
      } else {
        return '#ffffff';
      }
    }
  };
  getSecondaryTextColor = () => {
    if (this.theme == 'Light') {
      return 'rgba(0,0,0,0.75)';
    } else {
      if (this.trueDark) {
        return 'rgba(255,255,255,0.9)';
      } else {
        return 'rgba(255,255,255,0.9)';
      }
    }
  };
  getTertiaryTextColor = () => {
    if (this.theme == 'Light') {
      return 'rgba(0,0,0,0.5)';
    } else {
      if (this.trueDark) {
        return 'rgba(255,255,255,0.7)';
      } else {
        return 'rgba(255,255,255,0.7)';
      }
    }
  };
  getBorderColor = () => {
    if (this.theme == 'Light') {
      return 'rgba(150,150,150, 0.9)';
      // return "#f3f3f3";
    } else {
      if (this.trueDark) {
        // return 'rgba(80, 80, 80, 0.9)';
        return `#1d1d1d`;
      } else {
        // return 'rgba(120, 120, 120, 0.9)';
        return '#2f3035';
      }
    }
  };
  primaryTheme = () => {
    if (this.theme == 'Light') {
      return {backgroundColor: '#f0f0f0'};
    } else {
      if (this.trueDark) {
        return {backgroundColor: '#242424'};
      } else {
        return {backgroundColor: '#34353b'};
      }
    }
  };
  secondaryTheme = () => {
    if (this.theme == 'Light') {
      return {backgroundColor: '#ffffff'};
    } else {
      if (this.trueDark) {
        return {backgroundColor: '#000000'};
      } else {
        // return {backgroundColor: '#1b1d29'};
        return {backgroundColor: '#1b1b1b'};
      }
    }
  };
  primaryTextColor = () => {
    if (this.theme == 'Light') {
      return {color: 'rgba(0,0,0,0.9)'};
    } else {
      if (this.trueDark) {
        return {color: '#ffffff'};
      } else {
        return {color: '#ffffff'};
      }
    }
  };
  secondaryTextColor = () => {
    if (this.theme == 'Light') {
      return {color: 'rgba(0,0,0,0.75)'};
    } else {
      if (this.trueDark) {
        return {color: 'rgba(255,255,255,0.9)'};
      } else {
        return {color: 'rgba(255,255,255,0.9)'};
      }
    }
  };
  tertiaryTextColor = () => {
    if (this.theme == 'Light') {
      return {color: 'rgba(0,0,0,0.5)'};
    } else {
      if (this.trueDark) {
        return {color: 'rgba(255,255,255,0.7)'};
      } else {
        return {color: 'rgba(255,255,255,0.7)'};
      }
    }
  };
  borderColor = () => {
    if (this.theme == 'Light') {
      return {borderColor: 'rgba(150,150,150, 0.9)'};
      // return {borderColor:"#f3f3f3"};
    } else {
      if (this.trueDark) {
        // return {borderColor: 'rgba(80, 80, 80, 0.9)'};
        return {borderColor: `#1d1d1d`};
      } else {
        // return {borderColor: 'rgba(120, 120, 120, 0.9)'};
        return {borderColor: '#2f3035'};
      }
    }
  };
  static _saveDistrictInfo = async info => {
    try {
      await AsyncStorage.setItem ('district_info', JSON.stringify (info));
      return await User._getDistrictInfo ();
    } catch (e) {
      console.log (e);
      return {districtUsername: '', districtPassword: '', grade: ''};
    }
  };
  static _getDistrictInfo = async () => {
    try {
      let storageInfo = (await AsyncStorage.getItem ('district_info')) || '{}';
      let info = JSON.parse (storageInfo);
      if (info.districtUsername) {
        return info;
      } else {
        return {districtUsername: '', districtPassword: '', grade: ''};
      }
    } catch (e) {
      console.log (e);
      return {districtUsername: '', districtPassword: '', grade: ''};
    }
  };
  static _saveToStorage = async user => {
    try {
      // console.log(user);
      // console.log("saved to storage: ");
      // console.log(JSON.stringify(user));
      // console.log({user});
      // console.log(user.automaticCourseUpdating);
      await AsyncStorage.setItem ('user', JSON.stringify (user));
      user = await User._retrieveFromStorage ();
      // console.log({user});
      return user;
    } catch (e) {
      return user;
    }
  };
  static _retrieveFromStorage = async () => {
    try {
      let storageUser = await AsyncStorage.getItem ('user');
      // console.log("Retrieved from storage: ");
      // console.log(storageUser);
      let user = JSON.parse (storageUser);
      user = new User (user);
      // console.log(user);
      return user;
    } catch (e) {
      return {};
    }
  };
  static _hasViewedTutorial = async () => {
    try {
      let loggedIn = await AsyncStorage.getItem ('hasViewed');
      return loggedIn === 'true';
    } catch (e) {
      return false;
    }
  };
  static _setTutorialState = async state => {
    try {
      await AsyncStorage.setItem ('hasViewed', state ? 'true' : 'false');
      return state;
    } catch (e) {
      return false;
    }
  };
  static _hasViewedHelp = async () => {
    try {
      let help = await AsyncStorage.getItem ('help');
      return help === 'true';
    } catch (e) {
      return false;
    }
  };
  static _setHelpState = async state => {
    console.log ({state});
    try {
      await AsyncStorage.setItem ('help', state ? 'true' : 'false');
      return state;
    } catch (e) {
      return false;
    }
  };
  static _isLoggedIn = async () => {
    try {
      let loggedIn = await AsyncStorage.getItem ('loggedIn');
      return loggedIn === 'true';
    } catch (e) {
      return false;
    }
  };
  static _setLoginState = async state => {
    try {
      await AsyncStorage.setItem ('loggedIn', state ? 'true' : 'false');
      return state;
    } catch (e) {
      return false;
    }
  };
}
