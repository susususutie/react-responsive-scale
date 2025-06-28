import { useMemo, useRef, useState } from 'react'
import { useCallback } from 'react'
import ScaleContext from './ScaleContext'
import { useEffect } from 'react'
import debounce from 'lodash-es/debounce'

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

  // TODO 参数校验

  const rootRef = useRef<HTMLDivElement>(null)
  const [rootSize, setRootSize] = useState<{ width: number; height: number; rootFontSize: number } | null>(null)
  useEffect(() => {
    const computeSize = (size: { width: number; height: number }) => {
      if (!size || !size.width || !size.height) {
        return { width: 0, height: 0, rootFontSize: Math.round(rootValue * 10 ** precision) / 10 ** precision }
      }
      // 目标宽高比
      const aspectRatio = rootWidth / rootHeight
      let width = 0
      let height = 0
      if (size && size.width && size.height) {
        const wrapperWPH = size.width / size.height
        // 1. 外层宽高比更大, 外层更宽, 以高度为基准, 左右留白
        if (wrapperWPH > aspectRatio) {
          height = size.height
          width = Math.round(height * aspectRatio * 10 ** precision) / 10 ** precision
        }
        // 2. 外层宽高比更小, 外层更高, 以宽度为基准, 上下留白
        else if (wrapperWPH < aspectRatio) {
          width = size.width
          height = Math.round((width / aspectRatio) * 10 ** precision) / 10 ** precision
        }
        // 3. 宽高比相同, 以外层尺寸显示
        else {
          width = size.width
          height = size.height
        }
      }

      return {
        width,
        height,
        rootFontSize: Math.round((width / (rootWidth / rootValue)) * 10 ** precision) / 10 ** precision,
      }
    }
    const { clientWidth, clientHeight } = rootRef.current!
    // console.log('first calculate', clientWidth, clientHeight)
    const size = computeSize({ width: clientWidth, height: clientHeight })
    setRootSize(size)

    const onResize = debounce(
      () => {
        const { clientWidth, clientHeight } = rootRef.current!
        // console.log('onResize', clientWidth, clientHeight)
        const size = computeSize({ width: clientWidth, height: clientHeight })
        setRootSize(size)
      },
      wait
      // { leading: false, trailing: true }
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
      return Math.round(rootSize.width * (percent / 100) * 10 ** precision) / 10 ** precision
    },
    [rootSize?.width, precision]
  )
  const calcHeight = useCallback(
    (percent: number) => {
      if (typeof rootSize?.height !== 'number' || typeof percent !== 'number' || percent < 0 || percent > 100) {
        return 0
      }
      return Math.round(rootSize.height * (percent / 100) * 10 ** precision) / 10 ** precision
    },
    [rootSize?.height, precision]
  )
  const calcPx = useCallback(
    (px: number) => {
      if (typeof rootSize?.rootFontSize !== 'number' || typeof px !== 'number') {
        return px
      }
      return Math.round(((px * rootSize.rootFontSize) / rootValue) * 10 ** precision) / 10 ** precision
    },
    [rootSize?.rootFontSize, rootValue, precision]
  )
  const calcRem = useCallback(
    (px: number) => {
      if (typeof px !== 'number') {
        return '0rem'
      }
      return (Math.round((px / rootValue) * 10 ** precision) / 10 ** precision + 'rem') as `${number}rem`
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

  // console.log('render', rootSize?.width, rootSize?.height, rootSize?.rootFontSize)

  return (
    <ScaleContext.Provider value={ScaleContextValue}>
      <div
        ref={rootRef}
        style={{
          width: '100vw',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: backgroundColor,
          ...style,
        }}
      >
        {backgroundImage ? (
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              backgroundImage: backgroundImage,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              filter: 'blur(10px)',
              zIndex: -1,
            }}
          ></div>
        ) : null}
        <div style={{ width: rootSize?.width, height: rootSize?.height, position: 'relative' }}>
          {rootSize ? children : null}
        </div>
      </div>
    </ScaleContext.Provider>
  )
}
