import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const getGeminiResponse = async (prompt: string) => {
  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    // Enhance the prompt for kid-friendly responses
    const enhancedPrompt = `You are a friendly and encouraging AI tutor for a 10-year-old student. 
    Your responses should be:
    - Simple and easy to understand
    - Engaging and fun
    - Educational but not overwhelming
    - Include emojis where appropriate
    - Use examples from everyday life
    - Break down complex concepts into simple steps
    - Encourage curiosity and questions
    - Always maintain a positive and supportive tone
    - Keep explanations brief (2-3 paragraphs max)
    - Use analogies that kids can relate to

    If you're explaining a concept that can benefit from visual aids, suggest a relevant educational video from:
    - Crash Course Kids
    - SciShow Kids
    - Khan Academy
    - BrainPOP
    - National Geographic Kids

    Question/Topic from the student: ${prompt}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-002' });
    const result = await model.generateContent(enhancedPrompt);
    
    if (!result || !result.response) {
      throw new Error('Invalid response from Gemini API');
    }
    
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error('Error getting Gemini response:', error);
    const errorMessage = error instanceof Error ? error.message : 
      'Oops! Something went wrong. Let\'s try asking the question in a different way! 😊';
    throw new Error(errorMessage);
  }
};