<template>
  <div class="app-content">
    <v-container>
      <v-row>
        <v-col cols="12" md="7" lg="7" xl="7">
          <product-catalog
            :categories="listCategory"
            :products="listViewProduct"
            @setFilter=setFilterProduct
            @productSelected="openSelectDialog"
          ></product-catalog>
        </v-col>
        <v-col cols="12" md="5" lg="5" xl="5">
          <product-sale
            :products="selectedProduct"
            @removeProduct="removeSelectedProduct"
          ></product-sale>
        </v-col>
      </v-row>
    </v-container>

    <select-product-dialog
      :show="selectDialog"
      :selectedProduct="selectedItem"
      @close="closeSelectDialog"
      @addSelected="addSelectedProduct"
    ></select-product-dialog>
  </div>
</template>

<script>
import productCatalog from './components/KatalogProduk'
import productSale from './components/PenjualanProduk'
import selectProductDialog from './components/DialogPilihProduk'
import { createNamespacedHelpers } from "vuex";
const product = createNamespacedHelpers("product");

export default {
  components: {
    productCatalog,
    productSale,
    selectProductDialog
  },
  data() {
    return {
      selectedItem: {},
      selectDialog: false,
      selectedProduct: []
    }
  },
  computed: {
    ...product.mapState(['listCategory']),
    ...product.mapGetters(['listViewProduct'])
  },
  methods: {
    ...product.mapMutations(['SET_FILTER_CATEGORY']),
    ...product.mapActions(['getProduct', 'getCategory']),
    closeSelectDialog(e) {
      this.selectDialog = e
    },
    openSelectDialog(e) {
      this.selectedItem = e
      this.selectDialog = true
    },
    closeDialogSuccess() {
      this.dialogSuccess = false
      this.selectedMenu = []
      this.tunai = 0
    },
    removeSelectedProduct(e) {
      let indexProduct = this.selectedProduct.indexOf(e);
      this.selectedProduct.splice(indexProduct, 1);
    },
    addSelectedProduct(item) {
      const found = this.selectedProduct.some(el => el.name === item.name);
      if (!found) {
        this.selectedProduct.push(item)
      } else {
        alert('Produk sudah ditambahkan')
      }
    },
    deleteMenu(item) {
      this.selectedMenu.splice(this.selectedMenu.indexOf(item), 1)
    },
    goToEdit(item) {
      this.dialogEdit = true
      this.selectedItem = item
    },
    setFilterProduct(e) {
      this.SET_FILTER_CATEGORY(e)
    },
    editQty() {
      const dataEdit = {
        nama: this.selectedItem.nama,
        harga: this.selectedItem.harga,
        qty: this.selectedItem.qty,
        diskon: this.selectedItem.diskon,
        total: this.selectedItem.harga * this.selectedItem.qty
      }
      
      this.selectedMenu.forEach((element) => {
        if (element.nama === dataEdit.nama) {
          element['qty'] = dataEdit.qty
          element['total'] = dataEdit.total
        }
      });

      this.dialogEdit = false
    },
    submitTransaksi() {
      this.dialogSuccess = true
    },
    formatCurrency(val) {
      return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
    }
  },
  created() {
    this.getProduct();
    this.getCategory();
  },
}
</script>

<style scoped lang="scss">
.app-content {
  min-height: 100vh;
}
</style>
