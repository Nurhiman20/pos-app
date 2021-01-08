import { openDB } from 'idb';

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
    vuePos.close();
  });
}

async function postCategory({ commit }, dataForm) {
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
    vuePos.close();
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
    vuePos.close();
  });
}

export default {
  getCategory,
  postCategory,
  deleteCategory
}
