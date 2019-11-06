'use strict';

//first run npm init from the terminal to create "package.json"
// npm install dotenv installs the dotenv module into the node module folder
// loads our environment from a secret .env file
// APP dependencies
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');

// let moment = require('moment');
// moment().format();

// Make my server
// const app = express();
// Global vars
// const PORT = process.env.PORT || 3000;


// app.get('/location', (request, response) => {
  // send the users current location back to them
//   const geoData = require('./data/geo.json');
//   const city = request.query.data;
//   const cityName = geoData.results[0].address_components[0].long_name;
//   console.log('LOCATION END POINT REACHED')
//   if (cityName === city) {
//     const locationData = new Location(city, geoData);
//     response.send(locationData);
//   } else {
//     response.send('500: Internal Server Error', 500);
//   }
// });

// function Location(city, geoData) {
//   this.search_query = city;
//   this.formatted_query = geoData.results[0].formatted_address;
//   this.latitude = geoData.results[0].geometry.location.lat;
//   this.longitude = geoData.results[0].geometry.location.lng;
// }

// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');

// Application Setup
const PORT = process.env.PORT;
const app = express();
app.use(cors());

let locations = {};

// Route Definitions
app.get('/location', locationHandler);
// app.get('/weather', weatherHandler);
app.use('*', notFoundHandler);
app.use(errorHandler);


function locationHandler(request, response) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GEOCODE_API_KEY}`;

  if (locations[url]) {
    response.send(locations[url]);
  }
  else {
    superagent.get(url)
      .then(data => {
        const geoData = data.body;
        const location = new Location(request.query.data, geoData);
        locations[url] = location;
        response.send(location);
      })
      .catch(() => {
        errorHandler('So sorry, something went wrong.', request, response);
      });
  }
}

function Location(query, geoData) {
  this.search_query = query;
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


function notFoundHandler(request, response) {
  response.status(404).send('huh?');
}

function errorHandler(error, request, response) {
  response.status(500).send(error);
}


app.listen(PORT, () => {
  console.log(`listening on PORT ${PORT}`);
});
