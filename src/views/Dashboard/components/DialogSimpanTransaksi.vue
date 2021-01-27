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
                    v-model="selectCustomerName"
                    :items="itemCustomer"
                    :search-input.sync="customerName"
                    label="Nama Pelanggan"
                    cache-items
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
                    color="success"
                    @click="addNewCustomer"
                  >
                    <v-icon dark>
                      mdi-plus
                    </v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Nomor HP" rules="integer">
              <v-text-field
                :error-messages="errors"
                v-model="phoneNumber"
                label="Nomor HP"
                outlined
                dense
                class="mb-0 mt-8 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Nomor Meja" rules="required|integer">
              <v-autocomplete
                :error-messages="errors"
                v-model="selectTableNumber"
                :items="itemTable"
                :search-input.sync="tableNumber"
                label="Nomor Meja"
                cache-items
                class="mt-2 px-4"
                outlined
                dense
                hide-no-data
                hide-details
                :clearable="true"
              ></v-autocomplete>
            </ValidationProvider>
            <v-card-actions class="mt-6">
              <v-spacer></v-spacer>
              <v-btn color="warning darken-1" text @click="closeDialog">Batal</v-btn>
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

export default {
  props: ['show', 'transaction'],
  components: {
    newCustomerDialog
  },
  data() {
    return {
      customerName: null,
      selectCustomerName: null,
      phoneNumber: null,
      selectTableNumber: null,
      tableNumber: null,
      itemCustomer: [],
      itemTable: [],
      newCustomerDialog: false
    }
  },
  watch: {
    customerName(val) {
      val && val !== this.selectCustomerName && this.querySelections(val);
      this.checkPhoneNumber(val);
    },
    tableNumber(val) {
      val && val !== this.selectTableNumber && this.querySelectionsTable(val);
    }
  },
  methods: {
    querySelections(v) {
      let listCustomer = this.$store.state.listCustomer.map(item => item.name);
      this.itemCustomer = listCustomer.filter(e => {
        return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1;
      });
    },
    querySelectionsTable(v) {
      let listTable = this.$store.state.listTable.map(item => item.table_number);
      this.itemTable = listTable.filter(e => {
        return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1;
      });
    },
    closeDialog() {
      this.$emit('close', false);
    },
    closeDialogCustomer(e) {
      this.newCustomerDialog = e;
    },
    setCustomer(e) {
      this.customerName = e.name;
      this.selectCustomerName = e.name;
      this.newCustomerDialog = false;
    },
    checkPhoneNumber(val) {
      this.$store.state.listCustomer.forEach(element => {
        if (element.name === val) {
          this.phoneNumber = element.phone_number
        }
      });
    },
    addNewCustomer() {
      this.newCustomerDialog = true;
    },
    saveTransaction() {
      let dataForm = this.transaction;
      dataForm.customer_name = this.customerName;
      dataForm.phone_number = this.phoneNumber;
      dataForm.table_number = this.tableNumber;
      if (this.$store.state.selectedTx.id !== undefined) {
        dataForm.id = this.$store.state.selectedTx.id;
      }
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
  },
  created() {
    if (this.$store.state.selectedTx.customer_name !== undefined) {
      this.phoneNumber = this.$store.state.selectedTx.phone_number;
    }
  },
}
</script>
