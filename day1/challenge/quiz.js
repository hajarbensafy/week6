const express = require('express');
const router = express.Router();

// Hard-coded trivia questions
const triviaQuestions = [
  {
    question: "What is the capital of France?",
    answer: "Paris",
  },
  {
    question: "Which planet is known as the Red Planet?",
    answer: "Mars",
  },
  {
    question: "What is the largest mammal in the world?",
    answer: "Blue whale",
  },
];

// Quiz state
let currentQuestionIndex = 0;
let score = 0;
let quizCompleted = false;

// Start the quiz or show current question
router.get('/', (req, res) => {
  if (quizCompleted) {
    return res.redirect('/quiz/score');
  }

  if (currentQuestionIndex >= triviaQuestions.length) {
    quizCompleted = true;
    return res.redirect('/quiz/score');
  }

  const currentQuestion = triviaQuestions[currentQuestionIndex];
  res.send(`
    <h1>Trivia Quiz</h1>
    <p>Question ${currentQuestionIndex + 1} of ${triviaQuestions.length}</p>
    <p>${currentQuestion.question}</p>
    <form method="POST" action="/quiz">
      <input type="text" name="answer" required>
      <button type="submit">Submit Answer</button>
    </form>
    <p>Score: ${score}</p>
  `);
});

// Submit an answer
router.post('/', (req, res) => {
  if (quizCompleted) {
    return res.redirect('/quiz/score');
  }

  const userAnswer = req.body.answer.trim();
  const correctAnswer = triviaQuestions[currentQuestionIndex].answer;

  if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
    score++;
    res.send(`
      <h1>Correct!</h1>
      <p>The answer was: ${correctAnswer}</p>
      <a href="/quiz">Next Question</a>
    `);
  } else {
    res.send(`
      <h1>Incorrect!</h1>
      <p>The correct answer was: ${correctAnswer}</p>
      <p>Your answer: ${userAnswer}</p>
      <a href="/quiz">Next Question</a>
    `);
  }

  currentQuestionIndex++;
});

// Show final score
router.get('/score', (req, res) => {
  if (!quizCompleted && currentQuestionIndex < triviaQuestions.length) {
    return res.redirect('/quiz');
  }

  res.send(`
    <h1>Quiz Completed!</h1>
    <p>Your final score: ${score} out of ${triviaQuestions.length}</p>
    <form action="/quiz/reset" method="POST">
      <button type="submit">Restart Quiz</button>
    </form>
  `);
});

// Reset the quiz
router.post('/reset', (req, res) => {
  currentQuestionIndex = 0;
  score = 0;
  quizCompleted = false;
  res.redirect('/quiz');
});

module.exports = router;