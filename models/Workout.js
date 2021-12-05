const mongoose = require("mongoose");
const Schema = mongoose.Schema

const WorkoutSchema = new Schema({
    exercises: [{
        type: {
            type: String,
            trim: true,
            required: "Type is Required"
        },
        name: {
            type: String,
            trim: true,
            required: "Name is Required"
        },
        duration: Number,
        distance: Number, 
        weight: Number,
        reps: Number,
        sets: Number
    }],
    day: {
        type: Date,
        default: Date.now
    },
})

const Workout = mongoose.model("Workout", WorkoutSchema);

module.exports = Workout;