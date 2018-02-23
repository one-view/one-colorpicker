# one-colorpicker


```
import {ColorPicker, ColorPanel} from '@portal/one-colorpicker'

Vue.use(ColorPanel)
Vue.use(ColorPicker)

## application code

<color-picker :value="colorA" @change="color => this.colorA = color"></color-picker>
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
