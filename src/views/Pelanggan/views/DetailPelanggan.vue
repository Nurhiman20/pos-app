<template>
  <div>
    <div class="d-flex flex-row justify-space-between mb-2">
      <h1>{{ this.$store.state.detailCustomer.name }}</h1>
      <v-btn class="ml-2" color="primary" small @click="goToEdit">Edit</v-btn>
    </div>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-3 mt-4">
          <div class="d-flex flex-row justify-space-between">
            <v-card-title>Tentang Pengguna</v-card-title>
          </div>
          <v-container>
            <v-row>
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-row no-gutters>
                  <v-col cols="4">
                    <p>ID</p>
                  </v-col>
                  <v-col cols="8">
                    <p class="text-bold">{{ this.$store.state.detailCustomer.id }}</p>
                  </v-col>
                  <v-col cols="4">
                    <p>Name</p>
                  </v-col>
                  <v-col cols="8">
                    <p class="text-bold">{{ this.$store.state.detailCustomer.name }}</p>
                  </v-col>
                  <v-col cols="4">
                    <p>Nomor HP</p>
                  </v-col>
                  <v-col cols="8">
                    <p class="text-bold">{{ this.$store.state.detailCustomer.phone_number }}</p>
                  </v-col>
                </v-row>
              </v-col>            
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-row no-gutters>
                  <v-col cols="4">
                      <p>Email</p>
                    </v-col>
                    <v-col cols="8">
                      <p class="text-bold">{{ this.$store.state.detailCustomer.email }}</p>
                    </v-col>
                    <v-col cols="4">
                      <p>Jumlah Transaksi</p>
                    </v-col>
                    <v-col cols="8">
                      <p class="text-bold">{{ this.$store.getters.countCustomerTx }}</p>
                    </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card class="pa-3 mt-4">
          <div class="d-flex flex-row justify-space-between">
            <v-card-title>Transaksi</v-card-title>
          </div>
          <v-data-table
            :headers="headersTransaction"
            :items="$store.getters.viewCustomerTx"
            class="elevation-1 scrollbar-custom"
            hide-default-footer
          >
            <template v-slot:item.products_sold="{item}">
              <div v-for="(prod, index) in item.products_sold" :key="index">
                <div class="d-flex flex-row align-center py-2">
                  <v-img :src="showImage(prod.image)" min-width="60" max-width="60" :aspect-ratio="4/3"></v-img>
                  <div class="ml-2 mt-4">
                    <p class="text-bold mb-0">{{ prod.name }} ({{ prod.qty }})</p>
                    <p class="app-subtitle">Rp{{ formatCurrency(prod.price) }},00</p>
                  </div>
                </div>
              </div>
            </template>
            <template v-slot:item.total="{item}">
              <p>Rp{{ formatCurrency(item.total) }},00</p>
            </template>
            <template v-slot:item.date="{item}">
              <p>{{ item.time }}</p>
            </template>
            <template v-slot:item.time="{item}">
              <p>{{ item.time }}</p>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- dialog edit customer -->
    <edit-customer-dialog 
      :show="dialogEditCustomer"
      :selected.sync="selectedCustomer"
      @closeDialog="closeDialogEdit"
      @success="successPutCustomer"
      @error="failedPutCustomer"
      @delete="deleteCustomer"
      @successDelete="successDelete"
    ></edit-customer-dialog>

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
import editCustomerDialog from '../components/EditPelanggan';
import responseDialog from '@/components/ResponseDialog';

export default {
  components: {
    editCustomerDialog,
    responseDialog
  },
  data() {
    return {
      selectedCustomer: {},
      selectedDelete: {},
      headersTransaction: [
        { text: 'Tanggal', value: 'date', sortable: true },
        { text: 'Waktu', value: 'time', sortable: true },
        { text: 'ID Transaksi', value: 'id', sortable: false },
        { text: 'Produk', value: 'products_sold', sortable: false },
        { text: 'Total Harga', value: 'total', sortable: false }
      ],
      dialogEditCustomer: false,
      dialogSuccess: false,
      dialogFailed: false,
      dialogConfirm: false,
      messageDialog: null
    }
  },
  methods: {
    formatCurrency(val) {
      return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
    },    
    showImage(item) {
      if (item !== null) {
        return URL.createObjectURL(item);
      } else {
        return null;
      }
    },
    closeDialogEdit(e) {
      this.dialogEditCustomer = e;
    },
    closeDialogSuccess(e) {
      this.dialogEditCustomer = false;
      this.dialogSuccess = e;
    },
    closeDialogFailed(e) {
      this.dialogFailed = e;
    },
    closeDialogConfirm(e) {
      this.dialogConfirm = e;
    },
    successDelete() {
      this.$store.dispatch("getCustomer");
    },
    successPutCustomer(e) {
      this.$store.dispatch("getCustomer");
      this.messageDialog = e;
      this.dialogSuccess = true;
    },
    failedPutCustomer(e) {
      this.messageDialog = e;
      this.dialogFailed = true;
    },
    deleteCustomer(e) {
      this.selectedDelete = e;
      this.messageDialog = "Kamu yakin akan menghapus pelanggan ini?"
      this.dialogConfirm = true;
    },
    doDelete() {
      this.$store.dispatch("deleteCustomer", this.selectedDelete)
        .then(() => {          
          this.$store.dispatch("getCustomer");
          this.dialogConfirm = false;
          this.messageDialog = "Berhasil menghapus pelanggan";
          this.dialogSuccess = true;
          this.$router.push('/pelanggan/list');
        })
        .catch(() => {
          this.dialogConfirm = false;
          this.messageDialog = "Terjadi kesalahan. Silahkan coba lagi nanti";
          this.dialogFailed = true;
        })
    },
    goToEdit() {
      this.selectedCustomer = this.$store.state.detailCustomer;
      this.dialogEditCustomer = true;
    }
  },
  created() {
    this.$store.dispatch("getCustomer");
    this.$store.dispatch("getCustomerById", this.$route.params.id);
    this.$store.dispatch("getTransaction");    
  }
}
</script>
