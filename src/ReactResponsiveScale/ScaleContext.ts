import { createContext } from 'react'

export type ScaleContextType = {
  /**
   * 内容区域实际宽度
   */
  rootWidth: number
  /**
   * 内容区域实际高度
   */
  rootHeight: number
  /**
   * 根元素字体大小
   */
  rootValue: number
  /**
   * 基于内容区域宽度百分比计算尺寸
   */
  calcWidth: (percent: number) => number
  /**
   * 基于内容区域高度百分比计算尺寸
   */
  calcHeight: (percent: number) => number
  /**
   * 基于设计稿尺寸计算当前屏幕下的实际尺寸
   */
  calcPx: (px: number) => number
  /**
   * 基于设计稿尺寸和当前跟元素字体大小计算rem
   */
  calcRem: (px: number) => `${number}rem`
}

const ScaleContext = createContext<ScaleContextType>(null as unknown as ScaleContextType)

export default ScaleContext
