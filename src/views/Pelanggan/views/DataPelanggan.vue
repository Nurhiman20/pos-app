<template>
  <div>
    <div class="d-flex flex-row justify-space-between align-center">
      <h1>Data Pelanggan</h1>
      <v-btn color="primary" small @click="dialogAddCustomer = true">Tambah Pelanggan</v-btn>
    </div>

    <v-card outlined flat class="pa-4 mt-3">
      <v-row>
        <v-col cols="12" md="4" lg="4">
          <v-autocomplete
            v-model="select"
            :items="itemCustomers"
            :search-input.sync="search"
            cache-items
            class="my-4"
            outlined
            dense
            hide-no-data
            hide-details
            :clearable="true"
            label="Cari..."
            append-icon="mdi-magnify"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="$store.state.listCustomer"
        :search="search"
        class="elevation-1 scrollbar-custom"
        hide-default-footer
      >
      </v-data-table>
    </v-card>

    <!-- dialog add customer -->
    <add-customer-dialog 
      :show="dialogAddCustomer"
      @closeDialog="closeDialogCustomer"
    ></add-customer-dialog>
  </div>
</template>

<script>
import addCustomerDialog from '../components/TambahPelanggan'

export default {
  components: {
    addCustomerDialog
  },
  data() {
    return {
      itemCustomers: [],
      select: null,
      search: null,
      headers: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'Nama', value: 'name', sortable: false },
        { text: 'Nomor HP', value: 'phone_number', sortable: false }
      ],
      dialogAddCustomer: false
    }
  },
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val);
    }
  },
  methods: {
    querySelections(v) {
      let listCustomer = this.$store.state.listCustomer.map(item => item.name);
      this.itemCustomers = listCustomer.filter(e => {
        return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1;
      });
    },
    closeDialogCustomer(e) {
      this.dialogAddCustomer = e;
      this.$store.dispatch("getCustomer");
    }
  },
  created() {
    this.$store.dispatch("getCustomer");
  },
}
</script>
