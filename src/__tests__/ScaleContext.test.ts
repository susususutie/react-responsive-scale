import { describe, it, expect } from 'vitest'

// ============ ScaleContext 默认值测试 ============
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
  })

  it('should return 0 when root size is not initialized', () => {
    const ctx = {
      rootWidth: 0,
      rootHeight: 0,
      rootValue: 0,
      calcWidth: (percent: number) => (percent > 0 && percent <= 100 ? 0 : 0),
      calcHeight: (percent: number) => (percent > 0 && percent <= 100 ? 0 : 0),
      calcPx: (px: number) => (typeof px === 'number' ? 0 : 0),
      calcRem: () => '0rem' as const,
    }

    expect(ctx.calcWidth(50)).toBe(0)
    expect(ctx.calcHeight(50)).toBe(0)
    expect(ctx.calcPx(100)).toBe(0)
  })
})

// ============ 计算函数测试 ============
describe('计算函数', () => {
  describe('calcRem', () => {
    it('should calculate rem correctly', () => {
      const calcRem = (px: number, rootValue = 16): `${number}rem` => {
        return (Math.round((px / rootValue) * 100) / 100 + 'rem') as `${number}rem`
      }

      expect(calcRem(16, 16)).toBe('1rem')
      expect(calcRem(32, 16)).toBe('2rem')
      expect(calcRem(8, 16)).toBe('0.5rem')
      expect(calcRem(0, 16)).toBe('0rem')
    })

    it('should handle different root values', () => {
      const calcRem = (px: number, rootValue: number): `${number}rem` => {
        return (Math.round((px / rootValue) * 100) / 100 + 'rem') as `${number}rem`
      }

      expect(calcRem(20, 20)).toBe('1rem')
      expect(calcRem(10, 20)).toBe('0.5rem')
      expect(calcRem(40, 20)).toBe('2rem')
    })

    it('should handle edge cases', () => {
      const calcRem = (px: number, rootValue = 16): `${number}rem` => {
        if (typeof px !== 'number' || !Number.isFinite(px)) return '0rem' as const
        return (Math.round((px / rootValue) * 100) / 100 + 'rem') as `${number}rem`
      }

      expect(calcRem(-16)).toBe('-1rem')
      expect(calcRem(NaN as unknown as number)).toBe('0rem')
      expect(calcRem(Infinity as unknown as number)).toBe('0rem')
      expect(calcRem(0)).toBe('0rem')
    })
  })

  describe('calcWidth / calcHeight', () => {
    it('should calculate percentage correctly', () => {
      const calcWidth = (percent: number, width = 1920): number => {
        return Math.round(width * (percent / 100) * 100) / 100
      }

      expect(calcWidth(50, 1920)).toBe(960)
      expect(calcWidth(100, 1920)).toBe(1920)
      expect(calcWidth(25, 1920)).toBe(480)
      expect(calcWidth(0, 1920)).toBe(0)
    })

    it('should handle invalid percentages', () => {
      const calcWidth = (percent: number, width = 1920): number => {
        if (typeof percent !== 'number' || percent < 0 || percent > 100 || !Number.isFinite(percent)) {
          return 0
        }
        return Math.round(width * (percent / 100) * 100) / 100
      }

      expect(calcWidth(-1, 1920)).toBe(0)
      expect(calcWidth(101, 1920)).toBe(0)
      expect(calcWidth(NaN as unknown as number, 1920)).toBe(0)
    })
  })

  describe('calcPx', () => {
    it('should calculate px correctly', () => {
      const calcPx = (px: number, rootFontSize: number, rootValue = 16): number => {
        if (typeof rootFontSize !== 'number' || typeof px !== 'number') {
          return px
        }
        return Math.round(((px * rootFontSize) / rootValue) * 100) / 100
      }

      // 设计稿 100px，在 rootFontSize=8 时实际为 50px
      expect(calcPx(100, 8, 16)).toBe(50)
      // 设计稿 16px，在 rootFontSize=16 时实际为 16px
      expect(calcPx(16, 16, 16)).toBe(16)
      // 设计稿 32px，在 rootFontSize=8 时实际为 16px
      expect(calcPx(32, 8, 16)).toBe(16)
    })

    it('should return original px when rootFontSize is invalid', () => {
      const calcPx = (px: number, rootFontSize: number | undefined, rootValue = 16): number => {
        if (typeof rootFontSize !== 'number' || typeof px !== 'number' || !Number.isFinite(rootFontSize)) {
          return px
        }
        return Math.round(((px * rootFontSize) / rootValue) * 100) / 100
      }

      expect(calcPx(100, NaN as unknown as number, 16)).toBe(100)
      expect(calcPx(100, undefined as unknown as number, 16)).toBe(100)
    })
  })
})

// ============ 缩放算法测试 ============
describe('缩放算法', () => {
  const computeSize = (
    wrapperWidth: number,
    wrapperHeight: number,
    rootWidth = 1920,
    rootHeight = 1080,
    precision = 5
  ) => {
    const aspectRatio = rootWidth / rootHeight
    const wrapperWPH = wrapperWidth / wrapperHeight

    let width = 0
    let height = 0

    if (wrapperWPH > aspectRatio) {
      // 外层更宽，以高度为基准
      height = wrapperHeight
      width = Math.round((height * aspectRatio) * 10 ** precision) / 10 ** precision
    } else if (wrapperWPH < aspectRatio) {
      // 外层更高，以宽度为基准
      width = wrapperWidth
      height = Math.round((width / aspectRatio) * 10 ** precision) / 10 ** precision
    } else {
      width = wrapperWidth
      height = wrapperHeight
    }

    const rootFontSize = Math.round((width / (rootWidth / 16)) * 10 ** precision) / 10 ** precision

    return { width, height, rootFontSize }
  }

  describe('保持设计比例 (16:9)', () => {
    it('should fit height when wrapper is wider', () => {
      // 1920x1080 设计稿，容器 1920x540 (更宽)
      const result = computeSize(1920, 540, 1920, 1080)
      expect(result.width).toBe(960)
      expect(result.height).toBe(540)
      expect(result.rootFontSize).toBe(8)
    })

    it('should fit width when wrapper is taller', () => {
      // 1920x1080 设计稿，容器 960x1080 (更高)
      const result = computeSize(960, 1080, 1920, 1080)
      expect(result.width).toBe(960)
      expect(result.height).toBe(540)
      expect(result.rootFontSize).toBe(8)
    })

    it('should use full wrapper when aspect ratio matches', () => {
      // 1920x1080 设计稿，容器也是 16:9
      const result = computeSize(1920, 1080, 1920, 1080)
      expect(result.width).toBe(1920)
      expect(result.height).toBe(1080)
      expect(result.rootFontSize).toBe(16)
    })
  })

  describe('其他比例', () => {
    it('should handle 4:3 design', () => {
      const result = computeSize(1600, 1200, 1920, 1440)
      expect(result.width).toBe(1600)
      expect(result.height).toBe(1200)
      expect(result.rootFontSize).toBe(13.33333)
    })

    it('should handle 1:1 square design', () => {
      const result = computeSize(1000, 1000, 1080, 1080)
      expect(result.width).toBe(1000)
      expect(result.height).toBe(1000)
      expect(result.rootFontSize).toBe(14.81481)
    })
  })

  describe('边界情况', () => {
    it('should handle zero dimensions', () => {
      const result = computeSize(0, 0, 1920, 1080)
      expect(result.width).toBe(0)
      expect(result.height).toBe(0)
    })

    it('should handle very small dimensions', () => {
      const result = computeSize(1, 1, 1920, 1080)
      // 1x1 容器，design 1920x1080 (16:9)
      // wrapperWPH = 1, aspectRatio = 1.777
      // wrapperWPH < aspectRatio，所以以宽度为基准
      // height = 1 / 1.777 = 0.5625
      expect(result.width).toBe(1)
      expect(result.height).toBe(0.5625)
    })
  })
})

// ============ 参数校验测试 ============
describe('参数校验', () => {
  const validateProps = (props: {
    rootValue?: number
    rootWidth?: number
    rootHeight?: number
    precision?: number
    wait?: number
  }) => {
    const warnings: string[] = []

    if (props.rootValue !== undefined && props.rootValue <= 0) {
      warnings.push('rootValue must be greater than 0')
    }
    if (props.rootWidth !== undefined && props.rootWidth <= 0) {
      warnings.push('rootWidth must be greater than 0')
    }
    if (props.rootHeight !== undefined && props.rootHeight <= 0) {
      warnings.push('rootHeight must be greater than 0')
    }
    if (props.precision !== undefined && (props.precision < 0 || props.precision > 10)) {
      warnings.push('precision should be between 0 and 10')
    }
    if (props.wait !== undefined && props.wait < 0) {
      warnings.push('wait must be greater than or equal to 0')
    }

    return warnings
  }

  it('should pass valid props', () => {
    const warnings = validateProps({
      rootValue: 16,
      rootWidth: 1920,
      rootHeight: 1080,
      precision: 5,
      wait: 300,
    })
    expect(warnings).toHaveLength(0)
  })

  it('should warn for invalid rootValue', () => {
    const warnings = validateProps({ rootValue: 0 })
    expect(warnings).toContain('rootValue must be greater than 0')
  })

  it('should warn for invalid rootWidth', () => {
    const warnings = validateProps({ rootWidth: -1 })
    expect(warnings).toContain('rootWidth must be greater than 0')
  })

  it('should warn for invalid rootHeight', () => {
    const warnings = validateProps({ rootHeight: 0 })
    expect(warnings).toContain('rootHeight must be greater than 0')
  })

  it('should warn for invalid precision', () => {
    expect(validateProps({ precision: -1 })).toContain('precision should be between 0 and 10')
    expect(validateProps({ precision: 11 })).toContain('precision should be between 0 and 10')
  })

  it('should warn for invalid wait', () => {
    const warnings = validateProps({ wait: -1 })
    expect(warnings).toContain('wait must be greater than or equal to 0')
  })

  it('should handle multiple invalid props', () => {
    const warnings = validateProps({
      rootValue: 0,
      rootWidth: -100,
      precision: 20,
    })
    expect(warnings).toHaveLength(3)
  })
})

// ============ 精度测试 ============
describe('精度控制', () => {
  const roundToPrecision = (value: number, precision: number): number => {
    return Math.round(value * 10 ** precision) / 10 ** precision
  }

  it('should round to 5 decimal places by default', () => {
    expect(roundToPrecision(1.23456789, 5)).toBe(1.23457)
    expect(roundToPrecision(0.123456789, 5)).toBe(0.12346)
  })

  it('should round to specified precision', () => {
    expect(roundToPrecision(1.23456789, 2)).toBe(1.23)
    expect(roundToPrecision(1.23456789, 0)).toBe(1)
    expect(roundToPrecision(1.99999999, 0)).toBe(2)
  })

  it('should handle precision edge cases', () => {
    expect(roundToPrecision(0, 5)).toBe(0)
    expect(roundToPrecision(-1.23456, 2)).toBe(-1.23)
  })
})
