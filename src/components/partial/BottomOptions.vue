<template>
  <div class="bottom-options">

    <div class="row text-center">

      <div class="col-3 col-md-2 offset-md-2 col-lg-1 offset-lg-4 p-0" v-if="isNavigationShown">
        <div class="bottom-nav nav-button" v-if="!previousDisabled"
             v-on:click="$parent.$emit('button-clicked', 'PREVIOUS', object)">

          <div class="col-12"><font-awesome-icon icon="angle-double-left" size="lg"/></div>
          <div class="col-12 bottom-nav-text">{{ $t('buttons.previous') }}</div>
        </div>

        <div v-else class="bottom-nav-disabled">
          <div class="col-12"><font-awesome-icon icon="angle-double-left" size="lg"/></div>
          <div class="col-12 bottom-nav-text">{{ $t('buttons.previous') }}</div>
        </div>
      </div>

      <div :class="isNavigationShown ? 'col-3 col-md-2 col-lg-1 p-0' : 'col-6 col-md-3 offset-md-3 col-lg-2 offset-lg-4 p-0'">
        <div class="bottom-nav save-button"
             v-on:click="$parent.$emit('button-clicked', 'SAVE', object)">

          <div class="col-12"><font-awesome-icon icon="save" size="lg"/></div>
          <div class="col-12 bottom-nav-text">{{ $t('edit.buttons.save') }}</div>

        </div>
      </div>

      <div :class="isNavigationShown ? 'col-3 col-md-2 col-lg-1 p-0' : 'col-6 col-md-3 col-lg-2 p-0'"
           v-on:click="$route.meta.isEdit ? $parent.$emit('button-clicked', 'CANCEL', object) : $parent.$emit('button-clicked', 'CLEAR', object)">
        <div class="bottom-nav cancel-button">

          <div class="col-12"><font-awesome-icon icon="ban" size="lg"/></div>
          <div class="col-12 bottom-nav-text">{{ $route.meta.isEdit ? $t('buttons.cancel') : $t('buttons.clear') }}</div>

        </div>
      </div>

      <div
        class="col-3 col-md-2 col-lg-1 p-0" v-if="isNavigationShown">
        <div class="bottom-nav nav-button" v-if="!nextDisabled"
             v-on:click="$parent.$emit('button-clicked', 'NEXT', object)">

          <div class="col-12"><font-awesome-icon icon="angle-double-right" size="lg"/></div>
          <div class="col-12 bottom-nav-text">{{ $t('buttons.next') }}</div>
        </div>

        <div v-else class="bottom-nav-disabled">
          <div class="col-12"><font-awesome-icon icon="angle-double-right" size="lg"/></div>
          <div class="col-12 bottom-nav-text">{{ $t('buttons.next') }}</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import fontAwesomeLib from "../mixins/fontAwasomeLib";

  export default {
    name: "BottomOptions",
    props: {
      object: {
        type: String,
        default: 'attachment'
      },
      isNavigationShown: {
        type: Boolean,
        default: false
      },
    },
    mixins: [fontAwesomeLib],
    data() {
      return {
        nextDisabled : false,
        previousDisabled : false
      }
    },
    mounted(){
      this.$root.$on('disable-previous', this.disablePrevious);
      this.$root.$on('disable-next', this.disableNext);

      document.addEventListener('keyup', this.handleKeyup)
    },
    beforeDestroy() {
      document.removeEventListener('keyup', this.handleKeyup)
    },
    methods: {
      disableNext(data) {
        this.nextDisabled = data
      },
      disablePrevious(data) {
        this.previousDisabled = data
      },

      handleKeyup(event) {
        // ArrowRight
        if (event.keyCode === 39 || event.which === 39) {
          if (!this.nextDisabled) {
            this.$parent.$emit('button-clicked', 'NEXT', this.object)
          }
        }

        // ArrowLeft
        if (event.keyCode === 37 || event.which === 37) {
          if (!this.previousDisabled) {
            this.$parent.$emit('button-clicked', 'PREVIOUS', this.object)
          }
        }
      }
    }
  }
</script>

<!-- Styles are not scoped because now it is possible to add margin-bottom to footer easily -->
<style>
  .bottom-options {
    background-color: #f8f9fa!important;
    overflow: hidden;
    position: fixed;
    right: 0;
    bottom: 0;
    width: 100%;
    /*padding: 8px 16px;*/
    box-shadow: 0 4px 10px #000;
    z-index: 1000;
    height: 56px;
  }

  .bottom-nav {
    padding: 7px 0;
    color: rgba(102, 102, 102, 1);
  }

  .bottom-nav:hover {
    cursor: pointer;
    /*background-color: rgba(102, 102, 102, 1);*/
    color: #f8f9fa;
  }

  .bottom-nav-disabled {
    padding: 7px 0;
    color: rgba(102, 102, 102, 0.4);
    background-color: #e9ecef;
  }

  .bottom-nav-disabled:hover {
    cursor: not-allowed;
  }

  .bottom-nav-text {
    font-size: 12px;
  }

  .nav-button:hover {
    background-color: rgba(91, 192, 222, 1)
  }

  .save-button:hover {
    background-color: rgba(92, 184, 92, 1)
  }

  .cancel-button:hover {
    background-color: rgba(217, 83, 79, 1)
  }

  /* Adds margin-bottom to footer so that it won't get caught behind buttons */
  .footer {
    margin-bottom: 56px;
  }
</style>
