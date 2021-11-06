import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import { useEffect,useState } from 'react';
const { ipcRenderer } = window.require('electron');

const Hello = () => {
  const [r,setR] = useState([])
  const [c,setC] = useState([])
  useEffect(() => {
    ipcRenderer.on('jxa-cal', (_, arg) => {
      setC(arg)
  });
  ipcRenderer.on('jxa-rem', (_, arg) => {
    setR(arg)
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
