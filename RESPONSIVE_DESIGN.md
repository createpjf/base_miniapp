# 响应式设计优化指南

## 概述

Base Mini App 已实现全面的响应式设计，确保在各种设备上都能提供优秀的用户体验。

## 断点系统

### Tailwind CSS 断点
```css
/* 移动端优先设计 */
sm: 640px   /* 小屏手机 */
md: 768px   /* 大屏手机/小平板 */
lg: 1024px  /* 平板/小桌面 */
xl: 1280px  /* 桌面 */
2xl: 1536px /* 大桌面 */
```

### 自定义断点
```css
/* 在 globals.css 中定义 */
@media (max-width: 639px) {
  /* 超小屏设备 */
}

@media (min-width: 640px) and (max-width: 767px) {
  /* 小屏设备 */
}

@media (min-width: 768px) and (max-width: 1023px) {
  /* 中屏设备 */
}

@media (min-width: 1024px) {
  /* 大屏设备 */
}
```

## 布局策略

### 1. 移动端布局
- **导航**: 底部固定导航栏
- **内容**: 全屏滚动，避免水平滚动
- **按钮**: 大尺寸触摸目标 (最小 44px)
- **间距**: 紧凑但不过于拥挤

### 2. 平板布局
- **导航**: 侧边栏导航
- **内容**: 两列或三列布局
- **按钮**: 中等尺寸
- **间距**: 适中的间距

### 3. 桌面布局
- **导航**: 左侧固定侧边栏
- **内容**: 多列布局，充分利用空间
- **按钮**: 标准尺寸
- **间距**: 宽松的间距

## 组件响应式设计

### 1. 分类网格
```tsx
// 移动端: 3列
// 平板: 4列  
// 桌面: 6列
<div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
```

### 2. 记录列表
```tsx
// 移动端: 单列
// 平板: 两列
// 桌面: 三列
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

### 3. 表单布局
```tsx
// 移动端: 单列
// 平板及以上: 两列
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
```

## 字体响应式

### 字体大小
```css
/* 基础字体大小 */
.text-xs { font-size: 0.75rem; }    /* 12px */
.text-sm { font-size: 0.875rem; }   /* 14px */
.text-base { font-size: 1rem; }     /* 16px */
.text-lg { font-size: 1.125rem; }   /* 18px */
.text-xl { font-size: 1.25rem; }    /* 20px */
.text-2xl { font-size: 1.5rem; }    /* 24px */
.text-3xl { font-size: 1.875rem; }  /* 30px */

/* 响应式字体 */
.text-responsive {
  font-size: 1rem;        /* 移动端 */
}

@media (min-width: 768px) {
  .text-responsive {
    font-size: 1.125rem;   /* 平板 */
  }
}

@media (min-width: 1024px) {
  .text-responsive {
    font-size: 1.25rem;    /* 桌面 */
  }
}
```

## 图片响应式

### 1. 响应式图片
```tsx
<img
  src="/image.jpg"
  alt="Description"
  className="w-full h-auto max-w-full"
  loading="lazy"
/>
```

### 2. 不同尺寸的图片
```tsx
<picture>
  <source media="(min-width: 1024px)" srcSet="/image-large.jpg" />
  <source media="(min-width: 768px)" srcSet="/image-medium.jpg" />
  <img src="/image-small.jpg" alt="Description" className="w-full h-auto" />
</picture>
```

## 触摸优化

### 1. 触摸目标大小
```css
/* 最小触摸目标 44px */
.touch-target {
  min-width: 44px;
  min-height: 44px;
}

/* 按钮触摸优化 */
.button-touch {
  padding: 12px 24px;
  min-height: 44px;
}
```

### 2. 触摸反馈
```css
/* 触摸时的视觉反馈 */
.touch-feedback:active {
  transform: scale(0.95);
  opacity: 0.8;
}

/* 触摸高亮 */
.touch-highlight {
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0.1);
}
```

## 性能优化

### 1. 条件渲染
```tsx
// 只在需要的断点渲染组件
{isMobile && <MobileComponent />}
{isTablet && <TabletComponent />}
{isDesktop && <DesktopComponent />}
```

### 2. 懒加载
```tsx
// 使用 React.lazy 进行代码分割
const HeavyComponent = lazy(() => import('./HeavyComponent'))

// 使用 Suspense 包装
<Suspense fallback={<LoadingSpinner />}>
  <HeavyComponent />
</Suspense>
```

### 3. 虚拟滚动
```tsx
// 大量数据时使用虚拟滚动
<VirtualRecordList
  records={records}
  height={400}
  itemHeight={80}
/>
```

## 测试策略

### 1. 设备测试
- iPhone SE (375px)
- iPhone 12 (390px)
- iPad (768px)
- iPad Pro (1024px)
- Desktop (1280px+)

### 2. 浏览器测试
- Chrome (移动端/桌面端)
- Safari (iOS)
- Firefox
- Edge

### 3. 工具测试
```bash
# 使用 Chrome DevTools
# 1. 打开开发者工具
# 2. 点击设备图标
# 3. 选择不同设备进行测试

# 使用 Lighthouse
npm run lighthouse

# 使用 WebPageTest
# 访问 webpagetest.org 进行测试
```

## 最佳实践

### 1. 移动端优先
- 先设计移动端布局
- 逐步增强到更大屏幕
- 使用 `min-width` 媒体查询

### 2. 内容优先
- 确保核心内容在所有设备上都可见
- 次要功能可以隐藏或折叠
- 使用渐进式披露

### 3. 性能优先
- 优化图片和资源
- 使用适当的缓存策略
- 避免不必要的重渲染

### 4. 可访问性
- 确保足够的颜色对比度
- 提供键盘导航支持
- 使用语义化 HTML

## 常见问题解决

### 1. 水平滚动问题
```css
/* 防止水平滚动 */
.container {
  max-width: 100%;
  overflow-x: hidden;
}

/* 确保内容不超出容器 */
.content {
  word-wrap: break-word;
  overflow-wrap: break-word;
}
```

### 2. 触摸区域过小
```css
/* 增加触摸区域 */
.small-button {
  padding: 8px;
  min-width: 44px;
  min-height: 44px;
}
```

### 3. 字体过小
```css
/* 确保最小字体大小 */
body {
  font-size: 16px; /* 防止自动缩放 */
}

/* 使用相对单位 */
.text-responsive {
  font-size: clamp(14px, 4vw, 18px);
}
```

## 未来优化

### 1. 容器查询
```css
/* 当容器查询支持时 */
@container (min-width: 300px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

### 2. 新的 CSS 特性
- CSS Grid 子网格
- CSS 容器查询
- CSS 逻辑属性

### 3. 性能监控
- 实时性能监控
- 用户体验指标
- 自动优化建议
