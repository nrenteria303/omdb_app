require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const ejs = require("ejs");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
    var title = req.body.title;
    var year = req.body.year;
    var type = req.body.type;

    request("http://www.omdbapi.com/?apikey=" + process.env.API_KEY + "&t=" + title + "&type=" + type + "&year=" + year, function(err, response, body) {
        if (err) {
            console.log("error: " + err);                
        } else {
            // console.log(body);
            var movieData = JSON.parse(body);
            res.render("movie", {
                movieTitle: movieData.Title
            })
        }
    });
});

app.listen(3000, function() {
    console.log("Server is running on port 3000");
});