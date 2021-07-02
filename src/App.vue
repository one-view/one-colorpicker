
<template>
<div id="app">
  <div class="head">
    <div class="title">
      <h1>One-Color-Picker</h1>
      <p>a chrome-style colorpicker</p>
    </div>
    <canvas></canvas>
  </div>
  <div class="form">
      <span :style="{backgroundColor: color, color: '#fff'}">{{ color }} Choose Color Click blocks below</span>
      <!-- <v-colorpanel :value="color" @change="change"></v-colorpanel> -->
      <br>
      <br>
      <br>
      <div class="blocks cf">
        <div class="block">
          <color-picker v-model="color" position="down" @change="change"></color-picker>
        </div>
        <div class="block">
          <color-picker v-model="color2" :position="{left: 0, top: '40px'}" @afterChange="afterChange" @change="change"></color-picker>
        </div>
      </div>
      <br>
      <br>
      <color-panel style="margin: 0 auto;" v-model="color2" mode="hex" @change="change"></color-panel>
  </div>
  <div class="layout">
    <code-snippet :value="html" type="html"></code-snippet>
  </div>
</div>

</template>

<script>

// code presentation
const html = `<color-picker
      v-model="colorA"
      :position="{left: 0, top: '40px'}"
      @change="change"
      @afterChange="afterChange">
      </color-picker>
      
      # Info
      v-model: color value, support rgba & hex
      position: support customize position, [String('up'|'down'), Object] default: 'down'
      change: callback fire when changing
      afterChange: fire after color panel closed
      `

export default {
  name: 'app',
  data () {
    return {
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
    initialDistance = 100, // InitialDistance
    axis,
    random = Math.random,
    deg = 0,
    circle = Math.PI * 2,
    cos = Math.cos

    canvas.width = width * pixelRatio
    canvas.height = height * pixelRatio
    context.scale(pixelRatio, pixelRatio) // Synchronization with devicePixelRatio
    context.globalAlpha = 0.5 // gloabalAlpha set or return the opacity-value of draw

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

      deg -= circle / -50
      context.fillStyle = '#' + (cos(deg) * 127 + 128 << 16 | cos(deg + circle / 3) * 127 + 128 << 8 | cos(deg + circle / 3 * 2) * 127 + 128).toString(16)
      
      context.fill()

      axis[0] = axis[1] // old point -> new q[0]
      axis[1] = {x: nextX, y: nextY} // new point(k, n) -> new q[1]
      // constant line
    }

    function getNewPoint(distance) {
      var target = distance + (random() * 2 - 1.1) * initialDistance
      return (target > height || target < 0) ? getNewPoint(distance) : target
      // y->[-1.1, 0.9)
    }
    paint()
    setInterval(() => {
      paint()
    }, 1000 * 5)
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
    text-align: center;
    color: #2c3e50;
}
.head {
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  position: relative;
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
.form{
  margin: 0 100px;
  span{
    padding: 5px 10px;
  }
  .cf:before,
  .cf:after{
    content: '';
    display: table;
  }
  .cf:after{
    clear: both;
  }
  .block{
    width: 50%;
    float: left;
  }
}
.layout{
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>