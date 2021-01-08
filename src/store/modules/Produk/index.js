import actions from './actions'
import mutations from './mutations'

const state = {
  loading: false,
  listCategory: []
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
