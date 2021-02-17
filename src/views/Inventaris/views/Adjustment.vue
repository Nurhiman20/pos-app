<template>
  <div>
    <div class="d-flex flex-row justify-space-between align-center">
      <h1>Adjustment</h1>
      <div class="d-flex flex-row flex-wrap justify-end">
        <!-- <download-excel
          :data="$store.state.listCategory"
          :fields="jsonFields"
          worksheet="Category"
          name="Kategori.xls"
          class="mb-1"
        >
          <v-btn color="secondary" small>Export</v-btn>
        </download-excel> -->
        <v-btn class="ml-2" color="primary" small @click="dialogAddAdjustment = true">Tambah Adjustment</v-btn>
      </div>
    </div>
    <v-card outlined flat class="pa-4 mt-3">
      <v-row>
        <v-col cols="12" md="4" lg="4">
          <v-autocomplete
            v-model="select"
            :items="itemAdjustments"
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
        :items="$store.state.listAdjustment"
        :search="search"
        class="elevation-1 scrollbar-custom"
        hide-default-footer
        @click:row="goToEdit"
      >
        <template v-slot:item.in_stock="{item}">
          <p class="my-auto">{{ item.in_stock - item.actual_stock }}</p>
        </template>
        <template v-slot:item.expense_income="{item}">
          <p class="text-bold success--text my-auto" v-if="item.in_stock - item.actual_stock > 0">Rp{{ formatCurrency((item.in_stock - item.actual_stock) * item.ingredient.price) }},00</p>
          <p class="text-bold error--text my-auto" v-else>- Rp{{ formatCurrency((item.in_stock - item.actual_stock) * item.ingredient.price * (-1)) }},00</p>
        </template>
      </v-data-table>
    </v-card>

    <!-- dialog add adjustment -->
    <add-adjustment-dialog
      :show="dialogAddAdjustment"
      @closeDialog="closeDialogAdd"
      @success="successPutAdjustment"
      @error="failedAddAdjustment"
    ></add-adjustment-dialog>

    <!-- dialog edit adjustment -->
    <edit-adjustment-dialog 
      :show="dialogEditAdjustment"
      :selected="selectedAdjustment"
      @closeDialog="closeDialogEdit"
      @success="successPutAdjustment"
      @error="failedAddAdjustment"
      @delete="deleteAdjustment"
      @successDelete="successDelete"
    ></edit-adjustment-dialog>

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
import addAdjustmentDialog from '../components/TambahAdjustment';
import editAdjustmentDialog from '../components/EditAdjustment';
import responseDialog from '@/components/ResponseDialog';

export default {
  components: {
    addAdjustmentDialog,
    editAdjustmentDialog,
    responseDialog
  },
  data() {
    return {
      search: null,
      select: null,
      itemAdjustments: [],
      selectedAdjustment: {},
      selectedDelete: {},
      headers: [
        { text: 'Time', value: 'time', sortable: false },
        { text: 'Bahan', value: 'ingredient.name', sortable: true },
        { text: 'Adjustment', value: 'in_stock', sortable: true },
        { text: 'Expense/Income', value: 'expense_income', sortable: true },
        { text: 'Keterangan', value: 'notes', sortable: true }
      ],
      jsonFields: {
        Time: 'time',
        Bahan: 'ingredients',
        Adjustment: 'adjustment',
        'Expense/Income': 'expense_income',
        Keterangan: 'notes'
      },
      dialogAddAdjustment: false,
      dialogEditAdjustment: false,
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
      let listAdjustment = this.$store.state.listAdjustment.map(item => item.ingredient.name);
      this.itemAdjustments = listAdjustment.filter(e => {
        return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1;
      });
    },
    formatCurrency(val) {
      return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
    },
    closeDialogSuccess(e) {
      this.dialogAddAdjustment = false;
      this.dialogEditAdjustment = false;
      this.dialogSuccess = e;
    },
    closeDialogFailed(e) {
      this.dialogFailed = e;
    },
    closeDialogConfirm(e) {
      this.dialogConfirm = e;
    },
    closeDialogAdd(e) {
      this.$store.dispatch("getAdjustment");
      this.dialogAddAdjustment = e;
    },
    closeDialogEdit(e) {
      this.$store.dispatch("getAdjustment")
      this.dialogEditAdjustment = e
    },
    failedAddAdjustment(e) {
      this.messageDialog = e;
      this.dialogFailed = true;
    },
    successPutAdjustment(e) {
      this.$store.dispatch("getAdjustment");
      this.messageDialog = e;
      this.dialogSuccess = true;
    }, 
    successDelete() {
      this.$store.dispatch("getAdjustment");
    },
    deleteAdjustment(e) {
      this.selectedDelete = e;
      this.messageDialog = "Kamu yakin akan menghapus adjustment ini?"
      this.dialogConfirm = true;
    },
    doDelete() {
      this.$store.dispatch("deleteAdjustment", this.selectedDelete)
        .then(() => {          
          this.$store.dispatch("getAdjustment");
          this.dialogConfirm = false;
          this.messageDialog = "Berhasil menghapus adjustment";
          this.dialogSuccess = true;
        })
        .catch(() => {
          this.dialogConfirm = false;
          this.messageDialog = "Terjadi kesalahan. Silahkan coba lagi nanti";
          this.dialogFailed = true;
        })
    },
    goToEdit(item) {
      this.selectedAdjustment = item;
      this.dialogEditAdjustment = true;
    }
  },
  created() {
    this.$store.dispatch("getAdjustment");
    this.$store.dispatch("getIngredient");   
  },
}
</script>
