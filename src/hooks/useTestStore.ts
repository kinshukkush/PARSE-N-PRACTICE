import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Question, ParsedTest } from '@/lib/parser';

export interface UserAnswer {
  questionId: string;
  selectedIndex: number;
  selectedOption: string;
}

export interface TestResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  userAnswers: UserAnswer[];
  questions: Question[];
  completedAt: Date;
}

interface TestState {
  // Current test data
  currentTest: ParsedTest | null;
  originalQuestions: Question[] | null;
  userAnswers: UserAnswer[];
  currentQuestionIndex: number;
  isTestStarted: boolean;
  isTestCompleted: boolean;
  testResult: TestResult | null;

  // Actions
  setTest: (test: ParsedTest) => void;
  startTest: () => void;
  answerQuestion: (questionId: string, selectedIndex: number, selectedOption: string) => void;
  goToQuestion: (index: number) => void;
  submitTest: () => void;
  resetTest: () => void;
  shuffleQuestions: () => void;

  // Utility
  getAnswerForQuestion: (questionId: string) => UserAnswer | undefined;
  isQuestionAnswered: (questionId: string) => boolean;
  getProgress: () => { answered: number; total: number; percentage: number };
}

export const useTestStore = create<TestState>()(
  persist(
    (set, get) => ({
      currentTest: null,
      originalQuestions: null,
      userAnswers: [],
      currentQuestionIndex: 0,
      isTestStarted: false,
      isTestCompleted: false,
      testResult: null,

      // Set the current test
      setTest: (test: ParsedTest) => {
        set({
          currentTest: test,
          originalQuestions: test.questions,
          userAnswers: [],
          currentQuestionIndex: 0,
          isTestStarted: false,
          isTestCompleted: false,
          testResult: null,
        });
      },

      // Start the test
      startTest: () => {
        set({
          isTestStarted: true,
          isTestCompleted: false,
          currentQuestionIndex: 0,
          userAnswers: [],
          testResult: null,
        });
      },

      // Answer a question
      answerQuestion: (questionId: string, selectedIndex: number, selectedOption: string) => {
        const currentAnswers = get().userAnswers;
        const existingAnswerIndex = currentAnswers.findIndex(a => a.questionId === questionId);
        
        const newAnswer: UserAnswer = {
          questionId,
          selectedIndex,
          selectedOption,
        };

        // Helper function to update or add answer
        const updateUserAnswers = (answers: UserAnswer[]) => {
          if (existingAnswerIndex >= 0) {
            answers[existingAnswerIndex] = newAnswer; // Update answer
          } else {
            answers.push(newAnswer); // Add new answer
          }
          set({ userAnswers: answers });
        };

        updateUserAnswers(currentAnswers);
      },

      // Navigate to specific question
      goToQuestion: (index: number) => {
        const test = get().currentTest;
        if (test && index >= 0 && index < test.questions.length) {
          set({ currentQuestionIndex: index });
        }
      },

      // Submit the test and calculate results
      submitTest: () => {
        const { currentTest, userAnswers } = get();
        if (!currentTest) return;

        const questions = currentTest.questions;
        let correctAnswers = 0;

        // Calculate score
        questions.forEach(question => {
          const userAnswer = userAnswers.find(a => a.questionId === question.id);
          if (userAnswer && userAnswer.selectedIndex === question.answerIndex) {
            correctAnswers++;
          }
        });

        const totalQuestions = questions.length;
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);

        const result: TestResult = {
          score: correctAnswers,
          totalQuestions,
          percentage,
          userAnswers,
          questions,
          completedAt: new Date(),
        };

        set({
          testResult: result,
          isTestCompleted: true,
        });
      },

      // Reset test to initial state
      resetTest: () => {
        set({
          userAnswers: [],
          currentQuestionIndex: 0,
          isTestStarted: false,
          isTestCompleted: false,
          testResult: null,
          originalQuestions: get().originalQuestions, // Reset original questions as well
        });
      },

      // Shuffle questions
      shuffleQuestions: () => {
        const test = get().currentTest;
        if (!test) return;

        const allQuestions = test.questions.length > 20 && test.title?.includes('Randomized')
          ? test.questions
          : get().originalQuestions || test.questions;

        // Shuffle logic with random selection of 20 questions
        const shuffledQuestions = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 20);
        set({
          currentTest: {
            ...test,
            questions: shuffledQuestions,
          },
          userAnswers: [],
          currentQuestionIndex: 0,
        });
      },

      // Get answer for specific question
      getAnswerForQuestion: (questionId: string) => {
        return get().userAnswers.find(a => a.questionId === questionId);
      },

      // Check if question is answered
      isQuestionAnswered: (questionId: string) => {
        return get().userAnswers.some(a => a.questionId === questionId);
      },

      // Get progress statistics
      getProgress: () => {
        const { currentTest, userAnswers } = get();
        if (!currentTest) return { answered: 0, total: 0, percentage: 0 };

        const total = currentTest.questions.length;
        const answered = userAnswers.length;
        const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;

        return { answered, total, percentage };
      },
    }),
    {
      name: 'practice-test-storage',
      partialize: (state) => ({
        currentTest: state.currentTest,
        userAnswers: state.userAnswers,
        testResult: state.testResult,
      }),
    }
  )
);
