# CineVerse

CineVerse 是一个现代化的电影推荐系统，基于 Vue 3 + TypeScript + TDesign 构建。

## 🌐 在线演示

访问 [CineVerse](https://你的用户名.github.io/CineVerse/) 查看在线演示

## 功能特性

- 🎬 电影浏览和搜索
- ⭐ 个人收藏和评分
- 🎯 智能推荐算法
- 📱 响应式设计
- 🌙 深色主题支持

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **UI 组件库**: TDesign Vue Next
- **状态管理**: Pinia
- **路由**: Vue Router
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **数据源**: TMDB API
- **部署**: GitHub Pages + GitHub Actions

## 开发环境设置

### 环境要求

- Node.js >= 20.19.0
- pnpm >= 8.0.0

### 安装依赖

```bash
pnpm install
```

### 环境变量配置

复制 `.env.example` 到 `.env` 并填写必要的配置：

```bash
cp .env.example .env
```

在 `.env` 文件中配置：

```env
VITE_TMDB_TOKEN=your_tmdb_api_token
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

### 开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 预览生产版本

```bash
pnpm preview
```

## 部署

### 自动部署到 GitHub Pages

项目已配置 GitHub Actions 自动部署：

1. **配置仓库权限**：

   - 进入仓库 `Settings` > `Actions` > `General`
   - 选择 `Read and write permissions`
   - 勾选 `Allow GitHub Actions to create and approve pull requests`

2. **启用 GitHub Pages**：

   - 进入 `Settings` > `Pages`
   - 选择 `GitHub Actions` 作为源

3. **推送代码**：

   ```bash
   git push origin main
   ```

4. **访问网站**：
   - 部署完成后访问 `https://你的用户名.github.io/CineVerse/`

详细部署说明请查看 [DEPLOY.md](DEPLOY.md)

### 手动部署

```bash
pnpm deploy
```

## 项目结构

```
src/
├── components/          # 可复用组件
│   ├── layout/         # 布局组件
│   └── movie/          # 电影相关组件
├── composables/        # 组合式函数
├── plugins/            # 插件配置
├── router/             # 路由配置
├── services/           # API 服务
├── stores/             # Pinia 状态管理
├── types/              # TypeScript 类型定义
└── views/              # 页面组件
```

## 性能优化

- ✅ 代码分割和懒加载
- ✅ 按需导入 UI 组件
- ✅ 图片懒加载
- ✅ 路由级代码分割
- ✅ 构建产物优化

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。
