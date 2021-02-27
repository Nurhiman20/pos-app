<template>
  <div>
    <v-dialog v-model="show" persistent width="400">
      <v-card class="pa-3">
        <v-card-title class="ml-0">E-Receipt</v-card-title>
        <receipt-app :selected="selected" :print="print" @receiptPrinted="finishPrint"></receipt-app>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="warning darken-1" text @click="closeDialog">Tutup</v-btn>
          <v-btn color="secondary" dark :loading="$store.state.loading" @click="doPrint">
            <v-icon class="mr-2">mdi-printer</v-icon>
            Cetak
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
  data() {
    return {
      print: false
    }
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog', false);
    },
    finishPrint(e) {
      this.print = e;
    },
    doPrint() {
      this.print = true;
    }
  },
}
</script>
