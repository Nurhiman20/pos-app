<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <v-card-title class="ml-0">Tambah Pegawai</v-card-title>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(addEmployee)">
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
            <ValidationProvider v-slot="{ errors }" name="Username" rules="required">
              <v-text-field
                :error-messages="errors"
                v-model="username"
                label="Username"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Jabatan" rules="required">
              <v-text-field
                :error-messages="errors"
                v-model="role"
                label="Jabatan"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Nomor HP" rules="required|integer">
              <v-text-field
                :error-messages="errors"
                v-model="phoneNumber"
                label="Nomor HP"
                outlined
                dense
                type="number"
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Cabang" rules="required">
              <v-autocomplete
                :error-messages="errors"
                v-model="outlet"
                :items="$store.state.listOutlet"
                :item-text="textOutlet"
                :item-value="valueOutlet"
                label="Cabang"
                class="mb-3 mt-2 px-4"
                outlined
                dense
                hide-no-data
                hide-details
                :clearable="true"
              ></v-autocomplete>
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
      username: null,
      role: null,
      outlet: null
    }
  },
  methods: {
    textOutlet(item) {
      return item.name
    },
    valueOutlet(item) {
      return item
    },
    randomId() {
      var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      var uniqid = 'emp-' + randLetter + Date.now();
      return uniqid
    },
    closeDialog() {
      this.$emit('closeDialog', false);
    },
    addEmployee() {
      let dataForm = {
        id: this.randomId(),
        name: this.name,
        username: this.username,
        role: this.role,
        phone_number: this.phoneNumber,
        id_outlet: this.outlet.id,
        outlet: this.outlet
      }
      this.$store.dispatch("submitEmployee", dataForm)
        .then(() => {
          this.name = null;
          this.username = null;
          this.phoneNumber = null;
          this.role = null;
          this.outlet = null;
          this.$emit("success", "Pegawai telah diperbarui");
        })
        .catch(() => {
          this.$emit("error", "Terjadi masalah. Silahkan coba lagi nanti");
        });
    },
  }
}
</script>
