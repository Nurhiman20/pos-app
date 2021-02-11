<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <div class="d-flex flex-row justify-space-between align-center">
          <v-card-title class="ml-0">Edit Supplier</v-card-title>
          <v-btn color="error" outlined @click="goDelete">
            <v-icon class="mr-1">mdi-delete</v-icon>Hapus
          </v-btn>
        </div>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(editSupplier)">
            <ValidationProvider v-slot="{ errors }" name="Nama kategori" rules="required">
              <v-text-field
                :error-messages="errors"
                v-model="selectedSupplier.name"
                label="Nama Kategori"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error darken-1" text @click="closeDialog">Batal</v-btn>
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
  data() {
    return {
      selectedSupplier: {}
    }
  },
  watch: {
    selected(val) {
      this.selectedSupplier = val
    }
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog', false);
    },
    goDelete() {
      this.$emit("delete", this.selectedSupplier)
    },
    editSupplier() {
      this.$store.dispatch("submitSupplier", this.selectedSupplier)
        .then(() => {
          this.$emit("success", "Supplier telah diedit");
        })
        .catch(() => {
          this.$emit("error", "Terjadi masalah. Silahkan coba lagi nanti");
        });
    }
  }
}
</script>
