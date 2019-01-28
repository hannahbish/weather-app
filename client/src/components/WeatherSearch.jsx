import React from 'react';
import Footer from './Footer.jsx';
import Forecast from './Forecast.jsx';
import CityDropdown from './CityDropdown.jsx';

class WeatherSearch extends React.Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDropdownHover = this.handleDropdownHover.bind(this);
    this.handleDropdownClick = this.handleDropdownClick.bind(this);
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

  handleDropdownHover(e) {
    const { highlightedCity } = this.state;
    const targetCity = e.target.innerText;
    this.setState({
      highlightedCity: targetCity === highlightedCity ? '' : targetCity
    });
  }

  handleDropdownClick(e) {
    this.setState({
      selectedCityLL: e.target.dataset.ll,
      selectedCityName: e.target.innerText,
      autoCompleteCities: null
    }, () => {
      this.callForecastApi()
        .then(res => this.setState({ forecast: res }))
        .catch(err => console.log(err));
    });
  }
  
  handleInputChange(e) {
    const inputCity = e.target.value;
    this.setState({ inputCity, selectedCityName: '' });
    this.callAutocompleteApi(inputCity)
      .then(res => this.setState({ autoCompleteCities: res }))
      .catch(err => console.log(err));
  }

  render() {
    const {
      autoCompleteCities,
      highlightedCity,
      forecast,
      selectedCityName,
      inputCity
    } = this.state;

    return (
      <div>
        <div className="autocomplete">
          <input
            type="text"
            placeholder="Enter a city name"
            value={selectedCityName || inputCity}
            onChange={this.handleInputChange}
          />
          {
            autoCompleteCities &&
            <CityDropdown
              cityList={autoCompleteCities}
              highlightedCity={highlightedCity}
              handleDropdownHover={this.handleDropdownHover}
              handleDropdownClick={this.handleDropdownClick}
            />
          }
        </div>
        <Forecast forecastList={forecast} />
        <Footer />
      </div>
    );
  }
}

export default WeatherSearch;