<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <v-card-title class="ml-0">Tambah Bahan</v-card-title>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(addIngredient)">
            <ValidationProvider v-slot="{ errors }" name="Nama bahan" rules="required">
              <v-autocomplete
                :error-messages="errors"
                v-model="ingredient"
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
                    v-model="qty"
                    label="Kuantitas"
                    placeholder="0.2"
                    outlined
                    dense
                    class="mb-0 mt-8 px-4"
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
              <v-col cols="6">
                <ValidationProvider v-slot="{ errors }" name="Satuan" rules="required">
                  <v-select
                    v-model="selectedUnit"
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
              <v-btn color="primary" dark type="submit" :loading="$store.state.loading">Tambahkan</v-btn>
            </v-card-actions>
          </v-form>
        </ValidationObserver>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ['show'],
  data() {
    return {
      ingredient: null,
      qty: null,
      unit: null,
      selectedUnit: null,
      listGroupUnits: [['liter (l)', 'mililiter (ml)'], ['kilogram (kg)', 'ons (ons)', 'gram (g)', 'miligram (mg)'], ['centimeter (cm)', 'meter (m)', 'inch (in)'], ['bungkus (bks)', 'botol (btl)', 'box (box)', 'butir (btr)', 'pieces (pcs)']]
    }
  },
  computed: {
    groupUnits() {
      let groupUnits = [];
      this.listGroupUnits.forEach(units => {
        units.forEach(unit => {
          if (unit === this.unit) {
            groupUnits = units;
          }
        });
      });
      
      return groupUnits;
    }
  },
  watch: {
    ingredient(val) {
      if (val !== null) {
        this.unit = val.unit;
        this.selectedUnit = val.unit;
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
    convertUnit(qty, unit) {
      if (unit === 'miligram (mg)') {
        if (this.ingredient.unit === 'kilogram (kg)') {
          return parseFloat(qty) / 1000000
        } else if (this.ingredient.unit === 'ons (ons)') {
          return parseFloat(qty) / 100000
        } else if (this.ingredient.unit === 'gram (g)') {
          return parseFloat(qty) / 1000
        } else {
          return parseFloat(qty)
        }
      } else if (unit === 'gram (g)') {
        if (this.ingredient.unit === 'kilogram (kg)') {
          return parseFloat(qty) / 1000
        } else if (this.ingredient.unit === 'ons (ons)') {
          return parseFloat(qty) / 100
        } else if (this.ingredient.unit === 'miligram (mg)') {
          return parseFloat(qty) * 1000
        } else {
          return parseFloat(qty)
        }
      } else if (unit === 'ons (ons)') {
        if (this.ingredient.unit === 'kilogram (kg)') {
          return parseFloat(qty) / 10
        } else if (this.ingredient.unit === 'gram (g)') {
          return parseFloat(qty) * 100
        } else if (this.ingredient.unit === 'miligram (mg)') {
          return parseFloat(qty) * 100000
        } else {
          return parseFloat(qty)
        }
      } else if (unit === 'kilogram (kg)') {
        if (this.ingredient.unit === 'ons (ons)') {
          return parseFloat(qty) * 10
        } else if (this.ingredient.unit === 'gram (g)') {
          return parseFloat(qty) * 1000
        } else if (this.ingredient.unit === 'miligram (mg)') {
          return parseFloat(qty) * 1000000
        } else {
          return parseFloat(qty)
        }
      } else if (unit === 'mililiter (ml)') {
        if (this.ingredient.unit === 'liter (l)') {
          return parseFloat(qty) / 1000
        } else {
          return parseFloat(qty)
        }
      } else if (unit === 'liter (l)') {
        if (this.ingredient.unit === 'mililiter (ml)') {
          return parseFloat(qty) * 1000
        } else {
          return parseFloat(qty)
        }
      } else if (unit === 'centimeter (cm)') {
        if (this.ingredient.unit === 'meter (m)') {
          return parseFloat(qty) / 100
        } else if (this.ingredient.unit === 'inch (in)') {
          return parseFloat(qty) * 0.393701
        } else {
          return parseFloat(qty)
        }
      } else if (unit === 'meter (m)') {
        if (this.ingredient.unit === 'centimeter (cm)') {
          return parseFloat(qty) * 100
        } else if (this.ingredient.unit === 'inch (in)') {
          return parseFloat(qty) * 39.3701
        } else {
          return parseFloat(qty)
        }
      } else if (unit === 'inch (in)') {
        if (this.ingredient.unit === 'centimeter (cm)') {
          return parseFloat(qty) / 0.393701
        } else if (this.ingredient.unit === 'meter (m)') {
          return parseFloat(qty) / 39.3701
        } else {
          return parseFloat(qty)
        }
      } else {
        return qty
      }
    },
    addIngredient() {
      let convertedQty = this.convertUnit(this.qty, this.selectedUnit);

      let dataForm = {
        id_ingredient: this.ingredient.id,
        ingredient: this.ingredient,
        qty: convertedQty,
        before_convert: this.qty,
        unit: this.selectedUnit
      }
      this.$emit('add', dataForm);
      this.ingredient = null;
      this.qty = null;
      this.unit = null;
      this.selectedUnit = null;
    }
  },
}
</script>
