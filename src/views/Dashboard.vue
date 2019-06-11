<template>
  <div class="dashboard" ref="parentSidebar" id="parentx">
    <app-header/>

    <!-- TODO: Add transition -->
    <sidebar-vuesax class="d-none d-lg-block active"/>

    <div class="main container">
      <router-view/>
    </div>

    <app-footer/>

  </div>
</template>

<script>
  import AppHeader from '@/components/partial/AppHeader'
  import AppFooter from '@/components/partial/AppFooter'
  import SidebarVuesax from '../components/partial/SidebarVuesax'

  export default {
    components: {
      AppHeader,
      AppFooter,
      SidebarVuesax
    },
    name: "Dashboard",
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

  @media (min-width: 992px) {
    .dashboard {
      /* Sidebar width */
      margin-left: 260px;
    }
  }

  @media (max-width: 768px) {
    .main.container {
      width: 100%!important;
      margin-left: auto !important;
    }
  }

  @media (min-width: 1200px) {
    .container {
      max-width: 1400px;
    }
  }
</style>
