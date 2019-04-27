<template>
  <div id="app">
    <lang-buttons/>

    <router-view/>
    <!--<div class="row p-5">-->
      <!--<div id="logs"></div>-->
    <!--</div>-->

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
    //show console info
    // mounted(){
    //   (function() {
    //     var exLog = console.log;
    //     console.log = function(msg) {
    //       exLog.apply(console, arguments);
    //       document.getElementById("logs").innerHTML += document.getElementById("logs").innerHTML +"<br><br><br>"+ JSON.stringify(msg);
    //     }
    //   })()
    // },

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
