<template>
  <div id="app">
    <lang-buttons v-if="$route.meta.isLogin"/>

    <router-view/>

  </div>
</template>

<script>
  import LangButtons from '@/components/partial/LangButtons'
  export default {
    components: {LangButtons},
    name: 'App',
  }
</script>
<style>
  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
    color: #2c3e50;
  }
</style>
