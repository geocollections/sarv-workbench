<template>
  <div class="bottom-options-new">

    <div class="d-flex justify-content-around align-items-center bottom-options-lg">


      <div class="bottom-item p-2 text-center bottom-nav"
           :class="{ 'bottom-item-disabled': previousDisabled }"
           @click="!previousDisabled ? $parent.$emit('button-clicked', 'PREVIOUS', object) : ''"
           v-if="isNavigationShown">
        <span class="bottom-nav-icon">
          <font-awesome-icon icon="angle-double-left" size="sm"/>
        </span>
        <span class="bottom-text"> {{ $t('buttons.previous') }}</span>
      </div>


      <div class="bottom-item p-2 text-center bottom-save"
           @click="$parent.$emit('button-clicked', 'SAVE_AND_LEAVE', object)">
        <div class="d-lg-inline-block bottom-icon">
          <font-awesome-icon icon="door-open" size="3x"/>
        </div>
        <div class="d-none d-sm-block d-lg-inline-block bottom-text bottom-text-lg">
          {{ $t('edit.buttons.save') }}
        </div>
      </div>


      <div class="bottom-item p-2 text-center bottom-save"
           @click="$parent.$emit('button-clicked', 'SAVE', object)">
        <div class="d-lg-inline-block bottom-icon">
          <font-awesome-icon icon="save" size="3x"/>
        </div>
        <div class="d-none d-sm-block d-lg-inline-block bottom-text bottom-text-lg">
          {{ $t('edit.buttons.save') }}
        </div>
      </div>


      <div class="bottom-item p-2 text-center bottom-cancel"
           @click="$route.meta.isEdit ? $parent.$emit('button-clicked', 'CANCEL', object) : $parent.$emit('button-clicked', 'CLEAR', object)">
        <div class="d-lg-inline-block bottom-icon">
          <font-awesome-icon icon="ban" size="3x"/>
        </div>
        <div class="d-none d-sm-block d-lg-inline-block bottom-text bottom-text-lg">
          {{ $route.meta.isEdit ? $t('buttons.cancel') : $t('buttons.clear') }}
        </div>
      </div>


      <div class="bottom-item p-2 text-center bottom-nav"
           :class="{ 'bottom-item-disabled': nextDisabled }"
           @click="!nextDisabled ? $parent.$emit('button-clicked', 'NEXT', object) : ''"
           v-if="isNavigationShown">
        <span class="bottom-text">{{ $t('buttons.next') }} </span>
        <span class="bottom-nav-icon">
          <font-awesome-icon icon="angle-double-right" size="sm"/>
        </span>
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

      // TODO: Fix when user is using inputs
      // document.addEventListener('keyup', this.handleKeyup)
    },
    beforeDestroy() {
      // document.removeEventListener('keyup', this.handleKeyup)
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
  .bottom-options-new {
    background-color: #343a40!important;
    color: #fff;
    overflow: hidden;
    position: fixed;
    right: 0;
    bottom: 0;
    width: 100%;
    box-shadow: 0 4px 10px #000;
    z-index: 1000;
    height: 56px;
  }

  @media (min-width: 992px) {
    .bottom-options-lg {
      /* Sidebar width */
      margin-left: 260px;
    }

    .d-lg-inline-block {
      display: inline-block !important;
    }

    .bottom-text-lg {
      vertical-align: 0.25rem;
      margin-left: 1rem;
      font-size: 15px !important;
    }

    .bottom-text {
      font-size: 15px !important;
    }
  }

  .bottom-options-new > div {
    height: 56px;
  }

  .bottom-item:hover {
    cursor: pointer;
  }

  .bottom-item-disabled {
    color: rgba(255, 255, 255, 0.5);
  }

  .bottom-item-disabled:hover {
    cursor: not-allowed;
    color: rgba(255, 255, 255, 0.5) !important;
  }

  .bottom-icon {
    font-size: 0.5rem;
  }

  .bottom-text {
    font-size: 12px;
    margin-top: -0.1rem;
  }

  .bottom-nav:hover {
    color: #007bff;
  }

  .bottom-nav:hover > .bottom-nav-icon {
    opacity: 1;
    transition: opacity 0.5s;
  }

  .bottom-nav > .bottom-nav-icon {
    opacity: 0;
    transition: opacity 0.5s;
  }

  .bottom-save:hover {
    color: #28a745;
  }

  .bottom-cancel:hover {
    color: #dc3545;
  }

  /* Adds margin-bottom to footer so that it won't get caught behind buttons */
  .footer {
    margin-bottom: 56px;
  }
</style>
