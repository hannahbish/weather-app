import React from 'react';
import PropTypes from 'prop-types';

class Forecast extends React.Component {
  render() {
    const { forecastList } = this.props;
    console.log(forecastList);
    return (
      <div className="forecast-grid-wrapper">
        { forecastList && forecastList.length &&
          forecastList.map((fc) => (
            <div
              className="forecast-grid"
              key={fc.period}
            >
              <div className='forecast-grid-header'>
                {fc.title}
              </div>
              <div className="forecast-grid-cell">
                {fc.fcttext}
              </div>
            </div>
          ))
        }
      </div>
    );
  }
}

export default Forecast;

Forecast.propTypes = {
  forecastList: PropTypes.array
}

Forecast.defaultProps = {
  forecastList: []
}