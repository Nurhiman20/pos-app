<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <v-card-title class="ml-0">Tambah Pengiriman</v-card-title>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(addDelivery)">
            <ValidationProvider v-slot="{ errors }" name="Pesanan diterima" rules="required">
              <v-autocomplete
                :error-messages="errors"
                v-model="rvOrder"
                :items="$store.getters.listRvOrderTransfer"
                :item-text="textOrder"
                :item-value="valueOrder"
                label="Pesanan Diterima"
                class="mb-0 mt-2 px-4"
                outlined
                dense
                hide-no-data
                hide-details
                :clearable="true"
              ></v-autocomplete>
            </ValidationProvider>
            <div class="px-4 mt-6" v-if="rvOrder !== null">
              <p class="mb-2">Riwayat Pengiriman</p>
              <v-data-table
                :headers="headersHistory"
                :items="rvOrder.delivery"
                class="elevation-1 scrollbar-custom"
                hide-default-footer
              ></v-data-table>
            </div>
            <div class="px-4 my-6">
              <p class="mb-2">Pengiriman Baru</p>
              <v-data-table
                :headers="headers"
                :items="listIngredient"
                class="elevation-1 scrollbar-custom"
                hide-default-footer
                @click:row="goToEdit"
              ></v-data-table>
            </div>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="warning darken-1" text @click="closeDialog">Batal</v-btn>
              <v-btn color="primary" dark type="submit" :loading="$store.state.loading">Kirim</v-btn>
            </v-card-actions>
          </v-form>
        </ValidationObserver>
      </v-card>
    </v-dialog>

    <edit-ingredient-dialog
      :show="dialogEditIngredient"
      :selected="selectedIngredient"
      :rvOrder="rvOrder"
      @closeDialog="closeDialogEdit"
      @edit="editIngredient"
    ></edit-ingredient-dialog>
  </div>
</template>

<script>
import * as moment from 'moment';
import editIngredientDialog from './EditBahanPengiriman';

export default {
  props: ['show'],
  components: {
    editIngredientDialog
  },
  data() {
    return {
      rvOrder: null,
      listIngredient: [],
      listOrderedIngredient: [],
      selectedIngredient: {},
      headers: [
        { text: 'Bahan', value: 'ingredient.name', sortable: false },
        { text: 'Qty', value: 'qty', sortable: false },
        { text: 'Unit', value: 'ingredient.unit', sortable: false },
        { text: 'Kirim', value: 'delivered', sortable: false }
      ],   
      headersHistory: [
        { text: 'ID Pesanan Diterima', value: 'id', sortable: false },
        { text: 'Waktu', value: 'time', sortable: false }
      ],
      dialogEditIngredient: false
    }
  },
  watch: {
    rvOrder(val) {
      if (val !== null) {
        this.listIngredient = val.ingredients;
      } else {
        this.listIngredient = [];
      }
    }
  },
  methods: {
    formatCurrency(val) {
      return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
    },
    randomId() {
      var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      var uniqid = 'deliv-tf-' + randLetter + Date.now();
      return uniqid
    },    
    textOrder(item) {
      return item.destination_outlet.name + ' - ' + item.ingredients.length + ' bahan' + ' - ' + item.time
    },
    valueOrder(item) {
      return item
    },
    closeDialogEdit(e) {
      this.dialogEditIngredient = e;
    },
    closeDialog() {
      this.$emit('closeDialog', false);
    },
    goToEdit(e) {
      this.selectedIngredient = e;
      this.dialogEditIngredient = true;
    },
    editIngredient(e) {
      let listIngredient = [];
      this.listIngredient.forEach(element => {
        if (element.id_ingredient === e.id_ingredient) {
          listIngredient.push(e);
        } else {
          listIngredient.push(element);
        }
      });

      this.listIngredient = listIngredient;
      this.dialogEditIngredient = false;
    },
    checkStatus() {
      let countUnfulfilled = 0;
      this.listIngredient.forEach(item => {
        if (parseFloat(item.qty) > parseFloat(item.total_deliver)) {
          countUnfulfilled += 1;
        }
      });

      if (countUnfulfilled === 0) {
        countUnfulfilled = 0;
        return 'Terpenuhi'
      } else {        
        countUnfulfilled = 0;
        return 'Belum Terpenuhi'
      }
    },
    addDelivery() {
      let dataForm = {
        id: this.randomId(),
        id_outlet: this.$store.state.account.id,
        outlet: this.$store.state.account,
        id_order: this.rvOrder.id,
        order: this.rvOrder,
        destination_outlet: this.rvOrder.outlet,
        time: moment().format('MM/DD/YYYY, h:mm:ss a'),
        ingredients: this.listIngredient,
        status: 'Pengiriman',
        delivery_status: this.checkStatus()
      };
      this.$store.dispatch("submitDeliveryTransfer", dataForm)
        .then(() => {
          this.rvOrder = null;
          this.listIngredient = [];       
          this.$emit("success", "Pengiriman telah disimpan");
        })
        .catch(() => {
          this.$emit("error", "Terjadi masalah. Silahkan coba lagi nanti");
        });
    }
  }
}
</script>
