import { useState } from "react";
import PageLayout from "../PageLayout/PageLayout";
import { Box, Button, Typography } from "@mui/material";
import { borderRadius, navbarHeight } from "../../Utils/spacings";
import { useTranslation } from "react-i18next";
import {
  Q1Image,
  Q2Image,
  Q3Image,
  Q4Image,
  Q5Image,
} from "../../Utils/Images";
import PostPicture from "../Common/PostPicture";

const questions = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "Rome", "Madrid", "Berlin"],
    correctAnswer: "Paris",
    image: Q3Image,
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
    image: Q1Image,
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Pacific", "Arctic"],
    correctAnswer: "Pacific",
    image: Q5Image,
  },
  {
    question: "Which animal is the largest land mammal?",
    options: ["Elephant", "Rhino", "Hippo", "Giraffe"],
    correctAnswer: "Elephant",
    image: Q4Image,
  },
  {
    question: "Which sport is known as the 'king of sports'?",
    options: ["Cricket", "Basketball", "Football", "Tennis"],
    correctAnswer: "Football",
    image: Q2Image,
  },
];

const Games = () => {
  const { t } = useTranslation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerClick = (option: string) => {
    setSelectedAnswer(option);
  };

  const handleNext = () => {
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer("");
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setScore(0);
    setIsFinished(false);
  };

  return (
    <PageLayout hideSidebar sx={{ p: 0 }}>
      <Box
        sx={{
          minHeight: `calc(100vh - ${navbarHeight}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          padding: 32,
        }}
      >
        {!isFinished ? (
          <Box maxWidth={950}>
            <Typography className='pop-out-animation' variant='h6' mb={5}>
              {t("Question")} {currentQuestionIndex + 1} {t("of")}{" "}
              {questions.length}
            </Typography>
            <Typography
              key={currentQuestionIndex + "-question"}
              className='pop-out-animation'
              variant='h3'
              mb={10}
            >
              {t(currentQuestion.question)}
            </Typography>

            <Box
              display='flex'
              flexDirection={{ xs: "column", sm: "row" }}
              gap={24}
            >
              <Box
                sx={{
                  width: { xs: "100%", sm: "50%" },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <PostPicture
                  className='pop-out-animation'
                  key={currentQuestionIndex}
                  aspectRatio={2}
                  src={currentQuestion.image}
                />
              </Box>

              {/* Options Section */}
              <Box
                sx={{
                  width: { xs: "100%", sm: "50%" },
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === currentQuestion.correctAnswer;

                  let variant: "contained" | "outlined" = isSelected
                    ? "contained"
                    : "outlined";
                  let color: "primary" | "error" | "success" =
                    isSelected && isCorrect
                      ? "success"
                      : isSelected && !isCorrect
                      ? "error"
                      : "primary";

                  return (
                    <Button
                      className='pop-out-animation'
                      key={option}
                      variant={variant}
                      color={color}
                      onClick={() => handleAnswerClick(option)}
                      disabled={!!selectedAnswer}
                      sx={{
                        borderRadius: borderRadius.lg,
                        animationDelay: `${idx * 0.05}s`,
                      }}
                    >
                      {t(option)}
                    </Button>
                  );
                })}
              </Box>
            </Box>

            {selectedAnswer ? (
              <Button
                variant='contained'
                sx={{ mt: 16 }}
                onClick={handleNext}
                fullWidth
                className='slide-up-bounce'
              >
                {t(
                  currentQuestionIndex === questions.length - 1
                    ? "Finish"
                    : "Next"
                )}
              </Button>
            ) : (
              <Box height={16 + 50} />
            )}
          </Box>
        ) : (
          <Box textAlign='center'>
            <Typography className='pop-out-animation' variant='h2' mb={16}>
              {t("🎉 Game Over!")}
            </Typography>
            <Typography className='slide-up-bounce' variant='h6' mb={32}>
              {t("You scored")} {score} {t("out of")} {questions.length}
            </Typography>
            <Button
              className='slide-up-bounce'
              variant='contained'
              onClick={handleRestart}
              sx={{ animationDelay: "0.1s" }}
            >
              {t("Play Again")}
            </Button>
          </Box>
        )}
      </Box>
    </PageLayout>
  );
};

export default Games;
