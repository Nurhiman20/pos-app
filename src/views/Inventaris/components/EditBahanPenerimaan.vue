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
                v-model="selectedIngredient.order"
                label="Order"
                :suffix="selectedIngredient.ingredient.unit"
                outlined
                dense
                disabled
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Total diterima" rules="required">
              <v-text-field
                :error-messages="errors"
                v-model="total"
                label="Total Diterima"
                :suffix="selectedIngredient.ingredient.unit"
                disabled
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Diterima" rules="required">
              <v-text-field
                :error-messages="errors"
                v-model="received"
                label="Diterima"
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
  props: ['show', 'selected', 'order'],
  data() {
    return {
      received: null,
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
      if (val.received !== null || val.received !== undefined) {
        this.received = val.received;
        this.totalReceived();
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
    totalReceived() {
      let total = 0;
      this.order.receive.forEach(rv => {
        rv.ingredients.forEach(ing => {
          if (ing.id_ingredient === this.selectedIngredient.id_ingredient) {
            total += parseFloat(ing.received);
          }
        })
      });

      this.total = total;
    },
    editIngredient() {
      let dataForm = {
        ...this.selectedIngredient,
        received: this.received,
        total_receive: parseFloat(this.received) + this.totalReceived()
      }
      this.$emit('edit', dataForm);
    }
  }
}
</script>
