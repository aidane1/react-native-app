import { Ionicons, Entypo, AntDesign, FontAwesome, MaterialIcons, EvilIcons, Feather, MaterialCommunityIcons} from '@expo/vector-icons';
import React from 'react';
import {
    View,
  } from 'react-native';

class IconBlock {
    constructor(icon) {

    }
}

export class XIcon extends React.Component {
    render() {
        return (
            <Entypo color="white" name="cross" size={16} {...this.props}></Entypo>
        )
    }
}
export class CameraIcon extends React.Component {
    render() {
        return (
            <Entypo color="white" name="camera" size={16} {...this.props}></Entypo>
        )
    }
}
export class PhotoIcon extends React.Component {
    render() {
        return (
            <FontAwesome color="white" name="photo" size={16} {...this.props}></FontAwesome>
        )
    }
}
export class CloseIcon extends React.Component {
    render() {
        return (
            <AntDesign color="white" name="closecircleo" size={16} {...this.props}></AntDesign>
        )
    }
}
export class CheckBoxFilledIcon extends React.Component {
    render() {
        return (
            <FontAwesome color="white" name="check-circle" {...this.props}></FontAwesome>
        )
    }
}
export class CheckBoxOpenIcon extends React.Component {
    render() {
        return (
            <FontAwesome color="white" name="circle-o" {...this.props}></FontAwesome>
        )
    }
}
export class PlusIcon extends React.Component {
    render() {
        return (
            <FontAwesome color="white" name="plus" size={16} {...this.props}></FontAwesome>
        )
    }
}
export class ConfirmIcon extends React.Component {
    render() {
        return (
            <FontAwesome color="white" name="check-circle" {...this.props}></FontAwesome>
        )
    }
}
export class RefreshIcon extends React.Component {
    render() {
        return (
            <Ionicons name="ios-refresh" color="white" size={16} {...this.props}></Ionicons>
        )
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

export class DownIcon extends React.Component {
    render() {
        return (<Entypo color="white" name="chevron-down" size={16} {...this.props}></Entypo>)
    }
}

export class UpIcon extends React.Component {
    render() {
        return (<Entypo color="white" name="chevron-up" size={16} {...this.props}></Entypo>)
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
export class SocialsIcon extends React.Component {
    render() {
        return (<Entypo color="white" name="map" size={16} {...this.props}></Entypo>)
    }
}
export class LanguageIcon extends React.Component {
    render() {
        return (<FontAwesome color="white" name="book" size={16} {...this.props}></FontAwesome>)
    }
}
export class ScienceIcon extends React.Component {
    render() {
        return (<MaterialCommunityIcons color="white" name="beaker" size={16} {...this.props}></MaterialCommunityIcons>)
    }
}
export class MathIcon extends React.Component {
    render() {
        return (<Ionicons color="white" name="ios-calculator" size={16} {...this.props}></Ionicons>)
    }
}
export class AppliedSkillsIcon extends React.Component {
    render() {
        return (<FontAwesome color="white" name="gears" size={16} {...this.props}></FontAwesome>)
    }
}
export class CareerAndPlanningIcon extends React.Component {
    render() {
        return (<Entypo color="white" name="briefcase" size={16} {...this.props}></Entypo>)
    }
}
export class EnglishIcon extends React.Component {
    render() {
        return (<Entypo color="white" name="open-book" size={16} {...this.props}></Entypo>)
    }
}
export class PhysicalEducationIcon extends React.Component {
    render() {
        return (<Ionicons color="white" name="ios-basketball" size={16} {...this.props}></Ionicons>)
    }
}
export class OtherIcon extends React.Component {
    render() {
        return (<FontAwesome color="white" name="question" size={16} {...this.props}></FontAwesome>)
    }
}
export class NotApplicableIcon extends React.Component {
    render() {
        return (<MaterialCommunityIcons color="white" name="file-hidden" size={16} {...this.props}></MaterialCommunityIcons>)
    }
}
export class FineArtsIcon extends React.Component {
    render() {
        return (<FontAwesome color="white" name="paint-brush" size={16} {...this.props}></FontAwesome>)
    }
}
export class InfoTechIcon extends React.Component {
    render() {
        return (<MaterialIcons color="white" name="computer" size={16} {...this.props}></MaterialIcons>)
    }
}

export class GenericIcon extends React.Component {
    render() {
        switch (this.props.icon) {
            case "SocialsIcon":
                return (<SocialsIcon {...this.props}></SocialsIcon>)
            case "LanguageIcon":
                return (<LanguageIcon {...this.props}></LanguageIcon>)
            case "ScienceIcon":
                return (<ScienceIcon {...this.props}></ScienceIcon>)
            case "MathIcon":
                return (<MathIcon {...this.props}></MathIcon>)
            case "AppliedSkillsIcon":
                return (<AppliedSkillsIcon {...this.props}></AppliedSkillsIcon>)
            case "CareerAndPlanningIcon":
                return (<CareerAndPlanningIcon {...this.props}></CareerAndPlanningIcon>)
            case "EnglishIcon":
                return (<EnglishIcon {...this.props}></EnglishIcon>)
            case "PhysicalEducationIcon":
                return (<PhysicalEducationIcon {...this.props}></PhysicalEducationIcon>)
            case "OtherIcon":
                return (<OtherIcon {...this.props}></OtherIcon>)
            case "NotApplicableIcon":
                return (<NotApplicableIcon {...this.props}></NotApplicableIcon>)
            case "FineArtsIcon":
                return (<FineArtsIcon {...this.props}></FineArtsIcon>)
            case "InfoTechIcon":
                return (<InfoTechIcon {...this.props}></InfoTechIcon>);
            default:
                return (<OtherIcon {...this.props}></OtherIcon>);
        }
    }
}

export class SchoolIcons {
    constructor() {
        this.icons = {
            "socialstudies": ["SocialsIcon", "#FFF176"],
            "language": ["LanguageIcon", "#4a79c4"],
            "science": ["ScienceIcon", "#81c784"],
            "math": ["MathIcon", "#f44242"],
            "appliedskills": ["AppliedSkillsIcon", "orange"],
            "careerandplanning": ["CareerAndPlanningIcon", "#ffbae6"],
            "english": ["EnglishIcon", "#89cff0"],
            "physicaleducation": ["PhysicalEducationIcon", "#ccc"],
            "other": ["OtherIcon", "white"],
            "na": ["NotApplicableIcon", "white"],
            "finearts": ["FineArtsIcon", "#d291ff"],
            "infotech.": ["InfoTechIcon", "#52c97a"]
        }   
    }
    static getIcon = (icon) => {
        let icons = {
            "socialstudies": ["SocialsIcon", "#FFF176"],
            "language": ["LanguageIcon", "#4a79c4"],
            "science": ["ScienceIcon", "#81c784"],
            "math": ["MathIcon", "#f44242"],
            "appliedskills": ["AppliedSkillsIcon", "orange"],
            "careerandplanning": ["CareerAndPlanningIcon", "#ffbae6"],
            "english": ["EnglishIcon", "#89cff0"],
            "physicaleducation": ["PhysicalEducationIcon", "#ccc"],
            "other": ["OtherIcon", "white"],
            "na": ["NotApplicableIcon", "white"],
            "finearts": ["FineArtsIcon", "#d291ff"],
            "infotech.": ["InfoTechIcon", "#52c97a"]
        }   
        icon = icon.toLowerCase();
        icon = icon.split(" ").join("");
        if (icons[icon]) {
            return icons[icon];
        } else {
            return icons["other"];
        }
    }
}
