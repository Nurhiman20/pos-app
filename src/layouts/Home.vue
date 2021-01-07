<template>
  <v-app id="keep">
    <app-header></app-header>
    <app-sidebar :drawer="drawer"></app-sidebar>
    <v-main class="app-content">
      <div class="px-6 mb-10 mt-3">
        <router-view></router-view>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import AppHeader from '@/components/AppHeader'
import AppSidebar from '@/components/AppSidebar'

export default {
  components: {
    AppHeader,
    AppSidebar
  },
  data: () => ({
    drawer: true
  }),
  methods: {
  }
}
</script>

<style lang="scss">
.app-content {
  position: relative;
  min-height: 100vh;
  background-color: #F4F5F6;
}
#keep .v-navigation-drawer__border {
  display: none
}
.logo {
  .logo-text {
    font-family: 'Montserrat', sans-serif;
    font-weight: bold;
    font-size: 20px;
    color: #3987D5;
  }
  img {
    height: 50px;
  }
}
</style>
