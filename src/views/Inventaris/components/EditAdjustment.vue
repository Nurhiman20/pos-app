<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <div class="d-flex flex-row justify-space-between align-center">
          <div class="d-flex flex-column">
            <v-card-title class="ml-0">Edit Adjustment</v-card-title>
            <v-card-subtitle>{{ selectedAdjustment.ingredient.name }}</v-card-subtitle>
          </div>
          <v-btn color="error" outlined @click="goDelete">
            <v-icon class="mr-1">mdi-delete</v-icon>Hapus
          </v-btn>
        </div>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(editAdjustment)">
            <ValidationProvider v-slot="{ errors }" name="In stock" rules="">
              <v-text-field
                :error-messages="errors"
                v-model="selectedAdjustment.ingredient.ending_stock"
                label="In Stock"
                :suffix="selectedAdjustment.ingredient.unit"
                outlined
                dense
                disabled
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Actual stock" rules="required|integer">
              <v-text-field
                :error-messages="errors"
                v-model="selectedAdjustment.actual_stock"
                label="Actual Stock"
                :suffix="selectedAdjustment.ingredient.unit"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Keterangan" rules="max:200">
              <v-textarea
                v-model="selectedAdjustment.notes"
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
  </div>
</template>

<script>
export default {
  props: ['show', 'selected'],
  data() {
    return {
      selectedAdjustment: {
        ingredient: {
          name: null
        }
      }
    }
  },
  watch: {
    selected(val) {
      this.selectedAdjustment = val;
      console.log(this.selectedAdjustment.ingredient);
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
    goDelete() {
      this.$emit("delete", this.selectedAdjustment)
    },
    editAdjustment() {
      let dataForm = {
        ...this.selectedAdjustment,
        adjustment: parseFloat(this.selectedAdjustment.in_stock) - parseFloat(this.selectedAdjustment.actual_stock)
      }
      this.$store.dispatch("updateAdjustment", dataForm)
        .then(() => {
          this.$emit("success", "Adjustment telah diedit");
        })
        .catch(() => {
          this.$emit("error", "Terjadi masalah. Silahkan coba lagi nanti");
        });
    }
  }
}
</script>
