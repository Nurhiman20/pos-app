<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <v-card-title class="ml-0">Simpan Transaksi</v-card-title>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(saveTransaction)">
            <ValidationProvider v-slot="{ errors }" name="Nama Pelanggan" rules="required">
              <v-row no-gutters>
                <v-col cols="10">
                  <v-autocomplete
                    :error-messages="errors"
                    v-model="customer"
                    :items="$store.state.listCustomer"
                    :item-text="textCustomer"
                    :item-value="valueCustomer"
                    label="Nama Pelanggan"
                    class="mt-2 px-4"
                    outlined
                    dense
                    hide-no-data
                    hide-details
                    :clearable="true"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="2">
                  <v-btn
                    class="mx-2 mt-3"
                    fab
                    x-small
                    color="secondary"
                    @click="addNewCustomer"
                  >
                    <v-icon dark>
                      mdi-plus
                    </v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Nomor Meja" rules="required">
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
              ></v-autocomplete>
            </ValidationProvider>

            <div class="px-4 mt-6" v-if="tableNumber !== null">
              <h3>E-Receipt</h3>
              <receipt-app :selected="transaction" :print="print" @receiptPrinted="finishPrint"></receipt-app>
            </div>

            <v-card-actions class="mt-6">
              <v-spacer></v-spacer>
              <v-btn color="warning darken-1" text @click="closeDialog">Batal</v-btn>
              <v-btn color="secondary" dark :loading="$store.state.loading" @click="doPrint">
                <v-icon class="mr-2">mdi-printer</v-icon>
                Cetak
              </v-btn>
              <v-btn color="primary" dark type="submit" :loading="$store.state.loading">Simpan</v-btn>
            </v-card-actions>
          </v-form>
        </ValidationObserver>
      </v-card>
    </v-dialog>

    <new-customer-dialog
      :show="newCustomerDialog"
      @successAddCustomer="setCustomer"
      @closeDialog="closeDialogCustomer"
    ></new-customer-dialog>
  </div>
</template>

<script>
import newCustomerDialog from './DialogTambahPelanggan';
import receiptApp from '@/components/ReceiptApp';

export default {
  props: ['show', 'transaction'],
  components: {
    newCustomerDialog,
    receiptApp
  },
  data() {
    return {
      customer: null,
      tableNumber: null,
      print: false,
      newCustomerDialog: false
    }
  },
  watch: {
    tableNumber(val) {
      if (val !== null) {
        let dataForm = this.transaction;
        dataForm.customer = this.customer;
        dataForm.table_number = this.tableNumber;
      }
    }
  },
  methods: {
    textCustomer(item) {
      return item.name + ' - ' + item.phone_number
    },
    valueCustomer(item) {
      return item
    },
    textTable(item) {
      return item.table_number
    },
    valueTable(item) {
      return item
    },
    closeDialog() {
      this.$emit('close', false);
    },
    closeDialogCustomer(e) {
      this.newCustomerDialog = e;
    },
    finishPrint(e) {
      this.print = e;
    },
    doPrint() {
      this.print = true;
    },
    setCustomer(e) {
      this.customerName = e.name;
      this.selectCustomerName = e.name;
      this.newCustomerDialog = false;
    },
    addNewCustomer() {
      this.newCustomerDialog = true;
    },
    saveTransaction() {
      let dataForm = this.transaction;
      dataForm.customer = this.customer;
      dataForm.table_number = this.tableNumber;
      if (this.$store.state.selectedTx.id !== undefined) {
        dataForm.id = this.$store.state.selectedTx.id;
        this.$store.dispatch("updateTransaction", dataForm)
        .then(() => {
          this.$store.commit("CLEAR_SELECTED_PRODUCT", []);
          this.$emit("success", "Transaksi telah diperbarui");
        })
        .catch(() => {
          this.$emit("error", "Terjadi masalah. Silahkan coba lagi nanti");
        });
      } else {
        this.$store.dispatch("submitTransaction", dataForm)
          .then(() => {
            this.$store.commit("CLEAR_SELECTED_PRODUCT", []);
            this.customerName = null;
            this.phoneNumber = null;
            this.tableNumber = null;
            this.$emit("success", "Transaksi telah disimpan");
          })
          .catch(() => {
            this.$emit("error", "Terjadi masalah. Silahkan coba lagi nanti");
          });
      }
    }
  },
  created() {
    if (this.$store.state.selectedTx.customer !== undefined) {
      this.customer = this.$store.state.selectedTx.customer;
      this.tableNumber = this.$store.state.selectedTx.table_number;
    }
  },
}
</script>
