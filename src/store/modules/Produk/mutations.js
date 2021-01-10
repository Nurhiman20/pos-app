const SET_LOADING = (state, payload = true) => {
  state.loading = payload;
};

const SET_LIST_PRODUCT = (state, payload) => {
  state.listProduct = payload;
};

const SET_LIST_CATEGORY = (state, payload) => {
  state.listCategory = payload;
};

const SET_FILTER_CATEGORY = (state, payload) => {
  state.filterCategory = payload;
};

export default {
  SET_LOADING,
  SET_LIST_PRODUCT,
  SET_LIST_CATEGORY,
  SET_FILTER_CATEGORY
}
