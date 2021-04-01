<template>
  <div class="app-content">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card outlined>
            <v-tabs
              v-model="tab"
              background-color="transparent"
              color="primary"
            >
              <v-tab>
                Pesanan
              </v-tab>
              <v-tab>
                Pembayaran
              </v-tab>
            </v-tabs>
          </v-card>
        </v-col>
      </v-row>
        
      <v-tabs-items v-model="tab" class="mt-4">
        <v-tab-item>          
          <v-card outlined color="background">
            <v-row>
              <v-col cols="12" md="7" lg="7" xl="7">
                <product-catalog
                  :categories="$store.state.listCategory"
                  :products="$store.getters.listViewProduct"
                  @setFilter=setFilterProduct
                  @productSelected="openSelectDialog"
                ></product-catalog>
              </v-col>
              <v-col cols="12" md="5" lg="5" xl="5">
                <product-sale
                  @editProduct="editProduct"
                  @toPayment="goToPayment"
                  @success="successSaveTransaction"
                  @error="failedSaveTransaction"
                ></product-sale>
              </v-col>
            </v-row>
          </v-card>
        </v-tab-item>
        <v-tab-item color="background">
          <payment-tab
            :txPay="tx"
            @printReceipt="openDialogReceipt"
            @success="successSaveTransaction"
            @error="failedSaveTransaction"
          ></payment-tab>
        </v-tab-item>
      </v-tabs-items>
    </v-container>

    <select-product-dialog
      :show="selectDialog"
      :selectedProduct="selectedItem"
      @close="closeSelectDialog"
    ></select-product-dialog>

    <edit-product-dialog
      :show="editDialog"
      :selected.sync="editSelected"
      @close="closeEditDialog"
    ></edit-product-dialog>

    <save-transaction-dialog
      :show="saveDialog"
      :transaction="transactionData"      
      @close="closeSaveDialog"
      @success="successSaveTransaction"
      @error="failedSaveTransaction"
    ></save-transaction-dialog>

    <receipt-dialog
      :show="dialogReceipt"
      :selected="selectedTransaction"
      @closeDialog="closeDialogReceipt"
    ></receipt-dialog> 

    <!-- response dialog -->
    <response-dialog 
      :success="dialogSuccess"
      :failed="dialogFailed"
      :message="messageDialog"
      @closeSuccess="closeDialogSuccess"
      @closeFailed="closeDialogFailed"
    ></response-dialog>
  </div>
</template>

<script>
import productCatalog from './components/KatalogProduk';
import productSale from './components/PenjualanProduk';
import selectProductDialog from './components/DialogPilihProduk';
import editProductDialog from './components/DialogEditProduk';
import saveTransactionDialog from './components/DialogSimpanTransaksi';
import responseDialog from '../../components/ResponseDialog';
import paymentTab from './components/TabPembayaran';
import receiptDialog from './components/DialogStruk';

export default {
  components: {
    productCatalog,
    productSale,
    selectProductDialog,
    editProductDialog,
    saveTransactionDialog,
    responseDialog,
    paymentTab,
    receiptDialog
  },
  data() {
    return {
      transactionData: {},
      tx: {},
      selectedItem: {
        id: null,
        name: null
      },
      editSelected: {
        id: null,
        name: null
      },
      selectedTransaction: {},
      tab: null,
      selectDialog: false,
      editDialog: false,
      saveDialog: false,
      dialogReceipt: false,
      dialogSuccess: false,
      dialogFailed: false,
      messageDialog: null
    }
  },
  methods: {
    closeEditDialog(e) {
      this.editDialog = e;
    },
    closeSelectDialog(e) {
      this.selectDialog = e;
    },
    closeSaveDialog(e) {
      this.saveDialog = e;
    },
    closeDialogSuccess(e) {
      this.saveDialog = false;
      this.dialogSuccess = e;
      if (this.$store.state.selectedTx.id !== undefined) {
        this.$store.commit("SET_EDIT_TX", null);
        this.$router.push('/laporan/transaksi');
      }      
      this.$store.commit("SET_EDIT_TX", {});
    },
    closeDialogFailed(e) {
      this.dialogFailed = e;
    },
    closeDialogReceipt(e) {
      this.dialogReceipt = e;
    },
    successSaveTransaction(e) {
      this.messageDialog = e;
      this.dialogSuccess = true;
      this.tx = {};
      this.$store.dispatch("getTransaction");
    },
    failedSaveTransaction(e) {
      this.messageDialog = e;
      this.dialogFailed = true;
    },
    editProduct(e) {
      this.editSelected = e;
      this.editDialog = true;
    },
    editSelectedProduct(e) {
      this.editSelected = e;
    },
    openSelectDialog(e) {
      this.selectedItem = e;
      this.selectDialog = true;
    },
    goToPayment(e) {
      this.tab = 1;
      this.tx = e;
      console.log(this.tx);
    },
    openDialogReceipt(e) {
      this.selectedTransaction = e;
      this.dialogReceipt = true;
    },
    setFilterProduct(e) {
      this.$store.commit("SET_FILTER_CATEGORY", e)
    },
    formatCurrency(val) {
      return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
    },
    saveTransaction(e) {
      this.transactionData = e;
      this.saveDialog = true;
    }
  },
  created() {
    this.$store.dispatch("getProduct");
    this.$store.dispatch("getCategory");    
    this.$store.dispatch("getCustomer");
    this.$store.dispatch("getTable");
    this.$store.dispatch("getTransaction");
  },
}
</script>

<style scoped lang="scss">
.app-content {
  min-height: 100vh;
}
</style>
