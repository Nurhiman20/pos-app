<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <v-card-title class="ml-0">Pilih Item</v-card-title>
        <v-card-subtitle>{{ selectedItem.name }}</v-card-subtitle>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(addItem)">
            <ValidationProvider
              v-slot="{ errors }"
              name="Pelanggan"
              rules="required"
            >
              <v-autocomplete
                :error-messages="errors"
                v-model="customer"
                :items="$store.state.listCustomer"
                :item-text="textCustomer"
                :item-value="valueCustomer"
                label="Pelanggan"
                class="mb-0 px-4"
                outlined
                dense
                hide-no-data
                :clearable="true"
              ></v-autocomplete>
            </ValidationProvider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="warning darken-1" text @click="closeDialog"
                >Batal</v-btn
              >
              <v-btn color="primary" dark type="submit">Tambahkan</v-btn>
            </v-card-actions>
          </v-form>
        </ValidationObserver>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ["show", "selectedItem"],
  data() {
    return {
      customer: null,
    };
  },
  methods: {
    textCustomer(item) {
      return item.name + " - " + item.phone_number;
    },
    valueCustomer(item) {
      return item;
    },
    closeDialog() {
      this.customer = null;
      this.$emit("close", false);
    },
    addItem() {
      let dataPayment = {
        customer: this.customer,
        selected_item: this.selectedItem,
      };
      this.$emit("add", dataPayment);
      this.closeDialog();
    },
  },
};
</script>
