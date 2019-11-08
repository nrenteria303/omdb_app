require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const ejs = require("ejs");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

// app.get("/error", function(req, res) {

// });

app.post("/", function(req, res) {
    var title = req.body.title;
    var year = req.body.year;
    var type = req.body.type;
    var url = "http://www.omdbapi.com/?apikey=" + process.env.API_KEY + "&t=" + title + "&type=" + type + "&plot=full&year=" + year;

    request(url, function(err, response, body) {
        if (err) {
            console.log("error: " + err);                
        } else if (JSON.parse(body).Response === "False") {
            console.log("No movie found");
            res.render("error");
        } else {
            var movieData = JSON.parse(body);
            var IMDb = movieData.Ratings[0].Value;
            var RT = movieData.Ratings[1].Value;
            var MC = movieData.Ratings[2].Value;
            // var IMDbvalue = IMDb.split("/")[0];
            // var RTvalue = RT.split("%")[0];
            // var MCvalue = MC.split("/")[0];
            // var IMDbnum = parseFloat(IMDbvalue);
            res.render("movie", {
                movieTitle: movieData.Title,
                movieYear: movieData.Year,
                movieDirector: movieData.Director,
                movieCast: movieData.Actors,
                moviePlot: movieData.Plot,
                moviePoster: movieData.Poster,
                ratingIMDB: IMDb,
                ratingRT: RT,
                ratingMC: MC,
                // IMDbvalue: IMDbnum,
                // RTvalue: RTvalue,
                // MCvalue: MCvalue
            })
        }
    });
});

app.listen(3000, function() {
    console.log("Server is running on port 3000");
});
