<style lang="scss">

#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
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
  width: 960px;
  margin: auto;
}
</style>

<template>

<div id="app">
    <br><br><br>
    <h1>One-Color-Picker</h1>
    <p>a chrome-style colorpicker</p>
    <br><br><br>
    <br><br><br>
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
    <br><br><br>
    <div class="layout">
      <code-snippet :value="html" type="html"></code-snippet>
    </div>
    <br><br><br>
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
    setTimeout(() => {
      this.color = 'rgba(233, 30, 99, 1)'
      this.color2 = 'transparent'
    }, 1000)
  }
}
</script>
