const request = require("request");
const { read } = require("fs");

const forecast = (long, lat, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=e5137a35d05e7af6602112af56f3a7f0&query=${lat},${long}&units=f`;

  request({ url: url, json: true }, (err, { body }) => {
    if (err) {
      callback("Unable to connect to weather service", undefined);
    } else if (body.error) {
      callback("Unable to find location", undefined);
    } else {
      callback(
        undefined,
        `The weather will be ${body.current.weather_descriptions[0]}. It is currently ${body.current.temperature} degrees out. It feels like ${body.current.feelslike} degrees out.`
      );
    }
  });
};

module.exports = forecast;
