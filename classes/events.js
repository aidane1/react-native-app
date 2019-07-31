import {AsyncStorage} from 'react-native';

export class Event {
  constructor (event) {
    this._id = event._id;
    this.event_date = new Date (event.event_date);
    this.title = event.title;
    this.time = event.time;
    this.school_in = event.school_in !== undefined ? event.school_in : true;
  }
  toJson () {
    return {
      time: this.time,
      title: this.title,
      event_date: this.event_date.toISOString (),
      _id: this._id,
      school_in: this.school_in,
    };
  }
}

export class Events {
  static _saveToStorage = async events => {
    try {
      await AsyncStorage.setItem ('events', JSON.stringify (events));
      events = await Events._retrieveFromStorage ();
      return events;
    } catch (e) {
      return events;
    }
  };
  static _retrieveFromStorage = async () => {
    try {
      let storageEvents = await AsyncStorage.getItem ('events');
      storageEvents = JSON.parse (storageEvents);
      let events = [];
      for (var i = 0; i < storageEvents.length; i++) {
        let event = new Event (storageEvents[i]);
        events.push (event);
      }
      return events;
    } catch (e) {
      return [];
    }
  };
}
