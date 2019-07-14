import {AsyncStorage} from 'react-native';

export class Topic {
  constructor (topic) {
    this.id = topic.id;
    this.topic = topic.topic;
    this.course = topic.course;
  }
  toJson () {
    return {
      topic: this.topic,
      id: this.id,
      course: this.course,
    };
  }
}

export class Topics {
  static _saveToStorage = async topics => {
    try {
      await AsyncStorage.setItem ('topics', JSON.stringify (topics));
      return topics;
    } catch (e) {
      console.log (e);
      return topics;
    }
  };
  static _retrieveFromStorage = async () => {
    try {
      let storageTopics = await AsyncStorage.getItem ('topics');
      storageTopics = JSON.parse (storageTopics) || [];
      let topics = [];
      for (var i = 0; i < storageTopics.length; i++) {
        let topic = new Topic (storageTopics[i]);
        topics.push (topic);
      }
      return topics;
    } catch (e) {
      console.log (e);
      return [];
    }
  };
  static _makeTopicMap (topics) {
    let topicMap = {};
    for (var i = 0; i < topics.length; i++) {
      topicMap[topics[i].id] = topics[i];
    }
    return topicMap;
  }
  static _makeCourseTopicMap (course, topics) {
    return Topics._makeTopicMap (
      topics.filter (topic => {
        return topic.course == course;
      })
    );
  }
  static _MakeCourseTopicList (course, topics) {
    return topics.filter (topic => {
      return topic.course == course;
    });
  }
}
