<template>
  <div>
    <div class="d-flex flex-row justify-space-between align-center">
      <h1>Dashboard</h1>
      <div class="my-auto">
        <v-menu
          ref="filterDate"
          v-model="filterDate"
          :close-on-content-click="false"
          :return-value.sync="selectedDate"
          :nudge-right="-60"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateRangeText"
              label="Pilih tanggal"
              append-icon="mdi-calendar"
              class="mt-3"
              readonly
              outlined
              dense
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="selectedDate"
            range
          >
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              @click="filterDate = false"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="$refs.filterDate.save(selectedDate)"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
      </div>
    </div>
    <div class="mt-3">
      <v-row>
        <v-col cols="12" md="6" lg="6">
          <v-card
            outlined
            flat
            class="pa-4"
          >
            <line-chart :title="'Total Transaksi'"></line-chart>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" lg="6">
          <v-card
            outlined
            flat
            class="pa-4"
          >
            <line-chart :title="'Total Pemasukan'"></line-chart>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import lineChart from "./components/LineChart.vue";

export default {
  components: {
    lineChart
  },
  data() {
    return {
      selectedDate: [],
      filterDate: false
    }
  },
  computed: {
    dateRangeText () {
      return this.selectedDate.join(' ~ ')
    }
  }
}
</script>
