<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <v-card-title class="ml-0">Tambah Pelanggan</v-card-title>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(addCustomer)">
            <ValidationProvider v-slot="{ errors }" name="Nama Pelanggan" rules="required">
              <v-text-field
                :error-messages="errors"
                v-model="name"
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
            <ValidationProvider v-slot="{ errors }" name="Email" rules="email">
              <v-text-field
                :error-messages="errors"
                v-model="email"
                label="Email"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="warning darken-1" text @click="closeDialog">Batal</v-btn>
              <v-btn color="primary" dark type="submit" :loading="$store.state.loading">Tambah</v-btn>
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
      name: null,
      phoneNumber: null,
      email: null
    }
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog', false);
    },    
    randomId() {
      var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      var uniqid = 'cust-' + randLetter + Date.now();
      return uniqid
    },
    addCustomer() {
      let dataForm = {
        id: this.randomId(),
        name: this.name,
        phone_number: this.phoneNumber,
        email: this.email
      }
      this.$store.dispatch("submitCustomer", dataForm)
        .then(() => {
          this.name = null;
          this.phoneNumber = null;
          this.email = null;
          this.$emit("success", "Pelanggan telah diperbarui");
        })
        .catch(() => {
          this.$emit("error", "Terjadi masalah. Silahkan coba lagi nanti");
        });
    },
  }
}
</script>
