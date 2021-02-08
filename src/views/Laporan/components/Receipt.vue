<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <v-card-title class="ml-0">E-Receipt</v-card-title>
        <receipt-app :selected="selected"></receipt-app>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="warning darken-1" text @click="closeDialog">Tutup</v-btn>
          <v-btn color="success" dark :loading="$store.state.loading">
            <v-icon class="mr-2">mdi-printer</v-icon>
            Cetak
          </v-btn>
          <v-btn color="primary" dark @click="editTransaction" :loading="$store.state.loading">            
            <v-icon class="mr-2">mdi-pencil</v-icon>
            Edit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import receiptApp from '@/components/ReceiptApp';

export default {
  props: ['show', 'selected'],
  components: {
    receiptApp
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog', false);
    },
    editTransaction() {
      this.$store.commit("SET_EDIT_TX", this.selected);
      this.$router.push('/pos');
    }
  },
}
</script>
