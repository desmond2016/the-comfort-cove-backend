// routes/apiRoutes.js
const express = require('express');
const router = express.Router();
const claudeController = require('../controllers/claudeController');

// Route for the chatbot
// 前端将会 POST 请求到 /api/ask-claude
router.post('/ask-claude', claudeController.askClaude);

module.exports = router;
