<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <div class="d-flex flex-row justify-space-between align-center">
          <v-card-title class="ml-0">Detail Pesanan Diterima</v-card-title>
        </div>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(editOrder)">
            <ValidationProvider v-slot="{ errors }" name="Cabang pemesan" rules="required">
              <v-autocomplete
                :error-messages="errors"
                v-model="selectedOrder.destination_outlet"
                :items="$store.state.listOutlet"
                :item-text="textOutlet"
                :item-value="valueOutlet"
                label="Cabang Pemesan"
                cache-items
                class="mb-0 mt-2 px-4"
                outlined
                dense
                hide-no-data
                hide-details
                disabled
                :clearable="true"
              ></v-autocomplete>
            </ValidationProvider>
            <div class="px-4 mt-2">
              <v-data-table
                :headers="headers"
                :items="selectedOrder.ingredients"
                class="elevation-1 scrollbar-custom mb-4"
                hide-default-footer
              ></v-data-table>
            </div>
            <!-- <div class="px-4 mt-3 mb-6">
              <v-btn color="secondary" dark block @click="dialogAddIngredient = true">Tambah Bahan</v-btn>
            </div> -->
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="warning darken-1" text @click="closeDialog">Tutup</v-btn>
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
      selectedOrder: {},
      selectedIngredient: {},
      headers: [
        { text: 'Bahan', value: 'ingredient.name', sortable: false },
        { text: 'Qty', value: 'qty', sortable: false },
        { text: 'Unit', value: 'ingredient.unit', sortable: false }
      ]
    }
  },
  watch: {
    selected(val) {
      this.selectedOrder = val
    }
  },
  methods: {
    textOutlet(item) {
      return item.name
    },
    valueOutlet(item) {
      return item
    },
    closeDialog() {
      this.$emit('closeDialog', false);
    }
  }
}
</script>
