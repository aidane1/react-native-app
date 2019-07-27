import {AsyncStorage} from 'react-native';

export class Assignment {
  constructor (courseObject) {
    this.id = courseObject.id || '_';
    this.topic = courseObject.topic || '_';
    this.assignmentTitle = courseObject.assignmentTitle || '';
    this.assignmentNotes = courseObject.assignmentNotes || '';
    this.dueDate = courseObject.dueDate || '';
    this.date = new Date (courseObject.date) || new Date ();
    this.referenceCourse = courseObject.referenceCourse || '_';
    this.resources = courseObject.resources || [];
    this.responseResources = courseObject.responseResources || [];
    this.helpful = courseObject.helpful || 0;
    this.unhelpful = courseObject.unhelpful || 0;
    this.userVote = courseObject.userVote || 0; // -1, 0, 1
    this.uploaded_by = courseObject.uploaded_by;
    this.username = courseObject.username;
  }
  toJson () {
    return {
      topic: this.topic,
      id: this.id,
      assignmentTitle: this.assignmentTitle,
      assignmentNotes: this.assignmentNotes,
      dueDate: this.dueDate,
      date: this.date,
      referenceCourse: this.referenceCourse,
      resources: this.resources,
      responseResources: this.responseResources,
      helpful: this.helpful, 
      unhelpful: this.unhelpful,
      userVote: this.userVote,
      uploaded_by: this.uploaded_by,
      username: this.username,
      username: this.username,
    };
  }
}

export class Assignments {
  static _retrieveCompletedFromStorage = async () => {
    try {
      let completed = await AsyncStorage.getItem ('completedAssignments');
      completed = JSON.parse (completed) || [];
      return completed;
    } catch (e) {
      console.log (e);
      return [];
    }
  };
  static _addCompletedToStorage = async id => {
    try {
      let completed = await AsyncStorage.getItem ('completedAssignments');
      completed = JSON.parse (completed) || [];
      completed.push (id);
      await AsyncStorage.setItem (
        'completedAssignments',
        JSON.stringify (completed)
      );
    } catch (e) {
      console.log (e);
      return [];
    }
  };
  static _removeCompletedToStorage = async id => {
    try {
      let completed = await AsyncStorage.getItem ('completedAssignments');
      completed = JSON.parse (completed) || [];
      completed = completed.filter (id => {
        return id !== id;
      });
      await AsyncStorage.setItem (
        'completedAssignments',
        JSON.stringify (completed)
      );
    } catch (e) {
      console.log (e);
      return [];
    }
  };
  static _saveToStorage = async assignments => {
    try {
      await AsyncStorage.setItem ('assignments', JSON.stringify (assignments));
    } catch (e) {
      console.log (e);
      return assignments;
    }
  };
  static _retrieveFromStorage = async () => {
    try {
      let storageAssignments = await AsyncStorage.getItem ('assignments');
      storageAssignments = JSON.parse (storageAssignments) || [];
      let assignments = [];
      for (var i = 0; i < storageAssignments.length; i++) {
        let assignment = new Assignment (storageAssignments[i]);
        assignments.push (assignment);
      }
      return assignments;
    } catch (e) {
      console.log (e);
      return [];
    }
  };
  static _retrieveAssignmentById = (assignments, id) => {
    try {
      for (var i = 0; i < assignments.length; i++) {
        if (assignments[i].id == id) return assignments[i];
      }
      return new Assignment ();
    } catch (e) {
      return new Assignment ();
    }
  };
  static _retrieveAssignmentsByTopic = (assignments, topic) => {
    try {
      let assignments = assignments.filter (assignment => {
        return assignment.topic == topic;
      });
      return assignments;
    } catch (e) {
      console.log (e);
      return [];
    }
  };
  static _retrieveAssignmentsByCourse = (assignments, course) => {
    try {
      return assignments.filter (assignment => {
        return assignment.referenceCourse == course;
      });
    } catch (e) {
      console.log (e);
      return [];
    }
  };
  static _formTopicMap = (assignments, topics) => {
    try {
      let topicsMap = {};
      for (var i = 0; i < topics.length; i++) {
        topicsMap[topics[i].id] = [];
      }
      topicsMap['_'] = [];
      for (var i = 0; i < assignments.length; i++) {
        if (topicsMap[assignments[i].topic]) {
          topicsMap[assignments[i].topic].push (assignments[i]);
        }
      }
      for (var key in topicsMap) {
        if (topicsMap[key].length == 0) delete topicsMap[key];
      }
      return topicsMap;
    } catch (e) {
      console.log (e);
      return {};
    }
  };
}
