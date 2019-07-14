import {AsyncStorage} from 'react-native';

export class Note {
  constructor (courseObject) {
    this.id = courseObject.id || '_';
    this.topic = courseObject.topic || '_';
    this.note = courseObject.note || '';
    this.date = new Date (courseObject.date) || new Date ();
    this.referenceCourse = courseObject.referenceCourse || '_';
    this.resources = courseObject.resources || [];
  }
  toJson () {
    return {
      topic: this.topic,
      id: this.id,
      notes: this.notes,
      date: this.date,
      referenceCourse: this.referenceCourse,
      resources: this.resources,
    };
  }
}

export class Notes {
  static _saveToStorage = async notes => {
    try {
      await AsyncStorage.setItem ('notes', JSON.stringify (notes));
    } catch (e) {
      console.log (e);
      return notes;
    }
  };
  static _retrieveFromStorage = async () => {
    try {
      let storageNotes = await AsyncStorage.getItem ('notes');
      storageNotes = JSON.parse (storageNotes) || [];
      let notes = [];
      for (var i = 0; i < storageNotes.length; i++) {
        let note = new Note (storageNotes[i]);
        notes.push (note);
      }
      return notes;
    } catch (e) {
      console.log (e);
      return [];
    }
  };
  static _retrieveNotesById = (notes, id) => {
    try {
      for (var i = 0; i < notes.length; i++) {
        if (notes[i].id == id) return notes[i];
      }
      return new Note ();
    } catch (e) {
      console.log (e);
      return new Note ();
    }
  };
  static _RetrieveNotesByTopic = (notes, topic) => {
    try {
      let notes = notes.filter (notes => {
        return notes.topic == topic;
      });
      return notes;
    } catch (e) {
      console.log (e);
      return [];
    }
  };
  static _retrieveNotesByCourse = (notes, course) => {
    try {
      return notes.filter (notes => {
        return notes.referenceCourse == course;
      });
    } catch (e) {
      console.log (e);
      return [];
    }
  };
  static _formTopicMap = (notes, topics) => {
    try {
      let topicsMap = {};
      for (var i = 0; i < topics.length; i++) {
        topicsMap[topics[i].id] = [];
      }
      topicsMap['_'] = [];
      for (var i = 0; i < notes.length; i++) {
        if (topicsMap[notes[i].topic]) {
          topicsMap[notes[i].topic].push (notes[i]);
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
  static _formDateMap = notes => {
    try {
      let datesMap = {};
      for (var i = 0; i < notes.length; i++) {
        let date = `${notes[i].date.getFullYear ()}_${notes[i].date.getMonth ()}_${notes[i].date.getDate ()}`;
        if (datesMap[date]) {
          datesMap[date].push (notes[i]);
        } else {
          datesMap[date] = [notes[i]];
        }
      }
      return datesMap;
    } catch (e) {
      console.log (e);
      return {};
    }
  };
}
