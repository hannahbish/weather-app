import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class WeatherSearch extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      autoCompleteCities: '',
      highlightedCity: '',
      selectedCityLL: '',
      forecast: ''
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
    const ll = this.state.selectedCityLL.split(' ').join(',');
    console.log(ll);
    const response = await fetch('/forecast/' + ll);
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }

    let result = body && body.forecast && JSON.parse(body.forecast);
    console.log(result);
    
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
    this.callAutocompleteApi(e.target.value)
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
    const targetLL = e.target.dataset.ll;
    console.log(this.state.autoCompleteCities);
    this.setState({
      selectedCityLL: targetLL,
      autoCompleteCities: null
    }, () => {
      this.callForecastApi()
        .then(res => this.setState({ forecast: res }))
        .catch(err => console.log(err));
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const {
      autoCompleteCities,
      highlightedCity,
      forecast
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
          <div
            key={fc.period}
          >
            {`${fc.title}: ${fc.fcttext}`}
          </div>
        );
      });
    }
    

    return (
      <div className="autocomplete">
        <input type="text" onChange={this.handleChange} />
        {
          autoCompleteCities &&
          <div className="menu">
            { cities }
          </div>
        }
        <div>
          { forecasts }
        </div>
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
