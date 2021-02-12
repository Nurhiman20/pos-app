import * as moment from 'moment'

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

const totalTransactionToday = (state) => {
  let transactionToday = [];
  state.listTransaction.forEach(element => {
    if (moment(element.time).isSame(moment().format(), 'day')) {
      transactionToday.push(element);
    }
  });

  return transactionToday.length;
}

const totalTransactionMonth = (state) => {
  let transactionMonth = [];
  state.listTransaction.forEach(element => {
    if (moment(element.time).isSame(moment().format(), 'month')) {
      transactionMonth.push(element);
    }
  });

  return transactionMonth.length;
}

const totalAmountToday = (state) => {
  let transactionToday = [];
  state.listTransaction.forEach(element => {
    if (moment(element.time).isSame(moment().format(), 'day')) {
      transactionToday.push(element);
    }
  });

  const amountToday = transactionToday.reduce((acc, tx) => acc + tx.total, 0);

  return amountToday;
}

const totalAmountMonth = (state) => {
  let transactionMonth = [];
  state.listTransaction.forEach(element => {
    if (moment(element.time).isSame(moment().format(), 'month')) {
      transactionMonth.push(element);
    }
  });

  const amountMonth = transactionMonth.reduce((acc, tx) => acc + tx.total, 0);

  return amountMonth;
}

export default {
  listViewProduct,
  listViewInventory,
  totalTransactionToday,
  totalTransactionMonth,
  totalAmountToday,
  totalAmountMonth
}