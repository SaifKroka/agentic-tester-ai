// testCases.js
const axios = require('axios');

/**
 * Generates test cases dynamically using DeepSeek API
 * @returns Array of test cases with {prompt, expected}
 */
async function generateTestCases() {
  try {
    const apiKey = "sk-0bd5d12cd99e4383a87c1e675ae37b8f";
    
    const prompt = `Generate 7 test cases for an AI chatbot testing framework. 
    Each test case must be in this exact JSON format:
    {
      "prompt": "Question to ask the AI",
      "expected": "Keyword or phrase to verify in the response"
    }
    Focus on diverse topics including:
    - Geography
    - Literature
    - Science
    - Math
    - Language
    - Technology
    - Humor
    
    Return ONLY the JSON array without any explanation or extra text.`;

    const requestBody = {
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are a test case generator for AI systems" },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1024
    };

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions', 
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Try to parse the response
    let content = response.data.choices[0].message.content;
    
    // Clean up any extra text around the JSON
    const jsonStart = content.indexOf('[');
    const jsonEnd = content.lastIndexOf(']') + 1;
    
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      content = content.substring(jsonStart, jsonEnd);
    }

    try {
      const testCases = JSON.parse(content);
      console.log(`✅ Successfully generated ${testCases.length} test cases using DeepSeek`);
      return testCases;
    } catch (parseError) {
      console.error("⚠️ JSON parsing failed:", parseError.message);
      return getDefaultTestCases();
    }
    
  } catch (error) {
    console.error("⚠️ Fallback: Using default test cases");
    return getDefaultTestCases();
  }
}

function getDefaultTestCases() {
  return [
    { prompt: "What is the capital of France?", expected: "Paris" },
    { prompt: "Who wrote the novel '1984'?", expected: "George Orwell" },
    { prompt: "Explain photosynthesis briefly.", expected: "process" },
    { prompt: "What is 5 + 7?", expected: "12" },
    { prompt: "Name the largest planet in our solar system.", expected: "Jupiter" },
    { prompt: "Tell me a joke about cats.", expected: "cat" },
    { prompt: "Translate 'hello' to Spanish.", expected: "hola" }
  ];
}

module.exports = generateTestCases;