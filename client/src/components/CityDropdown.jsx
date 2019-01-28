import React from 'react';
import PropTypes from 'prop-types';

class CityDropdown extends React.Component {
  render() {
    const {
      cityList,
      highlightedCity,
      handleDropdownHover,
      handleDropdownClick
    } = this.props;

    return (
      <div className="menu">
        { cityList &&
          cityList.map((city) => (
            <div
              className={`item ${highlightedCity === city.name ? 'item-highlighted' : ''}`}
              onMouseEnter={handleDropdownHover}
              onMouseLeave={handleDropdownHover}
              onClick={handleDropdownClick}
              data-ll={city.ll}
              key={city.name}
            >
              {city.name}
            </div>
          ))
        }
      </div>
    );
  }
}

export default CityDropdown;

CityDropdown.propTypes = {
  cityList: PropTypes.array,
  highlightedCity: PropTypes.string,
  handleDropdownHover: PropTypes.func.isRequired,
  handleDropdownClick: PropTypes.func.isRequired
}

CityDropdown.defaultProps = {
  cityList: [],
  highlightedCity: ''
}