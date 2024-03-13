<template>
  <q-layout
    view="hHh lpR fFf"
    class="bg-grey-1"
  >
    <q-header
      bordered
      class="text-white q-py-xs"
      height-hint="58"
      style="background: #14144F"
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
        />

        <a href="#/" style="text-decoration: none" class="row items-center">
          <img src="statics/v8logo.png" style="max-height: 50px" class="gt-xs q-ml-sm">
        </a>

        <q-space/>
        <span class="text-body1 text-white q-mr-sm">User dashboard</span>
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn-dropdown
            icon="account_circle"
            no-caps
            color="white"
            rounded
            flat
          >
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-weight-thin">
                    {{ fName }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="onLogout">
                <q-item-section>
                  <q-item-label>Logout</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="arrow_right_alt" color="accent"/>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
      :width="220"
    >
      <q-scroll-area class="fit">

        <q-list padding>
          <q-item-label header class="text-weight-bold text-uppercase text-grey-5">
            Main
          </q-item-label>

          <q-item
            clickable
            :to="{ name: 'dashboard'}"
            v-ripple
            :active="link === 'home'"
            @click="link = 'home'"
            active-class="my-menu-link"
            exact
          >
            <q-item-section avatar>
              <q-icon name="person_pin" color="accent"/>
            </q-item-section>

            <q-item-section>Overview</q-item-section>
          </q-item>

          <q-item
            clickable
            :to="{ name: 'dashboard.games'}"
            v-ripple
            :active="link === 'games'"
            @click="link = 'games'"
            active-class="my-menu-link"
            exact
          >
            <q-item-section avatar>
              <q-icon name="sports_soccer" color="accent"/>
            </q-item-section>

            <q-item-section>Games</q-item-section>
          </q-item>

          <q-item
            clickable
            :to="{ name: 'dashboard.users'}"
            v-ripple
            :active="link === 'users'"
            @click="link = 'users'"
            active-class="my-menu-link"
            exact
          >
            <q-item-section avatar>
              <q-icon name="people_alt" color="accent"/>
            </q-item-section>

            <q-item-section>Users</q-item-section>
          </q-item>

          <q-item
            clickable
            :to="{ name: 'dashboard.my-bets'}"
            v-ripple
            :active="link === 'bets'"
            @click="link = 'bets'"
            active-class="my-menu-link"
            exact
          >
            <q-item-section avatar>
              <q-icon name="toc" color="accent"/>
            </q-item-section>

            <q-item-section>My Bets</q-item-section>
          </q-item>

        </q-list>
      </q-scroll-area>

    </q-drawer>
    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  import {defaultMixin} from '../mixins/mixins'
  import {notifySuccess, notifyWarning} from '../my-helpers/helper'

  export default {
    name: 'Dashboard',
    mixins: [defaultMixin],
    data() {
      return {
        leftDrawerOpen: false,
        link: '',
      }
    },
    methods: {
      ...mapActions('auth', ['clearState']),
      onLogout() {
        notifySuccess("Logging out User")
        this.clearState()
        this.$router.push({name: 'auth.login'})
      }
    }
  }
</script>

<style lang="scss">
  .my-menu-link {
    color: #3EA8F4
  }

  .q-btn-dropdown--simple .q-btn-dropdown__arrow {
    margin-left: 0;
  }

</style>
