const SET_LOADING = (state, payload = true) => {
  state.loading = payload;
};

const SET_LIST_PRODUCT = (state, payload) => {
  state.listProduct = payload;
};

const SET_LIST_CATEGORY = (state, payload) => {
  state.listCategory = payload;
};

const SET_LIST_INVENTORY = (state, payload) => {
  state.listInventory = payload;
};

const SET_LIST_TRANSACTION = (state, payload) => {
  state.listTransaction = payload;
};

const SET_LIST_CUSTOMER = (state, payload) => {
  state.listCustomer = payload;
};

const SET_LIST_TABLE = (state, payload) => {
  state.listTable = payload;
};

const SET_FILTER_CATEGORY = (state, payload) => {
  state.filterCategory = payload;
};

const ADD_SELECTED_PRODUCT = (state, payload) => {
  const found = state.selectedProduct.some(el => el.product.name === payload.product.name);
  if (!found) {
    state.selectedProduct.push(payload);
  } else {
    alert('Produk sudah ditambahkan')
  }
};

const REMOVE_SELECTED_PRODUCT = (state, payload) => {
  let indexProduct = state.selectedProduct.indexOf(payload);
  state.selectedProduct.splice(indexProduct, 1);
};

const CLEAR_SELECTED_PRODUCT = (state, payload) => {
  state.selectedProduct = payload;
};

const EDIT_SELECTED_PRODUCT = (state, payload) => {
  let indexProduct = state.selectedProduct.indexOf(payload);
  state.selectedProduct.splice(indexProduct, 1, payload);
};

export default {
  SET_LOADING,
  SET_LIST_PRODUCT,
  SET_LIST_CATEGORY,
  SET_LIST_INVENTORY,
  SET_LIST_TRANSACTION,
  SET_LIST_CUSTOMER,
  SET_LIST_TABLE,
  SET_FILTER_CATEGORY,
  ADD_SELECTED_PRODUCT,
  REMOVE_SELECTED_PRODUCT,
  CLEAR_SELECTED_PRODUCT,
  EDIT_SELECTED_PRODUCT
}