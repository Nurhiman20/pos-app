import actions from './actions';
import mutations from './mutations';
import getters from './getters'

const state = {
  loading: false,
  listProduct: [],
  listCategory: [],
  filterCategory: {
    id: 'all',
    name: 'all'
  },
  selectedProduct: []
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
