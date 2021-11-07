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

export const ListContainer = (props) => (
  <div className="container-item list-container" key={props.key} style={{width:400}}>
    <div className="left-item">
      <div style={{ position: 'absolute', bottom: 0 }}>
        <b>{props.items.filter((r) => !r.completed).length}</b>
        <h2>{props.title}</h2>
      </div>
    </div>
    <div className="right-item">
      {props.items
        .filter((r) => !r.completed)
        .map((item, i) => (
          <p key={i}>{item.name}</p>
        ))}
    </div>
  </div>
);
