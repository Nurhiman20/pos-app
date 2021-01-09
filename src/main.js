import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store'
import './assets/scss/main.scss'
import './plugins/VeeValidate'
import { SchemaSyncHandler } from './plugins/schemasync.js'

SchemaSyncHandler.sync()

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
