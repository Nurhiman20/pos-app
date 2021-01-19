import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import { idbPlugin } from './plugins';

Vue.use(Vuex);

const state = {
  // UI
  loading: false,
  selectedProduct: [],
  filterCategory: {
    id: 'all',
    name: 'all'
  },
  
  // Data model
  listProduct: [],
  listCategory: [],
  listInventory: []
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
  plugins: [idbPlugin]
})
