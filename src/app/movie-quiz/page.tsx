'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Paper,
  Avatar,
  Chip,
  Grid,
} from '@mui/material';
import {
  Quiz as QuizIcon,
  EmojiEvents as TrophyIcon,
  PlayArrow as PlayIcon,
  Replay as ReplayIcon,
  CheckCircle as CheckIcon,
  Cancel as WrongIcon,
} from '@mui/icons-material';
import AuthGuard from '@/components/AuthGuard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function MovieQuizPage() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions: QuizQuestion[] = [
    {
      id: 1,
      question: 'Which movie won the Academy Award for Best Picture in 2020?',
      options: ['1917', 'Joker', 'Parasite', 'Once Upon a Time in Hollywood'],
      correctAnswer: 2,
      difficulty: 'medium',
    },
    {
      id: 2,
      question: 'Who directed "The Godfather" trilogy?',
      options: ['Martin Scorsese', 'Francis Ford Coppola', 'Steven Spielberg', 'Stanley Kubrick'],
      correctAnswer: 1,
      difficulty: 'easy',
    },
    {
      id: 3,
      question: 'What is the highest-grossing film of all time (not adjusted for inflation)?',
      options: ['Avatar', 'Avengers: Endgame', 'Titanic', 'Star Wars: The Force Awakens'],
      correctAnswer: 0,
      difficulty: 'medium',
    },
    {
      id: 4,
      question: 'Which actor has won the most Academy Awards for acting?',
      options: ['Meryl Streep', 'Katharine Hepburn', 'Jack Nicholson', 'Daniel Day-Lewis'],
      correctAnswer: 1,
      difficulty: 'hard',
    },
    {
      id: 5,
      question: 'In which year was the first "Toy Story" movie released?',
      options: ['1993', '1995', '1997', '1999'],
      correctAnswer: 1,
      difficulty: 'easy',
    },
  ];

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setAnswered(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!answered) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    setAnswered(true);
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const getScorePercentage = () => {
    return Math.round((score / questions.length) * 100);
  };

  const getScoreMessage = () => {
    const percentage = getScorePercentage();
    if (percentage >= 80) return { text: 'Outstanding! 🌟', color: 'success.main' };
    if (percentage >= 60) return { text: 'Great Job! 👏', color: 'info.main' };
    if (percentage >= 40) return { text: 'Good Effort! 👍', color: 'warning.main' };
    return { text: 'Keep Practicing! 💪', color: 'error.main' };
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  return (
    <AuthGuard>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        
        <Container maxWidth="md" sx={{ mt: 12, mb: 8, flex: 1 }}>
          {!quizStarted ? (
            // Welcome Screen
            <Paper elevation={3} sx={{ p: 6, textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80, mx: 'auto', mb: 3 }}>
                <QuizIcon fontSize="large" />
              </Avatar>
              <Typography variant="h3" fontWeight={700} gutterBottom>
                Movie Quiz Challenge
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                Test your movie knowledge with {questions.length} questions
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                <Grid item xs={4}>
                  <Paper elevation={1} sx={{ p: 2 }}>
                    <Typography variant="h4" color="primary">
                      {questions.length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Questions
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper elevation={1} sx={{ p: 2 }}>
                    <Typography variant="h4" color="success.main">
                      {questions.filter(q => q.difficulty === 'easy').length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Easy
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper elevation={1} sx={{ p: 2 }}>
                    <Typography variant="h4" color="error.main">
                      {questions.filter(q => q.difficulty === 'hard').length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Hard
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Button
                variant="contained"
                size="large"
                startIcon={<PlayIcon />}
                onClick={handleStartQuiz}
                sx={{ px: 6, py: 2, fontSize: '1.1rem' }}
              >
                Start Quiz
              </Button>
            </Paper>
          ) : showResult ? (
            // Results Screen
            <Paper elevation={3} sx={{ p: 6, textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: getScoreMessage().color, width: 100, height: 100, mx: 'auto', mb: 3 }}>
                <TrophyIcon sx={{ fontSize: 60 }} />
              </Avatar>
              <Typography variant="h3" fontWeight={700} gutterBottom>
                Quiz Complete!
              </Typography>
              <Typography variant="h4" sx={{ mb: 2, color: getScoreMessage().color }}>
                {getScoreMessage().text}
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="h2" fontWeight={700} color="primary.main">
                  {score}/{questions.length}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {getScorePercentage()}% Correct
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={getScorePercentage()}
                sx={{ height: 10, borderRadius: 5, mb: 4 }}
              />

              <Button
                variant="contained"
                size="large"
                startIcon={<ReplayIcon />}
                onClick={handleStartQuiz}
                sx={{ px: 6, py: 2 }}
              >
                Try Again
              </Button>
            </Paper>
          ) : (
            // Quiz Screen
            <Card elevation={3}>
              <CardContent sx={{ p: 4 }}>
                {/* Progress */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Question {currentQuestion + 1} of {questions.length}
                    </Typography>
                    <Chip
                      label={questions[currentQuestion].difficulty.toUpperCase()}
                      size="small"
                      color={getDifficultyColor(questions[currentQuestion].difficulty) as any}
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={((currentQuestion + 1) / questions.length) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                {/* Question */}
                <Typography variant="h5" fontWeight={600} sx={{ mb: 4 }}>
                  {questions[currentQuestion].question}
                </Typography>

                {/* Options */}
                <FormControl component="fieldset" fullWidth sx={{ mb: 4 }}>
                  <RadioGroup
                    value={selectedAnswer !== null ? selectedAnswer.toString() : ''}
                    onChange={(e) => handleAnswerSelect(parseInt(e.target.value))}
                  >
                    {questions[currentQuestion].options.map((option, index) => {
                      const isCorrect = index === questions[currentQuestion].correctAnswer;
                      const isSelected = selectedAnswer === index;
                      const showFeedback = answered;

                      return (
                        <Paper
                          key={index}
                          elevation={isSelected ? 3 : 1}
                          sx={{
                            p: 2,
                            mb: 2,
                            cursor: answered ? 'default' : 'pointer',
                            border: showFeedback
                              ? isCorrect
                                ? '2px solid'
                                : isSelected
                                ? '2px solid'
                                : '1px solid'
                              : isSelected
                              ? '2px solid'
                              : '1px solid',
                            borderColor: showFeedback
                              ? isCorrect
                                ? 'success.main'
                                : isSelected
                                ? 'error.main'
                                : 'divider'
                              : isSelected
                              ? 'primary.main'
                              : 'divider',
                            bgcolor: showFeedback
                              ? isCorrect
                                ? 'success.light'
                                : isSelected
                                ? 'error.light'
                                : 'background.paper'
                              : isSelected
                              ? 'primary.light'
                              : 'background.paper',
                            opacity: showFeedback && !isCorrect && !isSelected ? 0.6 : 1,
                          }}
                        >
                          <FormControlLabel
                            value={index.toString()}
                            control={<Radio disabled={answered} />}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography>{option}</Typography>
                                {showFeedback && isCorrect && <CheckIcon color="success" />}
                                {showFeedback && isSelected && !isCorrect && <WrongIcon color="error" />}
                              </Box>
                            }
                            sx={{ width: '100%', m: 0 }}
                          />
                        </Paper>
                      );
                    })}
                  </RadioGroup>
                </FormControl>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Score: {score}/{currentQuestion + (answered ? 1 : 0)}
                  </Typography>
                  {!answered ? (
                    <Button
                      variant="contained"
                      onClick={handleSubmitAnswer}
                      disabled={selectedAnswer === null}
                      size="large"
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNextQuestion}
                      size="large"
                    >
                      {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          )}
        </Container>

        <Footer />
      </Box>
    </AuthGuard>
  );
}

