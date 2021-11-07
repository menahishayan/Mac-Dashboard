const { ipcRenderer } = window.require('electron');
window.require('dotenv').config();

import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import { Fragment, useEffect, useState } from 'react';
import ReactWeather, { useOpenWeather } from 'react-open-weather';
import {
  createConnection,
  subscribeEntities,
  createLongLivedTokenAuth,
  Connection,
  callService,
} from 'home-assistant-js-websocket';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Hello = () => {
  const [appleData, setAppleData] = useState({});
  const [time, setTime] = useState(new Date());

  const { data, isLoading, errorMessage } = useOpenWeather({
    key: process.env.ELECTRON_APP_WEATHER_API_KEY,
    lat: process.env.ELECTRON_APP_WEATHER_LAT,
    lon: process.env.ELECTRON_APP_WEATHER_LON,
    lang: 'en',
    unit: 'metric',
  });

  useEffect(() => {
    let cachedAppleData = localStorage.getItem('appleData');
    if (cachedAppleData) setAppleData(JSON.parse(cachedAppleData));

    const handleJXAData = (data) => {
      Object.keys(data).forEach((k) =>
        setAppleData((a) => {
          let res = { ...a, [k]: data[k] };
          localStorage.setItem('appleData', JSON.stringify(res));
          return res;
        })
      );
    };

    ipcRenderer.on('jxa-data', (_, arg) => handleJXAData(arg));
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const [homeData, setHomeData] = useState();
  const [connection, setConnection] = useState();

  useEffect(() => {
    const loadData = async () => {
      const auth = createLongLivedTokenAuth(
        'http://home.local:8123',
        process.env.REACT_APP_ACCESS_TOKEN
      );
      let tempConnection = await createConnection({ auth });
      setConnection(tempConnection);
      subscribeEntities(tempConnection, (entities) => {
        let filteredEntities = Object.keys(entities)
          .filter((e) => ['switch', 'light'].includes(e.split('.')[0]))
          .map((e) => entities[e]);
        setHomeData(filteredEntities);
      });
    };
    loadData();
  }, []);

  return (
    <div className="main-container">
      <div className="g-c1">
        <div className="container-item">
          <h1>Calendar</h1>
          <Calendar />
          {appleData.calendar &&
            Object.keys(appleData.calendar).map((cal, i) => (
              <Fragment key={i}>
                {appleData.calendar[cal].map((event, e) => (
                  <p key={e}>{event}</p>
                ))}
              </Fragment>
            ))}
        </div>
      </div>
      <div className="g-c2">
        <div className="container-item">
          <div className="clock-container">
            <CircularProgressbar
              maxValue={1}
              value={time.getMinutes() / 60}
              text={time.getHours() % 12}
            />
          </div>
        </div>
        <div className="container-item">
          <ReactWeather
            isLoading={isLoading}
            errorMessage={errorMessage}
            data={data}
            lang="en"
            locationLabel="Home"
            unitsLabels={{ temperature: '\u00b0C', windSpeed: 'Km/h' }}
            showForecast
          />
        </div>
        <div className="container-item">
          <h1>Home</h1>
          {homeData &&
            homeData.map((h, k) => (
              <button
                key={k}
                className="home-button"
                style={
                  h.state === 'on'
                    ? { backgroundColor: 'dodgerblue', color: 'white' }
                    : {}
                }
                onClick={() =>
                  callService(connection, 'homeassistant', 'toggle', {
                    entity_id: h.entity_id,
                  })
                }
              >
                {h.attributes.friendly_name}
              </button>
            ))}
        </div>
      </div>
      <div className="g-c3">
        <div className="container-item">
          <h1>Reminders</h1>
          {appleData.reminders &&
            appleData.reminders.Jobs.filter((r) => !r.completed).map(
              (item, i) => <p key={i}>{item.name}</p>
            )}
        </div>
        <div className="container-item">
          <h1>Notes</h1>
          {appleData.notes &&
            appleData.notes.Notes.slice(0, 3).map((item, i) => (
              <p key={i}>{item.name}</p>
            ))}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
