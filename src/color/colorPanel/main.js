import { getTinyColor, getElSizePosition, getValInRange, throttle } from './utility'
import stashes from './colorstash'
import Slider from './colorslider'

export default {
  data () {
    const origin = getTinyColor(this.value)
    const { h, s, v } = origin.hsv
    return {
      colorMode: {
        type: ['hex', 'rgb'],
        idx: 0
      },
      stashMode: {
        type: Object.keys(stashes),
        idx: 0
      },
      sizeInfo: {},
      // color value in data logic
      color: {
        hue: h,
        saturation: s,
        value: v
      },
      // value: 100,
      // origin calculated by tinycolor
      origin
    }
  },
  components: {
    Slider
  },
  props: {
    value: {
      type: String,
      default: '#f00'
    },
    mode: {
      type: String,
      default: 'all'
    }
  },
  computed: {
    // 返回当前颜色的RGBA
    rgbString () {
      const { alpha, rgb: { r, g, b } } = this.origin
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    },
    hsvString () {
      const { alpha, hsv: { h, s, v } } = this.origin
      return `hsva(${h}, ${s}%, ${v}%, ${alpha})`
    },
    hexString () {
      const isTransparent = this.rgbString === 'rgba(255, 255, 255, 0)'
      return isTransparent ? 'transparent' : this.origin.hex
    },
    // 仅返回当前颜色的色相，hue值
    hueString () {
      const hue = this.color.hue
      const { hex } = getTinyColor(`hsv(${hue}, 100%, 100%)`)
      return hex
    },
    hueSlideValue () {
      const hue = this.color.hue
      return Math.round(hue / 360 * 100)
    },
    opacitySlideValue () {
      if (this.origin.alpha !== 1 && this.colorMode.idx === 0) {
        this.colorMode.idx++
      }
      return this.origin.alpha * 100
    },
    // 返回颜色指针的坐标
    pointerPosition () {
      const { saturation, value } = this.color
      const left = `${saturation}%`
      const top = `${100 - value}%`
      return {
        left,
        top
      }
    },
    opacityStyle () {
      return {
        background: `linear-gradient(to right, transparent 0%, ${this.rgbString} 100%)`
      }
    },
    colorType () {
      return this.colorMode.type[this.colorMode.idx]
    },
    stashType () {
      return this.stashMode.type[this.stashMode.idx]
    },
    stash () {
      return stashes[this.stashType]
    },
    isHex () {
      return this.colorType === 'hex'
    },
    isRgb () {
      return this.colorType === 'rgb'
    },
    isHsv () {
      return this.colorType === 'hsv'
    }
  },
  watch: {
    value (val) {
      this.resetOrigin(val)
      if (!this.isDragging) this.resetColor()
    }
  },
  /**
   * TODO
   * - 白色和黑色的处理
   * - modal dialog
   */
  methods: {
    resetOrigin (val) {
      this.origin = getTinyColor(val)
    },
    resetColor () {
      const { h, s, v } = this.origin.hsv
      this.color.hue = h
      this.color.saturation = s
      this.color.value = v
    },
    change () {
      this.resetOrigin(this[`${this.colorType}String`])
      this.resetColor()
      this.emitChange()
    },
    setColor (item) {
      this.resetOrigin(item)
      this.resetColor()
      this.emitChange()
    },
    toggleMode () {
      this.colorMode.idx++
      if (this.colorMode.idx >= this.colorMode.type.length) this.colorMode.idx = 0
      this.origin.alpha = 1
      this.emitChange()
    },
    toggleStash () {
      this.stashMode.idx++
      if (this.stashMode.idx >= this.stashMode.type.length) this.stashMode.idx = 0
    },
    emitChange () {
      this.$nextTick(() => {
        const type = this.mode === 'all' ? this.colorType : this.mode
        this.$emit('input', this[`${type}String`])
        this.$emit('change', this[`${type}String`])
      })
    },
    /**
     * 右侧滑动条控制色相的配置, 改变色相后，将元数据重置
     * @param  {[type]} val [description]
     * @return {[type]}     [description]
     */
    hueSlide (val) {
      const h = Math.round(val / 100 * 360)
      const { alpha, hsv: { s, v } } = this.origin
      const color = getTinyColor(`hsva(${h}, ${s}%, ${v}%, ${alpha})`)
      this.color.hue = h
      this.origin = color
      this.emitChange()
    },
    /** 透明度滑条
     * @param  {[type]} val [description]
     * @return {[type]}     [description]
     */
    opacitySlide (val) {
      this.colorMode.idx = 1
      this.origin.alpha = Math.round(val) / 100
      this.emitChange()
    },
    /**
     * 选择烟液开始事件
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    choose (e) {
      this.onDragStart(e)
    },
    onDragStart (e) {
      this.isDragging = true
      this.sizeInfo = getElSizePosition(this.$refs.vcolors)
      this.onDragging(e)
      this.registerGlobalEvent('bind')
    },
    /**
     * 移动饱和度和明暗度时，将元数据重置
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    onDragging (e) {
      if (!this.isDragging) return
      const { pageX, pageY } = e
      const { width, height, left, top } = this.sizeInfo

      const l = pageX - left - window.scrollX
      const t = pageY - top - window.scrollY

      const { alpha } = this.origin // opacity
      let saturation = l / width * 100 // x axis represents saturation
      let value = (height - t) / height * 100 // y axis represent value
      // ATTENTION: keep hue's value
      const hue = this.color.hue
      saturation = Math.round(getValInRange(saturation, 0, 100))
      value = Math.round(getValInRange(value, 0, 100))

      this.color.saturation = saturation
      this.color.value = value

      this.origin = getTinyColor(`hsva(${hue}, ${saturation}%, ${value}%, ${alpha})`)
      this.emitChange()
    },

    onDragEnd () {
      this.isDragging = false
      this.registerGlobalEvent('unbind')
    },
    /**
     * WHY 17 => for one keyframe duration in 60FPS
     * @return {[type]} [description]
     */
    registerGlobalEvent (type) {
      type = type === 'bind' ? 'addEventListener' : 'removeEventListener'
      window[type]('mousemove', throttle(this.onDragging, 17))
      window[type]('mouseup', this.onDragEnd)
      window[type]('contextmenu', this.onDragEnd)
    }
  }
}
