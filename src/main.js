import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store'
import './assets/scss/main.scss'
import './plugins/VeeValidate'
import { SchemaSyncHandler } from './plugins/schemasync.js'
import JsonExcel from "vue-json-excel"
import VueHtmlToPaper from 'vue-html-to-paper'

const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'
  ]
}

Vue.use(VueHtmlToPaper, options);

SchemaSyncHandler.sync();
Vue.component("downloadExcel", JsonExcel);
Vue.config.productionTip = false;

if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().then(function(persistent) {
    if (persistent)
      console.log("Storage will not be cleared except by explicit user action");
    else
      console.log("Storage may be cleared by the UA under storage pressure.");
  });
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
