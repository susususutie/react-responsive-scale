import { describe, it, expect } from 'vitest'

describe('ScaleContext', () => {
  it('should have correct default values', () => {
    const defaultScaleContext = {
      rootWidth: 0,
      rootHeight: 0,
      rootValue: 16,
      calcWidth: () => 0,
      calcHeight: () => 0,
      calcPx: () => 0,
      calcRem: () => '0rem' as const,
    }

    expect(defaultScaleContext.rootWidth).toBe(0)
    expect(defaultScaleContext.rootHeight).toBe(0)
    expect(defaultScaleContext.rootValue).toBe(16)
    expect(defaultScaleContext.calcWidth(50)).toBe(0)
    expect(defaultScaleContext.calcHeight(50)).toBe(0)
    expect(defaultScaleContext.calcPx(100)).toBe(0)
    expect(defaultScaleContext.calcRem(16)).toBe('0rem')
  })

  it('should calculate rem correctly', () => {
    const calcRem = (px: number, rootValue = 16): `${number}rem` => {
      return (Math.round((px / rootValue) * 100) / 100 + 'rem') as `${number}rem`
    }

    expect(calcRem(16, 16)).toBe('1rem')
    expect(calcRem(32, 16)).toBe('2rem')
    expect(calcRem(8, 16)).toBe('0.5rem')
  })

  it('should calculate percentage correctly', () => {
    const calcWidth = (percent: number, width = 1920): number => {
      return Math.round(width * (percent / 100) * 100) / 100
    }

    expect(calcWidth(50, 1920)).toBe(960)
    expect(calcWidth(100, 1920)).toBe(1920)
    expect(calcWidth(25, 1920)).toBe(480)
  })
})
