
import { AsyncStorage } from "react-native";


export class Assignment {
    constructor(courseObject) {
        this.id = courseObject.id || "_";
        this.topic = courseObject.topic || "_";
        this.assignmentTitle = courseObject.assignmentTitle || "";
        this.assignmentNotes = courseObject.assignmentNotes || "";
        this.dueDate = courseObject.dueDate || "";
        this.date = new Date(courseObject.date) || new Date();
        this.referenceCourse = courseObject.referenceCourse || "_";
        this.resources = courseObject.resources || [];
        this.responseResources = courseObject.responseResources || [];
    }
    toJson() {
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
        }
    }
}

export class Assignments {
    static _retrieveCompletedFromStorage = async () => {
        try {
            let completed = await AsyncStorage.getItem("completedAssignments");
            completed = JSON.parse(completed) || [];
            return completed;
        } catch(e) {
            console.log(e);
            return [];
        }
    }
    static _addCompletedToStorage = async (id) => {
        try {
            let completed = await AsyncStorage.getItem("completedAssignments");
            completed = JSON.parse(completed) || [];
            completed.push(id);
            await AsyncStorage.setItem("completedAssignments", JSON.stringify(completed));
        } catch(e) {
            console.log(e);
            return [];
        }
    }
    static _removeCompletedToStorage = async (id) => {
        try {
            let completed = await AsyncStorage.getItem("completedAssignments");
            completed = JSON.parse(completed) || [];
            completed = completed.filter(id => {
                return id !== id;
            })
            await AsyncStorage.setItem("completedAssignments", JSON.stringify(completed));
        } catch(e) {
            console.log(e);
            return [];
        }
    }
    static _saveToStorage = async (assignments) => {
        try {
            await AsyncStorage.setItem("assignments", JSON.stringify(assignments));
        } catch (e) {
            console.log(e);
            return assignments;
        }
    }
    static _retrieveFromStorage = async () => {
        try {
            let storageAssignments = await AsyncStorage.getItem("assignments");
            storageAssignments = JSON.parse(storageAssignments) || [];
            let assignments = [];
            for (var i = 0; i < storageAssignments.length; i++) {
                let assignment = new Assignment(storageAssignments[i]);
                assignments.push(assignment);
            }
            return assignments;
        } catch(e) {
            console.log(e);
            return [];
        }
    }
    static _retrieveAssignmentById = (assignments, id) => {
        try {
            for (var i = 0; i < assignments.length; i++) {
                if (assignments[i].id == id) return assignments[i];
            }
            return new Assignment();
        } catch(e) {
            return new Assignment();
        }
    }
    static _retrieveAssignmentsByTopic = (assignments, topic) => {
        try {
            let assignments = assignments.filter(assignment => {
                return assignment.topic == topic;
            })
            return assignments;
        } catch (e) {
            console.log(e);
            return [];
        }
    }
    static _retrieveAssignmentsByCourse = (assignments, course) => {
        try {
            return assignments.filter(assignment => {
                return assignment.referenceCourse == course;
            })
        } catch (e) {
            console.log(e);
            return [];
        }
    }
    static _formTopicMap = (assignments, topics) => {
        try {
            let topicsMap = {};
            for (var i = 0; i < topics.length; i++) {
                topicsMap[topics[i].id] = [];
            }
            topicsMap["_"] = [];
            for (var i = 0; i < assignments.length; i++) {
                if (topicsMap[assignments[i].topic]) {
                    topicsMap[assignments[i].topic].push(assignments[i]);
                }
            }
            if (topicsMap["_"].length == 0) {
                delete topicsMap["_"];
            }
            return topicsMap;
        } catch(e) {
            console.log(e);
            return {};
        }
    }
}

// export class Courses {
//     static _saveToStorage = async (courses) => {
//         try {
//             await AsyncStorage.setItem("courses", JSON.stringify(courses));
//             return courses;
//         } catch(e) {
//             return courses;
//         }
//     }
//     static _retrieveFromStorage = async () => {
//         try {
//             let storageCourses = await AsyncStorage.getItem("courses");
//             storageCourses = JSON.parse(storageCourses);
//             let courses = [];
//             for (var i = 0; i < storageCourses.length; i++) {
//                 let course = new Course(storageCourses[i]);
//                 courses.push(course);
//             }
//             return courses;
//         } catch(e) {
//             return [];
//         }
//     }
//     static _retrieveCourseById = async (id) => {
//         try {
//             let courses = await Courses._retrieveFromStorage();
//             for (var i = 0; i < courses.length; i++) {
//                 if (courses[i].id == id) return courses[i];
//             }
//             return new Course();
//         } catch(e) {
//             return new Course();
//         }
//     }
//     static _retrieveCoursesById = async (ids) => {
//         try {
//             let courses = [];
//             for (var i = 0; i < ids.length; i++) {
//                 let current = await Courses._retrieveCourseById(ids[i]);
//                 if (current.isReal) {
//                     courses.push(current);
//                 }
//             }
//             return courses;
//         } catch(e) {
//             return [];
//         }
//     }
// }