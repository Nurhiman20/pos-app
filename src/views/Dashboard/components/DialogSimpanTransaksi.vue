<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <v-card-title class="ml-0">Simpan Transaki</v-card-title>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(saveTransaction)">
            <ValidationProvider v-slot="{ errors }" name="Nama Pelanggan" rules="required">
              <v-text-field
                :error-messages="errors"
                v-model="customerName"
                label="Nama Pelanggan"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Nomor HP" rules="integer">
              <v-text-field
                :error-messages="errors"
                v-model="phoneNumber"
                label="Nomor HP"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Nomor Meja" rules="required|integer">
              <v-text-field
                :error-messages="errors"
                v-model="tableNumber"
                label="Nomor Meja"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error darken-1" text @click="closeDialog">Batal</v-btn>
              <v-btn color="primary" dark type="submit" :loading="$store.state.loading">Simpan</v-btn>
            </v-card-actions>
          </v-form>
        </ValidationObserver>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ['show', 'transaction'],
  data() {
    return {
      customerName: null,
      phoneNumber: null,
      tableNumber: null
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close', false);
    },
    saveTransaction() {
      let dataForm = this.transaction;
      dataForm.customer_name = this.customerName;
      dataForm.phone_number = this.phoneNumber;
      dataForm.table_number = this.tableNumber;
      this.$store.dispatch("submitTransaction", dataForm)
        .then(() => {
          this.$store.commit("CLEAR_SELECTED_PRODUCT", []);
          this.closeDialog();
          this.customerName = null;
          this.phoneNumber = null;
          this.tableNumber = null;
        });
    }
  }
}
</script>
