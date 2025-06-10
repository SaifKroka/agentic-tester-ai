// evaluator.js
const axios = require('axios');

/**
 * Uses DeepSeek API to evaluate if the response meets the expected criteria
 * @param {string} response - The AI's response to evaluate
 * @param {string} expected - The expected keyword/phrase
 * @returns {Promise<boolean>} Whether the response meets expectations
 */
async function evaluateResponse(response, expected) {
  if (!response || !expected) return false;

  try {
    const apiKey = "sk-0bd5d12cd99e4383a87c1e675ae37b8f";
    
    // Format the evaluation request
    const prompt = `Evaluate if the following response contains the expected information:
    
    Response: "${response}"
    Expected: "${expected}"
    
    Return ONLY "YES" if the response contains the expected information, or "NO" if it does not.
    Be lenient - focus on whether the core information is correct rather than exact wording.`;

    const requestBody = {
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are an AI test case evaluator" },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 100
    };

    const evaluation = await axios.post(
      'https://api.deepseek.com/v1/chat/completions', 
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const result = evaluation.data.choices[0].message.content.trim().toUpperCase();
    return result.includes("YES");
    
  } catch (error) {
    console.error("⚠️ Fallback to basic evaluation:", error.message);
    // Basic fallback if API fails
    const normalize = str => 
      str.toLowerCase().replace(/[^\w\s]/g, '').trim();
      
    return normalize(response).includes(normalize(expected));
  }
}

module.exports = evaluateResponse;