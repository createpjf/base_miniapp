# Claude AI 助手配置指南

## 概述

Base Mini App 已成功集成 Claude AI 助手，提供智能记账建议、财务分析、预算规划等功能。

## 功能特性

### 🤖 智能记账建议
- 根据消费描述和金额提供分类建议
- 优化记账描述
- 提供财务洞察和预算建议

### 📊 财务分析报告
- 基于历史记录生成财务摘要
- 分析消费趋势
- 提供具体建议和风险提醒

### 💰 智能预算规划
- 根据收入制定预算分配
- 提供月度理财计划
- 储蓄策略和投资建议

### 💬 实时问答对话
- 专业的财务顾问问答
- 支持上下文相关的建议
- 代币投资建议

## 配置步骤

### 1. 获取 Claude API Key

1. 访问 [Anthropic Console](https://console.anthropic.com/)
2. 注册或登录账户
3. 在 API Keys 页面创建新的 API Key
4. 复制生成的 API Key

### 2. 配置环境变量

创建 `.env.local` 文件并添加以下配置：

```env
# Claude API Key for AI assistant
CLAUDE_API_KEY=your_claude_api_key_here

# OpenAI API Key for image recognition (可选)
OPENAI_API_KEY=your_openai_api_key_here

# 其他配置
NEXT_PUBLIC_APP_NAME=Base Mini App
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 3. 重启应用

```bash
npm run dev
```

## 使用方法

### 1. 访问 Claude 助手

- 在应用右下角点击紫色的 ✨ 图标
- 助手面板将弹出，提供四个功能标签

### 2. 功能标签说明

#### 💬 对话
- 直接与 Claude 对话
- 输入财务相关问题
- 获得专业建议

#### 💡 建议
- 获取智能记账建议
- 基于当前数据生成建议
- 自动分析消费模式

#### 📈 报告
- 生成财务分析报告
- 查看消费趋势
- 获取优化建议

#### 💰 预算
- 创建智能预算规划
- 基于收入制定分配方案
- 获得储蓄和投资建议

## API 接口

### 智能记账建议
```javascript
POST /api/claude
{
  "action": "accounting-advice",
  "data": {
    "description": "午餐",
    "amount": 25.50
  }
}
```

### 财务分析报告
```javascript
POST /api/claude
{
  "action": "financial-report",
  "data": {
    "records": [...]
  }
}
```

### 智能预算规划
```javascript
POST /api/claude
{
  "action": "smart-budget",
  "data": {
    "income": 5000,
    "goals": ["储蓄", "投资", "应急基金"]
  }
}
```

### 实时问答
```javascript
POST /api/claude
{
  "action": "ask",
  "data": {
    "question": "如何优化我的消费结构？",
    "context": {...}
  }
}
```

### 代币投资建议
```javascript
POST /api/claude
{
  "action": "token-advice",
  "data": {
    "tokens": ["ETH", "USDC", "DEGEN"]
  }
}
```

## 注意事项

1. **API 限制**: Claude API 有使用限制，请合理使用
2. **数据隐私**: 所有数据通过 HTTPS 传输，确保安全
3. **错误处理**: 如果 API 不可用，系统会显示友好的错误信息
4. **成本控制**: 建议设置 API 使用限额

## 故障排除

### 常见问题

1. **API Key 无效**
   - 检查 `.env.local` 文件中的 API Key 是否正确
   - 确认 API Key 有足够的权限

2. **网络连接问题**
   - 检查网络连接
   - 确认防火墙设置

3. **响应超时**
   - 检查 API 服务状态
   - 尝试重新发送请求

### 调试模式

在浏览器控制台中查看详细错误信息：

```javascript
// 查看 Claude 助手状态
console.log('Claude Assistant Status:', window.claudeAssistant)

// 测试 API 连接
fetch('/api/claude', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'ask',
    data: { question: '测试连接' }
  })
}).then(r => r.json()).then(console.log)
```

## 更新日志

- **v1.0.0**: 初始 Claude AI 助手集成
  - 智能记账建议
  - 财务分析报告
  - 智能预算规划
  - 实时问答对话
  - 代币投资建议
