import { ChatOpenAI } from "@langchain/openai";
import { config } from '../config/envConfig.js';

/**
 * Generates or improves text based on input using OpenRouter AI.
 * Implements fallback logic across multiple free models.
 */
export const generateDescription = async (text, context = '', type = 'project', mode = 'description') => {
  if (!config.openRouterApiKey) {
    throw new Error('OpenRouter API Key is not configured.');
  }

  // Fast and reliable free models
  const models = [
    "google/gemini-2.0-flash-lite-preview-02-05:free",
    "meta-llama/llama-3.2-3b-instruct:free",
    "mistralai/mistral-7b-instruct:free",
    "openchat/openchat-7b:free",
    "huggingfaceh4/zephyr-7b-beta:free"
  ];

  const createModel = (modelName) => new ChatOpenAI({
    apiKey: config.openRouterApiKey,
    modelName: modelName,
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "https://github.com/team-task-manager",
        "X-Title": "Team Task Manager",
      },
    },
    temperature: 0.7,
    maxTokens: 150,
    timeout: 15000, // 15s timeout per model to move fast if one hangs
  });

  const primaryModel = createModel(models[0]);
  const modelWithFallbacks = primaryModel.withFallbacks(
    models.slice(1).map(m => createModel(m))
  );

  let prompt = "";
  if (mode === 'title') {
    prompt = `You are a professional project manager. Improve this ${type} title to be more professional and clear: "${text}". Provide only the improved title text. Do not use quotes or prefixes.`;
  } else {
    if (context && text) {
      // Enhancement mode: text is description, context is title
      prompt = `You are a professional project manager. Enhance and professionalize this brief description for a ${type} titled "${context}": "${text}". Make it sound professional and results-oriented in one or two sentences. Provide only the enhanced description text.`;
    } else {
      // Generation mode: text is title
      prompt = `You are a professional project manager. Write a short, engaging one-sentence description for a ${type} titled: "${text}". Be concise and professional. Do not use quotes or prefixes.`;
    }
  }

  try {
    const response = await modelWithFallbacks.invoke(prompt);
    return response.content.trim();
  } catch (error) {
    console.error('AI Generation Error (All models failed):', error);
    throw new Error('All AI models are currently busy or unavailable. Please try again in a few moments.');
  }
};
