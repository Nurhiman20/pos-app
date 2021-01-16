<template>
  <div>
    <v-app-bar
      app
      clipped-left
      color="background lighten-1"
      height="50px"
    >
      <div class="logo d-flex align-center">
        <span class="logo-text ml-2">Test</span>
        <p class="text-small">POS</p>
      </div>
      <!-- <v-btn icon color="#717171" @click="hideDrawer" class="ml-12">
        <v-icon>mdi-menu</v-icon>
      </v-btn> -->
      <v-spacer></v-spacer>
      <div>
        <v-menu
          bottom
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              outlined
              color="primary"
            >
              Owner
              <v-icon class="ml-1">mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-list>
              <v-list-item
                v-for="(item, i) in items"
                :key="i"
                @click="() => {}"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: 'AppHeader',
  props: ['drawer'],
  data () {
    return {
      items: [
        {
          title: 'Profile'
        },
        {
          title: 'Sign Out'
        }
      ]
    }
  }
}
</script>
