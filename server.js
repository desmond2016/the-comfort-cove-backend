    // server.js
    require('dotenv').config();
    const express = require('express');
    const cors = require('cors');
    const apiRoutes = require('./routes/apiRoutes');

    const app = express();
    const PORT = process.env.PORT || 3001; // Render 会注入正确的 PORT

    // 详细的 CORS 配置
    const corsOptions = {
      origin: '*', // 允许所有来源。在生产环境中，你可以指定你的 Cloudflare Pages URL
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // 明确允许的方法，包括 OPTIONS
      allowedHeaders: 'Content-Type, Authorization, X-Requested-With, Accept', // 明确允许的请求头
      credentials: true, // 如果你将来需要使用 cookies 或授权头
      preflightContinue: false, // 让 cors 中间件直接处理 OPTIONS 请求
      optionsSuccessStatus: 204 // 对 OPTIONS 请求返回 204 No Content 状态码
    };

    app.use(cors(corsOptions));

    // (可选，但有时有帮助) 确保 OPTIONS 请求在所有路由上都被 cors 处理
    // 如果上面的 cors(corsOptions) 已经足够，这个可能不需要
    // app.options('*', cors(corsOptions)); 

    app.use(express.json());
    app.use('/api', apiRoutes);

    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send({ error: 'Something went wrong!' });
    });

    app.listen(PORT, () => {
      console.log(`The Comfort Cove 的后端服务器正在端口 ${PORT} 上运行`);
    });
    