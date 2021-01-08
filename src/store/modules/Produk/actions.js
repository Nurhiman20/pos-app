import { openDB } from 'idb';

const postCategory = ({}, form) => {
  const vuePos = await openDB('vue-pos', 1);
  return new Promise((resolve, reject) => {
    vuePos
      .add('category', form, 'name')
      .then(result => {
        console.log('success', result);
        resolve(result);
      })
      .catch(error => {
        console.log('error');
        reject(error);
      })
      .finally(() => {
      });
  });
};

export default {
  postCategory
}
