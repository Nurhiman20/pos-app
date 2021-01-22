import { openDB } from 'idb';

async function getProduct() {
  // commit("SET_LOADING");
  // const vuePos = await openDB('vue-pos', 1);
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
  const vuePos = await openDB('vue-pos', 1);
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
  const vuePos = await openDB('vue-pos', 1);
  
  // search product in table inventory
  let tx = vuePos.transaction('inventory').store;
  let cursor = await tx.openCursor();
  let productInventory = {};
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
    transaction.objectStore('inventory').put(updatedProductInventory);
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
  const vuePos = await openDB('vue-pos', 1);

  // search product in table inventory
  let tx = vuePos.transaction('inventory').store;
  let cursor = await tx.openCursor();
  let productInventory = {};
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
    transaction.objectStore('inventory').delete(productInventory.id);
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
  const vuePos = await openDB('vue-pos', 1);
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
  const vuePos = await openDB('vue-pos', 1);
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
  const vuePos = await openDB('vue-pos', 1);
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

async function getInventory({ commit }) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 1);
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
  const vuePos = await openDB('vue-pos', 1);
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

async function getTransaction({ commit }) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 1);
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
  console.log(dataForm);
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 1);

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

export default {
  getProduct,
  submitProduct,
  updateProduct,
  deleteProduct,
  getCategory,
  submitCategory,
  deleteCategory,
  getInventory,
  submitInventory,
  getTransaction,
  submitTransaction
}
