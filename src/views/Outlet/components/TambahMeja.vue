<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <v-card-title class="ml-0">Tambah Meja</v-card-title>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(addTable)">
            <ValidationProvider v-slot="{ errors }" name="Nomor Meja" rules="required|integer">
              <v-text-field
                :error-messages="errors"
                v-model="tableNumber"
                label="Nomor Meja"
                outlined
                dense
                type="number"
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Kapasitas" rules="required|integer">
              <v-text-field
                :error-messages="errors"
                v-model="capacity"
                label="Kapasitas"
                outlined
                dense
                type="number"
                suffix="orang"
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
      tableNumber: null,
      capacity: null
    }
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog', false);
    },    
    randomId() {
      var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      var uniqid = 'tab-' + randLetter + Date.now();
      return uniqid
    },
    addTable() {
      let dataForm = {
        id: this.randomId(),
        table_number: this.tableNumber,
        capacity: this.capacity
      }
      this.$store.dispatch("submitTable", dataForm)
        .then(() => {
          this.tableNumber = null;
          this.capacity = null;
          this.$emit("success", "Daftar meja telah diperbarui");
        })
        .catch(() => {
          this.$emit("error", "Terjadi masalah. Silahkan coba lagi nanti");
        });
    },
  }
}
</script>
