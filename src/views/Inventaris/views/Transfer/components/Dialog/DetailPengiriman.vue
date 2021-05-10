<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <div class="d-flex flex-row justify-space-between align-center">
          <div class="d-flex flex-column">
            <v-card-title class="ml-0">Detail Pengiriman</v-card-title>
            <v-card-subtitle>{{ textOrder(selectedDelivery) }}</v-card-subtitle>
          </div>
          <v-btn color="error" outlined @click="goDelete" v-if="type === 'edit'">
            <v-icon class="mr-1">mdi-delete</v-icon>Hapus
          </v-btn>
        </div>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(addDelivery)">
            <div class="px-4 mt-2 mb-6">
              <v-data-table
                :headers="headers"
                :items="selectedDelivery.ingredients"
                class="elevation-1 scrollbar-custom"
                hide-default-footer
                @click:row="goToEdit"
              ></v-data-table>
            </div>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="warning darken-1" text @click="closeDialog">Batal</v-btn>
              <v-btn color="primary" dark type="submit" :loading="$store.state.loading" v-if="type === 'edit'">Edit</v-btn>
            </v-card-actions>
          </v-form>
        </ValidationObserver>
      </v-card>
    </v-dialog>

    <edit-ingredient-dialog
      :show="dialogEditIngredient"
      :selected="selectedIngredient"
      :rvOrder="selectedDelivery.order"
      @closeDialog="closeDialogEdit"
      @edit="editIngredient"
    ></edit-ingredient-dialog>
  </div>
</template>

<script>
import editIngredientDialog from './EditBahanPengiriman';

export default {
  props: ['show', 'selected', 'type'],
  components: {
    editIngredientDialog
  },
  data() {
    return {
      selectedDelivery: {
        destination_outlet: {
          name: null
        }
      },
      selectedIngredient: {},
      headers: [
        { text: 'Bahan', value: 'ingredient.name', sortable: false },
        { text: 'Qty', value: 'qty', sortable: false },
        { text: 'Unit', value: 'ingredient.unit', sortable: false },
        { text: 'Kirim', value: 'delivered', sortable: false }
      ],
      dialogEditIngredient: false
    }
  },
  watch: {
    selected(val) {
      this.selectedDelivery = val;
    }
  },
  methods: {
    formatCurrency(val) {
      return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
    },
    textOrder(item) {      
      let strText = '(' + item.id + ') ' + item.destination_outlet.name + ' - ' + item.time;
      return strText
    },
    closeDialogEdit(e) {
      this.dialogEditIngredient = e;
    },
    closeDialog() {
      this.$emit('close', false);
    },
    goToEdit(e) {
      if (this.type === 'edit') {
        this.selectedIngredient = e;
        this.dialogEditIngredient = true;        
      }
    },
    editIngredient(e) {
      let listIngredient = [];
      this.selectedDelivery.ingredients.forEach(element => {
        if (element.id_ingredient === e.id_ingredient) {
          listIngredient.push(e);
        } else {
          listIngredient.push(element);
        }
      });

      this.selectedDelivery.ingredients = listIngredient;
      this.dialogEditIngredient = false;
    },    
    goDelete() {
      this.$emit("delete", this.selectedDelivery);
    },
    checkStatus() {
      let countUnfulfilled = 0;
      this.selectedDelivery.ingredients.forEach(item => {
        if (parseFloat(item.qty) > parseFloat(item.total_deliver)) {
          countUnfulfilled += 1;
        }
      });

      if (countUnfulfilled === 0) {
        countUnfulfilled = 0;
        return 'Terpenuhi'
      } else {        
        countUnfulfilled = 0;
        return 'Belum Terpenuhi'
      }
    },
    addDelivery() {
      this.selectedDelivery.order.delivery.forEach(rv => {
        if (rv.id === this.selectedDelivery.id) {
          rv.ingredients = this.selectedDelivery.ingredients;
          rv.delivery_status = this.selectedDelivery.delivery_status;
        }
      });
      let dataForm = {
        ...this.selectedDelivery,
        delivery_status: this.checkStatus()
      }
      this.$store.dispatch("updateDeliveryTransfer", dataForm)
        .then(() => {
          this.$emit("success", "Pengiriman telah diperbarui");
        })
        .catch(() => {
          this.$emit("error", "Terjadi masalah. Silahkan coba lagi nanti");
        });
    }
  }
}
</script>
