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
        background: '#F4F5F6'
      },
      dark: {
        background: '#000000'
      }
    }
  }
});
