const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode.js");
const forecast = require("./utils/forecast.js");

const app = express();
const port = process.env.PORT || 3000;

// define paths for express config
const publicDir = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//setup static directory to serve
app.use(express.static(publicDir));

app.get("", (req, res) => {
  res.render("index", {
    title: "weather App",
    name: "Justin Schulz",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Justin Schulz",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help Page",
    help: "This is all the help information updated",
    name: "Justin Schulz",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address",
    });
  }
  geocode(
    req.query.address,
    (err, { longitude, latitude, location } = ({} = {})) => {
      if (err) {
        return res.send({
          error: err,
        });
      }

      forecast(longitude, latitude, (error, forecastData) => {
        if (error) {
          return res.send({
            error: error,
          });
        }
        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get("/help/*", (req, res) => {
  res.render("error", {
    title: "404",
    error: "Help article not found",
    name: "Justin Schulz",
  });
});

app.get("*", (req, res) => {
  res.render("error", {
    title: "404",
    error: "page not found",
    name: "Justin Schulz",
  });
});

app.listen(port, () => {
  console.log(`server is up on port ${port}`);
});
