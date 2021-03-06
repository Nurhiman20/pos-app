<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <v-card-title class="ml-0">Tambah Resep</v-card-title>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(addRecipe)">
            <ValidationProvider v-slot="{ errors }" name="Nama produk" rules="required">
              <v-autocomplete
                :error-messages="errors"
                v-model="product"
                :items="$store.state.listProduct"
                :item-text="textProduct"
                :item-value="valueProduct"
                label="Nama Produk"
                class="mb-0 mt-2 px-4"
                outlined
                dense
                hide-no-data
                hide-details
                :clearable="true"
              ></v-autocomplete>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Varian" rules="">
              <v-text-field
                :error-messages="errors"
                v-model="variant"
                label="Varian"
                outlined
                dense
                class="mb-0 mt-4 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Harga" rules="required|integer">
              <v-text-field
                :error-messages="errors"
                v-model="price"
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
                :items="listIngredient"
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
import addIngredientDialog from '../components/TambahBahanResep';
import editIngredientDialog from '../components/EditBahanResep';

export default {
  props: ['show'],
  components: {
    addIngredientDialog,
    editIngredientDialog
  },
  data() {
    return {
      product: null,
      variant: null,
      price: null,
      listIngredient: [],
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
    product(val) {
      if (val !== null) {
       this.price = val.price; 
       if (val.ingredients !== undefined) {
        this.listIngredient = val.ingredients; 
        }
      }
    }
  },
  methods: {
    formatCurrency(val) {
      return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
    },
    randomId() {
      var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      var uniqid = 'rec-' + randLetter + Date.now();
      return uniqid
    },    
    textProduct(item) {
      return item.name
    },
    valueProduct(item) {
      return item
    },    
    closeDialogAdd(e) {
      this.dialogAddIngredient = e;
    },
    closeDialogEdit(e) {
      this.dialogEditIngredient = e;
    },
    closeDialog() {
      this.product = null;
      this.variant = null;
      this.price = null;
      this.listIngredient = [];   
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
    addIngredient(e) {
      this.listIngredient.push(e);
      this.dialogAddIngredient = false;
    },
    addRecipe() {
      let dataForm = {
        id: this.randomId(),
        id_product: this.product.id,
        product: this.product,
        variant: this.variant,
        price: this.price,
        ingredients: this.listIngredient
      };
      this.$store.dispatch("submitRecipe", dataForm)
        .then(() => {
          this.product = null;
          this.variant = null;
          this.price = null;
          this.listIngredient = [];       
          this.$emit("success", "Resep telah disimpan");
        })
        .catch(() => {
          this.$emit("error", "Terjadi masalah. Silahkan coba lagi nanti");
        });
    }
  }
}
</script>
