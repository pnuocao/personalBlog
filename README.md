# personalBlog

个人技术博客，基于 VitePress 构建。

## 项目说明

- 博客内容采用 Markdown 格式
- 使用 VitePress 作为文档生成框架
- 支持本地开发预览和静态构建

## 开发指南

### 环境要求
- Node.js 18+
- Yarn 或 npm

### 安装依赖

```bash
yarn install
# 或
npm install
```

### 本地开发

启动开发服务器，实时预览更改：

```bash
yarn dev
# 或
npm run dev
```

访问 `http://localhost:5173` 查看博客。

### 打包构建

生成静态文件：

```bash
yarn docs:build
# 或
npm run docs:build
```

构建完成后，静态文件生成在 `docs/.vitepress/dist/` 目录下。

## 部署指南

### 部署步骤

1. **打包项目**
   ```bash
   yarn docs:build
   ```
   生成的文件位于 `docs/.vitepress/dist/` 目录

2. **上传到服务器**
   
   将 `docs/.vitepress/dist/` 目录下的所有文件上传到服务器的 `/data/pinocao/vite-press-blog` 目录下
   
   上传示例（使用 scp）：
   ```bash
   scp -r docs/.vitepress/dist/* username@server:/data/pinocao/vite-press-blog/
   scp -r packages/client/dist/* root@43.138.157.200:/data/pinocao/student-system/client/dist/
   ```
   
   **注意**：仅上传 `dist` 下的文件内容，不包含 `dist` 目录本身，使用户文件直接结构在 `/data/pinocao/vite-press-blog` 下

3. **配置 Web 服务器**

   根据使用的 Web 服务器配置，可参考以下示例：

   **Nginx 配置示例：**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       root /data/pinocao/vite-press-blog;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       # 静态文件缓存
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
           expires 30d;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

   **Apache 配置示例：**
   ```apache
   <Directory /data/pinocao/vite-press-blog>
       RewriteEngine On
       RewriteBase /
       RewriteRule ^index\.html$ - [L]
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteRule . /index.html [L]
   </Directory>
   ```

4. **验证部署**
   
   访问 `http://your-domain.com` 验证博客是否正常运行

### 部署前检查清单

- [ ] 本地构建成功，无错误提示
- [ ] `dist` 目录下包含 `index.html` 和其他静态资源
- [ ] 确认服务器目标目录 `/data/pinocao/vite-press-blog` 存在且可写
- [ ] Web 服务器已正确配置 SPA 路由处理
- [ ] DNS 或 hosts 文件已配置（如需要）

## 项目结构

```
personalBlog/
├── docs/
│   ├── .vitepress/
│   │   ├── config.mts          # VitePress 配置文件
│   │   ├── configs/            # 配置模块
│   │   ├── theme/              # 主题文件
│   │   └── dist/               # 构建输出目录
│   ├── pages/                  # 博客文章目录
│   ├── public/                 # 静态资源
│   └── index.md                # 首页
├── package.json                # 项目依赖配置
└── README.md                   # 本文件
```

## 许可证

MIT License
