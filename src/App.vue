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
    created() {
      this.$store.dispatch("FETCH_ANALYSIS_METHODS");
      this.$store.dispatch("FETCH_SAMPLE_PURPOSES")
      this.$store.dispatch("FETCH_FOSSIL_GROUPS")
    }
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
