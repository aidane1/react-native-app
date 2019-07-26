import {Assignment, Assignments} from '../classes/assignments';

import {ImportantDate, ImportantDates} from '../classes/importantDates';

import {Note, Notes} from '../classes/notes';

import {Topic, Topics} from '../classes/topics';

import {Course, Courses} from '../classes/courses';

import {Semester, Semesters} from '../classes/semesters';

import {Event, Events} from '../classes/events';

import {User} from '../classes/user';

import {School, DayBlock} from '../classes/school';

export function constructCourseList (serverData) {
  let courses = [];
  for (var i = 0; i < serverData.length; i++) {
    serverData[i].id = serverData[i]._id;
    let current = new Course (serverData[i]);
    courses.push (current);
  }
  return courses;
}

export function constructSemesterList (serverData) {
  let semesters = [];
  for (var i = 0; i < serverData.length; i++) {
    serverData[i].id = serverData[i]._id;
    let current = new Semester (serverData[i]);
    semesters.push (current);
  }
  return semesters;
}

export function constructEventList (serverData) {
  let events = serverData.map (event => new Event (event));
  return events;
}

export function constructSchoolObject (serverData, blocks) {
  serverData.blocks = blocks;
  return {
    schedule: serverData.schedule,
    grades: serverData.grades,
    rawSchedule: serverData.rawSchedule,
    dayMap: serverData['year_day_object'],
    blocks: serverData['blocks'],
    spareName: serverData['spare_name'],
    dayTitles: serverData['day_titles'],
    id: serverData._id,
    name: serverData.name,
    district: serverData.district,
    day_titles: serverData.day_titles,
  };
}

export function constructUserObject (serverData) {
  let user = new User (serverData);
  return user;
}

export function constructTopicList (serverData) {
  let topics = [];
  for (var i = 0; i < serverData.length; i++) {
    serverData[i].id = serverData[i]._id;
    let current = new Topic (serverData[i]);
    topics.push (current);
  }
  return topics;
}
