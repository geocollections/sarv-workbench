<template>
  <div id="app">
    <lang-buttons/>
    <router-view/>
  </div>
</template>

<script>
  import LangButtons from '@/components/partial/LangButtons'
  export default {
    components: {LangButtons},
    name: 'App'
  }
</script>

<style>
  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /*text-align: center;*/
    /*margin-top: 60px;*/
    height: 100%;
    color: #2c3e50;
  }
</style>
