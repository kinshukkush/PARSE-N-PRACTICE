// AI Service using Puter.js for free OpenAI API access
// puter is loaded globally from the Puter.js script in index.html

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
 * Wait for Puter.js to be loaded and ensure user is authenticated
 */
async function waitForPuter(maxAttempts = 30): Promise<boolean> {
  // Wait for Puter.js to load
  for (let i = 0; i < maxAttempts; i++) {
    if (typeof puter !== 'undefined' && puter?.ai) {
      console.log('✅ Puter.js loaded successfully');
      break;
    }
    console.log(`⏳ Waiting for Puter.js... (${i + 1}/${maxAttempts})`);
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  if (typeof puter === 'undefined' || !puter?.ai) {
    console.error('❌ Puter.js failed to load');
    return false;
  }

  console.log('📋 Puter object available:', {
    hasAI: !!puter.ai,
    hasAuth: !!puter.auth,
    aiType: typeof puter.ai,
    authType: typeof puter.auth
  });

  // Test the API - if not authenticated, Puter will prompt automatically
  try {
    console.log('🧪 Testing Puter.ai API...');
    console.log('Making test API call (using default model)...');
    
    // Try without specifying model - let Puter use default
    const testResponse = await puter.ai.chat('Say "OK"');
    
    console.log('✅ Puter.ai API test successful!');
    console.log('Response type:', typeof testResponse);
    console.log('Response value:', testResponse);
    return true;
  } catch (error: any) {
    console.error('❌ API test failed!');
    console.error('Full error object:', error);
    console.error('Error type:', typeof error);
    console.error('Error keys:', error ? Object.keys(error) : 'null');
    
    if (error && typeof error === 'object') {
      console.error('Error properties:', {
        success: error.success,
        error: error.error,
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
    
    // If error indicates auth needed, show helpful message
    if (error?.error?.includes('auth') || error?.message?.includes('auth') || error?.error?.includes('401')) {
      console.error('⚠️ Authentication required. Please sign in to Puter first.');
      alert('To use AI features, you need to sign in to Puter.\n\nPlease visit https://puter.com and create a free account, then refresh this page.');
    }
    
    return false;
  }
}

/**
 * Analyze text content using AI to detect questions and answers
 */
export async function analyzeTextWithAI(text: string): Promise<AIAnalysisResult> {
  console.log('🔍 Starting AI analysis...');
  
  // Wait for Puter.js to load
  const puterReady = await waitForPuter();
  if (!puterReady) {
    throw new Error('Puter.js failed to load. Please refresh the page and try again.');
  }

  try {
    // Verify puter.ai is actually available
    if (!puter || !puter.ai || typeof puter.ai.chat !== 'function') {
      console.error('❌ Puter.ai API not available:', {
        puterExists: typeof puter !== 'undefined',
        aiExists: typeof puter?.ai !== 'undefined',
        chatExists: typeof puter?.ai?.chat !== 'undefined'
      });
      throw new Error('Puter.ai API is not available');
    }

    console.log('✅ Puter.ai verified available');
    console.log('📤 Sending analysis request to AI...');
    
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

    const response = await puter.ai.chat(prompt);

    console.log('📥 Received analysis response:', response);
    
    // Extract text from response - handle different response formats
    let responseText = '';
    
    if (typeof response === 'string') {
      // Direct string response
      responseText = response;
    } else if (response && typeof response === 'object') {
      // Check for async iterator (streaming response)
      if (Symbol.asyncIterator in response) {
        const chunks: string[] = [];
        for await (const chunk of response as AsyncIterable<any>) {
          chunks.push(String(chunk));
        }
        responseText = chunks.join('');
      } else {
        // Check common response object structures
        console.log('Response keys:', Object.keys(response));
        
        // Try various possible structures
        if (response.choices && Array.isArray(response.choices) && response.choices[0]?.message?.content) {
          // OpenAI-like structure
          responseText = response.choices[0].message.content;
        } else if (response.message && typeof response.message === 'object' && response.message.content) {
          // Nested message.content structure
          responseText = response.message.content;
        } else if (typeof response.message === 'string') {
          // Direct message string
          responseText = response.message;
        } else if (response.text) {
          responseText = response.text;
        } else if (response.content) {
          responseText = response.content;
        } else if (response.response) {
          responseText = response.response;
        } else if (response.data) {
          responseText = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        } else if (response.result) {
          responseText = response.result;
        } else {
          // Fallback: stringify the entire response
          console.warn('Unknown response structure, stringifying entire object');
          responseText = JSON.stringify(response);
        }
      }
    }
    
    console.log('Extracted text:', responseText);
    
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
  
  // Wait for Puter.js to load
  const puterReady = await waitForPuter();
  if (!puterReady) {
    throw new Error('Puter.js failed to load. Please refresh the page and try again.');
  }

  try {
    const questionLimit = maxQuestions ? `Extract exactly ${maxQuestions} questions.` : 'Extract all questions you can find.';
    
    console.log('📤 Sending extraction request to AI...');
    
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

    const response = await puter.ai.chat(prompt);

    console.log('📥 Received extraction response');
    console.log('Response type:', typeof response);
    
    // Extract text from response object - handle different response formats
    let responseText = '';
    if (typeof response === 'string') {
      responseText = response;
    } else if (response && typeof response === 'object') {
      // Check for async iterator (streaming response)
      if (Symbol.asyncIterator in response) {
        const chunks: string[] = [];
        for await (const chunk of response as AsyncIterable<any>) {
          chunks.push(String(chunk));
        }
        responseText = chunks.join('');
      } else {
        // Check common response object structures
        if (response.choices && Array.isArray(response.choices) && response.choices[0]?.message?.content) {
          responseText = response.choices[0].message.content;
        } else if (response.message && typeof response.message === 'object' && response.message.content) {
          responseText = response.message.content;
        } else if (typeof response.message === 'string') {
          responseText = response.message;
        } else if (response.text) {
          responseText = response.text;
        } else if (response.content) {
          responseText = response.content;
        } else if (response.response) {
          responseText = response.response;
        } else if (response.data) {
          responseText = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        } else if (response.result) {
          responseText = response.result;
        } else {
          console.warn('Unknown response structure:', Object.keys(response));
          responseText = JSON.stringify(response);
        }
      }
    }
    
    console.log('Extracted response text:', responseText.substring(0, 200));
    
    // Extract JSON from response - handle both raw JSON and markdown code blocks
    let jsonText = responseText;
    
    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Extract JSON array
    const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('Invalid AI response format:', response);
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
  
  // Wait for Puter.js to load
  const puterReady = await waitForPuter();
  if (!puterReady) {
    throw new Error('Puter.js failed to load. Please refresh the page and try again.');
  }

  try {
    const prompt = `You are a helpful AI assistant. The user has uploaded some content and wants to discuss it with you.

Content:
"""
${context.substring(0, 3000)}
"""

User message: ${userMessage}

Provide a helpful, informative response based on the content provided.`;

    console.log('📤 Sending chat message to AI...');
    
    const response = await puter.ai.chat(prompt);

    console.log('✅ Chat response received');
    
    // Extract text from response object - handle different response formats
    let responseText = '';
    if (typeof response === 'string') {
      responseText = response;
    } else if (response && typeof response === 'object') {
      // Check for async iterator (streaming response)
      if (Symbol.asyncIterator in response) {
        const chunks: string[] = [];
        for await (const chunk of response as AsyncIterable<any>) {
          chunks.push(String(chunk));
        }
        responseText = chunks.join('');
      } else {
        // Check common response object structures
        if (response.choices && Array.isArray(response.choices) && response.choices[0]?.message?.content) {
          responseText = response.choices[0].message.content;
        } else if (response.message && typeof response.message === 'object' && response.message.content) {
          responseText = response.message.content;
        } else if (typeof response.message === 'string') {
          responseText = response.message;
        } else if (response.text) {
          responseText = response.text;
        } else if (response.content) {
          responseText = response.content;
        } else if (response.response) {
          responseText = response.response;
        } else if (response.data) {
          responseText = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        } else if (response.result) {
          responseText = response.result;
        } else {
          console.warn('Unknown response structure:', Object.keys(response));
          responseText = String(response);
        }
      }
    } else {
      responseText = String(response);
    }
    
    return responseText;
  } catch (error) {
    console.error("❌ AI chat error:", error);
    throw new Error(`Failed to chat with AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Stream chat responses for longer conversations
 */
export async function* streamChatWithAI(userMessage: string, context: string): AsyncGenerator<string> {
  console.log('💬 Starting AI chat stream...');
  
  // Wait for Puter.js to load
  const puterReady = await waitForPuter();
  if (!puterReady) {
    throw new Error('Puter.js failed to load. Please refresh the page and try again.');
  }

  try {
    const prompt = `You are a helpful AI assistant. The user has uploaded some content and wants to discuss it with you.

Content:
"""
${context.substring(0, 3000)}
"""

User message: ${userMessage}

Provide a helpful, informative response based on the content provided.`;

    const response = await puter.ai.chat(prompt, { 
      model: "gpt-5-nano",
      stream: true,
      temperature: 0.7,
      max_tokens: 1000
    });

    for await (const part of response) {
      if (part?.text) {
        yield part.text;
      }
    }
    
    console.log('✅ Chat stream complete');
  } catch (error) {
    console.error("❌ AI stream chat error:", error);
    throw new Error(`Failed to stream chat with AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
