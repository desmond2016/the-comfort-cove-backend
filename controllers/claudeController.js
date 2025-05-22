// controllers/claudeController.js
const axios = require('axios');

// 确保这些环境变量已从 .env 文件加载
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_ENDPOINT = process.env.CLAUDE_API_ENDPOINT;
const CLAUDE_MODEL_NAME = process.env.CLAUDE_MODEL_NAME || 'claude-3-7-sonnet-20250219'; // 默认模型

exports.askClaude = async (req, res) => {
  const userMessage = req.body.message; // 从请求体中获取用户消息

  // 检查用户消息是否存在
  if (!userMessage) {
    return res.status(400).json({ error: 'Message content is required.' });
  }

  // 检查 API 密钥和端点是否已配置
  if (!CLAUDE_API_KEY || !CLAUDE_API_ENDPOINT) {
    console.error('Claude API Key or Endpoint is not configured in environment variables.');
    return res.status(500).json({ error: 'AI service is not configured correctly.' });
  }

  // 构建发送到 Claude API 代理的请求体
  const payload = {
    model: CLAUDE_MODEL_NAME,
    messages: [{ role: 'user', content: userMessage }],
    temperature: 0.7, // 根据你的 Python 脚本设置
    stream: false     // 根据你的 Python 脚本设置
  };

  // 构建请求头
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${CLAUDE_API_KEY}`,
    'Content-Type': 'application/json'
  };

  try {
    // 打印日志，方便调试
    console.log(`Sending request to Claude API Endpoint: ${CLAUDE_API_ENDPOINT}`);
    console.log(`Payload: ${JSON.stringify(payload)}`);

    // 使用 axios 发送 POST 请求到 Claude API 代理
    const claudeResponse = await axios.post(CLAUDE_API_ENDPOINT, payload, { headers });

    // (可选) 打印从 Claude API 代理接收到的原始响应，用于调试
    // console.log('Raw Claude API Response:', claudeResponse.data);

    // 解析 Claude API 代理的响应以提取助手的回复文本
    // 注意：你需要根据 api.gptgod.online 实际返回的 JSON 结构来调整以下代码
    // 常见的 OpenAI 兼容 API 会将回复放在 claudeResponse.data.choices[0].message.content
    let assistantResponseText = "抱歉，我暂时无法理解。"; // 默认回复

    if (claudeResponse.data && claudeResponse.data.choices && claudeResponse.data.choices.length > 0) {
        const choice = claudeResponse.data.choices[0];
        if (choice.message && choice.message.content) {
            assistantResponseText = choice.message.content;
        } else if (choice.text) { // 有些 API 可能直接使用 'text' 字段
             assistantResponseText = choice.text;
        }
    } else if (claudeResponse.data && claudeResponse.data.text) { // 更简单的直接文本响应
        assistantResponseText = claudeResponse.data.text;
    } else if (typeof claudeResponse.data === 'string') { // 如果响应本身就是字符串
        assistantResponseText = claudeResponse.data;
    }


    // 将提取到的助手回复发送回前端
    res.json({ response: assistantResponseText });

  } catch (error) {
    // 打印错误信息
    console.error('Error calling Claude API:', error.response ? error.response.data : error.message);
    
    // 如果 Claude API 代理返回了错误信息，则将其发送给前端
    if (error.response) {
      return res.status(error.response.status || 500).json({
        error: 'Failed to get response from AI service.',
        details: error.response.data
      });
    }
    // 其他类型的错误
    return res.status(500).json({ error: 'Failed to get response from AI service.' });
  }
};
