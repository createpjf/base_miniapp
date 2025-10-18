# Base Mini App - 区块链记账应用

一个功能完整的 Base Mini App 区块链记账应用，支持多币种记账、AI 智能识别、预算管理和数据可视化统计功能。

## 功能特性

### 🪙 代币价格与汇率
- ✅ 实时获取 Base 生态主流代币价格
- ✅ 支持 ETH、USDC、cbBTC、DEGEN、BRETT 等代币
- ✅ USDC 计价的汇率转换器
- ✅ 价格缓存机制（5分钟刷新）

### 📸 智能拍照记账
- ✅ 调用手机相机拍照
- ✅ 支持从相册上传图片
- ✅ AI 识别票据/收据信息（需要 OpenAI API Key）
- ✅ 自动填充记账表单

### 🤖 Claude AI 助手
- ✅ 智能记账建议
- ✅ 财务分析报告
- ✅ 智能预算规划
- ✅ 代币投资建议
- ✅ 实时问答对话

### 📊 记账功能
- ✅ 手动记账：收入/支出记录
- ✅ 多币种支持，自动转换为 USDC 计价
- ✅ 分类管理（餐饮、交通、购物等）
- ✅ 多账本管理
- ✅ 备注和图片附件

### 💰 预算管理
- ✅ 月度/年度预算设置
- ✅ 按分类设置预算
- ✅ 实时预算使用进度
- ✅ 预算超支提醒

### 📈 数据统计
- ✅ 收支趋势图表（折线图、柱状图、饼图）
- ✅ 分类支出饼图
- ✅ 月度对比分析
- ✅ 实时数据统计

### 🏦 资产管理
- ✅ 资产类别：现金、银行、加密货币、股票、基金
- ✅ 负债记录：信用卡、贷款
- ✅ 资产负债表
- ✅ 净资产计算和财务健康度分析

## 技术栈

- **框架**: Next.js 14 + TypeScript
- **样式**: Tailwind CSS
- **UI 组件**: shadcn/ui
- **图表**: recharts
- **AI 识别**: OpenAI Vision API
- **价格数据**: CoinGecko API
- **存储**: localStorage
- **部署**: Vercel

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 环境变量配置

创建 `.env.local` 文件：

```env
# OpenAI API Key for AI recognition
OPENAI_API_KEY=your_openai_api_key_here

# Claude API Key for AI assistant
CLAUDE_API_KEY=your_claude_api_key_here

# CoinGecko API Key (optional)
NEXT_PUBLIC_COINGECKO_API_KEY=your_coingecko_api_key_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 4. 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署

### 5. 配置 Base Mini App

1. 更新 `minikit.config.ts` 中的 `NEXT_PUBLIC_APP_URL`
2. 使用 [Base Build Account association tool](https://build.base.org/account-association) 生成 `accountAssociation` 凭证
3. 更新 `minikit.config.ts` 中的 `accountAssociation` 字段
4. 重新部署

## 项目结构

```
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   ├── .well-known/       # Farcaster manifest
│   └── page.tsx           # 主页面
├── components/            # React 组件
│   ├── camera/           # 相机相关组件
│   ├── records/          # 记账相关组件
│   ├── statistics/       # 统计相关组件
│   ├── tokens/           # 代币相关组件
│   └── ui/               # 基础 UI 组件
├── lib/                  # 工具库
│   ├── api/              # API 调用
│   ├── storage.ts        # 本地存储管理
│   ├── types.ts          # TypeScript 类型
│   └── utils.ts          # 工具函数
└── minikit.config.ts     # Mini App 配置
```

## 开发指南

### 添加新的代币

在 `lib/api/tokens.ts` 中的 `BASE_TOKENS` 数组添加代币 ID。

### 添加新的分类

在 `lib/storage.ts` 中的 `categoryStorage.getAll()` 方法添加预设分类。

### 自定义 AI 识别

修改 `lib/api/ai.ts` 中的提示词来调整 AI 识别行为。

## 部署说明

### Vercel 部署

1. 确保所有环境变量已配置
2. 关闭 Vercel 的 Deployment Protection
3. 使用 Base Build Account association tool 生成凭证
4. 更新 manifest 配置
5. 重新部署

### Base App 发布

1. 在 Base App 中创建帖子
2. 包含应用 URL
3. 用户可以通过点击链接访问应用

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
