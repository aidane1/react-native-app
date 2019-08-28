import moment from 'moment';

export default class FormatHours {
  static _formatTime (hours, minutes, am = false) {
    let time = new Date ();
    time = new Date (
      time.getFullYear (),
      time.getMonth (),
      time.getDate (),
      hours,
      minutes
    );
    time = am ? moment (time).format ('h:mm A') : moment (time).format ('h:mm');
    return time;
  }
}
