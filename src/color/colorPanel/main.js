import {getTinyColor, getElSizePosition, getValInRange, throttle} from './utility'
import stashes from './stash'
import Slider from './slider.vue'
let types = ['hex', 'rgb']
// types.pop()
let stashTypes = Object.keys(stashes)
export default {
  data () {
    return {
      colorTypeIdx: 0,
      stashTypeIdx: 0,
      elSizePostion: {},
      hue: 0,
      origin: {
        hex: '#f00',
        hsv: {
          h: 0,
          s: 100,
          v: 100
        },
        rgb: {
          r: 255,
          g: 0,
          b: 0
        },
        alpha: 1
      }
    }
  },
  components: {
    Slider
  },
  props: {
    value: {
      type: String,
      default: '#f00'
    }
  },
  computed: {
    // 返回当前颜色的RGBA
    rgbString () {
      let {alpha, rgb: {r, g, b}} = this.origin
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    },
    hsvString () {
      let {alpha, hsv: {h, s, v}} = this.origin
      return `hsva(${h}, ${s}%, ${v}%, ${alpha})`
    },
    hexString () {
      return this.origin.hex
    },
    // 仅返回当前颜色的色相，hue值
    hueString () {
      let hue = this.hue
      let {hex} = getTinyColor(`hsv(${hue}, 100%, 100%)`)
      return hex
    },
    hueSlideValue () {
      let hue = this.hue
      return Math.round(hue / 360 * 100)
    },
    opacitySlideValue () {
      if (this.origin.alpha !== 1 && this.colorTypeIdx === 0) {
        this.colorTypeIdx++
      }
      return this.origin.alpha * 100
    },
    // 返回颜色指针的坐标
    pointerStyle () {
      let {s, v} = this.origin.hsv
      return {
        left: `${s}%`,
        top: `${100 - v}%`
      }
    },
    opacityStyle () {
      return {
        background: `linear-gradient(to right, transparent 0%, ${this.origin.hex} 100%)`
      }
    },
    colorType () {
      return types[this.colorTypeIdx]
    },
    stashType () {
      return stashTypes[this.stashTypeIdx]
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
      this.resetColor(val)
      this.hue = this.origin.hsv.h
    }
  },
  /**
   * TODO
   * - 白色和黑色的处理
   * - modal dialog
   */
  methods: {
    resetColor (val) {
      this.origin = getTinyColor(val)
    },
    change () {
      this.resetColor(this[`${this.colorType}String`])
      this.hue = this.origin.hsv.h
      this.emitChange()
    },
    setColor (item) {
      this.resetColor(item)
      this.hue = this.origin.hsv.h
      this.emitChange()
    },
    toggleMode () {
      this.colorTypeIdx++
      if (this.colorTypeIdx >= types.length) this.colorTypeIdx = 0
      this.emitChange()
    },
    toggleStash () {
      this.stashTypeIdx++
      if (this.stashTypeIdx >= stashTypes.length) this.stashTypeIdx = 0
    },
    emitChange () {
      this.$emit('input', this[`${this.colorType}String`])
      this.$emit('change', this[`${this.colorType}String`])
    },
    /**
     * 右侧滑动条控制色相的配置, 改变色相后，将元数据重置
     * @param  {[type]} val [description]
     * @return {[type]}     [description]
     */
    hueSlide (val) {
      let h = Math.round(val / 100 * 360)
      let {alpha, hsv: {s, v}} = this.origin
      let color = getTinyColor(`hsva(${h}, ${s}%, ${v}%, ${alpha})`)
      this.hue = h
      this.origin = color
      this.emitChange()
    },
    /** 透明度滑条
     * @param  {[type]} val [description]
     * @return {[type]}     [description]
     */
    opacitySlide (val) {
      this.colorTypeIdx = 1
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
      this.elSizePostion = getElSizePosition(this.$refs.vcolors)
      this.onDragging(e)
      this.bindGlobalEvent()
    },
    /**
     * 移动饱和度和明暗度时，将元数据重置
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    onDragging (e) {
      if (!this.isDragging) return
      let {pageX, pageY} = e
      let {width, height, left, top} = this.elSizePostion

      let l = pageX - left - window.scrollX
      let t = pageY - top - window.scrollY

      let saturation = l / width * 100
      let value = (height - t) / height * 100
      let {alpha} = this.origin
      // ATTENTION: 保持 hue 不变
      let hue = this.hue
      saturation = Math.round(getValInRange(saturation, 0, 100))
      value = Math.round(getValInRange(value, 0, 100))
      let color = getTinyColor(`hsva(${hue}, ${saturation}%, ${value}%, ${alpha})`)
      if (value <= 1) {
        color.hsv.s = saturation
      }
      this.origin = color
      this.emitChange()
    },
    onDragEnd () {
      this.isDragging = false
      this.unbindGlobalEvent()
    },
    /**
     * WHY 17 =》 just for one keyframe duration in 60FPS
     * @return {[type]} [description]
     */
    bindGlobalEvent () {
      window.addEventListener('mousemove', throttle(this.onDragging, 17))
      window.addEventListener('mouseup', this.onDragEnd)
      window.addEventListener('contextmenu', this.onDragEnd)
    },
    unbindGlobalEvent () {
      window.removeEventListener('mousemove', throttle(this.onDragging, 17))
      window.removeEventListener('mouseup', this.onDragEnd)
      window.removeEventListener('contextmenu', this.onDragEnd)
    }
  },
  mounted () {
    // 初始化颜色
    this.resetColor(this.value)
    this.hue = this.origin.hsv.h
    window.vcolor = this
  }
}
