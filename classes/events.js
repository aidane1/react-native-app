import { AsyncStorage } from "react-native";

export class Event {
    constructor(event) {
        this.id = event.id;
        this.date = event.date;
        this.dayRolled = event.dayRolled;
        this.displayedEvent = event.displayedEvent;
        this.info = event.info;
        this.time = event.time;
    }
    toJson() {
        return {
            id: this.id,
            date: this.date,
            dayRolled: this.dayRolled,
            displayedEvent: this.displayedEvent,
            info: this.info,
            time: this.time
        }
    }
}

export class Events {
    static _saveToStorage = async (events) => {
        try {
            await AsyncStorage.setItem("events", JSON.stringify(events));
            return events;
        } catch(e) {
            return events;
        }
    }
    static _retrieveFromStorage = async () => {
        try {
            let storageEvents = await AsyncStorage.getItem("events");
            storageEvents = JSON.parse(storageEvents);
            let events = [];
            for (var i = 0; i < storageEvents.length; i++) {
                let event = new Semester(storageEvents[i]);
                events.push(event);
            }
            return events;
        } catch(e) {
            return [];
        }
    }
}