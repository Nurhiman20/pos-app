import Vue from 'vue'
import Vuex from 'vuex'

import productModule from './modules/Produk'

Vue.use(Vuex)

export default new Vuex.Store({
  namespaced: true,
  modules: {
    product: productModule
  }
})
