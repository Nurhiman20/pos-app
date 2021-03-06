const SET_LOADING = (state, payload = true) => {
  state.loading = payload;
};

const SET_LIST_PRODUCT = (state, payload) => {
  state.listProduct = payload;
};

const SET_LIST_CATEGORY = (state, payload) => {
  state.listCategory = payload;
};

const SET_LIST_INGREDIENT = (state, payload) => {
  state.listIngredient = payload;
};

const SET_LIST_RECIPE = (state, payload) => {
  state.listRecipe = payload;
};

const SET_LIST_INVENTORY = (state, payload) => {
  state.listInventory = payload;
};

const SET_DETAIL_INVENTORY = (state, payload) => {
  state.detailInventory = payload;
};

const SET_LIST_SUPPLIER = (state, payload) => {
  state.listSupplier = payload;
};

const SET_LIST_ORDER = (state, payload) => {
  state.listOrder = payload;
}

const SET_LIST_RECEIVE = (state, payload) => {
  state.listReceive = payload;
}

const SET_LIST_TRANSFER = (state, payload) => {
  state.listTransfer = payload;
}

const SET_LIST_ADJUSTMENT = (state, payload) => {
  state.listAdjustment = payload;
};

const SET_LIST_TRANSACTION = (state, payload) => {
  state.listTransaction = payload;
};

const SET_LIST_CUSTOMER = (state, payload) => {
  state.listCustomer = payload;
};

const SET_DETAIL_CUSTOMER = (state, payload) => {
  state.detailCustomer = payload;
};

const SET_LIST_OUTLET = (state, payload) => {
  state.listOutlet = payload;
  
  payload.forEach(outlet => {
    if (outlet.status_account === true) {
      state.account = outlet;
    }
  });
};

const SET_DETAIL_OUTLET = (state, payload) => {
  state.detailOutlet = payload;
};

const SET_ACCOUNT = (state, payload) => {
  state.account = payload;
};

const SET_LIST_EMPLOYEE = (state, payload) => {
  state.listEmployee = payload;
};

const SET_LIST_TABLE = (state, payload) => {
  state.listTable = payload;
};

const SET_FILTER_CATEGORY = (state, payload) => {
  state.filterCategory = payload;
};

const ADD_SELECTED_PRODUCT = (state, payload) => {
  const found = state.selectedProduct.some(el => el.name === payload.name);
  if (!found) {
    state.selectedProduct.push(payload);
  } else {
    alert('Produk sudah ditambahkan')
  }
};

const SET_SELECTED_PRODUCT = (state, payload) => {
  state.selectedProduct = payload;
}

const SET_CUSTOMER_TX = (state, payload) => {
  state.customerTx = payload
};

const SET_TABLE_TX = (state, payload) => {
  state.tableTx = payload
};

const SET_PAYMENT_TX = (state, payload) => {
  state.paymentTx = payload
};

const REMOVE_SELECTED_PRODUCT = (state, payload) => {
  let indexProduct = state.selectedProduct.indexOf(payload);
  state.selectedProduct.splice(indexProduct, 1);
};

const EDIT_SELECTED_PRODUCT = (state, payload) => {
  let indexProduct = state.selectedProduct.indexOf(payload);
  state.selectedProduct.splice(indexProduct, 1, payload);
};

const SET_EDIT_TX = (state, payload) => {
  if (payload === null) {
    state.selectedTx = {};
    state.selectedProduct = [];
  } else {
    state.selectedTx = payload;
    if (payload.products_sold !== undefined) {
      state.selectedProduct = payload.products_sold;
    }
  }
};

const SET_DATA_RECEIPT = (state, payload) => {
  state.dataReceipt = payload;
}

const SET_DATE_START = (state, payload) => {
  state.dateStart = payload;
};

const SET_DATE_END = (state, payload) => {
  state.dateEnd = payload;
};

const SET_ENDING_STOCK = (state, payload) => {
  state.endingStock = payload;
};

export default {
  SET_LOADING,
  SET_LIST_PRODUCT,
  SET_LIST_CATEGORY,
  SET_LIST_INGREDIENT,
  SET_LIST_RECIPE,
  SET_LIST_INVENTORY,
  SET_DETAIL_INVENTORY,
  SET_LIST_SUPPLIER,
  SET_LIST_ORDER,
  SET_LIST_RECEIVE,
  SET_LIST_TRANSFER,
  SET_LIST_ADJUSTMENT,
  SET_LIST_TRANSACTION,
  SET_LIST_CUSTOMER,
  SET_DETAIL_CUSTOMER,
  SET_LIST_OUTLET,
  SET_DETAIL_OUTLET,
  SET_ACCOUNT,
  SET_LIST_EMPLOYEE,
  SET_LIST_TABLE,
  SET_FILTER_CATEGORY,
  ADD_SELECTED_PRODUCT,
  SET_SELECTED_PRODUCT,
  SET_CUSTOMER_TX,
  SET_TABLE_TX,
  SET_PAYMENT_TX,
  REMOVE_SELECTED_PRODUCT,
  EDIT_SELECTED_PRODUCT,
  SET_EDIT_TX,
  SET_DATA_RECEIPT,
  SET_DATE_START,
  SET_DATE_END,
  SET_ENDING_STOCK
}
