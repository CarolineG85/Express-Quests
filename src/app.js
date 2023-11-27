require("dotenv").config();
const express = require("express");

const app = express();
const port = process.env.APP_PORT;

const movieControllers = require("./controllers/movieControllers");
//import de la database à ne pas oublier

app.get("/api/movies", movieControllers.getMovies);
app.get("/api/movies/:id", movieControllers.getMovieById);

app.get("/api/users", movieControllers.getUsers);
app.get("/api/users/:id", movieControllers.getUsersById);




module.exports = app;
