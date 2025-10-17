const ROOT_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const minikitConfig = {
  accountAssociation: {
    // 这个将在部署后通过 Base Build Account association tool 生成
    "header": "",
    "payload": "",
    "signature": ""
  },
  miniapp: {
    version: "1",
    name: "Base记账", 
    subtitle: "区块链智能记账助手", 
    description: "支持多币种记账、AI智能识别、预算管理的区块链记账应用",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "finance",
    tags: ["accounting", "blockchain", "ai", "finance", "base"],
    heroImageUrl: `${ROOT_URL}/hero.png`, 
    tagline: "智能记账，轻松理财",
    ogTitle: "Base记账 - 区块链智能记账助手",
    ogDescription: "支持多币种记账、AI智能识别、预算管理的区块链记账应用",
    ogImageUrl: `${ROOT_URL}/og-image.png`,
  },
} as const;
