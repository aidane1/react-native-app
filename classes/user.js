import {AsyncStorage} from 'react-native';

export class User {
  constructor (user) {
    this.username = user.username;
    this.password = user.password;
    this['x-api-key'] = user['x-api-key'];
    this['x-id-key'] = user['x-id-key'];
    this.courses = user.courses;
    this.school = user.school;
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.studentNumber = user.studentNumber;
    this.scheduleType = user.scheduleType || 'schedule';
    this.scheduleImages = user.scheduleImages || [];
    this.notifications = user.notifications || {
      dailyAnnouncements: false,
      nextClass: false,
      newAssignments: true,
      imageReplies: true,
      upcomingEvents: true,
    };
    this.theme = user.theme || 'Light';
    this.trueDark = user.trueDark || false;
    this.visuallyImpared = user.visuallyImpared || false;
    this.automaticMarkRetrieval = user.automaticMarkRetrieval || false;
    this.automaticCourseUpdating == user.automaticCourseUpdating || false;
  }
  toString () {
    return {
      username: this.username,
      password: this.password,
      courses: this.courses,
      'x-api-key': this['x-api-key'],
      'x-id-key': this['x-id-key'],
      school: this.school,
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      studentNumber: this.studentNumber,
      scheduleType: this.scheduleType,
      scheduleImages: this.scheduleImages || [],
      notifications: this.notifications || {
        dailyAnnouncements: false,
        nextClass: false,
        newAssignments: true,
        imageReplies: true,
        upcomingEvents: true,
      },
      theme: this.theme || 'Light',
      trueDark: this.trueDark || false,
      visuallyImpared: this.visuallyImpared || false,
      automaticMarkRetrieval: this.automaticMarkRetrieval || false,
      automaticCourseUpdating: this.automaticCourseUpdating || false,
    };
  }
  getPrimaryTheme = () => {
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
        return '#1b1d29';
      }
    }
  };
  getPrimaryTextColor = () => {
    if (this.theme == 'Light') {
      return '#000000';
    } else {
      if (this.trueDark) {
        return '#ffffff';
      } else {
        return '#ffffff';
      }
    }
  }
  getSecondaryTextColor = () => {
    if (this.theme == 'Light') {
      return 'rgba(0,0,0,0.9)';
    } else {
      if (this.trueDark) {
        return 'rgba(255,255,255,0.9)';
      } else {
        return 'rgba(255,255,255,0.9)';
      }
    }
  }
  getTertiaryTextColor = () => {
    if (this.theme == 'Light') {
      return 'rgba(0,0,0,0.7)';
    } else {
      if (this.trueDark) {
        return 'rgba(255,255,255,0.7)';
      } else {
        return 'rgba(255,255,255,0.7)';
      }
    }
  }
  getBorderColor = () => {
    if (this.theme == 'Light') {
      return 'rgba(210,210,210, 0.9)';
    } else {
      if (this.trueDark) {
        return 'rgba(80, 80, 80, 0.9)';
      } else {
        return 'rgba(120, 120, 120, 0.9)';
      }
    }
  }
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
        return {backgroundColor: '#1b1d29'};
      }
    }
  };
  primaryTextColor = () => {
    if (this.theme == 'Light') {
      return {color: '#000000'};
    } else {
      if (this.trueDark) {
        return {color: '#ffffff'};
      } else {
        return {color: '#ffffff'};
      }
    }
  }
  secondaryTextColor = () => {
    if (this.theme == 'Light') {
      return {color: 'rgba(0,0,0,0.9)'};
    } else {
      if (this.trueDark) {
        return {color: 'rgba(255,255,255,0.9)'};
      } else {
        return {color: 'rgba(255,255,255,0.9)'};
      }
    }
  }
  tertiaryTextColor = () => {
    if (this.theme == 'Light') {
      return {color: 'rgba(0,0,0,0.7)'};
    } else {
      if (this.trueDark) {
        return {color: 'rgba(255,255,255,0.7)'};
      } else {
        return {color: 'rgba(255,255,255,0.7)'};
      }
    }
  }
  borderColor = () => {
    if (this.theme == 'Light') {
      return {borderColor: 'rgba(210,210,210, 0.9)'};
    } else {
      if (this.trueDark) {
        return {borderColor: 'rgba(80, 80, 80, 0.9)'};
      } else {
        return {borderColor: 'rgba(120, 120, 120, 0.9)'};
      }
    }
  }
  static _saveToStorage = async user => {
    try {
      await AsyncStorage.setItem ('user', JSON.stringify (user));
      return user;
    } catch (e) {
      return user;
    }
  };
  static _retrieveFromStorage = async () => {
    try {
      let storageUser = await AsyncStorage.getItem ('user');
      user = JSON.parse (storageUser);
      return new User (user);
    } catch (e) {
      return {};
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
