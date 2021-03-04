import { openDB } from 'idb';

async function getProduct() {
  // commit("SET_LOADING");
  // const vuePos = await openDB('vue-pos', 3);
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
  const vuePos = await openDB('vue-pos', 3);

  // set inventory data
  let inv = {
    ...dataForm,
    order: 0,
    receive: 0,
    usage: 0,
    transfer: 0,
    adjustment: 0,
    ending_stock: 0
  };

  // submit product to collection product and inventory
  let transaction = await vuePos.transaction(['product', 'inventory'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('product').put(dataForm);
    if (dataForm.without_ingredient === true) {
      transaction.objectStore('inventory').put(inv);
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

async function updateProduct({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);

  // search product in collection recipe
  let tx = vuePos.transaction('recipe').store;
  let cursor = await tx.openCursor();
  let productRecipe = { id: null, product: null };
  const loopCursor = true;
  while (loopCursor) {
    if (cursor.value.id_product === dataForm.id) {
      productRecipe = cursor.value;
    }
    cursor = await cursor.continue();
    if (!cursor) break;
  }

  // search product in collection inventory
  let inventory = vuePos.transaction('inventory').store;
  let cursor2 = await inventory.openCursor();
  let inv = { id: null };
  const loopCursor2 = true;
  while (loopCursor2) {
    if (cursor2.value.id === dataForm.id) {
      inv = cursor2.value;
    }
    cursor2 = await cursor2.continue();
    if (!cursor2) break;
  }

  // set updated data
  let updatedProductRecipe = {
    ...productRecipe,
    product: dataForm
  }
  let updatedInv = {
    ...inv,
    name: dataForm.name,
    category: dataForm.category,
    price: dataForm.price,
    stock: dataForm.stock,
    unit: dataForm.unit,
    description: dataForm.description,
    without_ingredient: dataForm.without_ingredient,
    price_cost: dataForm.price_cost,
    variant: dataForm.variant,
    image: dataForm.image
  };

  // set inventory data
  let invData = {
    ...dataForm,
    order: 0,
    orders: [],
    receive: 0,
    usage: 0,
    transfer: 0,
    adjustment: 0,
    ending_stock: 0
  };
  
  // update product in collection product and recipe
  let transaction = await vuePos.transaction(['product', 'recipe', 'inventory'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('product').put(dataForm);
    if (updatedProductRecipe.id !== null) {
      transaction.objectStore('recipe').put(updatedProductRecipe);
    }
    if (updatedInv.id !== null && dataForm.without_ingredient === true) {
      transaction.objectStore('inventory').put(updatedInv);
    } else if (updatedInv.id !== null && dataForm.without_ingredient === false) {
      transaction.objectStore('inventory').delete(dataForm.id);
    } else if (updatedInv.id === null && dataForm.without_ingredient === true) {
      transaction.objectStore('inventory').put(invData);
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
  const vuePos = await openDB('vue-pos', 3);

  // search product in collection recipe
  let tx = vuePos.transaction('recipe').store;
  let cursor = await tx.openCursor();
  let productRecipe = { id: null, product: null };
  const loopCursor = true;
  while (loopCursor) {
    if (cursor.value.id_product === dataForm.id) {
      productRecipe = cursor.value;
    }
    cursor = await cursor.continue();
    if (!cursor) break;
  }

  // search product in collection inventory
  let inventory = vuePos.transaction('inventory').store;
  let cursor2 = await inventory.openCursor();
  let inv = { id: null };
  const loopCursor2 = true;
  while (loopCursor2) {
    if (cursor2.value.id === dataForm.id) {
      inv = cursor2.value;
    }
    cursor2 = await cursor2.continue();
    if (!cursor2) break;
  }

  // delete product in collection product and inventory
  let transaction = await vuePos.transaction(['product', 'recipe', 'inventory'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('product').delete(dataForm.id);
    if (productRecipe.id !== null) {   
      transaction.objectStore('recipe').delete(productRecipe.id);
    }
    if (inv.id !== null) {   
      transaction.objectStore('inventory').delete(dataForm.id);
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
  const vuePos = await openDB('vue-pos', 3);
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
  const vuePos = await openDB('vue-pos', 3);
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
  const vuePos = await openDB('vue-pos', 3);
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
  const vuePos = await openDB('vue-pos', 3);
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
  const vuePos = await openDB('vue-pos', 3);

  // set inventory data
  let inv = {
    ...dataForm,
    order: 0,
    orders: [],
    receive: 0,
    usage: 0,
    transfer: 0,
    adjustment: 0,
    ending_stock: 0
  };

  // submit ingredient to collection ingredient and inventory
  let transaction = await vuePos.transaction(['ingredient', 'inventory'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('ingredient').put(dataForm);
    transaction.objectStore('inventory').put(inv);
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

async function updateIngredient({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);
  
  // search product in table inventory
  let tx = vuePos.transaction('inventory').store;
  let cursor = await tx.openCursor();
  let inv = { id: null };
  const loopCursor = true;
  while (loopCursor) {
    if (cursor.value.id === dataForm.id) {
      inv = cursor.value;
    }
    cursor = await cursor.continue();
    if (!cursor) break;
  }

  // set updated data
  let updatedInv = {
    ...inv,
    name: dataForm.name,
    category: dataForm.category,
    price: dataForm.price,
    stock: dataForm.stock,
    unit: dataForm.unit
  };

  // update ingredient in collection inventory and ingredient
  let transaction = await vuePos.transaction(['ingredient', 'inventory'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('ingredient').put(dataForm);
    if (inv.id !== null) {
      transaction.objectStore('inventory').put(updatedInv);
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

async function deleteIngredient({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);

  // delete ingredient in collection ingredient and inventory
  let transaction = await vuePos.transaction(['ingredient', 'inventory'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('ingredient').delete(dataForm.id);
    transaction.objectStore('inventory').delete(dataForm.id);
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

async function getRecipe({ commit }) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);
  return new Promise((resolve, reject) => {
    vuePos
      .getAll('recipe')
      .then(result => {
        commit('SET_LIST_RECIPE', result);
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

async function submitRecipe({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);

  // search product in collection product
  let tx = vuePos.transaction('product').store;
  let cursor = await tx.openCursor();
  let product = { id: null, ingredients: null };
  const loopCursor = true;
  while (loopCursor) {
    if (cursor.value.id === dataForm.id_product) {
      product = cursor.value;
    }
    cursor = await cursor.continue();
    if (!cursor) break;
  }

  // set product data
  let prod = {
    ...product,
    ingredients: dataForm.ingredients
  }

  // submit recipe to collection product and recipe
  let transaction = await vuePos.transaction(['recipe', 'product'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('recipe').put(dataForm);    
    transaction.objectStore('product').put(prod); 
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

async function deleteRecipe({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);

  // search product in collection product
  let tx = vuePos.transaction('product').store;
  let cursor = await tx.openCursor();
  let product = { id: null, ingredients: null };
  const loopCursor = true;
  while (loopCursor) {
    if (cursor.value.id === dataForm.id_product) {
      product = cursor.value;
    }
    cursor = await cursor.continue();
    if (!cursor) break;
  }

  // set product data
  let prod = {
    ...product,
    ingredients: []
  }

  // delete recipe in collection recipe and update in product
  let transaction = await vuePos.transaction(['recipe', 'product'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('recipe').delete(dataForm.id);    
    transaction.objectStore('product').put(prod); 
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

async function getInventory({ commit }) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);
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
  const vuePos = await openDB('vue-pos', 3);
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
  const vuePos = await openDB('vue-pos', 3);
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
  const vuePos = await openDB('vue-pos', 3);
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
  const vuePos = await openDB('vue-pos', 3);
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

async function getOrder({ commit }) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);
  return new Promise((resolve, reject) => {
    vuePos
      .getAll('order')
      .then(result => {
        commit('SET_LIST_ORDER', result);
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

async function submitOrder({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);

  // search ingredient in inventory collection
  let tx = vuePos.transaction('inventory').store;
  let cursor = await tx.openCursor();
  let inventories = [];
  const loopCursor = true;
  while (loopCursor) {
    dataForm.ingredients.forEach(ing => {
      if (cursor.value.id === ing.ingredient.id) {
        inventories.push(cursor.value);
      }
    });
    cursor = await cursor.continue();
    if (!cursor) break;
  }

  let transaction = await vuePos.transaction(['order', 'inventory'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('order').put(dataForm);
    inventories.forEach(inv => {
      inv.orders.push(dataForm);
      transaction.objectStore('inventory').put(inv);
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

async function deleteOrder({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);
  return new Promise((resolve, reject) => {
    vuePos
      .delete('order', dataForm.id)
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

async function getReceive({ commit }) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);
  return new Promise((resolve, reject) => {
    vuePos
      .getAll('receive')
      .then(result => {
        commit('SET_LIST_RECEIVE', result);
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

async function submitReceive({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);
  return new Promise((resolve, reject) => {
    vuePos
      .put('receive', dataForm)
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

async function deleteReceive({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);
  return new Promise((resolve, reject) => {
    vuePos
      .delete('receive', dataForm.id)
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
  const vuePos = await openDB('vue-pos', 3);
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
  const vuePos = await openDB('vue-pos', 3);
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
  const vuePos = await openDB('vue-pos', 3);
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
  const vuePos = await openDB('vue-pos', 3);
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
  const vuePos = await openDB('vue-pos', 3);

  let transaction = await vuePos.transaction(['transaction'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('transaction').put(dataForm);
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
  const vuePos = await openDB('vue-pos', 3);
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
  const vuePos = await openDB('vue-pos', 3);
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
  const vuePos = await openDB('vue-pos', 3);
  
  // search product in collection transaction
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

  // update customer in collection customer and transaction
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
  const vuePos = await openDB('vue-pos', 3);
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

async function getOutlet({ commit }) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);
  return new Promise((resolve, reject) => {
    vuePos
      .getAll('outlet')
      .then(result => {
        commit('SET_LIST_OUTLET', result);
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

async function submitOutlet({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);
  return new Promise((resolve, reject) => {
    vuePos
      .put('outlet', dataForm)
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

async function deleteOutlet({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);
  return new Promise((resolve, reject) => {
    vuePos
      .delete('outlet', dataForm.id)
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

async function getCashier({ commit }) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);
  return new Promise((resolve, reject) => {
    vuePos
      .getAll('cashier')
      .then(result => {
        commit('SET_LIST_CASHIER', result);
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

async function submitCashier({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);
  return new Promise((resolve, reject) => {
    vuePos
      .put('cashier', dataForm)
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

async function deleteCashier({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);
  return new Promise((resolve, reject) => {
    vuePos
      .delete('cashier', dataForm.id)
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
  const vuePos = await openDB('vue-pos', 3);
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
  const vuePos = await openDB('vue-pos', 3);
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
  const vuePos = await openDB('vue-pos', 3);
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

async function updateReceipt({ commit, state }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);

  // search outlet in collection outlet
  let tx = vuePos.transaction('outlet').store;
  let cursor = await tx.openCursor();
  let outlet = { id: null };
  const loopCursor = true;
  while (loopCursor) {
    if (cursor.value.id === state.account.id) {
      outlet = cursor.value;
    }
    cursor = await cursor.continue();
    if (!cursor) break;
  }

  let updatedOutlet = {
    ...outlet,
    receipt: dataForm
  }

  return new Promise((resolve, reject) => {
    vuePos
      .put('outlet', updatedOutlet)
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
  updateIngredient,
  deleteIngredient,
  getRecipe,
  submitRecipe,
  deleteRecipe,
  getInventory,
  submitInventory,
  getSupplier,
  submitSupplier,
  getOrder,
  submitOrder,
  deleteOrder,
  getReceive,
  submitReceive,
  deleteReceive,
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
  getOutlet,
  submitOutlet,
  deleteOutlet,
  getCashier,
  submitCashier,
  deleteCashier,
  getTable,
  submitTable,
  deleteTable,
  updateReceipt
}
