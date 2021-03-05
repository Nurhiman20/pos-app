<template>
  <div>
    <div class="d-flex flex-row justify-space-between mb-2">
      <h1>Cabang</h1>
      <v-btn small color="primary" @click="goEditOutlet">Edit</v-btn> 
    </div>    
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4">
          <p>Nama cabang</p>
          <h2 class="mt-n3">{{ $store.state.detailOutlet.name }}</h2>
          <p class="mt-3">Nomor telepon</p>
          <h2 class="mt-n3">{{ $store.state.detailOutlet.phone }}</h2>
          <p class="mt-3">Alamat cabang</p>
          <h2 class="mt-n3">{{ $store.state.detailOutlet.address }}</h2>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="6" xl="6">
        <v-card class="pa-4">          
          <div class="d-flex flex-row justify-space-between">
            <v-card-title>Pegawai</v-card-title>
            <v-btn small color="primary" class="my-auto" @click="$router.push('/pengaturan/pegawai')">Edit</v-btn> 
          </div>
          <v-data-table
            :headers="headersEmployee"
            :items="$store.state.detailOutlet.employee"
            class="elevation-1 scrollbar-custom"
            hide-default-footer
          >
          </v-data-table>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="6" xl="6">
        <v-card class="pa-4">
          <div class="d-flex flex-row justify-space-between">
            <v-card-title>Meja</v-card-title>
            <v-btn small color="primary" class="my-auto" @click="$router.push('/pengaturan/meja')">Edit</v-btn> 
          </div>
          <v-data-table
            :headers="headersTable"
            :items="$store.state.detailOutlet.table"
            class="elevation-1 scrollbar-custom"
            hide-default-footer
          >
          </v-data-table>
        </v-card>
      </v-col>
      <v-col cols="12">
        <receipt-card></receipt-card>
      </v-col>
    </v-row>

    <!-- dialog edit outlet -->
    <edit-outlet-dialog 
      :show="dialogEditOutlet"
      :selected.sync="selectedOutlet"
      @closeDialog="closeDialogEdit"
      @success="successPutOutlet"
      @error="failedPutOutlet"
      @delete="deleteOutlet"
    ></edit-outlet-dialog>

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
import editOutletDialog from '../components/EditOutlet';
import receiptCard from '../components/Struk';
import responseDialog from '@/components/ResponseDialog';

export default {
  components: {
    editOutletDialog,
    responseDialog,
    receiptCard
  },
  data() {
    return {      
      selectedOutlet: {},
      selectedDelete: {},
      headersEmployee: [
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
      dialogEditOutlet: false,
      dialogSuccess: false,
      dialogFailed: false,
      dialogConfirm: false,
      messageDialog: null
    }
  },
  methods: {
    closeDialogSuccess(e) {
      this.dialogEditOutlet = false;
      this.dialogSuccess = e;
    },
    closeDialogFailed(e) {
      this.dialogFailed = e;
    },
    closeDialogConfirm(e) {
      this.dialogConfirm = e;
    },
    closeDialogEdit(e) {
      this.dialogEditOutlet = e;
      this.$store.dispatch("getOutlet");
    },
    successPutOutlet(e) {
      this.$store.dispatch("getOutlet");
      this.messageDialog = e;
      this.dialogSuccess = true;
    },
    failedPutOutlet(e) {
      this.messageDialog = e;
      this.dialogFailed = true;
    },
    deleteOutlet(e) {
      this.selectedDelete = e;
      this.messageDialog = "Kamu yakin akan menghapus outlet ini?"
      this.dialogConfirm = true;
    },
    doDelete() {
      this.$store.dispatch("deleteOutlet", this.selectedDelete)
        .then(() => {          
          this.$store.dispatch("getOutlet");
          this.dialogConfirm = false;
          this.messageDialog = "Berhasil menghapus outlet";
          this.dialogSuccess = true;
          this.$router.push("/pengaturan/cabang");
        })
        .catch(() => {
          this.dialogConfirm = false;
          this.messageDialog = "Terjadi kesalahan. Silahkan coba lagi nanti";
          this.dialogFailed = true;
        })
    },
    goEditOutlet() {
      this.selectedOutlet = this.$store.state.detailOutlet;
      this.dialogEditOutlet = true;
    }
  },
  created() {
    this.$store.dispatch("getOutletById", this.$route.params.id);
    this.$store.dispatch("getOutlet");
    this.$store.dispatch("getEmployee");
    this.$store.dispatch("getTable");
  },
}
</script>
