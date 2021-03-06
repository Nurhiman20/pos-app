<template>
  <div>
    <div class="d-flex flex-row justify-space-between align-center">
      <h1>Akun</h1>
      <div class="d-flex flex-row flex-wrap justify-end">
        <v-btn class="ml-2" color="primary" small :loading="$store.state.loading" @click="setAccount">Simpan</v-btn>
      </div>
    </div>
    <v-card outlined flat class="pa-4 mt-3">
      <v-row>
        <v-col cols="12" md="4" lg="4" xl="4">
          <v-autocomplete
            v-model="outlet"
            :items="$store.state.listOutlet"
            :item-text="textOutlet"
            :item-value="valueOutlet"
            label="Pilih akun cabang"
            class="mb-3 mt-2 px-4"
            outlined
            dense
            hide-no-data
            hide-details
            :clearable="true"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" v-if="outlet.name !== null">
          <div class="px-4">
            <p>Nama cabang</p>
            <h2 class="mt-n3">{{ outlet.name }}</h2>
            <p class="mt-3">Nomor telepon</p>
            <h2 class="mt-n3">{{ outlet.phone }}</h2>
            <p class="mt-3">Alamat cabang</p>
            <h2 class="mt-n3">{{ outlet.address }}</h2>
          </div>
        </v-col>
      </v-row>
    </v-card>

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

export default {
  components: {
    responseDialog
  },
  data() {
    return {
      outlet: {
        name: null,
        phone: null,
        address: null
      },
      dialogSuccess: false,
      dialogFailed: false,
      messageDialog: null
    }
  },
  methods: {
    textOutlet(item) {
      return item.name
    },
    valueOutlet(item) {
      return item
    },
    closeDialogSuccess(e) {
      this.dialogSuccess = e;
      this.$store.dispatch("getOutlet");
    },
    closeDialogFailed(e) {
      this.dialogFailed = e;
    },
    setAccount() {
      let dataForm = {
        ...this.outlet,
        status_account: true
      }
      this.$store.dispatch("updateStatusOutlet", dataForm)
        .then(() => {
          this.messageDialog = "Akun telah diperbarui"
          this.dialogSuccess = true;
        })
    }
  },
  created() {
    this.$store.dispatch("getOutlet")
      .then(() => {
        this.outlet = this.$store.state.account;
      })
  }
}
</script>
