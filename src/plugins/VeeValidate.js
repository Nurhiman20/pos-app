import Vue from 'vue'
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate'
import { required, email, min, integer, max } from 'vee-validate/dist/rules'

// custom validator
extend('required', {
  ...required,
  message: '{_field_} wajib diisi'
})
extend('email', {
  ...email,
  message: 'Email tidak valid'
})
extend('min', {
  ...min,
  message: '{_field_} minimal memiliki {length} karakter'
})
extend('max', {
  ...max,
  message: '{_field_} maksimal memiliki {length} karakter'
})
extend('integer', {
  ...integer,
  message: '{_field_} harus diisi dengan angka'
})
extend('password', {
  params: ['target'],
  validate (value, { target }) {
    return value === target
  },
  message: 'Konfirmasi password tidak sesuai'
})

// register component globaly
Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)
