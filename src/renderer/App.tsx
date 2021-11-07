import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import { useEffect,useState } from 'react';
const { ipcRenderer } = window.require('electron');
const ReactWeather= require( 'react-open-weather').default;
const {useOpenWeather}= require( 'react-open-weather');
window.require('dotenv').config()

const Hello = () => {
  const [r,setR] = useState([])
  const [c,setC] = useState([])
  const [n,setN] = useState([])
  const { data, isLoading, errorMessage } = useOpenWeather({
    key: process.env.ELECTRON_APP_WEATHER_API_KEY,
    lat: process.env.ELECTRON_APP_WEATHER_LAT,
    lon: process.env.ELECTRON_APP_WEATHER_LON,
    lang: 'en',
    unit: 'metric',
  });
  useEffect(() => {
    ipcRenderer.on('jxa-cal', (_, arg) => {
      setC(arg)
  });
  ipcRenderer.on('jxa-rem', (_, arg) => {
    setR(arg)
});
ipcRenderer.on('jxa-notes', (_, arg) => {
  setN(arg)
});
  }, [])
  return (
    <div>
      <h1>Calendar</h1>
      {
        c && c.map((item,i) => <p key={i}>{item}</p>)
      }
      <h1>Reminders</h1>
      {
        r && r.map((item:any,i)=> <p key={i}>{item.name}</p>)
      }
      <h1>Notes</h1>
      {
        n && n.map((item:any,i)=> <p key={i}>{item.name}</p>)
      }
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
