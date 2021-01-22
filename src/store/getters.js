const listViewProduct = (state) => {
  if (state.filterCategory.name === 'all') {
    return state.listInventory
  } else {
    var viewProduct = state.listInventory.filter(prod => prod.product.category.name === state.filterCategory.name);
    return viewProduct
  }
}

const listViewInventory = (state) => {
  let inventory = [];
  state.listInventory.forEach(element => {
    if (element.stock === undefined) {
      let invent = {
        product: element,
        stock: 0
      }  
      inventory.push(invent);
    } else {
      inventory.push(element);
    }
  });

  return inventory;
}

export default {
  listViewProduct,
  listViewInventory
}