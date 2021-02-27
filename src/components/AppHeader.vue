<template>
  <div>
    <v-app-bar
      app
      clipped-left
      color="primary"
      height="50px"
    >
      <div class="logo d-flex align-center">
        <span class="logo-text ml-2">21FACTORY</span>
      </div>
      <!-- <v-btn icon color="#717171" @click="hideDrawer" class="ml-12">
        <v-icon>mdi-menu</v-icon>
      </v-btn> -->
      <v-spacer></v-spacer>
      <!-- <div class="d-flex flex-row">
        <v-select
          v-model="cashier"
          :items="$store.state.listCashier"
          :item-text="textCashier"
          :item-value="valueCashier"
          label="Kasir"
          class="mb-0 mt-7 ml-4 mr-2"
          outlined
          dense
          @change="changeCashier"
        ></v-select>
        <v-select
          v-model="outlet"
          :items="$store.state.listOutlet"
          :item-text="textOutlet"
          :item-value="valueOutlet"
          label="Outlet"
          class="mb-0 mt-7"
          outlined
          dense
        ></v-select>
      </div> -->
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: 'AppHeader',
  props: ['drawer'],
  data () {
    return {
      outlet: null,
      cashier: null,
      items: [
        {
          title: 'Profile'
        },
        {
          title: 'Sign Out'
        }
      ]
    }
  },
  methods: {    
    textOutlet(item) {
      return item.name
    },
    valueOutlet(item) {
      return item
    },
    textCashier(item) {
      return item.username
    },
    valueCashier(item) {
      return item
    },
    changeCashier(e) {
      localStorage.setItem('cashier', e.id);
    }
  },
  created() {
    this.$store.dispatch("getOutlet");
    this.$store.dispatch("getCashier");
  }
}
</script>
