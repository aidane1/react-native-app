import {
  Ionicons,
  Entypo,
  AntDesign,
  FontAwesome,
  MaterialIcons,
  Feather,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import React from 'react';
import {View} from 'react-native';

class IconBlock {
  constructor (icon) {}
}

export class LinkIcon extends React.Component {
  render () {
    return <AntDesign color="white" name="link" size={16} {...this.props} />;
  }
}

export class WeekIcon extends React.Component {
  render () {
    return (
      <MaterialCommunityIcons
        color="white"
        name="view-week"
        size={16}
        {...this.props}
      />
    );
  }
}

export class PdfIcon extends React.Component {
  render () {
    return (
      <FontAwesome color="white" name="file-pdf-o" size={16} {...this.props} />
    );
  }
}

export class ActivityIcon extends React.Component {
  render () {
    return <Feather color="white" name="activity" size={16} {...this.props} />;
  }
}

export class CourseConfigIcon extends React.Component {
  render () {
    return (
      <MaterialCommunityIcons
        color="white"
        name="rename-box"
        size={16}
        {...this.props}
      />
    );
  }
}

export class QuestionMarkIcon extends React.Component {
  render () {
    return (
      <FontAwesome color="white" name="question" size={16} {...this.props} />
    );
  }
}

export class MoreIcon extends React.Component {
  render () {
    return (
      <Feather color="white" name="more-horizontal" size={16} {...this.props} />
    );
  }
}

export class NotificationIcon extends React.Component {
  render () {
    return (
      <Entypo color="white" name="notification" size={16} {...this.props} />
    );
  }
}

export class MegaPhoneIcon extends React.Component {
  render () {
    return <Entypo color="white" name="megaphone" size={16} {...this.props} />;
  }
}

export class CaretRight extends React.Component {
  render () {
    return (
      <FontAwesome color="white" name="caret-right" size={16} {...this.props} />
    );
  }
}

export class LightBulbIcon extends React.Component {
  render () {
    return (
      <MaterialCommunityIcons
        color="white"
        name="lightbulb-on"
        size={16}
        {...this.props}
      />
    );
  }
}

export class CompassIcon extends React.Component {
  render () {
    return (
      <FontAwesome color="white" name="compass" size={16} {...this.props} />
    );
  }
}

export class BoldArrowUpIcon extends React.Component {
  render () {
    return (
      <Entypo color="white" name="arrow-bold-up" size={16} {...this.props} />
    );
  }
}

export class BoldArrowDownIcon extends React.Component {
  render () {
    return (
      <Entypo color="white" name="arrow-bold-down" size={16} {...this.props} />
    );
  }
}

export class FlagIcon extends React.Component {
  render () {
    return <FontAwesome color="white" name="flag" size={16} {...this.props} />;
  }
}

export class EllipsisIcon extends React.Component {
  render () {
    return (
      <FontAwesome color="white" name="ellipsis-h" size={16} {...this.props} />
    );
  }
}

export class VerticalEllipsisIcon extends React.Component {
  render () {
    return (
      <FontAwesome color="white" name="ellipsis-v" size={16} {...this.props} />
    );
  }
}

export class MessageIcon extends React.Component {
  render () {
    return (
      <Feather color="white" name="message-circle" size={16} {...this.props} />
    );
  }
}

export class ClockIcon extends React.Component {
  render () {
    return (
      <FontAwesome color="white" name="clock-o" size={16} {...this.props} />
    );
  }
}
export class ReplyIcon extends React.Component {
  render () {
    return <FontAwesome color="white" name="reply" size={16} {...this.props} />;
  }
}
export class QuestionIcon extends React.Component {
  render () {
    return (
      <MaterialIcons
        color="white"
        name="question-answer"
        size={16}
        {...this.props}
      />
    );
  }
}

export class ChatIcon extends React.Component {
  render () {
    return (
      <Ionicons color="white" name="ios-chatboxes" size={16} {...this.props} />
    );
  }
}

export class CloseCircleIcon extends React.Component {
  render () {
    return (
      <AntDesign color="white" name="closecircle" size={16} {...this.props} />
    );
  }
}
export class SendIcon extends React.Component {
  render () {
    return <FontAwesome color="white" name="send" size={16} {...this.props} />;
  }
}
export class TrashIcon extends React.Component {
  render () {
    return (
      <FontAwesome color="white" name="trash-o" size={16} {...this.props} />
    );
  }
}

export class XIcon extends React.Component {
  render () {
    return <Entypo color="white" name="cross" size={16} {...this.props} />;
  }
}
export class CameraIcon extends React.Component {
  render () {
    return <Entypo color="white" name="camera" size={16} {...this.props} />;
  }
}
export class PhotoIcon extends React.Component {
  render () {
    return <FontAwesome color="white" name="photo" size={16} {...this.props} />;
  }
}
export class CloseIcon extends React.Component {
  render () {
    return (
      <AntDesign color="white" name="closecircleo" size={16} {...this.props} />
    );
  }
}
export class CheckBoxFilledIcon extends React.Component {
  render () {
    return <FontAwesome color="white" name="check-circle" {...this.props} />;
  }
}
export class CheckBoxOpenIcon extends React.Component {
  render () {
    return <FontAwesome color="white" name="circle-o" {...this.props} />;
  }
}
export class PlusIcon extends React.Component {
  render () {
    return <FontAwesome color="white" name="plus" size={16} {...this.props} />;
  }
}
export class ConfirmIcon extends React.Component {
  render () {
    return <FontAwesome color="white" name="check-circle" {...this.props} />;
  }
}
export class RefreshIcon extends React.Component {
  render () {
    return (
      <Ionicons name="ios-refresh" color="white" size={16} {...this.props} />
    );
  }
}
export class HomeIcon extends React.Component {
  render () {
    return <FontAwesome color="white" name="home" size={16} {...this.props} />;
  }
}
export class CoursesIcon extends React.Component {
  render () {
    return (
      <Ionicons color="white" name="ios-list-box" size={16} {...this.props} />
    );
  }
}
export class ScheduleIcon extends React.Component {
  render () {
    return <Entypo color="white" name="calendar" size={16} {...this.props} />;
  }
}
export class CalendarIcon extends React.Component {
  render () {
    return (
      <FontAwesome color="white" name="calendar" size={16} {...this.props} />
    );
  }
}
export class AccountIcon extends React.Component {
  render () {
    return (
      <MaterialIcons
        color="white"
        name="account-circle"
        size={16}
        {...this.props}
      />
    );
  }
}
export class EmptyIcon extends React.Component {
  render () {
    return (
      <View style={{width: this.props.width, height: this.props.height}} />
    );
  }
}
export class PasswordIcon extends React.Component {
  render () {
    return <Ionicons color="white" name="ios-key" size={16} {...this.props} />;
  }
}
export class UsernameIcon extends React.Component {
  render () {
    return <Feather color="white" name="user" size={16} {...this.props} />;
  }
}
export class SchoolIcon extends React.Component {
  render () {
    return (
      <Ionicons color="white" name="ios-school" size={16} {...this.props} />
    );
  }
}

export class LeftIcon extends React.Component {
  render () {
    return (
      <Entypo color="white" name="chevron-left" size={16} {...this.props} />
    );
  }
}

export class RightIcon extends React.Component {
  render () {
    return (
      <Entypo color="white" name="chevron-right" size={16} {...this.props} />
    );
  }
}

export class DownIcon extends React.Component {
  render () {
    return (
      <Entypo color="white" name="chevron-down" size={16} {...this.props} />
    );
  }
}

export class UpIcon extends React.Component {
  render () {
    return <Entypo color="white" name="chevron-up" size={16} {...this.props} />;
  }
}

export class CourseIcon extends React.Component {
  render () {
    return <FontAwesome color="white" name="cubes" size={16} {...this.props} />;
  }
}

export class EventsIcon extends React.Component {
  render () {
    return (
      <MaterialIcons color="white" name="event" size={16} {...this.props} />
    );
  }
}

export class LogoutIcon extends React.Component {
  render () {
    return (
      <MaterialCommunityIcons
        color="white"
        name="logout"
        size={16}
        {...this.props}
      />
    );
  }
}

export class NotesIcon extends React.Component {
  render () {
    return (
      <Ionicons color="white" name="ios-paper" size={16} {...this.props} />
    );
  }
}

export class AssignmentsIcon extends React.Component {
  render () {
    return (
      <MaterialIcons
        color="white"
        name="assignment"
        size={16}
        {...this.props}
      />
    );
  }
}

export class SchoolAssignmentsIcon extends React.Component {
  render () {
    return <FontAwesome color="white" name="check" size={16} {...this.props} />;
  }
}

export class CheckMarkIcon extends React.Component {
  render () {
    return <Feather color="white" name="check" size={16} {...this.props} />;
  }
}

export class BeforeSchoolIcon extends React.Component {
  render () {
    return (
      <FontAwesome color="white" name="coffee" size={16} {...this.props} />
    );
  }
}

export class LunchTimeIcon extends React.Component {
  render () {
    return (
      <FontAwesome color="white" name="cutlery" size={16} {...this.props} />
    );
  }
}

export class AfterSchoolIcon extends React.Component {
  render () {
    return <Ionicons color="white" name="ios-moon" size={16} {...this.props} />;
  }
}

export class BlockColoursIcon extends React.Component {
  render () {
    return <Entypo color="white" name="palette" size={16} {...this.props} />;
  }
}

export class BlockNamesIcon extends React.Component {
  render () {
    return (
      <FontAwesome
        color="white"
        name="pencil-square"
        size={16}
        {...this.props}
      />
    );
  }
}
export class SocialsIcon extends React.Component {
  render () {
    return <Entypo color="white" name="map" size={16} {...this.props} />;
  }
}
export class LanguageIcon extends React.Component {
  render () {
    return <FontAwesome color="white" name="book" size={16} {...this.props} />;
  }
}
export class ScienceIcon extends React.Component {
  render () {
    return (
      <MaterialCommunityIcons
        color="white"
        name="beaker"
        size={16}
        {...this.props}
      />
    );
  }
}
export class MathIcon extends React.Component {
  render () {
    return (
      <Ionicons color="white" name="ios-calculator" size={16} {...this.props} />
    );
  }
}
export class AppliedSkillsIcon extends React.Component {
  render () {
    return <FontAwesome color="white" name="gears" size={16} {...this.props} />;
  }
}
export class CareerAndPlanningIcon extends React.Component {
  render () {
    return <Entypo color="white" name="briefcase" size={16} {...this.props} />;
  }
}
export class EnglishIcon extends React.Component {
  render () {
    return <Entypo color="white" name="open-book" size={16} {...this.props} />;
  }
}
export class PhysicalEducationIcon extends React.Component {
  render () {
    return (
      <Ionicons color="white" name="ios-basketball" size={16} {...this.props} />
    );
  }
}
export class OtherIcon extends React.Component {
  render () {
    return (
      <FontAwesome color="white" name="question" size={16} {...this.props} />
    );
  }
}
export class NotApplicableIcon extends React.Component {
  render () {
    return (
      <MaterialCommunityIcons
        color="white"
        name="file-hidden"
        size={16}
        {...this.props}
      />
    );
  }
}
export class FineArtsIcon extends React.Component {
  render () {
    return (
      <FontAwesome color="white" name="paint-brush" size={16} {...this.props} />
    );
  }
}
export class InfoTechIcon extends React.Component {
  render () {
    return (
      <MaterialIcons color="white" name="computer" size={16} {...this.props} />
    );
  }
}

export class GenericIcon extends React.Component {
  render () {
    switch (this.props.icon) {
      case 'SocialsIcon':
        return <SocialsIcon {...this.props} />;
      case 'LanguageIcon':
        return <LanguageIcon {...this.props} />;
      case 'ScienceIcon':
        return <ScienceIcon {...this.props} />;
      case 'MathIcon':
        return <MathIcon {...this.props} />;
      case 'AppliedSkillsIcon':
        return <AppliedSkillsIcon {...this.props} />;
      case 'CareerAndPlanningIcon':
        return <CareerAndPlanningIcon {...this.props} />;
      case 'EnglishIcon':
        return <EnglishIcon {...this.props} />;
      case 'PhysicalEducationIcon':
        return <PhysicalEducationIcon {...this.props} />;
      case 'OtherIcon':
        return <OtherIcon {...this.props} />;
      case 'NotApplicableIcon':
        return <NotApplicableIcon {...this.props} />;
      case 'FineArtsIcon':
        return <FineArtsIcon {...this.props} />;
      case 'InfoTechIcon':
        return <InfoTechIcon {...this.props} />;
      default:
        return <OtherIcon {...this.props} />;
    }
  }
}

export class SchoolIcons {
  constructor () {
    this.icons = {
      socialstudies: ['SocialsIcon', '#FFF176'],
      language: ['LanguageIcon', '#4a79c4'],
      science: ['ScienceIcon', '#81c784'],
      math: ['MathIcon', '#f44242'],
      appliedskills: ['AppliedSkillsIcon', 'orange'],
      careerandplanning: ['CareerAndPlanningIcon', '#ffbae6'],
      english: ['EnglishIcon', '#89cff0'],
      physicaleducation: ['PhysicalEducationIcon', '#ccc'],
      other: ['OtherIcon', 'white'],
      na: ['NotApplicableIcon', 'white'],
      finearts: ['FineArtsIcon', '#d291ff'],
      'infotech.': ['InfoTechIcon', '#52c97a'],
    };
  }
  static getIcon = icon => {
    let icons = {
      socialstudies: ['SocialsIcon', '#FFF176'],
      language: ['LanguageIcon', '#4a79c4'],
      science: ['ScienceIcon', '#81c784'],
      math: ['MathIcon', '#f44242'],
      appliedskills: ['AppliedSkillsIcon', 'orange'],
      careerandplanning: ['CareerAndPlanningIcon', '#ffbae6'],
      english: ['EnglishIcon', '#89cff0'],
      physicaleducation: ['PhysicalEducationIcon', '#ccc'],
      other: ['OtherIcon', 'white'],
      na: ['NotApplicableIcon', 'white'],
      finearts: ['FineArtsIcon', '#d291ff'],
      'infotech.': ['InfoTechIcon', '#52c97a'],
    };
    icon = icon.toLowerCase ();
    icon = icon.split (' ').join ('');
    if (icons[icon]) {
      return icons[icon];
    } else {
      return icons['other'];
    }
  };
}
