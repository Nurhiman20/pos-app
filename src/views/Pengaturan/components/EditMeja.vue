<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <div class="d-flex flex-row justify-space-between align-center">
          <div>
            <v-card-title class="ml-0">Edit Meja</v-card-title>
            <v-card-subtitle>{{ selectedTable.name }}</v-card-subtitle>
          </div>
          <v-btn color="error" outlined @click="doDelete">
            <v-icon class="mr-1">mdi-delete</v-icon>Hapus
          </v-btn>
        </div>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(editTable)">
            <ValidationProvider v-slot="{ errors }" name="Nomor Meja" rules="required|integer">
              <v-text-field
                :error-messages="errors"
                v-model="selected.table_number"
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
                v-model="selected.capacity"
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
  computed: {
    selectedTable: {
      get() {
        return this.selected
      },
      set(val) {
        this.$emit('update:selected', val);
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog', false);
    },
    doDelete() {
      this.$emit("delete", this.selectedTable);
    },
    editTable() {
      this.$store.dispatch("updateTable", this.selectedTable)
        .then(() => {
          this.$emit("success", "Daftar meja telah diperbarui");
        })
        .catch(() => {
          this.$emit("error", "Terjadi masalah. Silahkan coba lagi nanti");
        });
    },
  }
}
</script>
