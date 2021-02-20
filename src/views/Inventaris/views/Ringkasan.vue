<template>
  <div>
    <div class="d-flex flex-row justify-space-between align-center">
      <h1>Ringkasan</h1>
      <div class="d-flex flex-row flex-wrap justify-end">
        <download-excel
          :data="$store.getters.listViewInventory"
          :fields="jsonFields"
          worksheet="Stock"
          name="Stok.xls"
          class="mb-1"
        >
          <v-btn color="secondary" small>Export</v-btn>
        </download-excel>
        <!-- <v-btn class="ml-2" color="primary" small @click="dialogAddStock = true">Tambah Stok</v-btn> -->
      </div>
    </div>

    <v-card outlined flat class="pa-4 mt-3">
      <v-row>
        <v-col cols="12" md="4" lg="4">
          <v-autocomplete
            v-model="select"
            :items="itemInventory"
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
        :items="$store.getters.listViewInventory"
        :search="search"
        class="elevation-1 scrollbar-custom"
        hide-default-footer
        @click:row="goToEdit"
      >
        <!-- <template v-slot:item.name="{item}">
          <div class="d-flex flex-row align-center py-2">
            <v-img :src="showImage(item.image)" max-width="60" :aspect-ratio="4/3"></v-img>
            <p class="ml-3 my-auto">{{ item.name }}</p>
          </div>
        </template> -->
      </v-data-table>
    </v-card>

    <!-- dialog edit stok -->
    <add-stock-dialog 
      :show="dialogAddStock"
      @closeDialog="closeDialogAdd"
      @success="successPutStock"
      @error="failedPutStock"
    ></add-stock-dialog>

    <!-- dialog edit stok -->
    <edit-stock-dialog 
      :show="dialogEditStock"
      :selected.sync="selectedStock"
      @closeDialog="closeDialogEdit"
      @success="successPutStock"
      @error="failedPutStock"
    ></edit-stock-dialog>
    
    <!-- response dialog -->
    <response-dialog 
      :success="dialogSuccess"
      :failed="dialogFailed"
      :confirm="dialogConfirm"
      :message="messageDialog"
      @closeSuccess="closeDialogSuccess"
      @closeFailed="closeDialogFailed"
    ></response-dialog>
  </div>
</template>

<script>
import addStockDialog from '../components/TambahStok';
import editStockDialog from '../components/EditStok';
import responseDialog from '../../../components/ResponseDialog';

export default {
  components: {
    addStockDialog,
    editStockDialog,
    responseDialog
  },
  data() {
    return {
      itemInventory: [],
      selectedStock: {
        id: null,
        product: {
          name: null
        },
        stock: null
      },
      select: null,
      search: null,
      headers: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'Bahan', value: 'name', sortable: true },
        { text: 'Kategori', value: 'category.name', sortable: true },
        { text: 'Stok Awal', value: 'stock', sortable: false },
        { text: 'Pemesanan', value: 'order', sortable: false },        
        { text: 'Penerimaan', value: 'order', sortable: false },
        { text: 'Usage', value: 'usage', sortable: false },
        { text: 'Transfer', value: 'transfer', sortable: false },
        { text: 'Adjustment', value: 'adjustment', sortable: false },
        { text: 'Stok Akhir', value: 'ending_stock', sortable: false },
        { text: 'Unit', value: 'unit', sortable: false }
      ],
      jsonFields: {
        ID: 'id',
        Bahan: 'name',
        Kategori: 'category.name',
        'Stok Awal': 'stock',
        Order: 'order',
        Usage: 'usage',
        Transfer: 'transfer',
        Adjustment: 'adjustment',
        'Stok Akhir': 'ending_stock',
        Unit: 'unit'
      },
      dialogAddStock: false,
      dialogEditStock: false,
      dialogSuccess: false,
      dialogFailed: false,
      dialogConfirm: false,
      messageDialog: null
    }
  },
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val);
    }
  },
  methods: {
    querySelections(v) {
      let listInventory = this.$store.getters.listViewInventory.map(item => item.name);
      this.itemInventory = listInventory.filter(e => {
        return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1;
      });
    },
    closeDialogSuccess(e) {
      this.dialogAddStock = false;
      this.dialogEditStock = false;
      this.dialogSuccess = e;
    },
    closeDialogFailed(e) {
      this.dialogFailed = e;
    },
    closeDialogConfirm(e) {
      this.dialogConfirm = e;
    },
    closeDialogAdd(e) {
      this.dialogAddStock = e;
      this.$store.dispatch("getInventory");
    },
    closeDialogEdit(e) {
      this.dialogEditStock = e;
      this.$store.dispatch("getInventory");
    },
    successPutStock(e) {
      this.$store.dispatch("getInventory");
      this.messageDialog = e;
      this.dialogSuccess = true;
    },
    failedPutStock(e) {
      this.messageDialog = e;
      this.dialogFailed = true;
    },
    showImage(item) {
      if (item !== null) {
        return URL.createObjectURL(item);
      } else {
        return null;
      }
    },
    goToEdit(item) {
      this.selectedStock = item;
      this.dialogEditStock = true;
    }
  },
  created() {
    this.$store.dispatch("getInventory");
    this.$store.dispatch("getOrder");
    this.$store.dispatch("getAdjustment");
    this.$store.dispatch("getTransaction");
  },
}
</script>
