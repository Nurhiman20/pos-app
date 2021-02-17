import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi'
  },
  theme: { 
    dark: false,
    options: { 
      customProperties: true
    },
    themes: {
      light: {
        primary: '#38A1B7',
        secondary: '#FECD0E',
        background: '#F4F5F6'
      },
      dark: {
        primary: '#38A1B7',
        secondary: '#FECD0E',
        background: '#000000'
      }
    }
  }
});
