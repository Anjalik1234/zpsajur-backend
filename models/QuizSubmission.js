const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({

    questionNumber: {
        type: Number,
        required: true
    },

    selectedAnswer: {
        type: Number,
        required: true
    }

});

const quizSubmissionSchema = new mongoose.Schema({

    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true
    },

    studentName: {
        type: String,
        required: true
    },

    standard: {
        type: String,
        required: true
    },

    subject: {
        type: String,
        required: true
    },

    answers: [answerSchema],

    marksObtained: {
        type: Number,
        default: 0
    },

    submittedAt: {
        type: Date,
        default: Date.now
    },

    startedAt: {
        type: Date,
        default: Date.now
    },

    isSubmitted: {
        type: Boolean,
        default: false
    }

},
    {
        timestamps: true
    });

module.exports = mongoose.model("QuizSubmission", quizSubmissionSchema);