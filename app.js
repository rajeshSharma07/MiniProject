const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Quiz = require("./models/quiz-model.js");
const path = require("path");

// connect to DB
const MONGO_URL = "mongodb+srv://onkarv:Quiz99@cluster1.d67kqku.mongodb.net";

main()
  .then(() => {
    console.log("DB is connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Configuration of Express
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

// create new quiz route
app.get("/quizzes/new-quiz", async (req, res) => {
  res.render("quizzes/new-quiz.ejs");
});

//upload quiz route
app.post("/quizzes", async (req, res) => {
  try {
    const { title, questions } = req.body;
    if (!questions) {
      throw new Error("Questions data is missing in the request body");
    }
    const newQuiz = new Quiz({ title, questions });
    await newQuiz.save();
    res.redirect("/quizzes");
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).send("Internal Server Error");
  }
});

// index route
app.get("/quizzes", async (req, res) => {
  const allQuizes = await Quiz.find({});
  res.render("quizzes/index.ejs", { allQuizes });
});

// take quiz route
app.get("/quizzes/:quizId", async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      console.error("Quiz not found");
      return res.redirect("/quizzes");
    }
    res.render("quizzes/take-quiz.ejs", { quiz });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).send("Internal Server Error");
  }
});

//submit quiz route
app.post("/quizzes/:quizId/submit", async (req, res) => {
  try {
    const { quizId } = req.params;
    if (!mongoose.isValidObjectId(quizId)) {
      return res.status(400).json({ error: "Invalid quiz ID" });
    }
    const quiz = await Quiz.findById(quizId);
    const submittedAnswers = req.body.answers;
    let score = 0;
    let attemptedQuestions = 0;

    for (let i = 0; i < quiz.questions.length; i++) {
      const correctOptionIndex = parseInt(quiz.questions[i].correctOption);
      const submittedAnswerIndex = parseInt(submittedAnswers[i]);
      if (!isNaN(submittedAnswerIndex)) {
        //for checking if answer is not NaN
        attemptedQuestions++; // Increment attempted questions count
        if (submittedAnswerIndex === correctOptionIndex) {
          score++;
        }
      }
    }

    // for calculating total questions
    const totalQuestions = quiz.questions.length;

    // for constructing message
    const message = `Your Score: ${score}/${totalQuestions}\nTotal Questions: ${totalQuestions}\nAttempted Questions: ${attemptedQuestions}`;
    // for redirecting the user to the specified route
    res.redirect(
      `/quizzes/${quizId}/quiz-submitted?message=${encodeURIComponent(message)}`
    );
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/quizzes/:quizId/quiz-submitted", (req, res) => {
  // message from the query parameters
  const message = req.query.message;

  // for rendering the quiz-submitted.ejs template with the message
  res.render("quizzes/quiz-submitted.ejs", { message });
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
