import {AsyncStorage} from 'react-native';

export class ImportantDate {
  constructor (courseObject) {
    this._id = courseObject._id || '_';
    this.title = courseObject.title || '';
    this.date_of_event = new Date(courseObject.date_of_event) || new Date ();
    this.date = new Date (courseObject.date) || new Date ();
    this.type = courseObject.type || "";
    this.reference_course = courseObject.reference_course || '_';
    this.resources = courseObject.resources || [];
    this.helpful_votes = courseObject.helpful_votes || 0;
    this.unhelpful_votes = courseObject.unhelpful_votes || 0;
    this.userVote = courseObject.userVote || 0; // -1, 0, 1
    this.uploaded_by = courseObject.uploaded_by;
    this.username = courseObject.username;
  }
  toJson () {
    return {
      _id: this._id,
      title: this.title,
      date_of_event: this.date_of_event,
      date: this.date,
      reference_course: this.reference_course,
      resources: this.resources,
      helpful_votes: this.helpful_votes,
      unhelpful_votes: this.unhelpful_votes,
      userVote: this.userVote,
      uploaded_by: this.uploaded_by,
      type: this.type,
      username: this.username,
    };
  }
}

export class ImportantDates {
  static _saveToStorage = async dates => {
    try {
      await AsyncStorage.setItem ('important_dates', JSON.stringify (dates));
      dates = await ImportantDates._retrieveFromStorage();
      return dates;
    } catch (e) {
      console.log (e);
      return dates;
    }
  };
  static _retrieveFromStorage = async () => {
    try {
      let storageDates = await AsyncStorage.getItem ('important_dates');
      storageDates = JSON.parse (storageDates) || [];
      let dates = [];
      for (var i = 0; i < storageDates.length; i++) {
        let date = new ImportantDate (storageDates[i]);
        dates.push (date);
      }
      return dates;
    } catch (e) {
      console.log (e);
      return [];
    }
  };
  //   static _retrieveAssignmentById = (assignments, id) => {
  //     try {
  //       for (var i = 0; i < assignments.length; i++) {
  //         if (assignments[i].id == id) return assignments[i];
  //       }
  //       return new Assignment ();
  //     } catch (e) {
  //       return new Assignment ();
  //     }
  //   };
  //   static _retrieveAssignmentsByTopic = (assignments, topic) => {
  //     try {
  //       let assignments = assignments.filter (assignment => {
  //         return assignment.topic == topic;
  //       });
  //       return assignments;
  //     } catch (e) {
  //       console.log (e);
  //       return [];
  //     }
  //   };
  static _retrieveDatesByCourse = (dates, course) => {
    try {
      return dates.filter (date => {
        return date.reference_course == course;
      });
    } catch (e) {
      console.log (e);
      return [];
    }
  };
  //   static _formTopicMap = (assignments, topics) => {
  //     try {
  //       let topicsMap = {};
  //       for (var i = 0; i < topics.length; i++) {
  //         topicsMap[topics[i].id] = [];
  //       }
  //       topicsMap['_'] = [];
  //       for (var i = 0; i < assignments.length; i++) {
  //         if (topicsMap[assignments[i].topic]) {
  //           topicsMap[assignments[i].topic].push (assignments[i]);
  //         }
  //       }
  //       for (var key in topicsMap) {
  //         if (topicsMap[key].length == 0) delete topicsMap[key];
  //       }
  //       return topicsMap;
  //     } catch (e) {
  //       console.log (e);
  //       return {};
  //     }
  //   };
}
