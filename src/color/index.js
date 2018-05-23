import ColorPicker from './colorPicker/colorpicker'
import ColorPanel from './colorPanel/colorpanel'

ColorPicker.install = Vue => {
  Vue.component('color-picker', ColorPicker)
}

ColorPanel.install = Vue => {
  Vue.component('color-panel', ColorPanel)
}

export {ColorPanel, ColorPicker}
