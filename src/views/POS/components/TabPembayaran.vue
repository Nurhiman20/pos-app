<template>
  <div>
    <v-card class="pa-3" outlined>
      <p class="mb-0" v-if="Object.keys($store.state.selectedTx).length !== 0">
        Transaksi
      </p>
      <h2 v-if="Object.keys($store.state.selectedTx).length !== 0">
        {{
          $store.state.selectedTx.id +
            ' | ' +
            $store.state.selectedTx.time +
            ' | ' +
            $store.state.selectedTx.table_number.table_number
        }}
      </h2>
      <ValidationObserver ref="form" v-slot="{ handleSubmit }">
        <v-form @submit.prevent="handleSubmit(submitTransaction)">
          <ValidationProvider v-slot="{ errors }" name="Pelanggan" rules="">
            <v-autocomplete
              :error-messages="errors"
              v-model="customer"
              :items="$store.state.listCustomer"
              :item-text="textCustomer"
              :item-value="valueCustomer"
              label="Pelanggan"
              class="mt-6 px-4"
              outlined
              dense
              hide-no-data
              hide-details
              :clearable="true"
              v-if="Object.keys($store.state.selectedTx).length === 0"
            ></v-autocomplete>
          </ValidationProvider>
          <ValidationProvider v-slot="{ errors }" name="Nomor meja" rules="">
            <v-autocomplete
              :error-messages="errors"
              v-model="tableNumber"
              :items="$store.state.listTable"
              :item-text="textTable"
              :item-value="valueTable"
              label="Nomor Meja"
              class="mt-6 px-4"
              outlined
              dense
              hide-no-data
              hide-details
              :clearable="true"
              v-if="Object.keys($store.state.selectedTx).length === 0"
            ></v-autocomplete>
          </ValidationProvider>
          <v-row class="mt-3 px-4 align-center">
            <v-col
              cols="1"
              class="flex-grow-1 flex-shrink-0"
              style="min-width: 100px; max-width: 100%"
            >
              <ValidationProvider
                v-slot="{ errors }"
                name="Pilih transaksi"
                rules=""
              >
                <v-autocomplete
                  :error-messages="errors"
                  v-model="tx"
                  :items="$store.getters.listQueueTransaction"
                  :item-text="textTx"
                  :item-value="valueTx"
                  label="Pilih Transaksi"
                  class=""
                  outlined
                  dense
                  hide-no-data
                  hide-details
                  :clearable="true"
                  v-if="Object.keys($store.state.selectedTx).length === 0"
                ></v-autocomplete>
              </ValidationProvider>
            </v-col>
            <v-col cols="3">
              <div class="d-flex flex-row justify-end">
                <v-btn
                  color="success"
                  dark
                  :outlined="groupPayment ? false : true"
                  @click="groupPayment = !groupPayment"
                  :disabled="splitPayment ? true : false"
                  >Gabung</v-btn
                >
                <v-btn
                  class="ml-5"
                  color="success"
                  dark
                  :outlined="splitPayment ? false : true"
                  @click="splitPayment = !splitPayment"
                  :disabled="groupPayment ? true : false"
                  >Bagi / Split</v-btn
                >
              </div>
            </v-col>
          </v-row>
          <div
            class="px-4 mt-6"
            v-if="$store.state.selectedProduct.length !== 0"
          >
            <p>Produk Dibeli</p>
            <v-data-table
              :headers="headers"
              :items="$store.state.selectedProduct"
              class="elevation-1 scrollbar-custom"
              hide-default-footer
              @click:row="selectItem"
            >
            </v-data-table>
            <div
              class="d-flex flex-row justify-space-between mt-6"
              v-if="!splitPayment"
            >
              <p>Diskon</p>
              <p class="text-bold mr-2">
                Rp. {{ formatCurrency(discount) }},00
              </p>
            </div>
            <div
              class="d-flex flex-row justify-space-between mt-2"
              v-if="!splitPayment"
            >
              <p>Pajak ({{ $store.state.account.tax }}%)</p>
              <p class="text-bold mr-2">Rp. {{ formatCurrency(tax) }},00</p>
            </div>
            <div
              class="d-flex flex-row justify-space-between pa-2 pb-0"
              :class="groupPayment !== true ? 'total' : ''"
              v-if="!splitPayment"
            >
              <p :class="groupPayment === true ? 'text-bold ml-n2' : ''">
                Total
              </p>
              <p class="text-bold">Rp. {{ formatCurrency(total + tax) }},00</p>
            </div>
          </div>

          <div class="px-4 mt-6 mb-6" v-if="splitPayment">
            <p>Daftar Split Pembayaran</p>
            <v-row justify="center">
              <v-expansion-panels inset>
                <v-expansion-panel v-for="(item, i) in tx.payment" :key="i">
                  <v-expansion-panel-header>
                    Pembayaran {{ i + 1 }} ({{ item.customer.name }})
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-data-table
                      :headers="headers"
                      :items="item.item_product"
                      class="elevation-1 scrollbar-custom"
                      hide-default-footer
                    ></v-data-table>
                    <div class="d-flex flex-row justify-space-between mt-6">
                      <p>Diskon</p>
                      <p class="text-bold mr-2">
                        Rp.
                        {{
                          formatCurrency(totalDiscount(item.item_product))
                        }},00
                      </p>
                    </div>
                    <div class="d-flex flex-row justify-space-between mt-2">
                      <p>Pajak ({{ $store.state.account.tax }}%)</p>
                      <p class="text-bold mr-2">
                        Rp. {{ formatCurrency(totalTax(item.item_product)) }},00
                      </p>
                    </div>
                    <div
                      class="
                        d-flex
                        flex-row
                        justify-space-between
                        pa-2
                        pb-0
                        total
                      "
                    >
                      <p
                        :class="groupPayment === true ? 'text-bold ml-n2' : ''"
                      >
                        Total
                      </p>
                      <p class="text-bold">
                        Rp.
                        {{
                          formatCurrency(
                            countTotal(item.item_product) +
                              totalTax(item.item_product)
                          )
                        }},00
                      </p>
                    </div>
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="Metode pembayaran"
                      rules="required"
                    >
                      <v-select
                        v-model="item.payment_method"
                        :error-messages="errors"
                        :items="paymentMethods"
                        label="Metode Pembayaran"
                        class="mb-0 mt-6 px-4"
                        outlined
                        dense
                      ></v-select>
                    </ValidationProvider>
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="Tunai"
                      rules=""
                    >
                      <v-text-field
                        v-model="item.cash"
                        :error-messages="errors"
                        label="Tunai"
                        outlined
                        dense
                        class="mb-0 mt-2 px-4"
                        v-if="item.payment_method === 'Tunai'"
                      ></v-text-field>
                    </ValidationProvider>
                    <div
                      class="px-4 mb-4"
                      v-if="item.payment_method === 'Tunai'"
                    >
                      <div
                        class="d-flex flex-row justify-space-between pa-2 pb-0 kembali"
                      >
                        <p>Kembali</p>
                        <p class="text-bold">
                          Rp. {{ formatCurrency(countMoneyChange(item, i)) }},00
                        </p>
                      </div>
                    </div>
                    <div class="px-4 pb-3">
                      <v-btn
                        class="mt-3"
                        color="secondary"
                        block
                        :loading="$store.state.loading"
                        @click="doPrint"
                        :disabled="item.cash === 0"
                      >
                        <v-icon class="mr-2">mdi-printer</v-icon>
                        Cetak Struk
                      </v-btn>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-row>
          </div>

          <div v-if="groupPayment === true">
            <div v-for="(oTx, i) in otherTx" :key="i">
              <v-row class="mt-6 px-4 align-center">
                <v-col
                  cols="1"
                  class="flex-grow-1 flex-shrink-0"
                  style="min-width: 100px; max-width: 100%"
                >
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="Pilih transaksi"
                    rules=""
                  >
                    <v-autocomplete
                      :error-messages="errors"
                      v-model="oTx.tx"
                      :items="$store.getters.listQueueTransaction"
                      :item-text="textTx"
                      :item-value="valueTx"
                      :label="'Pilih Transaksi Ke-' + (i + 2)"
                      class=""
                      outlined
                      dense
                      hide-no-data
                      hide-details
                      :clearable="true"
                      v-if="Object.keys($store.state.selectedTx).length === 0"
                    ></v-autocomplete>
                  </ValidationProvider>
                </v-col>
                <v-col cols="2">
                  <div class="d-flex flex-row justify-end">
                    <v-btn
                      color="error"
                      dark
                      outlined
                      @click="removeTransaction(i)"
                      ><v-icon>mdi-delete</v-icon>Hapus</v-btn
                    >
                  </div>
                </v-col>
              </v-row>
              <div class="px-4 mt-6" v-if="oTx.tx !== null">
                <p>Produk Transaksi Ke-{{ i + 2 }}</p>
                <v-data-table
                  :headers="headers"
                  :items="oTx.tx.products_sold"
                  class="elevation-1 scrollbar-custom"
                  hide-default-footer
                ></v-data-table>
                <div class="d-flex flex-row justify-space-between mt-6">
                  <p>Diskon</p>
                  <p class="text-bold mr-2">
                    Rp. {{ oTx.tx.total_discount }},00
                  </p>
                </div>
                <div class="d-flex flex-row justify-space-between pa-2 pb-0">
                  <p class="text-bold ml-n2">Total</p>
                  <p class="text-bold">
                    Rp. {{ formatCurrency(oTx.tx.total) }},00
                  </p>
                </div>
              </div>
            </div>
            <div class="px-4 mt-6">
              <v-btn color="success" dark @click="addTransaction"
                >Tambah Transaksi</v-btn
              >
            </div>
            <div class="px-4 mt-6">
              <div
                class="d-flex flex-row justify-space-between pa-2 pb-0 total"
              >
                <p>Total Transaksi</p>
                <p class="text-bold">Rp. {{ formatCurrency(totalTx()) }},00</p>
              </div>
            </div>
          </div>

          <ValidationProvider
            v-slot="{ errors }"
            name="Metode pembayaran"
            rules="required"
          >
            <v-select
              v-model="paymentMethod"
              :error-messages="errors"
              :items="paymentMethods"
              label="Metode Pembayaran"
              class="mb-0 mt-6 px-4"
              outlined
              dense
              v-if="!splitPayment"
            ></v-select>
          </ValidationProvider>
          <ValidationProvider v-slot="{ errors }" name="Tunai" rules="">
            <v-text-field
              v-model="cash"
              :error-messages="errors"
              label="Tunai"
              outlined
              dense
              class="mb-0 mt-2 px-4"
              v-if="paymentMethod === 'Tunai'"
            ></v-text-field>
          </ValidationProvider>
          <div class="px-4 mb-4" v-if="paymentMethod === 'Tunai'">
            <div
              class="d-flex flex-row justify-space-between pa-2 pb-0 kembali"
            >
              <p>Kembali</p>
              <p class="text-bold">Rp. {{ formatCurrency(moneyChange) }},00</p>
            </div>
          </div>
          <div class="px-4 pb-3">
            <v-btn
              class="mt-3"
              block
              color="primary"
              dark
              type="submit"
              :loading="$store.state.loading"
              >Simpan Transaksi</v-btn
            >
            <v-btn
              class="mt-3"
              color="secondary"
              block
              :loading="$store.state.loading"
              @click="doPrint"
              :disabled="cash === 0"
              v-if="!splitPayment"
            >
              <v-icon class="mr-2">mdi-printer</v-icon>
              Cetak Struk
            </v-btn>
          </div>
        </v-form>
      </ValidationObserver>
    </v-card>

    <select-item-dialog
      :show="selectDialog"
      :selectedItem="selectedItem"
      @add="addPaymentSplit"
      @close="closeSelectDialog"
    ></select-item-dialog>
  </div>
</template>

<script>
import selectItemDialog from './DialogPilihItem.vue';

export default {
  props: ['txPay'],
  components: {
    selectItemDialog,
  },
  data() {
    return {
      customer: null,
      tableNumber: null,
      tx: {},
      paymentMethod: null,
      cash: 0,
      groupPayment: false,
      splitPayment: false,
      paymentMethods: ['Tunai'],
      otherTx: [
        {
          tx: null,
        },
      ],
      selectedItem: {
        name: null,
      },
      headers: [
        { text: 'Produk', value: 'name', sortable: false },
        { text: 'Harga', value: 'price', sortable: false },
        { text: 'Qty', value: 'qty', sortable: false },
        { text: 'Diskon', value: 'discount', sortable: false },
        { text: 'Total', value: 'total', sortable: false },
        { text: '', value: 'actions', sortable: false },
      ],
      selectDialog: false,
    };
  },
  computed: {
    total() {
      let totalAll = 0;
      if (this.$store.state.selectedProduct.length !== 0) {
        totalAll = this.$store.state.selectedProduct.reduce(
          (acc, prod) => acc + parseInt(prod.total),
          0
        );
      } else {
        totalAll = this.tx.products_sold.reduce(
          (acc, prod) => acc + parseInt(prod.total),
          0
        );
      }
      return totalAll;
    },
    discount() {
      let disc = 0;
      if (this.$store.state.selectedProduct.length !== 0) {
        disc = this.$store.state.selectedProduct.reduce(
          (acc, prod) => acc + parseInt(prod.discount),
          0
        );
      } else {
        disc = this.tx.products_sold.reduce(
          (acc, prod) => acc + parseInt(prod.discount),
          0
        );
      }
      return disc;
    },
    tax() {
      let taxAll = (parseInt(this.$store.state.account.tax) * this.total) / 100;
      return taxAll;
    },
    moneyChange() {
      if (this.cash === 0) {
        return 0;
      } else if (this.cash !== 0 && this.groupPayment === false) {
        return this.cash - (this.total + this.tax);
      } else {
        return this.cash - this.totalTx();
      }
    },
    itemProductSold() {
      if (Object.keys(this.$store.state.selectedTx).length === 0) {
        return this.tx.products_sold;
      } else {
        return this.$store.state.selectedTx.products_sold;
      }
    },
  },
  watch: {
    tx(val) {
      if (val.products_sold !== undefined) {
        this.$store.commit('SET_SELECTED_PRODUCT', val.products_sold);
      } else {
        this.$store.commit('SET_SELECTED_PRODUCT', []);
      }
    },
    txPay(val) {
      this.tx = val;
      // this.paymentMethod = val[0].payment_method;
      // this.cash = val[0].cash;
    },
    customer(val) {
      this.$store.commit('SET_CUSTOMER_TX', val);
    },
    tableNumber(val) {
      this.$store.commit('SET_TABLE_TX', val);
    },
  },
  methods: {
    totalDiscount(listProduct) {
      let disc = listProduct.reduce(
        (acc, prod) => acc + parseInt(prod.discount),
        0
      );
      return disc;
    },
    totalTax(listProduct) {
      let taxAll =
        (parseInt(this.$store.state.account.tax) *
          this.countTotal(listProduct)) /
        100;
      return taxAll;
    },
    countTotal(listProduct) {
      let totalAll = listProduct.reduce(
        (acc, prod) => acc + parseInt(prod.total),
        0
      );
      return totalAll;
    },
    countMoneyChange(prod, indexProd) {
      if (prod.cash === 0) {
        this.tx.payment[indexProd].money_change = 0;
        return 0;
      } else {
        let countChange =
          prod.cash -
          (this.countTotal(prod.item_product) +
            this.totalTax(prod.item_product));
        this.tx.payment[indexProd].money_change = countChange;
        return countChange;
      }
    },
    textCustomer(item) {
      return item.name + ' - ' + item.phone_number;
    },
    valueCustomer(item) {
      return item;
    },
    textTx(item) {
      if (item.table_number !== undefined) {
        return (
          item.id +
          ' | ' +
          item.time +
          ' | ' +
          item.table_number.table_number +
          ' | Nomor Antrean: ' +
          item.queue
        );
      } else {
        return '';
      }
    },
    valueTx(item) {
      return item;
    },
    textTable(item) {
      return item.table_number;
    },
    valueTable(item) {
      return item;
    },
    formatCurrency(val) {
      return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.');
    },
    randomId() {
      var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      var uniqid = 'pay-' + randLetter + Date.now();
      return uniqid;
    },
    dateTime() {
      return new Date().toLocaleString();
    },
    totalTx() {
      if (this.otherTx[0].tx !== null) {
        let totalOtherTx = this.otherTx.reduce(
          (acc, tx) => acc + parseInt(tx.tx.total),
          0
        );
        let countTotal = this.total + totalOtherTx;
        return countTotal;
      } else {
        return this.total;
      }
    },
    closeSelectDialog(e) {
      this.selectDialog = e;
    },
    selectItem(e) {
      if (this.splitPayment === true) {
        this.selectedItem = e;
        this.selectDialog = true;
      }
      return false;
    },
    removeTransaction(index) {
      this.otherTx.splice(index, 1);
    },
    addTransaction() {
      this.otherTx.push({
        tx: null,
      });
    },
    addPaymentSplit(e) {
      const foundCustomer = this.tx.payment.some(
        (el) => el.customer.id === e.customer.id
      );
      if (!foundCustomer) {
        let dataPayment = {
          id: this.randomId(),
          payment_method: null,
          item_product: [e.selected_item],
          customer: e.customer,
          cash: 0,
          money_change: 0,
          time: this.dateTime(),
        };

        this.tx.payment.push(dataPayment);
      } else {
        this.tx.payment.forEach((payment) => {
          if (payment.customer.id === e.customer.id) {
            payment.item_product.push(e.selected_item);
          }
        });
      }
    },
    addPayment() {
      let dataPayment = {
        id: this.randomId(),
        payment_method: this.paymentMethod,
        time: this.dateTime(),
      };
      if (this.paymentMethod === 'Tunai') {
        dataPayment.cash = this.cash;
        dataPayment.moneyChange = this.moneyChange;
      }
      this.tx.payment.push(dataPayment);
    },
    doPrint() {
      if (
        Object.keys(this.$store.state.selectedTx).length !== 0 &&
        this.$store.state.selectedTx.status !== 'Antre'
      ) {
        let dataEditPayment = this.$store.state.selectedTx;
        dataEditPayment.total = this.total + this.tax;
        dataEditPayment.tax = this.tax;
        dataEditPayment.total_discount = this.discount;
        dataEditPayment.payment[0].cash = this.cash;
        dataEditPayment.payment[0].moneyChange = this.moneyChange;
        this.$emit('printReceipt', dataEditPayment);
      } else {
        this.addPayment();
        this.$emit('printReceipt', this.tx);
      }
    },
    submitTransaction() {
      if (
        Object.keys(this.$store.state.selectedTx).length !== 0 &&
        this.$store.state.selectedTx.status !== 'Antre'
      ) {
        let dataEditPayment = this.$store.state.selectedTx;
        dataEditPayment.total = this.total + this.tax;
        dataEditPayment.tax = this.tax;
        dataEditPayment.total_discount = this.discount;
        dataEditPayment.payment[0].cash = this.cash;
        dataEditPayment.payment[0].moneyChange = this.moneyChange;
        this.$store
          .dispatch('updateTransaction', dataEditPayment)
          .then(() => {
            this.$store.commit('SET_SELECTED_PRODUCT', []);
            this.$emit('success', 'Transaksi telah diperbarui');
            this.$store.commit('SET_EDIT_TX', {});
            this.$router.push('/laporan/transaksi');
          })
          .catch(() => {
            this.$emit('error', 'Terjadi masalah. Silahkan coba lagi nanti');
          });
      } else {
        if (Object.keys(this.$store.state.selectedTx).length !== 0) {
          this.tx = this.$store.state.selectedTx;
        }

        if (this.tx.payment.length === 0) {
          this.addPayment();
        }

        this.tx.status = 'Sukses';

        this.$store
          .dispatch('submitTransaction', this.tx)
          .then(() => {
            this.$store.commit('SET_SELECTED_PRODUCT', []);
            this.customer = null;
            this.tableNumber = null;
            this.tx = {};
            this.paymentMethod = null;
            this.cash = 0;
            this.$store.commit('SET_PAYMENT_TX', null);
            this.$store.commit('SET_EDIT_TX', {});
            this.$emit('success', 'Transaksi telah disimpan');
          })
          .catch(() => {
            this.$emit('error', 'Terjadi masalah. Silahkan coba lagi nanti');
          });
      }
    },
  },
  created() {
    this.tx = this.txPay;
    if (
      Object.keys(this.$store.state.selectedTx).length !== 0 &&
      this.$store.state.selectedTx.payment.length !== 0
    ) {
      this.paymentMethod = this.$store.state.selectedTx.payment[0].payment_method;
      this.cash = this.$store.state.selectedTx.payment[0].cash;
    }
  },
};
</script>
