# one-colorpicker
A Chrome-style ColorPicker

![img](./ScreenShot.png)

## How to use
```
// import
import {ColorPicker, ColorPanel} from 'one-colorpicker'
Vue.use(ColorPanel)
Vue.use(ColorPicker)

// dom
<color-picker v-model="color" @change="change"></color-picker>
<color-panel v-model="color"></color-panel>
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
