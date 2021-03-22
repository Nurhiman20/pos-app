<template>
  <div>
    <v-dialog v-model="show" persistent width="500">
      <v-card class="pa-3">
        <div class="d-flex flex-row justify-space-between align-center">
          <div class="d-flex flex-column">
            <v-card-title class="ml-0">Detail Penerimaan</v-card-title>
            <v-card-subtitle>{{ textOrder(selectedReceive) }}</v-card-subtitle>
          </div>
        </div>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(editReceive)">
            <ValidationProvider v-slot="{ errors }" name="Waktu" rules="">
              <v-text-field
                :error-messages="errors"
                v-model="selectedReceive.time"
                label="Waktu"
                outlined
                dense
                disabled
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <div class="px-4 mt-0 mb-6" v-if="selectedReceive.ingredients.length !== 0">
              <v-data-table
                :headers="headers"
                :items="selectedReceive.ingredients"
                class="elevation-1 scrollbar-custom"
                hide-default-footer
              ></v-data-table>
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
                disabled
              ></v-textarea>
            </ValidationProvider>
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
      selectedReceive: {
        order: { 
          id: null 
        },
        supplier: {
          name: null,
          phone_number: null
        }
      },
      selectedIngredient: {},
      headers: [
        { text: 'Bahan', value: 'ingredient.name', sortable: false },
        { text: 'Dipesan', value: 'order', sortable: false },
        { text: 'Diterima', value: 'received', sortable: false }
      ]
    }
  },
  watch: {
    selected(val) {
      this.selectedReceive = val
    }
  },
  methods: {
    textOrder(item) {
      let strText = '(' + item.id + ') ' + item.supplier.name + ' - ' + item.supplier.phone_number;
      return strText
    },
    valueOrder(item) {
      return item
    },
    closeDialog() {
      this.$emit('closeDialog', false);
    }
  }
}
</script>
