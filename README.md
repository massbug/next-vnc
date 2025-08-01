# Next.js VNC Container Management Platform

This is a web application built with [Next.js](https://nextjs.org) for managing and accessing Docker-based VNC containers. The platform allows users to create, manage, and remotely access Ubuntu desktop environment containers.

## Features

- Create VNC containers based on Ubuntu XFCE desktop environment
- Manage container lifecycle (start, stop, remove)
- Access container desktop environments directly through browser
- Responsive web interface supporting both desktop and mobile devices

## Tech Stack

- [Next.js 15.4.5](https://nextjs.org) - React Framework
- [React 19.1.0](https://reactjs.org) - UI Library
- [TypeScript](https://www.typescriptlang.org) - Type-safe JavaScript
- [Tailwind CSS v4](https://tailwindcss.com) - CSS Framework
- [Dockerode](https://github.com/apocas/dockerode) - Docker API Client
- [react-vnc](https://github.com/jean-ledru/react-vnc) - React VNC Component
- [noVNC](https://github.com/novnc/noVNC) - VNC Client Library
- [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) - Real-time Communication Protocol

## System Architecture

```text
┌─────────────────┐    HTTP    ┌────────────────┐
│   Web Browser   │ ──────────▶│  Next.js Server │
└─────────────────┘            └────────────────┘
                                        │
                                WebSocket│
                                        ▼
                              ┌────────────────┐
                              │ WebSocket Proxy │
                              │ (websockify.ts) │
                              └────────────────┘
                                        │
                                TCP/VNC│
                                        ▼
                              ┌────────────────┐
                              │ Docker Container│
                              │ (Ubuntu XFCE)   │
                              └────────────────┘
```

## Project Structure

```
.
├── server/                 # Server-side code
│   └── websockify.ts       # WebSocket to TCP proxy service
├── src/
│   └── app/
│       ├── [container]/    # Container detail page (dynamic route)
│       │   └── page.tsx    # VNC connection page
│       ├── actions/        # Server Actions
│       │   └── docker.ts   # Docker container operations
│       ├── globals.css     # Global styles
│       ├── layout.tsx      # Root layout
│       └── page.tsx        # Homepage (container management)
├── next.config.ts          # Next.js configuration
├── package.json            # Project dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## Quick Start

### Requirements

- Node.js (Recommended 18.x or higher)
- Docker (for running containers)
- npm, yarn, pnpm or bun (for dependency management)

### Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You also need to start the WebSocket proxy service:

```bash
npx tsx server/websockify.ts
```

### Build for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
# or
bun build
```

### Start Production Server

```bash
npm run start
# or
yarn start
# or
pnpm start
# or
bun start
```

## Usage

1. Enter a container name on the homepage and click "Create Container"
2. Wait for the container to be created and started (may take some time)
3. Click on the container name to enter the VNC connection page
4. The system will automatically connect to the container's desktop environment
5. Use the buttons at the bottom of the page to disconnect or reconnect

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

# Next.js VNC 容器管理平台

这是一个基于 [Next.js](https://nextjs.org) 构建的 Web 应用，用于管理和访问基于 Docker 的 VNC 容器。该平台允许用户创建、管理和远程访问 Ubuntu 桌面环境容器。

## 功能特性

- 创建基于 Ubuntu XFCE 桌面环境的 VNC 容器
- 管理容器生命周期（启动、停止、删除）
- 通过浏览器直接访问容器内的桌面环境
- 响应式 Web 界面，支持桌面和移动设备

## 技术栈

- [Next.js 15.4.5](https://nextjs.org) - React 框架
- [React 19.1.0](https://reactjs.org) - UI 库
- [TypeScript](https://www.typescriptlang.org) - 类型安全的 JavaScript
- [Tailwind CSS v4](https://tailwindcss.com) - CSS 框架
- [Dockerode](https://github.com/apocas/dockerode) - Docker API 客户端
- [react-vnc](https://github.com/jean-ledru/react-vnc) - React VNC 组件
- [noVNC](https://github.com/novnc/noVNC) - VNC 客户端库
- [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) - 实时通信协议

## 系统架构

```text
┌─────────────────┐    HTTP    ┌────────────────┐
│   Web 浏览器     │ ──────────▶│  Next.js 服务   │
└─────────────────┘            └────────────────┘
                                        │
                                WebSocket│
                                        ▼
                              ┌────────────────┐
                              │ WebSocket 代理  │
                              │ (websockify.ts) │
                              └────────────────┘
                                        │
                                TCP/VNC│
                                        ▼
                              ┌────────────────┐
                              │ Docker 容器    │
                              │ (Ubuntu XFCE)  │
                              └────────────────┘
```

## 项目结构

```
.
├── server/                 # 服务器端代码
│   └── websockify.ts       # WebSocket 到 TCP 的代理服务
├── src/
│   └── app/
│       ├── [container]/    # 容器详情页面（动态路由）
│       │   └── page.tsx    # VNC 连接页面
│       ├── actions/        # Server Actions
│       │   └── docker.ts   # Docker 容器操作
│       ├── globals.css     # 全局样式
│       ├── layout.tsx      # 根布局
│       └── page.tsx        # 主页（容器管理）
├── next.config.ts          # Next.js 配置
├── package.json            # 项目依赖和脚本
└── tsconfig.json           # TypeScript 配置
```

## 快速开始

### 环境要求

- Node.js (推荐 18.x 或更高版本)
- Docker (用于运行容器)
- npm, yarn, pnpm 或 bun (用于依赖管理)

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
# 或
bun install
```

### 运行开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

同时需要启动 WebSocket 代理服务：

```bash
npx tsx server/websockify.ts
```

### 构建生产版本

```bash
npm run build
# 或
yarn build
# 或
pnpm build
# 或
bun build
```

### 启动生产服务器

```bash
npm run start
# 或
yarn start
# 或
pnpm start
# 或
bun start
```

## 使用说明

1. 在主页上输入容器名称并点击"创建容器"
2. 等待容器创建和启动完成（可能需要一些时间）
3. 点击容器名称进入 VNC 连接页面
4. 系统将自动连接到容器的桌面环境
5. 可以使用页面底部的按钮断开或重新连接

## 学习资源

- [Next.js 文档](https://nextjs.org/docs) - 了解 Next.js 特性和 API
- [学习 Next.js](https://nextjs.org/learn) - 交互式 Next.js 教程

你可以查看 [GitHub 仓库](https://github.com/vercel/next.js) - 欢迎提供反馈和贡献！

## 许可证

本项目使用 MIT 许可证，详情请查看 [LICENSE](LICENSE) 文件。