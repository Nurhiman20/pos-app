const listViewProduct = (state) => {
  if (state.filterCategory.name === 'all') {
    return state.listProduct
  } else {
    var viewProduct = state.listProduct.filter(product => product.category.name === state.filterCategory.name);
    return viewProduct
  }
}

export default {
  listViewProduct
}