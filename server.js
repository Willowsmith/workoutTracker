const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const db = require("./models");
const app = express();

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", 
  { 
    useNewUrlParser: true
  })

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

//ROUTES~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// api/workouts
    //CREATE ROUTES
      app.post("/api/workouts", ({ body }, res) => {
        db.Workout.create(body)
          .then(workout => {
            res.json(workout);
          })
          .catch(err => {
            res.json(err);
          });
      })

    // READ ROUTES
      app.get("/api/workouts", (req,res) => {
        db.Workout.aggregate([
        {
          $match: { } 
        },{
          $addFields: {
            totalDuration: { $sum: "$exercises.duration" }
          }
        }])
          .then(workout => {
            res.json(workout);
          })
          .catch(err => {
            res.json(err);
          });
      })

      app.get("/api/workouts/range", (req,res) => {
        db.Workout.aggregate([
          {
            $match: {}
          },{
            $sort: {day: -1}
          },{
            $limit: 7 
          },{
          $addFields: {
            totalWeight: { $sum: "$exercises.weight" },
            totalDuration: { $sum: "$exercises.duration" }
          }
        }])
        .then(workout => {
          res.json(workout);
        })
        .catch(err => {
          res.json(err);
        });
      })

      
      app.get("/exercise", (req, res) => {
        res.sendFile(path.join(__dirname, "public/exercise.html"));
      });

      app.get("/stats", (req, res) => {
        res.redirect("/stats.html");
      });


    // UPDATE ROUTES
      app.put("/api/workouts/:id", (req,res) => {
        db.Workout.updateOne(
          { _id: req.params.id },
          { $push: { exercises: req.body } },
          (error, success) => {
            if (error) {
              res.json(error);
            } else {
              res.json(success);
            }
          }
        );
      })



// Listen on port PORT
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
  });