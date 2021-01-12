<template>
  <div class="app-content">
    <v-container>
      <v-row>
        <v-col cols="7" md="7" lg="7">
          <product-catalog
            :categories="listCategory"
            :products="listViewProduct"
            @setFilter=setFilterProduct
          ></product-catalog>
        </v-col>
        <v-col cols="5" md="5" lg="5">
          <product-sale></product-sale>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import productCatalog from './components/KatalogProduk'
import productSale from './components/PenjualanProduk'
import { createNamespacedHelpers } from "vuex";
const product = createNamespacedHelpers("product");

export default {
  components: {
    productCatalog,
    productSale
  },
  data() {
    return {
      selectedItem: {
        nama: null,
        qty: 1
      }
    }
  },
  computed: {
    ...product.mapState(['listCategory']),
    ...product.mapGetters(['listViewProduct']),
    resultSearch() {
      if(this.search) {
        return this.listViewProduct.filter((item) => {
          return this.search.toLowerCase().split(' ').every(v => item.name.toLowerCase().includes(v))
        })
      } else {
        return this.listViewProduct;
      }
    }
  },
  methods: {
    ...product.mapMutations(['SET_FILTER_CATEGORY']),
    ...product.mapActions(['getProduct', 'getCategory']),
    closeDialogSuccess() {
      this.dialogSuccess = false
      this.selectedMenu = []
      this.tunai = 0
    },
    addMenu(item) {
      const found = this.selectedMenu.some(el => el.nama === item.nama);
      if (!found) {
        this.selectedMenu.push(item)
      } else {
        alert('Menu sudah ditambahkan')
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

.dialog {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .paragraph-3 {
    font-weight: bold;
    font-size: 25px;
    line-height: 18px;
  }
  .paragraph-4 {
    font-weight: bold;
    font-size: 18px;
    line-height: 25px;
    text-align: center;
  }
}
</style>
