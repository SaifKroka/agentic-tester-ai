# agentic-tester-ai


## 🧪 Features

- ✅ **Test any AI chatbot** (DeepSeek, OpenAI, Telegram, Discord, Web interfaces)
- ✅ **Dynamic test case generation** using DeepSeek API
- ✅ **Intelligent response evaluation** via AI
- ✅ **Multi-turn conversation support**
- ✅ **Web endpoint detection** with Puppeteer

- 🔧 Requirements

### Node.js Modules
```bash
npm install axios puppeteer readline


 basic use navigate into ur folder and run node index.js 


libries need to install:

npm init -y
npm install axios puppeteer dotenv
npm install --save-dev eslint prettier


examples of url for each api:

 Common AI API URL Formats
DeepSeek
https://api.deepseek.com/v1/chat/completions
Use
deepseek-chat
model
OpenAI
https://api.openai.com/v1/chat/completions
GPT-3.5/GPT-4 support
Anthropic
https://api.anthropic.com/v1/messages
Claude 3 models
Google
https://us-central1-aiplatform.googleapis.com/v1/projects/{project}/locations/{region}/models/gemini-pro:generateContent
Requires Vertex AI setup
Meta
https://api.together.ai/v1/chat/completions
Llama 2/3 via Together
Mistral
https://api.mistral.ai/v1/fim/completions
Mistral Large model
Cohere
https://api.cohere.ai/v1/generate
Command models
HuggingFace
https://api-inference.huggingface.co/models/{model-name}/generate
Any HF model
Azure OpenAI
https://{resource-name}.openai.azure.com/openai/deployments/{deployment-id}/chat/completions?api-version={API-version}
