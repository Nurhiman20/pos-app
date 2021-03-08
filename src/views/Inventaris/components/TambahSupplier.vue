<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <v-card-title class="ml-0">Tambah Supplier</v-card-title>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(addSupplier)">
            <ValidationProvider v-slot="{ errors }" name="Nama supplier" rules="required">
              <v-text-field
                :error-messages="errors"
                v-model="nameSupplier"
                label="Nama Supplier"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Contact person" rules="required">
              <v-text-field
                :error-messages="errors"
                v-model="contactPerson"
                label="Contact Person"
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
                v-model="emailSupplier"
                label="Email Supplier"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Alamat supplier" rules="max:200">
              <v-textarea
                v-model="addressSupplier"
                :error-messages="errors"
                label="Alamat Supplier"
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
      nameSupplier: null,
      contactPerson: null,
      phoneNumber: null,
      emailSupplier: null,
      addressSupplier: null
    }
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog', false);
    },
    randomId() {
      var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      var uniqid = 'sup-' + randLetter + Date.now();
      return uniqid
    },
    addSupplier() {
      let dataForm = {
        id: this.randomId(),
        name: this.nameSupplier,
        contact_person: this.contactPerson,
        phone_number: this.phoneNumber,
        email: this.emailSupplier,
        address: this.addressSupplier
      };
      this.$store.dispatch("submitSupplier", dataForm)
        .then(() => {
          this.nameCategory = null;          
          this.$emit("success", "Supplier telah disimpan");
        })
        .catch(() => {
          this.$emit("error", "Terjadi masalah. Silahkan coba lagi nanti");
        });
    }
  }
}
</script>
