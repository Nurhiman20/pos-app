<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <div class="d-flex flex-row justify-space-between align-center">
          <div>
            <v-card-title class="ml-0">Edit Pegawai</v-card-title>
            <v-card-subtitle>{{ selected.name }}</v-card-subtitle>
          </div>
          <v-btn color="error" outlined @click="doDelete">
            <v-icon class="mr-1">mdi-delete</v-icon>Hapus
          </v-btn>
        </div>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(editEmployee)">
            <ValidationProvider v-slot="{ errors }" name="Nama" rules="required">
              <v-text-field
                :error-messages="errors"
                v-model="selected.name"
                label="Nama"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Username" rules="required">
              <v-text-field
                :error-messages="errors"
                v-model="selected.username"
                label="Username"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Jabatan" rules="required">
              <v-text-field
                :error-messages="errors"
                v-model="selected.role"
                label="Jabatan"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Nomor HP" rules="required">
              <v-text-field
                :error-messages="errors"
                v-model="selected.phone_number"
                label="Nomor HP"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
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
  methods: {
    closeDialog() {
      this.$emit('closeDialog', false);
    },
    doDelete() {
      this.$emit("delete", this.selected);
    },
    editEmployee() {
      this.$store.dispatch("updateEmployee", this.selected)
        .then(() => {
          this.$emit("success", "Pegawai telah diperbarui");
        })
        .catch(() => {
          this.$emit("error", "Terjadi masalah. Silahkan coba lagi nanti");
        });
    },
  }
}
</script>
