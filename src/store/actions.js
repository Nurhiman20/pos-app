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

async function submitProduct({ state, commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);

  // set inventory data
  let inv = {
    ...dataForm,
    order: 0,
    receive: 0,
    usage: 0,
    transfer_in: 0,
    transfer_out: 0,
    adjustment: 0,
    ending_stock: 0,
    tx: []
  };

  // submit product to collection product and inventory
  let transaction = await vuePos.transaction(['product', 'inventory'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('product').put(dataForm);
    if (dataForm.without_ingredient === true) {
      let firstTx = {
        id: 'first-000000',
        type: 'Stok Awal',
        id_outlet: state.account.id,
        time: dataForm.time,
        qty: dataForm.stock,
        unit: dataForm.unit,
        unit_cost: dataForm.price_cost,
        price: dataForm.price
      }
      inv.tx.push(firstTx);
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

async function updateProduct({ state, commit }, dataForm) {
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
  updatedInv.tx.forEach(tx => {
    if (tx.id === 'first-000000') {
      tx.qty = dataForm.stock;
      tx.unit = dataForm.unit;
      tx.unit_cost = dataForm.price_cost;
      tx.price = dataForm.price;
    }
  });

  // set inventory data
  let invData = {
    ...dataForm,
    order: 0,
    receive: 0,
    usage: 0,
    transfer_in: 0,
    transfer_out: 0,
    adjustment: 0,
    ending_stock: 0,
    tx: [
      {
        id: 'first-000000',
        type: 'Stok Awal',
        id_outlet: state.account.id,
        time: dataForm.time,
        qty: dataForm.stock,
        unit: dataForm.unit,
        unit_cost: dataForm.price_cost,
        price: dataForm.price
      }
    ]
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
  let productRecipe = [];
  const loopCursor = true;
  while (loopCursor) {
    if (cursor.value.id_product === dataForm.id) {
      productRecipe.push(cursor.value);
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
    if (productRecipe.length !== 0) {
      productRecipe.forEach(recipe => {
        transaction.objectStore('recipe').delete(recipe.id);
      });
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

async function submitIngredient({ state, commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);

  // set inventory data
  let inv = {
    ...dataForm,
    order: 0,
    receive: 0,
    usage: 0,
    transfer_in: 0,
    transfer_out: 0,
    adjustment: 0,
    ending_stock: 0,
    tx: [
      {
        id: 'first-000000',
        type: 'Stok Awal',
        id_outlet: state.account.id,
        time: dataForm.time,
        qty: dataForm.stock,
        unit: dataForm.unit,
        unit_cost: dataForm.price
      }
    ]
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

  updatedInv.tx.forEach(tx => {
    if (tx.id === 'first-000000') {
      tx.qty = dataForm.stock;
      tx.unit = dataForm.unit;      
      tx.unit_cost = dataForm.price;
    }
  });

  // update ingredient in collection inventory and ingredient
  let transaction = await vuePos.transaction(['ingredient', 'inventory'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('ingredient').put(dataForm);
    if (inv.id !== null) {
      transaction.objectStore('inventory').put(updatedInv);
    }
    transaction.done
      .then(result => {
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
    ...product
  }

  if (dataForm.variant === null) {
    prod.ingredients = dataForm.ingredients;
    prod.price = dataForm.price;
  } else {
    let variant = {
      id: dataForm.id,
      name: dataForm.variant,
      price: dataForm.price,
      ingredients: dataForm.ingredients
    }

    prod.variant.push(variant);
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

async function updateRecipe({ commit }, dataForm) {
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
    ...product
  }

  if (dataForm.variant === null) {
    prod.ingredients = dataForm.ingredients;
    prod.price = dataForm.price;
  } else {
    let updatedVariant = {
      id: dataForm.id,
      name: dataForm.variant,
      price: dataForm.price,
      ingredients: dataForm.ingredients
    }
    
    let indexVariant = null;
    prod.variant.forEach((variant, index) => {
      if (variant.id === updatedVariant.id) {
        indexVariant = index;
      }
    });

    prod.variant[indexVariant] = updatedVariant;
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
    ...product
  }

  if (dataForm.variant === null) {
    prod.ingredients = []
  } else {
    let indexDelete = null;
    prod.variant.forEach((variant, indexVariant) => {
      if (variant.id === dataForm.id) {
        indexDelete = indexVariant;
      }
    });
    prod.variant.splice(indexDelete, 1);
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

async function getInventoryById({ getters, commit }, id) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);
  return new Promise((resolve, reject) => {
    vuePos
      .getAll('inventory')
      .then(result => {
        commit('SET_LIST_INVENTORY', result);
        getters.listViewInventory.forEach(inv => {
          if (inv.id === id) {
            commit('SET_DETAIL_INVENTORY', inv);
            commit('SET_ENDING_STOCK', inv.ending_stock);
          }
        });
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
        cursor.value.tx.push({
          id: dataForm.id,
          type: 'Pemesanan',
          id_ingredient: ing.id_ingredient,
          id_outlet: dataForm.id_outlet,
          time: dataForm.time,
          supplier: dataForm.supplier,
          notes: dataForm.notes,
          qty: ing.order,
          unit_cost: ing.unit_cost
        })
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
      transaction.objectStore('inventory').put(inv);
    })
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

async function updateOrder({ commit }, dataForm) {
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

  inventories.forEach(inventory => {
    dataForm.ingredients.forEach((ingredient, indexIngredient) => {
      inventory.tx.forEach((element, indexTx) => {
        if (element.id === dataForm.id && element.id_ingredient === ingredient.id_ingredient && ingredient.order != 0) {
          element.supplier = dataForm.supplier;
          element.notes = dataForm.notes;
          element.qty = ingredient.order;
          element.unit_cost = ingredient.unit_cost;
        } else if (element.id === dataForm.id && element.id_ingredient === ingredient.id_ingredient && ingredient.order == 0) {
          inventory.tx.splice(indexTx, 1);
          dataForm.ingredients.splice(indexIngredient, 1);
        }
      });
    });
  });

  let transaction = await vuePos.transaction(['order', 'inventory'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('order').put(dataForm);
    inventories.forEach(inv => {
      transaction.objectStore('inventory').put(inv);
    })
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

  inventories.forEach(inventory => {
    dataForm.ingredients.forEach(ingredient => {
      inventory.tx.forEach((element, indexTx) => {
        if (element.id === dataForm.id && element.id_ingredient === ingredient.id_ingredient) {
          inventory.tx.splice(indexTx, 1);
        }
      });
    });
  });

  let transaction = await vuePos.transaction(['order', 'inventory'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('order').delete(dataForm.id);
    inventories.forEach(inv => { 
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

async function submitReceive({ state, commit }, dataForm) {
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
        cursor.value.tx.push({
          id: dataForm.id,
          type: 'Penerimaan',
          id_ingredient: ing.id_ingredient,
          id_outlet: dataForm.id_outlet,
          id_order: dataForm.id_order,
          order: dataForm.order,
          time: dataForm.time,
          status: dataForm.status,
          notes: dataForm.notes,
          qty: ing.received,
          unit_cost: ing.unit_cost
        })
        inventories.push(cursor.value);
      }
    });
    cursor = await cursor.continue();
    if (!cursor) break;
  }

  let orders = { id: null };
  state.listOrder.forEach(order => {
    if (order.id === dataForm.id_order) {
      orders = order;
      orders.receive.push(dataForm);
    }
  });

  let transaction = await vuePos.transaction(['receive', 'inventory', 'order'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('receive').put(dataForm);
    transaction.objectStore('order').put(orders);
    inventories.forEach(inventory => {
      transaction.objectStore('inventory').put(inventory);
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

async function updateReceive({ state, commit }, dataForm) {
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

  inventories.forEach(inventory => {
    dataForm.ingredients.forEach(ingredient => {
      inventory.tx.forEach(element => {
        if (element.id === dataForm.id && element.id_ingredient === ingredient.id_ingredient) {
          element.id_order = dataForm.order.id;
          element.order = dataForm.order;
          element.status = dataForm.status;
          element.notes = dataForm.notes;
          element.qty = ingredient.received;
          element.unit_cost = ingredient.unit_cost;
        }
      });
    });
  });

  let orders = { id: null };
  state.listOrder.forEach(order => {
    if (order.id === dataForm.id_order) {
      orders = order;
    }
  });
  orders.receive.forEach(rv => {
    if (rv.id === dataForm.id) {
      rv.ingredients = dataForm.ingredients;
      rv.status = dataForm.status;
      rv.notes = dataForm.notes;
    }
  });

  let transaction = await vuePos.transaction(['receive', 'inventory', 'order'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('receive').put(dataForm);
    transaction.objectStore('order').put(orders);
    inventories.forEach(inventory => {
      transaction.objectStore('inventory').put(inventory);
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

async function deleteReceive({ state, commit }, dataForm) {
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

  inventories.forEach(inventory => {
    dataForm.ingredients.forEach(ingredient => {
      inventory.tx.forEach((element, indexTx) => {
        if (element.id === dataForm.id && element.id_ingredient === ingredient.id_ingredient) {
          inventory.tx.splice(indexTx, 1);
        }
      });
    });
  });

  let orders = { id: null };
  state.listOrder.forEach(order => {
    if (order.id === dataForm.id_order) {
      orders = order;
    }
  });
  let indexReceive = null;
  orders.receive.forEach((rv, indexRv) => {
    if (rv.id === dataForm.id) {
      indexReceive = indexRv;
    }
  });
  orders.receive.splice(indexReceive, 1);

  let transaction = await vuePos.transaction(['receive', 'inventory', 'order'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('receive').delete(dataForm.id);
    transaction.objectStore('order').put(orders);
    inventories.forEach(inventory => {
      transaction.objectStore('inventory').put(inventory);
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

async function getTransfer({ commit }) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);
  return new Promise((resolve, reject) => {
    vuePos
      .getAll('transfer')
      .then(result => {
        commit('SET_LIST_TRANSFER', result);
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

async function submitTransfer({ commit }, dataForm) {
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
        cursor.value.tx.push({
          id: dataForm.id,
          type: 'Pesanan transfer',
          id_ingredient: ing.id_ingredient,
          id_outlet: dataForm.id_outlet,
          time: dataForm.time,
          destination_outlet: dataForm.destination_outlet,
          qty: ing.qty
        })
        inventories.push(cursor.value);
      }
    });
    cursor = await cursor.continue();
    if (!cursor) break;
  }

  let transaction = await vuePos.transaction(['transfer', 'inventory'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('transfer').put(dataForm);
    inventories.forEach(inv => {
      transaction.objectStore('inventory').put(inv);
    })
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

async function updateTransfer({ commit }, dataForm) {
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

  inventories.forEach(inventory => {
    dataForm.ingredients.forEach((ingredient, indexIngredient) => {
      inventory.tx.forEach((element, indexTx) => {
        if (element.id === dataForm.id && element.id_ingredient === ingredient.id_ingredient && ingredient.qty != 0) {
          element.destination_outlet = dataForm.destination_outlet;
          element.qty = ingredient.qty;
        } else if (element.id === dataForm.id && element.id_ingredient === ingredient.id_ingredient && ingredient.qty == 0) {
          inventory.tx.splice(indexTx, 1);
          dataForm.ingredients.splice(indexIngredient, 1);
        }
      });
    });
  });

  let transaction = await vuePos.transaction(['transfer', 'inventory'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('transfer').put(dataForm);
    inventories.forEach(inv => {
      transaction.objectStore('inventory').put(inv);
    })
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

async function deleteTransfer({ commit }, dataForm) {
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

  inventories.forEach(inventory => {
    dataForm.ingredients.forEach(ingredient => {
      inventory.tx.forEach((element, indexTx) => {
        if (element.id === dataForm.id && element.id_ingredient === ingredient.id_ingredient) {
          inventory.tx.splice(indexTx, 1);
        }
      });
    });
  });

  let transaction = await vuePos.transaction(['transfer', 'inventory'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('transfer').delete(dataForm.id);
    inventories.forEach(inv => { 
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

async function submitDeliveryTransfer({ state, commit }, dataForm) {
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
        cursor.value.tx.push({
          id: dataForm.id,
          type: 'Pengiriman transfer',
          id_ingredient: ing.id_ingredient,
          id_outlet: dataForm.id_outlet,
          id_order: dataForm.id_order,
          order: dataForm.order,
          time: dataForm.time,
          status: dataForm.delivery_status,
          qty: ing.delivered
        })
        inventories.push(cursor.value);
      }
    });
    cursor = await cursor.continue();
    if (!cursor) break;
  }

  let orders = { id: null };
  state.listTransfer.forEach(tf => {
    if (tf.id === dataForm.id_order) {
      orders = tf;
      orders.delivery.push(dataForm);
    }
  });

  let transaction = await vuePos.transaction(['transfer', 'inventory'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('transfer').put(dataForm);
    transaction.objectStore('transfer').put(orders);
    inventories.forEach(inventory => {
      transaction.objectStore('inventory').put(inventory);
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

async function updateDeliveryTransfer({ state, commit }, dataForm) {
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

  inventories.forEach(inventory => {
    dataForm.ingredients.forEach(ingredient => {
      inventory.tx.forEach(element => {
        if (element.id === dataForm.id && element.id_ingredient === ingredient.id_ingredient) {
          element.id_order = dataForm.order.id;
          element.order = dataForm.order;
          element.status = dataForm.delivery_status;
          element.qty = ingredient.delivered;
        }
      });
    });
  });

  let orders = { id: null };
  state.listTransfer.forEach(order => {
    if (order.id === dataForm.id_order) {
      orders = order;
    }
  });
  orders.delivery.forEach(dv => {
    if (dv.id === dataForm.id) {
      dv.ingredients = dataForm.ingredients;
      dv.delivery_status = dataForm.delivery_status;
    }
  });

  let transaction = await vuePos.transaction(['transfer', 'inventory'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('transfer').put(dataForm);
    transaction.objectStore('transfer').put(orders);
    inventories.forEach(inventory => {
      transaction.objectStore('inventory').put(inventory);
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

async function deleteDeliveryTransfer({ state, commit }, dataForm) {
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

  inventories.forEach(inventory => {
    dataForm.ingredients.forEach(ingredient => {
      inventory.tx.forEach((element, indexTx) => {
        if (element.id === dataForm.id && element.id_ingredient === ingredient.id_ingredient) {
          inventory.tx.splice(indexTx, 1);
        }
      });
    });
  });

  let orders = { id: null };
  state.listTransfer.forEach(order => {
    if (order.id === dataForm.id_order) {
      orders = order;
    }
  });
  let indexDeliv = null;
  orders.delivery.forEach((dv, indexDv) => {
    if (dv.id === dataForm.id) {
      indexDeliv = indexDv;
    }
  });
  orders.delivery.splice(indexDeliv, 1);

  let transaction = await vuePos.transaction(['transfer', 'inventory'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('transfer').delete(dataForm.id);
    transaction.objectStore('transfer').put(orders);
    inventories.forEach(inventory => {
      transaction.objectStore('inventory').put(inventory);
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

async function submitReceiveTransfer({ state, commit }, dataForm) {
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
        cursor.value.tx.push({
          id: dataForm.id,
          type: 'Penerimaan transfer',
          id_ingredient: ing.id_ingredient,
          id_outlet: dataForm.id_outlet,
          id_order: dataForm.id_order,
          order: dataForm.order,
          time: dataForm.time,
          status: dataForm.status,
          qty: ing.received
        })
        inventories.push(cursor.value);
      }
    });
    cursor = await cursor.continue();
    if (!cursor) break;
  }

  let orders = { id: null };
  state.listTransfer.forEach(tf => {
    if (tf.id === dataForm.id_order) {
      orders = tf;
      orders.receive.push(dataForm);
    }
  });

  let transaction = await vuePos.transaction(['transfer', 'inventory'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('transfer').put(dataForm);
    transaction.objectStore('transfer').put(orders);
    inventories.forEach(inventory => {
      transaction.objectStore('inventory').put(inventory);
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

async function updateReceiveTransfer({ state, commit }, dataForm) {
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

  inventories.forEach(inventory => {
    dataForm.ingredients.forEach(ingredient => {
      inventory.tx.forEach(element => {
        if (element.id === dataForm.id && element.id_ingredient === ingredient.id_ingredient) {
          element.id_order = dataForm.order.id;
          element.order = dataForm.order;
          element.status = dataForm.receive_status;
          element.qty = ingredient.received;
        }
      });
    });
  });

  let orders = { id: null };
  state.listTransfer.forEach(order => {
    if (order.id === dataForm.id_order) {
      orders = order;
    }
  });
  orders.receive.forEach(dv => {
    if (dv.id === dataForm.id) {
      dv.ingredients = dataForm.ingredients;
      dv.receive_status = dataForm.receive_status;
    }
  });

  let transaction = await vuePos.transaction(['transfer', 'inventory'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('transfer').put(dataForm);
    transaction.objectStore('transfer').put(orders);
    inventories.forEach(inventory => {
      transaction.objectStore('inventory').put(inventory);
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

  // search ingredient in inventory collection
  let tx = vuePos.transaction('inventory').store;
  let cursor = await tx.openCursor();
  let inventories = [];
  const loopCursor = true;
  while (loopCursor) {
    if (cursor.value.id === dataForm.id_ingredient) {
      cursor.value.tx.push({
        id: dataForm.id,
        type: 'Adjustment',
        id_ingredient: dataForm.id_ingredient,
        id_outlet: dataForm.id_outlet,
        time: dataForm.time,
        in_stock: dataForm.in_stock,
        actual_stock: dataForm.actual_stock,
        qty: dataForm.adjustment,
        notes: dataForm.notes
      })
      inventories.push(cursor.value);
    }
    cursor = await cursor.continue();
    if (!cursor) break;
  }

  let transaction = await vuePos.transaction(['adjustment', 'inventory'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('adjustment').put(dataForm);
    inventories.forEach(inv => {
      transaction.objectStore('inventory').put(inv);
    })
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

async function updateAdjustment({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);

  // search ingredient in inventory collection
  let tx = vuePos.transaction('inventory').store;
  let cursor = await tx.openCursor();
  let inventories = [];
  const loopCursor = true;
  while (loopCursor) {
    if (cursor.value.id === dataForm.id_ingredient) {
      inventories.push(cursor.value);
    }
    cursor = await cursor.continue();
    if (!cursor) break;
  }

  inventories.forEach(inventory => {
    inventory.tx.forEach(element => {
      if (element.id === dataForm.id) {
        element.in_stock = dataForm.in_stock;
        element.actual_stock = dataForm.actual_stock;
        element.qty = dataForm.adjustment;
        element.notes = dataForm.notes;
      }
    });
  });

  let transaction = await vuePos.transaction(['adjustment', 'inventory'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('adjustment').put(dataForm);
    inventories.forEach(inv => {
      transaction.objectStore('inventory').put(inv);
    })
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

async function deleteAdjustment({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);

  // search ingredient in inventory collection
  let tx = vuePos.transaction('inventory').store;
  let cursor = await tx.openCursor();
  let inventories = [];
  const loopCursor = true;
  while (loopCursor) {
    if (cursor.value.id === dataForm.id_ingredient) {
      inventories.push(cursor.value);
    }
    cursor = await cursor.continue();
    if (!cursor) break;
  }

  inventories.forEach(inventory => {
    inventory.tx.forEach((element, indexTx) => {
      if (element.id === dataForm.id) {
        inventory.tx.splice(indexTx, 1);
      }
    });
  });

  let transaction = await vuePos.transaction(['adjustment', 'inventory'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('adjustment').delete(dataForm.id);
    inventories.forEach(inv => {
      transaction.objectStore('inventory').put(inv);
    })
    transaction.done
      .then(result => {
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

  // search ingredient in inventory collection
  let tx = vuePos.transaction('inventory').store;
  let cursor = await tx.openCursor();
  let inventories = [];
  const loopCursor = true;
  while (loopCursor) {
    dataForm.products_sold.forEach(prod => {
      if (prod.without_ingredient === true) {        
        if (cursor.value.id === prod.id) {
          cursor.value.tx.push({
            id: dataForm.id,
            type: 'Penjualan',
            id_ingredient: prod.id,
            id_outlet: dataForm.id_outlet,
            time: dataForm.time,
            qty: parseFloat(prod.qty),
            price: parseFloat(prod.price)
          })
        }
      } else {
        prod.ingredients.forEach(ing => {
          if (cursor.value.id === ing.ingredient.id) {
            cursor.value.tx.push({
              id: dataForm.id,
              type: 'Penjualan',
              id_ingredient: ing.id_ingredient,
              id_outlet: dataForm.id_outlet,
              time: dataForm.time,
              qty: parseFloat(ing.qty) * parseFloat(prod.qty)
            })
          }
        });
      }
      inventories.push(cursor.value);
    });
    cursor = await cursor.continue();
    if (!cursor) break;
  }

  let transaction = await vuePos.transaction(['transaction', 'inventory'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('transaction').put(dataForm);
    if (dataForm.status !== 'Antre') {
      inventories.forEach(inv => {
        transaction.objectStore('inventory').put(inv);
      })
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

async function updateTransaction({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);

  // search ingredient in inventory collection
  let tx = vuePos.transaction('inventory').store;
  let cursor = await tx.openCursor();
  let inventories = [];
  const loopCursor = true;
  while (loopCursor) {
    dataForm.products_sold.forEach(prod => {
      if (prod.without_ingredient === true) {        
        if (cursor.value.id === prod.id) {
          inventories.push(cursor.value);
        }
      } else {
        prod.ingredients.forEach(ing => {
          if (cursor.value.id === ing.ingredient.id) {
            inventories.push(cursor.value);
          }
        });
      }      
    });
    cursor = await cursor.continue();
    if (!cursor) break;
  }

  // update data in inventory
  inventories.forEach(inventory => {
    const found = inventory.tx.some(el => el.id === dataForm.id);

    // in condition total item / product was change 
    if (found) {
      inventory.tx.forEach((element, indexTx) => {
        dataForm.products_sold.forEach(prod => {
          if (prod.without_ingredient === true) {
              if (element.id === dataForm.id && element.id_ingredient === prod.id && prod.qty != 0) {
                element.qty = parseFloat(prod.qty);
              } else if (element.id === dataForm.id && element.id_ingredient === prod.id && prod.qty == 0) {
                // condition item / product was removed
                inventory.tx.splice(indexTx, 1);
              }
          } else {
            if (prod.qty != 0) {
              prod.ingredients.forEach(ing => {
                  if (element.id === dataForm.id && element.id_ingredient === ing.id_ingredient) {
                    element.qty = parseFloat(ing.qty) * parseFloat(prod.qty);
                  }
              })
            } else if (prod.qty == 0) {
              // condition item / product was removed
              prod.ingredients.forEach(ing => {
                  if (element.id === dataForm.id && element.id_ingredient === ing.id_ingredient) {
                    inventory.tx.splice(indexTx, 1);
                  }
              })
            }
          } 
        })
      });
    } else {
      // condition new item / product was added
      dataForm.products_sold.forEach(prod => {
        if (prod.without_ingredient === true) {
          if (inventory.id === prod.id) {
            inventory.tx.push({
              id: dataForm.id,
              type: 'Penjualan',
              id_ingredient: prod.id,
              id_outlet: dataForm.id_outlet,
              time: dataForm.time,
              qty: parseFloat(prod.qty),
              price: parseFloat(prod.price)
            })
          }
        } else {
          prod.ingredients.forEach(ing => {
            if (inventory.id === ing.ingredient.id) {
              inventory.tx.push({
                id: dataForm.id,
                type: 'Penjualan',
                id_ingredient: ing.id_ingredient,
                id_outlet: dataForm.id_outlet,
                time: dataForm.time,
                qty: parseFloat(ing.qty) * parseFloat(prod.qty)
              })
            }
          });
        } 
      })
    }
  });

  // remove product from products_sold when product was removed
  dataForm.products_sold.forEach((prod, indexProd) => {
    if (prod.qty == 0) {
      dataForm.products_sold.splice(indexProd, 1);
    }
  });
  
  let transaction = await vuePos.transaction(['transaction', 'inventory'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('transaction').put(dataForm);
    inventories.forEach(inv => {
      transaction.objectStore('inventory').put(inv);
    })
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

async function getOutletById({ commit }, id) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);
  return new Promise((resolve, reject) => {
    vuePos
      .get('outlet', id)
      .then(result => {
        commit('SET_DETAIL_OUTLET', result);
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

async function updateStatusOutlet({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);

  // search outlet that is active status in outlet collection
  let tx = vuePos.transaction('transaction').store;
  let cursor = await tx.openCursor();
  let outlets = [dataForm];
  const loopCursor = true;
  while (loopCursor) {
    if (cursor.value.status_account === true && cursor.value.id !== dataForm.id) {
      let outletData = {
        ...cursor.value,
        status_account: false
      }
      outlets.push(outletData);
    }
    cursor = await cursor.continue();
    if (!cursor) break;
  }

  // update outlet status
  let transaction = await vuePos.transaction(['outlet'], 'readwrite');
  return new Promise((resolve, reject) => {
    outlets.forEach(outlet => {
      transaction.objectStore('outlet').put(outlet);
    });    
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

async function getEmployee({ commit }) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);
  return new Promise((resolve, reject) => {
    vuePos
      .getAll('employee')
      .then(result => {
        commit('SET_LIST_EMPLOYEE', result);
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

async function submitEmployee({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);

  // search outlet in outlet collection
  let tx = vuePos.transaction('outlet').store;
  let cursor = await tx.openCursor();
  let outlet = { id: null };
  const loopCursor = true;
  while (loopCursor) {
    if (cursor.value.id === dataForm.id_outlet) {
      outlet = cursor.value;
      outlet.employee.push(dataForm);
    }
    cursor = await cursor.continue();
    if (!cursor) break;
  }

  // update employee in collection employee and outlet
  let transaction = await vuePos.transaction(['employee', 'outlet'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('employee').put(dataForm);
    if (outlet.id !== null) {
      transaction.objectStore('outlet').put(outlet);
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

async function updateEmployee({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);

  // search outlet in outlet collection
  let tx = vuePos.transaction('outlet').store;
  let cursor = await tx.openCursor();
  let outlet = { id: null };
  const loopCursor = true;
  while (loopCursor) {
    if (cursor.value.id === dataForm.id_outlet) {
      outlet = cursor.value;
    }
    cursor = await cursor.continue();
    if (!cursor) break;
  }

  // update employee in collection employee and outlet
  let transaction = await vuePos.transaction(['employee', 'outlet'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('employee').put(dataForm);
    let indexEmp = null;
    if (outlet.id !== null) {
      outlet.employee.forEach((emp, index) => {
        if (emp.id === dataForm.id) {
          indexEmp = index;
        }
      });
      outlet.employee[indexEmp] = dataForm;
      transaction.objectStore('outlet').put(outlet);
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

async function deleteEmployee({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);

  // search outlet in outlet collection
  let tx = vuePos.transaction('outlet').store;
  let cursor = await tx.openCursor();
  let outlet = { id: null };
  const loopCursor = true;
  while (loopCursor) {
    if (cursor.value.id === dataForm.id_outlet) {
      outlet = cursor.value;
    }
    cursor = await cursor.continue();
    if (!cursor) break;
  }

  // update employee in collection employee and outlet
  let transaction = await vuePos.transaction(['employee', 'outlet'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('employee').delete(dataForm.id);
    let indexEmp = null;
    if (outlet.id !== null) {
      outlet.employee.forEach((emp, index) => {
        if (emp.id === dataForm.id) {
          indexEmp = index;
        }
      });
      outlet.employee.splice(indexEmp, 1);
      transaction.objectStore('outlet').put(outlet);
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

  // search outlet in outlet collection
  let tx = vuePos.transaction('outlet').store;
  let cursor = await tx.openCursor();
  let outlet = { id: null };
  const loopCursor = true;
  while (loopCursor) {
    if (cursor.value.id === dataForm.id_outlet) {
      outlet = cursor.value;
      outlet.table.push(dataForm);
    }
    cursor = await cursor.continue();
    if (!cursor) break;
  }

  // update table in collection table and outlet
  let transaction = await vuePos.transaction(['table', 'outlet'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('table').put(dataForm);
    if (outlet.id !== null) {
      transaction.objectStore('outlet').put(outlet);
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

async function updateTable({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);

  // search outlet in outlet collection
  let tx = vuePos.transaction('outlet').store;
  let cursor = await tx.openCursor();
  let outlet = { id: null };
  const loopCursor = true;
  while (loopCursor) {
    if (cursor.value.id === dataForm.id_outlet) {
      outlet = cursor.value;
    }
    cursor = await cursor.continue();
    if (!cursor) break;
  }

  // update table in collection table and outlet
  let transaction = await vuePos.transaction(['table', 'outlet'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('table').put(dataForm);
    let indexTable = null;
    if (outlet.id !== null) {
      outlet.table.forEach((table, index) => {
        if (table.id === dataForm.id) {
          indexTable = index;
        }
      });
      outlet.table[indexTable] = dataForm;
      transaction.objectStore('outlet').put(outlet);
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

async function deleteTable({ commit }, dataForm) {
  commit("SET_LOADING");
  const vuePos = await openDB('vue-pos', 3);

  // search outlet in outlet collection
  let tx = vuePos.transaction('outlet').store;
  let cursor = await tx.openCursor();
  let outlet = { id: null };
  const loopCursor = true;
  while (loopCursor) {
    if (cursor.value.id === dataForm.id_outlet) {
      outlet = cursor.value;
    }
    cursor = await cursor.continue();
    if (!cursor) break;
  }

  // update table in collection table and outlet
  let transaction = await vuePos.transaction(['table', 'outlet'], 'readwrite');
  return new Promise((resolve, reject) => {
    transaction.objectStore('table').delete(dataForm.id);
    let indexTable = null;
    if (outlet.id !== null) {
      outlet.table.forEach((table, index) => {
        if (table.id === dataForm.id) {
          indexTable = index;
        }
      });
      outlet.table.splice(indexTable, 1);
      transaction.objectStore('outlet').put(outlet);
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
  updateRecipe,
  deleteRecipe,
  getInventory,
  getInventoryById,
  submitInventory,
  getSupplier,
  submitSupplier,
  getOrder,
  submitOrder,
  updateOrder,
  deleteOrder,
  getReceive,
  submitReceive,
  updateReceive,
  deleteReceive,
  deleteSupplier,
  getTransfer,
  submitTransfer,
  updateTransfer,
  deleteTransfer,
  submitDeliveryTransfer,
  updateDeliveryTransfer,
  deleteDeliveryTransfer,
  submitReceiveTransfer,
  updateReceiveTransfer,
  getAdjustment,
  submitAdjustment,
  updateAdjustment,
  deleteAdjustment,
  getTransaction,
  submitTransaction,
  updateTransaction,
  getCustomer,
  submitCustomer,
  updateCustomer,
  deleteCustomer,
  getOutlet,
  getOutletById,
  submitOutlet,
  deleteOutlet,
  updateStatusOutlet,
  getEmployee,
  submitEmployee,
  updateEmployee,
  deleteEmployee,
  getTable,
  submitTable,
  updateTable,
  deleteTable,
  updateReceipt
}
