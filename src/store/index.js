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
  selectedTx: {},
  dateStart: null,
  dateEnd: null,
  detailInventory: {},
  detailOutlet: {
    receipt: {
      outlet_name: null,
      phone_number: null,
      address: null,
      website: null,
      ig: null,
      fb: null,
      twitter: null,
      notes: null
    }
  },
  endingStock: 0,
  tableTx: null,
  customerTx: null,
  paymentTx: null,
  
  // Data model
  account: {
    id: 'outlet-W1614393018859'
  },
  listProduct: [],
  listCategory: [],
  listIngredient: [],
  listRecipe: [],
  listInventory: [],
  listTransaction: [],
  listCustomer: [],
  listOutlet: [],
  listEmployee: [],
  listTable: [],
  listSupplier: [],
  listOrder: [],
  listReceive: [],
  listAdjustment: []
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
  plugins: [idbPlugin]
})
