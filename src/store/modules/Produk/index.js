import actions from './actions'
import mutations from './mutations'

const state = {
  loading: false,
  listProduct: [],
  listCategory: []
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
