<template>
  <div>
    <div class="d-flex flex-row justify-space-between align-center">
      <h1>Daftar Kategori</h1>
      <v-btn color="primary" small @click="dialogAddCategory = true">Tambah Kategori</v-btn>
    </div>
    <v-card outlined flat class="pa-4 mt-3">
      <v-row>
        <v-col cols="12" md="4" lg="4">
          <v-text-field
            v-model="search"
            outlined
            dense
            append-icon="mdi-magnify"
            label="Cari..."
            class="mb-0 mt-4"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="listCategory"
        :search="search"
        class="elevation-1 scrollbar-custom"
        hide-default-footer
      >
        <template v-slot:item.actions="{item}">
          <div class="d-flex flex-row align-center justify-end">
            <v-btn icon color="success" @click="goToEdit(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon color="error" @click="goDelete(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>
    
    <!-- dialog add category -->
    <v-dialog v-model="dialogAddCategory" persistent width="400">
      <v-card class="pa-3">
        <v-card-title class="ml-0">Tambah Kategori</v-card-title>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(addCategory)">
            <ValidationProvider v-slot="{ errors }" name="Nama kategori" rules="required">
              <v-text-field
                :error-messages="errors"
                v-model="nameCategory"
                label="Nama Kategori"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error darken-1" text @click="dialogAddCategory = false">Batal</v-btn>
              <v-btn color="primary" dark type="submit" :loading="loading">Tambahkan</v-btn>
            </v-card-actions>
          </v-form>
        </ValidationObserver>
      </v-card>
    </v-dialog>

    <!-- dialog edit category -->
    <v-dialog v-model="dialogEditCategory" persistent width="400">
      <v-card class="pa-3">
        <v-card-title class="ml-0">Edit Kategori</v-card-title>
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
          <v-form @submit.prevent="handleSubmit(editCategory)">
            <ValidationProvider v-slot="{ errors }" name="Nama kategori" rules="required">
              <v-text-field
                :error-messages="errors"
                v-model="selectedCategory.name"
                label="Nama Kategori"
                outlined
                dense
                class="mb-0 mt-2 px-4"
              ></v-text-field>
            </ValidationProvider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error darken-1" text @click="dialogEditCategory = false">Batal</v-btn>
              <v-btn color="primary" dark type="submit" :loading="loading">Edit</v-btn>
            </v-card-actions>
          </v-form>
        </ValidationObserver>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const product = createNamespacedHelpers("product");

export default {
  data() {
    return {
      search: null,
      nameCategory: null,
      selectedCategory: {
        id: null,
        name: null
      },
      headers: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'Nama', value: 'name', sortable: true },
        { text: '', value: 'actions', sortable: false }
      ],
      dialogAddCategory: false,
      dialogEditCategory: false
    }
  },
  computed: {
    ...product.mapState(['loading', 'listCategory'])
  },
  methods: {
    ...product.mapActions(['getCategory', 'postCategory', 'deleteCategory']),
    randomId() {
      var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      var uniqid = randLetter + Date.now();
      return uniqid
    },
    goDelete(item) {
      console.log(item);
      this.deleteCategory(item)
        .then(result => {
          console.log(result);
          this.getCategory()
        })
    },
    goToEdit(item) {
      this.selectedCategory = item
      this.dialogEditCategory = true
    },
    editCategory() {
      this.postCategory(this.selectedCategory)
        .then(result => {
          console.log(result);
          this.dialogEditCategory = false
          this.getCategory()
        })
    },
    addCategory() {
      let dataForm = {
        id: this.randomId(),
        name: this.nameCategory
      }
      this.postCategory(dataForm)
        .then(result => {
          console.log(result);
          this.dialogAddCategory = false
          this.getCategory()
          this.nameCategory = null
        })
    }
  },
  created() {
    this.getCategory()
  },
}
</script>
