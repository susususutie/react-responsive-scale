import { createContext } from 'react'

export type ScaleContextType = {
  /** 内容区域实际宽度 */
  rootWidth: number
  /** 内容区域实际高度 */
  rootHeight: number
  /** 根元素字体大小 */
  rootValue: number
  /** 基于内容区域宽度百分比计算尺寸 */
  calcWidth: (percent: number) => number
  /** 基于内容区域高度百分比计算尺寸 */
  calcHeight: (percent: number) => number
  /** 基于设计稿尺寸计算当前屏幕下的实际尺寸 */
  calcPx: (px: number) => number
  /** 基于设计稿尺寸和当前根元素字体大小计算 rem */
  calcRem: (px: number) => `${number}rem`
}

/** 默认值 - 所有计算返回 0 */
const defaultScaleContext: ScaleContextType = {
  rootWidth: 0,
  rootHeight: 0,
  rootValue: 16,
  calcWidth: () => 0,
  calcHeight: () => 0,
  calcPx: () => 0,
  calcRem: () => '0rem',
}

const ScaleContext = createContext<ScaleContextType>(defaultScaleContext)

export default ScaleContext
