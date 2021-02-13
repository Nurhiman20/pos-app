<template>
  <div>
    <div class="d-flex flex-row justify-space-between align-center">
      <h1>Daftar Bahan</h1>
      <!-- <div class="d-flex flex-row flex-wrap justify-end">
        <download-excel
          :data="$store.state.listCategory"
          :fields="jsonFields"
          worksheet="Category"
          name="Kategori.xls"
          class="mb-1"
        >
          <v-btn color="success" small>Export</v-btn>
        </download-excel>
        <v-btn class="ml-2" color="primary" small @click="dialogAddCategory = true">Tambah Kategori</v-btn>
      </div> -->
    </div>
  </div>
</template>
