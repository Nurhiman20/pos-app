<template>
  <div>
    <div class="d-flex flex-row justify-space-between align-center">
      <h1>Manajemen Meja</h1>
      <v-btn color="primary" small @click="dialogAddTable = true">Tambah Meja</v-btn>
    </div>

    <v-card outlined flat class="pa-4 mt-3">
      <v-row>
        <v-col cols="12" md="4" lg="4">
          <v-autocomplete
            v-model="select"
            :items="itemTable"
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
        :items="$store.state.listTable"
        :search="search"
        class="elevation-1 scrollbar-custom"
        hide-default-footer
      >
      </v-data-table>
    </v-card>

    <!-- dialog add customer -->
    <add-customer-dialog 
      :show="dialogAddTable"
      @closeDialog="closeDialogTable"
    ></add-customer-dialog>
  </div>
</template>

<script>
import addCustomerDialog from '../components/TambahMeja'

export default {
  components: {
    addCustomerDialog
  },
  data() {
    return {
      itemTable: [],
      select: null,
      search: null,
      headers: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'Nomor Meja', value: 'table_number', sortable: true },
        { text: 'Kapasitas', value: 'capacity', sortable: true }
      ],
      dialogAddTable: false
    }
  },
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val);
    }
  },
  methods: {
    querySelections(v) {
      let listTable = this.$store.state.listTable.map(item => item.table_number);
      this.itemTable = listTable.filter(e => {
        return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1;
      });
    },
    closeDialogTable(e) {
      this.dialogAddTable = e;
      this.$store.dispatch("getTable");
    }
  },
  created() {
    this.$store.dispatch("getTable");
  },
}
</script>
