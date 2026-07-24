const mongoose = require("mongoose");

const studentRankSchema = new mongoose.Schema({

    studentName:{
        type: String,
        required: true
    },

    standard:{
        type: String,
        required: true
    },

    marksObtained:{
        type: Number,
        required: true
    },

    rank:{
        type: Number,
        required: true
    }

});

const rankingSchema = new mongoose.Schema({

    quizId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Quiz",
        required:true
    },

    quizDate:{
        type:Date
    },

    results:[studentRankSchema]

},
{
    timestamps:true
});

module.exports = mongoose.model("Ranking",rankingSchema);