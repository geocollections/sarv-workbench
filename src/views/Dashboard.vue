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

    created() {
      this.$root.$on('show-sidebar',this.setSitebarPosition)
    },
    methods: {
      setSitebarPosition(state) {
        this.sidebarOpen = state;

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
  @media (max-width: 768px) {
    .main.container {
      width: 100%!important;
      margin-left: auto !important;
    }
  }
  @media (min-width: 768px) {
    .main.container.sidebarOpen {
      width: calc(100% - 300px)!important;
      margin-left: 300px !important;
    }
  }

  @media (min-width: 1200px) {
    .container {
      max-width: 1400px;
    }
  }

</style>
