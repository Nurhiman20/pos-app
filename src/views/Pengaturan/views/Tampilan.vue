<template>
  <div>
    <div class="d-flex flex-row justify-space-between align-center">
      <h1>Tampilan</h1>
    </div>
    <v-card outlined flat class="pa-4 mt-3">
      <h3>Tema Gelap / Dark Themes</h3>
      <v-switch
        v-model="darkTheme"
        inset
        :label="themeLabel"
        @change="setDarkTheme"
      ></v-switch>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      darkTheme: false,
      themeLabel: 'Terang'
    }
  },
  methods: {
    setDarkTheme(val) {
      this.$vuetify.theme.dark = val;
      localStorage.setItem('darkTheme', val);
      if (val) {
        this.themeLabel = 'Gelap';
      } else {
        this.themeLabel = 'Terang';
      }
    }
  },
  created() {
    let dark = localStorage.getItem('darkTheme');
    if (dark === 'true') {
      this.themeLabel = 'Gelap';
      this.darkTheme = true;
    } else {
      this.themeLabel = 'Terang';
      this.darkTheme = false;
    }
  },
}
</script>
