<template>
  <div>
    <v-dialog v-model="show" persistent width="500">
      <v-card class="pa-3">
        <div class="d-flex flex-row justify-space-between align-center">
          <v-card-title class="ml-0">Edit Penerimaan</v-card-title>
          <v-btn color="error" outlined @click="goDelete">
            <v-icon class="mr-1">mdi-delete</v-icon>Hapus
          </v-btn>
        </div>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(editReceive)">
            <ValidationProvider v-slot="{ errors }" name="Pemesanan" rules="required">
              <v-autocomplete
                :error-messages="errors"
                v-model="selectedReceive.order"
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
            <div class="px-4 mt-6 mb-6" v-if="selectedReceive.ingredients.length !== 0">
              <v-data-table
                :headers="headers"
                :items="selectedReceive.ingredients"
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
                v-model="selectedReceive.notes"
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
              <v-btn color="primary" dark type="submit" :loading="$store.state.loading">Edit</v-btn>
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
import editIngredientDialog from '../components/EditBahanPenerimaan';

export default {
  props: ['show', 'selected'],
  components: {
    editIngredientDialog
  },
  data() {
    return {
      selectedReceive: {},
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
    selected(val) {
      this.selectedReceive = val
    }
  },
  methods: {
    formatCurrency(val) {
      return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
    },
    textOrder(item) {
      let strText = '(' + item.id + ') ' + item.supplier.name + ' - ' + item.supplier.phone_number;
      return strText
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
      this.selectedReceive.ingredients.forEach(element => {
        if (element.id_ingredient === e.id_ingredient) {
          listIngredient.push(e);
        } else {
          listIngredient.push(element);
        }
      });

      this.selectedReceive.ingredients = listIngredient;
      this.dialogEditIngredient = false;
    },
    addIngredient(e) {
      this.selectedReceive.ingredients.push(e);
      this.dialogAddIngredient = false;
    },
    checkStatus() {
      let countUnfulfilled = 0;
      this.selectedReceive.ingredients.forEach(item => {
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
    goDelete() {
      this.$emit("delete", this.selectedReceive);
    },
    editReceive() {
      let dataForm = {
        ...this.selectedReceive,
        status: this.checkStatus()
      }
      this.$store.dispatch("updateReceive", dataForm)
        .then(() => {
          this.$emit("success", "Penerimaan telah diperbarui");
        })
        .catch(() => {
          this.$emit("error", "Terjadi masalah. Silahkan coba lagi nanti");
        });
    }
  },
}
</script>
