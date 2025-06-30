# React Responsive Scale

一个用于数据大屏页面的 React 组件，能够确保大屏内容在任意比例的屏幕上保持指定的比例，并动态调整 `html` 的 `font-size`，用于 `rem` 布局。

## 安装

```bash
pnpm add react-responsive-scale
```

## 使用方法

### 基本用法

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import ResponsiveScale from 'react-responsive-scale'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <ResponsiveScale
      rootValue={16} // 设计稿尺寸下的根组件 font-size
      rootWidth={1920} // 设计稿宽度
      rootHeight={1080} // 设计稿高度
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          color: '#fff',
          fontSize: '2rem',
          textAlign: 'center',
          lineHeight: '1080px',
        }}
      >
        不管浏览器尺寸如何，内容区域都按指定宽高比显示
      </div>
    </ResponsiveScale>
  </React.StrictMode>
)
```

### 参数说明

| 参数名称          | 类型     | 描述                                                                |
| ----------------- | -------- | ------------------------------------------------------------------- |
| `rootValue`       | `number` | 设计稿尺寸下的根组件 `font-size`，用于 `rem` 布局。                 |
| `rootWidth`       | `number` | 设计稿宽度。                                                        |
| `rootHeight`      | `number` | 设计稿高度。                                                        |
| `precision`       | `number` | 计算精度，默认值为 `5`。                                            |
| `wait`            | `number` | 浏览器窗口尺寸变更后重新计算的 debounce 时间，默认值为 `300` 毫秒。 |
| `backgroundImage` | `string` | 全屏背景图的。                                                      |
| `backgroundColor` | `string` | 全屏背景底色。                                                      |

### 获取尺寸参数和计算方法

在大屏业务组件中，可以通过 `ResponsiveScale` 的 `context` 获取必要尺寸参数和尺寸计算方法。

```tsx
import React, { useContext } from 'react'
import { ScaleContext } from 'react-responsive-scale'

const MyComponent: React.FC = () => {
  const { calcPx, calcRem } = useContext(ScaleContext)

  return (
    <div>
      <p>设计稿尺寸 100px 转换为当前屏幕下的实际尺寸: {calcPx(100)}px</p>
      <p>设计稿尺寸 100px 转换为 rem 尺寸: {calcRem(100)}rem</p>
    </div>
  )
}

export default MyComponent
```
