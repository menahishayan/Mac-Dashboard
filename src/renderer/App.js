import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
const { ipcRenderer } = window.require('electron');

import ReactWeather, { useOpenWeather } from 'react-open-weather';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

window.require('dotenv').config();

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

  return (
    <div className="main-container">
      <div className="g-c1">
        <div className="container-item">
          <h1>Calendar</h1>
          <Calendar />
          {appleData.calendar &&
            appleData.calendar.map((item, i) => <p key={i}>{item}</p>)}
        </div>
      </div>
      <div className="g-c2">
        <div className="container-item" >
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
      </div>
      <div className="g-c3">
        <div className="container-item">
          <h1>Reminders</h1>
          {appleData.reminders &&
            appleData.reminders.map((item, i) => <p key={i}>{item.name}</p>)}
        </div>
        <div className="container-item">
          <h1>Notes</h1>
          {appleData.notes &&
            appleData.notes
              .slice(0, 3)
              .map((item, i) => <p key={i}>{item.name}</p>)}
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
