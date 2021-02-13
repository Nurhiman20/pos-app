<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <div class="d-flex flex-row justify-space-between align-center">
          <v-card-title class="ml-0">Edit Kategori</v-card-title>
          <v-btn color="error" outlined @click="goDelete">
            <v-icon class="mr-1">mdi-delete</v-icon>Hapus
          </v-btn>
        </div>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(editIngredient)">
            <ValidationProvider v-slot="{ errors }" name="Nama bahan" rules="required">
              <v-text-field
                :error-messages="errors"
                v-model="selectedIngredient.name"
                label="Nama Bahan"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Kategori bahan" rules="required">
              <v-select
                v-model="selectedIngredient.category"
                :error-messages="errors"
                :items="$store.state.listCategory"
                :item-text="textCategory"
                :item-value="valueCategory"
                label="Kategori Bahan"
                class="mb-0 mt-2 px-4"
                outlined
              ></v-select>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Stok" rules="required|integer">
              <v-text-field
                :error-messages="errors"
                v-model="selectedIngredient.stock"
                label="Stok"
                outlined
                dense
                type="number" 
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Satuan" rules="required">
              <v-select
                v-model="selectedIngredient.unit"
                :error-messages="errors"
                :items="listUnit"
                label="Satuan"
                class="mb-0 mt-2 px-4"
                outlined
              ></v-select>
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
  </div>
</template>

<script>
export default {
  props: ['show', 'selected'],
  data() {
    return {
      selectedIngredient: {},
      listUnit: ['botol (btl)', 'bungkus (bks)', 'box (box)', 'centimeter (cm)', 'gram (g)']
    }
  },
  watch: {
    selected(val) {
      this.selectedIngredient = val
    }
  },
  methods: {    
    textCategory(item) {
      return item.name
    },
    valueCategory(item) {
      return item
    },
    closeDialog() {
      this.$emit('closeDialog', false);
    },
    goDelete() {
      this.$emit("delete", this.selectedIngredient)
    },
    editIngredient() {
      this.$store.dispatch("submitIngredient", this.selectedIngredient)
        .then(() => {
          this.$emit("success", "Bahan telah diedit");
        })
        .catch(() => {
          this.$emit("error", "Terjadi masalah. Silahkan coba lagi nanti");
        });
    }
  }
}
</script>
