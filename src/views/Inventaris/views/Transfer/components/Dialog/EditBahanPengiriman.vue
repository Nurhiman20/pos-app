<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <div class="d-flex flex-column">
          <v-card-title class="ml-0">Edit Bahan / Produk</v-card-title>
          <v-card-subtitle>{{ selectedIngredient.ingredient.name }}</v-card-subtitle>
        </div>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(editIngredient)">
            <ValidationProvider v-slot="{ errors }" name="Dipesan" rules="required">
              <v-text-field
                :error-messages="errors"
                v-model="selectedIngredient.qty"
                label="Pesanan"
                :suffix="selectedIngredient.ingredient.unit"
                outlined
                dense
                disabled
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Total dikirim" rules="required">
              <v-text-field
                :error-messages="errors"
                v-model="total"
                label="Total Dikirim"
                :suffix="selectedIngredient.ingredient.unit"
                disabled
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Kirim" rules="required">
              <v-text-field
                :error-messages="errors"
                v-model="delivered"
                label="Kirim"
                :suffix="selectedIngredient.ingredient.unit"
                persistent-hint
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="warning darken-1" text @click="closeDialog">Batal</v-btn>
              <v-btn color="primary" dark type="submit" :loading="$store.state.loading">Perbarui</v-btn>
            </v-card-actions>
          </v-form>
        </ValidationObserver>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ['show', 'selected', 'rvOrder'],
  data() {
    return {
      delivered: null,
      total: 0,
      selectedIngredient: {
        ingredient: {
          name: null
        }
      }
    }
  },
  watch: {
    selected(val) {
      this.selectedIngredient = val;
      if (val.delivered !== null || val.delivered !== undefined) {
        this.delivered = val.delivered;
        this.totalDeliver();
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog', false);
    },
    textIngredient(item) {
      return item.name
    },
    valueIngredient(item) {
      return item
    },
    totalDeliver() {
      let total = 0;
      this.rvOrder.delivery.forEach(rv => {
        rv.ingredients.forEach(ing => {
          if (ing.id_ingredient === this.selectedIngredient.id_ingredient) {
            total += parseFloat(ing.delivered);
          }
        })
      });

      this.total = total;
    },
    editIngredient() {
      let dataForm = {
        ...this.selectedIngredient,
        delivered: this.delivered,
        total_deliver: parseFloat(this.delivered) + this.total
      }
      this.$emit('edit', dataForm);
    }
  }
}
</script>
