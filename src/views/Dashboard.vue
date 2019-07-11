<template>
  <div class="dashboard" ref="parentSidebar" id="parentx">
    <app-header/>

    <sidebar-toggle-button class="d-lg-none" v-on:toggle-sidebar="handleToggleSidebar"/>

    <!-- TODO: Add transition -->
    <sidebar-vuesax :class="sidebarState ? 'd-block' : 'd-none d-lg-block'"
                    :sidebar-state="sidebarState"
                    :hide-background="hideBackground"/>

    <div class="main container">
      <router-view/>
    </div>

    <app-footer/>

  </div>
</template>

<script>
  import AppHeader from '@/components/partial/AppHeader'
  import AppFooter from '@/components/partial/AppFooter'
  import SidebarVuesax from '../components/partial/sidebar/SidebarVuesax'
  import SidebarToggleButton from "../components/partial/sidebar/SidebarToggleButton";
  import {fetchTest} from "../assets/js/api/apiCalls";

  export default {
    components: {
      SidebarToggleButton,
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
    data() {
      return {
        sidebarState: true,
        buttonPressed: false,
        hideBackground: true
      }
    },

    beforeCreate() {
      this.$store.dispatch('INITIALISE_ACTIVE_OBJECTS');
    },

    created() {
      this.sidebarState = window.innerWidth >= 992
    },

    mounted() {
      window.addEventListener('resize', this.handleResize);
    },

    beforeDestroy() {
      window.removeEventListener('resize', this.handleResize);
    },

    methods: {
      handleResize(event) {
        if (this.buttonPressed) { // Sidebar is explicitly opened by user (using button)
          if (window.innerWidth >= 992) { // If screen is wider than 992px then sidebar is always shown!
            this.sidebarState = true
            this.hideBackground = true
          } else { // Else if button is pressed then sidebar state is true.
            this.sidebarState = true
            this.hideBackground = false
          }
        } else { // If user hasn't pressed button then sidebar state is changed according to screen size
          this.sidebarState = window.innerWidth >= 992;
          this.hideBackground = true
        }
      },

      handleToggleSidebar(data) {
        this.buttonPressed = !this.buttonPressed
        this.sidebarState = !this.sidebarState
        this.hideBackground = !this.hideBackground
      },
    }

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
