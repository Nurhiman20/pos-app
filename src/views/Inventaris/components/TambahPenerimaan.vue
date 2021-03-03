<template>
  <div>
    <v-dialog v-model="show" persistent width="500">
      <v-card class="pa-3">
        <v-card-title class="ml-0">Tambah Penerimaan</v-card-title>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(addOrder)">
            <ValidationProvider v-slot="{ errors }" name="Pemesanan" rules="required">
              <v-autocomplete
                :error-messages="errors"
                v-model="order"
                :items="$store.state.listOrder"
                :item-text="textOrder"
                :item-value="valueOrder"
                label="Pemesanan"
                cache-items
                class="mb-0 mt-2 px-4"
                outlined
                dense
                hide-no-data
                hide-details
                :clearable="true"
              ></v-autocomplete>
            </ValidationProvider>
            <div class="px-4 mt-6 mb-6" v-if="listIngredient.length !== 0">
              <v-data-table
                :headers="headers"
                :items="listIngredient"
                class="elevation-1 scrollbar-custom"
                hide-default-footer
                @click:row="goToEdit"
              >
                <template v-slot:item.total="{item}">
                  <p class="my-auto">{{ formatCurrency(item.order * item.unit_cost) }}</p>
                </template>
              </v-data-table>
            </div>
            <ValidationProvider v-slot="{ errors }" name="Keterangan" rules="max:200">
              <v-textarea
                v-model="notes"
                :error-messages="errors"
                label="Keterangan"
                class="mb-0 mt-2 px-4"
                rows="3"
                outlined
                counter
                auto-grow
              ></v-textarea>
            </ValidationProvider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="warning darken-1" text @click="closeDialog">Batal</v-btn>
              <v-btn color="primary" dark type="submit" :loading="$store.state.loading">Tambahkan</v-btn>
            </v-card-actions>
          </v-form>
        </ValidationObserver>
      </v-card>
    </v-dialog>

    <!-- dialog edit bahan -->
    <edit-ingredient-dialog
      :show="dialogEditIngredient"
      :selected="selectedIngredient"
      @closeDialog="closeDialogEdit"
      @edit="editIngredient"
    ></edit-ingredient-dialog>
  </div>
</template>

<script>
import * as moment from 'moment';
import editIngredientDialog from '../components/EditBahanPenerimaan';

export default {
  props: ['show'],
  components: {
    editIngredientDialog
  },
  data() {
    return {
      order: null,
      notes: null,
      listIngredient: [],
      selectedIngredient: {},
      headers: [
        { text: 'Bahan', value: 'ingredient.name', sortable: false },
        { text: 'Dipesan', value: 'order', sortable: false },
        { text: 'Unit Cost', value: 'unit_cost', sortable: false },
        { text: 'Total (Rp)', value: 'total', sortable: false },
        { text: 'Diterima', value: 'received', sortable: false }
      ],
      dialogEditIngredient: false
    }
  },
  watch: {
    order(val) {
      this.listIngredient = val.ingredients;
    }
  },
  methods: {
    formatCurrency(val) {
      return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
    },
    textOrder(item) {
      let strText = '(' + item.id + ') ' + item.supplier.name + ' - ' + item.supplier.phone_number + ' ';
      let strIng = '(';
      item.ingredients.forEach((ing, index) => {
        if (index < item.ingredients.length - 1) {
          strIng += ing.ingredient.name + ', '
        } else {
          strIng += ing.ingredient.name + ')'
        }
      });
      strText += strIng;
      return strText
    },
    valueOrder(item) {
      return item
    },
    randomId() {
      var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      var uniqid = 'rv-' + randLetter + Date.now();
      return uniqid
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
        if (parseFloat(item.order) > parseFloat(item.received)) {
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
    addOrder() {
      let dataForm = {
        id: this.randomId(),
        id_order: this.order.id,
        order: this.order,
        ingredients: this.listIngredient,
        supplier: this.order.supplier,
        notes: this.notes,
        time: moment().format('MM/DD/YYYY, h:mm:ss a'),
        status: this.checkStatus()
      };
      this.$store.dispatch("submitReceive", dataForm)
        .then(() => {
          this.order = null;
          this.notes = null;
          this.listIngredient = [];
          this.$emit("success", "Penerimaan telah disimpan");
        })
        .catch(() => {
          this.$emit("error", "Terjadi masalah. Silahkan coba lagi nanti");
        });
    }
  },
}
</script>
