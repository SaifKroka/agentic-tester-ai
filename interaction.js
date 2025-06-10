// interaction.js
const axios = require('axios');

async function interactWithAI(apiUrl, prompt, config, isMultiTurn = false, conversationHistory = []) {
  try {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (config.apiKey) {
      headers['Authorization'] = `Bearer ${config.apiKey}`;
    }

    let messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: prompt }
    ];

    if (isMultiTurn) {
      messages = [...conversationHistory, { role: 'user', content: prompt }];
    }

    const requestBody = {
      model: "default",
      messages,
      temperature: 0.7
    };

    // Smart request builder based on URL patterns
    if (apiUrl.includes("deepseek")) {
      requestBody.model = "deepseek-chat";
    } else if (apiUrl.includes("openai")) {
      requestBody.model = "gpt-3.5-turbo";
    }

    const response = await axios.post(apiUrl, requestBody, { headers });

    // Extract response safely
    let aiResponse = "";

    if (response.data.choices && response.data.choices[0].message) {
      aiResponse = response.data.choices[0].message.content;
    } else if (response.data.reply) {
      aiResponse = response.data.reply;
    } else if (response.data.content) {
      aiResponse = response.data.content;
    } else {
      aiResponse = JSON.stringify(response.data);
    }

    // Stop condition
    const stopPhrases = ['thank you', 'goodbye', 'i understand', 'that’s all'];
    const shouldStop = stopPhrases.some(phrase => aiResponse.toLowerCase().includes(phrase));

    return {
      response: aiResponse,
      stop: shouldStop,
      updatedHistory: isMultiTurn ? [...conversationHistory, { role: 'user', content: prompt }, { role: 'assistant', content: aiResponse }] : []
    };
  } catch (error) {
    console.error('❌ API Error:', error.response?.data || error.message);
    return { response: null, stop: false };
  }
}

module.exports = interactWithAI;