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
            <color-picker v-model="color2" :position="{left: 0, top: '40px'}"></color-picker>
          </div>
        </div>
        <br>
        <br>
        <color-panel style="margin: 0 auto;" v-model="color2"></color-panel>
    </div>
    <code-snippet :value="html" type="html"></code-snippet>
</div>

</template>

<script>

// code presentation
const html = `<color-picker v-model="colorA"></color-picker>`

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
      console.log(val)
    }
  },
  mounted () {
    setTimeout(() => {
      this.color = 'rgba(233, 30, 99, 1)'
      this.color2 = '#2196f3'
    }, 1000)
  }
}
</script>
