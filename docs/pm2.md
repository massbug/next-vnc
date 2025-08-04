
## ✅ 使用方法：

### ▶ 开发模式（`next dev + ts-node`）

```bash
pm2 start ecosystem.config.js --env development
```

### 🚀 生产模式（`next build && next start + ts-node`）

```bash
npm run build
pm2 start ecosystem.config.js --env production
```

---

## 🔍 日志查看 & 管理命令（共通）：

```bash
pm2 status              # 查看运行状态
pm2 logs                # 查看全部日志
pm2 logs ws-proxy       # 查看某个服务日志
pm2 restart all         # 重启所有服务
pm2 delete all          # 删除所有进程
```

---

## ✅ 可以添加到 `package.json`：

```json
"scripts": {
  "dev:pm2": "pm2 start ecosystem.config.js --env development",
  "start:pm2": "pm2 start ecosystem.config.js --env production",
  "build": "next build"
}
```

运行时：

```bash
npm run dev:pm2        # 本地开发
npm run build && npm run start:pm2   # 部署生产
```

---

