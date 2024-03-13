import { LocalStorage } from 'quasar'
import {mapActions, mapGetters} from 'vuex'

export const defaultMixin = {
  data() {
    return {
      roles: null,
      user_id: null,
      accessToken: null,
      baseURL: 'http://localhost:4000/api'
    }
  },
  methods: {
    ...mapActions('auth', ['restoreState']),

    axiosAuth () {
      this.roles = LocalStorage.getItem(`${process.env.APP_MACHINE_NAME}-auth`)?.roles;
      this.user_id = LocalStorage.getItem(`${process.env.APP_MACHINE_NAME}-auth`)?.user_id;
      this.accessToken = LocalStorage.getItem(`${process.env.APP_MACHINE_NAME}-auth`)?.token;
      if (this.accessToken) {
        let token = LocalStorage.getItem(`${process.env.APP_MACHINE_NAME}-auth`).token
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
      }
    }
  },

  computed: {
    ...mapGetters('auth', ['fName']),
    appName () {
      return process.env.APP_NAME
    }
  },

  created () {
    this.axiosAuth()
    // if the browser has been reloaded, restore application state from localstorage
    this.restoreState()
  },
}

export const myLoading = {
  methods: {
    loadingShow (component) {
      this[component].loading = true
    },
    loadingHide (component) {
      this[component].loading = false
    }
  }
}
