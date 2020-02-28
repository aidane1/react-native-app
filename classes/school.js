import {AsyncStorage} from 'react-native';

//format for schedule is:
// An array of objects {keys day1 through 5} where the values are days of the week which are arrays of objects which contain {startMinute, endMinute, startHour, endHour, blockLetter}
//ex:
//[{day1: [{block: 'A', startHour: 9, startMinute: 10, endHour: 10, endMinute: 12}], day2: [{block: 'A', startHour: 9, startMinute: 10, endHour: 10, endMinute: 12}], day3: [{block: 'A', startHour: 9, startMinute: 10, endHour: 10, endMinute: 12}], day4: [{block: 'A', startHour: 9, startMinute: 10, endHour: 10, endMinute: 12}], day5: [{block: 'A', startHour: 9, startMinute: 10, endHour: 10, endMinute: 12}]}]

export class School {
  constructor (school) {
    this.blocks = school.blocks;
    this.dayMap = school.dayMap;
    this.schedule = school.schedule;
    console.log({spareName: school.spareName || "Spare"});
    console.log(school.spareName);
    this.spareName = school.spareName || "Spare";
    this.id = school.id;
    this.dayTitles = school.dayTitles;
    this.rawSchedule = school.rawSchedule;
    this.grades = school.grades || [9, 10, 11, 12];
    this.name = school.name || '';
    this.district = school.district || '';
    this.day_titles = school.day_titles || [
      {
        day_1: 'Monday',
        day_2: 'Tuesday',
        day_3: 'Wednesday',
        day_4: 'Thursday',
        day_5: 'Friday',
      },
    ];
  }
  toString () {
    return {
      blocks: this.blocks,
      schedule: this.schedule,
      spareName: this.spareName,
      id: this.id,
      dayTitles: this.dayTitles,
      rawSchedule: this.rawSchedule,
      grades: this.grades,
      name: this.name,
      district: this.district,
      day_titles: this.day_titles,
    };
  }

  static _saveToStorage = async school => {
    try {
      await AsyncStorage.setItem ('school', JSON.stringify (school));
      school = await School._retrieveFromStorage ();
      return school;
    } catch (e) {
      return school;
    }
  };
  static _retrieveFromStorage = async () => {
    try {
      let storageSchool = await AsyncStorage.getItem ('school');
      storageSchool = JSON.parse (storageSchool);
      return new School (storageSchool);
    } catch (e) {
      console.log (e);
      return {};
    }
  };
}

export class DayBlock {
  constructor (block) {
    this.block = block.block;
    this.constant = block.constant;
    this.startHour = block.startHour;
    this.startMinute = block.startMinute;
    this.endHour = block.endHour;
    this.endMinute = block.endMinute;
  }
  toString () {
    return {
      block: this.block,
      startHour: this.startHour,
      endHour: this.endHour,
      startMinute: this.startMinute,
      endMinute: this.endMinute,
    };
  }
  toTimeString = () => {
    return `${(this.startHour + 11) % 12 + 1}:${this.startMinute < 10 ? '0' + this.startMinute.toString () : this.startMinute.toString ()} - ${(this.endHour + 11) % 12 + 1}:${this.endMinute < 10 ? '0' + this.endMinute.toString () : this.endMinute.toString ()}`;
  };
}
