import './Components.css';
import moment from 'moment';

export const CalendarEvent = (props) => (
  <div key={props.key} className="calendar-event">
    <span className="calendar-event-title">{props.event.summary}</span>
    <br />
    <span className="calendar-event-date">
      {moment(props.event.startDate).calendar({
        sameDay: '[Today] h:m A',
        nextDay: '[Tomorrow] h:m A',
        nextWeek: 'dddd h:m A',
        lastDay: '[Yesterday] h:m A',
        lastWeek: '[Last] dddd h:m A',
        sameElse: 'DD/MM/YYYY h:m A',
      })}{' '}
      - {moment(props.event.endDate).format('h:m A')}
    </span>
  </div>
);
