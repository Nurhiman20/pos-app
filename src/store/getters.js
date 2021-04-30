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
    inv.tx.forEach(order => {
      if (order.id.indexOf('order') !== -1 && order.id.indexOf('tf') === -1) {
        orderCount += parseFloat(order.qty);
        inv.order = orderCount;
      }
    });

    // count total received
    inv.tx.forEach(receive => {
      if (receive.id.indexOf('rv') !== -1) {
        receiveCount += parseFloat(receive.qty);
        inv.receive = receiveCount;
      }
    });

    // count total adjustment
    inv.tx.forEach(adj => {
      if (adj.id.indexOf('adj') !== -1) {
        adjustmentCount += parseFloat(adj.qty);
        inv.adjustment = adjustmentCount;
      }
    });

    // count total usage
    inv.tx.forEach(tx => {
      if (tx.id.indexOf('tr') !== -1) {
        usageCount += parseFloat(tx.qty);
        inv.usage = usageCount.toFixed(2);
      }
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

const listOrderTransfer = (state) => {
  let orderTransfer = [];
  state.listTransfer.forEach(tf => {
    if (tf.status === 'Pesanan') {
      orderTransfer.push(tf);
    }
  })

  return orderTransfer;
}

const listRvOrderTransfer = (state) => {
  let rvOrderTransfer = [];
  state.listTransfer.forEach(tf => {
    if (tf.destination_outlet.id === state.account.id && tf.status !== 'Pengiriman') {
      rvOrderTransfer.push(tf);
    }
  })

  return rvOrderTransfer;
}

const listDeliveryTransfer = (state) => {
  let delivTransfer = [];
  state.listTransfer.forEach(tf => {
    if (tf.status === 'Pengiriman') {
      delivTransfer.push(tf);
    }
  })

  return delivTransfer;
}

const listRvDelivery = (state) => {
  let rvDelivery = [];
  state.listTransfer.forEach(tf => {
    if (tf.destination_outlet.id === state.account.id && tf.status === 'Pengiriman') {
      rvDelivery.push(tf);
    }
  })

  return rvDelivery;
}

const listRvTransfer = (state) => {
  let rvTransfer = [];
  state.listTransfer.forEach(tf => {
    if (tf.status === 'Penerimaan') {
      rvTransfer.push(tf);
    }
  })

  return rvTransfer;
}

const listViewTransaction = (state) => {
  let filteredTx = [];
  state.listTransaction.forEach(tx => {
    if (moment(tx.time).isBetween(state.dateStart, moment(state.dateEnd).add(1, 'days'), undefined, '[]') && tx.status !== 'Antre') {
      filteredTx.push(tx);
    }
  })

  return filteredTx
}

const listQueueTransaction = (state) => {
  let filteredTx = [];
  if (state.tableTx !== null && state.customerTx !== null) {
    state.listTransaction.forEach(tx => {
      if (tx.status === 'Antre' && tx.table_number.id === state.tableTx.id && tx.customer.id === state.customerTx.id) {
        filteredTx.push(tx);
      }
    })
  } else if (state.tableTx === null && state.customerTx !== null) {
    state.listTransaction.forEach(tx => {
      if (tx.status === 'Antre' && tx.customer.id === state.customerTx.id) {
        filteredTx.push(tx);
      }
    })
  } else if (state.tableTx !== null && state.customerTx === null) {
    state.listTransaction.forEach(tx => {
      if (tx.status === 'Antre' && tx.table_number.id === state.tableTx.id) {
        filteredTx.push(tx);
      }
    })
  } else {
    state.listTransaction.forEach(tx => {
      if (tx.status === 'Antre') {
        filteredTx.push(tx);
      }
    })
  }

  return filteredTx;
}

const totalTransactionToday = (state) => {
  let transactionToday = [];
  state.listTransaction.forEach(element => {
    if (moment(element.time).isSame(moment().format(), 'day') && element.status !== 'Antre') {
      transactionToday.push(element);
    }
  });

  return transactionToday.length;
}

const totalTransactionMonth = (state) => {
  let transactionMonth = [];
  state.listTransaction.forEach(element => {
    if (moment(element.time).isSame(moment().format(), 'month') && element.status !== 'Antre') {
      transactionMonth.push(element);
    }
  });

  return transactionMonth.length;
}

const totalAmountToday = (state) => {
  let transactionToday = [];
  state.listTransaction.forEach(element => {
    if (moment(element.time).isSame(moment().format(), 'day') && element.status !== 'Antre') {
      transactionToday.push(element);
    }
  });

  const amountToday = transactionToday.reduce((acc, tx) => acc + tx.total, 0);

  return amountToday;
}

const totalAmountMonth = (state) => {
  let transactionMonth = [];
  state.listTransaction.forEach(element => {
    if (moment(element.time).isSame(moment().format(), 'month') && element.status !== 'Antre') {
      transactionMonth.push(element);
    }
  });

  const amountMonth = transactionMonth.reduce((acc, tx) => acc + tx.total, 0);

  return amountMonth;
}

const totalProfitToday = (state) => {
  let transactionToday = [];
  state.listTransaction.forEach(element => {
    if (moment(element.time).isSame(moment().format(), 'day') && element.status !== 'Antre') {
      transactionToday.push(element);
    }
  });

  const amountToday = transactionToday.reduce((acc, tx) => acc + tx.total, 0);
  let costToday = 0;

  transactionToday.forEach(tx => {
    tx.products_sold.forEach(prod => {
      if (prod.ingredients !== undefined) {
        prod.ingredients.forEach(ing => {
          costToday += parseFloat(ing.ingredient.price) * parseFloat(ing.qty) * parseFloat(prod.qty);
        })
      } else {
        costToday += (parseFloat(prod.price) - parseFloat(prod.price_cost)) * parseFloat(prod.qty);
      }
    })
  });

  return amountToday - costToday;
}

const totalProfitMonth = (state) => {
  let transactionMonth = [];
  state.listTransaction.forEach(element => {
    if (moment(element.time).isSame(moment().format(), 'month') && element.status !== 'Antre') {
      transactionMonth.push(element);
    }
  });

  const amountMonth = transactionMonth.reduce((acc, tx) => acc + tx.total, 0);
  let costMonth = 0;

  transactionMonth.forEach(tx => {
    tx.products_sold.forEach(prod => {
      if (prod.ingredients !== undefined) {
        prod.ingredients.forEach(ing => {
          costMonth += parseFloat(ing.ingredient.price) * parseFloat(ing.qty) * parseFloat(prod.qty);
        })
      } else {
        costMonth += (parseFloat(prod.price) - parseFloat(prod.price_cost)) * parseFloat(prod.qty);
      }
    })
  });

  return amountMonth - costMonth;
}

const orderOnDetail = (state) => {
  let orders = [];
  state.listOrder.forEach(order => {
    order.ingredients.forEach(ing => {
      if (ing.id_ingredient === state.detailInventory.id) {
        orders.push(order);
      }
    });
  });
  
  return orders;
}

const receiveOnDetail = (state) => {
  let receives = [];
  state.listReceive.forEach(receive => {
    receive.ingredients.forEach(ing => {
      if (ing.id_ingredient === state.detailInventory.id) {
        receives.push(receive);
      }
    });
  });
  
  return receives;
}

const adjustmentOnDetail = (state) => {
  let adjustments = [];
  state.listAdjustment.forEach(adj => {
    if (adj.id_ingredient === state.detailInventory.id) {
      adjustments.push(adj);
    }
  });
  
  return adjustments;
}

const transactionOnDetail = (state) => {
  let transaction = [];
  state.listTransaction.forEach(tx => {
    tx.products_sold.forEach(prod => {
      if (prod.ingredients !== undefined) {
        prod.ingredients.forEach(ing => {
          if (ing.id_ingredient === state.detailInventory.id) {
            transaction.push(tx);
          }
        });
      } else if (prod.id === state.detailInventory.id) {
        transaction.push(tx);
      }
    });
  });
  
  return transaction;
}

const viewHighestCost = (state) => {
  let txUnitCost = [];
  state.detailInventory.tx.forEach(tx => {
    if (tx.id.indexOf('rv') !== -1 || tx.id.indexOf('first') !== -1) {
      txUnitCost.push(parseFloat(tx.unit_cost))
    }
  });

  let max = txUnitCost[0];
  for (let i = 1; i < txUnitCost.length; ++i) {
    if (txUnitCost[i] > max) {
      max = txUnitCost[i];
    }
  }

  return max
}

const profitInventory = (state) => {
  let txUnitCost = txWithUnitCost(state);

  let countTotalPurchase = 0;
  let totalQtyReceived = 0;
  txUnitCost.forEach(tx => {
    countTotalPurchase += parseFloat(tx.qty) * parseFloat(tx.unit_cost);
    totalQtyReceived += parseFloat(tx.qty)
  });
  
  let currentAvg = countTotalPurchase / totalQtyReceived;
  let currentValue = parseFloat(state.detailInventory.ending_stock) * currentAvg;

  let txSales = txWithSales(state);
  let totalSales = 0;

  txSales.forEach(tx => {
    totalSales += parseFloat(tx.qty) * parseFloat(tx.price);
  });

  let profit = (currentValue + totalSales) - countTotalPurchase;

  return parseInt(profit);
}

const valueInventory = (state) => {
  let txUnitCost = txWithUnitCost(state);

  let countTotalPurchase = 0;
  let totalQtyReceived = 0;
  txUnitCost.forEach(tx => {
    countTotalPurchase += parseFloat(tx.qty) * parseFloat(tx.unit_cost);
    totalQtyReceived += parseFloat(tx.qty)
  });

  let currentAvg = countTotalPurchase / totalQtyReceived;
  console.log(currentAvg);
  let currentValue = parseFloat(state.detailInventory.ending_stock) * currentAvg;

  return parseInt(currentValue);
}

const txWithUnitCost = (state) => {
  let txUnitCost = [];
  state.detailInventory.tx.forEach(tx => {
    if (tx.id.indexOf('rv') !== -1 || tx.id.indexOf('first') !== -1) {
      txUnitCost.push(tx)
    }
  });

  return txUnitCost
}

const txWithSales = (state) => {
  let txSales = [];
  state.detailInventory.tx.forEach(tx => {
    if (tx.id.indexOf('tr') !== -1) {
      txSales.push(tx)
    }
  });

  return txSales
}

export default {
  listViewProduct,
  listViewInventory,
  listOrderTransfer,
  listRvOrderTransfer,
  listDeliveryTransfer,
  listRvDelivery,
  listRvTransfer,
  listViewTransaction,
  listQueueTransaction,
  totalTransactionToday,
  totalTransactionMonth,
  totalAmountToday,
  totalAmountMonth,
  totalProfitToday,
  totalProfitMonth,
  orderOnDetail,
  receiveOnDetail,
  adjustmentOnDetail,
  transactionOnDetail,
  viewHighestCost,
  profitInventory,
  valueInventory
}