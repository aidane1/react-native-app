import { AsyncStorage } from "react-native";


export class User {
    constructor(user) {
        this.username = user.username;
        this.password = user.password;
        this["x-api-key"] = user["x-api-key"];
        this["x-id-key"] = user["x-id-key"];
        this.courses = user.courses;
        this.school = user.school;
    }
    toString() {
        return {
            username: this.username,
            password: this.password,
            courses: this.courses,
            "x-api-key": this["x-api-key"],
            "x-id-key": this["x-id-key"],
            school: this.school
        }
    }
    static _saveToStorage = async (user) => {
        try {
            await AsyncStorage.setItem("user", JSON.stringify(user));
            return user;
        } catch(e) {
            return user;
        }
    }
    static _retrieveFromStorage = async () => {
        try {
            let storageUser = await AsyncStorage.getItem("user");
            user = JSON.parse(storageUser);
            return new User(user);
        } catch(e) {
            return {};
        }
    }
    static _isLoggedIn = async () => {
        try {
            let loggedIn = await AsyncStorage.getItem("loggedIn");
            return (loggedIn === "true");
        } catch(e) {
            return false;
        }
    }
    static _setLoginState = async (state) => {
        try {
            await AsyncStorage.setItem("loggedIn", state ? "true" : "false");
            return state;
        } catch(e) {
            return false;
        }
    }
}

