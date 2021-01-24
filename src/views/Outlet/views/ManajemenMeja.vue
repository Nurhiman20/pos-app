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
        @click:row="goToEdit"
      >
      </v-data-table>
    </v-card>

    <!-- dialog add table -->
    <add-table-dialog 
      :show="dialogAddTable"
      @closeDialog="closeDialogTable"
    ></add-table-dialog>

    <!-- dialog edit table -->
    <edit-table-dialog 
      :show="dialogEditTable"
      :selected.sync="selectedTable"
      @closeDialog="closeDialogEdit"
      @successDelete="successDelete"
    ></edit-table-dialog>
  </div>
</template>

<script>
import addTableDialog from '../components/TambahMeja';
import editTableDialog from '../components/EditMeja';

export default {
  components: {
    addTableDialog,
    editTableDialog
  },
  data() {
    return {
      itemTable: [],
      selectedTable: {},
      select: null,
      search: null,
      headers: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'Nomor Meja', value: 'table_number', sortable: true },
        { text: 'Kapasitas', value: 'capacity', sortable: true }
      ],
      dialogAddTable: false,
      dialogEditTable: false
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
    closeDialogEdit(e) {
      this.dialogEditTable = e;
      this.$store.dispatch("getTable");
    },
    closeDialogTable(e) {
      this.dialogAddTable = e;
      this.$store.dispatch("getTable");
    },
    successDelete() {
      this.$store.dispatch("getTable");
    },
    goToEdit(item) {
      this.selectedTable = item;
      this.dialogEditTable = true;
    }
  },
  created() {
    this.$store.dispatch("getTable");
  },
}
</script>
