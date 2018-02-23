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
    <h1>One-Color-Picker</h1>
    <p>of chrome colorpicker style</p>
    <br><br><br><br><br><br>
    <div class="form">
        <span :style="{backgroundColor: color, color: '#fff'}">{{ color }} Choose Color Click blocks below</span>
        <!-- <v-colorpanel :value="color" @change="change"></v-colorpanel> -->
        <br>
        <br>
        <br>
        <div class="blocks cf">
          <div class="block">
            <color-picker v-model="color2" position="down" @change="change"></color-picker>
          </div>
          <div class="block">
            <color-picker v-model="color3" position="up"></color-picker>
          </div>
        </div>
        <br>
        <br>
        <p>{{ color2 }} {{ color3 }}</p>
    </div>
    <color-panel></color-panel>
    <p>CHECK THIS</p><br>
    <code-snippet :value="html" type="html"></code-snippet>
</div>

</template>

<script>

// code presentation
const html = `<color-picker :value="colorA" @change="color => this.colorA = color"></color-picker>`

export default {
  name: 'app',
  data () {
    return {
      html,
      color: '#05f',
      color2: '#50f',
      color3: '#f05',
      show: false,
      show2: false
    }
  },
  methods: {
    change (val) {
      console.log(val)
    }
  },
  mounted () {
    setTimeout(() => {
      // this.color2 = 'rgba(212,13,195,.5)'
      // this.color3 = '#08d'
    }, 3000)
  }
}
</script>
