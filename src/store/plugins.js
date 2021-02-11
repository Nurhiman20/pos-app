import { openDB } from 'idb';

export const idbPlugin = store => {
  store.subscribeAction((action) => {
    if (action.type === "getProduct") {
      store.commit("SET_LOADING");
      getProduct()
        .then(result => {
          store.commit('SET_LIST_PRODUCT', result);
        })
        .finally(() => {
          store.commit("SET_LOADING", false);
        });
    }
  })
}

async function getProduct() {
  const vuePos = await openDB('vue-pos', 2);
  return new Promise((resolve, reject) => {
    vuePos
      .getAll('product')
      .then(result => {
        // commit('SET_LIST_PRODUCT', result);
        resolve(result);
      })
      .catch(error => {
        reject(error);
      })
  });
}
