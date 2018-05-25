// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import CodeSnippet from 'one-code-snippet'

// import {ColorPicker, ColorPanel} from '../dist/build.js'
import {ColorPicker, ColorPanel} from './color'

import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
window.hljs = hljs

Vue.config.productionTip = false

Vue.use(ColorPanel)
Vue.use(ColorPicker)

Vue.use(CodeSnippet)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
