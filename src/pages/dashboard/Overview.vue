<template>
  <div>
    <games></games>
    <q-separator/>
    <users></users>
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
  }
</script>
