// AI Service using OpenRouter API

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = 'openai/gpt-3.5-turbo'; // Fast and cost-effective model

// Validate API key on module load
if (!OPENROUTER_API_KEY) {
  console.error('⚠️ VITE_OPENROUTER_API_KEY is not set. Please add it to your .env file.');
}

export interface AIQuestion {
  question: string;
  options: string[];
  answer: string;
  answerIndex: number;
}

export interface AIAnalysisResult {
  hasQuestions: boolean;
  questions?: AIQuestion[];
  summary?: string;
  questionCount?: number;
}

/**
 * Call OpenRouter API with error handling
 */
async function callOpenRouterAPI(prompt: string, retryCount = 0): Promise<string> {
  const maxRetries = 2;
  
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://kinshukkush.github.io/PARSE-N-PRACTICE/',
        'X-Title': 'Parse & Practice',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }));
      
      // Handle rate limit errors
      if (response.status === 429) {
        console.error('❌ OpenRouter API rate limit exceeded');
        throw new Error('API rate limit exceeded. Please try again in a moment.');
      }
      
      console.error('❌ OpenRouter API error:', errorData);
      throw new Error(errorData?.error?.message || `API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract text from OpenRouter response (OpenAI-compatible format)
    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content;
    } else {
      console.error('❌ Unexpected OpenRouter response structure:', data);
      throw new Error('Unexpected response structure from OpenRouter API');
    }
  } catch (error) {
    console.error('❌ OpenRouter API call failed:', error);
    
    // Retry logic for network errors (but not for rate limits)
    if (retryCount < maxRetries && error instanceof TypeError) {
      console.log(`Retrying... (${retryCount + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
      return callOpenRouterAPI(prompt, retryCount + 1);
    }
    
    throw error;
  }
}

/**
 * Analyze text content using AI to detect questions and answers
 */
export async function analyzeTextWithAI(text: string): Promise<AIAnalysisResult> {
  console.log('🔍 Starting AI analysis...');

  try {
    console.log('📤 Sending analysis request to OpenRouter AI...');
    
    const prompt = `Analyze the following text and determine if it contains questions and answers.

Text:
"""
${text.substring(0, 2000)}
"""

Your response MUST be a valid JSON object with this exact structure:
{
  "hasQuestions": true or false,
  "questionCount": number (if questions found),
  "summary": "brief summary of the content if no questions found"
}

If the text contains questions (in ANY format: multiple choice, Q&A, numbered questions, etc.), set hasQuestions to true and provide questionCount.
If no questions found, set hasQuestions to false and provide a brief summary of what the content is about.

Respond ONLY with the JSON object, no additional text.`;

    const responseText = await callOpenRouterAPI(prompt);

    console.log('📥 Received analysis response');
    
    // Parse the AI response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Invalid AI response format. Response text:', responseText);
      throw new Error("Invalid AI response format");
    }

    const result = JSON.parse(jsonMatch[0]);
    console.log('✅ Analysis complete:', result);
    return result;
  } catch (error) {
    console.error("❌ AI analysis error:", error);
    console.error("❌ Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      type: typeof error,
      stringified: JSON.stringify(error, Object.getOwnPropertyNames(error))
    });
    throw new Error(`Failed to analyze text with AI: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Extract questions and answers from text using AI
 * Handles both multiple choice and simple Q&A formats
 */
export async function extractQuestionsWithAI(text: string, maxQuestions?: number): Promise<AIQuestion[]> {
  console.log('📝 Starting question extraction...');

  try {
    const questionLimit = maxQuestions ? `Extract exactly ${maxQuestions} questions.` : 'Extract all questions you can find.';
    
    console.log('📤 Sending extraction request to OpenRouter AI...');
    
    const prompt = `Extract questions from the following text and convert them ALL to multiple-choice format. ${questionLimit}

Text:
"""
${text}
"""

IMPORTANT INSTRUCTIONS:
- If the text has multiple choice options (a, b, c, d or A, B, C, D), use those options
- If the text only has questions and answers (like "Q: ... A: ..." or "1. ... Answer: ..."), you MUST CREATE 4 plausible multiple choice options where:
  * One option is the correct answer
  * Three options are realistic but incorrect alternatives
  * All options should be similar in length and style
  * Make the wrong options believable and challenging

Format your response as a JSON array:
[
  {
    "question": "The question text (clean, without Q: or numbers)",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "answer": "The correct answer (must match one option EXACTLY)",
    "answerIndex": 0
  }
]

CRITICAL RULES:
1. Always create EXACTLY 4 options for each question
2. The "answer" must match one option EXACTLY (character for character)
3. The "answerIndex" must be the correct position (0, 1, 2, or 3)
4. Create realistic wrong options that are plausible but incorrect
5. Respond ONLY with valid JSON array, no markdown code blocks, no extra text

Example for Q&A format:
Input: "Q: What is the capital of France? A: Paris"
Output: [{
  "question": "What is the capital of France?",
  "options": ["London", "Berlin", "Paris", "Madrid"],
  "answer": "Paris",
  "answerIndex": 2
}]

Respond ONLY with the JSON array.`;

    const responseText = await callOpenRouterAPI(prompt);

    console.log('📥 Received extraction response');
    
    // Extract JSON from response - handle both raw JSON and markdown code blocks
    let jsonText = responseText;
    
    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Extract JSON array
    const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('Invalid AI response format:', responseText);
      throw new Error("Could not find JSON array in AI response");
    }

    const questions: AIQuestion[] = JSON.parse(jsonMatch[0]);
    
    console.log(`✅ Extracted ${questions.length} questions`);
    
    // Validate and fix questions
    const validatedQuestions = questions
      .filter(q => q.question && q.options && q.options.length >= 2)
      .map((q, index) => {
        // Ensure exactly 4 options
        while (q.options.length < 4) {
          q.options.push(`Option ${q.options.length + 1}`);
        }
        if (q.options.length > 4) {
          q.options = q.options.slice(0, 4);
        }
        
        // Ensure answerIndex is correct
        let answerIndex = q.answerIndex;
        if (answerIndex < 0 || answerIndex >= q.options.length) {
          // Try to find the answer in options
          answerIndex = q.options.findIndex(opt => 
            opt.toLowerCase().trim() === q.answer.toLowerCase().trim()
          );
          if (answerIndex === -1) {
            answerIndex = 0; // Default to first option if not found
          }
        }
        
        return {
          question: q.question.trim(),
          options: q.options.map(opt => opt.trim()),
          answer: q.options[answerIndex].trim(),
          answerIndex: answerIndex
        };
      });

    console.log(`✅ Validated ${validatedQuestions.length} questions`);
    return validatedQuestions;
  } catch (error) {
    console.error("❌ AI question extraction error:", error);
    throw new Error(`Failed to extract questions with AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Chat with AI about the content
 */
export async function chatWithAI(userMessage: string, context: string): Promise<string> {
  console.log('💬 Starting AI chat...');

  try {
    const prompt = `You are a helpful AI assistant. The user has uploaded some content and wants to discuss it with you.

Content:
"""
${context.substring(0, 3000)}
"""

User message: ${userMessage}

Provide a helpful, informative response based on the content provided.`;

    console.log('📤 Sending chat message to OpenRouter AI...');
    
    const responseText = await callOpenRouterAPI(prompt);

    console.log('✅ Chat response received');
    
    return responseText;
  } catch (error) {
    console.error("❌ AI chat error:", error);
    throw new Error(`Failed to chat with AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Stream chat responses for longer conversations
 * Note: OpenRouter supports streaming, but for simplicity we're using regular response
 */
export async function* streamChatWithAI(userMessage: string, context: string): AsyncGenerator<string> {
  console.log('💬 Starting AI chat stream...');

  try {
    const prompt = `You are a helpful AI assistant. The user has uploaded some content and wants to discuss it with you.

Content:
"""
${context.substring(0, 3000)}
"""

User message: ${userMessage}

Provide a helpful, informative response based on the content provided.`;

    const response = await callOpenRouterAPI(prompt);
    
    // For now, yield the entire response at once
    // To implement true streaming, we would need to use the streaming endpoint
    yield response;
    
    console.log('✅ Chat stream complete');
  } catch (error) {
    console.error("❌ AI stream chat error:", error);
    throw new Error(`Failed to stream chat with AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
