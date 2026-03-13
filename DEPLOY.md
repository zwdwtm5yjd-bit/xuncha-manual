# 部署到 GitHub Pages

站点地址：**https://zwdwtm5yjd-bit.github.io/xuncha-manual/**

## 首次或从「分支部署」切换时

1. 打开仓库 **Settings → Pages**
2. 在 **Build and deployment** 里，**Source** 选择 **GitHub Actions**（不要选 “Deploy from a branch”）
3. 保存后，推送代码到 `main` 或在 **Actions** 里手动运行 workflow **Deploy to GitHub Pages** 即可完成部署

## 日常更新

推送到 `main` 分支后会自动构建并部署，无需其他操作。

## 本地构建（仅静态站）

```bash
pnpm run build:gh-pages
```

产物在 `dist/public`，可将该目录内容部署到任意静态托管。
