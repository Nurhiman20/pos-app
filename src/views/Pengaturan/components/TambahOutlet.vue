<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <v-card-title class="ml-0">Tambah Cabang</v-card-title>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(addOutlet)">
            <ValidationProvider v-slot="{ errors }" name="Nama" rules="required">
              <v-text-field
                :error-messages="errors"
                v-model="name"
                label="Nama"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Nomor telepon" rules="required">
              <v-text-field
                :error-messages="errors"
                v-model="phone"
                label="Nomor Telepon"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Alamat" rules="max:200">
              <v-textarea
                v-model="address"
                :error-messages="errors"
                label="Alamat"
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
      phone: null,
      address: null
    }
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog', false);
    },    
    randomId() {
      var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      var uniqid = 'outlet-' + randLetter + Date.now();
      return uniqid
    },
    addOutlet() {
      let dataForm = {
        id: this.randomId(),
        name: this.name,
        phone: this.phone,
        address: this.address
      }
      this.$store.dispatch("submitOutlet", dataForm)
        .then(() => {
          this.name = null;
          this.phone = null;
          this.address = null;
          this.$emit("success", "Outlet telah diperbarui");
        })
        .catch(() => {
          this.$emit("error", "Terjadi masalah. Silahkan coba lagi nanti");
        });
    },
  }
}
</script>
