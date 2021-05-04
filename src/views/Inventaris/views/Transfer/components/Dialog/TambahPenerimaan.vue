<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <v-card-title class="ml-0">Tambah Penerimaan</v-card-title>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(addReceiveTf)">
            <ValidationProvider v-slot="{ errors }" name="Pengiriman diterima" rules="required">
              <v-autocomplete
                :error-messages="errors"
                v-model="rvDeliver"
                :items="$store.getters.listRvDelivery"
                :item-text="textOrder"
                :item-value="valueOrder"
                label="Pengiriman Diterima"
                class="mb-0 mt-2 px-4"
                outlined
                dense
                hide-no-data
                hide-details
                :clearable="true"
              ></v-autocomplete>
            </ValidationProvider>
            <div class="px-4 mt-6" v-if="rvDeliver !== null">
              <p class="mb-2">Riwayat Penerimaan</p>
              <v-data-table
                :headers="headersHistory"
                :items="rvDeliver.receive"
                class="elevation-1 scrollbar-custom"
                hide-default-footer
                @click:row="goToDetail"
              ></v-data-table>
            </div>
            <div class="px-4 my-6">
              <p class="mb-2">Penerimaan Baru</p>
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
              <v-btn color="primary" dark type="submit" :loading="$store.state.loading">Simpan</v-btn>
            </v-card-actions>
          </v-form>
        </ValidationObserver>
      </v-card>
    </v-dialog>
    
    <detail-history-dialog      
      :show="dialogHistory"
      :selected="selectedHistory"
      :type="'add'"
      @close="closeDialogHistory"
    ></detail-history-dialog>

    <edit-ingredient-dialog
      :show="dialogEditIngredient"
      :selected="selectedIngredient"
      :rvDeliver="rvDeliver"
      @closeDialog="closeDialogEdit"
      @edit="editIngredient"
    ></edit-ingredient-dialog>
  </div>
</template>

<script>
import * as moment from 'moment';
import detailHistoryDialog from './DetailPenerimaan';
import editIngredientDialog from './EditBahanPenerimaan';

export default {
  props: ['show'],
  components: {
    detailHistoryDialog,
    editIngredientDialog
  },
  data() {
    return {
      rvDeliver: null,
      listIngredient: [],
      listOrderedIngredient: [],
      selectedIngredient: {},
      selectedHistory: {},
      headers: [
        { text: 'Bahan', value: 'ingredient.name', sortable: false },
        { text: 'Dipesan', value: 'qty', sortable: false },
        { text: 'Dikirim', value: 'delivered', sortable: false },
        { text: 'Unit', value: 'ingredient.unit', sortable: false },
        { text: 'Diterima', value: 'received', sortable: false }
      ],   
      headersHistory: [
        { text: 'ID Penerimaan', value: 'id', sortable: false },
        { text: 'Waktu', value: 'time', sortable: false }
      ],
      dialogEditIngredient: false,
      dialogHistory: false
    }
  },
  watch: {
    rvDeliver(val) {
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
      var uniqid = 'rv-tf-' + randLetter + Date.now();
      return uniqid
    },    
    textOrder(item) {
      return item.outlet.name + ' - ' + item.ingredients.length + ' bahan' + ' - ' + item.time
    },
    valueOrder(item) {
      return item
    },
    closeDialogEdit(e) {
      this.dialogEditIngredient = e;
    },
    closeDialogHistory(e) {
      this.dialogHistory = e;
    },
    closeDialog() {
      this.$emit('closeDialog', false);
    },
    goToEdit(e) {
      this.selectedIngredient = e;
      this.dialogEditIngredient = true;
    },
    goToDetail(e) {
      this.selectedHistory = e;
      this.dialogHistory = true;
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
        if (parseFloat(item.delivered) > parseFloat(item.total_receive)) {
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
    addReceiveTf() {
      let dataForm = {
        id: this.randomId(),
        id_outlet: this.$store.state.account.id,
        outlet: this.$store.state.account,
        id_order: this.rvDeliver.id,
        order: this.rvDeliver,
        delivery_outlet: this.rvDeliver.outlet,
        time: moment().format('MM/DD/YYYY, h:mm:ss a'),
        ingredients: this.listIngredient,
        status: 'Penerimaan',
        receive_status: this.checkStatus()
      };
      this.$store.dispatch("submitReceiveTransfer", dataForm)
        .then(() => {
          this.rvDeliver = null;
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
