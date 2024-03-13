<template>
  <q-layout
    view="hHh lpR fFf"
    class="bg-grey-1"
  >
    <q-header
      bordered
      class="text-grey-8 q-py-xs"
      style="background: #14144F"
    >
      <q-toolbar>
        <q-toolbar-title>
          <a href="/" style="text-decoration: none" class="row items-center">
            <img src="statics/v8logo.png" style="max-height: 50px" class="gt-xs q-ml-sm" alt="ValueBet">
          </a>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container style="background: #14144F">
      <router-view/>
      <div id="footer-lower">
        <span>
          © 2024 ValueBet
        </span>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
  export default {
    data() {
      return {}
    },

    computed: {
      appName() {
        return process.env.APP_NAME
      }
    }
  }
</script>

<style lang="scss">

</style>
