const SET_LOADING = (state, payload = true) => {
  state.loading = payload;
};

const SET_LIST_CATEGORY = (state, payload) => {
  state.listCategory = payload;
};

export default {
  SET_LOADING,
  SET_LIST_CATEGORY
}
