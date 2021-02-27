import * as moment from 'moment'

const listViewProduct = (state) => {
  if (state.filterCategory.name === 'all') {
    return state.listProduct
  } else {
    var viewProduct = state.listProduct.filter(prod => prod.category.name === state.filterCategory.name);
    return viewProduct
  }
}

const listViewInventory = (state) => {
  let inventory = [];
  let orderCount = 0;
  let receiveCount = 0;
  let adjustmentCount = 0;
  let usageCount = 0;

  state.listInventory.forEach(inv => {
    // count total order
    state.listOrder.forEach(order => {
      order.ingredients.forEach(ing => {
        if (ing.id_ingredient === inv.id) {
          orderCount += parseFloat(ing.order);
          inv.order = orderCount;
        }
      });
    });

    // count total received
    state.listReceive.forEach(receive => {
      receive.ingredients.forEach(ing => {
        if (ing.id_ingredient === inv.id) {
          receiveCount += parseFloat(ing.received);
          inv.receive = receiveCount;
        }
      });
    });

    // count total adjustment
    state.listAdjustment.forEach(adj => {
      if (adj.id_ingredient === inv.id) {
        adjustmentCount += adj.adjustment;
        inv.adjustment = adjustmentCount;
      }
    });

    // count total usage
    state.listTransaction.forEach(tx => {
      tx.products_sold.forEach(prod => {
        if (prod.ingredients !== undefined) {
          prod.ingredients.forEach(ing => {
            if (ing.id_ingredient === inv.id) {
              usageCount += parseFloat(ing.qty * prod.qty);
              inv.usage = usageCount.toFixed(2);
            }
          });
        } else {
          if (prod.id === inv.id) {
            usageCount += parseFloat(prod.qty);
            inv.usage = usageCount.toFixed(2);
          }
        }
      });
    });

    // count ending stock
    let endingStock = parseFloat(inv.stock) + parseFloat(inv.receive) - parseFloat(inv.usage) - parseFloat(inv.transfer) - parseFloat(inv.adjustment);
    let invData = {
      ...inv,
      ending_stock: endingStock.toFixed(2)
    }

    inventory.push(invData);
    receiveCount = 0;
    orderCount = 0;
    adjustmentCount = 0;
    usageCount = 0;
  });

  return inventory;
}

const listViewTransaction = (state) => {
  let filteredTx = [];
  state.listTransaction.forEach(tx => {
    if (moment(tx.time).isBetween(state.dateStart, moment(state.dateEnd).add(1, 'days'), undefined, '[]')) {
      filteredTx.push(tx);
    }
  })

  return filteredTx
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

const totalProfitToday = (state) => {
  let transactionToday = [];
  state.listTransaction.forEach(element => {
    if (moment(element.time).isSame(moment().format(), 'day')) {
      transactionToday.push(element);
    }
  });

  const amountToday = transactionToday.reduce((acc, tx) => acc + tx.total, 0);
  let costToday = 0;

  transactionToday.forEach(tx => {
    tx.products_sold.forEach(prod => {
      prod.ingredients.forEach(ing => {
        costToday += parseFloat(ing.ingredient.price) * parseFloat(ing.qty) * parseFloat(prod.qty)
      })
    })
  });

  return amountToday - costToday;
}

const totalProfitMonth = (state) => {
  let transactionMonth = [];
  state.listTransaction.forEach(element => {
    if (moment(element.time).isSame(moment().format(), 'month')) {
      transactionMonth.push(element);
    }
  });

  const amountMonth = transactionMonth.reduce((acc, tx) => acc + tx.total, 0);
  let costMonth = 0;

  transactionMonth.forEach(tx => {
    tx.products_sold.forEach(prod => {
      prod.ingredients.forEach(ing => {
        costMonth += parseFloat(ing.ingredient.price) * parseFloat(ing.qty) * parseFloat(prod.qty)
      })
    })
  });

  return amountMonth - costMonth;
}

export default {
  listViewProduct,
  listViewInventory,
  listViewTransaction,
  totalTransactionToday,
  totalTransactionMonth,
  totalAmountToday,
  totalAmountMonth,
  totalProfitToday,
  totalProfitMonth
}