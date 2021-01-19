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

async function submitProduct({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 1);
  return new Promise((resolve, reject) => {
    let transaction = vuePos.transaction(['product', 'inventory'], 'readwrite');
    transaction.objectStore('product').put(dataForm);
    transaction.objectStore('inventory').put(dataForm);
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

async function deleteProduct({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 1);
  return new Promise((resolve, reject) => {
    vuePos
      .delete('product', dataForm.id)
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

export default {
  getProduct,
  getCategory,
  getInventory,
  submitProduct,
  submitCategory,
  submitInventory,
  deleteProduct,
  deleteCategory
}
