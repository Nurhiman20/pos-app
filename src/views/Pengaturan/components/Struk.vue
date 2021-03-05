<template>
  <div>    
    <v-card outlined flat class="pa-4 mt-3">
      <div class="d-flex flex-row justify-space-between align-center">
        <h1>Struk</h1>
        <div class="d-flex flex-row">
          <v-btn small color="secondary" class="mr-3" @click="showPreview">Preview</v-btn>
          <v-btn small color="primary" :loading="$store.state.loading" @click="saveReceipt">Simpan</v-btn>
        </div>
      </div>
      <div class="px-4 mb-3 mt-6" v-if="previewImage !== null">
        <p class="text-bold">Preview Logo</p>
        <v-img :src="previewImage" max-width="200" :aspect-ratio="4/3"></v-img>
      </div>
      <v-file-input
        v-model="receipt.logo"
        label="Logo Outlet"
        class="mb-0 mt-3 px-4"
        prepend-icon="mdi-camera"
        accept="image/*"
        ref="inputImage"
        outlined
        dense
        @change="setPreviewImage"
        :rules="rulesImage"
      ></v-file-input>
      <v-text-field
        v-model="receipt.outlet_name"
        label="Nama Outlet"
        outlined
        dense
        class="mb-0 mt-2 px-4"
      ></v-text-field>
      <v-text-field
        v-model="receipt.phone_number"
        label="Nomor Telepon"
        outlined
        dense
        class="mb-0 mt-2 px-4"
      ></v-text-field>
      <v-textarea
        v-model="receipt.address"
        label="Alamat"
        class="mb-0 mt-2 px-4"
        rows="3"
        outlined
        counter
        auto-grow
      ></v-textarea>
      <v-row>
        <v-col cols="12" md="3" lg="3" xl="3">
          <v-text-field
            v-model="receipt.website"
            label="Website"
            prepend-icon="mdi-web"
            outlined
            dense
            class="mb-0 mt-2 px-4"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3" lg="3" xl="3">
          <v-text-field
            v-model="receipt.ig"
            label="Instagram"
            prepend-icon="mdi-instagram"
            outlined
            dense
            class="mb-0 mt-2 px-4"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3" lg="3" xl="3">
          <v-text-field
            v-model="receipt.fb"
            label="Facebook"
            prepend-icon="mdi-facebook"
            outlined
            dense
            class="mb-0 mt-2 px-4"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3" lg="3" xl="3">
          <v-text-field
            v-model="receipt.twitter"
            label="Twitter"
            prepend-icon="mdi-twitter"
            outlined
            dense
            class="mb-0 mt-2 px-4"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-textarea
        v-model="receipt.notes"
        label="Catatan"
        class="mb-0 mt-2 px-4"
        rows="3"
        outlined
        counter
        auto-grow
      ></v-textarea>
    </v-card>

    <!-- dialog preview receipt -->
    <receipt-dialog
      :show="dialogReceipt"
      :selected="selectedTransaction"
      @closeDialog="closeDialogReceipt"
    ></receipt-dialog>

    <!-- response dialog -->
    <response-dialog 
      :success="dialogSuccess"
      :failed="dialogFailed"
      :message="messageDialog"
      @closeSuccess="closeDialogSuccess"
      @closeFailed="closeDialogFailed"
    ></response-dialog>
  </div>
</template>

<script>
import responseDialog from '@/components/ResponseDialog';
import receiptDialog from './PreviewReceipt';

export default {
  components: {
    responseDialog,
    receiptDialog
  },
  data() {
    return {
      previewImage: null,
      rulesImage: [
        value => !value || value.size < 2000000 || 'Ukuran foto tidak boleh lebih dari 2 MB',
      ],
      selectedTransaction: {},
      dialogReceipt: false,
      dialogSuccess: false,
      dialogFailed: false,
      messageDialog: null
    }
  },
  computed: {
    receipt: {
      get() {
        return this.$store.state.detailOutlet.receipt
      },
      set(val) {
        this.$store.commit("SET_DETAIL_OUTLET", val);
      }
    }
  },
  methods: {    
    setPreviewImage(e) {
      if (e !== null) {
        this.previewImage = URL.createObjectURL(e);
      } else {
        this.previewImage = null;
      }
    },
    closeDialogSuccess(e) {
      this.dialogSuccess = e;
    },
    closeDialogFailed(e) {
      this.dialogFailed = e;
    },
    closeDialogReceipt(e) {
      this.dialogReceipt = e;
    },
    showPreview() {
      this.selectedTransaction = this.$store.state.listTransaction[0];
      this.dialogReceipt = true;
    },
    saveReceipt() {
      this.$store.dispatch("updateReceipt", this.receipt)
        .then(() => {
          this.messageDialog = "Struk telah diperbarui";
          this.dialogSuccess = true;
        })
        .catch(() => {
          this.messageDialog = "Terjadi masalah. Silahkan coba lagi nanti";
          this.dialogFailed = true;
        });
    }
  },
  created() {
    this.$store.dispatch("getTransaction")
      .then(() => {
        this.previewImage = URL.createObjectURL(this.receipt.logo);
      })
  }
}
</script>
