import {AsyncStorage} from 'react-native';

export class Course {
  constructor (courseObject) {
    this.course = 'Spare';
    this.id = '_';
    this.block = '_';
    this.teacher = 'Free';
    this.category = 'other';
    this.school = '_';
    this.semester = '_';
    this.isReal = false;
    this.constant = false;
    let keys = [
      'course',
      'id',
      'block',
      'teacher',
      'category',
      'school',
      'semester',
      'constant',
    ];
    let indexCount = 0;
    for (var key in courseObject) {
      if (keys.indexOf (key) >= 0) {
        indexCount++;
        this[key] = courseObject[key];
      }
    }
    if (indexCount >= 7) {
      this.isReal = true;
    }
  }
  toJson () {
    if (this.isReal) {
      return {
        course: this.course,
        id: this.id,
        block: this.block,
        teacher: this.teacher,
        category: this.category,
        school: this.school,
        semester: this.semester,
      };
    } else {
      return {};
    }
  }
}

export class Courses {
  static _saveToStorage = async courses => {
    try {
      await AsyncStorage.setItem ('courses', JSON.stringify (courses));
      return courses;
    } catch (e) {
      return courses;
    }
  };
  static _retrieveFromStorage = async () => {
    try {
      let storageCourses = await AsyncStorage.getItem ('courses');
      storageCourses = JSON.parse (storageCourses);
      let courses = [];
      for (var i = 0; i < storageCourses.length; i++) {
        let course = new Course (storageCourses[i]);
        courses.push (course);
      }
      return courses;
    } catch (e) {
      return [];
    }
  };
  static _retrieveCourseById = async id => {
    try {
      let courses = await Courses._retrieveFromStorage ();
      for (var i = 0; i < courses.length; i++) {
        if (courses[i].id == id) return courses[i];
      }
      return new Course ();
    } catch (e) {
      console.log (e);
      return new Course ();
    }
  };
  static _retrieveCoursesById = async ids => {
    try {
      let courses = [];
      for (var i = 0; i < ids.length; i++) {
        let current = await Courses._retrieveCourseById (ids[i]);
        if (current.isReal) {
          courses.push (current);
        }
      }
      return courses;
    } catch (e) {
      return [];
    }
  };
}
