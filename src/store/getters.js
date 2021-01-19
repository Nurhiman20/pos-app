const listViewProduct = (state) => {
  if (state.filterCategory.name === 'all') {
    return state.listInventory
  } else {
    var viewProduct = state.listInventory.filter(product => product.category.name === state.filterCategory.name);
    return viewProduct
  }
}

const listViewInventory = (state) => {
  state.listInventory.forEach(element => {
    if (element.stock === undefined) {
      element.stock = 0
    }
  });

  return state.listInventory
}

export default {
  listViewProduct,
  listViewInventory
}