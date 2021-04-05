<template>
  <div>
    <h1>Transfer</h1>
    <v-card outlined class="mt-3">
      <v-tabs vertical>
        <v-tab>
          Pesanan
        </v-tab>
        <v-tab>
          Pesanan Diterima
        </v-tab>
        <v-tab>
          Pengiriman
        </v-tab>
        <v-tab>
          Penerimaan
        </v-tab>

        <v-tab-item>
          <order-tab></order-tab>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <receive-order-tab></receive-order-tab>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <delivery-tab></delivery-tab>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <receive-tab></receive-tab>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </div>
</template>

<script>
import orderTab from './components/Pesanan';
import receiveOrderTab from './components/PesananDiterima';
import deliveryTab from './components/Pengiriman';
import receiveTab from './components/Penerimaan';

export default {
  components: {
    orderTab,
    receiveOrderTab,
    deliveryTab,
    receiveTab
  }
}
</script>
