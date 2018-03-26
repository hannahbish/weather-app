const express = require('express');
const request = require('request');

const app = express();
const port = process.env.PORT || 5000;
const token = 'b8d3960c5ca06ce8';

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.get('/autocomplete/:city', (req, res) => {
  request(`http://autocomplete.wunderground.com/aq?query=${req.params.city}`, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      res.send({ cities: body });
    }
  });
});

app.get('/forecast/:ll', (req, res) => {
  console.log(`http://api.wunderground.com/api/${token}/forecast/q/${req.params.ll}.json`);
  request(`http://api.wunderground.com/api/${token}/forecast/q/${req.params.ll}.json`, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      res.send({ forecast: body });
    }
  });
});


app.listen(port, () => console.log(`Listening on port ${port}`));