import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeSymptomsWithGemini = async (symptomsText) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a medical assistant AI helping nurses analyze patient symptoms.

Analyze the following patient symptoms and provide possible medical conditions:
"${symptomsText}"

Return your response in the following JSON format (respond ONLY with valid JSON, no additional text):
[
  {
    "condition": "condition name",
    "severity": "low/moderate/high",
    "recommendation": "what the nurse should do"
  }
]

Provide 2-4 possible conditions based on the symptoms. Be professional and medically accurate.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const conditions = JSON.parse(jsonMatch[0]);
      return conditions;
    }

    return [
      {
        condition: 'Unable to analyze symptoms',
        severity: 'moderate',
        recommendation: 'Please consult with a doctor for proper diagnosis'
      }
    ];
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return [
      {
        condition: 'Analysis service unavailable',
        severity: 'moderate',
        recommendation: 'Please manually assess the patient or try again later'
      }
    ];
  }
};
