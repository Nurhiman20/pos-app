<template>
  <div>
    <div class="d-flex flex-row justify-space-between align-center">
      <h1>Bahan</h1>
      <div class="d-flex flex-row flex-wrap justify-end">
        <download-excel
          :data="$store.state.listIngredient"
          :fields="jsonFields"
          worksheet="Ingredient"
          name="Bahan.xls"
          class="mb-1"
        >
          <v-btn color="secondary" small>Export</v-btn>
        </download-excel>
        <v-btn class="ml-2" color="primary" small @click="dialogAddIngredient = true">Tambah Bahan</v-btn>
      </div>
    </div>
    <v-card outlined flat class="pa-4 mt-3">
      <v-row>
        <v-col cols="12" md="4" lg="4">
          <v-autocomplete
            v-model="select"
            :items="itemIngredients"
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
        :items="$store.state.listIngredient"
        :search="search"
        class="elevation-1 scrollbar-custom"
        hide-default-footer
        @click:row="goToEdit"
      ></v-data-table>
    </v-card>

    <!-- dialog add ingredient -->
    <add-ingredient-dialog
      :show="dialogAddIngredient"
      @closeDialog="closeDialogAdd"
      @success="successPutIngredient"
      @error="failedAddIngredient"
    ></add-ingredient-dialog>

    <!-- dialog edit ingredient -->
    <edit-ingredient-dialog 
      :show="dialogEditIngredient"
      :selected="selectedIngredient"
      @closeDialog="closeDialogEdit"
      @success="successPutIngredient"
      @error="failedAddIngredient"
      @delete="deleteIngredient"
      @successDelete="successDelete"
    ></edit-ingredient-dialog>
    
    <!-- response dialog -->
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
import addIngredientDialog from '../components/TambahBahan';
import editIngredientDialog from '../components/EditBahan';
import responseDialog from '../../../components/ResponseDialog';

export default {
  components: {
    addIngredientDialog,
    editIngredientDialog,
    responseDialog
  },
  data() {
    return {
      search: null,
      select: null,
      itemIngredients: [],
      selectedIngredient: {
        id: null,
        name: null
      },
      selectedDelete: {},
      headers: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'Nama', value: 'name', sortable: true },
        { text: 'Kategori', value: 'category.name', sortable: true },
        { text: 'Stok Awal', value: 'stock', sortable: true },
        { text: 'Satuan', value: 'unit', sortable: true },
        { text: 'Harga per Satuan', value: 'price', sortable: true }
      ],
      jsonFields: {
        ID: 'id',
        Nama: 'name',
        Kategori: 'category.name',
        'Stok Awal': 'stock',
        Satuan: 'unit',
        'Harga per Satuan': 'price'
      },
      dialogAddIngredient: false,
      dialogEditIngredient: false,
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
      let listIngredient = this.$store.state.listIngredient.map(item => item.name);
      this.itemIngredients = listIngredient.filter(e => {
        return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1;
      });
    },
    closeDialogSuccess(e) {
      this.dialogAddIngredient = false;
      this.dialogEditIngredient = false;
      this.dialogSuccess = e;
    },
    closeDialogFailed(e) {
      this.dialogFailed = e;
    },
    closeDialogConfirm(e) {
      this.dialogConfirm = e;
    },
    closeDialogAdd(e) {
      this.$store.dispatch("getIngredient")
      this.dialogAddIngredient = e
    },
    closeDialogEdit(e) {
      this.$store.dispatch("getIngredient")
      this.dialogEditIngredient = e
    },
    failedAddIngredient(e) {
      this.messageDialog = e;
      this.dialogFailed = true;
    },
    successPutIngredient(e) {
      this.$store.dispatch("getIngredient");
      this.messageDialog = e;
      this.dialogSuccess = true;
    },    
    successDelete() {
      this.$store.dispatch("getIngredient");
    },
    deleteIngredient(e) {
      this.selectedDelete = e;
      this.messageDialog = "Kamu yakin akan menghapus bahan ini?"
      this.dialogConfirm = true;
    },
    doDelete() {
      this.$store.dispatch("deleteIngredient", this.selectedDelete)
        .then(() => {          
          this.$store.dispatch("getIngredient");
          this.dialogConfirm = false;
          this.messageDialog = "Berhasil menghapus bahan";
          this.dialogSuccess = true;
        })
        .catch(() => {
          this.dialogConfirm = false;
          this.messageDialog = "Terjadi kesalahan. Silahkan coba lagi nanti";
          this.dialogFailed = true;
        })
    },
    goToEdit(item) {
      this.selectedIngredient = item;
      this.dialogEditIngredient = true;
    }
  },
  created() {
    this.$store.dispatch("getIngredient");    
    this.$store.dispatch("getCategory");
  },
}
</script>
