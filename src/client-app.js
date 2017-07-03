import 'bootstrap'

import Vue from 'vue'
// import store from './store'
import Chatter from './Chatter.vue'

new Vue({
  el: '#app',
  // store,
  render: h => h(Chatter)
})
