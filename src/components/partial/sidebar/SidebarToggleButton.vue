<template>
  <div class="sidebar-toggle-button">
    <div v-if="!buttonPressed" class="swipe-right-button" v-touch:swipe="handleSwipe" >tere</div>

    <div class="toggle-button" :class="{ 'button-close': buttonPressed }" @click="$emit('toggle-sidebar', buttonPressed)">
      <font-awesome-icon class="chevron" :class="{ 'chevron-close': buttonPressed }" :icon="chevron"/>
    </div>

    <div v-if="buttonPressed" class="background-close-button" @click="$emit('toggle-sidebar', buttonPressed)" v-touch:swipe="handleSwipe"></div>
  </div>
</template>

<script>
  import {library} from '@fortawesome/fontawesome-svg-core'
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
  import {faChevronRight, faChevronLeft} from '@fortawesome/free-solid-svg-icons'

  library.add(faChevronRight, faChevronLeft);

  export default {
    components: {
      FontAwesomeIcon
    },
    props: {
      sidebarState: {
        type: Boolean
      },
      buttonPressed: {
        type: Boolean
      }
    },
    name: "SidebarToggleButton",
    computed: {
      chevron() { return this.buttonPressed ? faChevronLeft : faChevronRight }
    },
    methods: {
      handleSwipe(direction) {
        if (!this.buttonPressed && direction === 'right') {
          this.$emit('toggle-sidebar', false)
        }

        if (this.buttonPressed && direction === 'left') {
          this.$emit('toggle-sidebar', true)
        }
      },
    }
  }
</script>

<style scoped>
  .swipe-right-button {
    height: 100%;
    width: 24px;
    position: fixed;
    z-index: 44000;
  }

  .toggle-button {
    height: 3em;
    width: 1.5em;
    border-bottom-right-radius: 3em;
    border-top-right-radius: 3em;

    z-index: 46000;
    background-color: #dee2e6;
    position: fixed;
    top: 50%;
    left: 0;
    box-shadow: 0 0 5px #dee2e6;
    opacity: 0.4;
  }

  .toggle-button:hover {
    cursor: pointer;
    opacity: 0.8;
  }

  .toggle-button:active {
    box-shadow: 0 0 5px #000;
  }

  .background-close-button {
    background: rgba(50,50,50,.2);
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 20001; /* Overwrites .vs-sidebar--bakcground, which has z-index of 20000  */
    -webkit-transition: all .3s ease;
    transition: all .3s ease;
    opacity: 1;
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
    left: 3px;
  }
</style>
