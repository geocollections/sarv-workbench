<template>
  <div class="sidebar-toggle-button">
    <div class="toggle-button" :class="active ? 'active' : 'inactive'" @click="toggleSidebar">
      <font-awesome-icon class="chevron" :class="active ? 'chevron-close' : 'chevron-open'" :icon="chevron"/>
    </div>
  </div>
</template>

<script>
  import {library} from '@fortawesome/fontawesome-svg-core'
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
  import {faChevronRight, faChevronLeft} from '@fortawesome/free-solid-svg-icons'

  library.add(faChevronRight, faChevronLeft)

  export default {
    components: {
      FontAwesomeIcon
    },
    props: ['sidebarState'],
    name: "SidebarToggleButton",
    data() {
      return {
        active: false
      }
    },

    computed: {
      chevron() { return this.active ? faChevronLeft : faChevronRight }
    },

    methods: {
      toggleSidebar() {
      //  Todo: Emit toggle
        this.active = !this.active
        this.$emit('toggle-sidebar', this.active)
      }
    }
  }
</script>

<style scoped>
  .toggle-button {
    height: 3em;
    width: 1.5em;
    border-bottom-right-radius: 3em;
    border-top-right-radius: 3em;

    z-index: 45000;
    background-color: #dee2e6;
    position: fixed;
    top: 50%;
  }

  .active {
    left: 260px;
  }

  .inactive {
    left: 0;
  }

  .toggle-button:hover {
    cursor: pointer;
    opacity: 0.6;
  }

  .chevron {
    position: absolute;
    top: 50%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    left: 5px;
    color: black;
    font-size: larger;
  }

  .chevron-close {
    left: 4px;
  }
</style>
