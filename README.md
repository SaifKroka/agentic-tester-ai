#!/bin/bash

# ===================================
# 🧠 agentic-tester-ai - Setup Script
# ===================================

# Project: agentic-tester-ai
# -----------------------------------

# 🧪 Features
# ✅ Test any AI chatbot (DeepSeek, OpenAI, Telegram, Discord, Web interfaces)
# ✅ Dynamic test case generation using DeepSeek API
# ✅ Intelligent response evaluation via AI
# ✅ Multi-turn conversation support
# ✅ Web endpoint detection with Puppeteer

# -----------------------------------
# 🔧 Requirements
# -----------------------------------

# Required Node.js Modules
npm init -y
npm install axios puppeteer dotenv readline
npm install --save-dev eslint prettier

# -----------------------------------
# 🛠 Basic Usage
# -----------------------------------

# Navigate into your project folder and run:
# node index.js

echo "✅ agentic-tester-ai setup complete."
echo "📦 All required dependencies have been installed."
echo "🚀 Run the project using: node index.js"

# -----------------------------------
# 🌐 Common AI API URL Formats
# -----------------------------------

# DeepSeek
# https://api.deepseek.com/v1/chat/completions
# Use model: deepseek-chat

# OpenAI
# https://api.openai.com/v1/chat/completions
# GPT-3.5 / GPT-4 support

# Anthropic (Claude 3)
# https://api.anthropic.com/v1/messages

# Google Gemini Pro (requires Vertex AI setup)
# https://us-central1-aiplatform.googleapis.com/v1/projects/{project}/locations/{region}/models/gemini-pro:generateContent

# Meta (Llama 2/3 via Together)
# https://api.together.ai/v1/chat/completions

# Mistral (Mistral Large model)
# https://api.mistral.ai/v1/fim/completions

# Cohere (Command models)
# https://api.cohere.ai/v1/generate

# Hugging Face (Any HF model)
# https://api-inference.huggingface.co/models/{model-name}/generate

# Azure OpenAI
# https://{resource-name}.openai.azure.com/openai/deployments/{deployment-id}/chat/completions?api-version={API-version}

# -----------------------------------

