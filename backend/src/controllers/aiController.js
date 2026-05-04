import { generateDescription } from '../utils/aiService.js';

export const getAiDescription = async (req, res) => {
  try {
    const { title, text, type, mode = 'description' } = req.query;
    
    let input = text || title;
    let context = "";

    if (mode === 'description' && text && title) {
      // Enhance mode: text is the current brief description, title is the context
      input = text;
      context = title;
    } else if (mode === 'description' && !text && title) {
      // Generate mode: only title is provided
      input = title;
    }

    if (!input) {
      return res.status(400).json({ message: 'Input text or title is required' });
    }

    const result = await generateDescription(input, context, type, mode);
    res.status(200).json({ description: result, title: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
