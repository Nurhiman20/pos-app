<template>
  <div>
    <div class="d-flex flex-row justify-space-between align-center">
      <h1>Daftar Produk</h1>
      <v-btn color="primary" small>Tambah Produk</v-btn>
    </div>
    <v-card outlined flat class="pa-4 mt-3">
      <v-text-field
        v-model="search"
        outlined
        dense
        append-icon="mdi-magnify"
        label="Cari..."
        class="mb-0 mt-4"
      ></v-text-field>
      <v-data-table
        :headers="headers"
        :items="listProduct"
        class="elevation-1 scrollbar-custom"
        hide-default-footer
      >
        <template v-slot:item.actions="{item}">
          <div class="d-flex flex-row align-center justify-end">
            <v-btn icon color="success" @click="goToEdit(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon color="error" @click="deleteMenu(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'Nama', value: 'name', sortable: true },
        { text: 'Harga', value: 'price', sortable: false },
        { text: 'Kategori', value: 'category.name', sortable: false },
        { text: 'Deskripsi', value: 'description', sortable: false },
        { text: '', value: 'actions', sortable: false }
      ],
      listProduct: [
        {
          id: 1,
          name: 'Jus jeruk',
          price: 15000,
          category: {
            id: 1,
            name: 'Minuman'
          },
          description: 'Jus jeruk biasa'
        }
      ]
    }
  },
}
</script>