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
        class="mr-1"
        dark
        @click="changeView({ id: 'all', name: 'all'})"
      >All</v-btn>
      <v-btn
        v-for="(cat, index) in categories"
        :key="index"
        :outlined="isActiveCategory(cat)"
        color="#2B81D6"
        class="mr-1"
        dark
        @click="changeView(cat)"
      >{{ cat.name }}</v-btn>
      <v-text-field
        v-model="search"
        outlined
        dense
        label="Cari..."
        append-icon="mdi-magnify"
        class="mb-0 mt-4"
      ></v-text-field>
      <div class="mt-2">
        <p v-if="resultSearch.length === 0">Mohon maaf.. Produk tidak tersedia</p>
        <v-row v-else>
          <v-col cols="4" md="4" lg="4" v-for="(item, i) in resultSearch" :key="i">
            <v-card class="cursor-pointer" @click="selectProduct(item)">
              <div class="d-flex flex-column">
                <v-img src="https://picsum.photos/400/300?random" :aspect-ratio="4/3"></v-img>
                <div class="mt-n2">
                  <v-card-title>{{ item.name }}</v-card-title>
                  <v-card-subtitle>{{ item.description }}</v-card-subtitle>
                  <p class="ml-4 mt-n3 text-bold">Rp{{ formatCurrency(item.price) }},00</p>
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
      activeView: {
        id: 'all',
        name: 'all'
      }
    }
  },
  computed: {
    resultSearch() {
      if(this.search) {
        return this.products.filter((item) => {
          return this.search.toLowerCase().split(' ').every(v => item.name.toLowerCase().includes(v));
        })
      } else {
        return this.products;
      }
    },
  },
  methods: {
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
