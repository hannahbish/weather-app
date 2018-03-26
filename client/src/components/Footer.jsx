import React from 'react';
const wundergroundLogo = require('../images/wundergroundLogo.png');

class Footer extends React.Component {
  render = () =>
    (
      <footer>
      <div>
        Weather data from The Weather Underground, LLC
        <p>
          <img
            src={wundergroundLogo}
            style={{ height: 50 }}
          />
        </p>
      </div>
    </footer>
  );
}

export default Footer;