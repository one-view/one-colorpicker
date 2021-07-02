
<template>
<div id="app">
  <div class="head">
    <div class="title">
      <h1>One-Colorpicker</h1>
      <p>A Chrome-style Colorpicker</p>
    </div>
    <canvas></canvas>
  </div>
  <div class="layout">
    <div class="page">
      <div class="left">
        <!-- <span :style="{backgroundColor: color, color: '#fff'}">{{ color }} Choose Color Click blocks below</span> -->
        <h3>A: 颜色选择组件</h3>
        <color-picker v-model="color" :position="{left: '20px', top: '40px'}" @change="change"></color-picker>
        <span :style="{backgroundColor: color, color: '#fff'}">{{ color }} Choosed Color</span>
        <h3>B: 颜色选择面板</h3>
        <color-panel style="margin: 0 auto;" v-model="color2" mode="hex" @change="change"></color-panel>
      </div>
    </div>
  </div>
  <div class="layout white">
    <div class="page">
      <h3>安装</h3>
      <p>
        <code-snippet value="> npm install one-colorpicker --save"></code-snippet>
      </p>
      <h3>示例</h3>
      <code-snippet :value="html" type="html"></code-snippet>
    </div>
  </div>
</div>

</template>

<script>

// code presentation
const html = `<color-picker v-model="colorA" :position="{left: 0, top: '40px'}"
      @change="change" @afterChange="afterChange">
    </color-picker>

    # Info
    v-model: color value, support rgba & hex
    position: support customize position, [String('up'|'down'), Object] default: 'down'
    change: callback fire when changing
    afterChange: fire after color panel closed`

export default {
  data () {
    return {
      text: {
        cn: {
          install: '安装',
          demo: '示例'
        },
        en: {
          install: 'install',
          demo: 'demo'
        },
      },
      html,
      color: '#05f',
      color2: '#50f'
    }
  },
  methods: {
    change (val) {
      console.log('change', val)
    },
    afterChange(val) {
      console.log('afterChange', val)
    }
  },
  mounted () {
    var canvas = document.getElementsByTagName('canvas')[0],
    context = canvas.getContext('2d'),
    pixelRatio = window.devicePixelRatio || 1,
    width = window.innerWidth,
    height = window.innerHeight,
    initialDistance = 80, // InitialDistance
    axis,
    random = Math.random,
    deg = 0,
    circle = Math.PI * 2,
    cos = Math.cos

    canvas.width = width * pixelRatio
    canvas.height = height * pixelRatio
    context.scale(pixelRatio, pixelRatio) // Synchronization with devicePixelRatio
    context.globalAlpha = 0.6 // gloabalAlpha set or return the opacity-value of draw

    function paint() {
      context.clearRect(0, 0, width, height) // clear all rect
      axis = [
        { x: 0, y: height * .7 + initialDistance},
        {x: 0, y: height * .7 - initialDistance}
      ]
      while(axis[1].x < width + initialDistance) {
        draw(axis[0], axis[1]); // width + initialDistance
      }
    }

    function draw(i ,j) {
      context.beginPath()
      context.moveTo(i.x, i.y)
      context.lineTo(j.x, j.y)

      var nextX = j.x + (random() * 2 - 0.25) * initialDistance,
          nextY = getNewPoint(j.y)
      context.lineTo(nextX, nextY)
      context.closePath()

      deg -= circle / -15
      context.fillStyle = '#' + (cos(deg) * 127 + 128 << 16 | cos(deg + circle / 3) * 127 + 128 << 8 | cos(deg + circle / 3 * 2) * 127 + 128).toString(16)
      
      context.fill()

      axis[0] = axis[1] // old point -> new q[0]
      axis[1] = {x: nextX, y: nextY} // new point(k, n) -> new q[1]
      // constant line
    }

    function getNewPoint(distance) {
      var target = distance + (random() * 2 - 1.3) * initialDistance
      return (target > height || target < 0) ? getNewPoint(distance) : target
      // y->[-1.1, 0.9)
    }
    paint()
    // setInterval(() => {
    //   paint()
    // }, 1000 * 5)
  }
}
</script>
<style lang="less">
body {
  background-color: #f8f8f8;
  margin: 0;
}
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}
.head {
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  position: relative;
  text-align: center;
  .title {
    z-index: 1;
  }
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
}

.layout{
  height: 100vh;
  // max-height: 800px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.white {
  background-color: #fff;
}
</style>