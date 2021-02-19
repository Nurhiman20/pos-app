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
  let orderCount = 0;
  let adjustmentCount = 0;

  state.listInventory.forEach(inv => {
    // count total received order
    state.listOrder.forEach(order => {
      order.ingredients.forEach(ing => {
        if (ing.id_ingredient === inv.id) {
          orderCount += parseFloat(ing.received);
          inv.order = orderCount;
        }
      });
    });

    // count total adjustment
    state.listAdjustment.forEach(adj => {
      if (adj.id_ingredient === inv.id) {
        adjustmentCount += adj.adjustment;
        console.log(adjustmentCount);
        inv.adjustment = adjustmentCount;
      }
    });

    // count ending stock
    let endingStock = parseFloat(inv.stock) + inv.order - parseFloat(inv.usage) - parseFloat(inv.transfer) - inv.adjustment;
    let invData = {
      ...inv,
      ending_stock: endingStock
    }

    inventory.push(invData);
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