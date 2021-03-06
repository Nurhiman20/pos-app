<template>
  <div>
    <div class="d-flex flex-row justify-space-between align-center">
      <h1>Penerimaan</h1>
      <div class="d-flex flex-row flex-wrap justify-end">
        <!-- <download-excel
          :data="$store.state.listReceive"
          :fields="jsonFields"
          worksheet="Order"
          name="Order.xls"
          class="mb-1"
        >
          <v-btn color="secondary" small>Export</v-btn>
        </download-excel> -->
        <v-btn class="ml-2" color="primary" small @click="dialogAddReceive = true">Tambah Penerimaan</v-btn>
      </div>
    </div>
    <v-card outlined flat class="pa-4 mt-3">
      <v-row>
        <v-col cols="12" md="4" lg="4">
          <v-autocomplete
            v-model="select"
            :items="itemReceive"
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
        :items="$store.state.listReceive"
        :search="search"
        class="elevation-1 scrollbar-custom"
        hide-default-footer
        @click:row="goToEdit"
      >
        <template v-slot:item.supplier="{item}">
          <p class="my-auto">Rp{{ countTotal(item) }},00</p>
        </template>
        <template v-slot:item.status="{item}">
          <div class="d-flex flex-row">
            <v-icon color="success" v-if="item.status === 'Terpenuhi'">mdi-check-decagram</v-icon>
            <v-icon color="error" v-else>mdi-alert-decagram</v-icon>
            <p class="my-auto ml-1">{{ item.status }}</p>
          </div>
        </template>
      </v-data-table>
    </v-card>
  
    <add-receive-dialog
      :show="dialogAddReceive"
      @viewDetailHistory="goToDetail"
      @closeDialog="closeDialogAdd"
      @success="successPutReceive"
      @error="failedAddReceive"
    ></add-receive-dialog>

    <edit-receive-dialog 
      :show="dialogEditReceive"
      :selected="selectedReceive"
      @closeDialog="closeDialogEdit"
      @success="successPutReceive"
      @error="failedAddReceive"
      @delete="deleteReceive"
      @successDelete="successDelete"
    ></edit-receive-dialog>

    <detail-receive-dialog 
      :show="dialogDetailReceive"
      :selected="selectedReceive"
      @closeDialog="closeDialogDetail"
    ></detail-receive-dialog>

    <!-- response dialog -->
    <response-dialog 
      :success="dialogSuccess"
      :failed="dialogFailed"
      :confirm="dialogConfirm"
      :message="messageDialog"
      @closeSuccess="closeDialogSuccess"
      @closeFailed="closeDialogFailed"
      @closeConfirm="closeDialogConfirm"
      @deleteConfirmed="doDelete"
    ></response-dialog>
  </div>
</template>

<script>
import addReceiveDialog from '../components/TambahPenerimaan';
import editReceiveDialog from '../components/EditPenerimaan';
import detailReceiveDialog from '../components/DetailPenerimaan';
import responseDialog from '@/components/ResponseDialog';

export default {
  components: {
    addReceiveDialog,
    editReceiveDialog,
    detailReceiveDialog,
    responseDialog
  },
  data() {
    return {
      search: null,
      select: null,
      itemReceive: [],
      selectedReceive: {},
      headers: [
        { text: 'ID Penerimaan', value: 'id', sortable: false },
        { text: 'ID Pemesanan', value: 'id_order', sortable: false },
        { text: 'Waktu', value: 'time', sortable: true },
        { text: 'Supplier', value: 'supplier.name', sortable: true },
        { text: 'Total', value: 'supplier', sortable: false },
        { text: 'Status', value: 'status', sortable: false }
      ],
      jsonFields: {
        ID: 'id',
        Waktu: 'time',
        Supplier: 'supplier.name',
        Total: {
          field: 'ingredients',
          callback: (value) => {
            const total = value.reduce((acc, ing) => acc + (ing.order * ing.unit_cost), 0);       
            return total
          }
        },
        Status: 'status'
      },
      dialogAddReceive: false,
      dialogEditReceive: false,
      dialogDetailReceive: false,
      dialogSuccess: false,
      dialogFailed: false,
      dialogConfirm: false,
      messageDialog: null
    }
  },
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val);
    },
  },
  methods: {
    querySelections(v) {
      let listReceive = this.$store.state.listReceive.map(item => item.supplier.name);
      this.itemReceive = listReceive.filter(e => {
        return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1;
      });
    },
    formatCurrency(val) {
      return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
    },
    countTotal(item) {
      const total = item.ingredients.reduce((acc, ing) => acc + (ing.order * ing.unit_cost), 0);

      return this.formatCurrency(total)
    },
    closeDialogSuccess(e) {
      this.dialogAddReceive = false;
      this.dialogEditReceive = false;
      this.dialogSuccess = e;
    },
    closeDialogFailed(e) {
      this.dialogFailed = e;
    },
    closeDialogConfirm(e) {
      this.dialogConfirm = e;
    },
    closeDialogAdd(e) {
      this.$store.dispatch("getReceive");
      this.$store.dispatch("getOrder");
      this.dialogAddReceive = e;
    },
    closeDialogEdit(e) {
      this.$store.dispatch("getReceive");
      this.$store.dispatch("getOrder");
      this.dialogEditReceive = e;
    },
    closeDialogDetail(e) {
      this.dialogDetailReceive = e;
    },
    successPutReceive(e) {
      this.$store.dispatch("getReceive");
      this.$store.dispatch("getOrder");
      this.messageDialog = e;
      this.dialogSuccess = true;
    },
    failedAddReceive(e) {
      this.messageDialog = e;
      this.dialogFailed = true;
    },
    successDelete() {
      this.$store.dispatch("getReceive");
      this.$store.dispatch("getOrder");
    },
    deleteReceive(e) {
      this.selectedDelete = e;
      this.messageDialog = "Kamu yakin akan menghapus penerimaan ini?"
      this.dialogConfirm = true;
    },
    doDelete() {
      this.$store.dispatch("deleteReceive", this.selectedDelete)
        .then(() => {          
          this.$store.dispatch("getReceive");
          this.$store.dispatch("getOrder");
          this.dialogConfirm = false;
          this.messageDialog = "Berhasil menghapus penerimaan";
          this.dialogSuccess = true;
        })
        .catch(() => {
          this.dialogConfirm = false;
          this.messageDialog = "Terjadi kesalahan. Silahkan coba lagi nanti";
          this.dialogFailed = true;
        })
    },
    goToEdit(item) {
      this.selectedReceive = item;
      this.dialogEditReceive = true;
    },
    goToDetail(item) {
      this.selectedReceive = item;
      this.dialogDetailReceive = true;
    }
  },
  created() {
    this.$store.dispatch("getReceive");    
    this.$store.dispatch("getOrder");
    this.$store.dispatch("getIngredient");
    this.$store.dispatch("getSupplier");
  }
}
</script>
