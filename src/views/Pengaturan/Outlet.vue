<template>
  <div>
    <div class="d-flex flex-row justify-space-between mb-2">
      <h1>Cabang</h1>
      <v-btn color="secondary">Preview Struk</v-btn> 
    </div>
    <v-card class="pa-4">
      <p>Nama cabang</p>
      <h2 class="mt-n3">{{ $store.state.account.name }}</h2>
      <p class="mt-3">Alamat cabang</p>
      <h2 class="mt-n3">{{ $store.state.account.address }}</h2>
    </v-card>
    <v-row>
      <v-col cols="12" md="6" lg="6" xl="6">
        <v-card class="pa-4 mt-4">          
          <div class="d-flex flex-row justify-space-between">
            <v-card-title>Pegawai</v-card-title>
            <v-btn color="primary" @click="$router.push('/pengaturan/pegawai')">Edit</v-btn> 
          </div>
          <v-data-table
            :headers="headersCashier"
            :items="$store.state.listCashier"
            :search="search"
            class="elevation-1 scrollbar-custom"
            hide-default-footer
            @click:row="goToEdit"
          >
          </v-data-table>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="6" xl="6">
        <v-card class="pa-4 mt-4">
          <div class="d-flex flex-row justify-space-between">
            <v-card-title>Meja</v-card-title>
            <v-btn color="primary">Tambah Meja</v-btn> 
          </div>
          <v-data-table
            :headers="headersTable"
            :items="$store.state.listTable"
            :search="search"
            class="elevation-1 scrollbar-custom"
            hide-default-footer
            @click:row="goToEdit"
          >
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {      
      headersCashier: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'Username', value: 'username', sortable: true },
        { text: 'Nama', value: 'name', sortable: true },
        { text: 'Jabatan', value: 'role', sortable: true },
        { text: 'Nomor HP', value: 'phone_number', sortable: false }
      ],
      headersTable: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'Nomor Meja', value: 'table_number', sortable: true },
        { text: 'Kapasitas', value: 'capacity', sortable: true }
      ],
    }
  },
  created() {
    this.$store.dispatch("getOutlet")
    this.$store.dispatch("getCashier")
    this.$store.dispatch("getTable");
  },
}
</script>
