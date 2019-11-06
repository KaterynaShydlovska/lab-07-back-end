'use srtict';

//first run npm init from the terminal to create "package.json"
// npm install dotenv installs the dotenv module into the node module folder
// loads our environment from a secret .env file
// APP dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// let moment = require('moment');
// moment().format();

// Make my server
const app = express();
// Global vars
const PORT = process.env.PORT || 3000;


app.get('/location', (request, response) => {
  // send the users current location back to them
  const geoData = require('./data/geo.json');
  const city = request.query.data;
  const cityName = geoData.results[0].address_components[0].long_name;
  console.log('LOCATION END POINT REACHED')
  if (cityName === city) {
    const locationData = new Location(city, geoData);
    response.send(locationData);
  } else {
    response.send('500: Internal Server Error', 500);
  }
});

function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;
}


app.get('/weather', (request, response) => {
  // send the users current location back to them
  const forecast = require('./data/darksky.json');
  const weatherData = forecast.daily.data.map(entry => {
    return new Weather(entry);
  })
  response.send(weatherData);
});

function Weather(obj) {
  this.forecast = obj.summary;
  this.time = new Date(parseInt(obj.time * 1000)).toGMTString();
}



app.listen(PORT, () => {
  console.log(`listening on PORT ${PORT}`);
});
