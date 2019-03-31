import { Ionicons, Entypo, AntDesign, FontAwesome, MaterialIcons, EvilIcons, Feather, MaterialCommunityIcons} from '@expo/vector-icons';
import React from 'react';
import {
    View,
  } from 'react-native';

class IconBlock {
    constructor(icon) {

    }
}
export class HomeIcon extends React.Component {
    render() {
        return (<FontAwesome color="white"  name="home" size={16} {...this.props}></FontAwesome>)
    }
}
export class CoursesIcon extends React.Component {
    render() {
        return (<Ionicons color="white" name="ios-list-box" size={16} {...this.props}></Ionicons>)
    }
}
export class ScheduleIcon extends React.Component {
    render() {
        return (<Entypo color="white" name="calendar" size={16} {...this.props}></Entypo>)
    }
}
export class CalendarIcon extends React.Component {
    render() {
        return (<FontAwesome color="white" name="calendar" size={16} {...this.props}></FontAwesome>)
    }
}
export class AccountIcon extends React.Component {
    render() {
        return (<MaterialIcons color="white" name="account-circle" size={16} {...this.props}></MaterialIcons>)
    }
}
export class EmptyIcon extends React.Component {
    render() {
        return (<View style={{width: this.props.width, height: this.props.height}}></View>)
    }
}
export class PasswordIcon extends React.Component {
    render() {
        return (<Ionicons color="white" name="ios-key" size={16} {...this.props}></Ionicons>)
    }
}
export class UsernameIcon extends React.Component {
    render() {
        return (<Feather color="white" name="user" size={16} {...this.props}></Feather>)
    }
}
export class SchoolIcon extends React.Component {
    render() {
        return (<Ionicons color="white" name='ios-school' size={16} {...this.props}></Ionicons>)
    }
}

export class LeftIcon extends React.Component {
    render() {
        return (<Entypo color="white" name="chevron-left" size={16} {...this.props}></Entypo>)
    }
}

export class RightIcon extends React.Component {
    render() {
        return (<Entypo color="white" name="chevron-right" size={16} {...this.props}></Entypo>)
    }
}

export class CourseIcon extends React.Component {
    render() {
        return (<FontAwesome color="white" name="cubes" size={16} {...this.props}></FontAwesome>)
    }
}

export class EventsIcon extends React.Component {
    render() {
        return (<MaterialIcons color="white" name="event" size={16} {...this.props}></MaterialIcons>)
    }
}

export class LogoutIcon extends React.Component {
    render() {
        return (<MaterialCommunityIcons color="white" name="logout" size={16} {...this.props}></MaterialCommunityIcons>)
    }
}

export class NotesIcon extends React.Component {
    render() {
        return (<Ionicons color="white" name="ios-paper" size={16} {...this.props}></Ionicons>)
    }
}

export class AssignmentsIcon extends React.Component {
    render() {
        return (<MaterialIcons color="white" name="assignment" size={16} {...this.props}></MaterialIcons>)
    }
}

export class SchoolAssignmentsIcon extends React.Component {
    render() {
        return (<FontAwesome color="white" name="check" size={16} {...this.props}></FontAwesome>)
    }
}

export class BeforeSchoolIcon extends React.Component {
    render() {
        return (<FontAwesome color="white" name="coffee" size={16} {...this.props}></FontAwesome>)
    }
}

export class LunchTimeIcon extends React.Component {
    render() {
        return (<FontAwesome color="white" name="cutlery" size={16} {...this.props}></FontAwesome>)
    }
}

export class AfterSchoolIcon extends React.Component {
    render() {
        return (<Ionicons color="white" name="ios-moon" size={16} {...this.props}></Ionicons>)
    }
}

export class BlockColoursIcon extends React.Component {
    render() {
        return (<Entypo color="white" name="palette" size={16} {...this.props}></Entypo>)
    }
}

export class BlockNamesIcon extends React.Component {
    render() {
        return (<FontAwesome color="white" name="pencil-square" size={16} {...this.props}></FontAwesome>)
    }
}
