import {AsyncStorage} from 'react-native';

import {Course, Courses} from './courses';
export class Semester {
  constructor (semester) {
    this.id = semester.id;
    this.startDate = new Date (semester.startDate);
    this.endDate = new Date (semester.endDate);
    this.name = semester.name;
  }
  toJson () {
    return {
      id: this.id,
      startDate: this.startDate,
      endDate: this.endDate,
      name: this.name,
    };
  }
}

export class Semesters {
  static _saveToStorage = async semesters => {
    try {
      await AsyncStorage.setItem ('semesters', JSON.stringify (semesters));
      semesters = await Semesters._retrieveFromStorage();
      return semesters;
    } catch (e) {
      return semesters;
    }
  };

  static _retrieveFromStorage = () => {
    return new Promise (async (resolve, reject) => {
      try {
        let storageSemesters = await AsyncStorage.getItem ('semesters');
        storageSemesters = JSON.parse (storageSemesters);
        let semesters = [];
        for (var i = 0; i < storageSemesters.length; i++) {
          let semester = new Semester (storageSemesters[i]);
          semesters.push (semester);
        }
        resolve (semesters);
      } catch (e) {
        reject (e);
      }
    });
  };

  static _createSemesterMap = (courses, blocks) => {
    return new Promise (async (resolve, reject) => {
      try {
        let semesters = await Semesters._retrieveFromStorage ();
        let semesterMap = {};
        for (var i = 0; i < semesters.length; i++) {
          let currentSemesterList = [];
          for (var j = 0; j < courses.length; j++) {
            if (courses[j].semester == semesters[i].id)
              currentSemesterList.push (courses[j]);
          }
          let currentSemester = {};
          for (var j = 0; j < blocks.length; j++) {
            if (blocks[j].is_constant) {
              currentSemester[blocks[j]._id] = new Course ({
                constant: true,
                course: blocks[j].block,
                block: blocks[j]._id,
              });
            } else {
              currentSemester[blocks[j]._id] = new Course ({
                course: "LC's",
                block: blocks[j]._id,
              });
            }
          }
          for (var j = 0; j < currentSemesterList.length; j++) {
            currentSemester[currentSemesterList[j].block] =
              currentSemesterList[j];
          }
          semesterMap[semesters[i].id] = currentSemester;
        }
        resolve (semesterMap);
      } catch (e) {
        reject (e);
      }
    });
  };

  static _createCoursesOnDate = async (courses, blocks, semesters) => {
    try {
      let totalSemesterMap = await Semesters._createSemesterMap (
        courses,
        blocks
      );
      let currentMap = {};
      for (var j = 0; j < blocks.length; j++) {
        if (blocks[j][1] == 'changing') {
          currentMap[blocks[j][0]] = new Course ({
            course: "LC's",
            block: blocks[j][0],
          });
        } else {
          currentMap[blocks[j][0]] = new Course ({
            constant: true,
            course: blocks[j][0],
            block: blocks[j][0],
          });
        }
      }
      for (var i = 0; i < semesters.length; i++) {
        let currentSemester = totalSemesterMap[semesters[i].id];
        for (var key in currentSemester) {
          if (currentSemester[key].isReal || currentSemester[key].constant) {
            currentMap[key] = currentSemester[key];
          }
        }
      }
      return currentMap;
    } catch (e) {
      return {};
    }
  };

  static _currentSemesters = async () => {
    let currentDate = new Date ();
    let semesters = await Semesters._retrieveFromStorage ();
    let currentSemesters = [];
    for (var i = 0; i < semesters.length; i++) {
      if (
        semesters[i].startDate.getTime () < currentDate.getTime () &&
        semesters[i].endDate.getTime () > currentDate.getTime ()
      ) {
        currentSemesters.push (semesters[i]);
      }
    }
    return currentSemesters;
  };

  static _semestersOnDate = async date => {
    try {
      let currentDate = date;
      let semesters = await Semesters._retrieveFromStorage ();
      let currentSemesters = [];
      for (var i = 0; i < 3; i++) {
        if (
          semesters[i].startDate.getTime () < currentDate.getTime () &&
          semesters[i].endDate.getTime () > currentDate.getTime ()
        ) {
          currentSemesters.push (semesters[i]);
        }
      }
      return currentSemesters;
    } catch (e) {
      return [];
    }
  };

  static _startAndEndDate = async () => {
    try {
      let semesters = await Semesters._retrieveFromStorage ();
      let startDate = semesters[0].startDate;
      let endDate = semesters[0].endDate;
      for (var i = 0; i < semesters.length; i++) {
        if (semesters[i].startDate.getTime () < startDate.getTime ()) {
          startDate = semesters[i].startDate;
        }
        if (semesters[i].endDate.getTime () > endDate.getTime ()) {
          endDate = semesters[i].endDate;
        }
      }
      return {
        startDate,
        endDate,
      };
    } catch (e) {
      return {
        startDate: new Date (),
        endDate: new Date (),
      };
    }
  };
}
