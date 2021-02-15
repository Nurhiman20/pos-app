import { openDB } from 'idb';

async function getProduct() {
  // commit("SET_LOADING");
  // const vuePos = await openDB('vue-pos', 2);
  // return new Promise((resolve, reject) => {
  //   vuePos
  //     .getAll('product')
  //     .then(result => {
  //       commit('SET_LIST_PRODUCT', result);
  //       resolve(result);
  //     })
  //     .catch(error => {
  //       reject(error);
  //     })
  //     .finally(() => {
  //       commit("SET_LOADING", false);
  //     });
  // });
}

async function submitProduct({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 2);
  return new Promise((resolve, reject) => {
    vuePos
      .put('product', dataForm)
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        console.log('error');
        reject(error);
      })
      .finally(() => {
        commit("SET_LOADING", false);
      });
  });
}

async function updateProduct({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 2);
  
  // search product in table inventory
  let tx = vuePos.transaction('inventory').store;
  let cursor = await tx.openCursor();
  let productInventory = { id: null, stock: null };
  const loopCursor = true;
  while (loopCursor) {
    if (cursor.value.id_product === dataForm.id) {
      productInventory = cursor.value;
    }
    cursor = await cursor.continue();
    if (!cursor) break;
  }

  // set updated data
  let updatedProductInventory = {
    id: productInventory.id,
    id_product: dataForm.id,
    product: dataForm,
    stock: productInventory.stock
  }

  // update product in table product and inventory
  let transaction = await vuePos.transaction(['product', 'inventory'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('product').put(dataForm);
    if (updatedProductInventory.id !== null) {
      transaction.objectStore('inventory').put(updatedProductInventory);
    }
    transaction.done
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      })
      .finally(() => {
        commit("SET_LOADING", false);
      });
  });
}

async function deleteProduct({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 2);

  // search product in table inventory
  let tx = vuePos.transaction('inventory').store;
  let cursor = await tx.openCursor();
  let productInventory = { id: null, stock: null };
  const loopCursor = true;
  while (loopCursor) {
    if (cursor.value.id_product === dataForm.id) {
      productInventory = cursor.value;
    }
    cursor = await cursor.continue();
    if (!cursor) break;
  }

  // delete product in table product and inventory
  let transaction = await vuePos.transaction(['product', 'inventory'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('product').delete(dataForm.id);
    if (productInventory.id !== null) {   
      transaction.objectStore('inventory').delete(productInventory.id);
    }
    transaction.done
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      })
      .finally(() => {
        commit("SET_LOADING", false);
      });
  });
}

async function getCategory({ commit }) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 2);
  return new Promise((resolve, reject) => {
    vuePos
      .getAll('category')
      .then(result => {
        commit('SET_LIST_CATEGORY', result);
        resolve(result);
      })
      .catch(error => {
        reject(error);
      })
      .finally(() => {
        commit("SET_LOADING", false);
      });
  });
}

async function submitCategory({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 2);
  return new Promise((resolve, reject) => {
    vuePos
      .put('category', dataForm)
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        console.log('error');
        reject(error);
      })
      .finally(() => {
        commit("SET_LOADING", false);
      });
  });
}

async function deleteCategory({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 2);
  return new Promise((resolve, reject) => {
    vuePos
      .delete('category', dataForm.id)
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      })
      .finally(() => {
        commit("SET_LOADING", false);
      });
  });
}

async function getIngredient({ commit }) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 2);
  return new Promise((resolve, reject) => {
    vuePos
      .getAll('ingredient')
      .then(result => {
        commit('SET_LIST_INGREDIENT', result);
        resolve(result);
      })
      .catch(error => {
        reject(error);
      })
      .finally(() => {
        commit("SET_LOADING", false);
      });
  });
}

async function submitIngredient({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 2);
  return new Promise((resolve, reject) => {
    vuePos
      .put('ingredient', dataForm)
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        console.log('error');
        reject(error);
      })
      .finally(() => {
        commit("SET_LOADING", false);
      });
  });
}

async function deleteIngredient({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 2);
  return new Promise((resolve, reject) => {
    vuePos
      .delete('ingredient', dataForm.id)
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      })
      .finally(() => {
        commit("SET_LOADING", false);
      });
  });
}

async function getInventory({ commit }) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 2);
  return new Promise((resolve, reject) => {
    vuePos
      .getAll('inventory')
      .then(result => {
        commit('SET_LIST_INVENTORY', result);
        resolve(result);
      })
      .catch(error => {
        reject(error);
      })
      .finally(() => {
        commit("SET_LOADING", false);
      });
  });
}

async function submitInventory({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 2);
  return new Promise((resolve, reject) => {
    vuePos
      .put('inventory', dataForm)
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        console.log('error');
        reject(error);
      })
      .finally(() => {
        commit("SET_LOADING", false);
      });
  });
}

async function getSupplier({ commit }) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 2);
  return new Promise((resolve, reject) => {
    vuePos
      .getAll('supplier')
      .then(result => {
        commit('SET_LIST_SUPPLIER', result);
        resolve(result);
      })
      .catch(error => {
        reject(error);
      })
      .finally(() => {
        commit("SET_LOADING", false);
      });
  });
}

async function submitSupplier({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 2);
  return new Promise((resolve, reject) => {
    vuePos
      .put('supplier', dataForm)
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        console.log('error');
        reject(error);
      })
      .finally(() => {
        commit("SET_LOADING", false);
      });
  });
}


async function deleteSupplier({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 2);
  return new Promise((resolve, reject) => {
    vuePos
      .delete('supplier', dataForm.id)
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      })
      .finally(() => {
        commit("SET_LOADING", false);
      });
  });
}

async function getAdjustment({ commit }) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 2);
  return new Promise((resolve, reject) => {
    vuePos
      .getAll('adjustment')
      .then(result => {
        commit('SET_LIST_ADJUSTMENT', result);
        resolve(result);
      })
      .catch(error => {
        reject(error);
      })
      .finally(() => {
        commit("SET_LOADING", false);
      });
  });
}

async function submitAdjustment({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 2);
  return new Promise((resolve, reject) => {
    vuePos
      .put('adjustment', dataForm)
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        console.log('error');
        reject(error);
      })
      .finally(() => {
        commit("SET_LOADING", false);
      });
  });
}

async function deleteAdjustment({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 2);
  return new Promise((resolve, reject) => {
    vuePos
      .delete('adjustment', dataForm.id)
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      })
      .finally(() => {
        commit("SET_LOADING", false);
      });
  });
}

async function getTransaction({ commit }) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 2);
  return new Promise((resolve, reject) => {
    vuePos
      .getAll('transaction')
      .then(result => {
        commit('SET_LIST_TRANSACTION', result);
        resolve(result);
      })
      .catch(error => {
        reject(error);
      })
      .finally(() => {
        commit("SET_LOADING", false);
      });
  });
}

async function submitTransaction({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 2);

  let transaction = await vuePos.transaction(['transaction', 'inventory'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('transaction').put(dataForm);
    dataForm.products_sold.forEach(element => {
      delete element.qty;
      delete element.total;
      delete element.discount;
      transaction.objectStore('inventory').put(element);
    }); 
    transaction.done
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      })
      .finally(() => {
        commit("SET_LOADING", false);
      });
  });
}

async function getCustomer({ commit }) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 2);
  return new Promise((resolve, reject) => {
    vuePos
      .getAll('customer')
      .then(result => {
        commit('SET_LIST_CUSTOMER', result);
        resolve(result);
      })
      .catch(error => {
        reject(error);
      })
      .finally(() => {
        commit("SET_LOADING", false);
      });
  });
}

async function submitCustomer({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 2);
  return new Promise((resolve, reject) => {
    vuePos
      .put('customer', dataForm)
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        console.log('error');
        reject(error);
      })
      .finally(() => {
        commit("SET_LOADING", false);
      });
  });
}

async function updateCustomer({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 2);
  
  // search product in table inventory
  let tx = vuePos.transaction('transaction').store;
  let cursor = await tx.openCursor();
  let customerTx = { id: null };
  const loopCursor = true;
  while (loopCursor) {
    if (cursor.value.customer.id === dataForm.id) {
      customerTx = cursor.value;
    }
    cursor = await cursor.continue();
    if (!cursor) break;
  }

  // set updated data
  customerTx.customer = dataForm;

  // update customer in table customer and transaction
  let transaction = await vuePos.transaction(['customer', 'transaction'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('customer').put(dataForm);
    if (customerTx.id !== null) {
      transaction.objectStore('transaction').put(customerTx);
    }
    transaction.done
      .then(result => {
        console.log(result);
        resolve(result);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      })
      .finally(() => {
        commit("SET_LOADING", false);
      });
  });
}

async function deleteCustomer({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 2);
  return new Promise((resolve, reject) => {
    vuePos
      .delete('customer', dataForm.id)
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      })
      .finally(() => {
        commit("SET_LOADING", false);
      });
  });
}

async function getTable({ commit }) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 2);
  return new Promise((resolve, reject) => {
    vuePos
      .getAll('table')
      .then(result => {
        commit('SET_LIST_TABLE', result);
        resolve(result);
      })
      .catch(error => {
        reject(error);
      })
      .finally(() => {
        commit("SET_LOADING", false);
      });
  });
}

async function submitTable({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 2);
  return new Promise((resolve, reject) => {
    vuePos
      .put('table', dataForm)
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      })
      .finally(() => {
        commit("SET_LOADING", false);
      });
  });
}

async function deleteTable({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 2);
  return new Promise((resolve, reject) => {
    vuePos
      .delete('table', dataForm.id)
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      })
      .finally(() => {
        commit("SET_LOADING", false);
      });
  });
}

export default {
  getProduct,
  submitProduct,
  updateProduct,
  deleteProduct,
  getCategory,
  submitCategory,
  deleteCategory,
  getIngredient,
  submitIngredient,
  deleteIngredient,
  getInventory,
  submitInventory,
  getSupplier,
  submitSupplier,
  deleteSupplier,
  getAdjustment,
  submitAdjustment,
  deleteAdjustment,
  getTransaction,
  submitTransaction,
  getCustomer,
  submitCustomer,
  updateCustomer,
  deleteCustomer,
  getTable,
  submitTable,
  deleteTable
}
