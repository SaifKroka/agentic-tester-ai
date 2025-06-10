// crawler.js
const puppeteer = require("puppeteer");
const { URL } = require('url');

module.exports = async function tryDetectAIEndpoint(pageUrl) {
  const detected = {
    endpoints: new Set(),
    cookies: [],
    apiHeaders: {},
    postEndpoints: [],
    chatSelectors: null,
    jsApiRefs: [],
    formAction: null
  };

  console.log("🤖 Launching headless browser to simulate user...");

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // Intercept all network requests
  page.on('request', req => {
    const url = req.url();
    
    // Skip tracking domains
    if (["google.com", "doubleclick.net", "alicdn", "taobao"].some(d => url.includes(d))) return;

    // Capture POST endpoints
    if (req.method() === 'POST') {
      detected.postEndpoints.push(url);
    }

    // Match likely AI endpoints
    if (
      url.includes("/api/") ||
      url.includes("chat") ||
      url.includes("completions") ||
      url.includes("generate") ||
      url.match(/\/v\d+\/.*generation/)
    ) {
      detected.endpoints.add(url);
    }
  });

  // Capture JS API references
  page.on('response', async res => {
    try {
      const url = res.url();
      if (url.includes(".js") || url.includes(".json")) {
        const text = await res.text();
        const apiRefs = text.match(/(https?:\/\/[^"'\s]*?(?:api|chat|generate|completion)[^"'\s]*)/gi);
        if (apiRefs) detected.jsApiRefs.push(...apiRefs);
      }
    } catch (e) {}
  });

  try {
    // Navigate to page
    await page.goto(pageUrl, { 
      waitUntil: 'networkidle2', 
      timeout: 60000 
    });

    // Find chat input selector dynamically
    const chatInput = await findChatInput(page);
    if (chatInput) {
      detected.chatSelectors = chatInput;

      // Type test message
      await page.type(chatInput.input, 'Hello AI!', { delay: 100 });
      await page.keyboard.press('Enter');

      // Wait for response
      await new Promise(r => setTimeout(r, 5000));
    }

    // Capture cookies
    detected.cookies = await page.cookies();

    // Scan forms
    const formAction = await page.evaluate(() => {
      const form = document.querySelector('form');
      return form ? form.action : null;
    });
    if (formAction) detected.formAction = formAction;

  } catch (err) {
    console.error("⚠️ Page interaction error:", err.message);
  }

  // Final detection logic
  const finalUrl = await determineBestEndpoint(pageUrl, detected);
  
  await browser.close();

  if (finalUrl) {
    console.log("✅ Final AI endpoint detected:", finalUrl);
    return {
      apiUrl: finalUrl,
      cookies: detected.cookies
    };
  } else {
    console.error("❌ No valid AI endpoint found");
    return null;
  }
};

// Helper: Find chat input field dynamically
async function findChatInput(page) {
  const selectors = [
    'textarea', 
    '[contenteditable="true"]',
    '[role="textbox"]',
    'input[type="text"]',
    '#chat-input',
    '.chat-input'
  ];

  for (const sel of selectors) {
    try {
      await page.waitForSelector(sel, { timeout: 5000 });
      return { input: sel };
    } catch (e) {}
  }
  return null;
}

// Helper: Determine best endpoint
async function determineBestEndpoint(base, detected) {
  const candidates = [...detected.endpoints];

  // Add post endpoints
  candidates.push(...detected.postEndpoints);

  // Add JS references
  candidates.push(...detected.jsApiRefs);

  // Add form action
  if (detected.formAction) {
    const baseDomain = new URL(base).origin;
    candidates.push(baseDomain + detected.formAction);
  }

  // Filter valid candidates
  const valid = candidates
    .filter(url => {
      try {
        const u = new URL(url);
        return u.protocol === 'https:';
      } catch {
        return false;
      }
    })
    .sort((a, b) => {
      // Prioritize POST endpoints
      const aPost = detected.postEndpoints.includes(a) ? 1 : 0;
      const bPost = detected.postEndpoints.includes(b) ? 1 : 0;
      
      // Prioritize chat/generate in path
      const aChat = /chat|generate|completion/i.test(a) ? 2 : 0;
      const bChat = /chat|generate|completion/i.test(b) ? 2 : 0;
      
      return (bPost + bChat) - (aPost + aChat);
    });

  return valid[0] || null;
}