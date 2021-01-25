<template>
  <div>
    <!-- dialog sukses -->
    <v-dialog persistent v-model="success" max-width="400px">
      <v-card class="pt-8 pb-6 px-4">
        <v-card-text>
          <div class="dialog">
            <v-icon size="140" color="success" class="mb-4">mdi-checkbox-marked-circle</v-icon>
            <p class="title">Sukses!</p>
            <p class="message">{{ message }}</p>
            <v-btn color="primary" block @click="closeDialogSuccess">
              Tutup
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- dialog error -->
    <v-dialog persistent v-model="failed" max-width="400px">
      <v-card class="pt-8 pb-6 px-4">
        <v-card-text>
          <div class="dialog">
            <v-icon size="140" color="error" class="mb-4">mdi-alert-circle-outline</v-icon>
            <p class="title">Oops!</p>
            <p class="message">{{ message }}</p>
            <v-btn color="primary" block @click="closeDialogFailed">
              Tutup
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- dialog hapus -->
    <v-dialog persistent v-model="confirm" max-width="400px">
      <v-card class="pt-8 pb-6 px-4">
        <v-card-text>
          <div class="dialog">
            <v-icon size="140" color="error" class="mb-4">mdi-alert-circle-outline</v-icon>
            <p class="message">{{ message }}</p>
            <v-btn color="error" block @click="deleteConfirmed">
              Hapus
            </v-btn>
            <v-btn color="warning" class="mt-2" block text @click="closeDialogConfirm">
              Batal
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ['success', 'failed', 'confirm', 'message'],
  methods: {
    closeDialogSuccess() {
      this.$emit('closeSuccess', false)
    },
    closeDialogFailed() {
      this.$emit('closeFailed', false)
    },
    closeDialogConfirm() {
      this.$emit('closeConfirm', false)
    },
    deleteConfirmed() {
      this.$emit('deleteConfirmed', true)
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .title{
    font-weight: bold;
    font-size: 25px;
    line-height: 18px;
  }
  .message{
    font-weight: bold;
    font-size: 18px;
    line-height: 25px;
    text-align: center;
  }
}
</style>
