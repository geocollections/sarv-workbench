<template>
  <div class="dashboard">
    <app-header/>

    <sidebar v-if="$route.meta.isSidebarShown"/>

    <div class="main container" v-bind:class="{ sidebarOpen: sidebarOpen }">
      <router-view/>
    </div>

    <app-footer/>

  </div>
</template>

<script>
  import AppHeader from '@/components/partial/AppHeader'
  import AppFooter from '@/components/partial/AppFooter'
  import Sidebar from "../components/partial/Sidebar";

  export default {
    components: {
      Sidebar,
      AppHeader,
      AppFooter
    },
    name: "Dashboard",
    data() {
      return {
        sidebarOpen : false
      }
    },
    mounted() {
      this.$root.$on('show-sidebar',this.setSitebarPosition)
    },
    methods: {
      setSitebarPosition(constState) {
        if(constState === false) this.sidebarOpen = constState;
        else this.sidebarOpen = !this.sidebarOpen;
      }
    },
    metaInfo () {
      return {
        title: this.$t('titles.dashboard')
      }
    },
  }
</script>

<style scoped>
  .dashboard {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }

  .main {
    padding: 56px 15px 0;
    margin: 0 auto;
    flex: 1;
  }
  .main.container.sidebarOpen {
    width: calc(100% - 200px)!important;
    margin-left: 200px !important;
  }
  @media (min-width: 1200px) {
    .container {
      max-width: 1400px;
    }
  }

</style>
