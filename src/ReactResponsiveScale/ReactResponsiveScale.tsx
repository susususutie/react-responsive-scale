import { useMemo, useRef, useState, useCallback, useEffect } from 'react'
import ScaleContext from './ScaleContext'
import debounce from 'lodash-es/debounce'

// 精度计算工具函数
const roundPrecision = (value: number, precision: number): number => {
  return Math.round(value * 10 ** precision) / 10 ** precision
}

export type ReactResponsiveScaleProps = {
  /**
   * html标签字体大小
   * @default 16
   */
  rootValue?: number
  /**
   * 内容区域设计稿宽度
   * @default 1920
   */
  rootWidth?: number
  /**
   * 设内容区域计稿高度
   * @default 1080
   */
  rootHeight?: number
  /**
   * 尺寸计算精度
   * @default 5
   */
  precision?: number
  /**
   * 浏览器窗口尺寸变更后重新计算尺寸的防抖时间间隔
   * @default 300
   */
  wait?: number
  /**
   * 窗口背景色
   */
  backgroundColor?: string
  /**
   * 窗口背景图
   */
  backgroundImage?: string

  style?: React.CSSProperties
  children?: React.ReactNode
}

export default function ReactResponsiveScale(props: ReactResponsiveScaleProps) {
  const {
    rootValue = 16,
    precision = 5,
    rootWidth = 1920,
    rootHeight = 1080,
    wait = 300,
    backgroundColor,
    backgroundImage,

    style,
    children,
  } = props

  // 参数校验 (仅在挂载时执行一次)
  // 故意不使用 props 作为依赖，因为只需要在挂载时校验一次
  useEffect(() => {
    // validateProps 只在组件挂载时执行一次，用于警告用户错误的配置
    const { rootValue, rootWidth, rootHeight, precision, wait } = props
    if (rootValue !== undefined && rootValue <= 0) {
      console.warn('[ReactResponsiveScale] rootValue must be greater than 0')
    }
    if (rootWidth !== undefined && rootWidth <= 0) {
      console.warn('[ReactResponsiveScale] rootWidth must be greater than 0')
    }
    if (rootHeight !== undefined && rootHeight <= 0) {
      console.warn('[ReactResponsiveScale] rootHeight must be greater than 0')
    }
    if (precision !== undefined && (precision < 0 || precision > 10)) {
      console.warn('[ReactResponsiveScale] precision should be between 0 and 10')
    }
    if (wait !== undefined && wait < 0) {
      console.warn('[ReactResponsiveScale] wait must be greater than or equal to 0')
    }
  }, []) // 故意只在挂载时执行一次

  const rootRef = useRef<HTMLDivElement>(null)
  const [rootSize, setRootSize] = useState<{ width: number; height: number; rootFontSize: number } | null>(null)
  useEffect(() => {
    const computeSize = (size: { width: number; height: number }) => {
      if (!size || !size.width || !size.height) {
        return { width: 0, height: 0, rootFontSize: roundPrecision(rootValue, precision) }
      }
      // 目标宽高比
      const aspectRatio = rootWidth / rootHeight
      let width = 0
      let height = 0
      const wrapperWPH = size.width / size.height
      // 1. 外层宽高比更大, 外层更宽, 以高度为基准, 左右留白
      if (wrapperWPH > aspectRatio) {
        height = size.height
        width = roundPrecision(height * aspectRatio, precision)
      }
      // 2. 外层宽高比更小, 外层更高, 以宽度为基准, 上下留白
      else if (wrapperWPH < aspectRatio) {
        width = size.width
        height = roundPrecision(width / aspectRatio, precision)
      }
      // 3. 宽高比相同, 以外层尺寸显示
      else {
        width = size.width
        height = size.height
      }

      return {
        width,
        height,
        rootFontSize: roundPrecision(width / (rootWidth / rootValue), precision),
      }
    }
    const { clientWidth, clientHeight } = rootRef.current!
    const size = computeSize({ width: clientWidth, height: clientHeight })
    setRootSize(size)

    const onResize = debounce(
      () => {
        const { clientWidth, clientHeight } = rootRef.current!
        const size = computeSize({ width: clientWidth, height: clientHeight })
        setRootSize(size)
      },
      wait
    )
    window.addEventListener('resize', onResize, true)

    return () => {
      window.removeEventListener('resize', onResize, true)
    }
  }, [rootValue, precision, rootWidth, rootHeight, wait])

  const calcWidth = useCallback(
    (percent: number) => {
      if (typeof rootSize?.width !== 'number' || typeof percent !== 'number' || percent < 0 || percent > 100) {
        return 0
      }
      return roundPrecision(rootSize.width * (percent / 100), precision)
    },
    [rootSize?.width, precision]
  )
  const calcHeight = useCallback(
    (percent: number) => {
      if (typeof rootSize?.height !== 'number' || typeof percent !== 'number' || percent < 0 || percent > 100) {
        return 0
      }
      return roundPrecision(rootSize.height * (percent / 100), precision)
    },
    [rootSize?.height, precision]
  )
  const calcPx = useCallback(
    (px: number) => {
      if (typeof rootSize?.rootFontSize !== 'number' || typeof px !== 'number') {
        return px
      }
      return roundPrecision((px * rootSize.rootFontSize) / rootValue, precision)
    },
    [rootSize?.rootFontSize, rootValue, precision]
  )
  const calcRem = useCallback(
    (px: number) => {
      if (typeof px !== 'number') {
        return '0rem'
      }
      return (roundPrecision(px / rootValue, precision) + 'rem') as `${number}rem`
    },
    [rootValue, precision]
  )

  const ScaleContextValue = useMemo(
    () => ({
      rootWidth: rootSize?.width || 0,
      rootHeight: rootSize?.height || 0,
      rootValue: rootSize?.rootFontSize || 0,
      calcWidth,
      calcHeight,
      calcPx,
      calcRem,
    }),
    [rootSize?.width, rootSize?.height, rootSize?.rootFontSize, calcWidth, calcHeight, calcPx, calcRem]
  )

  useEffect(() => {
    const fontSize = rootSize?.rootFontSize ?? rootValue
    document.documentElement.style.fontSize = fontSize + 'px'
  }, [rootValue, rootSize?.rootFontSize])

  // 主容器样式
  const containerStyle: React.CSSProperties = useMemo(
    () => ({
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      backgroundColor,
      ...style,
    }),
    [backgroundColor, style]
  )

  // 背景图样式
  const backgroundStyle: React.CSSProperties = useMemo(
    () => ({
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      backgroundImage: backgroundImage!,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      filter: 'blur(10px)',
      zIndex: -1,
    }),
    [backgroundImage]
  )

  // 内容区域样式
  const contentStyle: React.CSSProperties = useMemo(
    () => ({
      width: rootSize?.width,
      height: rootSize?.height,
      position: 'relative',
    }),
    [rootSize?.width, rootSize?.height]
  )

  return (
    <ScaleContext.Provider value={ScaleContextValue}>
      <div ref={rootRef} style={containerStyle}>
        {backgroundImage && <div style={backgroundStyle}></div>}
        <div style={contentStyle}>{rootSize ? children : null}</div>
      </div>
    </ScaleContext.Provider>
  )
}
