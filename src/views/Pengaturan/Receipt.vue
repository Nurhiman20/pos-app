<template>
  <div>
    <div class="d-flex flex-row justify-space-between align-center">
      <h1>Receipt</h1>
      <div class="d-flex flex-row">
        <v-btn color="secondary" class="mr-3" @click="showPreview">Preview</v-btn>
        <v-btn color="primary" :loading="$store.state.loading" @click="saveReceipt">Simpan</v-btn>
      </div>
    </div>
    <v-card outlined flat class="pa-4 mt-3">
      <div class="px-4 mb-3" v-if="previewImage !== null">
        <p class="text-bold">Preview Logo</p>
        <v-img :src="previewImage" max-width="200" :aspect-ratio="4/3"></v-img>
      </div>
      <v-file-input
        v-model="image"
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
        v-model="outlet"
        label="Nama Outlet"
        outlined
        dense
        class="mb-0 mt-2 px-4"
      ></v-text-field>
      <v-text-field
        v-model="phone"
        label="Nomor Telepon"
        outlined
        dense
        class="mb-0 mt-2 px-4"
      ></v-text-field>
      <v-textarea
        v-model="address"
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
            v-model="website"
            label="Website"
            prepend-icon="mdi-web"
            outlined
            dense
            class="mb-0 mt-2 px-4"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3" lg="3" xl="3">
          <v-text-field
            v-model="instagram"
            label="Instagram"
            prepend-icon="mdi-instagram"
            outlined
            dense
            class="mb-0 mt-2 px-4"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3" lg="3" xl="3">
          <v-text-field
            v-model="facebook"
            label="Facebook"
            prepend-icon="mdi-facebook"
            outlined
            dense
            class="mb-0 mt-2 px-4"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3" lg="3" xl="3">
          <v-text-field
            v-model="twitter"
            label="Twitter"
            prepend-icon="mdi-twitter"
            outlined
            dense
            class="mb-0 mt-2 px-4"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-textarea
        v-model="notes"
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
import receiptDialog from './components/PreviewReceipt';

export default {
  components: {
    responseDialog,
    receiptDialog
  },
  data() {
    return {
      outlet: null,
      phone: null,
      image: null,
      address: null,
      website: null,
      instagram: null,
      facebook: null,
      twitter: null,
      notes: null,
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
      console.log(this.$store.state.listTransaction[0]);
      this.selectedTransaction = this.$store.state.listTransaction[0];
      this.dialogReceipt = true;
    },
    saveReceipt() {
      let dataForm = {
        outlet_name: this.outlet,
        phone_number: this.phone,
        logo: this.image,
        address: this.address,
        website: this.website,
        ig: this.instagram,
        fb: this.facebook,
        twitter: this.twitter,
        notes: this.notes
      }
      this.$store.dispatch("updateReceipt", dataForm)
        .then(() => {
          this.messageDialog = "Receipt telah diperbarui";
          this.dialogSuccess = true;
        })
        .catch(() => {
          this.messageDialog = "Terjadi masalah. Silahkan coba lagi nanti";
          this.dialogFailed = true;
        });
    }
  },
  created() {
    this.$store.dispatch("getTransaction");  
    this.$store.dispatch("getOutlet")
      .then(() => {
        if (this.$store.state.account.receipt !== null || this.$store.state.account.receipt !== undefined) {
          this.image = this.$store.state.account.receipt.logo;
          this.outlet = this.$store.state.account.receipt.outlet_name;
          this.phone = this.$store.state.account.receipt.phone_number;
          this.address = this.$store.state.account.receipt.address;
          this.website = this.$store.state.account.receipt.website;
          this.instagram = this.$store.state.account.receipt.ig;
          this.facebook = this.$store.state.account.receipt.fb;
          this.twitter = this.$store.state.account.receipt.twitter;
          this.notes = this.$store.state.account.receipt.notes;
          this.previewImage = URL.createObjectURL(this.image);
        }
      })
  }
}
</script>
