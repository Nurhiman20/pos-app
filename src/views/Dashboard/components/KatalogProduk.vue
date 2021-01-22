<template>
  <div>
    <v-card
      outlined
      flat
      class="pa-4"
      min-height="90vh"
    >
      <v-btn
        :outlined="isActiveCategory({ id: 'all', name: 'all'})"
        color="#2B81D6"
        class="mr-1 mt-1"
        dark
        @click="changeView({ id: 'all', name: 'all'})"
      >All</v-btn>
      <v-btn
        v-for="(cat, index) in categories"
        :key="index"
        :outlined="isActiveCategory(cat)"
        color="#2B81D6"
        class="mr-1 mt-1"
        dark
        @click="changeView(cat)"
      >{{ cat.name }}</v-btn>
      <v-autocomplete
        v-model="select"
        :items="itemProducts"
        :search-input.sync="search"
        cache-items
        class="mb-0 mt-4"
        outlined
        dense
        hide-no-data
        hide-details
        :clearable="true"
        label="Cari..."
        append-icon="mdi-magnify"
      ></v-autocomplete>
      <div class="mt-4">
        <p v-if="resultSearch.length === 0">Mohon maaf.. Produk tidak tersedia</p>
        <v-row v-else>
          <v-col cols="12" md="4" lg="4" xl="4" v-for="(item, i) in resultSearch" :key="i">
            <v-card class="cursor-pointer" @click="selectProduct(item)">
              <div class="d-flex flex-column">
                <v-img :src="showImage(item.product.image)" :aspect-ratio="4/3"></v-img>
                <div class="mt-n2">
                  <v-card-title>{{ item.product.name }}</v-card-title>
                  <v-card-subtitle>{{ item.product.description }}</v-card-subtitle>
                  <p class="ml-4 mt-n3 text-bold">Rp{{ formatCurrency(item.product.price) }},00</p>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ['categories', 'products'],
  data() {
    return {
      search: null,
      select: null,
      itemProducts: [],
      activeView: {
        id: 'all',
        name: 'all'
      }
    }
  },
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val)
    },
  },
  computed: {
    resultSearch() {
      if(this.search) {
        return this.products.filter((item) => {
          return this.search.toLowerCase().split(' ').every(v => item.product.name.toLowerCase().includes(v));
        })
      } else {
        return this.products;
      }
    },
  },
  methods: {
    querySelections(v) {
      let listProduct = this.products.map(item => item.product.name);
      this.itemProducts = listProduct.filter(e => {
        return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1;
      });
    },
    showImage(item) {
      if (item !== null) {
        return URL.createObjectURL(item);
      } else {
        return null;
      }
    },
    changeView(val) {
      this.activeView = val;
      this.$emit('setFilter', val);
    },
    selectProduct(item) {
      this.$emit('productSelected', item)
    },
    isActiveCategory(val) {
      if (this.activeView.name === val.name) {
        return false
      } else {
        return true
      }
    },
    formatCurrency(val) {
      return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
    }
  }
}
</script>
