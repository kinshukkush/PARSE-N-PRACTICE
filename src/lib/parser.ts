export interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
  answerIndex: number;
}

export interface ParsedTest {
  questions: Question[];
  title?: string;
}

/**
 * Parse multiple choice questions from text input
 * Supports various formats including:
 * - Q1. Question text
 * - 1. Question text
 * - Just starting with text
 * 
 * Options can be:
 * - A. Option text
 * - a) Option text
 * - 1) Option text
 * 
 * Answers can be:
 * - 👉 Answer: C. Option text
 * - Answer: C
 * - Correct answer: C
 */
export function parseQuestionsFromText(text: string): ParsedTest {
  const questions: Question[] = [];
  
  // Normalize line breaks and clean up text
  const cleanText = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();

  // Split into potential question blocks
  const blocks = cleanText.split(/\n\s*\n+/);
  
  for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
    const block = blocks[blockIndex].trim();
    if (!block) continue;

    const lines = block.split('\n').map(line => line.trim()).filter(line => line);

    // Try to identify question line
    let questionLine = '';
    let questionLineIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Look for question patterns
      if (
        /^Q\d+[\.\)]\s+/.test(line) ||
        /^\d+[\.\)]\s+/.test(line) ||
        (i === 0 && !isOptionLine(line) && !isAnswerLine(line))
      ) {
        questionLine = line.replace(/^(Q?\d+[\.\)]\s*)/, '').trim();
        questionLineIndex = i;
        break;
      }
    }

    if (!questionLine) continue;

    // Extract options
    const options = [];
    const optionLines = [];
    for (let i = questionLineIndex + 1; i < lines.length; i++) {
      const line = lines[i];
      if (isAnswerLine(line)) break;
      if (isOptionLine(line)) {
        // Support both 'A. Option' and 'a) Option'
        let optionText = line;
        if (/^[A-Za-z][\.\)]\s+/.test(line)) {
          optionText = line.replace(/^[A-Za-z][\.\)]\s*/, '').trim();
        } else if (/^[A-Za-z]\)\s+/.test(line)) {
          optionText = line.replace(/^[A-Za-z]\)\s*/, '').trim();
        }
        options.push(optionText);
        optionLines.push(line);
      }
    }

    // Find answer
    let answer = '';
    let answerIndex = -1;

    // Look for answer in current block and next block
    const searchText = block + (blocks[blockIndex + 1] ? '\n\n' + blocks[blockIndex + 1] : '');

    // Patterns for answers: letter, option text, etc.
    const answerPatterns = [
      /(?:👉\s*)?(?:Answer|Correct\s*Answer|Solution):\s*([A-Za-z])\.?\s*(.+?)(?:\n|$)/i, // Answer: C. Option text
      /(?:👉\s*)?(?:Answer|Correct\s*Answer|Solution):\s*([A-Za-z])\.?\s*$/im, // Answer: C
      /(?:👉\s*)?(?:Answer|Correct\s*Answer|Solution):\s*(.+?)(?:\n|$)/i, // Answer: Option text
    ];

    let found = false;
    for (const pattern of answerPatterns) {
      const match = searchText.match(pattern);
      if (match) {
        // If answer is a letter
        if (match[1] && /^[A-Za-z]$/.test(match[1])) {
          const answerLetter = match[1].toUpperCase();
          answerIndex = answerLetter.charCodeAt(0) - 'A'.charCodeAt(0);
          if (answerIndex >= 0 && answerIndex < options.length) {
            answer = options[answerIndex];
            found = true;
            break;
          }
        }
        // If answer is option text
        const answerContent = (match[2] || match[1] || '').trim();
        if (answerContent) {
          // Try exact match
          let matchedIndex = options.findIndex(opt => opt.toLowerCase() === answerContent.toLowerCase());
          // Try partial match
          if (matchedIndex === -1) {
            matchedIndex = options.findIndex(opt =>
              opt.toLowerCase().includes(answerContent.toLowerCase()) ||
              answerContent.toLowerCase().includes(opt.toLowerCase())
            );
          }
          if (matchedIndex !== -1) {
            answer = options[matchedIndex];
            answerIndex = matchedIndex;
            found = true;
            break;
          }
        }
      }
    }

    // Only add question if we have valid options and answer
    if (questionLine && options.length >= 2 && answer && answerIndex >= 0) {
      questions.push({
        id: `q_${questions.length + 1}`,
        question: questionLine,
        options,
        answer,
        answerIndex
      });
    }
  }

  // If more than 20 questions, select 20 random for initial test
  let selectedQuestions = questions;
  if (questions.length > 20) {
    selectedQuestions = shuffleArray(questions).slice(0, 20);
  }

  return {
    questions: selectedQuestions,
    title: `Practice Test (${selectedQuestions.length} questions)`
  };
}

function isOptionLine(line: string): boolean {
  return /^[A-Za-z][\.\)]\s+/.test(line) || /^[a-zA-Z]\)\s+/.test(line);
}

function isAnswerLine(line: string): boolean {
  return /(?:👉\s*)?(?:Answer|Correct\s*Answer|Solution):/i.test(line);
}

/**
 * Shuffle array in place using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Export test data as JSON
 */
export function exportTestAsJSON(test: ParsedTest): string {
  return JSON.stringify(test, null, 2);
}

/**
 * Sample text for demonstration
 */
export const SAMPLE_TEXT = `Q1. Which of the following is NOT a characteristic of a project?
A. Temporary in nature
B. Unique deliverables
C. Ongoing and repetitive
D. Has defined start and end dates
👉 Answer: C. Ongoing and repetitive

Q2. What is the primary purpose of project management?
A. To increase company profits
B. To deliver project objectives within scope, time, and budget
C. To manage team conflicts
D. To create detailed documentation
👉 Answer: B. To deliver project objectives within scope, time, and budget

Q3. Which project management methodology emphasizes iterative development?
A. Waterfall
B. Agile
C. Critical Path Method
D. PRINCE2
👉 Answer: B. Agile`;