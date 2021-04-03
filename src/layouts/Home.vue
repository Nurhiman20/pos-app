<template>
  <v-app id="keep">
    <app-header></app-header>
    <app-sidebar :drawer="drawer"></app-sidebar>
    <v-main class="app-content">
      <div class="ml-0 mt-1">
        <v-breadcrumbs :items="breadcrumbItems">
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item
              :disabled="item.disabled"
              :exact="item.exact"
              :to="item.to">
              <span :class="!item.disabled && 'text-red'">{{ item.text }}</span>
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </div>
      <div class="px-6 mb-10">
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
  computed: {
    breadcrumbItems () {
      const isLength = this.$route.matched.length > 0
      if (isLength) {
        const breadcrumbArr = [...this.$route.matched]
        let currentBreadcrumbValue = null
        const breadcrumbComponent = breadcrumbArr.map(item => {
          if (item.name === currentBreadcrumbValue) {
            return false
          } else {
            currentBreadcrumbValue = item.name
            return {
              text: item.name,
              to: item.path,
              exact: true,
              disabled: this.$route.name === item.name
            }
          }
        })
        return breadcrumbComponent.filter(item => item)
      } else {
        return []
      }
    }
  },
  created() {    
    this.$store.dispatch("getOutlet");
    const dark = localStorage.getItem('darkTheme');
    
    if (dark === 'true') {
      this.$vuetify.theme.dark = true;
    } else {
      this.$vuetify.theme.dark = false;
    }

    this.$store.dispatch("submitTable", {
      id: 'default-table-0000',
      table_number: 0,
      capacity: '-',
      id_outlet: this.$store.state.account.id,
      outlet: this.$store.state.account
    });
    this.$store.dispatch("submitCustomer", {
      id: 'default-customer-0000',
      name: 'Default',
      phone_number: '-',
      email: '-'
    });
  }
}
</script>

<style lang="scss">
.app-content {
  position: relative;
  min-height: 100vh;
  background-color: var(--v-background-base);
}
#keep .v-navigation-drawer__border {
  display: none
}
.logo {
  .logo-text {
    font-family: 'Montserrat', sans-serif;
    font-weight: bold;
    font-size: 20px;
    color: #FFFFFF;
  }
  img {
    height: 50px;
  }
  p {
    color: var(--v-secondary-base);
  }
}
</style>
