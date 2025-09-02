# GitHub Pages 部署指南

## 自动部署（推荐）

项目已配置 GitHub Actions 自动部署，当你推送代码到 `main` 或 `master` 分支时会自动部署到 GitHub Pages。

### 设置步骤：

1. **推送代码到 GitHub**

   ```bash
   git add .
   git commit -m "feat: 配置 GitHub Pages 部署"
   git push origin main
   ```

2. **启用 GitHub Pages**

   - 进入你的 GitHub 仓库
   - 点击 `Settings` 标签
   - 在左侧菜单中找到 `Pages`
   - 在 `Source` 部分选择 `GitHub Actions`
   - 保存设置

   **重要**：确保仓库的 Actions 权限设置正确：

   - 进入 `Settings` > `Actions` > `General`
   - 在 `Workflow permissions` 部分选择 `Read and write permissions`
   - 勾选 `Allow GitHub Actions to create and approve pull requests`
   - 点击 `Save`

3. **等待部署完成**
   - 查看 `Actions` 标签页的部署进度
   - 部署完成后，你的网站将在 `https://你的用户名.github.io/CineVerse/` 可访问

## 手动部署（备选方案）

如果你想手动部署，可以使用以下命令：

```bash
# 构建并部署
pnpm deploy
```

## 环境变量配置

如果你的项目使用了环境变量（如 TMDB API），需要在 GitHub 仓库中配置：

1. 进入仓库的 `Settings` > `Secrets and variables` > `Actions`
2. 添加必要的环境变量，例如：
   - `VITE_TMDB_TOKEN`: 你的 TMDB API Token
   - `VITE_TMDB_BASE_URL`: TMDB API 基础 URL

## 自定义域名（可选）

如果你有自定义域名：

1. 在 `.github/workflows/deploy.yml` 中的 `cname` 字段填写你的域名
2. 在你的域名提供商处配置 CNAME 记录指向 `你的用户名.github.io`

## 故障排除

- 如果部署失败，检查 Actions 日志
- 确保所有依赖都在 `package.json` 中正确声明
- 检查环境变量是否正确配置
- 确保 `base` 路径配置正确（应该是你的仓库名）
