<template>
  <div>
    <div class="d-flex flex-row justify-space-between align-center">
      <h1>Daftar Kategori</h1>
      <v-btn color="primary" small @click="dialogAddCategory = true">Tambah Kategori</v-btn>
    </div>
    <v-card outlined flat class="pa-4 mt-3">
      <v-row>
        <v-col cols="12" md="4" lg="4">
          <v-autocomplete
            v-model="select"
            :items="itemCategories"
            :search-input.sync="search"
            cache-items
            class="my-4"
            outlined
            dense
            hide-no-data
            hide-details
            :clearable="true"
            label="Cari..."
            append-icon="mdi-magnify"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="listCategory"
        :search="search"
        class="elevation-1 scrollbar-custom"
        hide-default-footer
        @click:row="goToEdit"
      ></v-data-table>
    </v-card>
    
    <!-- dialog add category -->
    <add-category-dialog
      :show="dialogAddCategory"
      @closeDialog="closeDialogAdd"
    ></add-category-dialog>

    <!-- dialog edit category -->
    <edit-category-dialog 
      :show="dialogEditCategory"
      :selected="selectedCategory"
      @closeDialog="closeDialogEdit"
      @successDelete="getCategory"
    ></edit-category-dialog>
  </div>
</template>

<script>
import addCategoryDialog from '../components/TambahKategori';
import editCategoryDialog from '../components/EditKategori';
import { createNamespacedHelpers } from "vuex";
const product = createNamespacedHelpers("product");

export default {
  components: {
    addCategoryDialog,
    editCategoryDialog
  },
  data() {
    return {
      search: null,
      select: null,
      itemCategories: [],
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
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val);
    },
  },
  methods: {
    ...product.mapActions(['getCategory', 'postCategory']),
    querySelections(v) {
      let listCategory = this.listCategory.map(item => item.name);
      this.itemCategories = listCategory.filter(e => {
        return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1;
      });
    },
    closeDialogAdd(e) {
      this.getCategory()
      this.dialogAddCategory = e
    },
    closeDialogEdit(e) {
      this.getCategory()
      this.dialogEditCategory = e
    },
    randomId() {
      var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      var uniqid = 'cat-' + randLetter + Date.now();
      return uniqid
    },
    goDelete(item) {
      this.deleteCategory(item)
        .then(result => {
          console.log(result);
          this.getCategory()
        })
    },
    goToEdit(item) {
      this.selectedCategory = item;
      this.dialogEditCategory = true;
    }
  },
  created() {
    this.getCategory();
  },
}
</script>
