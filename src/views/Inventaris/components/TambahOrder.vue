<template>
  <div>
    <v-dialog v-model="show" persistent width="500">
      <v-card class="pa-3">
        <v-card-title class="ml-0">Tambah Order</v-card-title>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(addOrder)">
            <ValidationProvider v-slot="{ errors }" name="Supplier" rules="required">
              <v-autocomplete
                :error-messages="errors"
                v-model="supplier"
                :items="$store.state.listSupplier"
                :item-text="textSupplier"
                :item-value="valueSupplier"
                label="Supplier"
                cache-items
                class="mb-0 mt-2 px-4"
                outlined
                dense
                hide-no-data
                hide-details
                :clearable="true"
              ></v-autocomplete>
            </ValidationProvider>
            <div class="px-4 mt-6" v-if="listSelectedIngredient.length !== 0">
              <v-data-table
                :headers="headers"
                :items="listSelectedIngredient"
                class="elevation-1 scrollbar-custom"
                hide-default-footer
                @click:row="goToEdit"
              >
                <template v-slot:item.total="{item}">
                  <p class="my-auto">{{ formatCurrency(item.order * item.unit_cost) }}</p>
                </template>
              </v-data-table>
            </div>
            <div class="px-4 mt-3 mb-6">
              <v-btn color="secondary" dark block @click="dialogAddIngredient = true">Tambah Bahan</v-btn>
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

    <!-- dialog tambah bahan -->
    <add-ingredient-dialog
      :show="dialogAddIngredient"
      @closeDialog="closeDialogAdd"
      @add="addIngredient"
    ></add-ingredient-dialog>

    <!-- dialog edit bahan -->
    <edit-ingredient-dialog
      :show="dialogEditIngredient"
      :selected="selectedIngredient"
      @closeDialog="closeDialogEdit"
      @edit="editIngredient"
      @delete="deleteIngredient"
    ></edit-ingredient-dialog>
  </div>
</template>

<script>
import * as moment from 'moment';
import addIngredientDialog from '../components/TambahBahanOrder';
import editIngredientDialog from '../components/EditBahanOrder';

export default {
  props: ['show'],
  components: {
    addIngredientDialog,
    editIngredientDialog
  },
  data() {
    return {
      supplier: null,
      notes: null,
      listSelectedIngredient: [],
      selectedIngredient: {},
      headers: [
        { text: 'Bahan', value: 'ingredient.name', sortable: false },
        { text: 'In Stock', value: 'in_stock', sortable: false },
        { text: 'Order', value: 'order', sortable: false },
        { text: 'Unit Cost', value: 'unit_cost', sortable: false },
        { text: 'Total (Rp)', value: 'total', sortable: false },
        { text: 'Diterima', value: 'received', sortable: false }
      ],
      dialogAddIngredient: false,      
      dialogEditIngredient: false
    }
  },
  methods: {
    formatCurrency(val) {
      return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
    },
    textSupplier(item) {
      return item.name
    },
    valueSupplier(item) {
      return item
    },
    randomId() {
      var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      var uniqid = 'order-' + randLetter + Date.now();
      return uniqid
    },
    closeDialogAdd(e) {
      this.dialogAddIngredient = e;
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
    deleteIngredient(e) {
      let listIngredient = [];
      this.listSelectedIngredient.forEach(element => {
        if (element.id_ingredient !== e.id_ingredient) {
          listIngredient.push(element);
        }
      });

      this.listSelectedIngredient = listIngredient;
      this.dialogEditIngredient = false;
    },
    editIngredient(e) {
      let listIngredient = [];
      this.listSelectedIngredient.forEach(element => {
        if (element.id_ingredient === e.id_ingredient) {
          listIngredient.push(e);
        } else {
          listIngredient.push(element);
        }
      });

      this.listSelectedIngredient = listIngredient;
      this.dialogEditIngredient = false;
    },
    addIngredient(e) {
      this.listSelectedIngredient.push(e);
      this.dialogAddIngredient = false;
    },
    checkStatus() {
      let countUnfulfilled = 0;
      this.listSelectedIngredient.forEach(item => {
        if (item.order > item.received) {
          countUnfulfilled += 1;
        }
      });

      if (countUnfulfilled > 0) {
        return 'Belum terpenuhi'
      } else {
        return 'Terpenuhi'
      }
    },
    addOrder() {
      let dataForm = {
        id: this.randomId(),
        ingredients: this.listSelectedIngredient,
        supplier: this.supplier,
        notes: this.notes,
        status: this.checkStatus(),
        time: moment().format('MM/DD/YYYY, h:mm:ss a')
      };
      this.$store.dispatch("submitOrder", dataForm)
        .then(() => {
          this.supplier = null;
          this.notes = null;
          this.listSelectedIngredient = [];
          this.$emit("success", "Order telah disimpan");
        })
        .catch(() => {
          this.$emit("error", "Terjadi masalah. Silahkan coba lagi nanti");
        });
    }
  },
}
</script>
