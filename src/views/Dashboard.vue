<template>
  <div class="dashboard">

    <app-header/>

    <div class="main container">
      <router-view/>
    </div>

    <app-footer/>

  </div>
</template>

<script>
  import AppHeader from '@/components/partial/AppHeader'
  import AppFooter from '@/components/partial/AppFooter'

  export default {
    components: {
      AppHeader,
      AppFooter
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

  @media (min-width: 1200px) {
    .container {
      max-width: 1400px;
    }
  }

</style>
