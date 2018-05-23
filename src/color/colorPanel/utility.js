import tinycolor from 'tinycolor2'

export function includes (el, child) {
  if (el) {
    return el === child || el.contains(child)
  } else {
    return false
  }
}

export function contains (el, child) {
  return el !== child && el.contains(child)
}

/**
 * tinyColor生成基础颜色对象
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
export const getTinyColor = value => {
  let color = tinycolor(value)
  let isValid = color.isValid()
  if (isValid) {
    let {h, s, v} = color.toHsv()
    let {r, g, b} = color.toRgb()
    h = Math.round(h)
    s = Math.round(s * 100)
    v = Math.round(v * 100)
    return {
      rgb: {r, g, b},
      hsv: {h, s, v},
      hex: color.toHexString(),
      alpha: color.getAlpha()
    }
  } else {
    // 不合法时返回默认值：红色
    console.warn('WARN: value is not valid')
    return {
      rgb: {r: 255, g: 0, b: 0, a: 1},
      hsv: {h: 0, s: 100, v: 100, a: 1},
      hex: '#f00',
      alpha: 1
    }
  }
}

/**
 * 获取元素宽高和边距值
 * @param  {[type]} el [description]
 * @return {[type]}    [description]
 */
export const getElSizePosition = el => {
  // compatiable ie 8+
  return {
    width: el.clientWidth,
    height: el.clientHeight,
    left: el.getBoundingClientRect().left + document.body.scrollLeft,
    top: el.getBoundingClientRect().top + document.body.scrollTop
  }
}

export const getValInRange = (val, min, max) => {
  if (typeof val === 'number') {
    return val < min ? min : val > max ? max : val
  } else {
    return min
  }
}

// 节流
export const throttle = (fn, threshhold, scope) => {
  threshhold || (threshhold = 250)
  let last
  let deferTimer
  return (...args) => {
    let context = scope || this
    let now = Date.now()
    if (last && now < last + threshhold) {
      clearTimeout(deferTimer)
      deferTimer = setTimeout(() => {
        last = now
        fn.apply(context, args)
      }, threshhold)
    } else {
      last = now
      fn.apply(context, args)
    }
  }
}
