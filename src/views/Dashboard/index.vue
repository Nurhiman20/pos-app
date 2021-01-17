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
      :selected="editSelected"
      @close="closeEditDialog"
    ></edit-product-dialog>
  </div>
</template>

<script>
import productCatalog from './components/KatalogProduk';
import productSale from './components/PenjualanProduk';
import selectProductDialog from './components/DialogPilihProduk';
import editProductDialog from './components/DialogEditProduk';

export default {
  components: {
    productCatalog,
    productSale,
    selectProductDialog,
    editProductDialog
  },
  data() {
    return {
      selectedItem: {},
      editSelected: {},
      selectDialog: false,
      editDialog: false
    }
  },
  methods: {
    closeEditDialog(e) {
      this.editDialog = e;
    },
    closeSelectDialog(e) {
      this.selectDialog = e;
    },
    editProduct(e) {
      this.editSelected = e;
      this.editDialog = true;
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
    }
  },
  created() {
    this.$store.dispatch("getProduct");
    this.$store.dispatch("getCategory");
  },
}
</script>

<style scoped lang="scss">
.app-content {
  min-height: 100vh;
}
</style>
