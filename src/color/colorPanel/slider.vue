<template lang="html">
  <div ref="vslider" :class="['color-slider',sliderClass]" @mousedown="onDragStart">
    <div class="color-slider-slot color-slider-slot-base"></div>
    <div class="color-slider-slot color-slider-slot-acitve" :style="slotActiveStyle"></div>
    <div class="color-slider-pointer" :style="pointStyle"></div>
  </div>
</template>

<script>

import {getElSizePosition, getValInRange} from './utility'

export default {
  data () {
    return {
      val: getValInRange(this.value, 0, 100),
      elSizePostion: {}
    }
  },
  props: {
    step: {
      type: Number,
      default: 0
    },
    value: {
      type: Number,
      default: 0
    },
    disable: {
      type: Boolean,
      default: false
    }
  },
  // props 传入变化后监听
  watch: {
    value (val) {
      this.val = getValInRange(val, 0, 100)
    }
  },
  computed: {
    pointStyle () {
      let cls = {}
      let key = 'left'
      cls[key] = `${this.val}%`
      return cls
    },
    slotActiveStyle () {
      let cls = {}
      let key = 'width'
      cls[key] = `${this.val}%`
      return cls
    },
    sliderClass () {
      return 'color-slider-horizontal'
    }
  },
  methods: {
    resetOffset () {
      let $el = this.$refs.vslider
      let {width, height, left, top} = getElSizePosition($el)
      this.elSizePostion = {
        width,
        height,
        left,
        top
      }
    },
    onDragStart (e) {
      if (this.disable) return
      this.isDragging = true
      this.resetOffset()
      this.onDragging(e)
      this.bindGlobalEvent()
    },
    onDragging (e) {
      let {pageX} = e
      let {width, left} = this.elSizePostion

      left = pageX - left
      // top = pageY - top

      let percent = left / width * 100
      percent = percent < 0 ? 0 : percent > 100 ? 100 : parseFloat(percent.toFixed(4))

      percent = this.handleStep(percent)

      this.val = percent
      this.$emit('change', this.val)
    },
    handleStep (percent) {
      let value = percent
      let step = this.step
      if (step) {
        value = Math.floor(percent / step) * step
      }
      return value
    },
    onDragEnd () {
      this.isDragging = false
      this.unbindGlobalEvent()
    },
    change (e) {
      console.log('event', e)
    },
    bindGlobalEvent () {
      window.addEventListener('mousemove', this.onDragging)
      window.addEventListener('mouseup', this.onDragEnd)
      window.addEventListener('contextmenu', this.onDragEnd)
    },
    unbindGlobalEvent () {
      window.removeEventListener('mousemove', this.onDragging)
      window.removeEventListener('mouseup', this.onDragEnd)
      window.removeEventListener('contextmenu', this.onDragEnd)
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>
$h: 12px;
$pointSize: 12px;
$color: #3449d7;
.color-slider{
  position: relative;
  &-slot{
    // background-color: #eee;
    position: absolute;
    width: 20px;
  }
  &-slot-acitve{
    // background-color: $color;
  }
  &-pointer{
    position: absolute;
    top: 0;
    width: $pointSize;
    height: $pointSize;
    background-color: rgba(255,255,255,1);
    border-radius: $pointSize;
    box-shadow: 0 0 5px 0 rgba(0,0,0,.4);
    cursor: pointer;
    &:hover{
      box-shadow: 0 0 5px $color;
    }
  }
  &-horizontal{
    height: 100%;
    .color-slider{
      &-slot{
        height: $h;
        width: 100%;
      }
      &-pointer{
        left: 0;
        top: ($h - $pointSize) / 2;
        transform: translateX(-$pointSize/2);
      }
    }
  }
}
</style>
