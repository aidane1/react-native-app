import { AsyncStorage } from "react-native";

import { Event } from "./events";

export class Day {
    constructor(day) {
        this.scheduleWeek = day.scheduleDay;
        this.scheduleDay = day.scheduleWeek;
        let eventsList = [];
        for (var i = 0; i < day.events.length; i++) {
            let event = new Event(day.events[i]);
            eventsList.push(event);
        }
        this.events = eventsList;
        this.dayDisplayed = day.dayDisplayed;
        this.hasEvents = day.hasEvents;
    }
    toJson() {
        return {
            scheduleWeek: this.scheduleWeek,
            scheduleDay: this.scheduleDay,
            events: this.events,
            dayDisplayed: this.dayDisplayed,
            hasEvents: this.hasEvents,
        }
    }
}

export class Days {
    static _saveToStorage = async (dayMap) => {
        try {
            await AsyncStorage.setItem("days", JSON.stringify(dayMap));
            return dayMap;
        } catch(e) {
            return dayMap;
        }
    }
    static _retrieveFromStorage = async () => {
        try {
            let storageDays = await AsyncStorage.getItem("days");
            storageDays = JSON.parse(storageDays);
            let days = {};
            for (var key in storageDays) {
                let day = new Day(storageDays[key]);
                days[key] = day;
            }
            return days;
        } catch(e) {
            return {};
        }
    }
}