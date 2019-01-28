import React from 'react';
import ReactDOM from 'react-dom';
import WeatherSearch from './components/WeatherSearch.jsx';
import './css/index.css';

class WeatherApp extends React.Component {
  render = () => <WeatherSearch />;
}

// ========================================

ReactDOM.render(
  <WeatherApp />,
  document.getElementById('root')
);
