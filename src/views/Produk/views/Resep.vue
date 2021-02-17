<template>
  <div>
    <div class="d-flex flex-row justify-space-between align-center">
      <h1>Resep</h1>
      <div class="d-flex flex-row flex-wrap justify-end">
        <!-- <download-excel
          :data="$store.state.listCategory"
          :fields="jsonFields"
          worksheet="Category"
          name="Kategori.xls"
          class="mb-1"
        >
          <v-btn color="secondary" small>Export</v-btn>
        </download-excel> -->
        <v-btn class="ml-2" color="primary" small @click="dialogAddRecipe = true">Tambah Resep</v-btn>
      </div>
    </div>
    <v-card outlined flat class="pa-4 mt-3">
      <v-row>
        <v-col cols="12" md="4" lg="4">
          <v-autocomplete
            v-model="select"
            :items="itemRecipes"
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
        :items="$store.state.listRecipe"
        :search="search"
        class="elevation-1 scrollbar-custom"
        hide-default-footer
        @click:row="goToEdit"
      >
        <template v-slot:item.ingredient="{item}">
          <p class="my-auto">{{ item.ingredients.length }} bahan</p>
        </template>
      </v-data-table>
    </v-card>

    <add-recipe-dialog
      :show="dialogAddRecipe"
      @closeDialog="closeDialogAdd"
      @success="successPutRecipe"
      @error="failedAddRecipe"
    ></add-recipe-dialog>

    <edit-recipe-dialog 
      :show="dialogEditRecipe"
      :selected="selectedRecipe"
      @closeDialog="closeDialogEdit"
      @success="successPutRecipe"
      @error="failedAddRecipe"
      @delete="deleteRecipe"
      @successDelete="successDelete"
    ></edit-recipe-dialog>

    <response-dialog 
      :success="dialogSuccess"
      :failed="dialogFailed"
      :confirm="dialogConfirm"
      :message="messageDialog"
      @closeSuccess="closeDialogSuccess"
      @closeFailed="closeDialogFailed"
      @closeConfirm="closeDialogConfirm"
      @deleteConfirmed="doDelete"
    ></response-dialog>
  </div>
</template>

<script>
import addRecipeDialog from '../components/TambahResep';
import editRecipeDialog from '../components/EditResep';
import responseDialog from '@/components/ResponseDialog';

export default {
  components: {
    addRecipeDialog,
    editRecipeDialog,
    responseDialog
  },
  data() {
    return {
      search: null,
      select: null,
      itemRecipes: [],
      selectedRecipe: {
        id: null,
        name: null
      },
      selectedDelete: {},
      headers: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'Produk', value: 'product.name', sortable: true },
        { text: 'Varian', value: 'variant', sortable: false },
        { text: 'Bahan', value: 'ingredient', sortable: false }
      ],
      dialogAddRecipe: false,
      dialogEditRecipe: false,
      dialogSuccess: false,
      dialogFailed: false,
      dialogConfirm: false,
      messageDialog: null
    }
  },
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val);
    },
  },
  methods: {
    querySelections(v) {
      let listRecipe = this.$store.state.listRecipe.map(item => item.name);
      this.itemRecipes = listRecipe.filter(e => {
        return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1;
      });
    },
    closeDialogSuccess(e) {
      this.dialogAddRecipe = false;
      this.dialogEditRecipe = false;
      this.dialogSuccess = e;
    },
    closeDialogFailed(e) {
      this.dialogFailed = e;
    },
    closeDialogConfirm(e) {
      this.dialogConfirm = e;
    },
    successDelete() {
      this.$store.dispatch("getCategory");
    },
    closeDialogAdd(e) {
      this.$store.dispatch("getRecipe")
      this.dialogAddRecipe = e
    },
    closeDialogEdit(e) {
      this.$store.dispatch("getRecipe")
      this.dialogEditRecipe = e
    },
    successPutRecipe(e) {
      this.$store.dispatch("getRecipe");
      this.messageDialog = e;
      this.dialogSuccess = true;
    },
    failedAddRecipe(e) {
      this.messageDialog = e;
      this.dialogFailed = true;
    },
    deleteRecipe(e) {
      this.selectedDelete = e;
      this.messageDialog = "Kamu yakin akan menghapus resep ini?"
      this.dialogConfirm = true;
    },
    doDelete() {
      this.$store.dispatch("deleteRecipe", this.selectedDelete)
        .then(() => {          
          this.$store.dispatch("getRecipe");
          this.dialogConfirm = false;
          this.messageDialog = "Berhasil menghapus resep";
          this.dialogSuccess = true;
        })
        .catch(() => {
          this.dialogConfirm = false;
          this.messageDialog = "Terjadi kesalahan. Silahkan coba lagi nanti";
          this.dialogFailed = true;
        })
    },
    goToEdit(item) {
      this.selectedRecipe = item;
      this.dialogEditRecipe = true;
    }
  },
  created() {
    this.$store.dispatch("getRecipe");
    this.$store.dispatch("getProduct");
    this.$store.dispatch("getIngredient");
  }
}
</script>
