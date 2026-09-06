const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/env');
const AppError = require('../utils/AppError');

/**
 * Service to interact with Google Gemini AI for generating sprint tasks
 */
class AiService {
  constructor() {
    this.apiKey = config.geminiApiKey || process.env.GEMINI_API_KEY || '';
  }

  /**
   * Helper to get initialized Google Generative AI client
   */
  getClient() {
    const key = this.apiKey || config.geminiApiKey || process.env.GEMINI_API_KEY;
    if (!key || key.trim() === '') {
      throw AppError.badRequest(
        'Gemini API key is not configured. Please set GEMINI_API_KEY in backend/.env'
      );
    }
    return new GoogleGenerativeAI(key);
  }

  /**
   * Cleans JSON output from markdown code blocks or stray formatting
   */
  cleanJsonText(text) {
    if (!text) return '';
    let cleaned = text.trim();
    // Strip markdown code fence markers (```json ... ``` or ``` ... ```)
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    }
    return cleaned.trim();
  }

  /**
   * Normalizes and validates task priority
   */
  normalizePriority(priority) {
    if (!priority) return 'medium';
    const lower = String(priority).toLowerCase().trim();
    if (['low', 'medium', 'high', 'urgent'].includes(lower)) {
      return lower;
    }
    if (lower.includes('urg') || lower.includes('crit')) return 'urgent';
    if (lower.includes('hi')) return 'high';
    if (lower.includes('low')) return 'low';
    return 'medium';
  }

  /**
   * Generates 4-6 suggested sprint tasks for a given project goal or description
   * @param {string} goal - Goal or description provided by user
   * @param {string} [projectName] - Optional project context
   * @returns {Promise<Array<{title: string, description: string, priority: string, estimatedHours: number, tags: string[]}>>}
   */
  async generateTasksForGoal(goal, projectName = '') {
    if (!goal || typeof goal !== 'string' || goal.trim().length < 3) {
      throw AppError.badRequest('Please provide a valid project goal or description');
    }

    const genAI = this.getClient();

    const systemInstruction = `You are a Principal Software Architect and Agile Scrum Master on DevTrack.
Your job is to analyze engineering project goals or feature requests and decompose them into 4 to 6 actionable, high-quality sprint tasks.

Each task must include:
- "title": Concise, action-oriented engineering task title (e.g. "Implement OAuth2 / JWT Token Refresh Flow", "Set Up MongoDB Indexing & TTL").
- "description": Clear technical summary with acceptance criteria, architecture considerations, and key implementation notes.
- "priority": Exactly one of ["urgent", "high", "medium", "low"]. Use realistic priorities based on dependencies.
- "estimatedHours": A realistic engineering estimate in hours (integer between 2 and 16).
- "tags": 1 to 3 relevant technical tags (e.g. ["Backend", "Auth", "Security"], ["Database", "Performance"], ["Frontend", "React"]).

OUTPUT FORMAT REQUIREMENTS:
You MUST return ONLY a valid JSON array containing 4 to 6 task objects.
Do not include markdown formatting or explanations outside the JSON array.`;

    const prompt = `Project / Feature Goal: "${goal.trim()}"${projectName ? `\nContext Project Name: "${projectName}"` : ''}

Generate 4 to 6 structured engineering tasks as a JSON array adhering to the specifications.`;

    // Attempt generation with primary and fallback models
    // Use models confirmed available via the Gemini ListModels API
    const modelsToTry = [
      { name: 'gemini-2.5-flash', jsonMode: true },
      { name: 'gemini-flash-latest', jsonMode: true },
      { name: 'gemini-pro-latest', jsonMode: true },
      { name: 'gemini-2.5-pro', jsonMode: true },
      { name: 'gemini-2.5-flash-lite', jsonMode: true },
    ];
    let lastError = null;

    for (const { name: modelName, jsonMode } of modelsToTry) {
      try {
        const generationConfig = {
          temperature: 0.4,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 2048,
          ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
        };

        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemInstruction,
          generationConfig,
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (!text || text.trim() === '') {
          continue;
        }

        const cleaned = this.cleanJsonText(text);
        let parsedTasks = JSON.parse(cleaned);

        // If response is wrapped in an object like { tasks: [...] }
        if (!Array.isArray(parsedTasks) && parsedTasks && Array.isArray(parsedTasks.tasks)) {
          parsedTasks = parsedTasks.tasks;
        }

        if (Array.isArray(parsedTasks) && parsedTasks.length > 0) {
          // Normalize and validate tasks
          const validatedTasks = parsedTasks.slice(0, 6).map((item, idx) => {
            const title = typeof item.title === 'string' && item.title.trim()
              ? item.title.trim()
              : `Sprint Task ${idx + 1}: ${goal.trim().slice(0, 30)}`;
            
            const description = typeof item.description === 'string' && item.description.trim()
              ? item.description.trim()
              : `Implementation and testing for ${title}.`;

            const priority = this.normalizePriority(item.priority);
            const estimatedHours = Number.isFinite(item.estimatedHours) && item.estimatedHours > 0
              ? Math.min(Math.max(Math.round(item.estimatedHours), 1), 40)
              : 4;

            const tags = Array.isArray(item.tags) && item.tags.length > 0
              ? item.tags.map((t) => String(t).trim()).filter(Boolean).slice(0, 4)
              : ['Engineering', 'Feature'];

            return {
              title,
              description,
              priority,
              estimatedHours,
              tags,
            };
          });

          return validatedTasks;
        }
      } catch (err) {
        lastError = err;
        // Check for specific fatal errors like bad API key or quota
        const errorMessage = err.message || '';
        const status = err.status || err.statusCode;

        if (
          errorMessage.includes('API_KEY_INVALID') ||
          errorMessage.includes('API key not valid') ||
          errorMessage.includes('expired')
        ) {
          throw AppError.unauthorized('Google Gemini API Key is invalid or expired. Please check GEMINI_API_KEY in backend/.env');
        }

        if (
          errorMessage.includes('RESOURCE_EXHAUSTED') ||
          errorMessage.includes('quota') ||
          status === 429
        ) {
          throw new AppError('Google Gemini rate limit or quota exceeded. Please try again in a few moments.', 429);
        }

        // If model not found or unsupported, try next model in loop
        if (
          errorMessage.includes('models/') ||
          errorMessage.includes('not found') ||
          errorMessage.includes('unsupported')
        ) {
          continue;
        }
      }
    }

    // If all model attempts failed, throw descriptive error
    console.error('Gemini Task Generation Error:', lastError);
    if (lastError && lastError.isOperational) {
      throw lastError;
    }
    throw new AppError(
      `Failed to generate tasks using Google Gemini: ${lastError?.message || 'Unknown error'}`,
      500
    );
  }
}

module.exports = new AiService();
