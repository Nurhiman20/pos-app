<template>
  <div>
    <v-dialog v-model="show" persistent width="500">
      <v-card class="pa-3">
        <div class="d-flex flex-row justify-space-between align-center">
          <div class="d-flex flex-column">
            <v-card-title class="ml-0">Edit Resep</v-card-title>
            <v-card-subtitle>{{ selectedRecipe.product.name }}</v-card-subtitle>
          </div>
          <v-btn color="error" outlined @click="goDelete">
            <v-icon class="mr-1">mdi-delete</v-icon>Hapus
          </v-btn>
        </div>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(editRecipe)">
            <ValidationProvider v-slot="{ errors }" name="Varian" rules="">
              <v-text-field
                :error-messages="errors"
                v-model="selectedRecipe.variant"
                label="Varian"
                outlined
                dense
                class="mb-0 mt-6 px-4"
                :disabled="selectedRecipe.variant === null ? true : false"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Harga" rules="required|integer">
              <v-text-field
                :error-messages="errors"
                v-model="selectedRecipe.price"
                label="Harga"
                outlined
                dense
                type="number" 
                class="mb-0 px-4"
              ></v-text-field>
            </ValidationProvider>
            <div class="px-4 mt-2">
              <v-data-table
                :headers="headers"
                :items="selectedRecipe.ingredients"
                class="elevation-1 scrollbar-custom"
                hide-default-footer
                @click:row="goToEdit"
              ></v-data-table>
            </div>
            <div class="px-4 mt-3 mb-6">
              <v-btn color="secondary" dark block @click="dialogAddIngredient = true">Tambah Bahan</v-btn>
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
import addIngredientDialog from '../components/TambahBahanResep';
import editIngredientDialog from '../components/EditBahanResep';

export default {
  props: ['show', 'selected'],
  components: {
    addIngredientDialog,
    editIngredientDialog
  },
  data() {
    return {
      selectedRecipe: {
        product: { 
          name: null
        }
      },
      selectedIngredient: {},
      headers: [
        { text: 'Bahan', value: 'ingredient.name', sortable: false },
        { text: 'Qty', value: 'before_convert', sortable: false },
        { text: 'Unit', value: 'unit', sortable: false }
      ],
      dialogAddIngredient: false,      
      dialogEditIngredient: false
    }
  },
  watch: {
    selected(val) {
      this.selectedRecipe = val
    }
  },
  methods: {
    formatCurrency(val) {
      return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
    },
    textProduct(item) {
      return item.name
    },
    valueProduct(item) {
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
      this.selectedRecipe.ingredients.forEach(element => {
        if (element.id_ingredient !== e.id_ingredient) {
          listIngredient.push(element);
        }
      });

      this.selectedRecipe.ingredients = listIngredient;
      this.dialogEditIngredient = false;
    },
    editIngredient(e) {
      let listIngredient = [];
      this.selectedRecipe.ingredients.forEach(element => {
        if (element.id_ingredient === e.id_ingredient) {
          listIngredient.push(e);
        } else {
          listIngredient.push(element);
        }
      });

      this.selectedRecipe.ingredients = listIngredient;
      this.dialogEditIngredient = false;
    },
    addIngredient(e) {
      this.selectedRecipe.ingredients.push(e);
      this.dialogAddIngredient = false;
    },
    goDelete() {
      this.$emit("delete", this.selectedRecipe);
    },
    editRecipe() {
      this.$store.dispatch("updateRecipe", this.selectedRecipe)
        .then(() => {
          this.$emit("success", "Resep telah disimpan");
        })
        .catch(() => {
          this.$emit("error", "Terjadi masalah. Silahkan coba lagi nanti");
        });
    }
  },
}
</script>
