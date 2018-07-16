<style lang="scss">
.one-colorpicker {
  position: relative;
  display: inline-block;
  vertical-align: top;
  .one-colorpanel{
    position: absolute;
    z-index: 2;
  }
}
.color-block{
  width: 32px;
  height: 32px;
  cursor: pointer;
  position: relative;
  .color-block-layer{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .bg{
    z-index: 0;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMElEQVQ4T2N89uzZfwY8QFJSEp80A+OoAcMiDP7//483HTx//hx/Ohg1gIFx6IcBALl+VXknOCvFAAAAAElFTkSuQmCC);
  }
  .value {
    z-index: 1;
  }
}
</style>

<template>

  <div class="one-colorpicker" ref="colorpicker">
    <div class="color-block" @click="toggle">
      <div class="color-block-layer value" :style="{backgroundColor: color}"></div>
      <div class="color-block-layer bg"></div>
    </div>
    <color-panel v-show="show" v-model="color" :style="panelStyle" :mode="mode" @change="change"></color-panel>
  </div>

</template>

<script>

export default {
  data () {
    return {
      show: false,
      color: this.value
    }
  },
  computed: {
    panelStyle () {
      let style = {}
      if (typeof this.position === 'string') {
        style.left = '48px'
        if (this.position === 'up') {
          style.bottom = 0
        } else {
          style.top = 0
        }
      } else {
        for (let key in this.position) {
          style[key] = this.position[key]
        }
      }
      return style
    }
  },
  props: {
    value: {
      type: String
    },
    mode: {
      type: String,
      default: 'all'
    },
    position: {
      type: [String, Object],  // up | down
      default: 'down'
    }
  },
  watch: {
    value (newValue) {
      this.color = newValue
    }
  },
  methods: {
    change (color, $instance) {
      this.$emit('change', color)
      this.$emit('input', color)
    },
    toggle () {
      this.show = !this.show
    },
    _includes (el, child) {
      if (el) {
        return el === child || el.contains(child)
      } else {
        return false
      }
    }
  },
  mounted () {
    // mounted
    document.addEventListener('click', event => {
      let isIn = this._includes(this.$refs.colorpicker, event.target)
      if (!isIn) {
        this.show = false
        // this.$emit('afterChange', this.color)
      }
    })
  }
}
</script>
