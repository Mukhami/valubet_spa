<template>
  <div>
    <games v-if="this.isUser || this.isAdmin"></games>
    <q-separator/>
    <users v-if="this.isAdmin"></users>
    <q-separator/>
  </div>
</template>

<script>
  import {defaultMixin} from '../../mixins/mixins'
  import Games from "./games/Games";
  import Users from "./users/Users";

  export default {
    name: 'OverView',
    components: {
      'games': Games,
      'users': Users
    },
    mixins: [defaultMixin],
    mounted() {
      console.log(this.isAdmin)
    }
  }
</script>
