const express = require('express');
const app = express();
const quizRouter = require('./routes/quiz');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount the quiz router
app.use('/quiz', quizRouter);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Quiz app running on http://localhost:${PORT}/quiz`);
});