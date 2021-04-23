<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <div class="d-flex flex-row justify-space-between align-center">
          <v-card-title class="ml-0">Edit Pesanan Transfer</v-card-title>
          <v-btn color="error" outlined @click="goDelete">
            <v-icon class="mr-1">mdi-delete</v-icon>Hapus
          </v-btn>
        </div>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(editOrder)">
            <ValidationProvider v-slot="{ errors }" name="Cabang tujuan" rules="required">
              <v-autocomplete
                :error-messages="errors"
                v-model="selectedOrder.destination_outlet"
                :items="$store.state.listOutlet"
                :item-text="textOutlet"
                :item-value="valueOutlet"
                label="Cabang Tujuan"
                cache-items
                class="mb-0 mt-2 px-4"
                outlined
                dense
                hide-no-data
                hide-details
                :clearable="true"
              ></v-autocomplete>
            </ValidationProvider>
            <div class="px-4 mt-2">
              <v-data-table
                :headers="headers"
                :items="selectedOrder.ingredients"
                class="elevation-1 scrollbar-custom mb-4"
                hide-default-footer
                @click:row="goToEdit"
              ></v-data-table>
            </div>
            <!-- <div class="px-4 mt-3 mb-6">
              <v-btn color="secondary" dark block @click="dialogAddIngredient = true">Tambah Bahan</v-btn>
            </div> -->
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="warning darken-1" text @click="closeDialog">Batal</v-btn>
              <v-btn color="primary" dark type="submit" :loading="$store.state.loading">Perbarui</v-btn>
            </v-card-actions>
          </v-form>
        </ValidationObserver>
      </v-card>
    </v-dialog>

    <add-ingredient-dialog
      :show="dialogAddIngredient"
      @closeDialog="closeDialogAdd"
      @add="addIngredient"
    ></add-ingredient-dialog>

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
import addIngredientDialog from '@/components/DialogTambahBahan';
import editIngredientDialog from '@/components/DialogEditBahan';

export default {
  props: ['show', 'selected'],
  components: {
    addIngredientDialog,
    editIngredientDialog
  },
  data() {
    return {
      selectedOrder: {},
      selectedIngredient: {},
      headers: [
        { text: 'Bahan', value: 'ingredient.name', sortable: false },
        { text: 'Qty', value: 'qty', sortable: false },
        { text: 'Unit', value: 'ingredient.unit', sortable: false }
      ],
      dialogAddIngredient: false,
      dialogEditIngredient: false
    }
  },
  watch: {
    selected(val) {
      this.selectedOrder = val
    }
  },
  methods: {
    formatCurrency(val) {
      return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
    },
    randomId() {
      var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      var uniqid = 'order-tf-' + randLetter + Date.now();
      return uniqid
    },    
    textOutlet(item) {
      return item.name
    },
    valueOutlet(item) {
      return item
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
      this.listIngredient.forEach(element => {
        if (element.id_ingredient !== e.id_ingredient) {
          listIngredient.push(element);
        }
      });

      this.listIngredient = listIngredient;
      this.dialogEditIngredient = false;
    },
    editIngredient(e) {
      let listIngredient = [];
      this.selectedOrder.ingredients.forEach(element => {
        if (element.id_ingredient === e.id_ingredient) {
          listIngredient.push(e);
        } else {
          listIngredient.push(element);
        }
      });

      this.selectedOrder.ingredients = listIngredient;
      this.dialogEditIngredient = false;
    },
    addIngredient(e) {
      this.selectedOrder.ingredients.push(e);
      this.dialogAddIngredient = false;
    },
    goDelete() {
      this.$emit("delete", this.selectedOrder);
    },
    editOrder() {
      this.$store.dispatch("updateTransfer", this.selectedOrder)
        .then(() => { 
          this.$emit("success", "Pesanan telah diperbarui");
        })
        .catch(() => {
          this.$emit("error", "Terjadi masalah. Silahkan coba lagi nanti");
        });
    }
  }
}
</script>
