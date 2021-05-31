<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <div class="d-flex flex-row justify-space-between align-center">
          <v-card-title class="ml-0">Edit Bahan</v-card-title>
          <v-btn color="error" outlined @click="goDelete">
            <v-icon class="mr-1">mdi-delete</v-icon>Hapus
          </v-btn>
        </div>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(editIngredient)">
            <ValidationProvider v-slot="{ errors }" name="Nama bahan" rules="required">
              <v-autocomplete
                :error-messages="errors"
                v-model="selectedIngredient.ingredient"
                :items="$store.state.listIngredient"
                :item-text="textIngredient"
                :item-value="valueIngredient"
                label="Nama Bahan"
                cache-items
                class="mb-0 mt-2 px-4"
                outlined
                dense
                hide-no-data
                hide-details
                :clearable="true"
              ></v-autocomplete>
            </ValidationProvider>
            <v-row no-gutters>
              <v-col cols="6">
                <ValidationProvider v-slot="{ errors }" name="Kuantitas" rules="required">
                  <v-text-field
                    :error-messages="errors"
                    v-model="selectedIngredient.qty"
                    label="Kuantitas"
                    outlined
                    dense
                    class="mb-0 mt-8 px-4"
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
              <v-col cols="6">
                <ValidationProvider v-slot="{ errors }" name="Satuan" rules="required">
                  <v-select
                    v-model="selectedIngredient.unit"
                    :error-messages="errors"
                    :items="groupUnits"
                    label="Satuan"
                    class="mb-0 mt-8 px-4"
                    outlined
                    dense
                  ></v-select>
                </ValidationProvider>
              </v-col>
            </v-row>            
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
      listGroupUnits: [['liter (l)', 'mililiter (ml)'], ['kilogram (kg)', 'ons (ons)', 'gram (g)', 'miligram (mg)'], ['centimeter (cm)', 'meter (m)', 'inch (in)'], ['bungkus (bks)', 'botol (btl)', 'box (box)', 'butir (btr)', 'pieces (pcs)']]
    }
  },
  computed: {
    groupUnits() {
      let groupUnits = [];
      this.listGroupUnits.forEach(units => {
        units.forEach(unit => {
          if (unit === this.selectedIngredient.unit) {
            groupUnits = units;
          }
        });
      });
      
      return groupUnits;
    }
  },
  watch: {
    selected(val) {
      this.selectedIngredient = val
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
      this.$emit("delete", this.selectedIngredient)
    },
    editIngredient() {
      this.$emit('edit', this.selectedIngredient);
    }
  },
}
</script>
