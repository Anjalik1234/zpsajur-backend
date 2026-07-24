const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({

    question:{
        type:String,
        required:true
    },

    options:{
        type:[String],
        validate:[arr => arr.length === 4,"Exactly four options are required"]
    },

    correctAnswer:{
        type:Number,
        required:true
    }

});

const quizSchema = new mongoose.Schema({

    standard:{
        type:String,
        required:true
    },

    subject:{
        type:String,
        required:true
    },

    numberOfQuestions:{
        type:Number,
        required:true
    },

    marksPerQuestion:{
        type:Number,
        required:true
    },

    totalMarks:{
        type:Number,
        required:true
    },

    publishDate:{
        type:Date,
        default:null
    },

    status:{
        type:String,
        enum:["Draft","Published","Ended"],
        default:"Draft"
    },

    questions:[questionSchema]

},
{
    timestamps:true
});

module.exports = mongoose.model("Quiz",quizSchema);