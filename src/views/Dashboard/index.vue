<template>
  <div class="app-content">
    <v-container>
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
            @saveTransaction="saveTransaction"
          ></product-sale>
        </v-col>
      </v-row>
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
    ></save-transaction-dialog>
  </div>
</template>

<script>
import productCatalog from './components/KatalogProduk';
import productSale from './components/PenjualanProduk';
import selectProductDialog from './components/DialogPilihProduk';
import editProductDialog from './components/DialogEditProduk';
import saveTransactionDialog from './components/DialogSimpanTransaksi';

export default {
  components: {
    productCatalog,
    productSale,
    selectProductDialog,
    editProductDialog,
    saveTransactionDialog
  },
  data() {
    return {
      transactionData: {},
      selectedItem: {
        id: null,
        product: {
          name: null
        }
      },
      editSelected: {
        id: null,
        product: {
          name: null
        }
      },
      selectDialog: false,
      editDialog: false,
      saveDialog: false
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
    this.$store.dispatch("getInventory");
    this.$store.dispatch("getCategory");    
    this.$store.dispatch("getCustomer");
    this.$store.dispatch("getTable");
  },
}
</script>

<style scoped lang="scss">
.app-content {
  min-height: 100vh;
}
</style>
