<template>
  <div class="dashboard" :class="{ 'thumbstack-active': thumbstackState, 'thumbstack-inactive': !thumbstackState }" ref="parentSidebar" id="parentx">
    <app-header/>

    <sidebar-toggle-button class="d-xl-none d-print-none"
                           :class="{ 'd-sm-block d-md-none': thumbstackState}"
                           :button-pressed="buttonPressed"
                           v-on:toggle-sidebar="handleToggleSidebar"/>

    <!-- TODO: Add transition -->
    <sidebar-vuesax :class="sidebarState ? 'd-block' : 'd-none d-xl-block'"
                    class="d-print-none"
                    :sidebar-state="sidebarState"
                    :hide-background="hideBackground"
                    :thumbstack-state="thumbstackState"
                    v-on:thumbstack-button-clicked="handleThumbstackButtonClick"/>

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
        hideBackground: true,
        thumbstackState: false,
      }
    },

    beforeCreate() {
      this.$store.dispatch('INITIALISE_ACTIVE_OBJECTS');
    },

    created() {
      this.sidebarState = window.innerWidth >= 1200
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
          if (window.innerWidth >= 1200) { // If screen is wider than 992px then sidebar is always shown!
            this.sidebarState = true;
            this.hideBackground = true
          } else if (window.innerWidth >= 768 && window.innerWidth < 1200 && this.thumbstackState) {
            this.sidebarState = true;
            this.hideBackground = true;
          } else { // Else if button is pressed then sidebar state is true.
            this.sidebarState = true;
            this.hideBackground = false
          }
        } else { // If user hasn't pressed button then sidebar state is changed according to screen size
          if (window.innerWidth >= 768 && window.innerWidth < 1200 && this.thumbstackState) this.sidebarState = true;
          else this.sidebarState = window.innerWidth >= 1200;
          this.hideBackground = true
        }
      },

      handleToggleSidebar(buttonState) {
        this.buttonPressed = !buttonState;
        this.sidebarState = !this.sidebarState;
        this.hideBackground = !this.hideBackground
      },

      handleThumbstackButtonClick() {
        this.thumbstackState = !this.thumbstackState;
        this.buttonPressed = true;
        this.sidebarState = true;
        this.hideBackground = this.thumbstackState
      }
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

  /* Small screens */
  @media (max-width: 768px) {
    .main.container {
      width: 100%!important;
      margin-left: auto !important;
    }
  }

  /* Medium and large screens */
  @media (min-width: 768px) and (max-width: 1199.98px) {
    .thumbstack-active {
      margin-left: 260px;
    }

    .thumbstack-active >>> .bottom-options-lg {
      margin-left: 260px !important;
    }

    .thumbstack-inactive >>> .bottom-options-lg {
      margin-left: unset;
    }
  }

  /* Extra large screens */
  @media (min-width: 1200px) {
    .container {
      max-width: 1400px;
    }

    .dashboard {
      /* Sidebar width */
      margin-left: 260px;
    }
  }
</style>
