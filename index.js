// index.js
const readline = require('readline');
const interactWithAI = require('./interaction');
const evaluateResponse = require('./evaluator');
const generateTestCases = require('./testCases');
const generateReport = require('./reporter');
const tryDetectAIEndpoint = require('./crawler');

async function runTests(config) {
  try {
    console.log("\n🧪 Running Single-Turn Tests...\n");
    
    // Get test cases (await the async function)
    const testCases = await generateTestCases();
    
    if (!Array.isArray(testCases)) {
      throw new Error("Test cases must be an array");
    }

    const results = [];

    for (const testCase of testCases) {
      console.log(`🧠 Testing: "${testCase.prompt}"`);
      
      const response = await interactWithAI(config.apiUrl, testCase.prompt, config);
      const passed = evaluateResponse(response, testCase.expected);
      
      results.push({ ...testCase, response, passed });
      
      await new Promise(r => setTimeout(r, 3000)); // Rate limiting
    }

    generateReport(results);

    // Optional: Run Multi-Turn Conversations
    const runMultiTurn = await ask(rl, "🔁 Run multi-turn conversation test? (y/n): ");
    if (runMultiTurn.toLowerCase() === 'y') {
      console.log("\n💬 Starting Multi-Turn Conversation (type 'exit' to end)\n");
      let history = [];
      let userInput = '';
      while (true) {
        userInput = await ask(rl, "👤 You: ");
        if (userInput.toLowerCase() === 'exit') break;

        const { response, stop } = await interactWithAI(config.apiUrl, userInput, config, true, history);
        console.log(`🤖 AI: ${response || 'No response received'}`);
        
        if (!response) {
          console.log("⚠️ Empty response - ending conversation");
          break;
        }
        
        if (stop) {
          console.log("🛑 Stopped due to natural conversation end.");
          break;
        }
      }
    }
  } catch (error) {
    console.error("❌ Test execution error:", error.message);
  }
}

// CLI Interface
async function ask(rl, question) {
  return new Promise(resolve => {
    rl.question(question, ans => resolve(ans));
  });
}

// Main execution
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

(async () => {
  console.log("🚀 Universal AI Tester v4.2");
  console.log("─────────────────────────────\n");

  try {
    // Get input URL/API
    const inputUrl = await ask(rl, "🌐 Enter AI Chat URL/API: ");
    
    // Handle API key input
    const apiKey = await ask(rl, "🔑 API Key (if required): ");
    
    // Multi-turn support
    const isMultiTurn = (await ask(rl, "🔄 Multi-turn support? (y/n): ")).toLowerCase() === 'y';

    // Endpoint detection logic
    let apiUrl = inputUrl;
    let cookies = [];

    // Only attempt detection if it's a website URL
    if (/^https?:\/\/[^/]+$/i.test(inputUrl) || !inputUrl.includes("api")) {
      console.log("\n🔍 Detecting AI endpoint...\n");
      const detection = await tryDetectAIEndpoint(inputUrl).catch(err => {
        console.error("🔗 Endpoint detection failed:", err.message);
        return null;
      });
      
      if (detection) {
        apiUrl = detection.apiUrl;
        cookies = detection.cookies;
        console.log(`✅ Using detected API endpoint: ${apiUrl}`);
      } else {
        console.log("⚠️ Manual fallback required...");
        apiUrl = await ask(rl, "🔧 Enter detected API URL (e.g., https://api.deepseek.com/v1/chat/completions):  ");
      }
    } else {
      console.log("✅ Using provided API URL directly");
    }

    // Run tests with final configuration
    await runTests({ 
      apiUrl, 
      apiKey, 
      isMultiTurn, 
      cookies 
    });
    
  } catch (error) {
    console.error("💥 Fatal error:", error.message);
  } finally {
    rl.close();
  }
})();