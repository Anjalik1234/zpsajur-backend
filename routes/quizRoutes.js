const express = require("express");
const router = express.Router();

const Quiz = require("../models/Quiz");
const QuizSubmission = require("../models/QuizSubmission");
const Ranking = require("../models/Ranking");

const verifyToken = require("../middleware/authMiddleware");

// Create Quiz (Draft)
router.post("/create", verifyToken, async (req, res) => {

    try {

        const {
            standard,
            subject,
            numberOfQuestions,
            marksPerQuestion,
            questions
        } = req.body;

        if (
            !standard ||
            !subject ||
            !numberOfQuestions ||
            !marksPerQuestion ||
            !questions
        ) {

            return res.status(400).json({
                message: "Please fill all fields."
            });

        }

        if (questions.length !== Number(numberOfQuestions)) {

            return res.status(400).json({
                message: "Number of questions does not match."
            });

        }

        const totalMarks =
            Number(numberOfQuestions) *
            Number(marksPerQuestion);

        const quiz = new Quiz({

            standard,

            subject,

            numberOfQuestions,

            marksPerQuestion,

            totalMarks,

            questions,

            status: "Draft"

        });

        await quiz.save();

        res.status(201).json({

            message: "Quiz created successfully.",

            quiz

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});

// Delete Quiz

router.delete("/:quizId", verifyToken, async (req, res) => {

    try {

        const quiz = await Quiz.findById(req.params.quizId);

        if (!quiz) {

            return res.status(404).json({

                message: "Quiz not found."

            });

        }

        // Only Draft quizzes can be deleted
        if (quiz.status !== "Draft") {

            return res.status(400).json({

                message: "Only Draft quizzes can be deleted."

            });

        }

        await Quiz.findByIdAndDelete(req.params.quizId);

        res.json({

            message: "Quiz deleted successfully."

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});


// Publish Quiz

router.put("/publish/:quizId", verifyToken, async (req, res) => {

    try {

        const quiz = await Quiz.findById(req.params.quizId);

        if (!quiz) {

            return res.status(404).json({

                message: "Quiz not found."

            });

        }

        quiz.status = "Published";

        quiz.publishDate = new Date();

        await quiz.save();

        res.json({

            message: "Quiz published successfully.",

            quiz

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});


// Future Quizzes

router.get("/future", verifyToken, async (req, res) => {

    try {

        const quizzes = await Quiz.find({

            status: "Draft"

        }).sort({

            createdAt: -1

        });

        res.json(quizzes);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});

// Current Quizzes

router.get("/current", verifyToken, async (req, res) => {

    try {

        const quizzes = await Quiz.find({

            status: "Published"

        }).sort({

            publishDate: -1

        });

        res.json(quizzes);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});

// Past Quizzes

router.get("/past", verifyToken, async (req, res) => {

    try {

        const quizzes = await Quiz.find({

            status: "Ended"

        }).sort({

            publishDate: -1

        });

        res.json(quizzes);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});

// Quiz Details

router.get("/:quizId", verifyToken, async (req, res) => {

    try {

        const quiz = await Quiz.findById(req.params.quizId);

        if (!quiz) {

            return res.status(404).json({

                message: "Quiz not found."

            });

        }

        res.json(quiz);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});

// View Students

router.get("/students/:quizId", verifyToken, async (req, res) => {

    try {

        const submissions = await QuizSubmission.find({

            quizId: req.params.quizId

        }).sort({

            submittedAt: -1

        });

        res.json(submissions);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});

// POST /api/quizzes/start ---> Start Quiz for student

router.post("/start", async (req, res) => {

    try {

        const {
            studentName,
            standard,
            subject
        } = req.body;

        if (!studentName || !standard || !subject) {

            return res.status(400).json({
                message: "Please fill all fields."
            });

        }

        // Find published quiz
        const quiz = await Quiz.findOne({
            standard,
            subject,
            status: "Published"
        });

        if (!quiz) {

            return res.status(404).json({
                message: "No active quiz available."
            });

        }

        // Check if already started
        const existingSubmission = await QuizSubmission.findOne({
            quizId: quiz._id,
            studentName,
            standard,
            isSubmitted: false
        });

        if (existingSubmission) {

            return res.status(400).json({
                message: "Quiz already started."
            });

        }

        // Check if already submitted

        const submitted = await QuizSubmission.findOne({

            quizId: quiz._id,
            studentName,
            standard,
            isSubmitted: true

        });

        if (submitted) {

            return res.status(400).json({
                message: "You have already submitted this quiz."
            });

        }

        // Create submission

        const submission = new QuizSubmission({

            quizId: quiz._id,

            studentName,

            standard,

            subject,

            startedAt: new Date(),

            answers: [],

            marksObtained: 0,

            isSubmitted: false

        });

        await submission.save();

        res.status(200).json({

            message: "Quiz started successfully.",

            submissionId: submission._id

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});

// GET /api/quizzes/play/:standard/:subject

router.get("/play/:standard/:subject", async (req, res) => {

    try {

        const { standard, subject } = req.params;

        const quiz = await Quiz.findOne({

            standard,

            subject,

            status: "Published"

        });

        if (!quiz) {

            return res.status(404).json({

                message: "Quiz not found."

            });

        }

        const questions = quiz.questions.map((question) => ({

            _id: question._id,

            question: question.question,

            options: question.options

        }));

        res.json({

            _id: quiz._id,

            standard: quiz.standard,

            subject: quiz.subject,

            numberOfQuestions: quiz.numberOfQuestions,

            marksPerQuestion: quiz.marksPerQuestion,

            totalMarks: quiz.totalMarks,

            questions

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});


// POST /api/quizzes/submit

router.post("/submit", async (req, res) => {

    try {

        const {

            submissionId,
            answers

        } = req.body;

        if (!submissionId || !answers) {

            return res.status(400).json({

                message: "Submission ID and answers are required."

            });

        }

        // Find student's submission

        const submission = await QuizSubmission.findById(submissionId);

        if (!submission) {

            return res.status(404).json({

                message: "Submission not found."

            });

        }

        // Prevent duplicate submission

        if (submission.isSubmitted) {

            return res.status(400).json({

                message: "Quiz already submitted."

            });

        }

        // Find quiz

        const quiz = await Quiz.findById(submission.quizId);

        if (!quiz) {

            return res.status(404).json({

                message: "Quiz not found."

            });

        }

        let obtainedMarks = 0;

        // Calculate marks

        quiz.questions.forEach((question, index) => {

            const studentAnswer = answers.find(

                ans => ans.questionNumber === index + 1

            );

            if (!studentAnswer) return;

            if (studentAnswer.selectedAnswer === question.correctAnswer) {

                obtainedMarks += quiz.marksPerQuestion;

            }

        });

        // Update submission

        submission.answers = answers;

        submission.marksObtained = obtainedMarks;

        submission.isSubmitted = true;

        submission.submittedAt = new Date();

        await submission.save();

        res.status(200).json({

            message: "Quiz submitted successfully.",

            marksObtained: obtainedMarks,

            totalMarks: quiz.totalMarks

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});

// PUT /api/quizzes/end/:quizId

router.put("/end/:quizId", verifyToken, async (req, res) => {

    try {

        const quizId = req.params.quizId;

        // Find Quiz

        const quiz = await Quiz.findById(quizId);

        if (!quiz) {

            return res.status(404).json({

                message: "Quiz not found."

            });

        }

        if (quiz.status !== "Published") {

            return res.status(400).json({

                message: "Only published quizzes can be ended."

            });

        }

        // Get all submissions

        const submissions = await QuizSubmission.find({

            quizId,

            isSubmitted: true

        });

        // Sort according to marks

        submissions.sort((a, b) =>

            b.marksObtained - a.marksObtained

        );

        // Prepare Ranking Array

        let rankingResults = [];

        let previousMarks = null;

        let currentRank = 0;

        submissions.forEach((student, index) => {

            if (student.marksObtained !== previousMarks) {

                currentRank = index + 1;

                previousMarks = student.marksObtained;

            }

            rankingResults.push({

                studentName: student.studentName,

                standard: student.standard,

                marksObtained: student.marksObtained,

                rank: currentRank

            });

        });

        // Save Ranking

        const ranking = new Ranking({

            quizId,

            quizDate: quiz.publishDate,

            results: rankingResults

        });

        await ranking.save();

        // Change Quiz Status

        quiz.status = "Ended";

        await quiz.save();

        res.status(200).json({

            message: "Quiz ended successfully.",

            totalStudents: submissions.length

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});

router.get("/students/:quizId", verifyToken, async (req, res) => {

    try {

        const students = await QuizSubmission.find({

            quizId: req.params.quizId,

            isSubmitted: true

        })
            .select(

                "studentName standard marksObtained submittedAt"

            )
            .sort({

                marksObtained: -1

            });

        res.json(students);

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});

// GET /api/quizzes/rankings/:quizId

router.get("/rankings/:quizId", async (req, res) => {

    try {

        const ranking = await Ranking.findOne({
            quizId: req.params.quizId
        });

        if (!ranking) {
            return res.status(404).json({
                message: "Ranking not found."
            });
        }

        res.status(200).json(ranking);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

module.exports = router;