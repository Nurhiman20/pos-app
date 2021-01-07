<template>
  <v-navigation-drawer
    v-model="drawer"
    expand-on-hover
    permanent
    app
    clipped
    color="white lighten-4"
  >
    <v-list
      dense
      class="white lighten-4"
    >
      <template v-for="(item, i) in sidebarData">
        <v-row
          v-if="item.heading"
          :key="i"
          align="center"
        >
          <v-col cols="12">
            <v-subheader v-if="item.heading">
              {{ item.heading }}
            </v-subheader>
          </v-col>
        </v-row>
        <v-divider
          v-else-if="item.divider"
          :key="i"
          dark
          class="my-4"
        />
        <v-list-item
          v-else
          :key="i"
          link
          :to="item.to"
        >
          <v-list-item-action>
            <v-icon color="primary">{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-title class="grey--text" style="margin-left:-15px">
            {{ item.text }}
          </v-list-item-title>
        </v-list-item>
      </template>
      <v-list-group
        v-for="(mainMenuItem, i) in mainMenuData"
        :key="'main menu ' + i"
        :value="false"
        color="primary"
      >
        <template v-slot:prependIcon>
          <v-icon color="primary">{{mainMenuItem.icon}}</v-icon>
        </template>
        <template v-slot:activator>
          <v-list-item-title style="margin-left:-15px">{{mainMenuItem.text}}</v-list-item-title>
        </template>
        <v-list-item link
          exact
          v-for="(mainMenuItemChild, a) in mainMenuItem.children"
          :key="a"
          :to="mainMenuItemChild.to"
          >
          <v-list-item-content class="pl-10">
            <v-list-item-title>{{mainMenuItemChild.text}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
    </v-navigation-drawer>
</template>

<script>
import { sidebar, mainMenu } from '@/router/nav'

export default {
  name: 'AppSidebar',
  props: ['drawer'],
  data () {
    return {
      mini: false
    }
  },
  computed: {
    sidebarData () {
      return sidebar
    },
    mainMenuData () {
      return mainMenu
    }
  }
}
</script>

<style lang="scss">
#keep .v-navigation-drawer__border {
  display: none
}
</style>
