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

app.post("/", function(req, res) {
    var title = req.body.title;
    var year = req.body.year;
    var type = req.body.type;
    var url = "http://www.omdbapi.com/?apikey=" + process.env.API_KEY + "&t=" + title + "&type=" + type + "&plot=full&year=" + year;

    request(url, function(err, response, body) {
        if (err) {
            console.log("error: " + err);                
        } else if (JSON.parse(body).Title === null) {
            console.log("No movie found");
        } else {
            var movieData = JSON.parse(body);
            res.render("movie", {
                movieTitle: movieData.Title,
                movieYear: movieData.Year,
                movieCast: movieData.Actors,
                moviePlot: movieData.Plot,
                moviePoster: movieData.Poster
            })
        }
    });
});

app.listen(3000, function() {
    console.log("Server is running on port 3000");
});