# AI 工作指南 - react-responsive-scale

> 本文档供 AI 助手阅读，了解项目规范后继续开发工作

## 项目概述

React 响应式缩放组件，用于数据大屏/仪表盘页面，确保内容在任意比例的屏幕上保持设计稿比例，并动态调整 HTML 根元素的 font-size 用于 rem 布局。

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| React | >=18.1.0 | UI 库 |
| TypeScript | ~5.8.3 | 类型系统 |
| Vite | ^7.0.0 | 构建工具 |
| tsup | ^8.5.0 | 包打包工具 |
| lodash-es | ^4.17.21 | 工具库 |
| pnpm | 10.12.1 | 包管理器 |

## 项目结构

```
src/
├── ReactResponsiveScale/
│   ├── ReactResponsiveScale.tsx  # 核心组件（约 200 行）
│   ├── ScaleContext.ts           # React Context（提供计算函数）
│   └── index.ts                 # 导出
├── Dashboard.tsx                 # 示例数据大屏
├── App.tsx                      # 演示入口
└── main.tsx                     # 入口文件
```

## 核心实现原理

### 1. 缩放算法

组件核心逻辑在 `computeSize` 函数：

```typescript
// 目标宽高比
const aspectRatio = rootWidth / rootHeight
const wrapperWPH = size.width / size.height

// 情况1：外层更宽，以高度为基准，左右留白
if (wrapperWPH > aspectRatio) {
  height = size.height
  width = height * aspectRatio
}
// 情况2：外层更高，以宽度为基准，上下留白
else if (wrapperWPH < aspectRatio) {
  width = size.width
  height = width / aspectRatio
}
// 情况3：比例相同，直接填满
else {
  width = size.width
  height = size.height
}
```

### 2. rem 适配

动态计算 font-size：

```typescript
rootFontSize = (width / rootWidth) * rootValue
// 例如：1920x1080 设计稿，rootValue=16
// 实际宽度 960 时，fontSize = (960/1920) * 16 = 8px
```

### 3. 计算函数

通过 Context 提供 4 个计算函数：

| 函数 | 用途 | 示例 |
|------|------|------|
| `calcWidth(percent)` | 宽度百分比 | `calcWidth(50)` → 960px |
| `calcHeight(percent)` | 高度百分比 | `calcHeight(50)` → 540px |
| `calcPx(px)` | 设计稿 px 转实际 px | `calcPx(100)` → 50px |
| `calcRem(px)` | 设计稿 px 转 rem | `calcRem(16)` → `1rem` |

## 组件参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `rootValue` | number | 16 | 设计稿根字体大小 |
| `rootWidth` | number | 1920 | 设计稿宽度 |
| `rootHeight` | number | 1080 | 设计稿高度 |
| `precision` | number | 5 | 计算精度（小数位数） |
| `wait` | number | 300 | resize 防抖时间(ms) |
| `backgroundColor` | string | - | 背景色 |
| `backgroundImage` | string | - | 背景图 |

## 使用示例

### 基本用法

```tsx
import { ReactResponsiveScale } from 'react-responsive-scale'

<ReactResponsiveScale
  rootValue={16}
  rootWidth={1920}
  rootHeight={1080}
>
  <div style={{ width: '100%', height: '100%' }}>
    内容区域
  </div>
</ReactResponsiveScale>
```

### 使用计算函数

```tsx
import { ScaleContext } from 'react-responsive-scale'

const MyComponent = () => {
  const { calcPx, calcRem } = useContext(ScaleContext)
  
  return (
    <div style={{ width: calcPx(100), fontSize: calcRem(16) }}>
      内容
    </div>
  )
}
```

## 开发规范

### 代码校验

修改代码后提交前必须执行：

```bash
pnpm lint         # ESLint 检查
pnpm build        # TypeScript 编译
pnpm build-pkg    # 构建发布包
```

### 提交规范

- `feat:` - 新功能
- `fix:` - Bug 修复
- `docs:` - 文档更新
- `style:` - 样式调整（不影响功能）

### 发布命令

```bash
pnpm publish       # 发布到 npm
```

## 常见问题

### Q: 如何使用自定义字体大小？

A: 设置 `rootValue` 参数，例如 `rootValue={20}` 表示设计稿使用 20px 根字体。

### Q: 计算结果与预期不符？

A: 检查 `precision` 参数，默认保留 5 位小数可能导致轻微误差。

### Q: 组件不生效？

A: 确保父容器有明确宽高（建议 100vw x 100vh），且组件是根元素。

## 依赖关系

```
ReactResponsiveScale.tsx
├── useMemo, useRef, useState, useEffect, useCallback (react)
├── ScaleContext (本地)
└── debounce (lodash-es)
```

## 注意事项

1. 组件使用 `position: fixed` 定位，需要足够的外层空间
2. 计算结果受 `precision` 影响，默认 5 位小数
3. resize 防抖默认 300ms，可通过 `wait` 参数调整
4. 组件会修改 `document.documentElement.style.fontSize`
