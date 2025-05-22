// server.js
require('dotenv').config(); // 加载 .env 文件中的环境变量
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3001; // Render 平台可能会设置它自己的 PORT

// 中间件
app.use(cors()); // 为所有路由启用 CORS (在生产环境中可以配置特定的源)
app.use(express.json()); // 解析 JSON 请求体

// API 路由
app.use('/api', apiRoutes); // 将 API 路由挂载到 /api 前缀下

// 基本的错误处理中间件 (可以改进)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' }); // 发生错误时的响应
});

app.listen(PORT, () => {
  console.log(`The Comfort Cove 的后端服务器正在端口 ${PORT} 上运行`);
});
