import React from 'react';
import ReactDOM from 'react-dom';
import Footer from './components/Footer.jsx';
import './css/index.css';

class WeatherSearch extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      autoCompleteCities: '', // the list of autocomplete cities returned from API
      inputCity: '', // the city string inputted by the user
      highlightedCity: '', // the city that is being hovered
      selectedCityLL: '', // the langitude-longitude the city selected by the user
      selectedCityName: '', // the name of the city selected by the user
      forecast: '' // the list of forecast for the selected city
    };
  }

  callAutocompleteApi = async (cityInput) => {
    const response = await fetch('/autocomplete/' + cityInput);
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }

    let result = body && body.cities && JSON.parse(body.cities);
    return result && result.RESULTS;
  };

  callForecastApi = async () => {
    const { selectedCityLL } = this.state;
    console.log(selectedCityLL);
    const ll = selectedCityLL.split(' ').join(',');
    const response = await fetch('/forecast/' + ll);
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }

    let result = body && body.forecast && JSON.parse(body.forecast);
    
    if (result.response.error && result.response.error.description) {
      return result.error.description;
    }
    if (result.response.features && result.response.features.forecast) {
      result = result && result.forecast && result.forecast.txt_forecast
        && result.forecast.txt_forecast.forecastday;
    }
    console.log(result);
    return result;
  };

  handleChange(e) {
    const inputCity = e.target.value;
    this.setState({ inputCity, selectedCityName: '' });
    this.callAutocompleteApi(inputCity)
        .then(res => this.setState({ autoCompleteCities: res }))
        .catch(err => console.log(err));
  }

  handleHover(e) {
    const { highlightedCity } = this.state;
    const targetCity = e.target.innerText;
    if (targetCity === highlightedCity) {
      this.setState({
        highlightedCity: ''
      });
    } else {
      this.setState({
        highlightedCity: targetCity
      });
    }
  }

  handleClick(e) {
    const cityLL = e.target.dataset.ll;
    const cityName = e.target.innerText;
    console.log(cityName);
    this.setState({
      selectedCityLL: cityLL,
      selectedCityName: cityName,
      autoCompleteCities: null
    }, () => {
      this.callForecastApi()
        .then(res => this.setState({ forecast: res }))
        .catch(err => console.log(err));
    });
  }

  render() {
    const {
      autoCompleteCities,
      highlightedCity,
      forecast,
      selectedCityName,
      inputCity
    } = this.state;
    let cities;
    let forecasts;

    if (autoCompleteCities) {
      cities = autoCompleteCities.map((city) => {
        return (
          <div
            className={`item ${highlightedCity === city.name ? 'item-highlighted' : ''}`}
            onMouseEnter={this.handleHover}
            onMouseLeave={this.handleHover}
            onClick={this.handleClick}
            data-ll={city.ll}
            key={city.name}
          >
            {city.name}
          </div>
        );
      });
    }

    if (forecast) {
      forecasts = forecast.map((fc) => {
        return (
          <div className="forecast-grid"
            key={fc.period}
          >
            <div className='forecast-grid-header'>
              {fc.title}
            </div>
            <div className="forecast-grid-cell">
              {fc.fcttext}
            </div>
          </div>
        );
      });
    }
    

    return (
      <div>
        <div className="autocomplete">
          <input type="text" value={selectedCityName || inputCity} onChange={this.handleChange} />
          {
            autoCompleteCities &&
            <div className="menu">
              { cities }
            </div>
          }
        </div>
        { forecasts && 
          <div className="forecast-grid-wrapper">
            { forecasts }
          </div>
        }
        <Footer />
      </div>
    );
  }
}

class WeatherApp extends React.Component {
  render = () => <WeatherSearch />;
}

// ========================================

ReactDOM.render(
  <WeatherApp />,
  document.getElementById('root')
);
