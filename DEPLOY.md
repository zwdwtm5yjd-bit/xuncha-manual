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

---

# 映射到自定义域名 https://www.ericmm.com/xunchashouce

任选其一即可。

## 方式一：重定向（最简单）

在 **www.ericmm.com** 的服务器上，把路径 `/xunchashouce` 重定向到 GitHub Pages：

- **Nginx**（在对应 server 里）：
  ```nginx
  location /xunchashouce {
    rewrite ^/xunchashouce/?(.*)$ https://zwdwtm5yjd-bit.github.io/xuncha-manual/$1 permanent;
  }
  ```
  访问 /xunchashouce 或 /xunchashouce/xxx 会分别跳到手册首页或 /xuncha-manual/xxx。

- **Apache**（.htaccess 或 vhost）：
  ```apache
  RedirectMatch 301 ^/xunchashouce/?(.*)$ https://zwdwtm5yjd-bit.github.io/xuncha-manual/$1
  ```

- **纯静态**：在 www.ericmm.com 的 `/xunchashouce/index.html` 放项目里的 `redirect-ericmm.html`（见下），访问会跳转到手册。

配置后，访问 **https://www.ericmm.com/xunchashouce** 会跳转到 GitHub Pages 手册地址。

## 方式二：在 www.ericmm.com 的 /xunchashouce 下直接托管

1. 本地执行：
   ```bash
   pnpm run build:ericmm
   ```
2. 将 **dist/public** 里的全部文件上传到 www.ericmm.com 的 **/xunchashouce/** 目录（即 `index.html` 的 URL 为 `https://www.ericmm.com/xunchashouce/index.html`）。
3. 确保服务器对 `/xunchashouce/*` 的 SPA 回退到 `index.html`（或把构建产物里的 `404.html` 配置为同目录下的回退页）。

完成后，**https://www.ericmm.com/xunchashouce** 会直接显示手册，且地址栏保持该域名。

---

# 登录系统（内部账号/密码）

不依赖任何外部服务，支持两种方式二选一：

**方式一：多账号多密码**  
编辑 **client/src/data/access-list.json**，按下面格式增加账号（账号名可随意，如姓名、工号、邮箱等）：

```json
[
  { "account": "张三", "password": "密码1" },
  { "account": "李四", "password": "密码2" }
]
```

保存后重新构建/部署，登录页会出现「账号」+「密码」两个输入框，任一条目匹配即可进入。**注意**：该文件会被打包进前端，仅适合内部使用。

**方式二：全站一个密码**  
不往 access-list.json 里加条目（保持为 `[]`），改为在 `.env` 和 GitHub Secrets 中配置 **VITE_APP_PASSWORD**，登录页只显示「密码」输入框。

- **本地**：复制 `.env.example` 为 `.env`，填 `VITE_APP_PASSWORD=你定的密码`（或用方式一改 access-list.json）。不配置任何一项则无需登录。
- **线上**：若用方式二，在仓库 **Settings → Secrets and variables → Actions** 新增 Secret `VITE_APP_PASSWORD`；若用方式一，只需把改好的 access-list.json 提交并推送，重新跑 Actions 部署即可。
